import { Image, StyleSheet, View, useWindowDimensions } from "react-native";

const HERO_PHONE = require("@/assets/backgrounds/subskrypcja-hero-telefon.jpg");
const HERO_LAPTOP = require("@/assets/backgrounds/subskrypcja-hero-laptop.jpg");

/** The bottom edge colour of each picture — the screen behind the plans uses it, so the picture melts into the page. */
export const PAYWALL_BACKGROUND_PHONE = "#FEF4E4";
export const PAYWALL_BACKGROUND_LAPTOP = "#FEF1E1";

/** The subscription banner: Soltek jumping out of a treasure chest, with the bosses of all worlds around him. Two pictures: a taller one on a phone, a wide one on a laptop. */
export function PaywallHero() {
  const { width, height } = useWindowDimensions();
  const portrait = width < height;
  return (
    <View style={[styles.wrap, { aspectRatio: portrait ? 3 / 2 : 16 / 5 }]}>
      {/* Explicit 100%/100% on top of absoluteFill — see app/(main)/world/[worldId].tsx: react-native-web would otherwise draw the picture at its own pixel size. */}
      <Image
        source={portrait ? HERO_PHONE : HERO_LAPTOP}
        resizeMode="cover"
        accessibilityLabel="Soltek ze skrzynią skarbów i bossami wszystkich krain"
        style={[StyleSheet.absoluteFill, { width: "100%", height: "100%" }]}
      />
    </View>
  );
}

/** The page colour that matches the picture currently shown. */
export function usePaywallBackground(): string {
  const { width, height } = useWindowDimensions();
  return width < height ? PAYWALL_BACKGROUND_PHONE : PAYWALL_BACKGROUND_LAPTOP;
}

const styles = StyleSheet.create({
  wrap: { width: "100%", overflow: "hidden" },
});
