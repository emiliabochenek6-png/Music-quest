import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { THEME_TOKENS, type ThemeTokens } from "@/theme/tokens";

const ThemeContext = createContext<ThemeTokens | null>(null);

/** One fixed theme for the whole (light-themed) part of the app — kept as
 * a context/provider (rather than importing THEME_TOKENS directly) so
 * every screen keeps using the same `useTheme()` call site regardless of
 * how theming works under the hood. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return <ThemeContext.Provider value={THEME_TOKENS}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeTokens {
  const tokens = useContext(ThemeContext);
  if (!tokens) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return tokens;
}
