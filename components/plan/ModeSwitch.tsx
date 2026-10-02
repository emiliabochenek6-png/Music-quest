import { Pressable, Text, View, StyleSheet } from "react-native";
import { AppIcon } from "@/components/icons/AppIcon";
import type { IconName } from "@/components/icons/icons";
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
      <Segment icon="tryb_zabawy" label="Tryb zabawy" active={view === "fun"} onPress={() => onChange("fun")} />
      <Segment icon="tryb_nauki" label="Tryb nauki" active={view === "plan"} onPress={() => onChange("plan")} />
    </View>
  );
}

function Segment({ icon, label, active, onPress }: { icon: IconName; label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      style={[styles.segment, active && styles.segmentActive]}
    >
      <AppIcon name={icon} size={22} />
      <Text numberOfLines={1} style={[styles.segmentText, active && styles.segmentTextActive]}>
        {label}
      </Text>
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
    minHeight: 40,
    borderRadius: 19,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingHorizontal: 6,
  },
  segmentActive: {
    backgroundColor: theme.colors.primary,
  },
  segmentText: {
    flexShrink: 1,
    fontSize: 12.5,
    fontWeight: "800",
    color: theme.colors.muted,
  },
  segmentTextActive: {
    color: "#FFFFFF",
  },
});
