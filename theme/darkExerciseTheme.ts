import type { ThemeTokens } from "@/theme/tokens";

/**
 * Fixed dark-cosmic palette for the exercise/lesson screens (see
 * app/(main)/lesson/[lessonId].tsx and the map/levels screens it matches)
 * — shares ThemeTokens' exact shape so every exercise component can swap
 * `useTheme()` for this constant as a drop-in import alias
 * (`import { DARK_EXERCISE_THEME as theme } from ...`), with zero other
 * changes needed in the component body.
 *
 * A separate constant from theme/tokens.ts's own (light) THEME_TOKENS
 * rather than a shared token set, since the two themes' colors are
 * unrelated — exercise/map/lesson screens render the same for every
 * player, so this needs no ProfileContext involvement at all.
 */
export const DARK_EXERCISE_THEME: ThemeTokens = {
  colors: {
    cream: "#0b0620",
    ink: "#ece8ff",
    primary: "#8b7cf6",
    primaryDark: "#6d5bd0",
    warning: "#fb7185",
    success: "#4ade80",
    muted: "rgba(236,232,255,0.6)",
    border: "rgba(255,255,255,0.16)",
    surface: "rgba(255,255,255,0.06)",
    surfaceMuted: "rgba(255,255,255,0.1)",
  },
  spacing: (n) => n * 9,
  radius: { sm: 10, md: 14, lg: 20 },
  minTapTarget: 50,
  fontSize: { body: 16, heading: 22, display: 30 },
  playfulMode: false,
};
