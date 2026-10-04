import { Modal, Text, View, StyleSheet } from "react-native";
import { DarkButton } from "@/components/exercises/DarkButton";
import { SoltekMascot } from "@/components/SoltekMascot";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

interface SoltekGreetingModalProps {
  onContinue: () => void;
}

/** The very first window a new player sees: Solfek says hello. After it come the short tour of the game and only then the
 * question "test or start from the game?" (PlanPromptModal). Mount it only while it should show. */
export function SoltekGreetingModal({ onContinue }: SoltekGreetingModalProps) {
  return (
    <Modal visible transparent animationType="none" onRequestClose={() => {}}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Cześć, jestem Solfek!</Text>
          <SoltekMascot
            size="lg"
            expression="glowny"
            frameless
            message="Będę Ci towarzyszyć i kibicować w każdym zadaniu. Razem nauczymy się czytać nuty, czuć rytm i rozpoznawać dźwięki. Najpierw pokażę Ci, jak działa gra!"
          />
          <View style={{ width: "100%" }}>
            <DarkButton label="Pokaż mi grę" onPress={onContinue} testID="greeting-continue" />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", alignItems: "center", justifyContent: "center", padding: 24 },
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
  title: { fontSize: theme.fontSize.heading, fontWeight: "800", color: theme.colors.ink, textAlign: "center" },
});
