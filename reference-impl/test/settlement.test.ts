import assert from 'node:assert/strict';
import { test } from 'node:test';
import { network, testQr } from './helpers.ts';

let req = 0;
async function payN(n: ReturnType<typeof network>, amounts: string[]) {
  const out = [];
  for (const a of amounts) {
    const d = n.payments.decode('PAYPAY', testQr({ amount: a }));
    out.push(await n.payments.pay({ mppId: 'PAYPAY', paymentRequestId: `r${++req}`, quoteId: n.payments.quote('PAYPAY', d.decodeId).quoteId, payerRef: 'u' }));
  }
  return out;
}

const trialBalanced = (n: ReturnType<typeof network>) => {
  for (const asset of ['JPY', 'USDC']) {
    const sum = n.ledger.snapshot().filter(r => r.asset === asset).reduce((s, r) => s + r.balance, 0n);
    assert.equal(sum, 0n, `${asset} trial balance`);
  }
};

test('cycle nets many payments into one transfer per participant', async () => {
  const n = network();
  await payN(n, ['100.00', '250.00', '1000.00', '64.00']);
  const r = await n.settlement.closeCycle('C1');
  assert.equal(r.status, 'CLOSED');
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
  assert.equal(n.ledger.balance('mpp:PAYPAY:due', 'JPY'), 0n, 'due moved into the instruction');

  n.settlement.confirmCollection('C1', collect[0]!.instructionId, 'BANK-WIRE-001');
  assert.equal(r.rebalance[0]!.pair, 'USDC/JPY');
  trialBalanced(n);
});

test('a cycle id cannot be reused and later cycles only net new activity', async () => {
  const n = network();
  await payN(n, ['1000.00']);
  const c1 = await n.settlement.closeCycle('C1');
  await assert.rejects(n.settlement.closeCycle('C1'), /already closed/);
  await payN(n, ['320.00']);
  const c2 = await n.settlement.closeCycle('C2');
  const pay2 = c2.instructions.find(i => i.direction === 'PAY')!;
  assert.equal(pay2.amount, 10_000_000n, 'only the 320 THB payment');
  const col1 = c1.instructions.find(i => i.direction === 'COLLECT')!;
  const col2 = c2.instructions.find(i => i.direction === 'COLLECT')!;
  assert.ok(col2.amount < col1.amount, 'second collection excludes the first');
  assert.equal(await n.chain.balanceOf('USDC', n.partner.settlementAddress), 41_250_000n);
  assert.equal(await n.settlement.closeCycle('C3').then(r => r.instructions.length), 0);
  trialBalanced(n);
});

test('insufficient treasury float aborts the cycle without committing anything', async () => {
  const n = network({ hubUsdc: 1_000_000n });
  await payN(n, ['1000.00']);
  const r = await n.settlement.closeCycle('C1');
  assert.equal(r.status, 'ABORTED_SHORTFALL');
  assert.equal(r.liquidity.shortfall, 31_250_000n - 1_000_000n);
  assert.equal(n.ledger.balance('acqp:THP1:owed', 'USDC'), -31_250_000n, 'position still open');
  n.chain.mint('USDC', n.hub, 40_000_000n);
  n.ledger.post({ id: 'topup', ref: 'treasury', memo: 'top-up', at: 0, postings: [
    { account: 'settlement:USDC:hub', asset: 'USDC', amount: 40_000_000n },
    { account: 'equity:treasury', asset: 'USDC', amount: -40_000_000n },
  ] });
  assert.equal((await n.settlement.closeCycle('C1')).status, 'CLOSED', 'aborted cycle id can be retried');
});

test('fiat-mode partner: stablecoin goes to the hub off-ramp, partner gets a fiat wire', async () => {
  const n = network({ settlementMode: 'fiat' });
  await payN(n, ['1000.00']);
  const r = await n.settlement.closeCycle('C1');
  const pay = r.instructions.find(i => i.direction === 'PAY')!;
  assert.equal(pay.route, 'offramp-wire');
  assert.equal(pay.status, 'SENT');
  assert.equal(await n.chain.balanceOf('USDC', n.partner.settlementAddress), 0n, 'no stablecoin reaches the partner');
  assert.equal(await n.chain.balanceOf('USDC', n.offRamp.address), 31_250_000n);
  assert.deepEqual(n.offRamp.payouts.map(p => [p.partnerId, p.amount, p.fiatCurrency]), [['THP1', 31_250_000n, 'USD']]);
  n.settlement.confirmPayout('C1', pay.instructionId);
  assert.equal(pay.status, 'CONFIRMED');
  trialBalanced(n);
});

