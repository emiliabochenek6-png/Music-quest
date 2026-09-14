import { useRef } from "react";
import { Pressable, Text, View } from "react-native";
import { DarkButton } from "@/components/exercises/DarkButton";
import { playRhythm, stopAllScheduledAudio } from "@/lib/audio/rhythmPlayer";
import { t } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { AnswerInput, GeneratedExercise } from "@/types/exercises";

interface RhythmEchoExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "rhythm-echo" }>;
  answer: Extract<AnswerInput, { type: "rhythm-echo" }> | null;
  onAnswerChange: (answer: AnswerInput) => void;
  checked: boolean;
  locale: Locale;
}

/** "Posłuchaj rytmu, a potem powtórz go, stukając" — a short clap pattern
 * plays (see playRhythm), the player taps it back. Taps are recorded
 * relative to the player's OWN first tap (not to when playback started),
 * so isValidRhythmEcho's gap-based scoring works regardless of how long
 * the player waits before starting — ported from the web app's
 * RhythmEchoExercise.tsx. */
export function RhythmEchoExercise({ exercise, answer, onAnswerChange, checked, locale }: RhythmEchoExerciseProps) {
  const firstTapTimeRef = useRef<number | null>(null);
  const taps = answer?.tapTimestampsMs ?? [];

  function play() {
    stopAllScheduledAudio();
    playRhythm(exercise.onsetsMs);
  }

  function handleTap() {
    if (checked) return;
    const now = Date.now();
    if (firstTapTimeRef.current === null) {
      firstTapTimeRef.current = now;
      onAnswerChange({ type: "rhythm-echo", tapTimestampsMs: [0] });
    } else {
      onAnswerChange({ type: "rhythm-echo", tapTimestampsMs: [...taps, now - firstTapTimeRef.current] });
    }
  }

  function handleReset() {
    firstTapTimeRef.current = null;
    onAnswerChange({ type: "rhythm-echo", tapTimestampsMs: [] });
  }

  return (
    <View style={{ alignItems: "center", gap: theme.spacing(2.5), width: "100%" }}>
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
        {t("lesson.rhythmEchoPrompt", locale)}
      </Text>
      <DarkButton label="🔊" onPress={play} variant="secondary" size={84} fontSize={42} />
      <Pressable
        onPress={handleTap}
        disabled={checked}
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
          opacity: checked ? 0.5 : pressed ? 0.8 : 1,
        })}
      >
        <Text style={{ color: theme.colors.ink, fontSize: theme.fontSize.body, fontWeight: "700" }}>{t("lesson.tapHere", locale)}</Text>
      </Pressable>
      {!checked && taps.length > 0 && (
        <Pressable onPress={handleReset}>
          <Text style={{ color: theme.colors.muted, fontSize: theme.fontSize.body * 0.85, textDecorationLine: "underline" }}>
            {t("lesson.resetOrder", locale)}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
