import { Text, View, StyleSheet } from "react-native";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

export type SoltekExpression = "radosny" | "zaskoczony" | "myslacy" | "zachecajacy";

/** A small corner badge on top of the avatar hinting at Soltek's current
 * mood — standing in for the real four-expression artwork (see this
 * component's own top-of-file doc) until that's available; swap this out
 * once real per-expression sprites exist instead of layering a badge
 * over one fixed avatar. */
const EXPRESSION_BADGE: Record<SoltekExpression, string> = {
  radosny: "✨",
  zaskoczony: "❓",
  myslacy: "💭",
  zachecajacy: "💪",
};

interface SoltekMascotProps {
  expression?: SoltekExpression;
  /** What Soltek says — required, since an avatar with nothing to say
   * isn't really "Soltek talking to you", just a decorative icon. */
  message: string;
  /** "sm" for a compact inline appearance next to exercise feedback,
   * "md" (default) for the welcome modal and other full-attention
   * moments. */
  size?: "sm" | "md";
}

/**
 * Soltek — the app's own guide character (a friendly, music-loving fox
 * in a wizard hat, per the reference sheet the app's design is now based
 * on). PLACEHOLDER AVATAR: real character art (the four expressions —
 * radosny/zaskoczony/myślący/zachęcający — shown on the reference sheet)
 * hasn't been exported as app-ready image assets yet, so this renders a
 * 🦊 emoji in a themed badge instead, with a small corner emoji hinting
 * at the current expression — swap the avatar View's contents for a real
 * <Image> per expression once those PNGs exist, everything else here
 * (the speech-bubble layout, the props contract) stays the same.
 */
export function SoltekMascot({ expression = "radosny", message, size = "md" }: SoltekMascotProps) {
  const isSmall = size === "sm";
  return (
    <View style={[styles.row, isSmall && styles.rowSmall]}>
      <View style={[styles.avatarWrap, isSmall && styles.avatarWrapSmall]}>
        <Text style={{ fontSize: isSmall ? 22 : 34 }}>🦊</Text>
        <View style={styles.badge}>
          <Text style={{ fontSize: isSmall ? 9 : 11 }}>{EXPRESSION_BADGE[expression]}</Text>
        </View>
      </View>
      <View style={[styles.bubble, isSmall && styles.bubbleSmall]}>
        <Text style={[styles.bubbleText, isSmall && styles.bubbleTextSmall]}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  rowSmall: {
    gap: 8,
  },
  avatarWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.accentSoft,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarWrapSmall: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  badge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  bubble: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing(1.5),
  },
  bubbleSmall: {
    padding: theme.spacing(1.25),
    borderRadius: theme.radius.sm,
  },
  bubbleText: {
    fontSize: 13.5,
    fontWeight: "600",
    color: theme.colors.ink,
    lineHeight: 19,
  },
  bubbleTextSmall: {
    fontSize: 12.5,
    lineHeight: 17,
  },
});
