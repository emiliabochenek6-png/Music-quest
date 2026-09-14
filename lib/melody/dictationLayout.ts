import { stepToY } from "@/lib/music/staffGeometry";
import { getKeySignatureLetters } from "@/lib/music/keys";
import { diatonicIndexToLetter, letterDiatonicIndex, type Accidental } from "@/lib/music/notes";
import { meterQuarterNoteBeats } from "@/lib/rhythm/meter";
import type { Meter, RhythmNoteValue } from "@/types/exercises";

/** Treble-clef staff step 0 is always E4 (see lib/music/staff.ts's own
 * CLEF_BOTTOM_LINE_DIATONIC_INDEX) — steps advance one diatonic letter per
 * step, so a step's letter is just "E" shifted by that many diatonic
 * indices. Lets isAccidentalImpliedByKey compare a note's pitch *class*
 * against the key signature's altered letters, not its exact staff step —
 * a key signature's F# is implied for F4 just as much as the F5 its own
 * glyph happens to be drawn at. */
function stepToLetter(step: number) {
  return diatonicIndexToLetter(letterDiatonicIndex("E") + step);
}

/** Horizontal distance between two consecutive noteheads — wider than
 * lib/rhythm/beamLayout.ts's NOTE_SPACING (42) because every note here
 * potentially carries its own accidental glyph beside it, which pitch-less
 * rhythm notation never needs room for. */
export const NOTE_SPACING = 46;
/** Width reserved for the embedded treble clef + key signature
 * (KeySignatureGlyphs, rendered by MelodicDictationStaff before the first
 * note, directly in this same coordinate system) — tuned live in the
 * browser (on web) against the actual glyphs, kept as the same starting
 * value here since this port reuses that same KeySignatureGlyphs
 * component and staffGeometry scale. */
export const CLEF_KEY_SIGNATURE_WIDTH = 88;
/** Where the time signature's numerator/denominator digits start, in the
 * same coordinate system as the clef/key signature above. Assumes a
 * single-digit numerator/denominator (every meter this exercise type
 * authors is one digit over one digit, e.g. "4/4", "9/8"). */
export const TIME_SIGNATURE_X = CLEF_KEY_SIGNATURE_WIDTH + 17;
/** Extra width the time signature's own digits need past TIME_SIGNATURE_X
 * before the first note can land. */
export const TIME_SIGNATURE_WIDTH = 16;
/** Left padding before the first notehead — now needs to clear the
 * embedded clef + key signature + time signature above, not just room for
 * the note's own accidental. */
export const LEFT_MARGIN = TIME_SIGNATURE_X + TIME_SIGNATURE_WIDTH + 9;
export const RIGHT_MARGIN = 20;
/** Extra room reserved past the last note's x for its stem/flag/dot. */
export const GLYPH_TAIL_ALLOWANCE = 24;
export const STEM_HEIGHT = 34;
/** Keeps the empty ("no notes placed yet") staff a sane width instead of
 * collapsing to just LEFT_MARGIN + RIGHT_MARGIN. */
export const MIN_VIEW_WIDTH = 140;
/** Extra horizontal gap inserted at a measure boundary, on top of the
 * regular NOTE_SPACING — mirrors lib/rhythm/beamLayout.ts's own
 * BAR_LINE_EXTRA_GAP. Sized generously enough to also clear the note
 * AFTER the bar line's own accidental glyph. */
export const BAR_LINE_EXTRA_GAP = 34;
/** Touches just inside the ellipse notehead's right edge (NOTE_RADIUS=7,
 * MelodicDictationStaff's own constant) — this notehead is a plain SVG
 * ellipse, not a Bravura glyph, so lib/rhythm/beamLayout.ts's own stem
 * geometry doesn't transfer. Lives here (not the component) because
 * beam-segment endpoints need it too. */
