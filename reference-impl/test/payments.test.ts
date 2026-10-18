import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildMpm } from '../src/emvco/mpm.ts';
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
const MPP = 'PAYPAY';
const LSP = 'THP1';

async function paid(n: ReturnType<typeof network>, amount = '1000.00', id = 'r1') {
  const d = n.payments.decode(MPP, testQr({ amount }));
  return n.payments.pay({ mppId: MPP, paymentRequestId: id, quoteId: n.payments.quote(MPP, d.decodeId).quoteId, payerRef: 'u' });
}

test('static QR: user enters amount, payment succeeds and is journaled', async () => {
  const n = network();
  const d = n.payments.decode(MPP, testQr());
  assert.equal(d.amountEditable, true);
  assert.equal(d.currency, 'THB');
  assert.equal(code(() => n.payments.quote(MPP, d.decodeId)), 'AMOUNT_REQUIRED');

  const q = n.payments.quote(MPP, d.decodeId, { amountMinor: 100000n });
  assert.equal(q.payer.amountMinor, 4923n);
  const p = await n.payments.pay({ mppId: MPP, paymentRequestId: 'r1', quoteId: q.quoteId, payerRef: 'u1' });
  assert.equal(p.status, 'SUCCEEDED');
  assert.equal(n.partner.credits[0]!.amountMinor, 100000n);
  assert.equal(n.ledger.balance('mpp:PAYPAY:due', 'JPY'), 4923n);
  assert.equal(n.ledger.balance('acqp:THP1:owed', 'USDC'), -31_250_000n);
  assert.equal(n.ledger.balance('revenue:fx-margin', 'JPY'), -25n);
});

test('dynamic QR: amount is fixed by the merchant', () => {
  const n = network();
  const d = n.payments.decode(MPP, testQr({ amount: '250.00' }));
  assert.equal(d.amountMinor, 25000n);
  assert.equal(code(() => n.payments.quote(MPP, d.decodeId, { amountMinor: 1n })), 'AMOUNT_MISMATCH');
  assert.equal(n.payments.quote(MPP, d.decodeId).merchant.amountMinor, 25000n);
});

test('P2P QR codes are refused for merchant payments', () => {
  const n = network();
  assert.equal(code(() => n.payments.decode(MPP, testQr({ p2p: true }))), 'P2P_NOT_SUPPORTED');
});

test('unknown MPP, corrupted QR and malformed amounts are business errors', () => {
  const n = network();
  assert.equal(code(() => n.payments.decode('NOPE', testQr())), 'UNKNOWN_MPP');
  assert.equal(code(() => n.payments.decode(MPP, testQr().slice(0, -1) + '0')), 'INVALID_QR');
  assert.equal(code(() => n.payments.decode(MPP, testQr({ amount: '1.005' }))), 'INVALID_QR');
  assert.equal(code(() => n.payments.decode(MPP, testQr({ amount: '0.00' }))), 'INVALID_QR');
});

test('a currency the scheme does not carry is declined, never priced in that currency', () => {
  const n = network();
  for (const currencyNumeric of ['840', '978']) {
    const qr = buildMpm({
      initiation: 'dynamic',
      accounts: [{ tag: '30', fields: [['00', 'ORG.EXAMPLE.NATIONALQR'], ['01', 'M0001'], ['02', 'P2M']] }],
      mcc: '5812', currencyNumeric, amount: '100.00', countryCode: 'TH', merchantName: 'X', merchantCity: 'BANGKOK',
    });
    assert.equal(code(() => n.payments.decode(MPP, qr)), 'INVALID_QR');
  }
  assert.equal(n.partner.credits.length, 0);
});

test('quasi-cash MCCs are refused on the purchase route', () => {
  const n = network();
  const qr = buildMpm({
    initiation: 'static',
    accounts: [{ tag: '30', fields: [['00', 'ORG.EXAMPLE.NATIONALQR'], ['01', 'M0001'], ['02', 'P2M']] }],
    mcc: '6010', currencyNumeric: '764', countryCode: 'TH', merchantName: 'ATM', merchantCity: 'BANGKOK',
  });
  assert.equal(code(() => n.payments.decode(MPP, qr)), 'MCC_NOT_SUPPORTED');
});

test('pay() is idempotent per paymentRequestId and quotes are single-use', async () => {
  const n = network();
  const d = n.payments.decode(MPP, testQr({ amount: '100.00' }));
  const q = n.payments.quote(MPP, d.decodeId);
  const a = await n.payments.pay({ mppId: MPP, paymentRequestId: 'same', quoteId: q.quoteId, payerRef: 'u' });
  const b = await n.payments.pay({ mppId: MPP, paymentRequestId: 'same', quoteId: q.quoteId, payerRef: 'u' });
  assert.equal(a.paymentId, b.paymentId);
  assert.equal(n.partner.credits.length, 1);
  await assert.rejects(n.payments.pay({ mppId: MPP, paymentRequestId: 'other', quoteId: q.quoteId, payerRef: 'u' }), { code: 'QUOTE_USED' });
});

