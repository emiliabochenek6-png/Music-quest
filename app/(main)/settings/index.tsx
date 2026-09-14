import { View, Text, Switch, Pressable, ScrollView, StyleSheet } from "react-native";
import { router } from "expo-router";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/context/ProfileContext";
import { useTheme } from "@/theme/ThemeProvider";

/** Where a profile switch AFTER onboarding happens (see
 * ARCHITECTURE.md section 2.1) — reuses the same profile-picker screen,
 * navigated to directly rather than duplicating its cards here. */
export default function SettingsScreen() {
  const theme = useTheme();
  const { profile, setNarratorEnabled, setSoundEffectsEnabled } = useProfile();
  const { user, signOut } = useAuth();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.cream }}>
      <ScreenHeader title="Ustawienia" onBack={() => router.back()} />
      {/* A plain View here (before the "Konto" section existed) never
          overflowed a real screen — now that it can (a longer list, a
          small phone, larger accessibility text), this needs to actually
          scroll rather than silently clip rows off the bottom. */}
      <ScrollView contentContainerStyle={styles.container}>
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

      {user ? (
        <>
          <View style={styles.row}>
            <Text style={{ color: theme.colors.ink, fontSize: theme.fontSize.body }}>Zalogowano jako</Text>
            <Text style={{ color: theme.colors.muted }} numberOfLines={1}>
              {user.email}
            </Text>
          </View>
          <Pressable onPress={() => void signOut()} style={styles.row}>
            <Text style={{ color: theme.colors.warning, fontSize: theme.fontSize.body }}>Wyloguj się</Text>
          </Pressable>
        </>
      ) : (
        <Pressable onPress={() => router.push("/auth/login")} style={styles.row}>
          <Text style={{ color: theme.colors.ink, fontSize: theme.fontSize.body }}>Konto</Text>
          <Text style={{ color: theme.colors.muted }}>Zaloguj się ›</Text>
        </Pressable>
      )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
