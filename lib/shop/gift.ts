/** The daily gift from Solfek (Sklep Solfka): once a day the player opens a gift box and wins a random number of nutki, from 1 to 10. */
export const GIFT_MIN = 1;
export const GIFT_MAX = 10;

/** How many nutki the gift box holds today (`random` is a number in [0, 1), for tests). */
export function rollGift(random: number = Math.random()): number {
  return GIFT_MIN + Math.min(GIFT_MAX - GIFT_MIN, Math.floor(random * (GIFT_MAX - GIFT_MIN + 1)));
}

/** Whatever was asked for, a gift is always a whole number from GIFT_MIN to GIFT_MAX. */
export function clampGift(amount: number): number {
  if (!Number.isFinite(amount)) return GIFT_MIN;
  return Math.min(GIFT_MAX, Math.max(GIFT_MIN, Math.floor(amount)));
}

/** Today's gift can be collected when none was collected on this date ("YYYY-MM-DD"). */
export function canClaimGift(lastGiftDateISO: string | null, todayISO: string): boolean {
  return lastGiftDateISO !== todayISO;
}

/** Seconds left until the next local midnight, when the next gift is ready. */
export function secondsToNextGift(now: Date = new Date()): number {
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.max(0, Math.floor((midnight.getTime() - now.getTime()) / 1000));
}

/** "05:09:03" */
export function formatCountdown(totalSeconds: number): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  const seconds = Math.max(0, Math.floor(totalSeconds));
  return `${pad(Math.floor(seconds / 3600))}:${pad(Math.floor(seconds / 60) % 60)}:${pad(seconds % 60)}`;
}

/** "1 nutka", "3 nutki", "10 nutek" */
export function nutkiWord(count: number): string {
  if (count === 1) return "nutka";
  const lastTwo = count % 100;
  const last = count % 10;
  if (last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) return "nutki";
  return "nutek";
}
