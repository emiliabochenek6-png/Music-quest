// Bumped from 200 — Miasto Rytmu lekcje 2/3 dropped their metronome
// reference entirely (see RhythmEchoExercise.tsx's own
// showStandaloneMetronome doc), so a player now taps back a rhythm with
// no steady click to anchor against, only the felt gaps between claps.
// 300ms stays comfortably below half a beat at any tempo these lessons
// use, so a genuinely wrong gap (echoing the wrong note VALUE, not just
// slightly early/late) still fails.
const DEFAULT_TOLERANCE_MS = 300;

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
