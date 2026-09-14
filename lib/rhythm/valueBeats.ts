import type { RhythmNoteValue, RhythmRestValue } from "@/types/exercises";

/** Beat-length tables — the single shared source of truth for "how many
 * quarter-note beats does this value last", used by Szczyt Dyktand's
 * beam-grouping derivation and measure-boundary checks. Distinct from
 * lib/questions/generate.ts's own RHYTHM_NOTE_VALUE_BEATS/RHYTHM_REST_
 * VALUE_BEATS (same values, kept as a separate small module rather than
 * merged — matches the web app's own split). */
export const REST_VALUES: ReadonlySet<string> = new Set<RhythmRestValue>(["quarterRest", "eighthRest", "sixteenthRest"]);
export const NOTE_VALUE_BEATS: Record<RhythmNoteValue, number> = {
  whole: 4,
  half: 2,
  quarter: 1,
  dottedQuarter: 1.5,
  dottedHalf: 3,
  eighth: 0.5,
  dottedEighth: 0.75,
  sixteenth: 0.25,
  eighthTriplet: 1 / 3,
};
export const REST_VALUE_BEATS: Record<RhythmRestValue, number> = {
  quarterRest: 1,
  eighthRest: 0.5,
  sixteenthRest: 0.25,
};

export function beatsOf(value: RhythmNoteValue | RhythmRestValue): number {
  return REST_VALUES.has(value) ? REST_VALUE_BEATS[value as RhythmRestValue] : NOTE_VALUE_BEATS[value as RhythmNoteValue];
}

/** Guards against floating-point drift landing a cumulative beat total just
 * below a measure-boundary multiple (e.g. 3.9999999999996 instead of 4)
 * and reading as still-inside the previous measure. */
const MEASURE_EPSILON = 1e-9;

/** Which measure (0-indexed) `targetIndex` falls in, given the sequence's
 * own cumulative beat position and the meter's beats-per-measure. Used to
 * gate "Grupuj" clicks — two notes can only be merged/split if they land
 * in the same measure (a beam can never cross a bar line). */
export function measureIndexAt(
  sequence: readonly (RhythmNoteValue | RhythmRestValue)[],
  beatsPerMeasure: number,
  targetIndex: number
): number {
  let cumulativeBeats = 0;
  for (let i = 0; i < targetIndex; i++) {
    cumulativeBeats += beatsOf(sequence[i]);
  }
  return Math.floor(cumulativeBeats / beatsPerMeasure + MEASURE_EPSILON);
}
