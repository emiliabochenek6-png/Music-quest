import { describe, expect, it } from "@jest/globals";
import { computeDailyMissions } from "@/lib/gamification/dailyMissions";
import type { DayActivity } from "@/types/gamification";

const EMPTY_DAY: DayActivity = { minutesSpent: 0, lessonIdsCompleted: [], dailyChallengeCompleted: false };

describe("computeDailyMissions", () => {
  it("starts all three missions at zero progress on a day with no activity yet", () => {
    const missions = computeDailyMissions(undefined, false, 30);
    expect(missions).toHaveLength(3);
    expect(missions.every((mission) => !mission.completed)).toBe(true);
    expect(missions.find((mission) => mission.id === "lesson")?.current).toBe(0);
    expect(missions.find((mission) => mission.id === "minutes")?.current).toBe(0);
  });

  it("marks the lesson mission complete after just one lesson, even with more logged", () => {
    const day: DayActivity = { ...EMPTY_DAY, lessonIdsCompleted: ["wioska-nut-1", "wioska-nut-2"] };
    const mission = computeDailyMissions(day, false, 30).find((m) => m.id === "lesson");
    expect(mission?.completed).toBe(true);
    expect(mission?.current).toBe(1);
    expect(mission?.target).toBe(1);
  });

  it("reads the daily-challenge mission from the separate completed flag, not from DayActivity alone", () => {
    const missions = computeDailyMissions(EMPTY_DAY, true, 30);
    const mission = missions.find((m) => m.id === "challenge");
    expect(mission?.completed).toBe(true);
    expect(mission?.xpReward).toBe(30);
  });

  it("caps the minutes mission's current progress at its own target, never past it", () => {
    const day: DayActivity = { ...EMPTY_DAY, minutesSpent: 47 };
    const mission = computeDailyMissions(day, false, 30).find((m) => m.id === "minutes");
    expect(mission?.completed).toBe(true);
    expect(mission?.current).toBe(mission?.target);
  });

  it("leaves the lesson and minutes missions without an xpReward — neither has one accurate fixed number", () => {
    const missions = computeDailyMissions(EMPTY_DAY, false, 30);
    expect(missions.find((m) => m.id === "lesson")?.xpReward).toBeUndefined();
    expect(missions.find((m) => m.id === "minutes")?.xpReward).toBeUndefined();
  });
});
