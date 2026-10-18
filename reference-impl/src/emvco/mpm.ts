// EMVCo Merchant-Presented Mode (MPM) payload decoder / validator / builder.
// Reference: EMVCo QR Code Specification for Payment Systems – Merchant-Presented Mode v1.1.
// Validation is split into `errors` (payload cannot be routed safely) and
// `warnings` (spec deviations that real national QR codes are known to carry).

import { crcHex } from './crc16.ts';
import { type DataObject, type LengthMode, encodeOne, encodeTlv, parseTlv, TlvError } from './tlv.ts';

export type Initiation = 'static' | 'dynamic';
export type TipMode = 'prompt' | 'fixed' | 'percentage';

export interface MerchantAccount {
  /** Top-level ID "02".."51". */
  tag: string;
  /** Sub-ID "00" for templates 26..51; undefined for the card-scheme IDs 02..25. */
  guid?: string;
  /** Sub-objects of a 26..51 template (including "00"), or `raw` for primitive 02..25. */
  fields: Map<string, string>;
  raw: string;
}

export interface AdditionalData {
  billNumber?: string;
  mobileNumber?: string;
  storeLabel?: string;
  loyaltyNumber?: string;
  referenceLabel?: string;
  customerLabel?: string;
  terminalLabel?: string;
  purpose?: string;
  consumerDataRequest?: string;
  merchantTaxId?: string;
  merchantChannel?: string;
  /** IDs 50..99 – payment-system-specific templates. */
  systemSpecific: Map<string, string>;
  /** Every sub-object, verbatim. */
  all: Map<string, string>;
}

export interface MpmPayload {
  raw: string;
  lengthMode: LengthMode;
  payloadFormat: string;
  initiation?: Initiation;
  merchantAccounts: MerchantAccount[];
  mcc?: string;
  currencyNumeric?: string;
  amount?: string;
  tip?: { mode: TipMode; fixed?: string; percentage?: string };
  countryCode?: string;
  merchantName?: string;
  merchantCity?: string;
  postalCode?: string;
  additionalData?: AdditionalData;
  language?: { preference?: string; name?: string; city?: string };
  /** IDs 80..99. */
  unreserved: MerchantAccount[];
  /** IDs 65..79 – reserved for future use but present. */
  rfu: Map<string, string>;
  crc: string;
  crcValid: boolean;
  errors: string[];
  warnings: string[];
}

const ADDITIONAL_NAMES: Record<string, keyof Omit<AdditionalData, 'systemSpecific' | 'all'>> = {
  '01': 'billNumber',
  '02': 'mobileNumber',
  '03': 'storeLabel',
  '04': 'loyaltyNumber',
  '05': 'referenceLabel',
  '06': 'customerLabel',
  '07': 'terminalLabel',
  '08': 'purpose',
  '09': 'consumerDataRequest',
  '10': 'merchantTaxId',
  '11': 'merchantChannel',
};

const num = (id: string) => Number(id);

