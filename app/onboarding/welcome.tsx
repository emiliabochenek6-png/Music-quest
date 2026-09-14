import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/theme/ThemeProvider";

export default function WelcomeScreen() {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.cream }]}>
      <Text style={[styles.title, { fontSize: theme.fontSize.display, color: theme.colors.ink }]}>
        Music Quest
      </Text>
      <Text style={[styles.subtitle, { fontSize: theme.fontSize.body, color: theme.colors.muted }]}>
        Naucz się czytać nuty, rytm i słuch muzyczny — krok po kroku.
      </Text>
      <Button label="Zaczynajmy" onPress={() => router.push("/onboarding/profile-picker")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },
  title: {
    fontWeight: "800",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 24,
  },
});
