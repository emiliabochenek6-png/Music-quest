import { Pressable, View } from "react-native";
import Svg, { Ellipse, G, Line, Text as SvgText } from "react-native-svg";
import { ledgerLineSteps, describeStaffPosition } from "@/lib/music/staff";
import { parseScientific, type Accidental } from "@/lib/music/notes";
import { STAFF_LINE_STEPS, STEP_HEIGHT, VIEW_HEIGHT, VIEW_WIDTH, stepToY } from "@/lib/music/staffGeometry";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

interface ChordNoteAnswer {
  step: number | null;
  accidental: Accidental;
}

interface SeventhChordBuildStaffBoardProps {
  /** Scientific pitch — drawn fixed, non-interactive, on the left. Named
   * `bassNote` (not `rootNote`, unlike TriadBuildStaffBoard) since this
   * board only ever backs dominant-seventh-build-staff-choice, where the
   * fixed note is genuinely "whichever chord tone the target inversion
   * puts in the bass", never assumed to be the chord's own root. */
  bassNote: string;
  /** Every step any of the three columns can click, ascending — one
   * shared range spanning bass/col1/col2/col3 with padding (see
   * generate.ts's own paddedClickableSteps). */
  clickableSteps: number[];
  col1: ChordNoteAnswer;
  col2: ChordNoteAnswer;
  col3: ChordNoteAnswer;
  onSelectCol1Step: (step: number) => void;
  onSelectCol2Step: (step: number) => void;
  onSelectCol3Step: (step: number) => void;
  disabled: boolean;
  correctCol1?: ChordNoteAnswer | null;
  correctCol2?: ChordNoteAnswer | null;
  correctCol3?: ChordNoteAnswer | null;
}

const NOTE_RADIUS = 7;
const LEDGER_WIDTH = 24;
const BASS_X = VIEW_WIDTH * 0.13;
const COL1_X = VIEW_WIDTH * 0.38;
const COL2_X = VIEW_WIDTH * 0.63;
const COL3_X = VIEW_WIDTH * 0.88;
const EDGE_MARGIN = NOTE_RADIUS + 4;
/** Same symbol/sizing table as TriadBuildStaffBoard's own — see that
 * component's docstring for the tuning history. */
const ACCIDENTAL_SYMBOL: Record<Accidental, string> = { [-2]: "♭♭", [-1]: "♭", [0]: "", [1]: "♯", [2]: "x" };
const ACCIDENTAL_FONT_SIZE: Record<Accidental, number> = { [-2]: 22, [-1]: 22, [0]: 0, [1]: 27, [2]: 18 };
const ACCIDENTAL_LETTER_SPACING: Record<Accidental, number> = { [-2]: -15, [-1]: 0, [0]: 0, [1]: 0, [2]: 0 };
const ACCIDENTAL_DY: Record<Accidental, number> = { [-2]: 7, [-1]: 4, [0]: 0, [1]: 11, [2]: 7 };
const ACCIDENTAL_X_OFFSET: Record<Accidental, number> = { [-2]: -7, [-1]: 0, [0]: 0, [1]: 0, [2]: 0 };
const BOARD_WIDTH = 300;
const COLUMN_WIDTH_PERCENT = 20;
const HORIZONTAL_MARGIN = 40;

/** The four-note counterpart of TriadBuildStaffBoard — a dominant
 * seventh chord has one more tone than a triad, so this gets one more
 * clickable column (three instead of two) next to the same fixed-note-
 * on-the-left layout. Otherwise an exact structural copy: real
 * Pressables absolutely positioned over an Svg, each column reporting
 * only *which step* it landed on (the exercise component pairs that with
 * its own accidental picker). */
