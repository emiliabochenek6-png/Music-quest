import { Text, View } from "react-native";
import { DarkButton } from "@/components/exercises/DarkButton";
import { OptionButton } from "@/components/exercises/OptionButton";
import { TriadStaffNotation } from "@/components/exercises/TriadStaffNotation";
import { playChord } from "@/lib/audio/player";
import { parseScientific } from "@/lib/music/notes";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { GeneratedExercise } from "@/types/exercises";

interface TriadFactChoiceExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "triad-fact-choice" }>;
  selectedOptionId: string | null;
  onSelect: (optionId: string) => void;
  checked: boolean;
}

/** "Zatoka Trójdźwięków"'s hand-authored questions (see the "triad-fact-
 * choice" ExerciseSpec) — a prompt, an optional hint shown up front to
 * help work the answer out, free-text options, and an optional
 * explanation revealed once checked. Locale-free: the prompt/hint/
 * explanation are already the final authored Polish text, not a
 * translation-key lookup. When notationNotes is set, the chord being
 * described is also drawn on a staff, with a speaker button to hear it
 * played (playChord) — dropped later in a level once the player no
 * longer needs to see (or hear) it to recognize it. Ported from the web
 * app's TriadFactChoiceExercise.tsx. */
export function TriadFactChoiceExercise({ exercise, selectedOptionId, onSelect, checked }: TriadFactChoiceExerciseProps) {
  const { notationNotes } = exercise;

  return (
    <View style={{ alignItems: "center", gap: theme.spacing(2) }}>
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
        {exercise.prompt}
      </Text>

      {notationNotes && (
        <View style={{ alignItems: "center", gap: theme.spacing(0.5) }}>
          <TriadStaffNotation notes={notationNotes} width={110} />
          <DarkButton
            label="🔊"
            onPress={() => playChord(notationNotes.map((note) => parseScientific(note)))}
            variant="secondary"
            size={56}
            fontSize={26}
          />
        </View>
      )}

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
          <Text style={{ color: theme.colors.muted, fontSize: theme.fontSize.body * 0.85, textAlign: "center" }}>
            {exercise.explanation}
          </Text>
        </View>
      )}
    </View>
  );
}
