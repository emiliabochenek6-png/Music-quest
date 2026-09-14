import { Pressable, Text, StyleSheet } from "react-native";
import type { GestureResponderEvent } from "react-native";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

interface DarkButtonProps {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  /** Overrides the default body-size label text — used for icon-only
   * buttons (e.g. the 🔊 replay button) that need to read much bigger
   * than ordinary button copy. */
  fontSize?: number;
  /** Forces a fixed square tap target instead of the default text-sized
   * pill — pairs with `fontSize` for icon-only buttons. */
  size?: number;
}

/** components/ui/Button's own dark-cosmic twin — that shared primitive
 * still serves the light dual-mode screens (paywall, onboarding,
 * settings), which this pass leaves alone; exercise screens live inside
 * the dark map/levels visual world instead (see
 * theme/darkExerciseTheme.ts's own doc), so they get their own fixed-dark
 * button rather than threading a theme override through the shared one. */
export function DarkButton({ label, onPress, variant = "primary", disabled = false, fontSize, size }: DarkButtonProps) {
  const backgroundColor = variant === "primary" ? theme.colors.primary : theme.colors.surfaceMuted;
  const textColor = variant === "primary" ? "#FFFFFF" : theme.colors.ink;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor,
          borderRadius: size ? size / 2 : theme.radius.md,
          minHeight: size ?? theme.minTapTarget,
          minWidth: size,
          paddingHorizontal: size ? 0 : theme.spacing(2),
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
          shadowColor: variant === "primary" ? theme.colors.primary : "transparent",
        },
      ]}
    >
      <Text style={{ color: textColor, fontSize: fontSize ?? theme.fontSize.body, fontWeight: "600" }} allowFontScaling maxFontSizeMultiplier={1.4}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
});
