import { Pressable, Text, View, StyleSheet } from "react-native";
import { router } from "expo-router";
import { AppIcon } from "@/components/icons/AppIcon";
import type { IconName } from "@/components/icons/icons";
import { useGamification } from "@/context/GamificationContext";
import { useSubscription } from "@/context/SubscriptionContext";
import { getRankForXp } from "@/lib/gamification/rank";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

/** The map screen's own "at a glance" strip — hearts, streak, rank —
 * reading GamificationContext (+ SubscriptionContext, for premium's
 * unlimited-hearts display). Recomputes getHeartsInfo() at render time
 * rather than live-ticking a countdown itself (see
 * GamificationContext's own doc on why that function isn't a memoized
 * value) — good enough for a glanceable badge that's on-screen every
 * time the player returns to the map, unlike OutOfHeartsModal's own
 * countdown, which genuinely needs to visibly move while it's open. */
export function GamificationHeaderBar() {
  const { state, getHeartsInfo, isLoading } = useGamification();
  const { status: subscription } = useSubscription();

  if (isLoading) return null;

  const heartsInfo = getHeartsInfo();

  return (
    <View style={styles.row}>
      <Pill icon="hud_serce" label={subscription.isActive ? "∞" : String(heartsInfo.hearts)} />
      <Pill icon="hud_seria_ogien" label={String(state.streakDays)} />
      <Pressable onPress={() => router.push("/(main)/power-ups")} accessibilityRole="button" accessibilityLabel="Sklep Soltka">
        <Pill icon="hud_nutki_waluta" label={String(state.nutki)} />
      </Pressable>
      <RankPill xp={state.xp} />
    </View>
  );
}

function Pill({ icon, label }: { icon: IconName; label: string }) {
  return (
    <View style={styles.pill}>
      <AppIcon name={icon} size={16} />
      <Text style={styles.pillLabel}>{label}</Text>
    </View>
  );
}

/** Same pill family as Pill above, but wider — a rank's own progress
 * toward the NEXT one only means something with a bar showing how far
 * along it is, not just the bare number. `getRankForXp`'s own
 * `xpForNextRank` is a REMAINING amount, not a threshold — the bar's
 * fraction needs the full span (xpIntoRank + xpForNextRank) as its
 * denominator, derived here rather than exposed by getRankForXp itself
 * (which has no reason to know it'll be used for a bar). Past the last
 * defined rank threshold (xpForNextRank: null), there's no further span
 * to show progress within, so the bar reads as simply full. */
function RankPill({ xp }: { xp: number }) {
  const rank = getRankForXp(xp);
  const span = rank.xpForNextRank === null ? null : rank.xpIntoRank + rank.xpForNextRank;
  const fraction = span && span > 0 ? Math.min(1, Math.max(0, rank.xpIntoRank / span)) : 1;

  return (
    <View style={styles.rankPill}>
      <View style={styles.rankHeaderRow}>
        <AppIcon name="hud_ranga_gwiazda" size={16} />
        <Text style={styles.pillLabel}>Ranga {rank.rank}</Text>
      </View>
      <View style={styles.rankTrack}>
        <View style={[styles.rankFill, { width: `${fraction * 100}%` }]} />
      </View>
      <Text style={styles.rankXpLabel}>{span === null ? "maks. ranga" : `${rank.xpIntoRank}/${span} XP`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: theme.colors.surface,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
  },
  pillLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: theme.colors.ink,
  },
  rankPill: {
    minWidth: 108,
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: theme.colors.surface,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
  },
  rankHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rankTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.surfaceMuted,
    overflow: "hidden",
  },
  rankFill: {
    height: "100%",
    borderRadius: 2,
    backgroundColor: "#facc15",
  },
  rankXpLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: theme.colors.muted,
  },
});
