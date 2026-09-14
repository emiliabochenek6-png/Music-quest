import { Text, View } from "react-native";
import { BeamedNotation } from "@/components/exercises/BeamedNotation";
import { OptionButton } from "@/components/exercises/OptionButton";
import { t } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { GeneratedExercise } from "@/types/exercises";

interface BeamGroupingChoiceExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "beam-grouping-choice" }>;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  checked: boolean;
  locale: Locale;
}

/** "Gaj Grupowania" — every option renders the SAME note sequence with a
 * DIFFERENT hand-authored beaming (BeamedNotation's own `groups`/`ties`);
 * the player just picks the option whose beaming looks correct. Pure
 * multiple choice, same OptionButton/correctOptionIndex shape as every
 * other choice exercise in this app — no tap-to-group interaction (that
 * gesture belongs to a different, not-yet-ported exercise type). Ported
 * from the web app's BeamGroupingChoiceExercise.tsx. */
export function BeamGroupingChoiceExercise({ exercise, selectedIndex, onSelect, checked, locale }: BeamGroupingChoiceExerciseProps) {
  return (
    <View style={{ alignItems: "center", gap: theme.spacing(3), width: "100%" }}>
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
        {t("lesson.beamGroupingChoicePrompt", locale)}
      </Text>
      <View style={{ width: "100%", gap: theme.spacing(1.5) }}>
        {exercise.options.map((option, index) => (
          <OptionButton
            key={index}
            label={t("lesson.beamGroupingOptionLabel", locale, { n: index + 1 })}
            selected={selectedIndex === index}
            correct={checked && exercise.correctOptionIndex === index}
            incorrect={checked && selectedIndex === index && exercise.correctOptionIndex !== index}
            disabled={checked}
            onPress={() => onSelect(index)}
          >
            <BeamedNotation
              sequence={exercise.sequence}
              groups={option.groups}
              ties={option.ties}
              meter={exercise.meter}
              barBeforeIndex={exercise.barBeforeIndex}
            />
          </OptionButton>
        ))}
      </View>
    </View>
  );
}
