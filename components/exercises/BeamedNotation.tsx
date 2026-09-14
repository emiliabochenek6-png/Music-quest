import { Pressable, View } from "react-native";
import Svg, { Circle, Ellipse, G, Line, Path, Rect, Text as SvgText } from "react-native-svg";
import { TimeSignature } from "@/components/exercises/MeteredNotationRow";
import { REST_CENTER_X, REST_CENTER_Y, REST_GLYPH_SCALE, REST_PATH } from "@/components/exercises/RestValueIcon";
import {
  computeBeamLayout,
  BEAM_THICKNESS,
  NOTEHEAD_Y,
  STEM_HEIGHT,
  VIEW_HEIGHT,
} from "@/lib/rhythm/beamLayout";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Meter, RhythmNoteValue, RhythmRestValue } from "@/types/exercises";

interface BeamedNotationProps {
  sequence: readonly (RhythmNoteValue | RhythmRestValue)[];
  groups: readonly (readonly number[])[];
  ties?: readonly (readonly [number, number])[];
  /** Renders a time signature to the left of the notation when set — pass
   * this on only one option of a beam-grouping-choice exercise (every
   * option shares the same meter, repeating the glyph on each would be
   * visual noise). */
  meter?: Meter;
  barBeforeIndex?: number;
  /** Set (together with `onNoteClick`) to turn on "Grupuj" mode — every
   * beamable, non-rest note renders as a clickable overlay target (its
   * own LOCAL index into `sequence`), used by RhythmValueDictationExercise
   * to let the player manually mark which of their own written notes
   * should share a beam. Omit for every other (read-only) use of this
   * component. */
  onNoteClick?: (localIndex: number) => void;
  /** LOCAL index of the note already clicked once, awaiting a second
   * adjacent click to complete a merge/split — highlighted so the player
   * can see what's "armed". */
  pendingIndex?: number | null;
  /** aria-label for a clickable note's overlay button, given its LOCAL
   * index — required whenever `onNoteClick` is set. */
  noteAriaLabel?: (localIndex: number) => string;
}

/** Only these values ever share a beam — matches
 * lib/rhythm/beamLayout.ts's own (private) FLAGGABLE_VALUES/
 * lib/rhythm/beamGrouping.ts's own BEAMABLE_VALUES: a quarter-or-longer
 * value or a rest is never a valid "Grupuj" click target. */
const BEAMABLE_VALUES: ReadonlySet<RhythmNoteValue> = new Set(["eighth", "dottedEighth", "sixteenth", "eighthTriplet"]);

/** Pixel height this renders at when a sequence is short enough to fit
 * MAX_NOTATION_WIDTH at this size — needed as a real number so the
 * wrapping View's pixel-sized width can be computed from the viewBox's
 * aspect ratio. */
const NOMINAL_PIXEL_HEIGHT = 64;
/** A long sequence (e.g. Gaj Grupowania's 12-note 12/8 measures, or the
 * two-measure syncopation examples) rendered at NOMINAL_PIXEL_HEIGHT can
 * exceed an OptionButton's own available width — since this sits inside a
 * Pressable there, a horizontal ScrollView's touch handling isn't
 * reliable, so overflow gets clipped by the button's own rounded border
 * instead of scrolling into view. Scaling the WHOLE notation down
 * (viewBox-based, so every glyph/beam/gap shrinks together, nothing
 * distorts) to fit this width instead avoids relying on that scroll ever
 * firing. Sized for an OptionButton's own inner width on a narrow phone
 * (paddingHorizontal ~18 each side, border ~2 each side, inside a ~327pt-
 * wide exercise area) with a little breathing room. */
const MAX_NOTATION_WIDTH = 260;

const NOTE_RADIUS_X = 6;
const NOTE_RADIUS_Y = 4.5;
/** Horizontal offset from a notehead's center to where its stem attaches —
 * lands the stem at the notehead's own right edge, same idea as
 * TriadStaffNotation/StaffNotation's own note-radius-relative placements
 * elsewhere in this app. */
const STEM_X_OFFSET = NOTE_RADIUS_X - 1;
const DOT_X_OFFSET = 13;
const DOT_RADIUS = 1.6;
const TIE_ARC_HEIGHT = 10;
const TRIPLET_LABEL_FONT_SIZE = 15;
const TRIPLET_LABEL_Y = NOTEHEAD_Y - STEM_HEIGHT - 8;

/** Flag outline data traced from the web app's own Bravura font — same
 * fontTools SVGPathPen extraction as NoteValueIcon/RestValueIcon's own
 * baked paths (see their doc). Drawn separately from the notehead here
 * (unlike NoteValueIcon's one fused glyph) since a beamed note's stem/flag
 * must land exactly where a beam attaches. */
