import { describe, expect, it } from "@jest/globals";
import { calendarSoltekComment } from "@/lib/gamification/soltekComments";
import { STREAK_COMMENTS, STREAK_RESTART_COMMENTS } from "@/lib/gamification/streakComments";

describe("calendarSoltekComment", () => {
  it("uses one of the 100 streak comments while a streak is running", () => {
    const text = calendarSoltekComment(10, "2026-10-05");
    const matches = STREAK_COMMENTS.some((comment) => comment.replace("{dni}", "10 dni") === text);
    expect(matches).toBe(true);
  });

  it("uses a 'starting from the beginning' comment when there is no streak", () => {
    expect(STREAK_RESTART_COMMENTS).toContain(calendarSoltekComment(0, "2026-10-05"));
  });

  it("keeps the same comment for the whole day", () => {
    expect(calendarSoltekComment(4, "2026-10-05")).toBe(calendarSoltekComment(4, "2026-10-05"));
  });
});
