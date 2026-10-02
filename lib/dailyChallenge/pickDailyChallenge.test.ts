import { describe, expect, it } from "@jest/globals";
import { WORLDS } from "@/data/worlds";
import { getWorldContent } from "@/data/lessons";
import { getUnlockedExercisePool, pickDailyChallengeDefinition } from "@/lib/dailyChallenge/pickDailyChallenge";
import type { ProgressState } from "@/types/content";

const NO_PROGRESS: ProgressState = { completedWorldIds: new Set(), completedLessonIds: new Set() };

function lessonOf(worldIndex: number, order: number) {
  return getWorldContent(WORLDS[worldIndex].id)!.lessons.find((lesson) => lesson.order === order)!;
}

describe("getUnlockedExercisePool", () => {
  it("with nothing finished yet, falls back to the first world's first lesson", () => {
    const pool = getUnlockedExercisePool(NO_PROGRESS);
    const firstLesson = lessonOf(0, 1);
    const poolIds = new Set(pool.map((e) => e.id));
    expect(pool.length).toBeGreaterThan(0);
    for (const exercise of firstLesson.exercises.filter((e) => e.type !== "pulse-tap")) {
      expect(poolIds.has(exercise.id)).toBe(true);
    }
    for (const exercise of lessonOf(0, 2).exercises) expect(poolIds.has(exercise.id)).toBe(false);
  });

  it("draws only from finished lessons, from any world, and nothing else", () => {
    const done = [lessonOf(0, 2), lessonOf(1, 1)];
    const progress: ProgressState = { completedWorldIds: new Set(), completedLessonIds: new Set(done.map((lesson) => lesson.id)) };
    const pool = getUnlockedExercisePool(progress);
    const poolIds = new Set(pool.map((e) => e.id));
    const allowed = new Set(done.flatMap((lesson) => lesson.exercises.map((e) => e.id)));
    expect(pool.length).toBeGreaterThan(0);
    for (const id of poolIds) expect(allowed.has(id)).toBe(true);
    // Lesson 1 of the first world was NOT finished, so none of it may appear.
    for (const exercise of lessonOf(0, 1).exercises) expect(poolIds.has(exercise.id)).toBe(false);
  });

  it("excludes self-contained multi-step exercise types (e.g. interval-timed-test)", () => {
    const ids = new Set<string>();
    for (const world of WORLDS) for (const lesson of getWorldContent(world.id)?.lessons ?? []) ids.add(lesson.id);
    const pool = getUnlockedExercisePool({ completedWorldIds: new Set(), completedLessonIds: ids });
    expect(pool.some((e) => e.type === "interval-timed-test")).toBe(false);
    expect(pool.some((e) => e.type === "pulse-tap")).toBe(false);
  });
});

describe("pickDailyChallengeDefinition", () => {
  it("returns null for an empty pool", () => {
    expect(pickDailyChallengeDefinition([])).toBeNull();
  });

  it("always picks a definition that was actually in the pool", () => {
    const pool = getUnlockedExercisePool(NO_PROGRESS);
    const poolIds = new Set(pool.map((e) => e.id));
    for (let i = 0; i < 20; i++) {
      const picked = pickDailyChallengeDefinition(pool);
      expect(picked).not.toBeNull();
      expect(poolIds.has(picked!.id)).toBe(true);
    }
  });
});
