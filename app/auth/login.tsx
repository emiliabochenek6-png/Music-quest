import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { DarkButton } from "@/components/exercises/DarkButton";
import { useAuth } from "@/context/AuthContext";
import { translateAuthError } from "@/lib/supabase/authErrors";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

type Status = { kind: "idle" } | { kind: "submitting" } | { kind: "error"; message: string } | { kind: "reset-sent" };

/**
 * The app's own start screen now — same dark, glowing "kraina" world
 * every map/lesson/daily-challenge screen already lives in (see
 * app/(main)/map.tsx's own doc for the glowBlob/background treatment
 * this mirrors exactly). Login is mandatory (see app/index.tsx's own
 * doc): this is the very first thing an unauthenticated player sees,
 * carrying the "Music Quest" branding a separate welcome screen used to
 * own, since that screen no longer exists — there's nothing to skip
 * past, so this has no back button either (a signed-out player only
 * ever reaches this screen with nothing behind it to go back to,
 * whether on first launch or right after signing out from Settings).
 * Success is otherwise implicit: AuthContext's own onAuthStateChange
 * listener picks up the new session the moment `signIn` resolves — this
 * screen just needs to replace itself with the map.
 */
export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { signIn, resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function handleSubmit() {
    if (!email || !password) return;
    setStatus({ kind: "submitting" });
    try {
      await signIn(email.trim(), password);
      router.replace("/(main)/map");
    } catch (error) {
      setStatus({ kind: "error", message: translateAuthError(error) });
    }
  }

  async function handleForgotPassword() {
    if (!email) {
      setStatus({ kind: "error", message: "Wpisz najpierw swój e-mail powyżej, żeby wysłać link do resetu hasła." });
      return;
    }
    setStatus({ kind: "submitting" });
    try {
      await resetPassword(email.trim());
      setStatus({ kind: "reset-sent" });
    } catch (error) {
      setStatus({ kind: "error", message: translateAuthError(error) });
    }
  }

  const isSubmitting = status.kind === "submitting";

  return (
    <View style={styles.root}>
      <View style={styles.glowBlob} />

      <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top + 32 }]} keyboardShouldPersistTaps="handled">
        <Text style={styles.brand}>Music Quest</Text>
        <Text style={styles.tagline}>Naucz się czytać nuty, rytm i słuch muzyczny — krok po kroku.</Text>

        <Text style={styles.title}>Zaloguj się</Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="E-mail"
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          editable={!isSubmitting}
          style={styles.input}
          placeholderTextColor={theme.colors.muted}
          accessibilityLabel="E-mail"
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Hasło"
          secureTextEntry
          autoComplete="password"
          editable={!isSubmitting}
          style={styles.input}
          placeholderTextColor={theme.colors.muted}
          accessibilityLabel="Hasło"
        />

        {status.kind === "error" && <Text style={styles.errorText}>{status.message}</Text>}
        {status.kind === "reset-sent" && (
          <Text style={styles.infoText}>Wysłaliśmy link do resetu hasła na {email} — sprawdź skrzynkę.</Text>
        )}

        <View style={{ marginTop: theme.spacing(1), width: "100%" }}>
          <DarkButton label={isSubmitting ? "Loguję…" : "Zaloguj się"} onPress={handleSubmit} disabled={isSubmitting || !email || !password} />
        </View>

        <Pressable onPress={handleForgotPassword} disabled={isSubmitting} style={styles.linkButton}>
          <Text style={styles.mutedLink}>Zapomniałeś hasła?</Text>
        </Pressable>

        <Pressable onPress={() => router.push("/auth/signup")} disabled={isSubmitting} style={styles.linkButton}>
          <Text style={styles.primaryLink}>Nie masz konta? Załóż je</Text>
        </Pressable>
      </ScrollView>
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
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 12,
  },
  brand: {
    fontSize: theme.fontSize.display,
    fontWeight: "800",
    color: theme.colors.ink,
    textAlign: "center",
  },
  tagline: {
    marginTop: 8,
    marginBottom: 16,
    fontSize: theme.fontSize.body,
    color: theme.colors.muted,
    textAlign: "center",
  },
  title: {
    alignSelf: "flex-start",
    fontSize: theme.fontSize.heading,
    fontWeight: "800",
    color: theme.colors.ink,
    marginBottom: 4,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.sm,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: theme.colors.ink,
  },
  errorText: {
    color: theme.colors.warning,
  },
  infoText: {
    color: theme.colors.ink,
  },
  linkButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
  mutedLink: {
    color: theme.colors.muted,
    fontSize: theme.fontSize.body * 0.9,
  },
  primaryLink: {
    color: theme.colors.accent,
    fontSize: theme.fontSize.body * 0.9,
    fontWeight: "700",
  },
});
