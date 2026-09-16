import { Pressable, Text, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, usePathname } from "expo-router";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

const TABS = [
  { href: "/(main)/map", matches: "/map", icon: "🏠", label: "Mapa krain" },
  { href: "/(main)/daily-challenge", matches: "/daily-challenge", icon: "🎯", label: "Misje" },
  { href: "/(main)/settings/subscription-status", matches: "/settings/subscription-status", icon: "💎", label: "Subskrypcja" },
  { href: "/(main)/settings", matches: "/settings", icon: "⚙️", label: "Ustawienia" },
] as const;

/**
 * The app's own persistent bottom navigation — switches between the four
 * top-level sections (map, daily "mission", subscription status,
 * settings). Rendered by each of those four screens themselves (not a
 * real expo-router Tabs navigator — the app's route tree is one Stack,
 * shared with the world/lesson drill-down screens that deliberately
 * DON'T show this bar, so a lightweight per-screen component is simpler
 * than splitting the Stack into nested navigators for four tabs). The
 * Subskrypcja tab points at settings/subscription-status rather than the
 * paywall itself — same destination Settings' own "Subskrypcja" row
 * already used before this tab existed, since that screen is the one
 * that actually reports "aktywna" vs "brak aktywnej", where the paywall
 * always shows the same buy-a-plan view regardless of current status.
 * `router.replace` (not `push`) on every tap — switching tabs shouldn't
 * grow the history stack, so the device back button/gesture never has to
 * step back through a chain of previously-visited tabs.
 */
export function BottomTabBar() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom + 8 }]}>
      {TABS.map((tab) => {
        const isActive = pathname === tab.matches;
        return (
          <Pressable
            key={tab.href}
            onPress={() => router.replace(tab.href)}
            accessibilityRole="button"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: isActive }}
            style={styles.item}
          >
            <View style={[styles.iconWrap, isActive && { backgroundColor: theme.colors.accentSoft }]}>
              <Text style={{ fontSize: 20 }}>{tab.icon}</Text>
            </View>
            <Text style={[styles.label, { color: isActive ? theme.colors.primary : theme.colors.muted }]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    borderTopWidth: theme.borderWidth,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingTop: 8,
  },
  item: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  iconWrap: {
    width: 40,
    height: 32,
    borderRadius: theme.radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 10.5,
    fontWeight: "700",
  },
});
