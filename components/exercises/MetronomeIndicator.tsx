import { useEffect, useRef } from "react";
import { Animated, Pressable } from "react-native";
import { scheduleAt, schedulerNow } from "@/lib/audio/player";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

interface MetronomeIndicatorProps {
  /** Bump this (e.g. a counter incremented on each "play") to trigger a
   * fresh pulse sequence — 0 means "never started", so nothing pulses
   * until the first real playback. */
  playToken: number;
  bpm: number;
  beatsPerMeasure: number;
  totalBeats: number;
  /** The SAME anchor passed to the matching playMetronome() call (see
   * MetronomeOptions' own startAtMs doc) — without this, the dot and the
   * click track each pick their own "now" a beat apart from the other,
   * which reads as the dot drifting out of sync with what's actually
   * playing even though each is individually on-tempo. Defaults to
   * schedulerNow() only for a caller with no real audio to match (there
   * is none today — every current use passes this explicitly). */
  startAtMs?: number;
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
 * playMetronome call uses, through the SAME shared lookahead scheduler
 * (scheduleAt — see lib/audio/player.ts's own doc on why a raw
 * setTimeout per event, which this used to do, is a real source of
 * uneven timing) and the SAME startAtMs anchor, rather than a separately
 * timed parallel animation loop — that combination is what actually
 * keeps this in sync with the audio, not just running the same formula
 * independently. Cancelling old beats on a re-trigger falls out of the
 * exercises' own stopAllScheduledAudio()/clearScheduledAudio() calls
 * (already made before scheduling a new play or standalone toggle,
 * since those need to cancel the CLICK TRACK too) — no separate cleanup
 * needed here. */
export function MetronomeIndicator({ playToken, bpm, beatsPerMeasure, totalBeats, startAtMs = schedulerNow(), size = 56, onPress, active = false }: MetronomeIndicatorProps) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (playToken === 0) return;

    const beatIntervalMs = (60 / bpm) * 1000;
    for (let i = 0; i < totalBeats; i++) {
      const isAccent = i % beatsPerMeasure === 0;
      scheduleAt(
        i * beatIntervalMs,
        () => {
          // A sharp, fast hit followed by a quick return — reads as a
          // percussive "tick" reacting to the beat, rather than a slow
          // breathing pulse (which felt more like ambient animation than
          // an actual metronome).
          Animated.sequence([
            Animated.timing(scale, { toValue: isAccent ? 1.35 : 1.15, duration: 35, useNativeDriver: true }),
            Animated.timing(scale, { toValue: 1, duration: 140, useNativeDriver: true }),
          ]).start();
        },
        startAtMs
      );
    }
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
