import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/lib/supabase/client";

/** Which account the progress saved on this device belongs to. Missing on a
 * device that has only ever been used without an account. */
const DATA_OWNER_KEY = "master-quest.data-owner";

type Listener = () => void;
const listeners = new Set<Listener>();

/** Registers a callback that runs when the device's local progress is wiped
 * (see resetLocalData). Every context that keeps player progress — progress,
 * XP/nutki, the study plan, Solfek's welcome — subscribes and puts itself
 * back to its starting state. Returns the unsubscribe function. */
export function onLocalDataReset(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Wipes the player's progress on this device: every subscribed context goes back to a brand-new start (0 XP, level 1, no finished lessons, no plan, Solfek's welcome shown again). */
export function resetLocalData(): void {
  listeners.forEach((listener) => listener());
}

/** True when this account has nothing saved in the cloud yet, i.e. it was created just now. A failed lookup (offline, error) counts as NOT new, so a hiccup can never wipe anyone's progress. */
async function isBrandNewAccount(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.from("app_state").select("user_id").eq("user_id", userId).maybeSingle();
    return !error && data === null;
  } catch {
    return false;
  }
}

/** Runs once each time an account signs in, BEFORE the cloud sync merges anything:
 *  - a brand-new account starts from zero (even on a device that already holds progress);
 *  - signing in as a different account than the one whose progress is on the device
 *    clears it first, so nobody inherits someone else's progress;
 *  - a session that was already signed in when the app started just claims the device's progress;
 *  - the same account again, or the first sign-in of an existing account on a device
 *    that was only used without an account, keeps what is there (and merges it with the cloud). */
export async function prepareLocalDataFor(userId: string, options: { restoredSession?: boolean } = {}): Promise<void> {
  let owner: string | null = null;
  try {
    owner = await AsyncStorage.getItem(DATA_OWNER_KEY);
  } catch {
    owner = null;
  }
  if (owner === userId) return;
  // A session restored on app start with no owner recorded is someone who was already signed in
  // before this check existed: their progress stays, and the device just records whose it is.
  const mayBeNewAccount = !options.restoredSession;
  if (owner !== null || (mayBeNewAccount && (await isBrandNewAccount(userId)))) resetLocalData();
  try {
    await AsyncStorage.setItem(DATA_OWNER_KEY, userId);
  } catch {
    // Not remembered this time: worst case the next sign-in repeats the check.
  }
}
