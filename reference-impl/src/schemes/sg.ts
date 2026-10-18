// Singapore – SGQR (MAS/IMDA) is a *label* that stacks several schemes in IDs 26–50;
// positions are not fixed, so routing is strictly by the sub-00 GUID. ID 51 (SG.SGQR)
// is label metadata (SGQR ID, version, postal code, level, unit) and never a payment route.
// GUIDs and sub-tags come from several consistent open-source parsers plus a CRC-valid
// label; the official MAS/IMDA specification was not obtained.

import { buildMpm } from '../emvco/mpm.ts';
import type { SchemeDefinition } from './types.ts';

export const SG_GUID = { PAYNOW: 'SG.PAYNOW', NETS: 'SG.COM.NETS', SGQR: 'SG.SGQR', GRAB: 'COM.GRAB' } as const;

/** "YYYYMMDD" or "YYYYMMDDHHMMSS" (both forms seen in the field), interpreted in SGT. */
function paynowExpiry(v: string | undefined): number | undefined {
  if (!v || !/^\d{8}(\d{6})?$/.test(v)) return undefined;
  const iso = `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}T${v.length === 14 ? `${v.slice(8, 10)}:${v.slice(10, 12)}:${v.slice(12, 14)}` : '23:59:59'}+08:00`;
  const t = Date.parse(iso);
  return Number.isNaN(t) ? undefined : t;
}

export const payNow: SchemeDefinition = {
  schemeId: 'SG.PAYNOW',
  country: 'SG',
  name: 'PayNow (SGQR)',
  rail: 'PayNow / FAST',
  currency: 'SGD',
  guids: [SG_GUID.PAYNOW],
  routingKey: 'SG:FAST',
  interpret(acct) {
    const type = acct.fields.get('01');
    const value = acct.fields.get('02');
    if (!type || !value) return null;
    const isUen = type === '2';
    return {
      // UEN proxies identify registered entities; mobile proxies are individuals.
      paymentType: isUen ? 'P2M' : 'P2P',
      routing: { account: value, proxyType: isUen ? 'UEN' : 'MOBILE', references: {} },
      confidence: 0.9,
      notes: acct.fields.get('03') === '0' ? ['amount not editable (PayNow 03=0)'] : [],
      qrExpiresAt: paynowExpiry(acct.fields.get('04')),
    };
  },
};

export const netsQr: SchemeDefinition = {
  schemeId: 'SG.NETS',
  country: 'SG',
  name: 'NETS QR (SGQR)',
  rail: 'NETS',
  currency: 'SGD',
  guids: [SG_GUID.NETS],
  routingKey: 'SG:NETS',
  interpret(acct) {
    const mid = acct.fields.get('02');
    if (!mid) return null;
    return {
      paymentType: 'P2M',
      routing: { merchantId: mid, references: { terminalId: acct.fields.get('03') ?? '', qrMetadata: acct.fields.get('01') ?? '' } },
      confidence: 1,
      notes: acct.fields.has('99') ? ['signed NETS payload (sub 99): forward verbatim to the NETS host'] : [],
    };
  },
};

export const grabPaySg: SchemeDefinition = {
  schemeId: 'SG.GRABPAY',
  country: 'SG',
  name: 'GrabPay (SGQR)',
  rail: 'GrabPay',
  currency: 'SGD',
  guids: [SG_GUID.GRAB],
  routingKey: 'SG:GRABPAY',
  interpret(acct) {
    return {
      paymentType: 'P2M',
      routing: { merchantId: acct.fields.get('01'), references: {} },
      confidence: 0.8,
      notes: ['private-scheme template'],
    };
  },
};

/** Synthetic SGQR label with NETS and PayNow (UEN) payloads plus SGQR metadata. */
export function sampleSgqr(o: { amount?: string } = {}): string {
  return buildMpm({
    initiation: o.amount ? 'dynamic' : 'static',
    accounts: [
      { tag: '26', fields: [['00', SG_GUID.PAYNOW], ['01', '2'], ['02', '201912345K'], ['03', o.amount ? '0' : '1']] },
      { tag: '28', fields: [['00', SG_GUID.NETS], ['01', '12345678901234567890123'], ['02', '11223344556'], ['03', 'T0001']] },
      { tag: '51', fields: [['00', SG_GUID.SGQR], ['01', '2410180001AB'], ['02', '01.0001'], ['03', '238823'], ['04', '01'], ['05', '12']] },
    ],
    mcc: '5812',
    currencyNumeric: '702',
    amount: o.amount,
    countryCode: 'SG',
    merchantName: 'MAXWELL CHICKEN RICE',
    merchantCity: 'Singapore',
  });
}
