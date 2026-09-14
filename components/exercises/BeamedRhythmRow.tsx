import { View } from "react-native";
import { BeamedNotation } from "@/components/exercises/BeamedNotation";
import { TimeSignature } from "@/components/exercises/MeteredNotationRow";
import { deriveBeamGroups } from "@/lib/rhythm/beamGrouping";
import { beatsOf } from "@/lib/rhythm/valueBeats";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Meter, RhythmNoteValue, RhythmRestValue } from "@/types/exercises";

/** Buckets `sequence` into measures purely from beat units — no bpm/
 * slotTimesMs needed at all, independent of tempo. */
function measureIndexesOf(sequence: readonly (RhythmNoteValue | RhythmRestValue)[], beatsPerMeasure: number): number[][] {
  const measures: number[][] = [];
  let cumulativeBeats = 0;
  for (let index = 0; index < sequence.length; index++) {
    const measureIndex = Math.floor(cumulativeBeats / beatsPerMeasure + 1e-9);
    const measure = measures[measureIndex] ?? (measures[measureIndex] = []);
    measure.push(index);
    cumulativeBeats += beatsOf(sequence[index]);
  }
  return measures;
}

interface BeamedRhythmRowProps {
  meter: Meter;
  beatsPerMeasure: number;
  sequence: readonly (RhythmNoteValue | RhythmRestValue)[];
  /** When provided, used as-is (GLOBAL indices into `sequence`) instead of
   * auto-deriving via deriveBeamGroups — the player's own manual "Grupuj"
   * selections. Omit for the auto-derived canonical recap. */
  groups?: readonly (readonly number[])[];
  /** Enables "Grupuj" mode: clickable overlay on every beamable note,
   * translating each measure's local click back to a GLOBAL sequence
   * index before calling through. */
  onNoteClick?: (globalIndex: number) => void;
  pendingIndex?: number | null;
  noteAriaLabel?: (globalIndex: number) => string;
}

/**
 * The properly-beam-grouped counterpart of MeteredNotationRow — used for
 * "Szczyt Dyktand"'s rhythm-value-dictation, both the player's own live-
 * growing answer and the correct-answer recap. Showing real notation
 * (ósemki grouped in twos, not each standing alone with its own flag) has
 * genuine pedagogical value, especially since an audibly-equivalent but
 * differently-spelled answer (e.g. "quarter,quarterRest" for a "half")
 * also scores correct — the recap is often the only place a player ever
 * sees the canonical, textbook-grouped spelling.
 *
 * Splits `sequence` into measures the same way MeteredNotationRow does,
 * but in beat units rather than ms — no bpm/slotTimesMs needed, since
 * grouping is purely a function of note/rest VALUES, never of tempo. Each
 * measure renders as its own BeamedNotation instance, in a row with a
 * bar-line divider between. Ported from the web app's BeamedRhythmRow.tsx
 * — the interactive "Grupuj" click overlay isn't ported here since it
 * doesn't fit this component's read-only role in the mobile port (see
 * RhythmValueDictationExercise's own click handling instead, wired
 * directly against `sequence`/`groups` state rather than through this
 * row).
 */
export function BeamedRhythmRow({ meter, beatsPerMeasure, sequence, groups: groupsProp, onNoteClick, pendingIndex = null, noteAriaLabel }: BeamedRhythmRowProps) {
  const measures = measureIndexesOf(sequence, beatsPerMeasure);

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "center", gap: theme.spacing(1.5) }}>
      {measures.length === 0 ? (
        <TimeSignature meter={meter} />
      ) : (
        measures.map((indexes, measureNumber) => {
          const measureSequence = indexes.map((index) => sequence[index]);
          const measureStart = indexes[0];
          const measureEnd = indexes[indexes.length - 1];
          const groups = groupsProp
            ? groupsProp
                .filter((group) => group[0] >= measureStart && group[group.length - 1] <= measureEnd)
                .map((group) => group.map((globalIndex) => globalIndex - measureStart))
            : deriveBeamGroups(measureSequence, meter);
          const localPendingIndex = pendingIndex !== null && indexes.includes(pendingIndex) ? pendingIndex - measureStart : null;
          return (
            <View key={measureNumber} style={{ flexDirection: "row", alignItems: "flex-end", gap: theme.spacing(1) }}>
              {measureNumber > 0 && <View style={{ width: 1.5, height: 44, backgroundColor: theme.colors.ink, opacity: 0.5 }} />}
              <BeamedNotation
                sequence={measureSequence}
                groups={groups}
                meter={measureNumber === 0 ? meter : undefined}
                onNoteClick={onNoteClick ? (localIndex) => onNoteClick(indexes[localIndex]) : undefined}
                pendingIndex={localPendingIndex}
                noteAriaLabel={noteAriaLabel ? (localIndex) => noteAriaLabel(indexes[localIndex]) : undefined}
              />
            </View>
          );
        })
      )}
    </View>
  );
}
