import { Pressable, View } from "react-native";
import Svg, { Ellipse, G, Line, Text as SvgText } from "react-native-svg";
import { ledgerLineSteps, describeStaffPosition } from "@/lib/music/staff";
import { parseScientific, type Accidental } from "@/lib/music/notes";
import { STAFF_LINE_STEPS, STEP_HEIGHT, VIEW_HEIGHT, VIEW_WIDTH, stepToY } from "@/lib/music/staffGeometry";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

interface TriadNoteAnswer {
  step: number | null;
  accidental: Accidental;
}

interface TriadBuildStaffBoardProps {
  /** Scientific pitch — drawn fixed, non-interactive, on the left. */
  rootNote: string;
  /** Every step either column can click, ascending — one shared range
   * spanning root/third/fifth with padding (see generate.ts). */
  clickableSteps: number[];
  third: TriadNoteAnswer;
  fifth: TriadNoteAnswer;
  onSelectThirdStep: (step: number) => void;
  onSelectFifthStep: (step: number) => void;
  disabled: boolean;
  /** Revealed once `disabled` (post-check), so the right spot lights up on
   * whichever column got it wrong. */
  correctThird?: TriadNoteAnswer | null;
  correctFifth?: TriadNoteAnswer | null;
}

const NOTE_RADIUS = 7;
const LEDGER_WIDTH = 24;
const ROOT_X = VIEW_WIDTH * 0.18;
const THIRD_X = VIEW_WIDTH * 0.52;
const FIFTH_X = VIEW_WIDTH * 0.86;
const EDGE_MARGIN = NOTE_RADIUS + 4;
/** Same symbols/sizing reasoning as IntervalBuildStaffBoard's own — see
 * that component's docstring. ACCIDENTAL_DY nudged down slightly per live
 * feedback on level 9 (both flats and sharps sat a touch too high), same
 * -1/1 values that component's own level-4 feedback already landed on. */
const ACCIDENTAL_SYMBOL: Record<Accidental, string> = { [-2]: "♭♭", [-1]: "♭", [0]: "", [1]: "♯", [2]: "x" };
const ACCIDENTAL_FONT_SIZE: Record<Accidental, number> = { [-2]: 22, [-1]: 22, [0]: 0, [1]: 27, [2]: 18 };
const ACCIDENTAL_LETTER_SPACING: Record<Accidental, number> = { [-2]: -15, [-1]: 0, [0]: 0, [1]: 0, [2]: 0 };
const ACCIDENTAL_DY: Record<Accidental, number> = { [-2]: 7, [-1]: 7, [0]: 0, [1]: 11, [2]: 7 };
const ACCIDENTAL_X_OFFSET: Record<Accidental, number> = { [-2]: -7, [-1]: 0, [0]: 0, [1]: 0, [2]: 0 };
const BOARD_WIDTH = 280;
const COLUMN_WIDTH_PERCENT = 26;
const HORIZONTAL_MARGIN = 40;

/** The staff-notation counterpart of a keyboard triad builder — the root
 * is drawn fixed on the left, and the third/fifth each get their own
 * clickable staff column (real Pressables absolutely positioned over an
 * Svg, same pattern as IntervalBuildStaffBoard, just duplicated into two
 * columns since a triad has two notes to place, not one). A step alone
 * doesn't fix a pitch, so each column only ever reports *which step* was
 * clicked — the exercise component combines that with its own accidental
 * picker per column into the full answer. Ported from the web app's
 * TriadBuildStaffBoard.tsx. */
