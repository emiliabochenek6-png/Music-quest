import { describe, expect, it } from "@jest/globals";
import { formatPriceZl, MONTHLY_PRICE_ZL, YEARLY_PRICE_ZL, YEARLY_SAVINGS_PERCENT } from "@/lib/subscriptions/prices";

describe("subscription prices", () => {
  it("are 39 zł a month and 349 zł a year", () => {
    expect(MONTHLY_PRICE_ZL).toBe(39);
    expect(YEARLY_PRICE_ZL).toBe(349);
    expect(formatPriceZl(MONTHLY_PRICE_ZL)).toBe("39 zł");
  });

  it("make the year cheaper than twelve months, by about 25%", () => {
    expect(YEARLY_PRICE_ZL).toBeLessThan(MONTHLY_PRICE_ZL * 12);
    expect(YEARLY_SAVINGS_PERCENT).toBe(25);
  });
});
