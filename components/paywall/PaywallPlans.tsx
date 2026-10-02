import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { PaywallBenefitsList } from "@/components/paywall/PaywallBenefitsList";
import { SubscriptionPlanCard } from "@/components/paywall/SubscriptionPlanCard";
import { useSubscription } from "@/context/SubscriptionContext";
import { t } from "@/lib/i18n/translate";
import { formatPriceZl, MONTHLY_PRICE_ZL, YEARLY_PRICE_ZL, YEARLY_SAVINGS_PERCENT } from "@/lib/subscriptions/prices";
import { useTheme } from "@/theme/ThemeProvider";
import type { SubscriptionPlan } from "@/types/content";

// Prices come from lib/subscriptions/prices.ts (shown at once; the real charge goes through purchase(plan)).

/** The heading, the benefits and the plans themselves, ready to buy at once
 * (no "see the plans" button in between). Used by the Subskrypcja tab and
 * by the paywall that opens from a locked world. */
export function PaywallPlans({ onPurchased }: { onPurchased?: () => void }) {
  const theme = useTheme();
  const { purchase } = useSubscription();
  const [purchasingPlan, setPurchasingPlan] = useState<SubscriptionPlan | null>(null);

  async function handlePurchase(plan: SubscriptionPlan) {
    setPurchasingPlan(plan);
    try {
      await purchase(plan);
      onPurchased?.();
    } catch (error) {
      Alert.alert("Zakup nie powiódł się", error instanceof Error ? error.message : String(error));
    } finally {
      setPurchasingPlan(null);
    }
  }

  return (
    <View style={styles.wrap}>
      <Text style={[styles.title, { fontSize: theme.fontSize.heading * 1.15, color: theme.colors.ink }]}>{t("paywall.title")}</Text>
      <PaywallBenefitsList />
      <View style={styles.plans}>
        <SubscriptionPlanCard
          plan="monthly"
          priceLabel={formatPriceZl(MONTHLY_PRICE_ZL)}
          periodLabel={t("paywall.plan.monthlyPeriod")}
          description={t("paywall.plan.monthlyDescription")}
          ctaLabel={t("paywall.cta.monthly")}
          loading={purchasingPlan === "monthly"}
          disabled={purchasingPlan !== null}
          onPress={() => handlePurchase("monthly")}
        />
        <SubscriptionPlanCard
          plan="yearly"
          priceLabel={formatPriceZl(YEARLY_PRICE_ZL)}
          periodLabel={t("paywall.plan.yearlyPeriod")}
          description={t("paywall.plan.yearlyDescription")}
          ctaLabel={t("paywall.cta.yearly")}
          savingsPercent={YEARLY_SAVINGS_PERCENT}
          highlighted
          loading={purchasingPlan === "yearly"}
          disabled={purchasingPlan !== null}
          onPress={() => handlePurchase("yearly")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 20, width: "100%", maxWidth: 520, alignSelf: "center", paddingHorizontal: 24 },
  title: { fontWeight: "800", textAlign: "center", marginTop: -20 },
  plans: { gap: 14 },
});