export function decodeMpm(input: string): MpmPayload {
  const raw = input.trim();
  const nonAscii = /[^\x00-\x7f]/.test(raw);
  let objects: DataObject[] | undefined;
  let lengthMode: LengthMode = 'chars';
  let charErr: unknown;
  try {
    objects = parseTlv(raw, 'chars');
  } catch (e) {
    charErr = e;
  }
  // Only payloads with non-ASCII text can differ between the two length modes.
  if (nonAscii && (!objects || !crcOk(raw) || !lengthsConsistent(objects))) {
    try {
      const alt = parseTlv(raw, 'bytes');
      if (!objects || lengthsConsistent(alt)) {
        objects = alt;
        lengthMode = 'bytes';
      }
    } catch {
      // keep the character-mode result (or rethrow below)
    }
  }
  if (!objects) throw charErr instanceof TlvError ? charErr : new TlvError(String(charErr), 0);

  const errors: string[] = [];
  const warnings: string[] = [];
  const seen = new Set<string>();
  const tipRaw: Record<string, string> = {};
  const out: MpmPayload = {
    raw,
    lengthMode,
    payloadFormat: '',
    merchantAccounts: [],
    unreserved: [],
    rfu: new Map(),
    crc: '',
    crcValid: false,
    errors,
    warnings,
  };

  objects.forEach((o, idx) => {
    if (seen.has(o.id)) warnings.push(`duplicate ID ${o.id}; first occurrence kept`);
    if (seen.has(o.id)) return;
    seen.add(o.id);
    const n = num(o.id);
    if (o.id === '00') {
      out.payloadFormat = o.value;
      if (idx !== 0) errors.push('ID 00 (Payload Format Indicator) must be the first data object');
      // EMVCo mandates "01"; Malaysia's DuitNow QR (PayNet MPM spec v1.5) uses "02".
      if (!/^\d{2}$/.test(o.value)) errors.push(`invalid Payload Format Indicator "${o.value}"`);
      else if (o.value !== '01') warnings.push(`non-EMVCo Payload Format Indicator "${o.value}"`);
    } else if (o.id === '01') {
      if (o.value === '11') out.initiation = 'static';
      else if (o.value === '12') out.initiation = 'dynamic';
      else errors.push(`invalid Point of Initiation Method "${o.value}"`);
    } else if (n >= 2 && n <= 51) {
      out.merchantAccounts.push(merchantAccount(o, n >= 26, warnings, lengthMode));
    } else if (o.id === '52') {
      out.mcc = o.value;
      if (!/^\d{4}$/.test(o.value)) warnings.push(`MCC "${o.value}" is not 4 digits`);
    } else if (o.id === '53') {
      out.currencyNumeric = o.value;
      if (!/^\d{3}$/.test(o.value)) errors.push(`Transaction Currency "${o.value}" is not ISO 4217 numeric`);
    } else if (o.id === '54') {
      out.amount = o.value;
      if (!AMOUNT.test(o.value) || o.value.length > 13) errors.push(`invalid Transaction Amount "${o.value}"`);
    } else if (o.id === '55' || o.id === '56' || o.id === '57') {
      tipRaw[o.id] = o.value;
    } else if (o.id === '58') {
      out.countryCode = o.value;
      if (!/^[A-Z]{2}$/.test(o.value)) warnings.push(`Country Code "${o.value}" is not ISO 3166-1 alpha-2`);
    } else if (o.id === '59') {
      out.merchantName = o.value;
      if (Array.from(o.value).length > 25) warnings.push('Merchant Name longer than 25 characters');
    } else if (o.id === '60') {
      out.merchantCity = o.value;
      if (Array.from(o.value).length > 15) warnings.push('Merchant City longer than 15 characters');
    } else if (o.id === '61') {
      out.postalCode = o.value;
    } else if (o.id === '62') {
      out.additionalData = additional(o.value, warnings, lengthMode);
    } else if (o.id === '63') {
      out.crc = o.value;
      if (idx !== objects.length - 1) errors.push('ID 63 (CRC) must be the last data object');
    } else if (o.id === '64') {
      try {
        const m = firstWins(parseTlv(o.value, lengthMode), 'ID 64', warnings);
        out.language = { preference: m.get('00'), name: m.get('01'), city: m.get('02') };
      } catch (e) {
        warnings.push(`unparseable Language Template: ${(e as Error).message}`);
      }
    } else if (n >= 65 && n <= 79) {
      out.rfu.set(o.id, o.value);
    } else if (n >= 80 && n <= 99) {
      // Unreserved templates are usually TLV, but some profiles put primitives here
      // (DuitNow ID 82 = SHA-256 data-integrity hash), so failures are not reported.
      out.unreserved.push(merchantAccount(o, true, [], lengthMode));
    }
  });

  resolveTip(tipRaw, out, errors, warnings);

  if (out.payloadFormat === '') errors.push('missing ID 00 (Payload Format Indicator)');
  if (out.merchantAccounts.length === 0) errors.push('no Merchant Account Information (IDs 02..51)');
  if (!out.currencyNumeric) errors.push('missing ID 53 (Transaction Currency)');
  if (!out.countryCode) warnings.push('missing ID 58 (Country Code)');
  if (!out.mcc) warnings.push('missing ID 52 (Merchant Category Code)');
  if (!out.merchantName) warnings.push('missing ID 59 (Merchant Name)');
  if (out.initiation === 'dynamic' && !out.amount) warnings.push('dynamic QR without ID 54 (amount)');

  if (!out.crc) {
    errors.push('missing ID 63 (CRC)');
  } else {
    out.crcValid = crcOk(raw);
    if (!out.crcValid) errors.push(`CRC mismatch: payload says ${out.crc}, computed ${crcHex(raw.slice(0, -4))}`);
  }
  return out;
}

