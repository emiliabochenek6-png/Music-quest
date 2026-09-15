import { Pressable, Text, StyleSheet } from "react-native";
import type { GestureResponderEvent } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";

interface ButtonProps {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

/** The one button primitive every screen uses — Duolingo's own two button
 * shapes (see theme/tokens.ts's own doc on the overall look): primary is
 * a flat, borderless green fill ("color alone carries the button" — no
 * shadow, no border, just saturation), secondary is the "outlined ghost"
 * twin — transparent fill, a thick border, colored text — never a
 * filled-but-muted middle ground. Sizing/radius/border weight all come
 * from theme tokens. */
export function Button({ label, onPress, variant = "primary", disabled = false }: ButtonProps) {
  const theme = useTheme();
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
          borderRadius: theme.radius.md,
          borderWidth: isPrimary ? 0 : theme.borderWidth,
          borderColor: theme.colors.border,
          minHeight: theme.minTapTarget,
          paddingHorizontal: theme.spacing(2),
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
      ]}
    >
      <Text
        style={{ color: textColor, fontSize: theme.fontSize.body, fontWeight: "700" }}
        allowFontScaling
        maxFontSizeMultiplier={1.4}
      >
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
