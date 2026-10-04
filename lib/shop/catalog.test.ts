import { describe, expect, it } from "@jest/globals";
import { BACKGROUND_IMAGES, OUTFIT_IMAGES } from "@/components/shop/shopImages";
import { DEFAULT_BACKGROUND_ID, DEFAULT_OUTFIT_ID, SHOP_ITEMS, SHOP_SLOTS, getShopItem, itemsInSlot, sanitizeShop, totalSpent } from "@/lib/shop/catalog";
import { canClaimGift, giftAmount } from "@/lib/shop/gift";
import { mergeGamificationState } from "@/lib/sync/mergeState";
import { INITIAL_GAMIFICATION_STATE, sanitizeGamificationState } from "@/types/gamification";

describe("shop catalog", () => {
  it("has unique ids and every slot has something to buy", () => {
    expect(new Set(SHOP_ITEMS.map((item) => item.id)).size).toBe(SHOP_ITEMS.length);
    for (const { slot } of SHOP_SLOTS) expect(itemsInSlot(slot).length).toBeGreaterThan(1);
  });

  it("only the default outfit and the default background are free", () => {
    expect(SHOP_ITEMS.filter((item) => item.price === 0).map((item) => item.id).sort()).toEqual([DEFAULT_BACKGROUND_ID, DEFAULT_OUTFIT_ID].sort());
  });

  it("every item has a picture", () => {
    for (const item of SHOP_ITEMS) {
      expect(item.slot === "ubior" ? OUTFIT_IMAGES[item.id] : BACKGROUND_IMAGES[item.id]).toBeDefined();
    }
  });

  it("drops unknown, unowned and wrong-slot items when sanitizing", () => {
    const { owned, equipped } = sanitizeShop(["ubior-czerwony", "nie-ma-takiego", 5], {
      ubior: "ubior-czerwony",
      tlo: "ubior-czerwony",
    });
    expect(owned).toEqual(["ubior-czerwony"]);
    expect(equipped).toEqual({ ubior: "ubior-czerwony" });
    expect(sanitizeShop([], { ubior: "ubior-mag" }).equipped).toEqual({});
  });

  it("loads old saves without shop fields", () => {
    const state = sanitizeGamificationState({ nutki: 10 });
    expect(state.shopOwned).toEqual([]);
    expect(state.shopEquipped).toEqual({});
  });
});

describe("shop and sync", () => {
  const price = getShopItem("ubior-czerwony")!.price;

  it("keeps purchases from either device and does not refund them", () => {
    const bought = { ...INITIAL_GAMIFICATION_STATE, nutki: 300 - price, shopOwned: ["ubior-czerwony"], shopEquipped: { ubior: "ubior-czerwony" } };
    const stale = { ...INITIAL_GAMIFICATION_STATE, nutki: 300 };
    for (const merged of [mergeGamificationState(bought, stale), mergeGamificationState(stale, bought)]) {
      expect(merged.shopOwned).toEqual(["ubior-czerwony"]);
      expect(merged.nutki).toBe(300 - price);
      expect(merged.shopEquipped).toEqual({ ubior: "ubior-czerwony" });
    }
  });

  it("unions purchases made on two devices", () => {
    const a = { ...INITIAL_GAMIFICATION_STATE, nutki: 300, shopOwned: ["ubior-czerwony"] };
    const b = { ...INITIAL_GAMIFICATION_STATE, nutki: 300, shopOwned: ["tlo-scena"] };
    const merged = mergeGamificationState(a, b);
    expect([...merged.shopOwned].sort()).toEqual(["tlo-scena", "ubior-czerwony"]);
    // each device earned 400 / 420 in total; the merged total is the larger one minus everything bought
    expect(merged.nutki).toBe(Math.max(300 + price, 300 + getShopItem("tlo-scena")!.price) - totalSpent(merged.shopOwned));
  });
});

describe("shop economy", () => {
  const paid = SHOP_ITEMS.filter((item) => item.price > 0);
  const total = paid.reduce((sum, item) => sum + item.price, 0);

  it("starts cheap and stays big: a first purchase within a day or two, the whole shop far beyond two months of play", () => {
    expect(Math.min(...paid.map((item) => item.price))).toBeLessThanOrEqual(200);
    // ~50-80 nutki a day: two months bring about 3 000-5 000, so the shop must hold several times that
    expect(total).toBeGreaterThanOrEqual(15_000);
    expect(total).toBeLessThanOrEqual(30_000);
  });

  it("has dear things too, so something is still left to buy very late in the game", () => {
    expect(paid.filter((item) => item.price >= 1000).length).toBeGreaterThanOrEqual(5);
    expect(Math.max(...paid.map((item) => item.price))).toBeGreaterThanOrEqual(1500);
  });

  it("the daily gift grows with the streak and is capped", () => {
    expect(giftAmount(0)).toBe(10);
    expect(giftAmount(5)).toBe(20);
    expect(giftAmount(100)).toBe(30);
    expect(canClaimGift(null, "2026-10-04")).toBe(true);
    expect(canClaimGift("2026-10-03", "2026-10-04")).toBe(true);
    expect(canClaimGift("2026-10-04", "2026-10-04")).toBe(false);
  });

  it("sync keeps the newer gift date", () => {
    const a = { ...INITIAL_GAMIFICATION_STATE, shopGiftDateISO: "2026-10-04" };
    const b = { ...INITIAL_GAMIFICATION_STATE, shopGiftDateISO: "2026-10-02" };
    expect(mergeGamificationState(a, b).shopGiftDateISO).toBe("2026-10-04");
    expect(mergeGamificationState(b, a).shopGiftDateISO).toBe("2026-10-04");
  });
});
