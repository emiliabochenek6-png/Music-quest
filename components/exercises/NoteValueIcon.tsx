import Svg, { Circle, Path } from "react-native-svg";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { RhythmNoteValue } from "@/types/exercises";

interface NoteValueIconProps {
  value: RhythmNoteValue;
  size?: number;
  color?: string;
}

const VIEW_W = 26;
const VIEW_H = 42;
const HEAD_CX = 8;
const HEAD_CY = 32;
const HEAD_RX = 6;

/**
 * Exact outline data traced from the web app's own Bravura font (the real
 * SMuFL music font) — extracted with fontTools' SVGPathPen from each
 * glyph's actual CFF contours (font units, Y-up, baseline at 0), not
 * hand-drawn from a screenshot. A live-font version (rendering Bravura
 * itself via expo-font) was tried first but the glyphs didn't render
 * on-device for reasons that weren't diagnosable without on-device error
 * output (see git history) — baking the exact vector shapes in as static
 * paths sidesteps that font-loading problem entirely while still giving
 * pixel-accurate silhouettes, matching the web app exactly rather than an
 * approximation.
 */
const NOTE_PATH: Record<RhythmNoteValue, string> = {
  whole:
    "M235 136C90 136 0 75 0 1C0 -72 62 -137 224 -137C402 -137 459 -75 459 1C459 78 336 136 235 136ZM121 68C133 105 173 111 207 111C281 111 341 31 341 -35C341 -42 340 -49 339 -55C334 -82 318 -101 291 -108C280 -111 269 -112 258 -112C248 -112 239 -111 229 -108C211 -102 193 -92 178 -79C170 -72 162 -64 155 -55C134 -30 117 7 117 41C117 50 118 59 121 68Z",
  half: "M112 -145C302 -145 341 9 341 48V875H311V118C291 135 262 145 227 145C54 145 0 11 0 -49C0 -110 49 -145 112 -145ZM139 52C196 85 232 97 256 97C278 97 290 87 298 73C302 66 305 59 305 51C305 28 281 0 200 -53C148 -88 112 -100 87 -100C63 -100 49 -88 41 -74C37 -67 34 -59 34 -51C34 -26 59 6 139 52Z",
  quarter: "M302 115C283 132 255 141 222 141C99 141 0 50 0 -47C0 -106 48 -141 109 -141C209 -141 332 -48 332 47V875H302Z",
  eighth:
    "M451 594C400 673 358 755 342 851C339 867 331 873 312 873C307 873 303 871 302 864V118C283 135 255 144 222 144C99 144 0 53 0 -44C0 -103 48 -138 109 -138C209 -138 332 -45 332 50V611C394 573 468 463 499 390C514 356 523 299 523 240C523 195 516 148 499 103C497 97 496 92 496 88C496 72 506 63 512 59L514 58C523 57 535 61 540 78C540 78 566 173 566 251C566 376 514 494 451 594Z",
  sixteenth:
    "M552 327C552 330 551 332 551 336C551 338 551 340 552 343C555 349 577 409 577 470C577 483 576 494 574 506C564 574 538 602 466 680C412 738 356 754 339 860C337 871 325 873 319 873C313 873 302 872 302 872V118C283 135 255 144 222 144C99 144 0 53 0 -44C0 -103 48 -138 109 -138C209 -138 332 -45 332 50V474C387 470 449 453 509 331C532 283 541 234 541 182C541 153 538 123 533 93C532 89 532 87 532 84C532 70 539 62 546 60C549 59 551 58 554 58C561 58 568 62 574 75C578 80 581 137 581 185V207C581 249 570 290 552 327ZM538 440C536 432 536 422 531 414C530 411 523 408 518 408C515 408 513 409 511 412C495 437 478 457 457 481C410 535 364 559 343 641C342 642 342 643 342 644C342 648 348 654 356 654H364C425 654 479 598 512 549C530 523 539 492 539 460C539 453 539 447 538 440Z",
  // Gaj Grupowania's own dotted values reuse the undotted glyph exactly —
  // the notehead+stem shape is identical, only the augmentation dot (drawn
  // separately below, not baked into this path) differs.
  dottedQuarter:
    "M302 115C283 132 255 141 222 141C99 141 0 50 0 -47C0 -106 48 -141 109 -141C209 -141 332 -48 332 47V875H302Z",
  dottedHalf:
    "M112 -145C302 -145 341 9 341 48V875H311V118C291 135 262 145 227 145C54 145 0 11 0 -49C0 -110 49 -145 112 -145ZM139 52C196 85 232 97 256 97C278 97 290 87 298 73C302 66 305 59 305 51C305 28 281 0 200 -53C148 -88 112 -100 87 -100C63 -100 49 -88 41 -74C37 -67 34 -59 34 -51C34 -26 59 6 139 52Z",
  dottedEighth:
    "M451 594C400 673 358 755 342 851C339 867 331 873 312 873C307 873 303 871 302 864V118C283 135 255 144 222 144C99 144 0 53 0 -44C0 -103 48 -138 109 -138C209 -138 332 -45 332 50V611C394 573 468 463 499 390C514 356 523 299 523 240C523 195 516 148 499 103C497 97 496 92 496 88C496 72 506 63 512 59L514 58C523 57 535 61 540 78C540 78 566 173 566 251C566 376 514 494 451 594Z",
  // The "3" triplet indicator is a separate overlay drawn only where notes
  // are shown grouped (BeamedNotation) — a standalone icon of one triplet
  // eighth, on its own, is indistinguishable from a plain eighth note.
  eighthTriplet:
    "M451 594C400 673 358 755 342 851C339 867 331 873 312 873C307 873 303 871 302 864V118C283 135 255 144 222 144C99 144 0 53 0 -44C0 -103 48 -138 109 -138C209 -138 332 -45 332 50V611C394 573 468 463 499 390C514 356 523 299 523 240C523 195 516 148 499 103C497 97 496 92 496 88C496 72 506 63 512 59L514 58C523 57 535 61 540 78C540 78 566 173 566 251C566 376 514 494 451 594Z",
};

