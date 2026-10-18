// Subset of ISO 4217 needed for the Japan ↔ Southeast Asia corridors.
// `minor` is the number of decimals used on the wire by the local rail.

export interface CurrencyInfo {
  alpha: string;
  numeric: string;
  minor: number;
}

const LIST: CurrencyInfo[] = [
  { alpha: 'JPY', numeric: '392', minor: 0 },
  { alpha: 'THB', numeric: '764', minor: 2 },
  { alpha: 'SGD', numeric: '702', minor: 2 },
  { alpha: 'MYR', numeric: '458', minor: 2 },
  { alpha: 'IDR', numeric: '360', minor: 2 },
  { alpha: 'VND', numeric: '704', minor: 0 },
  { alpha: 'PHP', numeric: '608', minor: 2 },
  { alpha: 'KHR', numeric: '116', minor: 2 },
  { alpha: 'LAK', numeric: '418', minor: 2 },
  { alpha: 'MMK', numeric: '104', minor: 2 },
  { alpha: 'USD', numeric: '840', minor: 2 },
  { alpha: 'HKD', numeric: '344', minor: 2 },
  { alpha: 'CNY', numeric: '156', minor: 2 },
  { alpha: 'KRW', numeric: '410', minor: 0 },
];

const BY_NUMERIC = new Map(LIST.map(c => [c.numeric, c]));
const BY_ALPHA = new Map(LIST.map(c => [c.alpha, c]));

export function currencyByNumeric(code: string): CurrencyInfo | undefined {
  return BY_NUMERIC.get(code);
}

export function currencyByAlpha(code: string): CurrencyInfo | undefined {
  return BY_ALPHA.get(code);
}

/** "1234.5" → 123450n for a 2-decimal currency. Rejects more decimals than the currency allows. */
export function toMinorUnits(amount: string, minor: number): bigint {
  if (!/^\d+(\.\d+)?$/.test(amount)) throw new Error(`invalid amount "${amount}"`);
  const [int, frac = ''] = amount.split('.');
  if (frac.length > minor && !/^0*$/.test(frac.slice(minor))) {
    throw new Error(`amount "${amount}" has more than ${minor} decimals`);
  }
  return BigInt(int! + frac.slice(0, minor).padEnd(minor, '0'));
}

export function fromMinorUnits(v: bigint, minor: number): string {
  const neg = v < 0n;
  const s = (neg ? -v : v).toString().padStart(minor + 1, '0');
  const out = minor === 0 ? s : `${s.slice(0, -minor)}.${s.slice(-minor)}`;
  return neg ? `-${out}` : out;
}
