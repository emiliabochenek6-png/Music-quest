import { Pressable, Text, View, StyleSheet } from "react-native";
import { GameRulesContent } from "@/components/GameRulesContent";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

/** The side menu's own content — just "Zasady gry" now. The calendar view
 * that used to live here too was promoted to its own tab (see
 * app/(main)/calendar.tsx's own doc) once the app grew a persistent
 * BottomTabBar, which left this panel with a single destination — so the
 * "list, then detail" navigation it used to need is gone along with it. */
export function SideMenuContent({ onClose }: { onClose: () => void }) {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📖 Zasady gry</Text>
        <CloseButton onPress={onClose} />
      </View>
      <GameRulesContent />
    </View>
  );
}

function CloseButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel="Zamknij" hitSlop={10}>
      <Text style={styles.closeIcon}>✕</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  headerTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "800",
    color: theme.colors.ink,
  },
  closeIcon: {
    fontSize: 16,
    color: theme.colors.muted,
    padding: 4,
  },
});
