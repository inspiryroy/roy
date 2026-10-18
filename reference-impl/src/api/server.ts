// HTTP/JSON facade for MPPs (wallets) and operations. Amounts travel as strings
// of integer minor units. Requests from MPPs are authenticated with an HMAC
// signature header in this reference; production uses mTLS plus asymmetric
// request signing (as Alipay+ does with RSA-SHA256) and key rotation.

import { createHmac, timingSafeEqual } from 'node:crypto';
import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import { PaymentError, type PaymentService } from '../payments/service.ts';
import type { SettlementEngine } from '../settlement/engine.ts';

export interface ApiDeps {
  payments: PaymentService;
  settlement: SettlementEngine;
  /** Shared secret per MPP id; when absent, signatures are not checked (local demo only). */
  mppSecrets?: Record<string, string>;
  clock?: () => number;
}

const json = (v: unknown) => JSON.stringify(v, (_k, x) => (typeof x === 'bigint' ? x.toString() : x instanceof Map ? Object.fromEntries(x) : x));

export function sign(secret: string, timestamp: number, body: string): string {
  return `t=${timestamp},v1=${createHmac('sha256', secret).update(`${timestamp}.${body}`).digest('hex')}`;
}

function verify(secret: string, header: string | undefined, body: string, now: number): boolean {
  const m = /^t=(\d+),v1=([0-9a-f]{64})$/.exec(header ?? '');
  if (!m) return false;
  const t = Number(m[1]);
  if (Math.abs(now - t) > 5 * 60_000) return false;
  const expected = Buffer.from(sign(secret, t, body).split('v1=')[1]!, 'hex');
  return timingSafeEqual(expected, Buffer.from(m[2]!, 'hex'));
}

async function readBody(req: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const c of req) chunks.push(c as Buffer);
  return Buffer.concat(chunks).toString('utf8');
}

const big = (v: unknown, name: string): bigint | undefined => {
  if (v === undefined || v === null || v === '') return undefined;
  if (typeof v !== 'string' || !/^\d+$/.test(v)) throw new PaymentError('BAD_REQUEST', `${name} must be a string of integer minor units`);
  return BigInt(v);
};

export function createApi(deps: ApiDeps): Server {
  const now = deps.clock ?? (() => Date.now());
  return createServer(async (req: IncomingMessage, res: ServerResponse) => {
    const send = (code: number, body: unknown) => {
      res.writeHead(code, { 'content-type': 'application/json' });
      res.end(json(body));
    };
    try {
      const url = new URL(req.url ?? '/', 'http://local');
      const raw = req.method === 'POST' ? await readBody(req) : '';
      const body = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
      const mppId = (body.mppId as string | undefined) ?? (req.headers['x-mpp-id'] as string | undefined);
      if (deps.mppSecrets && url.pathname.startsWith('/v1/') && !url.pathname.startsWith('/v1/settlement')) {
        const secret = mppId ? deps.mppSecrets[mppId] : undefined;
        if (!secret || !verify(secret, req.headers['signature'] as string | undefined, raw, now())) {
          return send(401, { error: { code: 'UNAUTHENTICATED', message: 'bad or missing signature' } });
        }
      }

      if (req.method === 'POST' && url.pathname === '/v1/qr/decode') {
        return send(200, deps.payments.decode(String(body.mppId), String(body.qrCode)));
      }
      if (req.method === 'POST' && url.pathname === '/v1/quotes') {
        return send(200, deps.payments.quote(String(body.decodeId), { amountMinor: big(body.amount, 'amount'), tipMinor: big(body.tip, 'tip') }));
      }
      if (req.method === 'POST' && url.pathname === '/v1/payments') {
        const p = await deps.payments.pay({
          mppId: String(body.mppId),
          paymentRequestId: String(body.paymentRequestId ?? req.headers['idempotency-key'] ?? ''),
          quoteId: String(body.quoteId),
          payerRef: String(body.payerRef ?? ''),
        });
        return send(p.status === 'PROCESSING' ? 202 : 200, p);
      }
      const pm = /^\/v1\/payments\/([A-Z0-9]+)(\/refunds)?$/.exec(url.pathname);
      if (pm && req.method === 'GET' && !pm[2]) {
        const p = deps.payments.get(pm[1]!);
        return p ? send(200, p) : send(404, { error: { code: 'NOT_FOUND', message: 'payment not found' } });
      }
      if (pm && req.method === 'POST' && pm[2]) {
        return send(200, await deps.payments.refund(pm[1]!, big(body.amount, 'amount') ?? 0n));
      }
      if (req.method === 'POST' && url.pathname === '/v1/settlement/cycles') {
        return send(200, await deps.settlement.closeCycle(String(body.cycleId)));
      }
      return send(404, { error: { code: 'NOT_FOUND', message: `${req.method} ${url.pathname}` } });
    } catch (e) {
      if (e instanceof PaymentError) return send(e.code === 'RISK_REJECTED' ? 403 : 422, { error: { code: e.code, message: e.message } });
      if (e instanceof SyntaxError) return send(400, { error: { code: 'BAD_JSON', message: e.message } });
      return send(500, { error: { code: 'INTERNAL', message: (e as Error).message } });
    }
  });
}
