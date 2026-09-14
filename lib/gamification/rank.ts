/** XP threshold each rank STARTS at — rank 1 is everyone's starting
 * point (0 XP), rank 2 needs 100 total XP, etc. Gaps widen (100, 150,
 * 200, 250...) so each rank takes a bit longer than the last, the usual
 * "level up" curve — deliberately a plain array rather than a formula
 * so the curve can be hand-tuned later without touching getRankForXp's
 * own logic. */
const RANK_THRESHOLDS = [0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700, 3250];

/** One title per rank (same length/order as RANK_THRESHOLDS) — shown
 * alongside the bare "Ranga N" number wherever a rank-up actually means
 * something to celebrate (see components/RankUpCelebration.tsx's own
 * doc), not on the map's own compact header pill (no room there for
 * more than the number). Playful and small at the start (a beginner is
 * a "Nutka" — a cute little note), growing toward genuinely grand
 * musical titles by the end — the same escalating-stakes shape this
 * app's own world names already have, just for the PLAYER's own
 * journey rather than a specific curriculum topic. */
const RANK_NAMES = [
  "Nutka",
  "Uczeń Nut",
  "Śpiewający Odkrywca",
  "Rytmiczny Wojownik",
  "Mistrz Interwałów",
  "Znawca Akordów",
  "Kapelmistrz",
  "Wirtuoz",
  "Kompozytor",
  "Maestro",
  "Legenda Muzyki",
];

/** `rank` is 1-indexed (see RankInfo's own doc) — falls back to the
 * highest-defined name rather than throwing if `rank` somehow exceeds
 * RANK_NAMES' own length (it never should, since getRankForXp can never
 * report a rank beyond RANK_THRESHOLDS' own length, but a fallback here
 * is cheap insurance against the two arrays ever drifting out of sync). */
export function getRankName(rank: number): string {
  const index = Math.min(Math.max(rank, 1), RANK_NAMES.length) - 1;
  return RANK_NAMES[index];
}

export interface RankInfo {
  /** 1-indexed — matches how a player-facing "Ranga N" label reads. */
  rank: number;
  /** XP earned since this rank's own threshold. */
  xpIntoRank: number;
  /** XP still needed to reach the NEXT rank — null once every threshold
   * in RANK_THRESHOLDS is passed (the top rank has no further ceiling
   * defined yet). */
  xpForNextRank: number | null;
}

/** Derives a player's rank from their total XP — pure and total (every
 * xp >= 0 maps to a rank; RANK_THRESHOLDS[0] is always 0, so rank is
 * always >= 1). Deliberately called "ranga," not "poziom" — this app's
 * worlds already use "poziom" for their own lesson tiers (e.g.
 * Zaczarowany Solfeż's "poziom 4"), and reusing the word for a SECOND,
 * unrelated kind of progression would be confusing on the same map
 * screen. */
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
