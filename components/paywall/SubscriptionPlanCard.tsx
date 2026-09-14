import { Pressable, Text, View, StyleSheet } from "react-native";
import { t } from "@/lib/i18n/translate";
import { useTheme } from "@/theme/ThemeProvider";
import type { SubscriptionPlan } from "@/types/content";

interface SubscriptionPlanCardProps {
  plan: SubscriptionPlan;
  /** Formatted, localized price string from the store (e.g. "24,99 zł") —
   * never computed/guessed client-side, always the real value StoreKit/
   * Play Billing returns for the product, so the price shown always
   * matches what's actually charged. */
  priceLabel: string;
  /** Only present for the yearly plan — percentage savings vs. paying
   * monthly for 12 months, computed from the two REAL store prices (see
   * ARCHITECTURE.md section 4.3), never hardcoded. */
  savingsPercent?: number;
  isSelected: boolean;
  onSelect: (plan: SubscriptionPlan) => void;
}

export function SubscriptionPlanCard({
  plan,
  priceLabel,
  savingsPercent,
  isSelected,
  onSelect,
}: SubscriptionPlanCardProps) {
  const theme = useTheme();
  const titleKey = plan === "monthly" ? "paywall.plan.monthly" : "paywall.plan.yearly";

  return (
    <Pressable
      onPress={() => onSelect(plan)}
      accessibilityRole="radio"
      accessibilityState={{ checked: isSelected }}
      style={[
        styles.card,
        {
          borderRadius: theme.radius.md,
          borderColor: isSelected ? theme.colors.primary : theme.colors.border,
          borderWidth: isSelected ? 3 : 1,
          backgroundColor: theme.colors.surface,
          padding: theme.spacing(2),
        },
      ]}
    >
      {savingsPercent !== undefined && (
        <View style={[styles.badge, { backgroundColor: theme.colors.success }]}>
          <Text style={styles.badgeText}>{t("paywall.plan.savings", "pl", { percent: savingsPercent })}</Text>
        </View>
      )}
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink }}>
        {t(titleKey)}
      </Text>
      <Text style={{ fontSize: theme.fontSize.heading, fontWeight: "700", color: theme.colors.ink }}>
        {priceLabel}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: "flex-start",
    gap: 4,
  },
  badge: {
    position: "absolute",
    top: -10,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
});
