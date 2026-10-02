import { describe, expect, it } from "@jest/globals";
import { ZACZAROWANY_SOLFEZ_CONTENT } from "@/data/lessons/zaczarowany-solfez";
import { generateExercise, getExerciseSignature } from "@/lib/questions/generate";
import { meterQuarterNoteBeats } from "@/lib/rhythm/meter";
import { NOTE_VALUE_BEATS } from "@/lib/rhythm/valueBeats";

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

  it("short-melody levels (withMetronome) fill whole measures, no note crossing a barline", () => {
    const melodyLessons = ZACZAROWANY_SOLFEZ_CONTENT.lessons.filter((lesson) => lesson.id.startsWith("zs-melodie-"));
    expect(melodyLessons).toHaveLength(3);
    for (const lesson of melodyLessons) {
      for (const definition of lesson.exercises) {
        const spec = definition.spec;
        if (spec.type !== "solfege-phrase-singing") throw new Error(`${definition.id}: unexpected type`);
        expect(spec.withMetronome).toBe(true);
        expect(spec.sourceLabel).toBeTruthy();
        // All three melody levels (12-14) are metronome-only: no recording.
        expect(spec.metronomeOnly).toBe(true);
        expect(spec.bpm).toBeDefined();
        expect(spec.bpm as number).toBeLessThanOrEqual(72);
        expect(spec.rhythm).toHaveLength(spec.notes.length);
        const measureBeats = meterQuarterNoteBeats(spec.meter ?? "4/4");
        let cursor = 0;
        for (const value of spec.rhythm as (keyof typeof NOTE_VALUE_BEATS)[]) {
          const beats = NOTE_VALUE_BEATS[value];
          // A note must end inside the measure it starts in.
          expect(Math.floor(cursor / measureBeats)).toBe(Math.floor((cursor + beats - 1e-9) / measureBeats));
          cursor += beats;
        }
        expect(cursor % measureBeats).toBe(0);
      }
    }
  });
});
