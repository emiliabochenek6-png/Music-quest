import { Platform } from "react-native";
import { Circle, G, Path, Text as SvgText } from "react-native-svg";
import type { Clef } from "@/lib/music/staff";

/** Where the clef sits on the staff (viewBox of lib/music/staffGeometry: height 150, lines at y = 100, 84, 68, 52, 36), as a font glyph. */
const GLYPH: Record<Clef, { char: string; fontSize: number; x: number; y: number }> = {
  treble: { char: "𝄞", fontSize: 130, x: 9, y: 108 },
  bass: { char: "𝄢", fontSize: 92, x: 13, y: 93.5 },
};

/** The same clefs drawn by hand as lines: the system font of an Android phone has a much bigger clef than the one on iOS and
 * in the browser, so there the shape is drawn instead and is the same size on every phone. */
const TREBLE_PATH =
  "M 25 110 C 24 121, 38 122, 38 108 C 37 90, 35 70, 35 48 C 35 34, 38 25, 42 24 C 49 24, 46 42, 35 58 C 24 72, 10 86, 18 98 C 25 108, 50 104, 50 88 C 50 74, 34 70, 27 80 C 21 88, 29 95, 36 91";
const BASS_PATH = "M 25 50 C 25 34, 50 32, 54 54 C 56 68, 40 82, 20 92";

interface ClefGlyphProps {
  clef: Clef;
  color: string;
  opacity?: number;
}

/** A treble or bass clef, to be placed inside an `<Svg>` that uses the staff viewBox. */
export function ClefGlyph({ clef, color, opacity = 1 }: ClefGlyphProps) {
  if (Platform.OS !== "android") {
    const glyph = GLYPH[clef];
    return (
      <SvgText x={glyph.x} y={glyph.y} fontSize={glyph.fontSize} fill={color} opacity={opacity}>
        {glyph.char}
      </SvgText>
    );
  }
  if (clef === "treble") {
    return (
      <G opacity={opacity}>
        <Path d={TREBLE_PATH} fill="none" stroke={color} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />
      </G>
    );
  }
  return (
    <G opacity={opacity}>
      <Circle cx={25} cy={50} r={8} fill={color} />
      <Path d={BASS_PATH} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={61} cy={43} r={4} fill={color} />
      <Circle cx={61} cy={60} r={4} fill={color} />
    </G>
  );
}
