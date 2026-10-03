import { sanitizeShop } from "@/lib/shop/catalog";
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
  /** Per-day counters the daily missions read (see lib/gamification/
   * dailyMissions.ts). Optional: a day saved before missions got
   * variety simply has none, which reads as all zeros. */
  stats?: DayStats;
}

/** What was done on one day, split by mode so a "play-mode" mission and a
 * "plan" mission can each count only their own. Every field is a running
 * total for the day; a missing field means 0. */
export interface DayStats {
  /** Lessons finished in "Tryb nauki" (opened from the study plan). */
  planLessons?: number;
  /** Lessons finished in "Tryb zabawy" (opened from the world map). */
  funLessons?: number;
  /** Spaced-repetition reviews finished. */
  reviews?: number;
  /** Correct answers in "Tryb nauki" lessons and reviews. */
  planCorrect?: number;
  /** Correct answers in "Tryb zabawy" lessons. */
  funCorrect?: number;
  /** Lessons finished with 3 stars, in the plan / in the game. */
  planStars3?: number;
  funStars3?: number;
  /** Lessons finished with no mistake at all, in the plan / in the game. */
  planPerfect?: number;
  funPerfect?: number;
  /** Boss lessons finished (game mode). */
  bosses?: number;
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
  /** The spendable soft currency — see lib/gamification/powerups.ts's
   * own doc. Deliberately separate from `xp`: xp stays a pure skill/rank
   * measure that only ever goes up, nutki is meant to be earned AND
   * spent. Never purchasable with real money (see that same doc). */
  nutki: number;
  /** How many missed-day passes are banked — consumed automatically by
   * lib/gamification/activity.ts's own nextStreakDays the next time a
   * gap would otherwise reset the streak to 1, one freeze per missed
   * day. Bought with nutki (app/(main)/power-ups.tsx), never
   * applied manually — there's no "use" action, only "own one or not"
   * at the moment a gap actually happens. */
  streakFreezes: number;
  /** Per-world "Zapoznaj się" toggle — see app/(main)/world/[worldId].tsx's
   * own toggle row. Missing entry (the common case) means enabled, same
   * as every player has today: the recap panels
   * (ExerciseIntroRecap/PianoKeyboardRecap/LessonIntroRecap) show during
   * that world's lessons. Explicitly `false` hides them and doubles the
   * nutki earned in that world (app/(main)/lesson/[lessonId].tsx's own
   * NUTKI_MULTIPLIER_WHEN_INTRO_DISABLED) — the trade a player opts into
   * once they no longer need the training wheels for that world. */
  introModeEnabledByWorld: Record<string, boolean>;
  /** Sklep Solfka: ids of bought items (lib/shop/catalog.ts) and what Solfek wears now, one item per slot. */
  shopOwned: string[];
  shopEquipped: Partial<Record<"okulary" | "szyja" | "efekt" | "tlo", string>>;
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
  nutki: 0,
  streakFreezes: 0,
  introModeEnabledByWorld: {},
  shopOwned: [],
  shopEquipped: {},
};

function finiteOr(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

/** Reconciles a value loaded from storage (AsyncStorage or the Supabase
 * cloud mirror) against INITIAL_GAMIFICATION_STATE — a blob saved by an
 * older version of the app, before a field like `nutki`/`streakFreezes`
 * existed, is missing that key entirely, so `{ ...stored }` alone would
 * leave it `undefined`. The FIRST arithmetic op on an undefined number
 * (e.g. addNutki's `prev.nutki + amount`) then produces NaN, which
 * happily round-trips through more state updates and UI labels
 * (`String(NaN)` renders as the literal text "NaN") without ever
 * crashing anything — so it has to be caught here, at the one place
 * every stored/remote snapshot passes through before becoming real
 * state, rather than patched at each call site. `null`/`undefined`
 * input (nothing stored yet) returns the defaults outright. */
function shopFields(stored: Partial<GamificationState>): Pick<GamificationState, "shopOwned" | "shopEquipped"> {
  const { owned, equipped } = sanitizeShop(stored.shopOwned, stored.shopEquipped);
  return { shopOwned: owned, shopEquipped: equipped };
}

export function sanitizeGamificationState(stored: Partial<GamificationState> | null | undefined): GamificationState {
  if (!stored) return INITIAL_GAMIFICATION_STATE;
  return {
    ...INITIAL_GAMIFICATION_STATE,
    ...stored,
    xp: finiteOr(stored.xp, 0),
    hearts: finiteOr(stored.hearts, MAX_HEARTS),
    streakDays: finiteOr(stored.streakDays, 0),
    nutki: finiteOr(stored.nutki, 0),
    streakFreezes: finiteOr(stored.streakFreezes, 0),
    ...shopFields(stored),
  };
}
