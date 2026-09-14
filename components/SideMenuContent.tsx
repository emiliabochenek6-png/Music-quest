import { useState } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { CalendarActivityView } from "@/components/CalendarActivityView";
import { GameRulesContent } from "@/components/GameRulesContent";

type SideMenuView = "list" | "calendar" | "rules";

const DETAIL_TITLES: Record<Exclude<SideMenuView, "list">, string> = {
  calendar: "📅 Kalendarz aktywności",
  rules: "📖 Zasady gry",
};

/** The side menu's own content — a small two-level "list, then detail"
 * navigation entirely local to this component (see this function's own
 * `view` state): tapping a row drills into that section with a back
 * arrow, rather than the menu growing a real router of its own for what
 * is still just two static pages. Resets to the list automatically on
 * every open — SideMenu (its host) fully unmounts its children while
 * closed (see that component's own `mounted` doc), so this component's
 * local state starts fresh each time rather than needing an explicit
 * reset effect. */
export function SideMenuContent({ onClose }: { onClose: () => void }) {
  const [view, setView] = useState<SideMenuView>("list");

  if (view === "list") {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Menu</Text>
          <CloseButton onPress={onClose} />
        </View>
        <MenuRow icon="📅" label="Kalendarz aktywności" onPress={() => setView("calendar")} />
        <MenuRow icon="📖" label="Zasady gry" onPress={() => setView("rules")} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Pressable onPress={() => setView("list")} accessibilityRole="button" accessibilityLabel="Wstecz" hitSlop={10}>
          <Text style={styles.backArrow}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {DETAIL_TITLES[view]}
        </Text>
        <CloseButton onPress={onClose} />
      </View>
      {view === "calendar" ? <CalendarActivityView /> : <GameRulesContent />}
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
    color: "#e9e4ff",
  },
  backArrow: {
    fontSize: 22,
    color: "#e9e4ff",
    paddingRight: 2,
  },
  closeIcon: {
    fontSize: 16,
    color: "rgba(233,228,255,0.6)",
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
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  menuRowLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: "#e9e4ff",
  },
  menuRowChevron: {
    fontSize: 18,
    color: "rgba(233,228,255,0.4)",
  },
});
