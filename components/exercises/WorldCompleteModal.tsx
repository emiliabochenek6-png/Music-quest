import { Modal, Pressable, Text, View, StyleSheet } from "react-native";
import { Confetti } from "@/components/exercises/Confetti";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

interface WorldCompleteModalProps {
  visible: boolean;
  worldName: string;
  accentHex: string;
  onClose: () => void;
}

/** A one-time celebration popup shown the moment a world's last lesson is
 * finished — separate from LessonSummary (which reports on that one
 * lesson) since "you finished this exercise set" and "you finished the
 * whole world" are different, bigger news. Dismisses via its own ✕ (same
 * reasoning as MathGateModal's own cancel button: Modal's onRequestClose
 * only fires from Android's hardware back button, not any iOS gesture for
 * a transparent overFullScreen modal, so a visible close control is the
 * only reliable dismiss on iOS). Names the world with a fixed "Kraina „…”"
 * subject rather than the world's own name directly, so the sentence
 * stays grammatically correct regardless of that name's gender in Polish
 * (a feminine "Wioska", neuter "Miasto", masculine "Labirynt", ...).
 * `transparent={false}` plus an opaque backdrop means nothing from the
 * screen underneath (the lesson summary, mid-fade artifacts, anything)
 * shows through — the celebration owns the whole screen. Confetti only
 * mounts while `visible`, so its fall loops start and stop with the
 * modal rather than animating uselessly in the background. */
export function WorldCompleteModal({ visible, worldName, accentHex, onClose }: WorldCompleteModalProps) {
  return (
    <Modal visible={visible} transparent={false} animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        {visible && <Confetti />}
        <View style={[styles.card, { borderColor: `${accentHex}55`, shadowColor: accentHex }]}>
          <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Zamknij" hitSlop={12} style={styles.closeButton}>
            <Text style={styles.closeIcon}>✕</Text>
          </Pressable>
          <Text style={{ fontSize: 48 }}>🏆</Text>
          <Text style={{ fontSize: theme.fontSize.heading, fontWeight: "800", color: theme.colors.ink, textAlign: "center" }}>
            Gratulacje!
          </Text>
          <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: accentHex, textAlign: "center", marginTop: theme.spacing(0.5) }}>
            Kraina „{worldName}” została ukończona
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: theme.colors.cream,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
    gap: 4,
    padding: 28,
    borderRadius: 24,
    borderWidth: 1,
    backgroundColor: "#160f30",
    shadowOpacity: 0.5,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeIcon: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "700",
  },
});
