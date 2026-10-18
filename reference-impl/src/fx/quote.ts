// Quote engine: price a local-currency merchant amount in the payer's wallet currency.
//
// Path (default):  payer ccy (JPY) ──on-ramp──▶ settlement stablecoin (USDC) ──off-ramp──▶ local ccy
// Each leg's rate comes from a licensed liquidity provider's firm RFQ quote
// (not an AMM). The network adds explicit, separately reported fees so that
// GMV, FX spread and fee revenue stay distinguishable in the ledger.

import { currencyByAlpha } from '../emvco/iso4217.ts';
import { type Fixed, bps, div, fromMinor, fx, fxToString, mul, toMinor } from './decimal.ts';

export interface LegRate {
  /** Units of `quote` per 1 unit of `base`. */
  base: string;
  quote: string;
  rate: string;
  provider: string;
  validUntil: number;
}

export interface RateSource {
  /** Firm rate for converting `from` → `to` (one hop). */
  rate(from: string, to: string, now: number): LegRate;
}

export interface QuotePolicy {
  /** FX margin applied to the all-in rate, in bps. */
  fxMarginBps: number;
  /** Network fee charged to the MPP (wallet), in bps of local amount. */
  networkFeeBps: number;
  /** Fixed fee per transaction in payer currency minor units. */
  fixedFeeMinor: bigint;
  /** How long the MPP may hold the quote. */
  ttlMs: number;
}

export interface Quote {
  quoteId: string;
  createdAt: number;
  expiresAt: number;
  payer: { currency: string; amountMinor: bigint };
  merchant: { currency: string; amountMinor: bigint };
  settlementAsset: string;
  /** Stablecoin amount the off-ramp partner is owed for this payment (6 dp for USDC). */
  settlementAmount: string;
  /** Mid-market-equivalent rate (payer per 1 local) before margin and fees. */
  rawRate: string;
  /** Rate shown to the user (payer per 1 local), margin included, fees excluded. */
  customerRate: string;
  breakdown: { principalMinor: bigint; fxMarginMinor: bigint; networkFeeMinor: bigint; fixedFeeMinor: bigint };
  legs: LegRate[];
}

/** USDC / USDT / most fiat-backed stablecoins use 6 decimals. */
export const ASSET_DECIMALS = 6;

let seq = 0;

export function priceLocalAmount(
  args: { payerCurrency: string; localCurrency: string; localAmountMinor: bigint; settlementAsset: string; now: number },
  src: RateSource,
  policy: QuotePolicy,
): Quote {
  const payer = currencyByAlpha(args.payerCurrency);
  const local = currencyByAlpha(args.localCurrency);
  if (!payer || !local) throw new Error(`unsupported currency pair ${args.payerCurrency}/${args.localCurrency}`);
  if (args.localAmountMinor <= 0n) throw new Error('amount must be positive');

  // leg1: payer → asset (e.g. JPY→USDC: USDC per JPY); leg2: asset → local (e.g. USDC→THB: THB per USDC)
  const leg1 = src.rate(args.payerCurrency, args.settlementAsset, args.now);
  const leg2 = src.rate(args.settlementAsset, args.localCurrency, args.now);
  const localAmt: Fixed = fromMinor(args.localAmountMinor, local.minor);

  // Stablecoin needed to deliver localAmt, rounded up to the token's 6 decimals
  // so the off-ramp partner is never short.
  const assetAmt = fromMinor(toMinor(div(localAmt, fx(leg2.rate), 'up'), ASSET_DECIMALS, 'up'), ASSET_DECIMALS);
  const principal = div(assetAmt, fx(leg1.rate), 'up'); // payer currency
  const margin = mul(principal, bps(policy.fxMarginBps), 'up');
  const netFee = mul(principal, bps(policy.networkFeeBps), 'up');

  const principalMinor = toMinor(principal, payer.minor, 'up');
  const fxMarginMinor = toMinor(margin, payer.minor, 'up');
  const networkFeeMinor = toMinor(netFee, payer.minor, 'up');
  const total = principalMinor + fxMarginMinor + networkFeeMinor + policy.fixedFeeMinor;

  const expiresAt = Math.min(args.now + policy.ttlMs, leg1.validUntil, leg2.validUntil);
  return {
    quoteId: `Q${args.now.toString(36)}${(++seq).toString(36).padStart(4, '0')}`.toUpperCase(),
    createdAt: args.now,
    expiresAt,
    payer: { currency: payer.alpha, amountMinor: total },
    merchant: { currency: local.alpha, amountMinor: args.localAmountMinor },
    settlementAsset: args.settlementAsset,
    settlementAmount: fxToString(assetAmt, ASSET_DECIMALS),
    rawRate: fxToString(div(principal, localAmt), 8),
    customerRate: fxToString(div(principal + margin, localAmt), 8),
    breakdown: { principalMinor, fxMarginMinor, networkFeeMinor, fixedFeeMinor: policy.fixedFeeMinor },
    legs: [leg1, leg2],
  };
}

/** Static rate table for tests and the demo. Rates are "quote per base". */
export class TableRateSource implements RateSource {
  private readonly rates = new Map<string, { rate: string; provider: string }>();
  private readonly ttlMs: number;
  constructor(ttlMs = 30_000) {
    this.ttlMs = ttlMs;
  }
  set(base: string, quote: string, rate: string, provider: string): this {
    this.rates.set(`${base}/${quote}`, { rate, provider });
    return this;
  }
  rate(from: string, to: string, now: number): LegRate {
    const direct = this.rates.get(`${from}/${to}`);
    if (direct) return { base: from, quote: to, ...direct, validUntil: now + this.ttlMs };
    const inv = this.rates.get(`${to}/${from}`);
    if (inv) return { base: from, quote: to, rate: fxToString(div(fx('1'), fx(inv.rate), 'down')), provider: inv.provider, validUntil: now + this.ttlMs };
    throw new Error(`no rate ${from}/${to}`);
  }
}
