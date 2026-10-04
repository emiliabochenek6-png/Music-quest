import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, Text, View, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DarkButton } from "@/components/exercises/DarkButton";
import { ExerciseRenderer, hasAnswerToCheck } from "@/components/exercises/ExerciseRenderer";
import { ExerciseAccentProvider } from "@/context/ExerciseAccentContext";
import { useGamification } from "@/context/GamificationContext";
import { usePlan } from "@/context/PlanContext";
import { useSubscription } from "@/context/SubscriptionContext";
import { stopAllScheduledAudio } from "@/lib/audio/rhythmPlayer";
import { generateExercise } from "@/lib/questions/generate";
import { isAnswerCorrect } from "@/lib/questions/validate";
import { buildPool, pickNext } from "@/lib/training/pool";
import type { PoolItem } from "@/lib/training/pool";
import { SERIES_LIVES, TIMED_SECONDS, TRAINING_NUTKI_PER_CORRECT, TRAINING_XP_PER_CORRECT } from "@/lib/training/rewards";
import { decodeSelection, getTopic } from "@/lib/training/topics";
import type { TrainingDifficulty } from "@/lib/training/topics";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { AnswerInput, GeneratedExercise } from "@/types/exercises";

type GameMode = "trening" | "seria" | "czas";

/** Tryb własny: an endless, random practice session over the topics the player picked (components/training/TrainingHome.tsx).
 * It never touches lesson progress, stars or the plan; it only records answers for "Twój słuch" and pays a small, capped reward. */
export default function TrainingScreen() {
  return (
    <ExerciseAccentProvider color={null}>
      <TrainingBody />
    </ExerciseAccentProvider>
  );
}

interface Summary {
  asked: number;
  correct: number;
  bestRun: number;
  perTopic: Record<string, { correct: number; total: number }>;
  newRecord: boolean;
  reason: "koniec" | "bledy" | "czas" | "wyjscie";
}

