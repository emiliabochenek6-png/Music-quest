/** The player's LEVEL, from total XP — the app's long-run progression.
 * (Kept under the old "rank" names in code: getRankForXp, RankInfo,
 * PendingRankUp … — on screen it's "Level N", since "poziom" already means
 * a lesson tier in the worlds.)
 *
 * MAX_LEVEL levels, each harder to earn than the last: the XP a level costs
 * grows linearly, so the first levels fall in a few correct answers (level 2
 * is 4 correct answers away) and the last ones take a couple of lessons
 * each. The curve is solved so that reaching MAX_LEVEL takes TOTAL_XP_TO_MAX
 * XP — about what finishing every lesson (10 XP per correct answer, +20 for
 * a flawless lesson), the daily challenges and the spaced-repetition reviews
 * of the ~3-month study plan adds up to, so the top level is attainable but
 * only by really completing the app. To switch to 200 levels, change
 * MAX_LEVEL (and FIRST_LEVEL_COST to ~20); the curve re-solves itself. */
export const MAX_LEVEL = 100;
const TOTAL_XP_TO_MAX = 24_000;
const FIRST_LEVEL_COST = 40;

/** XP the player must have in total to START level `index + 1` (index 0 → 0 XP). */
function buildThresholds(maxLevel: number, totalXp: number, firstCost: number): number[] {
  const steps = maxLevel - 1;
  // cost of the k-th step (level k → k+1) = firstCost + growth * (k - 1); growth chosen so the steps sum to totalXp.
  const growth = steps > 1 ? (2 * (totalXp - steps * firstCost)) / (steps * (steps - 1)) : 0;
  const thresholds = [0];
  for (let step = 1; step <= steps; step++) {
    const cost = Math.max(1, Math.round((firstCost + growth * (step - 1)) / 5) * 5);
    thresholds.push(thresholds[step - 1] + cost);
  }
  return thresholds;
}

const RANK_THRESHOLDS = buildThresholds(MAX_LEVEL, TOTAL_XP_TO_MAX, FIRST_LEVEL_COST);

/** XP needed in total to reach `level` (level 1 = 0). */
export function xpToReachLevel(level: number): number {
  return RANK_THRESHOLDS[Math.min(Math.max(level, 1), MAX_LEVEL) - 1];
}

/** A title for every band of levels — playful at the start (a beginner is a
 * "Nutka", a cute little note), growing toward genuinely grand musical
 * titles at the top, the same escalating shape the worlds' own names have. */
export const TITLES: { fromLevel: number; name: string }[] = [
  { fromLevel: 1, name: "Nutka" },
  { fromLevel: 5, name: "Uczeń Nut" },
  { fromLevel: 10, name: "Śpiewający Odkrywca" },
  { fromLevel: 15, name: "Rytmiczny Wojownik" },
  { fromLevel: 25, name: "Mistrz Interwałów" },
  { fromLevel: 35, name: "Znawca Akordów" },
  { fromLevel: 50, name: "Kapelmistrz" },
  { fromLevel: 65, name: "Wirtuoz" },
  { fromLevel: 80, name: "Kompozytor" },
  { fromLevel: 95, name: "Maestro" },
  { fromLevel: 100, name: "Legenda Muzyki" },
];

/** The title a player earns exactly AT `level`, or null when that level
 * keeps the current one (level 1's "Nutka" counts as already held). */
export function getTitleUnlockedAt(level: number): string | null {
  if (level <= 1) return null;
  return TITLES.find((title) => title.fromLevel === level)?.name ?? null;
}

/** `rank` (the level) is 1-indexed — a level past the top just keeps the highest title. */
export function getRankName(rank: number): string {
  let name = TITLES[0].name;
  for (const title of TITLES) if (rank >= title.fromLevel) name = title.name;
  return name;
}

export interface RankInfo {
  /** The level, 1-indexed — matches the player-facing "Level N". */
  rank: number;
  /** XP earned since this level's own threshold. */
  xpIntoRank: number;
  /** XP still needed to reach the NEXT level — null at MAX_LEVEL. */
  xpForNextRank: number | null;
}

/** Derives a player's level from their total XP — pure and total (every xp
 * >= 0 maps to a level; level 1 starts at 0 XP). */
export function getRankForXp(xp: number): RankInfo {
  let rankIndex = 0;
  for (let i = 0; i < RANK_THRESHOLDS.length; i++) {
    if (xp >= RANK_THRESHOLDS[i]) rankIndex = i;
    else break;
  }
  const currentThreshold = RANK_THRESHOLDS[rankIndex];
  const nextThreshold = RANK_THRESHOLDS[rankIndex + 1];
  return {
    rank: rankIndex + 1,
    xpIntoRank: xp - currentThreshold,
    xpForNextRank: nextThreshold === undefined ? null : nextThreshold - xp,
  };
}

/** Whether going from level `from` to `to` deserves the full-screen level-up
 * celebration: only every 5th level (and so every new title, which always
 * starts on one) — at 100 levels, celebrating each of the quick early ones
 * would be noise. */
export function isLevelUpWorthCelebrating(from: number, to: number): boolean {
  for (let level = from + 1; level <= to; level++) {
    if (level % 5 === 0) return true;
  }
  return false;
}
