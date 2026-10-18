import assert from 'node:assert/strict';
import { test } from 'node:test';
import { PaymentError } from '../src/payments/service.ts';
import { network, testQr } from './helpers.ts';

const code = (fn: () => unknown) => {
  try {
    fn();
  } catch (e) {
    return (e as PaymentError).code;
  }
  return 'NO_ERROR';
};

test('static QR: user enters amount, payment succeeds and is journaled', async () => {
  const n = network();
  const d = n.payments.decode('PAYPAY', testQr());
  assert.equal(d.amountEditable, true);
  assert.equal(d.currency, 'THB');
  assert.equal(code(() => n.payments.quote(d.decodeId)), 'AMOUNT_REQUIRED');

  const q = n.payments.quote(d.decodeId, { amountMinor: 100000n });
  assert.equal(q.payer.amountMinor, 4923n);
  const p = await n.payments.pay({ mppId: 'PAYPAY', paymentRequestId: 'r1', quoteId: q.quoteId, payerRef: 'u1' });
  assert.equal(p.status, 'SUCCEEDED');
  assert.equal(n.partner.credits[0]!.amountMinor, 100000n);
  assert.equal(n.ledger.balance('mpp:PAYPAY:due', 'JPY'), 4923n);
  assert.equal(n.ledger.balance('acqp:THP1:owed', 'USDC'), -31_250_000n);
  assert.equal(n.ledger.balance('revenue:fx-margin', 'JPY'), -25n);
});

test('dynamic QR: amount is fixed by the merchant', () => {
  const n = network();
  const d = n.payments.decode('PAYPAY', testQr({ amount: '250.00' }));
  assert.equal(d.amountMinor, 25000n);
  assert.equal(code(() => n.payments.quote(d.decodeId, { amountMinor: 1n })), 'AMOUNT_MISMATCH');
  assert.equal(n.payments.quote(d.decodeId).merchant.amountMinor, 25000n);
});

test('P2P QR codes are refused for merchant payments', () => {
  const n = network();
  assert.equal(code(() => n.payments.decode('PAYPAY', testQr({ p2p: true }))), 'P2P_NOT_SUPPORTED');
});

test('unknown MPP and corrupted QR are rejected', () => {
  const n = network();
  assert.equal(code(() => n.payments.decode('NOPE', testQr())), 'UNKNOWN_MPP');
  assert.equal(code(() => n.payments.decode('PAYPAY', testQr().slice(0, -1) + '0')), 'INVALID_QR');
});

test('pay() is idempotent per paymentRequestId and quotes are single-use', async () => {
  const n = network();
  const d = n.payments.decode('PAYPAY', testQr({ amount: '100.00' }));
  const q = n.payments.quote(d.decodeId);
  const a = await n.payments.pay({ mppId: 'PAYPAY', paymentRequestId: 'same', quoteId: q.quoteId, payerRef: 'u' });
  const b = await n.payments.pay({ mppId: 'PAYPAY', paymentRequestId: 'same', quoteId: q.quoteId, payerRef: 'u' });
  assert.equal(a.paymentId, b.paymentId);
  assert.equal(n.partner.credits.length, 1);
  await assert.rejects(n.payments.pay({ mppId: 'PAYPAY', paymentRequestId: 'other', quoteId: q.quoteId, payerRef: 'u' }), { code: 'QUOTE_USED' });
});

test('expired quote is refused', async () => {
  const n = network();
  const d = n.payments.decode('PAYPAY', testQr({ amount: '100.00' }));
  const q = n.payments.quote(d.decodeId);
  n.advance(61_000);
  await assert.rejects(n.payments.pay({ mppId: 'PAYPAY', paymentRequestId: 'x', quoteId: q.quoteId, payerRef: 'u' }), { code: 'QUOTE_EXPIRED' });
});

test('rail failure leaves no ledger trace', async () => {
  const n = network();
  n.partner.behaviour = 'fail';
  const d = n.payments.decode('PAYPAY', testQr({ amount: '100.00' }));
  const p = await n.payments.pay({ mppId: 'PAYPAY', paymentRequestId: 'f', quoteId: n.payments.quote(d.decodeId).quoteId, payerRef: 'u' });
  assert.equal(p.status, 'FAILED');
  assert.equal(n.ledger.balance('mpp:PAYPAY:due', 'JPY'), 0n);
});

test('timeout → PROCESSING → resolved by inquiry and notified to MPP', async () => {
  const n = network();
  n.partner.behaviour = 'timeout-then-success';
  const d = n.payments.decode('PAYPAY', testQr({ amount: '100.00' }));
  const p = await n.payments.pay({ mppId: 'PAYPAY', paymentRequestId: 't', quoteId: n.payments.quote(d.decodeId).quoteId, payerRef: 'u' });
  assert.equal(p.status, 'PROCESSING');
  assert.equal(n.ledger.balance('mpp:PAYPAY:due', 'JPY'), 0n);
  const changed = await n.payments.resolvePending();
  assert.equal(changed.length, 1);
  assert.equal(p.status, 'SUCCEEDED');
  assert.equal(n.notifier.events[0]!.status, 'SUCCEEDED');
  assert.ok(n.ledger.balance('mpp:PAYPAY:due', 'JPY') > 0n);
});

test('screening limits and block-list', async () => {
  const n = network();
  const big = n.payments.decode('PAYPAY', testQr({ amount: '60000.00' }));
  await assert.rejects(n.payments.pay({ mppId: 'PAYPAY', paymentRequestId: 'b', quoteId: n.payments.quote(big.decodeId).quoteId, payerRef: 'u' }), { code: 'RISK_REJECTED' });
});

test('partial refund reverses principal share; fees are kept', async () => {
  const n = network();
  const d = n.payments.decode('PAYPAY', testQr({ amount: '1000.00' }));
  const p = await n.payments.pay({ mppId: 'PAYPAY', paymentRequestId: 'rf', quoteId: n.payments.quote(d.decodeId).quoteId, payerRef: 'u' });
  const r = await n.payments.refund(p.paymentId, 50000n);
  assert.equal(r.payerRefundMinor, 2441n); // half of 4,883 principal, rounded down
  assert.equal(n.ledger.balance('acqp:THP1:owed', 'USDC'), -15_625_000n);
  await assert.rejects(n.payments.refund(p.paymentId, 50001n), { code: 'REFUND_EXCEEDS' });
});

test('cancel before pay tombstones the request; in-flight and captured payments cannot be cancelled', async () => {
  const n = network();
  assert.deepEqual(n.payments.cancel('PAYPAY', 'late'), { cancelled: true });
  const d = n.payments.decode('PAYPAY', testQr({ amount: '100.00' }));
  await assert.rejects(n.payments.pay({ mppId: 'PAYPAY', paymentRequestId: 'late', quoteId: n.payments.quote(d.decodeId).quoteId, payerRef: 'u' }), { code: 'PAYMENT_CANCELLED' });
  assert.equal(n.partner.credits.length, 0);

  n.partner.behaviour = 'timeout-then-success';
  const d2 = n.payments.decode('PAYPAY', testQr({ amount: '100.00' }));
  await n.payments.pay({ mppId: 'PAYPAY', paymentRequestId: 'inflight', quoteId: n.payments.quote(d2.decodeId).quoteId, payerRef: 'u' });
  assert.equal(code(() => n.payments.cancel('PAYPAY', 'inflight')), 'CANCEL_NOT_ALLOWED_PROCESSING');
  await n.payments.resolvePending();
  assert.equal(code(() => n.payments.cancel('PAYPAY', 'inflight')), 'CANCEL_NOT_ALLOWED_REFUND');
});
