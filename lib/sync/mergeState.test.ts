import { describe, expect, it } from "@jest/globals";
import { mergeGamificationState, mergeProgressState } from "@/lib/sync/mergeState";
import { HEART_REGEN_MS, INITIAL_GAMIFICATION_STATE } from "@/types/gamification";
import type { GamificationState } from "@/types/gamification";
import type { ProgressState } from "@/types/content";

function progress(worlds: string[], lessons: string[]): ProgressState {
  return { completedWorldIds: new Set(worlds), completedLessonIds: new Set(lessons) };
}

function gamification(overrides: Partial<GamificationState>): GamificationState {
  return { ...INITIAL_GAMIFICATION_STATE, ...overrides };
}

const NOW = Date.parse("2026-03-10T12:00:00.000Z");

describe("mergeProgressState", () => {
  it("unions completed worlds and lessons from both sides", () => {
    const local = progress(["w1"], ["l1", "l2"]);
    const remote = progress(["w2"], ["l2", "l3"]);
    const merged = mergeProgressState(local, remote);
    expect(merged.completedWorldIds).toEqual(new Set(["w1", "w2"]));
    expect(merged.completedLessonIds).toEqual(new Set(["l1", "l2", "l3"]));
  });

  it("is a no-op when one side is empty", () => {
    const local = progress(["w1"], ["l1"]);
    const merged = mergeProgressState(local, progress([], []));
    expect(merged.completedWorldIds).toEqual(new Set(["w1"]));
    expect(merged.completedLessonIds).toEqual(new Set(["l1"]));
  });
});

describe("mergeGamificationState", () => {
  it("takes the best (highest) star rating per lesson, from either side", () => {
    const local = gamification({ lessonStars: { l1: 1, l2: 3 } });
    const remote = gamification({ lessonStars: { l1: 3, l3: 2 } });
    const merged = mergeGamificationState(local, remote, NOW);
    expect(merged.lessonStars).toEqual({ l1: 3, l2: 3, l3: 2 });
  });

  it("takes the MAX of the two xp totals, not the sum", () => {
    const merged = mergeGamificationState(gamification({ xp: 300 }), gamification({ xp: 120 }), NOW);
    expect(merged.xp).toBe(300);
  });

  it("takes the MAX of nutki and streakFreezes too, not the sum", () => {
    const local = gamification({ nutki: 40, streakFreezes: 2 });
    const remote = gamification({ nutki: 12, streakFreezes: 3 });
    const merged = mergeGamificationState(local, remote, NOW);
    expect(merged.nutki).toBe(40);
    expect(merged.streakFreezes).toBe(3);
  });

  it("sums minutesSpent and unions lessons for a day BOTH sides logged activity on", () => {
    const local = gamification({
      activityLog: { "2026-03-09": { minutesSpent: 10, lessonIdsCompleted: ["l1"], dailyChallengeCompleted: false } },
    });
    const remote = gamification({
      activityLog: { "2026-03-09": { minutesSpent: 15, lessonIdsCompleted: ["l2"], dailyChallengeCompleted: true } },
    });
    const merged = mergeGamificationState(local, remote, NOW);
    expect(merged.activityLog["2026-03-09"]).toEqual({
      minutesSpent: 25,
      lessonIdsCompleted: ["l1", "l2"],
      dailyChallengeCompleted: true,
    });
  });

  it("keeps days that only exist on one side untouched", () => {
    const local = gamification({
      activityLog: { "2026-03-08": { minutesSpent: 5, lessonIdsCompleted: [], dailyChallengeCompleted: false } },
    });
    const remote = gamification({
      activityLog: { "2026-03-09": { minutesSpent: 7, lessonIdsCompleted: [], dailyChallengeCompleted: false } },
    });
    const merged = mergeGamificationState(local, remote, NOW);
    expect(merged.activityLog["2026-03-08"].minutesSpent).toBe(5);
    expect(merged.activityLog["2026-03-09"].minutesSpent).toBe(7);
  });

  it("takes the streak from whichever side was active more RECENTLY", () => {
    const local = gamification({ streakDays: 2, lastActiveDateISO: "2026-03-08" });
    const remote = gamification({ streakDays: 9, lastActiveDateISO: "2026-03-10" });
    const merged = mergeGamificationState(local, remote, NOW);
    expect(merged.streakDays).toBe(9);
    expect(merged.lastActiveDateISO).toBe("2026-03-10");
  });

  it("keeps hearts+clock as a PAIR from whichever side currently derives to more hearts", () => {
    // Local: 2 hearts, changed 1 hour ago (barely regenerating).
    const local = gamification({ hearts: 2, lastHeartChangeAtISO: new Date(NOW - 60 * 60 * 1000).toISOString() });
    // Remote: 1 heart, but changed long enough ago to have regenerated to 3.
    const remote = gamification({ hearts: 1, lastHeartChangeAtISO: new Date(NOW - HEART_REGEN_MS * 3).toISOString() });
    const merged = mergeGamificationState(local, remote, NOW);
    expect(merged.hearts).toBe(1); // remote's own RAW value, not the derived one
    expect(merged.lastHeartChangeAtISO).toBe(remote.lastHeartChangeAtISO);
  });

  it("prefers the newer dailyChallenge, or the completed one on a tied date", () => {
    const olderChallenge = { dateISO: "2026-03-09", generated: {} as never, completed: true };
    const newerChallenge = { dateISO: "2026-03-10", generated: {} as never, completed: false };
    const merged = mergeGamificationState(gamification({ dailyChallenge: olderChallenge }), gamification({ dailyChallenge: newerChallenge }), NOW);
    expect(merged.dailyChallenge).toEqual(newerChallenge);

    const sameDateIncomplete = { dateISO: "2026-03-10", generated: {} as never, completed: false };
    const sameDateComplete = { dateISO: "2026-03-10", generated: {} as never, completed: true };
    const mergedSameDay = mergeGamificationState(
      gamification({ dailyChallenge: sameDateIncomplete }),
      gamification({ dailyChallenge: sameDateComplete }),
      NOW
    );
    expect(mergedSameDay.dailyChallenge?.completed).toBe(true);
  });

  it("handles both sides having no dailyChallenge at all", () => {
    const merged = mergeGamificationState(gamification({}), gamification({}), NOW);
    expect(merged.dailyChallenge).toBeNull();
  });

  it("keeps a world's intro mode disabled once EITHER side turned it off", () => {
    const local = gamification({ introModeEnabledByWorld: { "wioska-nut": false, "miasto-rytmu": true } });
    const remote = gamification({ introModeEnabledByWorld: { "wioska-nut": true, "miasto-rytmu": true, "przystan-taktow": false } });
    const merged = mergeGamificationState(local, remote, NOW);
    expect(merged.introModeEnabledByWorld).toEqual({ "wioska-nut": false, "miasto-rytmu": true, "przystan-taktow": false });
  });
});
