import { Image, Text, View, StyleSheet } from "react-native";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

export type SoltekExpression = "radosny" | "zaskoczony" | "myslacy" | "zachecajacy" | "glowny";

/** Soltek's real character art — one square, transparent-background PNG
 * per expression, provided by the app's owner (see assets/soltek/ — the
 * emoji placeholder this component used to render is gone). "glowny" is
 * the general-purpose hero pose (no specific mood), used for the welcome
 * modal's own introduction rather than any of the four reaction faces. */
const EXPRESSION_IMAGES: Record<SoltekExpression, ReturnType<typeof require>> = {
  radosny: require("@/assets/soltek/radosny.png"),
  zaskoczony: require("@/assets/soltek/zaskoczony.png"),
  myslacy: require("@/assets/soltek/myslacy.png"),
  zachecajacy: require("@/assets/soltek/zachecajacy.png"),
  glowny: require("@/assets/soltek/glowny.png"),
};

interface SoltekMascotProps {
  expression?: SoltekExpression;
  /** What Soltek says — required, since an avatar with nothing to say
   * isn't really "Soltek talking to you", just a decorative icon. */
  message: string;
  /** "sm" for a compact inline appearance next to exercise feedback, "md"
   * (default) for most full-attention moments, "lg" for a standalone
   * portrait (no speech bubble beside it — see SoltekWelcomeModal's own
   * use) where Soltek himself is the focus. */
  size?: "sm" | "md" | "lg";
  /** Drops the avatar's border/background frame — for a "lg" portrait
   * that's already the sole focus of a full screen (this app's lesson
   * encouragement/streak interstitials), where a frame around him reads
   * as redundant chrome rather than adding anything. Default false keeps
   * every other "lg" usage (e.g. SoltekWelcomeModal, a card inside a
   * modal rather than the whole screen) framed as before. */
  frameless?: boolean;
}

/**
 * Soltek — the app's own guide character (a friendly, music-loving fox
 * in a wizard hat). Renders his real artwork (see EXPRESSION_IMAGES)
 * with `resizeMode: "contain"` inside a rounded-square frame rather than
 * a tight circle — his pose isn't circular (the hat's curled tip, an
 * outstretched hand), so a circular crop would clip him at some
 * expressions but not others; a square frame never does.
 */
export function SoltekMascot({ expression = "radosny", message, size = "md", frameless = false }: SoltekMascotProps) {
  const isSmall = size === "sm";
  const isLarge = size === "lg";

  const avatar = (
    <View
      style={[
        styles.avatarWrap,
        isSmall && styles.avatarWrapSmall,
        isLarge && styles.avatarWrapLarge,
        frameless && styles.avatarWrapFrameless,
      ]}
    >
      <Image source={EXPRESSION_IMAGES[expression]} style={styles.avatarImage} resizeMode="contain" />
    </View>
  );

  if (isLarge) {
    return (
      <View style={styles.stacked}>
        {avatar}
        <View style={styles.bubble}>
          <Text style={[styles.bubbleText, styles.bubbleTextCentered]}>{message}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.row, isSmall && styles.rowSmall]}>
      {avatar}
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
  stacked: {
    alignItems: "center",
    gap: 12,
  },
  avatarWrap: {
    width: 56,
    height: 56,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.accentSoft,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    padding: 4,
  },
  avatarWrapSmall: {
    width: 38,
    height: 38,
    borderRadius: theme.radius.sm,
    padding: 2,
  },
  avatarWrapLarge: {
    width: 160,
    height: 160,
    borderRadius: theme.radius.lg,
    padding: 8,
  },
  avatarWrapFrameless: {
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
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
  bubbleTextCentered: {
    textAlign: "center",
  },
  bubbleTextSmall: {
    fontSize: 12.5,
    lineHeight: 17,
  },
});
