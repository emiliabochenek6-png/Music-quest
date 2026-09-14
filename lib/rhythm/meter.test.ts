import { describe, expect, it } from "@jest/globals";
import { meterFeltPulseCount, meterFeltPulseQuarterBeats, meterPulseSubdivision, meterQuarterNoteBeats } from "@/lib/rhythm/meter";

describe("meterQuarterNoteBeats", () => {
  it("returns 4 for 4/4 and 3 for 3/4", () => {
    expect(meterQuarterNoteBeats("4/4")).toBe(4);
    expect(meterQuarterNoteBeats("3/4")).toBe(3);
  });

  it("returns 3 for 6/8 (six eighths = three quarter-note beats)", () => {
    expect(meterQuarterNoteBeats("6/8")).toBe(3);
  });
});

describe("meterFeltPulseCount / meterPulseSubdivision", () => {
  it("simple /4 meters feel one pulse per written beat, no subdivision", () => {
    expect(meterFeltPulseCount("4/4")).toBe(4);
    expect(meterPulseSubdivision("4/4")).toBe(1);
    expect(meterFeltPulseCount("3/4")).toBe(3);
    expect(meterPulseSubdivision("3/4")).toBe(1);
    expect(meterFeltPulseCount("2/4")).toBe(2);
    expect(meterPulseSubdivision("2/4")).toBe(1);
  });

  it("2/2 is felt as 2 half-note pulses, each subdividing into 2 quarters", () => {
    expect(meterFeltPulseCount("2/2")).toBe(2);
    expect(meterPulseSubdivision("2/2")).toBe(2);
  });

  it("compound 6/8, 9/8, 12/8 are felt as dotted-quarter pulses, each subdividing into 3", () => {
    expect(meterFeltPulseCount("6/8")).toBe(2);
    expect(meterPulseSubdivision("6/8")).toBe(3);
    expect(meterFeltPulseCount("9/8")).toBe(3);
    expect(meterPulseSubdivision("9/8")).toBe(3);
    expect(meterFeltPulseCount("12/8")).toBe(4);
    expect(meterPulseSubdivision("12/8")).toBe(3);
  });
});

describe("meterFeltPulseQuarterBeats", () => {
  it("is 1 quarter-beat per pulse for simple /4 meters", () => {
    expect(meterFeltPulseQuarterBeats("4/4")).toBe(1);
    expect(meterFeltPulseQuarterBeats("3/4")).toBe(1);
    expect(meterFeltPulseQuarterBeats("2/4")).toBe(1);
  });

  it("is 2 quarter-beats per pulse for 2/2's half-note pulse", () => {
    expect(meterFeltPulseQuarterBeats("2/2")).toBe(2);
  });

  it("is 1.5 quarter-beats per pulse for the compound eighth meters' dotted-quarter pulse", () => {
    expect(meterFeltPulseQuarterBeats("6/8")).toBe(1.5);
    expect(meterFeltPulseQuarterBeats("9/8")).toBe(1.5);
    expect(meterFeltPulseQuarterBeats("12/8")).toBe(1.5);
  });
});
