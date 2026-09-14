import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { DarkButton } from "@/components/exercises/DarkButton";
import { playMetronome, stopAllScheduledAudio } from "@/lib/audio/rhythmPlayer";
import { t } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { AnswerInput, GeneratedExercise } from "@/types/exercises";

interface PulseTapExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "pulse-tap" }>;
  answer: Extract<AnswerInput, { type: "pulse-tap" }> | null;
  onAnswerChange: (answer: AnswerInput) => void;
  checked: boolean;
  locale: Locale;
}

/** "Stukaj w rytm pulsu" — a metronome plays (see playMetronome), a
 * circular indicator pulses in time with it (bigger on each measure's
 * downbeat), and the player taps a big button along with the beat. Ported
 * in spirit from the web app's PulseTapExercise.tsx (same tap-timestamps-
 * relative-to-playback-start model, isValidPulseTap scores the result),
 * swapped from a live-scheduled Web Audio pulse to setTimeout-scheduled
 * pre-rendered clicks (see rhythmPlayer.ts's own doc) and from CSS scale
 * transitions to RN's Animated API. */
export function PulseTapExercise({ exercise, answer, onAnswerChange, checked, locale }: PulseTapExerciseProps) {
  const [started, setStarted] = useState(false);
  const [beatIndex, setBeatIndex] = useState(-1);
  const startTimeRef = useRef<number | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const pulseScale = useRef(new Animated.Value(1)).current;

  useEffect(
    () => () => {
      timeoutsRef.current.forEach(clearTimeout);
      stopAllScheduledAudio();
    },
    []
  );

  const taps = answer?.tapTimestampsMs ?? [];

  // Shared by both the initial start and the post-check "replay" — plays
  // the metronome and pulses the indicator in sync, WITHOUT touching taps
  // or startTimeRef, so replaying the correct pulse for reference after
  // getting it wrong never disturbs the already-recorded (and scored)
  // answer.
  function scheduleMetronomeAndPulse() {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    stopAllScheduledAudio();
    playMetronome({ bpm: exercise.bpm, beatsPerMeasure: exercise.beatsPerMeasure, measureCount: exercise.measureCount });
    exercise.beatTimesMs.forEach((timeMs, index) => {
      timeoutsRef.current.push(
        setTimeout(() => {
          setBeatIndex(index);
          const isAccent = index % exercise.beatsPerMeasure === 0;
          Animated.sequence([
            Animated.timing(pulseScale, { toValue: isAccent ? 1.35 : 1.15, duration: 35, useNativeDriver: true }),
            Animated.timing(pulseScale, { toValue: 1, duration: 140, useNativeDriver: true }),
          ]).start();
        }, timeMs)
      );
    });
  }

  function handleStart() {
    if (started || checked) return;
    setStarted(true);
    onAnswerChange({ type: "pulse-tap", tapTimestampsMs: [] });
    startTimeRef.current = Date.now();
    scheduleMetronomeAndPulse();
  }

  function handleTap() {
    if (!started || checked || startTimeRef.current === null) return;
    onAnswerChange({ type: "pulse-tap", tapTimestampsMs: [...taps, Date.now() - startTimeRef.current] });
  }

  return (
    <View style={{ alignItems: "center", gap: theme.spacing(2.5), width: "100%" }}>
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
        {t("lesson.pulseTapPrompt", locale)}
      </Text>

      <Animated.View
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: theme.colors.primary,
          transform: [{ scale: pulseScale }],
        }}
      />

      {checked ? (
        // "The solution" for a pulse-matching task IS the pulse itself —
        // letting the player feel/hear the correct beat again (as many
        // times as they like) after checking is the equivalent of
        // showing a correct answer for a discrete-choice exercise.
        <DarkButton label={t("lesson.playAgain", locale)} onPress={scheduleMetronomeAndPulse} variant="secondary" />
      ) : started ? (
        <Text style={{ color: theme.colors.muted, fontSize: theme.fontSize.body * 0.85 }}>
          {t("lesson.pulseTapProgress", locale, { current: Math.max(beatIndex + 1, 0), total: exercise.beatTimesMs.length, taps: taps.length })}
        </Text>
      ) : (
        <DarkButton label={t("lesson.playAgain", locale)} onPress={handleStart} variant="secondary" />
      )}

      <Pressable
        onPress={handleTap}
        disabled={!started || checked}
        style={({ pressed }) => ({
          width: "100%",
          maxWidth: 320,
          minHeight: 90,
          borderRadius: theme.radius.lg,
          borderWidth: 2,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surfaceMuted,
          alignItems: "center",
          justifyContent: "center",
          opacity: !started || checked ? 0.5 : pressed ? 0.8 : 1,
        })}
      >
        <Text style={{ color: theme.colors.ink, fontSize: theme.fontSize.body, fontWeight: "700" }}>{t("lesson.tapHere", locale)}</Text>
      </Pressable>
    </View>
  );
}
