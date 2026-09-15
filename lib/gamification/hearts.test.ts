import { describe, expect, it } from "@jest/globals";
import { deriveHearts, gainHearts, loseHeart } from "@/lib/gamification/hearts";
import { HEART_REGEN_MS, MAX_HEARTS } from "@/types/gamification";

const NOW = Date.parse("2026-01-10T12:00:00.000Z");

describe("deriveHearts", () => {
  it("reports full hearts with no wait when already at MAX_HEARTS", () => {
    const info = deriveHearts({ hearts: MAX_HEARTS, lastHeartChangeAtISO: null }, NOW, false);
    expect(info).toEqual({ hearts: MAX_HEARTS, msUntilNextHeart: null });
  });

  it("reports the stored count with a countdown when not enough time has passed for a full regen", () => {
    const lastHeartChangeAtISO = new Date(NOW - 60 * 60 * 1000).toISOString(); // 1h ago
    const info = deriveHearts({ hearts: 3, lastHeartChangeAtISO }, NOW, false);
    expect(info.hearts).toBe(3);
    expect(info.msUntilNextHeart).toBe(HEART_REGEN_MS - 60 * 60 * 1000);
  });

  it("regenerates exactly one heart once a full HEART_REGEN_MS has elapsed", () => {
    const lastHeartChangeAtISO = new Date(NOW - HEART_REGEN_MS).toISOString();
    const info = deriveHearts({ hearts: 2, lastHeartChangeAtISO }, NOW, false);
    expect(info.hearts).toBe(3);
    expect(info.msUntilNextHeart).toBe(HEART_REGEN_MS);
  });

  it("preserves partial progress toward the NEXT heart instead of resetting it after a regen tick", () => {
    // 5 hours ago: one full 4h tick (now 1h stale) PLUS a 1h head start
    // toward the following one — the countdown shown now should reflect
    // that 1h head start (3h left), not a fresh full 4h wait.
    const lastHeartChangeAtISO = new Date(NOW - (HEART_REGEN_MS + 60 * 60 * 1000)).toISOString();
    const info = deriveHearts({ hearts: 2, lastHeartChangeAtISO }, NOW, false);
    expect(info.hearts).toBe(3);
    expect(info.msUntilNextHeart).toBe(HEART_REGEN_MS - 60 * 60 * 1000);
  });

  it("caps regeneration at MAX_HEARTS even after a very long absence", () => {
    const lastHeartChangeAtISO = new Date(NOW - HEART_REGEN_MS * 100).toISOString();
    const info = deriveHearts({ hearts: 0, lastHeartChangeAtISO }, NOW, false);
    expect(info).toEqual({ hearts: MAX_HEARTS, msUntilNextHeart: null });
  });

  it("ignores stored state entirely and reports unlimited hearts for premium subscribers", () => {
    const info = deriveHearts({ hearts: 0, lastHeartChangeAtISO: new Date(NOW).toISOString() }, NOW, true);
    expect(info).toEqual({ hearts: MAX_HEARTS, msUntilNextHeart: null });
  });
});

describe("loseHeart", () => {
  it("deducts one heart and restarts the regeneration clock from now", () => {
    const result = loseHeart({ hearts: MAX_HEARTS, lastHeartChangeAtISO: null }, NOW);
    expect(result.hearts).toBe(MAX_HEARTS - 1);
    expect(result.lastHeartChangeAtISO).toBe(new Date(NOW).toISOString());
  });

  it("catches up pending regeneration before deducting", () => {
    // 2 full ticks pending (hearts should regen 1 -> 3 first), THEN lose one -> 2.
    const lastHeartChangeAtISO = new Date(NOW - HEART_REGEN_MS * 2).toISOString();
    const result = loseHeart({ hearts: 1, lastHeartChangeAtISO }, NOW);
    expect(result.hearts).toBe(2);
    expect(result.lastHeartChangeAtISO).toBe(new Date(NOW).toISOString());
  });

  it("floors at 0 — never goes negative", () => {
    const result = loseHeart({ hearts: 0, lastHeartChangeAtISO: new Date(NOW).toISOString() }, NOW);
    expect(result.hearts).toBe(0);
  });
});

describe("gainHearts", () => {
  it("adds the given amount without touching the regen clock", () => {
    const lastHeartChangeAtISO = new Date(NOW - 60 * 60 * 1000).toISOString(); // 1h into the wait
    const result = gainHearts({ hearts: 5, lastHeartChangeAtISO }, NOW, 2);
    expect(result.hearts).toBe(7);
    expect(result.lastHeartChangeAtISO).toBe(lastHeartChangeAtISO); // unchanged — no reset, unlike loseHeart
  });

  it("caps at MAX_HEARTS and only then snaps the clock to now", () => {
    const lastHeartChangeAtISO = new Date(NOW - 60 * 60 * 1000).toISOString();
    const result = gainHearts({ hearts: MAX_HEARTS - 1, lastHeartChangeAtISO }, NOW, 2);
    expect(result.hearts).toBe(MAX_HEARTS);
    expect(result.lastHeartChangeAtISO).toBe(new Date(NOW).toISOString());
  });

  it("catches up pending regeneration before adding the bonus", () => {
    // 2 full ticks pending (hearts should regen 1 -> 3 first), THEN +2 -> 5.
    const lastHeartChangeAtISO = new Date(NOW - HEART_REGEN_MS * 2).toISOString();
    const result = gainHearts({ hearts: 1, lastHeartChangeAtISO }, NOW, 2);
    expect(result.hearts).toBe(5);
  });
});
