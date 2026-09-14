/** A lesson's own mistake FRACTION at or below this earns the middle
 * star rating (2) rather than the bottom one (1) — 0 mistakes always
 * earns the top rating (3), checked separately since 0/0 would
 * otherwise divide by zero for a (theoretical) empty lesson. */
const TWO_STAR_MAX_MISTAKE_FRACTION = 0.25;

/** 1-3 star rating for a finished lesson attempt, from how many of its
 * exercises were missed on the first (and only — this app's own lesson
 * flow never offers a retry on the same question, see
 * app/(main)/lesson/[lessonId].tsx's own handleCheck) attempt: a clean
 * run earns 3, up to a quarter missed still earns 2, more than that
 * earns 1 — completing a lesson always earns AT LEAST 1 star, there's
 * no "0 stars," since finishing itself is already the achievement
 * `markLessonCompleted` already recognizes. */
export function computeLessonStars(mistakeCount: number, exerciseCount: number): 1 | 2 | 3 {
  if (mistakeCount <= 0) return 3;
  if (exerciseCount <= 0) return 1;
  const mistakeFraction = mistakeCount / exerciseCount;
  return mistakeFraction <= TWO_STAR_MAX_MISTAKE_FRACTION ? 2 : 1;
}
