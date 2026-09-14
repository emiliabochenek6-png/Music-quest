import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useSubscription } from "@/context/SubscriptionContext";
import { applyActivity } from "@/lib/gamification/activity";
import type { ActivityDelta } from "@/lib/gamification/activity";
import { deriveHearts, loseHeart as deductHeart } from "@/lib/gamification/hearts";
import type { HeartsInfo } from "@/lib/gamification/hearts";
import { getRankForXp, getRankName } from "@/lib/gamification/rank";
import { readJson, STORAGE_KEYS, writeJson } from "@/lib/storage";
import { INITIAL_GAMIFICATION_STATE } from "@/types/gamification";
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
  /** Best-of — only overwrites a lesson's stored rating if `stars` beats
   * whatever's already there, so a worse retry never downgrades it. */
  recordLessonStars: (lessonId: string, stars: 1 | 2 | 3) => void;
  recordActivity: (dateISO: string, delta: ActivityDelta) => void;
  setDailyChallenge: (daily: DailyChallengeState | null) => void;
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
  const [state, setState] = useState<GamificationState>(INITIAL_GAMIFICATION_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingRankUp, setPendingRankUp] = useState<PendingRankUp | null>(null);

  useEffect(() => {
    let cancelled = false;
    readJson<GamificationState>(STORAGE_KEYS.gamification).then((stored) => {
      if (cancelled) return;
      if (stored) setState(stored);
      setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

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
      const next: GamificationState = { ...prev, ...applyActivity(prev, dateISO, delta) };
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
        recordLessonStars,
        recordActivity,
        setDailyChallenge,
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
