import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomTabBar } from "@/components/BottomTabBar";
import { CalendarActivityView } from "@/components/CalendarActivityView";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

/**
 * The activity calendar's own full screen — back in BottomTabBar's own
 * five slots (Mapa krain/Misje/Kalendarz/Subskrypcja/Ustawienia), the
 * same spot it originally had before briefly moving into the side menu.
 */
export default function CalendarScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top + 16 }]}>
      <Text style={styles.title}>📅 Kalendarz aktywności</Text>
      <View style={styles.content}>
        <CalendarActivityView />
      </View>
      <BottomTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.cream,
  },
  title: {
    fontSize: theme.fontSize.heading,
    fontWeight: "800",
    color: theme.colors.ink,
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
});
