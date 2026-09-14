import { describe, expect, it } from "@jest/globals";
import { classifyPitchMatch, noteToFrequency, octaveFoldedCentsDifference, parseScientific } from "@/lib/music/notes";

describe("octaveFoldedCentsDifference", () => {
  it("is zero for identical frequencies", () => {
    expect(octaveFoldedCentsDifference(440, 440)).toBeCloseTo(0);
  });

  it("is octave-agnostic", () => {
    expect(octaveFoldedCentsDifference(880, 440)).toBeCloseTo(0);
    expect(octaveFoldedCentsDifference(220, 440)).toBeCloseTo(0);
  });

  it("preserves sign for a small sharp/flat deviation", () => {
    const sharp = 440 * Math.pow(2, 30 / 1200);
    const flat = 440 * Math.pow(2, -30 / 1200);
    expect(octaveFoldedCentsDifference(sharp, 440)).toBeCloseTo(30, 0);
    expect(octaveFoldedCentsDifference(flat, 440)).toBeCloseTo(-30, 0);
  });
});

describe("classifyPitchMatch", () => {
  const targetHz = noteToFrequency(parseScientific("C4"));

  it("match when within tolerance, including right at the boundary", () => {
    expect(classifyPitchMatch(targetHz, targetHz, 50)).toBe("match");
    expect(classifyPitchMatch(targetHz * Math.pow(2, 49 / 1200), targetHz, 50)).toBe("match");
  });

  it("sharp/flat just past tolerance but within FAR_MISS_CENTS", () => {
    expect(classifyPitchMatch(targetHz * Math.pow(2, 100 / 1200), targetHz, 50)).toBe("sharp");
    expect(classifyPitchMatch(targetHz * Math.pow(2, -100 / 1200), targetHz, 50)).toBe("flat");
  });

  it("far when off by more than a couple of semitones", () => {
    expect(classifyPitchMatch(targetHz * Math.pow(2, 400 / 1200), targetHz, 50)).toBe("far");
  });

  it("match is octave-agnostic", () => {
    expect(classifyPitchMatch(targetHz * 2, targetHz, 50)).toBe("match");
    expect(classifyPitchMatch(targetHz / 2, targetHz, 50)).toBe("match");
  });
});
