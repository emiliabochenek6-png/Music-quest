import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Pressable, View, Text, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { DarkButton } from "@/components/exercises/DarkButton";
import { ExerciseIntroRecap } from "@/components/exercises/ExerciseIntroRecap";
import { ExerciseRenderer, hasAnswerToCheck } from "@/components/exercises/ExerciseRenderer";
import { LessonIntro } from "@/components/exercises/LessonIntro";
import { LessonIntroRecap } from "@/components/exercises/LessonIntroRecap";
import { LessonTheoryIntro } from "@/components/exercises/LessonTheoryIntro";
import { PianoKeyboardRecap } from "@/components/exercises/PianoKeyboardRecap";
import { WorldCompleteModal } from "@/components/exercises/WorldCompleteModal";
import { OutOfHeartsModal } from "@/components/OutOfHeartsModal";
import { getWorldContent } from "@/data/lessons";
import { getWorldById } from "@/data/worlds";
import { useGamification } from "@/context/GamificationContext";
import { useProgress } from "@/context/ProgressContext";
import { useSessionTimer } from "@/hooks/useSessionTimer";
import { stopAllScheduledAudio } from "@/lib/audio/rhythmPlayer";
import { todayISODate } from "@/lib/gamification/activity";
import { computeLessonStars } from "@/lib/gamification/stars";
import { generateExercise, getExerciseSignature } from "@/lib/questions/generate";
import { isAnswerCorrect } from "@/lib/questions/validate";
import { t } from "@/lib/i18n/translate";
import type { TranslationKey } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { AnswerInput } from "@/types/exercises";

/** +10 XP per exercise answered correctly on the first (and only —
 * see handleCheck's own doc) attempt, +20 on top for a lesson finished
 * with zero mistakes at all. */
const XP_PER_CORRECT_ANSWER = 10;
const XP_PERFECT_LESSON_BONUS = 20;

/**
 * Runs ONE lesson's exercises, in order — reached from a world's own
 * levels screen (app/(main)/world/[worldId].tsx), not directly from the
 * map. Same dark-cosmic visual world as the map/levels screens (see
 * theme/darkExerciseTheme.ts's own doc) rather than this app's light
 * dual-mode system. "Back" always returns to that levels screen (via
 * `worldId`, not a bare router.back(), so mid-lesson navigation state
 * never strands the player somewhere unexpected). Finishing the last
 * exercise shows a small summary card, then marks the lesson (and, if it
 * was the world's last lesson, the whole world) done before returning —
 * completing a world for the first time additionally layers a celebratory
 * WorldCompleteModal over that summary.
 */
