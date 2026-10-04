/** Tryb własny: the topics a player can practise, and which exercise types belong to each.
 * Exercises come from the existing lessons (data/lessons/), so no new content is needed. */

export interface TrainingTopic {
  id: string;
  label: string;
  description: string;
  /** Exercise types (types/exercises.ts) that belong to this topic. */
  types: readonly string[];
}

export const TRAINING_TOPICS: readonly TrainingTopic[] = [
  {
    id: "nuty",
    label: "Nuty i pięciolinia",
    description: "Wysokość dźwięku, kierunek melodii, nazwy nut i ich miejsce na pięciolinii.",
    types: ["pitch-height-choice", "melody-direction-choice", "interval-distance-choice", "line-or-space-choice", "staff-placement", "multiple-choice-notation", "note-sequencing", "note-word-spelling"],
  },
  {
    id: "rytm",
    label: "Rytm i metrum",
    description: "Wartości rytmiczne, takty, grupowanie nut i liczenie rytmu.",
    types: ["meter-choice", "beam-grouping-choice", "rhythm-math-choice", "rhythm-sequencing", "rhythm-value-dictation", "rhythm-notation-tap", "rhythm-dictation", "pulse-tap", "rhythm-echo"],
  },
  {
    id: "interwaly",
    label: "Interwały",
    description: "Rozpoznawanie, układanie i budowanie interwałów.",
    types: ["interval-name-choice", "interval-sequence-choice", "interval-build-choice", "interval-build-staff-choice"],
  },
  {
    id: "akordy",
    label: "Trójdźwięki i akordy",
    description: "Rodzaje trójdźwięków, przewroty i akordy septymowe.",
    types: [
      "triad-fact-choice",
      "triad-quality-choice",
      "triad-notes-choice",
      "triad-role-choice",
      "triad-quality-sequence-choice",
      "triad-inversion-choice",
      "triad-inversion-sequence-choice",
      "triad-build-staff-choice",
      "triad-inversion-build-staff-choice",
      "dominant-seventh-inversion-choice",
      "dominant-seventh-inversion-sequence-choice",
      "dominant-seventh-build-staff-choice",
    ],
  },
  {
    id: "tonacje",
    label: "Tonacje i teoria",
    description: "Koło kwintowe, tonacje, znaki przykluczowe i pytania z teorii.",
    types: ["key-fact-choice", "circle-step-choice", "relative-key-choice", "key-signature-names-choice", "circle-neighbor-key-choice", "key-signature-staff-choice", "accidental-count-key-choice"],
  },
  {
    id: "dyktanda",
    label: "Dyktanda",
    description: "Zapisywanie usłyszanego rytmu i melodii.",
    types: ["melodic-rhythmic-dictation"],
  },
  {
    id: "solfez",
    label: "Solfeż",
    description: "Sylaby solfeżowe: do, re, mi i dalej.",
    types: ["solfege-syllable-choice"],
  },
];

/** Exercise types left out of training on purpose: they need the microphone, drawing, or have their own timed scoring. */
export const EXCLUDED_TRAINING_TYPES: readonly string[] = ["solfege-note-singing", "solfege-phrase-singing", "interval-timed-test", "clef-trace"];

const TOPIC_BY_TYPE = new Map<string, string>();
for (const topic of TRAINING_TOPICS) for (const type of topic.types) TOPIC_BY_TYPE.set(type, topic.id);

export function topicOfType(type: string): string | undefined {
  return TOPIC_BY_TYPE.get(type);
}

export function getTopic(id: string): TrainingTopic | undefined {
  return TRAINING_TOPICS.find((topic) => topic.id === id);
}

export type TrainingDifficulty = "latwo" | "srednio" | "trudno" | "mieszane";

export const DIFFICULTY_OPTIONS: readonly { id: TrainingDifficulty; label: string }[] = [
  { id: "latwo", label: "Łatwo" },
  { id: "srednio", label: "Średnio" },
  { id: "trudno", label: "Trudno" },
  { id: "mieszane", label: "Mieszane" },
];

/** Exercises carry a `difficulty` from 1 up to 11: 1-2 easy, 3 medium, 4 and more hard. */
export function matchesDifficulty(difficulty: number, wanted: TrainingDifficulty): boolean {
  if (wanted === "mieszane") return true;
  if (wanted === "latwo") return difficulty <= 2;
  if (wanted === "srednio") return difficulty === 3;
  return difficulty >= 4;
}
