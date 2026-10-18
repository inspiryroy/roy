// End-to-end walkthrough: a PayPay-style JPY wallet scans synthetic national QR
// codes across Southeast Asia, pays, and the network settles partners in USDC.
//   node src/demo.ts

import { currencyByAlpha, fromMinorUnits } from './emvco/iso4217.ts';
import { createNetwork } from './network.ts';
import { SAMPLES } from './schemes/index.ts';

const net = createNetwork();
const fmt = (ccy: string, v: bigint) => `${fromMinorUnits(v, currencyByAlpha(ccy)!.minor)} ${ccy}`;

console.log('=== 1. scan → decode → quote → pay ===\n');
let i = 0;
for (const s of SAMPLES) {
  const d = net.payments.decode('PAYPAY', s.qr);
  const q = net.payments.quote(d.decodeId, d.amountEditable ? { amountMinor: s.enterAmountMinor } : {});
  const p = await net.payments.pay({ mppId: 'PAYPAY', paymentRequestId: `demo-${++i}`, quoteId: q.quoteId, payerRef: 'user-001' });
  console.log(`${d.scheme.schemeId.padEnd(16)} ${(d.merchant.name ?? '').padEnd(22)} ${d.amountEditable ? 'static ' : 'dynamic'}  ` +
    `${fmt(q.merchant.currency, q.merchant.amountMinor).padStart(16)}  ⇐ ${fmt('JPY', q.payer.amountMinor).padStart(10)}  ` +
    `(${q.settlementAmount} USDC to ${p.partnerId})  ${p.status}`);
}

console.log('\n=== 2. settlement cycle ===\n');
const r = await net.settlement.closeCycle('2026-10-18T09');
console.log(`payments in cycle: ${r.grossItems}, on-chain transfers: ${r.instructions.filter(x => x.direction === 'PAY').length}`);
console.log(`treasury USDC required ${fromMinorUnits(r.liquidity.required, 6)} / available ${fromMinorUnits(r.liquidity.available, 6)}`);
for (const ins of r.instructions) {
  const amt = ins.asset === 'USDC' ? `${fromMinorUnits(ins.amount, 6)} USDC` : fmt(ins.asset, ins.amount);
  console.log(`  ${ins.instructionId} ${ins.direction.padEnd(7)} ${ins.participant.padEnd(16)} ${amt.padStart(18)}  ${ins.status}${ins.txHash ? ` ${ins.txHash.slice(0, 12)}…` : ''}`);
}
for (const rb of r.rebalance) console.log(`  treasury rebalance: sell ${fmt(rb.sell, rb.sellAmount)} → buy back ${fromMinorUnits(rb.buyAmount, 6)} ${rb.buy}`);

console.log('\n=== 3. ledger (non-zero balances) ===\n');
for (const row of net.ledger.snapshot()) {
  const v = row.asset === 'USDC' ? `${fromMinorUnits(row.balance, 6)} USDC` : fmt(row.asset, row.balance);
  console.log(`  ${row.account.padEnd(28)} ${v.padStart(22)}`);
}
