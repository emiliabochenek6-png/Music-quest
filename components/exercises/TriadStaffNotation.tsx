import Svg, { Ellipse, G, Line, Text as SvgText } from "react-native-svg";
import { View } from "react-native";
import { describeStaffPosition, ledgerLineSteps } from "@/lib/music/staff";
import { parseScientific } from "@/lib/music/notes";
import { STAFF_LINE_STEPS, VIEW_HEIGHT, VIEW_WIDTH, stepToY } from "@/lib/music/staffGeometry";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

interface TriadStaffNotationProps {
  /** Bottom to top — a triad's three stacked thirds (root/third/fifth) or,
   * since Cytadela Dominant, a dominant seventh chord's four
   * (root/third/fifth/seventh); unlike IntervalStaffNotation's two side-
   * by-side notes, every note here shares one X position, like a real
   * chord. Any length works — nothing below depends on exactly 3. */
  notes: readonly string[];
  width?: number;
  /** Optional scale-degree label (1/3/5, or 1/3/5/7 for a seventh chord)
   * drawn to the right of each notehead, in the same bottom-to-top order
   * as `notes` — Jaskinia Akordów's and Cytadela Dominant's intro slides
   * use this so an inversion's reordering is visible right on the staff,
   * not just named in the caption below it. */
  degreeLabels?: readonly number[];
}

const NOTE_RADIUS = 7;
const LEDGER_WIDTH = 26;
const NOTE_X_FRACTION = 0.55;
const ACCIDENTAL_SYMBOL: Record<-1 | 1, string> = { [-1]: "♭", [1]: "♯" };
/** The flat glyph reads smaller than the sharp at the same font size (its
 * bowl doesn't fill the em box the way the sharp's crossed lines do), so
 * it gets a bit more size to look visually equal on the staff. */
const ACCIDENTAL_FONT_SIZE: Record<-1 | 1, number> = { [-1]: 22, [1]: 27 };
/** Vertical nudge from the note's own y (an SVG <Text> element positions
 * by baseline, not visual center) so the glyph's visual center — not its
 * baseline — lands on the note: on a line, that puts the glyph's center
 * exactly on the line. The sharp needs a noticeably bigger nudge than the
 * flat: it's not just the larger font size (27 vs 22) — a ♯'s crossed
 * lines fill its em box top-to-bottom, so its baseline sits much further
 * below its own visual center than a ♭'s bowl-shaped glyph does. Using
 * one shared offset for both (as an earlier version of this file did)
 * left the sharp sitting visibly too high, off its target line. */
const ACCIDENTAL_DY: Record<-1 | 1, number> = { [-1]: 7, [1]: 9 };
const EDGE_MARGIN = NOTE_RADIUS + 4;

/** A chord's notes stacked on one treble staff, as it would really be
 * written — "Zatoka Trójdźwięków"'s theory-intro visual for
 * durowy/molowy/zmniejszony/zwiększony, the staff shown by triad-fact-
 * choice/triad-quality-choice/triad-role-choice/triad-inversion-choice,
 * and (widened from exactly 3 notes to any length for) "Cytadela
 * Dominant"'s dominant-seventh-inversion-choice. Ported from the web
 * app's TriadStaffNotation.tsx (same expanding-viewBox math as
 * IntervalStaffNotation for notes far off the 5-line staff). Read-only,
 * no interaction. Stacked thirds are always at least two staff steps
 * apart (a third skips a letter), so — unlike a chord containing a
 * second — no note ever needs a horizontal offset to stay legible; every
 * note sits at the same X. */
const DEGREE_LABEL_FONT_SIZE = 12;
const DEGREE_LABEL_X_GAP = 6;

export function TriadStaffNotation({ notes, width = 130, degreeLabels }: TriadStaffNotationProps) {
  const parsedNotes = notes.map((note) => parseScientific(note));
  const positions = parsedNotes.map((note) => describeStaffPosition(note));
  const noteX = VIEW_WIDTH * NOTE_X_FRACTION;

  const noteCenterYs = positions.map((position) => stepToY(position.step));
  const viewMinY = Math.min(0, ...noteCenterYs.map((y) => y - EDGE_MARGIN));
  const viewMaxY = Math.max(VIEW_HEIGHT, ...noteCenterYs.map((y) => y + EDGE_MARGIN));
  const viewHeight = viewMaxY - viewMinY;
  const height = (width / VIEW_WIDTH) * viewHeight;

  return (
    <View style={{ width, height }}>
      <Svg viewBox={`0 ${viewMinY} ${VIEW_WIDTH} ${viewHeight}`} width={width} height={height}>
        {STAFF_LINE_STEPS.map((lineStep) => (
          <Line
            key={lineStep}
            x1={10}
            x2={VIEW_WIDTH - 10}
            y1={stepToY(lineStep)}
            y2={stepToY(lineStep)}
            stroke={theme.colors.ink}
            strokeWidth={1.5}
          />
        ))}

        {positions.map((position, index) => (
          <G key={index}>
            {ledgerLineSteps(position.step).map((ledgerStep) => (
              <Line
                key={ledgerStep}
                x1={noteX - LEDGER_WIDTH / 2}
                x2={noteX + LEDGER_WIDTH / 2}
                y1={stepToY(ledgerStep)}
                y2={stepToY(ledgerStep)}
                stroke={theme.colors.ink}
                strokeWidth={1.5}
              />
            ))}
            {parsedNotes[index].accidental !== 0 && (
              <SvgText
                // Stacked thirds put adjacent accidentals only a couple
                // staff steps apart vertically — close enough for two
                // flat/sharp glyphs to visually collide. Push this one
                // further left only when the note directly below it ALSO
                // has an accidental (the only case close enough to
                // actually overlap).
                x={noteX - NOTE_RADIUS - 10 - (index > 0 && parsedNotes[index - 1].accidental !== 0 ? 14 : 0)}
                y={stepToY(position.step) + ACCIDENTAL_DY[parsedNotes[index].accidental as -1 | 1]}
                fontSize={ACCIDENTAL_FONT_SIZE[parsedNotes[index].accidental as -1 | 1]}
                fill={theme.colors.ink}
                textAnchor="middle"
              >
                {ACCIDENTAL_SYMBOL[parsedNotes[index].accidental as -1 | 1]}
              </SvgText>
            )}
            <Ellipse cx={noteX} cy={stepToY(position.step)} rx={NOTE_RADIUS} ry={NOTE_RADIUS - 1} fill={theme.colors.ink} />
            {degreeLabels && (
              <SvgText
                x={noteX + NOTE_RADIUS + DEGREE_LABEL_X_GAP}
                y={stepToY(position.step) + DEGREE_LABEL_FONT_SIZE / 3}
                fontSize={DEGREE_LABEL_FONT_SIZE}
                fontWeight="700"
                fill={theme.colors.primary}
                textAnchor="start"
              >
                {degreeLabels[index]}
              </SvgText>
            )}
          </G>
        ))}
      </Svg>
    </View>
  );
}
