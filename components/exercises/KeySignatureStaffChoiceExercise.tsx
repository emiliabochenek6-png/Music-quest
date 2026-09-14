import { Text, View } from "react-native";
import { KeySignatureStaffIcon } from "@/components/exercises/KeySignatureStaffIcon";
import { OptionButton } from "@/components/exercises/OptionButton";
import { t, type TranslationKey } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { GeneratedExercise } from "@/types/exercises";

interface KeySignatureStaffChoiceExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "key-signature-staff-choice" }>;
  selectedOptionId: string | null;
  onSelect: (optionId: string) => void;
  checked: boolean;
  locale: Locale;
}

function hintKeyFor(fifths: number): TranslationKey {
  if (fifths === 0) return "lesson.keySignatureStaffChoiceHintNone";
  if (fifths > 0) return "lesson.keySignatureStaffChoiceHintSharps";
  return fifths === -1 ? "lesson.keySignatureStaffChoiceHintFlatsOne" : "lesson.keySignatureStaffChoiceHintFlatsMany";
}

/** "Labirynt Tonacji" level 3 — read a key signature straight off a staff
 * (KeySignatureStaffIcon) and name the major/minor key pair it belongs to.
 * Ported from the web app's KeySignatureStaffChoiceExercise.tsx. */
export function KeySignatureStaffChoiceExercise({ exercise, selectedOptionId, onSelect, checked, locale }: KeySignatureStaffChoiceExerciseProps) {
  return (
    <View style={{ alignItems: "center", gap: theme.spacing(2) }}>
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
        {t("lesson.keySignatureStaffChoicePrompt", locale)}
      </Text>
      <View style={{ width: 220 }}>
        <KeySignatureStaffIcon fifths={exercise.fifths} />
      </View>
      <Text style={{ color: theme.colors.muted, fontSize: theme.fontSize.body * 0.85, fontStyle: "italic", textAlign: "center" }}>
        {t(hintKeyFor(exercise.fifths), locale)}
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
