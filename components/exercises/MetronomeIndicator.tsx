import { useEffect, useRef } from "react";
import { Animated, Pressable } from "react-native";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

interface MetronomeIndicatorProps {
  /** Bump this (e.g. a counter incremented on each "play") to trigger a
   * fresh pulse sequence — 0 means "never started", so nothing pulses
   * until the first real playback. */
  playToken: number;
  bpm: number;
  beatsPerMeasure: number;
  totalBeats: number;
  size?: number;
  /** When provided, the dot itself becomes tappable — the hosting
   * exercise owns what a tap actually does (see RhythmDictationExercise/
   * RhythmNotationTapExercise's own "standalone metronome" toggle). */
  onPress?: () => void;
  /** Whether the tap-triggered standalone metronome (as opposed to the 🔊
   * button's own rhythm-with-metronome playback) is the one currently
   * running — draws a lit ring around the dot so it's visually obvious
   * which of the two metronome sources is active. */
  active?: boolean;
}

/** A small circle that visually pulses in time with a metronome —
 * PulseTapExercise already draws its own version of this inline (it's
 * also the tap target's own visual feedback there); this is the same
 * idea pulled out for RhythmDictationExercise/RhythmNotationTapExercise,
 * which play a metronome click track (see lib/audio/rhythmPlayer.ts) but
 * previously gave the player nothing to WATCH, only hear — this
 * schedules the identical bpm/beatsPerMeasure math those exercises' own
 * playMetronome call uses, as a parallel Animated sequence rather than
 * anything wired to the audio itself, so it stays in sync without the
 * audio and visual code needing to share state. */
export function MetronomeIndicator({ playToken, bpm, beatsPerMeasure, totalBeats, size = 56, onPress, active = false }: MetronomeIndicatorProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    if (playToken === 0) return;

    const beatIntervalMs = (60 / bpm) * 1000;
    for (let i = 0; i < totalBeats; i++) {
      const isAccent = i % beatsPerMeasure === 0;
      timeoutsRef.current.push(
        setTimeout(() => {
          // A sharp, fast hit followed by a quick return — reads as a
          // percussive "tick" reacting to the beat, rather than a slow
          // breathing pulse (which felt more like ambient animation than
          // an actual metronome).
          Animated.sequence([
            Animated.timing(scale, { toValue: isAccent ? 1.35 : 1.15, duration: 35, useNativeDriver: true }),
            Animated.timing(scale, { toValue: 1, duration: 140, useNativeDriver: true }),
          ]).start();
        }, i * beatIntervalMs)
      );
    }
    return () => timeoutsRef.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playToken]);

  const dot = (
    <Animated.View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: theme.colors.primary,
        transform: [{ scale }],
      }}
    />
  );

  if (!onPress) {
    return dot;
  }

  const ringPadding = 6;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Osobny metronom"
      accessibilityState={{ selected: active }}
      hitSlop={12}
      style={{
        width: size + ringPadding * 2,
        height: size + ringPadding * 2,
        borderRadius: (size + ringPadding * 2) / 2,
        borderWidth: active ? 2 : 0,
        borderColor: theme.colors.primary,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {dot}
    </Pressable>
  );
}
