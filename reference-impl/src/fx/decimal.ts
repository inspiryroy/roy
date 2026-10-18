// Fixed-point decimal on bigint with 18 fractional digits. Money never touches floats.

export const SCALE = 10n ** 18n;

export type Fixed = bigint;
export type Rounding = 'up' | 'down' | 'half-even';

export function fx(s: string): Fixed {
  const m = /^(-)?(\d+)(?:\.(\d+))?$/.exec(s.trim());
  if (!m) throw new Error(`invalid decimal "${s}"`);
  const frac = (m[3] ?? '').slice(0, 18).padEnd(18, '0');
  const v = BigInt(m[2]!) * SCALE + BigInt(frac);
  return m[1] ? -v : v;
}

export function fxToString(v: Fixed, digits = 18): string {
  const neg = v < 0n;
  const a = neg ? -v : v;
  const int = a / SCALE;
  let frac = (a % SCALE).toString().padStart(18, '0').slice(0, digits).replace(/0+$/, '');
  return `${neg ? '-' : ''}${int}${frac ? `.${frac}` : ''}`;
}

export function mul(a: Fixed, b: Fixed, r: Rounding = 'half-even'): Fixed {
  return divRound(a * b, SCALE, r);
}

export function div(a: Fixed, b: Fixed, r: Rounding = 'half-even'): Fixed {
  if (b === 0n) throw new Error('division by zero');
  return divRound(a * SCALE, b, r);
}

export function divRound(n: bigint, d: bigint, r: Rounding): bigint {
  if (d < 0n) return divRound(-n, -d, r);
  const q = n / d;
  const rem = n % d;
  if (rem === 0n) return q;
  const neg = n < 0n;
  if (r === 'down') return neg ? q - 1n : q;
  if (r === 'up') return neg ? q : q + 1n;
  const twice = 2n * (rem < 0n ? -rem : rem);
  if (twice > d || (twice === d && q % 2n !== 0n)) return neg ? q - 1n : q + 1n;
  return q;
}

/** Converts a fixed-point value into integer minor units of a currency. */
export function toMinor(v: Fixed, minor: number, r: Rounding): bigint {
  return divRound(v, 10n ** BigInt(18 - minor), r);
}

export function fromMinor(v: bigint, minor: number): Fixed {
  return v * 10n ** BigInt(18 - minor);
}

export function bps(v: number): Fixed {
  return (BigInt(Math.round(v * 1000)) * SCALE) / 10_000_000n;
}