function TrainingBody() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ topics?: string; options?: string; difficulty?: string; mode?: string; length?: string }>();
  const selection = useMemo(() => decodeSelection(params.topics ?? "", params.options ?? ""), [params.topics, params.options]);
  const topicIds = selection.topicIds;
  const difficulty = (params.difficulty ?? "mieszane") as TrainingDifficulty;
  const mode = (["trening", "seria", "czas"].includes(params.mode ?? "") ? params.mode : "trening") as GameMode;
  const limit = params.length === "10" ? 10 : params.length === "20" ? 20 : null; // only "Spokojny trening" has a length
  const { state, recordTrainingAnswer, recordTrainingBest } = useGamification();
  const { setView } = usePlan();
  const { status } = useSubscription();
  const pool = useMemo(() => buildPool(selection, difficulty, status.isActive), [selection, difficulty, status.isActive]);

  const [item, setItem] = useState<PoolItem | null>(null);
  const [exercise, setExercise] = useState<GeneratedExercise | null>(null);
  const [answer, setAnswer] = useState<AnswerInput | null>(null);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [reward, setReward] = useState<{ xp: number; nutki: number } | null>(null);
  const [counts, setCounts] = useState({ asked: 0, correct: 0, wrong: 0, run: 0, bestRun: 0 });
  const [perTopic, setPerTopic] = useState<Record<string, { correct: number; total: number }>>({});
  const [secondsLeft, setSecondsLeft] = useState(TIMED_SECONDS);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [round, setRound] = useState(0); // a new value restarts the session ("Jeszcze raz")
  const recent = useRef<string[]>([]);
  const recordsAtStart = useRef({ streak: state.training.bestStreak, timed: state.training.bestTimed });
  const finished = summary !== null;

  const loadNext = useCallback(() => {
    stopAllScheduledAudio();
    for (let attempt = 0; attempt < 6; attempt++) {
      const next = pickNext(pool, recent.current.slice(-8));
      if (!next) return;
      try {
        const generated = generateExercise(next.definition, "pl");
        recent.current = [...recent.current, next.definition.id].slice(-30);
        setItem(next);
        setExercise(generated);
        setAnswer(null);
        setChecked(false);
        setIsCorrect(null);
        setReward(null);
        return;
      } catch {
        // an exercise that cannot be generated is skipped
      }
    }
  }, [pool]);

  // (Re)start
  useEffect(() => {
    recent.current = [];
    setCounts({ asked: 0, correct: 0, wrong: 0, run: 0, bestRun: 0 });
    setPerTopic({});
    setSecondsLeft(TIMED_SECONDS);
    setSummary(null);
    recordsAtStart.current = { streak: state.training.bestStreak, timed: state.training.bestTimed };
    loadNext();
    return () => stopAllScheduledAudio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, loadNext]);

  const finish = useCallback(
    (reason: Summary["reason"], finalCounts = counts, finalTopics = perTopic) => {
      stopAllScheduledAudio();
      let newRecord = false;
      if (mode === "seria" && finalCounts.bestRun > recordsAtStart.current.streak) {
        recordTrainingBest("streak", finalCounts.bestRun);
        newRecord = true;
      }
      if (mode === "czas" && finalCounts.correct > recordsAtStart.current.timed) {
        recordTrainingBest("timed", finalCounts.correct);
        newRecord = true;
      }
      setSummary({ asked: finalCounts.asked, correct: finalCounts.correct, bestRun: finalCounts.bestRun, perTopic: finalTopics, newRecord, reason });
    },
    [counts, perTopic, mode, recordTrainingBest]
  );

  // The 60 seconds of "Na czas"
  useEffect(() => {
    if (mode !== "czas" || finished) return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [mode, finished, round]);
  useEffect(() => {
    if (mode === "czas" && !finished && secondsLeft <= 0) finish("czas");
  }, [secondsLeft, mode, finished, finish]);

  function leave() {
    stopAllScheduledAudio();
    setView("own");
    router.replace("/(main)/map");
  }

  const endsHere = (next: { asked: number; wrong: number }) => (limit !== null && next.asked >= limit) || (mode === "seria" && next.wrong >= SERIES_LIVES);

  function handleCheck() {
    if (!answer || !exercise || !item) return;
    stopAllScheduledAudio();
    const correct = isAnswerCorrect(exercise, answer);
    const paid = recordTrainingAnswer(item.topicId, correct);
    setChecked(true);
    setIsCorrect(correct);
    setReward(paid.xp > 0 ? paid : null);
    const run = correct ? counts.run + 1 : 0;
    const next = { asked: counts.asked + 1, correct: counts.correct + (correct ? 1 : 0), wrong: counts.wrong + (correct ? 0 : 1), run, bestRun: Math.max(counts.bestRun, run) };
    const topics = { ...perTopic, [item.topicId]: { correct: (perTopic[item.topicId]?.correct ?? 0) + (correct ? 1 : 0), total: (perTopic[item.topicId]?.total ?? 0) + 1 } };
    setCounts(next);
    setPerTopic(topics);
    if (mode === "czas") {
      // fast game: go straight on (the countdown is running)
      setTimeout(() => {
        if (endsHere(next)) finish("koniec", next, topics);
        else loadNext();
      }, correct ? 450 : 900);
    }
  }

  function handleContinue() {
    if (endsHere(counts)) finish(mode === "seria" && counts.wrong >= SERIES_LIVES ? "bledy" : "koniec");
    else loadNext();
  }

  const lastOne = checked && endsHere(counts);

  if (pool.length === 0 || (!exercise && !finished)) {
    return (
      <View style={[styles.root, { paddingTop: insets.top + 16 }]}>
        <Header onBack={leave} title="Tryb własny" />
        <View style={styles.center}>
          <Text style={styles.muted}>{pool.length === 0 ? "Brak zadań dla tego wyboru. Wróć i wybierz inny temat." : "Ładuję zadanie…"}</Text>
          {pool.length === 0 && <DarkButton label="Wróć" onPress={leave} />}
        </View>
      </View>
    );
  }

  if (summary) {
    return <SummaryView summary={summary} mode={mode} topicIds={topicIds} onAgain={() => setRound((r) => r + 1)} onLeave={leave} onStats={() => router.push("/(main)/training-stats")} insetsTop={insets.top} insetsBottom={insets.bottom} records={state.training} />;
  }

  const status2 =
    mode === "czas" ? `Czas: ${Math.max(0, secondsLeft)} s · poprawne: ${counts.correct}` : mode === "seria" ? `Seria: ${counts.run} · błędy: ${counts.wrong}/${SERIES_LIVES}` : `Zadanie ${counts.asked + (checked ? 0 : 1)}${limit ? ` z ${limit}` : ""} · poprawne: ${counts.correct}`;

  return (
    <View style={[styles.root, { paddingTop: insets.top + 16 }]}>
      <Header onBack={() => finish("wyjscie")} title={getTopic(item?.topicId ?? "")?.label ?? "Tryb własny"} right={status2} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.exerciseScroll}>
        {exercise && (
          <ExerciseRenderer key={exercise.id + counts.asked} exercise={exercise} answer={answer} onAnswerChange={setAnswer} checked={checked} isCorrect={isCorrect} locale="pl" />
        )}
      </ScrollView>
      <View style={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 16, gap: 8 }}>
        {checked && (
          <Text style={[styles.feedback, { color: isCorrect ? theme.colors.success : theme.colors.warning }]}>
            {isCorrect ? "Świetnie!" : "Niestety, to nie ta odpowiedź."}
            {reward ? `  +${TRAINING_XP_PER_CORRECT} XP · +${TRAINING_NUTKI_PER_CORRECT} nutka` : isCorrect ? "  (dzienny limit nagród wykorzystany)" : ""}
          </Text>
        )}
        {mode !== "czas" &&
          (checked ? (
            <DarkButton label={lastOne ? "Zobacz wynik" : "Dalej"} onPress={handleContinue} testID="training-next" />
          ) : (
            <DarkButton label="Sprawdź" onPress={handleCheck} disabled={!hasAnswerToCheck(answer)} testID="training-check" />
          ))}
        {mode === "czas" && !checked && <DarkButton label="Sprawdź" onPress={handleCheck} disabled={!hasAnswerToCheck(answer)} testID="training-check" />}
      </View>
    </View>
  );
}

