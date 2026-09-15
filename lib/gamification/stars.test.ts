import { describe, expect, it } from "@jest/globals";
import { computeLessonStars, computeLessonStarsProgress } from "@/lib/gamification/stars";

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

describe("computeLessonStarsProgress", () => {
  it("shows 0 stars before the first third of a lesson is answered correctly", () => {
    expect(computeLessonStarsProgress(0, 9)).toBe(0);
    expect(computeLessonStarsProgress(2, 9)).toBe(0); // 2/9 < 1/3
  });

  it("lights the first star exactly at the one-third boundary", () => {
    expect(computeLessonStarsProgress(3, 9)).toBe(1); // 3/9 = 1/3 exactly
  });

  it("lights the second star exactly at the two-thirds boundary", () => {
    expect(computeLessonStarsProgress(6, 9)).toBe(2); // 6/9 = 2/3 exactly
  });

  it("only lights the third star once every exercise so far is correct", () => {
    expect(computeLessonStarsProgress(8, 9)).toBe(2);
    expect(computeLessonStarsProgress(9, 9)).toBe(3);
  });

  it("matches computeLessonStars' own final tally once the whole lesson is answered", () => {
    // At the very end of a lesson (correctSoFar counted against the same
    // fixed total), the progressive and final-rating functions must agree
    // — modulo computeLessonStars' own "always at least 1" floor, which
    // only applies to a genuinely completed lesson, not a 0-correct one.
    const totalExercises = 9;
    const mistakeCount = 4;
    const correctSoFar = totalExercises - mistakeCount;
    expect(computeLessonStarsProgress(correctSoFar, totalExercises)).toBe(computeLessonStars(mistakeCount, totalExercises));
  });
});
