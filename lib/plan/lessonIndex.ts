import { getWorldContent } from "@/data/lessons";
import { WORLDS } from "@/data/worlds";
import { lessonMinutes } from "@/lib/plan/schedule";

export interface LessonInfo {
  lessonId: string;
  worldId: string;
  /** 0-based position of the lesson inside its world. */
  lessonIndex: number;
  lessonCount: number;
  exerciseCount: number;
  minutes: number;
  isBoss: boolean;
}

let cache: Map<string, LessonInfo> | null = null;

/** Every lesson of every world, by lesson id — built once, since lesson
 * content is static. The plan stores only lesson ids; this is how a screen
 * turns an id back into "which world, which lesson, how long". */
export function getLessonInfoMap(): ReadonlyMap<string, LessonInfo> {
  if (cache) return cache;
  const map = new Map<string, LessonInfo>();
  for (const world of WORLDS) {
    const content = getWorldContent(world.id);
    if (!content) continue;
    content.lessons.forEach((lesson, lessonIndex) => {
      map.set(lesson.id, {
        lessonId: lesson.id,
        worldId: world.id,
        lessonIndex,
        lessonCount: content.lessons.length,
        exerciseCount: lesson.exercises.length,
        minutes: lessonMinutes(lesson.exercises.length),
        isBoss: lesson.isBoss === true,
      });
    });
  }
  cache = map;
  return map;
}

export function getLessonInfo(lessonId: string): LessonInfo | undefined {
  return getLessonInfoMap().get(lessonId);
}
