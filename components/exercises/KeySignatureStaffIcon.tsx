import Svg, { G, Line, Text as SvgText } from "react-native-svg";
import { View } from "react-native";
import { getKeySignatureStaffSteps } from "@/lib/music/keys";
import { VIEW_HEIGHT, STAFF_LINE_STEPS, stepToY } from "@/lib/music/staffGeometry";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

interface KeySignatureStaffIconProps {
  fifths: number;
}

/** This icon's own viewBox width — wider than the plain single-note staff's
 * VIEW_WIDTH (100, from staffGeometry.ts) since up to 6 (bold, fontSize-33)
 * accidentals need to clear the clef glyph without overlapping it or each
 * other. VIEW_HEIGHT is still the shared staffGeometry.ts one — the staff
 * itself is the same 5-line height as everywhere else in this app. */
const VIEW_WIDTH = 235;
const STAFF_LEFT = 6;
const STAFF_RIGHT = VIEW_WIDTH - 6;
const FIRST_ACCIDENTAL_X = 86;
const ACCIDENTAL_SPACING = 23;
const ACCIDENTAL_GLYPH: Record<"sharps" | "flats", string> = { sharps: "♯", flats: "♭" };
/** Vertical nudge from the note's own y (an SvgText element positions by
 * baseline, not visual center) so the glyph's visual center — not its
 * baseline — lands on its target line/space. The original web-ported
 * values here (3/2) were tuned against a browser's own text-baseline
 * rendering; react-native-svg's text renderer sits the same glyphs
 * noticeably higher at this fontSize (33 — much larger than
 * TriadStaffNotation's own 22/27) — first scaled proportionally from that
 * file's own tuned dy/fontSize ratios, then the flat nudged down further
 * still after a live check (every use of this icon — both
 * CircleOfFifthsWheel's per-sector icons and key-signature-staff-choice's
 * own standalone one share this same constant, so this one tweak fixes
 * both at once). */
const SHARP_DY = 11;
const FLAT_DY = 10;

/** Just the clef + accidental glyphs, no staff lines — for a caller that
 * wants to compose a key signature onto a staff IT is already drawing
 * (e.g. a melodic dictation staff prefixed with the tonality's own
 * signature). */
export function KeySignatureGlyphs({ fifths }: { fifths: number }) {
  const steps = getKeySignatureStaffSteps(fifths);
  const isFlats = fifths < 0;
  const glyph = isFlats ? ACCIDENTAL_GLYPH.flats : ACCIDENTAL_GLYPH.sharps;
  const accidentalDy = isFlats ? FLAT_DY : SHARP_DY;

  return (
    <>
      <SvgText x={9} y={108} fontSize={130} fill={theme.colors.ink}>
        𝄞
      </SvgText>
      {steps.map((step, index) => (
        <SvgText
          key={index}
          x={FIRST_ACCIDENTAL_X + index * ACCIDENTAL_SPACING}
          y={stepToY(step)}
          dy={accidentalDy}
          fontSize={33}
          fontWeight="700"
          fill={theme.colors.ink}
          textAnchor="middle"
        >
          {glyph}
        </SvgText>
      ))}
    </>
  );
}

/** The staff lines + glyphs together, as a plain &lt;G&gt; (a real SVG
 * drawing primitive) rather than a wrapping &lt;Svg&gt; — for a caller
 * that needs to place this icon at an arbitrary position/size INSIDE its
 * OWN already-open &lt;Svg&gt; tree (CircleOfFifthsWheel, once per
 * sector). react-native-svg's &lt;Svg&gt; always renders as its own
 * native platform view (RNSVGSvgView), not a pure drawing node — nesting
 * one &lt;Svg&gt; inside another's tree the way the web app's DOM nests
 * &lt;svg&gt; inside &lt;svg&gt; does NOT work the same way in React
 * Native (every nested icon ended up stacked in the same spot instead of
 * at its own sector). A &lt;G transform="translate(...) scale(...)"&gt;
 * reproduces the same "place this whole icon at (x,y) sized (w,h)" effect
 * using only real drawing primitives, so it composes correctly inside a
 * parent &lt;Svg&gt; no matter how many times it's repeated. */
export function KeySignatureIconGroup({ fifths, x, y, width, height }: { fifths: number; x: number; y: number; width: number; height: number }) {
  const scaleX = width / VIEW_WIDTH;
  const scaleY = height / VIEW_HEIGHT;
  return (
    <G transform={`translate(${x}, ${y}) scale(${scaleX}, ${scaleY})`}>
      {STAFF_LINE_STEPS.map((step) => (
        <Line key={step} x1={STAFF_LEFT} x2={STAFF_RIGHT} y1={stepToY(step)} y2={stepToY(step)} stroke={theme.colors.ink} strokeWidth={1.5 / Math.min(scaleX, scaleY)} />
      ))}
      <KeySignatureGlyphs fifths={fifths} />
    </G>
  );
}

/** A treble staff showing one key signature's clef + accidentals, as a
 * STANDALONE, top-level icon (key-signature-staff-choice's own prompt) —
 * for the "one icon per wheel sector" use, see KeySignatureIconGroup
 * above instead; a top-level &lt;Svg&gt; here is fine since this one
 * isn't nested inside another Svg's own tree. Ported from the web app's
 * KeySignatureStaffIcon.tsx (SVG text/line-based there, react-native-svg
 * here — same viewBox math). */
export function KeySignatureStaffIcon({ fifths }: KeySignatureStaffIconProps) {
  return (
    <View style={{ width: "100%", aspectRatio: VIEW_WIDTH / VIEW_HEIGHT }}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}>
        {STAFF_LINE_STEPS.map((step) => (
          <Line key={step} x1={STAFF_LEFT} x2={STAFF_RIGHT} y1={stepToY(step)} y2={stepToY(step)} stroke={theme.colors.ink} strokeWidth={1.5} />
        ))}
        <KeySignatureGlyphs fifths={fifths} />
      </Svg>
    </View>
  );
}
