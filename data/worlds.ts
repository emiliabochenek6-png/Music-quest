import type { WorldDefinition } from "@/types/content";

/** The 12 curriculum worlds, in fixed progression order — single source of
 * truth for the map, the paywall gate, and unlock resolution (see
 * lib/progression/resolveNodeState.ts). Worlds 1-3 are always free; 4-12
 * require an active subscription ON TOP OF finishing the previous world —
 * see ARCHITECTURE.md section 3.1 for why subscription never skips the
 * progression order. */
export const WORLDS: WorldDefinition[] = [
  {
    id: "wioska-nut",
    order: 1,
    nameKey: "world.wioskaNut.name",
    descriptionKey: "world.wioskaNut.description",
    isPremium: false,
    accentColor: "#F4A261",
    mapIllustrationId: "wioska-nut",
    mapIconId: "note",
  },
  {
    id: "miasto-rytmu",
    order: 2,
    nameKey: "world.miastoRytmu.name",
    descriptionKey: "world.miastoRytmu.description",
    isPremium: false,
    accentColor: "#E76F51",
    mapIllustrationId: "miasto-rytmu",
    mapIconId: "metronome",
  },
  {
    id: "przystan-taktow",
    order: 3,
    nameKey: "world.przystanTaktow.name",
    descriptionKey: "world.przystanTaktow.description",
    isPremium: false,
    accentColor: "#2A9D8F",
    mapIllustrationId: "przystan-taktow",
    mapIconId: "bar-line",
  },
  {
    id: "pasmo-interwalow",
    order: 4,
    nameKey: "world.pasmoInterwalow.name",
    descriptionKey: "world.pasmoInterwalow.description",
    isPremium: true,
    accentColor: "#264653",
    mapIllustrationId: "pasmo-interwalow",
    mapIconId: "interval",
  },
  {
    id: "zatoka-trojdzwiekow",
    order: 5,
    nameKey: "world.zatokaTrojdzwiekow.name",
    descriptionKey: "world.zatokaTrojdzwiekow.description",
    isPremium: true,
    accentColor: "#457B9D",
    mapIllustrationId: "zatoka-trojdzwiekow",
    mapIconId: "chord",
  },
  {
    id: "jaskinia-akordow",
    order: 6,
    nameKey: "world.jaskiniaAkordow.name",
    descriptionKey: "world.jaskiniaAkordow.description",
    isPremium: true,
    accentColor: "#6F4E37",
    mapIllustrationId: "jaskinia-akordow",
    mapIconId: "inversion",
  },
  {
    id: "cytadela-dominant",
    order: 7,
    nameKey: "world.cytadelaDominant.name",
    descriptionKey: "world.cytadelaDominant.description",
    isPremium: true,
    accentColor: "#C9184A",
    mapIllustrationId: "cytadela-dominant",
    mapIconId: "citadel",
  },
  {
    id: "labirynt-tonacji",
    order: 8,
    nameKey: "world.labiryntTonacji.name",
    descriptionKey: "world.labiryntTonacji.description",
    isPremium: true,
    accentColor: "#8338EC",
    mapIllustrationId: "labirynt-tonacji",
    mapIconId: "key-signature",
  },
  {
    id: "fabryka-budowania",
    order: 9,
    nameKey: "world.fabrykaBudowania.name",
    descriptionKey: "world.fabrykaBudowania.description",
    isPremium: true,
    accentColor: "#FB8500",
    mapIllustrationId: "fabryka-budowania",
    mapIconId: "build",
  },
  {
    id: "gaj-grupowania",
    order: 10,
    nameKey: "world.gajGrupowania.name",
    descriptionKey: "world.gajGrupowania.description",
    isPremium: true,
    accentColor: "#588157",
    mapIllustrationId: "gaj-grupowania",
    mapIconId: "beam",
  },
  {
    id: "szczyt-dyktand",
    order: 11,
    nameKey: "world.szczytDyktand.name",
    descriptionKey: "world.szczytDyktand.description",
    isPremium: true,
    accentColor: "#9D4EDD",
    mapIllustrationId: "szczyt-dyktand",
    mapIconId: "dictation",
  },
  {
    id: "zaczarowany-solfez",
    order: 12,
    nameKey: "world.zaczarowanySolfez.name",
    descriptionKey: "world.zaczarowanySolfez.description",
    isPremium: true,
    accentColor: "#E0AF68",
    mapIllustrationId: "zaczarowany-solfez",
    mapIconId: "microphone",
  },
];

export function getWorldById(id: string): WorldDefinition | undefined {
  return WORLDS.find((world) => world.id === id);
}

export function getPreviousWorld(world: WorldDefinition): WorldDefinition | undefined {
  return WORLDS.find((w) => w.order === world.order - 1);
}
