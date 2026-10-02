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

  it("shows all 100 comments over 300 days for a long streak, never the same one in two neighbouring slots", () => {
    const seen = new Set<string>();
    let previous = "";
    for (let slot = 0; slot < 100; slot++) {
      const text = streakComment(addDays("2026-01-01", slot * 3), 100);
      expect(text).not.toBe(previous);
      previous = text;
      seen.add(text.replace(/\d+ dni|1 dzień/, "{dni}"));
    }
    expect(seen.size).toBe(100);
  });

  it("never says anything about a long streak on the first days", () => {
    const longStreakWords = /Cały tydzień|Dwa tygodnie|prawie miesiąc|kawał drogi|ćwiczeń z rzędu|nie przypadek|bez ani jednej przerwy|jesteś tu już|nadal czekam|świetnej formie/i;
    for (let slot = 0; slot < 150; slot++) {
      const date = addDays("2026-01-01", slot * 3);
      for (const days of [1, 2]) {
        const text = streakComment(date, days);
        if (days === 1) expect(text).not.toMatch(longStreakWords);
        expect(text).not.toContain("{dni}");
        // Numbers in the text always agree with the real streak.
        const mentioned = text.match(/(\d+) (dni|dzień)/);
        if (mentioned) expect(Number(mentioned[1])).toBe(days);
      }
    }
  });

  it("only praises a week, two weeks or a month once the streak is that long", () => {
    for (let slot = 0; slot < 150; slot++) {
      const date = addDays("2026-01-01", slot * 3);
      expect(streakComment(date, 6)).not.toMatch(/Cały tydzień/);
      expect(streakComment(date, 13)).not.toMatch(/Dwa tygodnie i więcej/);
      expect(streakComment(date, 26)).not.toMatch(/prawie miesiąc/);
    }
  });

  it("fills in the number of days with the right Polish form", () => {
    const find = (days: number, expected: string) => {
      for (let slot = 0; slot < 200; slot++) {
        if (streakComment(addDays("2026-02-01", slot * 3), days).includes(expected)) return true;
      }
      return false;
    };
    expect(find(1, "1 dzień")).toBe(true);
    expect(find(5, "5 dni")).toBe(true);
    expect(find(12, "12 dni")).toBe(true);
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
