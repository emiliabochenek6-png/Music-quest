import { useState } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { GamificationHeaderBar } from "@/components/GamificationHeaderBar";
import { WorldMap } from "@/components/map/WorldMap";
import { SideMenu } from "@/components/SideMenu";
import { SideMenuContent } from "@/components/SideMenuContent";
import { useGamification } from "@/context/GamificationContext";
import { useProgress } from "@/context/ProgressContext";
import { useSubscription } from "@/context/SubscriptionContext";
import { todayISODate } from "@/lib/gamification/activity";
import { resolveNodeState } from "@/lib/progression/resolveNodeState";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { WorldDefinition } from "@/types/content";

/**
 * World map screen — the app's home base once login is done. The one
 * screen in the app with no back button, since it IS the "start screen"
 * every other screen's own back button eventually lands on. Routes a tap
 * to one of three places depending on resolveNodeState's own verdict:
 *  - "available" / "completed" -> that world's own levels screen
 *  - "locked-subscription" -> the paywall modal
 *  - "locked-progression" -> nowhere (WorldNode itself surfaces the
 *    "finish the previous world" state inline, no navigation needed)
 */
export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const { progress } = useProgress();
  const { status } = useSubscription();
  const { state: gamification } = useGamification();
  const dailyChallengeDoneToday = gamification.dailyChallenge?.dateISO === todayISODate() && gamification.dailyChallenge.completed;
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  function handleSelectWorld(world: WorldDefinition) {
    const state = resolveNodeState(world, progress, status, gamification.lessonStars);
    if (state === "locked-progression") {
      return;
    }
    if (state === "locked-subscription") {
      router.push({ pathname: "/paywall", params: { worldId: world.id } });
      return;
    }
    router.push({ pathname: "/(main)/world/[worldId]", params: { worldId: world.id } });
  }

  return (
    <View style={styles.root}>
      <View style={styles.glowBlob} />
      <Pressable
        onPress={() => setSideMenuOpen(true)}
        accessibilityRole="button"
        accessibilityLabel="Menu"
        hitSlop={12}
        style={[styles.menuButton, { top: insets.top + 12 }]}
      >
        <Text style={{ fontSize: 18 }}>☰</Text>
      </Pressable>
      <Text style={[styles.title, { top: insets.top + 16 }]}>Music Quest</Text>
      <View style={[styles.headerBarWrap, { top: insets.top + 56 }]}>
        <GamificationHeaderBar />
      </View>
      <Pressable
        onPress={() => router.push("/(main)/settings")}
        accessibilityRole="button"
        accessibilityLabel="Ustawienia"
        hitSlop={12}
        style={[styles.settingsButton, { top: insets.top + 12 }]}
      >
        <Text style={{ fontSize: 18 }}>⚙️</Text>
      </Pressable>
      <WorldMap progress={progress} subscription={status} lessonStars={gamification.lessonStars} onSelectWorld={handleSelectWorld} />

      <Pressable
        onPress={() => router.push("/(main)/daily-challenge")}
        accessibilityRole="button"
        accessibilityLabel="Wyzwanie dnia"
        style={[styles.dailyChallengeButton, { bottom: insets.bottom + 16 }]}
      >
        <Text style={{ fontSize: 22 }}>{dailyChallengeDoneToday ? "✅" : "🎯"}</Text>
        <Text style={styles.dailyChallengeLabel}>{dailyChallengeDoneToday ? "Wyzwanie zrobione" : "Wyzwanie dnia"}</Text>
      </Pressable>

      <SideMenu visible={sideMenuOpen} onClose={() => setSideMenuOpen(false)}>
        <SideMenuContent onClose={() => setSideMenuOpen(false)} />
      </SideMenu>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.cream,
    overflow: "hidden",
  },
  glowBlob: {
    position: "absolute",
    top: -160,
    left: "50%",
    marginLeft: -200,
    width: 400,
    height: 320,
    borderRadius: 220,
    backgroundColor: theme.colors.primary,
    opacity: 0.22,
  },
  title: {
    position: "absolute",
    left: 64,
    fontSize: 15,
    fontWeight: "800",
    color: theme.colors.ink,
    letterSpacing: 0.4,
    zIndex: 10,
  },
  headerBarWrap: {
    position: "absolute",
    left: 64,
    zIndex: 10,
  },
  settingsButton: {
    position: "absolute",
    right: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  menuButton: {
    position: "absolute",
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  dailyChallengeButton: {
    position: "absolute",
    alignSelf: "center",
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: theme.colors.surface,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
  },
  dailyChallengeLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: theme.colors.ink,
  },
});
