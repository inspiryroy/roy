// National scheme profiles. Country profiles are added once their identifiers
// (GUID/AID, sub-tag layout) are verified against primary specifications.
import type { SchemeDefinition } from './types.ts';

export const ALL_SCHEMES: SchemeDefinition[] = [];

export interface Sample {
  schemeId: string;
  qr: string;
  /** Amount the user types for a static QR, in local minor units. */
  enterAmountMinor?: bigint;
}

export const SAMPLES: Sample[] = [];
