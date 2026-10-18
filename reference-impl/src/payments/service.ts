// Payment orchestration for the MPM ("user scans merchant's national QR") flow.
//
//   MPP (e.g. a Japanese wallet)            Network (this service)              Local settlement partner
//   ─────────────────────────────           ──────────────────────              ────────────────────────
//   decode(qr) ───────────────────────────▶ parse EMVCo, identify scheme, route
//   quote(decodeId, amount) ──────────────▶ firm FX quote (JPY→USDC→local)
//   [user confirms, MPP debits wallet]
//   pay(paymentRequestId, quoteId) ───────▶ screen → credit() ────────────────▶ push credit on national rail
//                                   ◀────── SUCCEEDED / FAILED / PROCESSING ◀── rail result (or timeout)
//   notify(...) ◀────────────────────────── final status for PROCESSING payments
//   refund ◀──────────────────────────────── originated by the partner (merchant refund) ◀──
//   settlement cycle: net per participant, pay partners, collect from MPPs
//
// Invariants:
//  * pay() is idempotent on (mppId, paymentRequestId), including concurrent retries: the
//    request and its quote are reserved synchronously before any await.
//  * a successful cancel() and a successful payment are mutually exclusive.
//  * a payment whose rail result is UNKNOWN stays PROCESSING; the MPP must keep the
//    user's funds on hold until a final status arrives (never auto-release).
//  * ledger journals are posted only on SUCCEEDED, so failed payments never enter netting.
//  * a code is never priced in a currency its scheme does not carry, and never paid after
//    the code's own expiry.

import { currencyByNumeric, toMinorUnits } from '../emvco/iso4217.ts';
import { decodeMpm, type MpmPayload, promptedFields } from '../emvco/mpm.ts';
import { type Quote, type QuotePolicy, type RateSource, priceLocalAmount } from '../fx/quote.ts';
import type { Ledger } from '../ledger/ledger.ts';
import { routeKeys, type SchemeRegistry } from '../schemes/registry.ts';
import { QUASI_CASH_MCC, type SchemeMatch } from '../schemes/types.ts';
import type { MppNotifier, Screening, SettlementPartner } from '../adapters/types.ts';

export type PaymentStatus = 'PROCESSING' | 'SUCCEEDED' | 'FAILED';

export class PaymentError extends Error {
  readonly code: string;
  constructor(code: string, message: string) {
    super(message);
    this.name = 'PaymentError';
    this.code = code;
  }
}

export interface ConvenienceFee {
  mode: 'fixed' | 'percentage';
  fixedMinor?: bigint;
  /** Percentage of the transaction amount, e.g. "3.00". */
  percentage?: string;
}

export interface DecodeResult {
  decodeId: string;
  expiresAt: number;
  scheme: Pick<SchemeMatch, 'schemeId' | 'name' | 'country' | 'rail' | 'paymentType'>;
  merchant: { name?: string; city?: string; mcc?: string; localName?: string };
  currency: string;
  /** Present for dynamic QR (amount fixed by the merchant). */
  amountMinor?: bigint;
  amountEditable: boolean;
  /** Smallest amount step the rail accepts, in minor units (e.g. 100 for whole rupiah). */
  amountStepMinor: bigint;
  maxAmountMinor?: bigint;
  tipPrompt: boolean;
  /** Merchant convenience fee from EMVCo ID 55=02/03; added on top of the amount. */
  convenienceFee?: ConvenienceFee;
  /** Additional-data IDs marked "***" that the wallet must collect from the user. */
  prompts: string[];
  warnings: string[];
}

export interface MerchantComponents {
  baseMinor: bigint;
  tipMinor: bigint;
  feeMinor: bigint;
}

export type PricedQuote = Quote & { merchantComponents: MerchantComponents };

interface DecodeSession {
  mppId: string;
  payload: MpmPayload;
  match: SchemeMatch;
  partner: SettlementPartner;
  result: DecodeResult;
  qrExpiresAt?: number;
}

