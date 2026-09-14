import { Fragment, useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import Svg, { Circle, Ellipse, Line, Path, Text as SvgText } from "react-native-svg";
import { KeySignatureGlyphs } from "@/components/exercises/KeySignatureStaffIcon";
import {
  BEAM_THICKNESS,
  computeDictationLayout,
  isAccidentalImpliedByKey,
  NOTE_SPACING,
  pendingNoteX,
  pendingViewWidth,
  STEM_HEIGHT,
  STEM_X_OFFSET,
  TIME_SIGNATURE_X,
  type DictationLayoutInputNote,
} from "@/lib/melody/dictationLayout";
import { deriveBeamGroups } from "@/lib/rhythm/beamGrouping";
import { describeLineOrSpaceOrdinal, ledgerLineSteps } from "@/lib/music/staff";
import type { Accidental } from "@/lib/music/notes";
import { STAFF_LINE_STEPS, STEP_HEIGHT as STAFF_STEP_HEIGHT, VIEW_HEIGHT, stepToY } from "@/lib/music/staffGeometry";
import { REST_GLYPH_SCALE } from "@/components/exercises/RestValueIcon";
import { t } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { Meter, RhythmNoteValue } from "@/types/exercises";

/** Which values can ever share a beam — same set as
 * lib/melody/dictationLayout.ts's own (private) FLAGGABLE_VALUES, needed
 * here too to decide which committed notes get a "Grupuj" click overlay
 * (a note already beamed still needs to stay clickable, to allow
 * splitting it back apart — so this gates on the note's own VALUE, not on
 * whether it currently has a flag). */
const BEAMABLE_VALUES: ReadonlySet<RhythmNoteValue> = new Set(["eighth", "dottedEighth", "sixteenth"]);

/** Same plain-ellipse notehead + plain ♭/♯ text as every other staff
 * component in this app — font size/dy reuse TriadStaffNotation's own
 * already-tuned single-accidental values (±1, same NOTE_RADIUS=7). Only
 * -1/1 are possible here — Szczyt Dyktand never authors or accepts a
 * double accidental. */
const NOTE_RADIUS = 7;
/** How far a ledger line extends past the notehead on each side — same
 * value LessonIntro.tsx's own LessonIntroStaff draws its ledger lines at,
 * kept visually consistent across this app's staff components. */
const LEDGER_WIDTH = 22;
const ACCIDENTAL_SYMBOL: Record<-1 | 1, string> = { [-1]: "♭", [1]: "♯" };
const ACCIDENTAL_FONT_SIZE: Record<-1 | 1, number> = { [-1]: 22, [1]: 27 };
const ACCIDENTAL_DY: Record<-1 | 1, number> = { [-1]: 5, [1]: 9 };

/** Flag outline data traced from the Bravura font — same fontTools
 * SVGPathPen extraction as BeamedNotation's own baked paths, duplicated
 * rather than imported since this renderer needs BOTH stem directions
 * (BeamedNotation is pitch-less, always up-stem) — SMuFL's flag range
 * alternates up/down per duration (flag8thUp U+E240, flag8thDown U+E241,
 * flag16thUp U+E242, flag16thDown U+E243), picked per note by
 * DictationLayoutNote's own stemDirection. */
const FLAG_PATH: Record<"up" | "down", Record<"eighth" | "sixteenth", string>> = {
  up: {
    eighth:
      "M238 -790C238 -790 264 -695 264 -617C264 -492 212 -374 149 -274C98 -195 56 -109 40 -13C37 3 29 9 19 9C8 9 0 6 0 -6V-245C66 -257 161 -393 197 -478C212 -512 221 -569 221 -628C221 -673 214 -720 197 -765C195 -771 194 -776 194 -780C194 -796 204 -805 210 -809C211 -810 213 -810 215 -810C222 -810 234 -804 238 -790Z",
    sixteenth:
      "M272 -796C276 -791 279 -734 279 -686V-664C279 -622 268 -581 250 -544C250 -541 249 -539 249 -535C249 -533 249 -531 250 -528C253 -522 275 -462 275 -401C275 -388 274 -377 272 -365C262 -297 236 -269 164 -191C110 -133 54 -117 37 -11C35 0 23 2 17 2C11 2 0 -1 0 -8V-396H5C67 -398 138 -400 207 -540C230 -588 239 -637 239 -689C239 -718 236 -748 231 -778C230 -782 230 -784 230 -787C230 -801 237 -809 244 -811C247 -812 249 -813 252 -813C259 -813 266 -809 272 -796ZM209 -459C193 -434 176 -414 155 -390C108 -336 62 -312 41 -230C40 -229 40 -228 40 -227C40 -223 46 -217 54 -217H62C123 -217 177 -273 210 -322C228 -348 237 -379 237 -411C237 -418 237 -424 236 -431C234 -439 234 -449 229 -457C228 -460 221 -463 216 -463C213 -463 211 -462 209 -459Z",
  },
  down: {
    eighth:
      "M240 760C254 718 261 668 261 623C261 564 236 480 221 446C184 362 134 281 0 236V1C0 -9 8 -14 16 -14C25 -14 38 -8 40 8C57 103 131 190 182 269C245 368 306 487 306 612C306 690 286 761 278 793C275 804 269 808 262 808C250 808 237 796 237 777C237 772 238 766 240 760Z",
    sixteenth:
      "M240 786C246 754 249 720 249 687C249 634 240 581 217 533C148 393 67 390 5 388H0V1C0 -4 7 -9 17 -9C24 -9 35 -7 37 4C61 158 258 201 282 358C284 369 285 381 285 394C285 455 263 515 260 521C259 523 259 525 259 528C259 532 260 534 260 537C282 583 291 637 291 691C291 725 287 759 281 790C276 813 269 812 257 812C245 811 237 803 240 786ZM226 456C231 456 238 453 239 449C244 442 244 432 246 424C247 417 247 410 247 404C247 371 238 341 220 315C187 266 123 210 62 210H54C46 210 40 215 40 220C40 221 40 222 41 223C62 305 118 328 165 383C186 406 203 426 219 452C221 455 223 456 226 456Z",
  },
};
const GLYPH_SCALE = REST_GLYPH_SCALE;
const DOT_X_OFFSET = 14;
const DOT_RADIUS = 1.7;

/** Pixel height the SVG renders at — needed as a real number so the
 * interactive overlay's pixel-sized wrapper can compute a matching pixel
 * width from the viewBox's aspect ratio, same trick StaffPlacementBoard/
 * PianoKeyboard already use. */
const PIXEL_HEIGHT = 140;

/** Every step the inline pitch-picker can land on — same on-staff-only
 * range (0-8, no ledger lines) as StaffPlacementBoard's own
 * CLICKABLE_STEPS, since Szczyt Dyktand's content is authored within it. */
const CLICKABLE_STEPS = [0, 1, 2, 3, 4, 5, 6, 7, 8];

interface MelodicDictationStaffNote {
  step: number;
  accidental: Accidental;
  value: RhythmNoteValue;
}

interface MelodicDictationStaffProps {
  notes: MelodicDictationStaffNote[];
  ariaLabel: string;
  /** Fifths count (lib/music/keys.ts convention) — rendered as a real
   * treble clef + key signature before the first note. Named
   * `keySignature` rather than `key` since `key` is a reserved React
   * prop name. */
  keySignature: number;
  meter: Meter;
  /** Omit for a purely read-only staff (the "correct answer" recap). Pass
   * both to turn on the inline pitch picker: a clickable column of 9
   * staff positions appears right where the NEXT note will land. */
  pendingStep?: number | null;
  onSelectStep?: (step: number) => void;
  /** The player's own manual "Grupuj" beam-grouping of `notes` — indices
   * into `notes`. Omit for the read-only recap staff, which instead
   * auto-derives the canonical grouping for `notes` via deriveBeamGroups. */
  groups?: number[][];
  /** Turns on "Grupuj" click-to-select mode over the ALREADY-COMMITTED
   * notes — a separate click target from the pending-pitch-picker column
   * above. Only invoked for beamable notes. */
  onNoteClick?: (index: number) => void;
  pendingGroupIndex?: number | null;
  /** Note indices after which the player has manually placed a "Kreska
   * taktowa" bar line — switches computeDictationLayout/pendingNoteX into
   * manual bar-line mode instead of computing lines from `meter`. Omit
   * for the read-only recap staff. */
  manualBarLines?: readonly number[];
  disabled?: boolean;
  locale?: Locale;
  /** Index into `notes` of the one note currently expected to be sung —
   * Zaczarowany Solfeż's own "fragmenty utworów" exercise (the only
   * caller of this so far) passes this while recording, live, to show
   * which note of the fragment the player should be on right now. Drawn
   * in theme.colors.success (notehead, stem and flag) instead of the
   * usual ink — undefined (the default) draws every note the normal way.
   * Same idea as LessonIntroStaff's own highlightedIndex prop. */
  highlightedIndex?: number;
}

/** A free-form, growing multi-note staff — Szczyt Dyktand's melodic-
 * rhythmic dictation renders the player's answer-so-far here (and, after
 * a wrong check, the target phrase in a second read-only instance).
 * Unlike every other staff component in this app (one fixed note, or a
 * handful of fixed columns), the note count here is arbitrary and grows
 * one at a time as the player composes — see lib/melody/dictationLayout.ts
 * for why this needed its own geometry module instead of reusing
 * StaffNotation's or BeamedNotation's.
 *
 * The pitch picker lives ON this staff (see `pendingStep`/`onSelectStep`)
 * rather than on a separate board — real Pressables absolutely positioned
 * over the SVG at the exact spot the next note will land, same click-
 * target/a11y pattern as StaffPlacementBoard/PianoKeyboard, just following
 * a moving x position instead of a fixed column.
 *
 * Ported from the web app's MelodicDictationStaff.tsx. */
export function MelodicDictationStaff({
  notes,
  ariaLabel,
  keySignature,
  meter,
  pendingStep = null,
  onSelectStep,
  groups,
  onNoteClick,
  pendingGroupIndex = null,
  manualBarLines,
  disabled = false,
  locale = "pl",
  highlightedIndex,
}: MelodicDictationStaffProps) {
  const resolvedGroups = groups ?? deriveBeamGroups(notes.map((note) => note.value), meter);
  const manualBarLineSet = manualBarLines ? new Set(manualBarLines) : undefined;
  const inputNotes: DictationLayoutInputNote[] = notes;
  const layout = computeDictationLayout(inputNotes, meter, resolvedGroups, manualBarLineSet);
  const interactive = onSelectStep !== undefined;
  const viewWidth = interactive ? pendingViewWidth(inputNotes, meter, manualBarLineSet) : layout.viewWidth;
  const pixelWidth = (viewWidth / VIEW_HEIGHT) * PIXEL_HEIGHT;
  const pendingX = pendingNoteX(inputNotes, meter, manualBarLineSet);
  const ink = theme.colors.ink;
  // A manual bar line placed right after the LAST written note has no next
  // note yet to render computeDictationLayout's own barLines entry between
  // — draw it separately here, at the same midpoint-of-the-gap position a
  // real one would settle into once a next note eventually lands there.
  const pendingBarLineX =
    interactive && manualBarLineSet?.has(notes.length - 1) && layout.notes.length > 0
      ? (layout.notes[layout.notes.length - 1].x + pendingX) / 2
      : null;

  // Follows `highlightedIndex` (Zaczarowany Solfeż's own live "sing this
  // note" pointer) as it advances, for a fragment too wide to fit its
  // visible width all at once — without this, the player would have to
  // manually scroll while singing to keep the current note on screen.
  // `viewportWidth` (the ScrollView's own rendered width, captured via
  // onLayout — it isn't known ahead of time the way pixelWidth is, since
  // it depends on the surrounding layout, not this component's content)
  // is 0 until that first layout pass lands, which the effect below
  // guards against (nothing to scroll within yet).
  const scrollRef = useRef<ScrollView>(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  useEffect(() => {
    if (highlightedIndex === undefined || viewportWidth === 0) return;
    const target = layout.notes[highlightedIndex];
    if (!target) return;
    const targetPixelX = (target.x / viewWidth) * pixelWidth;
    // Keeps the current note roughly a third of the way across the
    // visible area rather than flush against the left edge, so there's
    // still some lookahead room to see the next couple of notes coming.
    const scrollX = Math.max(0, targetPixelX - viewportWidth * 0.35);
    scrollRef.current?.scrollTo({ x: scrollX, animated: true });
  }, [highlightedIndex, viewportWidth, viewWidth, pixelWidth, layout.notes]);

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ width: "100%", maxWidth: "100%" }}
      onLayout={(event) => setViewportWidth(event.nativeEvent.layout.width)}
    >
      <View style={{ width: pixelWidth, height: PIXEL_HEIGHT }}>
        <Svg viewBox={`0 0 ${viewWidth} ${VIEW_HEIGHT}`} width={pixelWidth} height={PIXEL_HEIGHT} accessibilityLabel={ariaLabel}>
          {STAFF_LINE_STEPS.map((lineStep) => (
            <Line key={lineStep} x1={6} x2={viewWidth - 6} y1={stepToY(lineStep)} y2={stepToY(lineStep)} stroke={ink} strokeWidth={1.5} />
          ))}

          <KeySignatureGlyphs fifths={keySignature} />
          <SvgText x={TIME_SIGNATURE_X} y={stepToY(6) + 8} fontSize={22} fontWeight="800" fill={ink} textAnchor="middle">
            {meter.split("/")[0]}
          </SvgText>
          <SvgText x={TIME_SIGNATURE_X} y={stepToY(2) + 8} fontSize={22} fontWeight="800" fill={ink} textAnchor="middle">
            {meter.split("/")[1]}
          </SvgText>

          {pendingBarLineX !== null && (
            <Line x1={pendingBarLineX} x2={pendingBarLineX} y1={stepToY(0)} y2={stepToY(8)} stroke={ink} strokeWidth={1.5} />
          )}

          {layout.barLines.map((barLine, index) => (
            <Line key={index} x1={barLine.x} x2={barLine.x} y1={stepToY(0)} y2={stepToY(8)} stroke={ink} strokeWidth={1.5} />
          ))}

          {layout.notes.map((note) => {
            const noteColor = note.index === highlightedIndex ? theme.colors.success : ink;
            return (
              <Fragment key={note.index}>
                {ledgerLineSteps(notes[note.index].step).map((ledgerStep) => (
                  <Line
                    key={ledgerStep}
                    x1={note.x - LEDGER_WIDTH / 2}
                    x2={note.x + LEDGER_WIDTH / 2}
                    y1={stepToY(ledgerStep)}
                    y2={stepToY(ledgerStep)}
                    stroke={noteColor}
                    strokeWidth={1.5}
                  />
                ))}

                {note.accidental !== 0 && !isAccidentalImpliedByKey(notes[note.index].step, note.accidental, keySignature) && (
                  <SvgText
                    x={note.x - NOTE_RADIUS - 12}
                    y={note.y + ACCIDENTAL_DY[note.accidental as -1 | 1]}
                    fontSize={ACCIDENTAL_FONT_SIZE[note.accidental as -1 | 1]}
                    fill={noteColor}
                    textAnchor="middle"
                  >
                    {ACCIDENTAL_SYMBOL[note.accidental as -1 | 1]}
                  </SvgText>
                )}

                <Ellipse
                  cx={note.x}
                  cy={note.y}
                  rx={NOTE_RADIUS}
                  ry={NOTE_RADIUS - 1}
                  fill={note.notehead === "black" ? noteColor : "none"}
                  stroke={noteColor}
                  strokeWidth={note.notehead === "black" ? 0 : 1.6}
                />

                {note.hasStem && (
                  <Line
                    x1={note.x + (note.stemDirection === "up" ? STEM_X_OFFSET : -STEM_X_OFFSET)}
                    x2={note.x + (note.stemDirection === "up" ? STEM_X_OFFSET : -STEM_X_OFFSET)}
                    y1={note.stemDirection === "up" ? note.y - 1 : note.y + 1}
                    y2={note.stemDirection === "up" ? note.y - STEM_HEIGHT : note.y + STEM_HEIGHT}
                    stroke={noteColor}
                    strokeWidth={1.8}
                  />
                )}
                {note.hasFlag && (
                  <Path
                    d={FLAG_PATH[note.stemDirection][note.hasFlag]}
                    fill={noteColor}
                    fillRule="nonzero"
                    transform={`translate(${note.x + (note.stemDirection === "up" ? STEM_X_OFFSET : -STEM_X_OFFSET)} ${
                      note.stemDirection === "up" ? note.y - STEM_HEIGHT : note.y + STEM_HEIGHT
                    }) scale(${GLYPH_SCALE} ${-GLYPH_SCALE})`}
                  />
                )}
                {note.hasDot && <Circle cx={note.x + DOT_X_OFFSET} cy={note.y} r={DOT_RADIUS} fill={noteColor} />}
              </Fragment>
            );
          })}

          {layout.primaryBeams.map((beam, index) => (
            <Line key={index} x1={beam.fromX} y1={beam.fromY} x2={beam.toX} y2={beam.toY} stroke={ink} strokeWidth={BEAM_THICKNESS} strokeLinecap="square" />
          ))}
          {layout.secondaryBeams.map((beam, index) => (
            <Line key={index} x1={beam.fromX} y1={beam.fromY} x2={beam.toX} y2={beam.toY} stroke={ink} strokeWidth={BEAM_THICKNESS} strokeLinecap="square" />
          ))}
          {layout.partialBeams.map((beam, index) => (
            <Line key={index} x1={beam.fromX} y1={beam.fromY} x2={beam.toX} y2={beam.toY} stroke={ink} strokeWidth={BEAM_THICKNESS} strokeLinecap="square" />
          ))}
        </Svg>

        {onNoteClick &&
          layout.notes.map((note) => {
            if (!BEAMABLE_VALUES.has(notes[note.index].value)) {
              return null;
            }
            const isPending = pendingGroupIndex === note.index;
            return (
              <Pressable
                key={note.index}
                onPress={() => onNoteClick(note.index)}
                accessibilityRole="button"
                accessibilityLabel={t("lesson.melodicRhythmicDictationSelectNoteForGrouping", locale, { n: note.index + 1 })}
                accessibilityState={{ selected: isPending }}
                style={{
                  position: "absolute",
                  left: `${(note.x / viewWidth) * 100}%`,
                  top: `${(note.y / VIEW_HEIGHT) * 100}%`,
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

        {interactive &&
          CLICKABLE_STEPS.map((step) => {
            const y = stepToY(step);
            const isSelected = pendingStep === step;
            const ordinal = describeLineOrSpaceOrdinal(step);
            const label = ordinal
              ? t(ordinal.kind === "line" ? "lesson.placeOnLine" : "lesson.placeOnSpace", locale, { n: ordinal.ordinal })
              : undefined;
            return (
              <Pressable
                key={step}
                disabled={disabled}
                onPress={() => onSelectStep?.(step)}
                accessibilityRole="button"
                accessibilityLabel={label}
                accessibilityState={{ disabled, selected: isSelected }}
                style={{
                  position: "absolute",
                  left: `${(pendingX / viewWidth) * 100}%`,
                  top: `${(y / VIEW_HEIGHT) * 100}%`,
                  width: `${((NOTE_SPACING * 0.8) / viewWidth) * 100}%`,
                  height: `${(STAFF_STEP_HEIGHT / VIEW_HEIGHT) * 100}%`,
                  transform: [{ translateX: -((NOTE_SPACING * 0.4) / viewWidth) * pixelWidth }, { translateY: -((STAFF_STEP_HEIGHT / VIEW_HEIGHT) * PIXEL_HEIGHT) / 2 }],
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isSelected && (
                  <View
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 7,
                      backgroundColor: theme.colors.primary,
                      shadowColor: theme.colors.primary,
                      shadowOpacity: 0.9,
                      shadowRadius: 8,
                      shadowOffset: { width: 0, height: 0 },
                    }}
                  />
                )}
              </Pressable>
            );
          })}
      </View>
    </ScrollView>
  );
}
