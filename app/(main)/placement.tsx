import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, Text, View, StyleSheet } from "react-native";
import { router } from "expo-router";
import { DarkButton } from "@/components/exercises/DarkButton";
import { ExerciseRenderer, hasAnswerToCheck } from "@/components/exercises/ExerciseRenderer";
import { LeaveLessonModal } from "@/components/exercises/LeaveLessonModal";
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
  // The X in the corner of a question asks "are you sure?" first (a sad Solfek).
  const [confirmLeave, setConfirmLeave] = useState(false);
  // The per-world list of the result screen is folded away until asked for (the screen stays short).
  const [showDetails, setShowDetails] = useState(false);
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
            expression="glowny"
            message={`Cześć, tu Solfek! Zadam Ci po 1–2 pytania z każdej krainy (razem ok. ${totalEstimate - 2}–${totalEstimate}, ok. 8–10 minut). Jeśli pójdzie dobrze, następne będzie trudniejsze; jeśli nie — łatwiejsze.`}
          />
          <Text style={styles.heading}>Test poziomujący z Solfkiem</Text>
          <View style={styles.bullets}>
            <Bullet text="Nic nie tracisz: bez punktów i ocen." />
            <Bullet text="Nie wiesz? Naciśnij „Nie wiem” — zamiast zgadywać." />
            <Bullet text="Z wyniku ułożymy ścieżkę: pominiesz to, co umiesz, i zaplanujemy resztę na ok. 3 miesiące." />
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <DarkButton label="Zaczynamy test z Solfkiem" onPress={begin} />
          <DarkButton label="Zacznij od gry (tryb zabawy)" onPress={startFromBeginning} variant="secondary" />
        </View>
      </View>
    );
  }

  if (stage === "question" && exercise) {
    const worldId = currentPlacementWorld(state);
    const world = worldId ? getWorldById(worldId) : undefined;
    const worldName = world ? t(world.nameKey as TranslationKey) : "";
    const line = world ? placementQuestionLine(state.answered, totalEstimate, worldName) : null;
    return (
      <View style={styles.root}>
        <ScreenHeader title={worldName ? `Pytanie ${state.answered + 1} · ${worldName}` : `Pytanie ${state.answered + 1}`} close onBack={() => setConfirmLeave(true)} />
        <View style={styles.barWrap}>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${Math.min(100, (state.answered / totalEstimate) * 100)}%` }]} />
          </View>
          {line && <SoltekMascot size="sm" expression={line.expression} message={line.message} />}
        </View>
        <ScrollView contentContainerStyle={styles.questionArea} keyboardShouldPersistTaps="handled">
          <ExerciseRenderer key={exercise.id} exercise={exercise} answer={answer} onAnswerChange={setAnswer} checked={false} isCorrect={null} locale="pl" />
        </ScrollView>
        <View style={[styles.footer, styles.footerRow]}>
          <View style={{ flex: 1 }}>
            <DarkButton label="Nie wiem" onPress={() => submit(false)} variant="secondary" />
          </View>
          <View style={{ flex: 2 }}>
            <DarkButton label="Dalej" onPress={() => submit(true)} disabled={!hasAnswerToCheck(answer)} />
          </View>
        </View>
        {confirmLeave && (
          <LeaveLessonModal
            kind="test"
            remaining={Math.max(1, totalEstimate - state.answered)}
            onStay={() => setConfirmLeave(false)}
            onLeave={() => {
              setConfirmLeave(false);
              stopAllScheduledAudio();
              setStage("intro");
            }}
          />
        )}
      </View>
    );
  }

  // --- result: compact, so that nothing has to be scrolled to start the plan (the button sits in a fixed footer)
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
  const countAt = (level: PlacementLevel) => WORLDS.filter((world) => (levels[world.id] ?? 0) === level).length;
  return (
    <View style={styles.root}>
      <ScreenHeader title="Twój wynik" onBack={() => setStage("intro")} />
      <ScrollView contentContainerStyle={styles.resultContent}>
        <SoltekMascot size="sm" expression={resultLine.expression} message={resultLine.message} />

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Twoje krainy</Text>
          <View style={styles.dots}>
            {WORLDS.map((world) => (
              <View key={world.id} accessibilityLabel={`${t(world.nameKey as TranslationKey)}: ${LEVEL_LABEL[(levels[world.id] ?? 0) as PlacementLevel]}`} style={[styles.dot, { backgroundColor: LEVEL_COLOR[(levels[world.id] ?? 0) as PlacementLevel] }]} />
            ))}
          </View>
          <View style={styles.legend}>
            {([2, 1, 0] as PlacementLevel[]).map((level) => (
              <View key={level} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: LEVEL_COLOR[level] }]} />
                <Text style={styles.legendText}>
                  {LEVEL_LABEL[level]}: {countAt(level)}
                </Text>
              </View>
            ))}
          </View>
          <Pressable onPress={() => setShowDetails((value) => !value)} accessibilityRole="button" accessibilityState={{ expanded: showDetails }} hitSlop={8}>
            <Text style={styles.link}>{showDetails ? "Ukryj szczegóły ▴" : "Pokaż szczegóły krain ▾"}</Text>
          </Pressable>
          {showDetails &&
            WORLDS.map((world) => {
              const level = (levels[world.id] ?? 0) as PlacementLevel;
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
              <Pressable
                key={minutes}
                onPress={() => setMinutesPerDay(minutes)}
                accessibilityRole="button"
                accessibilityState={{ selected: minutes === minutesPerDay }}
                style={[styles.pace, minutes === minutesPerDay && styles.paceActive]}
              >
                <Text style={[styles.paceText, minutes === minutesPerDay && styles.paceTextActive]}>{minutes} min</Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.body}>
            <Text style={styles.strong}>{personal.length} z {original.length} lekcji</Text> (ok. {personalHours} godz.
            {personalHours < originalHours ? ` zamiast ${originalHours}` : ""}). Nowa nauka <Text style={styles.strong}>ok. {weeks} tyg.</Text>, do {formatShortPolishDate(endISO)}.
            {totalWeeks > weeks ? ` Potem powtórki i wyzwania: łącznie ok. ${Math.round(totalWeeks / 4.3)} mies.` : ""}
          </Text>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <DarkButton
          label="Zacznij mój plan"
          onPress={() => {
            applyPlacement(levels, minutesPerDay);
            router.replace("/(main)/map");
          }}
        />
      </View>
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
  content: { padding: 20, gap: theme.spacing(1.75), alignItems: "stretch", paddingBottom: 16 },
  resultContent: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 16, gap: theme.spacing(1.25) },
  emoji: { fontSize: 44 },
  heading: { fontSize: theme.fontSize.heading, fontWeight: "800", color: theme.colors.ink, textAlign: "center" },
  body: { fontSize: theme.fontSize.body * 0.95, color: theme.colors.muted, textAlign: "center", lineHeight: 22 },
  strong: { color: theme.colors.ink, fontWeight: "800" },
  muted: { fontSize: 12, color: theme.colors.muted },
  bullets: { width: "100%", gap: 8 },
  barWrap: { paddingHorizontal: 20, gap: 8 },
  barTrack: { height: 8, borderRadius: 4, backgroundColor: theme.colors.surfaceMuted, overflow: "hidden" },
  barFill: { height: "100%", backgroundColor: theme.colors.primary, borderRadius: 4 },
  questionArea: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 24, paddingVertical: 12 },
  footer: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 20, gap: theme.spacing(1) },
  footerRow: { flexDirection: "row", alignItems: "stretch", gap: theme.spacing(1) },
  card: {
    width: "100%",
    backgroundColor: theme.colors.surface,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing(1.75),
    gap: theme.spacing(1),
  },
  levelRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  levelName: { fontSize: 13.5, fontWeight: "700", color: theme.colors.ink },
  chip: { borderWidth: 2, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  chipText: { fontSize: 12, fontWeight: "800" },
  sectionTitle: { fontSize: 14, fontWeight: "800", color: theme.colors.ink },
  dots: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  dot: { width: 20, height: 20, borderRadius: 10 },
  legend: { flexDirection: "row", flexWrap: "wrap", columnGap: 14, rowGap: 4 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12.5, fontWeight: "700", color: theme.colors.ink },
  link: { fontSize: 13, fontWeight: "800", color: theme.colors.primary },
  paceRow: { flexDirection: "row", gap: theme.spacing(1) },
  pace: { flex: 1, minHeight: 44, borderRadius: theme.radius.md, borderWidth: theme.borderWidth, borderColor: theme.colors.border, alignItems: "center", justifyContent: "center", backgroundColor: "transparent" },
  paceActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  paceText: { fontSize: 14, fontWeight: "800", color: theme.colors.ink },
  paceTextActive: { color: "#FFFFFF" },
});
