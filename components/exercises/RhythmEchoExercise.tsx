import { useRef } from "react";
import { Pressable, Text, View } from "react-native";
import { DarkButton } from "@/components/exercises/DarkButton";
import { schedulerNow } from "@/lib/audio/player";
import { playMetronome, playRhythm, stopAllScheduledAudio } from "@/lib/audio/rhythmPlayer";
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

// rhythm-echo's own onsetsMs (data/lessons/miasto-rytmu.ts) are authored
// as raw milliseconds, not derived from any bpm — there's no "correct"
// tempo to recover from them, only a felt pulse worth giving the ear as
// a reference. 90 matches the bpm its own sibling rhythm-sequencing
// exercises in the same Miasto Rytmu lessons already use.
const METRONOME_BPM = 90;
const COUNT_IN_BEATS = 2;
const TRAILING_METRONOME_BEATS = 2;

/** "Posłuchaj rytmu, a potem powtórz go, stukając" — a short clap pattern
 * plays (see playRhythm) with a steady metronome click track underneath
 * (see METRONOME_BPM's own doc for why that's a fixed reference tempo
 * rather than one derived from the pattern itself) — the SAME "own
 * recording, own metronome" shape every other rhythm exercise's 🔊
 * button already has, this one just didn't get it originally. The
 * player taps the pattern back. Taps are recorded relative to the
 * player's OWN first tap (not to when playback started), so
 * isValidRhythmEcho's gap-based scoring works regardless of how long the
 * player waits before starting — ported from the web app's
 * RhythmEchoExercise.tsx. */
export function RhythmEchoExercise({ exercise, answer, onAnswerChange, checked, locale }: RhythmEchoExerciseProps) {
  const firstTapTimeRef = useRef<number | null>(null);
  const taps = answer?.tapTimestampsMs ?? [];

  function play() {
    stopAllScheduledAudio();
    const beatIntervalMs = (60 / METRONOME_BPM) * 1000;
    const lastOnsetMs = exercise.onsetsMs[exercise.onsetsMs.length - 1] ?? 0;
    const patternBeats = Math.ceil(lastOnsetMs / beatIntervalMs) + TRAILING_METRONOME_BEATS;
    const startAtMs = schedulerNow();
    playMetronome({ bpm: METRONOME_BPM, beatsPerMeasure: 1, measureCount: COUNT_IN_BEATS + patternBeats, startAtMs });
    const countInOffsetMs = COUNT_IN_BEATS * beatIntervalMs;
    playRhythm(exercise.onsetsMs.map((ms) => ms + countInOffsetMs), 0.8, startAtMs);
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
