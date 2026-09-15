import { useEffect, useState } from "react";
import { Modal, Text, View, StyleSheet } from "react-native";
import { DarkButton } from "@/components/exercises/DarkButton";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

interface OutOfHeartsModalProps {
  visible: boolean;
  /** A snapshot taken when the modal opens — see the internal countdown
   * doc below for why this only needs to be read once, not kept fresh
   * by the caller. */
  msUntilNextHeart: number | null;
  onExit: () => void;
  onGoPremium: () => void;
}

function formatRemaining(ms: number): string {
  const totalMinutes = Math.max(1, Math.ceil(ms / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours <= 0) return `${minutes} min`;
  return minutes > 0 ? `${hours} godz. ${minutes} min` : `${hours} godz.`;
}

/** Blocks further practice once GamificationContext's own hearts hit 0
 * (see app/(main)/lesson/[lessonId].tsx's own handleContinue, the one
 * caller today) — same full-screen `<Modal transparent={false}
 * animationType="fade">` shape as WorldCompleteModal, no visible close
 * control (unlike that one) since there's nothing useful to do here
 * except leave or go premium, both offered as real buttons. Ticks its
 * own countdown locally from the `msUntilNextHeart` snapshot it was
 * opened with — a plain `setInterval`, not a live re-read of
 * GamificationContext's own getHeartsInfo(), since the modal's only job
 * is showing roughly how long is left, not driving any actual
 * unlock-when-it-hits-zero logic (the player has to leave and come back
 * for that; see this component's own onExit). */
export function OutOfHeartsModal({ visible, msUntilNextHeart, onExit, onGoPremium }: OutOfHeartsModalProps) {
  const [remainingMs, setRemainingMs] = useState(msUntilNextHeart ?? 0);

  useEffect(() => {
    if (!visible) return;
    setRemainingMs(msUntilNextHeart ?? 0);
    const intervalId = setInterval(() => {
      setRemainingMs((prev) => Math.max(0, prev - 1000));
    }, 1000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <Modal visible={visible} transparent={false} animationType="fade" onRequestClose={onExit}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={{ fontSize: 48 }}>💔</Text>
          <Text style={{ fontSize: theme.fontSize.heading, fontWeight: "800", color: theme.colors.ink, textAlign: "center" }}>
            Zabrakło Ci serc
          </Text>
          <Text style={{ color: theme.colors.muted, textAlign: "center" }}>
            {remainingMs > 0 ? `Następne serce za ${formatRemaining(remainingMs)}` : "Za chwilę pojawi się kolejne serce"}
          </Text>
          <View style={{ marginTop: theme.spacing(2), width: "100%", gap: theme.spacing(1) }}>
            <DarkButton label="⭐ Nieograniczone serca z Premium" onPress={onGoPremium} />
            <DarkButton label="Wróć do poziomów" onPress={onExit} variant="secondary" />
          </View>
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
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.warning,
    backgroundColor: theme.colors.surface,
  },
});