interface QuoteSession {
  decodeId: string;
  quote: PricedQuote;
  used: boolean;
}

export interface Payment {
  paymentId: string;
  paymentRequestId: string;
  mppId: string;
  partnerId: string;
  status: PaymentStatus;
  quote: PricedQuote;
  scheme: SchemeMatch;
  railRef?: string;
  failureReason?: string;
  createdAt: number;
  updatedAt: number;
  refundedMinor: bigint;
  /** Refund amounts reserved by in-flight refund requests. */
  pendingRefundMinor: bigint;
  settlementCycle?: string;
}

export interface RefundResult {
  refundId: string;
  refundRequestId: string;
  amountMinor: bigint;
  payerRefundMinor: bigint;
}

export interface ServiceDeps {
  registry: SchemeRegistry;
  partners: SettlementPartner[];
  rates: RateSource;
  policy: QuotePolicy;
  ledger: Ledger;
  screening: Screening;
  notifier: MppNotifier;
  /** Wallet currency per MPP id, e.g. { PAYPAY: 'JPY' }. */
  mppCurrency: Record<string, string>;
  settlementAsset: string;
  /** MCCs refused on the purchase route (defaults to money-transfer / cash / quasi-cash). */
  blockedMcc?: ReadonlySet<string>;
  clock?: () => number;
  decodeTtlMs?: number;
  /** Safety margin between quote expiry and the QR code's own expiry. */
  qrExpiryMarginMs?: number;
}

const REQUEST_ID = /^[\x21-\x7e]{1,64}$/;

export class PaymentService {
  private readonly d: ServiceDeps;
  private readonly now: () => number;
  private readonly decodes = new Map<string, DecodeSession>();
  private readonly quotes = new Map<string, QuoteSession>();
  private readonly payments = new Map<string, Payment>();
  private readonly byRequest = new Map<string, string>();
  private readonly inflight = new Map<string, { quoteId: string; promise: Promise<Payment> }>();
  private readonly cancelled = new Set<string>();
  private readonly refunds = new Map<string, Promise<RefundResult>>();
  private readonly partnerByKey = new Map<string, SettlementPartner>();
  private n = 0;

  constructor(deps: ServiceDeps) {
    this.d = deps;
    this.now = deps.clock ?? (() => Date.now());
    for (const p of deps.partners) for (const k of p.routingKeys) this.partnerByKey.set(k, p);
  }

  private id(prefix: string): string {
    return `${prefix}${this.now().toString(36).toUpperCase()}${(++this.n).toString(36).toUpperCase().padStart(5, '0')}`;
  }

