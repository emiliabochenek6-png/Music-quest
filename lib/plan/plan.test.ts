import { describe, expect, it } from "@jest/globals";
import { WORLDS } from "@/data/worlds";
import { getWorldContent } from "@/data/lessons";
import { addDays, daysBetween, formatShortPolishDate, weekdayOf } from "@/lib/plan/dates";
import { buildPath, lessonIndexesToKeep } from "@/lib/plan/personalPath";
import {
  applyPlacementAnswer,
  completeLevels,
  currentPlacementWorld,
  pickPlacementExercise,
  PLACEMENT_TYPES,
  startPlacement,
  testableWorldIds,
} from "@/lib/plan/placement";
import { buildSchedule, groupByWeek, lessonMinutes, pickTodayLessons } from "@/lib/plan/schedule";
import { computeDailyMissions } from "@/lib/gamification/dailyMissions";
import { resolveLessonNodeState } from "@/lib/progression/resolveLessonNodeState";
import { getTodayStatus } from "@/lib/plan/today";
import { placementQuestionLine, placementResultLine } from "@/lib/plan/soltekLines";
import { afterReview, backfillReviewLog, dueReviewIds, newReviewEntry, pickReviewExercises, REVIEW_INTERVAL_DAYS } from "@/lib/plan/spacedRepetition";

describe("plan dates", () => {
  it("does calendar arithmetic across month ends and daylight saving", () => {
    expect(addDays("2026-01-31", 1)).toBe("2026-02-01");
    expect(addDays("2026-03-28", 3)).toBe("2026-03-31");
    expect(addDays("2026-10-24", 2)).toBe("2026-10-26");
    expect(daysBetween("2026-03-01", "2026-04-01")).toBe(31);
    expect(weekdayOf("2026-10-04")).toBe(0);
    expect(formatShortPolishDate("2026-03-12")).toBe("12 marca");
  });
});

describe("placement test", () => {
  const worldIds = testableWorldIds(WORLDS, getWorldContent);

  it("tests every world except written dictation (Szczyt Dyktand has no eligible question)", () => {
    expect(worldIds).not.toContain("szczyt-dyktand");
    expect(worldIds).toHaveLength(WORLDS.length - 1);
    expect(worldIds).toContain("krolestwo-instrumentow");
  });

  it("only ever picks eligible exercise types, never repeating an excluded id", () => {
    for (const worldId of worldIds) {
      const content = getWorldContent(worldId)!;
      for (const tier of ["easy", "mid", "hard"] as const) {
        const first = pickPlacementExercise(content, tier);
        expect(first).not.toBeNull();
        expect(PLACEMENT_TYPES.has(first!.type)).toBe(true);
        const second = pickPlacementExercise(content, tier, new Set([first!.id]));
        expect(second!.id).not.toBe(first!.id);
      }
    }
  });

  it("asks mid first, then hard after a right answer and easy after a wrong one", () => {
    let state = startPlacement(["a", "b"]);
    expect(currentPlacementWorld(state)).toBe("a");
    expect(state.tier).toBe("mid");
    state = applyPlacementAnswer(state, true);
    expect(state.tier).toBe("hard");
    state = applyPlacementAnswer(state, true);
    expect(state.levels.a).toBe(2);
    expect(currentPlacementWorld(state)).toBe("b");
    state = applyPlacementAnswer(state, false);
    expect(state.tier).toBe("easy");
    state = applyPlacementAnswer(state, false);
    expect(state.levels.b).toBe(0);
    expect(state.done).toBe(true);
    expect(state.answered).toBe(4);
  });

  it("gives level 1 for mid-right/hard-wrong and for mid-wrong/easy-right", () => {
    let a = startPlacement(["w"]);
    a = applyPlacementAnswer(applyPlacementAnswer(a, true), false);
    expect(a.levels.w).toBe(1);
    let b = startPlacement(["w"]);
    b = applyPlacementAnswer(applyPlacementAnswer(b, false), true);
    expect(b.levels.w).toBe(1);
  });

  it("infers dictation from the worlds it builds on, capped at level 1", () => {
    const all = WORLDS.map((world) => world.id);
    const strong = Object.fromEntries(worldIds.map((id) => [id, 2 as const]));
    expect(completeLevels(strong, all)["szczyt-dyktand"]).toBe(1);
    const weak = { ...strong, "przystan-taktow": 0 as const };
    expect(completeLevels(weak, all)["szczyt-dyktand"]).toBe(0);
  });
});

