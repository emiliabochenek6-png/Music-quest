import {
  getIntervalDisplayName,
  intervalSemitones,
  NAMED_INTERVAL_SEMITONES,
  noteAtInterval,
  noteAtIntervalAllowingDoubleAccidental,
  pickRandomIntervalNotePair,
} from "@/lib/music/intervals";
import {
  getKeyAtFifths,
  getKeyDisplayName,
  getKeyPairDisplayName,
  getKeySignatureAccidentalNames,
  MIN_FIFTHS,
  MAX_FIFTHS,
} from "@/lib/music/keys";
import { getNoteDisplayName, getNoteDisplayNameAllowingDoubleAccidental } from "@/lib/music/names";
import { diatonicIndexToLetter, formatScientific, letterDiatonicIndex, midiToNote, noteToMidi, parseScientific, type Note } from "@/lib/music/notes";
import { describeStaffPosition, noteToStaffStep } from "@/lib/music/staff";
import {
  ALL_TRIAD_QUALITIES,
  buildTriad,
  formatTriadNotes,
  getPrimaryTriad,
  getTriadInversionNotes,
  getTriadInversionName,
  getTriadQualityName,
  getTriadRoleName,
  type Triad,
} from "@/lib/music/triads";
import { buildDominantSeventh, getSeventhChordInversionNotes, getSeventhChordInversionName } from "@/lib/music/seventhChords";
import { getSolfegeSyllable } from "@/lib/music/solfege";
import { meterQuarterNoteBeats } from "@/lib/rhythm/meter";
import type { Locale } from "@/types/locale";
import type {
  CircleStepDirection,
  ExerciseDefinition,
  GeneratedExercise,
  MultipleChoiceOption,
  RhythmNoteValue,
  RhythmRestValue,
  TonalityMode,
  TriadRole,
} from "@/types/exercises";

const DEFAULT_OPTION_COUNT = 3;

/** Half a semitone — "Zaczarowany Solfeż"'s own default grading tolerance
 * (see types/exercises.ts's own toleranceCents doc) when a level's spec
 * doesn't tighten it. Generous enough for an untrained singing voice's
 * natural wobble, strict enough to still distinguish neighboring notes a
 * whole tone apart. */
const DEFAULT_SOLFEGE_TOLERANCE_CENTS = 50;
// Pacing-only default — see ExerciseSpec's own bpm doc; never consulted by
// analyzeFreeRhythmicPhrase's own (self-calibrating) grading.
const DEFAULT_SOLFEGE_RHYTHM_BPM = 66;

const RHYTHM_NOTE_VALUE_BEATS: Record<RhythmNoteValue, number> = {
  whole: 4,
  half: 2,
  quarter: 1,
  dottedQuarter: 1.5,
  dottedHalf: 3,
  eighth: 0.5,
  dottedEighth: 0.75,
  sixteenth: 0.25,
  eighthTriplet: 1 / 3,
};

const RHYTHM_REST_VALUE_BEATS: Record<RhythmRestValue, number> = {
  quarterRest: 1,
  eighthRest: 0.5,
  sixteenthRest: 0.25,
};

/** How many beats a "rhythm math" combination of note values totals —
 * "Gaj Grupowania" level 3's own use, checking which authored combination
 * sums to exactly one 4/4 measure. */
function combinationBeats(combination: readonly RhythmNoteValue[]): number {
  return combination.reduce((sum, value) => sum + RHYTHM_NOTE_VALUE_BEATS[value], 0);
}

const REST_VALUES: ReadonlySet<string> = new Set<RhythmRestValue>(["quarterRest", "eighthRest", "sixteenthRest"]);

function isRestValue(value: RhythmNoteValue | RhythmRestValue): value is RhythmRestValue {
  return REST_VALUES.has(value);
}

function beatTimesMs(bpm: number, beatsPerMeasure: number, measureCount: number): number[] {
  const beatIntervalMs = (60 / bpm) * 1000;
  const totalBeats = beatsPerMeasure * measureCount;
  return Array.from({ length: totalBeats }, (_, index) => index * beatIntervalMs);
}

/** Fisher-Yates — same shape as the web app's own lib/questions/generate.ts,
 * ported verbatim (pure Math.random(), no DOM dependency). */
function shuffled<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function sample<T>(items: readonly T[], count: number): T[] {
  return shuffled(items).slice(0, count);
}

function toOption(note: string, locale: Locale): MultipleChoiceOption {
  return { id: note, label: getNoteDisplayName(parseScientific(note), locale) };
}

function buildMultipleChoiceOptions(
  targetNote: string,
  distractorPool: readonly string[],
  optionCount: number,
  locale: Locale
): MultipleChoiceOption[] {
  const distractorCount = Math.min(optionCount - 1, distractorPool.length);
  const distractors = sample(distractorPool, distractorCount);
  return shuffled([targetNote, ...distractors]).map((note) => toOption(note, locale));
}

const DEFAULT_INTERVAL_OPTION_COUNT = 3;

function buildIntervalOptions(
  correctSemitones: number,
  optionCount: number,
  locale: Locale,
  pool: readonly number[] = NAMED_INTERVAL_SEMITONES
): MultipleChoiceOption[] {
  const distractorPool = pool.filter((semitones) => semitones !== correctSemitones);
  const distractorCount = Math.min(optionCount - 1, distractorPool.length);
  const distractors = sample(distractorPool, distractorCount);
  return shuffled([correctSemitones, ...distractors]).map((semitones) => ({
    id: String(semitones),
    label: getIntervalDisplayName(semitones, locale),
  }));
}

/** Clamps `[rangeLow, rangeHigh]` to [MIN_FIFTHS, MAX_FIFTHS] before picking
 * a random value inside it — every Zatoka Trójdźwięków exercise type
 * shares this so a level's spec can freely ask for a wider range than the
 * app actually supports without generation misbehaving. */
function randomFifthsInRange([rangeLow, rangeHigh]: [number, number]): number {
  const low = Math.max(rangeLow, MIN_FIFTHS);
  const high = Math.min(rangeHigh, MAX_FIFTHS);
  return low + Math.floor(Math.random() * (high - low + 1));
}

/** Distractor fifths for triad-notes-choice's "right role, wrong key"
 * option, AND (Labirynt Tonacji) circle-neighbor-key-choice/key-signature-
 * staff-choice's "adjacent wheel position" distractors: the four nearest
 * circle-of-fifths sectors either side of the correct one. */
