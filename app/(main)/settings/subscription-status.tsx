import { useState } from "react";
import { View, Text, Linking, StyleSheet, Platform } from "react-native";
import { router } from "expo-router";
import { MathGateModal } from "@/components/paywall/MathGateModal";
import { Button } from "@/components/ui/Button";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useSubscription } from "@/context/SubscriptionContext";
import { useTheme } from "@/theme/ThemeProvider";

/** Status view + a deep link into the store's own subscription management
 * — see ARCHITECTURE.md section 4.4: cancellation always goes through the
 * store, this screen never implements it directly. Behind the same
 * parental math gate as the paywall itself (settings can't be a side door
 * around it). */
export default function SubscriptionStatusScreen() {
  const theme = useTheme();
  const { status } = useSubscription();
  const [isGatePassed, setIsGatePassed] = useState(false);

  if (!isGatePassed) {
    // Dismissing the gate (not just failing it) means "I didn't actually
    // want to be here" — back out to Settings rather than stranding the
    // player on a modal with no way forward or back.
    return <MathGateModal visible onPassed={() => setIsGatePassed(true)} onDismiss={() => router.back()} />;
  }

  function openStoreManagement() {
    const url = Platform.OS === "ios" ? "itms-apps://apps.apple.com/account/subscriptions" : "https://play.google.com/store/account/subscriptions";
    void Linking.openURL(url);
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.cream }}>
      <ScreenHeader title="Subskrypcja" onBack={() => router.back()} />
      <View style={styles.container}>
      <Text style={{ fontSize: theme.fontSize.heading, fontWeight: "700", color: theme.colors.ink }}>
        {status.isActive ? "Subskrypcja aktywna" : "Brak aktywnej subskrypcji"}
      </Text>
      {status.isActive && (
        <>
          <Text style={{ color: theme.colors.muted }}>
            Plan: {status.plan === "yearly" ? "Roczny" : "Miesięczny"}
          </Text>
          {status.expiresAt && (
            <Text style={{ color: theme.colors.muted }}>Odnawia się: {status.expiresAt}</Text>
          )}
          {status.isInGracePeriod && (
            <Text style={{ color: theme.colors.warning }}>
              Problem z płatnością — zaktualizuj metodę płatności w ustawieniach sklepu.
            </Text>
          )}
        </>
      )}
      <Button label="Zarządzaj w sklepie" onPress={openStoreManagement} variant="secondary" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 12,
  },
});