describe("personal path", () => {
  it("keeps everything for 'do nauki', the later 60% for 'częściowo', a quick pass for 'opanowane'", () => {
    expect(lessonIndexesToKeep(10, 0)).toHaveLength(10);
    expect(lessonIndexesToKeep(10, 1)).toEqual([4, 5, 6, 7, 8, 9]);
    expect(lessonIndexesToKeep(10, 2)).toEqual([3, 7, 9]);
    expect(lessonIndexesToKeep(1, 2)).toEqual([0]);
  });

  it("original path (no levels) is every lesson of every world in curriculum order", () => {
    const path = buildPath(WORLDS, getWorldContent, null);
    const total = WORLDS.reduce((sum, world) => sum + getWorldContent(world.id)!.lessons.length, 0);
    expect(path).toHaveLength(total);
    expect(new Set(path.map((entry) => entry.lessonId)).size).toBe(total);
    const worldOrder = path.map((entry) => entry.worldId).filter((id, index, ids) => ids.indexOf(id) === index);
    expect(worldOrder).toEqual(WORLDS.map((world) => world.id));
  });

  it("a personalized path is a shorter, order-preserving subset of the original", () => {
    const original = buildPath(WORLDS, getWorldContent, null);
    const levels = Object.fromEntries(WORLDS.map((world, index) => [world.id, (index % 3) as 0 | 1 | 2]));
    const personal = buildPath(WORLDS, getWorldContent, levels);
    expect(personal.length).toBeLessThan(original.length);
    const positions = personal.map((entry) => original.findIndex((o) => o.lessonId === entry.lessonId));
    expect(positions.every((p) => p >= 0)).toBe(true);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
  });
});

describe("schedule", () => {
  const lessons = Array.from({ length: 12 }, (_, index) => ({ lessonId: `l${index}`, minutes: 8 }));

  it("packs lessons into days of about the daily budget and skips Sundays", () => {
    const days = buildSchedule(lessons, 16, "2026-10-02"); // a Friday
    expect(days.every((day) => day.minutes >= 8)).toBe(true);
    expect(days.flatMap((day) => day.lessonIds)).toEqual(lessons.map((l) => l.lessonId));
    expect(days.every((day) => weekdayOf(day.dateISO) !== 0)).toBe(true);
    expect(days.map((day) => day.dateISO)).toEqual([...days.map((day) => day.dateISO)].sort());
  });

  it("gives a lesson longer than the whole budget a day of its own", () => {
    const days = buildSchedule([{ lessonId: "a", minutes: 40 }, { lessonId: "b", minutes: 5 }], 15, "2026-10-05");
    expect(days[0].lessonIds).toEqual(["a"]);
  });

  it("groups days into weeks counted from the start date", () => {
    const days = buildSchedule(lessons, 8, "2026-10-05");
    const weeks = groupByWeek(days, "2026-10-05");
    expect(weeks[0].number).toBe(1);
    expect(weeks.reduce((sum, week) => sum + week.lessonCount, 0)).toBe(12);
  });

  it("picks today's lessons as the next unfinished ones up to the budget", () => {
    const done = new Set(["l0", "l1"]);
    expect(pickTodayLessons(lessons, (id) => done.has(id), 16)).toEqual(["l2", "l3"]);
    expect(pickTodayLessons(lessons, () => true, 16)).toEqual([]);
  });

  it("estimates lesson length from its exercise count (at least 3 minutes)", () => {
    expect(lessonMinutes(2)).toBe(3);
    expect(lessonMinutes(10)).toBe(9);
  });

  it("the full original path is about 3 months of study days at 15 min/day (6 days a week), longer at 10, shorter at 30", () => {
    const path = buildPath(WORLDS, getWorldContent, null).map((entry) => ({ lessonId: entry.lessonId, minutes: lessonMinutes(entry.exerciseCount) }));
    const at = (minutes: number) => buildSchedule(path, minutes, "2026-10-05").length;
    expect(at(15)).toBeGreaterThan(65);
    expect(at(15)).toBeLessThan(110);
    expect(at(10)).toBeGreaterThan(at(15));
    expect(at(30)).toBeLessThan(at(15));
  });
});

