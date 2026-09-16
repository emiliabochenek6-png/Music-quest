import { WORLDS } from "@/data/worlds";
import { getWorldContent } from "@/data/lessons";
import type { GamificationState } from "@/types/gamification";

export interface BadgeDefinition {
  id: string;
  icon: string;
  title: string;
  /** Describes the THRESHOLD, not whether it's met — CalendarActivityView/
   * DailyMissionsCard (the two consumers) decide how to style an earned
   * vs. not-yet-earned badge themselves. */
  description: string;
}

/** Badge copy defaults to the masculine grammatical form throughout
 * ("uczeń", not "uczennica") — ProfileContext has no stored gender to
 * branch on, and masculine is the requested fallback when one form has
 * to be picked. */
interface BadgeTier {
  threshold: number;
  title: string;
}

const XP_TIERS: readonly BadgeTier[] = [
  { threshold: 500, title: "Uczeń gwiazd" },
  { threshold: 1500, title: "Kolekcjoner gwiazd" },
  { threshold: 3000, title: "Mistrz gwiazd" },
  { threshold: 5000, title: "Wirtuoz punktów" },
  { threshold: 8000, title: "Legenda XP" },
  { threshold: 12000, title: "Geniusz muzyki" },
  { threshold: 20000, title: "Nieśmiertelny Mistrz" },
];

const STREAK_TIERS: readonly BadgeTier[] = [
  { threshold: 3, title: "Pierwszy krok" },
  { threshold: 7, title: "Tydzień w rytmie" },
  { threshold: 14, title: "Dwa tygodnie mocy" },
  { threshold: 30, title: "Miesiąc w rytmie" },
  { threshold: 60, title: "Dwa miesiące pasji" },
  { threshold: 100, title: "Setka passy" },
  { threshold: 365, title: "Cały rok muzyki" },
];

const LESSON_TIERS: readonly BadgeTier[] = [
  { threshold: 10, title: "Pierwsze kroki" },
  { threshold: 25, title: "Pilny uczeń" },
  { threshold: 50, title: "Zapalony uczeń" },
  { threshold: 100, title: "Znawca teorii" },
  { threshold: 150, title: "Ekspert teorii" },
  { threshold: 200, title: "Mistrz teorii" },
  { threshold: 300, title: "Encyklopedia muzyki" },
];

const PERFECT_WORLD_TIERS: readonly BadgeTier[] = [
  { threshold: 1, title: "Perfekcyjna Kraina" },
  { threshold: 2, title: "Podwójna Perfekcja" },
  { threshold: 3, title: "Król Perfekcji" },
  { threshold: 5, title: "Mistrz Perfekcji" },
  { threshold: 8, title: "Perfekcyjny Wędrowiec" },
  { threshold: 10, title: "Perfekcyjny Podróżnik" },
  { threshold: 12, title: "Perfekcyjny Mistrz Muzyki" },
];

function buildTierBadges(prefix: string, icon: string, describe: (threshold: number) => string, tiers: readonly BadgeTier[]): BadgeDefinition[] {
  return tiers.map((tier) => ({ id: `${prefix}-${tier.threshold}`, icon, title: tier.title, description: describe(tier.threshold) }));
}

/** Deliberately many, ever-escalating tiers per category ("never ending
 * story") rather than one badge each — CalendarActivityView/
 * DailyMissionsCard render this as a horizontally scrollable strip
 * specifically so there's always a next one to chase, not a short list
 * that's fully earned within a few weeks. */
export const BADGES: readonly BadgeDefinition[] = [
  ...buildTierBadges("xp", "⭐", (t) => `Zdobądź ${t} XP`, XP_TIERS),
  ...buildTierBadges("streak", "🔥", (t) => `${t} ${t === 1 ? "dzień" : "dni"} passy z rzędu`, STREAK_TIERS),
  ...buildTierBadges("lessons", "📘", (t) => `Ukończ ${t} lekcji`, LESSON_TIERS),
  ...buildTierBadges(
    "perfect-world",
    "🌟",
    (t) => (t === 1 ? "Ukończ całą krainę na 3 gwiazdki" : `Ukończ ${t} krain na same 3 gwiazdki`),
    PERFECT_WORLD_TIERS
  ),
];

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
  for (const tier of XP_TIERS) if (state.xp >= tier.threshold) earned.add(`xp-${tier.threshold}`);
  for (const tier of STREAK_TIERS) if (state.streakDays >= tier.threshold) earned.add(`streak-${tier.threshold}`);
  for (const tier of LESSON_TIERS) if (completedLessonsCount >= tier.threshold) earned.add(`lessons-${tier.threshold}`);
  for (const tier of PERFECT_WORLD_TIERS) if (perfectWorlds >= tier.threshold) earned.add(`perfect-world-${tier.threshold}`);
  return earned;
}
