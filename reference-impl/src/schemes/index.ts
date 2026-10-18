// National scheme profiles. Each profile documents the evidence level of its
// identifiers; see docs/02-qr-interoperability.md for sources.
import { qris, sampleQris } from './id.ts';
import { khqr, sampleKhqrMerchant } from './kh.ts';
import { laoQr, sampleLaoQr } from './la.ts';
import { duitNow, sampleDuitNowQr } from './my.ts';
import { qrPh, sampleQrPhMerchant } from './ph.ts';
import { grabPaySg, netsQr, payNow, sampleSgqr } from './sg.ts';
import { samplePromptPayQr, sampleThaiMerchantQr, thaiQr } from './th.ts';
import type { SchemeDefinition } from './types.ts';
import { sampleVietQrMerchant, vietQr, vnpayQr } from './vn.ts';

export const ALL_SCHEMES: SchemeDefinition[] = [thaiQr, duitNow, payNow(), netsQr, grabPaySg, laoQr, qris, vietQr, vnpayQr, khqr(), qrPh];

export interface Sample {
  schemeId: string;
  qr: string;
  /** Amount the user types for a static QR, in local minor units. */
  enterAmountMinor?: bigint;
}

/** Synthetic merchant codes (fictitious merchants and accounts) used by the demo. */
export const SAMPLES: Sample[] = [
  { schemeId: 'TH.THAIQR', qr: sampleThaiMerchantQr(), enterAmountMinor: 12000n },
  { schemeId: 'TH.THAIQR', qr: sampleThaiMerchantQr({ amount: '350.00', bankCode: '004' }) },
  { schemeId: 'MY.DUITNOW', qr: sampleDuitNowQr({ amount: '18.50' }) },
  { schemeId: 'SG.NETS', qr: sampleSgqr(), enterAmountMinor: 650n },
  { schemeId: 'LA.LAOQR', qr: sampleLaoQr({ amount: '150000' }) },
  { schemeId: 'ID.QRIS', qr: sampleQris(), enterAmountMinor: 8500000n },
  { schemeId: 'VN.VIETQR', qr: sampleVietQrMerchant({ amount: '85000' }) },
  { schemeId: 'KH.KHQR', qr: sampleKhqrMerchant(), enterAmountMinor: 1600000n },
  { schemeId: 'PH.QRPH', qr: sampleQrPhMerchant({ amount: '450.00' }) },
];

export { samplePromptPayQr };
