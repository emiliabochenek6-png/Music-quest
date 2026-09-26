import { createContext, useContext } from "react";
import type { ReactNode } from "react";

const ExerciseAccentContext = createContext<string | null>(null);

/** Per-world override for the exercise screen's own "primary" color —
 * DarkButton's solid fill and OptionButton's selected-state highlight
 * both fall back to this INSTEAD of their usual fixed theme.colors.primary
 * whenever a screen wraps its content in this Provider (so far: Wioska
 * Nut's own lesson screen, matching its purple map/background reskin — see
 * app/(main)/lesson/[lessonId].tsx's own doc). No Provider above a screen
 * (every other world today) leaves both components on the normal theme
 * color, unchanged. A plain context rather than threading a prop through
 * every intermediate component (LessonTheoryIntro, LessonIntro, each of
 * the ~20 exercise-type components that use OptionButton, ...) — none of
 * those need to know this override exists at all. */
export function ExerciseAccentProvider({ color, children }: { color: string | null; children: ReactNode }) {
  return <ExerciseAccentContext.Provider value={color}>{children}</ExerciseAccentContext.Provider>;
}

export function useExerciseAccentColor(): string | null {
  return useContext(ExerciseAccentContext);
}
