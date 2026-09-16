import { useState } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { router } from "expo-router";
import { GameRulesContent } from "@/components/GameRulesContent";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

/** The side menu's own content — "Kalendarz aktywności" (navigates away
 * to the real app/(main)/calendar.tsx screen, since that already exists
 * as a full-screen route) and "Zasady gry" (which has no route of its
 * own, so it still drills into a local detail view exactly like before).
 * The calendar tab briefly lived directly on BottomTabBar — moved back
 * here once that bar's four slots were reassigned to Mapa krain/Misje/
 * Subskrypcja/Ustawienia, but the calendar SCREEN itself was left alone,
 * so linking to it here rather than re-embedding CalendarActivityView
 * avoids maintaining the same content two different ways. */
export function SideMenuContent({ onClose }: { onClose: () => void }) {
  const [showRules, setShowRules] = useState(false);

  function openCalendar() {
    onClose();
    router.push("/(main)/calendar");
  }

  if (showRules) {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <Pressable onPress={() => setShowRules(false)} accessibilityRole="button" accessibilityLabel="Wstecz" hitSlop={10}>
            <Text style={styles.backArrow}>‹</Text>
          </Pressable>
          <Text style={styles.headerTitle}>📖 Zasady gry</Text>
          <CloseButton onPress={onClose} />
        </View>
        <GameRulesContent />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Menu</Text>
        <CloseButton onPress={onClose} />
      </View>
      <MenuRow icon="📅" label="Kalendarz aktywności" onPress={openCalendar} />
      <MenuRow icon="📖" label="Zasady gry" onPress={() => setShowRules(true)} />
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

function MenuRow({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.menuRow, pressed && styles.menuRowPressed]}>
      <Text style={{ fontSize: 18 }}>{icon}</Text>
      <Text style={styles.menuRowLabel}>{label}</Text>
      <Text style={styles.menuRowChevron}>›</Text>
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
  backArrow: {
    fontSize: 22,
    color: theme.colors.ink,
    paddingRight: 2,
  },
  closeIcon: {
    fontSize: 16,
    color: theme.colors.muted,
    padding: 4,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    borderRadius: 12,
  },
  menuRowPressed: {
    backgroundColor: theme.colors.surfaceMuted,
  },
  menuRowLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  menuRowChevron: {
    fontSize: 18,
    color: theme.colors.muted,
  },
});
