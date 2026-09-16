import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomTabBar } from "@/components/BottomTabBar";
import { CalendarActivityView } from "@/components/CalendarActivityView";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

/**
 * The activity calendar's own full screen — reached from the side menu's
 * "Kalendarz aktywności" row (see SideMenuContent's own doc), not from
 * BottomTabBar itself: this briefly WAS one of its four tabs, but that
 * bar's slots are Mapa krain/Misje/Subskrypcja/Ustawienia now, so the
 * calendar moved back to being menu-reachable — as a real screen (not
 * re-embedded inline in the slide-out panel) so there's still only one
 * place this content actually lives. Still renders BottomTabBar itself
 * (none of its four tabs highlight here, which is correct — this screen
 * isn't one of them, just reachable alongside them).
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
