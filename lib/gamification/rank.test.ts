import { describe, expect, it } from "@jest/globals";
import { getRankForXp, getRankName } from "@/lib/gamification/rank";

describe("getRankForXp", () => {
  it("starts everyone at rank 1 with 0 XP", () => {
    expect(getRankForXp(0)).toEqual({ rank: 1, xpIntoRank: 0, xpForNextRank: 100 });
  });

  it("stays at the current rank right up until its own threshold", () => {
    expect(getRankForXp(99)).toEqual({ rank: 1, xpIntoRank: 99, xpForNextRank: 1 });
  });

  it("advances to the next rank exactly AT its threshold", () => {
    expect(getRankForXp(100)).toEqual({ rank: 2, xpIntoRank: 0, xpForNextRank: 150 });
  });

  it("reports xpIntoRank relative to the CURRENT rank's own threshold, not from zero", () => {
    const info = getRankForXp(275);
    expect(info.rank).toBe(3); // threshold 250
    expect(info.xpIntoRank).toBe(25);
  });

  it("reports xpForNextRank as null once past the last defined threshold", () => {
    const info = getRankForXp(999999);
    expect(info.xpForNextRank).toBeNull();
  });

  it("never reports a rank below 1, even for negative XP (defensive)", () => {
    expect(getRankForXp(-50).rank).toBe(1);
  });
});

describe("getRankName", () => {
  it("gives rank 1 a distinct name from rank 2", () => {
    expect(getRankName(1)).not.toBe(getRankName(2));
  });

  it("returns a non-empty name for every rank getRankForXp can actually produce", () => {
    for (const xp of [0, 100, 250, 999999]) {
      const { rank } = getRankForXp(xp);
      expect(getRankName(rank).length).toBeGreaterThan(0);
    }
  });

  it("falls back to the highest-defined name for a rank beyond what's named (defensive)", () => {
    expect(getRankName(999)).toBe(getRankName(11));
  });

  it("clamps below rank 1 to the first name (defensive)", () => {
    expect(getRankName(0)).toBe(getRankName(1));
  });
});
