import { Text, View } from "react-native";
import { DarkButton } from "@/components/exercises/DarkButton";
import { IntervalOptionPicker } from "@/components/exercises/IntervalOptionPicker";
import { playChordSequence } from "@/lib/audio/player";
import { parseScientific } from "@/lib/music/notes";
import { t } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { AnswerInput, GeneratedExercise } from "@/types/exercises";

interface TriadInversionSequenceChoiceExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "triad-inversion-sequence-choice" }>;
  answer: Extract<AnswerInput, { type: "triad-inversion-sequence-choice" }> | null;
  onAnswerChange: (answer: AnswerInput) => void;
  checked: boolean;
  locale: Locale;
}

/**
 * "Jaskinia Akordów" — triad-inversion-choice's own interval-sequence-
 * choice sibling (see TriadQualitySequenceChoiceExercise's own doc for
 * the shared shape): `sequenceLength` (2 or 3) fresh triads play back to
 * back, each one still a normal simultaneous chord (playChordSequence),
 * only the POSITIONS themselves are staggered. The player names EVERY
 * triad's INVERSION this time (not quality) — one IntervalOptionPicker
 * "okienko" per position, reused as-is.
 */
export function TriadInversionSequenceChoiceExercise({ exercise, answer, onAnswerChange, checked, locale }: TriadInversionSequenceChoiceExerciseProps) {
  const selectedOptionIds = answer?.selectedOptionIds ?? exercise.triads.map(() => null);

  function playAll() {
    playChordSequence(exercise.triads.map((triad) => triad.map((note) => parseScientific(note))));
  }

  function selectAt(position: number, optionId: string) {
    const next = [...selectedOptionIds];
    next[position] = optionId;
    onAnswerChange({ type: "triad-inversion-sequence-choice", selectedOptionIds: next });
  }

  return (
    <View style={{ alignItems: "center", gap: theme.spacing(3), width: "100%" }}>
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
        {t("lesson.triadInversionSequenceChoicePrompt", locale, { count: exercise.triads.length })}
      </Text>

      <View style={{ alignItems: "center", gap: theme.spacing(1) }}>
        <DarkButton label="🔊" onPress={playAll} variant="secondary" size={72} fontSize={32} />
        <Text style={{ color: theme.colors.muted, fontSize: theme.fontSize.body * 0.8 }}>
          {t("lesson.triadInversionSequenceChoicePlayAllHint", locale)}
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
