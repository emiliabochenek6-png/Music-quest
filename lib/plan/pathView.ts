import { addDays } from "@/lib/plan/dates";
import { buildSchedule } from "@/lib/plan/schedule";

export interface PathDay {
  dateISO: string;
  isToday: boolean;
  lessonIds: string[];
  minutes: number;
}

export interface PathView {
  days: PathDay[];
  doneCount: number;
  totalCount: number;
}

/** The "Twój plan" path as a list of days: today's own lessons first (the
 * snapshot taken when the day started — kept even once finished, so the
 * day reads as a whole), then the rest of the path projected onto the next
 * study days at the daily pace. Lessons already completed earlier drop out
 * of the list and only count toward `doneCount`. */
export function buildPathView(options: {
  pathLessonIds: readonly string[];
  completedLessonIds: ReadonlySet<string>;
  todayLessonIds: readonly string[];
  minutesPerDay: number;
  todayISO: string;
  minutesOf: (lessonId: string) => number;
}): PathView {
  const { pathLessonIds, completedLessonIds, todayLessonIds, minutesPerDay, todayISO, minutesOf } = options;
  const todaySet = new Set(todayLessonIds);
  const doneCount = pathLessonIds.filter((id) => completedLessonIds.has(id)).length;
  const upcoming = pathLessonIds.filter((id) => !completedLessonIds.has(id) && !todaySet.has(id)).map((lessonId) => ({ lessonId, minutes: minutesOf(lessonId) }));
  const days: PathDay[] = [];
  if (todayLessonIds.length > 0) {
    days.push({ dateISO: todayISO, isToday: true, lessonIds: [...todayLessonIds], minutes: todayLessonIds.reduce((sum, id) => sum + minutesOf(id), 0) });
  }
  for (const day of buildSchedule(upcoming, minutesPerDay, addDays(todayISO, 1))) {
    days.push({ dateISO: day.dateISO, isToday: false, lessonIds: day.lessonIds, minutes: day.minutes });
  }
  return { days, doneCount, totalCount: pathLessonIds.length };
}
