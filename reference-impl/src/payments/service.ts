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
//   settlement cycle: net per participant, pay partners in stablecoin, collect from MPPs
//
// Invariants:
//  * pay() is idempotent on (mppId, paymentRequestId).
//  * a payment whose rail result is UNKNOWN stays PROCESSING; the MPP must keep the
//    user's funds on hold until a final status arrives (never auto-release).
//  * ledger journals are posted only on SUCCEEDED, so failed payments never enter netting.

import { currencyByAlpha, currencyByNumeric, toMinorUnits } from '../emvco/iso4217.ts';
import { decodeMpm, type MpmPayload, promptedFields } from '../emvco/mpm.ts';
import { type Quote, type QuotePolicy, type RateSource, priceLocalAmount } from '../fx/quote.ts';
import type { Ledger } from '../ledger/ledger.ts';
import { routeKeys, type SchemeRegistry } from '../schemes/registry.ts';
import type { SchemeMatch } from '../schemes/types.ts';
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

export interface DecodeResult {
  decodeId: string;
  expiresAt: number;
  scheme: Pick<SchemeMatch, 'schemeId' | 'name' | 'country' | 'rail' | 'paymentType'>;
  merchant: { name?: string; city?: string; mcc?: string; localName?: string };
  currency: string;
  /** Present for dynamic QR (amount fixed by the merchant). */
  amountMinor?: bigint;
  amountEditable: boolean;
  tipPrompt: boolean;
  /** Additional-data IDs marked "***" that the wallet must collect from the user. */
  prompts: string[];
  warnings: string[];
}

interface DecodeSession {
  mppId: string;
  payload: MpmPayload;
  match: SchemeMatch;
  partner: SettlementPartner;
  result: DecodeResult;
}

interface QuoteSession {
  decodeId: string;
  quote: Quote;
  tipMinor: bigint;
  used: boolean;
}

export interface Payment {
  paymentId: string;
  paymentRequestId: string;
  mppId: string;
  partnerId: string;
  status: PaymentStatus;
  quote: Quote;
  scheme: SchemeMatch;
  railRef?: string;
  failureReason?: string;
  createdAt: number;
  updatedAt: number;
  refundedMinor: bigint;
  settlementCycle?: string;
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
  clock?: () => number;
  decodeTtlMs?: number;
}

export class PaymentService {
  private readonly d: ServiceDeps;
  private readonly now: () => number;
  private readonly decodes = new Map<string, DecodeSession>();
  private readonly quotes = new Map<string, QuoteSession>();
  private readonly payments = new Map<string, Payment>();
  private readonly byRequest = new Map<string, string>();
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
    let match: SchemeMatch | undefined;
    let partner: SettlementPartner | undefined;
    for (const m of matches) {
      if (m.confidence < 0.5) continue;
      const key = routeKeys(m).find(k => this.partnerByKey.has(k));
      if (key) {
        match = m;
        partner = this.partnerByKey.get(key);
        break;
      }
    }
    if (!match || !partner) throw new PaymentError('NO_ROUTE', `recognised ${matches.map(m => m.schemeId).join(', ')} but no settlement partner is connected`);
    if (match.paymentType === 'P2P') throw new PaymentError('P2P_NOT_SUPPORTED', 'person-to-person QR codes are not accepted for cross-border merchant payments');

