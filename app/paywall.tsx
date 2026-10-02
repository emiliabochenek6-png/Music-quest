import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { PaywallHero, usePaywallBackground } from "@/components/paywall/PaywallHero";
import { PaywallPlans } from "@/components/paywall/PaywallPlans";
import { t } from "@/lib/i18n/translate";
import { useTheme } from "@/theme/ThemeProvider";

/**
 * Paywall (opens from a locked world) — see ARCHITECTURE.md section 4: the
 * banner with Soltek on top, then the plans straight away. See
 * components/paywall/PaywallPlans.tsx for the prices and the purchase itself.
 */
export default function PaywallScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const background = usePaywallBackground();

  return (
    <View style={{ flex: 1, backgroundColor: background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 24 }} showsVerticalScrollIndicator={false}>
        <PaywallHero />
        <PaywallPlans onPurchased={() => router.back()} />
        <Pressable onPress={() => router.back()} style={styles.linkButton}>
          <Text style={{ color: theme.colors.muted }}>{t("paywall.notNow")}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  linkButton: { alignItems: "center", paddingVertical: 16 },
});
