import { describe, expect, it } from "@jest/globals";
import { ZACZAROWANY_SOLFEZ_CONTENT } from "@/data/lessons/zaczarowany-solfez";
import { generateExercise, getExerciseSignature } from "@/lib/questions/generate";

describe("Zaczarowany Solfeż content", () => {
  it("numbers lessons 1..N with no gaps, so strictly-sequential unlocking never skips one", () => {
    const orders = ZACZAROWANY_SOLFEZ_CONTENT.lessons.map((lesson) => lesson.order);
    expect(orders).toEqual(orders.map((_, index) => index + 1));
  });

  it("starts with the four no-microphone listening lessons", () => {
    const ids = ZACZAROWANY_SOLFEZ_CONTENT.lessons.slice(0, 4).map((lesson) => lesson.id);
    expect(ids).toEqual(["zs-sluch-1-dom-do", "zs-sluch-2-do-re-mi", "zs-sluch-3-pierwsza-piatka", "zs-sluch-4-cala-gama"]);
    for (const lesson of ZACZAROWANY_SOLFEZ_CONTENT.lessons.slice(0, 4)) {
      expect(lesson.exercises.every((exercise) => exercise.type === "solfege-syllable-choice")).toBe(true);
    }
  });

  it("never repeats a listening exercise within one lesson attempt", () => {
    for (const lesson of ZACZAROWANY_SOLFEZ_CONTENT.lessons.slice(0, 4)) {
      // Randomized, so repeat the whole attempt to catch an unlucky roll.
      for (let attempt = 0; attempt < 50; attempt++) {
        const seen = new Set<string>();
        for (const definition of lesson.exercises) {
          const exercise = generateExercise(definition, "pl", seen);
          const signature = getExerciseSignature(exercise);
          expect(signature).not.toBeNull();
          expect(seen.has(signature as string)).toBe(false);
          seen.add(signature as string);
        }
      }
    }
  });

  it("keeps every heard note inside the C3-C6 sample range", () => {
    for (const lesson of ZACZAROWANY_SOLFEZ_CONTENT.lessons.slice(0, 4)) {
      for (const definition of lesson.exercises) {
        if (definition.spec.type !== "solfege-syllable-choice") continue;
        for (const note of definition.spec.notePool) {
          const octave = Number(note.slice(-1));
          expect(octave >= 3 && octave <= 6).toBe(true);
        }
      }
    }
  });
});
