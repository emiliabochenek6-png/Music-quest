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
        if (spec.type === "pitch-height-choice") {
          // Piano tone for "wysoki czy niski?" — must be inside the sample range C3-C6.
          expect(["low", "high"]).toContain(spec.correctSide);
          const octave = Number(spec.targetNote.slice(-1));
          expect(octave >= 3 && octave <= 6).toBe(true);
          continue;
        }
        if (spec.type !== "key-fact-choice") throw new Error(`${definition.id}: unexpected type ${spec.type}`);
        expect(spec.options.length).toBeGreaterThanOrEqual(2);
        expect(spec.options.length).toBeLessThanOrEqual(4);
        // "Quiz ABCD" questions have exactly four options.
        if (spec.abcd) expect(spec.options).toHaveLength(4);
        if (spec.referenceAudioSource !== undefined) expect(typeof spec.referenceAudioSource).toBe("number");
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

  it("has at least a few ABCD quiz questions and listening questions", () => {
    const specs = lessons.flatMap((lesson) => lesson.exercises.map((definition) => definition.spec)).filter((spec) => spec.type === "key-fact-choice");
    expect(specs.filter((spec) => spec.abcd).length).toBeGreaterThanOrEqual(5);
    expect(specs.filter((spec) => spec.referenceAudioSource !== undefined).length).toBeGreaterThanOrEqual(4);
  });

  it("shows every instrument a question mentions as an example card in that lesson's intro or an earlier one", () => {
    const shown = new Set<string>();
    for (const lesson of lessons) {
      const introduced = (lesson.introSlides ?? []).flatMap((slide) => (slide.instrumentExamples ?? []).map((example) => example.imageId));
      expect(introduced.length).toBeGreaterThan(0);
      for (const id of introduced) shown.add(id);
      for (const definition of lesson.exercises) {
        if (definition.spec.type !== "key-fact-choice") continue;
        const used = [definition.spec.imageId, ...(definition.spec.optionImageIds ?? [])].filter((id): id is string => !!id && id.startsWith("instrument_") && id !== "instrument_dyrygent");
        for (const id of used) expect(shown.has(id)).toBe(true);
      }
    }
  });
});