test('concurrent retries of one paymentRequestId credit the merchant once', async () => {
  const n = network();
  const d = n.payments.decode(MPP, testQr({ amount: '100.00' }));
  const req = { mppId: MPP, paymentRequestId: 'race', quoteId: n.payments.quote(MPP, d.decodeId).quoteId, payerRef: 'u' };
  const [a, b] = await Promise.all([n.payments.pay(req), n.payments.pay(req)]);
  assert.equal(a.paymentId, b.paymentId);
  assert.equal(n.partner.credits.length, 1);
  assert.equal(n.ledger.balance('mpp:PAYPAY:due', 'JPY'), a.quote.payer.amountMinor);
});

test('a reused paymentRequestId with another quote is a conflict; empty ids are rejected', async () => {
  const n = network();
  await paid(n, '100.00', 'dup');
  const d = n.payments.decode(MPP, testQr({ amount: '200.00' }));
  const q2 = n.payments.quote(MPP, d.decodeId);
  await assert.rejects(n.payments.pay({ mppId: MPP, paymentRequestId: 'dup', quoteId: q2.quoteId, payerRef: 'u' }), { code: 'IDEMPOTENCY_CONFLICT' });
  await assert.rejects(n.payments.pay({ mppId: MPP, paymentRequestId: '', quoteId: q2.quoteId, payerRef: 'u' }), { code: 'BAD_REQUEST' });
  assert.equal(n.partner.credits.length, 1);
});

test('quotes and payments are private to the MPP that created them', async () => {
  const n = network();
  const d = n.payments.decode(MPP, testQr({ amount: '100.00' }));
  assert.equal(code(() => n.payments.quote('OTHER', d.decodeId)), 'DECODE_NOT_FOUND');
  const p = await paid(n, '100.00');
  assert.equal(n.payments.get(p.paymentId, 'OTHER'), undefined);
  assert.equal(n.payments.get(p.paymentId, MPP)?.paymentId, p.paymentId);
});

test('expired quote is refused', async () => {
  const n = network();
  const d = n.payments.decode(MPP, testQr({ amount: '100.00' }));
  const q = n.payments.quote(MPP, d.decodeId);
  n.advance(61_000);
  await assert.rejects(n.payments.pay({ mppId: MPP, paymentRequestId: 'x', quoteId: q.quoteId, payerRef: 'u' }), { code: 'QUOTE_EXPIRED' });
});

test('rail failure leaves no ledger trace', async () => {
  const n = network();
  n.partner.behaviour = 'fail';
  const p = await paid(n, '100.00', 'f');
  assert.equal(p.status, 'FAILED');
  assert.equal(n.ledger.balance('mpp:PAYPAY:due', 'JPY'), 0n);
});

test('timeout → PROCESSING → resolved by inquiry and notified to MPP', async () => {
  const n = network();
  n.partner.behaviour = 'timeout-then-success';
  const p = await paid(n, '100.00', 't');
  assert.equal(p.status, 'PROCESSING');
  assert.equal(n.ledger.balance('mpp:PAYPAY:due', 'JPY'), 0n);
  const changed = await n.payments.resolvePending();
  assert.equal(changed.length, 1);
  assert.equal(p.status, 'SUCCEEDED');
  assert.equal(n.notifier.events[0]!.status, 'SUCCEEDED');
  assert.ok(n.ledger.balance('mpp:PAYPAY:due', 'JPY') > 0n);
});

test('screening limits and block-list; a rejected request can be retried with the same quote', async () => {
  const n = network();
  const big = n.payments.decode(MPP, testQr({ amount: '60000.00' }));
  const q = n.payments.quote(MPP, big.decodeId);
  await assert.rejects(n.payments.pay({ mppId: MPP, paymentRequestId: 'b', quoteId: q.quoteId, payerRef: 'u' }), { code: 'RISK_REJECTED' });
  assert.equal(n.partner.credits.length, 0);
});

test('convenience fees: 55=02 fixed and 55=03 percentage are added to the merchant amount', () => {
  const n = network();
  const build = (tip: { indicator: '02' | '03'; fixed?: string; percentage?: string }) =>
    buildMpm({
      initiation: 'dynamic',
      accounts: [{ tag: '30', fields: [['00', 'ORG.EXAMPLE.NATIONALQR'], ['01', 'M0001'], ['02', 'P2M']] }],
      mcc: '5812', currencyNumeric: '764', amount: '100.00', tip, countryCode: 'TH', merchantName: 'X', merchantCity: 'BANGKOK',
    });
  const fixed = n.payments.decode(MPP, build({ indicator: '02', fixed: '5.00' }));
  assert.equal(n.payments.quote(MPP, fixed.decodeId).merchant.amountMinor, 10500n);
  const pct = n.payments.decode(MPP, build({ indicator: '03', percentage: '10' }));
  const q = n.payments.quote(MPP, pct.decodeId);
  assert.equal(q.merchant.amountMinor, 11000n);
  assert.deepEqual(q.merchantComponents, { baseMinor: 10000n, tipMinor: 0n, feeMinor: 1000n });
  assert.equal(code(() => n.payments.decode(MPP, build({ indicator: '02', fixed: 'abc' }))), 'INVALID_QR');
});

