import { WORLDS } from "@/data/worlds";
import { getWorldContent } from "@/data/lessons";
import type { GamificationState } from "@/types/gamification";

export interface BadgeDefinition {
  id: string;
  icon: string;
  title: string;
  /** Describes the THRESHOLD, not whether it's met — CalendarActivityView
   * (the one consumer) decides how to style an earned vs. not-yet-earned
   * badge itself. */
  description: string;
}

export const BADGES: readonly BadgeDefinition[] = [
  { id: "xp-500", icon: "⭐", title: "Uczennica gwiazd", description: "Zdobądź 500 XP" },
  { id: "xp-2000", icon: "🌠", title: "Mistrzyni gwiazd", description: "Zdobądź 2000 XP" },
  { id: "streak-7", icon: "🔥", title: "Tydzień w rytmie", description: "7 dni passy z rzędu" },
  { id: "streak-20", icon: "🔥", title: "Miesiąc w rytmie", description: "20 dni passy z rzędu" },
  { id: "lessons-25", icon: "📘", title: "Pilna uczennica", description: "Ukończ 25 lekcji" },
  { id: "lessons-100", icon: "📚", title: "Znawczyni teorii", description: "Ukończ 100 lekcji" },
  { id: "perfect-world-1", icon: "🌟", title: "Perfekcyjna Kraina", description: "Ukończ całą krainę na 3 gwiazdki" },
  { id: "perfect-world-3", icon: "👑", title: "Królowa Perfekcji", description: "Ukończ 3 krainy na same 3 gwiazdki" },
] as const;

/** How many worlds currently have EVERY one of their lessons at 3 stars —
 * derived straight from lessonStars + the static world/lesson content,
 * not a separately persisted counter, so it can never drift out of sync
 * with the stars actually recorded. */
export function countPerfectWorlds(lessonStars: GamificationState["lessonStars"]): number {
  let count = 0;
  for (const world of WORLDS) {
    const content = getWorldContent(world.id);
    if (!content || content.lessons.length === 0) continue;
    const allPerfect = content.lessons.every((lesson) => lessonStars[lesson.id] === 3);
    if (allPerfect) count++;
  }
  return count;
}

/** Which badge ids are currently earned — a badge stays earned forever
 * once its threshold is crossed (xp/completedLessons only grow;
 * perfectWorlds can't un-happen either), so this is a pure snapshot of
 * "is the threshold met right now," not something that needs its own
 * persisted "earnedAt" record. */
export function getEarnedBadgeIds(state: GamificationState, completedLessonsCount: number): Set<string> {
  const perfectWorlds = countPerfectWorlds(state.lessonStars);
  const earned = new Set<string>();
  if (state.xp >= 500) earned.add("xp-500");
  if (state.xp >= 2000) earned.add("xp-2000");
  if (state.streakDays >= 7) earned.add("streak-7");
  if (state.streakDays >= 20) earned.add("streak-20");
  if (completedLessonsCount >= 25) earned.add("lessons-25");
  if (completedLessonsCount >= 100) earned.add("lessons-100");
  if (perfectWorlds >= 1) earned.add("perfect-world-1");
  if (perfectWorlds >= 3) earned.add("perfect-world-3");
  return earned;
}
