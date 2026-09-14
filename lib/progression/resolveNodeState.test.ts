import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { getWorldContent } from "@/data/lessons";
import { WORLDS } from "@/data/worlds";
import { resolveNodeState } from "@/lib/progression/resolveNodeState";
import type { ProgressState, SubscriptionStatus } from "@/types/content";

// resolveNodeState short-circuits to "available" whenever __DEV__ is true
// (see its own doc — a deliberate dev-only bypass so testing a world's
// content doesn't require grinding through every earlier one first).
// jest-expo's own test environment sets __DEV__ true by default, same as
// any other dev tooling — but THIS suite exists specifically to verify
// the real progression/subscription gating logic, so it forces __DEV__
// false for its own duration to actually exercise that logic, restoring
// whatever it was afterward.
declare let __DEV__: boolean;
let originalDev: boolean;

beforeAll(() => {
  originalDev = __DEV__;
  __DEV__ = false;
});

afterAll(() => {
  __DEV__ = originalDev;
});

const INACTIVE: SubscriptionStatus = {
  isActive: false,
  plan: null,
  expiresAt: null,
  isInGracePeriod: false,
  isTrialActive: false,
};
const ACTIVE: SubscriptionStatus = { ...INACTIVE, isActive: true, plan: "monthly" };

function progress(completedIds: string[]): ProgressState {
  return { completedWorldIds: new Set(completedIds), completedLessonIds: new Set() };
}

/** Every lesson in every world, starred at 3 — the "not what this test is
 * about" baseline for tests that exercise progression/subscription
 * gating rather than the star requirement itself, so a completed world
 * always ALSO satisfies meetsStarRequirement and the two concerns stay
 * isolated from each other. */
function fullStars(): Record<string, 1 | 2 | 3> {
  const stars: Record<string, 1 | 2 | 3> = {};
  for (const world of WORLDS) {
    const content = getWorldContent(world.id);
    if (!content) continue;
    for (const lesson of content.lessons) {
      stars[lesson.id] = 3;
    }
  }
  return stars;
}

describe("resolveNodeState", () => {
  it("marks the first world available with no progress at all", () => {
    const [first] = WORLDS;
    expect(resolveNodeState(first, progress([]), INACTIVE, {})).toBe("available");
  });

  it("marks a world completed once its id is in progress", () => {
    const [first] = WORLDS;
    expect(resolveNodeState(first, progress([first.id]), INACTIVE, {})).toBe("completed");
  });

  it("locks a world by progression when the previous one isn't done, regardless of subscription", () => {
    const second = WORLDS[1];
    expect(resolveNodeState(second, progress([]), ACTIVE, fullStars())).toBe("locked-progression");
  });

  it("locks a free world's successor by subscription only once progression itself would unlock it", () => {
    // Worlds 1-3 are free — finishing world 3 makes world 4 (premium)
    // reachable by progression, so subscription becomes the deciding
    // factor for the first time here.
    const completedFreeWorlds = WORLDS.filter((w) => !w.isPremium).map((w) => w.id);
    const firstPremium = WORLDS.find((w) => w.isPremium)!;
    expect(resolveNodeState(firstPremium, progress(completedFreeWorlds), INACTIVE, fullStars())).toBe("locked-subscription");
    expect(resolveNodeState(firstPremium, progress(completedFreeWorlds), ACTIVE, fullStars())).toBe("available");
  });

  it("never lets an active subscription skip an unfinished PREVIOUS premium world", () => {
    // World 5 premium, world 4 (also premium) not yet done -- subscription
    // active shouldn't matter, progression still gates it.
    const completedThroughWorld3 = WORLDS.filter((w) => w.order <= 3).map((w) => w.id);
    const worldFive = WORLDS.find((w) => w.order === 5)!;
    expect(resolveNodeState(worldFive, progress(completedThroughWorld3), ACTIVE, fullStars())).toBe("locked-progression");
  });

  describe("star requirement (meetsStarRequirement)", () => {
    it("locks the next world by progression when the previous one is completed but under-starred", () => {
      const [first, second] = WORLDS;
      const content = getWorldContent(first.id)!;
      const oneStarOnly: Record<string, 1 | 2 | 3> = {};
      for (const lesson of content.lessons) oneStarOnly[lesson.id] = 1; // below MIN_STARS_TO_ADVANCE_WORLD
      expect(resolveNodeState(second, progress([first.id]), ACTIVE, oneStarOnly)).toBe("locked-progression");
    });

    it("unlocks the next world once every lesson in the previous one has at least 2 stars", () => {
      const [first, second] = WORLDS;
      const content = getWorldContent(first.id)!;
      const twoStarsEverywhere: Record<string, 1 | 2 | 3> = {};
      for (const lesson of content.lessons) twoStarsEverywhere[lesson.id] = 2;
      expect(resolveNodeState(second, progress([first.id]), ACTIVE, twoStarsEverywhere)).toBe("available");
    });

    it("locks the next world when even ONE lesson in the previous one falls short", () => {
      const [first, second] = WORLDS;
      const content = getWorldContent(first.id)!;
      const almostAllTwoStars: Record<string, 1 | 2 | 3> = {};
      content.lessons.forEach((lesson, index) => {
        almostAllTwoStars[lesson.id] = index === 0 ? 1 : 2; // one lesson under the bar
      });
      expect(resolveNodeState(second, progress([first.id]), ACTIVE, almostAllTwoStars)).toBe("locked-progression");
    });
  });
});
