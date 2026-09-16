import { describe, expect, it } from "@jest/globals";
import { calendarSoltekComment } from "@/lib/gamification/soltekComments";

describe("calendarSoltekComment", () => {
  it("celebrates a week-plus streak by name, including the actual day count", () => {
    expect(calendarSoltekComment(10, 10)).toContain("10 dni z rzędu");
  });

  it("encourages continuing a short but real streak", () => {
    expect(calendarSoltekComment(3, 5)).toMatch(/nie przerywaj/i);
  });

  it("nudges toward starting a new streak when this month had activity but the streak broke", () => {
    expect(calendarSoltekComment(0, 4)).toMatch(/nową passę/i);
  });

  it("invites a first session when nothing has been logged this month at all", () => {
    expect(calendarSoltekComment(0, 0)).toMatch(/zaczynajmy/i);
  });

  it("prioritizes a long streak over this month's own activity count", () => {
    expect(calendarSoltekComment(7, 0)).toContain("7 dni z rzędu");
  });
});
