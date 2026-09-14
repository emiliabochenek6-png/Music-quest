import { ScrollView, Text, View } from "react-native";
import Svg, { Ellipse, G, Line, Text as SvgText } from "react-native-svg";
import { describeStaffPosition, ledgerLineSteps } from "@/lib/music/staff";
import { getNoteDisplayName } from "@/lib/music/names";
import { enumerateChromaticRange, formatScientific, noteToMidi, parseScientific, type Note } from "@/lib/music/notes";
import { STAFF_LINE_STEPS, VIEW_HEIGHT, stepToY } from "@/lib/music/staffGeometry";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";

interface ChromaticKeyboardReferenceProps {
  /** Scientific pitches, e.g. ["C4", "C5"] — every chromatic step in
   * between (inclusive) gets its own labeled key. */
  range: [string, string];
  locale: Locale;
}

// Wider than PianoKeyboard's own real-piano key width (40) on purpose: at
// that width a black key's notehead sits too close to its neighbor's for
// a sharp glyph and two lines of caption text to fit legibly. This is a
// reference legend, not the interactive keyboard the player later clicks,
// so trading exact real-piano proportions for legible spacing is the
// right tradeoff here.
const WHITE_KEY_WIDTH = 60;
const WHITE_KEY_HEIGHT = 140;
const BLACK_KEY_WIDTH = 34;
const BLACK_KEY_HEIGHT = 88;

const NOTE_RADIUS = 6;
const LEDGER_WIDTH = 22;
const ACCIDENTAL_X_OFFSET = -(NOTE_RADIUS + 6);
const ACCIDENTAL_DY = 5;
const ACCIDENTAL_SYMBOL = "♯";
const EDGE_MARGIN = NOTE_RADIUS + 4;

/** A wall-chart reference: every key in `range` labeled with its note name
 * and its semitone distance from the first key, with a matching staff row
 * above showing the same chromatic run written out — "Fabryka Budowania"'s
 * level 1 needs this before the player is asked to count semitones
 * themselves to build an interval. Read-only, no interaction (unlike
 * PianoKeyboard, this never needs an onSelect — it's a legend, not an
 * answer input). Ported from the web app's ChromaticKeyboardReference.tsx. */
export function ChromaticKeyboardReference({ range, locale }: ChromaticKeyboardReferenceProps) {
  const notes = enumerateChromaticRange(parseScientific(range[0]), parseScientific(range[1]));
  const startMidi = noteToMidi(notes[0]);
  const whiteNotes = notes.filter((n) => n.accidental === 0);
  const whiteIndexByPitch = new Map(whiteNotes.map((n, i) => [formatScientific(n), i]));
  const totalWidth = whiteNotes.length * WHITE_KEY_WIDTH;

  const noteX = (n: Note): number => {
    const whiteIndex = whiteIndexByPitch.get(formatScientific({ ...n, accidental: 0 }));
    if (whiteIndex === undefined) return 0;
    return n.accidental === 0 ? whiteIndex * WHITE_KEY_WIDTH + WHITE_KEY_WIDTH / 2 : (whiteIndex + 1) * WHITE_KEY_WIDTH;
  };

  // E and B are the two naturals with no black key on either side, so
  // noteX (which mirrors the real keyboard's layout) sits them right next
  // to their left neighbor with a big empty gap to their right, instead of
  // evenly between the two — only affects the staff row below, not the
  // keyboard keys, which still need real-piano spacing to look/click right.
  const staffX = (index: number): number => {
    const n = notes[index];
    if ((n.letter === "E" || n.letter === "B") && index > 0 && index < notes.length - 1) {
      return (noteX(notes[index - 1]) + noteX(notes[index + 1])) / 2;
    }
    return noteX(n);
  };

  const positions = notes.map((n) => describeStaffPosition(n));
  const noteCenterYs = positions.map((position) => stepToY(position.step));
  const viewMinY = Math.min(0, ...noteCenterYs.map((y) => y - EDGE_MARGIN));
  const viewMaxY = Math.max(VIEW_HEIGHT, ...noteCenterYs.map((y) => y + EDGE_MARGIN));
  const staffHeight = viewMaxY - viewMinY;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxWidth: "100%" }}>
      <View>
        <Svg width={totalWidth} height={staffHeight} viewBox={`0 ${viewMinY} ${totalWidth} ${staffHeight}`}>
          {STAFF_LINE_STEPS.map((lineStep) => (
            <Line key={lineStep} x1={0} x2={totalWidth} y1={stepToY(lineStep)} y2={stepToY(lineStep)} stroke={theme.colors.ink} strokeWidth={1.5} />
          ))}

          {notes.map((n, index) => {
            const x = staffX(index);
            const position = positions[index];
            const y = stepToY(position.step);
            return (
              <G key={formatScientific(n)}>
                {ledgerLineSteps(position.step).map((ledgerStep) => (
                  <Line
                    key={ledgerStep}
                    x1={x - LEDGER_WIDTH / 2}
                    x2={x + LEDGER_WIDTH / 2}
                    y1={stepToY(ledgerStep)}
                    y2={stepToY(ledgerStep)}
                    stroke={theme.colors.ink}
                    strokeWidth={1.5}
                  />
                ))}
                {n.accidental !== 0 && (
                  <SvgText x={x + ACCIDENTAL_X_OFFSET} y={y + ACCIDENTAL_DY} fontSize={16} fill={theme.colors.ink} textAnchor="middle">
                    {ACCIDENTAL_SYMBOL}
                  </SvgText>
                )}
                <Ellipse cx={x} cy={y} rx={NOTE_RADIUS} ry={NOTE_RADIUS - 1} fill={theme.colors.ink} />
              </G>
            );
          })}
        </Svg>

        <View style={{ width: totalWidth, height: WHITE_KEY_HEIGHT, marginTop: theme.spacing(1) }}>
          {whiteNotes.map((n, index) => (
            <View
              key={formatScientific(n)}
              style={{
                position: "absolute",
                left: index * WHITE_KEY_WIDTH,
                top: 0,
                width: WHITE_KEY_WIDTH,
                height: WHITE_KEY_HEIGHT,
                borderWidth: 1,
                borderColor: "rgba(0,0,0,0.15)",
                borderBottomLeftRadius: 6,
                borderBottomRightRadius: 6,
                backgroundColor: "#ffffff",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingBottom: theme.spacing(1),
                gap: 2,
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: "700", color: "#18181b" }}>{getNoteDisplayName(n, locale)}</Text>
              <Text style={{ fontSize: 9, color: "#71717a" }}>{noteToMidi(n) - startMidi}</Text>
            </View>
          ))}

          {notes
            .filter((n) => n.accidental !== 0)
            .map((n) => (
              <View
                key={formatScientific(n)}
                style={{
                  position: "absolute",
                  left: noteX(n) - BLACK_KEY_WIDTH / 2,
                  top: 0,
                  width: BLACK_KEY_WIDTH,
                  height: BLACK_KEY_HEIGHT,
                  borderBottomLeftRadius: 5,
                  borderBottomRightRadius: 5,
                  backgroundColor: "#18181b",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingBottom: theme.spacing(1),
                  gap: 2,
                }}
              >
                <Text style={{ fontSize: 9, fontWeight: "700", color: "#ffffff" }}>{getNoteDisplayName(n, locale)}</Text>
                <Text style={{ fontSize: 8, color: "rgba(255,255,255,0.6)" }}>{noteToMidi(n) - startMidi}</Text>
              </View>
            ))}
        </View>
      </View>
    </ScrollView>
  );
}
