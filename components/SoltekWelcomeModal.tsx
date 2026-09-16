import { Modal, Text, View, StyleSheet } from "react-native";
import { Button } from "@/components/ui/Button";
import { SoltekMascot } from "@/components/SoltekMascot";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

interface SoltekWelcomeModalProps {
  visible: boolean;
  onDismiss: () => void;
}

/**
 * Soltek's own one-time welcome — shown the first time a player reaches
 * the map (see app/(main)/map.tsx's own use of ProfileContext's
 * hasSeenSoltekGreeting), introducing him as the guide who'll show up
 * again on select exercises (see SoltekMascot's own inline use in
 * app/(main)/daily-challenge.tsx). Modal, not an inline card on the map
 * itself — this is a one-shot introduction moment, not part of the map's
 * own permanent layout.
 */
export function SoltekWelcomeModal({ visible, onDismiss }: SoltekWelcomeModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>🎵 Poznaj Soltka!</Text>
          <SoltekMascot
            expression="radosny"
            message={
              "Cześć! Jestem Soltek, Twój przewodnik po świecie muzyki. Będę Ci towarzyszyć, podpowiadać i kibicować w każdym zadaniu. Gotowy na przygodę?"
            }
          />
          <View style={{ marginTop: theme.spacing(2), width: "100%" }}>
            <Button label="Zaczynajmy!" onPress={onDismiss} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "#00000080",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: theme.colors.cream,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: theme.spacing(2.5),
  },
  title: {
    fontSize: theme.fontSize.heading,
    fontWeight: "800",
    color: theme.colors.ink,
    marginBottom: theme.spacing(2),
    textAlign: "center",
  },
});
