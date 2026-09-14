import type { Locale } from "@/types/locale";
import { getNoteDisplayName } from "./names";
import { noteAtInterval } from "./intervals";
import type { Accidental, Note, NoteLetter } from "./notes";

export type KeyMode = "major" | "minor";

/** Range of key signatures "Labirynt Tonacji" spaces evenly around the
 * wheel, one 30° sector each — up to 5 sharps (H-dur) or 5 flats (Des-dur).
 * A real circle of fifths has 12 pitch classes, not 11: the 12th "seam"
 * position is where 6 sharps (Fis-dur) and 6 flats (Ges-dur) meet — the
 * same pitch, two valid spellings. That seam is real content (see
 * SEAM_SHARP_FIFTHS/SEAM_FLAT_FIFTHS below and CircleOfFifthsWheel's own
 * rendering of it), just not a *second* independent sector — going one more
 * step past it in either direction would land back on a fifths value
 * that's already elsewhere on the wheel. */
export const MIN_FIFTHS = -5;
export const MAX_FIFTHS = 5;

/** The two enharmonically-identical spellings of the wheel's "bottom seam"
 * — one step past MAX_FIFTHS/MIN_FIFTHS in each direction. Real content
 * (getKeyAtFifths/getKeySignatureStaffSteps both resolve these), but they
 * share one physical wheel position rather than getting their own 30°
 * sector — see CircleOfFifthsWheel. */
export const SEAM_SHARP_FIFTHS = MAX_FIFTHS + 1;
export const SEAM_FLAT_FIFTHS = MIN_FIFTHS - 1;

export interface CircleOfFifthsKey {
  /** Signed count of fifths from C — negative is flats, positive is
   * sharps, 0 is C. */
  fifths: number;
  majorTonic: Note;
  minorTonic: Note;
}

const REFERENCE_C: Note = { letter: "C", accidental: 0, octave: 4 };

/** Builds the circle-of-fifths table by repeatedly stepping a perfect
 * fifth (7 semitones, 4 diatonic letters) up or down from C via
 * noteAtInterval — the same enharmonic-correctness logic Pasmo
 * Interwałów's own interval pairs already rely on, so a key's tonic is
 * spelled the same way a "kwinta czysta" example would be. Relative minor
 * is derived the same way: a minor third below the major tonic. */
function buildCircle(): Map<number, CircleOfFifthsKey> {
  const table = new Map<number, CircleOfFifthsKey>();
  table.set(0, { fifths: 0, majorTonic: REFERENCE_C, minorTonic: noteAtInterval(REFERENCE_C, 3, -1) });

  let sharpTonic = REFERENCE_C;
  for (let fifths = 1; fifths <= SEAM_SHARP_FIFTHS; fifths++) {
    sharpTonic = noteAtInterval(sharpTonic, 7, 1);
    table.set(fifths, { fifths, majorTonic: sharpTonic, minorTonic: noteAtInterval(sharpTonic, 3, -1) });
  }

  let flatTonic = REFERENCE_C;
  for (let fifths = -1; fifths >= SEAM_FLAT_FIFTHS; fifths--) {
    flatTonic = noteAtInterval(flatTonic, 7, -1);
    table.set(fifths, { fifths, majorTonic: flatTonic, minorTonic: noteAtInterval(flatTonic, 3, -1) });
  }

  return table;
}

const CIRCLE: ReadonlyMap<number, CircleOfFifthsKey> = buildCircle();

/** Every fifths value this app supports, in circle order from the flattest
 * to the sharpest key — the domain the wheel samples from (the seam
 * position is deliberately excluded — see SEAM_SHARP_FIFTHS/
 * SEAM_FLAT_FIFTHS's own doc). */
export const ALL_FIFTHS: readonly number[] = Array.from({ length: MAX_FIFTHS - MIN_FIFTHS + 1 }, (_, i) => MIN_FIFTHS + i);

export function getKeyAtFifths(fifths: number): CircleOfFifthsKey {
  const key = CIRCLE.get(fifths);
  if (!key) {
    throw new Error(`getKeyAtFifths: no key defined for ${fifths} fifths (range is ${SEAM_FLAT_FIFTHS}..${SEAM_SHARP_FIFTHS})`);
  }
  return key;
}

const MAJOR_SUFFIX: Record<Locale, string> = { pl: "-dur" };
const MINOR_SUFFIX: Record<Locale, string> = { pl: "-moll" };

/** Polish major/minor key names follow the same German-derived convention
 * as note names (getNoteDisplayName) — major keys keep the note name's own
 * capitalization (e.g. "Es-dur"), minor keys lowercase it ("es-moll"),
 * since Polish marks the major/minor distinction by the tonic's letter
 * case, not just a following word the way English "Eb major"/"Eb minor"
 * does. */
export function getKeyDisplayName(tonic: Note, mode: KeyMode, locale: Locale): string {
  const noteName = getNoteDisplayName(tonic, locale);
  const cased =
    mode === "major" ? noteName.charAt(0).toUpperCase() + noteName.slice(1) : noteName.charAt(0).toLowerCase() + noteName.slice(1);
  return `${cased}${mode === "major" ? MAJOR_SUFFIX[locale] : MINOR_SUFFIX[locale]}`;
}

