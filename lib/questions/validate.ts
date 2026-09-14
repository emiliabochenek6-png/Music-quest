import { isValidClefTrace } from "./clefTrace";
import { isValidIntervalTimedTest } from "./intervalTimedTest";
import { isValidPulseTap } from "./pulseTap";
import { isValidRhythmEcho } from "./rhythmEcho";
import { areEnharmonicallyEqual, noteToFrequency, octaveFoldedCentsDifference, parseScientific } from "@/lib/music/notes";
import { deriveBeamGroups } from "@/lib/rhythm/beamGrouping";
import { NOTE_VALUE_BEATS, REST_VALUE_BEATS, REST_VALUES } from "@/lib/rhythm/valueBeats";
import type { AnswerInput, GeneratedExercise, Meter, RhythmNoteValue, RhythmRestValue } from "@/types/exercises";

/** Every onset's own beat position (rests advance the cursor without
 * producing one), plus the sequence's total beat length — two sequences
 * with the same onset positions and total length are audibly identical
 * when clapped/played back (playRhythm only schedules a short, fixed-
 * length blip per onset — nothing about a note's own VALUE is ever
 * audible, only the silence until the next one): a half note and a
 * quarter followed by a quarter rest are indistinguishable by ear, even
 * though they're different written notation. */
function sequenceOnsetsAndTotalBeats(sequence: readonly (RhythmNoteValue | RhythmRestValue)[]): {
  onsetsBeats: number[];
  totalBeats: number;
} {
  const onsetsBeats: number[] = [];
  let cumulativeBeats = 0;
  for (const value of sequence) {
    if (REST_VALUES.has(value)) {
      cumulativeBeats += REST_VALUE_BEATS[value as RhythmRestValue];
    } else {
      onsetsBeats.push(cumulativeBeats);
      cumulativeBeats += NOTE_VALUE_BEATS[value as RhythmNoteValue];
    }
  }
  return { onsetsBeats, totalBeats: cumulativeBeats };
}

/**
 * Single answer-checking entry point, dispatched on `exercise.type` —
 * mirrors the web app's lib/questions/validate.ts split (generate.ts is
 * the other half) for the 9 Wioska Nut exercise types.
 */
