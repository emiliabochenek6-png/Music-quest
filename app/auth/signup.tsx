import { useState } from "react";
import { Pressable, Text, TextInput, View, StyleSheet } from "react-native";
import { router } from "expo-router";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { DarkButton } from "@/components/exercises/DarkButton";
import { useAuth } from "@/context/AuthContext";
import { translateAuthError } from "@/lib/supabase/authErrors";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import { GlyphText } from "@/components/icons/GlyphText";

type Status = { kind: "idle" } | { kind: "submitting" } | { kind: "error"; message: string } | { kind: "confirm-email" };

const MIN_PASSWORD_LENGTH = 6;

/**
 * Account creation — see app/auth/login.tsx's own doc for the broader
 * context and why this shares its exact dark-cosmic "kraina" look. Reached
 * by pushing from login (see login.tsx's own "Nie masz konta?" link), so
 * unlike login itself this DOES have a real back target and keeps its
 * back button. Whether `signUp` also logs the player in immediately
 * depends entirely on this Supabase project's own "Confirm email"
 * setting (see AuthContext's own doc on `signedInImmediately`) — when
 * it's off, this can go straight to the map same as a real login; when
 * it's on, this shows a "check your email" state instead, since no
 * session exists yet for AuthContext's onAuthStateChange listener to
 * pick up until that link is used.
 */
export default function SignupScreen() {
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
      const { signedInImmediately } = await signUp(email.trim(), password);
      if (signedInImmediately) {
        router.replace("/(main)/map");
      } else {
        setStatus({ kind: "confirm-email" });
      }
    } catch (error) {
      setStatus({ kind: "error", message: translateAuthError(error) });
    }
  }

  const isSubmitting = status.kind === "submitting";

  return (
    <AuthLayout onBack={() => router.back()}>
      {status.kind === "confirm-email" ? (
        <View style={styles.container}>
          <GlyphText style={{ fontSize: 48 }}>📬</GlyphText>
          <Text style={styles.title}>Sprawdź swój e-mail</Text>
          <Text style={styles.subtitle}>
            Wysłaliśmy link potwierdzający na {email}. Kliknij go, żeby dokończyć zakładanie konta — potem po prostu zaloguj się w
            apce.
          </Text>
          <View style={{ marginTop: theme.spacing(1), width: "100%" }}>
            <DarkButton label="Wróć do logowania" onPress={() => router.replace("/auth/login")} />
          </View>
        </View>
      ) : (
        <View style={styles.container}>
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
          <PasswordInput
            value={password}
            onChangeText={setPassword}
            placeholder="Hasło (min. 6 znaków)"
            autoComplete="new-password"
            editable={!isSubmitting}
            style={styles.input}
            placeholderTextColor={theme.colors.muted}
            accessibilityLabel="Hasło"
          />
          <PasswordInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Powtórz hasło"
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

          <Pressable onPress={() => router.replace("/auth/login")} disabled={isSubmitting} style={styles.linkButton}>
            <Text style={styles.primaryLink}>Masz już konto? Zaloguj się</Text>
          </Pressable>
        </View>
      )}
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  container: {
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
    color: "#C2570A",
    fontSize: theme.fontSize.body * 0.9,
    fontWeight: "700",
  },
});
