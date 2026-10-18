// Indonesia – QRIS (Bank Indonesia; specification maintained by ASPI, not public).
// A QRIS code carries one or more acquirer (PJSP) templates in IDs 26–45 – reverse-domain
// GUIDs such as "COM.NOBUBANK.WWW", sub 01 = Merchant PAN whose first 8 digits are the
// acquirer's NNS – plus the national domain at ID 51: GUID "ID.CO.QRIS.WWW",
// sub 02 = NMID ("ID" + 13 digits), sub 03 = merchant criteria (UMI/UKE/UME/UBE/URE).
// Layout from open-source implementations and CRC-valid sample payloads.

import { buildMpm } from '../emvco/mpm.ts';
import { refs, type SchemeDefinition } from './types.ts';

export const QRIS_GUID = 'ID.CO.QRIS.WWW';
const CRITERIA = new Set(['UMI', 'UKE', 'UME', 'UBE', 'URE']);
/** Money-transfer / quasi-cash MCCs that should not ride a merchant-payment route. */
const TRANSFER_MCC = new Set(['4829', '6012', '6051']);

export const qris: SchemeDefinition = {
  schemeId: 'ID.QRIS',
  country: 'ID',
  name: 'QRIS',
  rail: 'QRIS via GPN switching (ASPI)',
  currency: 'IDR',
  guids: [QRIS_GUID],
  routingKey: 'ID:QRIS-XB',
  interpret(acct, p) {
    const nmid = acct.fields.get('02');
    if (!nmid) return null;
    const notes: string[] = [];
    if (!/^ID\d{13}$/.test(nmid)) notes.push(`NMID "${nmid}" does not match ID + 13 digits`);
    const criteria = acct.fields.get('03');
    if (criteria && !CRITERIA.has(criteria)) notes.push(`unknown merchant criteria "${criteria}"`);
    // Acquirer domains: IDs 26–45 whose sub 01 is a Merchant PAN starting with 9360.
    const pjsp = p.merchantAccounts.filter(a => Number(a.tag) >= 26 && Number(a.tag) <= 45 && /^9360\d{4}/.test(a.fields.get('01') ?? ''));
    const primary = pjsp[0];
    const nns = primary?.fields.get('01')?.slice(0, 8);
    if (!primary) notes.push('no acquirer (PJSP) template with a Merchant PAN');
    if (p.mcc && TRANSFER_MCC.has(p.mcc)) notes.push(`MCC ${p.mcc} is a money-transfer/quasi-cash category: review before accepting`);
    return {
      paymentType: 'P2M',
      routing: {
        acquirerId: nns,
        merchantId: nmid,
        account: primary?.fields.get('01'),
        proxyType: 'MPAN',
        references: refs({
          acquirerGuid: primary?.guid,
          acquirerMerchantId: primary?.fields.get('02'),
          criteria,
          billNumber: p.additionalData?.billNumber,
          referenceLabel: p.additionalData?.referenceLabel,
          terminal: p.additionalData?.terminalLabel,
        }),
      },
      altRoutingKeys: nns ? [`ID:NNS:${nns}`] : [],
      confidence: 1,
      notes,
    };
  },
};

export function sampleQris(o: { amount?: string } = {}): string {
  return buildMpm({
    initiation: o.amount ? 'dynamic' : 'static',
    accounts: [
      { tag: '26', fields: [['00', 'COM.EXAMPLEBANK.WWW'], ['01', '936099990000012345'], ['02', '000000012345'], ['03', 'UMI']] },
      { tag: '51', fields: [['00', QRIS_GUID], ['02', 'ID2026000000001'], ['03', 'UMI']] },
    ],
    mcc: '5812',
    currencyNumeric: '360',
    amount: o.amount,
    countryCode: 'ID',
    merchantName: 'WARUNG BABI GULING',
    merchantCity: 'DENPASAR',
    postalCode: '80361',
    additional: [['07', 'A01']],
  });
}
