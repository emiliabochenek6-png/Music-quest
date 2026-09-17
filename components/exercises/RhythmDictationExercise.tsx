import { useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { DarkButton } from "@/components/exercises/DarkButton";
import { MeteredNotationRow } from "@/components/exercises/MeteredNotationRow";
import { MetronomeIndicator } from "@/components/exercises/MetronomeIndicator";
import { schedulerNow } from "@/lib/audio/player";
import { STANDALONE_METRONOME_MEASURES, playMetronome, playMetronomeWithClaps, stopAllScheduledAudio } from "@/lib/audio/rhythmPlayer";
import { meterFeltPulseCount, meterFeltPulseQuarterBeats, meterPulseSubdivision } from "@/lib/rhythm/meter";
import { t } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { AnswerInput, GeneratedExercise } from "@/types/exercises";

interface RhythmDictationExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "rhythm-dictation" }>;
  answer: Extract<AnswerInput, { type: "rhythm-dictation" }> | null;
  onAnswerChange: (answer: AnswerInput) => void;
  checked: boolean;
  locale: Locale;
}

/** "Posłuchaj rytmu, a potem zastukaj go tak samo" — the notation is shown
 * up front (MeteredNotationRow), a speaker button plays a one-measure
 * metronome count-in followed by the clap pattern with the metronome
 * still ticking underneath (so the player can feel the beat while hearing
 * the rhythm) — a MetronomeIndicator pulses in sync so the beat is
 * something to WATCH too, not just hear. The dot is ALSO its own tappable
 * toggle: tap it to start a standalone metronome independent of the 🔊
 * button (e.g. to internalize the pulse before attempting the rhythm),
 * tap again to stop it — see lesson.metronomeDotHint for the in-app copy
 * explaining this. Then a free-timed tap-back button. Ported in spirit from
 * the web app's RhythmDictationExercise.tsx — the exact count-in/trailing-
 * buffer beat counts are this port's own reasonable choice rather than a
 * byte-verbatim copy of the web timing formula (its source wasn't
 * available to copy from), but the mechanic (gap-based tap scoring
 * against exercise.onsetsMs, metronome not itself scored) matches. */
export function RhythmDictationExercise({ exercise, answer, onAnswerChange, checked, locale }: RhythmDictationExerciseProps) {
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

  // The click's own rate follows the meter's FELT pulse, not a bare
  // quarter note — for a simple /4 meter those are the same thing, but a
  // plain quarter-note click during 6/8 ticks 3 evenly-spaced times a
  // measure, which sounds exactly like 3/4's pulse (not 6/8's "two
  // dotted-quarter groups" feel) and fights the very rhythm it's supposed
  // to help internalize. feltBpm/feltBeatsPerMeasure scale exercise.bpm/
  // exercise.beatsPerMeasure (always quarter-note-based, same as
  // everywhere else in this app) down to the felt pulse's own rate/count
  // — unchanged for simple /4 meters, slower (and fewer, larger pulses)
  // for 2/2 and the compound eighth meters. Both the audio (playMetronome)
  // and the visual pulse (MetronomeIndicator) need this same scaling, or
  // the dot would flash at the wrong rate even if the audio were fixed.
  const feltPulseQuarterBeats = meterFeltPulseQuarterBeats(exercise.meter);
  const feltBpm = exercise.bpm / feltPulseQuarterBeats;
  const feltBeatsPerMeasure = meterFeltPulseCount(exercise.meter);
  const feltBeatIntervalMs = (60 / feltBpm) * 1000;
  // How many audible ticks each felt pulse splits into — see
  // playMetronome's own pulseSubdivision doc for why a compound meter's
  // (6/8/9/8/12/8) or 2/2's click track needs this: without it, a dense
  // clap pattern (12/8 in particular can pack up to 12 notes into a
  // single measure) has far more onsets than the metronome has clicks,
  // which makes the two tracks sound unsynced even though every note is
  // scheduled at its exact correct time either way.
  const pulseSubdivision = meterPulseSubdivision(exercise.meter);

  function play() {
    stopAllScheduledAudio();
    setStandaloneOn(false);
    const countInMs = feltBeatsPerMeasure * feltBeatIntervalMs;
    const lastOnsetMs = exercise.onsetsMs[exercise.onsetsMs.length - 1] ?? 0;
    const totalBeats = feltBeatsPerMeasure + Math.ceil(lastOnsetMs / feltBeatIntervalMs) + feltBeatsPerMeasure;
    const measureCount = Math.ceil(totalBeats / feltBeatsPerMeasure);
    // One shared anchor for both tracks — see MetronomeOptions'
    // startAtMs doc for why the click track and the clap pattern
    // playing under it need to share an exact time origin.
    const startAtMs = schedulerNow();
    playMetronomeWithClaps(
      { bpm: feltBpm, beatsPerMeasure: feltBeatsPerMeasure, measureCount, pulseSubdivision, startAtMs },
      exercise.onsetsMs.map((ms) => ms + countInMs)
    );
    setMetronomePlay((prev) => ({ token: prev.token + 1, totalBeats: measureCount * feltBeatsPerMeasure, startAtMs }));
  }

  function toggleStandaloneMetronome() {
    stopAllScheduledAudio();
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
      onAnswerChange({ type: "rhythm-dictation", tapTimestampsMs: [0] });
    } else {
      onAnswerChange({ type: "rhythm-dictation", tapTimestampsMs: [...taps, now - firstTapTimeRef.current] });
    }
  }

  function handleReset() {
    firstTapTimeRef.current = null;
    onAnswerChange({ type: "rhythm-dictation", tapTimestampsMs: [] });
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
        <MeteredNotationRow bpm={exercise.bpm} meter={exercise.meter} beatsPerMeasure={exercise.beatsPerMeasure} sequence={exercise.sequence} slotTimesMs={exercise.slotTimesMs} />
      </View>
      <DarkButton label="🔊" onPress={play} variant="secondary" size={84} fontSize={42} />
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
