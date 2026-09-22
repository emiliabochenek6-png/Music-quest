import { Pressable, View } from "react-native";
import Svg, { Ellipse, G, Line, Text as SvgText } from "react-native-svg";
import { ledgerLineSteps, describeStaffPosition } from "@/lib/music/staff";
import { parseScientific, type Accidental } from "@/lib/music/notes";
import { STAFF_LINE_STEPS, STEP_HEIGHT, VIEW_HEIGHT, VIEW_WIDTH, stepToY } from "@/lib/music/staffGeometry";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

interface IntervalBuildStaffBoardProps {
  /** Scientific pitch — drawn fixed, non-interactive, on the left. */
  rootNote: string;
  /** Every step the player can click, ascending. */
  clickableSteps: number[];
  selectedStep: number | null;
  selectedAccidental: Accidental;
  onSelectStep: (step: number) => void;
  disabled: boolean;
  /** Revealed once `disabled` (post-check), so the right spot lights up. */
  correctStep?: number | null;
  correctAccidental?: Accidental | null;
}

const NOTE_RADIUS = 7;
const LEDGER_WIDTH = 26;
const ROOT_X = VIEW_WIDTH * 0.3;
const TARGET_X = VIEW_WIDTH * 0.7;
const EDGE_MARGIN = NOTE_RADIUS + 4;
const ACCIDENTAL_SYMBOL: Record<Accidental, string> = { [-2]: "♭♭", [-1]: "♭", [0]: "", [1]: "♯", [2]: "x" };
// Font size / dy reuse TriadStaffNotation's own single-accidental values
// (±1) — same NOTE_RADIUS, same staffGeometry, already tuned against this
// app's own react-native-svg text renderer. The ±2 values (double flat/
// sharp) are new to this app (only Fabryka Budowania's level 8 needs
// them) and are a first-pass estimate from that same tuning. ACCIDENTAL_DY
// nudged down slightly per live feedback on level 4 (both flats and
// sharps sat a touch too high); the double sharp "x" is a plain Latin
// glyph, not one of the special musical symbols, so unlike ♭/♯ its
// visual CENTER (not baseline) needs to land on the note's own y —
// nudged back up per live feedback to actually achieve that (an "x" on a
// line should have its center on that line, not sitting below it).
const ACCIDENTAL_FONT_SIZE: Record<Accidental, number> = { [-2]: 22, [-1]: 22, [0]: 0, [1]: 27, [2]: 18 };
const ACCIDENTAL_LETTER_SPACING: Record<Accidental, number> = { [-2]: -15, [-1]: 0, [0]: 0, [1]: 0, [2]: 0 };
// [-1]/[1] (plain flat/sharp) nudged up again per a later round of live
// feedback (Fabryka Budowania) — they still sat a bit low relative to
// the note/line they mark.
const ACCIDENTAL_DY: Record<Accidental, number> = { [-2]: 7, [-1]: 4, [0]: 0, [1]: 8, [2]: 5 };
const ACCIDENTAL_X_OFFSET: Record<Accidental, number> = { [-2]: -7, [-1]: 0, [0]: 0, [1]: 0, [2]: 0 };
const BOARD_WIDTH = 220;
/** Extra room on both sides of the 0-VIEW_WIDTH viewBox so every note and
 * its accidental stays fully visible — root's own accidental in particular
 * sits close to the left edge (ROOT_X is only 30% in) and would otherwise
 * clip. */
const HORIZONTAL_MARGIN = 40;

/** Half of "Fabryka Budowania" levels 4-8/11's construction interaction:
 * the root is drawn fixed on the left; the right side is a clickable
 * staff column (real Pressables absolutely positioned over an Svg, the
 * same pattern as StaffPlacementBoard) spanning `clickableSteps`,
 * including ledger lines above/below the 5-line staff where needed. A
 * step alone doesn't fix a pitch (accidentals don't move a notehead), so
 * this only ever reports *which step* was clicked — the exercise
 * component combines that with a separate accidental picker into the
 * full answer. Ported from the web app's IntervalBuildStaffBoard.tsx. */
