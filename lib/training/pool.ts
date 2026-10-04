import { getWorldContent } from "@/data/lessons";
import { WORLDS } from "@/data/worlds";
import type { ExerciseDefinition } from "@/types/exercises";
import { EXTRA_SOLFEGE_SONGS } from "@/data/training/solfegeSongs";
import { generatedTemplates } from "./generated";
import { getTopic, matchesDifficulty, optionsOf, topicOfType } from "./topics";
import type { TrainingDifficulty, TrainingSelection } from "./topics";

/** Same switch as lib/progression/resolveNodeState.ts's ENFORCE_SUBSCRIPTION_GATE (that file must not be edited here):
 * while the game does not lock premium worlds, Tryb własny does not lock their exercises either. Keep the two in step. */
export const TRAINING_REQUIRES_SUBSCRIPTION = false;

export interface PoolItem {
  worldId: string;
  topicId: string;
  definition: ExerciseDefinition;
}

let allItems: PoolItem[] | null = null;

/** Every authored exercise that belongs to a pool category (lessons, plus the extra songs for the solfege category), in lesson order. Built once. */
export function allTrainingItems(): PoolItem[] {
  if (allItems) return allItems;
  const items: PoolItem[] = [];
  for (const world of WORLDS) {
    const content = getWorldContent(world.id);
    if (!content) continue;
    for (const lesson of content.lessons) {
      for (const definition of lesson.exercises) {
        const topicId = topicOfType(definition.spec.type);
        if (!topicId) continue;
        // "Sprawdź siebie" phrases have no grading (just a metronome); training needs answers that can be right or wrong.
        if (definition.spec.type === "solfege-phrase-singing" && definition.spec.metronomeOnly) continue;
        items.push({ worldId: world.id, topicId, definition });
      }
    }
  }
  for (const definition of EXTRA_SOLFEGE_SONGS) items.push({ worldId: "piosenki", topicId: "solfez", definition });
  allItems = items;
  return items;
}

function premiumWorldIds(): Set<string> {
  return new Set(WORLDS.filter((world) => world.isPremium).map((world) => world.id));
}

/** Which exercise types a pool category may use, given what the player ticked inside it (dictations: rhythmic and/or melodic-rhythmic). */
function allowedTypes(topicId: string, selection: TrainingSelection): readonly string[] {
  const topic = getTopic(topicId);
  if (!topic) return [];
  if (topicId !== "dyktanda") return topic.types;
  const ticked = optionsOf(selection, topicId);
  return [...(ticked.includes("rytmiczne") ? ["rhythm-value-dictation", "rhythm-dictation"] : []), ...(ticked.includes("melodyczno-rytmiczne") ? ["melodic-rhythmic-dictation"] : [])];
}

/** The exercises for the chosen categories (with what is ticked inside them) and difficulty.
 * Generated categories give a few endless templates (see generated.ts); pool categories filter the lessons' exercises by difficulty
 * (if that leaves a category nothing, every difficulty is allowed for it). `hasSubscription` only matters when TRAINING_REQUIRES_SUBSCRIPTION is on. */
export function buildPool(selection: TrainingSelection, difficulty: TrainingDifficulty, hasSubscription: boolean): PoolItem[] {
  const premium = premiumWorldIds();
  const pool: PoolItem[] = [];
  for (const topicId of selection.topicIds) {
    const topic = getTopic(topicId);
    if (!topic) continue;
    if (topic.kind === "generated") {
      for (const definition of generatedTemplates(topicId, optionsOf(selection, topicId))) pool.push({ worldId: "trening", topicId, definition });
      continue;
    }
    const types = allowedTypes(topicId, selection);
    const inTopic = allTrainingItems().filter(
      (item) => item.topicId === topicId && types.includes(item.definition.spec.type) && (!TRAINING_REQUIRES_SUBSCRIPTION || hasSubscription || !premium.has(item.worldId))
    );
    const matching = inTopic.filter((item) => matchesDifficulty(item.definition.difficulty, difficulty));
    pool.push(...(matching.length > 0 ? matching : inTopic));
  }
  return pool;
}

/** True when the category has something to practise with its default options (false: locked behind the subscription). */
export function topicAvailable(topicId: string, hasSubscription: boolean): boolean {
  return buildPool({ topicIds: [topicId], options: {} }, "mieszane", hasSubscription).length > 0;
}

/** A random exercise that is not one of the last asked ones (templates of generated categories may repeat: every draw is a new question). */
export function pickNext(pool: readonly PoolItem[], recentIds: readonly string[], random: () => number = Math.random): PoolItem | null {
  if (pool.length === 0) return null;
  const fresh = pool.filter((item) => !recentIds.includes(item.definition.id));
  const source = fresh.length > 0 ? fresh : pool;
  return source[Math.floor(random() * source.length)];
}
