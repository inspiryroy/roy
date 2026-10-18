import assert from 'node:assert/strict';
import { test } from 'node:test';
import { network, testQr } from './helpers.ts';

async function payN(n: ReturnType<typeof network>, amounts: string[]) {
  for (const [i, a] of amounts.entries()) {
    const d = n.payments.decode('PAYPAY', testQr({ amount: a }));
    await n.payments.pay({ mppId: 'PAYPAY', paymentRequestId: `r${i}`, quoteId: n.payments.quote(d.decodeId).quoteId, payerRef: 'u' });
  }
}

test('cycle nets many payments into one transfer per participant', async () => {
  const n = network();
  await payN(n, ['100.00', '250.00', '1000.00', '64.00']);
  const r = await n.settlement.closeCycle('C1');
  assert.equal(r.grossItems, 4);
  const pay = r.instructions.filter(i => i.direction === 'PAY');
  const collect = r.instructions.filter(i => i.direction === 'COLLECT');
  assert.equal(pay.length, 1);
  assert.equal(collect.length, 1);
  // 1,414 THB / 32 = 44.1875 USDC
  assert.equal(pay[0]!.amount, 44_187_500n);
  assert.equal(pay[0]!.status, 'CONFIRMED');
  assert.equal(await n.chain.balanceOf('USDC', n.partner.settlementAddress), 44_187_500n);
  assert.equal(n.ledger.balance('acqp:THP1:owed', 'USDC'), 0n);
  assert.equal(collect[0]!.participant, 'PAYPAY');
  assert.equal(collect[0]!.asset, 'JPY');

  n.settlement.confirmCollection('C1', collect[0]!.instructionId, 'BANK-WIRE-001');
  assert.equal(n.ledger.balance('mpp:PAYPAY:due', 'JPY'), 0n);
  assert.equal(r.rebalance[0]!.sell, 'JPY');
});

test('insufficient treasury float pays nobody and reports the shortfall', async () => {
  const n = network({ hubUsdc: 1_000_000n });
  await payN(n, ['1000.00']);
  const r = await n.settlement.closeCycle('C1');
  assert.equal(r.liquidity.shortfall, 31_250_000n - 1_000_000n);
  assert.ok(r.instructions.filter(i => i.direction === 'PAY').every(i => i.status === 'PENDING'));
});

test('ledger stays balanced across payment, refund and settlement', async () => {
  const n = network();
  await payN(n, ['500.00', '700.00']);
  const p = n.payments.list()[0]!;
  await n.payments.refund(p.paymentId, 10000n);
  await n.settlement.closeCycle('C1');
  for (const asset of ['JPY', 'USDC']) {
    const sum = n.ledger.snapshot().filter(r => r.asset === asset).reduce((s, r) => s + r.balance, 0n);
    assert.equal(sum, 0n, `${asset} trial balance`);
  }
});
