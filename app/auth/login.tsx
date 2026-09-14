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
 * Email + password sign-in — same dark, glowing "kraina" world every
 * map/lesson/daily-challenge screen already lives in (see app/(main)/
 * map.tsx's own doc for the glowBlob/background treatment this mirrors
 * exactly — DARK_EXERCISE_THEME.colors.cream IS that same "#0b0620"
 * background, just accessed through the token this file's sibling
 * screens already use, so this reads as the SAME world, not a
 * differently-themed "account settings" detour). Reached from Settings'
 * own "Konto" row (see app/(main)/settings/index.tsx), NEVER from
 * onboarding: this app is fully playable without an account, an account
 * only exists to carry progress between devices. Success is entirely
 * implicit: AuthContext's own onAuthStateChange listener picks up the
 * new session the moment `signIn` resolves, so this screen just needs
 * to navigate back — it doesn't own any post-login state itself.
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
      router.back();
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
      <View style={[styles.headerRow, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Wstecz" hitSlop={12} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Zaloguj się</Text>
        <Text style={styles.subtitle}>Zaloguj się, żeby ten sam postęp był widoczny na każdym urządzeniu.</Text>

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
  headerRow: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    fontSize: 20,
    color: theme.colors.ink,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 12,
  },
  title: {
    fontSize: theme.fontSize.heading,
    fontWeight: "800",
    color: theme.colors.ink,
    marginTop: 8,
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: theme.fontSize.body * 0.9,
    marginBottom: 8,
  },
  input: {
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
    color: theme.colors.primary,
    fontSize: theme.fontSize.body * 0.9,
    fontWeight: "700",
  },
});
