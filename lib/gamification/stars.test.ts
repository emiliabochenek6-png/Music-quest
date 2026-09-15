import { describe, expect, it } from "@jest/globals";
import { computeLessonStars } from "@/lib/gamification/stars";

describe("computeLessonStars", () => {
  it("awards 3 stars for a clean run (zero mistakes)", () => {
    expect(computeLessonStars(0, 9)).toBe(3);
  });

  it("awards only 2 stars for a single mistake — 3 stars requires a perfect run", () => {
    expect(computeLessonStars(1, 9)).toBe(2); // 8/9 correct, below the 3-star (perfect) threshold
  });

  it("awards 2 stars for exactly two-thirds correct", () => {
    expect(computeLessonStars(3, 9)).toBe(2); // 6/9 correct = 2/3 exactly
  });

  it("awards 1 star just below the two-thirds boundary", () => {
    expect(computeLessonStars(4, 9)).toBe(1); // 5/9 correct < 2/3
  });

  it("awards 1 star for a lesson missed almost entirely", () => {
    expect(computeLessonStars(8, 9)).toBe(1); // 1/9 correct
  });

  it("still awards at least 1 star for a degenerate zero-exercise lesson with mistakes reported", () => {
    expect(computeLessonStars(1, 0)).toBe(1);
  });
});
