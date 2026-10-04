import { useGamificationOptional } from "@/context/GamificationContext";
import { DEFAULT_OUTFIT_ID } from "@/lib/shop/catalog";
import { OUTFIT_IMAGES } from "./shopImages";

/** The picture of the outfit Solfek wears now, or null for the standard Solfek (and until the saved game has loaded).
 * `loaded` is false until the saved game is read, so a screen can wait instead of flashing the standard Solfek first. */
export function useEquippedOutfit(): { image: ReturnType<typeof require> | null; loaded: boolean } {
  const gamification = useGamificationOptional();
  if (!gamification) return { image: null, loaded: true };
  const id = gamification.state.shopEquipped.ubior;
  const image = id && id !== DEFAULT_OUTFIT_ID ? (OUTFIT_IMAGES[id] ?? null) : null;
  return { image, loaded: !gamification.isLoading };
}
