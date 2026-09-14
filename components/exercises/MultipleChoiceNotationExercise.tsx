import { View, Text } from "react-native";
import { OptionButton } from "@/components/exercises/OptionButton";
import { StaffNotation } from "@/components/exercises/StaffNotation";
import { t } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { GeneratedExercise } from "@/types/exercises";

interface MultipleChoiceNotationExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "multiple-choice-notation" }>;
  selectedOptionId: string | null;
  onSelect: (optionId: string) => void;
  checked: boolean;
  locale: Locale;
}

/** "Jak się nazywa ta nuta?" — ported from the web app's
 * MultipleChoiceNotationExercise.tsx. */
export function MultipleChoiceNotationExercise({ exercise, selectedOptionId, onSelect, checked, locale }: MultipleChoiceNotationExerciseProps) {
  const promptKey = exercise.clef === "bass" ? "lesson.notationPromptBass" : "lesson.notationPrompt";

  return (
    <View style={{ alignItems: "center", gap: theme.spacing(3) }}>
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
        {t(promptKey, locale)}
      </Text>
      <StaffNotation note={exercise.targetNote} clef={exercise.clef} />
      <View style={{ width: "100%", flexDirection: "row", flexWrap: "wrap", gap: theme.spacing(1.5), justifyContent: "center" }}>
        {exercise.options.map((option) => (
          <View key={option.id} style={{ minWidth: 90 }}>
            <OptionButton
              label={option.label}
              selected={selectedOptionId === option.id}
              correct={checked && option.id === exercise.correctOptionId}
              incorrect={checked && selectedOptionId === option.id && option.id !== exercise.correctOptionId}
              disabled={checked}
              onPress={() => onSelect(option.id)}
            />
          </View>
        ))}
      </View>
    </View>
  );
}
