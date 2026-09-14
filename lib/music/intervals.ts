import type { Locale } from "@/types/locale";
import {
  diatonicIndexToLetter,
  formatScientific,
  letterDiatonicIndex,
  midiToNote,
  noteToMidi,
  type Accidental,
  type Note,
} from "./notes";

/** Semitone distance between two notes, order-independent — the raw
 * quantity an interval name is looked up from. */
export function intervalSemitones(a: Note, b: Note): number {
  return Math.abs(noteToMidi(b) - noteToMidi(a));
}

/** How many letter-names apart each named interval spans — the property
 * that actually determines an interval's *shape* in written notation (a
 * third always spans 2 letters, e.g. C-E or C-Eb, never C-D#, even though
 * the latter is the same semitone gap as a minor third). Tritone (6) is
 * pinned to the augmented-4th spelling (distance 3) — ported verbatim
 * from the web app's lib/music/intervals.ts. */
const INTERVAL_LETTER_DISTANCE: Record<number, number> = {
  0: 0,
  1: 1,
  2: 1,
  3: 2,
  4: 2,
  5: 3,
  6: 3,
  7: 4,
  8: 5,
  9: 5,
  10: 6,
  11: 6,
  12: 7,
};

function spellIntervalTarget(root: Note, semitones: number, direction: 1 | -1): Note {
  const letterDistance = INTERVAL_LETTER_DISTANCE[semitones];
  if (letterDistance === undefined) {
    throw new Error(`noteAtInterval: no known letter distance for ${semitones} semitones`);
  }

  const rootDiatonicIndex = root.octave * 7 + letterDiatonicIndex(root.letter);
  const targetDiatonicIndex = rootDiatonicIndex + direction * letterDistance;
  const targetOctave = Math.floor(targetDiatonicIndex / 7);
  const targetLetter = diatonicIndexToLetter(targetDiatonicIndex);

  const naturalTarget: Note = { letter: targetLetter, accidental: 0, octave: targetOctave };
  const naturalSemitoneDistance = noteToMidi(naturalTarget) - noteToMidi(root);
  const desiredSemitoneDistance = direction * semitones;
  const neededAccidental = desiredSemitoneDistance - naturalSemitoneDistance;

  return { letter: targetLetter, accidental: neededAccidental as Accidental, octave: targetOctave };
}

/** Spells the note `semitones` away from `root` (up if direction is 1,
 * down if -1) using the letter-distance that interval is supposed to
 * span, so the written result always looks like the right interval shape
 * on the staff — not just a note that happens to land on the right pitch. */
export function noteAtInterval(root: Note, semitones: number, direction: 1 | -1): Note {
  const target = spellIntervalTarget(root, semitones, direction);

  if (target.accidental < -1 || target.accidental > 1) {
    throw new Error(
      `noteAtInterval: ${semitones} semitones ${direction > 0 ? "above" : "below"} ${formatScientific(root)} needs a double sharp/flat, which this app doesn't support`
    );
  }

  return target;
}

/** Like noteAtInterval, but skips its ±1 guard — "Fabryka Budowania"'s
 * double-accidental level is the one place this app deliberately teaches a
 * double sharp/flat target (e.g. a tritone up from C#4 is Fx4, not F#4),
 * so that level's generation calls this instead. Every other caller keeps
 * using noteAtInterval's own guard, since a double accidental anywhere
 * else in this app's content is a content-authoring bug, not a valid
 * answer. */
export function noteAtIntervalAllowingDoubleAccidental(root: Note, semitones: number, direction: 1 | -1): Note {
  return spellIntervalTarget(root, semitones, direction);
}

/** Respells a sharped note as the flat of the letter above it (e.g. D#4 ->
 * Eb4 — same pitch, same octave). Natural notes pass through unchanged.
 * Used only by pickRandomIntervalNotePair's retry when the sharp root
 * spelling would force a double accidental on the second note. */
