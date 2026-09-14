import Svg, { Path } from "react-native-svg";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { RhythmRestValue } from "@/types/exercises";

interface RestValueIconProps {
  value: RhythmRestValue;
  size?: number;
  color?: string;
}

const VIEW_W = 26;
const VIEW_H = 42;
const HEAD_CX = 8;
const HEAD_CY = 32;
const HEAD_RX = 6;

/** Exact outline data traced from the web app's own Bravura font, same
 * approach and same rationale as NoteValueIcon's own doc (extracted with
 * fontTools' SVGPathPen from the real glyph contours rather than hand-
 * drawn from a screenshot, baked in as a static path so it doesn't depend
 * on loading the font itself on-device). sixteenthRest added for "Gaj
 * Grupowania" (a rest can sit inside a beamed group). Exported (not just
 * used internally) so BeamedNotation.tsx can draw the exact same glyphs at
 * its own scale instead of re-extracting/duplicating this data. */
export const REST_PATH: Record<RhythmRestValue, string> = {
  quarterRest:
    "M78 -38C94 -58 108 -77 121 -98C123 -102 127 -110 127 -112C127 -113 127 -115 126 -116C124 -120 120 -121 115 -121C111 -121 103 -119 99 -118C94 -118 88 -115 83 -115C40 -115 1 -158 1 -211C1 -261 44 -310 117 -366C125 -372 135 -375 143 -375C150 -375 157 -373 158 -369C159 -366 160 -364 160 -362C160 -353 152 -345 144 -338C131 -338 120 -311 118 -302C115 -294 114 -285 114 -276C114 -245 129 -210 161 -204C166 -203 171 -203 177 -203C206 -203 239 -214 255 -220C256 -220 257 -221 258 -221C261 -222 263 -222 265 -222C268 -222 270 -221 270 -218C270 -206 244 -173 233 -161C195 -115 164 -78 164 -22C164 -18 165 -13 165 -9C169 49 205 97 231 138C234 143 235 148 235 153C235 163 231 172 231 172C231 172 83 348 66 365C61 370 54 373 48 373C38 373 28 366 28 352C28 347 29 342 32 336C36 325 93 274 93 202C93 165 78 122 33 75C23 65 19 54 19 46C19 32 29 22 29 22Z",
  eighthRest:
    "M134 107C134 144 104 174 67 174C30 174 0 144 0 107C0 86 12 68 27 56C36 50 45 45 55 43C63 41 72 39 81 39C95 39 109 42 120 46C134 50 143 54 156 61C158 62 160 62 161 62C165 62 166 58 166 53C166 50 166 46 165 42C162 27 90 -172 72 -238C72 -250 95 -251 101 -251C112 -251 126 -249 136 -241C139 -239 237 112 237 112C241 130 246 146 247 151C247 161 237 166 235 167C233 167 230 167 224 163C217 157 167 97 134 97Z",
  sixteenthRest:
    "M208 111C208 149 178 179 140 179C103 179 72 149 72 111C72 91 84 72 100 60C108 54 118 49 128 46C135 44 143 43 152 43C166 43 182 46 194 50C208 54 217 58 230 65C233 66 235 67 237 67C240 67 242 65 242 60C242 57 241 52 239 45C237 37 193 -101 184 -120C176 -139 149 -151 135 -151C136 -147 136 -144 136 -141C136 -103 105 -73 68 -73C30 -73 0 -103 0 -141C0 -161 12 -180 28 -192C36 -198 45 -203 55 -206C63 -208 71 -209 80 -209C94 -209 110 -206 122 -202C136 -198 142 -195 155 -188C157 -188 159 -190 159 -193C159 -194 158 -195 158 -196L63 -479C63 -480 62 -481 62 -482C62 -490 71 -500 93 -500C122 -500 127 -488 131 -477L247 -96C273 -11 292 56 292 56C292 56 317 144 319 157C319 159 320 160 320 161C320 167 312 171 310 172C305 172 302 170 299 168C292 162 242 102 208 101Z",
};

// Each rest's own vertical bounding-box center (font units, Y-up, baseline
// 0) — rests aren't anchored to a notehead baseline the way notes are, so
// centering each glyph on its own bounds (rather than reusing the same
// baseline-relative placement NoteValueIcon uses) is what makes it sit
// visually centered as a standalone icon. Exported alongside REST_PATH for
// the same reason.
export const REST_CENTER_Y: Record<RhythmRestValue, number> = {
  quarterRest: -1,
  eighthRest: -38.5,
  sixteenthRest: -160.5,
};

// Each rest's own horizontal bounding-box center (font units) — only
// BeamedNotation.tsx needs this (it centers a rest on a note.x position
// rather than this icon's own fixed left-edge anchor, see its own doc).
export const REST_CENTER_X: Record<RhythmRestValue, number> = {
  quarterRest: 135.5,
  eighthRest: 123.5,
  sixteenthRest: 160,
};

// Same scale as NoteValueIcon (see its own doc for how it was derived) —
// keeping it identical means a rest icon reads at the same visual size as
// a note icon sitting next to it in a row.
export const REST_GLYPH_SCALE = 0.0343;
const SCALE = REST_GLYPH_SCALE;
const TRANSLATE_X = HEAD_CX - HEAD_RX;

export function RestValueIcon({ value, size = 26, color }: RestValueIconProps) {
  const fill = color ?? theme.colors.ink;
  const height = (size / VIEW_W) * VIEW_H;
  const translateY = HEAD_CY + SCALE * REST_CENTER_Y[value];

  return (
    <Svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} width={size} height={height}>
      <Path d={REST_PATH[value]} fill={fill} fillRule="nonzero" transform={`translate(${TRANSLATE_X} ${translateY}) scale(${SCALE} ${-SCALE})`} />
    </Svg>
  );
}
