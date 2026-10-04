import { getIntervalDisplayName } from "@/lib/music/intervals";
import { getSeventhChordInversionName } from "@/lib/music/seventhChords";
import { getTriadQualityName } from "@/lib/music/triads";

/** Tryb własny: the categories a player can practise. A "pool" category draws exercises written in the lessons (data/lessons/);
 * a "generated" one builds endless exercises on the spot from what the player ticked (which intervals, which triads, …). */

export interface TopicOption {
  id: string;
  label: string;
}

export interface TrainingTopic {
  id: string;
  label: string;
  description: string;
  kind: "pool" | "generated";
  /** Pool categories: exercise types (types/exercises.ts) drawn from the lessons. Ignored for generated ones. */
  types: readonly string[];
  /** What the player ticks inside the category (the intervals to recognise, the kinds of dictation, …). */
  optionsTitle?: string;
  options?: readonly TopicOption[];
  /** How many ticks are needed (an ear question needs at least two answers to choose from). */
  minOptions?: number;
  defaultOptions?: readonly string[];
}

const INTERVAL_OPTIONS: readonly TopicOption[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((semitones) => ({ id: String(semitones), label: getIntervalDisplayName(semitones, "pl") }));

const TRIAD_QUALITIES = ["major", "minor", "diminished", "augmented"] as const;
const TRIAD_OPTIONS: readonly TopicOption[] = TRIAD_QUALITIES.map((quality) => ({ id: quality, label: getTriadQualityName(quality, "pl") }));

const SEVENTH_INVERSIONS = ["root", "first", "second", "third"] as const;
const SEVENTH_OPTIONS: readonly TopicOption[] = SEVENTH_INVERSIONS.map((inversion) => ({ id: inversion, label: getSeventhChordInversionName(inversion, "pl") }));

export const TRAINING_TOPICS: readonly TrainingTopic[] = [
  {
    id: "rozp-interwaly",
    label: "Rozpoznawanie interwałów",
    description: "Słuchasz dwóch dźwięków i wybierasz w okienku, jaki to interwał.",
    kind: "generated",
    types: [],
    optionsTitle: "Które interwały chcesz rozpoznawać?",
    options: INTERVAL_OPTIONS,
    minOptions: 2,
    defaultOptions: ["3", "4", "5", "7"],
  },
  {
    id: "rozp-troj",
    label: "Rozpoznawanie trójdźwięków",
    description: "Słuchasz trójdźwięku i rozpoznajesz jego rodzaj.",
    kind: "generated",
    types: [],
    optionsTitle: "Które trójdźwięki chcesz rozpoznawać?",
    options: TRIAD_OPTIONS,
    minOptions: 2,
    defaultOptions: ["major", "minor"],
  },
  {
    id: "rozp-dom",
    label: "Rozpoznawanie dominant",
    description: "Słuchasz dominanty septymowej i rozpoznajesz jej postać (D7 i przewroty).",
    kind: "generated",
    types: [],
    optionsTitle: "Które postacie dominanty chcesz rozpoznawać?",
    options: SEVENTH_OPTIONS,
    minOptions: 2,
    defaultOptions: ["root", "first"],
  },
  {
    id: "bud-interwaly",
    label: "Budowanie interwałów",
    description: "Budujesz interwał nad zadanym dźwiękiem (nazwy nut i zapis na pięciolinii).",
    kind: "generated",
    types: [],
    optionsTitle: "Które interwały chcesz budować?",
    options: INTERVAL_OPTIONS,
    minOptions: 1,
    defaultOptions: ["3", "4", "5", "7"],
  },
  {
    id: "bud-troj",
    label: "Budowanie trójdźwięków",
    description: "Budujesz trójdźwięki (także w przewrotach) nuta po nucie na pięciolinii.",
    kind: "generated",
    types: [],
    optionsTitle: "Które trójdźwięki chcesz budować?",
    options: TRIAD_OPTIONS,
    minOptions: 1,
    defaultOptions: ["major", "minor"],
  },
  {
    id: "bud-dom",
    label: "Budowanie dominant",
    description: "Budujesz dominantę septymową i jej przewroty.",
    kind: "generated",
    types: [],
    optionsTitle: "Które postacie dominanty chcesz budować?",
    options: SEVENTH_OPTIONS,
    minOptions: 1,
    defaultOptions: ["root"],
  },
  {
    id: "dyktanda",
    label: "Dyktanda",
    description: "Zapisujesz usłyszany rytm albo melodię.",
    kind: "pool",
    types: ["rhythm-value-dictation", "rhythm-dictation", "melodic-rhythmic-dictation"],
    optionsTitle: "Jakie dyktanda?",
    options: [
      { id: "rytmiczne", label: "Rytmiczne" },
      { id: "melodyczno-rytmiczne", label: "Melodyczno-rytmiczne" },
    ],
    minOptions: 1,
    defaultOptions: ["rytmiczne"],
  },
  {
    id: "solfez",
    label: "Solfeż i piosenki",
    description: "Rozpoznawanie sylab oraz śpiewanie z nut, także fragmentów znanych piosenek (z mikrofonem).",
    kind: "pool",
    types: ["solfege-syllable-choice", "solfege-note-singing", "solfege-phrase-singing"],
  },
  {
    id: "rytm",
    label: "Rytm i metrum",
    description: "Wartości rytmiczne, takty, grupowanie nut i liczenie rytmu.",
    kind: "pool",
    types: ["meter-choice", "beam-grouping-choice", "rhythm-math-choice", "rhythm-sequencing", "rhythm-notation-tap", "pulse-tap", "rhythm-echo"],
  },
  {
    id: "tonacje",
    label: "Tonacje i teoria",
    description: "Koło kwintowe, tonacje, znaki przykluczowe i pytania z teorii.",
    kind: "pool",
    types: ["key-fact-choice", "triad-fact-choice", "circle-step-choice", "relative-key-choice", "key-signature-names-choice", "circle-neighbor-key-choice", "key-signature-staff-choice", "accidental-count-key-choice"],
  },
  {
    id: "nuty",
    label: "Nuty i pięciolinia",
    description: "Wysokość dźwięku, kierunek melodii, nazwy nut i ich miejsce na pięciolinii.",
    kind: "pool",
    types: ["pitch-height-choice", "melody-direction-choice", "interval-distance-choice", "line-or-space-choice", "staff-placement", "multiple-choice-notation", "note-sequencing", "note-word-spelling"],
  },
];

/** Exercise types of the lessons that are NOT used by any pool category on purpose: they are either replaced by the generated categories above
 * (recognising and building intervals, triads and dominants), or need drawing / their own timed scoring. */
export const EXCLUDED_TRAINING_TYPES: readonly string[] = [
  "clef-trace",
  "interval-timed-test",
  "interval-name-choice",
  "interval-sequence-choice",
  "interval-build-choice",
  "interval-build-staff-choice",
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
];

const TOPIC_BY_TYPE = new Map<string, string>();
for (const topic of TRAINING_TOPICS) for (const type of topic.types) TOPIC_BY_TYPE.set(type, topic.id);

export function topicOfType(type: string): string | undefined {
  return TOPIC_BY_TYPE.get(type);
}

export function getTopic(id: string): TrainingTopic | undefined {
  return TRAINING_TOPICS.find((topic) => topic.id === id);
}

/** What the player picked: the categories, and inside each the ticked options (missing = the category's defaults). */
export interface TrainingSelection {
  topicIds: string[];
  options: Record<string, string[]>;
}

export function optionsOf(selection: TrainingSelection, topicId: string): string[] {
  const topic = getTopic(topicId);
  return selection.options[topicId] ?? [...(topic?.defaultOptions ?? topic?.options?.map((option) => option.id) ?? [])];
}

/** True when every picked category has enough options ticked to make a question. */
export function selectionIsValid(selection: TrainingSelection): boolean {
  if (selection.topicIds.length === 0) return false;
  return selection.topicIds.every((id) => {
    const topic = getTopic(id);
    return !topic?.options || optionsOf(selection, id).length >= (topic.minOptions ?? 1);
  });
}

/** For the address of the training screen: "rozp-interwaly:3.4.7;dyktanda:rytmiczne". */
export function encodeOptions(selection: TrainingSelection): string {
  return selection.topicIds
    .filter((id) => getTopic(id)?.options)
    .map((id) => `${id}:${optionsOf(selection, id).join(".")}`)
    .join(";");
}

export function decodeSelection(topics: string, options: string): TrainingSelection {
  const topicIds = topics.split(",").filter((id) => getTopic(id));
  const parsed: Record<string, string[]> = {};
  for (const part of options.split(";")) {
    const [id, list] = part.split(":");
    if (id && list !== undefined) parsed[id] = list.split(".").filter(Boolean);
  }
  return { topicIds, options: parsed };
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
