import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { BeamedRhythmRow } from "@/components/exercises/BeamedRhythmRow";
import { DarkButton } from "@/components/exercises/DarkButton";
import { NoteValueIcon } from "@/components/exercises/NoteValueIcon";
import { RestValueIcon } from "@/components/exercises/RestValueIcon";
import { schedulerNow } from "@/lib/audio/player";
import { playMetronomeWithClaps, stopAllScheduledAudio } from "@/lib/audio/rhythmPlayer";
import { meterFeltPulseQuarterBeats } from "@/lib/rhythm/meter";
import { beatsOf, measureIndexAt, REST_VALUES } from "@/lib/rhythm/valueBeats";
import { t, type TranslationKey } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { GeneratedExercise, RhythmNoteValue, RhythmRestValue } from "@/types/exercises";

type SequenceValue = RhythmNoteValue | RhythmRestValue;

interface RhythmValueDictationExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "rhythm-value-dictation" }>;
  sequence: SequenceValue[];
  groups: number[][];
  onAddValue: (value: SequenceValue) => void;
  onUndo: () => void;
  onToggleBoundary: (boundaryIndex: number) => void;
  checked: boolean;
  locale: Locale;
}

const NOTE_VALUE_LABEL_KEY: Record<RhythmNoteValue, TranslationKey> = {
  whole: "lesson.noteValueWhole",
  half: "lesson.noteValueHalf",
  quarter: "lesson.noteValueQuarter",
  dottedQuarter: "lesson.noteValueDottedQuarter",
  dottedHalf: "lesson.noteValueDottedHalf",
  eighth: "lesson.noteValueEighth",
  dottedEighth: "lesson.noteValueDottedEighth",
  sixteenth: "lesson.noteValueSixteenth",
  eighthTriplet: "lesson.noteValueEighthTriplet",
};
const REST_VALUE_LABEL_KEY: Record<RhythmRestValue, TranslationKey> = {
  quarterRest: "lesson.restValueQuarter",
  eighthRest: "lesson.restValueEighth",
  sixteenthRest: "lesson.restValueSixteenth",
};

function valueLabelKey(value: SequenceValue): TranslationKey {
  return REST_VALUES.has(value) ? REST_VALUE_LABEL_KEY[value as RhythmRestValue] : NOTE_VALUE_LABEL_KEY[value as RhythmNoteValue];
}

/** Shortest to longest by actual beat length, notes before rests — so the
 * picker row reads as a predictable ladder regardless of the order a
 * level's content happens to list `allowedValues` in. */
function byDurationThenRestsLast(a: SequenceValue, b: SequenceValue): number {
  const aIsRest = REST_VALUES.has(a);
  const bIsRest = REST_VALUES.has(b);
  if (aIsRest !== bIsRest) {
    return aIsRest ? 1 : -1;
  }
  return beatsOf(a) - beatsOf(b);
}

const COUNT_IN_BEATS = 2;
const TRAILING_METRONOME_BEATS = 2;

/**
 * "Szczyt Dyktand" levels 1-5 — the true ear-training counterpart of
 * RhythmDictationExercise's tap-back. The player never sees the notation —
 * only hears it (speaker button, metronome underneath) — then builds
 * their own answer one value at a time by clicking through
 * `exercise.allowedValues` (shown shortest-to-longest, rests last),
 * watching it render live via BeamedRhythmRow.
 *
 * Grouping ("Grupuj") is a separate, explicit toggle: turns on click-to-
 * group mode over the player's own written notes — click one beamable
 * note, then an adjacent one in the same measure, to merge them into a
 * beam (or split them apart if already merged).
 *
 * Once checked, a properly beam-grouped, read-only recap of
 * `exercise.sequence` always appears — not only when wrong, since scoring
 * is onset-pattern-based (a "half" and "quarter,quarterRest" sound
 * identical, so both pass), the recap's canonical notation is worth
 * seeing every time. Ported from the web app's own
 * RhythmValueDictationExercise.tsx.
 */
