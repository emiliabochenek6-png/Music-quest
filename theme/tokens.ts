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
  };
  spacing: (multiplier: number) => number;
  radius: { sm: number; md: number; lg: number };
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

/** The app's single light theme — this is a kids'-first app, so this
 * keeps the bigger tap targets, generous corner radii, and Lottie reward
 * animations that used to be the "young explorer" half of a dual-mode
 * system before that split was removed. Only used by the handful of
 * screens still on the light theme (Settings, subscription) — the
 * map/lesson family has its own separate dark theme, see
 * theme/darkExerciseTheme.ts. */
export const THEME_TOKENS: ThemeTokens = {
  colors: {
    cream: "#FFF8EE",
    ink: "#1D2B2E",
    primary: "#2A9D8F",
    primaryDark: "#1F6F65",
    warning: "#E76F51",
    success: "#588157",
    muted: "#6B7280",
    border: "#E5E0D5",
    surface: "#FFFFFF",
    surfaceMuted: "#FFF3DF",
  },
  spacing: (n) => n * 10,
  radius: { sm: 12, md: 18, lg: 24 },
  minTapTarget: 56,
  fontSize: { body: 17, heading: 24, display: 34 },
  playfulMode: true,
};
