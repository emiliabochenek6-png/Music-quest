// Polyfills URL/URLSearchParams for React Native's JS engine (Hermes) —
// @supabase/supabase-js assumes a browser-complete URL implementation
// under the hood; without this, auth/network calls can fail in subtle
// ways on-device even though the same code works fine in a Node test
// environment. Supabase's own React Native setup guide asks for this
// import, at the app's entry point, before the client is ever created.
import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

// Unlike RevenueCat's own Purchases.configure({ apiKey: "" }) (which
// accepts an empty placeholder and only fails later, when an actual
// network call is made), @supabase/supabase-js's createClient THROWS
// synchronously — "supabaseUrl is required" — for a falsy/malformed URL,
// right at construction time. Since `supabase` below is a module-level
// singleton (imported transitively by every screen through
// AuthContext), that throw would crash the entire app — including its
// own static web export's server-side render step, which is how this
// was actually caught — before any real screen ever got a chance to
// render, let alone show a friendly "not configured" error. A
// syntactically-valid placeholder URL sidesteps the eager check; every
// ACTUAL network call still fails normally afterward (a real, catchable
// error — see context/AuthContext.tsx's own doc) if real credentials
// were never supplied. The anon key gets the same treatment — createClient
// throws "supabaseKey is required" just as eagerly for a falsy key.
const PLACEHOLDER_SUPABASE_URL = "https://placeholder.supabase.co";
const PLACEHOLDER_SUPABASE_ANON_KEY = "placeholder-anon-key";

// A SECOND construction-time surprise, also only surfaced by the static
// web export's own server-side prerender step (a genuine Node.js
// environment, not a browser): Supabase's own GoTrueClient loads
// whatever session the configured `storage` already has EAGERLY, at
// construction time, not lazily on first use — AsyncStorage's own web
// implementation assumes `window.localStorage` exists, which it simply
// doesn't in Node. `typeof window === "undefined"` correctly identifies
// ONLY that Node prerender case: React Native itself polyfills a global
// `window` (so native builds see this as false, real AsyncStorage), and
// a real browser obviously has one too — only Expo Router's own
// server-side render step lacks it entirely. A tiny no-op storage there
// sidesteps the crash; nothing meaningful could persist across that
// one-shot prerender anyway.
const noopStorage = {
  getItem: async () => null,
  setItem: async () => {},
  removeItem: async () => {},
};
const authStorage = typeof window === "undefined" ? noopStorage : AsyncStorage;

/**
 * The Supabase client — one instance for the whole app, same "module-
 * level singleton" shape lib/subscriptions/purchases.ts uses for
 * RevenueCat. Session tokens persist through AsyncStorage (the same
 * store every other piece of local state in this app already uses —
 * see lib/storage.ts), which is Supabase's own documented default for
 * React Native; `expo-secure-store` would be more hardened but adds a
 * storage-adapter shape mismatch to bridge for a kids'-education app
 * that isn't handling especially sensitive data.
 *
 * URL/anon key come from EXPO_PUBLIC_* env vars — the exact same
 * "placeholder, don't crash without a real key" pattern app/_layout.tsx
 * already uses for EXPO_PUBLIC_REVENUECAT_API_KEY, adapted for
 * createClient's own stricter eager validation (see
 * PLACEHOLDER_SUPABASE_URL's own doc above).
 */
export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL ?? PLACEHOLDER_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? PLACEHOLDER_SUPABASE_ANON_KEY,
  {
    auth: {
      storage: authStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
