import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCloudSync } from "@/lib/sync/useCloudSync";
import { mergeProgressState } from "@/lib/sync/mergeState";
import { readJson, writeJson } from "@/lib/storage";
import type { ProgressState } from "@/types/content";

const WORLDS_STORAGE_KEY = "master-quest.progress";
const LESSONS_STORAGE_KEY = "master-quest.progress.lessons";

interface ProgressContextValue {
  progress: ProgressState;
  isLoading: boolean;
  markWorldCompleted: (worldId: string) => void;
  markLessonCompleted: (lessonId: string) => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

/** JSON can't represent a Set (JSON.stringify silently drops its
 * contents) — useCloudSync's own serialize/deserialize hooks convert to
 * and from plain arrays right at the Supabase boundary, so every OTHER
 * piece of this provider keeps working with real Sets throughout,
 * exactly as before cloud sync existed. */
function serializeForCloud(state: ProgressState) {
  return { completedWorldIds: Array.from(state.completedWorldIds), completedLessonIds: Array.from(state.completedLessonIds) };
}
function deserializeFromCloud(value: unknown): ProgressState {
  const raw = value as { completedWorldIds?: string[]; completedLessonIds?: string[] } | null;
  return {
    completedWorldIds: new Set(raw?.completedWorldIds ?? []),
    completedLessonIds: new Set(raw?.completedLessonIds ?? []),
  };
}

/** Local-first progress tracking — completed world AND lesson ids. Held
 * as ONE `ProgressState` object (rather than two separate `useState`
 * calls, an earlier version of this provider's own shape) specifically
 * so useCloudSync below has a single value to merge/replace atomically —
 * see that hook's own doc. Still persisted on-device as two separate
 * AsyncStorage keys (unchanged from before cloud sync existed, so an
 * existing install's saved progress keeps reading back correctly).
 *
 * Cloud sync (see lib/sync/useCloudSync.ts's own doc) is entirely
 * OPT-IN and additive: logged out (see AuthContext — most players, most
 * of the time), this provider behaves EXACTLY as it always has, pure
 * local AsyncStorage, no network calls at all. Signing in (from
 * Settings — see ARCHITECTURE.md section 6, open question #2, now
 * answered: optional, not required to use the app) layers a Supabase
 * mirror on top without changing this provider's own public shape, so
 * no screen reading `useProgress()` needed to change either. */
export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressState>({ completedWorldIds: new Set(), completedLessonIds: new Set() });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([readJson<string[]>(WORLDS_STORAGE_KEY), readJson<string[]>(LESSONS_STORAGE_KEY)]).then(
      ([storedWorlds, storedLessons]) => {
        if (cancelled) return;
        setProgress((prev) => ({
          completedWorldIds: storedWorlds ? new Set(storedWorlds) : prev.completedWorldIds,
          completedLessonIds: storedLessons ? new Set(storedLessons) : prev.completedLessonIds,
        }));
        setIsLoading(false);
      }
    );
    return () => {
      cancelled = true;
    };
  }, []);

  useCloudSync({
    userId: user?.id ?? null,
    column: "progress",
    localState: progress,
    setLocalState: setProgress,
    merge: mergeProgressState,
    serialize: serializeForCloud,
    deserialize: deserializeFromCloud,
  });

  function persist(next: ProgressState) {
    void writeJson(WORLDS_STORAGE_KEY, Array.from(next.completedWorldIds));
    void writeJson(LESSONS_STORAGE_KEY, Array.from(next.completedLessonIds));
  }

  function markWorldCompleted(worldId: string) {
    setProgress((prev) => {
      if (prev.completedWorldIds.has(worldId)) return prev;
      const next: ProgressState = { ...prev, completedWorldIds: new Set(prev.completedWorldIds).add(worldId) };
      persist(next);
      return next;
    });
  }

  function markLessonCompleted(lessonId: string) {
    setProgress((prev) => {
      if (prev.completedLessonIds.has(lessonId)) return prev;
      const next: ProgressState = { ...prev, completedLessonIds: new Set(prev.completedLessonIds).add(lessonId) };
      persist(next);
      return next;
    });
  }

  return (
    <ProgressContext.Provider value={{ progress, isLoading, markWorldCompleted, markLessonCompleted }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextValue {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
}
