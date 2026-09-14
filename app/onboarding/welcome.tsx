import { Text, View, StyleSheet } from "react-native";
import { router } from "expo-router";
import { DarkButton } from "@/components/exercises/DarkButton";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

/**
 * The very first screen anyone sees — same dark, glowing "kraina" world
 * as the map itself (see app/(main)/map.tsx's own glowBlob/background
 * treatment), so the app reads as one consistent place from the first
 * tap, not a differently-themed splash bolted onto a dark app.
 */
export default function WelcomeScreen() {
  return (
    <View style={styles.root}>
      <View style={styles.glowBlob} />
      <View style={styles.container}>
        <Text style={styles.title}>Music Quest</Text>
        <Text style={styles.subtitle}>Naucz się czytać nuty, rytm i słuch muzyczny — krok po kroku.</Text>
        <View style={{ marginTop: theme.spacing(2), width: "100%" }}>
          <DarkButton label="Zaczynajmy" onPress={() => router.push("/onboarding/profile-picker")} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.cream,
    overflow: "hidden",
  },
  glowBlob: {
    position: "absolute",
    top: -160,
    left: "50%",
    marginLeft: -200,
    width: 400,
    height: 320,
    borderRadius: 220,
    backgroundColor: theme.colors.primary,
    opacity: 0.22,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: theme.fontSize.display,
    fontWeight: "800",
    color: theme.colors.ink,
  },
  subtitle: {
    marginTop: 12,
    fontSize: theme.fontSize.body,
    color: theme.colors.muted,
    textAlign: "center",
  },
});
