import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { DarkButton } from "@/components/exercises/DarkButton";
import { useAuth } from "@/context/AuthContext";
import { translateAuthError } from "@/lib/supabase/authErrors";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

type Status = { kind: "idle" } | { kind: "submitting" } | { kind: "error"; message: string } | { kind: "done" };

const MIN_PASSWORD_LENGTH = 6;

/**
 * "Ustaw nowe hasło": where the link in the password-reset e-mail leads. Supabase brings the player back to the app already signed in
 * with a short recovery session (see context/AuthContext.tsx's `isRecovering`); this screen only asks for the new password twice and
 * saves it. Opened any other way (no recovery in progress) it explains where the link comes from and sends the player to the login.
 */
export default function ResetPasswordScreen() {
  const { isRecovering, updatePassword, signOut } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const isSubmitting = status.kind === "submitting";

  async function handleSubmit() {
    if (password.length < MIN_PASSWORD_LENGTH) {
      setStatus({ kind: "error", message: `Hasło musi mieć co najmniej ${MIN_PASSWORD_LENGTH} znaków.` });
      return;
    }
    if (password !== confirmPassword) {
      setStatus({ kind: "error", message: "Hasła nie są takie same. Wpisz to samo hasło dwa razy." });
      return;
    }
    setStatus({ kind: "submitting" });
    try {
      await updatePassword(password);
      setStatus({ kind: "done" });
    } catch (error) {
      const raw = error instanceof Error ? error.message.toLowerCase() : "";
      setStatus({
        kind: "error",
        message: raw.includes("session") ? "Ten link do resetu hasła wygasł albo został już użyty. Wróć do logowania i wyślij nowy." : raw.includes("same") ? "Nowe hasło musi być inne niż poprzednie." : translateAuthError(error),
      });
    }
  }

  async function backToLogin() {
    try {
      await signOut();
    } catch {
      // Nothing was signed in: the login screen is what we want anyway.
    }
    router.replace("/auth/login");
  }

  if (status.kind === "done") {
    return (
      <AuthLayout>
        <View style={styles.container}>
          <Text style={styles.title}>Hasło zmienione</Text>
          <Text style={styles.subtitle}>Od teraz logujesz się nowym hasłem. Miłej nauki z Solfkiem!</Text>
          <View style={{ marginTop: theme.spacing(1), width: "100%" }}>
            <DarkButton label="Przejdź do gry" onPress={() => router.replace("/(main)/map")} testID="reset-done" />
          </View>
        </View>
      </AuthLayout>
    );
  }

  if (!isRecovering) {
    return (
      <AuthLayout>
        <View style={styles.container}>
          <Text style={styles.title}>Ustaw nowe hasło</Text>
          <Text style={styles.subtitle}>Ten ekran otwiera się z linku w e-mailu. Na ekranie logowania wybierz „Nie pamiętasz hasła?”, a wyślemy Ci taki link.</Text>
          <View style={{ marginTop: theme.spacing(1), width: "100%" }}>
            <DarkButton label="Wróć do logowania" onPress={() => router.replace("/auth/login")} />
          </View>
        </View>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <View style={styles.container}>
        <Text style={styles.title}>Ustaw nowe hasło</Text>
        <Text style={styles.subtitle}>Wpisz nowe hasło (co najmniej {MIN_PASSWORD_LENGTH} znaków) dwa razy.</Text>

        <PasswordInput
          value={password}
          onChangeText={setPassword}
          placeholder="Nowe hasło"
          autoComplete="new-password"
          editable={!isSubmitting}
          style={styles.input}
          placeholderTextColor={theme.colors.muted}
          accessibilityLabel="Nowe hasło"
        />
        <PasswordInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Powtórz nowe hasło"
          autoComplete="new-password"
          editable={!isSubmitting}
          style={styles.input}
          placeholderTextColor={theme.colors.muted}
          accessibilityLabel="Powtórz nowe hasło"
        />

        {status.kind === "error" && <Text style={styles.errorText}>{status.message}</Text>}

        <View style={{ marginTop: theme.spacing(1), width: "100%" }}>
          <DarkButton label={isSubmitting ? "Zapisuję…" : "Zapisz nowe hasło"} onPress={handleSubmit} disabled={isSubmitting || !password || !confirmPassword} testID="reset-submit" />
        </View>

        <Pressable onPress={backToLogin} disabled={isSubmitting} style={styles.linkButton}>
          <Text style={styles.mutedLink}>Anuluj i wróć do logowania</Text>
        </Pressable>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", gap: 12 },
  title: { alignSelf: "flex-start", fontSize: theme.fontSize.heading, fontWeight: "800", color: theme.colors.ink },
  subtitle: { alignSelf: "flex-start", fontSize: theme.fontSize.body, color: theme.colors.muted, lineHeight: 22 },
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
  errorText: { color: theme.colors.warning, alignSelf: "flex-start" },
  linkButton: { alignItems: "center", paddingVertical: 8 },
  mutedLink: { color: theme.colors.muted, fontSize: theme.fontSize.body * 0.9 },
});
