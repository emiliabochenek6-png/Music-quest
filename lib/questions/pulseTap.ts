const DEFAULT_TOLERANCE_MS = 180;

/** Ported verbatim from the web app's lib/questions/pulseTap.ts — greedy
 * nearest-match scoring: each required beat claims the closest still-
 * unused tap within tolerance, and the player passes once enough beats
 * found a match. */
export function isValidPulseTap(
  tapTimestampsMs: number[],
  requiredTapTimesMs: number[],
  minHits: number,
  toleranceMs: number = DEFAULT_TOLERANCE_MS
): boolean {
  if (requiredTapTimesMs.length === 0 || minHits <= 0) {
    return false;
  }

  const usedTapIndexes = new Set<number>();
  let hits = 0;
  for (const target of requiredTapTimesMs) {
    const matchIndex = tapTimestampsMs.findIndex(
      (tap, index) => !usedTapIndexes.has(index) && Math.abs(tap - target) <= toleranceMs
    );
    if (matchIndex !== -1) {
      usedTapIndexes.add(matchIndex);
      hits++;
    }
  }

  return hits >= minHits;
}
