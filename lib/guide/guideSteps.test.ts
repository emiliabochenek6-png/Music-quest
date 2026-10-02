import { describe, expect, it } from "@jest/globals";
import { ICONS } from "@/components/icons/icons";
import { GUIDE_STEPS } from "@/lib/guide/guideSteps";

describe("new-player guide", () => {
  it("is short, with unique steps", () => {
    expect(GUIDE_STEPS.length).toBeGreaterThanOrEqual(5);
    expect(GUIDE_STEPS.length).toBeLessThanOrEqual(8);
    expect(new Set(GUIDE_STEPS.map((step) => step.id)).size).toBe(GUIDE_STEPS.length);
  });

  it("uses only icons that exist and keeps each message short", () => {
    for (const step of GUIDE_STEPS) {
      expect(Object.keys(ICONS)).toContain(step.icon);
      expect(step.message.length).toBeLessThanOrEqual(260);
      expect(step.title.length).toBeGreaterThan(3);
    }
  });

  it("mentions the rule that a level opens with 2 stars, and ends by offering the start", () => {
    expect(GUIDE_STEPS.some((step) => /2 gwiazdki/.test(step.message))).toBe(true);
    expect(GUIDE_STEPS[GUIDE_STEPS.length - 1].id).toBe("start");
  });
});
