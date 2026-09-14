import { meterFeltPulseQuarterBeats } from "@/lib/rhythm/meter";
import { NOTE_VALUE_BEATS, REST_VALUE_BEATS, REST_VALUES } from "@/lib/rhythm/valueBeats";
import type { Meter, RhythmNoteValue, RhythmRestValue } from "@/types/exercises";

/** Only these values ever share a beam with a neighbor — quarter/
 * dottedQuarter/half/dottedHalf/whole always stand alone (real notation
 * never beams a quarter-or-longer value), matching BeamedNotation/
 * computeBeamLayout's own FLAGGABLE_VALUES. */
const BEAMABLE_VALUES: ReadonlySet<RhythmNoteValue> = new Set(["eighth", "dottedEighth", "sixteenth", "eighthTriplet"]);

/**
 * Derives computeBeamLayout's `groups` parameter automatically from a
 * sequence + its meter, instead of the hand-authored `groups` Gaj
 * Grupowania's beam-grouping-choice needed — Szczyt Dyktand's rhythm-
 * value-dictation correct-answer recap (BeamedRhythmRow) needs "real"
 * grouping for whatever sequence the author wrote, not a hand-picked
 * distractor set.
 *
 * A "pulse group" is one felt beat of the meter — meterFeltPulseQuarterBeats
 * (lib/rhythm/meter.ts) already computes exactly this width in quarter-beat
 * units for every supported meter (1 for simple meters, 1.5 for compound
 * 6/8-family meters, 0.5 for 3/8's simple-triple beat). Only consecutive
 * BEAMABLE_VALUES notes that start within the same pulse group ever share a
 * group; a rest or any quarter-or-longer value always breaks the group and
 * stands alone, even if it happens to land in the same pulse.
 */
export function deriveBeamGroups(sequence: readonly (RhythmNoteValue | RhythmRestValue)[], meter: Meter): number[][] {
  const groupWidthBeats = meterFeltPulseQuarterBeats(meter);
  const groups: number[][] = [];
  let cumulativeBeats = 0;
  let currentGroup: number[] = [];
  let currentPulseIndex = -1;

  for (let index = 0; index < sequence.length; index++) {
    const value = sequence[index];
    const isRest = REST_VALUES.has(value);
    const isBeamable = !isRest && BEAMABLE_VALUES.has(value as RhythmNoteValue);
    const pulseIndex = Math.floor(cumulativeBeats / groupWidthBeats + 1e-9);

    if (isBeamable && currentGroup.length > 0 && pulseIndex === currentPulseIndex) {
      currentGroup.push(index);
    } else {
      if (currentGroup.length > 0) {
        groups.push(currentGroup);
      }
      currentGroup = [index];
      currentPulseIndex = isBeamable ? pulseIndex : -1;
    }

    cumulativeBeats += isRest ? REST_VALUE_BEATS[value as RhythmRestValue] : NOTE_VALUE_BEATS[value as RhythmNoteValue];
  }
  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }
  return groups;
}

/**
 * Toggles the boundary between `sequence[boundaryIndex]` and
 * `sequence[boundaryIndex + 1]` — the core operation behind "Grupuj"'s
 * click-click gesture. If the two currently sit in the same group, splits
 * that group in two at this boundary; if they sit in different (always
 * adjacent, per `groups`' own ascending/contiguous invariant) groups,
 * merges those two groups into one.
 */
export function toggleGroupBoundary(groups: readonly (readonly number[])[], boundaryIndex: number): number[][] {
  const leftGroupIndex = groups.findIndex((group) => group.includes(boundaryIndex));
  const rightGroupIndex = groups.findIndex((group) => group.includes(boundaryIndex + 1));

  if (leftGroupIndex === rightGroupIndex) {
    const group = groups[leftGroupIndex];
    const splitAt = group.indexOf(boundaryIndex) + 1;
    const left = group.slice(0, splitAt);
    const right = group.slice(splitAt);
    return [...groups.slice(0, leftGroupIndex).map((g) => [...g]), left, right, ...groups.slice(leftGroupIndex + 1).map((g) => [...g])];
  }

  const lowIndex = Math.min(leftGroupIndex, rightGroupIndex);
  const highIndex = Math.max(leftGroupIndex, rightGroupIndex);
  const merged = [...groups[lowIndex], ...groups[highIndex]];
  return [...groups.slice(0, lowIndex).map((g) => [...g]), merged, ...groups.slice(highIndex + 1).map((g) => [...g])];
}

/**
 * Removes the highest index (always the sequence's last note, since
 * `groups` partitions indices in ascending order) from whichever group
 * contains it — the group is dropped entirely if it was a singleton. Keeps
 * `groups` in sync with the sequence after "Cofnij" removes the last
 * written value/note.
 */
export function dropLastIndexFromGroups(groups: readonly (readonly number[])[]): number[][] {
  if (groups.length === 0) {
    return [];
  }
  const lastGroup = groups[groups.length - 1];
  const shrunk = lastGroup.slice(0, -1);
  return shrunk.length > 0
    ? [...groups.slice(0, -1).map((g) => [...g]), shrunk]
    : groups.slice(0, -1).map((g) => [...g]);
}
