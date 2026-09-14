import { ScrollView, View } from "react-native";
import Svg, { G, Rect, Text as SvgText } from "react-native-svg";
import { areEnharmonicallyEqual, enumerateChromaticRange, formatScientific, parseScientific, type Note } from "@/lib/music/notes";
import { playNote } from "@/lib/audio/player";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

interface PianoKeyboardProps {
  range: { from: string; to: string };
  onSelect: (note: string) => void;
  disabled?: boolean;
  selectedNote?: string | null;
  /** Revealed after the answer is checked, to highlight the right key. */
  correctNote?: string | null;
  /** A second, lighter highlight — the root note, ringed throughout the
   * exercise as a counting anchor. */
  secondaryNote?: string | null;
  /** Caption drawn near the bottom of each key — return null/undefined to
   * leave a given key unlabeled. Zaczarowany Solfeż's own
   * PianoKeyboardRecap uses this for do/re/mi/... syllables (and skips
   * accidentals: this app's solfège naming is natural-notes-only, see
   * lib/music/solfege.ts's own doc, so there's no correct syllable to put
   * on a black key here). Every other PianoKeyboard caller (Fabryka
   * Budowania's own interval-build answer board) omits this — unlabeled
   * keys, same as before this prop existed. */
  labelFor?: (note: Note) => string | null | undefined;
}

const WHITE_KEY_WIDTH = 40;
const WHITE_KEY_HEIGHT = 140;
const BLACK_KEY_WIDTH = 24;
const BLACK_KEY_HEIGHT = 88;

const WHITE_FILL = "#ffffff";
const WHITE_STROKE = "rgba(0,0,0,0.25)";
const BLACK_FILL = "#18181b";
const CORRECT_WHITE_FILL = "#a7f3d0";
const CORRECT_BLACK_FILL = "#059669";
const SECONDARY_WHITE_FILL = "#a7f3d0";
const SECONDARY_BLACK_FILL = "#6ee7b7";
const WRONG_WHITE_FILL = "#fecdd3";
const WRONG_BLACK_FILL = "#e11d48";

/** A clickable virtual piano over a note range — "Fabryka Budowania"'s
 * interval-build-choice AnswerInput producer. Ported from the web app's
 * PianoKeyboard.tsx. react-native-svg's <Svg> always renders as its own
 * native platform view rather than a pure drawing node (see
 * CircleOfFifthsWheel's own lesson on that), so every key here is a real
 * drawing primitive (<Rect>) with its own onPress, never a nested <Svg> —
 * this component is only ever used as a top-level board (never composed
 * inside another Svg's tree), so that constraint doesn't otherwise
 * surface, but the key-per-Rect shape is kept regardless for consistency.
 * Wrapped in a horizontal ScrollView since a wide computed keyboardRange
 * can exceed a phone's screen width. */
export function PianoKeyboard({ range, onSelect, disabled, selectedNote, correctNote, secondaryNote, labelFor }: PianoKeyboardProps) {
  const notes = enumerateChromaticRange(parseScientific(range.from), parseScientific(range.to));
  const whiteNotes = notes.filter((n) => n.accidental === 0);
  const blackNotes = notes.filter((n) => n.accidental !== 0);
  const whiteIndexByPitch = new Map(whiteNotes.map((n, i) => [formatScientific(n), i]));
  const totalWidth = whiteNotes.length * WHITE_KEY_WIDTH;

  // Compared enharmonically, not by string, so a flat-spelled prop (e.g.
  // "Db4") still matches the sharp-spelled key drawn by
  // enumerateChromaticRange (e.g. "C#4") — see lib/music/notes.ts's
  // areEnharmonicallyEqual.
  const isCorrect = (n: Note) => correctNote != null && areEnharmonicallyEqual(n, parseScientific(correctNote));
  const isSecondary = (n: Note) => secondaryNote != null && areEnharmonicallyEqual(n, parseScientific(secondaryNote));
  const isSelected = (n: Note) => selectedNote != null && areEnharmonicallyEqual(n, parseScientific(selectedNote));

  // A real piano key sounds when pressed — this is what makes clicking
  // around actually useful for ear-checking a build-choice answer before
  // submitting it, not just a silent multiple-choice click.
  function handlePress(n: Note) {
    if (disabled) return;
    playNote(n);
    onSelect(formatScientific(n));
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxWidth: "100%", opacity: disabled ? 0.85 : 1 }}>
      <View style={{ width: totalWidth, height: WHITE_KEY_HEIGHT }}>
        <Svg width={totalWidth} height={WHITE_KEY_HEIGHT}>
          {whiteNotes.map((n, index) => {
            const pitch = formatScientific(n);
            const secondary = isSecondary(n) && !isCorrect(n) && !isSelected(n);
            const fill = isCorrect(n) ? CORRECT_WHITE_FILL : isSelected(n) ? WRONG_WHITE_FILL : secondary ? SECONDARY_WHITE_FILL : WHITE_FILL;
            const label = labelFor?.(n);
            const x = index * WHITE_KEY_WIDTH;
            return (
              <G key={pitch}>
                <Rect
                  x={x}
                  y={0}
                  width={WHITE_KEY_WIDTH}
                  height={WHITE_KEY_HEIGHT}
                  rx={4}
                  fill={fill}
                  stroke={secondary ? theme.colors.success : WHITE_STROKE}
                  strokeWidth={secondary ? 2.5 : 1}
                  onPress={() => handlePress(n)}
                  accessibilityLabel={pitch}
                />
                {label && (
                  <SvgText x={x + WHITE_KEY_WIDTH / 2} y={WHITE_KEY_HEIGHT - 12} fontSize={12} fontWeight="700" fill="#18181b" textAnchor="middle" pointerEvents="none">
                    {label}
                  </SvgText>
                )}
              </G>
            );
          })}

          {blackNotes.map((n) => {
            const pitch = formatScientific(n);
            const leftWhiteIndex = whiteIndexByPitch.get(formatScientific({ ...n, accidental: 0 }));
            if (leftWhiteIndex === undefined) return null;
            const secondary = isSecondary(n) && !isCorrect(n) && !isSelected(n);
            const fill = isCorrect(n) ? CORRECT_BLACK_FILL : isSelected(n) ? WRONG_BLACK_FILL : secondary ? SECONDARY_BLACK_FILL : BLACK_FILL;
            const label = labelFor?.(n);
            const x = (leftWhiteIndex + 1) * WHITE_KEY_WIDTH - BLACK_KEY_WIDTH / 2;
            return (
              <G key={pitch}>
                <Rect x={x} y={0} width={BLACK_KEY_WIDTH} height={BLACK_KEY_HEIGHT} rx={3} fill={fill} onPress={() => handlePress(n)} accessibilityLabel={pitch} />
                {label && (
                  <SvgText x={x + BLACK_KEY_WIDTH / 2} y={BLACK_KEY_HEIGHT - 10} fontSize={10} fontWeight="700" fill="#ffffff" textAnchor="middle" pointerEvents="none">
                    {label}
                  </SvgText>
                )}
              </G>
            );
          })}
        </Svg>
      </View>
    </ScrollView>
  );
}
