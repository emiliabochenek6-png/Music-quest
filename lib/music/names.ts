import type { Locale } from "@/types/locale";
import type { Accidental, Note, NoteLetter } from "./notes";

/** Letter names, not solfège — this app teaches C/D/E/F/G/A/H (the Polish/
 * German convention: "H" for B natural, "B" reserved for B-flat), matching
 * how the lesson content itself refers to notes. Data-driven so adding a
 * locale doesn't touch callers. */
const LETTER_NAMES: Record<Locale, Record<NoteLetter, string>> = {
  pl: { C: "C", D: "D", E: "E", F: "F", G: "G", A: "A", B: "H" },
};

const ACCIDENTAL_SUFFIX: Record<Locale, Record<-1 | 0 | 1, string>> = {
  pl: { [-1]: " bemol", [0]: "", [1]: " krzyżyk" },
};

/**
 * Polish altered notes aren't "letter + krzyżyk/bemol" — they're their own
 * words (the same German-derived system as "H"): cis, dis, eis, fis, gis,
 * ais, his for sharps; ces, des, es, fes, ges, as, b for flats (vowel
 * elisions on E/A). All lowercase, including flat-B's "b" — unlike "H"
 * (a plain letter name, capitalized like C/D/E/...), every altered name is
 * a word, and Polish lowercases these consistently regardless of which
 * letter they're built from.
 */
const PL_ALTERED_NAMES: Record<NoteLetter, Record<-1 | 1, string>> = {
  C: { [1]: "cis", [-1]: "ces" },
  D: { [1]: "dis", [-1]: "des" },
  E: { [1]: "eis", [-1]: "es" },
  F: { [1]: "fis", [-1]: "fes" },
  G: { [1]: "gis", [-1]: "ges" },
  A: { [1]: "ais", [-1]: "as" },
  B: { [1]: "his", [-1]: "b" },
};

/** getNoteDisplayName is never called on a double-accidental note in this
 * app's current content — narrows accordingly rather than widening these
 * lookup tables for a case nothing produces yet. */
function toSingleAccidental(accidental: Accidental): -1 | 0 | 1 {
  return accidental === -2 ? -1 : accidental === 2 ? 1 : accidental;
}

export function getNoteDisplayName(note: Note, locale: Locale): string {
  const accidental = toSingleAccidental(note.accidental);
  if (locale === "pl" && accidental !== 0) {
    return PL_ALTERED_NAMES[note.letter][accidental];
  }
  return `${LETTER_NAMES[locale][note.letter]}${ACCIDENTAL_SUFFIX[locale][accidental]}`;
}

/** Like getNoteDisplayName, but also covers ±2 — needed for the solution
 * text on Fabryka Budowania's double-accidental level, where the correct
 * answer itself can be a double sharp/flat (unlike getNoteDisplayName's
 * other callers, which never see one — see its own doc). Polish has no
 * single word for a double accidental the way "cis"/"des" cover a single
 * one, so this describes it instead ("F podwójnie podniesiony") rather
 * than inventing new vocabulary the lessons never teach. */
export function getNoteDisplayNameAllowingDoubleAccidental(note: Note, locale: Locale): string {
  if (note.accidental !== -2 && note.accidental !== 2) {
    return getNoteDisplayName(note, locale);
  }
  const letter = LETTER_NAMES[locale][note.letter];
  return note.accidental === 2 ? `${letter} podwójnie podniesiony` : `${letter} podwójnie obniżony`;
}
