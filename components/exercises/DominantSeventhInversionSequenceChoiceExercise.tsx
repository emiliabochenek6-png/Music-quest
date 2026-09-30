import { Text, View } from "react-native";
import { DarkButton } from "@/components/exercises/DarkButton";
import { IntervalOptionPicker } from "@/components/exercises/IntervalOptionPicker";
import { playChordSequence } from "@/lib/audio/player";
import { parseScientific } from "@/lib/music/notes";
import { t } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { AnswerInput, GeneratedExercise } from "@/types/exercises";

interface DominantSeventhInversionSequenceChoiceExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "dominant-seventh-inversion-sequence-choice" }>;
  answer: Extract<AnswerInput, { type: "dominant-seventh-inversion-sequence-choice" }> | null;
  onAnswerChange: (answer: AnswerInput) => void;
  checked: boolean;
  locale: Locale;
}

/**
 * "Cytadela Dominant" — dominant-seventh-inversion-choice's own triad-
 * inversion-sequence-choice sibling (see that component's own doc for
 * the shared shape): `sequenceLength` (2 or 3) fresh dominant seventh
 * chords play back to back, each one still a normal simultaneous 4-note
 * chord (playChordSequence), only the POSITIONS themselves are
 * staggered. The player names EVERY chord's inversion — one
 * IntervalOptionPicker "okienko" per position, reused as-is.
 */
export function DominantSeventhInversionSequenceChoiceExercise({
  exercise,
  answer,
  onAnswerChange,
  checked,
  locale,
}: DominantSeventhInversionSequenceChoiceExerciseProps) {
  const selectedOptionIds = answer?.selectedOptionIds ?? exercise.chords.map(() => null);

  function playAll() {
    playChordSequence(exercise.chords.map((chord) => chord.map((note) => parseScientific(note))));
  }

  function selectAt(position: number, optionId: string) {
    const next = [...selectedOptionIds];
    next[position] = optionId;
    onAnswerChange({ type: "dominant-seventh-inversion-sequence-choice", selectedOptionIds: next });
  }

  return (
    <View style={{ alignItems: "center", gap: theme.spacing(3), width: "100%" }}>
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
        {t("lesson.dominantSeventhInversionSequenceChoicePrompt", locale, { count: exercise.chords.length })}
      </Text>

      <View style={{ alignItems: "center", gap: theme.spacing(1) }}>
        <DarkButton label="🔊" onPress={playAll} variant="secondary" size={72} fontSize={32} />
        <Text style={{ color: theme.colors.muted, fontSize: theme.fontSize.body * 0.8 }}>
          {t("lesson.dominantSeventhInversionSequenceChoicePlayAllHint", locale)}
        </Text>
      </View>

      {exercise.chords.map((_, position) => (
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
