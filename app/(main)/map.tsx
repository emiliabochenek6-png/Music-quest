import { useState } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { BottomTabBar } from "@/components/BottomTabBar";
import { GamificationHeaderBar } from "@/components/GamificationHeaderBar";
import { WorldMap } from "@/components/map/WorldMap";
import { SideMenu } from "@/components/SideMenu";
import { SideMenuContent } from "@/components/SideMenuContent";
import { SoltekWelcomeModal } from "@/components/SoltekWelcomeModal";
import { useGamification } from "@/context/GamificationContext";
import { useProfile } from "@/context/ProfileContext";
import { useProgress } from "@/context/ProgressContext";
import { useSubscription } from "@/context/SubscriptionContext";
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
 *
 * Settings and the daily challenge used to have their own dedicated
 * top-right/floating entry points here — both dropped in favor of the
 * app's own persistent BottomTabBar, which already covers them.
 */
export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const { progress } = useProgress();
  const { status } = useSubscription();
  const { state: gamification } = useGamification();
  const { profile, isLoading: isProfileLoading, setHasSeenSoltekGreeting } = useProfile();
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  // Not loading AND not-yet-seen — reading `profile` before it's finished
  // loading would show the modal for a returning player too, for the one
  // frame before the real (already-true) stored value arrives.
  const showSoltekWelcome = !isProfileLoading && !profile.hasSeenSoltekGreeting;

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
      <WorldMap progress={progress} subscription={status} lessonStars={gamification.lessonStars} onSelectWorld={handleSelectWorld} />

      <BottomTabBar />

      <SideMenu visible={sideMenuOpen} onClose={() => setSideMenuOpen(false)}>
        <SideMenuContent onClose={() => setSideMenuOpen(false)} />
      </SideMenu>

      <SoltekWelcomeModal visible={showSoltekWelcome} onDismiss={() => setHasSeenSoltekGreeting(true)} />
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
});
