import { describe, expect, it } from "@jest/globals";
import { computeIntervalTimedTestStars, isValidIntervalTimedTest } from "@/lib/questions/intervalTimedTest";

describe("computeIntervalTimedTestStars", () => {
  it("gives 3 stars from 90% correct", () => {
    expect(computeIntervalTimedTestStars(18, 20)).toBe(3);
    expect(computeIntervalTimedTestStars(20, 20)).toBe(3);
  });

  it("gives 2 stars from 70% up to just under 90%", () => {
    expect(computeIntervalTimedTestStars(14, 20)).toBe(2);
    expect(computeIntervalTimedTestStars(17, 20)).toBe(2);
  });

  it("gives 1 star below 70%, including a run that also fails the 60% pass bar", () => {
    expect(computeIntervalTimedTestStars(13, 20)).toBe(1);
    expect(computeIntervalTimedTestStars(0, 20)).toBe(1);
    expect(isValidIntervalTimedTest(12, 20)).toBe(true);
    expect(isValidIntervalTimedTest(11, 20)).toBe(false);
  });

  it("gives 1 star when nothing was answered", () => {
    expect(computeIntervalTimedTestStars(0, 0)).toBe(1);
  });
});
