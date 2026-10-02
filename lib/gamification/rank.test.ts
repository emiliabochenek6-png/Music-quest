import { describe, expect, it } from "@jest/globals";
import { getRankForXp, getRankName, isLevelUpWorthCelebrating, MAX_LEVEL, xpToReachLevel } from "@/lib/gamification/rank";

describe("levels", () => {
  it("starts everyone at level 1 with 0 XP, and level 2 is only a few correct answers away", () => {
    const info = getRankForXp(0);
    expect(info.rank).toBe(1);
    expect(info.xpIntoRank).toBe(0);
    expect(info.xpForNextRank).toBeLessThanOrEqual(50);
  });

  it("advances exactly at a level's threshold", () => {
    const threshold = xpToReachLevel(10);
    expect(getRankForXp(threshold - 1).rank).toBe(9);
    expect(getRankForXp(threshold).rank).toBe(10);
  });

  it("has MAX_LEVEL levels, and the top one is the last", () => {
    expect(MAX_LEVEL).toBeGreaterThanOrEqual(100);
    const top = getRankForXp(xpToReachLevel(MAX_LEVEL));
    expect(top.rank).toBe(MAX_LEVEL);
    expect(top.xpForNextRank).toBeNull();
    expect(getRankForXp(10_000_000).rank).toBe(MAX_LEVEL);
  });

  it("makes every level cost at least as much as the one before (easy at first, harder later)", () => {
    let previousCost = 0;
    for (let level = 1; level < MAX_LEVEL; level++) {
      const cost = xpToReachLevel(level + 1) - xpToReachLevel(level);
      expect(cost).toBeGreaterThanOrEqual(previousCost);
      previousCost = cost;
    }
    // The last level costs many times the first.
    expect(xpToReachLevel(MAX_LEVEL) - xpToReachLevel(MAX_LEVEL - 1)).toBeGreaterThan(5 * (xpToReachLevel(2) - xpToReachLevel(1)));
  });

  it("reaching the top takes about what the study plan can deliver (20-30k XP)", () => {
    expect(xpToReachLevel(MAX_LEVEL)).toBeGreaterThan(20_000);
    expect(xpToReachLevel(MAX_LEVEL)).toBeLessThan(30_000);
  });

  it("reports xpIntoRank relative to the current level's threshold", () => {
    const base = xpToReachLevel(7);
    expect(getRankForXp(base + 12)).toMatchObject({ rank: 7, xpIntoRank: 12 });
  });

  it("never reports a level below 1, even for negative XP (defensive)", () => {
    expect(getRankForXp(-50).rank).toBe(1);
  });
});

describe("level titles", () => {
  it("changes title as levels climb and never returns an empty name", () => {
    expect(getRankName(1)).not.toBe(getRankName(MAX_LEVEL));
    for (let level = 1; level <= MAX_LEVEL + 5; level++) expect(getRankName(level).length).toBeGreaterThan(0);
  });
});

describe("isLevelUpWorthCelebrating", () => {
  it("celebrates only when a multiple of 5 is reached", () => {
    expect(isLevelUpWorthCelebrating(1, 2)).toBe(false);
    expect(isLevelUpWorthCelebrating(4, 5)).toBe(true);
    expect(isLevelUpWorthCelebrating(3, 7)).toBe(true);
    expect(isLevelUpWorthCelebrating(5, 9)).toBe(false);
  });
});
