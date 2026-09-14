import { TextInput, View, Text } from "react-native";
import { StaffNotation } from "@/components/exercises/StaffNotation";
import { t } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { GeneratedExercise } from "@/types/exercises";

interface NoteWordSpellingExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "note-word-spelling" }>;
  guess: string;
  onGuessChange: (guess: string) => void;
  checked: boolean;
  locale: Locale;
}

/** "Czytanie prostych słów muzycznych" — ported from the web app's
 * NoteWordSpellingExercise.tsx. Correctness here (the border-color hint)
 * mirrors the same simple comparison lib/questions/validate.ts uses —
 * driving the input's border color locally, not a second source of truth
 * for whether the answer counts (LessonScreen still calls isAnswerCorrect). */
export function NoteWordSpellingExercise({ exercise, guess, onGuessChange, checked, locale }: NoteWordSpellingExerciseProps) {
  const isCorrect = checked ? guess.trim().toUpperCase() === exercise.targetWord : null;
  const promptKey = exercise.clef === "bass" ? "lesson.noteWordPromptBass" : "lesson.noteWordPrompt";
  const borderColor = isCorrect === true ? theme.colors.success : isCorrect === false ? theme.colors.warning : theme.colors.border;

  return (
    <View style={{ alignItems: "center", gap: theme.spacing(3) }}>
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
        {t(promptKey, locale)}
      </Text>
      <View style={{ flexDirection: "row", gap: 4 }}>
        {exercise.notes.map((note, index) => (
          <StaffNotation key={index} note={note} clef={exercise.clef} width={64} />
        ))}
      </View>
      <TextInput
        value={guess}
        editable={!checked}
        onChangeText={onGuessChange}
        placeholder={t("lesson.wordInputPlaceholder", locale)}
        autoCapitalize="characters"
        autoCorrect={false}
        style={{
          width: 200,
          borderWidth: 2,
          borderColor,
          borderRadius: theme.radius.sm,
          paddingHorizontal: theme.spacing(2),
          paddingVertical: theme.spacing(1),
          textAlign: "center",
          fontSize: theme.fontSize.heading,
          textTransform: "uppercase",
          color: theme.colors.ink,
        }}
      />
      {isCorrect === false && (
        <Text style={{ color: theme.colors.warning, fontSize: theme.fontSize.body * 0.9, fontWeight: "700" }}>
          {t("lesson.correctAnswerWas", locale, { answer: exercise.targetWord })}
        </Text>
      )}
    </View>
  );
}
