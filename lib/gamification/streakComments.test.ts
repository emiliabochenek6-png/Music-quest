import { describe, expect, it } from "@jest/globals";
import { STREAK_COMMENTS, STREAK_RESTART_COMMENTS, streakComment } from "@/lib/gamification/streakComments";

function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

describe("streak comments", () => {
  it("has 100 different comments", () => {
    expect(STREAK_COMMENTS).toHaveLength(100);
    expect(new Set(STREAK_COMMENTS).size).toBe(100);
    expect(STREAK_COMMENTS.every((text) => text.length > 10)).toBe(true);
  });

  it("changes every 3 days: the same line for 3 days running, then another", () => {
    // Find a day that starts a new 3-day slot (the line changes the day before it).
    let start = "2026-10-01";
    while (streakComment(start, 5) === streakComment(addDays(start, -1), 5)) start = addDays(start, 1);
    const first = streakComment(start, 5);
    expect(streakComment(addDays(start, 1), 5)).toBe(first);
    expect(streakComment(addDays(start, 2), 5)).toBe(first);
    expect(streakComment(addDays(start, 3), 5)).not.toBe(first);
  });

  it("shows all 100 comments over 300 days, never the same one in two neighbouring slots", () => {
    const seen = new Set<string>();
    let previous = "";
    for (let slot = 0; slot < 100; slot++) {
      const text = streakComment(addDays("2026-01-01", slot * 3), 5);
      expect(text).not.toBe(previous);
      previous = text;
      seen.add(text.replace(/\d+ dni|1 dzień/, "{dni}"));
    }
    expect(seen.size).toBe(100);
  });

  it("fills in the number of days with the right Polish form", () => {
    const withPlaceholder = STREAK_COMMENTS.findIndex((text) => text.includes("{dni}"));
    expect(withPlaceholder).toBeGreaterThanOrEqual(0);
    let date = "2026-02-01";
    while (!streakComment(date, 5).includes("5 dni")) date = addDays(date, 3);
    expect(streakComment(date, 1)).toContain("1 dzień");
    expect(streakComment(date, 12)).toContain("12 dni");
    for (let i = 0; i < 100; i++) expect(streakComment(addDays("2026-03-01", i * 3), 7)).not.toContain("{dni}");
  });

  it("has its own comments for starting from the beginning, also changing every 3 days", () => {
    expect(new Set(STREAK_RESTART_COMMENTS).size).toBe(STREAK_RESTART_COMMENTS.length);
    expect(STREAK_RESTART_COMMENTS.length).toBeGreaterThanOrEqual(20);
    const seen = new Set<string>();
    for (let slot = 0; slot < 20; slot++) {
      const text = streakComment(addDays("2026-04-01", slot * 3), 0);
      expect(STREAK_RESTART_COMMENTS).toContain(text);
      seen.add(text);
    }
    expect(seen.size).toBe(20);
    let start = "2026-04-01";
    while (streakComment(start, 0) === streakComment(addDays(start, -1), 0)) start = addDays(start, 1);
    expect(streakComment(addDays(start, 2), 0)).toBe(streakComment(start, 0));
    expect(streakComment(addDays(start, 3), 0)).not.toBe(streakComment(start, 0));
  });
});
