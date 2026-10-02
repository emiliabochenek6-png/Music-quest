import { describe, expect, it } from "@jest/globals";
import { WORLDS } from "@/data/worlds";
import { getWorldContent } from "@/data/lessons";
import { generateExercise } from "@/lib/questions/generate";

/** Every exercise of every lesson can be generated (several random draws each) without throwing. */
describe("all exercises generate", () => {
  for (const world of WORLDS) {
    const content = getWorldContent(world.id);
    if (!content) continue;
    it(`${world.id}`, () => {
      for (const lesson of content.lessons) {
        for (const exercise of lesson.exercises) {
          for (let i = 0; i < 6; i++) {
            expect(() => generateExercise(exercise, "pl")).not.toThrow();
          }
        }
      }
    });
  }
});
