import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSubscription } from "@/context/SubscriptionContext";
import { applyActivity } from "@/lib/gamification/activity";
import type { ActivityDelta } from "@/lib/gamification/activity";
import { deriveHearts, gainHearts as addHearts, loseHeart as deductHeart } from "@/lib/gamification/hearts";
import type { HeartsInfo } from "@/lib/gamification/hearts";
import { NUTKI_REWARDS, POWER_UP_COSTS } from "@/lib/gamification/powerups";
import { getRankForXp, getRankName } from "@/lib/gamification/rank";
import { mergeGamificationState } from "@/lib/sync/mergeState";
import { useCloudSync } from "@/lib/sync/useCloudSync";
import { readJson, STORAGE_KEYS, writeJson } from "@/lib/storage";
import { INITIAL_GAMIFICATION_STATE, MAX_HEARTS, sanitizeGamificationState } from "@/types/gamification";
import type { DailyChallengeState, GamificationState } from "@/types/gamification";

/** A rank-up worth celebrating — see components/RankUpCelebration.tsx's
 * own doc, the one consumer of this. Deliberately NOT part of
 * GamificationState/persisted: it's a one-shot "show this popup" signal
 * for whichever screen happens to be mounted when awardXp crosses a
 * rank threshold, not a fact about the player worth remembering across
 * app restarts. */
export interface PendingRankUp {
  rank: number;
  name: string;
}

interface GamificationContextValue {
  state: GamificationState;
  isLoading: boolean;
  /** A function, not a memoized value — hearts regenerate over real
   * time, so "current" hearts only means something at the moment this
   * is actually called (see lib/gamification/hearts.ts's own doc). A
   * caller that wants a live-updating countdown (e.g. OutOfHeartsModal)
   * should re-call this itself on its own interval, not expect the
   * context to tick on its behalf. */
  getHeartsInfo: () => HeartsInfo;
  pendingRankUp: PendingRankUp | null;
  clearPendingRankUp: () => void;
  awardXp: (amount: number) => void;
  /** No-op for a premium subscriber — see SubscriptionContext's own
   * status.isActive, checked here so no call site needs to guard this
   * itself. */
  loseHeart: () => void;
  /** Rewards `amount` hearts, capped at MAX_HEARTS — same premium no-op
   * as loseHeart (unlimited hearts already shown, nothing to add). */
  gainHearts: (amount: number) => void;
  /** Best-of — only overwrites a lesson's stored rating if `stars` beats
   * whatever's already there, so a worse retry never downgrades it. */
  recordLessonStars: (lessonId: string, stars: 1 | 2 | 3) => void;
  recordActivity: (dateISO: string, delta: ActivityDelta) => void;
  setDailyChallenge: (daily: DailyChallengeState | null) => void;
  /** Adds nutki directly — every award site (a perfect lesson, a
   * finished world, a correct daily-challenge answer) references
   * lib/gamification/powerups.ts's own NUTKI_REWARDS rather than a bare
   * number, so the economy's actual values stay in one place. The
   * weekly streak bonus is the one exception: it's awarded from inside
   * recordActivity itself (see that function's own doc), not by a call
   * site reaching for this. */
  addNutki: (amount: number) => void;
  /** Each buy* action does its own single balance-checked setState (see
   * this provider's own doc) rather than composing a generic
   * spendNutki — each of these is a complete, one-shot purchase, not a
   * spend that some OTHER effect gets layered onto after the fact.
   * Returns false (spending nothing) when the balance is too low, so
   * the calling screen can show "za mało nutek" instead of silently
   * doing nothing. */
  buyStreakFreeze: () => boolean;
  buyHeartRefill: () => boolean;
  /** Per-world "Zapoznaj się" toggle — see types/gamification.ts's own
   * introModeEnabledByWorld doc. */
  setIntroModeEnabled: (worldId: string, enabled: boolean) => void;
}

const GamificationContext = createContext<GamificationContextValue | null>(null);

/**
 * The Duolingo-style motivation layer — XP/ranga, serca, passa,
 * gwiazdki per lekcja, and today's daily-challenge state — as ONE
 * persisted blob under STORAGE_KEYS.gamification, the same "single
 * provider, load-on-mount, functional setState + fire-and-forget
 * writeJson" shape ProgressContext.tsx already establishes for
 * completed-world/lesson tracking. Every actual rule (heart
 * regeneration, rank thresholds, star grading, streak continuation) is
 * a pure function in lib/gamification/ — this provider is purely the
 * thin persistence/React wiring around them, so those rules stay
 * testable without mounting a provider or touching AsyncStorage.
 *
 * Reads useSubscription() for hearts' own premium-unlimited behavior —
 * must therefore be mounted INSIDE SubscriptionProvider (see
 * app/_layout.tsx's own provider-nesting doc).
 */
