import { Platform } from "react-native";
import { G, Path, Text as SvgText } from "react-native-svg";
import type { Clef } from "@/lib/music/staff";

/** Where the clef sits on the staff (viewBox of lib/music/staffGeometry: height 150, lines at y = 100, 84, 68, 52, 36), as a font glyph. */
const GLYPH: Record<Clef, { char: string; fontSize: number; x: number; y: number }> = {
  treble: { char: "𝄞", fontSize: 130, x: 9, y: 108 },
  bass: { char: "𝄢", fontSize: 92, x: 13, y: 93.5 },
};

/** The same clefs as filled shapes, for an Android phone (in the app and in a browser), whose system font draws them far too big: the
 * shape is the same size on every phone and matches the clef of iOS and of a computer.
 * The outlines are the treble clef (U+E050) and bass clef (U+E062, with its two dots) of the music font Bravura (© Steinberg Media
 * Technologies GmbH, SIL Open Font License 1.1, see licenses/Bravura-OFL.txt), scaled and placed on the staff of
 * lib/music/staffGeometry (viewBox height 150, lines at y = 100, 84, 68, 52, 36). */
const TREBLE_PATH =
  "M33.2 59.5C33.1 58.9 33.2 58.8 33.5 58.5C34.4 57.7 35.5 56.5 36.5 55.4C41 50.5 43.7 44.1 43.7 38C43.7 33.3 42.4 28.7 40.2 25.5C39.4 24.3 38 22.8 37.4 22.8C36.7 22.8 35 24.2 33.9 25.3C30 29.8 28.7 36.5 28.7 42.1C28.7 45.2 29 48.7 29.4 50.9C29.5 51.5 29.6 51.7 28.9 52.2C25.5 55 21.8 58.3 19 61.8C15.3 66.4 13 71.4 13 77.2C13 86.5 19.4 95.4 32.5 95.4C33.8 95.4 35.2 95.3 36.2 95.1C36.8 95 36.9 94.9 37.1 95.6C37.7 99.2 38.5 103.8 38.5 106.4C38.5 114.3 33.1 115.3 30 115.3C27 115.3 25.6 114.4 25.6 113.7C25.6 113.4 26.1 113.2 27.4 112.8C29 112.3 31 110.9 31 107.8C31 104.8 29.1 102.3 25.8 102.3C22.2 102.3 20.1 105.1 20.1 108.5C20.1 112 22.1 117.2 30.3 117.2C33.9 117.2 40.9 115.6 40.9 106.5C40.9 103.4 39.9 98.3 39.3 95C39.2 94.3 39.3 94.4 40 94C45.4 91.9 49 87.3 49 81.2C49 74.4 44 68.3 36.1 68.3C34.7 68.3 34.7 68.3 34.5 67.3ZM38.2 31.1C40 31.1 41.5 32.6 41.5 35.5C41.5 39.2 39.7 42.7 35.5 46.9C34.6 47.7 33.3 49 32.1 50C31.7 50.4 31.5 50.3 31.4 49.6C31.2 48.2 31.1 46.4 31.1 44.7C31.1 36.3 35 31.1 38.2 31.1ZM32.4 67.7C32.5 68.8 32.5 68.7 31.6 69C26.8 70.6 23.8 74.9 23.8 79.5C23.8 84.3 26.3 87.8 30 89C30.4 89.2 31 89.3 31.4 89.3C31.8 89.3 32 89 32 88.7C32 88.3 31.6 88.2 31.2 88C29 87.1 27.4 84.7 27.4 82.3C27.4 79.2 29.5 76.9 32.7 76C33.6 75.8 33.7 75.8 33.8 76.4L36.5 92.4C36.6 93 36.6 93 35.8 93.2C34.9 93.3 33.8 93.5 32.7 93.5C23.3 93.5 17.3 88.2 17.3 80.8C17.3 77.6 17.8 73.3 22.3 68.3C25.5 64.7 28 62.7 30.5 60.6C31 60.2 31.1 60.3 31.2 60.9ZM36.1 76.3C36 75.6 36 75.5 36.7 75.5C41 75.9 44.6 79.6 44.6 84.3C44.6 87.7 42.6 90.4 39.6 92C38.9 92.3 38.8 92.3 38.7 91.6Z";
const BASS_PATH =
  "M34.7 31.9C23.2 31.9 18.1 40.3 18.1 46.6C18.1 51.9 20.9 56.5 26.2 56.5C30.4 56.5 33.2 53.5 33.2 49.5C33.2 45.2 30.1 42.6 26.9 42.6C25.1 42.6 24.4 43.1 23.6 43.1C22.7 43.1 22.5 42.5 22.5 41.9C22.5 39.2 26.5 34.4 33.2 34.4C40.2 34.4 43.2 41.3 43.2 51.6C43.2 58.4 41.8 66.4 37.7 72.7C33.7 78.8 26.9 84.4 18.8 89.1C18.2 89.5 17.8 89.8 17.8 90.3C17.8 90.7 18 91.1 18.6 91.1C19 91.1 19.3 91 19.7 90.8C28.5 86.5 37 81.5 44 73.9C49.7 67.7 53.1 59.7 53.1 51C53.1 39.6 46.1 31.9 34.7 31.9ZM59.6 37.3C57.6 37.3 56 38.9 56 40.9C56 43 57.6 44.6 59.6 44.6C61.7 44.6 63.2 43 63.2 40.9C63.2 38.9 61.7 37.3 59.6 37.3ZM59.7 53.9C57.6 53.9 56.1 55.4 56.1 57.4C56.1 59.5 57.6 61 59.7 61C61.7 61 63.2 59.5 63.2 57.4C63.2 55.4 61.7 53.9 59.7 53.9Z";

/** True where the system font draws the clef far too big: an Android phone, in the app and in a browser alike (Chrome, Samsung Internet). */
function usesDrawnClef(): boolean {
  if (Platform.OS === "android") return true;
  return Platform.OS === "web" && typeof navigator !== "undefined" && /android/i.test(navigator.userAgent);
}

interface ClefGlyphProps {
  clef: Clef;
  color: string;
  opacity?: number;
}

/** A treble or bass clef, to be placed inside an `<Svg>` that uses the staff viewBox. */
export function ClefGlyph({ clef, color, opacity = 1 }: ClefGlyphProps) {
  if (!usesDrawnClef()) {
    const glyph = GLYPH[clef];
    return (
      <SvgText x={glyph.x} y={glyph.y} fontSize={glyph.fontSize} fill={color} opacity={opacity}>
        {glyph.char}
      </SvgText>
    );
  }
  return (
    <G opacity={opacity}>
      <Path d={clef === "treble" ? TREBLE_PATH : BASS_PATH} fill={color} />
    </G>
  );
}
