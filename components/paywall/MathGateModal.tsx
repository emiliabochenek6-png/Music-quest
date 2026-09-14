import { useState } from "react";
import { Modal, Pressable, Text, TextInput, View, StyleSheet } from "react-native";
import { Button } from "@/components/ui/Button";
import { generateMathChallenge } from "@/lib/paywall/mathChallenge";
import { t } from "@/lib/i18n/translate";
import { useTheme } from "@/theme/ThemeProvider";

interface MathGateModalProps {
  visible: boolean;
  onPassed: () => void;
  onDismiss: () => void;
}

const MAX_ATTEMPTS = 3;
const LOCKOUT_MS = 30_000;

/**
 * Parental gate shown once per app session before any purchase/subscription
 * screen — see ARCHITECTURE.md section 4.2. Three wrong answers trigger a
 * 30s soft lockout (not a hard block) rather than escalating friction
 * further, since the goal is slowing down an unsupervised child tap, not
 * punishing a parent's typo.
 */
export function MathGateModal({ visible, onPassed, onDismiss }: MathGateModalProps) {
  const theme = useTheme();
  const [challenge, setChallenge] = useState(generateMathChallenge);
  const [input, setInput] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);

  const isLocked = lockedUntil !== null && Date.now() < lockedUntil;

  function handleSubmit() {
    if (isLocked) return;
    if (Number(input) === challenge.answer) {
      setAttempts(0);
      setInput("");
      onPassed();
      return;
    }
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setInput("");
    setChallenge(generateMathChallenge());
    if (nextAttempts >= MAX_ATTEMPTS) {
      setLockedUntil(Date.now() + LOCKOUT_MS);
      setAttempts(0);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg }]}>
          <Text style={{ fontSize: theme.fontSize.heading, fontWeight: "700", color: theme.colors.ink }}>
            {t("paywall.gate.title")}
          </Text>
          <Text style={{ fontSize: theme.fontSize.display, marginVertical: theme.spacing(2) }}>
            {t("paywall.gate.prompt", "pl", { a: challenge.a, b: challenge.b })}
          </Text>
          <TextInput
            value={input}
            onChangeText={setInput}
            keyboardType="number-pad"
            editable={!isLocked}
            style={[styles.input, { borderColor: theme.colors.border, borderRadius: theme.radius.sm }]}
            accessibilityLabel={t("paywall.gate.prompt", "pl", { a: challenge.a, b: challenge.b })}
          />
          <Button label={t("paywall.gate.submit")} onPress={handleSubmit} disabled={isLocked || input.length === 0} />
          <Pressable onPress={onDismiss} style={styles.cancelButton} accessibilityRole="button" accessibilityLabel={t("paywall.notNow")}>
            <Text style={{ color: theme.colors.muted, fontSize: theme.fontSize.body * 0.9 }}>{t("paywall.notNow")}</Text>
          </Pressable>
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
  },
  card: {
    width: "85%",
    padding: 24,
    alignItems: "center",
  },
  input: {
    width: "60%",
    borderWidth: 2,
    padding: 12,
    fontSize: 22,
    textAlign: "center",
    marginBottom: 16,
  },
  cancelButton: {
    marginTop: 12,
    paddingVertical: 8,
  },
});
