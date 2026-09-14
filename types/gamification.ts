import type { GeneratedExercise } from "@/types/exercises";

/** How many hearts a non-premium player can hold at once — see
 * lib/gamification/hearts.ts's own doc for the full regeneration
 * design. Premium subscribers ignore this entirely (unlimited). Only
 * spent during LESSON exercises — the daily challenge (app/(main)/
 * daily-challenge.tsx) deliberately never touches hearts at all, so a
 * wrong guess there costs nothing and just hands back a fresh retry. */
export const MAX_HEARTS = 15;

/** How long one heart takes to regenerate — see
 * lib/gamification/hearts.ts's own doc. */
export const HEART_REGEN_MS = 4 * 60 * 60 * 1000;

/** The minimum star rating (see `lessonStars` below) a lesson must reach
 * before its world counts as genuinely "done" for progression purposes —
 * see lib/progression/resolveNodeState.ts's own meetsStarRequirement,
 * the one consumer of this. Merely COMPLETING every lesson in a world
 * (the pre-existing `completedWorldIds` check) is no longer enough on
 * its own to unlock the next one; every lesson also has to have earned
 * at least this many stars. */
export const MIN_STARS_TO_ADVANCE_WORLD = 2;

/** One calendar day's worth of activity, keyed by its own "YYYY-MM-DD"
 * string in GamificationState.activityLog — the source data for the
 * side-menu calendar view (components/CalendarActivityView.tsx). */
export interface DayActivity {
  minutesSpent: number;
  lessonIdsCompleted: string[];
  dailyChallengeCompleted: boolean;
}

/** Today's daily-challenge exercise, generated once and then persisted
 * verbatim — see lib/dailyChallenge/pickDailyChallenge.ts's own doc for
 * why: revisiting the challenge screen later the SAME day must show the
 * exact same question, not a freshly re-rolled one, so `generated` is
 * the already-resolved GeneratedExercise, not just a reference to which
 * ExerciseDefinition it came from. */
export interface DailyChallengeState {
  dateISO: string;
  generated: GeneratedExercise;
  completed: boolean;
}

/** The whole Duolingo-style motivation layer's persisted state — one
 * JSON blob under a single AsyncStorage key (see
 * context/GamificationContext.tsx's own doc), the same "one context, one
 * key, several related fields" shape ProgressState/ProgressContext
 * already use for completed-world/lesson tracking. */
export interface GamificationState {
  xp: number;
  /** Last KNOWN heart count — see lib/gamification/hearts.ts's own
   * deriveHearts, which reconciles this against `lastHeartChangeAtISO`
   * and the current time on every read rather than storing a
   * continuously-ticking value. */
  hearts: number;
  lastHeartChangeAtISO: string | null;
  lastActiveDateISO: string | null;
  streakDays: number;
  /** Best-ever star rating (1-3) per lesson id — see
   * lib/gamification/stars.ts's own computeLessonStars. Absent entries
   * mean "never completed." */
  lessonStars: Record<string, 1 | 2 | 3>;
  activityLog: Record<string, DayActivity>;
  dailyChallenge: DailyChallengeState | null;
}

export const INITIAL_GAMIFICATION_STATE: GamificationState = {
  xp: 0,
  hearts: MAX_HEARTS,
  lastHeartChangeAtISO: null,
  lastActiveDateISO: null,
  streakDays: 0,
  lessonStars: {},
  activityLog: {},
  dailyChallenge: null,
};
