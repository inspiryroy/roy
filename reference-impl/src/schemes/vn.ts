// Vietnam – VietQR (NAPAS, on Napas 247) and the separate VNPAY-QR network.
// VietQR: ID 38, GUID A000000727; sub 01 is a nested template (00 = 6-digit beneficiary
// institution BIN, 01 = account or card number); sub 02 = service code
// (QRIBFTTA = to account, QRIBFTTC = to card). There is no explicit P2M flag; personal
// transfer codes usually omit 52/59/60. Layout from open-source codecs and CRC-valid samples.

import { buildMpm } from '../emvco/mpm.ts';
import { encodeTlv, parseTlv } from '../emvco/tlv.ts';
import { refs, type SchemeDefinition } from './types.ts';

export const VIETQR_GUID = 'A000000727';
export const VNPAYQR_GUID = 'A000000775';

export const vietQr: SchemeDefinition = {
  schemeId: 'VN.VIETQR',
  country: 'VN',
  name: 'VietQR',
  rail: 'Napas 247 (NAPAS)',
  currency: 'VND',
  guids: [VIETQR_GUID],
  routingKey: 'VN:NAPAS',
  interpret(acct, p) {
    const beneficiary = acct.fields.get('01');
    if (!beneficiary) return null;
    let bin: string | undefined;
    let account: string | undefined;
    try {
      const m = new Map(parseTlv(beneficiary).map(o => [o.id, o.value]));
      bin = m.get('00');
      account = m.get('01');
    } catch {
      return null;
    }
    if (!bin || !account) return null;
    const service = acct.fields.get('02');
    const merchantLike = Boolean(p.merchantName && p.mcc && p.mcc !== '0000');
    const references = refs({
      purpose: p.additionalData?.purpose,
      billNumber: p.additionalData?.billNumber,
      referenceLabel: p.additionalData?.referenceLabel,
    });
    return {
      paymentType: merchantLike ? 'P2M' : 'P2P',
      routing: { acquirerId: bin, account, proxyType: service === 'QRIBFTTC' ? 'CARD' : 'ACCOUNT', references },
      altRoutingKeys: [`VN:BIN:${bin}`],
      confidence: merchantLike ? 0.8 : 0.9,
      notes: [
        'VietQR has no explicit P2M flag: classified from merchant name + MCC',
        ...(merchantLike ? [] : ['resolve payee name via NAPAS account inquiry before display']),
      ],
    };
  },
};

export const vnpayQr: SchemeDefinition = {
  schemeId: 'VN.VNPAYQR',
  country: 'VN',
  name: 'VNPAY-QR',
  rail: 'VNPAY',
  currency: 'VND',
  guids: [VNPAYQR_GUID],
  routingKey: 'VN:VNPAY',
  interpret(acct, p) {
    const mid = acct.fields.get('01');
    if (!mid) return null;
    return {
      paymentType: 'P2M',
      routing: { merchantId: mid, references: refs({ terminal: p.additionalData?.terminalLabel }) },
      confidence: 0.8,
      notes: ['VNPAY-QR network: acceptance through the NAPAS cross-border channel unconfirmed'],
    };
  },
};

export function sampleVietQrMerchant(o: { amount?: string } = {}): string {
  return buildMpm({
    initiation: o.amount ? 'dynamic' : 'static',
    accounts: [{ tag: '38', fields: [['00', VIETQR_GUID], ['01', encodeTlv([{ id: '00', value: '970436' }, { id: '01', value: '1234567890' }])], ['02', 'QRIBFTTA']] }],
    mcc: '5812',
    currencyNumeric: '704',
    amount: o.amount,
    countryCode: 'VN',
    merchantName: 'PHO HANOI 36',
    merchantCity: 'HA NOI',
    additional: [['08', 'PAYMENT']],
  });
}
