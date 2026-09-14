const DEFAULT_TOLERANCE_MS = 200;

/** Ported verbatim from the web app's lib/questions/rhythmEcho.ts — scores
 * the GAPS between consecutive taps against the gaps between consecutive
 * target onsets, not absolute timestamps, so it doesn't matter exactly
 * when the player started tapping (only that the rhythm's own shape
 * matches). Requires exactly as many taps as targets. */
export function isValidRhythmEcho(
  tapTimestampsMs: number[],
  targetOnsetsMs: number[],
  toleranceMs: number = DEFAULT_TOLERANCE_MS
): boolean {
  if (targetOnsetsMs.length < 2 || tapTimestampsMs.length !== targetOnsetsMs.length) {
    return false;
  }

  for (let i = 1; i < targetOnsetsMs.length; i++) {
    const targetGap = targetOnsetsMs[i] - targetOnsetsMs[i - 1];
    const tapGap = tapTimestampsMs[i] - tapTimestampsMs[i - 1];
    if (Math.abs(tapGap - targetGap) > toleranceMs) {
      return false;
    }
  }

  return true;
}
