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
      if (o.value !== '01') errors.push(`unsupported Payload Format Indicator "${o.value}"`);
    } else if (o.id === '01') {
      if (o.value === '11') out.initiation = 'static';
      else if (o.value === '12') out.initiation = 'dynamic';
      else errors.push(`invalid Point of Initiation Method "${o.value}"`);
    } else if (n >= 2 && n <= 51) {
      out.merchantAccounts.push(merchantAccount(o, n >= 26, warnings));
    } else if (o.id === '52') {
      out.mcc = o.value;
      if (!/^\d{4}$/.test(o.value)) warnings.push(`MCC "${o.value}" is not 4 digits`);
    } else if (o.id === '53') {
      out.currencyNumeric = o.value;
      if (!/^\d{3}$/.test(o.value)) errors.push(`Transaction Currency "${o.value}" is not ISO 4217 numeric`);
    } else if (o.id === '54') {
      out.amount = o.value;
      if (!/^(?=.*\d)\d*(\.\d*)?$/.test(o.value) || o.value.length > 13) errors.push(`invalid Transaction Amount "${o.value}"`);
    } else if (o.id === '55') {
      const mode = ({ '01': 'prompt', '02': 'fixed', '03': 'percentage' } as const)[o.value as '01' | '02' | '03'];
      if (mode) out.tip = { ...out.tip, mode };
      else warnings.push(`unknown Tip or Convenience Indicator "${o.value}"`);
    } else if (o.id === '56') {
      out.tip = { mode: out.tip?.mode ?? 'fixed', ...out.tip, fixed: o.value };
    } else if (o.id === '57') {
      out.tip = { mode: out.tip?.mode ?? 'percentage', ...out.tip, percentage: o.value };
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
      out.additionalData = additional(o.value, warnings);
    } else if (o.id === '63') {
      out.crc = o.value;
      if (idx !== objects.length - 1) errors.push('ID 63 (CRC) must be the last data object');
    } else if (o.id === '64') {
      try {
        const m = new Map(parseTlv(o.value, lengthMode).map(s => [s.id, s.value]));
        out.language = { preference: m.get('00'), name: m.get('01'), city: m.get('02') };
      } catch (e) {
        warnings.push(`unparseable Language Template: ${(e as Error).message}`);
      }
    } else if (n >= 65 && n <= 79) {
      out.rfu.set(o.id, o.value);
    } else if (n >= 80 && n <= 99) {
      out.unreserved.push(merchantAccount(o, true, warnings));
    }
  });

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
  const i = raw.lastIndexOf('6304');
  if (i < 0 || i !== raw.length - 8) return false;
  return crcHex(raw.slice(0, -4)) === raw.slice(-4).toUpperCase();
}

function merchantAccount(o: DataObject, template: boolean, warnings: string[]): MerchantAccount {
  if (!template) return { tag: o.id, fields: new Map([['raw', o.value]]), raw: o.value };
  try {
    const fields = new Map(parseTlv(o.value).map(s => [s.id, s.value]));
    const guid = fields.get('00');
    if (!guid) warnings.push(`template ${o.id} has no sub-ID 00 (Globally Unique Identifier)`);
    return { tag: o.id, guid, fields, raw: o.value };
  } catch (e) {
    warnings.push(`template ${o.id} is not valid TLV: ${(e as Error).message}`);
    return { tag: o.id, fields: new Map(), raw: o.value };
  }
}

function additional(value: string, warnings: string[]): AdditionalData {
  const ad: AdditionalData = { systemSpecific: new Map(), all: new Map() };
  let subs: DataObject[] = [];
  try {
    subs = parseTlv(value);
  } catch (e) {
    warnings.push(`Additional Data Field Template is not valid TLV: ${(e as Error).message}`);
  }
  for (const s of subs) {
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
  initiation: Initiation;
  accounts: BuildTemplate[];
  mcc: string;
  currencyNumeric: string;
  amount?: string;
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
  const tmpl = (t: BuildTemplate) => encodeOne(t.tag, encodeTlv(t.fields.map(([id, value]) => ({ id, value }))), mode);
  let s = encodeOne('00', '01') + encodeOne('01', b.initiation === 'static' ? '11' : '12');
  for (const a of [...b.accounts].sort((x, y) => num(x.tag) - num(y.tag))) s += tmpl(a);
  s += encodeOne('52', b.mcc) + encodeOne('53', b.currencyNumeric);
  if (b.amount) s += encodeOne('54', b.amount);
  s += encodeOne('58', b.countryCode) + encodeOne('59', b.merchantName, mode) + encodeOne('60', b.merchantCity, mode);
  if (b.postalCode) s += encodeOne('61', b.postalCode);
  if (b.additional?.length) s += encodeOne('62', encodeTlv(b.additional.map(([id, value]) => ({ id, value }))));
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
