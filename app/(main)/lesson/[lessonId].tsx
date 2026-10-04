import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Pressable, View, Text, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { DarkButton } from "@/components/exercises/DarkButton";
import { AnswerFeedbackPanel, ExerciseTransition } from "@/components/exercises/AnswerFeedbackPanel";
import { ExerciseIntroRecap } from "@/components/exercises/ExerciseIntroRecap";
import { ExerciseRenderer, hasAnswerToCheck } from "@/components/exercises/ExerciseRenderer";
import { LeaveLessonModal } from "@/components/exercises/LeaveLessonModal";
import { LessonIntro } from "@/components/exercises/LessonIntro";
import { LessonIntroRecap } from "@/components/exercises/LessonIntroRecap";
import { LessonTheoryIntro } from "@/components/exercises/LessonTheoryIntro";
import { PianoKeyboardRecap } from "@/components/exercises/PianoKeyboardRecap";
import { WorldCompleteModal } from "@/components/exercises/WorldCompleteModal";
import { SoltekMascot } from "@/components/SoltekMascot";
import { getWorldContent } from "@/data/lessons";
import { getNextWorld, getWorldById } from "@/data/worlds";
import { ExerciseAccentProvider } from "@/context/ExerciseAccentContext";
import { useGamification } from "@/context/GamificationContext";
import { describeLesson } from "@/components/plan/PlanTodayCard";
import { usePlan } from "@/context/PlanContext";
import { getLessonInfo } from "@/lib/plan/lessonIndex";
import { useProgress } from "@/context/ProgressContext";
import { useSubscription } from "@/context/SubscriptionContext";
import { useSessionTimer } from "@/hooks/useSessionTimer";
import { stopAllScheduledAudio } from "@/lib/audio/rhythmPlayer";
import { todayISODate } from "@/lib/gamification/activity";
import { NUTKI_REWARDS } from "@/lib/gamification/powerups";
import { streakComment } from "@/lib/gamification/streakComments";
import { getRankForXp } from "@/lib/gamification/rank";
import { AppIcon } from "@/components/icons/AppIcon";
import { LevelBar } from "@/components/LevelBar";
import { Confetti } from "@/components/exercises/Confetti";
import { didWorldJustUnlock } from "@/lib/progression/resolveNodeState";
import { computeLessonStars, computeLessonStarsProgress } from "@/lib/gamification/stars";
import { computeIntervalTimedTestStars } from "@/lib/questions/intervalTimedTest";
import { generateExercise, getExerciseSignature } from "@/lib/questions/generate";
import { isAnswerCorrect } from "@/lib/questions/validate";
import { t } from "@/lib/i18n/translate";
import type { TranslationKey } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { AnswerInput, ExerciseDefinition } from "@/types/exercises";
import { GlyphText } from "@/components/icons/GlyphText";

/** +10 XP per exercise answered correctly on the first (and only —
 * see handleCheck's own doc) attempt, +20 on top for a lesson finished
 * with zero mistakes at all. */
const XP_PER_CORRECT_ANSWER = 10;
/** Nutki ("nuty") a correct answer pays in "Tryb nauki". */
const NUTKI_PER_CORRECT_ANSWER = 2;
const XP_PERFECT_LESSON_BONUS = 20;
/** Every Nth wrong answer TOTAL this attempt (not necessarily in a row —
 * correct answers in between don't reset the count, see mistakeCount's
 * own doc) gets an encouraging Solfek checkpoint. */
const ENCOURAGEMENT_INTERVAL = 3;
/** How many distinct encouragement lines exist (lesson.encouragement1..N
 * in pl.json) — handleCheck picks one at random each time the
 * interstitial fires, so the same message doesn't repeat every time. */
const ENCOURAGEMENT_MESSAGE_COUNT = 4;
/** Correct answers IN A ROW (breaks on any wrong answer, unlike
 * ENCOURAGEMENT_INTERVAL — see consecutiveCorrect's own doc) before a
 * "Świetnie Ci idzie!" streak celebration, same interstitial mechanism
 * as the struggle-side encouragement but for the opposite moment. */
const STREAK_CELEBRATION_INTERVAL = 5;
/** After this many wrong answers on the SAME exercise (across makeup-round
 * repeats too — see the `exercises` state's own doc), handleCheck stops
 * requeuing it and lets the lesson move on without it, instead of looping
 * forever on one question a player (or a broken exercise) can't get past. */
const MAX_ATTEMPTS_PER_EXERCISE = 3;
/** The reward for playing a world with its "Zapoznaj się" toggle off (see
 * app/(main)/world/[worldId].tsx's own toggle row and
 * types/gamification.ts's own introModeEnabledByWorld doc) — every nutki
 * award below that's tied to THIS world gets doubled, in exchange for the
 * recap panels not being rendered at all. */
const NUTKI_MULTIPLIER_WHEN_INTRO_DISABLED = 2;

/**
 * Runs ONE lesson's exercises, in order — reached from a world's own
 * levels screen (app/(main)/world/[worldId].tsx), not directly from the
 * map. Same dark-cosmic visual world as the map/levels screens (see
 * theme/darkExerciseTheme.ts's own doc) rather than this app's light
 * dual-mode system. "Back" always returns to that levels screen (via
 * `worldId`, not a bare router.back(), so mid-lesson navigation state
 * never strands the player somewhere unexpected). A wrong answer gets
 * requeued onto the end of the session (Duolingo-style "makeup round" —
 * see the `exercises` state's own doc), so the lesson's authored list is
 * a STARTING point, not the full session length; a "🔁 Powtórka" banner
 * marks the makeup round once the player reaches it. A single exercise
 * only ever gets requeued this way up to MAX_ATTEMPTS_PER_EXERCISE times —
 * past that it's simply dropped instead of coming back again, so one
 * question a player (or a broken exercise) can't get past never blocks
 * finishing the lesson. Every third wrong
 * answer TOTAL this attempt (mistakes don't need to be back to back —
 * correct answers in between still count toward the next checkpoint)
 * also inserts a one-off full-screen encouragement moment (big Solfek,
 * one of several "Dasz radę!"-style lines) between that exercise and the
 * next — see showEncouragementInterstitial's own doc. A genuine streak
 * (STREAK_CELEBRATION_INTERVAL correct answers IN A ROW) gets the same
 * treatment the other way — see showStreakInterstitial's own doc.
 * Finishing the last
 * exercise shows a small summary card, then marks the lesson (and, if it
 * was the world's last lesson, the whole world) done before returning —
 * completing a world for the first time additionally layers a celebratory
 * WorldCompleteModal over that summary.
 */
