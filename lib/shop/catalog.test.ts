import { describe, expect, it } from "@jest/globals";
import { WORLDS } from "@/data/worlds";
import { DEFAULT_BACKGROUND_ID, SHOP_ITEMS, SHOP_SLOTS, getShopItem, itemsInSlot, sanitizeShop, totalSpent } from "@/lib/shop/catalog";
import { mergeGamificationState } from "@/lib/sync/mergeState";
import { INITIAL_GAMIFICATION_STATE, sanitizeGamificationState } from "@/types/gamification";

describe("shop catalog", () => {
  it("has unique ids and every slot has something to buy", () => {
    expect(new Set(SHOP_ITEMS.map((item) => item.id)).size).toBe(SHOP_ITEMS.length);
    for (const { slot } of SHOP_SLOTS) expect(itemsInSlot(slot).length).toBeGreaterThan(0);
  });

  it("only the default background is free", () => {
    expect(SHOP_ITEMS.filter((item) => item.price === 0).map((item) => item.id)).toEqual([DEFAULT_BACKGROUND_ID]);
  });

  it("has a background for every world", () => {
    const ids = new Set(SHOP_ITEMS.map((item) => item.id));
    for (const world of WORLDS) expect(ids.has(`tlo-${world.id}`)).toBe(true);
  });

  it("drops unknown, unowned and wrong-slot items when sanitizing", () => {
    const { owned, equipped } = sanitizeShop(["okulary-okragle", "nie-ma-takiego", 5], {
      okulary: "okulary-okragle",
      szyja: "okulary-okragle",
      efekt: "efekt-nutki",
      tlo: DEFAULT_BACKGROUND_ID,
    });
    expect(owned).toEqual(["okulary-okragle"]);
    expect(equipped).toEqual({ okulary: "okulary-okragle", tlo: DEFAULT_BACKGROUND_ID });
  });

  it("loads old saves without shop fields", () => {
    const state = sanitizeGamificationState({ nutki: 10 });
    expect(state.shopOwned).toEqual([]);
    expect(state.shopEquipped).toEqual({});
  });
});

describe("shop and sync", () => {
  const price = getShopItem("okulary-okragle")!.price;

  it("keeps purchases from either device and does not refund them", () => {
    const bought = { ...INITIAL_GAMIFICATION_STATE, nutki: 100 - price, shopOwned: ["okulary-okragle"], shopEquipped: { okulary: "okulary-okragle" } };
    const stale = { ...INITIAL_GAMIFICATION_STATE, nutki: 100 };
    for (const merged of [mergeGamificationState(bought, stale), mergeGamificationState(stale, bought)]) {
      expect(merged.shopOwned).toEqual(["okulary-okragle"]);
      expect(merged.nutki).toBe(100 - price);
      expect(merged.shopEquipped).toEqual({ okulary: "okulary-okragle" });
    }
  });

  it("unions purchases made on two devices", () => {
    const a = { ...INITIAL_GAMIFICATION_STATE, nutki: 100, shopOwned: ["okulary-okragle"] };
    const b = { ...INITIAL_GAMIFICATION_STATE, nutki: 100, shopOwned: ["szyja-muszka"] };
    const merged = mergeGamificationState(a, b);
    expect([...merged.shopOwned].sort()).toEqual(["okulary-okragle", "szyja-muszka"]);
    expect(merged.nutki).toBe(Math.max(0, 100 + price - totalSpent(merged.shopOwned)));
  });
});
