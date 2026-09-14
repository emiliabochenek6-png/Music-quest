import { Pressable, Text, View, StyleSheet } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
import type { ProfileMode } from "@/types/content";

interface ProfilePickerCardProps {
  mode: ProfileMode;
  title: string;
  subtitle: string;
  onPress: (mode: ProfileMode) => void;
}

/** Deliberately NOT pre-selected — see ARCHITECTURE.md section 2.1: the
 * profile choice is a conscious pick at first launch, never guessed from
 * device signals (age isn't knowable, and guessing wrong reads as the app
 * being condescending either direction). Both cards render identically
 * regardless of which mode is currently active elsewhere in the app —
 * this screen exists precisely to choose that, so it can't yet read
 * `useTheme()`'s dual-mode variant for itself. */
export function ProfilePickerCard({ mode, title, subtitle, onPress }: ProfilePickerCardProps) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={() => onPress(mode)}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [
        styles.card,
        {
          borderRadius: theme.radius.lg,
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <Text style={styles.emoji}>{mode === "young-explorer" ? "🦉" : "🎹"}</Text>
      <Text style={[styles.title, { color: theme.colors.ink }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: theme.colors.muted }]}>{subtitle}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    padding: 20,
    alignItems: "center",
    gap: 6,
  },
  emoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
  },
});
