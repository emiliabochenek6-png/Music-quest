import { Text, View } from "react-native";
import { CircleOfFifthsWheel } from "@/components/exercises/CircleOfFifthsWheel";
import { getKeyAtFifths, getKeyDisplayName } from "@/lib/music/keys";
import { t } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { GeneratedExercise } from "@/types/exercises";

interface RelativeKeyChoiceExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "relative-key-choice" }>;
  selectedFifths: number | null;
  onSelect: (fifths: number) => void;
  checked: boolean;
  locale: Locale;
}

/** "Labirynt Tonacji" level 3 — given a major (or minor) key, tap the wheel
 * sector for its relative minor (or major). The wheel is the answer
 * surface, with the PROMPTED mode's own labels hidden (`labelMode`) so the
 * player can't just read the pairing straight off the sector instead of
 * recalling it. Ported from the web app's RelativeKeyChoiceExercise.tsx. */
export function RelativeKeyChoiceExercise({ exercise, selectedFifths, onSelect, checked, locale }: RelativeKeyChoiceExerciseProps) {
  const promptKeyData = getKeyAtFifths(exercise.promptFifths);
  const promptTonic = exercise.promptMode === "major" ? promptKeyData.majorTonic : promptKeyData.minorTonic;
  const promptKeyName = getKeyDisplayName(promptTonic, exercise.promptMode, locale);
  const wheelLabelMode = exercise.promptMode === "major" ? "minorOnly" : "majorOnly";

  return (
    <View style={{ alignItems: "center", gap: theme.spacing(2) }}>
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
        {t("lesson.relativeKeyChoicePrompt", locale, { key: promptKeyName })}
      </Text>
      <CircleOfFifthsWheel
        selectedFifths={selectedFifths}
        onSelect={onSelect}
        disabled={checked}
        checked={checked}
        correctFifths={exercise.correctFifths}
        labelMode={wheelLabelMode}
        locale={locale}
      />
    </View>
  );
}
