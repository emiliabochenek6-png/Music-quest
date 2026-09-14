import { Text, View } from "react-native";
import { OptionButton } from "@/components/exercises/OptionButton";
import { describeAccidentalCount, getKeyAtFifths, getKeyDisplayName } from "@/lib/music/keys";
import { t, type TranslationKey } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { GeneratedExercise } from "@/types/exercises";

interface CircleNeighborKeyChoiceExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "circle-neighbor-key-choice" }>;
  selectedOptionId: string | null;
  onSelect: (optionId: string) => void;
  checked: boolean;
  locale: Locale;
}

/** Moving "up" the wheel (+1 fifths) means ADDING a sharp only when
 * already on/past the sharp side (startFifths &gt;= 0) — starting on the
 * flat side it means REMOVING a flat instead (and symmetrically for
 * "down"). The wheel step and which accidental actually changes are NOT
 * the same fact — this picks the hint that matches which one actually
 * happened here. */
function hintKeyFor(direction: "up" | "down", startFifths: number): TranslationKey {
  if (direction === "up") {
    return startFifths >= 0 ? "lesson.circleNeighborKeyChoiceHintUpAddSharp" : "lesson.circleNeighborKeyChoiceHintUpRemoveFlat";
  }
  return startFifths <= 0 ? "lesson.circleNeighborKeyChoiceHintDownAddFlat" : "lesson.circleNeighborKeyChoiceHintDownRemoveSharp";
}

/** "Labirynt Tonacji" level 3 — names the major key one wheel-step up or
 * down from a given one, answered via OptionButton (not the wheel itself —
 * unlike circle-step-choice, the wording asks by name, not by tapping).
 * Ported from the web app's CircleNeighborKeyChoiceExercise.tsx. */
export function CircleNeighborKeyChoiceExercise({ exercise, selectedOptionId, onSelect, checked, locale }: CircleNeighborKeyChoiceExerciseProps) {
  const startKey = getKeyDisplayName(getKeyAtFifths(exercise.startFifths).majorTonic, "major", locale);
  const promptKey = exercise.direction === "up" ? "lesson.circleNeighborKeyChoicePromptUp" : "lesson.circleNeighborKeyChoicePromptDown";
  const hintKey = hintKeyFor(exercise.direction, exercise.startFifths);
  const startCount = describeAccidentalCount(exercise.startFifths, locale);
  const newCount = describeAccidentalCount(exercise.correctFifths, locale);

  return (
    <View style={{ alignItems: "center", gap: theme.spacing(2) }}>
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
        {t(promptKey, locale, { key: startKey })}
      </Text>
      <Text style={{ color: theme.colors.muted, fontSize: theme.fontSize.body * 0.85, fontStyle: "italic", textAlign: "center" }}>
        {t(hintKey, locale, { startKey, startCount, newCount })}
      </Text>
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
    </View>
  );
}
