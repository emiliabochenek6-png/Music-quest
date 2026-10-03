import { DEFAULT_BACKGROUND_ID } from "@/lib/shop/catalog";

/** Pictures for the "Tła" in Sklep Solfka: the worlds' own phone backgrounds, plus Solfek's own as the default. */
export const SHOP_BACKGROUNDS: Record<string, ReturnType<typeof require>> = {
  [DEFAULT_BACKGROUND_ID]: require("@/assets/backgrounds/soltek-tlo-telefon.png"),
  "tlo-wioska-nut": require("@/assets/backgrounds/wioska-nut-tlo.png"),
  "tlo-miasto-rytmu": require("@/assets/backgrounds/miasto-rytmu-tlo-telefon.png"),
  "tlo-przystan-taktow": require("@/assets/backgrounds/przystan-taktow-tlo-telefon.png"),
  "tlo-krolestwo-instrumentow": require("@/assets/backgrounds/krolestwo-instrumentow-tlo-telefon.png"),
  "tlo-pasmo-interwalow": require("@/assets/backgrounds/pasmo-interwalow-tlo-telefon.png"),
  "tlo-zatoka-trojdzwiekow": require("@/assets/backgrounds/zatoka-trojdzwiekow-tlo-telefon.png"),
  "tlo-jaskinia-akordow": require("@/assets/backgrounds/jaskinia-akordow-tlo-telefon.png"),
  "tlo-cytadela-dominant": require("@/assets/backgrounds/cytadela-dominant-tlo-telefon.png"),
  "tlo-labirynt-tonacji": require("@/assets/backgrounds/labirynt-tonacji-tlo-telefon.png"),
  "tlo-fabryka-budowania": require("@/assets/backgrounds/fabryka-budowania-tlo-telefon.png"),
  "tlo-gaj-grupowania": require("@/assets/backgrounds/gaj-grupowania-tlo-telefon.png"),
  "tlo-szczyt-dyktand": require("@/assets/backgrounds/szczyt-dyktand-tlo-telefon.png"),
  "tlo-zaczarowany-solfez": require("@/assets/backgrounds/zaczarowany-solfez-tlo-telefon.png"),
};
