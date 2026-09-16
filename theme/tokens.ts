export interface ThemeTokens {
  colors: {
    cream: string;
    ink: string;
    primary: string;
    primaryDark: string;
    warning: string;
    success: string;
    muted: string;
    border: string;
    surface: string;
    surfaceMuted: string;
    /** Soft highlight wash (Duolingo's own "Storybook Green") — a tint
     * behind already-earned/celebratory content (a completed lesson
     * node, a highlighted streak day), never a general-purpose
     * background. */
    accentSoft: string;
    /** The one other brand hue besides `primary` — interactive links,
     * secondary buttons' text, and anything that needs to read as
     * "tap me" without competing with a primary green CTA on the same
     * screen. */
    accent: string;
  };
  spacing: (multiplier: number) => number;
  radius: { sm: number; md: number; lg: number };
  /** Every outlined/bordered component (secondary buttons, pills, the
   * chunky "sticker" cards this whole look is built from) uses this
   * exact width — Duolingo's own components never vary border weight,
   * so this is one flat number rather than a per-size scale. */
  borderWidth: number;
  minTapTarget: number;
  fontSize: { body: number; heading: number; display: number };
  /** Whether components should play Lottie reward animations and route
   * feedback through the narrator (see ProfileContext's own
   * narratorEnabled default) — a hint components read to decide whether to
   * mount the heavier animation layer at all, kept here so a component
   * needs only one theme lookup instead of also reaching into
   * ProfileContext for this. */
  playfulMode: boolean;
}

/** The app's single theme — a light, "educational" look: a warm paper-white
 * canvas rather than the dark cosmic one the app used earlier this session,
 * trust-inspiring orange as the primary/brand hue (replacing the earlier
 * green), blue kept as the secondary/link accent. Component LANGUAGE stays
 * exactly what it was under the dark canvas — flat fills, thick 2px
 * borders, no shadow/glow — only the palette itself changed here. `success`
 * is now its own calm green, deliberately NOT equal to `primary` anymore
 * (a correct-answer moment should always read as green regardless of what
 * the brand/CTA color is). Deliberately ONE theme for the whole app — see
 * theme/darkExerciseTheme.ts's own doc for why that file just re-exports
 * this same object under its old name, so every component that already
 * imports DARK_EXERCISE_THEME picks up this palette automatically. */
export const THEME_TOKENS: ThemeTokens = {
  colors: {
    cream: "#FFF8F0",
    ink: "#33291F",
    primary: "#E8720C",
    primaryDark: "#C15F09",
    warning: "#E5484D",
    success: "#3DA35D",
    muted: "#8A7F72",
    border: "#E8DFD3",
    surface: "#FFFFFF",
    surfaceMuted: "#F7F1E8",
    accentSoft: "#FDE7CF",
    accent: "#1CB0F6",
  },
  spacing: (n) => n * 8,
  radius: { sm: 12, md: 12, lg: 20 },
  borderWidth: 2,
  minTapTarget: 52,
  fontSize: { body: 17, heading: 24, display: 34 },
  playfulMode: true,
};
