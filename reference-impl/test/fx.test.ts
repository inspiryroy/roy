import assert from 'node:assert/strict';
import { test } from 'node:test';
import { bps, div, divRound, fx, fxToString, mul } from '../src/fx/decimal.ts';
import { priceLocalAmount, TableRateSource } from '../src/fx/quote.ts';

test('fixed-point arithmetic and rounding', () => {
  assert.equal(fxToString(mul(fx('1.5'), fx('2.25'))), '3.375');
  assert.equal(fxToString(div(fx('1'), fx('3'), 'down'), 6), '0.333333');
  assert.equal(divRound(5n, 2n, 'half-even'), 2n);
  assert.equal(divRound(7n, 2n, 'half-even'), 4n);
  assert.equal(divRound(-7n, 2n, 'down'), -4n);
  assert.equal(divRound(-7n, 2n, 'up'), -3n);
  assert.equal(fxToString(bps(50)), '0.005');
});

test('quote JPY → USDC → THB with explicit fee breakdown', () => {
  const rates = new TableRateSource().set('JPY', 'USDC', '0.0064', 'JP-LP').set('USDC', 'THB', '32.00', 'TH-LP');
  const q = priceLocalAmount(
    { payerCurrency: 'JPY', localCurrency: 'THB', localAmountMinor: 100000n, settlementAsset: 'USDC', now: 0 },
    rates,
    { fxMarginBps: 50, networkFeeBps: 30, fixedFeeMinor: 0n, ttlMs: 60_000 },
  );
  // 1,000.00 THB = 31.25 USDC = 4,882.8125 JPY principal (rounded up to 4,883)
  assert.equal(q.settlementAmount, '31.25');
  assert.equal(q.breakdown.principalMinor, 4883n);
  assert.equal(q.breakdown.fxMarginMinor, 25n); // 24.41 → 25
  assert.equal(q.breakdown.networkFeeMinor, 15n); // 14.65 → 15
  assert.equal(q.payer.amountMinor, 4923n);
  assert.equal(q.rawRate, '4.8828125');
  // Quote validity is capped by the LPs' firm-quote windows (30 s) not the policy TTL.
  assert.equal(q.expiresAt, 30_000);
});

test('quote never under-delivers the merchant amount', () => {
  const rates = new TableRateSource().set('USDC', 'JPY', '151.37', 'JP-LP').set('USDC', 'VND', '26123', 'VN-LP');
  for (const amt of [1n, 999n, 25_000n, 1_234_567n]) {
    const q = priceLocalAmount(
      { payerCurrency: 'JPY', localCurrency: 'VND', localAmountMinor: amt, settlementAsset: 'USDC', now: 0 },
      rates,
      { fxMarginBps: 0, networkFeeBps: 0, fixedFeeMinor: 0n, ttlMs: 10_000 },
    );
    const delivered = mul(fx(q.settlementAmount), fx('26123'), 'down');
    assert.ok(delivered >= fx(String(amt)), `USDC ${q.settlementAmount} delivers less than ${amt} VND`);
  }
});
