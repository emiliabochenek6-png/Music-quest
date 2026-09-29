import { Text, View } from "react-native";
import { DarkButton } from "@/components/exercises/DarkButton";
import { OptionButton } from "@/components/exercises/OptionButton";
import { TriadStaffNotation } from "@/components/exercises/TriadStaffNotation";
import { playArpeggiatedTriad, playChord } from "@/lib/audio/player";
import { parseScientific } from "@/lib/music/notes";
import { t } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { GeneratedExercise } from "@/types/exercises";

interface TriadQualityChoiceExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "triad-quality-choice" }>;
  selectedOptionId: string | null;
  onSelect: (optionId: string) => void;
  checked: boolean;
  locale: Locale;
}

/**
 * "Zatoka Trójdźwięków" — a fresh triad (root + quality) shown on a staff
 * and, via the speaker button, audible as a chord (playChord). The player
 * names the quality from a multiple-choice pool — same OptionButton/
 * correctOptionId shape as interval-name-choice, no new scoring logic
 * needed. When exercise.hideNotation is set, the staff is swapped for a
 * plain "listen only" label — same ear-training progression as Pasmo
 * Interwałów's own hideNotation. When exercise.arpeggiated is set, the
 * three notes play one after another (playArpeggiatedTriad, a "trójdźwięk
 * rozłożony") instead of together (playChord) — same idea as Pasmo
 * Interwałów's own `harmonic` flag on interval-name-choice, just this
 * world's default is the simultaneous mode instead. Ported from the web
 * app's TriadQualityChoiceExercise.tsx.
 */
export function TriadQualityChoiceExercise({ exercise, selectedOptionId, onSelect, checked, locale }: TriadQualityChoiceExerciseProps) {
  function play() {
    const notes = exercise.notes.map((note) => parseScientific(note));
    if (exercise.arpeggiated) {
      playArpeggiatedTriad(notes);
    } else {
      playChord(notes);
    }
  }

  return (
    <View style={{ alignItems: "center", gap: theme.spacing(3) }}>
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
        {t(exercise.hideNotation ? "lesson.triadQualityChoiceListenOnlyPrompt" : "lesson.triadQualityChoicePrompt", locale)}
      </Text>

      {exercise.hideNotation ? (
        <Text style={{ color: theme.colors.primary, fontSize: theme.fontSize.body * 0.85, fontWeight: "800", letterSpacing: 1, textTransform: "uppercase" }}>
          {t("lesson.triadQualityChoiceListenOnlyLabel", locale)}
        </Text>
      ) : (
        <TriadStaffNotation notes={exercise.notes} />
      )}

      {exercise.arpeggiated && (
        <Text style={{ color: theme.colors.primary, fontSize: theme.fontSize.body * 0.75, fontWeight: "800", letterSpacing: 1, textTransform: "uppercase" }}>
          {t("lesson.triadQualityChoiceArpeggiatedLabel", locale)}
        </Text>
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
