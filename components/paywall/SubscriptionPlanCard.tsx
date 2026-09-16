import { Text, View, StyleSheet } from "react-native";
import { Button } from "@/components/ui/Button";
import { t } from "@/lib/i18n/translate";
import { useTheme } from "@/theme/ThemeProvider";
import type { SubscriptionPlan } from "@/types/content";

interface SubscriptionPlanCardProps {
  plan: SubscriptionPlan;
  /** Fixed marketing price (59 zł / 590 zł) — deliberately NOT the real
   * store-fetched price anymore (see app/paywall.tsx's own doc): this
   * screen no longer waits on RevenueCat's offering to render at all, it
   * always shows these two numbers immediately. The actual charge still
   * goes through the real store product when `onPress` fires. */
  priceLabel: string;
  periodLabel: string;
  description: string;
  ctaLabel: string;
  /** Only set on the yearly card — percentage saved vs. paying the
   * monthly price for 12 months, computed once from the two fixed
   * prices above (see app/paywall.tsx), not per-render. */
  savingsPercent?: number;
  /** The yearly plan reads as the "recommended" pick — a highlighted
   * border/background, same visual language a `isSelected` plan card
   * used before this became two independent always-visible offers
   * rather than a select-then-confirm pair. */
  highlighted?: boolean;
  loading: boolean;
  disabled: boolean;
  onPress: () => void;
}

export function SubscriptionPlanCard({
  plan,
  priceLabel,
  periodLabel,
  description,
  ctaLabel,
  savingsPercent,
  highlighted = false,
  loading,
  disabled,
  onPress,
}: SubscriptionPlanCardProps) {
  const theme = useTheme();
  const titleKey = plan === "monthly" ? "paywall.plan.monthly" : "paywall.plan.yearly";

  return (
    <View
      style={[
        styles.card,
        {
          borderRadius: theme.radius.md,
          borderColor: highlighted ? theme.colors.primary : theme.colors.border,
          borderWidth: theme.borderWidth,
          backgroundColor: highlighted ? theme.colors.accentSoft : theme.colors.surface,
          padding: theme.spacing(2),
        },
      ]}
    >
      {savingsPercent !== undefined && (
        <View style={[styles.badge, { backgroundColor: theme.colors.success }]}>
          <Text style={styles.badgeText}>{t("paywall.plan.savings", "pl", { percent: savingsPercent })}</Text>
        </View>
      )}
      <View style={styles.headerRow}>
        <Text style={{ fontSize: theme.fontSize.body, fontWeight: "700", color: theme.colors.ink }}>{t(titleKey)}</Text>
        <View style={styles.priceRow}>
          <Text style={{ fontSize: theme.fontSize.heading, fontWeight: "800", color: theme.colors.ink }}>{priceLabel}</Text>
          <Text style={{ fontSize: theme.fontSize.body * 0.8, color: theme.colors.muted, marginLeft: 4 }}>{periodLabel}</Text>
        </View>
      </View>
      <Text style={{ fontSize: theme.fontSize.body * 0.85, color: theme.colors.muted, marginBottom: theme.spacing(1.5) }}>
        {description}
      </Text>
      <Button label={loading ? "…" : ctaLabel} onPress={onPress} disabled={disabled} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 4,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
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
