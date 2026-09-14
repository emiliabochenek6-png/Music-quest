import { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { MathGateModal } from "@/components/paywall/MathGateModal";
import { PaywallBenefitsList } from "@/components/paywall/PaywallBenefitsList";
import { SubscriptionPlanCard } from "@/components/paywall/SubscriptionPlanCard";
import { Button } from "@/components/ui/Button";
import { useSubscription } from "@/context/SubscriptionContext";
import { fetchCurrentOffering, PRODUCT_IDS } from "@/lib/subscriptions/purchases";
import { t } from "@/lib/i18n/translate";
import { useTheme } from "@/theme/ThemeProvider";
import type { PurchasesPackage } from "react-native-purchases";
import type { SubscriptionPlan } from "@/types/content";

/**
 * Paywall — see ARCHITECTURE.md section 4. The math gate blocks the whole
 * screen until passed, once per app session (see `useState` below, which
 * intentionally resets on remount rather than persisting — matches the
 * spec's "once per session" rule, since a fresh app launch is a fresh
 * session). Plan prices are read from `fetchCurrentOffering()`'s real,
 * localized store prices (App Store/Play Store prices vary by region and
 * change over time outside the app's own control) — never hardcoded, so
 * what's shown here always matches what StoreKit/Play Billing actually
 * charges.
 */
export default function PaywallScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { purchase, restore } = useSubscription();
  const [isGatePassed, setIsGatePassed] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>("yearly");
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [monthlyPackage, setMonthlyPackage] = useState<PurchasesPackage | null>(null);
  const [yearlyPackage, setYearlyPackage] = useState<PurchasesPackage | null>(null);
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);

  // Runs once the math gate is passed (not on mount) — no point fetching
  // the offering while the gate itself is still on screen, since the
  // player can't reach the plan cards until then anyway.
  useEffect(() => {
    if (!isGatePassed) return;
    let cancelled = false;
    fetchCurrentOffering()
      .then((offering) => {
        if (cancelled) return;
        const packages = offering?.availablePackages ?? [];
        setMonthlyPackage(packages.find((pkg) => pkg.product.identifier === PRODUCT_IDS.monthly) ?? null);
        setYearlyPackage(packages.find((pkg) => pkg.product.identifier === PRODUCT_IDS.yearly) ?? null);
      })
      .catch(() => {
        // Leaves both packages null — the screen below renders a "prices
        // unavailable" fallback rather than throwing, so a network hiccup
        // never strands the player on a blank/crashed paywall.
      })
      .finally(() => {
        if (!cancelled) setIsLoadingPrices(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isGatePassed]);

  const selectedPackage = selectedPlan === "yearly" ? yearlyPackage : monthlyPackage;
  // Real percentage saved on the yearly plan vs. paying the monthly price
  // for 12 months, computed from the two actual store prices — never
  // hardcoded, since a hardcoded number silently goes stale the moment
  // either product's price changes in App Store Connect/Play Console.
  const savingsPercent =
    monthlyPackage && yearlyPackage
      ? Math.max(0, Math.round((1 - yearlyPackage.product.price / (monthlyPackage.product.price * 12)) * 100))
      : undefined;

  async function handlePurchase() {
    setIsPurchasing(true);
    try {
      await purchase(selectedPlan);
      router.back();
    } catch (error) {
      Alert.alert("Zakup nie powiódł się", error instanceof Error ? error.message : String(error));
    } finally {
      setIsPurchasing(false);
    }
  }

  async function handleRestore() {
    try {
      await restore();
      router.back();
    } catch (error) {
      Alert.alert("Nie udało się przywrócić zakupów", error instanceof Error ? error.message : String(error));
    }
  }

  if (!isGatePassed) {
    return (
      <MathGateModal visible onPassed={() => setIsGatePassed(true)} onDismiss={() => router.back()} />
    );
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

      {isLoadingPrices ? (
        <ActivityIndicator color={theme.colors.primary} />
      ) : !monthlyPackage || !yearlyPackage ? (
        <Text style={{ color: theme.colors.muted, textAlign: "center" }}>{t("paywall.pricesUnavailable")}</Text>
      ) : (
        <View style={styles.plans}>
          <SubscriptionPlanCard
            plan="monthly"
            priceLabel={monthlyPackage.product.priceString}
            isSelected={selectedPlan === "monthly"}
            onSelect={setSelectedPlan}
          />
          <SubscriptionPlanCard
            plan="yearly"
            priceLabel={yearlyPackage.product.priceString}
            savingsPercent={savingsPercent}
            isSelected={selectedPlan === "yearly"}
            onSelect={setSelectedPlan}
          />
        </View>
      )}

      <Button
        label={t("paywall.cta", "pl", { price: selectedPackage?.product.priceString ?? "" })}
        onPress={handlePurchase}
        disabled={isPurchasing || !selectedPackage}
      />

      <Pressable onPress={handleRestore} style={styles.linkButton}>
        <Text style={{ color: theme.colors.muted }}>{t("paywall.restorePurchases")}</Text>
      </Pressable>

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
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  linkButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
});
