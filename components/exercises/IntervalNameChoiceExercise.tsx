import { Text, View } from "react-native";
import { DarkButton } from "@/components/exercises/DarkButton";
import { IntervalOptionPicker } from "@/components/exercises/IntervalOptionPicker";
import { IntervalStaffNotation } from "@/components/exercises/IntervalStaffNotation";
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

  // Option ids ARE the semitone count (see generateExercise's own
  // `correctOptionId: String(semitones)`) — sorting by that number puts
  // every option in genuine "smallest to largest interval" order, not an
  // alphabetical accident. Every level uses the same sorted, scrollable
  // IntervalOptionPicker "okienko" now, not just the full-range ones —
  // one consistent picker style regardless of how many options a given
  // level's own pool has.
  const orderedOptions = [...exercise.options].sort((a, b) => Number(a.id) - Number(b.id));

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

      <IntervalOptionPicker
        options={orderedOptions}
        selectedOptionId={selectedOptionId}
        correctOptionId={exercise.correctOptionId}
        checked={checked}
        onSelect={onSelect}
      />
    </View>
  );
}
