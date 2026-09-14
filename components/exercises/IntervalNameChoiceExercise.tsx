import { Text, View } from "react-native";
import { DarkButton } from "@/components/exercises/DarkButton";
import { IntervalStaffNotation } from "@/components/exercises/IntervalStaffNotation";
import { OptionButton } from "@/components/exercises/OptionButton";
import { playInterval } from "@/lib/audio/player";
import { parseScientific } from "@/lib/music/notes";
import { t } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { GeneratedExercise } from "@/types/exercises";

interface IntervalNameChoiceExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "interval-name-choice" }>;
  selectedOptionId: string | null;
  onSelect: (optionId: string) => void;
  checked: boolean;
  locale: Locale;
}

/**
 * "Pasmo Interwałów" — two notes shown on a staff (IntervalStaffNotation)
 * and, via the speaker button, audible as a melodic interval (playInterval).
 * The player names the interval from a multiple-choice pool — same
 * OptionButton/correctOptionId shape as multiple-choice-notation, no new
 * scoring logic needed. When exercise.hideNotation is set, the staff is
 * swapped for a plain "listen only" label — used partway through a level
 * once the visual shape is established, so the player has to rely on
 * hearing alone. Ported from the web app's IntervalNameChoiceExercise.tsx.
 */
export function IntervalNameChoiceExercise({ exercise, selectedOptionId, onSelect, checked, locale }: IntervalNameChoiceExerciseProps) {
  function play() {
    const [a, b] = exercise.notes;
    playInterval([parseScientific(a), parseScientific(b)]);
  }

  return (
    <View style={{ alignItems: "center", gap: theme.spacing(3) }}>
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
        {t(exercise.hideNotation ? "lesson.intervalNameChoiceListenOnlyPrompt" : "lesson.intervalNameChoicePrompt", locale)}
      </Text>

      {exercise.hideNotation ? (
        <Text style={{ color: theme.colors.primary, fontSize: theme.fontSize.body * 0.85, fontWeight: "800", letterSpacing: 1, textTransform: "uppercase" }}>
          {t("lesson.intervalNameChoiceListenOnlyLabel", locale)}
        </Text>
      ) : (
        <IntervalStaffNotation notes={exercise.notes} />
      )}

      <DarkButton label="🔊" onPress={play} variant="secondary" size={72} fontSize={32} />

      <View style={{ width: "100%", gap: theme.spacing(1.5) }}>
        {exercise.options.map((option) => (
          <OptionButton
            key={option.id}
            label={option.label}
            selected={selectedOptionId === option.id}
            correct={checked && option.id === exercise.correctOptionId}
            incorrect={checked && selectedOptionId === option.id && option.id !== exercise.correctOptionId}
            disabled={checked}
            onPress={() => onSelect(option.id)}
          />
        ))}
      </View>
    </View>
  );
}
