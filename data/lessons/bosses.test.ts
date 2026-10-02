import { describe, expect, it } from "@jest/globals";
import { WORLDS } from "@/data/worlds";
import { getWorldContent } from "@/data/lessons";

/** A boss level is always a MIX of what the world already taught: it never
 * introduces an exercise type the player has not met in an earlier level of
 * the same world, and it is the last level of its world. */
describe("boss levels are a mix of earlier levels", () => {
  for (const world of WORLDS) {
    const content = getWorldContent(world.id);
    if (!content) continue;
    const lessons = [...content.lessons].sort((a, b) => a.order - b.order);
    const boss = lessons.find((lesson) => lesson.isBoss);
    if (!boss) continue;

    it(`${world.id}: the boss comes last and only uses exercise types from earlier levels`, () => {
      expect(boss.order).toBe(lessons[lessons.length - 1].order);
      const earlierTypes = new Set(lessons.filter((lesson) => lesson.order < boss.order).flatMap((lesson) => lesson.exercises.map((exercise) => exercise.type)));
      const unseen = boss.exercises.filter((exercise) => !earlierTypes.has(exercise.type)).map((exercise) => exercise.id);
      expect(unseen).toEqual([]);
      expect(boss.exercises.length).toBeGreaterThanOrEqual(6);
    });
  }
});
