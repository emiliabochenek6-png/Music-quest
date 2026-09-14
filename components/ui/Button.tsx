import { Pressable, Text, StyleSheet } from "react-native";
import type { GestureResponderEvent } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";

interface ButtonProps {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

/** The one button primitive every screen uses — dual-mode sizing/radius
 * comes entirely from theme tokens (min tap target, corner radius, font
 * size), so a screen never branches on ProfileMode itself just to render a
 * button correctly. */
export function Button({ label, onPress, variant = "primary", disabled = false }: ButtonProps) {
  const theme = useTheme();
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
          borderRadius: theme.radius.md,
          minHeight: theme.minTapTarget,
          paddingHorizontal: theme.spacing(2),
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
      ]}
    >
      <Text
        style={{ color: textColor, fontSize: theme.fontSize.body, fontWeight: "600" }}
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
