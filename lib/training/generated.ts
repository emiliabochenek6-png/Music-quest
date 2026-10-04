import type { SeventhChordInversion } from "@/lib/music/seventhChords";
import type { TriadQuality } from "@/lib/music/triads";
import type { ExerciseDefinition } from "@/types/exercises";

/** The "generated" categories of Tryb własny: a few template exercises built from what the player ticked.
 * generateExercise (lib/questions/generate.ts) draws a fresh random question from a template every time (a new root note, a new chord, …),
 * so a template never runs out. The ear questions use the interval/chord "okienko" (scroll window) and hide the notation: listening only. */

function template(topicId: string, index: number, spec: ExerciseDefinition["spec"]): ExerciseDefinition {
  return { id: `gen:${topicId}:${index}`, type: spec.type, difficulty: 3, spec } as ExerciseDefinition;
}

const TRIAD_QUALITIES: readonly string[] = ["major", "minor", "diminished", "augmented"];
const SEVENTH_INVERSIONS: readonly string[] = ["root", "first", "second", "third"];

export function generatedTemplates(topicId: string, optionIds: readonly string[]): ExerciseDefinition[] {
  const semitones = optionIds.map(Number).filter((n) => Number.isInteger(n) && n >= 1 && n <= 12).sort((a, b) => a - b);
  const qualities = optionIds.filter((id) => TRIAD_QUALITIES.includes(id)) as TriadQuality[];
  const inversions = optionIds.filter((id) => SEVENTH_INVERSIONS.includes(id)) as SeventhChordInversion[];

  switch (topicId) {
    case "rozp-interwaly":
      return semitones.length >= 2 ? [template(topicId, 0, { type: "interval-name-choice", allowedSemitones: semitones, noteRange: ["C4", "C6"], hideNotation: true })] : [];
    case "rozp-troj":
      return qualities.length >= 2 ? [template(topicId, 0, { type: "triad-quality-choice", noteRange: ["C4", "C5"], allowedQualities: qualities, hideNotation: true })] : [];
    case "rozp-dom":
      return inversions.length >= 2 ? [template(topicId, 0, { type: "dominant-seventh-inversion-choice", noteRange: ["C4", "E4"], allowedInversions: inversions, hideNotation: true })] : [];
    case "bud-interwaly":
      return semitones.length >= 1
        ? [
            template(topicId, 0, { type: "interval-build-choice", noteRange: ["C4", "C5"], allowedSemitones: semitones }),
            template(topicId, 1, { type: "interval-build-staff-choice", noteRange: ["C4", "C5"], allowedSemitones: semitones }),
          ]
        : [];
    case "bud-troj":
      return qualities.length >= 1
        ? [
            template(topicId, 0, { type: "triad-build-staff-choice", noteRange: ["C4", "C5"], allowedQualities: qualities }),
            template(topicId, 1, { type: "triad-inversion-build-staff-choice", noteRange: ["C4", "C5"], allowedQualities: qualities, allowedInversions: ["root", "first", "second"] }),
          ]
        : [];
    case "bud-dom":
      return inversions.length >= 1 ? [template(topicId, 0, { type: "dominant-seventh-build-staff-choice", noteRange: ["C4", "C5"], allowedInversions: inversions })] : [];
    default:
      return [];
  }
}
