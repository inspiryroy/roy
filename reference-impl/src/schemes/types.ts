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
  /** Expiry carried by the code itself (KHQR 99-01, PayNow 04), epoch ms. */
  qrExpiresAt?: number;
  /** Set when the template was recognised but must not be paid (e.g. currency mismatch). */
  declineReason?: string;
  /** Decimals the rail accepts per currency when narrower than ISO 4217 (QRIS IDR 0, KHQR KHR 0). */
  amountDecimals?: Partial<Record<string, number>>;
  /** Per-transaction ceiling of the rail in minor units (QR Ph / InstaPay PHP 50,000). */
  maxAmountMinor?: Partial<Record<string, bigint>>;
}

export type SchemeInterpretation = Omit<
  SchemeMatch,
  'schemeId' | 'country' | 'name' | 'rail' | 'currency' | 'template' | 'guid' | 'routingKey' | 'amountDecimals' | 'maxAmountMinor'
> & {
  routingKey?: string;
};

/** Money-transfer, cash-withdrawal and quasi-cash MCCs: not accepted on a purchase route. */
export const QUASI_CASH_MCC: ReadonlySet<string> = new Set(['4829', '6010', '6011', '6012', '6051']);

export interface SchemeDefinition {
  schemeId: string;
  country: string;
  name: string;
  rail: string;
  currency: string;
  /** Additional currencies the scheme legitimately carries (e.g. KHQR: KHR and USD). */
  otherCurrencies?: readonly string[];
  /** GUIDs / AIDs (case-insensitive) recognised in templates 26..51. */
  guids: readonly string[];
  /**
   * For profiles whose templates carry no GUID (Cambodia's KHQR puts a Bakong account
   * ID in sub-00): template IDs to inspect and a predicate run when no GUID matched.
   */
  templateTags?: readonly string[];
  matchTemplate?(acct: MerchantAccount, payload: MpmPayload): boolean;
  /** Default routing key (one settlement partner connection per rail / switch). */
  routingKey: string;
  amountDecimals?: Partial<Record<string, number>>;
  maxAmountMinor?: Partial<Record<string, bigint>>;
  /** Converts a matching template into routing data; may return null to decline. */
  interpret(acct: MerchantAccount, payload: MpmPayload): SchemeInterpretation | null;
  /** Spec-level checks beyond EMVCo (e.g. mandatory national-ID template). */
  validate?(payload: MpmPayload): string[];
}

/** Drops undefined/empty values so optional QR fields can be listed inline. */
export function refs(o: Record<string, string | undefined>): Record<string, string> {
  return Object.fromEntries(Object.entries(o).filter((e): e is [string, string] => typeof e[1] === 'string' && e[1] !== ''));
}
