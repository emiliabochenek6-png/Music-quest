import type { DayActivity } from "@/types/gamification";

/** How strongly a calendar day is coloured: 0 = nothing happened, 1-3 = a little, a good bit, a lot. */
export type ActivityLevel = 0 | 1 | 2 | 3;

export const ACTIVITY_LEVEL_MINUTES = { two: 10, three: 20 } as const;

/** A day with any activity gets at least the lightest colour, even when no minutes were measured (e.g. only the daily challenge). */
export function activityLevel(day: DayActivity | undefined): ActivityLevel {
  if (!day) return 0;
  const hasActivity = day.minutesSpent > 0 || day.lessonIdsCompleted.length > 0 || day.dailyChallengeCompleted;
  if (!hasActivity) return 0;
  if (day.minutesSpent >= ACTIVITY_LEVEL_MINUTES.three) return 3;
  if (day.minutesSpent >= ACTIVITY_LEVEL_MINUTES.two) return 2;
  return 1;
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function toISO(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

/** The seven days (Monday first) of the week that contains `todayISO`. */
export function weekDaysOf(todayISO: string): string[] {
  const [year, month, day] = todayISO.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const mondayOffset = (date.getDay() + 6) % 7;
  return Array.from({ length: 7 }, (_, index) => toISO(new Date(year, month - 1, day - mondayOffset + index)));
}

/** Streak progress towards the next weekly reward (every 7 days in a row). */
export interface WeekMilestoneProgress {
  /** 0-7: days of the current 7-day stretch already done. */
  daysDone: number;
  /** True right after reaching a multiple of 7 (the reward has just been paid). */
  justReached: boolean;
  daysLeft: number;
}

export function weekMilestoneProgress(streakDays: number): WeekMilestoneProgress {
  if (streakDays <= 0) return { daysDone: 0, justReached: false, daysLeft: 7 };
  const remainder = streakDays % 7;
  if (remainder === 0) return { daysDone: 7, justReached: true, daysLeft: 0 };
  return { daysDone: remainder, justReached: false, daysLeft: 7 - remainder };
}

const MONTHS_GENITIVE = ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca", "sierpnia", "września", "października", "listopada", "grudnia"];
const WEEKDAYS_LONG = ["niedziela", "poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota"];

function lessonsWord(count: number): string {
  if (count === 1) return "lekcja";
  const lastTwo = count % 100;
  const last = count % 10;
  if (lastTwo >= 12 && lastTwo <= 14) return "lekcji";
  return last >= 2 && last <= 4 ? "lekcje" : "lekcji";
}

/** A one-line summary of what happened on a day, for the card shown when a calendar day is tapped. */
export function describeDay(iso: string, day: DayActivity | undefined): { title: string; lines: string[] } {
  const [year, month, dayOfMonth] = iso.split("-").map(Number);
  const weekday = WEEKDAYS_LONG[new Date(year, month - 1, dayOfMonth).getDay()];
  const title = `${weekday[0].toUpperCase()}${weekday.slice(1)}, ${dayOfMonth} ${MONTHS_GENITIVE[month - 1]}`;
  if (activityLevel(day) === 0 || !day) return { title, lines: ["Tego dnia nie było ćwiczeń."] };
  const lines: string[] = [];
  if (day.minutesSpent > 0) lines.push(`${day.minutesSpent} min ćwiczeń`);
  const lessons = day.lessonIdsCompleted.length;
  if (lessons > 0) lines.push(`${lessons} ${lessonsWord(lessons)}`);
  if (day.dailyChallengeCompleted) lines.push("Wyzwanie dnia zrobione");
  return { title, lines };
}
