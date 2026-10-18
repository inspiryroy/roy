// Wires a complete in-memory network: every national scheme profile, one mock
// settlement partner per routing key, a rate table, ledger, screening and the
// settlement engine. Used by the demo, the HTTP server and tests.

import { InMemoryChain, MockOffRamp, MockPartner, RecordingNotifier, RuleScreening } from './adapters/mock.ts';
import { TableRateSource } from './fx/quote.ts';
import { Ledger } from './ledger/ledger.ts';
import { PaymentService } from './payments/service.ts';
import { ALL_SCHEMES } from './schemes/index.ts';
import { SchemeRegistry } from './schemes/registry.ts';
import { SettlementEngine } from './settlement/engine.ts';

/** Illustrative mid rates (quote per base) – NOT market data. */
export const DEMO_RATES: Array<[string, string, string]> = [
  ['USDC', 'JPY', '150.00'],
  ['USDC', 'THB', '32.50'],
  ['USDC', 'SGD', '1.29'],
  ['USDC', 'MYR', '4.20'],
  ['USDC', 'IDR', '16300'],
  ['USDC', 'VND', '26000'],
  ['USDC', 'PHP', '57.50'],
  ['USDC', 'KHR', '4010'],
  ['USDC', 'USD', '1.00'],
  ['USDC', 'LAK', '21800'],
];

export function createNetwork(opts: { clock?: () => number; hubFloatUsdc?: bigint } = {}) {
  const clock = opts.clock ?? (() => Date.now());
  const registry = new SchemeRegistry();
  for (const s of ALL_SCHEMES) registry.register(s);

  // Countries whose regulators do not let stablecoins reach local institutions get fiat
  // wires from the hub's off-ramp (docs/04 §4.2, §4.10). Cambodia stays fiat until NBC
  // approves a bank's Group 1b stablecoin holding.
  const ONCHAIN_COUNTRIES = new Set(['SG', 'PH']);
  const keys = [...new Set(ALL_SCHEMES.map(s => s.routingKey))];
  const partners = keys.map(
    k => new MockPartner(`LSP-${k.replace(/[^A-Z0-9]/g, '')}`, [k], { settlementMode: ONCHAIN_COUNTRIES.has(k.slice(0, 2)) ? 'onchain' : 'fiat' }),
  );
  const offRamp = new MockOffRamp();

  const rates = new TableRateSource(30_000);
  for (const [b, q, r] of DEMO_RATES) rates.set(b, q, r, `LP-${q}`);

  const ledger = new Ledger();
  const chain = new InMemoryChain();
  const hubAddress = '0xNETWORK-HUB';
  const float = opts.hubFloatUsdc ?? 10_000_000_000n; // 10,000 USDC
  chain.mint('USDC', hubAddress, float);
  ledger.post({
    id: 'treasury:initial-float',
    ref: 'treasury',
    memo: 'initial USDC float',
    at: clock(),
    postings: [
      { account: 'settlement:USDC:hub', asset: 'USDC', amount: float },
      { account: 'equity:treasury', asset: 'USDC', amount: -float },
    ],
  });

  const notifier = new RecordingNotifier();
  const payments = new PaymentService({
    registry,
    partners,
    rates,
    policy: { fxMarginBps: 50, networkFeeBps: 30, fixedFeeMinor: 0n, ttlMs: 60_000 },
    ledger,
    // Illustrative per-transaction caps in local minor units.
    screening: new RuleScreening({ THB: 5_000_000n, IDR: 1_000_000_000n, VND: 100_000_000n }),
    notifier,
    mppCurrency: { PAYPAY: 'JPY' },
    settlementAsset: 'USDC',
    clock,
  });
  const settlement = new SettlementEngine({ ledger, chain, partners, hubAddress, settlementAsset: 'USDC', offRamp, wireCurrency: 'USD', clock });
  return { registry, partners, rates, ledger, chain, hubAddress, offRamp, notifier, payments, settlement };
}
