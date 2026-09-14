export type NoteLetter = "C" | "D" | "E" | "F" | "G" | "A" | "B";

/** -1 = flat, 0 = natural, 1 = sharp. -2/2 (double flat/sharp) exist only
 * for "Fabryka Budowania"'s major-triad building (D♯ and A♯ major need
 * one on the third, e.g. D♯-F𝄪-A♯) — every other exercise type still only
 * ever produces/consumes -1|0|1, via noteAtInterval's own unchanged ±1
 * guard (see lib/music/triads.ts's buildTriadAllowingDoubleAccidental for
 * the one deliberately separate path that allows ±2). */
export type Accidental = -2 | -1 | 0 | 1 | 2;

export interface Note {
  letter: NoteLetter;
  accidental: Accidental;
  octave: number;
}

const NOTE_LETTERS: readonly NoteLetter[] = ["C", "D", "E", "F", "G", "A", "B"];

/** Semitones above C within an octave, for the natural (accidental-less) letter. */
const LETTER_SEMITONES: Record<NoteLetter, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

/** Diatonic step index within an octave (0-6), used for staff placement — see lib/music/staff.ts. */
export function letterDiatonicIndex(letter: NoteLetter): number {
  return NOTE_LETTERS.indexOf(letter);
}

/** Inverse of letterDiatonicIndex — wraps any integer into 0-6 first, so
 * indexes from arithmetic that can go negative or past 6 (e.g. shifting a
 * letter by several diatonic steps) still resolve. Used by
 * lib/music/intervals.ts's noteAtInterval, which needs to land on a letter
 * before it knows what octave that letter is in. */
export function diatonicIndexToLetter(index: number): NoteLetter {
  return NOTE_LETTERS[((index % 7) + 7) % 7];
}

export function noteToMidi(note: Note): number {
  return (note.octave + 1) * 12 + LETTER_SEMITONES[note.letter] + note.accidental;
}

export function midiToFrequency(midiNumber: number, a4Frequency = 440): number {
  return a4Frequency * Math.pow(2, (midiNumber - 69) / 12);
}

export function noteToFrequency(note: Note, a4Frequency = 440): number {
  return midiToFrequency(noteToMidi(note), a4Frequency);
}

/** Cents between two frequencies, folded to the smallest distance on the
 * pitch-class circle — ignores which octave either one is in. "Zaczarowany
 * Solfeż"'s own singing exercises use this to grade a sung pitch: a
 * student singing the right note an octave off from the written pitch
 * still sang the right solfège syllable, which is what matters for sight-
 * singing practice, so octave errors are forgiven the same way this app's
 * other ear-training already leans forgiving for kids. Range: (-600, 600]. */
export function octaveFoldedCentsDifference(freqA: number, freqB: number): number {
  const rawCents = 1200 * Math.log2(freqA / freqB);
  const wrapped = ((rawCents % 1200) + 1200) % 1200;
  return wrapped > 600 ? wrapped - 1200 : wrapped;
}

/** "match" (within tolerance) | "flat"/"sharp" (off, but close enough that
 * a direction is a useful hint) | "far" (off by more than a couple of
 * semitones — not the note at all, a direction wouldn't help). Kid-facing
 * apps in this space (see the "Sight Singing Pro" research this was
 * inspired by) give a qualitative flat/sharp/in-tune read rather than raw
 * Hz numbers — this is that same idea as a small, locale-free
 * classification; the calling component maps it to actual wording. */
export type PitchMatchQuality = "match" | "flat" | "sharp" | "far";

/** Beyond this many cents off, "too high/too low" stops being a useful
 * hint — at that distance the student sang a different note entirely, not
 * a slightly mistuned version of the target one. */
const FAR_MISS_CENTS = 300;

export function classifyPitchMatch(detectedHz: number, targetHz: number, toleranceCents: number): PitchMatchQuality {
  const diff = octaveFoldedCentsDifference(detectedHz, targetHz);
  if (Math.abs(diff) <= toleranceCents) return "match";
  if (Math.abs(diff) > FAR_MISS_CENTS) return "far";
  return diff < 0 ? "flat" : "sharp";
}

const ACCIDENTAL_SYMBOL: Record<Accidental, string> = {
  [-2]: "bb",
  [-1]: "b",
  [0]: "",
  [1]: "#",
  [2]: "x",
};

/** Scientific pitch notation, e.g. "C4", "F#3", "Bb5", "Fx4" (double sharp). */
export function formatScientific(note: Note): string {
  return `${note.letter}${ACCIDENTAL_SYMBOL[note.accidental]}${note.octave}`;
}

/** "bb" must come before the lone "b" alternative, same for "x" needing no
 * such ordering since it doesn't prefix-collide with "#" — alternation
 * tries left to right, so the longer double-accidental token has to win
 * first or it'd only ever match its first character. */
const SCIENTIFIC_PATTERN = /^([A-G])(bb|x|#|b)?(-?\d+)$/;

const ACCIDENTAL_FROM_SYMBOL: Record<string, Accidental> = {
  x: 2,
  "#": 1,
  b: -1,
  bb: -2,
};

export function parseScientific(value: string): Note {
  const match = SCIENTIFIC_PATTERN.exec(value.trim());
  if (!match) {
    throw new Error(`Invalid scientific pitch notation: "${value}"`);
  }
  const [, letter, accidentalSymbol, octave] = match;
  const accidental: Accidental = accidentalSymbol ? ACCIDENTAL_FROM_SYMBOL[accidentalSymbol] : 0;
  return { letter: letter as NoteLetter, accidental, octave: Number(octave) };
}

export function areEnharmonicallyEqual(a: Note, b: Note): boolean {
  return noteToMidi(a) === noteToMidi(b);
}

/** Sharp-spelled letter/accidental for each pitch class (0=C .. 11=B) — the
 * conventional spelling for an ascending keyboard, used by midiToNote. */
const PITCH_CLASS_SPELLING: Record<number, { letter: NoteLetter; accidental: Accidental }> = {
  0: { letter: "C", accidental: 0 },
  1: { letter: "C", accidental: 1 },
  2: { letter: "D", accidental: 0 },
  3: { letter: "D", accidental: 1 },
  4: { letter: "E", accidental: 0 },
  5: { letter: "F", accidental: 0 },
  6: { letter: "F", accidental: 1 },
  7: { letter: "G", accidental: 0 },
  8: { letter: "G", accidental: 1 },
  9: { letter: "A", accidental: 0 },
  10: { letter: "A", accidental: 1 },
  11: { letter: "B", accidental: 0 },
};

export function midiToNote(midiNumber: number): Note {
  const octave = Math.floor(midiNumber / 12) - 1;
  const pitchClass = ((midiNumber % 12) + 12) % 12;
  const { letter, accidental } = PITCH_CLASS_SPELLING[pitchClass];
  return { letter, accidental, octave };
}

/** Every chromatic pitch from `from` to `to` (inclusive), for rendering a
 * piano-keyboard exercise — see components/game/PianoKeyboard.tsx. */
export function enumerateChromaticRange(from: Note, to: Note): Note[] {
  const fromMidi = noteToMidi(from);
  const toMidi = noteToMidi(to);
  const notes: Note[] = [];
  for (let midi = fromMidi; midi <= toMidi; midi++) {
    notes.push(midiToNote(midi));
  }
  return notes;
}
