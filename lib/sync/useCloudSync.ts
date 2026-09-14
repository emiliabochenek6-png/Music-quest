import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase/client";

interface UseCloudSyncOptions<T> {
  /** null while logged out — the hook is a complete no-op then, nothing
   * local ever gets touched (see this file's own doc). */
  userId: string | null;
  /** Which JSONB column of the single `app_state` table (see
   * supabase/schema.sql) this instance owns — ProgressContext and
   * GamificationContext each mount their own useCloudSync call against
   * their own column, both rows of the SAME table keyed by user_id. */
  column: "progress" | "gamification";
  localState: T;
  setLocalState: (value: T) => void;
  merge: (local: T, remote: T) => T;
  /** Converts T to a JSON-safe value before it's sent to Supabase —
   * defaults to identity, which is fine for GamificationState (already
   * plain objects/arrays/primitives throughout). ProgressState needs a
   * real one: `JSON.stringify` silently drops a `Set`'s own contents
   * (serializes to `{}`), so completedWorldIds/completedLessonIds have
   * to become arrays first — see context/ProgressContext.tsx's own
   * usage. */
  serialize?: (value: T) => unknown;
  /** The inverse of `serialize`, applied to whatever comes back from
   * Supabase before it's handed to `merge` (which expects the real
   * typed T, not raw JSON). */
  deserialize?: (value: unknown) => T;
}

/**
 * Opt-in cloud backup/restore for ONE piece of local state — mounted
 * once each inside ProgressContext.tsx and GamificationContext.tsx, both
 * against the same `app_state` table (see supabase/schema.sql), each
 * owning its own column. Nothing here runs at all while `userId` is
 * null (logged out) — every context's existing AsyncStorage-based
 * persistence (readJson/writeJson) is completely untouched and remains
 * the source of truth on-device; this only ever ADDS a cloud mirror on
 * top once an account exists, never replaces local storage.
 *
 * Two distinct moments, handled by two separate effects:
 *   1. `userId` changes from null to a real id (a fresh sign-in) — pulls
 *      whatever's already in the cloud for this account, MERGES it with
 *      whatever's already local (via the caller's own `merge` — see
 *      lib/sync/mergeState.ts's own doc for why a real merge, not an
 *      overwrite, matters: the device signing in might already have its
 *      own real progress from playing as a guest), adopts the merged
 *      result locally, then pushes that same merged result back to the
 *      cloud so both sides start from the same reconciled point. This
 *      is the ONLY time `merge` is ever called — every later write just
 *      pushes the device's own current state outright, not a merge
 *      (see mergedForUserIdRef below for why that's safe).
 *   2. Any later change to `localState` WHILE already merged for the
 *      CURRENT `userId` — pushes the new value to the cloud, fire-and-
 *      forget, the same "don't await it, just let it happen in the
 *      background" spirit every context's own `void writeJson(...)`
 *      call already has for AsyncStorage.
 *
 * `mergedForUserIdRef` exists specifically to stop step 2 from firing
 * with a STALE, not-yet-merged local snapshot in the brief window
 * before step 1's own merge has actually landed — without it, a race
 * could push the guest-only local state over whatever the account
 * already had in the cloud, discarding it, exactly the data-loss this
 * whole module exists to prevent.
 */
export function useCloudSync<T>({ userId, column, localState, setLocalState, merge, serialize, deserialize }: UseCloudSyncOptions<T>): void {
  const toJson = serialize ?? ((value: T) => value as unknown);
  const fromJson = deserialize ?? ((value: unknown) => value as T);

  const mergedForUserIdRef = useRef<string | null>(null);
  const localStateRef = useRef(localState);
  localStateRef.current = localState;

  // Step 1 — login-time pull + merge + push-back.
  useEffect(() => {
    if (!userId) {
      mergedForUserIdRef.current = null;
      return;
    }
    let cancelled = false;
    mergedForUserIdRef.current = null;

    supabase
      .from("app_state")
      .select(column)
      .eq("user_id", userId)
      .maybeSingle()
      .then(async ({ data, error }) => {
        if (cancelled) return;
        const rawRemote = !error && data ? (data as Record<string, unknown>)[column] : null;
        const remote = rawRemote !== null && rawRemote !== undefined ? fromJson(rawRemote) : null;
        const merged = remote ? merge(localStateRef.current, remote) : localStateRef.current;
        setLocalState(merged);
        mergedForUserIdRef.current = userId;
        await supabase.from("app_state").upsert({ user_id: userId, [column]: toJson(merged), updated_at: new Date().toISOString() });
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, column]);

  // Step 2 — every later local change, once merged for this session.
  useEffect(() => {
    if (!userId || mergedForUserIdRef.current !== userId) return;
    void supabase.from("app_state").upsert({ user_id: userId, [column]: toJson(localState), updated_at: new Date().toISOString() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localState]);
}
