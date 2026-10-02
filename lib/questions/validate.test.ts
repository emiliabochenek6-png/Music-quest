import { describe, expect, it } from "@jest/globals";
import { isAnswerCorrect } from "@/lib/questions/validate";
import type { AnswerInput, GeneratedExercise } from "@/types/exercises";

describe("isAnswerCorrect", () => {
  it("throws if the answer's type doesn't match the exercise's own type", () => {
    const exercise: GeneratedExercise = { id: "x", type: "pitch-height-choice", targetNote: "C4", correctSide: "high" };
    const answer: AnswerInput = { type: "staff-placement", selectedStep: 4 };
    expect(() => isAnswerCorrect(exercise, answer)).toThrow();
  });

  it("checks pitch-height-choice by exact side match", () => {
    const exercise: GeneratedExercise = { id: "x", type: "pitch-height-choice", targetNote: "C4", correctSide: "high" };
    expect(isAnswerCorrect(exercise, { type: "pitch-height-choice", selectedSide: "high" })).toBe(true);
    expect(isAnswerCorrect(exercise, { type: "pitch-height-choice", selectedSide: "low" })).toBe(false);
  });

  it("checks note-sequencing position-by-position, not just as a set", () => {
    const exercise: GeneratedExercise = {
      id: "x",
      type: "note-sequencing",
      shuffledNotes: ["G4", "C4", "E4"],
      correctOrder: ["C4", "E4", "G4"],
      clef: "treble",
    };
    expect(isAnswerCorrect(exercise, { type: "note-sequencing", selectedOrder: ["C4", "E4", "G4"] })).toBe(true);
    // Right notes, wrong order.
    expect(isAnswerCorrect(exercise, { type: "note-sequencing", selectedOrder: ["E4", "C4", "G4"] })).toBe(false);
    // Incomplete.
    expect(isAnswerCorrect(exercise, { type: "note-sequencing", selectedOrder: ["C4", "E4"] })).toBe(false);
  });

  it("checks note-word-spelling case-insensitively, trimmed", () => {
    const exercise: GeneratedExercise = {
      id: "x",
      type: "note-word-spelling",
      notes: ["C4", "A4", "F4", "E4"],
      targetWord: "CAFE",
      clef: "treble",
    };
    expect(isAnswerCorrect(exercise, { type: "note-word-spelling", guess: "cafe" })).toBe(true);
    expect(isAnswerCorrect(exercise, { type: "note-word-spelling", guess: "  Cafe  " })).toBe(true);
    expect(isAnswerCorrect(exercise, { type: "note-word-spelling", guess: "cave" })).toBe(false);
  });

  it("checks clef-trace via isValidClefTrace (a plausible bounding-box diagonal), not exact shape", () => {
    const exercise: GeneratedExercise = { id: "x", type: "clef-trace", clef: "treble" };
    const tinyScribble: AnswerInput = {
      type: "clef-trace",
      points: [
        { x: 0, y: 0 },
        { x: 1, y: 1 },
        { x: 2, y: 2 },
      ],
    };
    const bigEnoughTrace: AnswerInput = {
      type: "clef-trace",
      points: [
        { x: 0, y: 0 },
        { x: 50, y: 75 },
        { x: 10, y: 140 },
      ],
    };
    expect(isAnswerCorrect(exercise, tinyScribble)).toBe(false);
    expect(isAnswerCorrect(exercise, bigEnoughTrace)).toBe(true);
  });

  it("checks multiple-choice-notation, line-or-space-choice, melody-direction-choice, interval-distance-choice, staff-placement by exact-field match", () => {
    expect(
      isAnswerCorrect(
        { id: "x", type: "multiple-choice-notation", targetNote: "C4", options: [], correctOptionId: "C4", clef: "treble" },
        { type: "multiple-choice-notation", selectedOptionId: "C4" }
      )
    ).toBe(true);
    expect(
      isAnswerCorrect(
        { id: "x", type: "line-or-space-choice", targetNote: "F4", correctAnswer: "line" },
        { type: "line-or-space-choice", selectedAnswer: "space" }
      )
    ).toBe(false);
    expect(
      isAnswerCorrect(
        { id: "x", type: "melody-direction-choice", notes: ["C4", "D4"], correctDirection: "up" },
        { type: "melody-direction-choice", selectedDirection: "up" }
      )
    ).toBe(true);
    expect(
      isAnswerCorrect(
        { id: "x", type: "interval-distance-choice", notes: ["C4", "D4"], correctMotion: "step" },
        { type: "interval-distance-choice", selectedMotion: "leap" }
      )
    ).toBe(false);
    expect(
      isAnswerCorrect(
        { id: "x", type: "staff-placement", targetStep: 4 },
        { type: "staff-placement", selectedStep: 4 }
      )
    ).toBe(true);
  });

  it("checks meter-choice by exact meter match", () => {
    const exercise: GeneratedExercise = { id: "x", type: "meter-choice", correctMeter: "3/4", bpm: 100, optionPool: ["4/4", "3/4"] };
    expect(isAnswerCorrect(exercise, { type: "meter-choice", selectedMeter: "3/4" })).toBe(true);
    expect(isAnswerCorrect(exercise, { type: "meter-choice", selectedMeter: "4/4" })).toBe(false);
  });

  it("checks pulse-tap via isValidPulseTap (enough beats matched within tolerance)", () => {
    const exercise: GeneratedExercise = {
      id: "x",
      type: "pulse-tap",
      bpm: 120,
      beatsPerMeasure: 4,
      measureCount: 1,
      accentOnly: false,
      beatTimesMs: [0, 500, 1000, 1500],
      requiredTapTimesMs: [0, 500, 1000, 1500],
      minHits: 3,
    };
    expect(isAnswerCorrect(exercise, { type: "pulse-tap", tapTimestampsMs: [10, 490, 1005] })).toBe(true);
    expect(isAnswerCorrect(exercise, { type: "pulse-tap", tapTimestampsMs: [10] })).toBe(false);
  });

  it("checks rhythm-sequencing by slot-index-to-correct-order position mapping", () => {
    const exercise: GeneratedExercise = {
      id: "x",
      type: "rhythm-sequencing",
      shuffledMotif: ["half", "quarter"],
      correctOrder: ["quarter", "half"],
      onsetsMs: [0, 500],
      bpm: 60,
    };
    // shuffledMotif[1]="quarter" picked first, shuffledMotif[0]="half" second — matches correctOrder.
    expect(isAnswerCorrect(exercise, { type: "rhythm-sequencing", selectedIndexes: [1, 0] })).toBe(true);
    expect(isAnswerCorrect(exercise, { type: "rhythm-sequencing", selectedIndexes: [0, 1] })).toBe(false);
  });

  it("checks rhythm-echo/rhythm-dictation/rhythm-notation-tap via isValidRhythmEcho's gap-based scoring", () => {
    const rhythmEcho: GeneratedExercise = { id: "x", type: "rhythm-echo", onsetsMs: [0, 500, 1000] };
    expect(isAnswerCorrect(rhythmEcho, { type: "rhythm-echo", tapTimestampsMs: [200, 705, 1180] })).toBe(true);
    expect(isAnswerCorrect(rhythmEcho, { type: "rhythm-echo", tapTimestampsMs: [200, 205, 210] })).toBe(false);

    const dictation: GeneratedExercise = {
      id: "x",
      type: "rhythm-dictation",
      bpm: 100,
      meter: "4/4",
      beatsPerMeasure: 4,
      sequence: ["quarter", "quarter"],
      slotTimesMs: [0, 500],
      onsetsMs: [0, 500],
    };
    expect(isAnswerCorrect(dictation, { type: "rhythm-dictation", tapTimestampsMs: [50, 540] })).toBe(true);

    const notationTap: GeneratedExercise = {
      id: "x",
      type: "rhythm-notation-tap",
      bpm: 100,
      meter: "4/4",
      beatsPerMeasure: 4,
      sequence: ["quarter", "quarter"],
      slotTimesMs: [0, 500],
      requiredTapTimesMs: [0, 500],
    };
    expect(isAnswerCorrect(notationTap, { type: "rhythm-notation-tap", tapTimestampsMs: [50, 540] })).toBe(true);
  });

  it("checks solfege-syllable-choice by exact syllable order", () => {
    const exercise: GeneratedExercise = {
      id: "x",
      type: "solfege-syllable-choice",
      targetNotes: ["C4", "E4"],
      solfegeSyllables: ["do", "mi"],
      options: ["do", "re", "mi"],
    };
    expect(isAnswerCorrect(exercise, { type: "solfege-syllable-choice", selectedSyllables: ["do", "mi"] })).toBe(true);
    expect(isAnswerCorrect(exercise, { type: "solfege-syllable-choice", selectedSyllables: ["mi", "do"] })).toBe(false);
    expect(isAnswerCorrect(exercise, { type: "solfege-syllable-choice", selectedSyllables: ["do", null] })).toBe(false);
  });

  it("accepts a self-reported (no-microphone) solfege singing answer as correct", () => {
    const note: GeneratedExercise = { id: "n", type: "solfege-note-singing", targetNote: "C4", solfegeSyllable: "do", toleranceCents: 70 };
    expect(isAnswerCorrect(note, { type: "solfege-note-singing", detectedFrequencyHz: null, selfReported: true })).toBe(true);
    expect(isAnswerCorrect(note, { type: "solfege-note-singing", detectedFrequencyHz: null })).toBe(false);
    const phrase: GeneratedExercise = {
      id: "p",
      type: "solfege-phrase-singing",
      notes: ["C4", "D4"],
      solfegeSyllables: ["do", "re"],
      toleranceCents: 70,
    };
    expect(isAnswerCorrect(phrase, { type: "solfege-phrase-singing", detectedFrequenciesHz: [null, null], selfReported: true })).toBe(true);
    expect(isAnswerCorrect(phrase, { type: "solfege-phrase-singing", detectedFrequenciesHz: [null, null] })).toBe(false);
  });
});

