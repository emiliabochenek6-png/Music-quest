import Svg, { Ellipse, G, Line, Text as SvgText } from "react-native-svg";
import { View } from "react-native";
import { describeStaffPosition, ledgerLineSteps } from "@/lib/music/staff";
import { parseScientific } from "@/lib/music/notes";
import { STAFF_LINE_STEPS, VIEW_HEIGHT, VIEW_WIDTH, stepToY } from "@/lib/music/staffGeometry";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

interface IntervalStaffNotationProps {
  /** The two notes to compare, in the order they're presented — drawn
   * left-to-right in that order (not re-sorted by pitch). */
  notes: [string, string];
  width?: number;
}

const NOTE_RADIUS = 7;
const LEDGER_WIDTH = 26;
const NOTE_X = [VIEW_WIDTH * 0.35, VIEW_WIDTH * 0.65];
const ACCIDENTAL_SYMBOL: Record<-1 | 1, string> = { [-1]: "♭", [1]: "♯" };
const EDGE_MARGIN = NOTE_RADIUS + 4;

/** Two noteheads on one treble staff — ported from the web app's
 * IntervalStaffNotation.tsx (same expanding-viewBox math for notes far off
 * the 5-line staff). Read-only, no interaction. */
export function IntervalStaffNotation({ notes, width = 160 }: IntervalStaffNotationProps) {
  const parsedNotes = notes.map((note) => parseScientific(note));
  const positions = parsedNotes.map((note) => describeStaffPosition(note));

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
                x1={NOTE_X[index] - LEDGER_WIDTH / 2}
                x2={NOTE_X[index] + LEDGER_WIDTH / 2}
                y1={stepToY(ledgerStep)}
                y2={stepToY(ledgerStep)}
                stroke={theme.colors.ink}
                strokeWidth={1.5}
              />
            ))}
            {parsedNotes[index].accidental !== 0 && (
              <SvgText
                x={NOTE_X[index] - NOTE_RADIUS - 10}
                y={stepToY(position.step) + 6}
                fontSize={18}
                fill={theme.colors.ink}
                textAnchor="middle"
              >
                {ACCIDENTAL_SYMBOL[parsedNotes[index].accidental as -1 | 1]}
              </SvgText>
            )}
            <Ellipse
              cx={NOTE_X[index]}
              cy={stepToY(position.step)}
              rx={NOTE_RADIUS}
              ry={NOTE_RADIUS - 1}
              fill={theme.colors.ink}
            />
          </G>
        ))}
      </Svg>
    </View>
  );
}
