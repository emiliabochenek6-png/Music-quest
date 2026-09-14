import { Text, View } from "react-native";
import { DarkButton } from "@/components/exercises/DarkButton";
import { OptionButton } from "@/components/exercises/OptionButton";
import { TriadStaffNotation } from "@/components/exercises/TriadStaffNotation";
import { playChordSequence } from "@/lib/audio/player";
import { parseScientific } from "@/lib/music/notes";
import { getPrimaryTriadKeyName } from "@/lib/music/triads";
import { t } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { GeneratedExercise } from "@/types/exercises";

interface TriadRoleChoiceExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "triad-role-choice" }>;
  selectedOptionId: string | null;
  onSelect: (optionId: string) => void;
  checked: boolean;
  locale: Locale;
}

/** "Zatoka Trójdźwięków" level 4 — functional ear training. Unlike
 * triad-quality-choice (a chord's quality is audible on its own), a
 * chord's T/S/D FUNCTION only means something relative to an established
 * tonic, so the speaker button plays the tonic first and the target
 * chord second (playChordSequence), and only the target is drawn on the
 * staff (when not hideNotation) — the reference is heard, not seen.
 * Ported from the web app's TriadRoleChoiceExercise.tsx. */
export function TriadRoleChoiceExercise({ exercise, selectedOptionId, onSelect, checked, locale }: TriadRoleChoiceExerciseProps) {
  const key = getPrimaryTriadKeyName(exercise.fifths, locale);

  function play() {
    playChordSequence([
      exercise.referenceNotes.map((note) => parseScientific(note)),
      exercise.targetNotes.map((note) => parseScientific(note)),
    ]);
  }

  return (
    <View style={{ alignItems: "center", gap: theme.spacing(3) }}>
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
        {t(exercise.hideNotation ? "lesson.triadRoleChoiceListenOnlyPrompt" : "lesson.triadRoleChoicePrompt", locale, { key })}
      </Text>

      {exercise.hideNotation ? (
        <Text style={{ color: theme.colors.primary, fontSize: theme.fontSize.body * 0.85, fontWeight: "800", letterSpacing: 1, textTransform: "uppercase" }}>
          {t("lesson.triadRoleChoiceListenOnlyLabel", locale)}
        </Text>
      ) : (
        <TriadStaffNotation notes={exercise.targetNotes} />
      )}

      <DarkButton label="🔊" onPress={play} variant="secondary" size={90} fontSize={44} />

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