export function isAnswerCorrect(exercise: GeneratedExercise, answer: AnswerInput): boolean {
  if (exercise.type !== answer.type) {
    throw new Error(`Answer type "${answer.type}" does not match exercise type "${exercise.type}"`);
  }

  switch (exercise.type) {
    case "clef-trace":
      return isValidClefTrace((answer as { points: { x: number; y: number }[] }).points);
    case "interval-distance-choice":
      return exercise.correctMotion === (answer as { selectedMotion: "step" | "leap" }).selectedMotion;
    case "line-or-space-choice":
      return exercise.correctAnswer === (answer as { selectedAnswer: "line" | "space" }).selectedAnswer;
    case "melody-direction-choice":
      return exercise.correctDirection === (answer as { selectedDirection: "up" | "down" | "same" }).selectedDirection;
    case "multiple-choice-notation":
      return exercise.correctOptionId === (answer as { selectedOptionId: string }).selectedOptionId;
    case "note-sequencing": {
      const { selectedOrder } = answer as { selectedOrder: string[] };
      return (
        selectedOrder.length === exercise.correctOrder.length &&
        selectedOrder.every((note, index) => note === exercise.correctOrder[index])
      );
    }
    case "note-word-spelling":
      return exercise.targetWord === (answer as { guess: string }).guess.trim().toUpperCase();
    case "pitch-height-choice":
      return exercise.correctSide === (answer as { selectedSide: "high" | "low" }).selectedSide;
    case "staff-placement":
      return exercise.targetStep === (answer as { selectedStep: number }).selectedStep;
    case "pulse-tap":
      return isValidPulseTap(
        (answer as { tapTimestampsMs: number[] }).tapTimestampsMs,
        exercise.requiredTapTimesMs,
        exercise.minHits
      );
    case "meter-choice":
      return exercise.correctMeter === (answer as { selectedMeter: Meter }).selectedMeter;
    case "rhythm-echo":
      return isValidRhythmEcho((answer as { tapTimestampsMs: number[] }).tapTimestampsMs, exercise.onsetsMs);
    case "rhythm-sequencing": {
      const { selectedIndexes } = answer as { selectedIndexes: number[] };
      return (
        selectedIndexes.length === exercise.correctOrder.length &&
        selectedIndexes.every((slotIndex, position) => exercise.shuffledMotif[slotIndex] === exercise.correctOrder[position])
      );
    }
    case "rhythm-dictation":
      // Same free-timed, gap-based reproduction as rhythm-echo — no
      // separate scoring function needed, the mechanic is identical.
      return isValidRhythmEcho((answer as { tapTimestampsMs: number[] }).tapTimestampsMs, exercise.onsetsMs);
    case "rhythm-notation-tap":
      return isValidRhythmEcho((answer as { tapTimestampsMs: number[] }).tapTimestampsMs, exercise.requiredTapTimesMs);
    case "interval-name-choice":
      return exercise.correctOptionId === (answer as { selectedOptionId: string }).selectedOptionId;
    case "interval-timed-test": {
      const { correctCount, totalCount } = answer as { correctCount: number; totalCount: number };
      return isValidIntervalTimedTest(correctCount, totalCount);
    }
    case "triad-notes-choice":
    case "triad-fact-choice":
    case "triad-quality-choice":
    case "triad-inversion-choice":
    case "dominant-seventh-inversion-choice":
    case "triad-role-choice":
    case "key-fact-choice":
    case "key-signature-names-choice":
    case "circle-neighbor-key-choice":
    case "key-signature-staff-choice":
    case "accidental-count-key-choice":
      return exercise.correctOptionId === (answer as { selectedOptionId: string }).selectedOptionId;
    case "circle-step-choice":
    case "relative-key-choice":
      return exercise.correctFifths === (answer as { selectedFifths: number }).selectedFifths;
    case "interval-build-choice":
      // Enharmonic, not string, equality — PianoKeyboard's clicked keys
      // always report their canonical sharp/natural spelling (see
      // lib/music/notes.ts's midiToNote), but exercise.targetNote can be
      // flat-spelled (e.g. the sharp root's own noteAtInterval fallback),
      // so a musically-correct click must still compare by pitch.
      return areEnharmonicallyEqual(
        parseScientific(exercise.targetNote),
        parseScientific((answer as { selectedNote: string }).selectedNote)
      );
    case "interval-build-staff-choice": {
      const { selectedStep, selectedAccidental } = answer as { selectedStep: number | null; selectedAccidental: number };
      return selectedStep === exercise.targetStep && selectedAccidental === exercise.targetAccidental;
    }
    case "beam-grouping-choice":
      return exercise.correctOptionIndex === (answer as { selectedIndex: number }).selectedIndex;
    case "rhythm-math-choice":
      return exercise.correctCombinationIndex === (answer as { selectedIndex: number }).selectedIndex;
    case "triad-build-staff-choice": {
      const { selectedThirdStep, selectedThirdAccidental, selectedFifthStep, selectedFifthAccidental } = answer as {
        selectedThirdStep: number | null;
        selectedThirdAccidental: number;
        selectedFifthStep: number | null;
        selectedFifthAccidental: number;
      };
      return (
        selectedThirdStep === exercise.thirdStep &&
        selectedThirdAccidental === exercise.thirdAccidental &&
        selectedFifthStep === exercise.fifthStep &&
        selectedFifthAccidental === exercise.fifthAccidental
      );
    }
    case "rhythm-value-dictation": {
      // Built by clicking discrete values, not a live gesture — must
      // match precisely, no tap-timing tolerance (so a short answer or
      // one with a longer/shorter trailing silence still fails).
      const { sequence: answerSequence, groups: answerGroups } = answer as {
        sequence: (RhythmNoteValue | RhythmRestValue)[];
        groups: number[][];
      };
      const target = sequenceOnsetsAndTotalBeats(exercise.sequence);
      const attempt = sequenceOnsetsAndTotalBeats(answerSequence);
      const EPSILON = 1e-9;
      const sequenceCorrect =
        Math.abs(target.totalBeats - attempt.totalBeats) < EPSILON &&
        target.onsetsBeats.length === attempt.onsetsBeats.length &&
        target.onsetsBeats.every((beat, index) => Math.abs(beat - attempt.onsetsBeats[index]) < EPSILON);
      // Grouping is scored against what's correct for the player's OWN
      // written sequence, not the author's — "did you write the right
      // rhythm" and "did you correctly group what you wrote" are
      // deliberately independent checks, both required.
      const canonicalGroups = deriveBeamGroups(answerSequence, exercise.meter);
      const groupsCorrect = JSON.stringify(answerGroups) === JSON.stringify(canonicalGroups);
      return sequenceCorrect && groupsCorrect;
    }
    case "melodic-rhythmic-dictation": {
      // Exact structural match — same note count, and for each note: same
      // step, same accidental, same rhythm value. No enharmonic
      // equivalence or partial credit, same exact-match philosophy as
      // interval-build-staff-choice's own step+accidental comparison.
      const { notes: answerNotes, groups: answerGroups } = answer as {
        notes: { step: number; accidental: number; value: RhythmNoteValue }[];
        groups: number[][];
      };
      const notesCorrect =
        answerNotes.length === exercise.notes.length &&
        answerNotes.every(
          (note, index) =>
            note.step === exercise.notes[index].step &&
            note.accidental === exercise.notes[index].accidental &&
            note.value === exercise.notes[index].value
        );
      const canonicalGroups = deriveBeamGroups(answerNotes.map((note) => note.value), exercise.meter);
      const groupsCorrect = JSON.stringify(answerGroups) === JSON.stringify(canonicalGroups);
      return notesCorrect && groupsCorrect;
    }
    case "solfege-note-singing": {
      const { detectedFrequencyHz } = answer as { detectedFrequencyHz: number | null };
      if (detectedFrequencyHz === null) return false;
      const targetHz = noteToFrequency(parseScientific(exercise.targetNote));
      return Math.abs(octaveFoldedCentsDifference(detectedFrequencyHz, targetHz)) <= exercise.toleranceCents;
    }
    case "solfege-phrase-singing": {
      // Whole-phrase grading is forgiving by count, not all-or-nothing —
      // same 70%-correct bar pulse-tap's own minHits fallback already uses
      // elsewhere in this app, since demanding every single one of 8 sung
      // notes land within tolerance would make an otherwise-solid attempt
      // fail over one missed note.
      const { detectedFrequenciesHz, rhythmCorrect } = answer as {
        detectedFrequenciesHz: (number | null)[];
        rhythmCorrect?: (boolean | null)[];
      };
      if (detectedFrequenciesHz.length !== exercise.notes.length) return false;
      const correctCount = detectedFrequenciesHz.filter((frequencyHz, index) => {
        if (frequencyHz === null) return false;
        const targetHz = noteToFrequency(parseScientific(exercise.notes[index]));
        const pitchOk = Math.abs(octaveFoldedCentsDifference(frequencyHz, targetHz)) <= exercise.toleranceCents;
        if (!pitchOk) return false;
        // gradeRhythm exercises (Zaczarowany Solfeż level 4) additionally
        // require the note to have been HELD for roughly its own
        // RELATIVE rhythmic length compared to the phrase's other notes
        // — see AnswerInput's own rhythmCorrect doc and
        // lib/audio/pitchDetection.ts's analyzeFreeRhythmicPhrase, which
        // is what actually produces this array.
        return exercise.gradeRhythm ? rhythmCorrect?.[index] === true : true;
      }).length;
      return correctCount >= Math.ceil(exercise.notes.length * 0.7);
    }
  }
}