describe("spaced repetition", () => {
  it("schedules the first review for the next day, then lengthens intervals after good rounds", () => {
    let entry = newReviewEntry("2026-10-05");
    expect(entry.dueISO).toBe("2026-10-06");
    entry = afterReview(entry, "2026-10-06", 1);
    expect(entry.stage).toBe(1);
    expect(entry.dueISO).toBe(addDays("2026-10-06", REVIEW_INTERVAL_DAYS[1]));
    for (let i = 0; i < 10; i++) entry = afterReview(entry, entry.dueISO, 0.8);
    expect(entry.stage).toBe(REVIEW_INTERVAL_DAYS.length - 1);
  });

  it("steps back after a poor round and brings the lesson back in two days", () => {
    const entry = afterReview({ stage: 3, dueISO: "2026-10-10", lastISO: "2026-10-01" }, "2026-10-10", 0.2);
    expect(entry.stage).toBe(2);
    expect(entry.dueISO).toBe("2026-10-12");
  });

  it("lists only due lessons, most overdue first, up to the limit", () => {
    const log = {
      a: { stage: 0, dueISO: "2026-10-03", lastISO: "2026-10-02" },
      b: { stage: 0, dueISO: "2026-10-01", lastISO: "2026-09-30" },
      c: { stage: 0, dueISO: "2026-10-09", lastISO: "2026-10-08" },
      d: { stage: 1, dueISO: "2026-10-05", lastISO: "2026-10-02" },
    };
    expect(dueReviewIds(log, "2026-10-05", 5)).toEqual(["b", "a", "d"]);
    expect(dueReviewIds(log, "2026-10-05", 2)).toEqual(["b", "a"]);
  });

  it("staggers the backfill for lessons finished before the plan existed", () => {
    const log = backfillReviewLog({}, Array.from({ length: 25 }, (_, i) => `l${i}`), "2026-10-05");
    const dues = Object.values(log).map((entry) => entry.dueISO);
    expect(Math.min(...dues.map((d) => daysBetween("2026-10-05", d)))).toBe(1);
    expect(Math.max(...dues.map((d) => daysBetween("2026-10-05", d)))).toBeLessThanOrEqual(10);
    expect(backfillReviewLog(log, ["l0"], "2026-12-01")["l0"]).toEqual(log["l0"]);
  });

  it("picks quick review exercises from a lesson, never singing or dictation ones when others exist", () => {
    for (const world of WORLDS) {
      for (const lesson of getWorldContent(world.id)!.lessons) {
        const picked = pickReviewExercises(lesson, 5);
        expect(picked.length).toBeGreaterThan(0);
        expect(picked.length).toBeLessThanOrEqual(5);
        expect(new Set(picked.map((exercise) => exercise.id)).size).toBe(picked.length);
        expect(picked.every((exercise) => lesson.exercises.includes(exercise))).toBe(true);
      }
    }
  });
});

describe("today's status and missions", () => {
  const today = { dateISO: "2026-10-05", lessonIds: ["a", "b"], reviewIds: ["c"] };

  it("marks lessons done once completed and reviews done once reviewed today", () => {
    const status = getTodayStatus(today, "2026-10-05", new Set(["a"]), { c: { stage: 1, dueISO: "2026-10-09", lastISO: "2026-10-05" } });
    expect(status.lessons).toEqual([{ lessonId: "a", done: true }, { lessonId: "b", done: false }]);
    expect(status.reviews).toEqual([{ lessonId: "c", done: true }]);
    const notYet = getTodayStatus(today, "2026-10-05", new Set(), { c: { stage: 0, dueISO: "2026-10-05", lastISO: "2026-10-04" } });
    expect(notYet.reviews[0].done).toBe(false);
  });

  it("has nothing planned when the snapshot is from another day", () => {
    expect(getTodayStatus(today, "2026-10-06", new Set(), {})).toEqual({ lessons: [], reviews: [] });
  });

  it("adds plan and review missions only when the plan has items for today", () => {
    const base = computeDailyMissions(undefined, false, 20);
    expect(base.map((m) => m.id)).toEqual(["lesson", "challenge", "minutes"]);
    const withPlan = computeDailyMissions(undefined, false, 20, {
      lessons: [{ lessonId: "a", done: true }, { lessonId: "b", done: false }],
      reviews: [{ lessonId: "c", done: false }],
    });
    expect(withPlan.map((m) => m.id)).toEqual(["plan", "review", "lesson", "challenge", "minutes"]);
    expect(withPlan[0]).toMatchObject({ current: 1, target: 2, completed: false });
    expect(withPlan[1]).toMatchObject({ current: 0, target: 1, completed: false });
    expect(computeDailyMissions(undefined, false, 20, { lessons: [], reviews: [] }).map((m) => m.id)).toEqual(["lesson", "challenge", "minutes"]);
  });
});

