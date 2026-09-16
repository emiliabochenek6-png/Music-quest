/** Soltek's own one-line comment on the activity calendar — a small
 * read-only nudge derived purely from the streak/this-month numbers the
 * calendar screen already computes (see CalendarActivityView.tsx), not a
 * new tracked state of its own. Four tiers, roughly "on a real streak" →
 * "just started" → "was active this month but the streak broke" → "no
 * activity logged yet this month" — ordered so a genuinely long streak
 * always wins even if this month's activeDaysThisMonth also happens to
 * be high, since the streak is the more specific, more impressive fact. */
export function calendarSoltekComment(streakDays: number, activeDaysThisMonth: number): string {
  if (streakDays >= 7) {
    return `${streakDays} dni z rzędu — niesamowita passa! Tak trzymaj!`;
  }
  if (streakDays >= 1) {
    return "Ładna passa — nie przerywaj jej, wróć jutro!";
  }
  if (activeDaysThisMonth > 0) {
    return "Ostatnio było cicho — wróć do ćwiczeń i zacznij nową passę!";
  }
  return "Jeszcze nie ćwiczyliśmy w tym miesiącu — zaczynajmy!";
}
