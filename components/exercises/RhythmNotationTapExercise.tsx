import { useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { BeamedRhythmRow } from "@/components/exercises/BeamedRhythmRow";
import { DarkButton } from "@/components/exercises/DarkButton";
import { MetronomeIndicator } from "@/components/exercises/MetronomeIndicator";
import { playSample, schedulerNow, type SamplePlaybackHandle } from "@/lib/audio/player";
import { STANDALONE_METRONOME_MEASURES, playMetronome, playMetronomeWithClaps, stopAllScheduledAudio } from "@/lib/audio/rhythmPlayer";
import { meterFeltPulseCount, meterFeltPulseQuarterBeats, meterPulseSubdivision } from "@/lib/rhythm/meter";
import { t } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { AnswerInput, GeneratedExercise } from "@/types/exercises";

interface RhythmNotationTapExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "rhythm-notation-tap" }>;
  answer: Extract<AnswerInput, { type: "rhythm-notation-tap" }> | null;
  onAnswerChange: (answer: AnswerInput) => void;
  checked: boolean;
  locale: Locale;
}

/** Same mechanic as RhythmDictationExercise (this file used to be a
 * separate two-phase "preview, then press Zaczynamy to perform against a
 * continuous metronome" flow — removed in favor of this, since the extra
 * phase/button added a step without adding anything the player actually
 * needed): notation shown up front, 🔊 plays a metronome count-in +
 * pattern, the dot is its own standalone-metronome toggle, and a
 * free-timed tap-back button scores against exercise.requiredTapTimesMs
 * (the only real difference from RhythmDictationExercise, which scores
 * against exercise.onsetsMs — same gap-based isValidRhythmEcho mechanic
 * either way).
 *
 * When exercise.referenceAudioSource is set (Miasto Rytmu lekcja 5 — see
 * data/lessons/miasto-rytmu.ts and lib/audio/samples.ts's own
 * RHYTHM_NOTATION_TAP_L5_RECORDING_SAMPLES), the 🔊 button plays that real
 * recording instead, as a genuine play/stop toggle — same
 * RhythmDictationExercise pattern, purely illustrative:
 * requiredTapTimesMs (what tapping is scored against) is always derived
 * from the authored sequence/bpm, never touched by which source 🔊
 * plays. */
export function RhythmNotationTapExercise({ exercise, answer, onAnswerChange, checked, locale }: RhythmNotationTapExerciseProps) {
  const firstTapTimeRef = useRef<number | null>(null);
  const taps = answer?.tapTimestampsMs ?? [];
  // Drives MetronomeIndicator — token bumps on every play so its pulse
  // sequence restarts, totalBeats tells it how many beats to schedule,
  // startAtMs is the SAME anchor passed to playMetronome so the dot
  // stays in sync with the click track rather than drifting against it.
  const [metronomePlay, setMetronomePlay] = useState({ token: 0, totalBeats: 0, startAtMs: 0 });
  // Whether the dot's OWN standalone metronome (as opposed to the 🔊
  // button's rhythm-with-metronome playback) is the one currently running.
  const [standaloneOn, setStandaloneOn] = useState(false);
  // Same real-recording play/stop toggle as RhythmDictationExercise's own
  // — see that component's own doc for why it doesn't touch metronomePlay.
  const [isPlayingReference, setIsPlayingReference] = useState(false);
  const referenceHandleRef = useRef<SamplePlaybackHandle | null>(null);

  useEffect(() => {
    return () => {
      referenceHandleRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    if (checked) {
      referenceHandleRef.current = null;
      setIsPlayingReference(false);
    }
  }, [checked]);

  // See RhythmDictationExercise's own doc for why the metronome's rate
  // has to follow the meter's FELT pulse rather than a bare quarter note.
  const feltPulseQuarterBeats = meterFeltPulseQuarterBeats(exercise.meter);
  const feltBpm = exercise.bpm / feltPulseQuarterBeats;
  const feltBeatsPerMeasure = meterFeltPulseCount(exercise.meter);
  const feltBeatIntervalMs = (60 / feltBpm) * 1000;
  // See RhythmDictationExercise's own doc for why a compound-meter click
  // track needs subdivision ticks, not just the sparse felt-pulse clicks.
  const pulseSubdivision = meterPulseSubdivision(exercise.meter);

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
    const countInMs = feltBeatsPerMeasure * feltBeatIntervalMs;
    const lastMs = exercise.requiredTapTimesMs[exercise.requiredTapTimesMs.length - 1] ?? 0;
    const totalBeats = feltBeatsPerMeasure + Math.ceil(lastMs / feltBeatIntervalMs) + feltBeatsPerMeasure;
    const measureCount = Math.ceil(totalBeats / feltBeatsPerMeasure);
    // One shared anchor for both tracks — see MetronomeOptions'
    // startAtMs doc for why the click track and the clap pattern
    // playing under it need to share an exact time origin.
    const startAtMs = schedulerNow();
    playMetronomeWithClaps(
      { bpm: feltBpm, beatsPerMeasure: feltBeatsPerMeasure, measureCount, pulseSubdivision, startAtMs },
      exercise.requiredTapTimesMs.map((ms) => ms + countInMs)
    );
    setMetronomePlay((prev) => ({ token: prev.token + 1, totalBeats: measureCount * feltBeatsPerMeasure, startAtMs }));
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
    playMetronome({ bpm: feltBpm, beatsPerMeasure: feltBeatsPerMeasure, measureCount: STANDALONE_METRONOME_MEASURES, pulseSubdivision, startAtMs });
    setMetronomePlay((prev) => ({ token: prev.token + 1, totalBeats: STANDALONE_METRONOME_MEASURES * feltBeatsPerMeasure, startAtMs }));
  }

  function handleTap() {
    if (checked) return;
    const now = Date.now();
    if (firstTapTimeRef.current === null) {
      firstTapTimeRef.current = now;
      onAnswerChange({ type: "rhythm-notation-tap", tapTimestampsMs: [0] });
    } else {
      onAnswerChange({ type: "rhythm-notation-tap", tapTimestampsMs: [...taps, now - firstTapTimeRef.current] });
    }
  }

  function handleReset() {
    firstTapTimeRef.current = null;
    onAnswerChange({ type: "rhythm-notation-tap", tapTimestampsMs: [] });
  }

  return (
    <View style={{ alignItems: "center", gap: theme.spacing(2.5), width: "100%" }}>
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
        {t("lesson.rhythmDictationPrompt", locale)}
      </Text>
      <Text style={{ fontSize: theme.fontSize.body * 0.8, color: theme.colors.muted, textAlign: "center" }}>
        {t("lesson.metronomeDotHint", locale)}
      </Text>
      <View style={{ paddingVertical: theme.spacing(1) }}>
        <BeamedRhythmRow meter={exercise.meter} beatsPerMeasure={exercise.beatsPerMeasure} sequence={exercise.sequence} />
      </View>
      <DarkButton
        label={isPlayingReference ? "⏹" : "🔊"}
        onPress={play}
        variant={isPlayingReference ? "primary" : "secondary"}
        size={84}
        fontSize={42}
      />
      <MetronomeIndicator
        playToken={metronomePlay.token}
        bpm={feltBpm}
        beatsPerMeasure={feltBeatsPerMeasure}
        totalBeats={metronomePlay.totalBeats}
        startAtMs={metronomePlay.startAtMs}
        onPress={toggleStandaloneMetronome}
        active={standaloneOn}
      />
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
