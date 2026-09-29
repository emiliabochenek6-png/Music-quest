import { Text, View } from "react-native";
import { DarkButton } from "@/components/exercises/DarkButton";
import { IntervalOptionPicker } from "@/components/exercises/IntervalOptionPicker";
import { playChordSequence } from "@/lib/audio/player";
import { parseScientific } from "@/lib/music/notes";
import { t } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { AnswerInput, GeneratedExercise } from "@/types/exercises";

interface TriadQualitySequenceChoiceExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "triad-quality-sequence-choice" }>;
  answer: Extract<AnswerInput, { type: "triad-quality-sequence-choice" }> | null;
  onAnswerChange: (answer: AnswerInput) => void;
  checked: boolean;
  locale: Locale;
}

/**
 * "Zatoka Trójdźwięków" — the triad world's own interval-sequence-choice:
 * `sequenceLength` (2 or 3) fresh triads play back to back, each one
 * still a normal simultaneous chord (playChordSequence — the same
 * playChord-per-item shape Pasmo Interwałów's own harmonic sequence mode
 * uses), only the POSITIONS themselves are staggered in time. The player
 * names EVERY triad's quality, one small option picker per position —
 * IntervalOptionPicker is reused as-is (it only needs a
 * MultipleChoiceOption[] and doesn't care what the options represent).
 */
export function TriadQualitySequenceChoiceExercise({ exercise, answer, onAnswerChange, checked, locale }: TriadQualitySequenceChoiceExerciseProps) {
  const selectedOptionIds = answer?.selectedOptionIds ?? exercise.triads.map(() => null);

  function playAll() {
    playChordSequence(exercise.triads.map((triad) => triad.map((note) => parseScientific(note))));
  }

  function selectAt(position: number, optionId: string) {
    const next = [...selectedOptionIds];
    next[position] = optionId;
    onAnswerChange({ type: "triad-quality-sequence-choice", selectedOptionIds: next });
  }

  return (
    <View style={{ alignItems: "center", gap: theme.spacing(3), width: "100%" }}>
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
        {t("lesson.triadQualitySequenceChoicePrompt", locale, { count: exercise.triads.length })}
      </Text>

      <View style={{ alignItems: "center", gap: theme.spacing(1) }}>
        <DarkButton label="🔊" onPress={playAll} variant="secondary" size={72} fontSize={32} />
        <Text style={{ color: theme.colors.muted, fontSize: theme.fontSize.body * 0.8 }}>
          {t("lesson.triadQualitySequenceChoicePlayAllHint", locale)}
        </Text>
      </View>

      {exercise.triads.map((_, position) => (
        <View key={position} style={{ width: "100%", gap: theme.spacing(1) }}>
          <Text style={{ fontSize: theme.fontSize.body, fontWeight: "800", color: theme.colors.primary }}>{position + 1}.</Text>
          <IntervalOptionPicker
            options={exercise.optionsPerPosition[position]}
            selectedOptionId={selectedOptionIds[position]}
            correctOptionId={exercise.correctOptionIds[position]}
            checked={checked}
            onSelect={(optionId) => selectAt(position, optionId)}
          />
        </View>
      ))}
    </View>
  );
}
