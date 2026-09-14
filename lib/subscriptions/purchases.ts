import Purchases, { type CustomerInfo, type PurchasesOffering } from "react-native-purchases";
import type { SubscriptionPlan, SubscriptionStatus } from "@/types/content";

/** The RevenueCat entitlement identifier that gates worlds 4-9 — configured
 * on RevenueCat's own dashboard, not derived here. A single entitlement
 * covers both the monthly and yearly product; which one is active is read
 * from the entitlement's own product identifier (see planFromCustomerInfo). */
const PREMIUM_ENTITLEMENT_ID = "premium_worlds";

/** Product identifiers as configured in App Store Connect / Play Console —
 * kept in one place so a store-side rename only needs updating here. */
export const PRODUCT_IDS = {
  monthly: "master_quest_monthly",
  yearly: "master_quest_yearly",
} as const;

export async function configurePurchases(apiKey: string): Promise<void> {
  Purchases.configure({ apiKey });
}

export async function fetchCurrentOffering(): Promise<PurchasesOffering | null> {
  const offerings = await Purchases.getOfferings();
  return offerings.current;
}

export async function purchasePlan(plan: SubscriptionPlan): Promise<CustomerInfo> {
  const offering = await fetchCurrentOffering();
  const productId = PRODUCT_IDS[plan];
  const pkg = offering?.availablePackages.find((p) => p.product.identifier === productId);
  if (!pkg) {
    throw new Error(`No package found for product "${productId}" in the current offering`);
  }
  const { customerInfo } = await Purchases.purchasePackage(pkg);
  return customerInfo;
}

export async function restorePurchases(): Promise<CustomerInfo> {
  return Purchases.restorePurchases();
}

/** Translates RevenueCat's own CustomerInfo shape into this app's plain
 * SubscriptionStatus — the one place that knows RevenueCat's data model, so
 * every other module (SubscriptionContext, resolveNodeState) works against
 * a small, stable, app-owned type instead of a third-party SDK's shape. */
export function subscriptionStatusFromCustomerInfo(info: CustomerInfo): SubscriptionStatus {
  const entitlement = info.entitlements.active[PREMIUM_ENTITLEMENT_ID];
  if (!entitlement) {
    return { isActive: false, plan: null, expiresAt: null, isInGracePeriod: false, isTrialActive: false };
  }
  const plan: SubscriptionPlan = entitlement.productIdentifier === PRODUCT_IDS.yearly ? "yearly" : "monthly";
  return {
    isActive: true,
    plan,
    expiresAt: entitlement.expirationDate,
    isInGracePeriod: entitlement.billingIssueDetectedAt !== null,
    isTrialActive: entitlement.periodType === "TRIAL",
  };
}
