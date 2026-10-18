// HTTP/JSON facade. Amounts travel as strings of integer minor units.
//
// Authentication (reference): every client – MPP (wallet), LSP (local settlement partner)
// or OPS (network operations) – has a shared secret and signs
//     "<METHOD> <PATH>\n<Client-Id>.<timestamp>.<body>"
// with HMAC-SHA256 (header `Signature: t=<ms>,v1=<hex>`, client in `Client-Id`), mirroring
// the docs/07 signing string; a signature is accepted once within a 5-minute window.
// Production uses mTLS plus asymmetric request signing (as Alipay+ does with RSA-SHA256).
// With no clients configured the server runs in an open local-demo mode where the caller
// names itself in the body (`mppId` / `partnerId`) – never expose that mode.

import { createHmac, timingSafeEqual } from 'node:crypto';
import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import { PaymentError, type PaymentService } from '../payments/service.ts';
import type { SettlementEngine } from '../settlement/engine.ts';

export type Role = 'mpp' | 'lsp' | 'ops';

export interface ApiDeps {
  payments: PaymentService;
  settlement: SettlementEngine;
  /** Client-Id → credentials. Omit only for local demos. */
  clients?: Record<string, { secret: string; role: Role }>;
  clock?: () => number;
}

const WINDOW_MS = 5 * 60_000;
const json = (v: unknown) => JSON.stringify(v, (_k, x) => (typeof x === 'bigint' ? x.toString() : x instanceof Map ? Object.fromEntries(x) : x));

export function sign(secret: string, method: string, path: string, clientId: string, timestamp: number, body: string): string {
  const mac = createHmac('sha256', secret).update(`${method} ${path}\n${clientId}.${timestamp}.${body}`).digest('hex');
  return `t=${timestamp},v1=${mac}`;
}

async function readBody(req: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const c of req) chunks.push(c as Buffer);
  return Buffer.concat(chunks).toString('utf8');
}

const big = (v: unknown, name: string): bigint | undefined => {
  if (v === undefined || v === null || v === '') return undefined;
  if (typeof v !== 'string' || !/^\d{1,18}$/.test(v)) throw new PaymentError('BAD_REQUEST', `${name} must be a string of integer minor units`);
  return BigInt(v);
};

const str = (v: unknown, name: string): string => {
  if (typeof v !== 'string' || v === '') throw new PaymentError('BAD_REQUEST', `${name} is required`);
  return v;
};

