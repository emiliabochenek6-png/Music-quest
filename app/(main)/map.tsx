import { useState } from "react";
import { Image, Pressable, Text, View, StyleSheet, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { BottomTabBar } from "@/components/BottomTabBar";
import { GamificationHeaderBar } from "@/components/GamificationHeaderBar";
import { AppIcon } from "@/components/icons/AppIcon";
import { WorldMap } from "@/components/map/WorldMap";
import { SideMenu } from "@/components/SideMenu";
import { SideMenuContent } from "@/components/SideMenuContent";
import { PlanPromptModal } from "@/components/plan/PlanPromptModal";
import { SoltekWelcomeModal } from "@/components/SoltekWelcomeModal";
import { useGamification } from "@/context/GamificationContext";
import { usePlan } from "@/context/PlanContext";
import { useProfile } from "@/context/ProfileContext";
import { useProgress } from "@/context/ProgressContext";
import { useSubscription } from "@/context/SubscriptionContext";
import { resolveNodeState } from "@/lib/progression/resolveNodeState";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { WorldDefinition } from "@/types/content";

/** The map's own background art (see assets/backgrounds's own soltek-tlo
 * source folder for the commissioned SVG/README) — a phone-portrait and a
 * laptop-landscape version, picked at runtime by aspect ratio rather than
 * a CSS media query (no such thing in React Native) since this screen has
 * no per-platform file split otherwise. Same "cover, screen-sized, fixed
 * behind a scrolling path" treatment as world/[worldId].tsx's own Wioska
 * Nut background — see that file's doc for why plain StyleSheet.
 * absoluteFill alone isn't enough on web (needs explicit 100%/100% too,
 * or a locally require()'d image renders at its own native pixel size). */
const MAP_BACKGROUND_PORTRAIT = require("@/assets/backgrounds/soltek-tlo-telefon.png");
const MAP_BACKGROUND_LANDSCAPE = require("@/assets/backgrounds/soltek-tlo-laptop.png");

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
  const { width, height } = useWindowDimensions();
  const backgroundSource = width < height ? MAP_BACKGROUND_PORTRAIT : MAP_BACKGROUND_LANDSCAPE;
  const { progress } = useProgress();
  const { status } = useSubscription();
  const { state: gamification } = useGamification();
  const { profile, isLoading: isProfileLoading, setHasSeenSoltekGreeting } = useProfile();
  const { plan, isLoading: isPlanLoading, chooseOriginal } = usePlan();
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  // Not loading AND not-yet-seen — reading `profile` before it's finished
  // loading would show the modal for a returning player too, for the one
  // frame before the real (already-true) stored value arrives.
  const showSoltekWelcome = !isProfileLoading && !profile.hasSeenSoltekGreeting;
  // First-run choice of study path (test-based or from the beginning) —
  // only after the Soltek greeting, so the two never stack.
  const showPlanPrompt = !isProfileLoading && !isPlanLoading && profile.hasSeenSoltekGreeting && plan.mode === "unset";

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
      <Image
        source={backgroundSource}
        resizeMode="cover"
        style={[StyleSheet.absoluteFill, { width: "100%", height: "100%" }]}
      />
      <View style={styles.glowBlob} />
      <Pressable
        onPress={() => setSideMenuOpen(true)}
        accessibilityRole="button"
        accessibilityLabel="Menu"
        hitSlop={12}
        style={[styles.menuButton, { top: insets.top + 12 }]}
      >
        <AppIcon name="hud_menu" size={20} />
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
      <PlanPromptModal visible={showPlanPrompt} onTakeTest={() => router.push("/(main)/placement")} onStartFromBeginning={() => chooseOriginal()} />
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
