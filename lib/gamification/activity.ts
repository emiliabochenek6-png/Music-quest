import type { DayActivity, GamificationState } from "@/types/gamification";

/** Today's date as a stable, timezone-LOCAL "YYYY-MM-DD" key — the same
 * key `GamificationState.activityLog`/`lastActiveDateISO` use
 * throughout this module. Deliberately built from the local calendar
 * fields (getFullYear/getMonth/getDate), not `toISOString()` (which is
 * UTC and would flip to "tomorrow" or "yesterday" for players west/east
 * of UTC around midnight) — a streak/calendar has to track the player's
 * OWN day, not UTC's. */
export function todayISODate(nowMs: number = Date.now()): string {
  const date = new Date(nowMs);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** New activity to fold into one calendar day — every field is
 * additive/best-of against whatever's already logged for that day (see
 * applyActivity's own doc), so a caller only ever needs to describe
 * what's NEW, never the day's running total. */
export interface ActivityDelta {
  minutesSpent?: number;
  lessonIdCompleted?: string;
  dailyChallengeCompleted?: boolean;
}

const EMPTY_DAY: DayActivity = { minutesSpent: 0, lessonIdsCompleted: [], dailyChallengeCompleted: false };

const MS_PER_DAY = 24 * 60 * 60 * 1000;

interface StreakResult {
  streakDays: number;
  /** Whether a banked streak freeze (GamificationState.streakFreezes)
   * was just used to cover this gap — the caller (applyActivity) is the
   * one that actually decrements the count; this function stays pure
   * and only reports whether it WOULD spend one. */
  freezeConsumed: boolean;
}

/** Streak continuation/reset/start logic, isolated from the activityLog
 * merge below so it's easy to reason about (and test) on its own: same
 * day as last time → unchanged; exactly the next calendar day → +1;
 * never active before → starts at 1; EXACTLY one full day skipped (a
 * gap of 2) with a banked freeze available → still +1, freeze consumed
 * — the whole point of a streak freeze is covering precisely one missed
 * day, never more; anything else (a bigger gap, or no freeze left) →
 * resets to 1, today being the first day of a fresh streak. Comparing
 * two "YYYY-MM-DD" strings via Date.parse (ISO 8601, defaults to UTC
 * midnight for a date-only string) is safe here even though
 * todayISODate itself is timezone-LOCAL — both sides get the same
 * treatment, and only the difference in days between them is ever used,
 * which is invariant under a shared misinterpretation. */
function nextStreakDays(lastActiveDateISO: string | null, currentStreakDays: number, todayISO: string, streakFreezesAvailable: number): StreakResult {
  if (lastActiveDateISO === todayISO) return { streakDays: currentStreakDays, freezeConsumed: false };
  if (lastActiveDateISO === null) return { streakDays: 1, freezeConsumed: false };
  const dayDiff = Math.round((Date.parse(todayISO) - Date.parse(lastActiveDateISO)) / MS_PER_DAY);
  if (dayDiff === 1) return { streakDays: currentStreakDays + 1, freezeConsumed: false };
  if (dayDiff === 2 && streakFreezesAvailable > 0) return { streakDays: currentStreakDays + 1, freezeConsumed: true };
  return { streakDays: 1, freezeConsumed: false };
}

/** Folds one day's new activity into GamificationState's own
 * `activityLog`/`streakDays`/`lastActiveDateISO` — the single place
 * both the streak counter and the calendar view's per-day data get
 * updated, so they can never drift out of sync with each other. Pure:
 * returns the three fields that changed (spread the rest of
 * GamificationState back in at the call site, same as every other
 * gamification reducer in this module). Idempotent-ish for repeat calls
 * the same day: minutesSpent accumulates (call once per session with
 * that session's own elapsed minutes), lessonIdCompleted is only added
 * once even if the same lesson is somehow reported twice, and
 * dailyChallengeCompleted only ever goes false → true, never back. */
export function applyActivity(
  state: Pick<GamificationState, "lastActiveDateISO" | "streakDays" | "activityLog" | "streakFreezes">,
  dateISO: string,
  delta: ActivityDelta
): Pick<GamificationState, "lastActiveDateISO" | "streakDays" | "activityLog" | "streakFreezes"> {
  const existing = state.activityLog[dateISO] ?? EMPTY_DAY;
  const lessonIdsCompleted =
    delta.lessonIdCompleted && !existing.lessonIdsCompleted.includes(delta.lessonIdCompleted)
      ? [...existing.lessonIdsCompleted, delta.lessonIdCompleted]
      : existing.lessonIdsCompleted;
  const merged: DayActivity = {
    minutesSpent: existing.minutesSpent + (delta.minutesSpent ?? 0),
    lessonIdsCompleted,
    dailyChallengeCompleted: existing.dailyChallengeCompleted || (delta.dailyChallengeCompleted ?? false),
  };
  const { streakDays, freezeConsumed } = nextStreakDays(state.lastActiveDateISO, state.streakDays, dateISO, state.streakFreezes);
  return {
    lastActiveDateISO: dateISO,
    streakDays,
    activityLog: { ...state.activityLog, [dateISO]: merged },
    streakFreezes: freezeConsumed ? state.streakFreezes - 1 : state.streakFreezes,
  };
}
