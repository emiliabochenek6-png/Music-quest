import { Modal, Pressable, Text, View, StyleSheet } from "react-native";
import { AppIcon } from "@/components/icons/AppIcon";
import type { Rule } from "@/lib/gamification/rulesText";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

interface RuleInfoModalProps {
  visible: boolean;
  /** null while closing/between rules — kept simple as "nothing to show"
   * rather than the caller having to hold the last rule around just so
   * this doesn't render empty during the close animation. */
  rule: Rule | null;
  onClose: () => void;
}

/**
 * A single "Zasady gry" entry (see lib/gamification/rulesText.ts) shown
 * as its own small popup — GamificationHeaderBar's own tappable HUD
 * pills (serca/passa/ranga) open this instead of sending the player all
 * the way into the side menu's full scrolling list, since they're
 * already looking right at the number in question. Same dim-backdrop,
 * centered-card shape as SoltekWelcomeModal — a quick "what does this
 * mean" peek, not a full-screen takeover — and dismissible by tapping
 * the backdrop as well as the ✕, since there's nothing here that needs
 * a deliberate confirm to leave.
 */
export function RuleInfoModal({ visible, rule, onClose }: RuleInfoModalProps) {
  if (!rule) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityRole="none">
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <View style={styles.headerRow}>
            {"name" in rule.icon ? <AppIcon name={rule.icon.name} size={32} /> : <Text style={styles.emojiIcon}>{rule.icon.emoji}</Text>}
            <Text style={styles.title}>{rule.title}</Text>
            <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Zamknij" hitSlop={10} style={styles.closeButton}>
              <Text style={styles.closeIcon}>✕</Text>
            </Pressable>
          </View>
          <Text style={styles.body}>{rule.body}</Text>
        </Pressable>
      </Pressable>
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
    maxWidth: 360,
    backgroundColor: theme.colors.cream,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: theme.spacing(2.5),
    gap: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  emojiIcon: {
    fontSize: 32,
  },
  title: {
    flex: 1,
    fontSize: theme.fontSize.body,
    fontWeight: "800",
    color: theme.colors.ink,
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  closeIcon: {
    fontSize: 14,
    color: theme.colors.muted,
    fontWeight: "700",
  },
  body: {
    fontSize: 13.5,
    lineHeight: 19,
    color: theme.colors.muted,
  },
});
