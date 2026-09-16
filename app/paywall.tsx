import { useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { PaywallBenefitsList } from "@/components/paywall/PaywallBenefitsList";
import { SubscriptionPlanCard } from "@/components/paywall/SubscriptionPlanCard";
import { useSubscription } from "@/context/SubscriptionContext";
import { t } from "@/lib/i18n/translate";
import { useTheme } from "@/theme/ThemeProvider";
import type { SubscriptionPlan } from "@/types/content";

// Fixed marketing prices, shown immediately — no more waiting on
// fetchCurrentOffering() (RevenueCat's real store prices) before this
// screen can render anything, and no more "ceny niedostępne" fallback
// when that fetch fails/isn't configured yet. The actual charge still
// goes through purchase(plan) below, which resolves the real store
// product on its own (see SubscriptionContext/lib/subscriptions/
// purchases.ts) — these two numbers are what the player is TOLD, kept in
// sync with the real App Store Connect/Play Console prices by hand
// rather than read live, which is the tradeoff for never blocking on a
// network fetch here.
const MONTHLY_PRICE_ZL = 59;
const YEARLY_PRICE_ZL = 590;
const SAVINGS_PERCENT = Math.round((1 - YEARLY_PRICE_ZL / (MONTHLY_PRICE_ZL * 12)) * 100);

/**
 * Paywall — see ARCHITECTURE.md section 4. No longer gated behind
 * MathGateModal's own parental math question (dropped along with
 * settings/subscription-status.tsx's own copy of the same gate) — every
 * plan/price/description below is now visible the instant this screen
 * opens.
 */
export default function PaywallScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { purchase } = useSubscription();
  const [purchasingPlan, setPurchasingPlan] = useState<SubscriptionPlan | null>(null);

  async function handlePurchase(plan: SubscriptionPlan) {
    setPurchasingPlan(plan);
    try {
      await purchase(plan);
      router.back();
    } catch (error) {
      Alert.alert("Zakup nie powiódł się", error instanceof Error ? error.message : String(error));
    } finally {
      setPurchasingPlan(null);
    }
  }

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.cream }}
      contentContainerStyle={[
        styles.container,
        { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 },
      ]}
    >
      <Text style={[styles.title, { fontSize: theme.fontSize.heading, color: theme.colors.ink }]}>
        {t("paywall.title")}
      </Text>

      <PaywallBenefitsList />

      <View style={styles.plans}>
        <SubscriptionPlanCard
          plan="monthly"
          priceLabel={t("paywall.plan.monthlyPrice")}
          periodLabel={t("paywall.plan.monthlyPeriod")}
          description={t("paywall.plan.monthlyDescription")}
          ctaLabel={t("paywall.cta.monthly")}
          loading={purchasingPlan === "monthly"}
          disabled={purchasingPlan !== null}
          onPress={() => handlePurchase("monthly")}
        />
        <SubscriptionPlanCard
          plan="yearly"
          priceLabel={t("paywall.plan.yearlyPrice")}
          periodLabel={t("paywall.plan.yearlyPeriod")}
          description={t("paywall.plan.yearlyDescription")}
          ctaLabel={t("paywall.cta.yearly")}
          savingsPercent={SAVINGS_PERCENT}
          highlighted
          loading={purchasingPlan === "yearly"}
          disabled={purchasingPlan !== null}
          onPress={() => handlePurchase("yearly")}
        />
      </View>

      <Pressable onPress={() => router.back()} style={styles.linkButton}>
        <Text style={{ color: theme.colors.muted }}>{t("paywall.notNow")}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 20,
  },
  title: {
    fontWeight: "700",
  },
  plans: {
    gap: 14,
  },
  linkButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
});