  decode(mppId: string, qr: string): DecodeResult {
    if (!this.d.mppCurrency[mppId]) throw new PaymentError('UNKNOWN_MPP', `MPP ${mppId} is not onboarded`);
    let payload: MpmPayload;
    try {
      payload = decodeMpm(qr);
    } catch (e) {
      throw new PaymentError('INVALID_QR', (e as Error).message);
    }
    if (payload.errors.length) throw new PaymentError('INVALID_QR', payload.errors.join('; '));
    const matches = this.d.registry.identify(payload);
    if (!matches.length) throw new PaymentError('UNSUPPORTED_QR', 'no supported national scheme template found in QR');
    const payable = matches.filter(m => !m.declineReason);
    if (!payable.length) throw new PaymentError('INVALID_QR', matches.map(m => `${m.schemeId}: ${m.declineReason}`).join('; '));

    // Merchant routes first; a personal (P2P) template on the same sticker never hides one.
    let match: SchemeMatch | undefined;
    let partner: SettlementPartner | undefined;
    for (const m of payable) {
      if (m.paymentType === 'P2P' || m.confidence < 0.5) continue;
      const key = routeKeys(m).find(k => this.partnerByKey.has(k));
      if (key) {
        match = m;
        partner = this.partnerByKey.get(key);
        break;
      }
    }
    if (!match || !partner) {
      if (payable.every(m => m.paymentType === 'P2P')) {
        throw new PaymentError('P2P_NOT_SUPPORTED', 'person-to-person QR codes are not accepted for cross-border merchant payments');
      }
      throw new PaymentError('NO_ROUTE', `recognised ${payable.map(m => m.schemeId).join(', ')} but no settlement partner is connected`);
    }
    if (match.qrExpiresAt !== undefined && match.qrExpiresAt <= this.now() + this.margin()) {
      throw new PaymentError('QR_EXPIRED', 'the QR code has expired: ask the merchant for a new one');
    }
    const blocked = this.d.blockedMcc ?? QUASI_CASH_MCC;
    if (payload.mcc && blocked.has(payload.mcc)) {
      throw new PaymentError('MCC_NOT_SUPPORTED', `MCC ${payload.mcc} (money transfer / cash / quasi-cash) is not accepted`);
    }

    const local = currencyByNumeric(payload.currencyNumeric!);
    if (!local) throw new PaymentError('INVALID_QR', `currency ${payload.currencyNumeric} is not supported`);
    const step = amountStep(match, local.alpha, local.minor);
    const maxAmountMinor = match.maxAmountMinor?.[local.alpha];
    let amountMinor: bigint | undefined;
    if (payload.amount) {
      amountMinor = this.parseAmount(payload.amount, local.minor, 'INVALID_QR');
      if (amountMinor <= 0n) throw new PaymentError('INVALID_QR', 'QR amount must be positive');
      if (amountMinor % step !== 0n) throw new PaymentError('INVALID_QR', `QR amount has more decimals than the ${match.rail} rail accepts`);
      if (maxAmountMinor !== undefined && amountMinor > maxAmountMinor) throw new PaymentError('AMOUNT_LIMIT', `amount exceeds the ${match.rail} per-transaction limit`);
    }
    let convenienceFee: ConvenienceFee | undefined;
    if (payload.tip?.mode === 'fixed') convenienceFee = { mode: 'fixed', fixedMinor: this.parseAmount(payload.tip.fixed!, local.minor, 'INVALID_QR') };
    if (payload.tip?.mode === 'percentage') convenienceFee = { mode: 'percentage', percentage: payload.tip.percentage };

    const decodeId = this.id('D');
    const qrExpiresAt = match.qrExpiresAt;
    let expiresAt = this.now() + (this.d.decodeTtlMs ?? 10 * 60_000);
    if (qrExpiresAt !== undefined) expiresAt = Math.min(expiresAt, qrExpiresAt - this.margin());
    const result: DecodeResult = {
      decodeId,
      expiresAt,
      scheme: { schemeId: match.schemeId, name: match.name, country: match.country, rail: match.rail, paymentType: match.paymentType },
      merchant: { name: payload.merchantName, city: payload.merchantCity, mcc: payload.mcc, localName: payload.language?.name },
      currency: local.alpha,
      amountMinor,
      amountEditable: amountMinor === undefined,
      amountStepMinor: step,
      maxAmountMinor,
      tipPrompt: payload.tip?.mode === 'prompt',
      convenienceFee,
      prompts: promptedFields(payload),
      warnings: [...payload.warnings, ...match.notes],
    };
    this.decodes.set(decodeId, { mppId, payload, match, partner, result, qrExpiresAt });
    return result;
  }

