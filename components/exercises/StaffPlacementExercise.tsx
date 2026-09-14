import { View, Text } from "react-native";
import { StaffPlacementBoard } from "@/components/exercises/StaffPlacementBoard";
import { describeLineOrSpaceOrdinal } from "@/lib/music/staff";
import { t } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { GeneratedExercise } from "@/types/exercises";

interface StaffPlacementExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "staff-placement" }>;
  selectedStep: number | null;
  onSelect: (step: number) => void;
  checked: boolean;
  locale: Locale;
}

/** "Policz linie od dołu" — ported from the web app's
 * StaffPlacementExercise.tsx. The web original only ever names the
 * target position in each staff button's own accessibility label
 * (invisible to a sighted player); a plain "count the lines, place the
 * ball" headline alone never actually says WHICH line/space to count TO —
 * unplayable without also stating the target ordinal as visible prompt
 * text, which this fixes. */
export function StaffPlacementExercise({ exercise, selectedStep, onSelect, checked, locale }: StaffPlacementExerciseProps) {
  const ordinal = describeLineOrSpaceOrdinal(exercise.targetStep);
  const targetKey = ordinal?.kind === "space" ? "lesson.staffPlacementTargetSpace" : "lesson.staffPlacementTargetLine";

  return (
    <View style={{ alignItems: "center", gap: theme.spacing(1) }}>
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
        {t("lesson.staffPlacementPrompt", locale)}
      </Text>
      {ordinal && (
        <Text style={{ fontSize: theme.fontSize.heading, fontWeight: "800", color: theme.colors.primary, textAlign: "center", marginBottom: theme.spacing(2) }}>
          {t(targetKey, locale, { n: ordinal.ordinal })}
        </Text>
      )}
      <StaffPlacementBoard
        selectedStep={selectedStep}
        onSelect={onSelect}
        disabled={checked}
        correctStep={checked ? exercise.targetStep : null}
        locale={locale}
      />
    </View>
  );
}
