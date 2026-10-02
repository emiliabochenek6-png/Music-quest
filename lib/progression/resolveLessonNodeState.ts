import { MIN_STARS_TO_ADVANCE_WORLD } from "@/types/gamification";
import type { LessonDefinition } from "@/types/exercises";

/** Same 3-state shape as WorldNodeState, minus "locked-subscription" —
 * subscription is already checked once, at the world level, before the
 * player ever reaches a world's own levels screen (see
 * app/(main)/map.tsx's own onSelectWorld), so a lesson inside an unlocked
 * world is never itself gated by it again. */
export type LessonNodeState = "completed" | "available" | "locked";

/** Whether a finished lesson earned enough stars to open the next one. A
 * finished lesson with no star record at all (saved before stars existed) counts as passed. */
export function passedForNextLesson(lessonId: string, lessonStars?: Readonly<Record<string, 1 | 2 | 3>>): boolean {
  const stars = lessonStars?.[lessonId];
  return stars === undefined || stars >= MIN_STARS_TO_ADVANCE_WORLD;
}

/** In "Tryb zabawy" every world starts at level 1 and the levels open one
 * by one: level N+1 opens once level N is finished with at least
 * MIN_STARS_TO_ADVANCE_WORLD (2) stars — a level done with fewer stars stays
 * playable ("completed") but does not open the next one until it's repeated
 * for a better score. Mirrors lib/progression/resolveNodeState.ts's own shape. */
export function resolveLessonNodeState(
  lesson: LessonDefinition,
  lessons: readonly LessonDefinition[],
  completedLessonIds: ReadonlySet<string>,
  skippedLessonIds?: ReadonlySet<string>,
  lessonStars?: Readonly<Record<string, 1 | 2 | 3>>
): LessonNodeState {
  if (completedLessonIds.has(lesson.id)) {
    return "completed";
  }
  // A lesson the player's personal study path leaves out (see lib/plan)
  // never blocks the next one — look back past skipped lessons to the
  // nearest one that is part of the path.
  let previousOrder = lesson.order - 1;
  let previous = lessons.find((l) => l.order === previousOrder);
  while (previous && skippedLessonIds?.has(previous.id) && !completedLessonIds.has(previous.id)) {
    previousOrder -= 1;
    previous = lessons.find((l) => l.order === previousOrder);
  }
  const previousDone = !previous || (completedLessonIds.has(previous.id) && passedForNextLesson(previous.id, lessonStars));
  return previousDone ? "available" : "locked";
}
