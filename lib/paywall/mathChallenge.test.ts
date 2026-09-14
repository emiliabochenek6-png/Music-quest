import { describe, expect, it } from "@jest/globals";
import { generateMathChallenge } from "@/lib/paywall/mathChallenge";

describe("generateMathChallenge", () => {
  it("always produces an answer consistent with a + b", () => {
    for (let i = 0; i < 50; i++) {
      const challenge = generateMathChallenge();
      expect(challenge.answer).toBe(challenge.a + challenge.b);
    }
  });

  it("keeps operands in the two-digit-friendly range described in ARCHITECTURE.md", () => {
    for (let i = 0; i < 50; i++) {
      const challenge = generateMathChallenge();
      expect(challenge.a).toBeGreaterThanOrEqual(10);
      expect(challenge.a).toBeLessThan(50);
      expect(challenge.b).toBeGreaterThanOrEqual(5);
      expect(challenge.b).toBeLessThan(25);
    }
  });
});
