import { Image, StyleSheet, View } from "react-native";
import type { EquippedItems } from "@/lib/shop/catalog";
import { DEFAULT_BACKGROUND_ID, DEFAULT_OUTFIT_ID } from "@/lib/shop/catalog";
import { BACKGROUND_IMAGES, OUTFIT_IMAGES } from "./shopImages";

interface SolfekAvatarProps {
  equipped: EquippedItems;
  size: number;
  /** Draws the equipped background behind him. */
  withBackground?: boolean;
  /** Shows only the background (no Solfek): the "Tła" thumbnails. */
  backgroundOnly?: boolean;
}

/** Solfek in the outfit he wears from Sklep Solfka, optionally in front of the chosen background.
 * Outfits are transparent pictures, so every outfit works on every background. */
export function SolfekAvatar({ equipped, size, withBackground = false, backgroundOnly = false }: SolfekAvatarProps) {
  const backgroundId = equipped.tlo ?? DEFAULT_BACKGROUND_ID;
  const outfitId = equipped.ubior ?? DEFAULT_OUTFIT_ID;
  const showBackground = withBackground || backgroundOnly;
  const solfekSize = showBackground ? size * 0.92 : size;
  return (
    <View style={[styles.box, { width: size, height: size }]}>
      {showBackground && (
        <Image source={BACKGROUND_IMAGES[backgroundId] ?? BACKGROUND_IMAGES[DEFAULT_BACKGROUND_ID]} resizeMode="cover" style={{ width: size, height: size }} />
      )}
      {!backgroundOnly && (
        <Image
          source={OUTFIT_IMAGES[outfitId] ?? OUTFIT_IMAGES[DEFAULT_OUTFIT_ID]}
          resizeMode="contain"
          accessibilityLabel="Solfek"
          style={[styles.solfek, { width: solfekSize, height: solfekSize, left: (size - solfekSize) / 2, top: size - solfekSize }]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { overflow: "hidden" },
  solfek: { position: "absolute" },
});
