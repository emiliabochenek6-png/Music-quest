import { addDays } from "@/lib/plan/dates";
import type { LessonDefinition, ExerciseDefinition, ExerciseType } from "@/types/exercises";

/** Gaps (days) between successive reviews of a lesson once it's been
 * finished: the classic expanding-interval schedule — 1 day, 3, a week, two
 * weeks, a month, two months — each interval used only after the previous
 * review went well. */
export const REVIEW_INTERVAL_DAYS = [1, 3, 7, 14, 30, 60] as const;

/** How well a review round must go (share of correct answers) to move a
 * lesson to the next, longer interval; below it the lesson steps back. */
export const REVIEW_PASS_FRACTION = 0.6;

export interface ReviewEntry {
  /** Index into REVIEW_INTERVAL_DAYS of the interval the CURRENT due date
   * was scheduled with. */
  stage: number;
  dueISO: string;
  /** Date of the last time this lesson was completed or reviewed. */
  lastISO: string;
}

/** A lesson just finished for the first time: first review is due tomorrow. */
export function newReviewEntry(completedISO: string): ReviewEntry {
  return { stage: 0, dueISO: addDays(completedISO, REVIEW_INTERVAL_DAYS[0]), lastISO: completedISO };
}

/** The entry after one review round scored `fraction` (0-1) on `todayISO`:
 * a pass moves to the next interval (capped at the longest), a miss steps
 * back one stage and brings the lesson up again in two days. */
export function afterReview(entry: ReviewEntry, todayISO: string, fraction: number): ReviewEntry {
  if (fraction >= REVIEW_PASS_FRACTION) {
    const stage = Math.min(entry.stage + 1, REVIEW_INTERVAL_DAYS.length - 1);
    return { stage, dueISO: addDays(todayISO, REVIEW_INTERVAL_DAYS[stage]), lastISO: todayISO };
  }
  const stage = Math.max(0, entry.stage - 1);
  return { stage, dueISO: addDays(todayISO, 2), lastISO: todayISO };
}

/** Lessons whose review is due on or before `todayISO`, most overdue first. */
export function dueReviewIds(log: Readonly<Record<string, ReviewEntry>>, todayISO: string, limit: number): string[] {
  return Object.entries(log)
    .filter(([, entry]) => entry.dueISO <= todayISO)
    .sort((a, b) => (a[1].dueISO < b[1].dueISO ? -1 : a[1].dueISO > b[1].dueISO ? 1 : 0))
    .slice(0, limit)
    .map(([lessonId]) => lessonId);
}

/** Gives every already-completed lesson that has no review entry yet one,
 * staggered over the next days (so switching the plan on for a player with
 * 60 finished lessons doesn't make all 60 due at once). */
export function backfillReviewLog(
  log: Readonly<Record<string, ReviewEntry>>,
  completedLessonIds: Iterable<string>,
  todayISO: string
): Record<string, ReviewEntry> {
  const result = { ...log };
  let offset = 0;
  for (const lessonId of completedLessonIds) {
    if (result[lessonId]) continue;
    result[lessonId] = { stage: 0, dueISO: addDays(todayISO, 1 + (offset % 10)), lastISO: todayISO };
    offset++;
  }
  return result;
}

/** Exercise types a review round leaves out: timed, tap-timed, drawn, typed,
 * sung or dictation exercises are too long or too finicky for a few-minute
 * recap (same spirit as the daily challenge's own exclusions). */
const REVIEW_EXCLUDED_TYPES: ReadonlySet<ExerciseType> = new Set<ExerciseType>([
  "interval-timed-test",
  "pulse-tap",
  "rhythm-echo",
  "rhythm-dictation",
  "rhythm-notation-tap",
  "clef-trace",
  "note-word-spelling",
  "melodic-rhythmic-dictation",
  "rhythm-value-dictation",
  "solfege-note-singing",
  "solfege-phrase-singing",
]);

export const REVIEW_QUESTION_COUNT = 5;

/** `count` random exercises from `lesson` for a review round — quick types
 * only; a lesson made entirely of the excluded types (e.g. a pure singing
 * lesson) falls back to its own exercises so a review is never empty. */
export function pickReviewExercises(lesson: LessonDefinition, count: number = REVIEW_QUESTION_COUNT, random: () => number = Math.random): ExerciseDefinition[] {
  const eligible = lesson.exercises.filter((exercise) => !REVIEW_EXCLUDED_TYPES.has(exercise.type));
  const pool = eligible.length > 0 ? eligible : lesson.exercises;
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
