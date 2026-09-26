/** The fraction of a lesson's exercises answered correctly needed for
 * each star tier — the lesson's exercises split into thirds by how many
 * were answered correctly, not by mistake count: get at least a third
 * right and you're at 1 star, two-thirds for 2 stars, all of them for 3.
 * A clean run (mistakeCount 0) always lands exactly on the 3-star
 * threshold (correctFraction 1), so that boundary case doesn't need its
 * own separate check the way it used to. */
const THREE_STAR_MIN_CORRECT_FRACTION = 1;
const TWO_STAR_MIN_CORRECT_FRACTION = 2 / 3;
const ONE_STAR_MIN_CORRECT_FRACTION = 1 / 3;

/** Raw threshold lookup, allowing 0 — shared by both functions below.
 * computeLessonStars floors this to 1 (a finished lesson always earns
 * something); computeLessonStarsProgress deliberately does NOT, since
 * "0 stars so far" is exactly what the live in-lesson indicator needs to
 * show before the player has actually crossed the first third. */
function starsForCorrectFraction(correctFraction: number): 0 | 1 | 2 | 3 {
  if (correctFraction >= THREE_STAR_MIN_CORRECT_FRACTION) return 3;
  if (correctFraction >= TWO_STAR_MIN_CORRECT_FRACTION) return 2;
  if (correctFraction >= ONE_STAR_MIN_CORRECT_FRACTION) return 1;
  return 0;
}

/** 1-3 star rating for a FINISHED lesson attempt. `mistakeCount` counts
 * every wrong ATTEMPT across the whole session, not just once per
 * exercise — app/(main)/lesson/[lessonId].tsx's own handleCheck requeues
 * a missed exercise onto the end of the session (Duolingo-style "makeup
 * round"), so the same question can be missed, and counted here, more
 * than once before it's finally answered right. `exerciseCount` stays
 * the lesson's fixed AUTHORED length regardless of how many makeup
 * rounds that produces — every original exercise always ends up answered
 * correctly eventually (the lesson can't finish otherwise), so grading
 * against a count that included repeats would make a perfect score
 * unavoidable; this keeps mistakes genuinely costly. At least a
 * third correct earns 1 star, at least two-thirds earns 2, a perfect run
 * earns 3 — completing a lesson always earns AT LEAST 1 star even below
 * that first third, since finishing itself is already the achievement
 * `markLessonCompleted` already recognizes, and this app has no "0
 * stars" state for a completed lesson. */
export function computeLessonStars(mistakeCount: number, exerciseCount: number): 1 | 2 | 3 {
  if (exerciseCount <= 0) return 1;
  const correctFraction = (exerciseCount - mistakeCount) / exerciseCount;
  return Math.max(1, starsForCorrectFraction(correctFraction)) as 1 | 2 | 3;
}

/** Same thirds-of-correct-answers thresholds as computeLessonStars, but
 * for a lesson still IN PROGRESS — takes how many exercises have been
 * answered correctly SO FAR (out of the lesson's fixed total), not a
 * mistake count projected against the whole lesson. Since `correctSoFar`
 * can only ever go up as the player answers more exercises (a skipped
 * question isn't possible in this app's own lesson flow), this value is
 * monotonically non-decreasing across a single attempt — stars light up
 * one by one as each threshold is actually crossed, rather than starting
 * at a best-case ceiling and only ever dropping. Can return 0 (unlike
 * computeLessonStars): nothing has been "earned" yet is a real, correct
 * state to show mid-lesson, not a completed lesson's rating. */
export function computeLessonStarsProgress(correctSoFar: number, totalExercises: number): 0 | 1 | 2 | 3 {
  if (totalExercises <= 0) return 0;
  return starsForCorrectFraction(correctSoFar / totalExercises);
}