export function GamificationProvider({ children }: { children: ReactNode }) {
  const { status: subscription } = useSubscription();
  const { user } = useAuth();
  const [state, setState] = useState<GamificationState>(INITIAL_GAMIFICATION_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingRankUp, setPendingRankUp] = useState<PendingRankUp | null>(null);

  useEffect(() => {
    let cancelled = false;
    readJson<GamificationState>(STORAGE_KEYS.gamification).then((stored) => {
      if (cancelled) return;
      // sanitizeGamificationState fills in any field a pre-Nutki save
      // never had (see its own doc) — without this, an old blob missing
      // `nutki` loads as `undefined` and the first addNutki call turns it
      // into a persistent NaN.
      if (stored) setState(sanitizeGamificationState(stored));
      setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Opt-in cloud backup/restore — see lib/sync/useCloudSync.ts's own
  // doc. A complete no-op while `user` is null (logged out, the default
  // for most players) — every setter below keeps working exactly as
  // before, pure local AsyncStorage, whether or not this hook is even
  // doing anything.
  useCloudSync({
    userId: user?.id ?? null,
    column: "gamification",
    localState: state,
    setLocalState: setState,
    merge: mergeGamificationState,
  });

  function getHeartsInfo(): HeartsInfo {
    return deriveHearts(state, Date.now(), subscription.isActive);
  }

  function awardXp(amount: number) {
    // Read BEFORE the update to know whether this crossed a rank
    // threshold — `state.xp` here is this render's own committed value,
    // the same one the functional updater below independently adds
    // `amount` to via its own `prev.xp` (both agree as long as awardXp
    // is never called twice without a render between, true everywhere
    // it's actually used today).
    const prevRank = getRankForXp(state.xp).rank;
    const nextRank = getRankForXp(state.xp + amount).rank;
    setState((prev) => {
      const next: GamificationState = { ...prev, xp: prev.xp + amount };
      void writeJson(STORAGE_KEYS.gamification, next);
      return next;
    });
    if (nextRank > prevRank) {
      setPendingRankUp({ rank: nextRank, name: getRankName(nextRank) });
    }
  }

  function clearPendingRankUp() {
    setPendingRankUp(null);
  }

  function loseHeart() {
    if (subscription.isActive) return;
    setState((prev) => {
      const { hearts, lastHeartChangeAtISO } = deductHeart(prev, Date.now());
      const next: GamificationState = { ...prev, hearts, lastHeartChangeAtISO };
      void writeJson(STORAGE_KEYS.gamification, next);
      return next;
    });
  }

  function gainHearts(amount: number) {
    if (subscription.isActive) return;
    setState((prev) => {
      const { hearts, lastHeartChangeAtISO } = addHearts(prev, Date.now(), amount);
      const next: GamificationState = { ...prev, hearts, lastHeartChangeAtISO };
      void writeJson(STORAGE_KEYS.gamification, next);
      return next;
    });
  }

  function recordLessonStars(lessonId: string, stars: 1 | 2 | 3) {
    setState((prev) => {
      const existing = prev.lessonStars[lessonId];
      if (existing !== undefined && existing >= stars) return prev;
      const next: GamificationState = { ...prev, lessonStars: { ...prev.lessonStars, [lessonId]: stars } };
      void writeJson(STORAGE_KEYS.gamification, next);
      return next;
    });
  }

  function recordActivity(dateISO: string, delta: ActivityDelta) {
    setState((prev) => {
      const activityResult = applyActivity(prev, dateISO, delta);
      // Crossing a multiple of 7 (7, 14, 21, ...) — comparing
      // Math.floor(streakDays / 7) before/after rather than a separate
      // tracked flag, so this can never fall out of sync with the
      // streak itself. `> prev` guards the (same-day, no-op) case where
      // streakDays hasn't actually changed from staying at an exact
      // multiple of 7.
      const crossedWeekMilestone =
        activityResult.streakDays > prev.streakDays &&
        Math.floor(activityResult.streakDays / 7) > Math.floor(prev.streakDays / 7);
      const next: GamificationState = {
        ...prev,
        ...activityResult,
        nutki: prev.nutki + (crossedWeekMilestone ? NUTKI_REWARDS.streakWeekMilestone : 0),
      };
      void writeJson(STORAGE_KEYS.gamification, next);
      return next;
    });
  }

  function addNutki(amount: number) {
    setState((prev) => {
      const next: GamificationState = { ...prev, nutki: prev.nutki + amount };
      void writeJson(STORAGE_KEYS.gamification, next);
      return next;
    });
  }

  function buyStreakFreeze(): boolean {
    if (state.nutki < POWER_UP_COSTS.streakFreeze) return false;
    setState((prev) => {
      const next: GamificationState = {
        ...prev,
        nutki: prev.nutki - POWER_UP_COSTS.streakFreeze,
        streakFreezes: prev.streakFreezes + 1,
      };
      void writeJson(STORAGE_KEYS.gamification, next);
      return next;
    });
    return true;
  }

  function buyHeartRefill(): boolean {
    // Nothing to refill — already unlimited. Same no-op stance
    // loseHeart/gainHearts already take for a premium subscriber.
    if (subscription.isActive) return false;
    if (state.nutki < POWER_UP_COSTS.heartRefill) return false;
    setState((prev) => {
      const { hearts, lastHeartChangeAtISO } = addHearts(prev, Date.now(), MAX_HEARTS);
      const next: GamificationState = { ...prev, nutki: prev.nutki - POWER_UP_COSTS.heartRefill, hearts, lastHeartChangeAtISO };
      void writeJson(STORAGE_KEYS.gamification, next);
      return next;
    });
    return true;
  }

  function setIntroModeEnabled(worldId: string, enabled: boolean) {
    setState((prev) => {
      const next: GamificationState = { ...prev, introModeEnabledByWorld: { ...prev.introModeEnabledByWorld, [worldId]: enabled } };
      void writeJson(STORAGE_KEYS.gamification, next);
      return next;
    });
  }

  function setDailyChallenge(daily: DailyChallengeState | null) {
    setState((prev) => {
      const next: GamificationState = { ...prev, dailyChallenge: daily };
      void writeJson(STORAGE_KEYS.gamification, next);
      return next;
    });
  }

  return (
    <GamificationContext.Provider
      value={{
        state,
        isLoading,
        getHeartsInfo,
        pendingRankUp,
        clearPendingRankUp,
        awardXp,
        loseHeart,
        gainHearts,
        recordLessonStars,
        recordActivity,
        setDailyChallenge,
        addNutki,
        buyStreakFreeze,
        buyHeartRefill,
        setIntroModeEnabled,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification(): GamificationContextValue {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error("useGamification must be used within a GamificationProvider");
  }
  return context;
}
