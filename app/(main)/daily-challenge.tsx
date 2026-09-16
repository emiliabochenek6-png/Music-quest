import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { BottomTabBar } from "@/components/BottomTabBar";
import { DailyMissionsCard } from "@/components/DailyMissionsCard";
import { DarkButton } from "@/components/exercises/DarkButton";
import { ExerciseRenderer, hasAnswerToCheck } from "@/components/exercises/ExerciseRenderer";
import { useGamification } from "@/context/GamificationContext";
import { useProgress } from "@/context/ProgressContext";
import { useSubscription } from "@/context/SubscriptionContext";
import { useSessionTimer } from "@/hooks/useSessionTimer";
import { todayISODate } from "@/lib/gamification/activity";
import { getUnlockedExercisePool, pickDailyChallengeDefinition } from "@/lib/dailyChallenge/pickDailyChallenge";
import { generateExercise } from "@/lib/questions/generate";
import { isAnswerCorrect } from "@/lib/questions/validate";
import { t } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { AnswerInput, ExerciseDefinition, GeneratedExercise } from "@/types/exercises";

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
  const { status: subscription } = useSubscription();
  const { state: gamification, isLoading: gamificationLoading, awardXp, recordActivity, setDailyChallenge } = useGamification();
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
    const pool = getUnlockedExercisePool(progress, subscription, gamification.lessonStars);
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

  function goBackToMap() {
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
      recordActivity(today, { dailyChallengeCompleted: true, minutesSpent: getElapsedMinutes() });
    } else {
      recordActivity(today, { minutesSpent: getElapsedMinutes() });
    }
  }

  function handleNextChallenge() {
    const pool = getUnlockedExercisePool(progress, subscription, gamification.lessonStars);
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

  return (
    <View style={styles.root}>
      <Header onBack={goBackToMap} />

      <View style={styles.missionsWrap}>
        <DailyMissionsCard challengeXpReward={XP_DAILY_CHALLENGE_BONUS} />
      </View>

      {alreadyCompletedToday ? (
        <View style={styles.centerFill}>
          <Text style={{ fontSize: 48 }}>✅</Text>
          <Text style={{ fontSize: theme.fontSize.heading, fontWeight: "800", color: theme.colors.ink, textAlign: "center", marginTop: 12 }}>
            Dzisiejsze wyzwanie zrobione
          </Text>
          <Text style={{ color: theme.colors.muted, textAlign: "center", marginTop: 8 }}>Wróć jutro po kolejne.</Text>
          <View style={{ marginTop: theme.spacing(2), width: "100%", gap: theme.spacing(1) }}>
            <DarkButton label="Wróć do mapy" onPress={goBackToMap} />
            {/* Dev-build only (__DEV__ is stripped/false in a real TestFlight/
                production build) — no way to clear one day's own
                dailyChallenge from device storage without this, and
                re-testing the flow shouldn't mean waiting for tomorrow. */}
            {__DEV__ && <DarkButton label="🧪 Resetuj wyzwanie (dev)" onPress={handleResetForTesting} variant="secondary" />}
          </View>
        </View>
      ) : noContentAvailable ? (
        <View style={styles.centerFill}>
          <Text style={{ color: theme.colors.muted, textAlign: "center" }}>
            Brak jeszcze odblokowanej treści na wyzwanie dnia — wróć po ukończeniu pierwszej lekcji.
          </Text>
          <View style={{ marginTop: theme.spacing(2), width: "100%" }}>
            <DarkButton label="Wróć do mapy" onPress={goBackToMap} />
          </View>
        </View>
      ) : dailyExercise ? (
        <>
          <ScrollView contentContainerStyle={styles.exerciseArea} keyboardShouldPersistTaps="handled">
            <ExerciseRenderer exercise={dailyExercise} answer={answer} onAnswerChange={setAnswer} checked={checked} isCorrect={isCorrect} locale="pl" />
          </ScrollView>
          <View style={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 16 }}>
            {checked && (
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "700",
                  fontSize: theme.fontSize.body,
                  color: isCorrect ? theme.colors.success : theme.colors.warning,
                  marginBottom: theme.spacing(1.5),
                }}
              >
                {isCorrect ? `${t("lesson.correct", "pl")} +${XP_DAILY_CHALLENGE_BONUS} XP` : t("lesson.incorrectTryAnother", "pl")}
              </Text>
            )}
            <DarkButton
              label={checked ? (isCorrect ? "Wróć do mapy" : "Następne zadanie") : t("lesson.checkAnswer", "pl")}
              onPress={checked ? (isCorrect ? goBackToMap : handleNextChallenge) : handleCheck}
              disabled={!checked && !hasAnswerToCheck(answer)}
            />
          </View>
        </>
      ) : null}

      <BottomTabBar />
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
      <Text style={styles.headerTitle} numberOfLines={1}>
        🎯 Misje dnia
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.cream,
  },
  centerFill: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  missionsWrap: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
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