/** Per-world exercise-screen tint — every world's own `accentColor` (see
 * data/worlds.ts) lightened toward white, so each world's lesson screens
 * (button fill, background wash) match its own map/background art instead
 * of all opening on one app-wide neutral cream+orange. Covers all 13
 * worlds now; the first four entries were hand-picked earlier (kept as-is
 * rather than reflowed through the formula below, to not shift an already-
 * shipped look), the rest are a plain ~12% mix of the world's accentColor
 * into white. */
const WORLD_LESSON_THEME: Partial<Record<string, { background: string }>> = {
  note: { background: "#F3ECFC" }, // Wioska Nut — light purple
  metronome: { background: "#E8EEFC" }, // Miasto Rytmu — light blue
  "bar-line": { background: "#E3F5F1" }, // Przystań Taktów — light sea-green
  instruments: { background: "#FCEEEA" }, // Królestwo Instrumentów — light coral
  interval: { background: "#E6F3FB" }, // Pasmo Interwałów — light icy blue
  chord: { background: "#E9EFF3" }, // Zatoka Trójdźwięków — light steel blue
  inversion: { background: "#EEEAE7" }, // Jaskinia Akordów — light brown
  citadel: { background: "#F9E3E9" }, // Cytadela Dominant — light crimson
  "key-signature": { background: "#F0E7FD" }, // Labirynt Tonacji — light violet
  build: { background: "#FFF0E0" }, // Fabryka Budowania — light orange
  beam: { background: "#EBF0EB" }, // Gaj Grupowania — light green
  dictation: { background: "#F3EAFB" }, // Szczyt Dyktand — light purple
  microphone: { background: "#FBF5ED" }, // Zaczarowany Solfeż — light gold
};

/** Thin wrapper around the real screen purely to set up
 * ExerciseAccentProvider — every DarkButton/OptionButton the actual
 * lesson body renders (however many different early-return branches
 * below end up firing) sits somewhere inside this Provider's tree, so
 * this one place is the only thing that needs to know about a themed
 * world's own accent override; nothing further down does. */
export default function LessonScreen() {
  const { worldId } = useLocalSearchParams<{ worldId: string }>();
  const world = getWorldById(worldId);
  const accentOverride = world && WORLD_LESSON_THEME[world.mapIconId] ? world.accentColor : null;
  // Keyed by lesson so "next lesson of the day" (a replace to this same
  // route with another lessonId) starts a clean screen instead of reusing
  // the finished one's state.
  const { lessonId: lessonKey } = useLocalSearchParams<{ lessonId: string }>();
  return (
    <ExerciseAccentProvider color={accentOverride}>
      <LessonScreenBody key={lessonKey} />
    </ExerciseAccentProvider>
  );
}