function circleNeighborFifths(fifths: number): number[] {
  const candidates = [fifths - 1, fifths + 1, fifths - 2, fifths + 2];
  return candidates.filter(
    (candidate, index) =>
      candidate !== fifths && candidate >= MIN_FIFTHS && candidate <= MAX_FIFTHS && candidates.indexOf(candidate) === index
  );
}

/** Same as randomFifthsInRange, but never 0 — for the Labirynt Tonacji
 * level 3 text-answer-adjacent types that ask about specific accidentals
 * (there's nothing to name/count for a key signature with none). */
function randomNonZeroFifthsInRange(range: [number, number]): number {
  let fifths = randomFifthsInRange(range);
  while (fifths === 0) {
    fifths = randomFifthsInRange(range);
  }
  return fifths;
}

/** Distractor fifths for the two "same key, different fact" question
 * styles (key-signature-names-choice, accidental-count-key-choice): one
 * fewer accidental, one more, and the same count on the OTHER side
 * (sharps vs flats) — swapping mid/high options in the exact
 * miscounting/miscolored ways a student actually makes. Padded with ±2
 * for the boundary keys (1 or 5 accidentals) where "one fewer"/"one more"
 * would fall outside -5..5. */
function accidentalNeighborFifths(fifths: number): number[] {
  const sign = Math.sign(fifths);
  const n = Math.abs(fifths);
  const candidates = [sign * (n - 1), sign * (n + 1), -fifths, sign * (n - 2), sign * (n + 2), -sign * (n - 1), -sign * (n + 1)];
  return candidates.filter(
    (candidate, index) =>
      candidate !== 0 &&
      candidate !== fifths &&
      candidate >= MIN_FIFTHS &&
      candidate <= MAX_FIFTHS &&
      candidates.indexOf(candidate) === index
  );
}

/** Picks a note uniformly at random within `range`, inclusive — the
 * single-note counterpart to pickRandomIntervalNotePair's range handling,
 * for exercise types (like triad-quality-choice) that only need one
 * starting pitch, not a validated pair. */
function randomNoteInRange(range: [string, string]): Note {
  const lowMidi = noteToMidi(parseScientific(range[0]));
  const highMidi = noteToMidi(parseScientific(range[1]));
  const midi = lowMidi + Math.floor(Math.random() * (highMidi - lowMidi + 1));
  return midiToNote(midi);
}

/** Every natural (accidental-less) note within `range`, inclusive — "
 * Zaczarowany Solfeż"'s own enumeration, since its fixed-do solfège
 * syllables (lib/music/solfege.ts) only cover the plain diatonic scale, no
 * chromatic forms. midiToNote's own canonical spelling always picks the
 * sharp for a black key (see lib/audio/samples.ts's own doc on that
 * convention), so filtering to accidental===0 after the fact reliably
 * means "a white key", regardless of range. Exported as a full list
 * (rather than a randomNoteInRange-style single pick) because this
 * world's own generation needs the WHOLE pool to pick from, excluding
 * whichever of them this lesson attempt has already used — see the
 * "solfege-note-singing" case's own doc on why. */
function diatonicNotesInRange(range: [string, string]): Note[] {
  const lowMidi = noteToMidi(parseScientific(range[0]));
  const highMidi = noteToMidi(parseScientific(range[1]));
  const candidates: Note[] = [];
  for (let midi = lowMidi; midi <= highMidi; midi++) {
    const note = midiToNote(midi);
    if (note.accidental === 0) {
      candidates.push(note);
    }
  }
  if (candidates.length === 0) {
    throw new Error(`solfege-note-singing: no natural note in range [${range[0]}, ${range[1]}]`);
  }
  return candidates;
}

/** Respells any note as the flat of the letter above it — e.g. D#4 -> Eb4,
 * but also (unlike lib/music/intervals.ts's own private flatAlternate­
 * Spelling, which this duplicates since that one isn't exported) a
 * NATURAL note like B4 -> Cb4. Triads need that broader form: a single
 * interval's fallback only ever retries a sharp root, but a triad stacks
 * two thirds, and some qualities are unspellable from a natural root too
 * (B-augmented's fifth would be F double-sharp) — only ever used after the
 * root's own spelling has already failed, so widening it to cover
 * naturals can't make an already-working spelling worse. */
function flatAlternateSpelling(note: Note): Note {
  return { letter: diatonicIndexToLetter(letterDiatonicIndex(note.letter) + 1), accidental: -1, octave: note.octave };
}

/** Shifts every note of a triad by the same number of whole octaves,
 * preserving its letter/accidental spelling. */
function shiftTriadOctave(triad: Triad, octaveDelta: number): Triad {
  const shift = (note: Note): Note => ({ ...note, octave: note.octave + octaveDelta });
  return { root: shift(triad.root), third: shift(triad.third), fifth: shift(triad.fifth), quality: triad.quality };
}

/** Drops `triad` down by whole octaves until its root sits below `other`'s
 * root — triad-role-choice uses this so the tonic reference always plays
 * lower than the S/D target, letting the two chords be compared in a
 * consistent low-to-high order (getPrimaryTriad normalizes each triad's
 * octave independently, so nothing otherwise guarantees that ordering). */
function lowerTriadBelow(triad: Triad, other: Triad): Triad {
  let result = triad;
  while (noteToMidi(result.root) >= noteToMidi(other.root)) {
    result = shiftTriadOctave(result, -1);
  }
  return result;
}

/** Padding either side of a built interval's two notes, in semitones — the
 * PianoKeyboard rendered for interval-build-choice always shows a bit more
 * than just the two notes in play, so the correct key isn't sitting right
 * at the edge of the visible range. */
const KEYBOARD_RANGE_PADDING_SEMITONES = 2;

function paddedKeyboardRange(a: Note, b: Note): { from: string; to: string } {
  const lowMidi = Math.min(noteToMidi(a), noteToMidi(b)) - KEYBOARD_RANGE_PADDING_SEMITONES;
  const highMidi = Math.max(noteToMidi(a), noteToMidi(b)) + KEYBOARD_RANGE_PADDING_SEMITONES;
  return { from: formatScientific(midiToNote(lowMidi)), to: formatScientific(midiToNote(highMidi)) };
}

