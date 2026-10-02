import { addDays, daysBetween, weekdayOf } from "@/lib/plan/dates";

/** Rough real play time of one exercise, in minutes — 30 seconds of
 * active work per exercise plus the slide reading, animations and retries
 * a real session adds (the same estimate plany/2026-09-26-rozbudowa-krain.md
 * is built on: 30 s × 1.75 ≈ 0.9 min). */
export const MINUTES_PER_EXERCISE = 0.85;

export function lessonMinutes(exerciseCount: number): number {
  return Math.max(3, Math.round(exerciseCount * MINUTES_PER_EXERCISE));
}

export interface SchedulableLesson {
  lessonId: string;
  minutes: number;
}

export interface ScheduleDay {
  dateISO: string;
  lessonIds: string[];
  minutes: number;
}

/** The planned calendar: lessons in path order, packed into study days of
 * about `minutesPerDay` each (a day may run up to 30% over so a lesson is
 * never cut in half; a lesson longer than the whole budget gets a day to
 * itself). Sundays are rest days — no new lessons, only the spaced-repetition
 * reviews the daily missions add. The schedule is a PROJECTION for the plan
 * screen and the finish date; what the player is asked to do on a given day
 * is always "the next unfinished lessons of the path" (see pickTodayLessons),
 * so falling behind never leaves holes. */
export function buildSchedule(lessons: readonly SchedulableLesson[], minutesPerDay: number, startISO: string): ScheduleDay[] {
  const days: ScheduleDay[] = [];
  let cursor = startISO;
  let current: ScheduleDay | null = null;
  const nextStudyDay = (from: string): string => {
    let day = from;
    while (weekdayOf(day) === 0) day = addDays(day, 1);
    return day;
  };
  cursor = nextStudyDay(cursor);
  for (const lesson of lessons) {
    if (current && current.minutes > 0 && current.minutes + lesson.minutes > minutesPerDay * 1.3) {
      days.push(current);
      cursor = nextStudyDay(addDays(current.dateISO, 1));
      current = null;
    }
    if (!current) current = { dateISO: cursor, lessonIds: [], minutes: 0 };
    current.lessonIds.push(lesson.lessonId);
    current.minutes += lesson.minutes;
    if (current.minutes >= minutesPerDay) {
      days.push(current);
      cursor = nextStudyDay(addDays(current.dateISO, 1));
      current = null;
    }
  }
  if (current) days.push(current);
  return days;
}

export interface ScheduleWeek {
  /** 1-based. */
  number: number;
  startISO: string;
  days: ScheduleDay[];
  lessonCount: number;
  minutes: number;
}

/** Groups schedule days into calendar weeks counted from `startISO` (week 1 = the first 7 days). */
export function groupByWeek(days: readonly ScheduleDay[], startISO: string): ScheduleWeek[] {
  const weeks: ScheduleWeek[] = [];
  for (const day of days) {
    const offset = Math.floor(daysBetween(startISO, day.dateISO) / 7);
    const number = Math.max(0, offset) + 1;
    let week = weeks.find((w) => w.number === number);
    if (!week) {
      week = { number, startISO: addDays(startISO, (number - 1) * 7), days: [], lessonCount: 0, minutes: 0 };
      weeks.push(week);
    }
    week.days.push(day);
    week.lessonCount += day.lessonIds.length;
    week.minutes += day.minutes;
  }
  return weeks.sort((a, b) => a.number - b.number);
}

/** What to do today: the next unfinished lessons of the path, taken in order
 * until they add up to about the daily budget (same 30% tolerance as the
 * schedule). `isDone` says which path lessons are already completed. At
 * least one lesson is returned whenever anything is left. */
export function pickTodayLessons(path: readonly SchedulableLesson[], isDone: (lessonId: string) => boolean, minutesPerDay: number): string[] {
  const picked: string[] = [];
  let minutes = 0;
  for (const lesson of path) {
    if (isDone(lesson.lessonId)) continue;
    if (picked.length > 0 && minutes + lesson.minutes > minutesPerDay * 1.3) break;
    picked.push(lesson.lessonId);
    minutes += lesson.minutes;
    if (minutes >= minutesPerDay) break;
  }
  return picked;
}
