// EMVCo QR "ID-Length-Value" codec.
// ID: 2 digits, Length: 2 digits (01..99), Value: `length` characters.
// EMVCo counts characters; a few national profiles that carry UTF-8 text in
// the Merchant Information – Language Template (ID 64) have been observed to
// count bytes instead, so the parser can fall back to byte counting.

export type LengthMode = 'chars' | 'bytes';

export interface DataObject {
  id: string;
  value: string;
}

export class TlvError extends Error {
  readonly offset: number;
  constructor(message: string, offset: number) {
    super(`${message} at offset ${offset}`);
    this.name = 'TlvError';
    this.offset = offset;
  }
}

const DIGITS2 = /^\d{2}$/;

export function parseTlv(input: string, mode: LengthMode = 'chars'): DataObject[] {
  if (mode === 'bytes') return parseBytes(input);
  const cps = Array.from(input);
  const out: DataObject[] = [];
  let i = 0;
  while (i < cps.length) {
    if (i + 4 > cps.length) throw new TlvError('truncated ID/length', i);
    const id = cps.slice(i, i + 2).join('');
    const len = cps.slice(i + 2, i + 4).join('');
    if (!DIGITS2.test(id)) throw new TlvError(`invalid ID "${id}"`, i);
    if (!DIGITS2.test(len)) throw new TlvError(`invalid length "${len}" for ID ${id}`, i + 2);
    const n = Number(len);
    if (i + 4 + n > cps.length) throw new TlvError(`value of ID ${id} overruns payload`, i + 4);
    out.push({ id, value: cps.slice(i + 4, i + 4 + n).join('') });
    i += 4 + n;
  }
  return out;
}

function parseBytes(input: string): DataObject[] {
  const bytes = new TextEncoder().encode(input);
  const dec = new TextDecoder('utf-8', { fatal: true });
  const ascii = (a: number, b: number) => String.fromCharCode(...bytes.subarray(a, b));
  const out: DataObject[] = [];
  let i = 0;
  while (i < bytes.length) {
    if (i + 4 > bytes.length) throw new TlvError('truncated ID/length', i);
    const id = ascii(i, i + 2);
    const len = ascii(i + 2, i + 4);
    if (!DIGITS2.test(id)) throw new TlvError(`invalid ID "${id}"`, i);
    if (!DIGITS2.test(len)) throw new TlvError(`invalid length "${len}" for ID ${id}`, i + 2);
    const n = Number(len);
    if (i + 4 + n > bytes.length) throw new TlvError(`value of ID ${id} overruns payload`, i + 4);
    out.push({ id, value: dec.decode(bytes.subarray(i + 4, i + 4 + n)) });
    i += 4 + n;
  }
  return out;
}

export function encodeTlv(objects: readonly DataObject[], mode: LengthMode = 'chars'): string {
  return objects.map(o => encodeOne(o.id, o.value, mode)).join('');
}

export function encodeOne(id: string, value: string, mode: LengthMode = 'chars'): string {
  if (!DIGITS2.test(id)) throw new Error(`invalid ID "${id}"`);
  const n = mode === 'chars' ? Array.from(value).length : new TextEncoder().encode(value).length;
  if (n < 1 || n > 99) throw new Error(`ID ${id}: length ${n} outside 01..99`);
  return `${id}${String(n).padStart(2, '0')}${value}`;
}

/** Turns a list of data objects into a map; later duplicates are reported by the caller. */
export function toMap(objects: readonly DataObject[]): Map<string, string> {
  const m = new Map<string, string>();
  for (const o of objects) if (!m.has(o.id)) m.set(o.id, o.value);
  return m;
}