function LessonScreenBody() {
  const { lessonId, worldId, mode } = useLocalSearchParams<{ lessonId: string; worldId: string; mode?: string }>();
  // The app has no hearts: a mistake never costs anything and nothing blocks
  // the next question; every correct answer pays NUTKI_PER_CORRECT_ANSWER
  // nutki on top of the XP. "Tryb nauki" (opened from the study plan) only
  // differs in where the player returns to and which daily missions it counts for.
  const learningMode = mode === "plan";
  const insets = useSafeAreaInsets();
  const { progress, markLessonCompleted, markWorldCompleted } = useProgress();
  const { plan, onLessonCompleted, setView, markPlanLessonCompleted, planCompletedIds } = usePlan();
  const { state: gamificationState, awardXp, addNutki, recordLessonStars, recordActivity } =
    useGamification();
  // XP/nutki the player had when this lesson started — the summary shows the difference.
  const startRewards = useRef({ xp: gamificationState.xp, nutki: gamificationState.nutki });
  const introModeEnabled = gamificationState.introModeEnabledByWorld[worldId] ?? true;
  const nutkiMultiplier = introModeEnabled ? 1 : NUTKI_MULTIPLIER_WHEN_INTRO_DISABLED;
  const { status: subscriptionStatus } = useSubscription();
  const { getElapsedMinutes } = useSessionTimer(lessonId);

  const world = getWorldById(worldId);
  const content = getWorldContent(worldId);
  const lesson = content?.lessons.find((l) => l.id === lessonId);
  // See WORLD_LESSON_THEME's own doc.
  const screenBackgroundColor = (world && WORLD_LESSON_THEME[world.mapIconId]?.background) || theme.colors.cream;

  const [index, setIndex] = useState(0);
  // The X in the corner asks "are you sure?" first (a sad Solfek), but only while exercises are running.
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [answer, setAnswer] = useState<AnswerInput | null>(null);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  // "Owed, not shown yet" — set true by handleCheck the moment
  // mistakeCount crosses an ENCOURAGEMENT_INTERVAL multiple (see that
  // constant's own doc — total wrong answers this attempt, correct ones
  // in between don't reset it), consumed by handleContinue the moment
  // the player presses on past THAT exercise. Shows a full interstitial
  // screen (big Solfek, see showEncouragementInterstitial) BETWEEN that
  // exercise and the next one, instead of just going straight on.
  const [showEncouragement, setShowEncouragement] = useState(false);
  // Which of the ENCOURAGEMENT_MESSAGE_COUNT lines to show — rolled once
  // per interstitial (in handleCheck, alongside showEncouragement) so it
  // stays fixed while the screen is up, not re-rolled on every render.
  const [encouragementMessageIndex, setEncouragementMessageIndex] = useState(1);
  // The interstitial screen itself, currently on/off — separate from
  // showEncouragement (the "owed" flag above) so the two "Dalej" presses
  // involved (one to leave the missed exercise, one to leave the
  // interstitial) are unambiguous: the first flips this on instead of
  // advancing, the second flips it off AND advances.
  const [showEncouragementInterstitial, setShowEncouragementInterstitial] = useState(false);
  // Correct answers IN A ROW — resets to 0 on any wrong answer (unlike
  // mistakeCount, which never resets). Mirrors showEncouragement/
  // showEncouragementInterstitial exactly, one interval below, for the
  // opposite moment: a genuine streak gets its own "Świetnie Ci idzie!"
  // celebration instead of the struggle-side encouragement.
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);
  const [showStreakInterstitial, setShowStreakInterstitial] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [mistakeCount, setMistakeCount] = useState(0);
  // Total wrong answers so far THIS ATTEMPT, per exercise id — not just the
  // current index, since a makeup-round repeat shares its original's id
  // (see the `exercises` state's own doc). Lets handleCheck give up on one
  // particular exercise after MAX_ATTEMPTS_PER_EXERCISE fails instead of
  // requeuing it again. Reset per lesson via the same lessonId effect as
  // `exercises` below.
  const [failCounts, setFailCounts] = useState<Record<string, number>>({});
  useEffect(() => {
    setFailCounts({});
  }, [lessonId]);
  // Distinct ORIGINAL exercises answered correctly so far (once per
  // exercise — a repeat that finally succeeds counts here too, a repeat
  // that fails again does not double-count) — feeds LiveStarIndicator's
  // "climbs one star at a time, never drops" progress preview below.
  // Deliberately separate from mistakeCount: the FINAL grade
  // (resolveStars) penalizes every wrong attempt, including repeats of
  // the same question, so a lesson finished only after several repeats
  // can still land on fewer stars even though — by definition, since the
  // lesson can't end otherwise — every original exercise eventually gets
  // answered correctly and this counter always reaches originalExerciseCount.
  const [correctCount, setCorrectCount] = useState(0);
  // Pasmo Interwałów's timed test is ONE exercise made of many rapid-fire
  // answers, so counting it as a single right/wrong (see mistakeCount)
  // can't tell a 65% run from a 100% one. Once checked, its own correct-
  // vs-wrong tally drives the stars instead — see
  // computeIntervalTimedTestStars.
  const [timedTestResult, setTimedTestResult] = useState<{ correctCount: number; totalCount: number } | null>(null);
  // Disabled for the duration of a clef-trace stroke — see
  // ClefTraceBoard's own doc for why capture-phase responder flags alone
  // aren't enough to stop iOS's native ScrollView from hijacking a drag.
  const [scrollEnabled, setScrollEnabled] = useState(true);
  // Only relevant for lessons carrying introNotes (see LessonIntro's own
  // doc) — starts false so those lessons open on the "get familiar" staff
  // screen before their first exercise.
  const [introDismissed, setIntroDismissed] = useState(false);
  // Set true whenever a world's last lesson is passed (see
  // handleContinue) — shows every time, including replays of an
  // already-completed world's last lesson.
  const [showWorldComplete, setShowWorldComplete] = useState(false);
  // Name of the world that just became reachable as a RESULT of this
  // world completing — null on a replay where the next world was
  // already unlocked before this attempt (see handleContinue's own
  // doc), same "recomputed fresh each time, not carried over" shape as
  // showWorldComplete itself.
  const [unlockedNextWorldName, setUnlockedNextWorldName] = useState<string | null>(null);
  // True when THIS world-completion also happens to be a "Perfekcyjna
  // Kraina" — every lesson in the world sitting at 3 stars, not just the
  // one just finished. Computed fresh in handleContinue (see its own
  // doc), same "not carried over" shape as unlockedNextWorldName.
  const [isPerfectWorldCompletion, setIsPerfectWorldCompletion] = useState(false);

  // A metronome click track (Miasto Rytmu's rhythm exercises) can run for
  // many measures — without this, leaving the screen any other way than
  // waiting for it to finish on its own left it quietly ticking into
  // whatever came next (the summary screen, the levels map, ...).
  useEffect(() => stopAllScheduledAudio, []);

  function goBackToLevels() {
    stopAllScheduledAudio();
    // A lesson opened from the study plan returns to the plan (the map in
    // "Tryb nauki"), never to the world's level list.
    if (learningMode) {
      setView("plan");
      router.replace({ pathname: "/(main)/map", params: { focusLessonId: lessonId } });
      return;
    }
    // Carries the lesson just left back to the levels screen (its own
    // LessonPath reads this to scroll straight there — see that file's
    // own doc) instead of that screen's default "jump to the first
    // incomplete lesson" landing somewhere else entirely, e.g. when a
    // player jumped ahead out of order (local test-build unlock, or a
    // lesson revisited after already finishing later ones).
    router.replace({ pathname: "/(main)/world/[worldId]", params: { worldId, focusLessonId: lessonId } });
  }

  if (!world || !content || !lesson) {
    return (
      <View style={[styles.root, { backgroundColor: screenBackgroundColor }]}>
        <LessonHeader title="Lekcja" accentHex={theme.colors.primary} onBack={goBackToLevels} />
        <View style={styles.centerFill}>
          <Text style={{ color: theme.colors.muted }}>Nie znaleziono tej lekcji.</Text>
        </View>
      </View>
    );
  }

  // The lesson's own authored list PLUS, appended at the end as they
  // happen, a copy of every exercise answered wrong — Duolingo-style
  // "makeup round": a mistake doesn't just cost a heart, the same
  // question comes back later in this same attempt so the lesson can't
  // finish without eventually getting it right. originalExerciseCount
  // (the fixed authored length, never grows) is what stars/summary grade
  // against — repeats change how long the session takes, not how hard
  // the lesson "counts" as being.
  const originalExerciseCount = lesson.exercises.length;
  const [exercises, setExercises] = useState<ExerciseDefinition[]>(lesson.exercises);
  useEffect(() => {
    setExercises(lesson.exercises);
  }, [lessonId]);
  const definition = exercises[index];
  const isReviewRound = index >= originalExerciseCount;
  // Signatures (see getExerciseSignature's own doc) of every randomized-
  // content exercise shown so far in THIS lesson attempt — passed to
  // generateExercise as its exclude set so a later exercise of the same
  // type doesn't land on the identical note pair/triad/key+role a
  // previous exercise in this same attempt already asked. Reset whenever
  // the lesson itself changes (a fresh attempt starting over), not on
  // every exercise — the whole point is remembering ACROSS exercises
  // within one attempt.
  const usedSignaturesRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    usedSignaturesRef.current = new Set();
  }, [lessonId]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const exercise = useMemo(() => generateExercise(definition, "pl", usedSignaturesRef.current), [definition.id]);
  useEffect(() => {
    const signature = getExerciseSignature(exercise);
    if (signature) {
      usedSignaturesRef.current.add(signature);
    }
  }, [exercise]);
  // Belt-and-suspenders alongside the explicit stopAllScheduledAudio()
  // calls below: whenever the CURRENT exercise itself changes (for any
  // reason — not just the handleContinue/handleCheck paths that already
  // call it explicitly), its cleanup fires and silences anything that
  // exercise had scheduled, before the next one can be seen or heard.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => stopAllScheduledAudio, [definition.id]);

  // A timed-test lesson is graded by its own correct/wrong tally (see
  // timedTestResult's doc); every other lesson by mistakes per exercise.
  function resolveStars(): 1 | 2 | 3 {
    return timedTestResult
      ? computeIntervalTimedTestStars(timedTestResult.correctCount, timedTestResult.totalCount)
      : computeLessonStars(mistakeCount, originalExerciseCount);
  }
  const isPerfectRun = timedTestResult
    ? timedTestResult.totalCount > 0 && timedTestResult.correctCount === timedTestResult.totalCount
    : mistakeCount === 0;

  function handleCheck() {
    if (!answer) return;
    stopAllScheduledAudio();
    const correct = isAnswerCorrect(exercise, answer);
    if (answer.type === "interval-timed-test") {
      setTimedTestResult({ correctCount: answer.correctCount, totalCount: answer.totalCount });
    }
    setChecked(true);
    setIsCorrect(correct);
    if (!correct) {
      const nextMistakeCount = mistakeCount + 1;
      setMistakeCount(nextMistakeCount);
      if (nextMistakeCount % ENCOURAGEMENT_INTERVAL === 0) {
        setShowEncouragement(true);
        setEncouragementMessageIndex(1 + Math.floor(Math.random() * ENCOURAGEMENT_MESSAGE_COUNT));
      }
      setConsecutiveCorrect(0);
      const failCountForThisExercise = (failCounts[definition.id] ?? 0) + 1;
      setFailCounts((current) => ({ ...current, [definition.id]: failCountForThisExercise }));
      if (failCountForThisExercise < MAX_ATTEMPTS_PER_EXERCISE) {
        setExercises((current) => [...current, definition]);
      }
    } else {
      awardXp(XP_PER_CORRECT_ANSWER);
      addNutki(NUTKI_PER_CORRECT_ANSWER);
      setCorrectCount((n) => n + 1);
      const nextStreak = consecutiveCorrect + 1;
      setConsecutiveCorrect(nextStreak);
      if (nextStreak % STREAK_CELEBRATION_INTERVAL === 0) {
        setShowStreakCelebration(true);
      }
    }
  }

  // "Sprawdź siebie" exercises (Zaczarowany Solfeż's metronome-only levels):
  // nothing is recorded, so there is nothing to grade — the bottom button
  // reads "Dalej" and moves straight on, with no right/wrong feedback. The
  // exercise still counts as done (XP + correct tally); it just never
  // touches hearts, streaks or the mistake count.
  const isSelfCheckExercise = exercise.type === "solfege-phrase-singing" && exercise.metronomeOnly === true;
  function handleSelfCheckContinue() {
    stopAllScheduledAudio();
    awardXp(XP_PER_CORRECT_ANSWER);
    setCorrectCount((n) => n + 1);
    advanceOrFinish();
  }

  // TS can't carry the `!world || !content || !lesson` narrowing above
  // into these nested function declarations (a known control-flow-
  // analysis gap for hoisted `function` closures) — re-bind them here,
  // once, right after the guard, instead of asserting non-null at every
  // later use site.
  const currentWorld = world;
  const currentContent = content;
  const currentLesson = lesson;

  // A lesson's own intro screen (introSlides' referenceAudio buttons most
  // notably — see LessonTheoryIntro's own doc) can have something playing
  // when the player taps past it into the first exercise; without this,
  // that kept ringing on into the exercise instead of stopping at the
  // screen transition, same as every other exercise-to-exercise boundary
  // already does via handleContinue/handleCheck below.
  function handleIntroContinue() {
    stopAllScheduledAudio();
    setIntroDismissed(true);
  }

  // The actual "move past the current exercise" logic — either the next
  // exercise or, at the end of the queue, the summary screen. Called
  // directly by handleContinue for an ordinary "Dalej", and again (via
  // handleEncouragementContinue) once the player has also clicked past
  // the encouragement interstitial, so that screen genuinely sits
  // BETWEEN two exercises rather than replacing either one's own
  // advance.
  function advanceOrFinish() {
    if (index + 1 < exercises.length) {
      setIndex(index + 1);
      setAnswer(null);
      setChecked(false);
      setIsCorrect(null);
      setShowEncouragement(false);
    } else {
      onLessonCompleted(currentLesson.id);
      const earnedStars = resolveStars();
      if (learningMode) {
        // "Tryb nauki" keeps its own record: finishing a lesson here never completes, stars or unlocks
        // anything on the "Tryb zabawy" map.
        markPlanLessonCompleted(currentLesson.id);
      } else {
        markLessonCompleted(currentLesson.id);
        const isLastLessonInWorld = currentLesson.order === currentContent.lessons.length;
        if (isLastLessonInWorld) {
          markWorldCompleted(currentWorld.id);
          setShowWorldComplete(true);
          addNutki(NUTKI_REWARDS.worldCompleted * nutkiMultiplier);
          // Progress/gamification state here is still the PRE-completion
          // snapshot (markWorldCompleted/recordLessonStars just queued their
          // own setState, not applied yet) — projecting this lesson's own
          // just-earned star and this world into synthetic "after" copies
          // lets didWorldJustUnlock (and the "Perfekcyjna Kraina" check
          // below) answer synchronously, without waiting a render for real
          // state to catch up.
          const bestStarsForThisLesson = Math.max(gamificationState.lessonStars[currentLesson.id] ?? 0, earnedStars) as 1 | 2 | 3;
          const projectedLessonStars = { ...gamificationState.lessonStars, [currentLesson.id]: bestStarsForThisLesson };
          const isPerfectWorld = currentContent.lessons.every((l) => projectedLessonStars[l.id] === 3);
          setIsPerfectWorldCompletion(isPerfectWorld);
          if (isPerfectWorld) addNutki(NUTKI_REWARDS.perfectWorldBonus * nutkiMultiplier);
          const nextWorld = getNextWorld(currentWorld);
          if (nextWorld) {
            const projectedProgress = { ...progress, completedWorldIds: new Set(progress.completedWorldIds).add(currentWorld.id) };
            const justUnlocked = didWorldJustUnlock(
              nextWorld,
              progress,
              projectedProgress,
              subscriptionStatus,
              gamificationState.lessonStars,
              projectedLessonStars
            );
            if (justUnlocked) {
              setUnlockedNextWorldName(t(nextWorld.nameKey as TranslationKey));
            }
          }
        }
        recordLessonStars(currentLesson.id, earnedStars);
      }
      if (isPerfectRun) {
        awardXp(XP_PERFECT_LESSON_BONUS);
        addNutki(NUTKI_REWARDS.perfectLesson * nutkiMultiplier);
      }
      // Feeds the daily missions: what was done today, split by mode.
      const modeStats = learningMode
        ? { planLessons: 1, planCorrect: originalExerciseCount, planStars3: earnedStars === 3 ? 1 : 0, planPerfect: isPerfectRun ? 1 : 0 }
        : {
            funLessons: 1,
            funCorrect: originalExerciseCount,
            funStars3: earnedStars === 3 ? 1 : 0,
            funPerfect: isPerfectRun ? 1 : 0,
            bosses: currentLesson.isBoss ? 1 : 0,
          };
      recordActivity(todayISODate(), { minutesSpent: getElapsedMinutes(), lessonIdCompleted: currentLesson.id, stats: modeStats });
      setIsFinished(true);
    }
  }

  // The ordinary "Dalej" on an answered exercise — detours through the
  // encouragement interstitial exactly once (see showEncouragement's own
  // doc) instead of advancing straight away, whenever the answer just
  // given landed on an ENCOURAGEMENT_INTERVAL checkpoint.
  function handleContinue() {
    stopAllScheduledAudio();
    if (showEncouragement) {
      setShowEncouragement(false);
      setShowEncouragementInterstitial(true);
      return;
    }
    if (showStreakCelebration) {
      setShowStreakCelebration(false);
      setShowStreakInterstitial(true);
      return;
    }
    advanceOrFinish();
  }

  // The interstitial screen's own "Dalej" — dismiss it, then run the
  // SAME advance this exercise's own "Dalej" would have run directly.
  function handleEncouragementContinue() {
    stopAllScheduledAudio();
    setShowEncouragementInterstitial(false);
    advanceOrFinish();
  }

  // Same shape as handleEncouragementContinue, for the streak screen.
  function handleStreakContinue() {
    stopAllScheduledAudio();
    setShowStreakInterstitial(false);
    advanceOrFinish();
  }

  // Study plan: what's left of today's planned lessons once this one is done.
  const todayPlanIds = plan.today?.dateISO === todayISODate() ? plan.today.lessonIds : [];
  const doneIncludingThis = new Set([...planCompletedIds, lessonId]);
  const nextTodayLessonId = todayPlanIds.find((id) => id !== lessonId && !doneIncludingThis.has(id)) ?? null;
  const todayPlanDone = todayPlanIds.includes(lessonId) && nextTodayLessonId === null;
  const fromPlan = learningMode;
  const gained = { xp: gamificationState.xp - startRewards.current.xp, nutki: gamificationState.nutki - startRewards.current.nutki };

  function playInFunMode() {
    stopAllScheduledAudio();
    setView("fun");
    router.replace("/(main)/map");
  }

  // "Tryb nauki": only today's lessons can be done today — anything planned for another day waits for it.
  if (learningMode && !isFinished && plan.today?.dateISO === todayISODate() && !todayPlanIds.includes(lessonId) && !planCompletedIds.has(lessonId)) {
    return (
      <View style={[styles.root, { backgroundColor: screenBackgroundColor }]}>
        <LessonHeader title="Lekcja" accentHex={theme.colors.primary} onBack={goBackToLevels} />
        <View style={styles.centerFill}>
          <Text style={{ fontSize: theme.fontSize.heading, fontWeight: "800", color: theme.colors.ink, textAlign: "center" }}>Ta lekcja jeszcze czeka</Text>
          <Text style={{ color: theme.colors.muted, textAlign: "center", marginTop: 8 }}>
            Wróć w dniu, na który jest zaplanowana, żeby ją ukończyć. Dziś robisz tylko lekcje z planu na dziś.
          </Text>
          <View style={{ marginTop: theme.spacing(2), width: "100%" }}>
            <DarkButton label="Pograj w Tryb zabawy" onPress={playInFunMode} />
            <View style={{ height: theme.spacing(1) }} />
            <DarkButton label="Wróć do planu" onPress={goBackToLevels} variant="secondary" />
          </View>
        </View>
      </View>
    );
  }

  if (isFinished) {
    return (
      <>
        <LessonSummary
          mistakeCount={mistakeCount}
          totalExercises={originalExerciseCount}
          stars={resolveStars()}
          timedTestResult={timedTestResult}
          isPerfect={isPerfectRun}
          accentHex={world.accentColor}
          backgroundColor={screenBackgroundColor}
          // Opened from the study plan → back to the plan (map in "Tryb nauki"), not the world's level list.
          onExit={
            fromPlan
              ? () => {
                  setView("plan");
                  router.replace({ pathname: "/(main)/map", params: { focusLessonId: lessonId } });
                }
              : goBackToLevels
          }
          exitLabel={fromPlan ? "Wróć do planu" : t("lesson.backToLevels", "pl")}
          nextTodayLessonLabel={nextTodayLessonId ? describeLesson(nextTodayLessonId) : null}
          onNextTodayLesson={
            nextTodayLessonId
              ? () => {
                  const info = getLessonInfo(nextTodayLessonId);
                  if (info) router.replace({ pathname: "/(main)/lesson/[lessonId]", params: { lessonId: nextTodayLessonId, worldId: info.worldId, mode: "plan" } });
                }
              : undefined
          }
          todayPlanDone={todayPlanDone}
          gainedXp={gained.xp}
          gainedNutki={gained.nutki}
          level={getRankForXp(gamificationState.xp).rank}
          streakDays={gamificationState.streakDays}
          todayLessonCount={todayPlanIds.length}
          onPlayFunMode={fromPlan ? playInFunMode : undefined}
        />
        <WorldCompleteModal
          visible={showWorldComplete}
          worldName={t(world.nameKey as TranslationKey)}
          nextWorldName={unlockedNextWorldName}
          isPerfectWorld={isPerfectWorldCompletion}
          accentHex={world.accentColor}
          onClose={() => setShowWorldComplete(false)}
        />
      </>
    );
  }

  // A one-off full screen BETWEEN two exercises (see
  // showEncouragementInterstitial's own doc) — every ENCOURAGEMENT_INTERVAL
  // checkpoint gets Solfek's full "lg" portrait-and-bubble treatment (the
  // same size SoltekWelcomeModal gives him), not squeezed into the small
  // inline feedback row every check/miss uses, since this moment is meant
  // to actually land, not blend into the usual flow. The message itself
  // is one of ENCOURAGEMENT_MESSAGE_COUNT lines (lesson.encouragement1..N
  // in pl.json), rolled once in handleCheck and stored in
  // encouragementMessageIndex so it stays put while this screen is up.
  if (showEncouragementInterstitial) {
    return (
      <View style={[styles.root, { backgroundColor: screenBackgroundColor }]}>
        <LessonHeader title={`${t(world.nameKey as TranslationKey)} · ${lesson.order}`} accentHex={world.accentColor} onBack={goBackToLevels} />
        <View style={styles.centerFill}>
          <SoltekMascot size="lg" frameless expression="zachecajacy" message={t(`lesson.encouragement${encouragementMessageIndex}` as TranslationKey, "pl")} />
          <View style={{ height: theme.spacing(3) }} />
          <DarkButton label={t("lesson.continue", "pl")} onPress={handleEncouragementContinue} />
        </View>
      </View>
    );
  }

  // Same shape as the encouragement interstitial above, for a genuine
  // STREAK_CELEBRATION_INTERVAL-long run of correct answers instead of a
  // struggle — "radosny" (happy), not "zachecajacy" (encouraging), since
  // this moment is a reward, not a boost.
  if (showStreakInterstitial) {
    return (
      <View style={[styles.root, { backgroundColor: screenBackgroundColor }]}>
        <LessonHeader title={`${t(world.nameKey as TranslationKey)} · ${lesson.order}`} accentHex={world.accentColor} onBack={goBackToLevels} />
        <View style={styles.centerFill}>
          <SoltekMascot size="lg" frameless expression="radosny" message={t("lesson.streakCelebration", "pl")} />
          <View style={{ height: theme.spacing(3) }} />
          <DarkButton label={t("lesson.continue", "pl")} onPress={handleStreakContinue} />
        </View>
      </View>
    );
  }

  if (currentLesson.introSlides && currentLesson.introSlides.length > 0 && !introDismissed) {
    return (
      <View style={[styles.root, { backgroundColor: screenBackgroundColor }]}>
        <LessonHeader title={`${t(world.nameKey as TranslationKey)} · ${lesson.order}`} accentHex={world.accentColor} onBack={goBackToLevels} />
        <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 16 }}>
          <LessonTheoryIntro slides={currentLesson.introSlides} locale="pl" onContinue={handleIntroContinue} bossName={currentLesson.bossName} />
        </View>
      </View>
    );
  }

  if (currentLesson.introNotes && currentLesson.introNotes.length > 0 && !introDismissed) {
    return (
      <View style={[styles.root, { backgroundColor: screenBackgroundColor }]}>
        <LessonHeader title={`${t(world.nameKey as TranslationKey)} · ${lesson.order}`} accentHex={world.accentColor} onBack={goBackToLevels} />
        <ScrollView contentContainerStyle={styles.exerciseArea}>
          <LessonIntro
            notes={currentLesson.introNotes}
            subtitle={currentLesson.introSubtitle}
            clef={currentLesson.introClef}
            locale="pl"
            onContinue={handleIntroContinue}
          />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: screenBackgroundColor }]}>
      <LessonHeader title={`${t(world.nameKey as TranslationKey)} · ${lesson.order}`} accentHex={world.accentColor} onBack={() => setConfirmLeave(true)} />

      <View style={styles.progressWrap}>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { backgroundColor: world.accentColor, width: `${((index + (checked ? 1 : 0)) / exercises.length) * 100}%` },
            ]}
          />
        </View>
        <LevelBar xp={gamificationState.xp} />
        <LiveStarIndicator
          correctSoFar={correctCount}
          totalExercises={originalExerciseCount}
          starsOverride={timedTestResult ? resolveStars() : exercise.type === "interval-timed-test" ? 0 : undefined}
        />
      </View>

      {isReviewRound && (
        <View style={[styles.reviewBanner, { borderColor: world.accentColor }]}>
          <GlyphText style={[styles.reviewBannerText, { color: world.accentColor }]}>🔁 {t("lesson.reviewRoundBanner", "pl")}</GlyphText>
        </View>
      )}

      <ScrollView contentContainerStyle={[styles.exerciseArea, checked && !isSelfCheckExercise && { paddingBottom: 230 }]} keyboardShouldPersistTaps="handled" scrollEnabled={scrollEnabled}>
        {/* Consecutive exercises of the SAME type (e.g. two
            rhythm-dictation exercises back to back) would otherwise sit
            at the same JSX position and reuse the same component
            instance across exercises — carrying its own local state
            (the standalone-metronome dot's on/off, RhythmNotationTap's
            preview/perform phase, ...) over from the previous exercise
            instead of starting fresh. Keying by the exercise's own id
            forces a full remount on every exercise change. */}
        {introModeEnabled && currentLesson.introSlides && currentLesson.introSlides.length > 0 && (
          <ExerciseIntroRecap key={`${definition.id}-recap`} slides={currentLesson.introSlides} locale="pl" bossName={currentLesson.bossName} />
        )}
        {introModeEnabled && currentLesson.pianoKeyboardReference && (
          <PianoKeyboardRecap key={`${definition.id}-piano-recap`} range={currentLesson.pianoKeyboardReference.range} />
        )}
        {introModeEnabled && currentLesson.introNotes && currentLesson.introNotes.length > 0 && (
          <LessonIntroRecap
            key={`${definition.id}-notes-recap`}
            notes={currentLesson.introNotes}
            locale="pl"
            clef={currentLesson.introClef}
          />
        )}
        <ExerciseTransition key={`${definition.id}-${index}`}>
          <ExerciseRenderer
            key={definition.id}
            exercise={exercise}
            answer={answer}
            onAnswerChange={setAnswer}
            checked={checked}
            isCorrect={isCorrect}
            locale="pl"
            onDrawingActiveChange={(active) => setScrollEnabled(!active)}
          />
        </ExerciseTransition>
      </ScrollView>

      <View style={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 16, opacity: checked && !isSelfCheckExercise ? 0 : 1 }} pointerEvents={checked && !isSelfCheckExercise ? "none" : "auto"}>
        <DarkButton
          label={checked || isSelfCheckExercise ? t("lesson.continue", "pl") : t("lesson.checkAnswer", "pl")}
          onPress={isSelfCheckExercise ? handleSelfCheckContinue : checked ? handleContinue : handleCheck}
          disabled={!checked && !hasAnswerToCheck(answer)}
        />
      </View>

      {/* After "Sprawdź": the big green (or red) sheet with the result and a wide "Dalej". */}
      <AnswerFeedbackPanel
        visible={checked && !isSelfCheckExercise}
        correct={isCorrect}
        detail={isCorrect ? `+${XP_PER_CORRECT_ANSWER} XP · +${NUTKI_PER_CORRECT_ANSWER} nutki` : undefined}
        buttonLabel={t("lesson.continue", "pl")}
        onContinue={handleContinue}
        testID="answer-panel"
      />

      {confirmLeave && (
        <LeaveLessonModal
          remaining={Math.max(1, exercises.length - index)}
          onStay={() => setConfirmLeave(false)}
          onLeave={() => {
            setConfirmLeave(false);
            goBackToLevels();
          }}
        />
      )}
    </View>
  );
}

