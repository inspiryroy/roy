// Starts the HTTP API on an in-memory demo network.
//   PORT=8787 node src/api/main.ts                       – open local-demo mode (no auth)
//   MPP_SECRET=a LSP_SECRET=b OPS_SECRET=c node src/api/main.ts – signed requests required
import { createNetwork } from '../network.ts';
import { createApi, type Role } from './server.ts';

const net = createNetwork();
const port = Number(process.env.PORT ?? 8787);
const clients: Record<string, { secret: string; role: Role }> = {};
if (process.env.MPP_SECRET) clients.PAYPAY = { secret: process.env.MPP_SECRET, role: 'mpp' };
if (process.env.LSP_SECRET) for (const p of net.partners) clients[p.id] = { secret: process.env.LSP_SECRET, role: 'lsp' };
if (process.env.OPS_SECRET) clients.OPS = { secret: process.env.OPS_SECRET, role: 'ops' };
const secured = Object.keys(clients).length > 0;
createApi({ payments: net.payments, settlement: net.settlement, clients: secured ? clients : undefined }).listen(port, '127.0.0.1', () => {
  console.log(`qr-bridge API on http://127.0.0.1:${port} – ${secured ? 'signed requests required' : 'OPEN DEMO MODE (no authentication)'}`);
});
