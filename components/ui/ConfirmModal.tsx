import { Modal, StyleSheet, Text, View } from "react-native";
import { DarkButton } from "@/components/exercises/DarkButton";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/** A "Are you sure?" window in front of the screen. Mount it only while it
 * should show (a closing RN-web Modal can linger in the page). */
export function ConfirmModal({ title, message, confirmLabel, cancelLabel = "Anuluj", onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <Modal visible transparent animationType="none" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.card} accessibilityRole="alert">
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttons}>
            <DarkButton label={cancelLabel} onPress={onCancel} />
            <DarkButton label={confirmLabel} onPress={onConfirm} variant="secondary" />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(20,10,0,0.55)", alignItems: "center", justifyContent: "center", padding: 24 },
  card: {
    width: "100%",
    maxWidth: 400,
    gap: theme.spacing(1.5),
    padding: theme.spacing(2.5),
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
  },
  title: { fontSize: theme.fontSize.heading, fontWeight: "800", color: theme.colors.ink, textAlign: "center" },
  message: { fontSize: theme.fontSize.body * 0.95, color: theme.colors.muted, lineHeight: 22 },
  buttons: { gap: theme.spacing(1), marginTop: theme.spacing(0.5) },
});
