import type { RhythmNoteValue, RhythmRestValue } from "@/types/exercises";

/** Horizontal distance between two consecutive noteheads. */
export const NOTE_SPACING = 42;
/** Left padding before the first notehead — room for a time signature. */
export const LEFT_MARGIN = 22;
/** Right padding after the last notehead's own glyph width. */
export const RIGHT_MARGIN = 18;
/** Extra room reserved past a note's x for its stem/flag/dot glyphs. */
export const GLYPH_WIDTH_ALLOWANCE = 30;
/** Every notehead sits on this fixed y — this notation is pitch-less (pure
 * rhythm), so there's nothing to vary vertically like real staff notation. */
export const NOTEHEAD_Y = 70;
export const STEM_HEIGHT = 34;
export const BEAM_THICKNESS = 5;
/** Vertical offset of the secondary (16th-note) beam below the primary one. */
export const SECONDARY_BEAM_GAP = 8;
/** Length of a partial ("hook") beam — the short, one-sided secondary-beam
 * stub drawn for a sixteenth that has no sixteenth neighbor on either side
 * within its group (e.g. "dotted eighth + sixteenth"), so the full-segment
 * secondary-beam logic never fires for it but real notation still shows a
 * short hook pointing toward whichever neighbor it has. */
export const PARTIAL_BEAM_LENGTH = 18;
export const VIEW_HEIGHT = 100;
/** Extra horizontal gap inserted between two separate beam groups, so a
 * beat boundary reads clearly even without a bar line. */
export const GROUP_GAP_EXTRA = 10;
/** Extra horizontal gap inserted immediately before a bar line. */
export const BAR_LINE_EXTRA_GAP = 14;

const FLAGGABLE_VALUES: ReadonlySet<RhythmNoteValue> = new Set(["eighth", "dottedEighth", "sixteenth", "eighthTriplet"]);
const STEMLESS_VALUES: ReadonlySet<RhythmNoteValue> = new Set(["whole"]);
const DOTTED_VALUES: ReadonlySet<RhythmNoteValue> = new Set(["dottedQuarter", "dottedHalf", "dottedEighth"]);
/** Real notation draws a half note with a hollow/open notehead, not the
 * filled one every shorter value uses — without this distinction, a half
 * note sitting next to a quarter note (same stem, same size) is genuinely
 * unreadable as a different duration. "whole" already has its own value
 * below (and no stem at all). */
const HALF_NOTEHEAD_VALUES: ReadonlySet<RhythmNoteValue> = new Set(["half", "dottedHalf"]);
const REST_VALUES: ReadonlySet<RhythmRestValue> = new Set(["quarterRest", "eighthRest", "sixteenthRest"]);

function isRestValue(value: RhythmNoteValue | RhythmRestValue): value is RhythmRestValue {
  return REST_VALUES.has(value as RhythmRestValue);
}

/** Every index (from `sequence`) where a triplet "3" indicator belongs — the
 * middle note of each run of 3 consecutive eighthTriplet values. Computed
 * from the raw sequence, NOT from `groups` — a triplet's identity is a
 * property of the note values themselves, independent of how (correctly or
 * not) a given beam-grouping-choice option groups them; a wrong distractor
 * still shows "3" over the same three notes, just visibly mis-beamed, which
 * is exactly what should make it read as wrong. */
function tripletLabelIndexes(sequence: readonly (RhythmNoteValue | RhythmRestValue)[]): number[] {
  const indexes: number[] = [];
  let i = 0;
  while (i < sequence.length) {
    if (sequence[i] === "eighthTriplet") {
      indexes.push(i + 1);
      i += 3;
    } else {
      i += 1;
    }
  }
  return indexes;
}

export interface BeamLayoutNote {
  index: number;
  x: number;
  /** False only for "whole" — every other value (even an unbeamed one)
   * still draws its own stem, matching real notation. */
  hasStem: boolean;
  /** Set only when this note is NOT part of a multi-note beam group — a
   * beamed eighth/sixteenth never also carries its own flag. */
  hasFlag: "eighth" | "sixteenth" | null;
  hasDot: boolean;
  /** Which notehead shape to draw — "whole" and "half" are hollow in real
   * notation, everything shorter is filled. Only meaningful when
   * restValue is unset. */
  notehead: "whole" | "half" | "black";
  /** Set when this sequence entry is a rest, not a note. */
  restValue?: RhythmRestValue;
}

export interface BeamSegment {
  fromX: number;
  toX: number;
  y: number;
}

export interface TieArcLayout {
  fromX: number;
  toX: number;
}

export interface BarLineLayout {
  x: number;
}

export interface BeamLayout {
  notes: BeamLayoutNote[];
  primaryBeams: BeamSegment[];
  secondaryBeams: BeamSegment[];
  /** Short one-sided secondary-beam stubs ("hooks") for a sixteenth that's
   * beamed but has no sixteenth neighbor on either side (e.g. dotted-eighth
   * + sixteenth). */
  partialBeams: BeamSegment[];
  /** x-position for each triplet "3" indicator (see tripletLabelIndexes). */
  tripletLabels: number[];
  ties: TieArcLayout[];
  barLine?: BarLineLayout;
  viewWidth: number;
}

