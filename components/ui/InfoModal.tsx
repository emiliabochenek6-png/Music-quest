import { Modal, StyleSheet, Text, View } from "react-native";
import { DarkButton } from "@/components/exercises/DarkButton";
import { SoltekMascot } from "@/components/SoltekMascot";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

interface InfoModalProps {
  title: string;
  message: string;
  buttonLabel?: string;
  onClose: () => void;
}

/** A small message window with Soltek and one button. Mount it only while it should show (a closing RN-web Modal can linger in the page). */
export function InfoModal({ title, message, buttonLabel = "OK", onClose }: InfoModalProps) {
  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card} accessibilityRole="alert">
          <Text style={styles.title}>{title}</Text>
          <SoltekMascot size="sm" expression="zachecajacy" frameless message={message} />
          <DarkButton label={buttonLabel} onPress={onClose} />
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
    alignItems: "center",
  },
  title: { fontSize: theme.fontSize.heading, fontWeight: "800", color: theme.colors.ink, textAlign: "center" },
});
