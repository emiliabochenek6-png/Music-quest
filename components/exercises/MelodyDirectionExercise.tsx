import { View, Text } from "react-native";
import { DarkButton as Button } from "@/components/exercises/DarkButton";
import { OptionButton } from "@/components/exercises/OptionButton";
import { playMelody } from "@/lib/audio/player";
import { parseScientific } from "@/lib/music/notes";
import { t } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { GeneratedExercise, MelodyDirection } from "@/types/exercises";

interface MelodyDirectionExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "melody-direction-choice" }>;
  selectedDirection: MelodyDirection | null;
  onSelect: (direction: MelodyDirection) => void;
  checked: boolean;
  locale: Locale;
}

const DIRECTIONS: { value: MelodyDirection; labelKey: "lesson.melodyDirectionUp" | "lesson.melodyDirectionDown" | "lesson.melodyDirectionSame"; arrow: string }[] = [
  { value: "up", labelKey: "lesson.melodyDirectionUp", arrow: "↑" },
  { value: "same", labelKey: "lesson.melodyDirectionSame", arrow: "→" },
  { value: "down", labelKey: "lesson.melodyDirectionDown", arrow: "↓" },
];

/** "Dokąd leci melodia?" — ported from the web app's MelodyDirectionExercise.tsx. */
export function MelodyDirectionExercise({ exercise, selectedDirection, onSelect, checked, locale }: MelodyDirectionExerciseProps) {

  function play() {
    playMelody(exercise.notes.map((n) => parseScientific(n)));
  }

  return (
    <View style={{ alignItems: "center", gap: theme.spacing(3) }}>
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
        {t("lesson.melodyDirectionPrompt", locale)}
      </Text>
      <Button label="🔊" onPress={play} variant="secondary" size={84} fontSize={42} />
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: theme.spacing(2) }}>
        {DIRECTIONS.map(({ value, labelKey, arrow }) => (
          <OptionButton
            key={value}
            label={`${arrow} ${t(labelKey, locale)}`}
            selected={selectedDirection === value}
            correct={checked && value === exercise.correctDirection}
            incorrect={checked && selectedDirection === value && value !== exercise.correctDirection}
            disabled={checked}
            onPress={() => onSelect(value)}
          />
        ))}
      </View>
    </View>
  );
}
