// Philippines – QR Ph (BSP Circular 1055; standard managed by PPMI; credits ride InstaPay).
// P2M: ID 28, GUID "ph.ppmi.p2m"; P2P: ID 27, GUID "com.p2pqrpay". Sub 01 is the
// InstaPay participant code in BIC form (e.g. GXCHPHM2XXX) – not necessarily the SWIFT
// BIC – and is the routing key; sub 03 carries the merchant credit account (P2M) and
// sub 04 the payee account / proxy (P2P). MCC 6016 is the P2P convention.
// Layout from open-source codecs and CRC-valid production samples; the PPMI
// specification text was not obtained.

import { buildMpm } from '../emvco/mpm.ts';
import { refs, type SchemeDefinition } from './types.ts';

export const QRPH_GUID = { P2M: 'ph.ppmi.p2m', P2P: 'com.p2pqrpay' } as const;
/** P2M identifiers seen by third-party parsers; accepted with lower confidence pending the PPMI text. */
export const QRPH_P2M_VARIANTS = ['PH.PPMI.P2MEMV', 'COM.BDO.QRPH', 'COM.BPI.QRPH'] as const;
/** InstaPay per-transaction ceiling (PHP). */
export const INSTAPAY_MAX_PHP = 50_000;

export const qrPh: SchemeDefinition = {
  schemeId: 'PH.QRPH',
  country: 'PH',
  name: 'QR Ph',
  rail: 'InstaPay (PPMI / BancNet)',
  currency: 'PHP',
  guids: [QRPH_GUID.P2M, QRPH_GUID.P2P, ...QRPH_P2M_VARIANTS],
  routingKey: 'PH:INSTAPAY',
  maxAmountMinor: { PHP: BigInt(INSTAPAY_MAX_PHP) * 100n },
  interpret(acct, p) {
    const participant = acct.fields.get('01');
    if (!participant) return null;
    const guid = acct.guid?.toUpperCase() ?? '';
    const variant = (QRPH_P2M_VARIANTS as readonly string[]).includes(guid);
    const p2m = guid === QRPH_GUID.P2M.toUpperCase() || variant;
    const account = p2m ? acct.fields.get('03') : acct.fields.get('04') ?? acct.fields.get('03');
    if (!account) return null;
    const notes: string[] = [];
    if (variant) notes.push(`variant QR Ph GUID ${acct.guid}: accepted pending the PPMI specification`);
    if (!p2m) notes.push('QR Ph P2P code: payee name is masked; cross-border payment to individuals is likely remittance');
    return {
      paymentType: p2m ? 'P2M' : 'P2P',
      routing: {
        acquirerId: participant,
        merchantId: p2m ? account : undefined,
        account,
        proxyType: p2m ? 'MERCHANT_ACCOUNT' : 'ACCOUNT',
        references: refs({
          flag05: acct.fields.get('05'),
          referenceLabel: p.additionalData?.referenceLabel,
          storeLabel: p.additionalData?.storeLabel,
          terminal: p.additionalData?.terminalLabel,
        }),
      },
      altRoutingKeys: [`PH:BIC:${participant}`],
      confidence: variant ? 0.7 : 0.9,
      notes,
    };
  },
};

export function sampleQrPhMerchant(o: { amount?: string } = {}): string {
  return buildMpm({
    initiation: o.amount ? 'dynamic' : 'static',
    accounts: [{ tag: '28', fields: [['00', QRPH_GUID.P2M], ['01', 'EXMPPHM2XXX'], ['03', '217000000000123456'], ['05', '000']] }],
    mcc: '5812',
    currencyNumeric: '608',
    amount: o.amount,
    countryCode: 'PH',
    merchantName: 'JOLLY LECHON CEBU',
    merchantCity: 'CEBU',
    additional: [['00', 'ph.ppmi.qrph'], ['05', '000000000000000000001'], ['07', 'POS00001']],
  });
}
