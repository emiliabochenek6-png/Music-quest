import { getRankName, getTitleUnlockedAt, MAX_LEVEL, xpToReachLevel } from "@/lib/gamification/rank";

/** Nutki paid out for reaching a level: a small, steady 5 for most, a big
 * 25 for every 5th (the "milestone" levels that also get the full-screen
 * celebration). Level 1 is where everyone starts, so it pays nothing. */
export const NUTKI_PER_LEVEL = 5;
export const NUTKI_PER_MILESTONE_LEVEL = 25;

export function isMilestoneLevel(level: number): boolean {
  return level > 1 && level % 5 === 0;
}

export function nutkiForReachingLevel(level: number): number {
  if (level <= 1) return 0;
  return isMilestoneLevel(level) ? NUTKI_PER_MILESTONE_LEVEL : NUTKI_PER_LEVEL;
}

/** Total nutki for every level reached going from `from` up to `to` (a big XP jump can cross several). */
export function nutkiForLevelRange(from: number, to: number): number {
  let total = 0;
  for (let level = from + 1; level <= to; level++) total += nutkiForReachingLevel(level);
  return total;
}

export interface RoadmapEntry {
  level: number;
  /** Total XP needed to reach this level. */
  xpRequired: number;
  /** XP this level costs on top of the previous one. */
  xpCost: number;
  nutki: number;
  isMilestone: boolean;
  /** Set when reaching this level also unlocks a new title. */
  newTitle: string | null;
  reached: boolean;
}

/** The next `count` levels after `currentLevel` (capped at MAX_LEVEL) with what each pays — the roadmap on the levels screen. */
export function roadmapAfter(currentLevel: number, count: number): RoadmapEntry[] {
  const entries: RoadmapEntry[] = [];
  for (let level = currentLevel + 1; level <= Math.min(MAX_LEVEL, currentLevel + count); level++) {
    entries.push({
      level,
      xpRequired: xpToReachLevel(level),
      xpCost: xpToReachLevel(level) - xpToReachLevel(level - 1),
      nutki: nutkiForReachingLevel(level),
      isMilestone: isMilestoneLevel(level),
      newTitle: getTitleUnlockedAt(level),
      reached: false,
    });
  }
  return entries;
}

/** The nearest milestone level above `currentLevel` (null once past the last one). */
export function nextMilestoneLevel(currentLevel: number): number | null {
  for (let level = currentLevel + 1; level <= MAX_LEVEL; level++) if (isMilestoneLevel(level)) return level;
  return null;
}

export { getRankName };
