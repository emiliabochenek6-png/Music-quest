import { Pressable, Switch, Text, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { AppIcon } from "@/components/icons/AppIcon";
import type { IconName } from "@/components/icons/icons";
import { LessonPath } from "@/components/map/LessonPath";
import { getWorldContent } from "@/data/lessons";
import { getWorldById } from "@/data/worlds";
import { useGamification } from "@/context/GamificationContext";
import { useProgress } from "@/context/ProgressContext";
import { t } from "@/lib/i18n/translate";
import type { TranslationKey } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { LessonDefinition } from "@/types/exercises";

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

// Which worlds get LessonPath's own full-height background illustration
// (see LessonPath.tsx's own backgroundImageSource doc) — keyed the same
// way as WORLD_ICON above. Only Wioska Nut ("note") has its own
// commissioned background so far; every other `mapIconId` falls through
// to `undefined`, which LessonPath treats as "no background image"
// rather than defaulting to a mismatched illustration.
const WORLD_BACKGROUNDS: Partial<Record<string, number>> = {
  note: require("@/assets/backgrounds/wioska-nut-tlo.png"),
};

function WorldCardIcon({ mapIconId }: { mapIconId: string }) {
  const entry = WORLD_ICON[mapIconId];
  if (!entry) return <Text style={{ fontSize: 26 }}>🎵</Text>;
  return <AppIcon name={entry.icon} size={32} />;
}

/**
 * A world's own "poziomy" (levels) screen — same theme every other
 * screen in the app now uses (see theme/tokens.ts's own doc).
 */
export default function WorldLevelsScreen() {
  const { worldId } = useLocalSearchParams<{ worldId: string }>();
  const insets = useSafeAreaInsets();
  const { progress } = useProgress();
  const { state: gamification, setIntroModeEnabled } = useGamification();
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

  return (
    <View style={styles.root}>
      <View style={[styles.glowBlob, { backgroundColor: world.accentColor }]} />

      <View style={[styles.headerRow, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={goBackToMap} accessibilityRole="button" accessibilityLabel="Wstecz" hitSlop={12} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
      </View>

      <View style={[styles.card, { borderColor: `${world.accentColor}55`, shadowColor: world.accentColor }]}>
        <View style={[styles.cardIcon, { backgroundColor: `${world.accentColor}22`, borderColor: world.accentColor }]}>
          <WorldCardIcon mapIconId={world.mapIconId} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.cardTitleRow}>
            <Text style={[styles.cardTitle, { color: world.accentColor }]}>{t(world.nameKey as TranslationKey)}</Text>
            {content && (
              <Text style={styles.cardCount}>
                {completedCount}/{totalCount}
              </Text>
            )}
          </View>
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
          {content && (
            <>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { backgroundColor: world.accentColor, width: `${progressPct}%` }]} />
              </View>
              <Text style={styles.progressPct}>{progressPct}%</Text>
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
          backgroundImageSource={WORLD_BACKGROUNDS[world.mapIconId]}
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