export const STEM_X_OFFSET = 6;
/** Vertical offset of a sixteenth-note secondary beam below (up-stem) or
 * above (down-stem) the primary one — mirrors lib/rhythm/beamLayout.ts's
 * own SECONDARY_BEAM_GAP (8). */
export const SECONDARY_BEAM_GAP = 8;
/** Length of a partial ("hook") beam for a sixteenth with no sixteenth
 * neighbor on one side within its group — mirrors lib/rhythm/beamLayout.ts's
 * own PARTIAL_BEAM_LENGTH (18). */
export const PARTIAL_BEAM_LENGTH = 18;
/** SVG stroke width for a beam segment — mirrors lib/rhythm/beamLayout.ts's
 * own BEAM_THICKNESS (5). */
export const BEAM_THICKNESS = 5;

/** Quarter-note beats each rhythmic value lasts — needed here purely to
 * find measure boundaries in beat *counts*, this geometry has no bpm to
 * convert through, unlike generate.ts's own onset/duration derivation in
 * real milliseconds. */
const NOTE_VALUE_BEATS: Record<RhythmNoteValue, number> = {
  whole: 4,
  half: 2,
  quarter: 1,
  dottedQuarter: 1.5,
  dottedHalf: 3,
  eighth: 0.5,
  dottedEighth: 0.75,
  sixteenth: 0.25,
  eighthTriplet: 1 / 3,
};

/** Guards against floating-point drift landing a note's onset just below a
 * measure-boundary multiple (e.g. 2.9999999999996 instead of 3) and
 * reading as the previous measure. */
const MEASURE_EPSILON = 1e-6;

/** Which measure (0-indexed) a note starting at `onsetBeats` falls in,
 * given the meter's beats-per-measure. */
function measureIndexOf(onsetBeats: number, beatsPerMeasure: number): number {
  return Math.floor(onsetBeats / beatsPerMeasure + MEASURE_EPSILON);
}

/** No eighthTriplet here — Szczyt Dyktand's melodic-rhythmic dictation
 * deliberately excludes triplets from its authored content (a triplet's
 * "3" label is tied to a run of exactly 3 notes, which conflicts with
 * entering notes one at a time with no group concept). Also doubles as
 * the "can this value ever share a beam" set (same values, matching
 * lib/rhythm/beamGrouping.ts's own BEAMABLE_VALUES minus eighthTriplet) —
 * real notation never beams a quarter-or-longer value. */
const FLAGGABLE_VALUES: ReadonlySet<RhythmNoteValue> = new Set(["eighth", "dottedEighth", "sixteenth"]);
const STEMLESS_VALUES: ReadonlySet<RhythmNoteValue> = new Set(["whole"]);
const DOTTED_VALUES: ReadonlySet<RhythmNoteValue> = new Set(["dottedQuarter", "dottedHalf", "dottedEighth"]);
const HALF_NOTEHEAD_VALUES: ReadonlySet<RhythmNoteValue> = new Set(["half", "dottedHalf"]);

/** Step 4 is B4 ("H" in Polish/German note-naming) — the middle line of
 * the treble staff, and the standard engraving break point for stem
 * direction: a note ON or ABOVE the middle line gets a downward stem,
 * everything below gets an upward one. */
const STEM_DOWN_FROM_STEP = 4;

export interface DictationLayoutInputNote {
  step: number;
  accidental: Accidental;
  value: RhythmNoteValue;
}

export interface DictationLayoutNote {
  index: number;
  x: number;
  /** stepToY(step) — the only place pitch enters this module's geometry. */
  y: number;
  accidental: Accidental;
  hasStem: boolean;
  /** Individual per-note by default (see STEM_DOWN_FROM_STEP) — but every
   * note in a real (>=2-note) beam group shares ONE direction instead. */
  stemDirection: "up" | "down";
  /** Only set for a note that stands alone — a note beamed to a neighbor
   * never also carries its own flag. */
  hasFlag: "eighth" | "sixteenth" | null;
  hasDot: boolean;
  notehead: "whole" | "half" | "black";
}

