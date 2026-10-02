import { getWorldContent } from "@/data/lessons";
import { WORLDS } from "@/data/worlds";
import type { ProgressState } from "@/types/content";
import type { ExerciseDefinition, ExerciseType } from "@/types/exercises";

/** Exercise types left out of the daily-challenge pool — not because
 * they're randomized/fixed differently (see generateExercise's own
 * doc), but because they're each a self-contained multi-step mini-game
 * (a timed test, a many-measure metronome pattern, a whole tap-back
 * sequence) that reduces to ONE ExerciseDefinition/AnswerInput pair at
 * the type level but doesn't feel like "one quick daily exercise" in
 * practice — a jarring fit for a screen meant to be a 30-second daily
 * check-in. Every other exercise type (~33 of the app's 38) stays
 * eligible. */
const EXCLUDED_TYPES: ReadonlySet<ExerciseType> = new Set<ExerciseType>([
  "interval-timed-test",
  "pulse-tap",
  "rhythm-echo",
  "rhythm-dictation",
  "rhythm-notation-tap",
]);

/** The daily challenge draws ONLY from lessons the player has finished —
 * whether they did them in "Tryb zabawy" or in "Tryb nauki" makes no
 * difference, both record into the same `completedLessonIds`. So the
 * challenge is always a fair question about something already learned,
 * never about a lesson not yet seen. A brand-new player with nothing
 * finished yet gets the very first lesson of the first world, so the tab
 * is never empty. Short excluded multi-step types (see EXCLUDED_TYPES).
 *
 * Lessons are looked up by id straight from the content, with no
 * unlock-state gating: a finished lesson is by definition reachable. */
export function getUnlockedExercisePool(progress: ProgressState): ExerciseDefinition[] {
  const pool: ExerciseDefinition[] = [];
  const addLesson = (lesson: { exercises: readonly ExerciseDefinition[] }) => {
    for (const exercise of lesson.exercises) {
      if (!EXCLUDED_TYPES.has(exercise.type)) pool.push(exercise);
    }
  };
  for (const world of WORLDS) {
    const content = getWorldContent(world.id);
    if (!content) continue;
    for (const lesson of content.lessons) {
      if (progress.completedLessonIds.has(lesson.id)) addLesson(lesson);
    }
  }
  if (pool.length === 0) {
    const firstContent = WORLDS.length > 0 ? getWorldContent(WORLDS[0].id) : undefined;
    const firstLesson = firstContent?.lessons.find((lesson) => lesson.order === 1);
    if (firstLesson) addLesson(firstLesson);
  }
  return pool;
}

/** One random pick from an already-built pool (see
 * getUnlockedExercisePool) — null only when the pool itself is empty
 * (a brand-new player with nothing unlocked yet beyond world 1's own
 * first lesson, which is always at least "available" so this should be
 * rare in practice). Deliberately NOT date-seeded: the caller
 * (app/(main)/daily-challenge.tsx) persists whichever GeneratedExercise
 * this pick resolves to for the whole calendar day (see
 * DailyChallengeState's own doc), so a stable per-day pick only needs to
 * happen ONCE, not be re-derivable from the date on every call. */
export function pickDailyChallengeDefinition(pool: readonly ExerciseDefinition[]): ExerciseDefinition | null {
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}
