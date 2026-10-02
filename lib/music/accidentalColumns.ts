/** Engraving rule for chords written with several accidentals: two
 * accidentals closer than a seventh (6 staff steps) would print on top of
 * each other if both sat in the same column left of the noteheads, so each
 * one goes into the first column (counting outward from the noteheads)
 * where it clears everything already placed there. Topmost accidental
 * first, so it sits nearest the chord, the next one a column further out,
 * and a lower one drops back into an inner column once it's far enough
 * below. */
export const ACCIDENTAL_MIN_STEP_GAP = 6;

/** For each note, the 0-based column its accidental goes in, or -1 when the
 * note has none. `steps` are staff steps (higher = higher pitch),
 * `accidentals` the matching accidental per note (0 = none). */
export function assignAccidentalColumns(steps: readonly number[], accidentals: readonly number[], minGap: number = ACCIDENTAL_MIN_STEP_GAP): number[] {
  const columns = steps.map(() => -1);
  const placedByColumn: number[][] = [];
  const order = steps.map((_, index) => index).filter((index) => accidentals[index] !== 0).sort((a, b) => steps[b] - steps[a]);
  for (const index of order) {
    let column = 0;
    while ((placedByColumn[column] ?? []).some((otherStep) => Math.abs(otherStep - steps[index]) < minGap)) column++;
    (placedByColumn[column] ??= []).push(steps[index]);
    columns[index] = column;
  }
  return columns;
}
