import type { ReactNode } from "react";
import { Pressable, Text } from "react-native";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

interface OptionButtonProps {
  label: string;
  /** Overrides the rendered content (e.g. an icon + label) while `label`
   * still sets the accessible name. */
  children?: ReactNode;
  selected: boolean;
  correct: boolean;
  incorrect: boolean;
  disabled: boolean;
  onPress: () => void;
}

/** Shared answer-choice button for the 9 Wioska Nut exercise types — ported
 * from the web app's OptionButton.tsx, state-color logic unchanged
 * (selected/correct/incorrect are independent booleans, same precedence:
 * once checked, correct/incorrect override the plain "selected" look),
 * colors sourced from this app's own dual-mode theme tokens rather than
 * the web app's Tailwind emerald/rose classes. */
export function OptionButton({ label, children, selected, correct, incorrect, disabled, onPress }: OptionButtonProps) {

  let borderColor = theme.colors.border;
  let backgroundColor = theme.colors.surface;
  let textColor = theme.colors.ink;
  if (correct) {
    borderColor = theme.colors.success;
    backgroundColor = theme.colors.surfaceMuted;
    textColor = theme.colors.success;
  } else if (incorrect) {
    borderColor = theme.colors.warning;
    backgroundColor = theme.colors.surfaceMuted;
    textColor = theme.colors.warning;
  } else if (selected) {
    borderColor = theme.colors.primary;
    backgroundColor = theme.colors.surfaceMuted;
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={children ? label : undefined}
      accessibilityState={{ disabled, selected }}
      style={({ pressed }) => ({
        borderWidth: 2,
        borderColor,
        backgroundColor,
        borderRadius: theme.radius.md,
        paddingHorizontal: theme.spacing(2),
        paddingVertical: theme.spacing(1.5),
        minHeight: theme.minTapTarget,
        // flexShrink lets this button give up width before it forces a
        // sibling off the edge of a narrow screen — the row it sits in
        // wraps too (see each exercise's own layout), but this is the
        // second line of defense for a single label too long to fit at
        // its natural width even alone.
        flexShrink: 1,
        alignItems: "center",
        justifyContent: "center",
        opacity: disabled && !correct && !incorrect ? 0.6 : pressed ? 0.85 : 1,
      })}
    >
      {children ?? (
        <Text style={{ color: textColor, fontSize: theme.fontSize.body, fontWeight: "600" }} allowFontScaling maxFontSizeMultiplier={1.4}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}
