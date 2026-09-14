import type { ProfileMode } from "@/types/content";

/** Shared brand tokens both profile modes are built from — never
 * duplicated per-mode, only the SELECTION of which shared token to use
 * (spacing scale, corner radius, tap-target size) differs. Keeps the two
 * modes visually related (same hue family) rather than looking like two
 * unrelated apps. */
const BRAND = {
  cream: "#FFF8EE",
  ink: "#1D2B2E",
  primary: "#2A9D8F",
  primaryDark: "#1F6F65",
  warning: "#E76F51",
  success: "#588157",
  muted: "#6B7280",
  border: "#E5E0D5",
} as const;

export interface ThemeTokens {
  // Widened to `string` per key rather than `typeof BRAND` — BRAND's own
  // `as const` gives each color a literal type, which would make every
  // caller that reassigns a local `let color = theme.colors.x` to a
  // DIFFERENT token (e.g. swapping border color on correct/incorrect
  // state) a type error, since the variable's inferred type would be
  // pinned to that one literal.
  colors: Record<keyof typeof BRAND, string> & { surface: string; surfaceMuted: string };
  spacing: (multiplier: number) => number;
  radius: { sm: number; md: number; lg: number };
  minTapTarget: number;
  fontSize: { body: number; heading: number; display: number };
  /** Whether this mode's components should play Lottie reward animations
   * and route feedback through the narrator (see ProfileContext's own
   * narratorEnabled default). Purely a hint components read to decide
   * whether to mount the heavier animation layer at all — not a style
   * value, kept here so a component needs only ONE theme lookup instead of
   * also reaching into ProfileContext for this. */
  playfulMode: boolean;
}

const YOUNG_EXPLORER_TOKENS: ThemeTokens = {
  colors: { ...BRAND, surface: "#FFFFFF", surfaceMuted: "#FFF3DF" },
  spacing: (n) => n * 10,
  radius: { sm: 12, md: 18, lg: 24 },
  minTapTarget: 56,
  fontSize: { body: 17, heading: 24, display: 34 },
  playfulMode: true,
};

const HOBBYIST_TOKENS: ThemeTokens = {
  colors: { ...BRAND, surface: "#FFFFFF", surfaceMuted: "#F4F4F5" },
  spacing: (n) => n * 8,
  radius: { sm: 6, md: 10, lg: 14 },
  minTapTarget: 44,
  fontSize: { body: 15, heading: 20, display: 28 },
  playfulMode: false,
};

export function getThemeTokens(mode: ProfileMode): ThemeTokens {
  return mode === "young-explorer" ? YOUNG_EXPLORER_TOKENS : HOBBYIST_TOKENS;
}
