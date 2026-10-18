// Malaysia – DuitNow QR (PayNet "QR Generation Specification – MPM" v1.5) on RPP.
// Single national template at ID 26 with AID A0000006150001; sub 01 is the 6-digit
// acquirer ID from PayNet's participant directory. PayNet's PFI is "02", not EMVCo's "01".

import { buildMpm } from '../emvco/mpm.ts';
import { QUASI_CASH_MCC, type SchemeDefinition } from './types.ts';

export const DUITNOW_AID = 'A0000006150001';
/** JomPAY bill payment acquirer ID – a biller code, not a merchant. */
export const JOMPAY_ACQUIRER = '898989';

export const duitNow: SchemeDefinition = {
  schemeId: 'MY.DUITNOW',
  country: 'MY',
  name: 'DuitNow QR',
  rail: 'DuitNow / RPP (PayNet)',
  currency: 'MYR',
  guids: [DUITNOW_AID],
  routingKey: 'MY:PAYNET',
  interpret(acct, p) {
    const acquirerId = acct.fields.get('01');
    const qrId = acct.fields.get('02');
    if (!acquirerId || !qrId) return null;
    const notes: string[] = [];
    let paymentType: 'P2M' | 'P2P' | 'BILL' = 'P2M';
    if (acquirerId === JOMPAY_ACQUIRER) {
      paymentType = 'BILL';
      notes.push('JomPAY bill payment code');
    } else if (p.mcc === '0000') {
      paymentType = 'P2P';
      notes.push('MCC 0000: person-to-person DuitNow QR');
    } else if (p.mcc && QUASI_CASH_MCC.has(p.mcc)) {
      notes.push(`MCC ${p.mcc} is cash withdrawal / quasi-cash (PayNet: 6010 = POS cash withdrawal)`);
    }
    const references: Record<string, string> = {};
    for (const [k, name] of [['05', 'referenceLabel'], ['07', 'terminalLabel'], ['90', 'rrn1'], ['91', 'rrn2']] as const) {
      const v = p.additionalData?.all.get(k);
      if (v) references[name] = v;
    }
    return {
      paymentType,
      routing: { acquirerId, merchantId: qrId, account: qrId, proxyType: 'QR_ID', references },
      altRoutingKeys: [`MY:ACQ:${acquirerId}`],
      confidence: 1,
      notes,
    };
  },
};

export function sampleDuitNowQr(o: { amount?: string; acquirerId?: string } = {}): string {
  return buildMpm({
    payloadFormat: '02',
    initiation: o.amount ? 'dynamic' : 'static',
    accounts: [{ tag: '26', fields: [['00', DUITNOW_AID], ['01', o.acquirerId ?? '629196'], ['02', 'QRMER000001234']] }],
    mcc: '5814',
    currencyNumeric: '458',
    amount: o.amount,
    countryCode: 'MY',
    merchantName: 'NASI LEMAK KL',
    merchantCity: 'KUALA LUMPUR',
    additional: [['07', 'T001'], ['11', '400']],
  });
}
