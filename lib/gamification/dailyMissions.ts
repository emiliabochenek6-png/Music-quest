import type { TodayStatus } from "@/lib/plan/today";
import type { DayActivity } from "@/types/gamification";

/** One glanceable "today's mission" row — the Misje tab's own equivalent
 * of the calendar's per-day summary (CalendarActivityView), just
 * FORWARD-looking ("here's today's target") instead of a historical
 * record. Every mission here derives purely from data the app already
 * tracks per day (see DayActivity) — lesson completions, minutes
 * practiced, and the day's own daily-challenge flag — so this reads as a
 * checklist over existing activity, not a second reward system: nothing
 * here awards XP on its own, `xpReward` only LABELS a reward the
 * underlying action already grants elsewhere (a lesson's own per-answer
 * XP, the daily challenge's own bonus — see
 * app/(main)/daily-challenge.tsx's own XP_DAILY_CHALLENGE_BONUS). */
export interface DailyMissionProgress {
  id: "lesson" | "challenge" | "minutes" | "plan" | "review";
  icon: string;
  label: string;
  current: number;
  target: number;
  completed: boolean;
  /** Only set when the reward is a single known number — a lesson's own
   * XP varies with how many questions it has, so that mission is left
   * unlabeled rather than showing a number that isn't actually accurate. */
  xpReward?: number;
}

const EMPTY_DAY: DayActivity = { minutesSpent: 0, lessonIdsCompleted: [], dailyChallengeCompleted: false };

/** How many practice minutes today's third mission asks for — matches
 * neither a lesson's own typical length nor the daily challenge's (both
 * shorter), so finishing either one alone usually isn't quite enough on
 * its own; genuinely reflects "you spent a little real time today",
 * separate from having completed any one specific thing. */
const MINUTES_TARGET = 10;

/** Derives today's three missions from one day's own DayActivity (see
 * CalendarActivityView/GamificationContext's own activityLog) plus
 * whether the STANDALONE daily-challenge exercise itself is done —
 * that flag lives on GamificationState.dailyChallenge (today's own
 * record), not on DayActivity, since a day's activity log only ever
 * gets `dailyChallengeCompleted` written onto it at the exact same
 * moment (see daily-challenge.tsx's own handleCheck) — passed
 * separately here only so this function stays a pure, easily-tested
 * mapping over plain data rather than needing to know which of two
 * equivalent flags to trust. `challengeXpReward` is the caller's own
 * XP_DAILY_CHALLENGE_BONUS, passed in rather than duplicated here as a
 * second magic number that could drift from the one actually awarded. */
export function computeDailyMissions(
  day: DayActivity | undefined,
  challengeCompletedToday: boolean,
  challengeXpReward: number,
  planStatus?: TodayStatus
): DailyMissionProgress[] {
  const activity = day ?? EMPTY_DAY;
  const lessonsToday = activity.lessonIdsCompleted.length;
  const minutesToday = activity.minutesSpent;

  // Study-plan missions (see lib/plan): today's planned lessons and the
  // spaced-repetition reviews that are due — only when the plan has some
  // for today, so a player without a plan sees the same three missions as ever.
  const planMissions: DailyMissionProgress[] = [];
  if (planStatus && planStatus.lessons.length > 0) {
    const done = planStatus.lessons.filter((item) => item.done).length;
    planMissions.push({
      id: "plan",
      icon: "🗓",
      label: planStatus.lessons.length === 1 ? "Plan: przerób zaplanowaną lekcję" : `Plan: przerób ${planStatus.lessons.length} zaplanowane lekcje`,
      current: done,
      target: planStatus.lessons.length,
      completed: done >= planStatus.lessons.length,
    });
  }
  if (planStatus && planStatus.reviews.length > 0) {
    const done = planStatus.reviews.filter((item) => item.done).length;
    planMissions.push({
      id: "review",
      icon: "🔁",
      label: planStatus.reviews.length === 1 ? "Powtórka: 1 lekcja" : `Powtórka: ${planStatus.reviews.length} lekcje`,
      current: done,
      target: planStatus.reviews.length,
      completed: done >= planStatus.reviews.length,
    });
  }

  return [
    ...planMissions,
    {
      id: "lesson",
      icon: "📘",
      label: "Ukończ 1 lekcję",
      current: Math.min(lessonsToday, 1),
      target: 1,
      completed: lessonsToday >= 1,
    },
    {
      id: "challenge",
      icon: "🎯",
      label: "Wykonaj wyzwanie dnia",
      current: challengeCompletedToday ? 1 : 0,
      target: 1,
      completed: challengeCompletedToday,
      xpReward: challengeXpReward,
    },
    {
      id: "minutes",
      icon: "⏱",
      label: `Ćwicz ${MINUTES_TARGET} minut`,
      current: Math.min(minutesToday, MINUTES_TARGET),
      target: MINUTES_TARGET,
      completed: minutesToday >= MINUTES_TARGET,
    },
  ];
}