/** A parse is plausible when it ends with a 4-character CRC object. */
function lengthsConsistent(objects: DataObject[]): boolean {
  const last = objects[objects.length - 1];
  return last?.id === '63' && last.value.length === 4;
}

function crcOk(raw: string): boolean {
  // Positional check: the CRC value itself may legitimately be "6304".
  if (raw.length < 8 || raw.slice(-8, -4) !== '6304') return false;
  return crcHex(raw.slice(0, -4)) === raw.slice(-4).toUpperCase();
}

const AMOUNT = /^(?=.*\d)\d*(\.\d*)?$/;

/**
 * EMVCo §4.7.6: 55 = 01 prompt for tip, 02 fixed convenience fee (56), 03 percentage
 * convenience fee (57, "0.01".."99.99"). 56/57 without the matching 55 are ignored.
 */
function resolveTip(raw: Record<string, string>, out: MpmPayload, errors: string[], warnings: string[]): void {
  const ind = raw['55'];
  if (ind === undefined) {
    if (raw['56'] !== undefined || raw['57'] !== undefined) warnings.push('ID 56/57 present without ID 55: ignored');
    return;
  }
  if (ind === '01') out.tip = { mode: 'prompt' };
  else if (ind === '02') {
    const v = raw['56'];
    if (v === undefined || !AMOUNT.test(v) || v.length > 13) errors.push(`55=02 requires a valid fixed convenience fee in ID 56, got "${v ?? ''}"`);
    else out.tip = { mode: 'fixed', fixed: v };
  } else if (ind === '03') {
    const v = raw['57'];
    const pct = v !== undefined && /^\d{1,2}(\.\d{1,2})?$/.test(v) ? Number(v) : NaN;
    if (!(pct >= 0.01 && pct <= 99.99)) errors.push(`55=03 requires a percentage convenience fee 0.01..99.99 in ID 57, got "${v ?? ''}"`);
    else out.tip = { mode: 'percentage', percentage: v };
  } else warnings.push(`unknown Tip or Convenience Indicator "${ind}"`);
}

/** Sub-object map where, as at top level, the first occurrence of an ID wins. */
function firstWins(subs: DataObject[], where: string, warnings: string[]): Map<string, string> {
  const m = new Map<string, string>();
  for (const s of subs) {
    if (m.has(s.id)) warnings.push(`duplicate sub-ID ${s.id} in ${where}; first occurrence kept`);
    else m.set(s.id, s.value);
  }
  return m;
}

function merchantAccount(o: DataObject, template: boolean, warnings: string[], mode: LengthMode): MerchantAccount {
  if (!template) return { tag: o.id, fields: new Map([['raw', o.value]]), raw: o.value };
  try {
    const fields = firstWins(parseTlv(o.value, mode), `template ${o.id}`, warnings);
    const guid = fields.get('00');
    if (!guid) warnings.push(`template ${o.id} has no sub-ID 00 (Globally Unique Identifier)`);
    return { tag: o.id, guid, fields, raw: o.value };
  } catch (e) {
    warnings.push(`template ${o.id} is not valid TLV: ${(e as Error).message}`);
    return { tag: o.id, fields: new Map(), raw: o.value };
  }
}