    const local = currencyByNumeric(payload.currencyNumeric!)!;
    const amountMinor = payload.amount ? toMinorUnits(payload.amount, local.minor) : undefined;
    const decodeId = this.id('D');
    const result: DecodeResult = {
      decodeId,
      expiresAt: this.now() + (this.d.decodeTtlMs ?? 10 * 60_000),
      scheme: { schemeId: match.schemeId, name: match.name, country: match.country, rail: match.rail, paymentType: match.paymentType },
      merchant: { name: payload.merchantName, city: payload.merchantCity, mcc: payload.mcc, localName: payload.language?.name },
      currency: local.alpha,
      amountMinor,
      amountEditable: amountMinor === undefined,
      tipPrompt: payload.tip?.mode === 'prompt',
      prompts: promptedFields(payload),
      warnings: [...payload.warnings, ...match.notes],
    };
    this.decodes.set(decodeId, { mppId, payload, match, partner, result });
    return result;
  }

  quote(decodeId: string, input: { amountMinor?: bigint; tipMinor?: bigint } = {}): Quote {
    const s = this.decodes.get(decodeId);
    if (!s || s.result.expiresAt < this.now()) throw new PaymentError('DECODE_EXPIRED', 'scan the QR code again');
    let amount = s.result.amountMinor;
    if (amount === undefined) {
      if (!input.amountMinor || input.amountMinor <= 0n) throw new PaymentError('AMOUNT_REQUIRED', 'static QR: the user must enter the amount');
      amount = input.amountMinor;
    } else if (input.amountMinor !== undefined && input.amountMinor !== amount) {
      throw new PaymentError('AMOUNT_MISMATCH', 'dynamic QR amount cannot be changed');
    }
    const tip = input.tipMinor ?? 0n;
    if (tip < 0n || (tip > 0n && !s.result.tipPrompt)) throw new PaymentError('TIP_NOT_ALLOWED', 'QR does not prompt for a tip');
    const fixedTip = s.payload.tip?.mode === 'fixed' && s.payload.tip.fixed ? toMinorUnits(s.payload.tip.fixed, currencyByAlpha(s.result.currency)!.minor) : 0n;
    const q = priceLocalAmount(
      {
        payerCurrency: this.d.mppCurrency[s.mppId]!,
        localCurrency: s.result.currency,
        localAmountMinor: amount + tip + fixedTip,
        settlementAsset: this.d.settlementAsset,
        now: this.now(),
      },
      this.d.rates,
      this.d.policy,
    );
    this.quotes.set(q.quoteId, { decodeId, quote: q, tipMinor: tip + fixedTip, used: false });
    return q;
  }

  async pay(input: { mppId: string; paymentRequestId: string; quoteId: string; payerRef: string }): Promise<Payment> {
    const reqKey = `${input.mppId}|${input.paymentRequestId}`;
    const existing = this.byRequest.get(reqKey);
    if (existing) return this.payments.get(existing)!;

    const qs = this.quotes.get(input.quoteId);
    if (!qs) throw new PaymentError('QUOTE_NOT_FOUND', 'unknown quote');
    const s = this.decodes.get(qs.decodeId)!;
    if (s.mppId !== input.mppId) throw new PaymentError('QUOTE_NOT_FOUND', 'quote belongs to another MPP');
    if (qs.used) throw new PaymentError('QUOTE_USED', 'quote already consumed by another payment request');
    if (qs.quote.expiresAt < this.now()) throw new PaymentError('QUOTE_EXPIRED', 'request a new quote');

    const decision = await this.d.screening.screen({
      payerRef: input.payerRef,
      mppId: input.mppId,
      scheme: s.match,
      merchantName: s.payload.merchantName,
      amountMinor: qs.quote.merchant.amountMinor,
      currency: qs.quote.merchant.currency,
    });
    if (!decision.allow) throw new PaymentError(decision.review ? 'RISK_REVIEW' : 'RISK_REJECTED', decision.reason);

    qs.used = true;
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
      if (r.status === 'UNKNOWN') continue;
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
    const assetUnits = toMinorUnits(q.settlementAmount, 6);
    this.d.ledger.post({
      id: `${p.paymentId}:capture`,
      ref: p.paymentId,
      memo: `${p.scheme.schemeId} ${q.merchant.currency} ${q.merchant.amountMinor}`,
      at: this.now(),
      postings: [
        { account: `mpp:${p.mppId}:due`, asset: payerCcy, amount: q.payer.amountMinor },
        { account: `fx:${asset}:position`, asset: payerCcy, amount: -b.principalMinor },
        { account: 'revenue:fx-margin', asset: payerCcy, amount: -b.fxMarginMinor },
        { account: 'revenue:network-fee', asset: payerCcy, amount: -b.networkFeeMinor },
        { account: 'revenue:fixed-fee', asset: payerCcy, amount: -b.fixedFeeMinor },
        { account: `fx:${asset}:position`, asset, amount: assetUnits },
        { account: `acqp:${p.partnerId}:owed`, asset, amount: -assetUnits },
      ],
    });
  }

  /**
   * Refund policy in this reference: the merchant-side partner returns the local
   * amount; the wallet user is refunded the same share of the *principal* they paid
   * (original rate), fees are not refunded. The network bears FX drift between
   * payment and refund — see docs/04 for the alternatives.
   */
  async refund(paymentId: string, amountMinor: bigint): Promise<{ refundId: string; payerRefundMinor: bigint }> {
    const p = this.payments.get(paymentId);
    if (!p || p.status !== 'SUCCEEDED') throw new PaymentError('NOT_REFUNDABLE', 'payment not found or not succeeded');
    if (amountMinor <= 0n || p.refundedMinor + amountMinor > p.quote.merchant.amountMinor) throw new PaymentError('REFUND_EXCEEDS', 'refund exceeds captured amount');
    const partner = this.d.partners.find(x => x.id === p.partnerId)!;
    if (!partner.refund) throw new PaymentError('REFUND_UNSUPPORTED', 'partner cannot originate refunds');
    const r = await partner.refund(paymentId, amountMinor);
    if (r.status !== 'SUCCESS') throw new PaymentError('REFUND_FAILED', r.reason ?? 'partner refund failed');

    const q = p.quote;
    const share = (v: bigint) => (v * amountMinor) / q.merchant.amountMinor;
    const payerRefundMinor = share(q.breakdown.principalMinor);
    const assetUnits = share(toMinorUnits(q.settlementAmount, 6));
    const refundId = `${paymentId}:refund:${p.refundedMinor + amountMinor}`;
    this.d.ledger.post({
      id: refundId,
      ref: paymentId,
      memo: `refund ${q.merchant.currency} ${amountMinor}`,
      at: this.now(),
      postings: [
        { account: `mpp:${p.mppId}:due`, asset: q.payer.currency, amount: -payerRefundMinor },
        { account: `fx:${q.settlementAsset}:position`, asset: q.payer.currency, amount: payerRefundMinor },
        { account: `fx:${q.settlementAsset}:position`, asset: q.settlementAsset, amount: -assetUnits },
        { account: `acqp:${p.partnerId}:owed`, asset: q.settlementAsset, amount: assetUnits },
      ],
    });
    p.refundedMinor += amountMinor;
    p.updatedAt = this.now();
    return { refundId, payerRefundMinor };
  }

  get(paymentId: string): Payment | undefined {
    return this.payments.get(paymentId);
  }

  list(): Payment[] {
    return [...this.payments.values()];
  }
}
