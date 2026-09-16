import { describe, expect, it } from "@jest/globals";
import { applyActivity, todayISODate } from "@/lib/gamification/activity";
import type { GamificationState } from "@/types/gamification";

type ActivitySlice = Pick<GamificationState, "lastActiveDateISO" | "streakDays" | "activityLog" | "streakFreezes">;

function emptyState(streakFreezes = 0): ActivitySlice {
  return { lastActiveDateISO: null, streakDays: 0, activityLog: {}, streakFreezes };
}

describe("todayISODate", () => {
  it("formats a timestamp as a local YYYY-MM-DD string", () => {
    // Noon UTC is unambiguous in every real-world timezone offset this
    // app ships to — avoids a flaky test near a local midnight boundary.
    const noonUTC = Date.parse("2026-03-05T12:00:00.000Z");
    expect(todayISODate(noonUTC)).toBe("2026-03-05");
  });
});

describe("applyActivity", () => {
  it("starts a streak at 1 on the very first ever activity", () => {
    const result = applyActivity(emptyState(), "2026-03-05", { minutesSpent: 5 });
    expect(result.streakDays).toBe(1);
    expect(result.lastActiveDateISO).toBe("2026-03-05");
  });

  it("leaves the streak unchanged when the SAME day logs more activity", () => {
    const first = applyActivity(emptyState(), "2026-03-05", { minutesSpent: 5 });
    const second = applyActivity(first, "2026-03-05", { minutesSpent: 3 });
    expect(second.streakDays).toBe(1);
    expect(second.activityLog["2026-03-05"].minutesSpent).toBe(8); // accumulated, not overwritten
  });

  it("increments the streak on the very next calendar day", () => {
    const day1 = applyActivity(emptyState(), "2026-03-05", { minutesSpent: 5 });
    const day2 = applyActivity(day1, "2026-03-06", { minutesSpent: 5 });
    expect(day2.streakDays).toBe(2);
  });

  it("resets the streak to 1 after a gap of 2+ days", () => {
    const day1 = applyActivity(emptyState(), "2026-03-05", { minutesSpent: 5 });
    const dayAfterGap = applyActivity(day1, "2026-03-08", { minutesSpent: 5 });
    expect(dayAfterGap.streakDays).toBe(1);
  });

  it("resets the streak after exactly one skipped day when no freeze is banked", () => {
    const day1 = applyActivity(emptyState(0), "2026-03-05", { minutesSpent: 5 });
    const afterOneMissedDay = applyActivity(day1, "2026-03-07", { minutesSpent: 5 });
    expect(afterOneMissedDay.streakDays).toBe(1);
  });

  it("spends a banked streak freeze to cover exactly one missed day, keeping the streak alive", () => {
    const day1 = applyActivity(emptyState(1), "2026-03-05", { minutesSpent: 5 });
    const afterOneMissedDay = applyActivity(day1, "2026-03-07", { minutesSpent: 5 });
    expect(afterOneMissedDay.streakDays).toBe(2);
    expect(afterOneMissedDay.streakFreezes).toBe(0);
  });

  it("still resets the streak when the gap is bigger than one day, even with a freeze banked", () => {
    const day1 = applyActivity(emptyState(3), "2026-03-05", { minutesSpent: 5 });
    const afterBigGap = applyActivity(day1, "2026-03-09", { minutesSpent: 5 });
    expect(afterBigGap.streakDays).toBe(1);
    expect(afterBigGap.streakFreezes).toBe(3); // untouched — a freeze only covers a 1-day gap
  });

  it("accumulates lesson ids completed that day without duplicating a repeat report", () => {
    const first = applyActivity(emptyState(), "2026-03-05", { lessonIdCompleted: "l1" });
    const second = applyActivity(first, "2026-03-05", { lessonIdCompleted: "l2" });
    const third = applyActivity(second, "2026-03-05", { lessonIdCompleted: "l1" }); // reported again
    expect(third.activityLog["2026-03-05"].lessonIdsCompleted).toEqual(["l1", "l2"]);
  });

  it("lets dailyChallengeCompleted go from false to true but never back", () => {
    const completed = applyActivity(emptyState(), "2026-03-05", { dailyChallengeCompleted: true });
    const again = applyActivity(completed, "2026-03-05", {});
    expect(again.activityLog["2026-03-05"].dailyChallengeCompleted).toBe(true);
  });

  it("leaves earlier days in activityLog untouched when a later day is recorded", () => {
    const day1 = applyActivity(emptyState(), "2026-03-05", { minutesSpent: 5 });
    const day2 = applyActivity(day1, "2026-03-06", { minutesSpent: 7 });
    expect(day2.activityLog["2026-03-05"].minutesSpent).toBe(5);
    expect(day2.activityLog["2026-03-06"].minutesSpent).toBe(7);
  });
});
