import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { DarkButton } from "@/components/exercises/DarkButton";
import { AppIcon } from "@/components/icons/AppIcon";
import { SoltekMascot } from "@/components/SoltekMascot";
import { GUIDE_STEPS } from "@/lib/guide/guideSteps";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

interface GameGuideProps {
  /** Called when the tour is finished or skipped. */
  onClose: () => void;
}

/** A short, skippable tour of the whole game, told by Soltek in a few
 * cards: the two modes, levels and stars, rewards, streak and missions.
 * Mount it only while it should show (a closing RN-web Modal can linger). */
export function GameGuide({ onClose }: GameGuideProps) {
  const [index, setIndex] = useState(0);
  const step = GUIDE_STEPS[index];
  const isFirst = index === 0;
  const isLast = index === GUIDE_STEPS.length - 1;

  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card} accessibilityLabel={`Przewodnik, krok ${index + 1} z ${GUIDE_STEPS.length}`}>
          <View style={styles.topRow}>
            <Text style={styles.counter}>
              {index + 1} / {GUIDE_STEPS.length}
            </Text>
            {!isLast && (
              <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Pomiń przewodnik" hitSlop={12}>
                <Text style={styles.skip}>Pomiń</Text>
              </Pressable>
            )}
          </View>

          <View style={styles.iconWrap}>
            <AppIcon name={step.icon} size={56} />
          </View>
          <Text style={styles.title}>{step.title}</Text>
          <SoltekMascot size="md" expression={step.expression} frameless message={step.message} />

          <View style={styles.dots}>
            {GUIDE_STEPS.map((item, dotIndex) => (
              <View key={item.id} style={[styles.dot, dotIndex === index && styles.dotActive]} />
            ))}
          </View>

          <View style={styles.buttons}>
            <DarkButton label={isLast ? "Zaczynajmy!" : "Dalej"} onPress={isLast ? onClose : () => setIndex(index + 1)} />
            {!isFirst && <DarkButton label="Wstecz" onPress={() => setIndex(index - 1)} variant="secondary" />}
          </View>
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
    padding: theme.spacing(2.5),
    minHeight: 560,
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing(1.25),
  },
  topRow: { width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", minHeight: 20 },
  counter: { fontSize: 12, fontWeight: "800", color: theme.colors.muted },
  skip: { fontSize: 13, fontWeight: "800", color: theme.colors.muted },
  iconWrap: { alignItems: "center", justifyContent: "center" },
  title: { fontSize: theme.fontSize.heading, fontWeight: "800", color: theme.colors.ink, textAlign: "center" },
  dots: { flexDirection: "row", gap: 6, marginVertical: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.surfaceMuted },
  dotActive: { width: 22, backgroundColor: theme.colors.primary },
  buttons: { width: "100%", gap: theme.spacing(1) },
});
