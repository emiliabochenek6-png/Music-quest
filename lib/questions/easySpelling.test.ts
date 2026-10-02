import { describe, expect, it } from "@jest/globals";
import { generateExercise } from "@/lib/questions/generate";
import type { ExerciseDefinition } from "@/types/exercises";

const EXOTIC = /^(E#|B#|Cb|Fb)|bb|##/;

function notesOf(definition: ExerciseDefinition): string[] {
  const generated = generateExercise(definition, "pl") as unknown as { notes?: string[] };
  return generated.notes ?? [];
}

describe("random chords avoid needlessly hard spellings", () => {
  it("triads in inversion exercises never use E#, B#, Cb, Fb or double accidentals", () => {
    const definition = {
      id: "t",
      type: "triad-inversion-choice",
      difficulty: 1,
      spec: { type: "triad-inversion-choice", noteRange: ["C4", "C5"], allowedQualities: ["major", "minor"] },
    } as unknown as ExerciseDefinition;
    for (let i = 0; i < 300; i++) {
      const notes = notesOf(definition);
      expect(notes.length).toBeGreaterThanOrEqual(3);
      for (const note of notes) expect(note).not.toMatch(EXOTIC);
    }
  });

  it("dominant sevenths never use them either", () => {
    const definition = {
      id: "d",
      type: "dominant-seventh-inversion-choice",
      difficulty: 1,
      spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C4", "C5"] },
    } as unknown as ExerciseDefinition;
    for (let i = 0; i < 300; i++) {
      const notes = notesOf(definition);
      expect(notes.length).toBeGreaterThanOrEqual(3);
      for (const note of notes) expect(note).not.toMatch(EXOTIC);
    }
  });
});