function flatAlternateSpelling(note: Note): Note {
  if (note.accidental !== 1) return note;
  return { letter: diatonicIndexToLetter(letterDiatonicIndex(note.letter) + 1), accidental: -1, octave: note.octave };
}

/** Interval names by semitone distance (0-12) — ported verbatim from the
 * web app's own rudiments-level naming (pryma/sekunda/.../oktawa,
 * mała/wielka/czysta). */
const INTERVAL_NAMES: Record<Locale, Record<number, string>> = {
  // Each name carries its Polish "oznaczenie klasyczne" (classical
  // notation) in parentheses: the plain scale-degree number is that
  // degree's major/perfect quality, ">" marks it one semitone SMALLER
  // (minor/diminished), "<" marks it one semitone LARGER (augmented) —
  // e.g. "2" = sekunda wielka, "2>" = sekunda mała. The tritone (6
  // semitones) has two equally valid classical spellings at this
  // notation's own resolution (kwarta zwiększona "4<" / kwinta
  // zmniejszona "5>"); this app pins it to "4<", matching
  // INTERVAL_LETTER_DISTANCE's own augmented-4th spelling choice above.
  pl: {
    0: "pryma czysta (1)",
    1: "sekunda mała (2>)",
    2: "sekunda wielka (2)",
    3: "tercja mała (3>)",
    4: "tercja wielka (3)",
    5: "kwarta czysta (4)",
    6: "tryton (4<)",
    7: "kwinta czysta (5)",
    8: "seksta mała (6>)",
    9: "seksta wielka (6)",
    10: "septyma mała (7)",
    11: "septyma wielka (7<)",
    12: "oktawa czysta (8)",
  },
};

/** Every semitone value this app names (0-12) — the full option pool
 * interval-name-choice exercises draw distractors from. */
export const NAMED_INTERVAL_SEMITONES: readonly number[] = Object.keys(INTERVAL_NAMES.pl).map(Number);

export function getIntervalDisplayName(semitones: number, locale: Locale): string {
  const withinOctave = ((semitones % 12) + 12) % 12;
  return INTERVAL_NAMES[locale][semitones] ?? INTERVAL_NAMES[locale][withinOctave];
}

/**
 * Picks a random note pair, within `range`, whose semitone distance is one
 * of `allowedSemitones` — the level-specific randomization Pasmo
 * Interwałów's levels each use their own restricted interval set for, so
 * both the question and the distractor pool it drives stay concentrated on
 * that level's intervals. Direction (root below or above the second note)
 * is picked randomly among whichever candidates actually fit inside
 * `range`. Ported verbatim from the web app's own version.
 */
export function pickRandomIntervalNotePair(range: [Note, Note], allowedSemitones: readonly number[]): [Note, Note] {
  const lowMidi = noteToMidi(range[0]);
  const highMidi = noteToMidi(range[1]);
  const semitones = allowedSemitones[Math.floor(Math.random() * allowedSemitones.length)];

  const candidates: { root: number; ascending: boolean }[] = [];
  for (let root = lowMidi; root <= highMidi; root++) {
    if (root + semitones <= highMidi) candidates.push({ root, ascending: true });
    if (semitones > 0 && root - semitones >= lowMidi) candidates.push({ root, ascending: false });
  }
  if (candidates.length === 0) {
    throw new Error(
      `pickRandomIntervalNotePair: no note pair ${semitones} semitones apart fits within the given range`
    );
  }
  const { root, ascending } = candidates[Math.floor(Math.random() * candidates.length)];
  const direction = ascending ? 1 : -1;
  const sharpRoot = midiToNote(root);
  try {
    return [sharpRoot, noteAtInterval(sharpRoot, semitones, direction)];
  } catch {
    const flatRoot = flatAlternateSpelling(sharpRoot);
    return [flatRoot, noteAtInterval(flatRoot, semitones, direction)];
  }
}