  quote(mppId: string, decodeId: string, input: { amountMinor?: bigint; tipMinor?: bigint } = {}): PricedQuote {
    const s = this.decodes.get(decodeId);
    if (!s || s.mppId !== mppId) throw new PaymentError('DECODE_NOT_FOUND', 'unknown decodeId');
    if (s.result.expiresAt <= this.now()) throw new PaymentError(s.qrExpiresAt !== undefined && s.qrExpiresAt - this.margin() <= this.now() ? 'QR_EXPIRED' : 'DECODE_EXPIRED', 'scan the QR code again');
    const r = s.result;
    let base = r.amountMinor;
    if (base === undefined) {
      if (input.amountMinor === undefined || input.amountMinor <= 0n) throw new PaymentError('AMOUNT_REQUIRED', 'static QR: the user must enter the amount');
      if (input.amountMinor % r.amountStepMinor !== 0n) throw new PaymentError('AMOUNT_PRECISION', `amount must be a multiple of ${r.amountStepMinor} minor units`);
      base = input.amountMinor;
    } else if (input.amountMinor !== undefined && input.amountMinor !== base) {
      throw new PaymentError('AMOUNT_MISMATCH', 'dynamic QR amount cannot be changed');
    }
    const tip = input.tipMinor ?? 0n;
    if (tip < 0n || (tip > 0n && !r.tipPrompt)) throw new PaymentError('TIP_NOT_ALLOWED', 'QR does not prompt for a tip');
    if (tip % r.amountStepMinor !== 0n) throw new PaymentError('AMOUNT_PRECISION', `tip must be a multiple of ${r.amountStepMinor} minor units`);
    let fee = 0n;
    if (r.convenienceFee?.mode === 'fixed') fee = r.convenienceFee.fixedMinor!;
    if (r.convenienceFee?.mode === 'percentage') fee = percentageFee(base, r.convenienceFee.percentage!, r.amountStepMinor);
    const total = base + tip + fee;
    if (r.maxAmountMinor !== undefined && total > r.maxAmountMinor) throw new PaymentError('AMOUNT_LIMIT', `amount exceeds the ${r.scheme.rail} per-transaction limit`);

    const q = priceLocalAmount(
      { payerCurrency: this.d.mppCurrency[s.mppId]!, localCurrency: r.currency, localAmountMinor: total, settlementAsset: this.d.settlementAsset, now: this.now() },
      this.d.rates,
      this.d.policy,
    );
    const quote: PricedQuote = {
      ...q,
      // The quote can never outlive the code's own validity.
      expiresAt: s.qrExpiresAt !== undefined ? Math.min(q.expiresAt, s.qrExpiresAt - this.margin()) : q.expiresAt,
      merchantComponents: { baseMinor: base, tipMinor: tip, feeMinor: fee },
    };
    this.quotes.set(quote.quoteId, { decodeId, quote, used: false });
    return quote;
  }

