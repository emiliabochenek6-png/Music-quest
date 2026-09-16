import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomTabBar } from "@/components/BottomTabBar";
import { CalendarActivityView } from "@/components/CalendarActivityView";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

/**
 * The activity calendar as its own tab — CalendarActivityView used to
 * live only inside SideMenu's own "list, then detail" panel; now that
 * the app has a persistent bottom tab bar, it's promoted to a real
 * top-level screen (dropped from the side menu itself, see
 * SideMenuContent's own doc, to avoid the same destination living in two
 * places).
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
