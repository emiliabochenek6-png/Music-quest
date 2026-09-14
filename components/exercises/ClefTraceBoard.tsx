import { useRef, useState } from "react";
import { PanResponder, View } from "react-native";
import Svg, { Circle, Line, Path, Text as SvgText } from "react-native-svg";
import { STAFF_LINE_STEPS, VIEW_HEIGHT, VIEW_WIDTH, stepToY } from "@/lib/music/staffGeometry";
import type { Clef } from "@/lib/music/staff";
import { t } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { TracePoint } from "@/types/exercises";

interface ClefTraceBoardProps {
  committedPoints: TracePoint[];
  onCommit: (points: TracePoint[]) => void;
  disabled: boolean;
  isCorrect: boolean | null;
  clef?: Clef;
  locale: Locale;
  /** Fires true the instant a stroke begins, false the instant it ends —
   * lets the screen hosting this board (app/(main)/lesson/[lessonId].tsx)
   * disable its own ScrollView's `scrollEnabled` for the duration. The
   * responder-capture flags below stop MOST accidental scroll-hijacking,
   * but iOS's native UIScrollView can still start deciding to scroll on
   * its own before the JS responder negotiation finishes for a fast
   * vertical flick — disabling scroll at the native prop level is the
   * only fully reliable fix for that gap. */
  onDrawingActiveChange?: (active: boolean) => void;
}

const BOARD_WIDTH = 240;
const BOARD_HEIGHT = (VIEW_HEIGHT / VIEW_WIDTH) * BOARD_WIDTH;

/** Same guide glyph positions as the web app's ClefTraceBoard.tsx — see
 * that file's own doc for how the bass clef's y/fontSize were derived
 * (pixel-blob analysis of the rendered glyph, not eyeballed). Whether iOS's
 * system font actually has glyphs for U+1D11E/U+1D122 (Unicode's Musical
 * Symbols block) at all is unconfirmed on this port — verify live once
 * running; if it renders as tofu, this needs a bundled font (expo-font)
 * or a hand-drawn SVG fallback instead. */
const CLEF_GLYPH: Record<Clef, { char: string; fontSize: number; x: number; y: number }> = {
  treble: { char: "𝄞", fontSize: 130, x: 9, y: 108 },
  bass: { char: "𝄢", fontSize: 92, x: 13, y: 93.5 },
};

const DOT_RADIUS = 3.5;

/** Splits the flat, `newStroke`-tagged points array back into its
 * individual strokes — the bass clef's own two dots (see its glyph) are
 * meant to be placed by a plain tap, not a drag, so a stroke can be just
 * one point. A path needs at least two points to draw any line, so a
 * one-point "stroke" needs its own dot rendering (see the Circle case
 * below) — without this, a tap registered in the data but never showed up
 * on screen at all. */
function groupStrokes(points: TracePoint[]): TracePoint[][] {
  const strokes: TracePoint[][] = [];
  for (const point of points) {
    if (point.newStroke || strokes.length === 0) {
      strokes.push([point]);
    } else {
      strokes[strokes.length - 1].push(point);
    }
  }
  return strokes;
}

/**
 * A drawable staff the player traces the (semi-transparent) clef guide
 * over — ported from the web app's ClefTraceBoard.tsx (same accumulation-
 * only-committed-on-release model, same multi-stroke support for the bass
 * clef's two dots), swapped from Pointer Events to React Native's
 * PanResponder (plain JS-thread callbacks — no react-native-reanimated
 * worklets needed, which this project hasn't wired a babel plugin for; a
 * hand-drawn trace has no real-time-performance need for UI-thread
 * gesture handling anyway).
 */