describe("interval-build-staff-choice: tritone spellings", () => {
  const tritone = {
    id: "t",
    type: "interval-build-staff-choice",
    rootNote: "C4",
    rootDisplayName: "C",
    intervalName: "tryton (4<)",
    direction: "up",
    targetStep: 3, // A4 (E4 = step 0)
    targetAccidental: 1, // A#
    targetDisplayName: "ais",
    allowDoubleAccidentals: false,
    clickableSteps: [],
  } as unknown as Parameters<typeof isAnswerCorrect>[0];

  it("accepts the augmented fourth and the diminished fifth for a tritone", () => {
    expect(isAnswerCorrect(tritone, { type: "interval-build-staff-choice", selectedStep: 3, selectedAccidental: 1 })).toBe(true);
    expect(isAnswerCorrect(tritone, { type: "interval-build-staff-choice", selectedStep: 4, selectedAccidental: -1 })).toBe(true);
    expect(isAnswerCorrect(tritone, { type: "interval-build-staff-choice", selectedStep: 3, selectedAccidental: 0 })).toBe(false);
  });

  it("still needs the exact spelling for other intervals", () => {
    const fourth = { ...(tritone as object), intervalName: "kwarta czysta (4)", targetAccidental: 0 } as unknown as Parameters<typeof isAnswerCorrect>[0];
    expect(isAnswerCorrect(fourth, { type: "interval-build-staff-choice", selectedStep: 3, selectedAccidental: 0 })).toBe(true);
    expect(isAnswerCorrect(fourth, { type: "interval-build-staff-choice", selectedStep: 4, selectedAccidental: -2 })).toBe(false);
  });
});
