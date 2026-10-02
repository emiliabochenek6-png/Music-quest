import { Pressable, Text, View, StyleSheet } from "react-native";
import { AppIcon } from "@/components/icons/AppIcon";
import { GameRulesContent } from "@/components/GameRulesContent";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import { GlyphText } from "@/components/icons/GlyphText";

/** The side menu's own content — just "Zasady gry" now that Kalendarz
 * aktywności is back on BottomTabBar (see that component's own doc) and
 * no longer needs a second way in from here too. */
export function SideMenuContent({ onClose, onOpenGuide }: { onClose: () => void; onOpenGuide?: () => void }) {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <GlyphText style={styles.headerTitle}>📖 Zasady gry</GlyphText>
        <CloseButton onPress={onClose} />
      </View>
      {onOpenGuide && (
        <Pressable onPress={onOpenGuide} accessibilityRole="button" style={styles.guideButton}>
          <AppIcon name="tryb_nauki" size={26} />
          <Text style={styles.guideButtonText}>Przewodnik po grze</Text>
        </Pressable>
      )}
      <GameRulesContent />
    </View>
  );
}

function CloseButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel="Zamknij" hitSlop={10}>
      <GlyphText style={styles.closeIcon}>✕</GlyphText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  guideButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    marginBottom: 16,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceMuted,
  },
  guideButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: theme.colors.ink,
  },
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
