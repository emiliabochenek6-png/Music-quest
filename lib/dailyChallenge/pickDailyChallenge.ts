import { getWorldContent } from "@/data/lessons";
import { WORLDS } from "@/data/worlds";
import { resolveLessonNodeState } from "@/lib/progression/resolveLessonNodeState";
import { resolveNodeState } from "@/lib/progression/resolveNodeState";
import type { ProgressState, SubscriptionStatus } from "@/types/content";
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

/** A completed lesson's own exercises are entered into the pool this many
 * times each, vs. once for a lesson that's merely available/in-progress —
 * uniform random selection over a pool built this way then naturally
 * favors already-learned material more often than brand-new material,
 * without needing a separate weighted-random implementation or a second
 * pool type. This is the daily challenge's actual "review" lever: recently
 * finished content resurfaces more, not exclusively. */
const REVIEW_WEIGHT = 3;

/** Every ExerciseDefinition across every world/lesson the player has
 * already unlocked (available OR completed — a finished lesson's own
 * content still fairly counts as "known," and re-testing it is exactly
 * the kind of light review a daily challenge is for), short excluded
 * multi-step types. Completed lessons' exercises are repeated
 * REVIEW_WEIGHT times each (see that constant's own doc) so the daily
 * challenge leans toward reviewing what's already been learned rather
 * than picking uniformly across "just unlocked" and "long finished"
 * content alike. Reuses the SAME resolveNodeState/resolveLessonNodeState
 * this app's own map/levels screens already gate navigation with, so the
 * pool can never include content the player couldn't otherwise reach —
 * including resolveNodeState's own __DEV__ bypass (unlock-everything in
 * a dev build), which is fine here for the same reason it's fine on the
 * map itself. */
export function getUnlockedExercisePool(
  progress: ProgressState,
  subscription: SubscriptionStatus,
  lessonStars: Readonly<Record<string, 1 | 2 | 3>>
): ExerciseDefinition[] {
  const pool: ExerciseDefinition[] = [];
  for (const world of WORLDS) {
    const worldState = resolveNodeState(world, progress, subscription, lessonStars);
    if (worldState !== "available" && worldState !== "completed") continue;
    const content = getWorldContent(world.id);
    if (!content) continue;
    for (const lesson of content.lessons) {
      const lessonState = resolveLessonNodeState(lesson, content.lessons, progress.completedLessonIds);
      if (lessonState !== "available" && lessonState !== "completed") continue;
      const weight = lessonState === "completed" ? REVIEW_WEIGHT : 1;
      for (const exercise of lesson.exercises) {
        if (EXCLUDED_TYPES.has(exercise.type)) continue;
        for (let i = 0; i < weight; i++) pool.push(exercise);
      }
    }
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