  /**
   * Synchronous part: validation, idempotency and reservation – nothing here awaits, so
   * concurrent retries of one paymentRequestId share a single execution.
   */
  pay(input: { mppId: string; paymentRequestId: string; quoteId: string; payerRef: string }): Promise<Payment> {
    try {
      if (!REQUEST_ID.test(input.paymentRequestId ?? '')) throw new PaymentError('BAD_REQUEST', 'paymentRequestId must be 1..64 printable ASCII characters');
      const reqKey = `${input.mppId}|${input.paymentRequestId}`;
      if (this.cancelled.has(reqKey)) throw new PaymentError('PAYMENT_CANCELLED', 'paymentRequestId was cancelled by the MPP');
      const existingId = this.byRequest.get(reqKey);
      if (existingId) {
        const existing = this.payments.get(existingId)!;
        if (existing.quote.quoteId !== input.quoteId) throw new PaymentError('IDEMPOTENCY_CONFLICT', 'paymentRequestId already used with a different quote');
        return Promise.resolve(existing);
      }
      const running = this.inflight.get(reqKey);
      if (running) {
        if (running.quoteId !== input.quoteId) throw new PaymentError('IDEMPOTENCY_CONFLICT', 'paymentRequestId already used with a different quote');
        return running.promise;
      }

      const qs = this.quotes.get(input.quoteId);
      if (!qs) throw new PaymentError('QUOTE_NOT_FOUND', 'unknown quote');
      const s = this.decodes.get(qs.decodeId)!;
      if (s.mppId !== input.mppId) throw new PaymentError('QUOTE_NOT_FOUND', 'quote belongs to another MPP');
      if (qs.used) throw new PaymentError('QUOTE_USED', 'quote already consumed by another payment request');
      if (qs.quote.expiresAt <= this.now()) throw new PaymentError('QUOTE_EXPIRED', 'request a new quote');

      qs.used = true;
      const promise = this.execute(input, reqKey, qs, s).finally(() => this.inflight.delete(reqKey));
      this.inflight.set(reqKey, { quoteId: input.quoteId, promise });
      return promise;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  private async execute(input: { mppId: string; paymentRequestId: string; payerRef: string }, reqKey: string, qs: QuoteSession, s: DecodeSession): Promise<Payment> {
    let decision;
    try {
      decision = await this.d.screening.screen({
        payerRef: input.payerRef,
        mppId: input.mppId,
        scheme: s.match,
        merchantName: s.payload.merchantName,
        amountMinor: qs.quote.merchant.amountMinor,
        currency: qs.quote.merchant.currency,
      });
    } catch (e) {
      qs.used = false;
      throw e;
    }
    if (!decision.allow) {
      qs.used = false; // the user may retry with the same quote once the case is cleared
      throw new PaymentError(decision.review ? 'RISK_REVIEW' : 'RISK_REJECTED', decision.reason);
    }
    if (s.qrExpiresAt !== undefined && s.qrExpiresAt <= this.now()) throw new PaymentError('QR_EXPIRED', 'the QR code expired before payment');

    const p: Payment = {
      paymentId: this.id('P'),
      paymentRequestId: input.paymentRequestId,
      mppId: input.mppId,
      partnerId: s.partner.id,
      status: 'PROCESSING',
      quote: qs.quote,
      scheme: s.match,
      createdAt: this.now(),
      updatedAt: this.now(),
      refundedMinor: 0n,
      pendingRefundMinor: 0n,
    };
    this.payments.set(p.paymentId, p);
    this.byRequest.set(reqKey, p.paymentId);

    let r;
    try {
      r = await s.partner.credit({
        paymentId: p.paymentId,
        scheme: s.match,
        currency: qs.quote.merchant.currency,
        amountMinor: qs.quote.merchant.amountMinor,
        merchantName: s.payload.merchantName,
        merchantCity: s.payload.merchantCity,
        reference: p.paymentId,
        qrPayload: s.payload.raw,
      });
    } catch {
      r = { status: 'UNKNOWN' as const };
    }
    this.apply(p, r.status, r.railRef, r.reason);
    return p;
  }

  /** Re-queries partners for PROCESSING payments (run on a timer / after a timeout). */
  async resolvePending(): Promise<Payment[]> {
    const changed: Payment[] = [];
    for (const p of this.payments.values()) {
      if (p.status !== 'PROCESSING') continue;
      const partner = this.d.partners.find(x => x.id === p.partnerId)!;
      const r = await partner.inquire(p.paymentId);
      if (r.status === 'UNKNOWN' || p.status !== 'PROCESSING') continue;
      this.apply(p, r.status, r.railRef, r.reason);
      await this.d.notifier.notify(p.mppId, { paymentRequestId: p.paymentRequestId, paymentId: p.paymentId, status: p.status, at: this.now() });
      changed.push(p);
    }
    return changed;
  }

  private apply(p: Payment, status: 'SUCCESS' | 'FAILED' | 'UNKNOWN', railRef?: string, reason?: string): void {
    p.updatedAt = this.now();
    if (status === 'UNKNOWN') return;
    if (status === 'FAILED') {
      p.status = 'FAILED';
      p.failureReason = reason;
      return;
    }
    p.status = 'SUCCEEDED';
    p.railRef = railRef;
    this.postSuccess(p);
  }

  private postSuccess(p: Payment): void {
    const q = p.quote;
    const asset = q.settlementAsset;
    const b = q.breakdown;
    const payerCcy = q.payer.currency;
    const fx = `fx:${asset}/${payerCcy}:position`;
    const assetUnits = toMinorUnits(q.settlementAmount, 6);
    this.d.ledger.post({
      id: `${p.paymentId}:capture`,
      ref: p.paymentId,
      memo: `${p.scheme.schemeId} ${q.merchant.currency} ${q.merchant.amountMinor}`,
      at: this.now(),
      postings: [
        { account: `mpp:${p.mppId}:due`, asset: payerCcy, amount: q.payer.amountMinor },
        { account: fx, asset: payerCcy, amount: -b.principalMinor },
        { account: 'revenue:fx-margin', asset: payerCcy, amount: -b.fxMarginMinor },
        { account: 'revenue:network-fee', asset: payerCcy, amount: -b.networkFeeMinor },
        { account: 'revenue:fixed-fee', asset: payerCcy, amount: -b.fixedFeeMinor },
        { account: fx, asset, amount: assetUnits },
        { account: `acqp:${p.partnerId}:owed`, asset, amount: -assetUnits },
      ],
    });
  }

  /**
   * Merchant refund, originated by the local settlement partner that credited the
   * merchant (national instant-payment rails have no refund message; see docs/03 §3.4).
   * Idempotent on (paymentId, refundRequestId). The wallet user gets back the same share
   * of the principal they paid (original rate); fees are not refunded. Shares are computed
   * cumulatively so partial refunds add up exactly to a full refund.
   */
  refund(input: { partnerId: string; paymentId: string; amountMinor: bigint; refundRequestId: string }): Promise<RefundResult> {
    try {
      if (!REQUEST_ID.test(input.refundRequestId ?? '')) throw new PaymentError('BAD_REQUEST', 'refundRequestId must be 1..64 printable ASCII characters');
      // Ownership first: another partner replaying a known key must not see the refund.
      const p = this.payments.get(input.paymentId);
      if (!p || p.partnerId !== input.partnerId) throw new PaymentError('NOT_FOUND', 'payment not found');
      const key = `${input.paymentId}|${input.refundRequestId}`;
      const prior = this.refunds.get(key);
      if (prior) return prior;
      if (p.status !== 'SUCCEEDED') throw new PaymentError('NOT_REFUNDABLE', 'payment has not succeeded');
      const total = p.quote.merchant.amountMinor;
      if (input.amountMinor <= 0n || p.refundedMinor + p.pendingRefundMinor + input.amountMinor > total) throw new PaymentError('REFUND_EXCEEDS', 'refund exceeds captured amount');
      p.pendingRefundMinor += input.amountMinor; // reserve before any await
      const promise = this.executeRefund(p, input.amountMinor, input.refundRequestId).catch(e => {
        this.refunds.delete(key);
        throw e;
      });
      this.refunds.set(key, promise);
      return promise;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  private async executeRefund(p: Payment, amountMinor: bigint, refundRequestId: string): Promise<RefundResult> {
    const partner = this.d.partners.find(x => x.id === p.partnerId)!;
    let r;
    try {
      if (!partner.refund) throw new PaymentError('REFUND_UNSUPPORTED', 'partner cannot originate refunds');
      r = await partner.refund(p.paymentId, amountMinor);
    } finally {
      p.pendingRefundMinor -= amountMinor;
    }
    if (r.status !== 'SUCCESS') throw new PaymentError('REFUND_FAILED', r.reason ?? 'partner refund failed');

    const q = p.quote;
    const total = q.merchant.amountMinor;
    const prev = p.refundedMinor;
    const next = prev + amountMinor;
    const share = (v: bigint, x: bigint) => (v * x) / total;
    const principal = q.breakdown.principalMinor;
    const units = toMinorUnits(q.settlementAmount, 6);
    const payerRefundMinor = share(principal, next) - share(principal, prev);
    const assetUnits = share(units, next) - share(units, prev);
    const fx = `fx:${q.settlementAsset}/${q.payer.currency}:position`;
    const refundId = `${p.paymentId}:refund:${refundRequestId}`;
    this.d.ledger.post({
      id: refundId,
      ref: p.paymentId,
      memo: `refund ${q.merchant.currency} ${amountMinor}`,
      at: this.now(),
      postings: [
        { account: `mpp:${p.mppId}:due`, asset: q.payer.currency, amount: -payerRefundMinor },
        { account: fx, asset: q.payer.currency, amount: payerRefundMinor },
        { account: fx, asset: q.settlementAsset, amount: -assetUnits },
        { account: `acqp:${p.partnerId}:owed`, asset: q.settlementAsset, amount: assetUnits },
      ],
    });
    p.refundedMinor = next;
    p.updatedAt = this.now();
    await this.d.notifier.notify(p.mppId, { paymentRequestId: p.paymentRequestId, paymentId: p.paymentId, status: `REFUNDED:${payerRefundMinor}`, at: this.now() });
    return { refundId, refundRequestId, amountMinor, payerRefundMinor };
  }

  /**
   * MPP-side cancel (e.g. the wallet timed out waiting for pay()). Succeeds only when
   * nothing can reach the local rail: an unknown request is tombstoned so a late pay()
   * with the same paymentRequestId is refused; a FAILED payment is already final.
   * In-flight, PROCESSING and SUCCEEDED requests cannot be cancelled.
   */
  cancel(mppId: string, paymentRequestId: string): { cancelled: boolean; status?: PaymentStatus } {
    const reqKey = `${mppId}|${paymentRequestId}`;
    if (this.inflight.has(reqKey)) throw new PaymentError('CANCEL_NOT_ALLOWED_PROCESSING', 'payment is in flight: wait for the final status');
    const id = this.byRequest.get(reqKey);
    if (!id) {
      this.cancelled.add(reqKey);
      return { cancelled: true };
    }
    const p = this.payments.get(id)!;
    if (p.status === 'FAILED') return { cancelled: true, status: p.status };
    throw new PaymentError(
      p.status === 'SUCCEEDED' ? 'CANCEL_NOT_ALLOWED_REFUND' : 'CANCEL_NOT_ALLOWED_PROCESSING',
      p.status === 'SUCCEEDED' ? 'payment already credited to the merchant: request a refund' : 'payment is in flight: wait for the final status',
    );
  }

  /** Payment visible to its own MPP (or to the operator when mppId is omitted). */
  get(paymentId: string, mppId?: string): Payment | undefined {
    const p = this.payments.get(paymentId);
    return p && (mppId === undefined || p.mppId === mppId) ? p : undefined;
  }

  list(): Payment[] {
    return [...this.payments.values()];
  }

  private margin(): number {
    return this.d.qrExpiryMarginMs ?? 5_000;
  }

  private parseAmount(v: string, minor: number, code: string): bigint {
    try {
      return toMinorUnits(v, minor);
    } catch (e) {
      throw new PaymentError(code, (e as Error).message);
    }
  }
}

function amountStep(m: SchemeMatch, ccy: string, minor: number): bigint {
  const decimals = m.amountDecimals?.[ccy];
  return decimals === undefined || decimals >= minor ? 1n : 10n ** BigInt(minor - decimals);
}

/** ceil(base × pct / 100), rounded up to the rail's amount step. */
function percentageFee(base: bigint, pct: string, step: bigint): bigint {
  const [i, f = ''] = pct.split('.');
  const hundredths = BigInt(i! + f.padEnd(2, '0').slice(0, 2)); // "3.5" → 350
  const raw = (base * hundredths + 9_999n) / 10_000n;
  return ((raw + step - 1n) / step) * step;
}

