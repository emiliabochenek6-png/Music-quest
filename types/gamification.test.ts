import { describe, expect, it } from "@jest/globals";
import { INITIAL_GAMIFICATION_STATE, MAX_HEARTS, sanitizeGamificationState } from "@/types/gamification";

describe("sanitizeGamificationState", () => {
  it("returns the defaults for null/undefined (nothing stored yet)", () => {
    expect(sanitizeGamificationState(null)).toEqual(INITIAL_GAMIFICATION_STATE);
    expect(sanitizeGamificationState(undefined)).toEqual(INITIAL_GAMIFICATION_STATE);
  });

  it("fills in fields missing from an older save (pre-Nutki blob) with their defaults", () => {
    const oldBlob = { xp: 120, hearts: 10, streakDays: 3 } as ReturnType<typeof sanitizeGamificationState>;
    const sanitized = sanitizeGamificationState(oldBlob);
    expect(sanitized.xp).toBe(120);
    expect(sanitized.hearts).toBe(10);
    expect(sanitized.nutki).toBe(0);
    expect(sanitized.streakFreezes).toBe(0);
  });

  it("clamps an already-corrupted NaN back to a sane default instead of propagating it", () => {
    const corrupted = { ...INITIAL_GAMIFICATION_STATE, nutki: NaN, xp: NaN, hearts: NaN };
    const sanitized = sanitizeGamificationState(corrupted);
    expect(sanitized.nutki).toBe(0);
    expect(sanitized.xp).toBe(0);
    expect(sanitized.hearts).toBe(MAX_HEARTS);
  });

  it("leaves an already-healthy state untouched", () => {
    const healthy = { ...INITIAL_GAMIFICATION_STATE, xp: 900, nutki: 42, streakFreezes: 2 };
    expect(sanitizeGamificationState(healthy)).toEqual(healthy);
  });
});