export interface BarLineLayout {
  x: number;
}

/** A straight line segment between two stem tips — unlike
 * lib/rhythm/beamLayout.ts's own BeamSegment (a single shared `y`, since
 * that notation is pitch-less), a beam here can genuinely slope: two
 * grouped notes at different staff heights still share ONE stem direction,
 * but their stem TIPS sit at different y — the beam is the line
 * connecting them, exactly like real engraving's own sloped beams. */
export interface MelodicBeamSegment {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

export interface DictationLayout {
  notes: DictationLayoutNote[];
  barLines: BarLineLayout[];
  primaryBeams: MelodicBeamSegment[];
  secondaryBeams: MelodicBeamSegment[];
  partialBeams: MelodicBeamSegment[];
  viewWidth: number;
}

/** For each note index belonging to a real (>=2-note) group, the shared
 * stem direction every note in that group uses — real engraving gives an
 * entire beam group ONE direction rather than letting each note pick its
 * own. This app's simplification: the group's own AVERAGE step compared
 * to the middle line (STEM_DOWN_FROM_STEP) decides it. */
function groupStemDirections(
  notes: readonly DictationLayoutInputNote[],
  groups: readonly (readonly number[])[]
): Map<number, "up" | "down"> {
  const directionByIndex = new Map<number, "up" | "down">();
  for (const group of groups) {
    if (group.length < 2) continue;
    const averageStep = group.reduce((sum, index) => sum + notes[index].step, 0) / group.length;
    const direction: "up" | "down" = averageStep >= STEM_DOWN_FROM_STEP ? "down" : "up";
    for (const index of group) {
      directionByIndex.set(index, direction);
    }
  }
  return directionByIndex;
}

/**
 * Pure geometry for MelodicDictationStaff — every note's x/y position plus
 * which glyphs (stem/flag/dot/notehead-shape) it needs, with no React/DOM
 * involved. Mirrors lib/rhythm/beamLayout.ts's split, adding the one
 * dimension that file explicitly doesn't have — pitch, via
 * lib/music/staffGeometry's stepToY.
 *
 * `notes` is trusted as given, in the order they should render left to
 * right. `groups` is the same manual "Grupuj" partition concept
 * computeBeamLayout takes (ascending, contiguous, non-overlapping, fully-
 * covering indices into `notes`) — a length-1 entry is an unbeamed note
 * (its own flag), length >=2 is a real beam group. Defaults to `[]` for
 * callers with nothing to group.
 *
 * Bar lines are tracked in one of two mutually exclusive modes:
 * - Auto (default, `manualBarLineAfter` omitted): a line is inserted
 *   wherever a note's own onset crosses into a new measure of `meter` —
 *   used for the "correct answer" recap, where the true meter is known.
 * - Manual (`manualBarLineAfter` given, a set of note indices): a line
 *   renders right after each listed index instead — whatever the player
 *   themselves placed ("Kreska taktowa" toggle), not derived from `meter`
 *   at all — composing a phrase by ear has no reliable way to know in
 *   advance which beat a given note falls on.
 */
export function computeDictationLayout(
  notes: readonly DictationLayoutInputNote[],
  meter: Meter,
  groups: readonly (readonly number[])[] = [],
  manualBarLineAfter?: ReadonlySet<number>
): DictationLayout {
  const beatsPerMeasure = meterQuarterNoteBeats(meter);
  const stemDirections = groupStemDirections(notes, groups);
  let cursorX = LEFT_MARGIN;
  let cumulativeBeats = 0;
  let previousMeasureIndex = 0;
  let previousNoteX: number | null = null;
  const barLines: BarLineLayout[] = [];
  const laidOut: DictationLayoutNote[] = [];

  notes.forEach((note, index) => {
    const currentMeasureIndex = measureIndexOf(cumulativeBeats, beatsPerMeasure);
    const needsBarLineBefore = manualBarLineAfter
      ? index > 0 && manualBarLineAfter.has(index - 1)
      : index > 0 && currentMeasureIndex > previousMeasureIndex;
    if (needsBarLineBefore) {
      cursorX += BAR_LINE_EXTRA_GAP;
    }
    previousMeasureIndex = currentMeasureIndex;

    const x = cursorX;
    if (needsBarLineBefore && previousNoteX !== null) {
      barLines.push({ x: (previousNoteX + x) / 2 });
    }
    previousNoteX = x;

    cursorX += NOTE_SPACING;
    cumulativeBeats += NOTE_VALUE_BEATS[note.value];

    const isBeamed = stemDirections.has(index);
    const hasFlag: DictationLayoutNote["hasFlag"] =
      !isBeamed && FLAGGABLE_VALUES.has(note.value) ? (note.value === "sixteenth" ? "sixteenth" : "eighth") : null;
    const notehead: DictationLayoutNote["notehead"] =
      note.value === "whole" ? "whole" : HALF_NOTEHEAD_VALUES.has(note.value) ? "half" : "black";

    laidOut.push({
      index,
      x,
      y: stepToY(note.step),
      accidental: note.accidental,
      hasStem: !STEMLESS_VALUES.has(note.value),
      stemDirection: stemDirections.get(index) ?? (note.step >= STEM_DOWN_FROM_STEP ? "down" : "up"),
      hasFlag,
      hasDot: DOTTED_VALUES.has(note.value),
      notehead,
    });
  });

  const viewWidth = notes.length === 0 ? MIN_VIEW_WIDTH : cursorX - NOTE_SPACING + RIGHT_MARGIN + GLYPH_TAIL_ALLOWANCE;

  const primaryBeams: MelodicBeamSegment[] = [];
  const secondaryBeams: MelodicBeamSegment[] = [];
  const partialBeams: MelodicBeamSegment[] = [];

  const stemTipX = (noteIndex: number, direction: "up" | "down") =>
    laidOut[noteIndex].x + (direction === "up" ? STEM_X_OFFSET : -STEM_X_OFFSET);
  const stemTipY = (noteIndex: number, direction: "up" | "down") =>
    direction === "up" ? laidOut[noteIndex].y - STEM_HEIGHT : laidOut[noteIndex].y + STEM_HEIGHT;

  for (const group of groups) {
    if (group.length < 2) continue;
    const direction = stemDirections.get(group[0])!;
    const secondaryOffset = direction === "up" ? SECONDARY_BEAM_GAP : -SECONDARY_BEAM_GAP;

    const firstIndex = group[0];
    const lastIndex = group[group.length - 1];
    primaryBeams.push({
      fromX: stemTipX(firstIndex, direction),
      fromY: stemTipY(firstIndex, direction),
      toX: stemTipX(lastIndex, direction),
      toY: stemTipY(lastIndex, direction),
    });

    for (let i = 0; i < group.length - 1; i++) {
      const a = group[i];
      const b = group[i + 1];
      if (notes[a].value === "sixteenth" && notes[b].value === "sixteenth") {
        secondaryBeams.push({
          fromX: stemTipX(a, direction),
          fromY: stemTipY(a, direction) + secondaryOffset,
          toX: stemTipX(b, direction),
          toY: stemTipY(b, direction) + secondaryOffset,
        });
      }
    }

    for (let i = 0; i < group.length; i++) {
      const idx = group[i];
      if (notes[idx].value !== "sixteenth") continue;
      const leftIdx = i > 0 ? group[i - 1] : undefined;
      const rightIdx = i < group.length - 1 ? group[i + 1] : undefined;
      const leftIsSixteenth = leftIdx !== undefined && notes[leftIdx].value === "sixteenth";
      const rightIsSixteenth = rightIdx !== undefined && notes[rightIdx].value === "sixteenth";
      if (leftIsSixteenth || rightIsSixteenth) continue;
      const tipX = stemTipX(idx, direction);
      const tipY = stemTipY(idx, direction) + secondaryOffset;
      partialBeams.push(
        leftIdx !== undefined
          ? { fromX: tipX - PARTIAL_BEAM_LENGTH, fromY: tipY, toX: tipX, toY: tipY }
          : { fromX: tipX, fromY: tipY, toX: tipX + PARTIAL_BEAM_LENGTH, toY: tipY }
      );
    }
  }

  return { notes: laidOut, barLines, primaryBeams, secondaryBeams, partialBeams, viewWidth };
}

/** Where the NEXT note (not yet committed) would land — the same cursor
 * position computeDictationLayout would give it if it were appended to
 * `notes`, INCLUDING a bar-line gap if a line belongs right before it.
 * Lets MelodicDictationStaff draw a clickable pitch-picker column
 * directly on the growing staff itself (write the note where it will
 * actually appear) instead of a separate, decoupled picker board. */
export function pendingNoteX(
  notes: readonly DictationLayoutInputNote[],
  meter: Meter,
  manualBarLineAfter?: ReadonlySet<number>
): number {
  const beatsPerMeasure = meterQuarterNoteBeats(meter);
  let cursorX = LEFT_MARGIN;
  let cumulativeBeats = 0;
  let previousMeasureIndex = 0;

  notes.forEach((note, index) => {
    const currentMeasureIndex = measureIndexOf(cumulativeBeats, beatsPerMeasure);
    const needsBarLineBefore = manualBarLineAfter
      ? index > 0 && manualBarLineAfter.has(index - 1)
      : index > 0 && currentMeasureIndex > previousMeasureIndex;
    if (needsBarLineBefore) {
      cursorX += BAR_LINE_EXTRA_GAP;
    }
    previousMeasureIndex = currentMeasureIndex;
    cursorX += NOTE_SPACING;
    cumulativeBeats += NOTE_VALUE_BEATS[note.value];
  });

  const pendingMeasureIndex = measureIndexOf(cumulativeBeats, beatsPerMeasure);
  const pendingNeedsBarLine = manualBarLineAfter
    ? manualBarLineAfter.has(notes.length - 1)
    : notes.length > 0 && pendingMeasureIndex > previousMeasureIndex;
  return pendingNeedsBarLine ? cursorX + BAR_LINE_EXTRA_GAP : cursorX;
}

/** viewWidth wide enough to fit every committed note AND one more
 * clickable pending slot after them. */
export function pendingViewWidth(
  notes: readonly DictationLayoutInputNote[],
  meter: Meter,
  manualBarLineAfter?: ReadonlySet<number>
): number {
  return Math.max(MIN_VIEW_WIDTH, pendingNoteX(notes, meter, manualBarLineAfter) + RIGHT_MARGIN + GLYPH_TAIL_ALLOWANCE);
}

/**
 * Whether a note's own accidental is already implied by the exercise's key
 * signature — real notation never draws a redundant individual accidental
 * next to a note whose alteration the key signature already covers.
 * `key` is a fifths count in the same convention as lib/music/keys.ts (0 =
 * no signature, positive = sharps, negative = flats) — reuses that
 * module's own getKeySignatureLetters. Only ever true for a single
 * accidental (±1) matching the signature's own direction — a double
 * sharp/flat is never implied by a plain key signature (Szczyt Dyktand
 * never authors one).
 */
export function isAccidentalImpliedByKey(step: number, accidental: Accidental, key: number): boolean {
  if (key === 0 || accidental === 0) {
    return false;
  }
  const matchesKeyDirection = key > 0 ? accidental === 1 : accidental === -1;
  return matchesKeyDirection && getKeySignatureLetters(key).includes(stepToLetter(step));
}
