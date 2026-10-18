// Cambodia – KHQR (National Bank of Cambodia, on Bakong). KHQR deviates from EMVCo:
// sub-00 of templates 29 (individual) and 30 (merchant) is a Bakong account ID
// ("name@bankdomain") rather than a GUID, so it is matched structurally. 30-01 = merchant
// ID, 30-02 / 29-02 = acquiring bank; ID 99 = timestamp template (00 created, 01 expires,
// epoch milliseconds – mandatory on dynamic codes). Currency KHR (116) or USD (840).
// Layout from the NBC-published JavaScript SDK and its test vectors.

import { buildMpm } from '../emvco/mpm.ts';
import type { MerchantAccount, MpmPayload } from '../emvco/mpm.ts';
import { refs, type SchemeDefinition } from './types.ts';

const BAKONG_ID = /^[A-Za-z0-9._-]+@[A-Za-z0-9]+$/;

function expiry(p: MpmPayload): number | undefined {
  const ts = p.unreserved.find(u => u.tag === '99');
  const v = ts?.fields.get('01');
  return v && /^\d{13}$/.test(v) ? Number(v) : undefined;
}

export function khqr(clock: () => number = () => Date.now()): SchemeDefinition {
  return {
    schemeId: 'KH.KHQR',
    country: 'KH',
    name: 'KHQR',
    rail: 'Bakong (NBC)',
    currency: 'KHR',
    otherCurrencies: ['USD'],
    guids: [],
    templateTags: ['29', '30'],
    matchTemplate: (acct: MerchantAccount) => BAKONG_ID.test(acct.fields.get('00') ?? ''),
    routingKey: 'KH:BAKONG',
    interpret(acct, p) {
      const bakongId = acct.fields.get('00')!;
      const exp = expiry(p);
      if (p.initiation === 'dynamic' && exp !== undefined && exp < clock()) return null;
      const domain = bakongId.split('@')[1]!;
      const isMerchant = acct.tag === '30';
      const notes: string[] = [];
      if (p.initiation === 'dynamic' && exp === undefined) notes.push('dynamic KHQR without expiry timestamp (ID 99-01)');
      if (p.currencyNumeric === '840') notes.push('USD-denominated KHQR: cross-border channels are reported to debit KHR only – confirm with NBC');
      return {
        paymentType: isMerchant ? 'P2M' : 'P2P',
        routing: {
          acquirerId: acct.fields.get('02') ?? domain,
          merchantId: isMerchant ? acct.fields.get('01') : undefined,
          account: bakongId,
          proxyType: 'BAKONG_ID',
          references: refs({ billNumber: p.additionalData?.billNumber }),
        },
        altRoutingKeys: [`KH:BANK:${domain}`],
        confidence: 0.9,
        notes,
      };
    },
  };
}

export function sampleKhqrMerchant(o: { amount?: string; currency?: 'KHR' | 'USD'; createdAt?: number; ttlMs?: number } = {}): string {
  const created = o.createdAt ?? Date.parse('2026-10-18T09:00:00Z');
  const unreserved = o.amount
    ? [{ tag: '99', fields: [['00', String(created)], ['01', String(created + (o.ttlMs ?? 10 * 60_000))]] as Array<[string, string]> }]
    : [];
  return buildMpm({
    initiation: o.amount ? 'dynamic' : 'static',
    accounts: [{ tag: '30', fields: [['00', 'angkorcafe@exbk'], ['01', 'MID000123'], ['02', 'Example Bank']] }],
    mcc: '5812',
    currencyNumeric: o.currency === 'USD' ? '840' : '116',
    amount: o.amount,
    countryCode: 'KH',
    merchantName: 'ANGKOR CAFE',
    merchantCity: 'SIEM REAP',
    unreserved,
  });
}
