import { View, Text, Switch, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useProfile } from "@/context/ProfileContext";
import { useTheme } from "@/theme/ThemeProvider";

/** Where a profile switch AFTER onboarding happens (see
 * ARCHITECTURE.md section 2.1) — reuses the same profile-picker screen,
 * navigated to directly rather than duplicating its cards here. */
export default function SettingsScreen() {
  const theme = useTheme();
  const { profile, setNarratorEnabled, setSoundEffectsEnabled } = useProfile();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.cream }}>
      <ScreenHeader title="Ustawienia" onBack={() => router.back()} />
      <View style={styles.container}>
      <Pressable onPress={() => router.push("/onboarding/profile-picker")} style={styles.row}>
        <Text style={{ color: theme.colors.ink, fontSize: theme.fontSize.body }}>Zmień profil</Text>
        <Text style={{ color: theme.colors.muted }}>{profile.mode === "young-explorer" ? "Młody Odkrywca" : "Hobbysta"}</Text>
      </Pressable>

      <View style={styles.row}>
        <Text style={{ color: theme.colors.ink, fontSize: theme.fontSize.body }}>Lektor</Text>
        <Switch value={profile.narratorEnabled} onValueChange={setNarratorEnabled} />
      </View>

      <View style={styles.row}>
        <Text style={{ color: theme.colors.ink, fontSize: theme.fontSize.body }}>Dźwięki</Text>
        <Switch value={profile.soundEffectsEnabled} onValueChange={setSoundEffectsEnabled} />
      </View>

      <Pressable onPress={() => router.push("/(main)/settings/subscription-status")} style={styles.row}>
        <Text style={{ color: theme.colors.ink, fontSize: theme.fontSize.body }}>Subskrypcja</Text>
        <Text style={{ color: theme.colors.muted }}>›</Text>
      </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#00000020",
  },
});
