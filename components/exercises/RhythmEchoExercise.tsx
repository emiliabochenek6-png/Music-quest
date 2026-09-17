import { useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { DarkButton } from "@/components/exercises/DarkButton";
import { MetronomeIndicator } from "@/components/exercises/MetronomeIndicator";
import { playSample, schedulerNow, type SamplePlaybackHandle } from "@/lib/audio/player";
import { STANDALONE_METRONOME_MEASURES, playMetronome, playMetronomeWithClaps, stopAllScheduledAudio } from "@/lib/audio/rhythmPlayer";
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
 * button already has, this one just didn't get it originally. The dot
 * is ALSO its own tappable toggle for a standalone metronome, independent
 * of the 🔊 button — same MetronomeIndicator pattern RhythmDictationExercise
 * already has (see that component's own doc). The player taps the
 * pattern back. Taps are recorded relative to the player's OWN first tap
 * (not to when playback started), so isValidRhythmEcho's gap-based
 * scoring works regardless of how long the player waits before starting
 * — ported from the web app's RhythmEchoExercise.tsx.
 *
 * When exercise.referenceAudioSource is set (Miasto Rytmu lekcja 2 — see
 * data/lessons/miasto-rytmu.ts and lib/audio/samples.ts's own
 * RHYTHM_ECHO_RECORDING_SAMPLES), the 🔊 button plays that real recording
 * instead, as a genuine play/stop toggle (several seconds long, unlike
 * the near-instant synthesized pattern) — same MeterChoiceExercise
 * pattern. onsetsMs stays the grading ground truth either way; the
 * recording only changes what's audible, not what a correct echo is
 * judged against. Tapping the pattern back and the standalone metronome
 * dot both keep working exactly as before, untouched by which source the
 * 🔊 button plays.
 *
 * exercise.showStandaloneMetronome (default true) hides that dot and its
 * toggle entirely when false — Miasto Rytmu lekcje 2 and 3 set this false
 * across the board (see data/lessons/miasto-rytmu.ts), the hint text
 * dropping to just "🔊 odtwarza rytm z metronomem w tle." (no dot to
 * explain) via lesson.metronomeBackgroundHint instead of
 * lesson.metronomeDotHint. */
export function RhythmEchoExercise({ exercise, answer, onAnswerChange, checked, locale }: RhythmEchoExerciseProps) {
  const showStandaloneMetronome = exercise.showStandaloneMetronome ?? true;
  const firstTapTimeRef = useRef<number | null>(null);
  const taps = answer?.tapTimestampsMs ?? [];
  // Same shape as RhythmDictationExercise's own metronomePlay/standaloneOn
  // — see that component's own doc.
  const [metronomePlay, setMetronomePlay] = useState({ token: 0, totalBeats: 0, startAtMs: 0 });
  const [standaloneOn, setStandaloneOn] = useState(false);
  // Same real-recording play/stop toggle as MeterChoiceExercise's own
  // referenceAudioSource handling — see this component's own doc for why
  // it doesn't touch metronomePlay (that's the synthesized path's own
  // visual-sync state, meaningless for a recording whose beat timing
  // isn't known here).
  const [isPlayingReference, setIsPlayingReference] = useState(false);
  const referenceHandleRef = useRef<SamplePlaybackHandle | null>(null);

  useEffect(() => {
    return () => {
      referenceHandleRef.current?.stop();
    };
  }, []);

  // Same "outside stop leaves our own flag stuck" fix MeterChoiceExercise
  // already needs — checking the answer silences the native player from
  // the lesson screen's own handleCheck, not through our handle.
  useEffect(() => {
    if (checked) {
      referenceHandleRef.current = null;
      setIsPlayingReference(false);
    }
  }, [checked]);

  function play() {
    if (exercise.referenceAudioSource !== undefined) {
      if (isPlayingReference) {
        referenceHandleRef.current?.stop();
        referenceHandleRef.current = null;
        setIsPlayingReference(false);
        return;
      }
      stopAllScheduledAudio();
      setStandaloneOn(false);
      setIsPlayingReference(true);
      referenceHandleRef.current = playSample(exercise.referenceAudioSource, 0.9, () => {
        setIsPlayingReference(false);
        referenceHandleRef.current = null;
      });
      return;
    }
    stopAllScheduledAudio();
    setStandaloneOn(false);
    const beatIntervalMs = (60 / METRONOME_BPM) * 1000;
    const lastOnsetMs = exercise.onsetsMs[exercise.onsetsMs.length - 1] ?? 0;
    const patternBeats = Math.ceil(lastOnsetMs / beatIntervalMs) + TRAILING_METRONOME_BEATS;
    const measureCount = COUNT_IN_BEATS + patternBeats;
    const startAtMs = schedulerNow();
    const countInOffsetMs = COUNT_IN_BEATS * beatIntervalMs;
    playMetronomeWithClaps(
      { bpm: METRONOME_BPM, beatsPerMeasure: 1, measureCount, startAtMs },
      exercise.onsetsMs.map((ms) => ms + countInOffsetMs)
    );
    setMetronomePlay((prev) => ({ token: prev.token + 1, totalBeats: measureCount, startAtMs }));
  }

  function toggleStandaloneMetronome() {
    stopAllScheduledAudio();
    referenceHandleRef.current = null;
    setIsPlayingReference(false);
    if (standaloneOn) {
      setStandaloneOn(false);
      return;
    }
    setStandaloneOn(true);
    const startAtMs = schedulerNow();
    playMetronome({ bpm: METRONOME_BPM, beatsPerMeasure: 1, measureCount: STANDALONE_METRONOME_MEASURES, startAtMs });
    setMetronomePlay((prev) => ({ token: prev.token + 1, totalBeats: STANDALONE_METRONOME_MEASURES, startAtMs }));
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
      <Text style={{ fontSize: theme.fontSize.body * 0.8, color: theme.colors.muted, textAlign: "center" }}>
        {t(showStandaloneMetronome ? "lesson.metronomeDotHint" : "lesson.metronomeBackgroundHint", locale)}
      </Text>
      <DarkButton
        label={isPlayingReference ? "⏹" : "🔊"}
        onPress={play}
        variant={isPlayingReference ? "primary" : "secondary"}
        size={84}
        fontSize={42}
      />
      {showStandaloneMetronome && (
        <MetronomeIndicator
          playToken={metronomePlay.token}
          bpm={METRONOME_BPM}
          beatsPerMeasure={1}
          totalBeats={metronomePlay.totalBeats}
          startAtMs={metronomePlay.startAtMs}
          onPress={toggleStandaloneMetronome}
          active={standaloneOn}
        />
      )}
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
