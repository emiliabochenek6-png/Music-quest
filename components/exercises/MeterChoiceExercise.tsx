import { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import { DarkButton } from "@/components/exercises/DarkButton";
import { OptionButton } from "@/components/exercises/OptionButton";
import { playSample, type SamplePlaybackHandle } from "@/lib/audio/player";
import { playDanceFragment, stopAllScheduledAudio } from "@/lib/audio/rhythmPlayer";
import { meterFeltPulseCount, meterFeltPulseQuarterBeats, meterPulseSubdivision } from "@/lib/rhythm/meter";
import { t } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { AnswerInput, GeneratedExercise } from "@/types/exercises";

interface MeterChoiceExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "meter-choice" }>;
  answer: Extract<AnswerInput, { type: "meter-choice" }> | null;
  onAnswerChange: (answer: AnswerInput) => void;
  checked: boolean;
  locale: Locale;
}

/** "Posłuchaj i wybierz metrum" — a short accompaniment plays (see
 * playDanceFragment's own doc for why it's built from existing piano
 * samples rather than a live oscillator chord), the player picks the
 * meter that matches the felt strong/weak beat pattern. Ported from the
 * web app's MeterChoiceExercise.tsx.
 *
 * `beatsPerMeasure` here means FELT PULSES per measure, not quarter-note
 * beats — meterFeltPulseCount handles the distinction (a 6/8 measure
 * feels like 2 dotted-quarter pulses, not 3 plain ones, or it'd be
 * indistinguishable by ear from 3/4). playDanceFragment itself always
 * spaces consecutive pulses a fixed 60/bpm seconds apart — correct only
 * when a felt pulse IS a quarter note (every simple /4 meter). For 2/2
 * (pulse = half note) and the compound eighth meters (pulse = dotted
 * quarter), exercise.bpm — the same quarter-note bpm every other exercise
 * type uses — has to be rescaled to an EFFECTIVE bpm so pulse-to-pulse
 * spacing comes out right, and meterPulseSubdivision fills each such
 * pulse with quiet lilt ticks so it's audibly distinct from a plain one
 * (see playDanceFragment's own doc for why both matter).
 *
 * When exercise.referenceAudioSource is set, the speaker button plays that
 * real recorded drum loop instead of the synthesized accompaniment above —
 * a handful of exercises use this so the player also practices telling a
 * meter apart in an actual recording, not just a procedural click pattern.
 * That real recording is a genuine play/stop toggle (press again while
 * it's playing to stop it, same as LessonTheoryIntro's own referenceAudio
 * buttons) — several seconds long, unlike every other exercise type's
 * near-instant sample, so leaving it fire-and-forget would mean no way to
 * cut it off early. */
export function MeterChoiceExercise({ exercise, answer, onAnswerChange, checked, locale }: MeterChoiceExerciseProps) {
  const [isPlayingReference, setIsPlayingReference] = useState(false);
  const referenceHandleRef = useRef<SamplePlaybackHandle | null>(null);

  useEffect(() => {
    return () => {
      referenceHandleRef.current?.stop();
    };
  }, []);

  // Checking the answer stops all scheduled/active audio from OUTSIDE
  // this component (the lesson screen's own handleCheck) — that silences
  // the native player without going through our handle's stop()/onFinish,
  // so without this the ⏹ button would stay stuck showing "playing" even
  // though nothing is actually sounding anymore.
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
      setIsPlayingReference(true);
      referenceHandleRef.current = playSample(exercise.referenceAudioSource, 0.85, () => {
        setIsPlayingReference(false);
        referenceHandleRef.current = null;
      });
      return;
    }
    // Same self-overlap guard every other rhythm-audio exercise type
    // already applies to its own play() — without it, pressing 🔊 again
    // mid-fragment would layer a second copy on top instead of replacing it.
    stopAllScheduledAudio();
    const beatsPerMeasure = meterFeltPulseCount(exercise.correctMeter);
    const effectiveBpm = exercise.bpm / meterFeltPulseQuarterBeats(exercise.correctMeter);
    const pulseSubdivision = meterPulseSubdivision(exercise.correctMeter);
    playDanceFragment({ bpm: effectiveBpm, beatsPerMeasure, measureCount: 4, pulseSubdivision });
  }

  return (
    <View style={{ alignItems: "center", gap: theme.spacing(3) }}>
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
        {t("lesson.meterChoicePrompt", locale)}
      </Text>
      <DarkButton
        label={isPlayingReference ? "⏹" : "🔊"}
        onPress={play}
        variant={isPlayingReference ? "primary" : "secondary"}
        size={84}
        fontSize={42}
      />
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: theme.spacing(2) }}>
        {exercise.optionPool.map((meter) => (
          <OptionButton
            key={meter}
            label={meter}
            selected={answer?.selectedMeter === meter}
            correct={checked && meter === exercise.correctMeter}
            incorrect={checked && answer?.selectedMeter === meter && meter !== exercise.correctMeter}
            disabled={checked}
            onPress={() => onAnswerChange({ type: "meter-choice", selectedMeter: meter })}
          />
        ))}
      </View>
    </View>
  );
}