/** Picks a root within `noteRange` and builds the interval `semitones`
 * away from it in `direction` — "Fabryka Budowania"'s interval-build-
 * staff-choice generation. Unlike pickRandomIntervalNotePair, this never
 * filters candidates against `noteRange` before picking (nothing here
 * plays the target through a finite pre-rendered sample set — it's only
 * ever drawn on a staff — so there's no sample-coverage reason to
 * constrain it the way a clickable keyboard needs). When
 * allowDoubleAccidentals is set, the root's own spelling is randomly
 * flipped to its flat alternate half the time purely for content variety
 * (double-sharp targets read naturally from a sharp-spelled root,
 * double-flat ones from a flat-spelled root) before calling
 * noteAtIntervalAllowingDoubleAccidental; otherwise this retries once
 * with the root respelled flat if the sharp spelling would need a double
 * accidental noteAtInterval doesn't allow. */
function buildIntervalRootTarget(
  noteRange: [string, string],
  semitones: number,
  direction: 1 | -1,
  allowDoubleAccidentals: boolean
): { root: Note; target: Note } {
  let root = randomNoteInRange(noteRange);
  if (allowDoubleAccidentals) {
    if (Math.random() < 0.5) {
      root = flatAlternateSpelling(root);
    }
    return { root, target: noteAtIntervalAllowingDoubleAccidental(root, semitones, direction) };
  }
  try {
    return { root, target: noteAtInterval(root, semitones, direction) };
  } catch {
    const flatRoot = flatAlternateSpelling(root);
    return { root: flatRoot, target: noteAtInterval(flatRoot, semitones, direction) };
  }
}

/** Every staff step a "build on the staff" board needs to make clickable —
 * every line/space from 2 steps below the lower of the two given steps to
 * 2 above the higher, so the correct spot is never right at the board's
 * own edge. Shared by interval-build-staff-choice (2 steps: root, target)
 * and triad-build-staff-choice (3 steps: root, third, fifth). */
function paddedClickableSteps(steps: readonly number[]): number[] {
  const min = Math.min(...steps) - 2;
  const max = Math.max(...steps) + 2;
  const result: number[] = [];
  for (let step = min; step <= max; step++) {
    result.push(step);
  }
  return result;
}

/** A dedup key identifying "this exact question" for the exercise types
 * whose CONTENT (not just its answer options) is randomly generated —
 * interval-name-choice/triad-quality-choice/triad-notes-choice/triad-
 * role-choice each roll a fresh note pair, triad, or key+role on every
 * generation, and a lesson can easily draw the same one twice by pure
 * chance (triad-notes-choice's own fifths×role space is only 21 combos,
 * and one lesson asks 8 of them). Every other type's content is fixed by
 * its own authored spec — the same exercise id always means the same
 * question — so there's nothing to key here; those return null. */
export function getExerciseSignature(exercise: GeneratedExercise): string | null {
  switch (exercise.type) {
    case "interval-name-choice":
      return `interval-name-choice:${exercise.notes.join(",")}`;
    case "triad-quality-choice":
      return `triad-quality-choice:${exercise.notes.join(",")}`;
    case "triad-inversion-choice":
      return `triad-inversion-choice:${exercise.notes.join(",")}-${exercise.inversion}`;
    case "dominant-seventh-inversion-choice":
      return `dominant-seventh-inversion-choice:${exercise.notes.join(",")}-${exercise.inversion}`;
    case "solfege-note-singing":
      return `solfege-note-singing:${exercise.targetNote}`;
    case "triad-notes-choice":
      return `triad-notes-choice:${exercise.fifths}-${exercise.role}`;
    case "triad-role-choice":
      // No dedicated `role` field on this variant — correctOptionId IS the
      // role ("T"/"S"/"D"), since that's exactly what the player picks
      // between (see the "triad-role-choice" case in generateExercise).
      return `triad-role-choice:${exercise.fifths}-${exercise.correctOptionId}`;
    case "circle-step-choice":
      return `circle-step-choice:${exercise.startFifths}-${exercise.direction}`;
    case "relative-key-choice":
      return `relative-key-choice:${exercise.promptFifths}-${exercise.promptMode}`;
    case "key-signature-names-choice":
      return `key-signature-names-choice:${exercise.fifths}`;
    case "circle-neighbor-key-choice":
      return `circle-neighbor-key-choice:${exercise.startFifths}-${exercise.direction}`;
    case "key-signature-staff-choice":
      return `key-signature-staff-choice:${exercise.fifths}`;
    case "accidental-count-key-choice":
      return `accidental-count-key-choice:${exercise.correctFifths}`;
    case "interval-build-choice":
      return `interval-build-choice:${exercise.rootNote}-${exercise.targetNote}`;
    case "interval-build-staff-choice":
      return `interval-build-staff-choice:${exercise.rootNote}-${exercise.targetStep}-${exercise.targetAccidental}`;
    case "triad-build-staff-choice":
      return `triad-build-staff-choice:${exercise.rootNote}-${exercise.quality}`;
    default:
      return null;
  }
}

/** How many times a randomized-content case (see getExerciseSignature) may
 * re-roll while its candidate's signature is already in `exclude` — bounded
 * the same way note-sequencing's own reshuffle-if-trivial retry is, so a
 * near-exhausted combination space (e.g. every fifths×role pair already
 * used) can't spin forever; the last attempt is returned even if it's
 * still a repeat rather than hang. */
const MAX_DEDUP_ATTEMPTS = 20;

function generateWithoutRepeat<T extends GeneratedExercise>(build: () => T, exclude: ReadonlySet<string> | undefined): T {
  let candidate = build();
  if (!exclude) {
    return candidate;
  }
  for (let attempt = 0; attempt < MAX_DEDUP_ATTEMPTS && exclude.has(getExerciseSignature(candidate) ?? ""); attempt++) {
    candidate = build();
  }
  return candidate;
}

/**
 * Single answer-checking entry point's generation-side counterpart —
 * resolves an authored ExerciseDefinition into the player-facing
 * GeneratedExercise a given attempt actually answers against (rolling any
 * randomness — shuffled options, a reshuffled-if-trivial sequence — fresh
 * each call, so re-attempting the same exercise id doesn't repeat the
 * exact same shuffle). Mirrors the web app's lib/questions/generate.ts
 * dispatch shape (one switch case per type) for the 9 Wioska Nut types.
 *
 * `exclude` — signatures (see getExerciseSignature) of exercises already
 * shown earlier in the current lesson attempt — is only consulted by the
 * randomized-content types; every other type ignores it, since its
 * content never varies from one generation to the next in the first
 * place. Passing it re-rolls interval-name-choice/triad-quality-choice/
 * triad-notes-choice/triad-role-choice until they land on something not
 * already asked this lesson (bounded — see generateWithoutRepeat).
 */
