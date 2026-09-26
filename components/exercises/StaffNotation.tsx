import Svg, { Ellipse, Line, Text as SvgText } from "react-native-svg";
import { View } from "react-native";
import { describeStaffPosition, ledgerLineSteps, type Clef } from "@/lib/music/staff";
import { parseScientific } from "@/lib/music/notes";
import { STAFF_LINE_STEPS, VIEW_HEIGHT, VIEW_WIDTH, stepToY } from "@/lib/music/staffGeometry";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

interface StaffNotationProps {
  /** Scientific pitch, e.g. "C4" or "F#4". */
  note: string;
  clef?: Clef;
  /** Rendered pixel width — height follows VIEW_HEIGHT/VIEW_WIDTH's own
   * aspect ratio, same "one aspect ratio, caller picks the size" contract
   * MelodicDictationStaff already uses elsewhere in this app. */
  width?: number;
}

const NOTE_RADIUS = 7;
const LEDGER_WIDTH = 26;
const ACCIDENTAL_SYMBOL: Record<-1 | 1, string> = { [-1]: "♭", [1]: "♯" };
const EDGE_MARGIN = NOTE_RADIUS + 4;

/** A single note rendered on a 5-line staff (treble or bass clef), including
 * ledger lines (e.g. middle C) and a ♯/♭ accidental symbol when the note has
 * one — ported from the web app's StaffNotation.tsx (same SVG geometry, same
 * shared lib/music/staffGeometry constants), swapped to react-native-svg
 * primitives. Read-only — no interaction.
 *
 * The viewBox expands to fit the note itself (same trick
 * IntervalStaffNotation's own doc describes) rather than staying pinned to
 * VIEW_HEIGHT's own fixed 0-150 — content far below/above the staff (e.g. a
 * bass-clef note several ledger lines under the bottom line) would
 * otherwise render past the SVG's own edge and simply not appear, which
 * reads to a player as "the note is missing", not "scroll to see it". */
export function StaffNotation({ note, clef = "treble", width = 120 }: StaffNotationProps) {
  const parsed = parseScientific(note);
  const { step } = describeStaffPosition(parsed, clef);
  const noteX = VIEW_WIDTH / 2;
  const noteY = stepToY(step);
  const viewMinY = Math.min(0, noteY - EDGE_MARGIN);
  const viewMaxY = Math.max(VIEW_HEIGHT, noteY + EDGE_MARGIN);
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

        {ledgerLineSteps(step).map((ledgerStep) => (
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

        {parsed.accidental !== 0 && (
          <SvgText
            x={noteX - NOTE_RADIUS - 12}
            y={noteY + 9}
            fontSize={20}
            fill={theme.colors.ink}
            textAnchor="middle"
          >
            {ACCIDENTAL_SYMBOL[parsed.accidental as -1 | 1]}
          </SvgText>
        )}

        <Ellipse cx={noteX} cy={noteY} rx={NOTE_RADIUS} ry={NOTE_RADIUS - 1} fill={theme.colors.ink} />
      </Svg>
    </View>
  );
}
