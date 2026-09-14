import { Text, View } from "react-native";
import { DarkButton } from "@/components/exercises/DarkButton";
import { OptionButton } from "@/components/exercises/OptionButton";
import { TriadStaffNotation } from "@/components/exercises/TriadStaffNotation";
import { playChord } from "@/lib/audio/player";
import { parseScientific } from "@/lib/music/notes";
import { t } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { GeneratedExercise } from "@/types/exercises";

interface DominantSeventhInversionChoiceExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "dominant-seventh-inversion-choice" }>;
  selectedOptionId: string | null;
  onSelect: (optionId: string) => void;
  checked: boolean;
  locale: Locale;
}

/**
 * "Cytadela Dominant" — the four-note, four-inversion counterpart of
 * Jaskinia Akordów's own triad-inversion-choice: a dominant seventh chord
 * shown on a staff (in whichever inversion this exercise rolled —
 * exercise.notes already comes pre-ordered bottom-to-top, see
 * lib/music/seventhChords.ts's own getSeventhChordInversionNotes) and,
 * via the speaker button, audible as a chord. Unlike triad-inversion-
 * choice there's no quality to name in the prompt — a dominant seventh is
 * always the same one quality, so the player only ever names WHICH of the
 * four postacie (postać zasadnicza / kwintsekstakord / tercekwartakord /
 * sekundakord) it's in. Same OptionButton/correctOptionId scoring shape,
 * no new scoring logic needed. When exercise.hideNotation is set, the
 * staff swaps for a plain "listen only" label, same ear-training
 * progression triad-inversion-choice's own already uses.
 */
export function DominantSeventhInversionChoiceExercise({
  exercise,
  selectedOptionId,
  onSelect,
  checked,
  locale,
}: DominantSeventhInversionChoiceExerciseProps) {
  function play() {
    playChord(exercise.notes.map((note) => parseScientific(note)));
  }

  return (
    <View style={{ alignItems: "center", gap: theme.spacing(3) }}>
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
        {t(exercise.hideNotation ? "lesson.seventhInversionChoiceListenOnlyPrompt" : "lesson.seventhInversionChoicePrompt", locale)}
      </Text>

      {exercise.hideNotation ? (
        <Text style={{ color: theme.colors.primary, fontSize: theme.fontSize.body * 0.85, fontWeight: "800", letterSpacing: 1, textTransform: "uppercase" }}>
          {t("lesson.seventhInversionChoiceListenOnlyLabel", locale)}
        </Text>
      ) : (
        <TriadStaffNotation notes={exercise.notes} />
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
