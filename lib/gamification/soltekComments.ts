import { streakComment } from "@/lib/gamification/streakComments";

/** Solfek's own one-line comment on the activity calendar and the day-done
 * card: one of 100 different streak comments while a streak is running, or
 * one of the "starting from the beginning" ones when it is not (the very
 * first day or after a break) — each swapped every 3 days (see
 * lib/gamification/streakComments.ts). `dateISO` is today. */
export function calendarSoltekComment(streakDays: number, dateISO: string): string {
  return streakComment(dateISO, streakDays);
}
