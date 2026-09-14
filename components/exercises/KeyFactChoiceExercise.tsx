import { Text, View } from "react-native";
import { OptionButton } from "@/components/exercises/OptionButton";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { GeneratedExercise } from "@/types/exercises";

interface KeyFactChoiceExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "key-fact-choice" }>;
  selectedOptionId: string | null;
  onSelect: (optionId: string) => void;
  checked: boolean;
}

/** "Labirynt Tonacji"'s hand-authored questions (see the "key-fact-choice"
 * ExerciseSpec) — a prompt, an optional hint shown up front, free-text
 * options, and an optional explanation revealed once checked. Locale-free,
 * same as Zatoka Trójdźwięków's TriadFactChoiceExercise: the prompt/hint/
 * explanation are already the final authored Polish text, not a
 * translation-key lookup. Ported from the web app's KeyFactChoiceExercise.tsx. */
export function KeyFactChoiceExercise({ exercise, selectedOptionId, onSelect, checked }: KeyFactChoiceExerciseProps) {
  return (
    <View style={{ alignItems: "center", gap: theme.spacing(2) }}>
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
        {exercise.prompt}
      </Text>
      {exercise.hint && (
        <Text style={{ color: theme.colors.muted, fontSize: theme.fontSize.body * 0.85, fontStyle: "italic", textAlign: "center" }}>
          {exercise.hint}
        </Text>
      )}
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
      {checked && exercise.explanation && (
        <View style={{ borderRadius: theme.radius.md, backgroundColor: theme.colors.surfaceMuted, padding: theme.spacing(1.5) }}>
          <Text style={{ color: theme.colors.muted, fontSize: theme.fontSize.body * 0.85, textAlign: "center" }}>{exercise.explanation}</Text>
        </View>
      )}
    </View>
  );
}
