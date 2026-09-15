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

/** The app's single theme — a Duolingo-inspired "playful storybook on
 * white paper" look: flat white canvas, one saturated green carrying
 * every primary action and "correct" moment, a blue companion hue for
 * links/secondary actions, and thick 2px borders giving buttons and
 * cards a sticker-pressed-onto-the-page feel rather than a flat UI
 * control. Deliberately ONE theme for the whole app now — this used to
 * be split between a light THEME_TOKENS (Settings/subscription) and a
 * separate dark DARK_EXERCISE_THEME (map/lesson family, see
 * theme/darkExerciseTheme.ts); that file now just re-exports this same
 * object under its old name so every one of the ~70 components that
 * already import DARK_EXERCISE_THEME picks up this palette automatically,
 * no per-file changes needed for colors/spacing/radius. */
export const THEME_TOKENS: ThemeTokens = {
  colors: {
    cream: "#FFFFFF",
    ink: "#4B4B4B",
    primary: "#58CC02",
    primaryDark: "#4AAD02",
    warning: "#FF4B4B",
    success: "#58CC02",
    muted: "#777777",
    border: "#AFAFAF",
    surface: "#FFFFFF",
    surfaceMuted: "#F7F7F7",
    accentSoft: "#D7FFB8",
    accent: "#1CB0F6",
  },
  spacing: (n) => n * 8,
  radius: { sm: 12, md: 12, lg: 20 },
  borderWidth: 2,
  minTapTarget: 52,
  fontSize: { body: 17, heading: 24, display: 34 },
  playfulMode: true,
};
