import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
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

/** Local-first progress tracking — completed world AND lesson ids,
 * persisted on device as two separate sets (see ProgressState's own doc
 * for why). A real deployment syncs this to a backend keyed by account
 * (see ARCHITECTURE.md section 6, open question #2) once login exists;
 * this provider's public shape is designed to stay the same when that
 * sync layer is added underneath it, so screens reading progress never
 * need to change. */
export function ProgressProvider({ children }: { children: ReactNode }) {
  const [completedWorldIds, setCompletedWorldIds] = useState<ReadonlySet<string>>(new Set());
  const [completedLessonIds, setCompletedLessonIds] = useState<ReadonlySet<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([readJson<string[]>(WORLDS_STORAGE_KEY), readJson<string[]>(LESSONS_STORAGE_KEY)]).then(
      ([storedWorlds, storedLessons]) => {
        if (cancelled) return;
        if (storedWorlds) setCompletedWorldIds(new Set(storedWorlds));
        if (storedLessons) setCompletedLessonIds(new Set(storedLessons));
        setIsLoading(false);
      }
    );
    return () => {
      cancelled = true;
    };
  }, []);

  function markWorldCompleted(worldId: string) {
    setCompletedWorldIds((prev) => {
      const next = new Set(prev);
      next.add(worldId);
      void writeJson(WORLDS_STORAGE_KEY, Array.from(next));
      return next;
    });
  }

  function markLessonCompleted(lessonId: string) {
    setCompletedLessonIds((prev) => {
      const next = new Set(prev);
      next.add(lessonId);
      void writeJson(LESSONS_STORAGE_KEY, Array.from(next));
      return next;
    });
  }

  return (
    <ProgressContext.Provider
      value={{ progress: { completedWorldIds, completedLessonIds }, isLoading, markWorldCompleted, markLessonCompleted }}
    >
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