export function ClefTraceBoard({
  committedPoints,
  onCommit,
  disabled,
  isCorrect,
  clef = "treble",
  locale,
  onDrawingActiveChange,
}: ClefTraceBoardProps) {
  const [livePoints, setLivePoints] = useState<TracePoint[]>(committedPoints);
  const pointsRef = useRef<TracePoint[]>(committedPoints);
  const lastCommittedRef = useRef<TracePoint[]>(committedPoints);

  // Reset the in-progress drawing whenever the parent's committed answer
  // changes from under us (new exercise, or the "clear" button) — same
  // "adjust during render on prop change" pattern the web version uses.
  if (committedPoints !== lastCommittedRef.current) {
    lastCommittedRef.current = committedPoints;
    pointsRef.current = committedPoints;
    setLivePoints(committedPoints);
  }

  function toViewBoxPoint(locationX: number, locationY: number): { x: number; y: number } {
    return { x: (locationX / BOARD_WIDTH) * VIEW_WIDTH, y: (locationY / BOARD_HEIGHT) * VIEW_HEIGHT };
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      // The *Capture variants run BEFORE the touch reaches any ancestor
      // (the exercise screen's own ScrollView) rather than after — without
      // these, a vertical drag while tracing the clef can get claimed by
      // the ScrollView's own scroll gesture instead of this board,
      // scrolling the whole screen mid-stroke instead of drawing.
      onStartShouldSetPanResponderCapture: () => !disabled,
      onMoveShouldSetPanResponderCapture: () => !disabled,
      onPanResponderGrant: (event) => {
        onDrawingActiveChange?.(true);
        const { locationX, locationY } = event.nativeEvent;
        const newPoint: TracePoint = { ...toViewBoxPoint(locationX, locationY), newStroke: true };
        const next = [...pointsRef.current, newPoint];
        pointsRef.current = next;
        setLivePoints(next);
      },
      onPanResponderMove: (event) => {
        const { locationX, locationY } = event.nativeEvent;
        const next = [...pointsRef.current, toViewBoxPoint(locationX, locationY)];
        pointsRef.current = next;
        setLivePoints(next);
      },
      onPanResponderRelease: () => {
        onDrawingActiveChange?.(false);
        lastCommittedRef.current = pointsRef.current;
        onCommit(pointsRef.current);
      },
      onPanResponderTerminate: () => {
        onDrawingActiveChange?.(false);
        lastCommittedRef.current = pointsRef.current;
        onCommit(pointsRef.current);
      },
    })
  ).current;

  const strokes = groupStrokes(livePoints);
  const strokeColor = isCorrect === null ? theme.colors.ink : isCorrect ? theme.colors.success : theme.colors.warning;

  return (
    <View
      {...panResponder.panHandlers}
      accessibilityRole="image"
      accessibilityLabel={t(clef === "bass" ? "lesson.clefTraceLabelBass" : "lesson.clefTraceLabelTreble", locale)}
      style={{ width: BOARD_WIDTH, height: BOARD_HEIGHT, alignSelf: "center", borderRadius: theme.radius.md, backgroundColor: theme.colors.surfaceMuted }}
    >
      <Svg viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`} width={BOARD_WIDTH} height={BOARD_HEIGHT}>
        {STAFF_LINE_STEPS.map((step) => (
          <Line
            key={step}
            x1={10}
            x2={VIEW_WIDTH - 10}
            y1={stepToY(step)}
            y2={stepToY(step)}
            stroke={theme.colors.ink}
            strokeWidth={1.5}
            opacity={0.5}
          />
        ))}
        <SvgText
          x={CLEF_GLYPH[clef].x}
          y={CLEF_GLYPH[clef].y}
          fontSize={CLEF_GLYPH[clef].fontSize}
          fill={theme.colors.ink}
          opacity={0.3}
        >
          {CLEF_GLYPH[clef].char}
        </SvgText>
        {strokes.map((stroke, index) =>
          stroke.length === 1 ? (
            <Circle key={index} cx={stroke[0].x} cy={stroke[0].y} r={DOT_RADIUS} fill={strokeColor} />
          ) : (
            <Path
              key={index}
              d={stroke.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")}
              fill="none"
              stroke={strokeColor}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )
        )}
      </Svg>
    </View>
  );
}
