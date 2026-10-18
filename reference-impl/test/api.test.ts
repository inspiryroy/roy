import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, test } from 'node:test';
import { createApi, type Role, sign } from '../src/api/server.ts';
import { createNetwork } from '../src/network.ts';
import { sampleThaiMerchantQr } from '../src/schemes/th.ts';

const net = createNetwork();
const thaiLsp = net.partners.find(p => p.routingKeys.includes('TH:NITMX'))!.id;
const clients: Record<string, { secret: string; role: Role }> = {
  PAYPAY: { secret: 'mpp-secret', role: 'mpp' },
  OTHERWALLET: { secret: 'other-secret', role: 'mpp' },
  [thaiLsp]: { secret: 'lsp-secret', role: 'lsp' },
  OPS: { secret: 'ops-secret', role: 'ops' },
};
const server = createApi({ payments: net.payments, settlement: net.settlement, clients });
let base = '';
let t = Date.now();

before(async () => {
  await new Promise<void>(r => server.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});
after(() => new Promise<void>(r => server.close(() => r())));

async function call(method: 'GET' | 'POST', path: string, body: unknown, as = 'PAYPAY', opts: { secret?: string; reuse?: string } = {}) {
  const raw = body === undefined ? '' : JSON.stringify(body);
  const sig = opts.reuse ?? sign(opts.secret ?? clients[as]!.secret, method, path, as, ++t, raw);
  const res = await fetch(base + path, {
    method,
    headers: { 'content-type': 'application/json', 'client-id': as, signature: sig },
    body: method === 'POST' ? raw : undefined,
  });
  return { status: res.status, body: (await res.json()) as Record<string, any>, sig };
}

test('rejects wrong, missing-role and replayed signatures', async () => {
  const qr = { qrCode: sampleThaiMerchantQr() };
  assert.equal((await call('POST', '/v1/qr/decode', qr, 'PAYPAY', { secret: 'wrong' })).status, 401);
  const ok = await call('POST', '/v1/qr/decode', qr);
  assert.equal(ok.status, 200);
  assert.equal((await call('POST', '/v1/qr/decode', qr, 'PAYPAY', { reuse: ok.sig })).status, 401, 'replay');
  assert.equal((await call('POST', '/v1/settlement/cycles', { cycleId: 'X' })).status, 403, 'MPP cannot settle');
  assert.equal((await call('POST', '/v1/qr/decode', qr, 'OPS')).status, 403, 'OPS is not a wallet');
});

test('decode → quote → pay → get over HTTP; other wallets cannot see the payment', async () => {
  const d = await call('POST', '/v1/qr/decode', { qrCode: sampleThaiMerchantQr({ amount: '350.00' }) });
  assert.equal(d.status, 200);
  assert.equal(d.body.scheme.schemeId, 'TH.THAIQR');
  assert.equal(d.body.amountMinor, '35000');
  assert.equal((await call('POST', '/v1/quotes', { decodeId: d.body.decodeId }, 'OTHERWALLET')).status, 404);
  const q = await call('POST', '/v1/quotes', { decodeId: d.body.decodeId });
  assert.equal(q.status, 200);
  const p = await call('POST', '/v1/payments', { paymentRequestId: 'http-1', quoteId: q.body.quoteId, payerRef: 'u1' });
  assert.equal(p.status, 200);
  assert.equal(p.body.status, 'SUCCEEDED');
  assert.equal((await call('GET', `/v1/payments/${p.body.paymentId}`, undefined)).body.paymentRequestId, 'http-1');
  assert.equal((await call('GET', `/v1/payments/${p.body.paymentId}`, undefined, 'OTHERWALLET')).status, 404);

  // refunds come from the LSP, not from a wallet
  assert.equal((await call('POST', '/v1/lsp/refunds', { paymentId: p.body.paymentId, amount: '1000', refundRequestId: 'a' })).status, 403);
  const r1 = await call('POST', '/v1/lsp/refunds', { paymentId: p.body.paymentId, amount: '1000', refundRequestId: 'a' }, thaiLsp);
  const r2 = await call('POST', '/v1/lsp/refunds', { paymentId: p.body.paymentId, amount: '1000', refundRequestId: 'a' }, thaiLsp);
  assert.equal(r1.status, 200);
  assert.equal(r2.body.refundId, r1.body.refundId, 'idempotent');

  const c = await call('POST', '/v1/settlement/cycles', { cycleId: 'HTTP-1' }, 'OPS');
  assert.equal(c.status, 200);
  assert.equal((await call('POST', '/v1/settlement/cycles', { cycleId: 'HTTP-1' }, 'OPS')).status, 409);
});

test('business and request errors map to 4xx, never 500', async () => {
  const bad = await call('POST', '/v1/qr/decode', { qrCode: '000201010211' });
  assert.deepEqual([bad.status, bad.body.error.code], [422, 'INVALID_QR']);
  const q = await call('POST', '/v1/quotes', { decodeId: 'nope', amount: '12.5' });
  assert.deepEqual([q.status, q.body.error.code], [400, 'BAD_REQUEST']);
  const missing = await call('POST', '/v1/payments', { quoteId: 'Q1' });
  assert.deepEqual([missing.status, missing.body.error.code], [400, 'BAD_REQUEST']);
  const nul = await call('POST', '/v1/qr/decode', null);
  assert.equal(nul.status, 400);
});
