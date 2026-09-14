import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { WORLDS } from "@/data/worlds";
import { getWorldContent } from "@/data/lessons";
import { getUnlockedExercisePool, pickDailyChallengeDefinition } from "@/lib/dailyChallenge/pickDailyChallenge";
import type { ProgressState, SubscriptionStatus } from "@/types/content";

// Same reasoning as lib/progression/resolveNodeState.test.ts's own: force
// __DEV__ false for this suite so it actually exercises real unlock
// gating instead of resolveNodeState's dev-only "everything available"
// bypass.
declare let __DEV__: boolean;
let originalDev: boolean;

beforeAll(() => {
  originalDev = __DEV__;
  __DEV__ = false;
});

afterAll(() => {
  __DEV__ = originalDev;
});

const INACTIVE: SubscriptionStatus = { isActive: false, plan: null, expiresAt: null, isInGracePeriod: false, isTrialActive: false };
const ACTIVE: SubscriptionStatus = { ...INACTIVE, isActive: true, plan: "monthly" };

const NO_PROGRESS: ProgressState = { completedWorldIds: new Set(), completedLessonIds: new Set() };

/** Every lesson in every world, starred at 3 — these tests are about the
 * exercise pool itself, not resolveNodeState's own star requirement (see
 * lib/progression/resolveNodeState.test.ts for that), so a "completed"
 * world here should always ALSO satisfy it. */
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

describe("getUnlockedExercisePool", () => {
  it("with zero progress, only includes exercises from the first world's first lesson", () => {
    const pool = getUnlockedExercisePool(NO_PROGRESS, INACTIVE, {});
    const firstWorld = WORLDS[0];
    const firstLesson = getWorldContent(firstWorld.id)!.lessons.find((l) => l.order === 1)!;
    expect(pool.length).toBeGreaterThan(0);
    const poolIds = new Set(pool.map((e) => e.id));
    for (const exercise of firstLesson.exercises) {
      expect(poolIds.has(exercise.id)).toBe(true);
    }
    // A later lesson's exercises must NOT be in the pool yet.
    const laterLesson = getWorldContent(firstWorld.id)!.lessons.find((l) => l.order === 2);
    if (laterLesson) {
      for (const exercise of laterLesson.exercises) {
        expect(poolIds.has(exercise.id)).toBe(false);
      }
    }
  });

  it("grows to include a second world's content once the first world is completed and subscribed", () => {
    const firstWorld = WORLDS[0];
    const secondWorld = WORLDS[1];
    const progress: ProgressState = { completedWorldIds: new Set([firstWorld.id]), completedLessonIds: new Set() };
    const pool = getUnlockedExercisePool(progress, ACTIVE, fullStars());
    const secondWorldFirstLesson = getWorldContent(secondWorld.id)!.lessons.find((l) => l.order === 1)!;
    const poolIds = new Set(pool.map((e) => e.id));
    // Only the non-excluded exercises of that lesson need to show up —
    // pulse-tap is a deliberately-excluded type this lesson also uses.
    const eligibleExerciseIds = secondWorldFirstLesson.exercises.filter((e) => e.type !== "pulse-tap").map((e) => e.id);
    expect(eligibleExerciseIds.length).toBeGreaterThan(0);
    for (const id of eligibleExerciseIds) {
      expect(poolIds.has(id)).toBe(true);
    }
  });

  it("excludes self-contained multi-step exercise types (e.g. interval-timed-test)", () => {
    // Pasmo Interwałów's own last lesson is an interval-timed-test — with
    // enough progress unlocked to reach it, it must still be excluded.
    const pasmoIndex = WORLDS.findIndex((w) => w.id === "pasmo-interwalow");
    const completedIds = WORLDS.slice(0, pasmoIndex + 1).map((w) => w.id);
    const progress: ProgressState = { completedWorldIds: new Set(completedIds), completedLessonIds: new Set() };
    const pool = getUnlockedExercisePool(progress, ACTIVE, fullStars());
    expect(pool.some((e) => e.type === "interval-timed-test")).toBe(false);
  });
});

describe("pickDailyChallengeDefinition", () => {
  it("returns null for an empty pool", () => {
    expect(pickDailyChallengeDefinition([])).toBeNull();
  });

  it("always picks a definition that was actually in the pool", () => {
    const pool = getUnlockedExercisePool(NO_PROGRESS, INACTIVE, {});
    const poolIds = new Set(pool.map((e) => e.id));
    for (let i = 0; i < 20; i++) {
      const picked = pickDailyChallengeDefinition(pool);
      expect(picked).not.toBeNull();
      expect(poolIds.has(picked!.id)).toBe(true);
    }
  });
});
