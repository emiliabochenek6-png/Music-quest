import type { LessonDefinition } from "@/types/exercises";

/** Same 3-state shape as WorldNodeState, minus "locked-subscription" —
 * subscription is already checked once, at the world level, before the
 * player ever reaches a world's own levels screen (see
 * app/(main)/map.tsx's own onSelectWorld), so a lesson inside an unlocked
 * world is never itself gated by it again. */
export type LessonNodeState = "completed" | "available" | "locked";

/** Lessons within one world unlock strictly sequentially by `order` — the
 * same rule ARCHITECTURE.md section 3.1 describes for worlds, one level
 * down. Mirrors lib/progression/resolveNodeState.ts's own shape. */
export function resolveLessonNodeState(
  lesson: LessonDefinition,
  lessons: readonly LessonDefinition[],
  completedLessonIds: ReadonlySet<string>,
  skippedLessonIds?: ReadonlySet<string>
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
  const previousDone = !previous || completedLessonIds.has(previous.id);
  return previousDone ? "available" : "locked";
}
