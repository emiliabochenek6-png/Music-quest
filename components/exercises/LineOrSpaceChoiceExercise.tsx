import { View, Text } from "react-native";
import { OptionButton } from "@/components/exercises/OptionButton";
import { StaffNotation } from "@/components/exercises/StaffNotation";
import { t } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { GeneratedExercise } from "@/types/exercises";

interface LineOrSpaceChoiceExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "line-or-space-choice" }>;
  selectedAnswer: "line" | "space" | null;
  onSelect: (answer: "line" | "space") => void;
  checked: boolean;
  locale: Locale;
}

/** "Ta nuta jest na linii czy w polu?" — ported from the web app's
 * LineOrSpaceChoiceExercise.tsx. */
export function LineOrSpaceChoiceExercise({ exercise, selectedAnswer, onSelect, checked, locale }: LineOrSpaceChoiceExerciseProps) {
  return (
    <View style={{ alignItems: "center", gap: theme.spacing(3) }}>
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
        {t("lesson.lineOrSpacePrompt", locale)}
      </Text>
      <StaffNotation note={exercise.targetNote} />
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: theme.spacing(2) }}>
        <OptionButton
          label={t("lesson.lineLabel", locale)}
          selected={selectedAnswer === "line"}
          correct={checked && exercise.correctAnswer === "line"}
          incorrect={checked && selectedAnswer === "line" && exercise.correctAnswer !== "line"}
          disabled={checked}
          onPress={() => onSelect("line")}
        />
        <OptionButton
          label={t("lesson.spaceLabel", locale)}
          selected={selectedAnswer === "space"}
          correct={checked && exercise.correctAnswer === "space"}
          incorrect={checked && selectedAnswer === "space" && exercise.correctAnswer !== "space"}
          disabled={checked}
          onPress={() => onSelect("space")}
        />
      </View>
    </View>
  );
}
