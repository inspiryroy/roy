// Starts the HTTP API on an in-memory demo network.
//   PORT=8787 MPP_SECRET=dev-secret node src/api/main.ts
import { createNetwork } from '../network.ts';
import { createApi } from './server.ts';

const net = createNetwork();
const secret = process.env.MPP_SECRET;
const port = Number(process.env.PORT ?? 8787);
createApi({ payments: net.payments, settlement: net.settlement, mppSecrets: secret ? { PAYPAY: secret } : undefined }).listen(port, () => {
  console.log(`qr-bridge API listening on http://localhost:${port} (signatures ${secret ? 'required' : 'disabled'})`);
});
