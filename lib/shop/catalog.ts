/** Sklep Solfka: everything a player can buy with nutki to personalise Solfek.
 * Pure data (no images, no React) so it can be tested and used by the sync
 * merge. How each item LOOKS lives in components/shop/. Prices are a real
 * investment on purpose: a correct answer pays 2 nutki, a perfect lesson 5. */

export type ShopSlot = "ubior" | "tlo";

export interface ShopItem {
  id: string;
  slot: ShopSlot;
  name: string;
  description: string;
  price: number;
}

export const SHOP_SLOTS: readonly { slot: ShopSlot; label: string }[] = [
  { slot: "ubior", label: "Ubiory" },
  { slot: "tlo", label: "Tła" },
];

/** What Solfek wears and stands in front of until the player picks something else (both free). */
export const DEFAULT_OUTFIT_ID = "ubior-standardowy";
export const DEFAULT_BACKGROUND_ID = "tlo-sloneczne";

export const SHOP_ITEMS: readonly ShopItem[] = [
  { id: DEFAULT_OUTFIT_ID, slot: "ubior", name: "Solfek", description: "Taki, jakim go znasz.", price: 0 },
  { id: "ubior-czerwony", slot: "ubior", name: "Czerwony czarodziej", description: "Gorący jak finał koncertu.", price: 100 },
  { id: "ubior-fioletowy", slot: "ubior", name: "Fioletowy czarodziej", description: "Magia w odcieniu bzu.", price: 100 },
  { id: "ubior-mietowy", slot: "ubior", name: "Miętowy czarodziej", description: "Świeży jak poranne ćwiczenia.", price: 100 },
  { id: "ubior-niebieski", slot: "ubior", name: "Niebieski czarodziej", description: "Spokojny jak dźwięk w ciszy.", price: 100 },
  { id: "ubior-rozowy", slot: "ubior", name: "Różowy czarodziej", description: "Różowy i pełen energii.", price: 100 },
  { id: "ubior-turkusowy", slot: "ubior", name: "Turkusowy czarodziej", description: "Kolor morskiej fali.", price: 100 },
  { id: "ubior-krolewski", slot: "ubior", name: "Królewski Solfek", description: "Z koroną dla władcy nut.", price: 200 },
  { id: "ubior-aktor", slot: "ubior", name: "Solfek na scenie", description: "Cylinder i frak na wielki występ.", price: 250 },
  { id: "ubior-mag", slot: "ubior", name: "Mądry czarodziej", description: "Okulary i gwiaździsta peleryna.", price: 250 },
  { id: "ubior-gwiazda", slot: "ubior", name: "Gwiazda", description: "Korona i okulary w gwiazdki.", price: 300 },

  { id: DEFAULT_BACKGROUND_ID, slot: "tlo", name: "Słoneczne wzgórza", description: "Domyślne tło.", price: 0 },
  { id: "tlo-scena", slot: "tlo", name: "Scena", description: "Kurtyna w górę, reflektor włączony.", price: 120 },
  { id: "tlo-wioska", slot: "tlo", name: "Wioska", description: "Domki na liliowych wzgórzach.", price: 120 },
  { id: "tlo-port", slot: "tlo", name: "Port", description: "Fale i żaglówka.", price: 150 },
  { id: "tlo-gory", slot: "tlo", name: "Śnieżne góry", description: "Chłodny, górski spokój.", price: 150 },
  { id: "tlo-miasto", slot: "tlo", name: "Nocne miasto", description: "Światła w oknach i gwiazdy nad dachami.", price: 180 },
];

const BY_ID = new Map(SHOP_ITEMS.map((item) => [item.id, item]));

export function getShopItem(id: string): ShopItem | undefined {
  return BY_ID.get(id);
}

export function itemsInSlot(slot: ShopSlot): ShopItem[] {
  return SHOP_ITEMS.filter((item) => item.slot === slot);
}

/** What the player has equipped: one item per slot, or none. */
export type EquippedItems = Partial<Record<ShopSlot, string>>;

/** Nutki the given owned items cost (the default background is free).
 * Used by the sync merge so spending is never refunded by an older copy. */
export function totalSpent(ownedIds: readonly string[]): number {
  return ownedIds.reduce((sum, id) => sum + (getShopItem(id)?.price ?? 0), 0);
}

/** Keeps only ids that exist, are owned (or free), and sit in their own slot. */
export function sanitizeShop(owned: unknown, equipped: unknown): { owned: string[]; equipped: EquippedItems } {
  const ownedList = Array.isArray(owned) ? [...new Set(owned.filter((id): id is string => typeof id === "string" && BY_ID.has(id)))] : [];
  const clean: EquippedItems = {};
  if (equipped && typeof equipped === "object") {
    for (const { slot } of SHOP_SLOTS) {
      const id = (equipped as Record<string, unknown>)[slot];
      const item = typeof id === "string" ? BY_ID.get(id) : undefined;
      if (item && item.slot === slot && (item.price === 0 || ownedList.includes(item.id))) clean[slot] = item.id;
    }
  }
  return { owned: ownedList, equipped: clean };
}

/** Result of a purchase attempt. */
export type BuyResult = "ok" | "not-enough" | "owned" | "unknown";
