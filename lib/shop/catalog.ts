/** Sklep Solfka: everything a player can buy with nutki to personalise Solfek.
 * Pure data (no images, no React) so it can be tested and used by the sync
 * merge. How each item LOOKS lives in components/shop/. Prices are a real
 * investment on purpose: a correct answer pays 2 nutki, a perfect lesson 5. */

export type ShopSlot = "okulary" | "szyja" | "efekt" | "tlo";

export interface ShopItem {
  id: string;
  slot: ShopSlot;
  name: string;
  description: string;
  price: number;
}

export const SHOP_SLOTS: readonly { slot: ShopSlot; label: string }[] = [
  { slot: "okulary", label: "Okulary" },
  { slot: "szyja", label: "Na szyję" },
  { slot: "efekt", label: "Efekty" },
  { slot: "tlo", label: "Tła" },
];

/** The background Solfek stands in until the player picks another one. */
export const DEFAULT_BACKGROUND_ID = "tlo-solfek";

export const SHOP_ITEMS: readonly ShopItem[] = [
  { id: "okulary-okragle", slot: "okulary", name: "Okrągłe okulary", description: "Dla mądrego muzyka.", price: 60 },
  { id: "okulary-sloneczne", slot: "okulary", name: "Okulary przeciwsłoneczne", description: "Scena świeci, Solfek też.", price: 100 },
  { id: "okulary-gwiazdki", slot: "okulary", name: "Okulary w gwiazdki", description: "Dla prawdziwej gwiazdy.", price: 140 },

  { id: "szyja-muszka", slot: "szyja", name: "Muszka", description: "Na koncert w najlepszym stylu.", price: 60 },
  { id: "szyja-medal", slot: "szyja", name: "Złoty medal", description: "Za wytrwałe ćwiczenie.", price: 120 },
  { id: "szyja-dzwonek", slot: "szyja", name: "Dzwoneczek", description: "Dzyń! Słychać Solfka z daleka.", price: 80 },

  { id: "efekt-nutki", slot: "efekt", name: "Tańczące nutki", description: "Nutki fruwają dookoła Solfka.", price: 80 },
  { id: "efekt-iskierki", slot: "efekt", name: "Iskierki", description: "Odrobina magii.", price: 120 },
  { id: "efekt-platki", slot: "efekt", name: "Płatki kwiatów", description: "Wiosenny nastrój.", price: 160 },

  { id: DEFAULT_BACKGROUND_ID, slot: "tlo", name: "Domek Solfka", description: "Domyślne tło.", price: 0 },
  { id: "tlo-wioska-nut", slot: "tlo", name: "Wioska Nut", description: "Tam wszystko się zaczęło.", price: 80 },
  { id: "tlo-miasto-rytmu", slot: "tlo", name: "Miasto Rytmu", description: "Tu zawsze coś bije.", price: 90 },
  { id: "tlo-przystan-taktow", slot: "tlo", name: "Przystań Taktów", description: "Fale w rytmie na trzy.", price: 100 },
  { id: "tlo-krolestwo-instrumentow", slot: "tlo", name: "Królestwo Instrumentów", description: "Cała orkiestra w tle.", price: 120 },
  { id: "tlo-pasmo-interwalow", slot: "tlo", name: "Pasmo Interwałów", description: "Góry wysokich i niskich dźwięków.", price: 140 },
  { id: "tlo-zatoka-trojdzwiekow", slot: "tlo", name: "Zatoka Trójdźwięków", description: "Trzy dźwięki, jeden spokój.", price: 160 },
  { id: "tlo-jaskinia-akordow", slot: "tlo", name: "Jaskinia Akordów", description: "Echo pełnych akordów.", price: 180 },
  { id: "tlo-cytadela-dominant", slot: "tlo", name: "Cytadela Dominant", description: "Twierdza napięcia i rozwiązania.", price: 200 },
  { id: "tlo-labirynt-tonacji", slot: "tlo", name: "Labirynt Tonacji", description: "Znajdź drogę w kole kwintowym.", price: 220 },
  { id: "tlo-fabryka-budowania", slot: "tlo", name: "Fabryka Budowania", description: "Tu składa się dźwięki.", price: 240 },
  { id: "tlo-gaj-grupowania", slot: "tlo", name: "Gaj Grupowania", description: "Nuty zebrane w grupki.", price: 260 },
  { id: "tlo-szczyt-dyktand", slot: "tlo", name: "Szczyt Dyktand", description: "Widok z samej góry.", price: 300 },
  { id: "tlo-zaczarowany-solfez", slot: "tlo", name: "Zaczarowany Solfeż", description: "Tu śpiewają nawet drzewa.", price: 320 },
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
