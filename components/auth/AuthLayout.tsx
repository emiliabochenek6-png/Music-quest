import type { ReactNode } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ExerciseAccentProvider } from "@/context/ExerciseAccentContext";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

const BACKGROUND_PHONE = require("@/assets/backgrounds/logowanie-tlo-telefon.jpg");
const BACKGROUND_LAPTOP = require("@/assets/backgrounds/logowanie-tlo-laptop.jpg");

/** Solfek's own orange for the sign-in buttons (a touch deeper than the mascot's fill so white text stays readable). */
const SOLTEK_ORANGE = "#D9690A";
const CARD_MAX_WIDTH = 420;

interface AuthLayoutProps {
  children: ReactNode;
  /** Shows a back arrow in the top-left corner when given. */
  onBack?: () => void;
}

/** The look shared by the login and sign-up screens: Solfek's warm,
 * rays-and-hills background with the form on a cream card sitting in the
 * calm part of the picture. Two pictures: a tall one for a phone (Solfek
 * on top, the card below him) and a wide one for a laptop (Solfek on the
 * left, the card on the right); which one shows follows the window's own
 * shape, so a narrow browser window on a laptop gets the phone layout too. */
export function AuthLayout({ children, onBack }: AuthLayoutProps) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const portrait = width < height;

  return (
    <View style={styles.root}>
      {/* Explicit 100%/100% on top of absoluteFill — see the same note in app/(main)/world/[worldId].tsx: without it react-native-web draws the picture at its own pixel size. */}
      <Image
        source={portrait ? BACKGROUND_PHONE : BACKGROUND_LAPTOP}
        resizeMode="cover"
        style={[StyleSheet.absoluteFill, { width: "100%", height: "100%" }]}
        accessibilityIgnoresInvertColors
      />

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: portrait ? "flex-start" : "center",
          alignItems: portrait ? "center" : "flex-end",
          // Phone: the card starts below Solfek (he fills the top ~40%). Laptop: the card sits in the calm right-hand part.
          paddingTop: portrait ? Math.max(insets.top + 24, height * 0.4) : insets.top + 24,
          paddingBottom: insets.bottom + 24,
          paddingHorizontal: portrait ? 16 : width * 0.08,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <ExerciseAccentProvider color={SOLTEK_ORANGE}>
          <View style={[styles.card, { width: Math.min(CARD_MAX_WIDTH, width - 32) }]}>{children}</View>
        </ExerciseAccentProvider>
      </ScrollView>

      {onBack && (
        <Pressable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Wstecz"
          hitSlop={12}
          style={[styles.backButton, { top: insets.top + 12 }]}
        >
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFE8C8",
    overflow: "hidden",
  },
  card: {
    gap: 12,
    padding: 24,
    borderRadius: 28,
    backgroundColor: "#FFF6E8",
    borderWidth: 2,
    borderColor: "#F4C98F",
    shadowColor: "#C9531A",
    shadowOpacity: 0.25,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  backButton: {
    position: "absolute",
    left: 16,
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    backgroundColor: "#FFF6E8",
    borderWidth: 2,
    borderColor: "#F4C98F",
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    fontSize: 20,
    color: theme.colors.ink,
  },
});
