import { Modal, Pressable, Text, View, StyleSheet } from "react-native";
import { DarkButton } from "@/components/exercises/DarkButton";
import { SoltekMascot } from "@/components/SoltekMascot";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

interface PlanPromptModalProps {
  visible: boolean;
  onTakeTest: () => void;
  onStartFromBeginning: () => void;
}

/** First-run choice on the map (shown once, until the player has picked a
 * path): a placement test that builds a personal path, or the original
 * full path from lesson one. Not dismissible without choosing — either
 * answer sets the plan, which is what the daily missions and reviews run
 * on. */
export function PlanPromptModal({ visible, onTakeTest, onStartFromBeginning }: PlanPromptModalProps) {
  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={() => {}}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Jak chcesz zacząć?</Text>
          <SoltekMascot
            size="lg"
            expression="glowny"
            frameless
            message="Zrobię z Tobą krótki test (ok. 8–10 minut) i ułożę Ci własną ścieżkę — pominiesz to, co już umiesz, i dostaniesz plan na ok. 3 miesiące. Albo zaczniemy od samego początku. Jak wolisz?"
          />
          <View style={{ gap: theme.spacing(1.25), width: "100%" }}>
            <DarkButton label="🦊 Zrób test z Soltkiem" onPress={onTakeTest} />
            <DarkButton label="▶ Chcę zacząć od początku" onPress={onStartFromBeginning} variant="secondary" />
          </View>
          <Text style={styles.footnote}>Zawsze możesz zmienić decyzję w Ustawieniach → Twój plan.</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    padding: theme.spacing(3),
    alignItems: "center",
    gap: theme.spacing(1.5),
  },
  emoji: { fontSize: 40 },
  title: { fontSize: theme.fontSize.heading, fontWeight: "800", color: theme.colors.ink, textAlign: "center" },
  body: { fontSize: theme.fontSize.body * 0.95, color: theme.colors.muted, textAlign: "center", lineHeight: 22 },
  footnote: { fontSize: 12, color: theme.colors.muted, textAlign: "center" },
});
