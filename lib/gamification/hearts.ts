import { HEART_REGEN_MS, MAX_HEARTS } from "@/types/gamification";
import type { GamificationState } from "@/types/gamification";

type HeartsSlice = Pick<GamificationState, "hearts" | "lastHeartChangeAtISO">;

/** Catches up any WHOLE hearts that should have regenerated since
 * `lastHeartChangeAtISO`, without discarding progress toward the NEXT
 * one — the clock only advances by `regenerated * HEART_REGEN_MS`, not
 * all the way to `nowMs`, so a player who's 3 hours into a 4-hour wait
 * when they check the app doesn't lose that partial progress just
 * because this function happened to run. Once hearts are full, the
 * clock is irrelevant (returned as-is) — there's nothing left to catch
 * up to. Pure — callers (loseHeart, deriveHearts, and
 * GamificationContext's own persistence) all build on this same
 * reconciliation instead of duplicating the math. */
function applyHeartRegen(state: HeartsSlice, nowMs: number): { hearts: number; lastHeartChangeAtISO: string | null } {
  if (state.hearts >= MAX_HEARTS) {
    return { hearts: Math.min(state.hearts, MAX_HEARTS), lastHeartChangeAtISO: state.lastHeartChangeAtISO };
  }
  if (state.lastHeartChangeAtISO === null) {
    // Below MAX with no recorded change time (shouldn't happen in
    // practice — loseHeart always sets one — but a fresh/corrupt state
    // is handled the same safe way): start the clock now rather than
    // throwing or assuming an arbitrary elapsed time.
    return { hearts: state.hearts, lastHeartChangeAtISO: new Date(nowMs).toISOString() };
  }
  const lastChangeMs = new Date(state.lastHeartChangeAtISO).getTime();
  const elapsedMs = Math.max(0, nowMs - lastChangeMs);
  const regenerated = Math.floor(elapsedMs / HEART_REGEN_MS);
  if (regenerated <= 0) {
    return { hearts: state.hearts, lastHeartChangeAtISO: state.lastHeartChangeAtISO };
  }
  const hearts = Math.min(MAX_HEARTS, state.hearts + regenerated);
  // Once full, there's no more "next heart" to time, so the clock no
  // longer matters — snapping it to nowMs (rather than the exact
  // consumed-ms point) is harmless and keeps the stored value tidy.
  const newLastChangeMs = hearts >= MAX_HEARTS ? nowMs : lastChangeMs + regenerated * HEART_REGEN_MS;
  return { hearts, lastHeartChangeAtISO: new Date(newLastChangeMs).toISOString() };
}

export interface HeartsInfo {
  hearts: number;
  /** Milliseconds until the NEXT heart regenerates — null once hearts
   * are already full (nothing to wait for). */
  msUntilNextHeart: number | null;
}

/** The read-side of the hearts system — what a hearts badge or an
 * out-of-hearts screen actually displays. `unlimited` (premium
 * subscribers — see this app's own SubscriptionContext) short-circuits
 * to always-full, ignoring stored state entirely: a real, tangible perk
 * of subscribing, beyond just unlocking premium worlds. */
export function deriveHearts(state: HeartsSlice, nowMs: number, unlimited: boolean): HeartsInfo {
  if (unlimited) return { hearts: MAX_HEARTS, msUntilNextHeart: null };
  const { hearts, lastHeartChangeAtISO } = applyHeartRegen(state, nowMs);
  if (hearts >= MAX_HEARTS || lastHeartChangeAtISO === null) {
    return { hearts, msUntilNextHeart: null };
  }
  const elapsedMs = Math.max(0, nowMs - new Date(lastHeartChangeAtISO).getTime());
  return { hearts, msUntilNextHeart: HEART_REGEN_MS - elapsedMs };
}

/** The write-side: a wrong answer costs one heart. First reconciles any
 * regeneration that happened since the last change (same as
 * deriveHearts would show), THEN deducts one and restarts the
 * regeneration clock from now — a miss always resets the wait for the
 * NEXT heart to the full HEART_REGEN_MS, it doesn't inherit whatever
 * partial progress the just-lost heart's slot had. Floors at 0 (can't
 * go negative) rather than the caller needing to guard against calling
 * this with unlimited hearts — GamificationContext's own loseHeart
 * setter just skips calling this entirely when the player is premium. */
export function loseHeart(state: HeartsSlice, nowMs: number): { hearts: number; lastHeartChangeAtISO: string } {
  const regenerated = applyHeartRegen(state, nowMs);
  return { hearts: Math.max(0, regenerated.hearts - 1), lastHeartChangeAtISO: new Date(nowMs).toISOString() };
}
