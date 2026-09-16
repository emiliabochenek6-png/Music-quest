import { describe, expect, it } from "@jest/globals";
import { WORLDS } from "@/data/worlds";
import { getWorldContent } from "@/data/lessons";
import { countPerfectWorlds, getEarnedBadgeIds } from "@/lib/gamification/badges";
import { INITIAL_GAMIFICATION_STATE } from "@/types/gamification";
import type { GamificationState } from "@/types/gamification";

function gamification(overrides: Partial<GamificationState>): GamificationState {
  return { ...INITIAL_GAMIFICATION_STATE, ...overrides };
}

describe("countPerfectWorlds", () => {
  it("counts zero when no lesson has 3 stars", () => {
    expect(countPerfectWorlds({})).toBe(0);
  });

  it("counts a world only once EVERY one of its lessons sits at 3 stars", () => {
    const world = WORLDS[0];
    const content = getWorldContent(world.id);
    if (!content) throw new Error("expected the first world to have content");

    const allButLast = Object.fromEntries(content.lessons.slice(0, -1).map((l) => [l.id, 3 as const]));
    expect(countPerfectWorlds(allButLast)).toBe(0);

    const allPerfect = Object.fromEntries(content.lessons.map((l) => [l.id, 3 as const]));
    expect(countPerfectWorlds(allPerfect)).toBe(1);
  });
});

describe("getEarnedBadgeIds", () => {
  it("earns nothing from a fresh state", () => {
    const earned = getEarnedBadgeIds(gamification({}), 0);
    expect(earned.size).toBe(0);
  });

  it("earns xp/streak/lesson-count badges once their threshold is crossed", () => {
    const earned = getEarnedBadgeIds(gamification({ xp: 500, streakDays: 7 }), 25);
    expect(earned.has("xp-500")).toBe(true);
    expect(earned.has("xp-2000")).toBe(false);
    expect(earned.has("streak-7")).toBe(true);
    expect(earned.has("lessons-25")).toBe(true);
    expect(earned.has("lessons-100")).toBe(false);
  });
});