const FLAG_PATH: Record<"eighth" | "sixteenth", string> = {
  eighth:
    "M238 -790C238 -790 264 -695 264 -617C264 -492 212 -374 149 -274C98 -195 56 -109 40 -13C37 3 29 9 19 9C8 9 0 6 0 -6V-245C66 -257 161 -393 197 -478C212 -512 221 -569 221 -628C221 -673 214 -720 197 -765C195 -771 194 -776 194 -780C194 -796 204 -805 210 -809C211 -810 213 -810 215 -810C222 -810 234 -804 238 -790Z",
  sixteenth:
    "M272 -796C276 -791 279 -734 279 -686V-664C279 -622 268 -581 250 -544C250 -541 249 -539 249 -535C249 -533 249 -531 250 -528C253 -522 275 -462 275 -401C275 -388 274 -377 272 -365C262 -297 236 -269 164 -191C110 -133 54 -117 37 -11C35 0 23 2 17 2C11 2 0 -1 0 -8V-396H5C67 -398 138 -400 207 -540C230 -588 239 -637 239 -689C239 -718 236 -748 231 -778C230 -782 230 -784 230 -787C230 -801 237 -809 244 -811C247 -812 249 -813 252 -813C259 -813 266 -809 272 -796ZM209 -459C193 -434 176 -414 155 -390C108 -336 62 -312 41 -230C40 -229 40 -228 40 -227C40 -223 46 -217 54 -217H62C123 -217 177 -273 210 -322C228 -348 237 -379 237 -411C237 -418 237 -424 236 -431C234 -439 234 -449 229 -457C228 -460 221 -463 216 -463C213 -463 211 -462 209 -459Z",
};
// Same scale as RestValueIcon's own baked paths (REST_GLYPH_SCALE) — one
// consistent font-units-to-screen ratio for every glyph this component
// draws, flags and rests alike.
const GLYPH_SCALE = REST_GLYPH_SCALE;

/** Renders a rhythm sequence as real beamed notation — bare noteheads,
 * hand-drawn stems, beams (with a secondary partial beam between adjacent
 * sixteenths), augmentation dots, and tie arcs, all computed by
 * computeBeamLayout (lib/rhythm/beamLayout.ts) and drawn here as one flat
 * SVG coordinate space. Unlike NoteValueIcon (one complete glyph per note,
 * used everywhere a note stands alone), this is the renderer for anywhere
 * a GROUPING of notes needs to be shown — "Gaj Grupowania"'s beam-
 * grouping-choice exercises and its own lesson-intro grouping examples.
 * `sequence` entries can be rests as well as notes — a rest draws its own
 * glyph (no stem/flag/dot) and never counts toward whether its group draws
 * a beam (see computeBeamLayout).
 *
 * Notehead shapes are plain SVG ellipses (filled for black noteheads,
 * hollow for half/whole), not baked Bravura glyphs like NoteValueIcon's
 * fused shapes — a notehead is exactly an ellipse, matching how every
 * other staff component in this app (TriadStaffNotation, StaffNotation,
 * StaffPlacementBoard, ...) already draws one, so there's nothing to
 * extract from the font for it. Flags and rests ARE baked Bravura outlines
 * (genuinely curved/irregular shapes), reusing the exact same technique
 * (and, for rests, the exact same path data) already established by
 * RestValueIcon.
 *
 * Ported from the web app's BeamedNotation.tsx (font-glyph-based there via
 * next/font; hand-drawn SVG primitives + baked paths here, mirroring how
 * this whole port replaces live Bravura rendering everywhere else).
 * A sequence spanning a full measure (or two, for the cross-measure
 * syncopation examples) is scaled down as a whole (see MAX_NOTATION_WIDTH)
 * rather than relying on horizontal scroll — nothing here should ever get
 * clipped by a parent's own bounds. */