function LessonHeader({ title, accentHex, onBack }: { title: string; accentHex: string; onBack: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Wstecz" hitSlop={12} style={styles.backButton}>
        <Text style={styles.backIcon}>✕</Text>
      </Pressable>
      <Text style={[styles.headerTitle, { color: accentHex }]} numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
}

/** Live star indicator shown DURING the lesson (not just at the end, per
 * LessonSummary's own star row) — unlike that final rating,
 * computeLessonStarsProgress grades against exercises ANSWERED so far,
 * not a best-case projection against the whole lesson, so this genuinely
 * climbs star by star as the player progresses (never drops back down,
 * since correctSoFar only ever goes up) rather than starting at a
 * ceiling and only ever falling. Whichever star just newly lit up gets a
 * quick pop (scale up then spring back) so the moment it happens is
 * actually visible, not just a silent state change — same "brief,
 * one-shot, not a looping celebration" restraint as LessonSummary's own
 * AnimatedSummaryStars, since this sits on screen through the whole
 * lesson. */
function LiveStarIndicator({
  correctSoFar,
  totalExercises,
  starsOverride,
}: {
  correctSoFar: number;
  totalExercises: number;
  starsOverride?: 0 | 1 | 2 | 3;
}) {
  const stars = starsOverride ?? computeLessonStarsProgress(correctSoFar, totalExercises);
  const scales = useRef([1, 2, 3].map(() => new Animated.Value(1))).current;
  const previousStarsRef = useRef(stars);

  useEffect(() => {
    for (let position = previousStarsRef.current + 1; position <= stars; position++) {
      const scale = scales[position - 1];
      scale.setValue(1);
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.5, duration: 120, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 3, tension: 160, useNativeDriver: true }),
      ]).start();
    }
    previousStarsRef.current = stars;
  }, [stars, scales]);

  return (
    <View style={styles.liveStarRow}>
      <Text style={styles.liveStarLabel}>Twoja ocena:</Text>
      {[1, 2, 3].map((position) => (
        <Animated.Text
          key={position}
          style={[
            styles.liveStar,
            position <= stars ? styles.liveStarFilled : styles.liveStarEmpty,
            { transform: [{ scale: scales[position - 1] }] },
          ]}
        >
          {position <= stars ? "★" : "☆"}
        </Animated.Text>
      ))}
    </View>
  );
}