export function generateExercise(definition: ExerciseDefinition, locale: Locale, exclude?: ReadonlySet<string>): GeneratedExercise {
  switch (definition.spec.type) {
    case "clef-trace": {
      const { clef } = definition.spec;
      return { id: definition.id, type: "clef-trace", clef };
    }
    case "interval-distance-choice": {
      const { notes } = definition.spec;
      const [a, b] = notes;
      const distance = Math.abs(noteToStaffStep(parseScientific(a)) - noteToStaffStep(parseScientific(b)));
      const correctMotion = distance <= 1 ? "step" : "leap";
      return { id: definition.id, type: "interval-distance-choice", notes, correctMotion };
    }
    case "line-or-space-choice": {
      const { targetNote } = definition.spec;
      const { kind } = describeStaffPosition(parseScientific(targetNote), "treble");
      if (kind !== "line" && kind !== "space") {
        throw new Error(`line-or-space-choice requires an on-staff note, got "${targetNote}" (${kind})`);
      }
      return { id: definition.id, type: "line-or-space-choice", targetNote, correctAnswer: kind };
    }
    case "melody-direction-choice": {
      const { notes, correctDirection } = definition.spec;
      return { id: definition.id, type: "melody-direction-choice", notes, correctDirection };
    }
    case "multiple-choice-notation": {
      const { targetNote, distractorPool, optionCount, clef } = definition.spec;
      return {
        id: definition.id,
        type: "multiple-choice-notation",
        targetNote,
        options: buildMultipleChoiceOptions(targetNote, distractorPool, optionCount ?? DEFAULT_OPTION_COUNT, locale),
        correctOptionId: targetNote,
        clef: clef ?? "treble",
      };
    }
    case "note-sequencing": {
      const { notes } = definition.spec;
      const correctOrder = [...notes].sort((a, b) => noteToMidi(parseScientific(a)) - noteToMidi(parseScientific(b)));
      let shuffledNotes = shuffled(notes);
      for (let attempt = 0; attempt < 10 && shuffledNotes.join() === correctOrder.join(); attempt++) {
        shuffledNotes = shuffled(notes);
      }
      return { id: definition.id, type: "note-sequencing", shuffledNotes, correctOrder };
    }
    case "note-word-spelling": {
      const { notes, clef } = definition.spec;
      const targetWord = notes.map((note) => parseScientific(note).letter).join("");
      return { id: definition.id, type: "note-word-spelling", notes, targetWord, clef: clef ?? "treble" };
    }
    case "pitch-height-choice": {
      const { targetNote, correctSide } = definition.spec;
      return { id: definition.id, type: "pitch-height-choice", targetNote, correctSide };
    }
    case "staff-placement": {
      const { targetStep } = definition.spec;
      return { id: definition.id, type: "staff-placement", targetStep };
    }
    case "pulse-tap": {
      const { bpm, beatsPerMeasure, measureCount, accentOnly, minHits } = definition.spec;
      const allBeats = beatTimesMs(bpm, beatsPerMeasure, measureCount);
      const requiredTapTimesMs = accentOnly ? allBeats.filter((_, index) => index % beatsPerMeasure === 0) : allBeats;
      return {
        id: definition.id,
        type: "pulse-tap",
        bpm,
        beatsPerMeasure,
        measureCount,
        accentOnly: accentOnly ?? false,
        beatTimesMs: allBeats,
        requiredTapTimesMs,
        // No explicit minHits authored: fall back to 70% of the required
        // beats, same bar the web app's own ratio-based scoring uses.
        minHits: minHits ?? Math.ceil(requiredTapTimesMs.length * 0.7),
      };
    }
    case "meter-choice": {
      const { correctMeter, bpm, optionPool, referenceAudioSource } = definition.spec;
      return {
        id: definition.id,
        type: "meter-choice",
        correctMeter,
        bpm: bpm ?? 100,
        optionPool: optionPool ?? ["4/4", "3/4"],
        referenceAudioSource,
      };
    }
    case "rhythm-echo": {
      const { onsetsMs } = definition.spec;
      return { id: definition.id, type: "rhythm-echo", onsetsMs };
    }
    case "rhythm-sequencing": {
      const { motif, bpm } = definition.spec;
      const resolvedBpm = bpm ?? 100;
      const beatIntervalMs = (60 / resolvedBpm) * 1000;
      // Exactly one onset per tile — onset i marks where tile i begins, so
      // the gap to the NEXT onset is the preceding tile's duration.
      const onsetsMs = [0];
      let cumulativeMs = 0;
      for (let i = 0; i < motif.length - 1; i++) {
        cumulativeMs += RHYTHM_NOTE_VALUE_BEATS[motif[i]] * beatIntervalMs;
        onsetsMs.push(cumulativeMs);
      }
      let shuffledMotif = shuffled(motif);
      for (let attempt = 0; attempt < 10 && shuffledMotif.join() === motif.join(); attempt++) {
        shuffledMotif = shuffled(motif);
      }
      return { id: definition.id, type: "rhythm-sequencing", shuffledMotif, correctOrder: motif, onsetsMs, bpm: resolvedBpm };
    }
    case "rhythm-dictation": {
      const { bpm, sequence } = definition.spec;
      const meter = definition.spec.meter ?? "4/4";
      const beatsPerMeasure = meterQuarterNoteBeats(meter);
      const beatIntervalMs = (60 / bpm) * 1000;
      const slotTimesMs: number[] = [];
      const onsetsMs: number[] = [];
      let cumulativeMs = 0;
      for (const value of sequence) {
        slotTimesMs.push(cumulativeMs);
        if (isRestValue(value)) {
          cumulativeMs += RHYTHM_REST_VALUE_BEATS[value] * beatIntervalMs;
        } else {
          onsetsMs.push(cumulativeMs);
          cumulativeMs += RHYTHM_NOTE_VALUE_BEATS[value] * beatIntervalMs;
        }
      }
      return { id: definition.id, type: "rhythm-dictation", bpm, meter, beatsPerMeasure, sequence, slotTimesMs, onsetsMs };
    }
    case "rhythm-notation-tap": {
      const { bpm, meter, sequence } = definition.spec;
      const beatIntervalMs = (60 / bpm) * 1000;
      const beatsPerMeasure = meterQuarterNoteBeats(meter);
      const slotTimesMs: number[] = [];
      const requiredTapTimesMs: number[] = [];
      let cumulativeMs = 0;
      for (const value of sequence) {
        slotTimesMs.push(cumulativeMs);
        if (!isRestValue(value)) {
          requiredTapTimesMs.push(cumulativeMs);
          cumulativeMs += RHYTHM_NOTE_VALUE_BEATS[value] * beatIntervalMs;
        } else {
          cumulativeMs += RHYTHM_REST_VALUE_BEATS[value] * beatIntervalMs;
        }
      }
      return {
        id: definition.id,
        type: "rhythm-notation-tap",
        bpm,
        meter,
        beatsPerMeasure,
        sequence,
        slotTimesMs,
        requiredTapTimesMs,
      };
    }
    case "interval-name-choice": {
      const { allowedSemitones, noteRange, optionCount, hideNotation } = definition.spec;
      const [rangeLow, rangeHigh] = noteRange;
      return generateWithoutRepeat(() => {
        const [rootNote, otherNote] = pickRandomIntervalNotePair(
          [parseScientific(rangeLow), parseScientific(rangeHigh)],
          allowedSemitones
        );
        const semitones = intervalSemitones(rootNote, otherNote);
        return {
          id: definition.id,
          type: "interval-name-choice",
          notes: [formatScientific(rootNote), formatScientific(otherNote)] as [string, string],
          options: buildIntervalOptions(semitones, optionCount ?? allowedSemitones.length, locale, allowedSemitones),
          correctOptionId: String(semitones),
          hideNotation: hideNotation ?? false,
        };
      }, exclude);
    }
    case "interval-timed-test": {
      const { durationSeconds, noteRange, allowedSemitones, optionCount } = definition.spec;
      return {
        id: definition.id,
        type: "interval-timed-test",
        durationSeconds,
        noteRange,
        allowedSemitones: allowedSemitones ?? [...NAMED_INTERVAL_SEMITONES],
        optionCount: optionCount ?? DEFAULT_INTERVAL_OPTION_COUNT,
      };
    }
    case "triad-notes-choice": {
      const { fifthsRange } = definition.spec;
      return generateWithoutRepeat(() => {
        const fifths = randomFifthsInRange(fifthsRange);
        const roles: TriadRole[] = ["T", "S", "D"];
        const role = roles[Math.floor(Math.random() * roles.length)];
        const correctLabel = formatTriadNotes(getPrimaryTriad(fifths, role), locale);

        // Distractor pool: the *other two* primary triads of the same key (a
        // "wrong role" mistake) plus the same role built on a neighboring key
        // (a "right role, wrong key" mistake) — every pool member is
        // guaranteed distinct from the correct answer and from each other,
        // since each is either a different root (different role, same key)
        // or a different key (same role, different root).
        const distractorPool = new Set<string>();
        for (const otherRole of roles) {
          if (otherRole !== role) {
            distractorPool.add(formatTriadNotes(getPrimaryTriad(fifths, otherRole), locale));
          }
        }
        for (const neighborFifths of circleNeighborFifths(fifths)) {
          distractorPool.add(formatTriadNotes(getPrimaryTriad(neighborFifths, role), locale));
        }
        distractorPool.delete(correctLabel);

        const optionLabels = shuffled([correctLabel, ...sample(Array.from(distractorPool), 3)]);
        return {
          id: definition.id,
          type: "triad-notes-choice",
          fifths,
          role,
          options: optionLabels.map((label) => ({ id: label, label })),
          correctOptionId: correctLabel,
        };
      }, exclude);
    }
    case "triad-fact-choice": {
      // Authored content, not procedurally generated — options keep their
      // authored order (not shuffled), since the author picked specific,
      // deliberately-ordered distractors.
      const { prompt, hint, options, correctOptionIndex, explanation, notationNotes } = definition.spec;
      return {
        id: definition.id,
        type: "triad-fact-choice",
        prompt,
        hint,
        options: options.map((label, index) => ({ id: String(index), label })),
        correctOptionId: String(correctOptionIndex),
        explanation,
        notationNotes,
      };
    }
    case "triad-quality-choice": {
      const { noteRange, allowedQualities, hideNotation } = definition.spec;
      const qualities = allowedQualities ?? ALL_TRIAD_QUALITIES;
      return generateWithoutRepeat(() => {
        const quality = qualities[Math.floor(Math.random() * qualities.length)];

        // A root's default spelling can force a double accidental on the
        // third or fifth for some qualities (e.g. D#-diminished's fifth, or
        // B-augmented's fifth even though B itself is natural) — same
        // retry-with-the-flat-spelling fallback pickRandomIntervalNotePair
        // already relies on for a single interval, just applied to a
        // triad's two stacked thirds instead.
        const root = randomNoteInRange(noteRange);
        let triad: Triad;
        try {
          triad = buildTriad(root, quality);
        } catch {
          triad = buildTriad(flatAlternateSpelling(root), quality);
        }

        const notes: [string, string, string] = [formatScientific(triad.root), formatScientific(triad.third), formatScientific(triad.fifth)];
        const options = shuffled(qualities).map((candidateQuality) => ({
          id: candidateQuality,
          label: getTriadQualityName(candidateQuality, locale),
        }));
        return {
          id: definition.id,
          type: "triad-quality-choice",
          notes,
          hideNotation: hideNotation ?? false,
          options,
          correctOptionId: quality,
        };
      }, exclude);
    }
    case "triad-inversion-choice": {
      const { noteRange, allowedQualities, allowedInversions, hideNotation } = definition.spec;
      const qualities = allowedQualities ?? (["major", "minor"] as const);
      const inversions = allowedInversions ?? (["root", "first", "second"] as const);
      return generateWithoutRepeat(() => {
        const quality = qualities[Math.floor(Math.random() * qualities.length)];
        const inversion = inversions[Math.floor(Math.random() * inversions.length)];

        // Same double-accidental fallback as triad-quality-choice's own
        // case (see its own doc) — reused verbatim rather than re-derived.
        const root = randomNoteInRange(noteRange);
        let triad: Triad;
        try {
          triad = buildTriad(root, quality);
        } catch {
          triad = buildTriad(flatAlternateSpelling(root), quality);
        }

        const invertedNotes = getTriadInversionNotes(triad, inversion);
        const notes: [string, string, string] = [
          formatScientific(invertedNotes[0]),
          formatScientific(invertedNotes[1]),
          formatScientific(invertedNotes[2]),
        ];
        // Options are drawn from the same allowedInversions set the
        // correct answer itself is drawn from — a level that hasn't
        // introduced an inversion yet (e.g. Jaskinia Akordów's level 1,
        // sekstakord-only) must never offer it as a distractor either.
        const options = shuffled(inversions).map((candidateInversion) => ({
          id: candidateInversion,
          label: getTriadInversionName(candidateInversion, locale),
        }));
        return {
          id: definition.id,
          type: "triad-inversion-choice",
          notes,
          quality,
          qualityName: getTriadQualityName(quality, locale),
          inversion,
          hideNotation: hideNotation ?? false,
          options,
          correctOptionId: inversion,
        };
      }, exclude);
    }
    case "dominant-seventh-inversion-choice": {
      const { noteRange, allowedInversions, hideNotation } = definition.spec;
      const inversions = allowedInversions ?? (["root", "first", "second", "third"] as const);
      return generateWithoutRepeat(() => {
        const inversion = inversions[Math.floor(Math.random() * inversions.length)];

        // Same double-accidental fallback as triad-quality-choice's own
        // case (see its own doc) — reused verbatim rather than re-derived.
        const root = randomNoteInRange(noteRange);
        let chord: ReturnType<typeof buildDominantSeventh>;
        try {
          chord = buildDominantSeventh(root);
        } catch {
          chord = buildDominantSeventh(flatAlternateSpelling(root));
        }

        const invertedNotes = getSeventhChordInversionNotes(chord, inversion);
        const notes: [string, string, string, string] = [
          formatScientific(invertedNotes[0]),
          formatScientific(invertedNotes[1]),
          formatScientific(invertedNotes[2]),
          formatScientific(invertedNotes[3]),
        ];
        // Options are drawn from the same allowedInversions set the
        // correct answer itself is drawn from — see triad-inversion-
        // choice's own identical reasoning above.
        const options = shuffled(inversions).map((candidateInversion) => ({
          id: candidateInversion,
          label: getSeventhChordInversionName(candidateInversion, locale),
        }));
        return {
          id: definition.id,
          type: "dominant-seventh-inversion-choice",
          notes,
          inversion,
          hideNotation: hideNotation ?? false,
          options,
          correctOptionId: inversion,
        };
      }, exclude);
    }
    case "triad-role-choice": {
      const { fifthsRange, hideNotation } = definition.spec;
      return generateWithoutRepeat(() => {
        const fifths = randomFifthsInRange(fifthsRange);
        const roles: TriadRole[] = ["T", "S", "D"];
        const role = roles[Math.floor(Math.random() * roles.length)];

        const targetTriad = getPrimaryTriad(fifths, role);
        // Skipped when role is T itself — reference and target are then
        // literally the same chord, so there's no "order" to fix.
        const referenceTriad = role === "T" ? getPrimaryTriad(fifths, "T") : lowerTriadBelow(getPrimaryTriad(fifths, "T"), targetTriad);
        const toNotes = (triad: Triad): [string, string, string] => [
          formatScientific(triad.root),
          formatScientific(triad.third),
          formatScientific(triad.fifth),
        ];

        const options = shuffled(roles).map((candidateRole) => ({
          id: candidateRole,
          label: getTriadRoleName(candidateRole, locale),
        }));
        return {
          id: definition.id,
          type: "triad-role-choice",
          fifths,
          referenceNotes: toNotes(referenceTriad),
          targetNotes: toNotes(targetTriad),
          hideNotation: hideNotation ?? false,
          options,
          correctOptionId: role,
        };
      }, exclude);
    }
    case "circle-step-choice": {
      const { direction, fifthsRange } = definition.spec;
      return generateWithoutRepeat(() => {
        const resolvedDirection: CircleStepDirection = direction ?? (Math.random() < 0.5 ? "clockwise" : "counterclockwise");
        const step = resolvedDirection === "clockwise" ? 1 : -1;
        const [rangeLow, rangeHigh] = fifthsRange;
        const low = Math.max(rangeLow, MIN_FIFTHS);
        const high = Math.min(rangeHigh, MAX_FIFTHS);
        const candidates: number[] = [];
        for (let fifths = low; fifths <= high; fifths++) {
          if (fifths + step >= MIN_FIFTHS && fifths + step <= MAX_FIFTHS) {
            candidates.push(fifths);
          }
        }
        if (candidates.length === 0) {
          throw new Error(`circle-step-choice: no starting key in [${rangeLow}, ${rangeHigh}] has room for one more ${resolvedDirection} step`);
        }
        const startFifths = candidates[Math.floor(Math.random() * candidates.length)];
        return {
          id: definition.id,
          type: "circle-step-choice",
          startFifths,
          direction: resolvedDirection,
          correctFifths: startFifths + step,
        };
      }, exclude);
    }
    case "relative-key-choice": {
      const { promptMode, fifthsRange } = definition.spec;
      return generateWithoutRepeat(() => {
        const resolvedMode: TonalityMode = promptMode ?? (Math.random() < 0.5 ? "major" : "minor");
        const promptFifths = randomFifthsInRange(fifthsRange);
        return {
          id: definition.id,
          type: "relative-key-choice",
          promptFifths,
          promptMode: resolvedMode,
          correctFifths: promptFifths,
        };
      }, exclude);
    }
    case "key-fact-choice": {
      // Authored content, not procedurally generated — options keep their
      // authored order (not shuffled), since the author picked specific,
      // deliberately-ordered distractors.
      const { prompt, hint, options, correctOptionIndex, explanation } = definition.spec;
      return {
        id: definition.id,
        type: "key-fact-choice",
        prompt,
        hint,
        options: options.map((label, index) => ({ id: String(index), label })),
        correctOptionId: String(correctOptionIndex),
        explanation,
      };
    }
    case "key-signature-names-choice": {
      const { fifthsRange } = definition.spec;
      return generateWithoutRepeat(() => {
        const fifths = randomNonZeroFifthsInRange(fifthsRange);
        const optionFifths = shuffled([fifths, ...sample(accidentalNeighborFifths(fifths), 3)]);
        return {
          id: definition.id,
          type: "key-signature-names-choice",
          fifths,
          options: optionFifths.map((f) => ({ id: String(f), label: getKeySignatureAccidentalNames(f, locale).join(", ") })),
          correctOptionId: String(fifths),
        };
      }, exclude);
    }
    case "circle-neighbor-key-choice": {
      const { fifthsRange } = definition.spec;
      return generateWithoutRepeat(() => {
        const direction: "up" | "down" = Math.random() < 0.5 ? "up" : "down";
        const step = direction === "up" ? 1 : -1;
        const [rangeLow, rangeHigh] = fifthsRange;
        const low = Math.max(rangeLow, MIN_FIFTHS);
        const high = Math.min(rangeHigh, MAX_FIFTHS);
        const startCandidates: number[] = [];
        for (let candidate = low; candidate <= high; candidate++) {
          if (candidate + step >= MIN_FIFTHS && candidate + step <= MAX_FIFTHS) {
            startCandidates.push(candidate);
          }
        }
        if (startCandidates.length === 0) {
          throw new Error(`circle-neighbor-key-choice: no starting key in [${rangeLow}, ${rangeHigh}] has room for one more ${direction} step`);
        }
        const startFifths = startCandidates[Math.floor(Math.random() * startCandidates.length)];
        const correctFifths = startFifths + step;
        const optionFifths = shuffled([correctFifths, ...sample(circleNeighborFifths(correctFifths), 3)]);
        return {
          id: definition.id,
          type: "circle-neighbor-key-choice",
          startFifths,
          direction,
          correctFifths,
          options: optionFifths.map((f) => ({ id: String(f), label: getKeyDisplayName(getKeyAtFifths(f).majorTonic, "major", locale) })),
          correctOptionId: String(correctFifths),
        };
      }, exclude);
    }
    case "key-signature-staff-choice": {
      const { fifthsRange } = definition.spec;
      return generateWithoutRepeat(() => {
        const fifths = randomFifthsInRange(fifthsRange);
        const optionFifths = shuffled([fifths, ...sample(circleNeighborFifths(fifths), 3)]);
        return {
          id: definition.id,
          type: "key-signature-staff-choice",
          fifths,
          options: optionFifths.map((f) => {
            const { major, minor } = getKeyPairDisplayName(f, locale);
            return { id: String(f), label: `${major} / ${minor}` };
          }),
          correctOptionId: String(fifths),
        };
      }, exclude);
    }
    case "accidental-count-key-choice": {
      const { fifthsRange } = definition.spec;
      return generateWithoutRepeat(() => {
        const fifths = randomNonZeroFifthsInRange(fifthsRange);
        const accidentalType: "sharps" | "flats" = fifths > 0 ? "sharps" : "flats";
        const optionFifths = shuffled([fifths, ...sample(accidentalNeighborFifths(fifths), 3)]);
        return {
          id: definition.id,
          type: "accidental-count-key-choice",
          accidentalCount: Math.abs(fifths),
          accidentalType,
          correctFifths: fifths,
          options: optionFifths.map((f) => {
            const { major, minor } = getKeyPairDisplayName(f, locale);
            return { id: String(f), label: `${major} / ${minor}` };
          }),
          correctOptionId: String(fifths),
        };
      }, exclude);
    }
    case "interval-build-choice": {
      const { noteRange, allowedSemitones, allowDoubleAccidentals } = definition.spec;
      const pool = allowedSemitones ?? NAMED_INTERVAL_SEMITONES;
      return generateWithoutRepeat(() => {
        const semitones = pool[Math.floor(Math.random() * pool.length)];
        let root: Note;
        let target: Note;
        // A clicked key always plays through this app's finite pre-rendered
        // sample set (unlike the staff variant below, which never plays the
        // target note), so — only for this type — root/target selection is
        // constrained to noteRange itself via pickRandomIntervalNotePair's
        // own candidate filtering, keeping the padded keyboardRange safely
        // inside sample coverage. allowDoubleAccidentals is never set by
        // this world's own content for this type, but the branch is kept
        // for type completeness with interval-build-staff-choice.
        if (allowDoubleAccidentals) {
          const built = buildIntervalRootTarget(noteRange, semitones, Math.random() < 0.5 ? 1 : -1, true);
          root = built.root;
          target = built.target;
        } else {
          const [rootNote, targetNote] = pickRandomIntervalNotePair(
            [parseScientific(noteRange[0]), parseScientific(noteRange[1])],
            [semitones]
          );
          root = rootNote;
          target = targetNote;
        }
        const direction: "up" | "down" = noteToMidi(target) >= noteToMidi(root) ? "up" : "down";
        return {
          id: definition.id,
          type: "interval-build-choice",
          rootNote: formatScientific(root),
          rootDisplayName: getNoteDisplayName(root, locale),
          intervalName: getIntervalDisplayName(semitones, locale),
          direction,
          targetNote: formatScientific(target),
          keyboardRange: paddedKeyboardRange(root, target),
        };
      }, exclude);
    }
    case "interval-build-staff-choice": {
      const { noteRange, allowedSemitones, allowDoubleAccidentals } = definition.spec;
      const pool = allowedSemitones ?? NAMED_INTERVAL_SEMITONES;
      return generateWithoutRepeat(() => {
        const semitones = pool[Math.floor(Math.random() * pool.length)];
        const direction: 1 | -1 = Math.random() < 0.5 ? 1 : -1;
        const { root, target } = buildIntervalRootTarget(noteRange, semitones, direction, allowDoubleAccidentals ?? false);
        const rootPosition = describeStaffPosition(root);
        const targetPosition = describeStaffPosition(target);
        return {
          id: definition.id,
          type: "interval-build-staff-choice",
          rootNote: formatScientific(root),
          rootDisplayName: getNoteDisplayName(root, locale),
          intervalName: getIntervalDisplayName(semitones, locale),
          direction: direction === 1 ? "up" : "down",
          targetStep: targetPosition.step,
          targetAccidental: target.accidental,
          targetDisplayName: getNoteDisplayNameAllowingDoubleAccidental(target, locale),
          allowDoubleAccidentals: allowDoubleAccidentals ?? false,
          clickableSteps: paddedClickableSteps([rootPosition.step, targetPosition.step]),
        };
      }, exclude);
    }
    case "triad-build-staff-choice": {
      const { noteRange, allowedQualities } = definition.spec;
      const qualities = allowedQualities ?? ALL_TRIAD_QUALITIES;
      return generateWithoutRepeat(() => {
        const quality = qualities[Math.floor(Math.random() * qualities.length)];
        const root = randomNoteInRange(noteRange);
        let triad: Triad;
        try {
          triad = buildTriad(root, quality);
        } catch {
          triad = buildTriad(flatAlternateSpelling(root), quality);
        }
        const rootPosition = describeStaffPosition(triad.root);
        const thirdPosition = describeStaffPosition(triad.third);
        const fifthPosition = describeStaffPosition(triad.fifth);
        return {
          id: definition.id,
          type: "triad-build-staff-choice",
          rootNote: formatScientific(triad.root),
          rootDisplayName: getNoteDisplayName(triad.root, locale),
          qualityName: getTriadQualityName(quality, locale),
          quality,
          thirdStep: thirdPosition.step,
          thirdAccidental: triad.third.accidental,
          thirdDisplayName: getNoteDisplayName(triad.third, locale),
          fifthStep: fifthPosition.step,
          fifthAccidental: triad.fifth.accidental,
          fifthDisplayName: getNoteDisplayName(triad.fifth, locale),
          allowDoubleAccidentals: false,
          clickableSteps: paddedClickableSteps([rootPosition.step, thirdPosition.step, fifthPosition.step]),
        };
      }, exclude);
    }
    case "beam-grouping-choice": {
      const { sequence, meter, barBeforeIndex, options, correctOptionIndex } = definition.spec;
      // Unlike rhythm-math-choice, correctness here isn't derivable from a
      // formula — it's authored — so the shuffled correct option has to be
      // relocated by reference (shuffled() only reorders, never clones its
      // elements), not by re-deriving which one is "right".
      const correctOption = options[correctOptionIndex];
      const shuffledOptions = shuffled(options);
      return {
        id: definition.id,
        type: "beam-grouping-choice",
        sequence,
        meter,
        barBeforeIndex,
        options: shuffledOptions,
        correctOptionIndex: shuffledOptions.indexOf(correctOption),
      };
    }
    case "rhythm-math-choice": {
      const { combinations } = definition.spec;
      const shuffledCombinations = shuffled(combinations);
      const correctCombinationIndex = shuffledCombinations.findIndex((combination) => combinationBeats(combination) === 4);
      if (correctCombinationIndex === -1) {
        throw new Error("rhythm-math-choice requires exactly one combination summing to 4 beats");
      }
      return {
        id: definition.id,
        type: "rhythm-math-choice",
        combinations: shuffledCombinations,
        correctCombinationIndex,
      };
    }
    case "rhythm-value-dictation": {
      const { bpm, meter, allowedValues, sequence } = definition.spec;
      const beatIntervalMs = (60 / bpm) * 1000;
      const slotTimesMs: number[] = [];
      const onsetsMs: number[] = [];
      let cumulativeMs = 0;
      for (const value of sequence) {
        slotTimesMs.push(cumulativeMs);
        if (isRestValue(value)) {
          cumulativeMs += RHYTHM_REST_VALUE_BEATS[value as RhythmRestValue] * beatIntervalMs;
        } else {
          onsetsMs.push(cumulativeMs);
          cumulativeMs += RHYTHM_NOTE_VALUE_BEATS[value as RhythmNoteValue] * beatIntervalMs;
        }
      }
      const beatsPerMeasure = meterQuarterNoteBeats(meter);
      return { id: definition.id, type: "rhythm-value-dictation", bpm, meter, beatsPerMeasure, allowedValues, sequence, slotTimesMs, onsetsMs };
    }
    case "melodic-rhythmic-dictation": {
      const { bpm, key, meter, allowedValues, notes: specNotes } = definition.spec;
      const beatIntervalMs = (60 / bpm) * 1000;
      let cumulativeMs = 0;
      const onsetsMs: number[] = [];
      const durationsMs: number[] = [];
      const notes = specNotes.map(({ pitch, value }) => {
        const note = parseScientific(pitch);
        const position = describeStaffPosition(note);
        const durationMs = RHYTHM_NOTE_VALUE_BEATS[value] * beatIntervalMs;
        onsetsMs.push(cumulativeMs);
        durationsMs.push(durationMs);
        cumulativeMs += durationMs;
        return { pitch, step: position.step, accidental: note.accidental, value };
      });
      return { id: definition.id, type: "melodic-rhythmic-dictation", bpm, key, meter, allowedValues, notes, onsetsMs, durationsMs };
    }
    case "solfege-note-singing": {
      const { noteRange, toleranceCents } = definition.spec;
      const allNotes = diatonicNotesInRange(noteRange);
      // A student singing the same note twice in one lesson attempt isn't
      // a near-miss to tolerate the way generateWithoutRepeat's retry-
      // based dedup is for other types (see its own doc) — guaranteed
      // here, not just made unlikely: filters the candidate pool down to
      // notes not yet used THIS attempt before picking, rather than
      // picking first and re-rolling on collision. Content authors keep
      // each lesson's exercise count at or under its noteRange's own
      // distinct-note count (see data/lessons/zaczarowany-solfez.ts's own
      // doc) so this pool is never actually exhausted in practice — if it
      // ever were, every candidate would necessarily already be used this
      // attempt, making a repeat unavoidable regardless of strategy.
      const unusedNotes = exclude ? allNotes.filter((note) => !exclude.has(`solfege-note-singing:${formatScientific(note)}`)) : allNotes;
      const pool = unusedNotes.length > 0 ? unusedNotes : allNotes;
      const note = pool[Math.floor(Math.random() * pool.length)];
      return {
        id: definition.id,
        type: "solfege-note-singing",
        targetNote: formatScientific(note),
        solfegeSyllable: getSolfegeSyllable(note.letter, locale),
        toleranceCents: toleranceCents ?? DEFAULT_SOLFEGE_TOLERANCE_CENTS,
      };
    }
    case "solfege-phrase-singing": {
      // Fixed, authored content (the notes themselves come straight from
      // the spec, not rolled) — no randomness here, so unlike solfege-
      // note-singing there's nothing to exclude/re-roll.
      const { notes, rhythm, meter, isFragment, gradeRhythm, bpm, toleranceCents } = definition.spec;
      return {
        id: definition.id,
        type: "solfege-phrase-singing",
        notes,
        solfegeSyllables: notes.map((note) => getSolfegeSyllable(parseScientific(note).letter, locale)),
        rhythm,
        meter,
        isFragment,
        gradeRhythm,
        bpm: gradeRhythm ? bpm ?? DEFAULT_SOLFEGE_RHYTHM_BPM : bpm,
        toleranceCents: toleranceCents ?? DEFAULT_SOLFEGE_TOLERANCE_CENTS,
      };
    }
  }
}
