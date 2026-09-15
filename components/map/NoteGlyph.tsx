import { Ellipse, G, Rect } from "react-native-svg";

interface NoteGlyphProps {
  x: number;
  y: number;
  size: number;
  rotation: number;
  color: string;
  opacity: number;
}

/** One small decorative music note — a notehead ellipse plus a short
 * stem, kept to basic SVG primitives (no hand-authored path curves, per
 * this app's own "avoid long hand-drawn path data for decorative
 * graphics" convention) rather than a literal ♪ glyph, so its size/
 * color/rotation are all real SVG props a scattered background field
 * can vary per-note instead of relying on font rendering. */
export function NoteGlyph({ x, y, size, rotation, color, opacity }: NoteGlyphProps) {
  const headRx = size * 0.52;
  const headRy = size * 0.4;
  const stemHeight = size * 2.4;
  const stemWidth = size * 0.2;

  return (
    <G transform={`translate(${x}, ${y}) rotate(${rotation})`} opacity={opacity}>
      <Rect x={headRx * 0.55 - stemWidth / 2} y={-stemHeight} width={stemWidth} height={stemHeight + headRy * 0.3} rx={stemWidth / 2} fill={color} />
      <Ellipse cx={0} cy={0} rx={headRx} ry={headRy} rotation={-18} fill={color} />
    </G>
  );
}

/** A tiny seeded pseudo-random generator (Mulberry32) — Math.random()
 * would reshuffle every note's position on each re-render (any state
 * change anywhere on the map screen), which reads as the background
 * "twitching"; a fixed seed keeps the scattered field stable across
 * renders while still looking organic, not a repeating grid. */
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface ScatteredNote {
  x: number;
  y: number;
  size: number;
  rotation: number;
  opacity: number;
}

/** Lays out `count` notes scattered across a `width` x `height` area —
 * shared by WorldMap (the top-level map of all worlds) and LessonPath
 * (one world's own level path), so both "game paths" the player asked
 * for get the same subtle note-scatter background, from the same
 * deterministic layout logic. `seed` lets each screen get its own
 * stable-but-distinct pattern rather than literally the same one. */
export function layoutScatteredNotes(width: number, height: number, count: number, seed: number): ScatteredNote[] {
  const random = seededRandom(seed);
  return Array.from({ length: count }, () => ({
    x: random() * width,
    y: random() * height,
    size: 7 + random() * 8,
    rotation: random() * 40 - 20,
    opacity: 0.05 + random() * 0.07,
  }));
}
