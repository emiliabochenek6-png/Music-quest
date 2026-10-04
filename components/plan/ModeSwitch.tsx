import { Pressable, Text, View, StyleSheet } from "react-native";
import { AppIcon } from "@/components/icons/AppIcon";
import type { IconName } from "@/components/icons/icons";
import { useTourTarget } from "@/lib/guide/tourTargets";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

interface ModeSwitchProps {
  view: "fun" | "plan" | "own";
  onChange: (view: "fun" | "plan" | "own") => void;
}

/** The map screen's two-way switch: "Tryb zabawy" (the original world map —
 * a game: explore the worlds, beat the bosses) and "Tryb nauki" ("Twój plan": the personal path: the
 * lessons picked for you, day by day, with reviews). */
export function ModeSwitch({ view, onChange }: ModeSwitchProps) {
  const targetRef = useTourTarget("modeSwitch");
  return (
    <View ref={targetRef} collapsable={false} style={styles.track} accessibilityRole="tablist">
      <Segment icon="tryb_zabawy" label="Tryb zabawy" active={view === "fun"} onPress={() => onChange("fun")} />
      <Segment icon="tryb_nauki" label="Tryb nauki" active={view === "plan"} onPress={() => onChange("plan")} />
      <Segment icon="tryb_wlasny" label="Tryb własny" active={view === "own"} onPress={() => onChange("own")} />
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
      <AppIcon name={icon} size={18} />
      <Text numberOfLines={1} style={[styles.segmentText, active && styles.segmentTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: "100%",
    maxWidth: 360,
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
    paddingHorizontal: 4,
  },
  segmentActive: {
    backgroundColor: theme.colors.primary,
  },
  segmentText: {
    flexShrink: 1,
    fontSize: 11,
    fontWeight: "800",
    color: theme.colors.muted,
  },
  segmentTextActive: {
    color: "#FFFFFF",
  },
});
