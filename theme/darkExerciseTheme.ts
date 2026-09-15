import { THEME_TOKENS, type ThemeTokens } from "@/theme/tokens";

/**
 * Historical name for what is now just THEME_TOKENS — the app moved from
 * a light/dark split (this constant was the dark-cosmic "kraina" palette
 * every exercise/map/lesson screen imported) to ONE Duolingo-inspired
 * light theme used everywhere (see theme/tokens.ts's own doc). Kept as a
 * re-export, not deleted, purely so the ~70 files across components/
 * exercises and app/(main) that already `import { DARK_EXERCISE_THEME as
 * theme }` keep working unchanged — every one of them picks up the new
 * palette automatically through this same alias.
 */
export const DARK_EXERCISE_THEME: ThemeTokens = THEME_TOKENS;
