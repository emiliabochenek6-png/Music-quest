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

/** A single note rendered on a 5-line staff (treble or bass clef), including
 * ledger lines (e.g. middle C) and a ♯/♭ accidental symbol when the note has
 * one — ported from the web app's StaffNotation.tsx (same SVG geometry, same
 * shared lib/music/staffGeometry constants), swapped to react-native-svg
 * primitives. Read-only — no interaction. */
export function StaffNotation({ note, clef = "treble", width = 120 }: StaffNotationProps) {
  const parsed = parseScientific(note);
  const { step } = describeStaffPosition(parsed, clef);
  const noteX = VIEW_WIDTH / 2;
  const noteY = stepToY(step);
  const height = (width / VIEW_WIDTH) * VIEW_HEIGHT;

  return (
    <View style={{ width, height }}>
      <Svg viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`} width={width} height={height}>
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
            y={noteY + 6}
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
