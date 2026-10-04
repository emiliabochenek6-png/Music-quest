import { useCallback, useState } from "react";
import { Image, Pressable, Text, View, StyleSheet, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { BottomTabBar } from "@/components/BottomTabBar";
import { GamificationHeaderBar } from "@/components/GamificationHeaderBar";
import { SolfekAvatar } from "@/components/shop/SolfekAvatar";
import { AppIcon } from "@/components/icons/AppIcon";
import { WorldMap } from "@/components/map/WorldMap";
import { SideMenu } from "@/components/SideMenu";
import { SideMenuContent } from "@/components/SideMenuContent";
import { ModeSwitch } from "@/components/plan/ModeSwitch";
import { PlanPath } from "@/components/plan/PlanPath";
import { PlanPromptModal } from "@/components/plan/PlanPromptModal";
import { GameGuide } from "@/components/guide/GameGuide";
import { TourTarget } from "@/components/guide/TourTarget";
import { useTourTarget } from "@/lib/guide/tourTargets";
import { useGamification } from "@/context/GamificationContext";
import { usePlan } from "@/context/PlanContext";
import { useProfile } from "@/context/ProfileContext";
import { useProgress } from "@/context/ProgressContext";
import { useSubscription } from "@/context/SubscriptionContext";
import { resolveNodeState } from "@/lib/progression/resolveNodeState";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { WorldDefinition } from "@/types/content";

// Small rounded logo icon with Solfek, next to the title.

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
  const { profile, isLoading: isProfileLoading, setHasSeenSoltekGreeting, setHasSeenGuide } = useProfile();
  // The tour can also be replayed from the side menu.
  const [guideReplay, setGuideReplay] = useState(false);
  const menuTargetRef = useTourTarget("menu");
  const { plan, isLoading: isPlanLoading, startWithGame, setView, planCompletedIds } = usePlan();
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  // First-run choice of study path (test-based or from the beginning) —
  // only after the Solfek greeting, so the two never stack.
  // Only while the map itself is the focused screen: a Modal is drawn above
  // EVERYTHING, so without this it stayed on top of the placement screen
  // pushed from its own "Zrób test" button. Coming back to the map without
  // having chosen shows it again.
  // `planPromptHidden` is set the moment "Zrób test" is pressed (don't wait
  // for the navigation's own blur event) and cleared whenever the map is
  // focused again, so backing out of the test without choosing re-asks.
  const [mapFocused, setMapFocused] = useState(true);
  const [planPromptHidden, setPlanPromptHidden] = useState(false);
  useFocusEffect(
    useCallback(() => {
      setMapFocused(true);
      setPlanPromptHidden(false);
      return () => setMapFocused(false);
    }, [])
  );
  // First run: ONE window (Solfek says hello and asks how to start); the short tour waits until the player has
  // finished a first lesson, so a new player gets to play before reading anything.
  // (Reading `profile`/`plan` before they have loaded would show these to a returning player for one frame.)
  const finishedALesson = progress.completedLessonIds.size > 0 || planCompletedIds.size > 0;
  const showPlanPrompt = mapFocused && !planPromptHidden && !isProfileLoading && !isPlanLoading && !guideReplay && plan.mode === "unset" && !plan.promptSeen;
  const showGuide = guideReplay || (!isProfileLoading && !isPlanLoading && !showPlanPrompt && !profile.hasSeenGuide && finishedALesson);

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
        ref={menuTargetRef}
        collapsable={false}
        onPress={() => setSideMenuOpen(true)}
        accessibilityRole="button"
        accessibilityLabel="Menu"
        hitSlop={12}
        style={[styles.menuButton, { top: insets.top + 12 }]}
      >
        <AppIcon name="hud_menu" size={20} />
      </Pressable>
      {/* Solfek in what he wears now, standing in front of the chosen background; tap to open the shop. */}
      <Pressable onPress={() => router.push("/(main)/power-ups")} accessibilityRole="button" accessibilityLabel="Sklep Solfka" style={[styles.logoIcon, { top: insets.top + 6 }]}>
        <SolfekAvatar equipped={gamification.shopEquipped} size={36} withBackground />
      </Pressable>
      <Text style={[styles.title, { top: insets.top + 16 }]}>Solfek</Text>
      <View style={[styles.headerBarWrap, { top: insets.top + 56 }]}>
        <TourTarget id="headerBar" style={{ alignSelf: "flex-start" }}>
          <GamificationHeaderBar />
        </TourTarget>
      </View>
      {plan.view === "plan" ? (
        <PlanPath />
      ) : (
        <WorldMap progress={progress} subscription={status} lessonStars={gamification.lessonStars} onSelectWorld={handleSelectWorld} />
      )}
      {/* Above both views: "Tryb zabawy" (world map: the game, bosses) / "Tryb nauki" (Twój plan: personal path). */}
      <View style={[styles.switchWrap, { top: insets.top + 118 }]}>
        <ModeSwitch view={plan.view} onChange={setView} />
      </View>

      <BottomTabBar />

      <SideMenu visible={sideMenuOpen} onClose={() => setSideMenuOpen(false)}>
        <SideMenuContent
          onClose={() => setSideMenuOpen(false)}
          onOpenGuide={() => {
            setSideMenuOpen(false);
            setGuideReplay(true);
          }}
        />
      </SideMenu>

      {/* Mounted only while showing — a closing RN-web Modal lingers (faded) behind whatever opens next. */}
      {showGuide && (
        <GameGuide
          onClose={() => {
            setGuideReplay(false);
            setHasSeenGuide(true);
          }}
        />
      )}
{/* Mounted only while it should be showing — a closing RN-web Modal can linger in the DOM until its fade animation ends (and never ends if the page is hidden), which kept it on top of the placement screen. */}
      {showPlanPrompt && (
        <PlanPromptModal
          visible
          onTakeTest={() => {
            setHasSeenSoltekGreeting(true);
            setPlanPromptHidden(true);
            router.push("/(main)/placement");
          }}
          onStartFromBeginning={() => {
            setHasSeenSoltekGreeting(true);
            startWithGame();
          }}
        />
      )}
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
  logoIcon: {
    position: "absolute",
    left: 64,
    width: 36,
    height: 36,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    zIndex: 10,
  },
  title: {
    position: "absolute",
    left: 108,
    fontSize: 15,
    fontWeight: "800",
    color: theme.colors.ink,
    letterSpacing: 0.4,
    zIndex: 10,
  },
  switchWrap: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 10,
    alignItems: "center",
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
