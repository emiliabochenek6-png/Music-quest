import { describe, expect, it } from "@jest/globals";
import { generateExercise } from "@/lib/questions/generate";
import type { ExerciseDefinition } from "@/types/exercises";

function makeDefinition(overrides: Partial<ExerciseDefinition>): ExerciseDefinition {
  return { id: "test", type: "pitch-height-choice", difficulty: 1, spec: { type: "pitch-height-choice", targetNote: "C4", correctSide: "high" }, ...overrides } as ExerciseDefinition;
}

describe("generateExercise", () => {
  it("derives correctMotion as step when the staff-step distance is <= 1", () => {
    const definition = makeDefinition({
      type: "interval-distance-choice",
      spec: { type: "interval-distance-choice", notes: ["C4", "D4"] },
    });
    const exercise = generateExercise(definition, "pl");
    expect(exercise).toMatchObject({ type: "interval-distance-choice", correctMotion: "step" });
  });

  it("derives correctMotion as leap when the staff-step distance is > 1", () => {
    const definition = makeDefinition({
      type: "interval-distance-choice",
      spec: { type: "interval-distance-choice", notes: ["C4", "G4"] },
    });
    const exercise = generateExercise(definition, "pl");
    expect(exercise).toMatchObject({ type: "interval-distance-choice", correctMotion: "leap" });
  });

  it("derives note-sequencing's correctOrder by ascending MIDI pitch, not authored order", () => {
    const definition = makeDefinition({
      type: "note-sequencing",
      spec: { type: "note-sequencing", notes: ["G4", "C4", "E4"] },
    });
    const exercise = generateExercise(definition, "pl");
    expect(exercise).toMatchObject({ type: "note-sequencing", correctOrder: ["C4", "E4", "G4"] });
  });

  it("never shuffles note-sequencing into its own already-correct order", () => {
    // A 2-note ascending pair only has one non-trivial shuffle (the swap) —
    // run it many times to make flakiness from the reshuffle-retry loop
    // vanishingly unlikely to slip through.
    const definition = makeDefinition({
      type: "note-sequencing",
      spec: { type: "note-sequencing", notes: ["C4", "E4"] },
    });
    for (let i = 0; i < 50; i++) {
      const exercise = generateExercise(definition, "pl");
      if (exercise.type === "note-sequencing") {
        expect(exercise.shuffledNotes.join()).not.toBe(exercise.correctOrder.join());
      }
    }
  });

  it("builds multiple-choice-notation options including the target, sized to optionCount", () => {
    const definition = makeDefinition({
      type: "multiple-choice-notation",
      spec: { type: "multiple-choice-notation", targetNote: "C4", distractorPool: ["D4", "E4", "F4", "G4"] },
    });
    const exercise = generateExercise(definition, "pl");
    expect(exercise.type).toBe("multiple-choice-notation");
    if (exercise.type === "multiple-choice-notation") {
      expect(exercise.options).toHaveLength(3);
      expect(exercise.options.map((o) => o.id)).toContain("C4");
      expect(exercise.correctOptionId).toBe("C4");
      expect(exercise.clef).toBe("treble");
    }
  });

  it("derives note-word-spelling's targetWord from each note's own letter", () => {
    const definition = makeDefinition({
      type: "note-word-spelling",
      spec: { type: "note-word-spelling", notes: ["C4", "A4", "F4", "E4"] },
    });
    const exercise = generateExercise(definition, "pl");
    expect(exercise).toMatchObject({ type: "note-word-spelling", targetWord: "CAFE" });
  });

  it("derives line-or-space-choice's correctAnswer from the note's actual staff position", () => {
    // Treble staff lines bottom-to-top are E4/G4/B4/D5/F5 — G4 is the
    // second line; F4, by contrast, sits in the first SPACE (spaces are
    // F4/A4/C5/E5), which is exactly the "accidentals never move a note's
    // staff position" distinction this exercise type tests.
    const onLine = generateExercise(
      makeDefinition({ type: "line-or-space-choice", spec: { type: "line-or-space-choice", targetNote: "G4" } }),
      "pl"
    );
    expect(onLine).toMatchObject({ type: "line-or-space-choice", correctAnswer: "line" });

    const inSpace = generateExercise(
      makeDefinition({ type: "line-or-space-choice", spec: { type: "line-or-space-choice", targetNote: "F4" } }),
      "pl"
    );
    expect(inSpace).toMatchObject({ type: "line-or-space-choice", correctAnswer: "space" });
  });

  it("passes clef-trace, melody-direction-choice, pitch-height-choice, staff-placement through unchanged", () => {
    expect(
      generateExercise(makeDefinition({ type: "clef-trace", spec: { type: "clef-trace", clef: "bass" } }), "pl")
    ).toMatchObject({ type: "clef-trace", clef: "bass" });
    expect(
      generateExercise(
        makeDefinition({
          type: "melody-direction-choice",
          spec: { type: "melody-direction-choice", notes: ["C4", "E4"], correctDirection: "up" },
        }),
        "pl"
      )
    ).toMatchObject({ type: "melody-direction-choice", correctDirection: "up" });
    expect(
      generateExercise(makeDefinition({ type: "staff-placement", spec: { type: "staff-placement", targetStep: 4 } }), "pl")
    ).toMatchObject({ type: "staff-placement", targetStep: 4 });
  });

  it("derives pulse-tap's beat/tap timing and a 70%-of-required minHits fallback", () => {
    const definition = makeDefinition({
      type: "pulse-tap",
      spec: { type: "pulse-tap", bpm: 120, beatsPerMeasure: 4, measureCount: 2 },
    });
    const exercise = generateExercise(definition, "pl");
    expect(exercise.type).toBe("pulse-tap");
    if (exercise.type === "pulse-tap") {
      expect(exercise.beatTimesMs).toHaveLength(8);
      expect(exercise.requiredTapTimesMs).toEqual(exercise.beatTimesMs);
      expect(exercise.minHits).toBe(Math.ceil(8 * 0.7));
    }
  });

  it("restricts pulse-tap's requiredTapTimesMs to downbeats when accentOnly", () => {
    const definition = makeDefinition({
      type: "pulse-tap",
      spec: { type: "pulse-tap", bpm: 120, beatsPerMeasure: 4, measureCount: 2, accentOnly: true },
    });
    const exercise = generateExercise(definition, "pl");
    if (exercise.type === "pulse-tap") {
      expect(exercise.requiredTapTimesMs).toHaveLength(2);
      expect(exercise.beatTimesMs).toHaveLength(8);
    }
  });

  it("defaults meter-choice's bpm and optionPool when not authored", () => {
    const definition = makeDefinition({
      type: "meter-choice",
      spec: { type: "meter-choice", correctMeter: "3/4" },
    });
    const exercise = generateExercise(definition, "pl");
    expect(exercise).toMatchObject({ type: "meter-choice", correctMeter: "3/4", bpm: 100, optionPool: ["4/4", "3/4"] });
  });

  it("derives rhythm-sequencing's onsetsMs from cumulative note durations, one onset per tile", () => {
    const definition = makeDefinition({
      type: "rhythm-sequencing",
      spec: { type: "rhythm-sequencing", motif: ["quarter", "quarter", "half"], bpm: 60 },
    });
    const exercise = generateExercise(definition, "pl");
    if (exercise.type === "rhythm-sequencing") {
      // At 60bpm a quarter note is exactly 1000ms.
      expect(exercise.onsetsMs).toEqual([0, 1000, 2000]);
      expect(exercise.correctOrder).toEqual(["quarter", "quarter", "half"]);
      // Carried through so the exercise's own metronome click track can
      // match the tempo its onsets were actually generated at.
      expect(exercise.bpm).toBe(60);
    }
  });

  it("never shuffles rhythm-sequencing's motif into its own already-correct order", () => {
    const definition = makeDefinition({
      type: "rhythm-sequencing",
      spec: { type: "rhythm-sequencing", motif: ["quarter", "half"], bpm: 90 },
    });
    for (let i = 0; i < 50; i++) {
      const exercise = generateExercise(definition, "pl");
      if (exercise.type === "rhythm-sequencing") {
        expect(exercise.shuffledMotif.join()).not.toBe(exercise.correctOrder.join());
      }
    }
  });

  it("derives rhythm-dictation's onsetsMs, skipping over rests, defaulting meter to 4/4", () => {
    const definition = makeDefinition({
      type: "rhythm-dictation",
      spec: { type: "rhythm-dictation", bpm: 60, sequence: ["quarter", "quarterRest", "quarter"] },
    });
    const exercise = generateExercise(definition, "pl");
    if (exercise.type === "rhythm-dictation") {
      expect(exercise.meter).toBe("4/4");
      expect(exercise.beatsPerMeasure).toBe(4);
      expect(exercise.slotTimesMs).toEqual([0, 1000, 2000]);
      // The rest occupies a slot but never becomes a target onset.
      expect(exercise.onsetsMs).toEqual([0, 2000]);
    }
  });

  it("derives rhythm-notation-tap's requiredTapTimesMs the same rests-excluded way", () => {
    const definition = makeDefinition({
      type: "rhythm-notation-tap",
      spec: { type: "rhythm-notation-tap", bpm: 60, meter: "3/4", sequence: ["quarter", "eighth", "eighthRest", "quarter"] },
    });
    const exercise = generateExercise(definition, "pl");
    if (exercise.type === "rhythm-notation-tap") {
      expect(exercise.beatsPerMeasure).toBe(3);
      // quarter@0, eighth@1000, eighthRest@1500 (skipped), quarter@2000
      expect(exercise.requiredTapTimesMs).toEqual([0, 1000, 2000]);
    }
  });
});