function additional(value: string, warnings: string[], mode: LengthMode): AdditionalData {
  const ad: AdditionalData = { systemSpecific: new Map(), all: new Map() };
  let subs: DataObject[] = [];
  try {
    subs = parseTlv(value, mode);
  } catch (e) {
    warnings.push(`Additional Data Field Template is not valid TLV: ${(e as Error).message}`);
  }
  for (const [id, v] of firstWins(subs, 'ID 62', warnings)) {
    const s = { id, value: v };
    ad.all.set(s.id, s.value);
    const name = ADDITIONAL_NAMES[s.id];
    if (name) ad[name] = s.value;
    else if (num(s.id) >= 50) ad.systemSpecific.set(s.id, s.value);
  }
  return ad;
}

/** `***` in an Additional Data sub-object means "ask the payer for this value". */
export function promptedFields(p: MpmPayload): string[] {
  if (!p.additionalData) return [];
  return [...p.additionalData.all].filter(([, v]) => v === '***').map(([k]) => k);
}

// ---------------------------------------------------------------------------
// Builder (used by tests and by the demo to create synthetic national QR codes)

export interface BuildTemplate {
  tag: string;
  fields: Array<[string, string]>;
}

export interface BuildInput {
  /** Defaults to the EMVCo value "01". */
  payloadFormat?: string;
  initiation: Initiation;
  accounts: BuildTemplate[];
  mcc: string;
  currencyNumeric: string;
  amount?: string;
  /** ID 55 indicator with ID 56 (fixed) or ID 57 (percentage). */
  tip?: { indicator: '01' | '02' | '03'; fixed?: string; percentage?: string };
  countryCode: string;
  merchantName: string;
  merchantCity: string;
  postalCode?: string;
  additional?: Array<[string, string]>;
  language?: { preference: string; name: string; city?: string };
  unreserved?: BuildTemplate[];
  lengthMode?: LengthMode;
}

export function buildMpm(b: BuildInput): string {
  const mode = b.lengthMode ?? 'chars';
  const tmpl = (t: BuildTemplate) => encodeOne(t.tag, encodeTlv(t.fields.map(([id, value]) => ({ id, value })), mode), mode);
  let s = encodeOne('00', b.payloadFormat ?? '01') + encodeOne('01', b.initiation === 'static' ? '11' : '12');
  for (const a of [...b.accounts].sort((x, y) => num(x.tag) - num(y.tag))) s += tmpl(a);
  s += encodeOne('52', b.mcc) + encodeOne('53', b.currencyNumeric);
  if (b.amount) s += encodeOne('54', b.amount);
  if (b.tip) {
    s += encodeOne('55', b.tip.indicator);
    if (b.tip.fixed) s += encodeOne('56', b.tip.fixed);
    if (b.tip.percentage) s += encodeOne('57', b.tip.percentage);
  }
  s += encodeOne('58', b.countryCode) + encodeOne('59', b.merchantName, mode) + encodeOne('60', b.merchantCity, mode);
  if (b.postalCode) s += encodeOne('61', b.postalCode);
  if (b.additional?.length) s += encodeOne('62', encodeTlv(b.additional.map(([id, value]) => ({ id, value })), mode), mode);
  if (b.language) {
    const subs: DataObject[] = [
      { id: '00', value: b.language.preference },
      { id: '01', value: b.language.name },
      ...(b.language.city ? [{ id: '02', value: b.language.city }] : []),
    ];
    s += encodeOne('64', encodeTlv(subs, mode), mode);
  }
  for (const u of b.unreserved ?? []) s += tmpl(u);
  s += '6304';
  return s + crcHex(s);
}
