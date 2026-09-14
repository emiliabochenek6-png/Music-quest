import { Pressable, Text, View } from "react-native";
import { DarkButton as Button } from "@/components/exercises/DarkButton";
import { playNote } from "@/lib/audio/player";
import { parseScientific } from "@/lib/music/notes";
import { t } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { GeneratedExercise } from "@/types/exercises";

interface PitchHeightChoiceExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "pitch-height-choice" }>;
  selectedSide: "high" | "low" | null;
  onSelect: (side: "high" | "low") => void;
  checked: boolean;
  locale: Locale;
}

/** "Wysoki czy niski?" — listen to one tone, tap the matching creature.
 * Ported from the web app's PitchHeightChoiceExercise.tsx: no staff
 * notation at all, just the speaker button + two big tap targets. */
export function PitchHeightChoiceExercise({ exercise, selectedSide, onSelect, checked, locale }: PitchHeightChoiceExerciseProps) {

  function play() {
    playNote(parseScientific(exercise.targetNote));
  }

  function creatureStyle(side: "high" | "low") {
    const isSelected = selectedSide === side;
    const isCorrectSide = side === exercise.correctSide;
    let borderColor = theme.colors.border;
    if (checked && isCorrectSide) borderColor = theme.colors.success;
    else if (checked && isSelected && !isCorrectSide) borderColor = theme.colors.warning;
    else if (isSelected) borderColor = theme.colors.primary;
    return { borderColor };
  }

  return (
    <View style={{ alignItems: "center", gap: theme.spacing(3) }}>
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
        {t("lesson.pitchHeightPrompt", locale)}
      </Text>
      <Button label="🔊" onPress={play} variant="secondary" size={84} fontSize={42} />
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: theme.spacing(3) }}>
        <Pressable
          onPress={() => onSelect("high")}
          disabled={checked}
          accessibilityRole="button"
          accessibilityLabel={t("lesson.highCreatureLabel", locale)}
          style={[
            { width: 110, height: 110, borderRadius: theme.radius.lg, borderWidth: 3, alignItems: "center", justifyContent: "center", backgroundColor: theme.colors.surface },
            creatureStyle("high"),
          ]}
        >
          <Text style={{ fontSize: 44 }}>🐦</Text>
          <Text style={{ color: theme.colors.ink, fontSize: theme.fontSize.body * 0.8 }}>{t("lesson.highCreatureLabel", locale)}</Text>
        </Pressable>
        <Pressable
          onPress={() => onSelect("low")}
          disabled={checked}
          accessibilityRole="button"
          accessibilityLabel={t("lesson.lowCreatureLabel", locale)}
          style={[
            { width: 110, height: 110, borderRadius: theme.radius.lg, borderWidth: 3, alignItems: "center", justifyContent: "center", backgroundColor: theme.colors.surface },
            creatureStyle("low"),
          ]}
        >
          <Text style={{ fontSize: 44 }}>🐻</Text>
          <Text style={{ color: theme.colors.ink, fontSize: theme.fontSize.body * 0.8 }}>{t("lesson.lowCreatureLabel", locale)}</Text>
        </Pressable>
      </View>
    </View>
  );
}
