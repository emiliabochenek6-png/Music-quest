/** The fraction of a lesson's exercises answered correctly needed for
 * each star tier — the lesson's exercises split into thirds by how many
 * were answered correctly, not by mistake count: get at least a third
 * right and you're at 1 star, two-thirds for 2 stars, all of them for 3.
 * A clean run (mistakeCount 0) always lands exactly on the 3-star
 * threshold (correctFraction 1), so that boundary case doesn't need its
 * own separate check the way it used to. */
const THREE_STAR_MIN_CORRECT_FRACTION = 1;
const TWO_STAR_MIN_CORRECT_FRACTION = 2 / 3;

/** 1-3 star rating for a finished lesson attempt, from how many of its
 * exercises were answered correctly on the first (and only — this app's
 * own lesson flow never offers a retry on the same question, see
 * app/(main)/lesson/[lessonId].tsx's own handleCheck) attempt: at least a
 * third correct earns 1 star, at least two-thirds earns 2, a perfect run
 * earns 3 — completing a lesson always earns AT LEAST 1 star even below
 * that first third, since finishing itself is already the achievement
 * `markLessonCompleted` already recognizes, and this app has no "0
 * stars" state. */
export function computeLessonStars(mistakeCount: number, exerciseCount: number): 1 | 2 | 3 {
  if (exerciseCount <= 0) return 1;
  const correctFraction = (exerciseCount - mistakeCount) / exerciseCount;
  if (correctFraction >= THREE_STAR_MIN_CORRECT_FRACTION) return 3;
  if (correctFraction >= TWO_STAR_MIN_CORRECT_FRACTION) return 2;
  return 1;
}
