import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { WORLDS } from "@/data/worlds";
import { getWorldContent } from "@/data/lessons";
import { useProgress } from "@/context/ProgressContext";
import { todayISODate } from "@/lib/gamification/activity";
import { getLessonInfo } from "@/lib/plan/lessonIndex";
import { buildPath } from "@/lib/plan/personalPath";
import type { PlacementLevel } from "@/lib/plan/placement";
import { pickTodayLessons } from "@/lib/plan/schedule";
import { afterReview, backfillReviewLog, dueReviewIds, newReviewEntry } from "@/lib/plan/spacedRepetition";
import type { ReviewEntry } from "@/lib/plan/spacedRepetition";
import type { TodayPlan } from "@/lib/plan/today";
import { readJson, STORAGE_KEYS, writeJson } from "@/lib/storage";

/** Reviews asked per day at most — a few minutes of recap, not a second lesson. */
export const MAX_REVIEWS_PER_DAY = 3;
export const DEFAULT_MINUTES_PER_DAY = 15;

export interface PlanState {
  /** "unset" until the player picks: test-based path ("personal") or the
   * original full path ("original"). */
  mode: "unset" | "original" | "personal";
  minutesPerDay: number;
  startISO: string | null;
  /** The placement test's result per world (0 do nauki, 1 częściowo, 2 opanowane); null for "original". */
  levels: Record<string, PlacementLevel> | null;
  placementTakenISO: string | null;
  /** The study path — lesson ids in the order to study them. */
  pathLessonIds: string[];
  reviewLog: Record<string, ReviewEntry>;
  today: TodayPlan | null;
}

const DEFAULT_PLAN: PlanState = {
  mode: "unset",
  minutesPerDay: DEFAULT_MINUTES_PER_DAY,
  startISO: null,
  levels: null,
  placementTakenISO: null,
  pathLessonIds: [],
  reviewLog: {},
  today: null,
};

interface PlanContextValue {
  plan: PlanState;
  isLoading: boolean;
  /** "Chcę zacząć od początku": every lesson, in curriculum order. */
  chooseOriginal: (minutesPerDay?: number) => void;
  /** Builds the personal path from a finished placement test. */
  applyPlacement: (levels: Record<string, PlacementLevel>, minutesPerDay?: number) => void;
  setMinutesPerDay: (minutes: number) => void;
  /** Call when a lesson is finished: starts its spaced-repetition clock. */
  onLessonCompleted: (lessonId: string) => void;
  /** Call when a review round of `lessonId` ends, with its share of correct answers (0-1). */
  onReviewFinished: (lessonId: string, fraction: number) => void;
}

const PlanContext = createContext<PlanContextValue | null>(null);

function buildTodaySnapshot(plan: PlanState, completed: ReadonlySet<string>, todayISO: string): TodayPlan {
  const path = plan.pathLessonIds.map((lessonId) => ({ lessonId, minutes: getLessonInfo(lessonId)?.minutes ?? 8 }));
  return {
    dateISO: todayISO,
    lessonIds: pickTodayLessons(path, (id) => completed.has(id), plan.minutesPerDay),
    reviewIds: dueReviewIds(plan.reviewLog, todayISO, MAX_REVIEWS_PER_DAY),
  };
}

/** The study plan's local-first state (placement result, path, spaced-
 * repetition log, today's snapshot) — persisted on this device only for
 * now (unlike progress/gamification it is not yet mirrored to Supabase;
 * see plany/2026-10-02-test-poziomujacy-i-plan.md). Sits inside
 * ProgressProvider because today's snapshot and the review backfill read
 * which lessons are already completed. */
export function PlanProvider({ children }: { children: ReactNode }) {
  const { progress, isLoading: isProgressLoading } = useProgress();
  const [plan, setPlan] = useState<PlanState>(DEFAULT_PLAN);
  const [isLoading, setIsLoading] = useState(true);
  const todayISO = todayISODate();

  useEffect(() => {
    let cancelled = false;
    readJson<Partial<PlanState>>(STORAGE_KEYS.plan)
      .then((stored) => {
        if (cancelled) return;
        if (stored) setPlan({ ...DEFAULT_PLAN, ...stored });
        setIsLoading(false);
      })
      .catch(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function persist(next: PlanState) {
    setPlan(next);
    void writeJson(STORAGE_KEYS.plan, next).catch(() => {
      // Not persisted this time — the plan still works for this session.
    });
  }

  // A new day (or a freshly created plan) → take today's snapshot. Also
  // gives every lesson finished before the plan existed its first review.
  useEffect(() => {
    if (isLoading || isProgressLoading || plan.mode === "unset") return;
    const needsBackfill = Array.from(progress.completedLessonIds).some((id) => !plan.reviewLog[id]);
    const needsSnapshot = plan.today?.dateISO !== todayISO;
    if (!needsBackfill && !needsSnapshot) return;
    const reviewLog = needsBackfill ? backfillReviewLog(plan.reviewLog, progress.completedLessonIds, todayISO) : plan.reviewLog;
    const base: PlanState = { ...plan, reviewLog };
    persist({ ...base, today: needsSnapshot ? buildTodaySnapshot(base, progress.completedLessonIds, todayISO) : plan.today });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isProgressLoading, plan.mode, plan.today?.dateISO, plan.minutesPerDay, plan.pathLessonIds, todayISO, progress.completedLessonIds.size]);

  const value = useMemo<PlanContextValue>(() => {
    function startPlan(mode: "original" | "personal", levels: Record<string, PlacementLevel> | null, minutesPerDay: number) {
      const path = buildPath(WORLDS, getWorldContent, levels).map((entry) => entry.lessonId);
      const base: PlanState = {
        ...plan,
        mode,
        minutesPerDay,
        startISO: todayISODate(),
        levels,
        placementTakenISO: mode === "personal" ? todayISODate() : plan.placementTakenISO,
        pathLessonIds: path,
        today: null,
      };
      persist({ ...base, today: buildTodaySnapshot(base, progress.completedLessonIds, todayISODate()) });
    }
    return {
      plan,
      isLoading,
      chooseOriginal: (minutesPerDay = plan.minutesPerDay) => startPlan("original", null, minutesPerDay),
      applyPlacement: (levels, minutesPerDay = plan.minutesPerDay) => startPlan("personal", levels, minutesPerDay),
      setMinutesPerDay: (minutes) => {
        const base: PlanState = { ...plan, minutesPerDay: minutes };
        persist({ ...base, today: plan.mode === "unset" ? null : buildTodaySnapshot(base, progress.completedLessonIds, todayISODate()) });
      },
      onLessonCompleted: (lessonId) => {
        setPlan((prev) => {
          if (prev.reviewLog[lessonId]) return prev;
          const next = { ...prev, reviewLog: { ...prev.reviewLog, [lessonId]: newReviewEntry(todayISODate()) } };
          void writeJson(STORAGE_KEYS.plan, next).catch(() => {});
          return next;
        });
      },
      onReviewFinished: (lessonId, fraction) => {
        setPlan((prev) => {
          const entry = prev.reviewLog[lessonId] ?? newReviewEntry(todayISODate());
          const next = { ...prev, reviewLog: { ...prev.reviewLog, [lessonId]: afterReview(entry, todayISODate(), fraction) } };
          void writeJson(STORAGE_KEYS.plan, next).catch(() => {});
          return next;
        });
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, isLoading, progress.completedLessonIds]);

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export function usePlan(): PlanContextValue {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error("usePlan must be used within a PlanProvider");
  }
  return context;
}
