import { describe, expect, it } from "@jest/globals";
import { activityLevel, describeDay, weekDaysOf, weekMilestoneProgress } from "@/lib/gamification/calendarView";
import type { DayActivity } from "@/types/gamification";

const day = (overrides: Partial<DayActivity>): DayActivity => ({ minutesSpent: 0, lessonIdsCompleted: [], dailyChallengeCompleted: false, ...overrides });

describe("activityLevel", () => {
  it("is 0 for no day or an empty one, and grows with the minutes", () => {
    expect(activityLevel(undefined)).toBe(0);
    expect(activityLevel(day({}))).toBe(0);
    expect(activityLevel(day({ minutesSpent: 4 }))).toBe(1);
    expect(activityLevel(day({ minutesSpent: 10 }))).toBe(2);
    expect(activityLevel(day({ minutesSpent: 20 }))).toBe(3);
  });

  it("colours a day with only a lesson or only the challenge at least lightly", () => {
    expect(activityLevel(day({ lessonIdsCompleted: ["a"] }))).toBe(1);
    expect(activityLevel(day({ dailyChallengeCompleted: true }))).toBe(1);
  });
});

describe("weekDaysOf", () => {
  it("returns Monday to Sunday around a date", () => {
    expect(weekDaysOf("2026-10-02")).toEqual(["2026-09-28", "2026-09-29", "2026-09-30", "2026-10-01", "2026-10-02", "2026-10-03", "2026-10-04"]);
    expect(weekDaysOf("2026-10-04")[0]).toBe("2026-09-28"); // a Sunday belongs to the week that started on Monday
    expect(weekDaysOf("2026-10-05")[0]).toBe("2026-10-05");
  });
});

describe("weekMilestoneProgress", () => {
  it("counts towards the next multiple of 7", () => {
    expect(weekMilestoneProgress(0)).toEqual({ daysDone: 0, justReached: false, daysLeft: 7 });
    expect(weekMilestoneProgress(3)).toEqual({ daysDone: 3, justReached: false, daysLeft: 4 });
    expect(weekMilestoneProgress(7)).toEqual({ daysDone: 7, justReached: true, daysLeft: 0 });
    expect(weekMilestoneProgress(9).daysDone).toBe(2);
  });
});

describe("describeDay", () => {
  it("names the day and lists what was done", () => {
    const result = describeDay("2026-10-02", day({ minutesSpent: 12, lessonIdsCompleted: ["a", "b"], dailyChallengeCompleted: true }));
    expect(result.title).toBe("Piątek, 2 października");
    expect(result.lines).toEqual(["12 min ćwiczeń", "2 lekcje", "Wyzwanie dnia zrobione"]);
  });

  it("says so when nothing was done and handles Polish plurals", () => {
    expect(describeDay("2026-10-03", undefined).lines).toEqual(["Tego dnia nie było ćwiczeń."]);
    expect(describeDay("2026-10-03", day({ lessonIdsCompleted: ["a"] })).lines).toEqual(["1 lekcja"]);
    expect(describeDay("2026-10-03", day({ lessonIdsCompleted: new Array(5).fill("x") })).lines).toEqual(["5 lekcji"]);
  });
});
