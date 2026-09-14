import { Pressable, Text, View } from "react-native";
import { ClefTraceBoard } from "@/components/exercises/ClefTraceBoard";
import { t } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { GeneratedExercise, TracePoint } from "@/types/exercises";

interface ClefTraceExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "clef-trace" }>;
  points: TracePoint[];
  onCommit: (points: TracePoint[]) => void;
  checked: boolean;
  isCorrect: boolean | null;
  locale: Locale;
  /** Passed straight through to ClefTraceBoard — see that component's own
   * doc for why the hosting screen needs this. */
  onDrawingActiveChange?: (active: boolean) => void;
}

/** Ported from the web app's ClefTraceExercise.tsx — wraps ClefTraceBoard
 * with the prompt text and the "clear drawing" reset button. */
export function ClefTraceExercise({ exercise, points, onCommit, checked, isCorrect, locale, onDrawingActiveChange }: ClefTraceExerciseProps) {
  return (
    <View style={{ alignItems: "center", gap: theme.spacing(2) }}>
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
        {t(exercise.clef === "bass" ? "lesson.clefTracePromptBass" : "lesson.clefTracePromptTreble", locale)}
      </Text>
      <ClefTraceBoard
        committedPoints={points}
        onCommit={onCommit}
        disabled={checked}
        isCorrect={checked ? isCorrect : null}
        clef={exercise.clef}
        locale={locale}
        onDrawingActiveChange={onDrawingActiveChange}
      />
      {!checked && points.length > 1 && (
        <Pressable onPress={() => onCommit([])}>
          <Text style={{ color: theme.colors.muted, fontSize: theme.fontSize.body * 0.85, textDecorationLine: "underline" }}>
            {t("lesson.clearDrawing", locale)}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
