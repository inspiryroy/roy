import { InMemoryChain, MockOffRamp, MockPartner, RecordingNotifier, RuleScreening } from '../src/adapters/mock.ts';
import { buildMpm } from '../src/emvco/mpm.ts';
import { TableRateSource } from '../src/fx/quote.ts';
import { Ledger } from '../src/ledger/ledger.ts';
import { PaymentService } from '../src/payments/service.ts';
import { SchemeRegistry } from '../src/schemes/registry.ts';
import type { SchemeDefinition } from '../src/schemes/types.ts';
import { SettlementEngine } from '../src/settlement/engine.ts';

/** A neutral, test-only scheme so the payment/settlement tests do not depend on any country profile. */
export const TEST_SCHEME: SchemeDefinition = {
  schemeId: 'XT.TESTQR',
  country: 'TH',
  name: 'Test National QR',
  rail: 'Test Instant Payments',
  currency: 'THB',
  guids: ['ORG.EXAMPLE.NATIONALQR'],
  routingKey: 'XT:TESTRAIL',
  interpret(acct) {
    const merchantId = acct.fields.get('01');
    if (!merchantId) return null;
    return {
      paymentType: acct.fields.get('02') === 'P2P' ? 'P2P' : 'P2M',
      routing: { acquirerId: acct.fields.get('03'), merchantId, references: {} },
      confidence: 1,
      notes: [],
    };
  },
};

export function testQr(opts: { amount?: string; p2p?: boolean; tip?: '01' } = {}): string {
  return buildMpm({
    initiation: opts.amount ? 'dynamic' : 'static',
    accounts: [{ tag: '30', fields: [['00', 'ORG.EXAMPLE.NATIONALQR'], ['01', 'M0001'], ['02', opts.p2p ? 'P2P' : 'P2M'], ['03', 'ACQ01']] }],
    mcc: '5812',
    currencyNumeric: '764',
    amount: opts.amount,
    countryCode: 'TH',
    merchantName: 'TEST NOODLE',
    merchantCity: 'BANGKOK',
  });
}

export function network(opts: { now?: () => number; hubUsdc?: bigint; settlementMode?: 'onchain' | 'fiat' } = {}) {
  let t = 1_700_000_000_000;
  const clock = opts.now ?? (() => t);
  const ledger = new Ledger();
  const partner = new MockPartner('THP1', ['XT:TESTRAIL'], { settlementMode: opts.settlementMode ?? 'onchain' });
  const offRamp = new MockOffRamp();
  const chain = new InMemoryChain();
  const hub = '0xhub';
  chain.mint('USDC', hub, opts.hubUsdc ?? 1_000_000_000n);
  ledger.post({
    id: 'fund',
    ref: 'treasury',
    memo: 'initial float',
    at: 0,
    postings: [
      { account: 'settlement:USDC:hub', asset: 'USDC', amount: opts.hubUsdc ?? 1_000_000_000n },
      { account: 'equity:treasury', asset: 'USDC', amount: -(opts.hubUsdc ?? 1_000_000_000n) },
    ],
  });
  const notifier = new RecordingNotifier();
  const registry = new SchemeRegistry().register(TEST_SCHEME);
  const rates = new TableRateSource(60_000).set('JPY', 'USDC', '0.0064', 'JP-LP').set('USDC', 'THB', '32.00', 'TH-LP');
  const payments = new PaymentService({
    registry,
    partners: [partner],
    rates,
    policy: { fxMarginBps: 50, networkFeeBps: 30, fixedFeeMinor: 0n, ttlMs: 60_000 },
    ledger,
    screening: new RuleScreening({ THB: 5_000_000n }, [/SANCTIONED/i]),
    notifier,
    mppCurrency: { PAYPAY: 'JPY' },
    settlementAsset: 'USDC',
    clock,
  });
  const settlement = new SettlementEngine({ ledger, chain, partners: [partner], hubAddress: hub, settlementAsset: 'USDC', offRamp, clock });
  return { ledger, partner, chain, hub, offRamp, notifier, payments, settlement, advance: (ms: number) => (t += ms) };
}
