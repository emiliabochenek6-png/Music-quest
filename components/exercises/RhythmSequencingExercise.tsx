import { Pressable, Text, View } from "react-native";
import { DarkButton } from "@/components/exercises/DarkButton";
import { NoteValueIcon } from "@/components/exercises/NoteValueIcon";
import { schedulerNow } from "@/lib/audio/player";
import { playMetronome, playRhythm, stopAllScheduledAudio } from "@/lib/audio/rhythmPlayer";
import { t } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { AnswerInput, GeneratedExercise } from "@/types/exercises";

interface RhythmSequencingExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "rhythm-sequencing" }>;
  answer: Extract<AnswerInput, { type: "rhythm-sequencing" }> | null;
  onAnswerChange: (answer: AnswerInput) => void;
  checked: boolean;
  locale: Locale;
}

// Same count-in/trailing-click shape as RhythmValueDictationExercise's own
// playTarget — a beat or two to settle into the pulse before the motif
// starts, and enough click track after the last onset that the final
// tile's own duration doesn't get cut off mid-click.
const COUNT_IN_BEATS = 2;
const TRAILING_METRONOME_BEATS = 2;

/** "Posłuchaj rytmu i kliknij wartości w usłyszanej kolejności" — a motif
 * plays (see playRhythm) with a plain quarter-note metronome click track
 * underneath at the exercise's own bpm (exercise.bpm — see generateExercise's
 * own rhythm-sequencing case for where that comes from), the same felt-
 * pulse reference every other rhythm exercise's own recording already
 * gets, giving the ear a steady beat to judge the motif's note VALUES
 * against instead of just bare claps. No meter/measure grouping here
 * (rhythm-sequencing has no meter field, just a flat bpm), so this is a
 * plain 1-beat-per-"measure" click, not the felt-pulse scaling
 * RhythmDictationExercise/RhythmNotationTapExercise do for real metered
 * content. The player taps shuffled note-value tiles back in the order
 * they heard them. Selection is tracked by SLOT index (a position in the
 * shuffled row), not by value, so two tiles sharing the same value stay
 * independently clickable — ported from the web app's
 * RhythmSequencingExercise.tsx. */
export function RhythmSequencingExercise({ exercise, answer, onAnswerChange, checked, locale }: RhythmSequencingExerciseProps) {
  const selectedIndexes = answer?.selectedIndexes ?? [];

  function play() {
    stopAllScheduledAudio();
    const beatIntervalMs = (60 / exercise.bpm) * 1000;
    const lastOnsetMs = exercise.onsetsMs[exercise.onsetsMs.length - 1] ?? 0;
    const patternBeats = Math.ceil(lastOnsetMs / beatIntervalMs) + TRAILING_METRONOME_BEATS;
    const startAtMs = schedulerNow();
    playMetronome({ bpm: exercise.bpm, beatsPerMeasure: 1, measureCount: COUNT_IN_BEATS + patternBeats, startAtMs });
    const countInOffsetMs = COUNT_IN_BEATS * beatIntervalMs;
    playRhythm(exercise.onsetsMs.map((ms) => ms + countInOffsetMs), 0.8, startAtMs);
  }

  function handleTileTap(slotIndex: number) {
    if (checked || selectedIndexes.includes(slotIndex)) return;
    onAnswerChange({ type: "rhythm-sequencing", selectedIndexes: [...selectedIndexes, slotIndex] });
  }

  function handleReset() {
    onAnswerChange({ type: "rhythm-sequencing", selectedIndexes: [] });
  }

  return (
    <View style={{ alignItems: "center", gap: theme.spacing(2.5), width: "100%" }}>
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
        {t("lesson.rhythmSequencingPrompt", locale)}
      </Text>
      <DarkButton label="🔊" onPress={play} variant="secondary" size={84} fontSize={42} />

      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: theme.spacing(1.5) }}>
        {exercise.shuffledMotif.map((value, slotIndex) => {
          const position = selectedIndexes.indexOf(slotIndex);
          const isSelected = position !== -1;
          let borderColor: string = theme.colors.border;
          if (checked && isSelected) {
            borderColor = exercise.shuffledMotif[slotIndex] === exercise.correctOrder[position] ? theme.colors.success : theme.colors.warning;
          } else if (isSelected) {
            borderColor = theme.colors.primary;
          }
          return (
            <Pressable
              key={slotIndex}
              onPress={() => handleTileTap(slotIndex)}
              disabled={checked || isSelected}
              accessibilityRole="button"
              style={{
                width: 60,
                height: 68,
                borderRadius: theme.radius.md,
                borderWidth: 2,
                borderColor,
                backgroundColor: theme.colors.surface,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <NoteValueIcon value={value} size={24} />
              {isSelected && (
                <View
                  style={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    backgroundColor: theme.colors.primary,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 12, fontWeight: "800" }}>{position + 1}</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      {!checked && selectedIndexes.length > 0 && (
        <Pressable onPress={handleReset}>
          <Text style={{ color: theme.colors.muted, fontSize: theme.fontSize.body * 0.85, textDecorationLine: "underline" }}>
            {t("lesson.resetOrder", locale)}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
