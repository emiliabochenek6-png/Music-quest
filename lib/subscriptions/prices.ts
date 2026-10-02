/** The prices shown on the subscription screen, in zł — in ONE place. They are
 * only what the player is TOLD: the real charge goes through the store
 * product (see SubscriptionContext), so these must be kept equal to the
 * prices set in App Store Connect / Google Play by hand. */
export const MONTHLY_PRICE_ZL = 39;
export const YEARLY_PRICE_ZL = 349;

/** How much cheaper a year is than 12 months paid monthly, in whole percent. */
export const YEARLY_SAVINGS_PERCENT = Math.round((1 - YEARLY_PRICE_ZL / (MONTHLY_PRICE_ZL * 12)) * 100);

export function formatPriceZl(amount: number): string {
  return `${amount} zł`;
}
