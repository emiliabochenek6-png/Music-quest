import { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import { DarkButton } from "@/components/exercises/DarkButton";
import { IntervalStaffNotation } from "@/components/exercises/IntervalStaffNotation";
import { OptionButton } from "@/components/exercises/OptionButton";
import { playInterval } from "@/lib/audio/player";
import { formatScientific, parseScientific } from "@/lib/music/notes";
import { getIntervalDisplayName, intervalSemitones, pickRandomIntervalNotePair } from "@/lib/music/intervals";
import { t } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { AnswerInput, GeneratedExercise } from "@/types/exercises";

interface IntervalTimedTestExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "interval-timed-test" }>;
  answer: Extract<AnswerInput, { type: "interval-timed-test" }> | null;
  onAnswerChange: (answer: AnswerInput) => void;
  checked: boolean;
  locale: Locale;
}

/** How long the correct/incorrect highlight shows before the next
 * question replaces it — matches the web app's own FEEDBACK_DELAY_MS. */
const FEEDBACK_DELAY_MS = 500;

interface Question {
  notes: [string, string];
  options: { id: string; label: string }[];
  correctOptionId: string;
}

function shuffled<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Builds one question live — a fresh random note pair plus its option
 * pool. Deliberately reimplements generate.ts's sampling shape here rather
 * than importing it, since this component mints many fresh questions
 * during play rather than resolving one authored exercise once — same
 * split the web app's own version makes. */
function buildQuestion(noteRange: [string, string], allowedSemitones: readonly number[], optionCount: number, locale: Locale): Question {
  const [rootNote, otherNote] = pickRandomIntervalNotePair(
    [parseScientific(noteRange[0]), parseScientific(noteRange[1])],
    allowedSemitones
  );
  const semitones = intervalSemitones(rootNote, otherNote);
  const distractorPool = allowedSemitones.filter((value) => value !== semitones);
  const distractorCount = Math.min(optionCount - 1, distractorPool.length);
  const distractors = shuffled(distractorPool).slice(0, distractorCount);
  const options = shuffled([semitones, ...distractors]).map((value) => ({
    id: String(value),
    label: getIntervalDisplayName(value, locale),
  }));
  return {
    notes: [formatScientific(rootNote), formatScientific(otherNote)],
    options,
    correctOptionId: String(semitones),
  };
}

/**
 * "Pasmo Interwałów" level 8 — the culminating "wielki miks" test: for
 * exercise.durationSeconds, the player answers as many rapid-fire
 * interval-name questions as they can (a fresh one right after each
 * answer), drawn from the full mixed interval pool. The whole run reports
 * as a single answer (correctCount/totalCount) once time's up — from then
 * on the screen's own "Sprawdź" button validates it via
 * isValidIntervalTimedTest (60% bar), same as every other exercise type.
 * Ported from the web app's IntervalTimedTestExercise.tsx.
 */
export function IntervalTimedTestExercise({ exercise, answer, onAnswerChange, checked, locale }: IntervalTimedTestExerciseProps) {
  const [phase, setPhase] = useState<"ready" | "running" | "done">(answer ? "done" : "ready");
  const [secondsLeft, setSecondsLeft] = useState(exercise.durationSeconds);
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [counts, setCounts] = useState({ correct: answer?.correctCount ?? 0, total: answer?.totalCount ?? 0 });
  const countsRef = useRef(counts);
  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    countsRef.current = counts;
  }, [counts]);

  useEffect(() => {
    if (phase !== "running") {
      return;
    }
    let remaining = exercise.durationSeconds;
    const id = setInterval(() => {
      remaining -= 1;
      setSecondsLeft(Math.max(remaining, 0));
      if (remaining <= 0) {
        clearInterval(id);
        if (advanceTimeoutRef.current) {
          clearTimeout(advanceTimeoutRef.current);
        }
        setPhase("done");
        onAnswerChange({ type: "interval-timed-test", correctCount: countsRef.current.correct, totalCount: countsRef.current.total });
      }
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current) {
        clearTimeout(advanceTimeoutRef.current);
      }
    };
  }, []);

  function handleStart() {
    setSecondsLeft(exercise.durationSeconds);
    setCounts({ correct: 0, total: 0 });
    setQuestion(buildQuestion(exercise.noteRange, exercise.allowedSemitones, exercise.optionCount, locale));
    setSelectedOptionId(null);
    setPhase("running");
  }

  function playCurrentQuestion() {
    if (!question) return;
    const [a, b] = question.notes;
    playInterval([parseScientific(a), parseScientific(b)]);
  }

  function handleSelect(optionId: string) {
    if (!question || selectedOptionId !== null || secondsLeft === 0) {
      return;
    }
    setSelectedOptionId(optionId);
    const isCorrect = optionId === question.correctOptionId;
    setCounts((current) => ({
      correct: current.correct + (isCorrect ? 1 : 0),
      total: current.total + 1,
    }));
    advanceTimeoutRef.current = setTimeout(() => {
      setQuestion(buildQuestion(exercise.noteRange, exercise.allowedSemitones, exercise.optionCount, locale));
      setSelectedOptionId(null);
    }, FEEDBACK_DELAY_MS);
  }

  if (phase === "ready") {
    return (
      <View style={{ alignItems: "center", gap: theme.spacing(3) }}>
        <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
          {t("lesson.intervalTimedTestReadyPrompt", locale, { seconds: exercise.durationSeconds })}
        </Text>
        <DarkButton label={t("lesson.intervalTimedTestStart", locale)} onPress={handleStart} />
      </View>
    );
  }

  if (phase === "done") {
    const finalCorrect = answer?.correctCount ?? counts.correct;
    const finalTotal = answer?.totalCount ?? counts.total;
    return (
      <View style={{ alignItems: "center", gap: theme.spacing(2) }}>
        <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
          {t("lesson.intervalTimedTestDone", locale)}
        </Text>
        <Text style={{ fontSize: theme.fontSize.heading, fontWeight: "800", color: theme.colors.primary }}>
          {finalCorrect} / {finalTotal}
        </Text>
      </View>
    );
  }

  return (
    <View style={{ alignItems: "center", gap: theme.spacing(3) }}>
      <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
        <Text style={{ color: theme.colors.muted, fontSize: theme.fontSize.body * 0.85 }}>
          {t("lesson.intervalTimedTestTimeLeft", locale, { seconds: secondsLeft })}
        </Text>
        <Text style={{ color: theme.colors.muted, fontSize: theme.fontSize.body * 0.85 }}>
          {t("lesson.intervalTimedTestScore", locale, { correct: counts.correct, total: counts.total })}
        </Text>
      </View>

      {question && <IntervalStaffNotation notes={question.notes} />}

      <DarkButton label="🔊" onPress={playCurrentQuestion} variant="secondary" size={72} fontSize={32} />

      <View style={{ width: "100%", gap: theme.spacing(1.5) }}>
        {question?.options.map((option) => (
          <OptionButton
            key={option.id}
            label={option.label}
            selected={selectedOptionId === option.id}
            correct={selectedOptionId !== null && option.id === question.correctOptionId}
            incorrect={selectedOptionId === option.id && option.id !== question.correctOptionId}
            disabled={selectedOptionId !== null || checked}
            onPress={() => handleSelect(option.id)}
          />
        ))}
      </View>
    </View>
  );
}
