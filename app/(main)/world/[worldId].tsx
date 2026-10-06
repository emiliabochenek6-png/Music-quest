import { Image, Pressable, Switch, Text, View, StyleSheet, useWindowDimensions } from "react-native";
import { useWorldCardCollapsed } from "@/lib/ui/worldCardPreference";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { AppIcon } from "@/components/icons/AppIcon";
import type { IconName } from "@/components/icons/icons";
import { LessonPath } from "@/components/map/LessonPath";
import { getWorldContent } from "@/data/lessons";
import { getWorldById } from "@/data/worlds";
import { useGamification } from "@/context/GamificationContext";
import { usePlan } from "@/context/PlanContext";
import { useProgress } from "@/context/ProgressContext";
import { t } from "@/lib/i18n/translate";
import type { TranslationKey } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { LessonDefinition } from "@/types/exercises";
import { GlyphText } from "@/components/icons/GlyphText";

// Same mapIconId -> icon table as components/map/WorldNode.tsx's own
// WORLD_ICON — kept as a separate copy here rather than a shared import
// since this screen's card renders it at a different size inside a
// differently-shaped container, not because the mapping itself differs.
// Every world has a matching hand-drawn "kraina_" icon now, so this never
// falls back to a plain Unicode emoji.
const WORLD_ICON: Record<string, { icon: IconName }> = {
  note: { icon: "kraina_wioska_nut" },
  metronome: { icon: "kraina_miasto_rytmu" },
  "bar-line": { icon: "kraina_przystan_taktow" },
  instruments: { icon: "kraina_krolestwo_instrumentow" },
  interval: { icon: "kraina_pasmo_interwalow" },
  chord: { icon: "kraina_zatoka_trojdzwiekow" },
  inversion: { icon: "kraina_jaskinia_akordow" },
  citadel: { icon: "kraina_cytadela_dominant" },
  "key-signature": { icon: "kraina_labirynt_tonacji" },
  build: { icon: "kraina_fabryka_budowania" },
  beam: { icon: "kraina_gaj_grupowania" },
  dictation: { icon: "kraina_szczyt_dyktand" },
  microphone: { icon: "kraina_zaczarowany_solfez" },
};

function WorldCardIcon({ mapIconId }: { mapIconId: string }) {
  const entry = WORLD_ICON[mapIconId];
  if (!entry) return <GlyphText style={{ fontSize: 26 }}>🎵</GlyphText>;
  return <AppIcon name={entry.icon} size={32} />;
}

// Full-screen backdrop art, keyed the same way as WORLD_ICON above.
// Rendered as this screen's very first child (see the root View below) so
// it sits behind the header/card AND the scrollable path alike, covering
// the whole screen rather than just LessonPath's own narrow content
// column (an earlier version drew it there instead — confined to that
// column, not what "tło na całej stronie" asked for). "cover" both avoids
// the distortion a stretched fit caused and the repetition a tiled fit
// caused — a single image, cropped instead of squished or repeated.
//
// A world can supply either one image (Wioska Nut's own — resizeMode
// "cover" crops whatever the viewport's own aspect ratio needs) or a
// {portrait, landscape} pair (Miasto Rytmu's own — two genuinely
// different compositions, not just one stretched/cropped source, picked
// by orientation the same way app/(main)/map.tsx's own background does).
const WORLD_BACKGROUNDS: Partial<Record<string, number | { portrait: number; landscape: number }>> = {
  note: require("@/assets/backgrounds/wioska-nut-tlo.png"),
  metronome: {
    portrait: require("@/assets/backgrounds/miasto-rytmu-tlo-telefon.png"),
    landscape: require("@/assets/backgrounds/miasto-rytmu-tlo-laptop.png"),
  },
  "bar-line": {
    portrait: require("@/assets/backgrounds/przystan-taktow-tlo-telefon.png"),
    landscape: require("@/assets/backgrounds/przystan-taktow-tlo-laptop.png"),
  },
  interval: {
    portrait: require("@/assets/backgrounds/pasmo-interwalow-tlo-telefon.png"),
    landscape: require("@/assets/backgrounds/pasmo-interwalow-tlo-laptop.png"),
  },
  chord: {
    portrait: require("@/assets/backgrounds/zatoka-trojdzwiekow-tlo-telefon.png"),
    landscape: require("@/assets/backgrounds/zatoka-trojdzwiekow-tlo-laptop.png"),
  },
  inversion: {
    portrait: require("@/assets/backgrounds/jaskinia-akordow-tlo-telefon.png"),
    landscape: require("@/assets/backgrounds/jaskinia-akordow-tlo-laptop.png"),
  },
  citadel: {
    portrait: require("@/assets/backgrounds/cytadela-dominant-tlo-telefon.png"),
    landscape: require("@/assets/backgrounds/cytadela-dominant-tlo-laptop.png"),
  },
  "key-signature": {
    portrait: require("@/assets/backgrounds/labirynt-tonacji-tlo-telefon.png"),
    landscape: require("@/assets/backgrounds/labirynt-tonacji-tlo-laptop.png"),
  },
  build: {
    portrait: require("@/assets/backgrounds/fabryka-budowania-tlo-telefon.png"),
    landscape: require("@/assets/backgrounds/fabryka-budowania-tlo-laptop.png"),
  },
  beam: {
    portrait: require("@/assets/backgrounds/gaj-grupowania-tlo-telefon.png"),
    landscape: require("@/assets/backgrounds/gaj-grupowania-tlo-laptop.png"),
  },
  dictation: {
    portrait: require("@/assets/backgrounds/szczyt-dyktand-tlo-telefon.png"),
    landscape: require("@/assets/backgrounds/szczyt-dyktand-tlo-laptop.png"),
  },  instruments: {
    portrait: require("@/assets/backgrounds/krolestwo-instrumentow-tlo-telefon.png"),
    landscape: require("@/assets/backgrounds/krolestwo-instrumentow-tlo-laptop.png"),
  },
  microphone: {
    portrait: require("@/assets/backgrounds/zaczarowany-solfez-tlo-telefon.png"),
    landscape: require("@/assets/backgrounds/zaczarowany-solfez-tlo-laptop.png"),
  },
};