/**
 * Pure geometry for BeamedNotation — every x-position, beam segment, tie arc
 * and bar line needed to render a beamed rhythm as SVG, with no React/DOM
 * involved (mirrors the lib/music/staffGeometry.ts / StaffNotation.tsx
 * split, so this is unit-testable in isolation).
 *
 * There's no pitch dimension here (this is rhythm-only notation, every
 * notehead sits at the fixed NOTEHEAD_Y) — beams are always flat horizontal
 * bars, never the diagonal slant real engraving uses to follow a melodic
 * contour.
 *
 * `groups` partitions `sequence`'s indices into beam units, in ascending,
 * contiguous, non-overlapping, fully-covering order (e.g. [[0,1,2],[3]] for
 * a 4-note sequence where the first 3 share a beam and the 4th stands
 * alone). A group of length 1 is an unbeamed note (drawn with its own flag
 * if eighth/sixteenth). Trusted as authored, not defensively re-validated
 * here.
 *
 * A rest can sit inside a `sequence` entry alongside notes — a beam still
 * needs at least TWO real (non-rest) notes to draw at all, so the "does
 * this group draw a beam" gate counts only a group's real-note indices, not
 * its raw length. A rest at a group's edge doesn't stretch the primary beam
 * toward it either — the beam spans the group's first and last REAL note.
 *
 * `ties` marks index pairs (always two adjacent indices, though not
 * necessarily in the same group — a tie can straddle a group boundary)
 * notated as tied — the syncopation-as-tied-eighths cases. Musical
 * correctness of a grouping (which one is "right") is never decided here —
 * this function draws exactly what `groups`/`ties` say, including a
 * deliberately wrong distractor grouping; the content authors correctness.
 */
export function computeBeamLayout(
  sequence: readonly (RhythmNoteValue | RhythmRestValue)[],
  groups: readonly (readonly number[])[],
  ties: readonly (readonly [number, number])[] = [],
  barBeforeIndex?: number
): BeamLayout {
  const notes: BeamLayoutNote[] = new Array(sequence.length);
  const primaryBeams: BeamSegment[] = [];
  const secondaryBeams: BeamSegment[] = [];
  const partialBeams: BeamSegment[] = [];

  let cursorX = LEFT_MARGIN;
  groups.forEach((group, groupNumber) => {
    if (groupNumber > 0) {
      cursorX += GROUP_GAP_EXTRA;
    }
    const realIndexesInGroup = group.filter((index) => !isRestValue(sequence[index]));
    const isBeamedGroup = realIndexesInGroup.length >= 2;

    group.forEach((index) => {
      if (barBeforeIndex !== undefined && index === barBeforeIndex) {
        cursorX += BAR_LINE_EXTRA_GAP;
      }
      const value = sequence[index];
      if (isRestValue(value)) {
        notes[index] = {
          index,
          x: cursorX,
          hasStem: false,
          hasFlag: null,
          hasDot: false,
          notehead: "black",
          restValue: value,
        };
      } else {
        const hasFlag: BeamLayoutNote["hasFlag"] =
          !isBeamedGroup && FLAGGABLE_VALUES.has(value) ? (value === "sixteenth" ? "sixteenth" : "eighth") : null;
        const notehead: BeamLayoutNote["notehead"] =
          value === "whole" ? "whole" : HALF_NOTEHEAD_VALUES.has(value) ? "half" : "black";
        notes[index] = {
          index,
          x: cursorX,
          hasStem: !STEMLESS_VALUES.has(value),
          hasFlag,
          hasDot: DOTTED_VALUES.has(value),
          notehead,
        };
      }
      cursorX += NOTE_SPACING;
    });

    if (isBeamedGroup) {
      const firstNote = notes[realIndexesInGroup[0]];
      const lastNote = notes[realIndexesInGroup[realIndexesInGroup.length - 1]];
      primaryBeams.push({ fromX: firstNote.x, toX: lastNote.x, y: NOTEHEAD_Y - STEM_HEIGHT });

      for (let i = 0; i < group.length - 1; i++) {
        const a = sequence[group[i]];
        const b = sequence[group[i + 1]];
        if (a === "sixteenth" && b === "sixteenth") {
          secondaryBeams.push({
            fromX: notes[group[i]].x,
            toX: notes[group[i + 1]].x,
            y: NOTEHEAD_Y - STEM_HEIGHT + SECONDARY_BEAM_GAP,
          });
        }
      }

      for (let i = 0; i < group.length; i++) {
        const idx = group[i];
        if (sequence[idx] !== "sixteenth") continue;
        const leftIdx = i > 0 ? group[i - 1] : undefined;
        const rightIdx = i < group.length - 1 ? group[i + 1] : undefined;
        const leftIsSixteenth = leftIdx !== undefined && sequence[leftIdx] === "sixteenth";
        const rightIsSixteenth = rightIdx !== undefined && sequence[rightIdx] === "sixteenth";
        if (leftIsSixteenth || rightIsSixteenth) continue;
        const noteX = notes[idx].x;
        const y = NOTEHEAD_Y - STEM_HEIGHT + SECONDARY_BEAM_GAP;
        partialBeams.push(
          leftIdx !== undefined
            ? { fromX: noteX - PARTIAL_BEAM_LENGTH, toX: noteX, y }
            : { fromX: noteX, toX: noteX + PARTIAL_BEAM_LENGTH, y }
        );
      }
    }
  });

  const tieArcs: TieArcLayout[] = ties.map(([from, to]) => ({
    fromX: notes[from].x,
    toX: notes[to].x,
  }));

  const barLine: BarLineLayout | undefined =
    barBeforeIndex !== undefined && barBeforeIndex > 0 && barBeforeIndex < sequence.length
      ? { x: (notes[barBeforeIndex - 1].x + notes[barBeforeIndex].x) / 2 }
      : undefined;

  const lastNoteX = cursorX - NOTE_SPACING;
  const viewWidth = lastNoteX + RIGHT_MARGIN + GLYPH_WIDTH_ALLOWANCE;

  const tripletLabels = tripletLabelIndexes(sequence).map((index) => notes[index].x);

  return { notes, primaryBeams, secondaryBeams, partialBeams, tripletLabels, ties: tieArcs, barLine, viewWidth };
}