export function RhythmValueDictationExercise({ exercise, sequence, groups, onAddValue, onUndo, onToggleBoundary, checked, locale }: RhythmValueDictationExerciseProps) {
  const [groupModeOn, setGroupModeOn] = useState(false);
  const [pendingGroupIndex, setPendingGroupIndex] = useState<number | null>(null);

  function playTarget() {
    // Without this, pressing 🔊 again before the previous playback
    // finished left its click/clap track still scheduled — the new
    // press's own tracks then overlapped the stale one instead of
    // replacing it, which is exactly what read as "sometimes plays
    // evenly, sometimes stutters/jams" (the stutter was two overlapping
    // clap tracks, not a timing bug in either one on its own). Same guard
    // every other playback trigger in this app (RhythmDictationExercise,
    // MeterChoiceExercise, ...) already has.
    stopAllScheduledAudio();
    const beatIntervalSeconds = (60 / exercise.bpm) * meterFeltPulseQuarterBeats(exercise.meter);
    const lastOnsetSeconds = (exercise.onsetsMs[exercise.onsetsMs.length - 1] ?? 0) / 1000;
    const patternBeats = Math.ceil(lastOnsetSeconds / beatIntervalSeconds) + TRAILING_METRONOME_BEATS;
    const startAtMs = schedulerNow();
    const countInOffsetMs = COUNT_IN_BEATS * beatIntervalSeconds * 1000;
    playMetronomeWithClaps(
      { bpm: 60 / beatIntervalSeconds, beatsPerMeasure: 1, measureCount: COUNT_IN_BEATS + patternBeats, startAtMs },
      exercise.onsetsMs.map((ms) => ms + countInOffsetMs)
    );
  }

  function handleNoteClick(globalIndex: number) {
    if (pendingGroupIndex === null) {
      setPendingGroupIndex(globalIndex);
      return;
    }
    if (pendingGroupIndex === globalIndex) {
      setPendingGroupIndex(null);
      return;
    }
    const low = Math.min(pendingGroupIndex, globalIndex);
    const high = Math.max(pendingGroupIndex, globalIndex);
    const adjacent = high - low === 1;
    const sameMeasure = measureIndexAt(sequence, exercise.beatsPerMeasure, low) === measureIndexAt(sequence, exercise.beatsPerMeasure, high);
    if (adjacent && sameMeasure) {
      onToggleBoundary(low);
      setPendingGroupIndex(null);
    } else {
      setPendingGroupIndex(globalIndex);
    }
  }

  return (
    <View style={{ alignItems: "center", gap: theme.spacing(2.5), width: "100%" }}>
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
        {t("lesson.rhythmValueDictationPrompt", locale)}
      </Text>

      <DarkButton label="🔊" onPress={playTarget} variant="secondary" size={84} fontSize={42} />

      <BeamedRhythmRow
        meter={exercise.meter}
        beatsPerMeasure={exercise.beatsPerMeasure}
        sequence={sequence}
        groups={groups}
        onNoteClick={groupModeOn && !checked ? handleNoteClick : undefined}
        pendingIndex={pendingGroupIndex}
        noteAriaLabel={(index) => t("lesson.rhythmValueDictationSelectNoteForGrouping", locale, { n: index + 1 })}
      />

      {groupModeOn && !checked && (
        <Text style={{ color: theme.colors.muted, fontSize: theme.fontSize.body * 0.75, textAlign: "center", maxWidth: 280 }}>
          {t("lesson.rhythmValueDictationGroupHint", locale)}
        </Text>
      )}

      {checked && (
        <View style={{ alignItems: "center", gap: theme.spacing(1) }}>
          <Text style={{ color: theme.colors.muted, fontSize: theme.fontSize.body * 0.75 }}>{t("lesson.rhythmValueDictationSolution", locale)}</Text>
          <BeamedRhythmRow meter={exercise.meter} beatsPerMeasure={exercise.beatsPerMeasure} sequence={exercise.sequence} />
        </View>
      )}

      {!checked && (
        <View style={{ alignItems: "center", gap: theme.spacing(2), borderRadius: theme.radius.lg, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface, padding: theme.spacing(2) }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: theme.spacing(1) }}>
            {[...exercise.allowedValues].sort(byDurationThenRestsLast).map((value) => (
              <Pressable
                key={value}
                onPress={() => onAddValue(value)}
                accessibilityRole="button"
                accessibilityLabel={t(valueLabelKey(value), locale)}
                style={({ pressed }) => ({
                  width: 48,
                  height: 48,
                  borderRadius: theme.radius.md,
                  borderWidth: 2,
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.surfaceMuted,
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                {REST_VALUES.has(value) ? <RestValueIcon value={value as RhythmRestValue} /> : <NoteValueIcon value={value as RhythmNoteValue} />}
              </Pressable>
            ))}
          </View>

          <View style={{ flexDirection: "row", gap: theme.spacing(2) }}>
            {sequence.length >= 2 && (
              <DarkButton
                label={t("lesson.rhythmValueDictationGroupToggle", locale)}
                onPress={() => {
                  setGroupModeOn((on) => !on);
                  setPendingGroupIndex(null);
                }}
                variant={groupModeOn ? "primary" : "secondary"}
              />
            )}
            {sequence.length > 0 && (
              <Pressable onPress={onUndo}>
                <Text style={{ color: theme.colors.muted, fontSize: theme.fontSize.body * 0.85, textDecorationLine: "underline" }}>
                  {t("lesson.rhythmValueDictationUndo", locale)}
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      )}
    </View>
  );
}
