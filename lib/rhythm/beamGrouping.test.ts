import { describe, expect, it } from "@jest/globals";
import { deriveBeamGroups } from "@/lib/rhythm/beamGrouping";

const eighths = (count: number) => Array.from({ length: count }, () => "eighth" as const);

describe("deriveBeamGroups for the odd eighth meters", () => {
  it("beams the whole bar of 3/8 as one group", () => {
    expect(deriveBeamGroups(eighths(3), "3/8")).toEqual([[0, 1, 2]]);
    expect(deriveBeamGroups(eighths(6), "3/8")).toEqual([[0, 1, 2], [3, 4, 5]]);
  });

  it("groups 5/8 as 3+2", () => {
    expect(deriveBeamGroups(eighths(5), "5/8")).toEqual([[0, 1, 2], [3, 4]]);
  });

  it("groups 7/8 as 2+2+3", () => {
    expect(deriveBeamGroups(eighths(7), "7/8")).toEqual([[0, 1], [2, 3], [4, 5, 6]]);
  });

  it("leaves a quarter alone and starts the next group after it", () => {
    expect(deriveBeamGroups(["quarter", "quarter", "eighth", "eighth", "eighth"], "7/8")).toEqual([[0], [1], [2, 3, 4]]);
  });

  it("keeps the usual pulse grouping for the other meters", () => {
    expect(deriveBeamGroups(eighths(8), "4/4")).toEqual([[0, 1], [2, 3], [4, 5], [6, 7]]);
    expect(deriveBeamGroups(eighths(6), "6/8")).toEqual([[0, 1, 2], [3, 4, 5]]);
  });
});
