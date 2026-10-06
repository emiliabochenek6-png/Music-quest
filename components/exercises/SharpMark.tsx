import { G, Path } from "react-native-svg";

interface SharpMarkProps {
  /** Centre of the sign. */
  x: number;
  /** The note's own y: the sign is centred exactly on it (and so on the staff line the note sits on). */
  y: number;
  fill: string;
}

/** A sharp (♯, "krzyżyk") drawn as lines instead of a font glyph. The font glyph's height differs from phone to phone (on some
 * it sat visibly below its line), a drawn sign is centred on the note's line everywhere. Size of the staff viewBox (line spacing 16). */
export function SharpMark({ x, y, fill }: SharpMarkProps) {
  return (
    <G>
      {/* two thin uprights (the right one a little higher) */}
      <Path d={`M ${x - 3.5} ${y - 10} L ${x - 3.5} ${y + 13} M ${x + 3.5} ${y - 13} L ${x + 3.5} ${y + 10}`} stroke={fill} strokeWidth={1.5} fill="none" />
      {/* two thick bars rising to the right */}
      <Path d={`M ${x - 8.5} ${y - 0.5} L ${x + 8.5} ${y - 5} M ${x - 8.5} ${y + 6} L ${x + 8.5} ${y + 1.5}`} stroke={fill} strokeWidth={2.6} fill="none" />
    </G>
  );
}
