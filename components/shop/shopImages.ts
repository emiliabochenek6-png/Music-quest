import { DEFAULT_BACKGROUND_ID, DEFAULT_OUTFIT_ID } from "@/lib/shop/catalog";

type Img = ReturnType<typeof require>;

/** Solfek in each outfit: 520×520 pictures with a transparent background, so any outfit stands on any background. */
export const OUTFIT_IMAGES: Record<string, Img> = {
  [DEFAULT_OUTFIT_ID]: require("@/assets/shop/ubiory/standardowy.png"),
  "ubior-czerwony": require("@/assets/shop/ubiory/czerwony.png"),
  "ubior-fioletowy": require("@/assets/shop/ubiory/fioletowy.png"),
  "ubior-mietowy": require("@/assets/shop/ubiory/mietowy.png"),
  "ubior-niebieski": require("@/assets/shop/ubiory/niebieski.png"),
  "ubior-rozowy": require("@/assets/shop/ubiory/rozowy.png"),
  "ubior-turkusowy": require("@/assets/shop/ubiory/turkusowy.png"),
  "ubior-krolewski": require("@/assets/shop/ubiory/krolewski.png"),
  "ubior-aktor": require("@/assets/shop/ubiory/aktor.png"),
  "ubior-mag": require("@/assets/shop/ubiory/mag.png"),
  "ubior-gwiazda": require("@/assets/shop/ubiory/gwiazda.png"),
};

/** The backgrounds, with no character in them. */
export const BACKGROUND_IMAGES: Record<string, Img> = {
  [DEFAULT_BACKGROUND_ID]: require("@/assets/shop/tla/sloneczne.jpg"),
  "tlo-scena": require("@/assets/shop/tla/scena.jpg"),
  "tlo-wioska": require("@/assets/shop/tla/wioska.jpg"),
  "tlo-port": require("@/assets/shop/tla/port.jpg"),
  "tlo-gory": require("@/assets/shop/tla/gory.jpg"),
  "tlo-miasto": require("@/assets/shop/tla/miasto.jpg"),
};
