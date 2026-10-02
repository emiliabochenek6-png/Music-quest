import { View, Text, Linking, ScrollView, StyleSheet, Platform } from "react-native";
import { BottomTabBar } from "@/components/BottomTabBar";
import { PaywallHero, usePaywallBackground } from "@/components/paywall/PaywallHero";
import { PaywallPlans } from "@/components/paywall/PaywallPlans";
import { Button } from "@/components/ui/Button";
import { useSubscription } from "@/context/SubscriptionContext";
import { useTheme } from "@/theme/ThemeProvider";

/** The "Subskrypcja" tab: the banner with Soltek on top, and below it either
 * the plans, ready to buy at once (no subscription yet), or the status of the
 * active subscription with a link into the store's own management screen —
 * see ARCHITECTURE.md section 4.4: cancelling always goes through the store,
 * this screen never implements it directly. */
export default function SubscriptionStatusScreen() {
  const theme = useTheme();
  const { status } = useSubscription();
  const background = usePaywallBackground();

  function openStoreManagement() {
    const url = Platform.OS === "ios" ? "itms-apps://apps.apple.com/account/subscriptions" : "https://play.google.com/store/account/subscriptions";
    void Linking.openURL(url);
  }

  return (
    <View style={{ flex: 1, backgroundColor: background }}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <PaywallHero />
        {status.isActive ? (
          <View style={styles.active}>
            <Text style={{ fontSize: theme.fontSize.heading, fontWeight: "800", color: theme.colors.ink, textAlign: "center" }}>Subskrypcja aktywna</Text>
            <Text style={{ color: theme.colors.muted, textAlign: "center" }}>Plan: {status.plan === "yearly" ? "Roczny" : "Miesięczny"}</Text>
            {status.expiresAt && <Text style={{ color: theme.colors.muted, textAlign: "center" }}>Odnawia się: {status.expiresAt}</Text>}
            {status.isInGracePeriod && (
              <Text style={{ color: theme.colors.warning, textAlign: "center" }}>Problem z płatnością — zaktualizuj metodę płatności w ustawieniach sklepu.</Text>
            )}
            <Button label="Zarządzaj w sklepie" onPress={openStoreManagement} variant="secondary" />
          </View>
        ) : (
          <PaywallPlans />
        )}
      </ScrollView>
      <BottomTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 24 },
  active: { gap: 12, width: "100%", maxWidth: 520, alignSelf: "center", paddingHorizontal: 24, marginTop: -8 },
});
