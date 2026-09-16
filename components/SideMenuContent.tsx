import { Pressable, Text, View, StyleSheet } from "react-native";
import { GameRulesContent } from "@/components/GameRulesContent";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

/** The side menu's own content — just "Zasady gry" now that Kalendarz
 * aktywności is back on BottomTabBar (see that component's own doc) and
 * no longer needs a second way in from here too. */
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
