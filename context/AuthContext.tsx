import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { INITIAL_URL_HASH, supabase } from "@/lib/supabase/client";
import { parseRecoveryHash, recoveryRedirectUrl } from "@/lib/supabase/recoveryLink";
import { prepareLocalDataFor } from "@/lib/sync/localDataReset";

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  /** True while the first session is being read, and, right after a sign-in,
   * while the device decides whether to start this account from zero (see
   * lib/sync/localDataReset.ts) — so the map never flashes someone else's progress. */
  isLoading: boolean;
  /** The account id progress may sync with: null until the sign-in preparation is done. */
  syncUserId: string | null;
  /** True when this ACCOUNT has already met Solfek (his "Cześć, jestem Solfek!" window was shown once): kept in the account itself,
   * so signing in again, or on another phone, does not bring the greeting back. */
  introSeen: boolean;
  /** Remembers in the account that the greeting was shown. Never throws (offline is fine: it is tried again next time). */
  markIntroSeen: () => Promise<void>;
  /** Resolves to whether signup ALSO established a live session right
   * away — true when the Supabase project has email confirmation
   * disabled, false when Supabase's own default (confirm-before-signed-
   * in) still applies. app/auth/signup.tsx's own doc explains why the
   * caller needs this rather than just assuming one or the other. */
  signUp: (email: string, password: string) => Promise<{ signedInImmediately: boolean }>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  /** True while the player has come from the "reset your password" e-mail and has not chosen a new password yet. */
  isRecovering: boolean;
  /** The reset link was bad (expired or already used): the login screen says so. */
  recoveryLinkProblem: boolean;
  /** Saves the new password of a player who came from the reset e-mail (throws on failure). */
  updatePassword: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Real user accounts (Supabase Auth) — see lib/sync/useCloudSync.ts's own
 * doc for what this actually enables: cross-device progress sync. Also
 * the app's own gate now (see app/index.tsx): a signed-out `user` routes
 * to app/auth/login.tsx before anything else is reachable. Same
 * "getSession() once on mount, then a live listener" shape
 * SubscriptionContext.tsx already
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
  const [preparedForUserId, setPreparedForUserId] = useState<string | null>(null);
  // Coming from the link in the "reset your password" e-mail (see lib/supabase/recoveryLink.ts).
  const initialLink = useRef(parseRecoveryHash(INITIAL_URL_HASH)).current;
  const [isRecovering, setIsRecovering] = useState(initialLink.isRecovery);
  const [recoveryLinkProblem, setRecoveryLinkProblem] = useState(initialLink.isProblem);
  const userId = session?.user?.id ?? null;
  // The account whose session was already stored when the app opened (not a sign-in made just now).
  const restoredUserIdRef = useRef<string | null>(null);

  // Each sign-in: first decide whether this account starts from zero, only then let anything sync.
  useEffect(() => {
    if (!userId) {
      setPreparedForUserId(null);
      return;
    }
    let cancelled = false;
    void prepareLocalDataFor(userId, { restoredSession: restoredUserIdRef.current === userId }).finally(() => {
      if (!cancelled) setPreparedForUserId(userId);
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);
  const dataReady = userId === null || preparedForUserId === userId;

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      restoredUserIdRef.current = data.session?.user?.id ?? null;
      setSession(data.session);
      setIsLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      if (event === "PASSWORD_RECOVERY") setIsRecovering(true);
    });

    return () => {
      cancelled = true;
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    // A non-null session here means Supabase's project has email
    // confirmation turned off, so signUp already logged the player in —
    // the SAME response also carries a non-null `user` even when a
    // session ISN'T returned (confirmation still pending), so `session`
    // specifically (not `user`) is the right thing to check.
    return { signedInImmediately: data.session !== null };
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

  async function markIntroSeen() {
    try {
      await supabase.auth.updateUser({ data: { solfekIntroSeen: true } });
    } catch {
      // Offline or a hiccup: the next start tries again.
    }
  }

  async function resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: recoveryRedirectUrl() });
    if (error) throw error;
  }

  async function updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    setIsRecovering(false);
    setRecoveryLinkProblem(false);
  }

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, isLoading: isLoading || !dataReady, syncUserId: dataReady ? userId : null, introSeen: session?.user?.user_metadata?.solfekIntroSeen === true, markIntroSeen, signUp, signIn, signOut, resetPassword, isRecovering, recoveryLinkProblem, updatePassword }}>
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