/** Extra augmentation-dot circle drawn to the right of the notehead for the
 * three dotted values — the extracted Bravura augmentationDot glyph
 * (U+E1E7) is itself an exact circle (bounds 100x100 font units, centered),
 * so drawing it as a plain <Circle> reproduces the same shape without
 * needing a baked path for it. */
const DOTTED_VALUES: ReadonlySet<RhythmNoteValue> = new Set(["dottedQuarter", "dottedHalf", "dottedEighth"]);
const DOT_CX_OFFSET = 3.5;
const DOT_RADIUS = 1.7;

// Maps the font's own coordinate space (units per em 1000, Y-up, baseline
// at 0) onto this component's viewBox: chosen so the notehead lands at
// (HEAD_CX, HEAD_CY) with the same ~HEAD_RX radius the rest of this app's
// notation already uses, and a stem tall enough for the flags without
// overflowing VIEW_H — derived from the glyphs' own measured bounds (see
// the doc above), not eyeballed.
const SCALE = 0.0343;
const TRANSLATE_X = HEAD_CX - HEAD_RX;

export function NoteValueIcon({ value, size = 26, color }: NoteValueIconProps) {
  const fill = color ?? theme.colors.ink;
  const height = (size / VIEW_W) * VIEW_H;

  return (
    <Svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} width={size} height={height}>
      <Path d={NOTE_PATH[value]} fill={fill} fillRule="nonzero" transform={`translate(${TRANSLATE_X} ${HEAD_CY}) scale(${SCALE} ${-SCALE})`} />
      {DOTTED_VALUES.has(value) && <Circle cx={HEAD_CX + HEAD_RX + DOT_CX_OFFSET} cy={HEAD_CY} r={DOT_RADIUS} fill={fill} />}
    </Svg>
  );
}
