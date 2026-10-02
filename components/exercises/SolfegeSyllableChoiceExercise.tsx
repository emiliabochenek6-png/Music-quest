import { Pressable, Text, View } from "react-native";
import { DarkButton } from "@/components/exercises/DarkButton";
import { OptionButton } from "@/components/exercises/OptionButton";
import { clearScheduledAudio, playSolfegeEarPrompt, stopAllActiveSamples } from "@/lib/audio/player";
import { parseScientific } from "@/lib/music/notes";
import { t } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { AnswerInput, GeneratedExercise } from "@/types/exercises";

interface SolfegeSyllableChoiceExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "solfege-syllable-choice" }>;
  answer: Extract<AnswerInput, { type: "solfege-syllable-choice" }> | null;
  onAnswerChange: (answer: AnswerInput) => void;
  checked: boolean;
  locale: Locale;
}

/**
 * "Zaczarowany Solfeż" — the NO-MICROPHONE way in: hear a short C–F–G–C
 * cadence (so "do" is heard as home), then one note — or a few in a row —
 * and name each by its solfège syllable (do/re/mi/…) from buttons. The
 * button set is exactly the syllables of the lesson's own note pool
 * (exercise.options), so early lessons offer two or three choices and
 * later ones the full scale. "🔊" replays the whole prompt including the
 * cadence; "🔁 Tylko dźwięk" replays just the heard note(s). Both are
 * unlimited — the player can listen as often as they like. Single note:
 * tapping a button selects it directly (tapping another replaces it).
 * Several notes: tapping fills the next empty slot, tapping a filled slot
 * clears it.
 */
export function SolfegeSyllableChoiceExercise({ exercise, answer, onAnswerChange, checked, locale }: SolfegeSyllableChoiceExerciseProps) {
  const length = exercise.targetNotes.length;
  const selected: (string | null)[] = Array.from({ length }, (_, index) => answer?.selectedSyllables[index] ?? null);

  function play(withCadence: boolean) {
    stopAllActiveSamples();
    clearScheduledAudio();
    playSolfegeEarPrompt(exercise.targetNotes.map(parseScientific), { withCadence });
  }

  function emit(next: (string | null)[]) {
    onAnswerChange({ type: "solfege-syllable-choice", selectedSyllables: next });
  }

  function pick(syllable: string) {
    if (checked) return;
    if (length === 1) {
      emit([syllable]);
      return;
    }
    const firstEmpty = selected.indexOf(null);
    if (firstEmpty === -1) return;
    emit(selected.map((value, index) => (index === firstEmpty ? syllable : value)));
  }

  function clearSlot(index: number) {
    if (checked) return;
    emit(selected.map((value, position) => (position === index ? null : value)));
  }

  const prompt =
    length === 1 ? t("lesson.solfegeSyllablePrompt", locale) : t("lesson.solfegeSyllableSequencePrompt", locale, { count: String(length) });

  return (
    <View style={{ alignItems: "center", gap: theme.spacing(3) }}>
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>{prompt}</Text>

      <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing(2) }}>
        <DarkButton label="🔊" onPress={() => play(true)} variant="secondary" size={84} fontSize={42} />
        <DarkButton label={t("lesson.solfegeSyllableReplayNotes", locale)} onPress={() => play(false)} variant="secondary" />
      </View>

      {length > 1 && (
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: theme.spacing(1.5) }}>
          {selected.map((syllable, index) => {
            const isCorrect = checked && syllable === exercise.solfegeSyllables[index];
            const isWrong = checked && syllable !== exercise.solfegeSyllables[index];
            let borderColor = theme.colors.border;
            if (isCorrect) borderColor = theme.colors.success;
            else if (isWrong) borderColor = theme.colors.warning;
            else if (syllable !== null) borderColor = theme.colors.primary;
            return (
              <Pressable
                key={index}
                onPress={() => clearSlot(index)}
                disabled={checked || syllable === null}
                accessibilityRole="button"
                accessibilityLabel={syllable ?? t("lesson.solfegeSyllableEmptySlot", locale)}
                style={{
                  minWidth: 64,
                  minHeight: theme.minTapTarget,
                  borderWidth: 2,
                  borderStyle: syllable === null ? "dashed" : "solid",
                  borderColor,
                  borderRadius: theme.radius.md,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: theme.spacing(1.5),
                  backgroundColor: theme.colors.surface,
                }}
              >
                <Text style={{ color: theme.colors.ink, fontSize: theme.fontSize.body, fontWeight: "700" }}>{syllable ?? "?"}</Text>
              </Pressable>
            );
          })}
        </View>
      )}

      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: theme.spacing(1.5) }}>
        {exercise.options.map((syllable) => {
          const isSelected = length === 1 && selected[0] === syllable;
          const isCorrect = checked && length === 1 && syllable === exercise.solfegeSyllables[0];
          const isIncorrect = checked && length === 1 && isSelected && syllable !== exercise.solfegeSyllables[0];
          return (
            <OptionButton
              key={syllable}
              label={syllable}
              selected={isSelected}
              correct={isCorrect}
              incorrect={isIncorrect}
              disabled={checked}
              onPress={() => pick(syllable)}
            />
          );
        })}
      </View>

      {checked && length > 1 && selected.some((syllable, index) => syllable !== exercise.solfegeSyllables[index]) && (
        <Text style={{ color: theme.colors.muted, fontSize: theme.fontSize.body * 0.9, textAlign: "center" }}>
          {t("lesson.solfegeSyllableCorrectAnswer", locale, { syllables: exercise.solfegeSyllables.join(" – ") })}
        </Text>
      )}
    </View>
  );
}
