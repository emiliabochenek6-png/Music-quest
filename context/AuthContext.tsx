import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Real user accounts (Supabase Auth) — see lib/sync/useCloudSync.ts's own
 * doc for what this actually enables: cross-device progress sync, opt-in
 * from Settings, not a gate on using the app at all (see app/index.tsx —
 * deliberately untouched by this feature). Same "getSession() once on
 * mount, then a live listener" shape SubscriptionContext.tsx already
 * uses for RevenueCat's own addCustomerInfoUpdateListener — this is
 * that same pattern applied to Supabase's own onAuthStateChange, which
 * plays the identical role (keeps `session` current across sign-in/out/
 * token-refresh events that happen while the app is open).
 *
 * signUp/signIn/signOut/resetPassword all throw on failure (Supabase's
 * own AuthError) rather than swallowing it — the login/signup screens
 * are what actually translate a thrown error into Polish, user-facing
 * copy (see app/auth/login.tsx's own doc), this context just relays
 * Supabase's verdict.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setSession(data.session);
      setIsLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      cancelled = true;
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function signUp(email: string, password: string) {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async function signOut() {
    // Deliberately doesn't touch any local AsyncStorage state — see
    // useCloudSync's own doc: signing out just stops further cloud
    // syncing, the player's local progress stays on-device exactly as
    // it was, offline-first.
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async function resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  }

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, isLoading, signUp, signIn, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