export function TriadBuildStaffBoard({
  rootNote,
  clickableSteps,
  third,
  fifth,
  onSelectThirdStep,
  onSelectFifthStep,
  disabled,
  correctThird = null,
  correctFifth = null,
}: TriadBuildStaffBoardProps) {
  const root = parseScientific(rootNote);
  const rootPosition = describeStaffPosition(root);

  const allSteps = [...clickableSteps, rootPosition.step];
  const viewMinY = Math.min(0, ...allSteps.map((step) => stepToY(step) - EDGE_MARGIN));
  const viewMaxY = Math.max(VIEW_HEIGHT, ...allSteps.map((step) => stepToY(step) + EDGE_MARGIN));
  const totalHeight = viewMaxY - viewMinY;
  const viewMinX = -HORIZONTAL_MARGIN;
  const totalWidth = VIEW_WIDTH + HORIZONTAL_MARGIN * 2;
  const boardHeight = (totalHeight / totalWidth) * BOARD_WIDTH;

  const isThirdCorrect = third.step === correctThird?.step && third.accidental === correctThird?.accidental;
  const isFifthCorrect = fifth.step === correctFifth?.step && fifth.accidental === correctFifth?.accidental;
  const rootLedgerSteps = ledgerLineSteps(rootPosition.step);
  const columnLedgerSteps = Array.from(new Set(clickableSteps.flatMap((step) => ledgerLineSteps(step))));

  function renderColumn(x: number, keyPrefix: string, selected: TriadNoteAnswer, correct: TriadNoteAnswer | null, isCorrect: boolean) {
    return (
      <G key={keyPrefix}>
        {columnLedgerSteps.map((ledgerStep) => (
          <Line
            key={`${keyPrefix}-ledger-${ledgerStep}`}
            x1={x - LEDGER_WIDTH / 2}
            x2={x + LEDGER_WIDTH / 2}
            y1={stepToY(ledgerStep)}
            y2={stepToY(ledgerStep)}
            stroke={theme.colors.ink}
            strokeWidth={1.5}
          />
        ))}

        {disabled && correct?.step != null && !isCorrect && (
          <G>
            {correct.accidental !== 0 && (
              <SvgText
                x={x - NOTE_RADIUS - 10 + ACCIDENTAL_X_OFFSET[correct.accidental]}
                y={stepToY(correct.step) + ACCIDENTAL_DY[correct.accidental]}
                fontSize={ACCIDENTAL_FONT_SIZE[correct.accidental]}
                letterSpacing={ACCIDENTAL_LETTER_SPACING[correct.accidental]}
                fill={theme.colors.success}
                textAnchor="middle"
              >
                {ACCIDENTAL_SYMBOL[correct.accidental]}
              </SvgText>
            )}
            <Ellipse cx={x} cy={stepToY(correct.step)} rx={NOTE_RADIUS} ry={NOTE_RADIUS - 1} fill={theme.colors.success} />
          </G>
        )}

        {selected.step !== null && (
          <G>
            {selected.accidental !== 0 && (
              <SvgText
                x={x - NOTE_RADIUS - 10 + ACCIDENTAL_X_OFFSET[selected.accidental]}
                y={stepToY(selected.step) + ACCIDENTAL_DY[selected.accidental]}
                fontSize={ACCIDENTAL_FONT_SIZE[selected.accidental]}
                letterSpacing={ACCIDENTAL_LETTER_SPACING[selected.accidental]}
                fill={disabled ? (isCorrect ? theme.colors.success : theme.colors.warning) : theme.colors.ink}
                textAnchor="middle"
              >
                {ACCIDENTAL_SYMBOL[selected.accidental]}
              </SvgText>
            )}
            <Ellipse
              cx={x}
              cy={stepToY(selected.step)}
              rx={NOTE_RADIUS}
              ry={NOTE_RADIUS - 1}
              fill={disabled ? (isCorrect ? theme.colors.success : theme.colors.warning) : theme.colors.ink}
            />
          </G>
        )}
      </G>
    );
  }

  return (
    <View style={{ width: BOARD_WIDTH, height: boardHeight, alignSelf: "center" }}>
      <Svg viewBox={`${viewMinX} ${viewMinY} ${totalWidth} ${totalHeight}`} width={BOARD_WIDTH} height={boardHeight} style={{ position: "absolute" }}>
        {STAFF_LINE_STEPS.map((step) => (
          <Line
            key={step}
            x1={10 - HORIZONTAL_MARGIN}
            x2={VIEW_WIDTH - 10 + HORIZONTAL_MARGIN}
            y1={stepToY(step)}
            y2={stepToY(step)}
            stroke={theme.colors.ink}
            strokeWidth={1.5}
          />
        ))}

        {rootLedgerSteps.map((ledgerStep) => (
          <Line
            key={`root-ledger-${ledgerStep}`}
            x1={ROOT_X - LEDGER_WIDTH / 2}
            x2={ROOT_X + LEDGER_WIDTH / 2}
            y1={stepToY(ledgerStep)}
            y2={stepToY(ledgerStep)}
            stroke={theme.colors.ink}
            strokeWidth={1.5}
          />
        ))}
        {root.accidental !== 0 && (
          <SvgText
            x={ROOT_X - NOTE_RADIUS - 10 + ACCIDENTAL_X_OFFSET[root.accidental]}
            y={stepToY(rootPosition.step) + ACCIDENTAL_DY[root.accidental]}
            fontSize={ACCIDENTAL_FONT_SIZE[root.accidental]}
            letterSpacing={ACCIDENTAL_LETTER_SPACING[root.accidental]}
            fill={theme.colors.ink}
            textAnchor="middle"
          >
            {ACCIDENTAL_SYMBOL[root.accidental]}
          </SvgText>
        )}
        <Ellipse cx={ROOT_X} cy={stepToY(rootPosition.step)} rx={NOTE_RADIUS} ry={NOTE_RADIUS - 1} fill={theme.colors.ink} />

        {renderColumn(THIRD_X, "third", third, correctThird, isThirdCorrect)}
        {renderColumn(FIFTH_X, "fifth", fifth, correctFifth, isFifthCorrect)}
      </Svg>

      {clickableSteps.map((step) => {
        const y = stepToY(step);
        return (
          <Pressable
            key={`third-${step}`}
            disabled={disabled}
            onPress={() => onSelectThirdStep(step)}
            accessibilityRole="button"
            accessibilityLabel={`Umieść tercję na pozycji ${step}`}
            accessibilityState={{ disabled, selected: third.step === step }}
            style={{
              position: "absolute",
              left: `${((THIRD_X - viewMinX) / totalWidth) * 100 - COLUMN_WIDTH_PERCENT / 2}%`,
              width: `${COLUMN_WIDTH_PERCENT}%`,
              top: `${((y - viewMinY) / totalHeight) * 100}%`,
              height: `${(STEP_HEIGHT / totalHeight) * 100}%`,
              transform: [{ translateY: -((STEP_HEIGHT / totalHeight) * boardHeight) / 2 }],
            }}
          />
        );
      })}
      {clickableSteps.map((step) => {
        const y = stepToY(step);
        return (
          <Pressable
            key={`fifth-${step}`}
            disabled={disabled}
            onPress={() => onSelectFifthStep(step)}
            accessibilityRole="button"
            accessibilityLabel={`Umieść kwintę na pozycji ${step}`}
            accessibilityState={{ disabled, selected: fifth.step === step }}
            style={{
              position: "absolute",
              left: `${((FIFTH_X - viewMinX) / totalWidth) * 100 - COLUMN_WIDTH_PERCENT / 2}%`,
              width: `${COLUMN_WIDTH_PERCENT}%`,
              top: `${((y - viewMinY) / totalHeight) * 100}%`,
              height: `${(STEP_HEIGHT / totalHeight) * 100}%`,
              transform: [{ translateY: -((STEP_HEIGHT / totalHeight) * boardHeight) / 2 }],
            }}
          />
        );
      })}
    </View>
  );
}
