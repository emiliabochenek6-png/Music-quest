import { useEffect, useRef, useState } from "react";
import { View, Text } from "react-native";
import { DarkButton as Button } from "@/components/exercises/DarkButton";
import { OptionButton } from "@/components/exercises/OptionButton";
import { playSample, type SamplePlaybackHandle } from "@/lib/audio/player";
import { MELODY_DIRECTION_SAMPLES } from "@/lib/audio/samples";
import { t } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { GeneratedExercise, MelodyDirection } from "@/types/exercises";

interface MelodyDirectionExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "melody-direction-choice" }>;
  selectedDirection: MelodyDirection | null;
  onSelect: (direction: MelodyDirection) => void;
  checked: boolean;
  locale: Locale;
}

const DIRECTIONS: { value: MelodyDirection; labelKey: "lesson.melodyDirectionUp" | "lesson.melodyDirectionDown" | "lesson.melodyDirectionSame"; arrow: string }[] = [
  { value: "up", labelKey: "lesson.melodyDirectionUp", arrow: "↑" },
  { value: "same", labelKey: "lesson.melodyDirectionSame", arrow: "→" },
  { value: "down", labelKey: "lesson.melodyDirectionDown", arrow: "↓" },
];

/** "Dokąd leci melodia?" — plays a real piano recording of the exercise's
 * own correctDirection (see MELODY_DIRECTION_SAMPLES' own doc for why
 * this is keyed by direction, not by exercise.notes' specific pitches —
 * this used to synthesize the melody note-by-note from exercise.notes
 * via playMelody instead). A genuine play/stop toggle rather than
 * fire-and-forget, same reasoning as MeterChoiceExercise's own
 * referenceAudioSource handling: these recordings run several seconds,
 * unlike this app's usual near-instant samples, so there needs to be a
 * way to cut one off early. Ported from the web app's
 * MelodyDirectionExercise.tsx. */
export function MelodyDirectionExercise({ exercise, selectedDirection, onSelect, checked, locale }: MelodyDirectionExerciseProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const handleRef = useRef<SamplePlaybackHandle | null>(null);
  // Picked once per mount (not per press, via lazy useState init so
  // Math.random() only runs once) so repeated 🔊 taps within the same
  // exercise stay consistent — the variety is between exercises/attempts,
  // not between presses of the same one.
  const [sample] = useState(() => {
    const pool = MELODY_DIRECTION_SAMPLES[exercise.correctDirection];
    return pool[Math.floor(Math.random() * pool.length)];
  });

  useEffect(() => {
    return () => {
      handleRef.current?.stop();
    };
  }, []);

  // Same reasoning as MeterChoiceExercise's own doc — checking the
  // answer stops all scheduled/active audio from OUTSIDE this component
  // (the lesson screen's own handleCheck), which silences the native
  // player without going through this handle's stop()/onFinish, so
  // without this the ⏹ button would stay stuck showing "playing".
  useEffect(() => {
    if (checked) {
      handleRef.current = null;
      setIsPlaying(false);
    }
  }, [checked]);

  function play() {
    if (isPlaying) {
      handleRef.current?.stop();
      handleRef.current = null;
      setIsPlaying(false);
      return;
    }
    setIsPlaying(true);
    handleRef.current = playSample(sample, 0.9, () => {
      setIsPlaying(false);
      handleRef.current = null;
    });
  }

  return (
    <View style={{ alignItems: "center", gap: theme.spacing(3) }}>
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
        {t("lesson.melodyDirectionPrompt", locale)}
      </Text>
      <Button label={isPlaying ? "⏹" : "🔊"} onPress={play} variant={isPlaying ? "primary" : "secondary"} size={84} fontSize={42} />
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: theme.spacing(2) }}>
        {DIRECTIONS.map(({ value, labelKey, arrow }) => (
          <OptionButton
            key={value}
            label={`${arrow} ${t(labelKey, locale)}`}
            selected={selectedDirection === value}
            correct={checked && value === exercise.correctDirection}
            incorrect={checked && selectedDirection === value && value !== exercise.correctDirection}
            disabled={checked}
            onPress={() => onSelect(value)}
          />
        ))}
      </View>
    </View>
  );
}
