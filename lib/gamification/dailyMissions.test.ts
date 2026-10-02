import { describe, expect, it } from "@jest/globals";
import { ALL_MISSIONS, computeDailyMissions, GAME_MISSIONS, PLAN_MISSIONS, TIME_MISSIONS } from "@/lib/gamification/dailyMissions";
import type { PlanOffer } from "@/lib/gamification/dailyMissions";
import type { DayActivity } from "@/types/gamification";

const EMPTY_DAY: DayActivity = { minutesSpent: 0, lessonIdsCompleted: [], dailyChallengeCompleted: false };
const BUSY_PLAN: PlanOffer = { hasPlan: true, lessons: 3, reviews: 2 };
const NO_PLAN: PlanOffer = { hasPlan: false, lessons: 0, reviews: 0 };

function dates(count: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < count; i++) out.push(new Date(Date.UTC(2026, 9, 1 + i)).toISOString().slice(0, 10));
  return out;
}

describe("mission pools", () => {
  it("has 60 different missions, 20 per category, with unique ids and labels", () => {
    expect(PLAN_MISSIONS).toHaveLength(20);
    expect(GAME_MISSIONS).toHaveLength(20);
    expect(TIME_MISSIONS).toHaveLength(20);
    expect(new Set(ALL_MISSIONS.map((m) => m.id)).size).toBe(60);
    expect(new Set(ALL_MISSIONS.map((m) => m.label)).size).toBe(60);
  });
});

describe("computeDailyMissions", () => {
  it("gives exactly three missions a day: one plan, one game, one time", () => {
    for (const date of dates(40)) {
      const missions = computeDailyMissions(date, undefined, false, 30, BUSY_PLAN);
      expect(missions.map((m) => m.category)).toEqual(["plan", "game", "time"]);
      expect(missions.every((m) => !m.completed && m.current === 0)).toBe(true);
    }
  });

  it("is the same all day and varies from day to day", () => {
    const first = computeDailyMissions("2026-10-05", undefined, false, 30, BUSY_PLAN);
    expect(computeDailyMissions("2026-10-05", EMPTY_DAY, false, 30, BUSY_PLAN).map((m) => m.id)).toEqual(first.map((m) => m.id));
    const seen = new Set(dates(30).map((date) => computeDailyMissions(date, undefined, false, 30, BUSY_PLAN).map((m) => m.id).join("+")));
    expect(seen.size).toBeGreaterThan(25);
    for (let i = 1; i < 30; i++) {
      const [a, b] = [dates(30)[i - 1], dates(30)[i]].map((d) => computeDailyMissions(d, undefined, false, 30, BUSY_PLAN));
      expect(a[0].id).not.toBe(b[0].id);
      expect(a[1].id).not.toBe(b[1].id);
      expect(a[2].id).not.toBe(b[2].id);
    }
  });

  it("uses a good share of the whole pool over a few months", () => {
    const used = new Set<string>();
    for (let i = 0; i < 90; i++) {
      const date = new Date(Date.UTC(2026, 9, 1 + i)).toISOString().slice(0, 10);
      for (const m of computeDailyMissions(date, undefined, false, 30, BUSY_PLAN)) used.add(m.id);
    }
    expect(used.size).toBeGreaterThanOrEqual(45);
  });

  it("never asks for more than the plan has on offer today", () => {
    const small: PlanOffer = { hasPlan: true, lessons: 1, reviews: 0 };
    for (const date of dates(60)) {
      const plan = computeDailyMissions(date, undefined, false, 30, small)[0];
      expect(plan.target).toBeLessThanOrEqual(small.lessons * 8);
      expect(["planLessons", "reviews"].includes(plan.id)).toBe(false);
      expect(plan.id).not.toMatch(/powtorki|powtorka|lekcje-[234]|razem-[34]/);
    }
  });

  it("keeps a day's total effort reasonable: no two hardest missions on one day, and a bounded total", () => {
    const defsById = new Map(ALL_MISSIONS.map((m) => [m.id, m]));
    for (const date of dates(120)) {
      const picked = computeDailyMissions(date, undefined, false, 30, BUSY_PLAN).map((m) => defsById.get(m.id)!);
      const hard = picked.filter((m) => m.difficulty === 3).length;
      expect(hard).toBeLessThanOrEqual(2);
      expect(picked[0].difficulty === 3 && picked[1].difficulty === 3).toBe(false);
      expect(picked.reduce((sum, m) => sum + m.difficulty, 0)).toBeLessThanOrEqual(7);
    }
  });

  it("asks the player to set up a plan when there is none", () => {
    const [plan] = computeDailyMissions("2026-10-05", undefined, false, 30, NO_PLAN);
    expect(plan.id).toBe("pl-ustaw-plan");
  });

  it("falls back to the daily challenge on a rest day, and the game slot never repeats it then", () => {
    for (const date of dates(60)) {
      const missions = computeDailyMissions(date, undefined, false, 25, { hasPlan: true, lessons: 0, reviews: 0 });
      expect(missions[0]).toMatchObject({ id: "pl-wyzwanie-dnia", xpReward: 25 });
      expect(missions[1].id).not.toBe("gr-wyzwanie");
      expect(missions[1].id).not.toMatch(/wyzwanie/);
    }
  });

  it("counts game and plan progress separately", () => {
    const day: DayActivity = { ...EMPTY_DAY, minutesSpent: 40, stats: { planLessons: 9, planCorrect: 99, reviews: 9, funLessons: 9, funCorrect: 99, funStars3: 9, funPerfect: 9, planStars3: 9, planPerfect: 9, bosses: 9 } };
    for (const date of dates(30)) {
      const missions = computeDailyMissions(date, day, false, 30, BUSY_PLAN);
      expect(missions.filter((m) => m.id !== "gr-wyzwanie" && !m.id.startsWith("gr-lekcja-wyzwanie") && !m.id.startsWith("gr-lekcje-wyzwanie")).every((m) => m.completed)).toBe(true);
    }
    // Only plan stats → game mission stays open.
    const planOnly: DayActivity = { ...EMPTY_DAY, stats: { planLessons: 9, planCorrect: 99, reviews: 9 } };
    expect(computeDailyMissions("2026-10-05", planOnly, false, 30, BUSY_PLAN)[1].completed).toBe(false);
  });

  it("counts the daily challenge towards the mission that asks for it", () => {
    for (const date of dates(80)) {
      const m = computeDailyMissions(date, undefined, true, 30, BUSY_PLAN).find((x) => x.id === "gr-wyzwanie");
      if (m) expect(m).toMatchObject({ completed: true, xpReward: 30 });
    }
  });

  it("caps current progress at the target", () => {
    const day: DayActivity = { ...EMPTY_DAY, minutesSpent: 90 };
    const time = computeDailyMissions("2026-10-05", day, false, 30, BUSY_PLAN)[2];
    expect(time.completed).toBe(true);
    expect(time.current).toBe(time.target);
  });
});