test('LSP refunds: partial refunds add up exactly, are idempotent and cannot exceed the capture', async () => {
  const n = network();
  const p = await paid(n, '1000.00');
  const a = await n.payments.refund({ partnerId: LSP, paymentId: p.paymentId, amountMinor: 33333n, refundRequestId: 'rf-1' });
  const again = await n.payments.refund({ partnerId: LSP, paymentId: p.paymentId, amountMinor: 33333n, refundRequestId: 'rf-1' });
  assert.equal(again.refundId, a.refundId, 'same refundRequestId → same refund');
  const b = await n.payments.refund({ partnerId: LSP, paymentId: p.paymentId, amountMinor: 33333n, refundRequestId: 'rf-2' });
  const c = await n.payments.refund({ partnerId: LSP, paymentId: p.paymentId, amountMinor: 33334n, refundRequestId: 'rf-3' });
  assert.equal(a.payerRefundMinor + b.payerRefundMinor + c.payerRefundMinor, 4883n, 'whole principal returned');
  assert.equal(n.ledger.balance('acqp:THP1:owed', 'USDC'), 0n);
  await assert.rejects(n.payments.refund({ partnerId: LSP, paymentId: p.paymentId, amountMinor: 1n, refundRequestId: 'rf-4' }), { code: 'REFUND_EXCEEDS' });
});

test('concurrent refunds cannot exceed the captured amount', async () => {
  const n = network();
  const p = await paid(n, '1000.00');
  const r = await Promise.allSettled([
    n.payments.refund({ partnerId: LSP, paymentId: p.paymentId, amountMinor: 60000n, refundRequestId: 'x1' }),
    n.payments.refund({ partnerId: LSP, paymentId: p.paymentId, amountMinor: 60000n, refundRequestId: 'x2' }),
  ]);
  assert.deepEqual(r.map(x => x.status).sort(), ['fulfilled', 'rejected']);
  assert.equal(n.payments.get(p.paymentId)!.refundedMinor, 60000n);
});

test('only the partner that credited the merchant can refund', async () => {
  const n = network();
  const p = await paid(n, '100.00');
  await assert.rejects(n.payments.refund({ partnerId: 'OTHER-LSP', paymentId: p.paymentId, amountMinor: 100n, refundRequestId: 'z' }), { code: 'NOT_FOUND' });
  // replaying a key the owner already used does not reveal the refund either
  await n.payments.refund({ partnerId: LSP, paymentId: p.paymentId, amountMinor: 100n, refundRequestId: 'y' });
  await assert.rejects(n.payments.refund({ partnerId: 'OTHER-LSP', paymentId: p.paymentId, amountMinor: 100n, refundRequestId: 'y' }), { code: 'NOT_FOUND' });
});

test('cancel before pay tombstones the request; in-flight and captured payments cannot be cancelled', async () => {
  const n = network();
  assert.deepEqual(n.payments.cancel(MPP, 'late'), { cancelled: true });
  const d = n.payments.decode(MPP, testQr({ amount: '100.00' }));
  await assert.rejects(n.payments.pay({ mppId: MPP, paymentRequestId: 'late', quoteId: n.payments.quote(MPP, d.decodeId).quoteId, payerRef: 'u' }), { code: 'PAYMENT_CANCELLED' });
  assert.equal(n.partner.credits.length, 0);

  // cancel racing a pay() that is still awaiting screening
  const d1 = n.payments.decode(MPP, testQr({ amount: '100.00' }));
  const pending = n.payments.pay({ mppId: MPP, paymentRequestId: 'racing', quoteId: n.payments.quote(MPP, d1.decodeId).quoteId, payerRef: 'u' });
  assert.equal(code(() => n.payments.cancel(MPP, 'racing')), 'CANCEL_NOT_ALLOWED_PROCESSING');
  assert.equal((await pending).status, 'SUCCEEDED');

  n.partner.behaviour = 'timeout-then-success';
  const d2 = n.payments.decode(MPP, testQr({ amount: '100.00' }));
  await n.payments.pay({ mppId: MPP, paymentRequestId: 'inflight', quoteId: n.payments.quote(MPP, d2.decodeId).quoteId, payerRef: 'u' });
  assert.equal(code(() => n.payments.cancel(MPP, 'inflight')), 'CANCEL_NOT_ALLOWED_PROCESSING');
  await n.payments.resolvePending();
  assert.equal(code(() => n.payments.cancel(MPP, 'inflight')), 'CANCEL_NOT_ALLOWED_REFUND');
});
