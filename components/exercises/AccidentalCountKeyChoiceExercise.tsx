import { Text, View } from "react-native";
import { OptionButton } from "@/components/exercises/OptionButton";
import { formatAccidentalCount, getKeySignatureAccidentalNames } from "@/lib/music/keys";
import { t } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { GeneratedExercise } from "@/types/exercises";

interface AccidentalCountKeyChoiceExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "accidental-count-key-choice" }>;
  selectedOptionId: string | null;
  onSelect: (optionId: string) => void;
  checked: boolean;
  locale: Locale;
}

/** "Labirynt Tonacji" level 3 — the reverse of key-signature-staff-choice:
 * given an accidental count in words (e.g. "dokładnie 4 bemole"), find the
 * matching key pair. Ported from the web app's
 * AccidentalCountKeyChoiceExercise.tsx. */
export function AccidentalCountKeyChoiceExercise({ exercise, selectedOptionId, onSelect, checked, locale }: AccidentalCountKeyChoiceExerciseProps) {
  const count = formatAccidentalCount(exercise.accidentalCount, exercise.accidentalType, locale);
  const names = getKeySignatureAccidentalNames(exercise.correctFifths, locale).join(", ");
  const hintKey =
    exercise.accidentalType === "sharps"
      ? "lesson.accidentalCountKeyChoiceHintSharps"
      : exercise.accidentalCount === 1
        ? "lesson.accidentalCountKeyChoiceHintFlatsOne"
        : "lesson.accidentalCountKeyChoiceHintFlatsMany";

  return (
    <View style={{ alignItems: "center", gap: theme.spacing(2) }}>
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
        {t("lesson.accidentalCountKeyChoicePrompt", locale, { count })}
      </Text>
      <Text style={{ color: theme.colors.muted, fontSize: theme.fontSize.body * 0.85, fontStyle: "italic", textAlign: "center" }}>
        {t(hintKey, locale, { count, names })}
      </Text>
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
