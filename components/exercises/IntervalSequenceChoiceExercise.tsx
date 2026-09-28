import { Text, View } from "react-native";
import { DarkButton } from "@/components/exercises/DarkButton";
import { IntervalOptionPicker } from "@/components/exercises/IntervalOptionPicker";
import { playHarmonicInterval, playInterval } from "@/lib/audio/player";
import { parseScientific } from "@/lib/music/notes";
import { t } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { AnswerInput, GeneratedExercise } from "@/types/exercises";

interface IntervalSequenceChoiceExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "interval-sequence-choice" }>;
  answer: Extract<AnswerInput, { type: "interval-sequence-choice" }> | null;
  onAnswerChange: (answer: AnswerInput) => void;
  checked: boolean;
  locale: Locale;
}

/** Gap between one interval's own start and the next's, when "Odtwórz
 * wszystkie" plays the whole sequence — long enough for a 2-note interval
 * (~0.65s, see playMelody's own MELODY_NOTE_DURATION_SECONDS/gapSeconds)
 * to finish ringing plus a beat of silence before the next one starts, so
 * the ear never has to split one interval's tail from the next's onset. */
const SEQUENCE_STEP_MS = 900;
/** Same idea as SEQUENCE_STEP_MS, but for harmonic (dwudźwięk) sequences —
 * playHarmonicInterval rings for ~1.6s (player.ts's own CHORD_DURATION_
 * SECONDS, since it shares that long-ring NOTE_SAMPLES with playChord),
 * more than twice SEQUENCE_STEP_MS's own melodic gap, so a shorter step
 * here would start the next dyad while the previous one is still ringing. */
const HARMONIC_SEQUENCE_STEP_MS = 1900;

/**
 * "Pasmo Interwałów" — the harder, ear-memory sibling of
 * interval-name-choice: instead of one interval, `sequenceLength` (2 or 3)
 * play back to back, and the player names EVERY one, one small option
 * picker per position ("1.", "2.", (3.)) — see this type's own doc in
 * types/exercises.ts for why a fresh independent pair per position
 * (not "same pair, reordered") is what actually tests holding multiple
 * intervals in memory rather than just re-hearing one.
 */
export function IntervalSequenceChoiceExercise({ exercise, answer, onAnswerChange, checked, locale }: IntervalSequenceChoiceExerciseProps) {
  const selectedOptionIds = answer?.selectedOptionIds ?? exercise.notePairs.map(() => null);

  function playAll() {
    const stepMs = exercise.harmonic ? HARMONIC_SEQUENCE_STEP_MS : SEQUENCE_STEP_MS;
    exercise.notePairs.forEach(([a, b], index) => {
      const notes: [ReturnType<typeof parseScientific>, ReturnType<typeof parseScientific>] = [parseScientific(a), parseScientific(b)];
      setTimeout(() => (exercise.harmonic ? playHarmonicInterval(notes) : playInterval(notes)), index * stepMs);
    });
  }

  function selectAt(position: number, optionId: string) {
    const next = [...selectedOptionIds];
    next[position] = optionId;
    onAnswerChange({ type: "interval-sequence-choice", selectedOptionIds: next });
  }

  return (
    <View style={{ alignItems: "center", gap: theme.spacing(3), width: "100%" }}>
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
        {t("lesson.intervalSequenceChoicePrompt", locale, { count: exercise.notePairs.length })}
      </Text>

      <View style={{ alignItems: "center", gap: theme.spacing(1) }}>
        <DarkButton label="🔊" onPress={playAll} variant="secondary" size={72} fontSize={32} />
        <Text style={{ color: theme.colors.muted, fontSize: theme.fontSize.body * 0.8 }}>
          {t("lesson.intervalSequenceChoicePlayAllHint", locale)}
        </Text>
      </View>

      {exercise.notePairs.map((_, position) => {
        // Sorted ascending by semitone, same as IntervalNameChoiceExercise's
        // own picker — one independent "okienko" per position.
        const orderedOptions = [...exercise.optionsPerPosition[position]].sort((a, b) => Number(a.id) - Number(b.id));
        return (
          <View key={position} style={{ width: "100%", gap: theme.spacing(1) }}>
            <Text style={{ fontSize: theme.fontSize.body, fontWeight: "800", color: theme.colors.primary }}>{position + 1}.</Text>
            <IntervalOptionPicker
              options={orderedOptions}
              selectedOptionId={selectedOptionIds[position]}
              correctOptionId={exercise.correctOptionIds[position]}
              checked={checked}
              onSelect={(optionId) => selectAt(position, optionId)}
            />
          </View>
        );
      })}
    </View>
  );
}