export default function LessonScreen() {
  const { lessonId, worldId } = useLocalSearchParams<{ lessonId: string; worldId: string }>();
  const insets = useSafeAreaInsets();
  const { markLessonCompleted, markWorldCompleted } = useProgress();
  const { getHeartsInfo, loseHeart, awardXp, recordLessonStars, recordActivity } = useGamification();
  const { getElapsedMinutes } = useSessionTimer(lessonId);
  const [showOutOfHearts, setShowOutOfHearts] = useState(false);
  // Snapshot taken at the moment hearts run out — OutOfHeartsModal ticks
  // its own countdown down from this rather than re-reading
  // getHeartsInfo() live (see that component's own doc).
  const [outOfHeartsMs, setOutOfHeartsMs] = useState<number | null>(null);

  const world = getWorldById(worldId);
  const content = getWorldContent(worldId);
  const lesson = content?.lessons.find((l) => l.id === lessonId);

  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<AnswerInput | null>(null);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [mistakeCount, setMistakeCount] = useState(0);
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

  // A metronome click track (Miasto Rytmu's rhythm exercises) can run for
  // many measures — without this, leaving the screen any other way than
  // waiting for it to finish on its own left it quietly ticking into
  // whatever came next (the summary screen, the levels map, ...).
  useEffect(() => stopAllScheduledAudio, []);

  function goBackToLevels() {
    stopAllScheduledAudio();
    router.replace({ pathname: "/(main)/world/[worldId]", params: { worldId } });
  }

  if (!world || !content || !lesson) {
    return (
      <View style={styles.root}>
        <LessonHeader title="Lekcja" accentHex={theme.colors.primary} onBack={goBackToLevels} />
        <View style={styles.centerFill}>
          <Text style={{ color: theme.colors.muted }}>Nie znaleziono tej lekcji.</Text>
        </View>
      </View>
    );
  }

  const exercises = lesson.exercises;
  const definition = exercises[index];
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

  function handleCheck() {
    if (!answer) return;
    stopAllScheduledAudio();
    const correct = isAnswerCorrect(exercise, answer);
    setChecked(true);
    setIsCorrect(correct);
    if (!correct) {
      setMistakeCount((n) => n + 1);
      loseHeart();
    } else {
      awardXp(XP_PER_CORRECT_ANSWER);
    }
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

  function handleContinue() {
    stopAllScheduledAudio();
    if (index + 1 < exercises.length) {
      // A heart could have run out on THIS question (a wrong answer) or
      // an earlier one in the same attempt — either way, no further
      // exercises until at least one regenerates (see this screen's own
      // doc and OutOfHeartsModal's). The question just answered still
      // shows its own right/wrong feedback above; only moving PAST it is
      // blocked.
      const heartsInfo = getHeartsInfo();
      if (heartsInfo.hearts <= 0) {
        setOutOfHeartsMs(heartsInfo.msUntilNextHeart);
        setShowOutOfHearts(true);
        return;
      }
      setIndex(index + 1);
      setAnswer(null);
      setChecked(false);
      setIsCorrect(null);
    } else {
      markLessonCompleted(currentLesson.id);
      const isLastLessonInWorld = currentLesson.order === currentContent.lessons.length;
      if (isLastLessonInWorld) {
        markWorldCompleted(currentWorld.id);
        setShowWorldComplete(true);
      }
      if (mistakeCount === 0) awardXp(XP_PERFECT_LESSON_BONUS);
      recordLessonStars(currentLesson.id, computeLessonStars(mistakeCount, exercises.length));
      recordActivity(todayISODate(), { minutesSpent: getElapsedMinutes(), lessonIdCompleted: currentLesson.id });
      setIsFinished(true);
    }
  }

  if (isFinished) {
    return (
      <>
        <LessonSummary
          mistakeCount={mistakeCount}
          totalExercises={exercises.length}
          stars={computeLessonStars(mistakeCount, exercises.length)}
          accentHex={world.accentColor}
          onExit={goBackToLevels}
        />
        <WorldCompleteModal
          visible={showWorldComplete}
          worldName={t(world.nameKey as TranslationKey)}
          accentHex={world.accentColor}
          onClose={() => setShowWorldComplete(false)}
        />
      </>
    );
  }

  if (currentLesson.introSlides && currentLesson.introSlides.length > 0 && !introDismissed) {
    return (
      <View style={styles.root}>
        <LessonHeader title={`${t(world.nameKey as TranslationKey)} · ${lesson.order}`} accentHex={world.accentColor} onBack={goBackToLevels} />
        <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 16 }}>
          <LessonTheoryIntro slides={currentLesson.introSlides} locale="pl" onContinue={handleIntroContinue} />
        </View>
      </View>
    );
  }

  if (currentLesson.introNotes && currentLesson.introNotes.length > 0 && !introDismissed) {
    return (
      <View style={styles.root}>
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
    <View style={styles.root}>
      <LessonHeader title={`${t(world.nameKey as TranslationKey)} · ${lesson.order}`} accentHex={world.accentColor} onBack={goBackToLevels} />

      <View style={styles.progressWrap}>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { backgroundColor: world.accentColor, width: `${((index + (checked ? 1 : 0)) / exercises.length) * 100}%` },
            ]}
          />
        </View>
        <LiveStarIndicator mistakeCount={mistakeCount} totalExercises={exercises.length} />
      </View>

      <ScrollView contentContainerStyle={styles.exerciseArea} keyboardShouldPersistTaps="handled" scrollEnabled={scrollEnabled}>
        {/* Consecutive exercises of the SAME type (e.g. two
            rhythm-dictation exercises back to back) would otherwise sit
            at the same JSX position and reuse the same component
            instance across exercises — carrying its own local state
            (the standalone-metronome dot's on/off, RhythmNotationTap's
            preview/perform phase, ...) over from the previous exercise
            instead of starting fresh. Keying by the exercise's own id
            forces a full remount on every exercise change. */}
        {currentLesson.introSlides && currentLesson.introSlides.length > 0 && (
          <ExerciseIntroRecap key={`${definition.id}-recap`} slides={currentLesson.introSlides} locale="pl" />
        )}
        {currentLesson.pianoKeyboardReference && (
          <PianoKeyboardRecap key={`${definition.id}-piano-recap`} range={currentLesson.pianoKeyboardReference.range} />
        )}
        {currentLesson.introNotes && currentLesson.introNotes.length > 0 && (
          <LessonIntroRecap
            key={`${definition.id}-notes-recap`}
            notes={currentLesson.introNotes}
            locale="pl"
            clef={currentLesson.introClef}
          />
        )}
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
            {isCorrect ? t("lesson.correct", "pl") : t("lesson.incorrect", "pl")}
          </Text>
        )}
        <DarkButton
          label={checked ? t("lesson.continue", "pl") : t("lesson.checkAnswer", "pl")}
          onPress={checked ? handleContinue : handleCheck}
          disabled={!checked && !hasAnswerToCheck(answer)}
        />
      </View>
      <OutOfHeartsModal
        visible={showOutOfHearts}
        msUntilNextHeart={outOfHeartsMs}
        onExit={goBackToLevels}
        onGoPremium={() => router.push("/paywall")}
      />
    </View>
  );
}

