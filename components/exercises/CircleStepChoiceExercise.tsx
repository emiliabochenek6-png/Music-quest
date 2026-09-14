import { Text, View } from "react-native";
import { CircleOfFifthsWheel } from "@/components/exercises/CircleOfFifthsWheel";
import { getKeyAtFifths, getKeyDisplayName } from "@/lib/music/keys";
import { t } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { GeneratedExercise } from "@/types/exercises";

interface CircleStepChoiceExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "circle-step-choice" }>;
  selectedFifths: number | null;
  onSelect: (fifths: number) => void;
  checked: boolean;
  locale: Locale;
}

/** "Labirynt Tonacji" levels 1-2 (and part of the final review) — one step
 * clockwise (add a sharp) or counterclockwise (add a flat) around the
 * circle of fifths from a given starting key. The wheel itself IS the
 * answer surface: tapping a sector answers with its fifths value. Ported
 * from the web app's CircleStepChoiceExercise.tsx. */
export function CircleStepChoiceExercise({ exercise, selectedFifths, onSelect, checked, locale }: CircleStepChoiceExerciseProps) {
  const startKey = getKeyAtFifths(exercise.startFifths);
  const startKeyName = getKeyDisplayName(startKey.majorTonic, "major", locale);
  const promptKey = exercise.direction === "clockwise" ? "lesson.circleStepChoicePromptClockwise" : "lesson.circleStepChoicePromptCounterclockwise";

  return (
    <View style={{ alignItems: "center", gap: theme.spacing(2) }}>
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
        {t(promptKey, locale, { key: startKeyName })}
      </Text>
      <CircleOfFifthsWheel
        selectedFifths={selectedFifths}
        onSelect={onSelect}
        disabled={checked}
        checked={checked}
        correctFifths={exercise.correctFifths}
        highlightFifths={[exercise.startFifths]}
        locale={locale}
      />
    </View>
  );
}
