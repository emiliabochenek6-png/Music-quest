import { describe, expect, it } from "@jest/globals";
import { ICONS } from "@/components/icons/icons";
import { GUIDE_STEPS } from "@/lib/guide/guideSteps";

describe("new-player guide", () => {
  it("is short, with unique steps", () => {
    expect(GUIDE_STEPS.length).toBeGreaterThanOrEqual(5);
    expect(GUIDE_STEPS.length).toBeLessThanOrEqual(10);
    expect(new Set(GUIDE_STEPS.map((step) => step.id)).size).toBe(GUIDE_STEPS.length);
  });

  it("uses only icons that exist and keeps each message short", () => {
    for (const step of GUIDE_STEPS) {
      expect(Object.keys(ICONS)).toContain(step.icon);
      expect(step.message.length).toBeLessThanOrEqual(260);
      expect(step.title.length).toBeGreaterThan(3);
    }
  });

  it("points at real spots with a 'click here' style message and has no two steps on one spot", () => {
    const pointing = GUIDE_STEPS.filter((step) => step.target);
    expect(pointing.length).toBeGreaterThanOrEqual(5);
    expect(new Set(pointing.map((step) => step.target)).size).toBe(pointing.length);
    expect(pointing.filter((step) => /Kliknij|Tutaj/.test(step.message)).length).toBe(pointing.length);
  });

  it("tells about Sklep Solfka and points at the nutki pill", () => {
    const shop = GUIDE_STEPS.find((step) => step.id === "sklep");
    expect(shop?.target).toBe("shop");
    expect(shop?.message).toMatch(/ubiory/);
  });

  it("explains that a level opens with 2 stars, and starts and ends with a centred card", () => {
    expect(GUIDE_STEPS.some((step) => /minimum 2 gwiazdki/.test(step.message))).toBe(true);
    expect(GUIDE_STEPS[0].target).toBeUndefined();
    expect(GUIDE_STEPS[GUIDE_STEPS.length - 1].id).toBe("start");
    expect(GUIDE_STEPS[GUIDE_STEPS.length - 1].target).toBeUndefined();
  });
});
