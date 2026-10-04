import { useState } from "react";
import { Pressable, ScrollView, Text, View, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DarkButton } from "@/components/exercises/DarkButton";
import { useGamification } from "@/context/GamificationContext";
import { useSubscription } from "@/context/SubscriptionContext";
import { buildPool, topicAvailable } from "@/lib/training/pool";
import { TIMED_SECONDS, SERIES_LIVES, MIN_ANSWERS_FOR_STATS } from "@/lib/training/rewards";
import { percent, weakestTopics } from "@/lib/training/stats";
import { DIFFICULTY_OPTIONS, TRAINING_TOPICS, getTopic } from "@/lib/training/topics";
import type { TrainingDifficulty } from "@/lib/training/topics";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

type GameMode = "trening" | "seria" | "czas";
type Length = "10" | "20" | "inf";

/** Tryb własny, the start screen: the player picks what to practise (topics), how hard, and how to play, then starts an endless session
 * (app/(main)/training.tsx). Shown on the map when "Tryb własny" is selected. Practice never touches the progress of the other two modes. */
export function TrainingHome() {
  const insets = useSafeAreaInsets();
  const { state } = useGamification();
  const { status } = useSubscription();
  const training = state.training;
  const [topics, setTopics] = useState<string[]>(["nuty"]);
  const [difficulty, setDifficulty] = useState<TrainingDifficulty>("mieszane");
  const [mode, setMode] = useState<GameMode>("trening");
  const [length, setLength] = useState<Length>("inf");

  const weakest = weakestTopics(training, 3);
  const poolSize = topics.length ? buildPool(topics, difficulty, status.isActive).length : 0;

  function toggleTopic(id: string) {
    setTopics((current) => (current.includes(id) ? current.filter((topic) => topic !== id) : [...current, id]));
  }

  function start(chosen: string[]) {
    router.push({ pathname: "/(main)/training", params: { topics: chosen.join(","), difficulty, mode, length } });
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={{ paddingTop: insets.top + 176, paddingBottom: insets.bottom + 40, paddingHorizontal: 16, gap: theme.spacing(1.75) }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        <Text style={styles.heading}>Tryb własny</Text>
        <Text style={styles.body}>Ćwiczysz to, co chcesz, w swoim tempie. Zadania losują się same i nigdy się nie kończą, a gra liczy, w czym jesteś mocny, a co jeszcze szwankuje.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Twój słuch</Text>
        {weakest.length > 0 ? (
          <>
            <Text style={styles.body}>
              Najsłabiej idzie Ci: {weakest.map((id) => `${getTopic(id)?.label} (${percent(training.totals[id])}%)`).join(", ")}.
            </Text>
            <DarkButton label="Ćwicz najsłabsze" onPress={() => start(weakest.slice(0, 2))} />
          </>
        ) : (
          <Text style={styles.body}>Zrób kilka zadań (min. {MIN_ANSWERS_FOR_STATS} w jednym temacie), a pokażę Ci, w czym jesteś dobry i co poćwiczyć.</Text>
        )}
        <Pressable onPress={() => router.push("/(main)/training-stats")} accessibilityRole="button">
          <Text style={styles.link}>Zobacz wszystkie statystyki ›</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Co ćwiczysz?</Text>
        {TRAINING_TOPICS.map((topic) => {
          const available = topicAvailable(topic.id, status.isActive);
          const on = topics.includes(topic.id);
          const tally = percent(training.totals[topic.id]);
          return (
            <Pressable
              key={topic.id}
              testID={`training-topic-${topic.id}`}
              onPress={() => available && toggleTopic(topic.id)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: on, disabled: !available }}
              style={[styles.topic, on && styles.topicOn, !available && styles.topicLocked]}
            >
              <View style={[styles.check, on && styles.checkOn]}>{on && <Text style={styles.checkMark}>✓</Text>}</View>
              <View style={{ flex: 1 }}>
                <Text style={styles.topicLabel}>{topic.label}{!available ? "  🔒" : ""}</Text>
                <Text style={styles.topicDesc}>{topic.description}</Text>
              </View>
              {tally !== null && <Text style={styles.topicPercent}>{tally}%</Text>}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Jak trudno?</Text>
        <View style={styles.chips}>
          {DIFFICULTY_OPTIONS.map((option) => (
            <Chip key={option.id} label={option.label} active={difficulty === option.id} onPress={() => setDifficulty(option.id)} />
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Jak grasz?</Text>
        <ModeRow
          active={mode === "trening"}
          title="Spokojny trening"
          description="Bez presji: ćwiczysz, ile chcesz."
          onPress={() => setMode("trening")}
          testID="training-mode-trening"
        />
        {mode === "trening" && (
          <View style={styles.chips}>
            <Chip label="10 zadań" active={length === "10"} onPress={() => setLength("10")} />
            <Chip label="20 zadań" active={length === "20"} onPress={() => setLength("20")} />
            <Chip label="Bez końca" active={length === "inf"} onPress={() => setLength("inf")} />
          </View>
        )}
        <ModeRow
          active={mode === "seria"}
          title="Seria"
          description={`Poprawne odpowiedzi z rzędu, koniec po ${SERIES_LIVES} błędach. Rekord: ${training.bestStreak}.`}
          onPress={() => setMode("seria")}
          testID="training-mode-seria"
        />
        <ModeRow
          active={mode === "czas"}
          title={`Na czas (${TIMED_SECONDS} s)`}
          description={`Ile poprawnych odpowiedzi zdążysz w ${TIMED_SECONDS} sekund. Rekord: ${training.bestTimed}.`}
          onPress={() => setMode("czas")}
          testID="training-mode-czas"
        />
      </View>

      <View style={styles.card}>
        {topics.length === 0 ? (
          <Text style={styles.body}>Zaznacz przynajmniej jeden temat.</Text>
        ) : (
          <Text style={styles.body}>
            Wybrane tematy: {topics.map((id) => getTopic(id)?.label).join(", ")}. W puli jest {poolSize} zadań, losowanych bez końca.
          </Text>
        )}
        <DarkButton label="Start" onPress={() => start(topics)} disabled={topics.length === 0} testID="training-start" />
      </View>
    </ScrollView>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityState={{ selected: active }} style={[styles.chip, active && styles.chipOn]}>
      <Text style={[styles.chipText, active && styles.chipTextOn]}>{label}</Text>
    </Pressable>
  );
}

function ModeRow({ active, title, description, onPress, testID }: { active: boolean; title: string; description: string; onPress: () => void; testID?: string }) {
  return (
    <Pressable onPress={onPress} testID={testID} accessibilityRole="radio" accessibilityState={{ checked: active }} style={[styles.topic, active && styles.topicOn]}>
      <View style={[styles.radio, active && styles.radioOn]}>{active && <View style={styles.radioDot} />}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.topicLabel}>{title}</Text>
        <Text style={styles.topicDesc}>{description}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  card: {
    backgroundColor: theme.colors.surface,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: theme.spacing(2),
    gap: theme.spacing(1.25),
  },
  heading: { fontSize: 20, fontWeight: "800", color: theme.colors.ink },
  cardTitle: { fontSize: 15, fontWeight: "800", color: theme.colors.ink },
  body: { fontSize: 13.5, lineHeight: 19, color: theme.colors.muted },
  link: { fontSize: 12.5, fontWeight: "800", color: theme.colors.primary, textAlign: "center" },
  topic: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: theme.radius.md,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.cream,
  },
  topicOn: { borderColor: theme.colors.primary, backgroundColor: theme.colors.accentSoft },
  topicLocked: { opacity: 0.5 },
  topicLabel: { fontSize: 14.5, fontWeight: "800", color: theme.colors.ink },
  topicDesc: { fontSize: 12, lineHeight: 16, color: theme.colors.muted },
  topicPercent: { fontSize: 13, fontWeight: "800", color: theme.colors.primary },
  check: { width: 24, height: 24, borderRadius: 7, borderWidth: 2, borderColor: theme.colors.border, alignItems: "center", justifyContent: "center", backgroundColor: theme.colors.surface },
  checkOn: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  checkMark: { color: "#FFFFFF", fontWeight: "900", fontSize: 14 },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: theme.colors.border, alignItems: "center", justifyContent: "center", backgroundColor: theme.colors.surface },
  radioOn: { borderColor: theme.colors.primary },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: theme.colors.primary },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, backgroundColor: theme.colors.cream, borderWidth: theme.borderWidth, borderColor: theme.colors.border },
  chipOn: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  chipText: { fontSize: 13, fontWeight: "800", color: theme.colors.ink },
  chipTextOn: { color: "#FFFFFF" },
});
