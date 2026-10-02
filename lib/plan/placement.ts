import type { ExerciseDefinition, ExerciseType, WorldContent } from "@/types/exercises";

/** The placement test's own adaptive engine — pure functions over plain
 * data, so the whole flow (which world is asked next, how hard, how an
 * answer moves the player's per-world level) is unit-testable without any
 * screen. Each world gets at most TWO questions: a "mid" one first; right →
 * a "hard" one (both right = level 2, "opanowane"; hard wrong = level 1,
 * "częściowo"); wrong → an "easy" one (right = level 1, wrong = level 0,
 * "do nauki"). So the test is as short as the player's own knowledge lets
 * it be, ~2 questions × 12 worlds. */
export type PlacementLevel = 0 | 1 | 2;
export type PlacementTier = "easy" | "mid" | "hard";

/** Exercise types a placement question may use: plain choose-the-answer
 * types (including the interactive staff-building ones). Left out on
 * purpose: anything timed or tap-timed (pulse-tap, rhythm-echo, …), typed
 * (note-word-spelling), drawn (clef-trace), sung (the solfège singing
 * types) and the two dictation types — a test should measure what the
 * player KNOWS, not whether their phone's microphone or touch latency
 * cooperated. */
export const PLACEMENT_TYPES: ReadonlySet<ExerciseType> = new Set<ExerciseType>([
  "pitch-height-choice",
  "melody-direction-choice",
  "multiple-choice-notation",
  "line-or-space-choice",
  "interval-distance-choice",
  "meter-choice",
  "rhythm-sequencing",
  "key-fact-choice",
  "interval-name-choice",
  "interval-sequence-choice",
  "triad-fact-choice",
  "triad-quality-choice",
  "triad-notes-choice",
  "triad-role-choice",
  "triad-quality-sequence-choice",
  "triad-inversion-choice",
  "triad-inversion-sequence-choice",
  "dominant-seventh-inversion-choice",
  "dominant-seventh-inversion-sequence-choice",
  "circle-step-choice",
  "relative-key-choice",
  "key-signature-names-choice",
  "circle-neighbor-key-choice",
  "key-signature-staff-choice",
  "accidental-count-key-choice",
  "interval-build-choice",
  "interval-build-staff-choice",
  "triad-build-staff-choice",
  "triad-inversion-build-staff-choice",
  "dominant-seventh-build-staff-choice",
  "beam-grouping-choice",
  "rhythm-math-choice",
  "solfege-syllable-choice",
]);

/** Where in a world's lesson list each tier draws its question from
 * (fraction of the way through) — early lessons are the basics, late ones
 * the hardest. */
const TIER_POSITION: Record<PlacementTier, number> = { easy: 0.15, mid: 0.5, hard: 0.85 };

/** One placement question for `tier` from `content`, or null when this
 * world has no eligible exercise at all. Starts at the tier's lesson and
 * searches outward lesson by lesson until one has an eligible exercise;
 * never returns an id in `excludeIds` (so a small world's "hard" question
 * is never the "mid" one again). */
export function pickPlacementExercise(
  content: WorldContent,
  tier: PlacementTier,
  excludeIds: ReadonlySet<string> = new Set(),
  random: () => number = Math.random
): ExerciseDefinition | null {
  const lessons = content.lessons;
  if (lessons.length === 0) return null;
  const centre = Math.min(lessons.length - 1, Math.floor(TIER_POSITION[tier] * lessons.length));
  for (let offset = 0; offset < lessons.length; offset++) {
    for (const index of offset === 0 ? [centre] : [centre + offset, centre - offset]) {
      if (index < 0 || index >= lessons.length) continue;
      const candidates = lessons[index].exercises.filter((exercise) => PLACEMENT_TYPES.has(exercise.type) && !excludeIds.has(exercise.id));
      if (candidates.length > 0) return candidates[Math.floor(random() * candidates.length)];
    }
  }
  return null;
}

export interface PlacementState {
  /** Worlds that can actually be tested (have an eligible question), in curriculum order. */
  worldIds: string[];
  index: number;
  tier: PlacementTier;
  levels: Record<string, PlacementLevel>;
  /** How many questions have been answered so far. */
  answered: number;
  done: boolean;
}

export function startPlacement(worldIds: readonly string[]): PlacementState {
  return { worldIds: [...worldIds], index: 0, tier: "mid", levels: {}, answered: 0, done: worldIds.length === 0 };
}

export function currentPlacementWorld(state: PlacementState): string | null {
  return state.done ? null : state.worldIds[state.index] ?? null;
}

function advanceWorld(state: PlacementState, level: PlacementLevel): PlacementState {
  const worldId = state.worldIds[state.index];
  const nextIndex = state.index + 1;
  return {
    ...state,
    levels: { ...state.levels, [worldId]: level },
    index: nextIndex,
    tier: "mid",
    answered: state.answered + 1,
    done: nextIndex >= state.worldIds.length,
  };
}

/** Moves the engine on after one answer. */
export function applyPlacementAnswer(state: PlacementState, correct: boolean): PlacementState {
  if (state.done) return state;
  if (state.tier === "mid") {
    return { ...state, tier: correct ? "hard" : "easy", answered: state.answered + 1 };
  }
  if (state.tier === "hard") return advanceWorld(state, correct ? 2 : 1);
  return advanceWorld(state, correct ? 1 : 0);
}

/** Worlds with no eligible question inherit a level from the worlds they
 * build on — never above "częściowo", since nothing about them was
 * actually tested. Szczyt Dyktand (written dictation) needs reading notes,
 * rhythm and beaming, so it takes the lowest of those. */
const INFERRED_FROM: Record<string, readonly string[]> = {
  "szczyt-dyktand": ["wioska-nut", "przystan-taktow", "gaj-grupowania"],
};

/** Full per-world level map: the tested worlds' own levels plus an
 * inferred level for the worlds listed in INFERRED_FROM. */
export function completeLevels(levels: Record<string, PlacementLevel>, allWorldIds: readonly string[]): Record<string, PlacementLevel> {
  const result: Record<string, PlacementLevel> = { ...levels };
  for (const worldId of allWorldIds) {
    if (result[worldId] !== undefined) continue;
    const sources = (INFERRED_FROM[worldId] ?? []).map((id) => result[id]).filter((level): level is PlacementLevel => level !== undefined);
    // Nothing to infer from (or no inference rule) → "do nauki": the safe default.
    result[worldId] = sources.length > 0 ? (Math.min(1, ...sources) as PlacementLevel) : 0;
  }
  return result;
}

/** Which worlds in `allWorlds` have a question to ask — the test only
 * visits those. */
export function testableWorldIds(allWorlds: readonly { id: string }[], getContent: (worldId: string) => WorldContent | undefined): string[] {
  return allWorlds
    .filter((world) => {
      const content = getContent(world.id);
      return content !== undefined && pickPlacementExercise(content, "mid") !== null;
    })
    .map((world) => world.id);
}
