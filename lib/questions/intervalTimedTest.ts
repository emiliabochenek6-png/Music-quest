/** Same generous, encouragement-first scoring philosophy as the rest of
 * this app's answer checking — a timed test doesn't need every question
 * right, just a solid majority, and answering nothing (time ran out
 * before the player attempted a single question) never counts as a pass.
 * Ported verbatim from the web app's lib/questions/intervalTimedTest.ts. */
const DEFAULT_PASS_RATIO = 0.6;

/**
 * "Pasmo Interwałów" level 8 — did the player answer enough of the timed
 * test's rapid-fire questions correctly? Scored as one ratio over the
 * whole run rather than per-question, since the run itself (not any
 * single question) is the exercise.
 */
export function isValidIntervalTimedTest(correctCount: number, totalCount: number, passRatio: number = DEFAULT_PASS_RATIO): boolean {
  if (totalCount <= 0) {
    return false;
  }
  return correctCount / totalCount >= passRatio;
}
