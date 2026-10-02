/** Local-calendar date helpers for the study plan — "YYYY-MM-DD" strings in
 * the player's own timezone, same format lib/gamification/activity.ts's
 * todayISODate already produces (that function is the one place "today" is
 * decided; these only do arithmetic on such strings). Built on
 * `new Date(y, m, d + n)` (local constructor) rather than adding
 * milliseconds, so a daylight-saving change never shifts a date by one. */
export function parseISODate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(iso: string, days: number): string {
  const date = parseISODate(iso);
  return formatISODate(new Date(date.getFullYear(), date.getMonth(), date.getDate() + days));
}

/** 0 = Sunday … 6 = Saturday. */
export function weekdayOf(iso: string): number {
  return parseISODate(iso).getDay();
}

export function daysBetween(fromISO: string, toISO: string): number {
  const from = parseISODate(fromISO);
  const to = parseISODate(toISO);
  return Math.round((to.getTime() - from.getTime()) / 86_400_000);
}

const MONTHS_GENITIVE = ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca", "sierpnia", "września", "października", "listopada", "grudnia"];

/** "12 marca" — a short Polish date for plan screens. */
export function formatShortPolishDate(iso: string): string {
  const date = parseISODate(iso);
  return `${date.getDate()} ${MONTHS_GENITIVE[date.getMonth()]}`;
}
