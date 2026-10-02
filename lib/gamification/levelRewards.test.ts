import { describe, expect, it } from "@jest/globals";
import { isMilestoneLevel, nextMilestoneLevel, nutkiForLevelRange, nutkiForReachingLevel, NUTKI_PER_LEVEL, NUTKI_PER_MILESTONE_LEVEL, roadmapAfter } from "@/lib/gamification/levelRewards";
import { getTitleUnlockedAt, MAX_LEVEL } from "@/lib/gamification/rank";

describe("level rewards", () => {
  it("pays nothing for level 1, a little for most levels and a lot for every 5th", () => {
    expect(nutkiForReachingLevel(1)).toBe(0);
    expect(nutkiForReachingLevel(2)).toBe(NUTKI_PER_LEVEL);
    expect(nutkiForReachingLevel(5)).toBe(NUTKI_PER_MILESTONE_LEVEL);
    expect(nutkiForReachingLevel(10)).toBe(NUTKI_PER_MILESTONE_LEVEL);
    expect(isMilestoneLevel(1)).toBe(false);
  });

  it("adds up the levels crossed in one jump", () => {
    expect(nutkiForLevelRange(1, 2)).toBe(5);
    expect(nutkiForLevelRange(3, 6)).toBe(5 + 25 + 5); // levels 4, 5, 6
    expect(nutkiForLevelRange(7, 7)).toBe(0);
  });

  it("lists the next levels with cost, nutki and the titles they unlock", () => {
    const roadmap = roadmapAfter(3, 8);
    expect(roadmap.map((entry) => entry.level)).toEqual([4, 5, 6, 7, 8, 9, 10, 11]);
    expect(roadmap[1]).toMatchObject({ level: 5, isMilestone: true, nutki: 25, newTitle: getTitleUnlockedAt(5) });
    expect(roadmap.every((entry, index) => index === 0 || entry.xpRequired > roadmap[index - 1].xpRequired)).toBe(true);
    expect(roadmap.every((entry) => entry.xpCost > 0)).toBe(true);
  });

  it("stops at the top level", () => {
    expect(roadmapAfter(MAX_LEVEL - 1, 10).map((entry) => entry.level)).toEqual([MAX_LEVEL]);
    expect(roadmapAfter(MAX_LEVEL, 10)).toEqual([]);
  });

  it("finds the next milestone level", () => {
    expect(nextMilestoneLevel(1)).toBe(5);
    expect(nextMilestoneLevel(5)).toBe(10);
    expect(nextMilestoneLevel(MAX_LEVEL)).toBeNull();
  });
});
