import { getWorldContent } from "@/data/lessons";
import { WORLDS } from "@/data/worlds";
import type { ExerciseDefinition } from "@/types/exercises";
import { matchesDifficulty, topicOfType } from "./topics";
import type { TrainingDifficulty } from "./topics";

/** Same switch as lib/progression/resolveNodeState.ts's ENFORCE_SUBSCRIPTION_GATE (that file must not be edited here):
 * while the game does not lock premium worlds, Tryb własny does not lock their exercises either. Keep the two in step. */
export const TRAINING_REQUIRES_SUBSCRIPTION = false;

export interface PoolItem {
  worldId: string;
  topicId: string;
  definition: ExerciseDefinition;
}

let allItems: PoolItem[] | null = null;

/** Every exercise of every lesson that belongs to a topic, in lesson order. Built once. */
export function allTrainingItems(): PoolItem[] {
  if (allItems) return allItems;
  const items: PoolItem[] = [];
  for (const world of WORLDS) {
    const content = getWorldContent(world.id);
    if (!content) continue;
    for (const lesson of content.lessons) {
      for (const definition of lesson.exercises) {
        const topicId = topicOfType(definition.spec.type);
        if (topicId) items.push({ worldId: world.id, topicId, definition });
      }
    }
  }
  allItems = items;
  return items;
}

function premiumWorldIds(): Set<string> {
  return new Set(WORLDS.filter((world) => world.isPremium).map((world) => world.id));
}

/** The exercises for the chosen topics and difficulty. `hasSubscription` only matters when TRAINING_REQUIRES_SUBSCRIPTION is on.
 * If the chosen difficulty leaves nothing for the topics, every difficulty is allowed instead (the pool is never empty for a real topic). */
export function buildPool(topicIds: readonly string[], difficulty: TrainingDifficulty, hasSubscription: boolean): PoolItem[] {
  const premium = premiumWorldIds();
  const allowed = (item: PoolItem) => topicIds.includes(item.topicId) && (!TRAINING_REQUIRES_SUBSCRIPTION || hasSubscription || !premium.has(item.worldId));
  const inTopics = allTrainingItems().filter(allowed);
  const matching = inTopics.filter((item) => matchesDifficulty(item.definition.difficulty, difficulty));
  return matching.length > 0 ? matching : inTopics;
}

/** True when the topic has at least one exercise the player may use (false: locked behind the subscription). */
export function topicAvailable(topicId: string, hasSubscription: boolean): boolean {
  return buildPool([topicId], "mieszane", hasSubscription).length > 0;
}

/** A random exercise that is not one of the last `avoid` asked (or any, if the pool is too small to avoid them). */
export function pickNext(pool: readonly PoolItem[], recentIds: readonly string[], random: () => number = Math.random): PoolItem | null {
  if (pool.length === 0) return null;
  const fresh = pool.filter((item) => !recentIds.includes(item.definition.id));
  const source = fresh.length > 0 ? fresh : pool;
  return source[Math.floor(random() * source.length)];
}
