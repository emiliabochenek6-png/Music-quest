import { describe, expect, it } from "@jest/globals";
import { assignAccidentalColumns } from "@/lib/music/accidentalColumns";

describe("assignAccidentalColumns", () => {
  it("puts a lone accidental in column 0 and leaves natural notes alone", () => {
    expect(assignAccidentalColumns([0, 2, 4], [0, 1, 0])).toEqual([-1, 0, -1]);
  });

  it("staggers a stack of thirds that all have accidentals (F#-A#-C#) into separate columns", () => {
    // steps 0, 2, 4 — each pair is closer than a seventh, so three columns.
    const columns = assignAccidentalColumns([0, 2, 4], [1, 1, 1]);
    expect(new Set(columns).size).toBe(3);
    expect(columns[2]).toBe(0); // topmost nearest the chord
  });

  it("lets a note a seventh or more below the top one reuse the inner column", () => {
    // seventh chord: steps 0, 2, 4, 6 — the bottom (6 below the top) fits column 0 again.
    expect(assignAccidentalColumns([0, 2, 4, 6], [1, 1, 1, 1])).toEqual([0, 2, 1, 0]);
  });

  it("never lets two accidentals in the same column sit closer than the minimum gap", () => {
    for (const steps of [[0, 1, 2, 3], [0, 2, 4, 6, 8], [0, 1, 2, 3, 4, 5, 6]]) {
      const columns = assignAccidentalColumns(steps, steps.map(() => -1));
      for (let a = 0; a < steps.length; a++) {
        for (let b = a + 1; b < steps.length; b++) {
          if (columns[a] === columns[b]) expect(Math.abs(steps[a] - steps[b])).toBeGreaterThanOrEqual(6);
        }
      }
    }
  });
});
