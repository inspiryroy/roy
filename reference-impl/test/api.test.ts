import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, test } from 'node:test';
import { createApi, sign } from '../src/api/server.ts';
import { createNetwork } from '../src/network.ts';
import { sampleThaiMerchantQr } from '../src/schemes/th.ts';

const SECRET = 'test-secret';
const net = createNetwork();
const server = createApi({ payments: net.payments, settlement: net.settlement, mppSecrets: { PAYPAY: SECRET } });
let base = '';

before(async () => {
  await new Promise<void>(r => server.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});
after(() => new Promise<void>(r => server.close(() => r())));

async function post(path: string, body: unknown, opts: { secret?: string; badSig?: boolean } = {}) {
  const raw = JSON.stringify(body);
  const sig = sign(opts.secret ?? SECRET, Date.now(), raw);
  const res = await fetch(base + path, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-mpp-id': 'PAYPAY', signature: opts.badSig ? sig.replace(/.$/, '0') : sig },
    body: raw,
  });
  return { status: res.status, body: (await res.json()) as Record<string, any> };
}

test('rejects unsigned or wrongly signed requests', async () => {
  const r1 = await post('/v1/qr/decode', { mppId: 'PAYPAY', qrCode: sampleThaiMerchantQr() }, { secret: 'wrong' });
  assert.equal(r1.status, 401);
  const r2 = await post('/v1/qr/decode', { mppId: 'PAYPAY', qrCode: sampleThaiMerchantQr() }, { badSig: true });
  assert.equal(r2.status, 401);
});

test('decode → quote → pay → get over HTTP', async () => {
  const d = await post('/v1/qr/decode', { mppId: 'PAYPAY', qrCode: sampleThaiMerchantQr({ amount: '350.00' }) });
  assert.equal(d.status, 200);
  assert.equal(d.body.scheme.schemeId, 'TH.THAIQR');
  assert.equal(d.body.amountMinor, '35000');

  const q = await post('/v1/quotes', { mppId: 'PAYPAY', decodeId: d.body.decodeId });
  assert.equal(q.status, 200);
  assert.match(q.body.payer.amountMinor, /^\d+$/);

  const p = await post('/v1/payments', { mppId: 'PAYPAY', paymentRequestId: 'http-1', quoteId: q.body.quoteId, payerRef: 'u1' });
  assert.equal(p.status, 200);
  assert.equal(p.body.status, 'SUCCEEDED');

  const raw = '';
  const g = await fetch(`${base}/v1/payments/${p.body.paymentId}`, { headers: { 'x-mpp-id': 'PAYPAY', signature: sign(SECRET, Date.now(), raw) } });
  assert.equal(g.status, 200);
  assert.equal(((await g.json()) as { paymentRequestId: string }).paymentRequestId, 'http-1');
});

test('business errors map to 422 with a code', async () => {
  const r = await post('/v1/qr/decode', { mppId: 'PAYPAY', qrCode: '000201010211' });
  assert.equal(r.status, 422);
  assert.equal(r.body.error.code, 'INVALID_QR');
  const q = await post('/v1/quotes', { mppId: 'PAYPAY', decodeId: 'nope', amount: '12.5' });
  assert.equal(q.status, 422);
  assert.equal(q.body.error.code, 'BAD_REQUEST');
});