export function createApi(deps: ApiDeps): Server {
  const now = deps.clock ?? (() => Date.now());
  const seen = new Map<string, number>(); // signature → expiry, for replay protection

  function authenticate(req: IncomingMessage, path: string, raw: string): { clientId: string; role: Role } | null {
    const clientId = req.headers['client-id'];
    if (typeof clientId !== 'string') return null;
    const c = deps.clients?.[clientId];
    const m = /^t=(\d+),v1=([0-9a-f]{64})$/.exec((req.headers['signature'] as string | undefined) ?? '');
    if (!c || !m) return null;
    const t = Number(m[1]);
    if (Math.abs(now() - t) > WINDOW_MS) return null;
    const expected = Buffer.from(sign(c.secret, req.method ?? '', path, clientId, t, raw).split('v1=')[1]!, 'hex');
    if (!timingSafeEqual(expected, Buffer.from(m[2]!, 'hex'))) return null;
    for (const [k, exp] of seen) if (exp < now()) seen.delete(k);
    if (seen.has(m[2]!)) return null;
    seen.set(m[2]!, t + WINDOW_MS);
    return { clientId, role: c.role };
  }

  return createServer(async (req: IncomingMessage, res: ServerResponse) => {
    const send = (code: number, body: unknown) => {
      res.writeHead(code, { 'content-type': 'application/json' });
      res.end(json(body));
    };
    const fail = (code: number, errCode: string, message: string) => send(code, { error: { code: errCode, message } });
    try {
      const url = new URL(req.url ?? '/', 'http://local');
      const raw = req.method === 'POST' ? await readBody(req) : '';
      let body: Record<string, unknown> = {};
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return fail(400, 'BAD_JSON', 'body must be a JSON object');
        body = parsed as Record<string, unknown>;
      }

      // Identity: authenticated client, or (demo mode only) self-declared in the body.
      let who: { clientId: string; role: Role } | null;
      if (deps.clients) {
        who = authenticate(req, url.pathname + url.search, raw);
        if (!who) return fail(401, 'UNAUTHENTICATED', 'bad, missing or replayed signature');
      } else {
        who = null;
      }
      const as = (role: Role, demoField: string): string => {
        if (who) {
          if (who.role !== role) throw new PaymentError('FORBIDDEN', `requires a ${role.toUpperCase()} client`);
          return who.clientId;
        }
        return str(body[demoField] ?? req.headers[`x-${demoField.toLowerCase()}`], demoField);
      };

      if (req.method === 'POST' && url.pathname === '/v1/qr/decode') {
        return send(200, deps.payments.decode(as('mpp', 'mppId'), str(body.qrCode, 'qrCode')));
      }
      if (req.method === 'POST' && url.pathname === '/v1/quotes') {
        return send(200, deps.payments.quote(as('mpp', 'mppId'), str(body.decodeId, 'decodeId'), { amountMinor: big(body.amount, 'amount'), tipMinor: big(body.tip, 'tip') }));
      }
      if (req.method === 'POST' && url.pathname === '/v1/payments') {
        const p = await deps.payments.pay({
          mppId: as('mpp', 'mppId'),
          paymentRequestId: str(body.paymentRequestId, 'paymentRequestId'),
          quoteId: str(body.quoteId, 'quoteId'),
          payerRef: typeof body.payerRef === 'string' ? body.payerRef : '',
        });
        return send(p.status === 'PROCESSING' ? 202 : 200, p);
      }
      if (req.method === 'POST' && url.pathname === '/v1/payments/cancel') {
        return send(200, deps.payments.cancel(as('mpp', 'mppId'), str(body.paymentRequestId, 'paymentRequestId')));
      }
      const pm = /^\/v1\/payments\/([A-Z0-9]+)$/.exec(url.pathname);
      if (pm && req.method === 'GET') {
        const p = deps.payments.get(pm[1]!, as('mpp', 'mppId'));
        return p ? send(200, p) : fail(404, 'NOT_FOUND', 'payment not found');
      }
      if (req.method === 'POST' && url.pathname === '/v1/lsp/refunds') {
        return send(
          200,
          await deps.payments.refund({
            partnerId: as('lsp', 'partnerId'),
            paymentId: str(body.paymentId, 'paymentId'),
            amountMinor: big(body.amount, 'amount') ?? 0n,
            refundRequestId: str(body.refundRequestId, 'refundRequestId'),
          }),
        );
      }
      if (req.method === 'POST' && url.pathname === '/v1/settlement/cycles') {
        if (who && who.role !== 'ops') return fail(403, 'FORBIDDEN', 'requires an OPS client');
        const cycleId = str(body.cycleId, 'cycleId');
        if (deps.settlement.cycle(cycleId)) return fail(409, 'CYCLE_CLOSED', `cycle ${cycleId} already closed`);
        return send(200, await deps.settlement.closeCycle(cycleId));
      }
      return fail(404, 'NOT_FOUND', `${req.method} ${url.pathname}`);
    } catch (e) {
      if (e instanceof PaymentError) {
        const status = e.code === 'FORBIDDEN' || e.code === 'RISK_REJECTED' ? 403 : e.code === 'BAD_REQUEST' ? 400 : e.code === 'NOT_FOUND' || e.code === 'DECODE_NOT_FOUND' ? 404 : 422;
        return fail(status, e.code, e.message);
      }
      if (e instanceof SyntaxError) return fail(400, 'BAD_JSON', e.message);
      return fail(500, 'INTERNAL', 'internal error');
    }
  });
}
