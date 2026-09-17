import { useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { DarkButton } from "@/components/exercises/DarkButton";
import { MelodicDictationStaff } from "@/components/exercises/MelodicDictationStaff";
import { NoteValueIcon } from "@/components/exercises/NoteValueIcon";
import { schedulerNow } from "@/lib/audio/player";
import { playMelodicRhythm, playMetronome, stopAllScheduledAudio } from "@/lib/audio/rhythmPlayer";
import { parseScientific, type Accidental } from "@/lib/music/notes";
import { meterFeltPulseQuarterBeats, meterQuarterNoteBeats } from "@/lib/rhythm/meter";
import { measureIndexAt } from "@/lib/rhythm/valueBeats";
import { t, type TranslationKey } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { GeneratedExercise, RhythmNoteValue } from "@/types/exercises";

interface DictationNote {
  step: number;
  accidental: Accidental;
  value: RhythmNoteValue;
}

interface MelodicRhythmicDictationExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "melodic-rhythmic-dictation" }>;
  notes: DictationNote[];
  groups: number[][];
  onAddNote: (note: DictationNote) => void;
  onUndo: () => void;
  onToggleBoundary: (boundaryIndex: number) => void;
  checked: boolean;
  isCorrect: boolean | null;
  locale: Locale;
}

/** Szczyt Dyktand never authors or accepts a double accidental. */
const ACCIDENTAL_OPTIONS: { value: -1 | 0 | 1; symbol: string; labelKey: "lesson.accidentalFlat" | "lesson.accidentalNatural" | "lesson.accidentalSharp" }[] = [
  { value: -1, symbol: "♭", labelKey: "lesson.accidentalFlat" },
  { value: 0, symbol: "♮", labelKey: "lesson.accidentalNatural" },
  { value: 1, symbol: "♯", labelKey: "lesson.accidentalSharp" },
];

/** Same count-in/trailing-buffer shape as RhythmValueDictationExercise's
 * own playTarget — this exercise's phrase used to play with no metronome
 * reference at all, which made it hard to feel the underlying pulse
 * (durations only make sense relative to a beat, not in isolation). The
 * click continues under the whole phrase (measureCount below spans both
 * the count-in AND the pattern itself), not just before it, same as its
 * sibling exercise. */
const COUNT_IN_BEATS = 2;
const TRAILING_METRONOME_BEATS = 2;

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

/**
 * "Szczyt Dyktand" levels 6-9 — the free-transcription counterpart of
 * RhythmDictationExercise: a full melodic-rhythmic phrase plays
 * (playMelodicRhythm), and the player builds it from scratch on a growing
 * staff (MelodicDictationStaff) instead of tapping a rhythm back or
 * picking from options. Composing one note at a time: the pitch is
 * written directly on the growing staff itself (MelodicDictationStaff's
 * own inline picker), a 3-button row picks the accidental, a row of
 * NoteValueIcon buttons (scoped to exercise.allowedValues) picks the
 * rhythm value — "Dodaj nutę" commits all three into `notes` and resets
 * the pending selection.
 *
 * The phrase's first note is seeded into the answer automatically on
 * mount — without absolute pitch, there's no way to know where an
 * unaccompanied phrase's first note sits on the staff, so real melodic
 * dictation always gives it as a fixed reference point.
 *
 * "Grupuj" is the same manual beam-grouping feature
 * RhythmValueDictationExercise already has — a separate click-to-select
 * mode over the ALREADY-WRITTEN notes, merging or splitting a beam
 * between two adjacent beamable notes in the same measure.
 *
 * "Kreska taktowa" (bar line) is a THIRD, purely local (ungraded) marker
 * — never reaches the answer/validate.ts, since there's no single correct
 * bar-line placement to check a phrase composed by ear against. Ported
 * from the web app's own MelodicRhythmicDictationExercise.tsx.
 */
