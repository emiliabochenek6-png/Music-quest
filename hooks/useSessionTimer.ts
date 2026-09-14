import { useRef } from "react";

/** How long the current session has been running, for the activity
 * calendar's own "minutes spent" figure (see lib/gamification/
 * activity.ts's own DayActivity). Starts (or restarts) counting from
 * `Date.now()` whenever `resetKey` changes — a lesson screen passes its
 * own `lessonId` so a fresh attempt (even of the same lesson, re-
 * entered) starts a fresh timer rather than accumulating across
 * attempts.
 *
 * Deliberately NOT AppState-aware: this counts real wall-clock time
 * from mount to whenever the caller reads it, including any time spent
 * with the app backgrounded mid-lesson. That's a real simplification
 * (a phone call mid-lesson inflates the reported minutes) — accepted
 * for now rather than adding an AppState foreground/background listener
 * this app has never needed before, for what's ultimately just an
 * approximate "how much time did you spend practicing" summary, not a
 * precise timesheet. */
export function useSessionTimer(resetKey: string): { getElapsedMinutes: () => number } {
  const startRef = useRef(Date.now());
  const resetKeyRef = useRef(resetKey);

  if (resetKeyRef.current !== resetKey) {
    resetKeyRef.current = resetKey;
    startRef.current = Date.now();
  }

  return {
    getElapsedMinutes: () => Math.max(0, Math.round((Date.now() - startRef.current) / 60000)),
  };
}
