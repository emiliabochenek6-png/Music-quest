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

/** Star bars for the timed test's own correct-vs-wrong ratio — stricter
 * than the 60% pass bar above, so the rating reflects how well the run
 * went instead of pass = 3 stars. */
const THREE_STAR_MIN_RATIO = 0.9;
const TWO_STAR_MIN_RATIO = 0.7;

/** 1-3 stars for a finished timed test, from how many of its answers were
 * right vs wrong: at least 90% correct is 3 stars, at least 70% is 2,
 * anything below is 1 (finishing always earns at least one star, same as
 * every other lesson — see computeLessonStars). A run with no answers at
 * all is 1 star. */
export function computeIntervalTimedTestStars(correctCount: number, totalCount: number): 1 | 2 | 3 {
  if (totalCount <= 0) return 1;
  const ratio = correctCount / totalCount;
  if (ratio >= THREE_STAR_MIN_RATIO) return 3;
  if (ratio >= TWO_STAR_MIN_RATIO) return 2;
  return 1;
}
