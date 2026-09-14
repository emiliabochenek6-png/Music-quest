import { Text, View } from "react-native";
import { NoteValueIcon } from "@/components/exercises/NoteValueIcon";
import { OptionButton } from "@/components/exercises/OptionButton";
import { t, type TranslationKey } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { GeneratedExercise, RhythmNoteValue } from "@/types/exercises";

interface RhythmMathChoiceExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "rhythm-math-choice" }>;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  checked: boolean;
  locale: Locale;
}

const NOTE_VALUE_LABEL_KEY: Record<RhythmNoteValue, TranslationKey> = {
  whole: "lesson.noteValueWhole",
  half: "lesson.noteValueHalf",
  quarter: "lesson.noteValueQuarter",
  dottedQuarter: "lesson.noteValueDottedQuarter",
  dottedHalf: "lesson.noteValueDottedHalf",
  eighth: "lesson.noteValueEighth",
  dottedEighth: "lesson.noteValueDottedEighth",
  sixteenth: "lesson.noteValueSixteenth",
  eighthTriplet: "lesson.noteValueEighthTriplet",
};

/** "Gaj Grupowania" level 3's "rhythm math" — pick which combination of
 * note values sums to exactly one full measure (4 beats); correctness is
 * computed at generation time (see generate.ts), never authored directly.
 * Ported from the web app's RhythmMathChoiceExercise.tsx. */
export function RhythmMathChoiceExercise({ exercise, selectedIndex, onSelect, checked, locale }: RhythmMathChoiceExerciseProps) {
  return (
    <View style={{ alignItems: "center", gap: theme.spacing(3), width: "100%" }}>
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
        {t("lesson.rhythmMathPrompt", locale)}
      </Text>
      <View style={{ width: "100%", maxWidth: 360, gap: theme.spacing(1.5) }}>
        {exercise.combinations.map((combination, index) => (
          <OptionButton
            key={index}
            label={combination.map((value) => t(NOTE_VALUE_LABEL_KEY[value], locale)).join(" + ")}
            selected={selectedIndex === index}
            correct={checked && exercise.correctCombinationIndex === index}
            incorrect={checked && selectedIndex === index && exercise.correctCombinationIndex !== index}
            disabled={checked}
            onPress={() => onSelect(index)}
          >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: theme.spacing(1.5) }}>
              {combination.map((value, valueIndex) => (
                <NoteValueIcon key={valueIndex} value={value} />
              ))}
            </View>
          </OptionButton>
        ))}
      </View>
    </View>
  );
}