export function MelodicRhythmicDictationExercise({
  exercise,
  notes,
  groups,
  onAddNote,
  onUndo,
  onToggleBoundary,
  checked,
  isCorrect,
  locale,
}: MelodicRhythmicDictationExerciseProps) {
  const [pendingStep, setPendingStep] = useState<number | null>(null);
  const [pendingAccidental, setPendingAccidental] = useState<-1 | 0 | 1>(0);
  const [pendingValue, setPendingValue] = useState<RhythmNoteValue | null>(null);
  const [groupModeOn, setGroupModeOn] = useState(false);
  const [pendingGroupIndex, setPendingGroupIndex] = useState<number | null>(null);
  const [manualBarLines, setManualBarLines] = useState<number[]>([]);

  const hasSeededReferenceNote = useRef(false);
  useEffect(() => {
    if (!hasSeededReferenceNote.current && notes.length === 0) {
      hasSeededReferenceNote.current = true;
      const [firstNote] = exercise.notes;
      onAddNote({ step: firstNote.step, accidental: firstNote.accidental, value: firstNote.value });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function playTarget() {
    // Same guard as RhythmValueDictationExercise's own playTarget — without
    // it, a repeated 🔊 press before the previous phrase finished left its
    // notes still scheduled, overlapping the new press's own notes.
    stopAllScheduledAudio();

    // A metronome count-in (and a click continuing underneath the whole
    // phrase) gives the pulse this exercise's durations are actually
    // relative to — without it, a listener hears notes of different
    // lengths with nothing steady to measure them against.
    const beatIntervalSeconds = (60 / exercise.bpm) * meterFeltPulseQuarterBeats(exercise.meter);
    const lastIndex = exercise.notes.length - 1;
    const phraseEndSeconds = (exercise.onsetsMs[lastIndex] + exercise.durationsMs[lastIndex]) / 1000;
    const patternBeats = Math.ceil(phraseEndSeconds / beatIntervalSeconds) + TRAILING_METRONOME_BEATS;
    const startAtMs = schedulerNow();
    playMetronome({ bpm: 60 / beatIntervalSeconds, beatsPerMeasure: 1, measureCount: COUNT_IN_BEATS + patternBeats, startAtMs });

    const countInOffsetMs = COUNT_IN_BEATS * beatIntervalSeconds * 1000;
    playMelodicRhythm(
      exercise.notes.map((note, index) => ({
        note: parseScientific(note.pitch),
        onsetMs: exercise.onsetsMs[index] + countInOffsetMs,
        durationMs: exercise.durationsMs[index],
      })),
      undefined,
      startAtMs
    );
  }

  const beatsPerMeasure = meterQuarterNoteBeats(exercise.meter);

  function handleAddNote() {
    if (pendingStep === null || pendingValue === null) {
      return;
    }
    onAddNote({ step: pendingStep, accidental: pendingAccidental, value: pendingValue });
    setPendingStep(null);
    setPendingAccidental(0);
    setPendingValue(null);
  }

  function handleUndo() {
    onUndo();
    setManualBarLines((prev) => prev.filter((index) => index < notes.length - 1));
  }

  function handleToggleBarLine() {
    const position = notes.length - 1;
    setManualBarLines((prev) => (prev.includes(position) ? prev.filter((index) => index !== position) : [...prev, position]));
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
    const values = notes.map((note) => note.value);
    const sameMeasure = measureIndexAt(values, beatsPerMeasure, low) === measureIndexAt(values, beatsPerMeasure, high);
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
        {t("lesson.melodicRhythmicDictationPrompt", locale)}
      </Text>

      <DarkButton label="🔊" onPress={playTarget} variant="secondary" size={84} fontSize={42} />

      <MelodicDictationStaff
        notes={notes}
        ariaLabel={t("lesson.melodicRhythmicDictationYourAnswer", locale)}
        keySignature={exercise.key}
        meter={exercise.meter}
        pendingStep={checked ? null : pendingStep}
        onSelectStep={checked ? undefined : setPendingStep}
        groups={groups}
        onNoteClick={groupModeOn && !checked ? handleNoteClick : undefined}
        pendingGroupIndex={pendingGroupIndex}
        manualBarLines={manualBarLines}
        disabled={checked}
        locale={locale}
      />

      {groupModeOn && !checked && (
        <Text style={{ color: theme.colors.muted, fontSize: theme.fontSize.body * 0.75, textAlign: "center", maxWidth: 280 }}>
          {t("lesson.melodicRhythmicDictationGroupHint", locale)}
        </Text>
      )}

      {checked && !isCorrect && (
        <View style={{ alignItems: "center", gap: theme.spacing(1) }}>
          <Text style={{ color: theme.colors.muted, fontSize: theme.fontSize.body * 0.75 }}>{t("lesson.melodicRhythmicDictationSolution", locale)}</Text>
          <MelodicDictationStaff
            notes={exercise.notes.map((note) => ({ step: note.step, accidental: note.accidental, value: note.value }))}
            ariaLabel={t("lesson.melodicRhythmicDictationCorrectAnswer", locale)}
            keySignature={exercise.key}
            meter={exercise.meter}
          />
        </View>
      )}

      {!checked && (
        <View style={{ alignItems: "center", gap: theme.spacing(2), borderRadius: theme.radius.lg, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface, padding: theme.spacing(2) }}>
          <View style={{ flexDirection: "row", gap: theme.spacing(1.5) }}>
            {ACCIDENTAL_OPTIONS.map((option) => (
              <DarkButton
                key={option.value}
                label={option.symbol}
                onPress={() => setPendingAccidental(option.value)}
                variant={pendingAccidental === option.value ? "primary" : "secondary"}
                size={42}
                fontSize={18}
              />
            ))}
          </View>

          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: theme.spacing(1) }}>
            {exercise.allowedValues.map((value) => (
              <Pressable
                key={value}
                onPress={() => setPendingValue(value)}
                accessibilityRole="button"
                accessibilityLabel={t(NOTE_VALUE_LABEL_KEY[value], locale)}
                accessibilityState={{ selected: pendingValue === value }}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: theme.radius.md,
                  borderWidth: 2,
                  borderColor: pendingValue === value ? theme.colors.primary : theme.colors.border,
                  backgroundColor: pendingValue === value ? theme.colors.surfaceMuted : theme.colors.surface,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <NoteValueIcon value={value} />
              </Pressable>
            ))}
          </View>

          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: theme.spacing(1.5) }}>
            <DarkButton label={t("lesson.melodicRhythmicDictationAddNote", locale)} onPress={handleAddNote} disabled={pendingStep === null || pendingValue === null} />
            {notes.length >= 2 && (
              <DarkButton
                label={t("lesson.melodicRhythmicDictationGroupToggle", locale)}
                onPress={() => {
                  setGroupModeOn((on) => !on);
                  setPendingGroupIndex(null);
                }}
                variant={groupModeOn ? "primary" : "secondary"}
              />
            )}
            {notes.length >= 1 && (
              <DarkButton
                label={t("lesson.melodicRhythmicDictationBarLineToggle", locale)}
                onPress={handleToggleBarLine}
                variant={manualBarLines.includes(notes.length - 1) ? "primary" : "secondary"}
              />
            )}
            {notes.length > 1 && (
              <Pressable onPress={handleUndo}>
                <Text style={{ color: theme.colors.muted, fontSize: theme.fontSize.body * 0.85, textDecorationLine: "underline" }}>
                  {t("lesson.melodicRhythmicDictationUndo", locale)}
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      )}
    </View>
  );
}