function LessonSummary({
  mistakeCount,
  totalExercises,
  stars,
  timedTestResult,
  isPerfect,
  accentHex,
  backgroundColor,
  onExit,
  nextTodayLessonLabel,
  onNextTodayLesson,
  todayPlanDone,
  exitLabel,
  gainedXp,
  gainedNutki,
  level,
  streakDays,
  todayLessonCount,
  onPlayFunMode,
}: {
  onPlayFunMode?: () => void;
  gainedXp: number;
  gainedNutki: number;
  level: number;
  streakDays: number;
  todayLessonCount: number;
  exitLabel: string;
  nextTodayLessonLabel: string | null;
  onNextTodayLesson?: () => void;
  /** True when this lesson was the last unfinished one of today's study plan. */
  todayPlanDone: boolean;
  mistakeCount: number;
  totalExercises: number;
  stars: 1 | 2 | 3;
  timedTestResult: { correctCount: number; totalCount: number } | null;
  isPerfect: boolean;
  accentHex: string;
  backgroundColor: string;
  onExit: () => void;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.root,
        styles.summaryWrap,
        { backgroundColor, paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <GlyphText style={{ fontSize: 56 }}>{isPerfect ? "🎉" : "✅"}</GlyphText>
      <Text style={{ fontSize: theme.fontSize.heading, fontWeight: "800", color: theme.colors.ink }}>
        {t("lesson.lessonComplete", "pl")}
      </Text>
      <AnimatedSummaryStars stars={stars} />
      {isPerfect && (
        <View style={[styles.perfectBadge, { borderColor: theme.colors.success }]}>
          <GlyphText style={{ color: theme.colors.success, fontWeight: "700", fontSize: 13 }}>✨ Perfekcyjnie!</GlyphText>
        </View>
      )}
      <Text style={{ color: theme.colors.muted }}>
        {timedTestResult
          ? `Poprawnych: ${timedTestResult.correctCount}, błędnych: ${timedTestResult.totalCount - timedTestResult.correctCount}`
          : `${totalExercises - mistakeCount}/${totalExercises} poprawnie za pierwszym razem`}
      </Text>
      {(gainedXp > 0 || gainedNutki > 0) && (
        <View style={styles.rewardRow}>
          <View style={styles.rewardPill}>
            <AppIcon name="hud_ranga_gwiazda" size={18} />
            <Text style={styles.rewardPillText}>+{gainedXp} XP</Text>
          </View>
          {gainedNutki > 0 && (
            <View style={styles.rewardPill}>
              <AppIcon name="hud_nutki_waluta" size={18} />
              <Text style={styles.rewardPillText}>+{gainedNutki} nutek</Text>
            </View>
          )}
          <View style={styles.rewardPill}>
            <Text style={styles.rewardPillText}>Level {level}</Text>
          </View>
        </View>
      )}
      {todayPlanDone && (
        <View style={[styles.dayDone, { borderColor: theme.colors.success }]}>
          <GlyphText style={{ fontSize: 34 }}>🏆</GlyphText>
          <Text style={{ color: theme.colors.success, fontWeight: "800", fontSize: 17, textAlign: "center" }}>Dzień zaliczony!</Text>
          <Text style={{ color: theme.colors.ink, fontWeight: "700", fontSize: 13.5, textAlign: "center" }}>
            Wszystkie zaplanowane lekcje na dziś zrobione{todayLessonCount > 1 ? ` (${todayLessonCount})` : ""}.
          </Text>
          <Text style={{ color: theme.colors.muted, fontSize: 12.5, textAlign: "center" }}>
            {`🔥 ${streakComment(todayISODate(), streakDays)}`}
          </Text>
        </View>
      )}
      {todayPlanDone && <Confetti count={40} />}
      <View style={{ marginTop: theme.spacing(2), width: "100%", gap: theme.spacing(1.25) }}>
        {onNextTodayLesson && nextTodayLessonLabel && (
          <>
            <Text style={{ color: theme.colors.muted, textAlign: "center", fontSize: 12.5 }}>Następna w planie na dziś: {nextTodayLessonLabel}</Text>
            <DarkButton label="Przejdź do następnej lekcji dnia ›" onPress={onNextTodayLesson} />
          </>
        )}
        {/* Today's plan is finished: instead of waiting for tomorrow, offer the game. */}
        {todayPlanDone && onPlayFunMode && <DarkButton label="Pograj w Tryb zabawy" onPress={onPlayFunMode} />}
        <DarkButton label={exitLabel} onPress={onExit} variant={onNextTodayLesson || (todayPlanDone && onPlayFunMode) ? "secondary" : "primary"} />
      </View>
    </View>
  );
}

const STAR_POP_STAGGER_MS = 150;

/** The summary screen's own star row — each EARNED star pops in with a
 * brief overshoot-and-settle (spring past full size, then back down),
 * one after another, so the moment reads as "here's what you got" rather
 * than the whole row just appearing at once. Deliberately small and
 * quick (no loop, no glow/sparkle) — this sits on a screen the player
 * taps through often, unlike RankUpCelebration's own much rarer, bigger
 * moment; a distracting animation here would get old fast. Un-earned
 * (empty) stars just fade in place, no bounce — nothing to celebrate
 * about them. Runs once per mount: LessonSummary mounts fresh each time
 * a lesson finishes (isFinished flips from false to true), so there's no
 * need to re-trigger on prop changes. */
function AnimatedSummaryStars({ stars }: { stars: 1 | 2 | 3 }) {
  const scales = useRef([0, 1, 2].map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const animations = scales.map((scale, index) => {
      const isEarned = index + 1 <= stars;
      return Animated.sequence([
        Animated.delay(index * STAR_POP_STAGGER_MS),
        isEarned
          ? Animated.spring(scale, { toValue: 1, friction: 4, tension: 140, useNativeDriver: true })
          : Animated.timing(scale, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]);
    });
    Animated.parallel(animations).start();
  }, [stars, scales]);

  return (
    <View style={styles.summaryStarRow}>
      {[1, 2, 3].map((position, index) => (
        <Animated.Text
          key={position}
          style={[
            styles.summaryStar,
            position <= stars ? styles.summaryStarFilled : styles.summaryStarEmpty,
            { transform: [{ scale: scales[index] }], opacity: scales[index] },
          ]}
        >
          {position <= stars ? "★" : "☆"}
        </Animated.Text>
      ))}
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
    flexShrink: 1,
  },
  progressWrap: {
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.surfaceMuted,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
  },
  reviewBanner: {
    marginHorizontal: 24,
    marginBottom: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    alignSelf: "flex-start",
  },
  reviewBannerText: {
    fontSize: 13,
    fontWeight: "700",
  },
  liveStarRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 2,
  },
  liveStarLabel: {
    color: theme.colors.muted,
    fontSize: 12,
    marginRight: 4,
  },
  liveStar: {
    fontSize: 14,
  },
  liveStarFilled: {
    color: "#facc15",
  },
  liveStarEmpty: {
    color: theme.colors.border,
  },
  exerciseArea: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  summaryWrap: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
  rewardRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8 },
  rewardPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: theme.colors.surfaceMuted,
  },
  rewardPillText: { color: theme.colors.ink, fontWeight: "800", fontSize: 13 },
  dayDone: {
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 2,
    backgroundColor: theme.colors.surface,
    maxWidth: 360,
  },
  perfectBadge: {
    borderWidth: theme.borderWidth,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: theme.colors.surface,
  },
  summaryStarRow: {
    flexDirection: "row",
  },
  summaryStar: {
    fontSize: 36,
    marginHorizontal: 3,
  },
  summaryStarFilled: {
    color: "#facc15",
  },
  summaryStarEmpty: {
    color: theme.colors.border,
  },
});