/**
 * A world's own "poziomy" (levels) screen — same theme every other
 * screen in the app now uses (see theme/tokens.ts's own doc).
 */
export default function WorldLevelsScreen() {
  const { worldId, focusLessonId } = useLocalSearchParams<{ worldId: string; focusLessonId?: string }>();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { progress } = useProgress();
  const { plan } = usePlan();
  const { state: gamification, setIntroModeEnabled } = useGamification();
  const { collapsed, setCollapsed } = useWorldCardCollapsed();
  const world = getWorldById(worldId);
  const content = getWorldContent(worldId);

  if (!world) {
    return (
      <View style={[styles.root, { padding: 24 }]}>
        <Text style={styles.fallbackText}>Nieznana kraina: {worldId}</Text>
      </View>
    );
  }

  const completedCount = content ? content.lessons.filter((l) => progress.completedLessonIds.has(l.id)).length : 0;
  const totalCount = content?.lessons.length ?? 0;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const introModeEnabled = gamification.introModeEnabledByWorld[worldId] ?? true;

  function handleSelectLesson(lesson: LessonDefinition) {
    router.push({ pathname: "/(main)/lesson/[lessonId]", params: { lessonId: lesson.id, worldId } });
  }

  // A plain router.back() would normally land on the map (that's how this
  // screen is always reached), but ISN'T guaranteed to — e.g. a deep link
  // straight into a world, or any future path this screen could still be
  // reached from — would pop to whatever's underneath instead, or nowhere.
  // A deterministic replace matches the same "never strand the player"
  // reasoning app/(main)/lesson/[lessonId].tsx's own goBackToLevels uses.
  function goBackToMap() {
    router.replace("/(main)/map");
  }

  const backgroundEntry = WORLD_BACKGROUNDS[world.mapIconId];
  // Not a plain `typeof backgroundEntry === "object"` check — on web,
  // require()'ing an image ALSO returns an object (e.g. `{ uri: ... }`),
  // not the plain numeric asset id native platforms give it, so that
  // check matched Wioska Nut's own single-image entry too and tried to
  // read a nonexistent `.portrait` off of it (silently rendering no
  // background at all). Only an entry this file itself authored as a
  // {portrait, landscape} pair actually has a `portrait` key.
  const backgroundSource =
    backgroundEntry && typeof backgroundEntry === "object" && "portrait" in backgroundEntry
      ? (width < height ? backgroundEntry.portrait : backgroundEntry.landscape)
      : backgroundEntry;

  return (
    <View style={styles.root}>
      {backgroundSource && (
        <Image
          source={backgroundSource}
          resizeMode="cover"
          // A local require()'d image carries its own native pixel size
          // (720x1510), which react-native-web renders the <img> at by
          // default whenever the style doesn't explicitly claim a size —
          // StyleSheet.absoluteFill alone (position + inset 0) wasn't
          // enough on a wide viewport, where that native width is far
          // narrower than the screen: the image sat pinned to the
          // left edge at its own 720px width instead of covering the
          // rest. Explicit 100%/100% overrides that default so "cover"
          // actually has the full box to scale against.
          style={[StyleSheet.absoluteFill, { width: "100%", height: "100%" }]}
        />
      )}
      <View style={[styles.glowBlob, { backgroundColor: world.accentColor }]} />

      <View style={[styles.headerRow, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={goBackToMap} accessibilityRole="button" accessibilityLabel="Wstecz" hitSlop={12} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
      </View>

      <View style={[styles.card, collapsed && styles.cardCollapsed, { borderColor: `${world.accentColor}55`, shadowColor: world.accentColor }]} testID="world-card">
        <View style={[styles.cardIcon, collapsed && styles.cardIconSmall, { backgroundColor: `${world.accentColor}22`, borderColor: world.accentColor }]}>
          <WorldCardIcon mapIconId={world.mapIconId} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.cardTitleRow}>
            <Text style={[styles.cardTitle, { color: world.accentColor }]} numberOfLines={1}>{t(world.nameKey as TranslationKey)}</Text>
            <View style={styles.cardTitleRight}>
              {content && (
                <Text style={styles.cardCount}>
                  {completedCount}/{totalCount}
                </Text>
              )}
              {/* Folds the card away (description, "Zapoznaj się" switch, hint) so more of the path shows; remembered for every world. */}
              <Pressable
                onPress={() => setCollapsed(!collapsed)}
                accessibilityRole="button"
                accessibilityLabel={collapsed ? "Rozwiń opis krainy" : "Zwiń opis krainy"}
                accessibilityState={{ expanded: !collapsed }}
                testID="world-card-toggle"
                hitSlop={8}
                style={[styles.collapseButton, { borderColor: `${world.accentColor}66` }]}
              >
                <Text style={[styles.collapseIcon, { color: world.accentColor }]}>{collapsed ? "▾" : "▴"}</Text>
              </Pressable>
            </View>
          </View>
          {!collapsed && (
            <>
              <Text style={styles.cardDescription}>{t(world.descriptionKey as TranslationKey)}</Text>
              <View style={styles.introModeRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.introModeLabel}>{t("world.introModeToggle.label")}</Text>
                  <Text style={styles.introModeHint}>
                    {t(introModeEnabled ? "world.introModeToggle.hintOn" : "world.introModeToggle.hintOff")}
                  </Text>
                </View>
                <Switch
                  value={introModeEnabled}
                  onValueChange={(enabled) => setIntroModeEnabled(worldId, enabled)}
                  trackColor={{ true: world.accentColor }}
                />
              </View>
            </>
          )}
          {content && (
            <>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { backgroundColor: world.accentColor, width: `${progressPct}%` }]} />
              </View>
              {!collapsed && (
                <>
                  <Text style={styles.progressPct}>{progressPct}%</Text>
                  <Text style={styles.unlockHint}>Poziomy otwierają się po kolei: następny odblokujesz, zdobywając minimum 2 gwiazdki w poprzednim.</Text>
                </>
              )}
            </>
          )}
        </View>
      </View>

      {content ? (
        <LessonPath
          lessons={content.lessons}
          completedLessonIds={progress.completedLessonIds}
          lessonStars={gamification.lessonStars}
          accentHex={world.accentColor}
          focusLessonId={focusLessonId}
          onSelectLesson={handleSelectLesson}
        />
      ) : (
        <View style={styles.placeholderWrap}>
          <Text style={styles.fallbackText}>
            Poziomy tej krainy jeszcze nie przeniesione — na razie tylko Wioska Nut ma pełną treść.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  unlockHint: {
    marginTop: 6,
    fontSize: 11.5,
    fontWeight: "700",
    color: theme.colors.muted,
  },
  root: {
    flex: 1,
    backgroundColor: theme.colors.cream,
    overflow: "hidden",
  },
  glowBlob: {
    position: "absolute",
    top: -140,
    left: "50%",
    marginLeft: -180,
    width: 360,
    height: 280,
    borderRadius: 200,
    opacity: 0.22,
  },
  headerRow: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    fontSize: 20,
    color: theme.colors.ink,
  },
  card: {
    flexDirection: "row",
    gap: 14,
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 8,
    padding: 16,
    borderRadius: 20,
    borderWidth: theme.borderWidth,
    backgroundColor: theme.colors.surface,
  },
  cardIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  cardCollapsed: { padding: 10, gap: 10, alignItems: "center" },
  cardIconSmall: { width: 36, height: 36, borderRadius: 12 },
  cardTitleRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  collapseButton: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  collapseIcon: { fontSize: 16, fontWeight: "800", lineHeight: 18 },
  cardTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  cardCount: {
    color: theme.colors.muted,
    fontSize: 12,
    fontWeight: "700",
  },
  cardDescription: {
    color: theme.colors.muted,
    fontSize: 12.5,
    marginTop: 4,
    marginBottom: 10,
    lineHeight: 17,
  },
  introModeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: theme.borderWidth,
    borderTopColor: theme.colors.border,
    marginBottom: 4,
  },
  introModeLabel: {
    color: theme.colors.ink,
    fontSize: 13,
    fontWeight: "700",
  },
  introModeHint: {
    color: theme.colors.muted,
    fontSize: 11,
    marginTop: 2,
    lineHeight: 14,
  },
  progressTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: theme.colors.surfaceMuted,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
  },
  progressPct: {
    color: theme.colors.muted,
    fontSize: 10,
    marginTop: 3,
  },
  placeholderWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  fallbackText: {
    color: theme.colors.muted,
    textAlign: "center",
  },
});
