import { useRef } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { DarkButton } from "@/components/exercises/DarkButton";
import { SoltekMascot } from "@/components/SoltekMascot";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

interface LeaveLessonModalProps {
  /** Exercises still ahead (including the current one). */
  remaining: number;
  onStay: () => void;
  onLeave: () => void;
}

/** "zadanie / zadania / zadań" for a count. */
export function exercisesWord(count: number): string {
  if (count === 1) return "zadanie";
  const lastTwo = count % 100;
  const last = count % 10;
  if (last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) return "zadania";
  return "zadań";
}

/** A sad Solfek's comment when the player wants to leave (the X in a lesson): one of a few, depending on how much is left. */
export function leaveComment(remaining: number, random: number = Math.random()): string {
  const near = remaining <= 3;
  const lines = near
    ? [
        `Zostało już tylko ${remaining} ${exercisesWord(remaining)}! Szkoda byłoby przerywać tuż przed metą…`,
        `Jeszcze ${remaining} ${exercisesWord(remaining)} i lekcja zaliczona. Solfek trzyma kciuki, żeby Ci się udało!`,
        "Prawie koniec! Solfek zrobi smutną minkę, jeśli teraz wyjdziesz…",
      ]
    : [
        "Czy na pewno chcesz wyjść? Solfek będzie za Tobą tęsknić…",
        "Jeśli wyjdziesz, ta lekcja nie zostanie zaliczona. Solfek zrobi smutną minkę…",
        "Wychodzisz? Solfek zostanie sam z nutami i będzie mu bardzo smutno…",
        "Jeszcze chwilka i będzie po wszystkim. Zostaniesz z Solfkiem?",
      ];
  return lines[Math.floor(random * lines.length) % lines.length];
}

/** The "are you sure you want to leave?" window of a lesson. Mount it only while it should show (a closing RN-web Modal can linger). */
export function LeaveLessonModal({ remaining, onStay, onLeave }: LeaveLessonModalProps) {
  const comment = useRef(leaveComment(remaining)).current;
  return (
    <Modal visible transparent animationType="none" onRequestClose={onStay}>
      <View style={styles.backdrop}>
        <View style={styles.card} accessibilityRole="alert">
          <Text style={styles.title}>Czy na pewno chcesz wyjść?</Text>
          <SoltekMascot size="lg" expression="myslacy" frameless message={comment} />
          <View style={styles.buttons}>
            <DarkButton label="Zostaję i gram dalej" onPress={onStay} testID="leave-stay" />
            <DarkButton label="Wyjdź" onPress={onLeave} variant="secondary" testID="leave-confirm" />
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
  buttons: { gap: theme.spacing(1), marginTop: theme.spacing(0.5) },
});