export function BeamedNotation({ sequence, groups, ties, meter, barBeforeIndex, onNoteClick, pendingIndex = null, noteAriaLabel }: BeamedNotationProps) {
  const layout = computeBeamLayout(sequence, groups, ties, barBeforeIndex);
  const nominalPixelWidth = (layout.viewWidth / VIEW_HEIGHT) * NOMINAL_PIXEL_HEIGHT;
  const pixelHeight =
    nominalPixelWidth > MAX_NOTATION_WIDTH ? (MAX_NOTATION_WIDTH / nominalPixelWidth) * NOMINAL_PIXEL_HEIGHT : NOMINAL_PIXEL_HEIGHT;
  const pixelWidth = (layout.viewWidth / VIEW_HEIGHT) * pixelHeight;
  const ink = theme.colors.ink;

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing(1) }}>
      {meter && <TimeSignature meter={meter} />}
      <View style={{ width: pixelWidth, height: pixelHeight }}>
        <Svg viewBox={`0 0 ${layout.viewWidth} ${VIEW_HEIGHT}`} width={pixelWidth} height={pixelHeight}>
            {layout.barLine && (
              <Line
                x1={layout.barLine.x}
                x2={layout.barLine.x}
                y1={NOTEHEAD_Y - STEM_HEIGHT - 10}
                y2={NOTEHEAD_Y + 14}
                stroke={ink}
                strokeWidth={1.5}
              />
            )}

            {layout.notes.map((note) =>
              note.restValue ? (
                <Path
                  key={note.index}
                  d={REST_PATH[note.restValue]}
                  fill={ink}
                  fillRule="nonzero"
                  transform={`translate(${note.x - REST_CENTER_X[note.restValue] * GLYPH_SCALE} ${
                    NOTEHEAD_Y + GLYPH_SCALE * REST_CENTER_Y[note.restValue]
                  }) scale(${GLYPH_SCALE} ${-GLYPH_SCALE})`}
                />
              ) : (
                <G key={note.index}>
                  {note.notehead === "black" ? (
                    <Ellipse cx={note.x} cy={NOTEHEAD_Y} rx={NOTE_RADIUS_X} ry={NOTE_RADIUS_Y} fill={ink} />
                  ) : (
                    <Ellipse cx={note.x} cy={NOTEHEAD_Y} rx={NOTE_RADIUS_X} ry={NOTE_RADIUS_Y} fill="none" stroke={ink} strokeWidth={1.6} />
                  )}
                  {note.hasStem && (
                    <Line
                      x1={note.x + STEM_X_OFFSET}
                      x2={note.x + STEM_X_OFFSET}
                      y1={NOTEHEAD_Y - 1}
                      y2={NOTEHEAD_Y - STEM_HEIGHT}
                      stroke={ink}
                      strokeWidth={1.8}
                    />
                  )}
                  {note.hasFlag && (
                    <Path
                      d={FLAG_PATH[note.hasFlag]}
                      fill={ink}
                      fillRule="nonzero"
                      transform={`translate(${note.x + STEM_X_OFFSET} ${NOTEHEAD_Y - STEM_HEIGHT}) scale(${GLYPH_SCALE} ${-GLYPH_SCALE})`}
                    />
                  )}
                  {note.hasDot && <Circle cx={note.x + DOT_X_OFFSET} cy={NOTEHEAD_Y} r={DOT_RADIUS} fill={ink} />}
                </G>
              )
            )}

            {layout.primaryBeams.map((beam, index) => (
              <Rect
                key={`primary-${index}`}
                x={beam.fromX + STEM_X_OFFSET}
                y={beam.y - BEAM_THICKNESS}
                width={beam.toX - beam.fromX}
                height={BEAM_THICKNESS}
                fill={ink}
              />
            ))}
            {layout.secondaryBeams.map((beam, index) => (
              <Rect
                key={`secondary-${index}`}
                x={beam.fromX + STEM_X_OFFSET}
                y={beam.y - BEAM_THICKNESS}
                width={beam.toX - beam.fromX}
                height={BEAM_THICKNESS}
                fill={ink}
              />
            ))}
            {layout.partialBeams.map((beam, index) => (
              <Rect
                key={`partial-${index}`}
                x={beam.fromX + STEM_X_OFFSET}
                y={beam.y - BEAM_THICKNESS}
                width={beam.toX - beam.fromX}
                height={BEAM_THICKNESS}
                fill={ink}
              />
            ))}

            {layout.tripletLabels.map((x, index) => (
              <SvgText
                key={`triplet-${index}`}
                x={x}
                y={TRIPLET_LABEL_Y}
                fontSize={TRIPLET_LABEL_FONT_SIZE}
                fontWeight="700"
                fill={ink}
                textAnchor="middle"
              >
                3
              </SvgText>
            ))}

            {layout.ties.map((tie, index) => {
              const fromX = tie.fromX + STEM_X_OFFSET;
              const toX = tie.toX + STEM_X_OFFSET;
              const midX = (fromX + toX) / 2;
              const baseY = NOTEHEAD_Y + 8;
              return (
                <Path
                  key={`tie-${index}`}
                  d={`M ${fromX} ${baseY} Q ${midX} ${baseY + TIE_ARC_HEIGHT} ${toX} ${baseY}`}
                  stroke={ink}
                  strokeWidth={1.4}
                  fill="none"
                />
              );
            })}
          </Svg>

          {onNoteClick &&
            layout.notes.map((note) => {
              if (note.restValue || !BEAMABLE_VALUES.has(sequence[note.index] as RhythmNoteValue)) {
                return null;
              }
              const isPending = pendingIndex === note.index;
              return (
                <Pressable
                  key={note.index}
                  onPress={() => onNoteClick(note.index)}
                  accessibilityRole="button"
                  accessibilityLabel={noteAriaLabel?.(note.index)}
                  accessibilityState={{ selected: isPending }}
                  style={{
                    position: "absolute",
                    left: `${(note.x / layout.viewWidth) * 100}%`,
                    top: `${(NOTEHEAD_Y / VIEW_HEIGHT) * 100}%`,
                    width: 26,
                    height: 26,
                    marginLeft: -13,
                    marginTop: -13,
                    borderRadius: 13,
                    borderWidth: isPending ? 2 : 0,
                    borderColor: theme.colors.primary,
                  }}
                />
              );
            })}
      </View>
    </View>
  );
}
