import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { DarkButton } from "@/components/exercises/DarkButton";
import { useAuth } from "@/context/AuthContext";
import { translateAuthError } from "@/lib/supabase/authErrors";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

type Status = { kind: "idle" } | { kind: "submitting" } | { kind: "error"; message: string } | { kind: "confirm-email" };

const MIN_PASSWORD_LENGTH = 6;

/**
 * Account creation — see app/auth/login.tsx's own doc for the broader
 * context and why this shares its exact dark-cosmic "kraina" look
 * (same DARK_EXERCISE_THEME/glowBlob/back-button treatment, not a
 * separately-themed settings detour). Supabase's own project default
 * requires confirming the address before a session is issued, so
 * `signUp` succeeding does NOT necessarily mean the player is logged in
 * yet — this screen shows a "check your email" state instead of
 * navigating away, and AuthContext's own onAuthStateChange listener
 * picks up the real session once the confirmation link is used
 * (whenever that happens — this screen doesn't wait around for it).
 */
export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const { from } = useLocalSearchParams<{ from?: string }>();
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function handleSubmit() {
    if (!email || !password) return;
    if (password !== confirmPassword) {
      setStatus({ kind: "error", message: "Hasła się nie zgadzają." });
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setStatus({ kind: "error", message: `Hasło musi mieć co najmniej ${MIN_PASSWORD_LENGTH} znaków.` });
      return;
    }
    setStatus({ kind: "submitting" });
    try {
      await signUp(email.trim(), password);
      setStatus({ kind: "confirm-email" });
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

      {status.kind === "confirm-email" ? (
        <View style={styles.container}>
          <Text style={{ fontSize: 48 }}>📬</Text>
          <Text style={styles.title}>Sprawdź swój e-mail</Text>
          <Text style={styles.subtitle}>
            Wysłaliśmy link potwierdzający na {email}. Kliknij go, żeby dokończyć zakładanie konta — potem po prostu zaloguj się w
            apce.
          </Text>
          <View style={{ marginTop: theme.spacing(1), width: "100%" }}>
            <DarkButton
              label="Wróć do logowania"
              onPress={() => router.replace({ pathname: "/auth/login", params: from ? { from } : {} })}
            />
          </View>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Załóż konto</Text>
          <Text style={styles.subtitle}>
            Konto pozwala odzyskać postęp na innym urządzeniu — nic z tego, co już zrobiłaś/eś na tym telefonie, nie zniknie.
          </Text>

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
            placeholder="Hasło (min. 6 znaków)"
            secureTextEntry
            autoComplete="new-password"
            editable={!isSubmitting}
            style={styles.input}
            placeholderTextColor={theme.colors.muted}
            accessibilityLabel="Hasło"
          />
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Powtórz hasło"
            secureTextEntry
            autoComplete="new-password"
            editable={!isSubmitting}
            style={styles.input}
            placeholderTextColor={theme.colors.muted}
            accessibilityLabel="Powtórz hasło"
          />

          {status.kind === "error" && <Text style={styles.errorText}>{status.message}</Text>}

          <View style={{ marginTop: theme.spacing(1), width: "100%" }}>
            <DarkButton
              label={isSubmitting ? "Zakładam konto…" : "Załóż konto"}
              onPress={handleSubmit}
              disabled={isSubmitting || !email || !password || !confirmPassword}
            />
          </View>

          <Pressable
            onPress={() => router.replace({ pathname: "/auth/login", params: from ? { from } : {} })}
            disabled={isSubmitting}
            style={styles.linkButton}
          >
            <Text style={styles.primaryLink}>Masz już konto? Zaloguj się</Text>
          </Pressable>
        </ScrollView>
      )}
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
  linkButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
  primaryLink: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.body * 0.9,
    fontWeight: "700",
  },
});
