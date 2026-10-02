import { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, Text, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { BottomTabBar } from "@/components/BottomTabBar";
import { DailyMissionsCard } from "@/components/DailyMissionsCard";
import { PlanTodayCard } from "@/components/plan/PlanTodayCard";
import { DarkButton } from "@/components/exercises/DarkButton";
import { ExerciseRenderer, hasAnswerToCheck } from "@/components/exercises/ExerciseRenderer";
import { SoltekMascot } from "@/components/SoltekMascot";
import { useGamification } from "@/context/GamificationContext";
import { usePlan } from "@/context/PlanContext";
import { useProgress } from "@/context/ProgressContext";
import { useSessionTimer } from "@/hooks/useSessionTimer";
import { todayISODate } from "@/lib/gamification/activity";
import { getUnlockedExercisePool, pickDailyChallengeDefinition } from "@/lib/dailyChallenge/pickDailyChallenge";
import { NUTKI_REWARDS } from "@/lib/gamification/powerups";
import { generateExercise } from "@/lib/questions/generate";
import { isAnswerCorrect } from "@/lib/questions/validate";
import { stopAllScheduledAudio } from "@/lib/audio/rhythmPlayer";
import { t } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { AnswerInput, ExerciseDefinition, GeneratedExercise } from "@/types/exercises";
import { GlyphText } from "@/components/icons/GlyphText";

// Passed into DailyMissionsCard as its own challengeXpReward prop below,
// so that card's "Wykonaj wyzwanie dnia" mission labels its reward with
// this SAME number rather than a second, independently-maintained copy.
const XP_DAILY_CHALLENGE_BONUS = 30;
/** Retrying with a fresh pick after a wrong answer should avoid handing
 * back the SAME definition immediately (a near-instant "try again" on
 * literally the same question reads as broken, not as a new chance) —
 * bounded so a pool of size 1 (a brand-new player) doesn't spin
 * forever. */
const MAX_REROLL_ATTEMPTS = 5;

function pickFreshDefinition(pool: readonly ExerciseDefinition[], avoidId?: string): ExerciseDefinition | null {
  let picked = pickDailyChallengeDefinition(pool);
  for (let attempt = 0; attempt < MAX_REROLL_ATTEMPTS && picked && avoidId && picked.id === avoidId && pool.length > 1; attempt++) {
    picked = pickDailyChallengeDefinition(pool);
  }
  return picked;
}

/** One free-standing exercise per day — same underlying pieces a lesson
 * step uses (ExerciseRenderer/isAnswerCorrect/generateExercise), just
 * OUTSIDE the normal world/lesson navigation. See lib/dailyChallenge/
 * pickDailyChallenge.ts's own doc for how an exercise is chosen (a
 * random ExerciseDefinition from everything already unlocked).
 *
 * A wrong answer does NOT end today's challenge and — unlike a lesson
 * exercise — costs NOTHING: hearts are deliberately never touched here
 * at all, only during real lesson exercises. A wrong guess just hands
 * back a FRESH exercise to retry, repeating until one is answered
 * correctly; only a CORRECT answer marks `completed` and awards the XP
 * bonus, so there's no free-retry path to farm it, but there's also no
 * risk to a single unlucky guess. ExerciseRenderer is passed `checked`/
 * `isCorrect` the
 * exact same way the lesson screen passes them, so whatever a given
 * exercise type already does to reveal its own correct answer once
 * checked (most choice-based types highlight it inline) happens here
 * too, before the player moves on to the next try. */
export default function DailyChallengeScreen() {
  const insets = useSafeAreaInsets();
  const { progress } = useProgress();
  const { planCompletedIds } = usePlan();
  // Lessons finished in either mode count for the challenge.
  const finishedProgress = { ...progress, completedLessonIds: planCompletedIds };
  const { state: gamification, isLoading: gamificationLoading, awardXp, addNutki, recordActivity, setDailyChallenge } = useGamification();
  const { getElapsedMinutes } = useSessionTimer("daily-challenge");

  const today = todayISODate();
  const stored = gamification.dailyChallenge?.dateISO === today ? gamification.dailyChallenge : null;
  const dailyExercise = stored?.generated ?? null;
  const alreadyCompletedToday = stored?.completed === true;
  const [noContentAvailable, setNoContentAvailable] = useState(false);

  // Bootstraps today's FIRST pick when nothing is stored yet — runs in
  // an effect (after render commits), never during render, since
  // updating GamificationContext's own state while THIS component is
  // still rendering is exactly what React's "Cannot update a component
  // while rendering a different component" warning flags. `stored` is a
  // fresh object reference every time the underlying daily challenge
  // actually changes (see GamificationContext's own setState pattern),
  // so this correctly re-checks after handleNextChallenge's own
  // setDailyChallenge call too — it just finds `stored` already truthy
  // then and does nothing further.
  useEffect(() => {
    if (stored || gamificationLoading) return;
    const pool = getUnlockedExercisePool(finishedProgress);
    const definition = pickDailyChallengeDefinition(pool);
    if (!definition) {
      setNoContentAvailable(true);
      return;
    }
    setDailyChallenge({ dateISO: today, generated: generateExercise(definition, "pl"), completed: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stored, gamificationLoading, today]);

  const [answer, setAnswer] = useState<AnswerInput | null>(null);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Sound from the challenge (or the previous try) is cut the moment it's checked, replaced or left.
  useEffect(() => stopAllScheduledAudio, [dailyExercise?.id]);

  function goBackToMap() {
    stopAllScheduledAudio();
    router.replace("/(main)/map");
  }

  function handleCheck() {
    if (!answer || !dailyExercise) return;
    const correct = isAnswerCorrect(dailyExercise, answer);
    setChecked(true);
    setIsCorrect(correct);
    if (correct) {
      setDailyChallenge({ dateISO: today, generated: dailyExercise, completed: true });
      awardXp(XP_DAILY_CHALLENGE_BONUS);
      addNutki(NUTKI_REWARDS.dailyChallengeCorrect);
      recordActivity(today, { dailyChallengeCompleted: true, minutesSpent: getElapsedMinutes() });
    } else {
      recordActivity(today, { minutesSpent: getElapsedMinutes() });
    }
  }

  function handleNextChallenge() {
    stopAllScheduledAudio();
    const pool = getUnlockedExercisePool(finishedProgress);
    const definition = pickFreshDefinition(pool, stored?.generated.id);
    const next: GeneratedExercise | null = definition ? generateExercise(definition, "pl") : null;
    if (next) {
      setDailyChallenge({ dateISO: today, generated: next, completed: false });
    }
    setAnswer(null);
    setChecked(false);
    setIsCorrect(null);
  }

  /** Dev-only — see its own button's doc. Clears today's stored
   * dailyChallenge entirely; the bootstrap effect above then sees
   * `stored` fall back to null on the next render and picks a brand
   * new one, exactly like a genuinely fresh day would. */
  function handleResetForTesting() {
    setDailyChallenge(null);
    setAnswer(null);
    setChecked(false);
    setIsCorrect(null);
  }

  const [challengeOpen, setChallengeOpen] = useState(false);

  function openChallenge() {
    setAnswer(null);
    setChecked(false);
    setIsCorrect(null);
    setChallengeOpen(true);
  }

  function closeChallenge() {
    stopAllScheduledAudio();
    setChallengeOpen(false);
  }

  return (
    <View style={styles.root}>
      <Header onBack={goBackToMap} />

      {/* One scrolling page, so nothing is cut off: the missions, the daily challenge
          (its exercise opens in a big window in front) and today's plan. */}
      <ScrollView contentContainerStyle={styles.pageContent} showsVerticalScrollIndicator={false}>
        <DailyMissionsCard challengeXpReward={XP_DAILY_CHALLENGE_BONUS} />

        <View style={styles.challengeCard}>
          {alreadyCompletedToday ? (
            <>
              <GlyphText style={{ fontSize: 40 }}>✅</GlyphText>
              <Text style={styles.challengeTitle}>Dzisiejsze wyzwanie zrobione!</Text>
              <Text style={styles.challengeText}>Wróć jutro po kolejne. Do zobaczenia!</Text>
              {/* Dev-build only (__DEV__ is stripped/false in a real TestFlight/production build). */}
              {__DEV__ && <DarkButton label="🧪 Resetuj wyzwanie (dev)" onPress={handleResetForTesting} variant="secondary" />}
            </>
          ) : noContentAvailable ? (
            <>
              <GlyphText style={{ fontSize: 34 }}>🎯</GlyphText>
              <Text style={styles.challengeTitle}>Wyzwanie dnia</Text>
              <Text style={styles.challengeText}>Brak jeszcze treści na wyzwanie — wróć po ukończeniu pierwszej lekcji.</Text>
            </>
          ) : (
            <>
              <GlyphText style={{ fontSize: 34 }}>🎯</GlyphText>
              <Text style={styles.challengeTitle}>Wyzwanie dnia</Text>
              <Text style={styles.challengeText}>Jedno pytanie z lekcji, które masz już za sobą. Za dobrą odpowiedź +{XP_DAILY_CHALLENGE_BONUS} XP i nutki.</Text>
              <DarkButton label="Wykonaj wyzwanie dnia" onPress={openChallenge} disabled={!dailyExercise} />
            </>
          )}
        </View>

        <PlanTodayCard />
      </ScrollView>

      <BottomTabBar />

      {challengeOpen && dailyExercise && (
        <Modal visible transparent animationType="none" onRequestClose={closeChallenge}>
          <View style={[styles.modalBackdrop, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <GlyphText style={styles.modalTitle}>🎯 Wyzwanie dnia</GlyphText>
                <Pressable onPress={closeChallenge} accessibilityRole="button" accessibilityLabel="Zamknij" hitSlop={12}>
                  <GlyphText style={{ fontSize: 18, color: theme.colors.muted }}>✕</GlyphText>
                </Pressable>
              </View>
              <ScrollView contentContainerStyle={styles.modalExercise} keyboardShouldPersistTaps="handled">
                <ExerciseRenderer exercise={dailyExercise} answer={answer} onAnswerChange={setAnswer} checked={checked} isCorrect={isCorrect} locale="pl" />
              </ScrollView>
              <View style={styles.modalFooter}>
                {checked && (
                  <SoltekMascot
                    size="sm"
                    expression={isCorrect ? "radosny" : "zachecajacy"}
                    message={isCorrect ? `${t("lesson.correct", "pl")} +${XP_DAILY_CHALLENGE_BONUS} XP. Dzisiejsze wyzwanie zrobione!` : t("lesson.incorrectTryAnother", "pl")}
                  />
                )}
                <DarkButton
                  label={checked ? (isCorrect ? "Gotowe" : "Następne zadanie") : t("lesson.checkAnswer", "pl")}
                  onPress={checked ? (isCorrect ? closeChallenge : handleNextChallenge) : handleCheck}
                  disabled={!checked && !hasAnswerToCheck(answer)}
                />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

function Header({ onBack }: { onBack: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Wstecz" hitSlop={12} style={styles.backButton}>
        <Text style={styles.backIcon}>‹</Text>
      </Pressable>
      <GlyphText style={styles.headerTitle} numberOfLines={1}>
        🎯 Misje dnia
      </GlyphText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.cream,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  pageContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
    maxWidth: 560,
    width: "100%",
    alignSelf: "center",
  },
  challengeCard: {
    alignItems: "center",
    gap: 8,
    padding: theme.spacing(2),
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
  },
  challengeTitle: { fontSize: theme.fontSize.heading, fontWeight: "800", color: theme.colors.ink, textAlign: "center" },
  challengeText: { fontSize: theme.fontSize.body * 0.9, color: theme.colors.muted, textAlign: "center" },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(20,10,0,0.6)", paddingHorizontal: 12 },
  modalCard: {
    flex: 1,
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.cream,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    overflow: "hidden",
  },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 18, paddingVertical: 14 },
  modalTitle: { fontSize: 15, fontWeight: "800", color: theme.colors.primary },
  modalExercise: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 18, paddingVertical: 12 },
  modalFooter: { paddingHorizontal: 18, paddingBottom: 16, paddingTop: 8, gap: theme.spacing(1.5) },
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
  headerTitle: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.3,
    color: theme.colors.primary,
    flexShrink: 1,
  },
  exerciseArea: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
});
