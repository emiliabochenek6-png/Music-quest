import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Platform } from "react-native";
import Purchases from "react-native-purchases";
import { purchasePlan, subscriptionStatusFromCustomerInfo } from "@/lib/subscriptions/purchases";
import type { SubscriptionPlan, SubscriptionStatus } from "@/types/content";

/** react-native-purchases wraps StoreKit/Play Billing — there is no web
 * implementation, and calling into it on web (module import aside) would
 * throw the moment any of its native-bridge methods actually ran. The
 * PWA build (see app/_layout.tsx's own web guard on configurePurchases)
 * never configures the SDK on web in the first place, so this provider
 * mirrors that: on web, subscription status just stays permanently
 * inactive and purchase/restore reject with a clear message, rather than
 * this whole screen crashing the first time anything here touches
 * `Purchases`. Real web payments (Stripe or similar) would be a
 * genuinely separate integration, not something this SDK can do. */
const IS_WEB = Platform.OS === "web";

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
    if (IS_WEB) {
      setIsLoading(false);
      return;
    }
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
    if (IS_WEB) {
      throw new Error("Zakupy nie są dostępne w wersji przeglądarkowej — pobierz aplikację na telefon.");
    }
    const info = await purchasePlan(plan);
    setStatus(subscriptionStatusFromCustomerInfo(info));
  }

  return (
    <SubscriptionContext.Provider value={{ status, isLoading, purchase }}>
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
