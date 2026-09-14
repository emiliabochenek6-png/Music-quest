import { View, Text } from "react-native";
import { IntervalStaffNotation } from "@/components/exercises/IntervalStaffNotation";
import { OptionButton } from "@/components/exercises/OptionButton";
import { t } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { GeneratedExercise, IntervalMotion } from "@/types/exercises";

interface IntervalDistanceChoiceExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "interval-distance-choice" }>;
  selectedMotion: IntervalMotion | null;
  onSelect: (motion: IntervalMotion) => void;
  checked: boolean;
  locale: Locale;
}

/** "Jaki to rodzaj ruchu między nutami?" — ported from the web app's
 * IntervalDistanceChoiceExercise.tsx. */
export function IntervalDistanceChoiceExercise({ exercise, selectedMotion, onSelect, checked, locale }: IntervalDistanceChoiceExerciseProps) {
  return (
    <View style={{ alignItems: "center", gap: theme.spacing(3) }}>
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
        {t("lesson.intervalDistancePrompt", locale)}
      </Text>
      <IntervalStaffNotation notes={exercise.notes} />
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: theme.spacing(2) }}>
        <OptionButton
          label={t("lesson.stepMotionLabel", locale)}
          selected={selectedMotion === "step"}
          correct={checked && exercise.correctMotion === "step"}
          incorrect={checked && selectedMotion === "step" && exercise.correctMotion !== "step"}
          disabled={checked}
          onPress={() => onSelect("step")}
        />
        <OptionButton
          label={t("lesson.leapMotionLabel", locale)}
          selected={selectedMotion === "leap"}
          correct={checked && exercise.correctMotion === "leap"}
          incorrect={checked && selectedMotion === "leap" && exercise.correctMotion !== "leap"}
          disabled={checked}
          onPress={() => onSelect("leap")}
        />
      </View>
    </View>
  );
}
