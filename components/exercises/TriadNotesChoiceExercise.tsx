import { Text, View } from "react-native";
import { OptionButton } from "@/components/exercises/OptionButton";
import { getPrimaryTriadKeyName, getTriadRoleName } from "@/lib/music/triads";
import { t, type TranslationKey } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { GeneratedExercise, TriadRole } from "@/types/exercises";

interface TriadNotesChoiceExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "triad-notes-choice" }>;
  selectedOptionId: string | null;
  onSelect: (optionId: string) => void;
  checked: boolean;
  locale: Locale;
}

/** A generic "tonika = I + tercja + kwinta" hint doesn't actually help work
 * out S or D — their OWN rule (built on IV / V) is different — so each
 * role gets its own hint text instead of the one-size-fits-all version
 * this exercise originally had. */
const HINT_KEY_BY_ROLE: Record<TriadRole, TranslationKey> = {
  T: "lesson.triadNotesChoiceHint",
  S: "lesson.triadNotesChoiceHintS",
  D: "lesson.triadNotesChoiceHintD",
};

/** "Zatoka Trójdźwięków" level 3 — names which three notes make up one of
 * a major key's primary triads (T/S/D), answered via text options (the
 * note names themselves), the same OptionButton shape as every other
 * text-answer exercise type. No audio, no staff notation — purely a text
 * prompt. Ported from the web app's TriadNotesChoiceExercise.tsx. */
export function TriadNotesChoiceExercise({ exercise, selectedOptionId, onSelect, checked, locale }: TriadNotesChoiceExerciseProps) {
  const key = getPrimaryTriadKeyName(exercise.fifths, locale);
  const roleName = getTriadRoleName(exercise.role, locale);

  return (
    <View style={{ alignItems: "center", gap: theme.spacing(2) }}>
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
        {t("lesson.triadNotesChoicePrompt", locale, { role: exercise.role, roleName, key })}
      </Text>
      <Text style={{ color: theme.colors.muted, fontSize: theme.fontSize.body * 0.85, fontStyle: "italic", textAlign: "center" }}>
        {t(HINT_KEY_BY_ROLE[exercise.role], locale)}
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
