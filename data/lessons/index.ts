import { CYTADELA_DOMINANT_CONTENT } from "@/data/lessons/cytadela-dominant";
import { FABRYKA_BUDOWANIA_CONTENT } from "@/data/lessons/fabryka-budowania";
import { GAJ_GRUPOWANIA_CONTENT } from "@/data/lessons/gaj-grupowania";
import { JASKINIA_AKORDOW_CONTENT } from "@/data/lessons/jaskinia-akordow";
import { LABIRYNT_TONACJI_CONTENT } from "@/data/lessons/labirynt-tonacji";
import { MIASTO_RYTMU_CONTENT } from "@/data/lessons/miasto-rytmu";
import { PASMO_INTERWALOW_CONTENT } from "@/data/lessons/pasmo-interwalow";
import { PRZYSTAN_TAKTOW_CONTENT } from "@/data/lessons/przystan-taktow";
import { SZCZYT_DYKTAND_CONTENT } from "@/data/lessons/szczyt-dyktand";
import { WIOSKA_NUT_CONTENT } from "@/data/lessons/wioska-nut";
import { ZACZAROWANY_SOLFEZ_CONTENT } from "@/data/lessons/zaczarowany-solfez";
import { ZATOKA_TROJDZWIEKOW_CONTENT } from "@/data/lessons/zatoka-trojdzwiekow";
import type { WorldContent } from "@/types/exercises";

/** Which worlds have a real, playable exercise engine wired up — every
 * world in the app, Wioska Nut through Szczyt Dyktand, plus Jaskinia
 * Akordów (a new, not-ported-from-web world teaching triad inversions,
 * inserted right after Zatoka Trójdźwięków), Cytadela Dominant (a new
 * world teaching dominant seventh chord inversions, inserted right after
 * Jaskinia Akordów), and Zaczarowany Solfeż (a new, LAST world teaching
 * microphone-graded sight-singing — see its own content file's doc).
 * Worlds without an entry here fall back to the placeholder "mark as
 * complete" shell in app/(main)/world/[worldId].tsx. */
const WORLD_CONTENT: Record<string, WorldContent> = {
  "wioska-nut": WIOSKA_NUT_CONTENT,
  "miasto-rytmu": MIASTO_RYTMU_CONTENT,
  "przystan-taktow": PRZYSTAN_TAKTOW_CONTENT,
  "pasmo-interwalow": PASMO_INTERWALOW_CONTENT,
  "zatoka-trojdzwiekow": ZATOKA_TROJDZWIEKOW_CONTENT,
  "jaskinia-akordow": JASKINIA_AKORDOW_CONTENT,
  "cytadela-dominant": CYTADELA_DOMINANT_CONTENT,
  "labirynt-tonacji": LABIRYNT_TONACJI_CONTENT,
  "fabryka-budowania": FABRYKA_BUDOWANIA_CONTENT,
  "gaj-grupowania": GAJ_GRUPOWANIA_CONTENT,
  "szczyt-dyktand": SZCZYT_DYKTAND_CONTENT,
  "zaczarowany-solfez": ZACZAROWANY_SOLFEZ_CONTENT,
};

export function getWorldContent(worldId: string): WorldContent | undefined {
  return WORLD_CONTENT[worldId];
}

/** Every exercise across every lesson, in a single flat, played-in-order
 * list — this world's own lesson boundaries aren't shown as separate
 * screens in this pass (no per-lesson intro/summary screens yet), just
 * one continuous progress bar across the whole world. */
export function flattenExercises(content: WorldContent) {
  return content.lessons.flatMap((lesson) => lesson.exercises);
}