function LessonHeader({ title, accentHex, onBack }: { title: string; accentHex: string; onBack: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Wstecz" hitSlop={12} style={styles.backButton}>
        <Text style={styles.backIcon}>‹</Text>
      </Pressable>
      <Text style={[styles.headerTitle, { color: accentHex }]} numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
}

/** Live star projection shown DURING the lesson (not just at the end, per
 * LessonSummary's own star row) — computeLessonStars is a pure function
 * of mistakes-so-far vs. total exercises, so this can just call it fresh
 * on every render as mistakeCount changes, no separate state needed. A
 * mistake already made can't be undone, so this can only ever drop a
 * tier or stay put as the lesson goes on, never climb back up — that's
 * the whole point: the player sees exactly which mistake cost them a
 * star, right when it happens, instead of finding out only at the very
 * end. */
function LiveStarIndicator({ mistakeCount, totalExercises }: { mistakeCount: number; totalExercises: number }) {
  const stars = computeLessonStars(mistakeCount, totalExercises);
  return (
    <View style={styles.liveStarRow}>
      <Text style={styles.liveStarLabel}>Twoja ocena:</Text>
      {[1, 2, 3].map((position) => (
        <Text key={position} style={[styles.liveStar, position <= stars ? styles.liveStarFilled : styles.liveStarEmpty]}>
          {position <= stars ? "★" : "☆"}
        </Text>
      ))}
    </View>
  );
}

function LessonSummary({
  mistakeCount,
  totalExercises,
  stars,
  accentHex,
  onExit,
}: {
  mistakeCount: number;
  totalExercises: number;
  stars: 1 | 2 | 3;
  accentHex: string;
  onExit: () => void;
}) {
  const insets = useSafeAreaInsets();
  const isPerfect = mistakeCount === 0;

  return (
    <View style={[styles.root, styles.summaryWrap, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <Text style={{ fontSize: 56 }}>{isPerfect ? "🎉" : "✅"}</Text>
      <Text style={{ fontSize: theme.fontSize.heading, fontWeight: "800", color: theme.colors.ink }}>
        {t("lesson.lessonComplete", "pl")}
      </Text>
      <AnimatedSummaryStars stars={stars} />
      {isPerfect && (
        <View style={[styles.perfectBadge, { borderColor: theme.colors.success }]}>
          <Text style={{ color: theme.colors.success, fontWeight: "700", fontSize: 13 }}>✨ Perfekcyjnie!</Text>
        </View>
      )}
      <Text style={{ color: theme.colors.muted }}>
        {totalExercises - mistakeCount}/{totalExercises} poprawnie za pierwszym razem
      </Text>
      <View style={{ marginTop: theme.spacing(2), width: "100%" }}>
        <DarkButton label={t("lesson.backToLevels", "pl")} onPress={onExit} />
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
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    fontSize: 20,
    color: "#fff",
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
    backgroundColor: "rgba(255,255,255,0.1)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
  },
  liveStarRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 2,
  },
  liveStarLabel: {
    color: "rgba(236,232,255,0.6)",
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
    color: "rgba(255,255,255,0.25)",
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
  perfectBadge: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
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
    color: "rgba(255,255,255,0.25)",
  },
});
