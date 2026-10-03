import { useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import { router } from "expo-router";
import { DarkButton } from "@/components/exercises/DarkButton";
import { ExerciseRenderer, hasAnswerToCheck } from "@/components/exercises/ExerciseRenderer";
import { SoltekMascot } from "@/components/SoltekMascot";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { usePlan } from "@/context/PlanContext";
import { getWorldContent } from "@/data/lessons";
import { WORLDS, getWorldById } from "@/data/worlds";
import { stopAllScheduledAudio } from "@/lib/audio/rhythmPlayer";
import { t } from "@/lib/i18n/translate";
import type { TranslationKey } from "@/lib/i18n/translate";
import { placementQuestionLine, placementResultLine } from "@/lib/plan/soltekLines";
import { LEVEL_HINT, LEVEL_LABEL, MIN_PLAN_WEEKS, PACE_OPTIONS, STUDY_DAYS_PER_WEEK } from "@/lib/plan/labels";
import { buildPath } from "@/lib/plan/personalPath";
import {
  applyPlacementAnswer,
  completeLevels,
  currentPlacementWorld,
  pickPlacementExercise,
  startPlacement,
  testableWorldIds,
} from "@/lib/plan/placement";
import type { PlacementLevel, PlacementState } from "@/lib/plan/placement";
import { addDays, formatShortPolishDate } from "@/lib/plan/dates";
import { buildSchedule, lessonMinutes } from "@/lib/plan/schedule";
import { generateExercise } from "@/lib/questions/generate";
import { isAnswerCorrect } from "@/lib/questions/validate";
import { todayISODate } from "@/lib/gamification/activity";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { AnswerInput, GeneratedExercise } from "@/types/exercises";

type Stage = "intro" | "question" | "result";

const LEVEL_COLOR: Record<PlacementLevel, string> = { 0: theme.colors.warning, 1: "#E0A100", 2: theme.colors.success };

/** The placement test: an adaptive run of choose-the-answer questions, at
 * most two per world (see lib/plan/placement.ts), no hearts and no XP, no
 * right/wrong feedback — it only measures. The result screen turns the
 * per-world levels into a personal study path (lib/plan/personalPath.ts)
 * and lets the player pick a daily pace before starting the plan. */
export default function PlacementScreen() {
  const { plan, applyPlacement, startWithGame } = usePlan();
  const worldIds = useMemo(() => testableWorldIds(WORLDS, getWorldContent), []);
  const [stage, setStage] = useState<Stage>("intro");
  const [state, setState] = useState<PlacementState>(() => startPlacement(worldIds));
  const [exercise, setExercise] = useState<GeneratedExercise | null>(null);
  const [answer, setAnswer] = useState<AnswerInput | null>(null);
  const [minutesPerDay, setMinutesPerDay] = useState<number>(plan.minutesPerDay);
  const usedIds = useRef(new Set<string>());
  const totalEstimate = worldIds.length * 2;

  // Whatever the previous question was still playing (a melody, a click track) stops
  // the instant the next question appears or the screen is left.
  useEffect(() => stopAllScheduledAudio, [exercise?.id]);

  function loadQuestion(next: PlacementState): PlacementState {
    stopAllScheduledAudio();
    // A world whose question can't be built is recorded as "do nauki" and skipped,
    // never an infinite loop.
    let current = next;
    while (!current.done) {
      const worldId = currentPlacementWorld(current)!;
      const content = getWorldContent(worldId);
      const definition = content ? pickPlacementExercise(content, current.tier, usedIds.current) : null;
      if (definition) {
        usedIds.current.add(definition.id);
        setExercise(generateExercise(definition, "pl"));
        setAnswer(null);
        return current;
      }
      current = applyPlacementAnswer(current, false);
    }
    setExercise(null);
    return current;
  }

  function begin() {
    usedIds.current = new Set();
    const first = loadQuestion(startPlacement(worldIds));
    setState(first);
    setStage(first.done ? "result" : "question");
  }

  function submit(known: boolean) {
    if (!exercise) return;
    const correct = known && answer !== null && isAnswerCorrect(exercise, answer);
    const advanced = loadQuestion(applyPlacementAnswer(state, correct));
    setState(advanced);
    if (advanced.done) setStage("result");
  }

  function startFromBeginning() {
    stopAllScheduledAudio();
    startWithGame();
    router.replace("/(main)/map");
  }

  if (stage === "intro") {
    return (
      <View style={styles.root}>
        <ScreenHeader title="Test poziomujący" onBack={() => (router.canGoBack() ? router.back() : router.replace("/(main)/map"))} />
        <ScrollView contentContainerStyle={styles.content}>
          <SoltekMascot
            size="lg"
            expression="glowny"
            frameless
            message={`Cześć, tu Solfek! Zadam Ci po 1–2 pytania z każdej krainy (razem ok. ${totalEstimate - 2}–${totalEstimate}, ok. 8–10 minut). Jeśli pójdzie dobrze, następne będzie trudniejsze; jeśli nie — łatwiejsze.`}
          />
          <Text style={styles.heading}>Test poziomujący z Solfkiem</Text>
          <View style={styles.bullets}>
            <Bullet text="Nic nie tracisz: bez punktów i ocen." />
            <Bullet text="Nie wiesz? Naciśnij „Nie wiem” — zamiast zgadywać." />
            <Bullet text="Z wyniku ułożymy ścieżkę: pominiesz to, co umiesz, i zaplanujemy resztę na ok. 3 miesiące." />
          </View>
          <View style={{ gap: theme.spacing(1.25), width: "100%" }}>
            <DarkButton label="Zaczynamy test z Solfkiem" onPress={begin} />
            <DarkButton label="Zacznij od gry (tryb zabawy)" onPress={startFromBeginning} variant="secondary" />
          </View>
        </ScrollView>
      </View>
    );
  }

  if (stage === "question" && exercise) {
    const worldId = currentPlacementWorld(state);
    const world = worldId ? getWorldById(worldId) : undefined;
    return (
      <View style={styles.root}>
        <ScreenHeader
          title={`Pytanie ${state.answered + 1}`}
          onBack={() => {
            stopAllScheduledAudio();
            setStage("intro");
          }}
        />
        <View style={styles.barWrap}>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${Math.min(100, (state.answered / totalEstimate) * 100)}%` }]} />
          </View>
          {world && <Text style={styles.worldTag}>{t(world.nameKey as TranslationKey)}</Text>}
          {world && (() => {
            const line = placementQuestionLine(state.answered, totalEstimate, t(world.nameKey as TranslationKey));
            return <SoltekMascot size="sm" expression={line.expression} message={line.message} />;
          })()}
        </View>
        <ScrollView contentContainerStyle={styles.questionArea} keyboardShouldPersistTaps="handled">
          <ExerciseRenderer key={exercise.id} exercise={exercise} answer={answer} onAnswerChange={setAnswer} checked={false} isCorrect={null} locale="pl" />
        </ScrollView>
        <View style={styles.footer}>
          <DarkButton label="Dalej" onPress={() => submit(true)} disabled={!hasAnswerToCheck(answer)} />
          <DarkButton label="Nie wiem" onPress={() => submit(false)} variant="secondary" />
        </View>
      </View>
    );
  }

  // --- result
  const levels = completeLevels(state.levels, WORLDS.map((world) => world.id));
  const personal = buildPath(WORLDS, getWorldContent, levels);
  const original = buildPath(WORLDS, getWorldContent, null);
  const minutesOf = (entries: typeof personal) => entries.reduce((sum, entry) => sum + lessonMinutes(entry.exerciseCount), 0);
  const days = buildSchedule(personal.map((e) => ({ lessonId: e.lessonId, minutes: lessonMinutes(e.exerciseCount) })), minutesPerDay, todayISODate());
  const weeks = Math.max(1, Math.ceil(days.length / STUDY_DAYS_PER_WEEK));
  const endISO = days.length > 0 ? days[days.length - 1].dateISO : addDays(todayISODate(), 0);
  const totalWeeks = Math.max(weeks, MIN_PLAN_WEEKS);
  const personalHours = Math.round(minutesOf(personal) / 60);
  const originalHours = Math.round(minutesOf(original) / 60);
  const masteredWorlds = worldIds.filter((id) => levels[id] === 2).length;
  const resultLine = placementResultLine(masteredWorlds, worldIds.length, personal.length, original.length);
  return (
    <View style={styles.root}>
      <ScreenHeader title="Twój wynik" onBack={() => setStage("intro")} />
      <ScrollView contentContainerStyle={styles.content}>
        <SoltekMascot
          size="lg"
          expression={resultLine.expression}
          frameless
          message={resultLine.message}
        />
        <Text style={styles.heading}>Twoja ścieżka jest gotowa</Text>
        <View style={styles.card}>
          {WORLDS.map((world) => {
            const level = levels[world.id] ?? 0;
            const tested = state.levels[world.id] !== undefined;
            return (
              <View key={world.id} style={styles.levelRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.levelName}>{t(world.nameKey as TranslationKey)}</Text>
                  <Text style={styles.muted}>
                    {LEVEL_HINT[level]}
                    {tested ? "" : " (wyliczone z innych krain)"}
                  </Text>
                </View>
                <View style={[styles.chip, { borderColor: LEVEL_COLOR[level] }]}>
                  <Text style={[styles.chipText, { color: LEVEL_COLOR[level] }]}>{LEVEL_LABEL[level]}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Ile czasu dziennie masz?</Text>
          <View style={styles.paceRow}>
            {PACE_OPTIONS.map((minutes) => (
              <DarkButton key={minutes} label={`${minutes} min`} onPress={() => setMinutesPerDay(minutes)} variant={minutes === minutesPerDay ? "primary" : "secondary"} />
            ))}
          </View>
          <Text style={styles.body}>
            Do przerobienia: <Text style={styles.strong}>{personal.length} z {original.length} lekcji</Text> (ok. {personalHours} godz.
            {personalHours < originalHours ? ` zamiast ${originalHours} godz.` : ""}). Przy {minutesPerDay} min dziennie, {STUDY_DAYS_PER_WEEK} dni w tygodniu: nowa nauka{" "}
            <Text style={styles.strong}>ok. {weeks} tyg.</Text>, do ok. {formatShortPolishDate(endISO)}.
            {totalWeeks > weeks ? ` Potem plan trwa dalej powtórkami i wyzwaniami — łącznie ok. ${totalWeeks} tygodni (ok. ${Math.round(totalWeeks / 4.3)} miesięcy).` : ""}
          </Text>
        </View>

        <DarkButton
          label="Zacznij mój plan"
          onPress={() => {
            applyPlacement(levels, minutesPerDay);
            router.replace("/(main)/map");
          }}
        />
        <DarkButton label="Zacznij od gry (tryb zabawy)" onPress={startFromBeginning} variant="secondary" />
      </ScrollView>
    </View>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <View style={{ flexDirection: "row", gap: 8 }}>
      <Text style={{ color: theme.colors.primary, fontWeight: "800" }}>•</Text>
      <Text style={[styles.body, { flex: 1, textAlign: "left" }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.cream },
  content: { padding: 20, gap: theme.spacing(2), alignItems: "center", paddingBottom: 40 },
  emoji: { fontSize: 44 },
  heading: { fontSize: theme.fontSize.heading, fontWeight: "800", color: theme.colors.ink, textAlign: "center" },
  body: { fontSize: theme.fontSize.body * 0.95, color: theme.colors.muted, textAlign: "center", lineHeight: 22 },
  strong: { color: theme.colors.ink, fontWeight: "800" },
  muted: { fontSize: 12, color: theme.colors.muted },
  bullets: { width: "100%", gap: 8 },
  barWrap: { paddingHorizontal: 20, gap: 6 },
  barTrack: { height: 8, borderRadius: 4, backgroundColor: theme.colors.surfaceMuted, overflow: "hidden" },
  barFill: { height: "100%", backgroundColor: theme.colors.primary, borderRadius: 4 },
  worldTag: { fontSize: 12, fontWeight: "700", color: theme.colors.muted },
  questionArea: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 24, paddingVertical: 16 },
  footer: { paddingHorizontal: 24, paddingBottom: 24, gap: theme.spacing(1.25) },
  card: {
    width: "100%",
    backgroundColor: theme.colors.surface,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing(2),
    gap: theme.spacing(1.25),
  },
  levelRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  levelName: { fontSize: 13.5, fontWeight: "700", color: theme.colors.ink },
  chip: { borderWidth: 2, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  chipText: { fontSize: 12, fontWeight: "800" },
  sectionTitle: { fontSize: 13, fontWeight: "800", color: theme.colors.ink },
  paceRow: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing(1) },
});
