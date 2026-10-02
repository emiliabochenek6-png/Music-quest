import { useMemo, useRef, useState } from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { DarkButton } from "@/components/exercises/DarkButton";
import { ExerciseRenderer, hasAnswerToCheck } from "@/components/exercises/ExerciseRenderer";
import { describeLesson } from "@/components/plan/PlanTodayCard";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useGamification } from "@/context/GamificationContext";
import { usePlan } from "@/context/PlanContext";
import { getWorldContent } from "@/data/lessons";
import { todayISODate } from "@/lib/gamification/activity";
import { formatShortPolishDate } from "@/lib/plan/dates";
import { afterReview, newReviewEntry, pickReviewExercises } from "@/lib/plan/spacedRepetition";
import { generateExercise } from "@/lib/questions/generate";
import { isAnswerCorrect } from "@/lib/questions/validate";
import { stopAllScheduledAudio } from "@/lib/audio/rhythmPlayer";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { AnswerInput } from "@/types/exercises";
import { GlyphText } from "@/components/icons/GlyphText";

const REVIEW_XP_PER_CORRECT = 5;
const NUTKI_PER_CORRECT_IN_REVIEW = 2;

/** One spaced-repetition review round: 5 quick questions from an already
 * finished lesson (see lib/plan/spacedRepetition.ts). Doesn't touch hearts,
 * stars or the lesson's completion — it only moves the lesson's review
 * date (a good round pushes the next review further out, a poor one brings
 * it back sooner) and counts the minutes toward today's activity. */
export default function ReviewScreen() {
  const { lessonId, worldId } = useLocalSearchParams<{ lessonId: string; worldId: string }>();
  const { plan, onReviewFinished } = usePlan();
  const { recordActivity, awardXp, addNutki } = useGamification();
  const lesson = getWorldContent(worldId)?.lessons.find((l) => l.id === lessonId);
  const definitions = useMemo(() => (lesson ? pickReviewExercises(lesson) : []), [lessonId]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<AnswerInput | null>(null);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const startedAt = useRef(Date.now());
  const exercise = useMemo(() => (definitions[index] ? generateExercise(definitions[index], "pl") : null), [definitions, index]);

  function goBack() {
    stopAllScheduledAudio();
    if (router.canGoBack()) router.back();
    else router.replace("/(main)/plan");
  }

  function check() {
    if (!exercise || !answer) return;
    stopAllScheduledAudio();
    const correct = isAnswerCorrect(exercise, answer);
    setChecked(true);
    setIsCorrect(correct);
    if (correct) {
      setCorrectCount((n) => n + 1);
      // Same economy as a study-plan lesson: no hearts, XP and nutki for each correct answer (XP a bit lower than a fresh lesson's).
      awardXp(REVIEW_XP_PER_CORRECT);
      addNutki(NUTKI_PER_CORRECT_IN_REVIEW);
    }
  }

  function next() {
    stopAllScheduledAudio();
    if (index + 1 < definitions.length) {
      setIndex(index + 1);
      setAnswer(null);
      setChecked(false);
      setIsCorrect(null);
      return;
    }
    const fraction = definitions.length > 0 ? correctCount / definitions.length : 1;
    onReviewFinished(lessonId, fraction);
    recordActivity(todayISODate(), {
      minutesSpent: Math.max(1, Math.round((Date.now() - startedAt.current) / 60000)),
      stats: { reviews: 1, planCorrect: correctCount },
    });
    setFinished(true);
  }

  if (!lesson || definitions.length === 0) {
    return (
      <View style={styles.root}>
        <ScreenHeader title="Powtórka" onBack={goBack} />
        <View style={styles.center}>
          <Text style={styles.body}>Nie ma czego powtarzać w tej lekcji.</Text>
        </View>
      </View>
    );
  }

  if (finished) {
    const fraction = correctCount / definitions.length;
    // onReviewFinished already stored the updated entry — read its date, don't apply the review twice.
    const nextDue = plan.reviewLog[lessonId]?.dueISO ?? afterReview(newReviewEntry(todayISODate()), todayISODate(), fraction).dueISO;
    return (
      <View style={styles.root}>
        <ScreenHeader title="Powtórka" onBack={goBack} />
        <View style={styles.center}>
          <GlyphText style={{ fontSize: 48 }}>{fraction >= 0.6 ? "🎉" : "💪"}</GlyphText>
          <Text style={styles.heading}>
            {correctCount}/{definitions.length} dobrych odpowiedzi
          </Text>
          <Text style={styles.body}>
            {fraction >= 0.6
              ? `Świetnie! Do tej lekcji wrócimy ${formatShortPolishDate(nextDue)} — za coraz dłuższym odstępem.`
              : `Nic nie szkodzi — wrócimy do niej szybciej, ${formatShortPolishDate(nextDue)}.`}
          </Text>
          <View style={{ width: "100%", marginTop: theme.spacing(2) }}>
            <DarkButton label="Gotowe" onPress={goBack} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScreenHeader title={`Powtórka · ${describeLesson(lessonId)}`} onBack={goBack} />
      <View style={styles.barWrap}>
        <View style={styles.barTrack}>
          <View style={[styles.barFill, { width: `${((index + (checked ? 1 : 0)) / definitions.length) * 100}%` }]} />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.questionArea} keyboardShouldPersistTaps="handled">
        {exercise && <ExerciseRenderer key={exercise.id} exercise={exercise} answer={answer} onAnswerChange={setAnswer} checked={checked} isCorrect={isCorrect} locale="pl" />}
      </ScrollView>
      <View style={styles.footer}>
        {checked && (
          <Text style={{ textAlign: "center", fontWeight: "700", color: isCorrect ? theme.colors.success : theme.colors.warning, fontSize: theme.fontSize.body }}>
            {isCorrect ? `Dobrze! +${REVIEW_XP_PER_CORRECT} XP · +${NUTKI_PER_CORRECT_IN_REVIEW} nutki` : "Nie tym razem — to część powtórki."}
          </Text>
        )}
        <DarkButton label={checked ? (index + 1 < definitions.length ? "Dalej" : "Zakończ") : "Sprawdź"} onPress={checked ? next : check} disabled={!checked && !hasAnswerToCheck(answer)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.cream },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: theme.spacing(1.5) },
  heading: { fontSize: theme.fontSize.heading, fontWeight: "800", color: theme.colors.ink, textAlign: "center" },
  body: { fontSize: theme.fontSize.body * 0.95, color: theme.colors.muted, textAlign: "center", lineHeight: 22 },
  barWrap: { paddingHorizontal: 20 },
  barTrack: { height: 8, borderRadius: 4, backgroundColor: theme.colors.surfaceMuted, overflow: "hidden" },
  barFill: { height: "100%", backgroundColor: theme.colors.primary, borderRadius: 4 },
  questionArea: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 24, paddingVertical: 16 },
  footer: { paddingHorizontal: 24, paddingBottom: 24, gap: theme.spacing(1.25) },
});
