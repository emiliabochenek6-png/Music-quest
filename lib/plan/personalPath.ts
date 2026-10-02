import type { PlacementLevel } from "@/lib/plan/placement";
import type { WorldContent } from "@/types/exercises";

export interface PathEntry {
  lessonId: string;
  worldId: string;
  /** 0-based position of the lesson inside its world. */
  lessonIndex: number;
  exerciseCount: number;
}

/** Which lessons of a world with `lessonCount` lessons a player at `level`
 * still needs, as 0-based indexes:
 *  - 0 "do nauki": every lesson;
 *  - 1 "częściowo": skip the first 40% (the basics they showed they know),
 *    keep the rest;
 *  - 2 "opanowane": a quick pass only — every 4th lesson plus the last one
 *    (the world's capstone/boss), so a lucky guess on two questions can't
 *    skip a whole world untouched. */
export function lessonIndexesToKeep(lessonCount: number, level: PlacementLevel): number[] {
  const all = Array.from({ length: lessonCount }, (_, index) => index);
  if (level === 0 || lessonCount <= 1) return all;
  if (level === 1) {
    const skip = Math.floor(lessonCount * 0.4);
    return all.slice(skip);
  }
  return all.filter((index) => (index + 1) % 4 === 0 || index === lessonCount - 1);
}

/** The ordered study path across all worlds. `levels === null` means "start
 * from the beginning": every lesson of every world, in curriculum order —
 * the original path. Otherwise each world is filtered by its own level
 * (a missing level counts as 0, "do nauki"). Worlds keep their curriculum
 * order either way, so what a player studies still builds on what came
 * before. */
export function buildPath(
  worlds: readonly { id: string }[],
  getContent: (worldId: string) => WorldContent | undefined,
  levels: Readonly<Record<string, PlacementLevel>> | null
): PathEntry[] {
  const entries: PathEntry[] = [];
  for (const world of worlds) {
    const content = getContent(world.id);
    if (!content) continue;
    const keep = levels === null ? lessonIndexesToKeep(content.lessons.length, 0) : lessonIndexesToKeep(content.lessons.length, levels[world.id] ?? 0);
    for (const lessonIndex of keep) {
      const lesson = content.lessons[lessonIndex];
      entries.push({ lessonId: lesson.id, worldId: world.id, lessonIndex, exerciseCount: lesson.exercises.length });
    }
  }
  return entries;
}
