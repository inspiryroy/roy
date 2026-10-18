// Laos – LAO QR (Bank of the Lao PDR, operated by LAPNet). Layout inferred from multiple
// CRC-valid production payloads; the LAPNet specification is not public.
// ID 38, GUID A005266284662577: 01 = 8-digit issuer IIN (4-digit member + "0418"),
// 02 = service (001 transfer / 002 merchant payment / 003 bill), 03 = payee token.

import { buildMpm } from '../emvco/mpm.ts';
import type { SchemeDefinition } from './types.ts';

export const LAOQR_GUID = 'A005266284662577';

export const laoQr: SchemeDefinition = {
  schemeId: 'LA.LAOQR',
  country: 'LA',
  name: 'LAO QR',
  rail: 'LAPNet',
  currency: 'LAK',
  guids: [LAOQR_GUID],
  routingKey: 'LA:LAPNET',
  interpret(acct) {
    const iin = acct.fields.get('01');
    const service = acct.fields.get('02');
    const token = acct.fields.get('03');
    if (!iin || !token) return null;
    const paymentType = service === '002' ? 'P2M' : service === '003' ? 'BILL' : 'P2P';
    return {
      paymentType,
      routing: { acquirerId: iin, account: token, proxyType: 'LAPNET_TOKEN', references: { service: service ?? '' } },
      altRoutingKeys: [`LA:IIN:${iin}`],
      confidence: 0.85,
      notes: ['layout inferred from production payloads (LAPNet spec not public)', ...(paymentType === 'P2M' ? [] : ['no merchant name in personal LAO QR: resolve payee via INQUIRY'])],
    };
  },
};

export function sampleLaoQr(o: { amount?: string } = {}): string {
  return buildMpm({
    initiation: o.amount ? 'dynamic' : 'static',
    accounts: [{ tag: '38', fields: [['00', LAOQR_GUID], ['01', '27710418'], ['02', '002'], ['03', 'MERCHANTTOKEN0001']] }],
    mcc: '5812',
    currencyNumeric: '418',
    amount: o.amount,
    countryCode: 'LA',
    merchantName: 'KHAO PIAK SEN',
    merchantCity: 'VIENTIANE',
  });
}
