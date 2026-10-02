import { Pressable, ScrollView, Text, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { AppIcon } from "@/components/icons/AppIcon";
import { SoltekMascot } from "@/components/SoltekMascot";
import { useGamification } from "@/context/GamificationContext";
import { nextMilestoneLevel, roadmapAfter } from "@/lib/gamification/levelRewards";
import { getRankForXp, getRankName, MAX_LEVEL, TITLES, xpToReachLevel } from "@/lib/gamification/rank";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import { GlyphText } from "@/components/icons/GlyphText";

const ROADMAP_LENGTH = 12;
const GOLD = "#facc15";

/** The level roadmap, opened from the "Level N" pill on the map: where the
 * player is, how far the next level is, and what the next levels pay —
 * so "one more lesson" always has a visible prize ahead. */
export default function LevelsScreen() {
  const insets = useSafeAreaInsets();
  const { state } = useGamification();
  const info = getRankForXp(state.xp);
  const span = info.xpForNextRank === null ? null : info.xpIntoRank + info.xpForNextRank;
  const fraction = span && span > 0 ? Math.min(1, info.xpIntoRank / span) : 1;
  const roadmap = roadmapAfter(info.rank, ROADMAP_LENGTH);
  const milestone = nextMilestoneLevel(info.rank);
  const milestoneXpLeft = milestone === null ? null : Math.max(0, xpToReachLevel(milestone) - state.xp);

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Wstecz" hitSlop={12} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
        <GlyphText style={styles.headerTitle}>⭐ Twoje levele</GlyphText>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <AppIcon name="hud_ranga_gwiazda" size={56} />
            <View style={{ flex: 1 }}>
              <Text style={styles.heroLevel}>Level {info.rank}</Text>
              <Text style={styles.heroTitle}>{getRankName(info.rank)}</Text>
            </View>
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${fraction * 100}%` }]} />
          </View>
          <Text style={styles.heroXp}>
            {span === null ? "Najwyższy level osiągnięty!" : `${info.xpIntoRank} / ${span} XP do levelu ${info.rank + 1}`}
          </Text>
        </View>

        {milestone !== null && milestoneXpLeft !== null && (
          <SoltekMascot
            size="sm"
            expression="zachecajacy"
            message={`Do wielkiej nagrody na levelu ${milestone} (+25 nutek) brakuje Ci ${milestoneXpLeft} XP. Każda dobra odpowiedź to +10 XP!`}
          />
        )}

        <Text style={styles.sectionTitle}>Najbliższe nagrody</Text>
        <View style={{ gap: 8 }}>
          {roadmap.map((entry) => (
            <View key={entry.level} style={[styles.row, entry.isMilestone && styles.rowMilestone]}>
              <View style={[styles.levelBadge, entry.isMilestone && styles.levelBadgeMilestone]}>
                <Text style={[styles.levelBadgeText, entry.isMilestone && { color: "#1f2937" }]}>{entry.level}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{entry.newTitle ? `Nowy tytuł: ${entry.newTitle}` : `Level ${entry.level}`}</Text>
                <Text style={styles.rowSub}>
                  {entry.xpRequired} XP łącznie · ten level kosztuje {entry.xpCost} XP
                </Text>
              </View>
              <View style={styles.reward}>
                <AppIcon name="hud_nutki_waluta" size={16} />
                <Text style={styles.rewardText}>+{entry.nutki}</Text>
              </View>
            </View>
          ))}
          {roadmap.length === 0 && <Text style={styles.rowSub}>To już najwyższy level. Gratulacje!</Text>}
        </View>

        <Text style={styles.sectionTitle}>Tytuły do zdobycia</Text>
        <View style={{ gap: 8 }}>
          {TITLES.map((title) => {
            const reached = info.rank >= title.fromLevel;
            return (
              <View key={title.name} style={[styles.row, !reached && { opacity: 0.6 }]}>
                <GlyphText style={{ fontSize: 20 }}>{reached ? "✅" : "🔒"}</GlyphText>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>{title.name}</Text>
                  <Text style={styles.rowSub}>od levelu {title.fromLevel}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <Text style={styles.footnote}>
          Levele są od 1 do {MAX_LEVEL}. Na początku idą szybko, potem każdy kolejny wymaga więcej XP. Za każdy level dostajesz 5 nutek, a za każdy piąty aż 25.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.cream },
  header: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 16, paddingBottom: 10 },
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
  backIcon: { fontSize: 20, color: theme.colors.ink },
  headerTitle: { fontSize: 14, fontWeight: "800", letterSpacing: 0.3, color: theme.colors.primary },
  content: { paddingHorizontal: 16, gap: 14, maxWidth: 560, width: "100%", alignSelf: "center" },
  hero: {
    gap: 12,
    padding: 16,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: GOLD,
  },
  heroTop: { flexDirection: "row", alignItems: "center", gap: 14 },
  heroLevel: { fontSize: 26, fontWeight: "800", color: theme.colors.ink },
  heroTitle: { fontSize: 14, fontWeight: "700", color: theme.colors.muted },
  track: { height: 12, borderRadius: 6, backgroundColor: theme.colors.surfaceMuted, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 6, backgroundColor: GOLD },
  heroXp: { fontSize: 12, fontWeight: "700", color: theme.colors.muted },
  sectionTitle: { marginTop: 6, fontSize: 13, fontWeight: "800", letterSpacing: 0.4, textTransform: "uppercase", color: theme.colors.muted },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
  },
  rowMilestone: { borderColor: GOLD, borderWidth: 2 },
  levelBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surfaceMuted,
  },
  levelBadgeMilestone: { backgroundColor: GOLD },
  levelBadgeText: { fontSize: 15, fontWeight: "800", color: theme.colors.ink },
  rowTitle: { fontSize: 14, fontWeight: "800", color: theme.colors.ink },
  rowSub: { fontSize: 12, color: theme.colors.muted, marginTop: 1 },
  reward: { flexDirection: "row", alignItems: "center", gap: 4 },
  rewardText: { fontSize: 14, fontWeight: "800", color: theme.colors.ink },
  footnote: { fontSize: 12, color: theme.colors.muted, textAlign: "center", marginTop: 4 },
});