function Header({ onBack, title, right }: { onBack: () => void; title: string; right?: string }) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Zakończ trening" hitSlop={12} style={styles.backButton}>
        <Text style={styles.backIcon}>‹</Text>
      </Pressable>
      <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
      {right && <Text style={styles.headerRight} testID="training-status">{right}</Text>}
    </View>
  );
}

function SummaryView({
  summary,
  mode,
  topicIds,
  onAgain,
  onLeave,
  onStats,
  insetsTop,
  insetsBottom,
  records,
}: {
  summary: Summary;
  mode: GameMode;
  topicIds: string[];
  onAgain: () => void;
  onLeave: () => void;
  onStats: () => void;
  insetsTop: number;
  insetsBottom: number;
  records: { bestStreak: number; bestTimed: number };
}) {
  const percentCorrect = summary.asked > 0 ? Math.round((summary.correct / summary.asked) * 100) : 0;
  const reasonText = summary.reason === "bledy" ? "Koniec serii: trzy błędy." : summary.reason === "czas" ? "Czas minął!" : summary.reason === "koniec" ? "Koniec treningu." : "Trening zakończony.";
  return (
    <View style={[styles.root, { paddingTop: insetsTop + 16 }]} testID="training-summary">
      <Header onBack={onLeave} title="Wynik treningu" />
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: insetsBottom + 24, gap: theme.spacing(1.5) }}>
        <View style={styles.card}>
          <Text style={styles.reason}>{reasonText}</Text>
          <Text style={styles.big}>{summary.correct} z {summary.asked}</Text>
          <Text style={styles.muted}>poprawnych odpowiedzi ({percentCorrect}%)</Text>
          {mode === "seria" && <Text style={styles.line}>Najdłuższa seria: {summary.bestRun} · rekord: {Math.max(records.bestStreak, summary.bestRun)}{summary.newRecord ? "  🎉 nowy rekord!" : ""}</Text>}
          {mode === "czas" && <Text style={styles.line}>Poprawne w {TIMED_SECONDS} s: {summary.correct} · rekord: {Math.max(records.bestTimed, summary.correct)}{summary.newRecord ? "  🎉 nowy rekord!" : ""}</Text>}
          {mode === "trening" && <Text style={styles.line}>Najdłuższa seria poprawnych: {summary.bestRun}</Text>}
        </View>
        {Object.keys(summary.perTopic).length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Tematy w tym treningu</Text>
            {topicIds.filter((id) => summary.perTopic[id]).map((id) => {
              const tally = summary.perTopic[id];
              return (
                <Text key={id} style={styles.line}>
                  {getTopic(id)?.label}: {tally.correct} z {tally.total}
                </Text>
              );
            })}
          </View>
        )}
        <DarkButton label="Jeszcze raz" onPress={onAgain} testID="training-again" />
        <DarkButton label="Twój słuch (statystyki)" onPress={onStats} variant="secondary" />
        <DarkButton label="Zakończ" onPress={onLeave} variant="secondary" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.cream },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16, padding: 24 },
  header: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 16, marginBottom: 8 },
  backButton: { width: 40, height: 40, borderRadius: theme.radius.md, backgroundColor: theme.colors.surface, borderWidth: theme.borderWidth, borderColor: theme.colors.border, alignItems: "center", justifyContent: "center" },
  backIcon: { fontSize: 20, color: theme.colors.ink },
  headerTitle: { flex: 1, fontSize: 15, fontWeight: "800", color: theme.colors.primary },
  headerRight: { fontSize: 12, fontWeight: "800", color: theme.colors.ink },
  exerciseScroll: { paddingHorizontal: 24, paddingBottom: 16, flexGrow: 1 },
  feedback: { textAlign: "center", fontWeight: "800", fontSize: 14 },
  muted: { fontSize: 13, color: theme.colors.muted, textAlign: "center" },
  card: { backgroundColor: theme.colors.surface, borderWidth: theme.borderWidth, borderColor: theme.colors.border, borderRadius: theme.radius.lg, padding: theme.spacing(2), alignItems: "center", gap: 6 },
  cardTitle: { fontSize: 15, fontWeight: "800", color: theme.colors.ink },
  reason: { fontSize: 14, fontWeight: "800", color: theme.colors.primary },
  big: { fontSize: 40, fontWeight: "800", color: theme.colors.ink },
  line: { fontSize: 14, color: theme.colors.ink, textAlign: "center" },
});
