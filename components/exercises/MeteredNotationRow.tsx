import { Text, View } from "react-native";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Meter } from "@/types/exercises";

export function TimeSignature({ meter }: { meter: Meter }) {
  const [numerator, denominator] = meter.split("/");
  return (
    <View style={{ alignItems: "center", justifyContent: "center", marginRight: theme.spacing(1) }}>
      <Text style={{ color: theme.colors.ink, fontSize: 20, fontWeight: "800", lineHeight: 22 }}>{numerator}</Text>
      <Text style={{ color: theme.colors.ink, fontSize: 20, fontWeight: "800", lineHeight: 22 }}>{denominator}</Text>
    </View>
  );
}
