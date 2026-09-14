import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { useProfile } from "@/context/ProfileContext";
import { getThemeTokens, type ThemeTokens } from "@/theme/tokens";

const ThemeContext = createContext<ThemeTokens | null>(null);

/** Derives the active theme from ProfileContext, so every screen/component
 * gets the right dual-mode tokens without each one separately reading
 * ProfileContext and re-deriving them — one lookup point, mounted once at
 * the root (see app/_layout.tsx). */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const { profile } = useProfile();
  const tokens = useMemo(() => getThemeTokens(profile.mode), [profile.mode]);
  return <ThemeContext.Provider value={tokens}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeTokens {
  const tokens = useContext(ThemeContext);
  if (!tokens) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return tokens;
}