describe("lessons skipped by a personal path", () => {
  const lessons = [1, 2, 3, 4].map((order) => ({ id: `l${order}`, order, difficulty: 1, exercises: [] }));

  it("skipped lessons don't lock the next one", () => {
    expect(resolveLessonNodeState(lessons[3], lessons, new Set())).toBe("locked");
    expect(resolveLessonNodeState(lessons[3], lessons, new Set(["l1"]), new Set(["l2", "l3"]))).toBe("available");
    // l1 is on the path and unfinished, so l4 stays locked behind it even though l2/l3 are skipped.
    expect(resolveLessonNodeState(lessons[3], lessons, new Set(), new Set(["l2", "l3"]))).toBe("locked");
    expect(resolveLessonNodeState(lessons[3], lessons, new Set(), new Set(["l1", "l2", "l3"]))).toBe("available");
  });

  it("still locks a lesson behind an unfinished, non-skipped one", () => {
    expect(resolveLessonNodeState(lessons[3], lessons, new Set(), new Set(["l2"]))).toBe("locked");
  });
});

describe("end-to-end placement scenarios", () => {
  const minutesFor = (levels: Record<string, 0 | 1 | 2>) =>
    buildPath(WORLDS, getWorldContent, levels).map((entry) => ({ lessonId: entry.lessonId, minutes: lessonMinutes(entry.exerciseCount) }));

  it("a student who answers everything right gets a much shorter path than one who answers nothing", () => {
    const all = WORLDS.map((world) => world.id);
    const testable = testableWorldIds(WORLDS, getWorldContent);
    let strong = startPlacement(testable);
    while (!strong.done) strong = applyPlacementAnswer(strong, true);
    let weak = startPlacement(testable);
    while (!weak.done) weak = applyPlacementAnswer(weak, false);
    expect(strong.answered).toBe(testable.length * 2);
    expect(weak.answered).toBe(testable.length * 2);
    const strongLevels = completeLevels(strong.levels, all);
    const weakLevels = completeLevels(weak.levels, all);
    expect(Object.values(strongLevels).filter((level) => level === 2)).toHaveLength(testable.length);
    expect(Object.values(weakLevels).every((level) => level === 0)).toBe(true);
    const strongPath = minutesFor(strongLevels);
    const weakPath = minutesFor(weakLevels);
    expect(weakPath).toHaveLength(208);
    expect(strongPath.length).toBeLessThan(weakPath.length * 0.4);
    expect(strongPath.length).toBeGreaterThan(30);
    // Mastered worlds keep their capstone (the last lesson, usually the boss).
    for (const world of WORLDS) {
      const lessons = getWorldContent(world.id)!.lessons;
      if (strongLevels[world.id] === 2) expect(strongPath.some((entry) => entry.lessonId === lessons[lessons.length - 1].id)).toBe(true);
    }
  });
});

describe("Soltek's placement lines", () => {
  it("opens, marks the halfway point and the end, and never says whether an answer was right", () => {
    expect(placementQuestionLine(0, 24, "Wioska Nut").message).toContain("Wioska Nut");
    expect(placementQuestionLine(12, 24, "Pasmo Interwałów").message).toContain("Połowa");
    expect(placementQuestionLine(23, 24, "Zaczarowany Solfeż").message).toContain("koniec");
    for (let answered = 1; answered < 24; answered++) {
      const message = placementQuestionLine(answered, 24, "X").message.toLowerCase();
      expect(message).not.toMatch(/dobrze|źle|brawo|poprawn|błęd/);
    }
  });

  it("describes the result by how much of the path was skipped", () => {
    expect(placementResultLine(0, 12, 208, 208).message).toContain("od podstaw");
    expect(placementResultLine(10, 12, 62, 208).message).toContain("62 z 208");
    expect(placementResultLine(2, 12, 150, 208).message).toContain("150 z 208");
  });
});