export function SeventhChordBuildStaffBoard({
  bassNote,
  clickableSteps,
  col1,
  col2,
  col3,
  onSelectCol1Step,
  onSelectCol2Step,
  onSelectCol3Step,
  disabled,
  correctCol1 = null,
  correctCol2 = null,
  correctCol3 = null,
}: SeventhChordBuildStaffBoardProps) {
  const bass = parseScientific(bassNote);
  const bassPosition = describeStaffPosition(bass);

  const allSteps = [...clickableSteps, bassPosition.step];
  const viewMinY = Math.min(0, ...allSteps.map((step) => stepToY(step) - EDGE_MARGIN));
  const viewMaxY = Math.max(VIEW_HEIGHT, ...allSteps.map((step) => stepToY(step) + EDGE_MARGIN));
  const totalHeight = viewMaxY - viewMinY;
  const viewMinX = -HORIZONTAL_MARGIN;
  const totalWidth = VIEW_WIDTH + HORIZONTAL_MARGIN * 2;
  const boardHeight = (totalHeight / totalWidth) * BOARD_WIDTH;

  const isCol1Correct = col1.step === correctCol1?.step && col1.accidental === correctCol1?.accidental;
  const isCol2Correct = col2.step === correctCol2?.step && col2.accidental === correctCol2?.accidental;
  const isCol3Correct = col3.step === correctCol3?.step && col3.accidental === correctCol3?.accidental;
  const bassLedgerSteps = ledgerLineSteps(bassPosition.step);
  const columnLedgerSteps = Array.from(new Set(clickableSteps.flatMap((step) => ledgerLineSteps(step))));

  function renderColumn(x: number, keyPrefix: string, selected: ChordNoteAnswer, correct: ChordNoteAnswer | null, isCorrect: boolean) {
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

  function renderColumnButtons(x: number, keyPrefix: string, onSelectStep: (step: number) => void, selectedStep: number | null) {
    return clickableSteps.map((step) => {
      const y = stepToY(step);
      return (
        <Pressable
          key={`${keyPrefix}-${step}`}
          disabled={disabled}
          onPress={() => onSelectStep(step)}
          accessibilityRole="button"
          accessibilityLabel={`Umieść dźwięk na pozycji ${step}`}
          accessibilityState={{ disabled, selected: selectedStep === step }}
          style={{
            position: "absolute",
            left: `${((x - viewMinX) / totalWidth) * 100 - COLUMN_WIDTH_PERCENT / 2}%`,
            width: `${COLUMN_WIDTH_PERCENT}%`,
            top: `${((y - viewMinY) / totalHeight) * 100}%`,
            height: `${(STEP_HEIGHT / totalHeight) * 100}%`,
            transform: [{ translateY: -((STEP_HEIGHT / totalHeight) * boardHeight) / 2 }],
          }}
        />
      );
    });
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

        {bassLedgerSteps.map((ledgerStep) => (
          <Line
            key={`bass-ledger-${ledgerStep}`}
            x1={BASS_X - LEDGER_WIDTH / 2}
            x2={BASS_X + LEDGER_WIDTH / 2}
            y1={stepToY(ledgerStep)}
            y2={stepToY(ledgerStep)}
            stroke={theme.colors.ink}
            strokeWidth={1.5}
          />
        ))}
        {bass.accidental !== 0 && (
          <SvgText
            x={BASS_X - NOTE_RADIUS - 10 + ACCIDENTAL_X_OFFSET[bass.accidental]}
            y={stepToY(bassPosition.step) + ACCIDENTAL_DY[bass.accidental]}
            fontSize={ACCIDENTAL_FONT_SIZE[bass.accidental]}
            letterSpacing={ACCIDENTAL_LETTER_SPACING[bass.accidental]}
            fill={theme.colors.ink}
            textAnchor="middle"
          >
            {ACCIDENTAL_SYMBOL[bass.accidental]}
          </SvgText>
        )}
        <Ellipse cx={BASS_X} cy={stepToY(bassPosition.step)} rx={NOTE_RADIUS} ry={NOTE_RADIUS - 1} fill={theme.colors.ink} />

        {renderColumn(COL1_X, "col1", col1, correctCol1, isCol1Correct)}
        {renderColumn(COL2_X, "col2", col2, correctCol2, isCol2Correct)}
        {renderColumn(COL3_X, "col3", col3, correctCol3, isCol3Correct)}
      </Svg>

      {renderColumnButtons(COL1_X, "col1", onSelectCol1Step, col1.step)}
      {renderColumnButtons(COL2_X, "col2", onSelectCol2Step, col2.step)}
      {renderColumnButtons(COL3_X, "col3", onSelectCol3Step, col3.step)}
    </View>
  );
}
