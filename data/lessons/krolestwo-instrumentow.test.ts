import { describe, expect, it } from "@jest/globals";
import { ICONS } from "@/components/icons/icons";
import { KROLESTWO_INSTRUMENTOW_CONTENT } from "@/data/lessons/krolestwo-instrumentow";
import { generateExercise } from "@/lib/questions/generate";
import { isAnswerCorrect } from "@/lib/questions/validate";

const lessons = KROLESTWO_INSTRUMENTOW_CONTENT.lessons;

describe("Królestwo Instrumentów content", () => {
  it("numbers lessons 1..N with no gaps", () => {
    expect(lessons.map((lesson) => lesson.order)).toEqual(lessons.map((_, index) => index + 1));
  });

  it("every question is a well-formed key-fact-choice", () => {
    for (const lesson of lessons) {
      for (const definition of lesson.exercises) {
        const spec = definition.spec;
        if (spec.type !== "key-fact-choice") throw new Error(`${definition.id}: unexpected type ${spec.type}`);
        expect(spec.options.length).toBeGreaterThanOrEqual(2);
        expect(spec.options.length).toBeLessThanOrEqual(3);
        expect(new Set(spec.options).size).toBe(spec.options.length);
        expect(spec.correctOptionIndex).toBeGreaterThanOrEqual(0);
        expect(spec.correctOptionIndex).toBeLessThan(spec.options.length);
        expect(spec.explanation).toBeTruthy();
        if (spec.imageId) expect(spec.imageId in ICONS).toBe(true);
        if (spec.optionImageIds) {
          expect(spec.optionImageIds).toHaveLength(spec.options.length);
          for (const id of spec.optionImageIds) if (id) expect(id in ICONS).toBe(true);
        }
      }
    }
  });

  it("varies the correct answer's position within each lesson", () => {
    for (const lesson of lessons) {
      const positions = new Set(lesson.exercises.map((definition) => (definition.spec.type === "key-fact-choice" ? definition.spec.correctOptionIndex : -1)));
      expect(positions.size).toBeGreaterThan(1);
    }
  });

  it("has no repeated question text and no repeated exercise ids", () => {
    const prompts = new Set<string>();
    const ids = new Set<string>();
    for (const lesson of lessons) {
      for (const definition of lesson.exercises) {
        expect(ids.has(definition.id)).toBe(false);
        ids.add(definition.id);
        if (definition.spec.type !== "key-fact-choice") continue;
        expect(prompts.has(definition.spec.prompt)).toBe(false);
        prompts.add(definition.spec.prompt);
      }
    }
  });

  it("grades the authored correct option as correct", () => {
    for (const lesson of lessons) {
      for (const definition of lesson.exercises) {
        if (definition.spec.type !== "key-fact-choice") continue;
        const exercise = generateExercise(definition, "pl");
        expect(isAnswerCorrect(exercise, { type: "key-fact-choice", selectedOptionId: String(definition.spec.correctOptionIndex) })).toBe(true);
      }
    }
  });
});
