import type { Locale } from "@/types/locale";
import { noteAtInterval } from "./intervals";
import type { Note } from "./notes";
import { buildTriad, noteUpOctave } from "./triads";

/**
 * "Cytadela Dominant" — the world right after Jaskinia Akordów, teaching
 * the dominant seventh chord (dominanta septymowa, D⁷/V⁷): a major triad
 * built on the 5th scale degree with one more third stacked on top (a
 * minor seventh above the root). Only this one quality is taught — unlike
 * triads.ts's TriadQuality, there's no quality axis here, just four
 * inversions of the same chord shape.
 */
export interface SeventhChord {
  root: Note;
  third: Note;
  fifth: Note;
  seventh: Note;
}

/** Builds a dominant seventh chord on `root`: root's own major triad
 * (buildTriad's existing thirds-stacking, see its own doc) plus one more
 * minor third on top of the fifth — a minor seventh above the root, the
 * one interval that turns a plain major triad into a dominant seventh.
 * Can throw the same way buildTriad can (a root whose spelling would force
 * a double accidental on the seventh) — callers use the same
 * try/flatAlternateSpelling-retry fallback generate.ts's other chord
 * cases already rely on, not a fallback duplicated here. */
export function buildDominantSeventh(root: Note): SeventhChord {
  const triad = buildTriad(root, "major");
  const seventh = noteAtInterval(triad.fifth, 3, 1);
  return { root: triad.root, third: triad.third, fifth: triad.fifth, seventh };
}

/** Which chord tone sits in the bass — same idea as triads.ts's own
 * TriadInversion, one step further since a seventh chord has four tones
 * to invert through instead of three. Polish names match real music-
 * theory terminology: kwintsekstakord (bass = third), tercekwartakord
 * (bass = fifth), sekundakord (bass = seventh). */
export type SeventhChordInversion = "root" | "first" | "second" | "third";

/** The chord's four notes reordered bottom-to-top for a given inversion —
 * same whole-octaves-only shifting rule as getTriadInversionNotes (see its
 * own doc): each inversion drops the next chord tone into the bass and
 * pushes everything below it up an octave, spelling untouched. */
export function getSeventhChordInversionNotes(chord: SeventhChord, inversion: SeventhChordInversion): Note[] {
  switch (inversion) {
    case "root":
      return [chord.root, chord.third, chord.fifth, chord.seventh];
    case "first":
      return [chord.third, chord.fifth, chord.seventh, noteUpOctave(chord.root)];
    case "second":
      return [chord.fifth, chord.seventh, noteUpOctave(chord.root), noteUpOctave(chord.third)];
    case "third":
      return [chord.seventh, noteUpOctave(chord.root), noteUpOctave(chord.third), noteUpOctave(chord.fifth)];
  }
}

const SEVENTH_INVERSION_NAME: Record<Locale, Record<SeventhChordInversion, string>> = {
  pl: {
    root: "postać zasadnicza (D⁷)",
    first: "kwintsekstakord (D⁶₅, I przewrót)",
    second: "tercekwartakord (D⁴₃, II przewrót)",
    third: "sekundakord (D², III przewrót)",
  },
};

export function getSeventhChordInversionName(inversion: SeventhChordInversion, locale: Locale): string {
  return SEVENTH_INVERSION_NAME[locale][inversion];
}
