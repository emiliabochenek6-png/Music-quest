import { describe, expect, it } from "@jest/globals";
import { WORLDS } from "@/data/worlds";
import { getWorldContent } from "@/data/lessons";
import { mergeTraining } from "@/lib/sync/mergeState";
import { allTrainingItems, buildPool, pickNext, topicAvailable } from "@/lib/training/pool";
import { MIN_ANSWERS_FOR_STATS, TRAINING_REWARDED_ANSWERS_PER_DAY } from "@/lib/training/rewards";
import { EMPTY_TRAINING, lastWeek, percent, recordAnswer, rewardsLeftToday, weakestTopics } from "@/lib/training/stats";
import { DIFFICULTY_OPTIONS, EXCLUDED_TRAINING_TYPES, TRAINING_TOPICS, matchesDifficulty, topicOfType } from "@/lib/training/topics";

describe("Tryb własny: topics and pool", () => {
  it("every exercise type used in the lessons belongs to a topic or is left out on purpose", () => {
    const unknown = new Set<string>();
    for (const world of WORLDS) {
      for (const lesson of getWorldContent(world.id)?.lessons ?? []) {
        for (const definition of lesson.exercises) {
          const type = definition.spec.type;
          if (!topicOfType(type) && !EXCLUDED_TRAINING_TYPES.includes(type)) unknown.add(type);
        }
      }
    }
    expect([...unknown]).toEqual([]);
  });

  it("no type is listed in two topics", () => {
    const seen = new Set<string>();
    for (const topic of TRAINING_TOPICS) {
      for (const type of topic.types) {
        expect(seen.has(type)).toBe(false);
        seen.add(type);
      }
    }
  });

  it("every topic has plenty of exercises, at every difficulty (a difficulty with nothing falls back to all)", () => {
    for (const topic of TRAINING_TOPICS) {
      expect(buildPool([topic.id], "mieszane", false).length).toBeGreaterThanOrEqual(10);
      expect(topicAvailable(topic.id, false)).toBe(true);
      for (const { id } of DIFFICULTY_OPTIONS) expect(buildPool([topic.id], id, false).length).toBeGreaterThan(0);
    }
  });

  it("splits by difficulty and keeps only the chosen topics", () => {
    const easy = buildPool(["interwaly"], "latwo", false);
    expect(easy.every((item) => item.topicId === "interwaly")).toBe(true);
    expect(easy.every((item) => matchesDifficulty(item.definition.difficulty, "latwo"))).toBe(true);
    expect(buildPool(["interwaly", "rytm"], "mieszane", false).length).toBe(buildPool(["interwaly"], "mieszane", false).length + buildPool(["rytm"], "mieszane", false).length);
    expect(allTrainingItems().length).toBeGreaterThan(1000);
  });

  it("does not repeat the last questions while there is something else", () => {
    const pool = buildPool(["nuty"], "mieszane", false);
    const recent = pool.slice(0, 5).map((item) => item.definition.id);
    for (let i = 0; i < 40; i++) expect(recent).not.toContain(pickNext(pool, recent)!.definition.id);
    expect(pickNext([], [])).toBeNull();
    expect(pickNext(pool.slice(0, 1), [pool[0].definition.id])).toBe(pool[0]);
  });
});

describe("Tryb własny: statistics and rewards", () => {
  it("counts answers per topic and day, and finds the weakest topics", () => {
    let state = EMPTY_TRAINING;
    for (let i = 0; i < 12; i++) state = recordAnswer(state, "interwaly", i < 9, "2026-10-04");
    for (let i = 0; i < 12; i++) state = recordAnswer(state, "akordy", i < 4, "2026-10-04");
    for (let i = 0; i < 3; i++) state = recordAnswer(state, "rytm", false, "2026-10-04"); // too few answers to count
    expect(percent(state.totals.interwaly)).toBe(75);
    expect(percent(state.totals.akordy)).toBe(33);
    expect(percent(undefined)).toBeNull();
    expect(weakestTopics(state, 2)).toEqual(["akordy", "interwaly"]);
    expect(MIN_ANSWERS_FOR_STATS).toBeGreaterThan(3);
    expect(lastWeek(state, "interwaly", "2026-10-06")).toEqual({ correct: 9, total: 12 });
    expect(lastWeek(state, "interwaly", "2026-10-20")).toEqual({ correct: 0, total: 0 });
  });

  it("forgets old days but keeps the totals", () => {
    let state = recordAnswer(EMPTY_TRAINING, "nuty", true, "2026-09-01");
    state = recordAnswer(state, "nuty", true, "2026-10-04");
    expect(Object.keys(state.days)).toEqual(["2026-10-04"]);
    expect(state.totals.nuty.total).toBe(2);
  });

  it("the reward cap resets every day", () => {
    const used = { ...EMPTY_TRAINING, rewardDateISO: "2026-10-04", rewardedToday: TRAINING_REWARDED_ANSWERS_PER_DAY };
    expect(rewardsLeftToday(used, "2026-10-04", TRAINING_REWARDED_ANSWERS_PER_DAY)).toBe(0);
    expect(rewardsLeftToday(used, "2026-10-05", TRAINING_REWARDED_ANSWERS_PER_DAY)).toBe(TRAINING_REWARDED_ANSWERS_PER_DAY);
    expect(rewardsLeftToday(EMPTY_TRAINING, "2026-10-05", 30)).toBe(30);
  });

  it("sync keeps the copy with more answers, the best records and the newer reward counter", () => {
    const a = recordAnswer(recordAnswer(EMPTY_TRAINING, "rytm", true, "2026-10-04"), "rytm", true, "2026-10-04");
    const b = { ...recordAnswer(EMPTY_TRAINING, "rytm", false, "2026-10-04"), bestStreak: 7, bestTimed: 3, rewardDateISO: "2026-10-04", rewardedToday: 5 };
    const merged = mergeTraining({ ...a, bestStreak: 4, bestTimed: 9, rewardDateISO: "2026-10-03", rewardedToday: 30 }, b);
    expect(merged.totals.rytm).toEqual({ correct: 2, total: 2 });
    expect(merged.bestStreak).toBe(7);
    expect(merged.bestTimed).toBe(9);
    expect(merged.rewardDateISO).toBe("2026-10-04");
    expect(merged.rewardedToday).toBe(5);
  });
});
