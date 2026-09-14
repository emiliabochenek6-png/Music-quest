import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import Purchases from "react-native-purchases";
import {
  purchasePlan,
  restorePurchases as restorePurchasesApi,
  subscriptionStatusFromCustomerInfo,
} from "@/lib/subscriptions/purchases";
import type { SubscriptionPlan, SubscriptionStatus } from "@/types/content";

const INACTIVE_STATUS: SubscriptionStatus = {
  isActive: false,
  plan: null,
  expiresAt: null,
  isInGracePeriod: false,
  isTrialActive: false,
};

interface SubscriptionContextValue {
  status: SubscriptionStatus;
  isLoading: boolean;
  purchase: (plan: SubscriptionPlan) => Promise<void>;
  restore: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

/**
 * Wraps RevenueCat as the single source of truth for entitlement — see
 * ARCHITECTURE.md section 4.5 for why this is never derived from a local
 * flag or an app-owned backend alone. `Purchases.configure` is expected to
 * have already run (see app/_layout.tsx) before this provider mounts.
 */
export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SubscriptionStatus>(INACTIVE_STATUS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    Purchases.getCustomerInfo()
      .then((info) => {
        if (!cancelled) setStatus(subscriptionStatusFromCustomerInfo(info));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    // Keeps status live across renewals/cancellations/grace-period changes
    // that happen while the app is open, without polling.
    const listener = (info: import("react-native-purchases").CustomerInfo) => {
      setStatus(subscriptionStatusFromCustomerInfo(info));
    };
    Purchases.addCustomerInfoUpdateListener(listener);

    return () => {
      cancelled = true;
      Purchases.removeCustomerInfoUpdateListener(listener);
    };
  }, []);

  async function purchase(plan: SubscriptionPlan) {
    const info = await purchasePlan(plan);
    setStatus(subscriptionStatusFromCustomerInfo(info));
  }

  async function restore() {
    const info = await restorePurchasesApi();
    setStatus(subscriptionStatusFromCustomerInfo(info));
  }

  return (
    <SubscriptionContext.Provider value={{ status, isLoading, purchase, restore }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription(): SubscriptionContextValue {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
}
