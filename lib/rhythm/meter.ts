import type { Meter } from "@/types/exercises";

interface ParsedMeter {
  numerator: number;
  denominator: number;
}

function parseMeter(meter: Meter): ParsedMeter {
  const [numerator, denominator] = meter.split("/").map(Number);
  return { numerator, denominator };
}

/** How many quarter-note beats one measure of `meter` lasts — e.g. 4/4 is
 * 4, 6/8 is 3. */
export function meterQuarterNoteBeats(meter: Meter): number {
  const { numerator, denominator } = parseMeter(meter);
  return (numerator * 4) / denominator;
}

// Compound meters (numerator divisible by 3, eighth-note denominator —
// 6/8, 9/8, 12/8) are FELT in dotted-quarter pulses (numerator/3 of
// them), each subdividing into 3 eighths — see meterPulseSubdivision for
// how a SIMPLE meter (2/4, 3/4, 4/4, or 2/2) still gets its own
// subdivision (1, for the first three; 2, for 2/2's half-note pulse).
const COMPOUND_NUMERATORS = new Set([6, 9, 12]);

function isCompound(numerator: number, denominator: number): boolean {
  return denominator === 8 && COMPOUND_NUMERATORS.has(numerator);
}

/** How many "felt" pulses a measure of `meter` has — 4 for 4/4, 3 for
 * 3/4, but 2 for 6/8 (felt as two dotted-quarter pulses, not six eighths). */
export function meterFeltPulseCount(meter: Meter): number {
  const { numerator, denominator } = parseMeter(meter);
  return isCompound(numerator, denominator) ? numerator / 3 : numerator;
}

/** How many quarter-note beats each felt pulse itself lasts — 1 for every
 * simple meter whose pulse is a plain quarter note (2/4, 3/4, 4/4), 1.5
 * for the compound eighth meters' dotted-quarter pulse, and 2 for 2/2
 * (whose felt pulse is a half note, not a quarter). */
export function meterFeltPulseQuarterBeats(meter: Meter): number {
  return meterQuarterNoteBeats(meter) / meterFeltPulseCount(meter);
}

/** How many equal parts a single felt pulse audibly splits into — 1 when
 * the pulse already IS the smallest natural unit (2/4, 3/4, 4/4's plain
 * quarter-note pulse), 3 for the compound eighth meters (a dotted-quarter
 * pulse splits into 3 eighths), and 2 for 2/2 (a half-note pulse splits
 * into 2 quarters).
 *
 * That last case is why this isn't simply "3 for compound, 1 otherwise":
 * without it, 2/2's pulse — correctly TIMED by meterFeltPulseQuarterBeats
 * as twice a quarter note — is still just one flat tone, indistinguishable
 * by ear from a 2/4 pulse played at half tempo. Deriving both cases from
 * meterFeltPulseQuarterBeats (rather than hardcoding 2/2 as its own
 * special case next to the compound-meter one) generalizes the same idea
 * — "how many of the meter's own smallest natural units make up one felt
 * pulse" — to whichever meter needs it. */
export function meterPulseSubdivision(meter: Meter): number {
  const pulseQuarterBeats = meterFeltPulseQuarterBeats(meter);
  if (pulseQuarterBeats === 1.5) {
    return 3;
  }
  if (pulseQuarterBeats > 1) {
    return Math.round(pulseQuarterBeats);
  }
  return 1;
}
