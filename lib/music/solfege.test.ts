import { describe, expect, it } from "@jest/globals";
import { noteToFrequency } from "@/lib/music/notes";
import { getSolfegeSyllable, nearestSolfegeReading } from "@/lib/music/solfege";

describe("getSolfegeSyllable", () => {
  it("maps every natural letter to its fixed-do Polish syllable", () => {
    expect(getSolfegeSyllable("C", "pl")).toBe("do");
    expect(getSolfegeSyllable("D", "pl")).toBe("re");
    expect(getSolfegeSyllable("E", "pl")).toBe("mi");
    expect(getSolfegeSyllable("F", "pl")).toBe("fa");
    expect(getSolfegeSyllable("G", "pl")).toBe("sol");
    expect(getSolfegeSyllable("A", "pl")).toBe("la");
    expect(getSolfegeSyllable("B", "pl")).toBe("si");
  });
});

describe("nearestSolfegeReading", () => {
  it("reports the exact syllable with ~0 cents off for an in-tune natural note, any octave", () => {
    for (const [letter, syllable] of [
      ["C", "do"],
      ["E", "mi"],
      ["G", "sol"],
      ["B", "si"],
    ] as const) {
      for (const octave of [3, 4, 5]) {
        const reading = nearestSolfegeReading(noteToFrequency({ letter, accidental: 0, octave }), "pl");
        expect(reading.syllable).toBe(syllable);
        expect(Math.abs(reading.centsOff)).toBeLessThan(1);
      }
    }
  });

  it("reports a small positive centsOff for a slightly sharp attempt", () => {
    const slightlySharp = noteToFrequency({ letter: "D", accidental: 0, octave: 4 }) * Math.pow(2, 25 / 1200);
    const reading = nearestSolfegeReading(slightlySharp, "pl");
    expect(reading.syllable).toBe("re");
    expect(reading.centsOff).toBeCloseTo(25, 0);
  });

  it("reports a small negative centsOff for a slightly flat attempt", () => {
    const slightlyFlat = noteToFrequency({ letter: "F", accidental: 0, octave: 4 }) * Math.pow(2, -25 / 1200);
    const reading = nearestSolfegeReading(slightlyFlat, "pl");
    expect(reading.syllable).toBe("fa");
    expect(reading.centsOff).toBeCloseTo(-25, 0);
  });

  it("never reports a chromatic syllable — a pitch between two naturals still picks the CLOSEST one", () => {
    // Exactly between C4 and D4 (a whole step apart, ~200 cents) — this
    // world has no "do dièse", so the reading must still be one of the 7
    // natural syllables, each within (-100, 100] cents of its own center.
    const betweenCAndD = noteToFrequency({ letter: "C", accidental: 0, octave: 4 }) * Math.pow(2, 100 / 1200);
    const reading = nearestSolfegeReading(betweenCAndD, "pl");
    expect(["do", "re"]).toContain(reading.syllable);
    expect(Math.abs(reading.centsOff)).toBeLessThanOrEqual(100);
  });
});
