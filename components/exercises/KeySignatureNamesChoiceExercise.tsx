import { Text, View } from "react-native";
import { OptionButton } from "@/components/exercises/OptionButton";
import { getKeyAtFifths, getKeyDisplayName } from "@/lib/music/keys";
import { t } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { GeneratedExercise } from "@/types/exercises";

interface KeySignatureNamesChoiceExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "key-signature-names-choice" }>;
  selectedOptionId: string | null;
  onSelect: (optionId: string) => void;
  checked: boolean;
  locale: Locale;
}

/** "Labirynt Tonacji" level 3 — names the SPECIFIC accidentals (e.g. "fis,
 * cis") a given major/minor key pair uses, not just the count. Ported from
 * the web app's KeySignatureNamesChoiceExercise.tsx. */
export function KeySignatureNamesChoiceExercise({ exercise, selectedOptionId, onSelect, checked, locale }: KeySignatureNamesChoiceExerciseProps) {
  const key = getKeyAtFifths(exercise.fifths);
  const major = getKeyDisplayName(key.majorTonic, "major", locale);
  const minor = getKeyDisplayName(key.minorTonic, "minor", locale);
  const hint = t(exercise.fifths > 0 ? "lesson.keySignatureNamesChoiceHintSharps" : "lesson.keySignatureNamesChoiceHintFlats", locale);

  return (
    <View style={{ alignItems: "center", gap: theme.spacing(2) }}>
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
        {t("lesson.keySignatureNamesChoicePrompt", locale, { major, minor })}
      </Text>
      <Text style={{ color: theme.colors.muted, fontSize: theme.fontSize.body * 0.85, fontStyle: "italic", textAlign: "center" }}>{hint}</Text>
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
