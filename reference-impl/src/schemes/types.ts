import type { MerchantAccount, MpmPayload } from '../emvco/mpm.ts';

export type PaymentType = 'P2M' | 'P2P' | 'BILL';

/** What the switch needs to push a credit to the merchant over the local rail. */
export interface MerchantRouting {
  /** Acquirer / participant identifier on the local rail (BIN, NNS, BIC, AID-bank code…). */
  acquirerId?: string;
  /** Merchant identifier assigned by the acquirer or the national scheme (MID, NMID…). */
  merchantId?: string;
  /** Account / proxy credited on the rail (PromptPay ID, Bakong ID, account number…). */
  account?: string;
  /** Kind of proxy in `account` (mobile, national-id, e-wallet, biller-id, account…). */
  proxyType?: string;
  /** Scheme-specific reference fields that must be echoed back on the rail. */
  references: Record<string, string>;
}

export interface SchemeMatch {
  /** Stable identifier, e.g. "TH.THAIQR". */
  schemeId: string;
  country: string;
  name: string;
  /** Local instant-payment rail that carries the credit. */
  rail: string;
  currency: string;
  paymentType: PaymentType;
  /** Template (ID 26..51) that produced the match. */
  template: string;
  guid: string;
  routing: MerchantRouting;
  /** Key used to pick the local settlement partner (one per rail / switch). */
  routingKey: string;
  /**
   * Narrower keys that also reach this merchant, e.g. "TH:ACQ:004" when only the
   * merchant's own acquirer is a partner ("on-us" acceptance without switch access).
   */
  altRoutingKeys?: string[];
  /** 0..1 – national-scheme templates score above private-brand ones. */
  confidence: number;
  notes: string[];
}

export type SchemeInterpretation = Omit<SchemeMatch, 'schemeId' | 'country' | 'name' | 'rail' | 'currency' | 'template' | 'guid' | 'routingKey'> & {
  routingKey?: string;
};

export interface SchemeDefinition {
  schemeId: string;
  country: string;
  name: string;
  rail: string;
  currency: string;
  /** GUIDs / AIDs (case-insensitive) recognised in templates 26..51. */
  guids: readonly string[];
  /** Default routing key (one settlement partner connection per rail / switch). */
  routingKey: string;
  /** Converts a matching template into routing data; may return null to decline. */
  interpret(acct: MerchantAccount, payload: MpmPayload): SchemeInterpretation | null;
  /** Spec-level checks beyond EMVCo (e.g. mandatory national-ID template). */
  validate?(payload: MpmPayload): string[];
}
