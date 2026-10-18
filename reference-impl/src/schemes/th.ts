// Thailand – Thai QR Payment (BOT Policy Guideline FPG 25620084, 2019) on PromptPay / NITMX.
// Template allocation in the Thai profile: 26–28 local card schemes, 29–31 PromptPay & other
// payment systems. Identifiers below are corroborated by independent open-source
// implementations and CRC-valid production payloads; the BOT annex itself was not obtained,
// see docs/02 §2.1 for the evidence level.

import { buildMpm } from '../emvco/mpm.ts';
import type { SchemeDefinition } from './types.ts';

export const TH_AID = {
  /** tag 29 – PromptPay credit transfer (proxy: mobile / national ID / e-wallet ID). */
  PROMPTPAY: 'A000000677010111',
  /** tag 30 – Bill Payment (domestic): Biller ID + Ref1/Ref2 – the merchant-acquiring route. */
  BILL: 'A000000677010112',
  /** tag 31 – acquirer-specific "payment innovation" template; sub 01 = 3-digit bank code. */
  ACQUIRER: 'A000000677010113',
  /** tag 30 – cross-border Bill Payment variant (used with 62-08 currency/amount/country). */
  BILL_XB: 'A000000677012006',
} as const;

const BILL_AIDS = new Set<string>([TH_AID.BILL, TH_AID.BILL_XB]);

const PROXY: Record<string, string> = { '01': 'MOBILE', '02': 'NATIONAL_ID', '03': 'EWALLET_ID', '04': 'BANK_ACCOUNT' };

export const thaiQr: SchemeDefinition = {
  schemeId: 'TH.THAIQR',
  country: 'TH',
  name: 'Thai QR Payment',
  rail: 'PromptPay (NITMX)',
  currency: 'THB',
  guids: [TH_AID.PROMPTPAY, TH_AID.BILL, TH_AID.ACQUIRER, TH_AID.BILL_XB],
  routingKey: 'TH:NITMX',
  interpret(acct, p) {
    const f = acct.fields;
    const acquirerTmpl = p.merchantAccounts.find(a => a.guid?.toUpperCase() === TH_AID.ACQUIRER);
    const bankCode = acquirerTmpl?.fields.get('01');
    const alt = bankCode ? [`TH:ACQ:${bankCode}`] : [];

    switch (acct.guid?.toUpperCase()) {
      case TH_AID.PROMPTPAY: {
        const id = ['01', '02', '03', '04'].find(k => f.has(k));
        if (!id) return null;
        return {
          // Personal PromptPay codes carry no merchant identity. Existing inbound
          // cross-border links accept participating banks' *merchant* codes only.
          paymentType: 'P2P',
          routing: { account: f.get(id), proxyType: PROXY[id], references: {} },
          confidence: 0.9,
          notes: ['personal PromptPay QR (tag 29): no merchant identity'],
        };
      }
      case TH_AID.BILL:
      case TH_AID.BILL_XB: {
        const billerId = f.get('01');
        const ref1 = f.get('02');
        if (!billerId || !ref1) return null;
        const references: Record<string, string> = { ref1 };
        if (f.get('03')) references.ref2 = f.get('03')!;
        if (p.additionalData?.terminalLabel) references.terminal = p.additionalData.terminalLabel;
        const notes = acct.guid?.toUpperCase() === TH_AID.BILL_XB ? ['cross-border Thai QR variant (A000000677012006)'] : [];
        if (!/^\d{15}$/.test(billerId)) notes.push(`Biller ID "${billerId}" is not 15 digits (13-digit tax ID + 2-digit suffix)`);
        return {
          paymentType: 'P2M',
          routing: { acquirerId: bankCode, merchantId: billerId, account: billerId, proxyType: 'BILLER_ID', references },
          altRoutingKeys: alt,
          confidence: 1,
          notes,
        };
      }
      case TH_AID.ACQUIRER: {
        if (!bankCode) return null;
        // Only a fallback when no tag 30 is present: the acquirer must process it on-us.
        if (p.merchantAccounts.some(a => BILL_AIDS.has(a.guid?.toUpperCase() ?? ''))) return null;
        return {
          paymentType: 'P2M',
          routing: { acquirerId: bankCode, merchantId: f.get('02'), references: Object.fromEntries([...f].filter(([k]) => k !== '00' && k !== '01')) },
          routingKey: `TH:ACQ:${bankCode}`,
          confidence: 0.7,
          notes: ['acquirer-specific template (tag 31) only: payable through that acquirer'],
        };
      }
    }
    return null;
  },
  validate(p) {
    return p.countryCode === 'TH' ? [] : ['Thai QR without country code TH'];
  },
};

/** Synthetic Thai merchant (Bill Payment) QR for tests and the demo. */
export function sampleThaiMerchantQr(o: { amount?: string; billerId?: string; ref1?: string; bankCode?: string } = {}): string {
  const accounts = [
    { tag: '30', fields: [['00', TH_AID.BILL], ['01', o.billerId ?? '010555612345601'], ['02', o.ref1 ?? 'SHOP0001']] as Array<[string, string]> },
  ];
  if (o.bankCode) accounts.push({ tag: '31', fields: [['00', TH_AID.ACQUIRER], ['01', o.bankCode], ['02', o.ref1 ?? 'SHOP0001']] });
  return buildMpm({
    initiation: o.amount ? 'dynamic' : 'static',
    accounts,
    mcc: '5812',
    currencyNumeric: '764',
    amount: o.amount,
    countryCode: 'TH',
    merchantName: 'SOMTAM BANGKOK',
    merchantCity: 'BANGKOK',
    additional: [['07', 'POS01']],
    language: { preference: 'TH', name: 'ส้มตำบางกอก', city: 'กรุงเทพ' },
  });
}

export function samplePromptPayQr(mobile = '0812345678'): string {
  return buildMpm({
    initiation: 'static',
    accounts: [{ tag: '29', fields: [['00', TH_AID.PROMPTPAY], ['01', `0066${mobile.slice(1)}`]] }],
    mcc: '0000',
    currencyNumeric: '764',
    countryCode: 'TH',
    merchantName: 'NA',
    merchantCity: 'BANGKOK',
  });
}
