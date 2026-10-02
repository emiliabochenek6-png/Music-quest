import type { ReviewEntry } from "@/lib/plan/spacedRepetition";

/** The day's own snapshot of what the plan asks — computed once when the
 * day starts (see PlanContext) and then kept fixed, so a mission's target
 * doesn't shrink as the player completes lessons through the day. */
export interface TodayPlan {
  dateISO: string;
  /** New lessons from the path, in order. */
  lessonIds: string[];
  /** Spaced-repetition reviews due today. */
  reviewIds: string[];
}

export interface TodayStatus {
  lessons: { lessonId: string; done: boolean }[];
  reviews: { lessonId: string; done: boolean }[];
}

/** Which of today's planned items are already done: a lesson is done once
 * it's in the completed set (it wasn't when the day's snapshot was taken);
 * a review is done once its entry's last-reviewed date is today. */
export function getTodayStatus(
  today: TodayPlan | null,
  todayISO: string,
  completedLessonIds: ReadonlySet<string>,
  reviewLog: Readonly<Record<string, ReviewEntry>>
): TodayStatus {
  if (!today || today.dateISO !== todayISO) return { lessons: [], reviews: [] };
  return {
    lessons: today.lessonIds.map((lessonId) => ({ lessonId, done: completedLessonIds.has(lessonId) })),
    reviews: today.reviewIds.map((lessonId) => ({ lessonId, done: reviewLog[lessonId]?.lastISO === todayISO && reviewLog[lessonId]?.dueISO > todayISO })),
  };
}
