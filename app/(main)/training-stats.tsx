import { Pressable, ScrollView, Text, View, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DarkButton } from "@/components/exercises/DarkButton";
import { useGamification } from "@/context/GamificationContext";
import { usePlan } from "@/context/PlanContext";
import { todayISODate } from "@/lib/gamification/activity";
import { MIN_ANSWERS_FOR_STATS } from "@/lib/training/rewards";
import { lastWeek, percent, weakestTopics } from "@/lib/training/stats";
import { TRAINING_TOPICS } from "@/lib/training/topics";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

/** "Twój słuch": how the player does in every topic of Tryb własny (all time and the last 7 days), the weakest one marked,
 * and a button that starts a practice session on the weakest topics. */
export default function TrainingStatsScreen() {
  const insets = useSafeAreaInsets();
  const { state } = useGamification();
  const { setView } = usePlan();
  const training = state.training;
  const today = todayISODate();
  const weakest = weakestTopics(training, 2);
  const answered = Object.values(training.totals).reduce((sum, tally) => sum + tally.total, 0);

  function back() {
    setView("own");
    router.replace("/(main)/map");
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top + 16 }]}>
      <View style={styles.header}>
        <Pressable onPress={back} accessibilityRole="button" accessibilityLabel="Wstecz" hitSlop={12} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Twój słuch</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: insets.bottom + 32, gap: theme.spacing(1.5) }} testID="training-stats">
        <Text style={styles.body}>
          {answered === 0
            ? "Tu zobaczysz, w czym jesteś dobry. Zrób kilka zadań w Trybie własnym."
            : `Odpowiedziałeś w Trybie własnym ${answered} razy. Procent liczy się od ${MIN_ANSWERS_FOR_STATS} odpowiedzi w temacie.`}
        </Text>
        {TRAINING_TOPICS.map((topic) => {
          const total = training.totals[topic.id];
          const week = lastWeek(training, topic.id, today);
          const value = percent(total);
          const enough = (total?.total ?? 0) >= MIN_ANSWERS_FOR_STATS;
          const weak = weakest.includes(topic.id);
          return (
            <View key={topic.id} style={[styles.card, weak && styles.cardWeak]}>
              <View style={styles.row}>
                <Text style={styles.topic}>{topic.label}</Text>
                <Text style={styles.percent}>{value === null ? "–" : `${value}%`}</Text>
              </View>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${value ?? 0}%`, backgroundColor: !enough ? theme.colors.muted : (value ?? 0) >= 70 ? theme.colors.success : theme.colors.primary }]} />
              </View>
              <Text style={styles.small}>
                {total ? `${total.correct} z ${total.total} poprawnych` : "Jeszcze bez odpowiedzi"}
                {week.total > 0 ? ` · ten tydzień: ${percent(week)}% (${week.total})` : ""}
                {weak ? " · do poćwiczenia" : ""}
              </Text>
            </View>
          );
        })}
        <Text style={styles.small}>Rekordy: seria {training.bestStreak} · na czas {training.bestTimed}</Text>
        {weakest.length > 0 && (
          <DarkButton
            label="Ćwicz najsłabsze"
            onPress={() => router.push({ pathname: "/(main)/training", params: { topics: weakest.join(","), difficulty: "mieszane", mode: "trening", length: "inf" } })}
          />
        )}
        <DarkButton label="Wróć do Trybu własnego" onPress={back} variant="secondary" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.cream },
  header: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 16, marginBottom: 8 },
  backButton: { width: 40, height: 40, borderRadius: theme.radius.md, backgroundColor: theme.colors.surface, borderWidth: theme.borderWidth, borderColor: theme.colors.border, alignItems: "center", justifyContent: "center" },
  backIcon: { fontSize: 20, color: theme.colors.ink },
  headerTitle: { fontSize: 16, fontWeight: "800", color: theme.colors.primary },
  body: { fontSize: 13.5, lineHeight: 19, color: theme.colors.muted },
  card: { backgroundColor: theme.colors.surface, borderWidth: theme.borderWidth, borderColor: theme.colors.border, borderRadius: theme.radius.lg, padding: theme.spacing(1.75), gap: 8 },
  cardWeak: { borderColor: theme.colors.primary },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  topic: { fontSize: 15, fontWeight: "800", color: theme.colors.ink },
  percent: { fontSize: 15, fontWeight: "800", color: theme.colors.primary },
  track: { height: 10, borderRadius: 5, backgroundColor: theme.colors.surfaceMuted, overflow: "hidden" },
  fill: { height: 10, borderRadius: 5 },
  small: { fontSize: 12, color: theme.colors.muted },
});
