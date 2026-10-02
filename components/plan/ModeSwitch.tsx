import { Pressable, Text, View, StyleSheet } from "react-native";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

interface ModeSwitchProps {
  view: "fun" | "plan";
  onChange: (view: "fun" | "plan") => void;
}

/** The map screen's two-way switch: "Tryb zabawy" (the original world map —
 * a game: explore the worlds, beat the bosses) and "Tryb nauki" ("Twój plan": the personal path: the
 * lessons picked for you, day by day, with reviews). */
export function ModeSwitch({ view, onChange }: ModeSwitchProps) {
  return (
    <View style={styles.track} accessibilityRole="tablist">
      <Segment label="🎮 Tryb zabawy" active={view === "fun"} onPress={() => onChange("fun")} />
      <Segment label="📚 Tryb nauki" active={view === "plan"} onPress={() => onChange("plan")} />
    </View>
  );
}

function Segment({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      style={[styles.segment, active && styles.segmentActive]}
    >
      <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    borderRadius: 22,
    padding: 3,
    gap: 3,
  },
  segment: {
    flex: 1,
    minHeight: 36,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  segmentActive: {
    backgroundColor: theme.colors.primary,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: "800",
    color: theme.colors.muted,
  },
  segmentTextActive: {
    color: "#FFFFFF",
  },
});