/** Both key names for a fifths position at once — the shape most exercises
 * (and the wheel itself) actually need, since a circle-of-fifths sector's
 * identity is always the major/minor pair together, not either name
 * alone. */
export function getKeyPairDisplayName(fifths: number, locale: Locale): { major: string; minor: string } {
  const key = getKeyAtFifths(fifths);
  return {
    major: getKeyDisplayName(key.majorTonic, "major", locale),
    minor: getKeyDisplayName(key.minorTonic, "minor", locale),
  };
}

export interface AccidentalInfo {
  count: number;
  type: "sharps" | "flats" | "none";
}

/** How many accidentals a key signature has, and which kind. */
export function getAccidentalCount(fifths: number): AccidentalInfo {
  if (fifths === 0) {
    return { count: 0, type: "none" };
  }
  return { count: Math.abs(fifths), type: fifths > 0 ? "sharps" : "flats" };
}

/** Treble-clef staff step (same numbering as lib/music/staff.ts — 0 =
 * bottom line E4, 8 = top line F5, 9 = first ledger space above) for each
 * accidental of a key signature, in the order it's added: sharps F♯ C♯ G♯
 * D♯ A♯ E♯ B♯, flats B♭ E♭ A♭ D♭ G♭ C♭ F♭. Fixed engraving convention
 * (verified against standard references, not derived) — every notation
 * program places accidentals at exactly these positions, alternating a
 * fourth-down/fifth-up zigzag that keeps them clustered near the staff. */
const SHARP_STAFF_STEPS: readonly number[] = [8, 5, 9, 6, 3, 7, 4];
const FLAT_STAFF_STEPS: readonly number[] = [4, 7, 3, 6, 2, 5, 1];

/** The staff step for each accidental a key signature of `fifths` needs, in
 * the order they're added (so slicing to the first N gives exactly that
 * key's signature). Empty for C (fifths 0). */
export function getKeySignatureStaffSteps(fifths: number): readonly number[] {
  if (fifths === 0) {
    return [];
  }
  const steps = fifths > 0 ? SHARP_STAFF_STEPS : FLAT_STAFF_STEPS;
  return steps.slice(0, Math.abs(fifths));
}

/** Letter order the accidentals are added in — FCGDAEB for sharps (each a
 * fifth above the last), BEADGCF for flats (the exact reverse). */
const SHARP_LETTER_ORDER: readonly NoteLetter[] = ["F", "C", "G", "D", "A", "E", "B"];
const FLAT_LETTER_ORDER: readonly NoteLetter[] = ["B", "E", "A", "D", "G", "C", "F"];

/** Letters (pitch classes, any octave) a key signature of `fifths` alters —
 * e.g. fifths=1 gives ["F"], fifths=-2 gives ["B", "E"]. */
export function getKeySignatureLetters(fifths: number): readonly NoteLetter[] {
  if (fifths === 0) {
    return [];
  }
  const letters = fifths > 0 ? SHARP_LETTER_ORDER : FLAT_LETTER_ORDER;
  return letters.slice(0, Math.abs(fifths));
}

const ACCIDENTAL_WORDS: Record<Locale, Record<"sharps" | "flats", { one: string; few: string; many: string }>> = {
  pl: {
    sharps: { one: "krzyżyk", few: "krzyżyki", many: "krzyżyków" },
    flats: { one: "bemol", few: "bemole", many: "bemoli" },
  },
};

/** "2 krzyżyki" / "5 bemoli" — Polish declines the noun by count (singular
 * at 1, nominative plural at 2-4, genitive plural at 5+). Used by
 * "Labirynt Tonacji"'s accidental-count exercises to name a count in
 * words instead of just showing the bare digit. */
export function formatAccidentalCount(count: number, type: "sharps" | "flats", locale: Locale): string {
  const words = ACCIDENTAL_WORDS[locale][type];
  const word = count === 1 ? words.one : count <= 4 ? words.few : words.many;
  return `${count} ${word}`;
}

const NO_ACCIDENTALS_LABEL: Record<Locale, string> = { pl: "brak znaków" };

/** Same as formatAccidentalCount, but handles `fifths === 0` (C major/A
 * minor has no key signature to name a count for) — used wherever a hint
 * needs to describe ANY key's accidental count, not just a nonzero one. */
export function describeAccidentalCount(fifths: number, locale: Locale): string {
  if (fifths === 0) {
    return NO_ACCIDENTALS_LABEL[locale];
  }
  return formatAccidentalCount(Math.abs(fifths), fifths > 0 ? "sharps" : "flats", locale);
}

/** Display names (locale-aware, via getNoteDisplayName) for each accidental
 * a key signature of `fifths` needs, in the order they're added — e.g.
 * fifths=2 (D-dur) gives ["fis", "cis"] in Polish. Labels the accidental
 * ring around CircleOfFifthsWheel's key-signature icons. Empty for C. */
export function getKeySignatureAccidentalNames(fifths: number, locale: Locale): string[] {
  if (fifths === 0) {
    return [];
  }
  const letters = fifths > 0 ? SHARP_LETTER_ORDER : FLAT_LETTER_ORDER;
  const accidental: Accidental = fifths > 0 ? 1 : -1;
  return letters.slice(0, Math.abs(fifths)).map((letter) => getNoteDisplayName({ letter, accidental, octave: 4 }, locale));
}
