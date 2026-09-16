import { Text, View, StyleSheet } from "react-native";
import { useGamification } from "@/context/GamificationContext";
import { todayISODate } from "@/lib/gamification/activity";
import { computeDailyMissions } from "@/lib/gamification/dailyMissions";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

interface DailyMissionsCardProps {
  /** The daily-challenge exercise's own fixed XP bonus — see
   * app/(main)/daily-challenge.tsx's own XP_DAILY_CHALLENGE_BONUS,
   * passed through rather than duplicated (see computeDailyMissions'
   * own doc on why). */
  challengeXpReward: number;
}

/** The Misje tab's own "dzisiejsze misje" checklist — three glanceable
 * rows (see computeDailyMissions' own doc for what each one tracks and
 * why) sitting above the tab's single playable daily-challenge exercise,
 * giving the tab a plural "missions" identity instead of just the one
 * task its old "Wyzwanie dnia" name implied. Purely a read view over
 * GamificationContext's own state — completing a mission here is a side
 * effect of playing a lesson/the challenge elsewhere, never something
 * this card itself drives. */
export function DailyMissionsCard({ challengeXpReward }: DailyMissionsCardProps) {
  const { state } = useGamification();
  const today = todayISODate();
  const challengeCompletedToday = state.dailyChallenge?.dateISO === today && state.dailyChallenge.completed;
  const missions = computeDailyMissions(state.activityLog[today], challengeCompletedToday, challengeXpReward);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Dzisiejsze misje</Text>
      <View style={{ gap: theme.spacing(1.5) }}>
        {missions.map((mission) => (
          <View key={mission.id} style={styles.row}>
            <View style={[styles.iconWrap, mission.completed && { backgroundColor: theme.colors.accentSoft }]}>
              <Text style={{ fontSize: 18 }}>{mission.completed ? "✅" : mission.icon}</Text>
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>{mission.label}</Text>
                {mission.xpReward !== undefined && <Text style={styles.xpBadge}>+{mission.xpReward} XP</Text>}
              </View>
              <View style={styles.track}>
                <View
                  style={[
                    styles.fill,
                    {
                      width: `${(mission.current / mission.target) * 100}%`,
                      backgroundColor: mission.completed ? theme.colors.success : theme.colors.primary,
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing(2),
    gap: theme.spacing(1.5),
  },
  title: {
    fontSize: 13,
    fontWeight: "800",
    color: theme.colors.ink,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: theme.radius.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surfaceMuted,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 12.5,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  xpBadge: {
    fontSize: 10.5,
    fontWeight: "800",
    color: theme.colors.accent,
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.surfaceMuted,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 3,
  },
});
