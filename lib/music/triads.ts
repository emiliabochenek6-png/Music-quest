import type { Locale } from "@/types/locale";
import { getNoteDisplayName } from "./names";
import { noteAtInterval } from "./intervals";
import { getKeyAtFifths, getKeyDisplayName } from "./keys";
import { noteToMidi, type Note } from "./notes";

export type TriadQuality = "major" | "minor" | "diminished" | "augmented";

/** Every quality this app teaches, in the order Zatoka Trójdźwięków's own
 * level 1 introduces them (durowy, molowy, zmniejszony, zwiększony) — the
 * default option pool for triad-quality-choice when a level doesn't
 * restrict itself to a subset. */
export const ALL_TRIAD_QUALITIES: readonly TriadQuality[] = ["major", "minor", "diminished", "augmented"];

/** The three primary triads (trójdźwięki główne) of a key — built on scale
 * degrees I, IV, V. In a major key all three come out major, which is
 * what makes them "primary". */
export type TriadRole = "T" | "S" | "D";

export interface Triad {
  root: Note;
  third: Note;
  fifth: Note;
  quality: TriadQuality;
}

/** Semitone gap of each of a triad's two stacked thirds (bottom, top) for
 * each quality. Stacked as two separate noteAtInterval calls — never as
 * one direct root-to-fifth jump — because a third's letter-distance
 * (always 2) is unambiguous, while a single 6- or 8-semitone jump isn't:
 * this app's INTERVAL_LETTER_DISTANCE table pins 6 semitones to the
 * augmented-4th spelling, which would misspell a diminished triad's fifth
 * as an augmented 4th (F# instead of Gb above C), and 8 semitones has no
 * direct "5th" entry at all. Building fifth-from-third instead sidesteps
 * both. */
export const QUALITY_THIRDS: Record<TriadQuality, [number, number]> = {
  major: [4, 3],
  minor: [3, 4],
  diminished: [3, 3],
  augmented: [4, 4],
};

/** Builds any of the four triad qualities on a given root. */
export function buildTriad(root: Note, quality: TriadQuality): Triad {
  const [bottomThird, topThird] = QUALITY_THIRDS[quality];
  const third = noteAtInterval(root, bottomThird, 1);
  const fifth = noteAtInterval(third, topThird, 1);
  return { root, third, fifth, quality };
}

/** Fifths offset (on the same circle-of-fifths scale lib/music/keys.ts
 * already uses) from a major key's own tonic to each primary triad's
 * root — S is a fifth below the tonic (IV), D is a fifth above (V), by
 * definition of the circle of fifths. */
const ROLE_FIFTHS_OFFSET: Record<TriadRole, number> = { T: 0, S: -1, D: 1 };

/** getKeyAtFifths builds each tonic by literally stepping a fifth from C4
 * per unit of `fifths`, with no octave clamping — fine for a key's
 * abstract identity, but left alone it drifts several octaves from C4 for
 * keys/roles far from it, inaudible as long as nothing plays it out loud —
 * but triad-role-choice does. Snapping by whole octaves only (never
 * touching letter/accidental, so the spelling stays correct) keeps every
 * primary triad's root within a comfortable, singable range regardless of
 * key. */
const COMFORTABLE_OCTAVE_LOW_MIDI = noteToMidi({ letter: "C", accidental: 0, octave: 3 });
const COMFORTABLE_OCTAVE_HIGH_MIDI = noteToMidi({ letter: "C", accidental: 0, octave: 5 });

function normalizeToComfortableOctave(note: Note): Note {
  let result = note;
  while (noteToMidi(result) < COMFORTABLE_OCTAVE_LOW_MIDI) {
    result = { ...result, octave: result.octave + 1 };
  }
  while (noteToMidi(result) >= COMFORTABLE_OCTAVE_HIGH_MIDI) {
    result = { ...result, octave: result.octave - 1 };
  }
  return result;
}

