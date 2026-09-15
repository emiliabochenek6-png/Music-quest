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

/** components/ui/Button's own twin for exercise/map/lesson screens — same
 * component split for historical reasons (see theme/darkExerciseTheme.ts's
 * own doc: DARK_EXERCISE_THEME is now just an alias for the same theme
 * Button.tsx reads), so it renders identically: primary is a flat green
 * fill with no border or glow, secondary is the outlined "ghost" twin. No
 * shadow/glow on either — Duolingo's own surfaces are flat sticker fills,
 * never gradients or glass effects. */
export function DarkButton({ label, onPress, variant = "primary", disabled = false, fontSize, size }: DarkButtonProps) {
  const isPrimary = variant === "primary";
  const textColor = isPrimary ? "#FFFFFF" : theme.colors.accent;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: isPrimary ? theme.colors.primary : "transparent",
          borderRadius: size ? size / 2 : theme.radius.md,
          borderWidth: isPrimary ? 0 : theme.borderWidth,
          borderColor: theme.colors.border,
          minHeight: size ?? theme.minTapTarget,
          minWidth: size,
          paddingHorizontal: size ? 0 : theme.spacing(2),
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
      ]}
    >
      <Text style={{ color: textColor, fontSize: fontSize ?? theme.fontSize.body, fontWeight: "700" }} allowFontScaling maxFontSizeMultiplier={1.4}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
  },
});
