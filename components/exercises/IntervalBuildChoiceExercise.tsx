import { Text, View } from "react-native";
import { DarkButton } from "@/components/exercises/DarkButton";
import { PianoKeyboard } from "@/components/exercises/PianoKeyboard";
import { playNote } from "@/lib/audio/player";
import { parseScientific } from "@/lib/music/notes";
import { t } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { GeneratedExercise } from "@/types/exercises";

interface IntervalBuildChoiceExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "interval-build-choice" }>;
  selectedNote: string | null;
  onSelect: (note: string) => void;
  checked: boolean;
  locale: Locale;
}

/** "Fabryka Budowania" — the construction inverse of Pasmo Interwałów's
 * interval-name-choice: instead of naming an interval you're shown, you
 * build one by clicking the key that completes it above or below the given
 * root (direction is randomized per exercise and stated in the prompt).
 * The root stays lightly ringed (PianoKeyboard's secondaryNote) throughout
 * so there's always a visible anchor to count semitones from. Ported from
 * the web app's IntervalBuildChoiceExercise.tsx. */
export function IntervalBuildChoiceExercise({ exercise, selectedNote, onSelect, checked, locale }: IntervalBuildChoiceExerciseProps) {
  return (
    <View style={{ alignItems: "center", gap: theme.spacing(3) }}>
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
        {t("lesson.intervalBuildChoicePrompt", locale, {
          interval: exercise.intervalName,
          direction: t(exercise.direction === "up" ? "lesson.directionUpWord" : "lesson.directionDownWord", locale),
          root: exercise.rootDisplayName,
        })}
      </Text>

      <DarkButton
        label="🔊"
        onPress={() => playNote(parseScientific(exercise.rootNote))}
        variant="secondary"
        size={72}
        fontSize={30}
      />

      <PianoKeyboard
        range={exercise.keyboardRange}
        onSelect={onSelect}
        disabled={checked}
        selectedNote={selectedNote}
        correctNote={checked ? exercise.targetNote : null}
        secondaryNote={exercise.rootNote}
      />
    </View>
  );
}
