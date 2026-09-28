// Bumped from 200, then from 300 — Miasto Rytmu lekcje 2/3 dropped their
// metronome reference entirely (see RhythmEchoExercise.tsx's own
// showStandaloneMetronome doc), so a player now taps back a rhythm with
// no steady click to anchor against, only the felt gaps between claps.
// 300ms proved too strict on longer dictations (lekcja 12's own 3-measure
// sequences) — a real child's tap drifts more over a longer sequence than
// over rhythm-echo's short ones. 400ms is still comfortably under half a
// beat at these lessons' slowest tempo (100bpm → 600ms/beat), so a
// genuinely wrong gap (echoing the wrong note VALUE, not just slightly
// early/late) still fails.
const DEFAULT_TOLERANCE_MS = 400;

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