export function IntervalBuildStaffBoard({
  rootNote,
  clickableSteps,
  selectedStep,
  selectedAccidental,
  onSelectStep,
  disabled,
  correctStep = null,
  correctAccidental = null,
}: IntervalBuildStaffBoardProps) {
  const root = parseScientific(rootNote);
  const rootPosition = describeStaffPosition(root);

  const allSteps = [...clickableSteps, rootPosition.step];
  const viewMinY = Math.min(0, ...allSteps.map((step) => stepToY(step) - EDGE_MARGIN));
  const viewMaxY = Math.max(VIEW_HEIGHT, ...allSteps.map((step) => stepToY(step) + EDGE_MARGIN));
  const totalHeight = viewMaxY - viewMinY;
  const viewMinX = -HORIZONTAL_MARGIN;
  const totalWidth = VIEW_WIDTH + HORIZONTAL_MARGIN * 2;
  const boardHeight = (totalHeight / totalWidth) * BOARD_WIDTH;

  const isAnswerCorrect = selectedStep === correctStep && selectedAccidental === correctAccidental;
  const rootLedgerSteps = ledgerLineSteps(rootPosition.step);
  const targetLedgerSteps = Array.from(new Set(clickableSteps.flatMap((step) => ledgerLineSteps(step))));

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

        {targetLedgerSteps.map((ledgerStep) => (
          <Line
            key={`target-ledger-${ledgerStep}`}
            x1={TARGET_X - LEDGER_WIDTH / 2}
            x2={TARGET_X + LEDGER_WIDTH / 2}
            y1={stepToY(ledgerStep)}
            y2={stepToY(ledgerStep)}
            stroke={theme.colors.ink}
            strokeWidth={1.5}
          />
        ))}

        {disabled && correctStep !== null && !isAnswerCorrect && (
          <G>
            {correctAccidental !== 0 && correctAccidental != null && (
              <SvgText
                x={TARGET_X - NOTE_RADIUS - 10 + ACCIDENTAL_X_OFFSET[correctAccidental]}
                y={stepToY(correctStep) + ACCIDENTAL_DY[correctAccidental]}
                fontSize={ACCIDENTAL_FONT_SIZE[correctAccidental]}
                letterSpacing={ACCIDENTAL_LETTER_SPACING[correctAccidental]}
                fill={theme.colors.success}
                textAnchor="middle"
              >
                {ACCIDENTAL_SYMBOL[correctAccidental]}
              </SvgText>
            )}
            <Ellipse cx={TARGET_X} cy={stepToY(correctStep)} rx={NOTE_RADIUS} ry={NOTE_RADIUS - 1} fill={theme.colors.success} />
          </G>
        )}

        {selectedStep !== null && (
          <G>
            {selectedAccidental !== 0 && (
              <SvgText
                x={TARGET_X - NOTE_RADIUS - 10 + ACCIDENTAL_X_OFFSET[selectedAccidental]}
                y={stepToY(selectedStep) + ACCIDENTAL_DY[selectedAccidental]}
                fontSize={ACCIDENTAL_FONT_SIZE[selectedAccidental]}
                letterSpacing={ACCIDENTAL_LETTER_SPACING[selectedAccidental]}
                fill={disabled ? (isAnswerCorrect ? theme.colors.success : theme.colors.warning) : theme.colors.ink}
                textAnchor="middle"
              >
                {ACCIDENTAL_SYMBOL[selectedAccidental]}
              </SvgText>
            )}
            <Ellipse
              cx={TARGET_X}
              cy={stepToY(selectedStep)}
              rx={NOTE_RADIUS}
              ry={NOTE_RADIUS - 1}
              fill={disabled ? (isAnswerCorrect ? theme.colors.success : theme.colors.warning) : theme.colors.ink}
            />
          </G>
        )}
      </Svg>

      {clickableSteps.map((step) => {
        const y = stepToY(step);
        return (
          <Pressable
            key={step}
            disabled={disabled}
            onPress={() => onSelectStep(step)}
            accessibilityRole="button"
            accessibilityLabel={`Umieść nutę na pozycji ${step}`}
            accessibilityState={{ disabled, selected: selectedStep === step }}
            style={{
              position: "absolute",
              left: `${((TARGET_X - viewMinX) / totalWidth) * 100 - 15}%`,
              width: "30%",
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