/** Builds one of a major key's three primary triads (T/S/D), root
 * position. `fifths` identifies the key the same way every other Zatoka
 * Trójdźwięków exercise does — see lib/music/keys.ts. Major keys only for
 * now: a minor key's dominant conventionally borrows harmonic minor's
 * raised leading tone, a separate, later lesson this app doesn't teach
 * yet. */
export function getPrimaryTriad(fifths: number, role: TriadRole): Triad {
  const root = normalizeToComfortableOctave(getKeyAtFifths(fifths + ROLE_FIFTHS_OFFSET[role]).majorTonic);
  return buildTriad(root, "major");
}

const ROLE_NAME: Record<Locale, Record<TriadRole, string>> = {
  pl: { T: "tonika", S: "subdominanta", D: "dominanta" },
};

export function getTriadRoleName(role: TriadRole, locale: Locale): string {
  return ROLE_NAME[locale][role];
}

/** Matches the exact wording Zatoka Trójdźwięków's hand-authored level-1
 * questions already use ("durowy (dur)", "molowy (moll)", ...) — the
 * procedurally-generated triad-quality-choice reuses the same names
 * rather than inventing its own phrasing for the same four facts. */
const QUALITY_NAME: Record<Locale, Record<TriadQuality, string>> = {
  pl: { major: "durowy (dur)", minor: "molowy (moll)", diminished: "zmniejszony", augmented: "zwiększony" },
};

export function getTriadQualityName(quality: TriadQuality, locale: Locale): string {
  return QUALITY_NAME[locale][quality];
}

/** "C, E, G" — the triad's three notes (root position, ignoring
 * inversion) as a comma-joined display string, the shape triad-notes-
 * choice's options are built from. */
export function formatTriadNotes(triad: Triad, locale: Locale): string {
  return [triad.root, triad.third, triad.fifth].map((note) => getNoteDisplayName(note, locale)).join(", ");
}

/** Which chord tone sits in the bass — "Jaskinia Akordów"'s own subject,
 * building on Zatoka Trójdźwięków's root-position-only triads. Polish
 * names: root = "postać zasadnicza", first = "sekstakord" (the third is
 * lowest), second = "kwartsekstakord" (the fifth is lowest). */
export type TriadInversion = "root" | "first" | "second";

/** Exported for lib/music/seventhChords.ts's own inversion math — same
 * "shift by a whole octave, never touch letter/accidental" rule a
 * dominant seventh chord's inversions need too, just one chord tone
 * longer than a triad's. */
export function noteUpOctave(note: Note): Note {
  return { ...note, octave: note.octave + 1 };
}

/** The triad's three notes reordered bottom-to-top for a given inversion
 * — root position is root-third-fifth (unchanged); first inversion
 * ("sekstakord") puts the third on the bottom with the root now a
 * seventh above it (so an octave up, not scale-degree math); second
 * inversion ("kwartsekstakord") puts the fifth on the bottom with both
 * root and third shifted up an octave to stay above it. Only ever shifts
 * whole octaves — spelling (letter/accidental) never changes between
 * inversions, matching how real notation respells nothing when a chord
 * is inverted, only re-registers it. */
export function getTriadInversionNotes(triad: Triad, inversion: TriadInversion): Note[] {
  switch (inversion) {
    case "root":
      return [triad.root, triad.third, triad.fifth];
    case "first":
      return [triad.third, triad.fifth, noteUpOctave(triad.root)];
    case "second":
      return [triad.fifth, noteUpOctave(triad.root), noteUpOctave(triad.third)];
  }
}

const INVERSION_NAME: Record<Locale, Record<TriadInversion, string>> = {
  pl: {
    root: "postać zasadnicza",
    first: "sekstakord (I przewrót)",
    second: "kwartsekstakord (II przewrót)",
  },
};

export function getTriadInversionName(inversion: TriadInversion, locale: Locale): string {
  return INVERSION_NAME[locale][inversion];
}

/** "C-dur" style key context, reused by every Zatoka Trójdźwięków prompt
 * that names a role within a specific major key. */
export function getPrimaryTriadKeyName(fifths: number, locale: Locale): string {
  return getKeyDisplayName(getKeyAtFifths(fifths).majorTonic, "major", locale);
}
