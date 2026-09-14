import type { Locale } from "@/types/locale";
import { noteToFrequency, octaveFoldedCentsDifference } from "./notes";
import type { NoteLetter } from "./notes";

/**
 * Solmization (solfège) syllables — do/re/mi/fa/sol/la/si — as taught in
 * "Zaczarowany Solfeż" (the sight-singing world). This is genuinely a
 * DIFFERENT naming system from the rest of the app: every other world
 * teaches notes by their C/D/E/F/G/A/H letter names (see lib/music/
 * names.ts's own doc — "Letter names, not solfège"). Fixed-do only
 * (each letter always maps to the same syllable, not movable-do scale-
 * degree naming) and natural notes only — no chromatic solfège forms
 * (do dièse, etc.) since this world's content never uses accidentals,
 * keeping a beginner's first sight-singing steps to the plain diatonic
 * scale, matching how solfège is first taught in practice.
 */
const SOLFEGE_SYLLABLE: Record<Locale, Record<NoteLetter, string>> = {
  pl: { C: "do", D: "re", E: "mi", F: "fa", G: "sol", A: "la", B: "si" },
};

export function getSolfegeSyllable(letter: NoteLetter, locale: Locale): string {
  return SOLFEGE_SYLLABLE[locale][letter];
}

const NATURAL_LETTERS: readonly NoteLetter[] = ["C", "D", "E", "F", "G", "A", "B"];

export interface SolfegeTunerReading {
  syllable: string;
  /** Octave-folded cents from `detectedHz` to `syllable`'s own in-tune
   * center — negative means flat (sung too low), positive sharp (too
   * high). Can be as much as ±100 (half a diatonic step) since this only
   * ever picks the CLOSEST natural note, never a chromatic one. */
  centsOff: number;
}

/** Maps a raw detected pitch to the nearest DIATONIC (natural-note-only)
 * solfège reading, for a live "what am I hearing right now" tuner —
 * SolfegePhraseSingingExercise's own level-4 tuner readout is the first
 * user of this. This world never teaches chromatic solfège forms (see
 * this module's own doc), so a live tuner should never report "do
 * dièse" — it always reports whichever of the 7 natural syllables is
 * CLOSEST, plus how far off (octave-folded, same as
 * octaveFoldedCentsDifference elsewhere in this app — any octave counts
 * as that syllable, matching how this world's own grading already
 * forgives octave errors) the actual pitch was from that syllable's own
 * in-tune center. */
export function nearestSolfegeReading(detectedHz: number, locale: Locale): SolfegeTunerReading {
  let best: { letter: NoteLetter; cents: number } | null = null;
  for (const letter of NATURAL_LETTERS) {
    const cents = octaveFoldedCentsDifference(detectedHz, noteToFrequency({ letter, accidental: 0, octave: 4 }));
    if (best === null || Math.abs(cents) < Math.abs(best.cents)) {
      best = { letter, cents };
    }
  }
  return { syllable: getSolfegeSyllable(best!.letter, locale), centsOff: best!.cents };
}