test('off-ramp failure after the transfer is retried without moving stablecoin again', async () => {
  const n = network({ settlementMode: 'fiat' });
  let fail = true;
  const orig = n.offRamp.payout.bind(n.offRamp);
  n.offRamp.payout = async x => {
    if (fail) {
      fail = false;
      throw new Error('bank API timeout');
    }
    return orig(x);
  };
  await payN(n, ['1000.00']);
  const r = await n.settlement.closeCycle('F1');
  const pay = r.instructions.find(i => i.direction === 'PAY')!;
  assert.equal(pay.status, 'TRANSFERRED');
  assert.equal(n.ledger.balance('offramp:USDC:in-transit', 'USDC'), 31_250_000n);
  assert.equal((await n.settlement.closeCycle('F2')).instructions.filter(i => i.role === 'acqp').length, 0, 'not re-instructed');
  await n.settlement.retryPayout('F1', pay.instructionId);
  assert.equal(pay.status, 'SENT');
  assert.equal(await n.chain.balanceOf('USDC', n.offRamp.address), 31_250_000n, 'transferred once');
  assert.equal(n.ledger.balance('offramp:USDC:in-transit', 'USDC'), 0n);
  trialBalanced(n);
});

test('refunds after settlement: partner owes the network and the MPP is paid back', async () => {
  const n = network();
  const [p] = await payN(n, ['1000.00']);
  const c1 = await n.settlement.closeCycle('T1');
  n.settlement.confirmCollection('T1', c1.instructions.find(i => i.role === 'mpp')!.instructionId, 'WIRE-IN');
  await n.payments.refund({ partnerId: 'THP1', paymentId: p!.paymentId, amountMinor: 100000n, refundRequestId: 'full' });
  const c2 = await n.settlement.closeCycle('T2');
  const fromPartner = c2.instructions.find(i => i.role === 'acqp')!;
  const toMpp = c2.instructions.find(i => i.role === 'mpp')!;
  assert.deepEqual([fromPartner.direction, fromPartner.amount], ['COLLECT', 31_250_000n]);
  assert.deepEqual([toMpp.direction, toMpp.amount], ['PAY', 4883n]);
  n.settlement.confirmCollection('T2', fromPartner.instructionId, '0xrepay');
  n.settlement.confirmPayout('T2', toMpp.instructionId, 'WIRE-OUT');
  assert.equal(toMpp.status, 'CONFIRMED');
  trialBalanced(n);
});

test('fiat-mode partner repays net refunds by wire, never in stablecoin', async () => {
  const n = network({ settlementMode: 'fiat' });
  const [p] = await payN(n, ['1000.00']);
  const c1 = await n.settlement.closeCycle('W1');
  n.settlement.confirmPayout('W1', c1.instructions.find(i => i.role === 'acqp')!.instructionId);
  await n.payments.refund({ partnerId: 'THP1', paymentId: p!.paymentId, amountMinor: 100000n, refundRequestId: 'full' });
  const c2 = await n.settlement.closeCycle('W2');
  const fromPartner = c2.instructions.find(i => i.role === 'acqp')!;
  assert.deepEqual([fromPartner.direction, fromPartner.route], ['COLLECT', 'offramp-wire']);
  assert.equal(n.offRamp.payouts.length, 1, 'no payout raised for a collection');
});

test('recorded treasury conversion closes the FX position', async () => {
  const n = network();
  await payN(n, ['1000.00']);
  const r = await n.settlement.closeCycle('C1');
  const rb = r.rebalance[0]!;
  n.settlement.recordRebalance('C1', 'JPY', rb.sellAmount, rb.buyAmount);
  assert.equal((await n.settlement.closeCycle('C2')).rebalance.length, 0);
});
