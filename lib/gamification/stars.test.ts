import { describe, expect, it } from "@jest/globals";
import { computeLessonStars } from "@/lib/gamification/stars";

describe("computeLessonStars", () => {
  it("awards 3 stars for a clean run (zero mistakes)", () => {
    expect(computeLessonStars(0, 8)).toBe(3);
  });

  it("awards 2 stars for a mistake fraction at the 25% boundary", () => {
    expect(computeLessonStars(2, 8)).toBe(2); // 25% exactly
  });

  it("awards 1 star once mistakes exceed the 25% boundary", () => {
    expect(computeLessonStars(3, 8)).toBe(1); // 37.5%
  });

  it("awards 1 star for a lesson missed almost entirely", () => {
    expect(computeLessonStars(7, 8)).toBe(1);
  });

  it("still awards at least 1 star for a degenerate zero-exercise lesson with mistakes reported", () => {
    expect(computeLessonStars(1, 0)).toBe(1);
  });
});
