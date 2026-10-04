/** The daily gift from Solfek (Sklep Solfka): free nutki once a day, a bit more for a longer streak.
 * Together with the nutki earned by playing it keeps the shop moving: 10 nutki, plus 2 for every day of the streak, up to 30. */
export const GIFT_BASE = 10;
export const GIFT_PER_STREAK_DAY = 2;
export const GIFT_MAX = 30;

export function giftAmount(streakDays: number): number {
  const days = Math.max(0, Math.floor(streakDays));
  return Math.min(GIFT_MAX, GIFT_BASE + GIFT_PER_STREAK_DAY * days);
}

/** Today's gift can be collected when none was collected on this date ("YYYY-MM-DD"). */
export function canClaimGift(lastGiftDateISO: string | null, todayISO: string): boolean {
  return lastGiftDateISO !== todayISO;
}
