import type { Clef } from "@/lib/music/staff";
import type { TriadInversion, TriadQuality, TriadRole } from "@/lib/music/triads";
import type { SeventhChordInversion } from "@/lib/music/seventhChords";
import type { Accidental } from "@/lib/music/notes";

export type { Clef, TriadInversion, TriadQuality, TriadRole, SeventhChordInversion };

export type IntervalMotion = "step" | "leap";
export type MelodyDirection = "up" | "down" | "same";
export type TonalityMode = "major" | "minor";
export type CircleStepDirection = "clockwise" | "counterclockwise";

/** Time signatures Miasto Rytmu's content actually uses ("4/4"/"3/4") plus
 * the rest of the web app's own Meter union, kept for type fidelity even
 * though nothing here authors the others yet. */
export type Meter = "2/4" | "3/4" | "4/4" | "2/2" | "3/8" | "5/8" | "6/8" | "7/8" | "9/8" | "12/8" | "5/4" | "7/4";

/** dottedQuarter/dottedHalf/dottedEighth/eighthTriplet added for "Gaj
 * Grupowania" (beam-grouping-choice/rhythm-math-choice content) — every
 * earlier world's content only ever used the first five. */
export type RhythmNoteValue =
  | "whole"
  | "half"
  | "quarter"
  | "dottedQuarter"
  | "dottedHalf"
  | "eighth"
  | "dottedEighth"
  | "sixteenth"
  | "eighthTriplet";
/** sixteenthRest added for "Gaj Grupowania" (a rest can sit inside a
 * beamed group without breaking the beam — see BeamedNotation's own doc). */
export type RhythmRestValue = "quarterRest" | "eighthRest" | "sixteenthRest";

export interface MultipleChoiceOption {
  id: string;
  label: string;
  /** Optional illustration key (see key-fact-choice's own optionImageIds). */
  imageId?: string;
}

/** A drawn point in the SAME coordinate space as lib/music/staffGeometry's
 * VIEW_WIDTH/VIEW_HEIGHT — a path means the same thing regardless of the
 * board's actual rendered pixel size (see lib/questions/clefTrace.ts's own
 * doc). `newStroke` marks the first point of a new pen-down (e.g. the bass
 * clef's second dot), so the renderer starts a fresh path segment instead
 * of joining it to the previous stroke with a spurious line. */
export interface TracePoint {
  x: number;
  y: number;
  newStroke?: boolean;
}

/**
 * Author-facing spec for each of the 9 Wioska Nut exercise types — this is
 * what a lesson's content JSON actually contains per exercise, BEFORE
 * lib/questions/generate.ts resolves it into the richer GeneratedExercise
 * shape a player answers against (some fields, like a multiple-choice
 * exercise's shuffled option list, only exist post-generation since they
 * involve randomness that must be re-rolled per attempt, not baked into
 * authored content).
 */
export type ExerciseSpec =
  | { type: "clef-trace"; clef: Clef }
  | { type: "interval-distance-choice"; notes: [string, string] }
  | { type: "line-or-space-choice"; targetNote: string }
  | { type: "melody-direction-choice"; notes: string[]; correctDirection: MelodyDirection }
  | {
      type: "multiple-choice-notation";
      targetNote: string;
      distractorPool: string[];
      optionCount?: number;
      clef?: Clef;
    }
  | { type: "note-sequencing"; notes: string[]; clef?: Clef }
  | { type: "note-word-spelling"; notes: string[]; clef?: Clef }
  | { type: "pitch-height-choice"; targetNote: string; correctSide: "high" | "low" }
  | { type: "staff-placement"; targetStep: number }
  // Miasto Rytmu (rhythm world) — see data/lessons/miasto-rytmu.ts's own doc.
  | {
      type: "pulse-tap";
      bpm: number;
      beatsPerMeasure: number;
      measureCount: number;
      accentOnly?: boolean;
      minHits?: number;
      /** Extra beats played (and pulsed on screen) BEFORE the graded
       * ones start, so the player hears the tempo settle in before
       * tapping is actually scored — a count-in, same idea as a real
       * band leader counting "1, 2, 3, 4" before the song starts.
       * Defaults to one full measure (`beatsPerMeasure`) when omitted.
       * A tap made during the lead-in is simply never near enough to any
       * requiredTapTimesMs entry to match, so no separate "too early,
       * don't count it yet" state is needed anywhere downstream. */
      leadInBeats?: number;
    }
  | {
      type: "meter-choice";
      correctMeter: Meter;
      bpm?: number;
      optionPool?: Meter[];
      /** A real recorded drum loop (require()'d from lib/audio/samples.ts,
       * e.g. DRUMMER_3_4_SAMPLE) to play instead of the synthesized
       * playDanceFragment accompaniment — used for a handful of "real
       * recording" meter-choice exercises alongside the plain synthesized
       * ones, so the player also practices telling a meter apart in an
       * actual song, not just a procedural click pattern. */
      referenceAudioSource?: number;
    }
  | {
      type: "rhythm-echo";
      onsetsMs: number[];
      /** A real recorded rhythm (require()'d from lib/audio/samples.ts's
       * own RHYTHM_ECHO_RECORDING_SAMPLES) to play instead of the
       * synthesized playMetronomeWithClaps demo — same
       * meter-choice-established pattern as ExerciseSpec's own
       * meter-choice.referenceAudioSource. */
      referenceAudioSource?: number;
      /** Whether the independent standalone-metronome dot
       * (MetronomeIndicator) shows at all — defaults to true (every
       * rhythm-echo exercise had it up to now). Miasto Rytmu lekcja 2
       * (data/lessons/miasto-rytmu.ts) sets this false: with the 🔊
       * button's own click track doing the "steady beat" job, the extra
       * standalone toggle next to it was redundant for that lesson. */
      showStandaloneMetronome?: boolean;
    }
  | {
      type: "rhythm-sequencing";
      motif: RhythmNoteValue[];
      bpm?: number;
      /** See rhythm-echo's own showStandaloneMetronome doc just above —
       * same field, same default. */
      showStandaloneMetronome?: boolean;
      /** See rhythm-echo's own referenceAudioSource doc just above — same
       * pattern, RHYTHM_SEQUENCING_RECORDING_SAMPLES instead. */
      referenceAudioSource?: number;
    }
  | {
      type: "rhythm-dictation";
      bpm: number;
      meter?: Meter;
      sequence: (RhythmNoteValue | RhythmRestValue)[];
      /** A real recorded performance of this exact sequence to play
       * instead of the synthesized playMetronomeWithClaps demo — same
       * pattern as rhythm-echo's own referenceAudioSource, but here it's
       * PURELY illustrative: onsetsMs (the grading ground truth) is still
       * derived straight from `sequence`/`bpm`, never from the recording,
       * and the notation is shown on screen regardless — a mismatch
       * between the recording's own exact timing and onsetsMs can't
       * break "zastukaj to samo" the way it did for rhythm-echo, since
       * the player always has the notation (not just their ear) to tap
       * against. */
      referenceAudioSource?: number;
    }
  | {
      type: "rhythm-notation-tap";
      bpm: number;
      meter: Meter;
      sequence: (RhythmNoteValue | RhythmRestValue)[];
      /** See rhythm-dictation's own referenceAudioSource doc — same
       * purely-illustrative pattern, requiredTapTimesMs (not the
       * recording) stays what tapping is actually graded against. */
      referenceAudioSource?: number;
    }
  // Pasmo Interwałów (intervals world) — see data/lessons/pasmo-interwalow.ts's own doc.
  | {
      type: "interval-name-choice";
      allowedSemitones: number[];
      noteRange: [string, string];
      optionCount?: number;
      hideNotation?: boolean;
      /** Both notes sound at once (playHarmonicInterval) instead of one
       * after another (playInterval) — a genuinely different ear-training
       * skill (recognizing a "dwudźwięk"/dyad by its combined sound, not
       * by comparing two heard-in-turn pitches), so always paired with
       * hideNotation: true in practice — see this world's own lekcja 15
       * doc for why. */
      harmonic?: boolean;
    }
  | {
      type: "interval-timed-test";
      durationSeconds: number;
      noteRange: [string, string];
      allowedSemitones?: number[];
      optionCount?: number;
    }
  | {
      /** Plays `sequenceLength` intervals back to back (a fresh random
       * pair each, independently drawn — not a "same pair, different
       * order" trick) and asks for EVERY one's name at once, one picker
       * per position ("1.", "2.", (3.)) — harder than interval-name-
       * choice's own single pair because the earlier interval(s) have to
       * stay held in memory while listening to the next. */
      type: "interval-sequence-choice";
      sequenceLength: 2 | 3;
      allowedSemitones: number[];
      noteRange: [string, string];
      optionCount?: number;
      /** See interval-name-choice's own `harmonic` doc — same meaning,
       * applied to every pair in the sequence: each one sounds as a
       * simultaneous dyad, but the sequence's own positions still play
       * one after another (only within a single pair is anything
       * simultaneous). */
      harmonic?: boolean;
    }
  // Zatoka Trójdźwięków (triads world) — see data/lessons/zatoka-trojdzwiekow.ts's own doc.
  | { type: "triad-notes-choice"; fifthsRange: [number, number] }
  | {
      type: "triad-fact-choice";
      prompt: string;
      hint?: string;
      options: string[];
      correctOptionIndex: number;
      explanation?: string;
      notationNotes?: [string, string, string];
    }
  | {
      type: "triad-quality-choice";
      noteRange: [string, string];
      allowedQualities?: TriadQuality[];
      hideNotation?: boolean;
      /** Plays the triad's three notes one after another (a "trójdźwięk
       * rozłożony"/broken chord, playArpeggiatedTriad) instead of all at
       * once (playChord's own default). Same idea as interval-name-
       * choice's own `harmonic` flag, but in the opposite direction — this
       * world's default playback is already simultaneous, so this is the
       * new, ADDED mode rather than harmonic's own addition to a
       * melodic-by-default world. */
      arpeggiated?: boolean;
    }
  | { type: "triad-role-choice"; fifthsRange: [number, number]; hideNotation?: boolean }
  | {
      /** Plays `sequenceLength` triads back to back (a fresh random
       * root+quality each, independently drawn) and asks for EVERY one's
       * quality at once, one picker per position — the triad's own
       * "interval-sequence-choice": each triad still sounds as a normal
       * simultaneous chord (playChordSequence, same as triad-quality-
       * choice's own playChord), only the POSITIONS in the sequence play
       * one after another. Harder than triad-quality-choice's own single
       * chord because earlier triad(s) have to stay held in memory. */
      type: "triad-quality-sequence-choice";
      sequenceLength: 2 | 3;
      noteRange: [string, string];
      allowedQualities?: TriadQuality[];
    }
  // Jaskinia Akordów (triad inversions world) — see data/lessons/jaskinia-akordow.ts's own doc.
  | {
      type: "triad-inversion-choice";
      noteRange: [string, string];
      allowedQualities?: TriadQuality[];
      allowedInversions?: TriadInversion[];
      hideNotation?: boolean;
    }
  | {
      /** triad-inversion-choice's own "interval-sequence-choice" /
       * triad-quality-sequence-choice sibling — `sequenceLength` triads
       * play back to back (a fresh random root+quality+INVERSION each),
       * and the player names EVERY one's inversion, one picker per
       * position. Same playChordSequence shape as triad-quality-
       * sequence-choice (each triad still a normal simultaneous chord,
       * only the positions are staggered). */
      type: "triad-inversion-sequence-choice";
      sequenceLength: 2 | 3;
      noteRange: [string, string];
      allowedQualities?: TriadQuality[];
      allowedInversions?: TriadInversion[];
    }
  // Cytadela Dominant (dominant seventh chord world) — see data/lessons/cytadela-dominant.ts's own doc.
  | {
      type: "dominant-seventh-inversion-choice";
      noteRange: [string, string];
      allowedInversions?: SeventhChordInversion[];
      hideNotation?: boolean;
    }
  | {
      /** dominant-seventh-inversion-choice's own triad-inversion-sequence-
       * choice sibling — `sequenceLength` dominant sevenths play back to
       * back (a fresh random root+INVERSION each), and the player names
       * EVERY one's inversion, one picker per position. Same
       * playChordSequence shape (each chord still a normal simultaneous
       * 4-note chord, only the positions are staggered). */
      type: "dominant-seventh-inversion-sequence-choice";
      sequenceLength: 2 | 3;
      noteRange: [string, string];
      allowedInversions?: SeventhChordInversion[];
    }
  // Labirynt Tonacji (circle-of-fifths world) — see data/lessons/labirynt-tonacji.ts's own doc.
  | { type: "circle-step-choice"; direction?: CircleStepDirection; fifthsRange: [number, number] }
  | { type: "relative-key-choice"; promptMode?: TonalityMode; fifthsRange: [number, number] }
  | {
      type: "key-fact-choice";
      prompt: string;
      hint?: string;
      options: string[];
      correctOptionIndex: number;
      explanation?: string;
      /** Königreich-der-Instrumente additions (all optional, so Labirynt
       * Tonacji's own questions are unaffected): an illustration shown
       * above the prompt (a key of components/icons/icons.ts's ICONS, e.g.
       * "instrument_flet"), per-option illustrations (parallel to
       * `options`; omit an entry or the whole array for text-only
       * options), and a recording the 🔊 button plays (same convention as
       * the rhythm types' own referenceAudioSource). */
      imageId?: string;
      optionImageIds?: (string | undefined)[];
      referenceAudioSource?: number;
      /** "Quiz ABCD": exactly four options, shown lettered A) B) C) D) with
       * the prompt prefixed "Quiz ABCD:" (see generateExercise's own case). */
      abcd?: boolean;
    }
  | { type: "key-signature-names-choice"; fifthsRange: [number, number] }
  | { type: "circle-neighbor-key-choice"; fifthsRange: [number, number] }
  | { type: "key-signature-staff-choice"; fifthsRange: [number, number] }
  | { type: "accidental-count-key-choice"; fifthsRange: [number, number] }
  // Fabryka Budowania (interval/triad building world) — see data/lessons/fabryka-budowania.ts's own doc.
  | { type: "interval-build-choice"; noteRange: [string, string]; allowedSemitones?: number[]; allowDoubleAccidentals?: boolean }
  | { type: "interval-build-staff-choice"; noteRange: [string, string]; allowedSemitones?: number[]; allowDoubleAccidentals?: boolean }
  | { type: "triad-build-staff-choice"; noteRange: [string, string]; allowedQualities?: TriadQuality[] }
  | {
      /** triad-build-staff-choice's own inversion-aware sibling — the
       * BASS note (whichever chord tone the target inversion puts on
       * bottom, not always the root) is drawn fixed, and the player
       * builds the other two in their correct stacked order. Same
       * two-column TriadBuildStaffBoard UI, just fed a fixed note and
       * two target columns that aren't always "root's own third/fifth". */
      type: "triad-inversion-build-staff-choice";
      noteRange: [string, string];
      allowedQualities?: TriadQuality[];
      allowedInversions?: TriadInversion[];
    }
  | {
      /** The four-note, three-build-column counterpart of triad-build-
       * staff-choice/triad-inversion-build-staff-choice — builds a
       * dominant seventh chord (always root position when
       * allowedInversions is omitted, any of its four postacie
       * otherwise), one column per chord tone above the fixed bass. */
      type: "dominant-seventh-build-staff-choice";
      noteRange: [string, string];
      allowedInversions?: SeventhChordInversion[];
      allowDoubleAccidentals?: boolean;
    }
  // Gaj Grupowania (beaming/grouping world) — see data/lessons/gaj-grupowania.ts's own doc.
  | {
      type: "beam-grouping-choice";
      sequence: (RhythmNoteValue | RhythmRestValue)[];
      meter: Meter;
      barBeforeIndex?: number;
      options: { groups: number[][]; ties?: [number, number][] }[];
      correctOptionIndex: number;
    }
  | { type: "rhythm-math-choice"; combinations: RhythmNoteValue[][] }
  // Szczyt Dyktand (dictation summit world) — see data/lessons/szczyt-dyktand.ts's own doc.
  | {
      type: "rhythm-value-dictation";
      bpm: number;
      meter: Meter;
      allowedValues: (RhythmNoteValue | RhythmRestValue)[];
      sequence: (RhythmNoteValue | RhythmRestValue)[];
    }
  | {
      type: "melodic-rhythmic-dictation";
      bpm: number;
      /** Fifths count, lib/music/keys.ts convention (0 = no signature). */
      key: number;
      meter: Meter;
      allowedValues: RhythmNoteValue[];
      notes: { pitch: string; value: RhythmNoteValue }[];
    }
  // Zaczarowany Solfeż (sight-singing world) — see data/lessons/zaczarowany-solfez.ts's own doc.
  | {
      type: "solfege-note-singing";
      /** Natural (accidental-less) notes only — diatonicNotesInRange
       * in lib/questions/generate.ts filters to these regardless of what
       * chromatic notes would otherwise fall in the range. */
      noteRange: [string, string];
      /** How close (in cents, on the octave-folded pitch-class circle —
       * see lib/music/notes.ts's own octaveFoldedCentsDifference) a sung
       * pitch must land to count as correct. Defaults to a generous
       * beginner tolerance when omitted — see generate.ts's own
       * DEFAULT_SOLFEGE_TOLERANCE_CENTS. */
      toleranceCents?: number;
    }
  | {
      type: "solfege-syllable-choice";
      /** Natural notes (scientific names, e.g. "C4") the heard note(s) are
       * drawn from — the answer buttons are the DISTINCT solfège syllables
       * of this pool, in pitch order, so a lesson widens its own choice
       * (do/sol → do/re/mi → …) just by widening this list. C4 and C5
       * both read "do", so a pool spanning an octave shows that button
       * once. Same natural-notes-only constraint as the singing types. */
      notePool: string[];
      /** How many notes are heard in a row (default 1) — the player picks
       * one syllable per heard note, in order. Adjacent notes always
       * differ (see generateExercise's own case). */
      length?: number;
    }
  | {
      type: "solfege-phrase-singing";
      /** Fixed, authored sequence (e.g. the whole C4-C5 scale) — not
       * randomly generated the way solfege-note-singing's single note is,
       * so unlike that type this carries the actual notes rather than a
       * range to pick from. */
      notes: string[];
      /** Optional rhythm notation, same length/order as `notes` — when
       * present, the fragment renders as real rhythmic notation (stems,
       * beams, note values) via MelodicDictationStaff instead of the
       * plain equal-spaced noteheads LessonIntroStaff draws when omitted.
       * Display-only UNLESS `gradeRhythm` is also true (see that field's
       * own doc) — level 2/3's own fragments carry `rhythm` purely so a
       * fragment looks/sounds like a real piece while still being judged
       * on pitch alone, sung at the player's own free pace; level 4's own
       * fragments carry the SAME field but additionally get graded on
       * whether each note was actually held for roughly its own value's
       * length. Zaczarowany Solfeż level 2's own "fragmenty utworów"
       * content is the first user of this; level 1's own plain scale-drill
       * exercise omits it. */
      rhythm?: RhythmNoteValue[];
      /** Time signature for `rhythm`'s own beam grouping — meaningless
       * without `rhythm`; defaults to "4/4" when `rhythm` is present but
       * this is omitted. */
      meter?: Meter;
      /** True for a short excerpt (level 2/3/4's own "fragmenty utworów"),
       * false/omitted for the genuine whole scale (level 1's own trailing
       * exercise) — picks which prompt wording
       * SolfegePhraseSingingExercise.tsx shows: "Zaśpiewaj kolejno całą
       * gamę: ..." only actually describes the whole eight-note scale, so
       * a shorter fragment gets the generic "Zaśpiewaj po kolei zaznaczone
       * nuty" instead (see lesson.solfegePhraseSingFragmentPrompt). */
      isFragment?: boolean;
      /** Zaczarowany Solfeż level 4's own escalation: when true, grading
       * checks BOTH pitch AND whether each note was held for roughly its
       * own RELATIVE rhythmic length compared to the phrase's other notes
       * (a half note about twice as long as a neighboring quarter) — see
       * lib/audio/pitchDetection.ts's own analyzeFreeRhythmicPhrase and
       * AnswerInput's own rhythmCorrect field. Recording itself is
       * UNCHANGED from every other level — still free-tempo, still the
       * same live per-note highlight/coaching (see
       * SolfegePhraseSingingExercise.tsx's own doc) — there is
       * deliberately no metronome anywhere in this world; only the FINAL
       * grading step gains a rhythm dimension. Requires `rhythm` to
       * actually mean anything (still technically optional at the type
       * level; content omitting it would just fall back to plain quarter
       * notes, making every note equally "correct" length). */
      gradeRhythm?: boolean;
      /** "Nagranie, potem metronom" mode (Zaczarowany Solfeż's short-melody
       * levels): 🔊 plays the phrase WITH its real rhythm at `bpm`, then a
       * take is sung against nothing but the count-in + metronome click.
       * Grading stays pitch-only unless `gradeRhythm` is also set — this
       * only adds the pacing click (and the rhythmic playback), see
       * SolfegePhraseSingingExercise.tsx's own doc. Needs `rhythm`. */
      withMetronome?: boolean;
      /** Like `withMetronome`, but with NO recording at all (Zaczarowany
       * Solfeż levels 12-14): the microphone is never used or asked
       * for. "Śpiewaj z metronomem" plays the count-in + click track while
       * the staff highlight walks through the notes in time, the player
       * sings along on their own, and the exercise counts as done when the
       * phrase ends (a selfReported answer — nothing to grade). */
      metronomeOnly?: boolean;
      /** Where the phrase comes from, shown under the prompt (e.g. a
       * fragment of a named tune, or "własne ćwiczenie") — plain Polish
       * display text authored with the content. */
      sourceLabel?: string;
      /** Optional real recording of the phrase (a bundled audio file, same
       * convention as the rhythm types' own referenceAudioSource) — played
       * by 🔊 instead of the synthesized piano phrase when set (and not in
       * slow mode, since slowing a recording would shift its pitch). */
      referenceAudioSource?: number;
      /** Metronome tempo, beats per minute, ONE beat = one quarter note's
       * length (so a half note is two beats, an eighth is half a beat) —
       * only meaningful when `gradeRhythm` is true, played as an audible
       * count-in + pacing click throughout the take by
       * SolfegePhraseSingingExercise.tsx. This is PURELY a pacing aid for
       * the singer's ear: analyzeFreeRhythmicPhrase's own grading never
       * reads this value or assumes any absolute clock — it derives the
       * expected tempo entirely from the take's own sung durations (see
       * that function's own doc for why: an earlier metronome-driven
       * absolute-time grading design was built and removed twice for
       * fragility around recorder/metronome start latency). Defaults to
       * generate.ts's own DEFAULT_SOLFEGE_RHYTHM_BPM when gradeRhythm is
       * true and this is omitted. */
      bpm?: number;
      toleranceCents?: number;
    };

export type ExerciseType = ExerciseSpec["type"];

export interface ExerciseDefinition {
  id: string;
  type: ExerciseType;
  difficulty: number;
  spec: ExerciseSpec;
}

/** One theory "card" in a lesson's introSlides — a short rule explanation,
 * optionally illustrated with one altered note on the staff and a list of
 * "before → after" examples. A deliberately narrower slice of the web
 * app's own LessonTheoryIntro slide shape (no keyboardHighlight/
 * chromaticKeyboardReference/intervalExamples/etc.) — this port has no
 * piano-keyboard component yet, so only the pieces a staff + text can
 * express are carried over. */
export interface LessonTheorySlide {
  body: string;
  staffNote?: string;
  staffClef?: Clef;
  examples?: { from: string; to: string; note?: string }[];
  /** A row of note/rest value glyphs with captions (e.g. "ćwierćnuta — 1
   * uderzenie") — Miasto Rytmu's own intro slides use this instead of
   * staffNote/examples. */
  noteValueReference?: { value: RhythmNoteValue | RhythmRestValue; caption: string }[];
  /** Pasmo Interwałów's own intro-slide illustration: a labeled staff
   * example per interval, played on tap — see LessonTheoryIntro's own
   * intervalExamples render branch. */
  intervalExamples?: { notes: [string, string]; label: string }[];
  /** One "posłuchaj przykładu" button per entry, each playing a real
   * recorded reference track (not a synthesized sample) — `source` is a
   * require()'d audio module id from lib/audio/samples.ts (e.g.
   * DRUMMER_2_4_SAMPLE), passed straight through from content since
   * generate.ts never touches introSlides. An array (not a single entry)
   * so a slide comparing several meters — e.g. Przystań Taktów's own 2/4
   * vs 3/4 vs 4/4 — can offer one real-audio example per meter. */
  referenceAudio?: { source: number; label: string }[];
  /** Zatoka Trójdźwięków's own intro-slide illustration: a labeled staff
   * chord example per entry, played on tap — see LessonTheoryIntro's own
   * triadExamples render branch. `notes` is bottom-to-top and any length —
   * 3 for a triad, 4 for Cytadela Dominant's own dominant seventh chord.
   * `degrees` (optional — Jaskinia Akordów's and Cytadela Dominant's own
   * usage, showing 1/3/5(/7) next to each notehead so an inversion's
   * reordering is visible at a glance) labels each note in `notes`'
   * bottom-to-top order with its scale-degree role. For a triad, root
   * position is [1,3,5], sekstakord (I przewrót) [3,5,1], kwartsekstakord
   * (II przewrót) [5,1,3]. For a dominant seventh chord, root position is
   * [1,3,5,7], kwintsekstakord [3,5,7,1], tercekwartakord [5,7,1,3],
   * sekundakord [7,1,3,5]. */
  triadExamples?: { notes: string[]; label: string; degrees?: number[] }[];
  /** Zaczarowany Solfeż's own intro-slide illustration: one single-note
   * staff example per entry, each with its own "posłuchaj" button — lets
   * a lesson's intro slide offer every note of a phrase (e.g. the whole
   * do-re-mi-fa-sol-la-si-do scale) individually playable before the
   * player is asked to sing any of it — see IntroSlideCards.tsx's own
   * noteExamples render branch. `clef` defaults to treble (every existing
   * caller's own content is treble-only) — Wioska Nut's own "mieszanka
   * kluczy" lesson is the first to pass "bass" explicitly, one slide of
   * examples per clef, so the exact same note can be shown once each way. */
  noteExamples?: { note: string; label: string; clef?: Clef }[];
  /** Królestwo Instrumentów's own intro-slide illustration: one card per
   * instrument — its illustration (`imageId`, an `instrument_*` key of
   * components/icons/icons.ts), its name, an optional short `caption`
   * (e.g. "gra najwyżej"), and, when `audioSource` is set (a require()'d
   * module from lib/audio/instrumentSamples.ts), a 🔊 button playing a
   * real recording of that instrument. See IntroSlideCards.tsx's own
   * instrumentExamples render branch. */
  instrumentExamples?: { imageId: string; label: string; caption?: string; audioSource?: number }[];
  /** A connected multi-note staff (the SAME visual LessonIntroStaff already
   * draws for a whole lesson's own introNotes) embedded inside one slide —
   * for a lesson that needs this more than once (Wioska Nut's own
   * "mieszanka kluczy": the same scale shown once per clef), since a
   * lesson only ever gets ONE top-level introNotes/introClef pair. Reads
   * as one continuous run of notes ("cała gama po kolei"), unlike
   * noteExamples' own separate individually-playable cards. */
  staffSequence?: { notes: string[]; clef?: Clef };
  /** Labirynt Tonacji's own intro-slide illustration: a disabled, non-
   * interactive circle-of-fifths wheel with one sector highlighted — see
   * LessonTheoryIntro's own circleHighlight render branch. */
  circleHighlight?: { fifths: number; labelMode?: "both" | "majorOnly" | "minorOnly" };
  /** Fabryka Budowania's level-1 intro: a labeled full-keyboard + matching
   * staff-row legend (ChromaticKeyboardReference) showing every chromatic
   * step in `range` before the player is asked to count semitones
   * themselves. */
  chromaticKeyboardReference?: { range: [string, string] };
  /** Gaj Grupowania's own intro-slide illustration: one worked beamed-
   * notation example per entry, rendered via BeamedNotation — see that
   * component's own doc for what `groups`/`ties`/`barBeforeIndex` mean. */
  groupingExamples?: {
    sequence: (RhythmNoteValue | RhythmRestValue)[];
    groups: number[][];
    ties?: [number, number][];
    meter?: Meter;
    barBeforeIndex?: number;
    label: string;
  }[];
  /** Wioska Nut's own boss lesson ("Pokonaj króla Fałszomira") — shows
   * FalszomirPortrait.tsx's illustration inside the "Zapoznaj się" intro
   * itself, not just next to the lesson's node on the map, so the player
   * actually SEES who they're about to face before starting. A plain
   * boolean (not e.g. a character id) since there's only the one boss
   * character so far — see IntroSlideCards.tsx's own render branch. */
  bossPortrait?: boolean;
}

/** One lesson within a world — Wioska Nut's own content additionally
 * carries theory-slide intros (introSlides / introNotes+introSubtitle) on
 * some lessons; a lesson has at most one of the two. */
export interface LessonDefinition {
  id: string;
  order: number;
  difficulty: number;
  /** Scientific-pitch notes (e.g. "C4") shown on a single staff, in order,
   * before this lesson's exercises — see components/exercises/LessonIntro.tsx. */
  introNotes?: string[];
  introSubtitle?: string;
  introClef?: Clef;
  /** A short multi-card rule explanation shown before this lesson's
   * exercises instead of introNotes — see
   * components/exercises/LessonTheoryIntro.tsx. */
  introSlides?: LessonTheorySlide[];
  /** A collapsed-by-default "Zapoznaj się (pianino)" toggle shown above
   * every exercise in this lesson — see components/exercises/
   * PianoKeyboardRecap.tsx's own doc. Separate from introSlides'
   * ExerciseIntroRecap (its own "Zapoznaj się" toggle stays theory-text
   * focused) so a lesson can offer BOTH, one click away from each other,
   * without nesting a keyboard three collapses deep inside theory cards.
   * Zaczarowany Solfeż's own levels are the first (and, for now, only)
   * user of this — every exercise there is graded by ear against a
   * specific target pitch, so a quick reference keyboard is useful at
   * every single one, not just once before the lesson starts. */
  pianoKeyboardReference?: { range: [string, string] };
  /** Marks this lesson as a world's optional bonus/"boss" level — sits
   * past the world's regular curriculum (highest `order`, only reachable
   * once every regular lesson is done, via the same strictly-sequential
   * unlock lib/progression/resolveLessonNodeState.ts already applies to
   * every other lesson — no separate gating needed). Purely a display
   * flag: LessonNode.tsx renders a bigger node with the boss's own
   * portrait instead of the usual number/star/lock icon; the exercises
   * themselves are ordinary ExerciseDefinition entries, deliberately
   * reusing types already proven elsewhere in the world rather than
   * inventing boss-only mechanics. */
  isBoss?: boolean;
  /** Which boss this is — looked up in components/map/bossPortraits.ts's
   * own registry by both LessonNode.tsx (the map node's portrait/label)
   * and IntroSlideCards.tsx (a `bossPortrait: true` theory slide's own
   * portrait). Only meaningful alongside `isBoss: true`. Falls back to
   * Wioska Nut's own Fałszomir when omitted, so existing boss content
   * predating this field keeps working unchanged. */
  bossName?: string;
  exercises: ExerciseDefinition[];
}

export interface WorldContent {
  worldId: string;
  lessons: LessonDefinition[];
}

/** Resolved, player-facing exercise — what generate.ts produces from an
 * ExerciseSpec and what ExerciseRenderer/validate.ts both key off of.
 * Mirrors ExerciseSpec's own type-per-variant shape but with every
 * randomness-dependent field (shuffled options, derived correct answer)
 * already resolved for THIS attempt. */
export type GeneratedExercise =
  | { id: string; type: "clef-trace"; clef: Clef }
  | { id: string; type: "interval-distance-choice"; notes: [string, string]; correctMotion: IntervalMotion }
  | { id: string; type: "line-or-space-choice"; targetNote: string; correctAnswer: "line" | "space" }
  | { id: string; type: "melody-direction-choice"; notes: string[]; correctDirection: MelodyDirection }
  | {
      id: string;
      type: "multiple-choice-notation";
      targetNote: string;
      options: MultipleChoiceOption[];
      correctOptionId: string;
      clef: Clef;
    }
  | { id: string; type: "note-sequencing"; shuffledNotes: string[]; correctOrder: string[]; clef: Clef }
  | { id: string; type: "note-word-spelling"; notes: string[]; targetWord: string; clef: Clef }
  | { id: string; type: "pitch-height-choice"; targetNote: string; correctSide: "high" | "low" }
  | { id: string; type: "staff-placement"; targetStep: number }
  | {
      id: string;
      type: "pulse-tap";
      bpm: number;
      beatsPerMeasure: number;
      measureCount: number;
      accentOnly: boolean;
      beatTimesMs: number[];
      requiredTapTimesMs: number[];
      minHits: number;
    }
  | { id: string; type: "meter-choice"; correctMeter: Meter; bpm: number; optionPool: Meter[]; referenceAudioSource?: number }
  | { id: string; type: "rhythm-echo"; onsetsMs: number[]; referenceAudioSource?: number; showStandaloneMetronome?: boolean }
  | {
      id: string;
      type: "rhythm-sequencing";
      shuffledMotif: RhythmNoteValue[];
      correctOrder: RhythmNoteValue[];
      onsetsMs: number[];
      bpm: number;
      referenceAudioSource?: number;
      showStandaloneMetronome?: boolean;
    }
  | {
      id: string;
      type: "rhythm-dictation";
      bpm: number;
      meter: Meter;
      beatsPerMeasure: number;
      sequence: (RhythmNoteValue | RhythmRestValue)[];
      slotTimesMs: number[];
      onsetsMs: number[];
      referenceAudioSource?: number;
    }
  | {
      id: string;
      type: "rhythm-notation-tap";
      bpm: number;
      meter: Meter;
      beatsPerMeasure: number;
      sequence: (RhythmNoteValue | RhythmRestValue)[];
      slotTimesMs: number[];
      requiredTapTimesMs: number[];
      referenceAudioSource?: number;
    }
  | {
      id: string;
      type: "interval-name-choice";
      notes: [string, string];
      options: MultipleChoiceOption[];
      correctOptionId: string;
      hideNotation: boolean;
      harmonic: boolean;
    }
  | {
      id: string;
      type: "interval-timed-test";
      durationSeconds: number;
      noteRange: [string, string];
      allowedSemitones: number[];
      optionCount: number;
    }
  | {
      id: string;
      type: "interval-sequence-choice";
      notePairs: [string, string][];
      /** One option pool per position — same buildIntervalOptions shape
       * as interval-name-choice's own, generated independently per
       * position so the pools/distractors don't have to match. */
      optionsPerPosition: MultipleChoiceOption[][];
      /** Parallel to notePairs/optionsPerPosition — correctOptionIds[i]
       * is notePairs[i]'s own answer. */
      correctOptionIds: string[];
      harmonic: boolean;
    }
  | { id: string; type: "triad-notes-choice"; fifths: number; role: TriadRole; options: MultipleChoiceOption[]; correctOptionId: string }
  | {
      id: string;
      type: "triad-fact-choice";
      prompt: string;
      hint?: string;
      options: MultipleChoiceOption[];
      correctOptionId: string;
      explanation?: string;
      notationNotes?: [string, string, string];
    }
  | {
      id: string;
      type: "triad-quality-choice";
      notes: [string, string, string];
      hideNotation: boolean;
      arpeggiated: boolean;
      options: MultipleChoiceOption[];
      correctOptionId: string;
    }
  | {
      id: string;
      type: "triad-quality-sequence-choice";
      triads: [string, string, string][];
      /** One option pool per position — same "shuffle the quality pool"
       * shape as triad-quality-choice's own, generated independently per
       * position so the pools don't have to match. */
      optionsPerPosition: MultipleChoiceOption[][];
      /** Parallel to triads/optionsPerPosition — correctOptionIds[i] is
       * triads[i]'s own answer. */
      correctOptionIds: string[];
    }
  | {
      id: string;
      type: "triad-inversion-choice";
      notes: [string, string, string];
      quality: TriadQuality;
      qualityName: string;
      inversion: TriadInversion;
      hideNotation: boolean;
      options: MultipleChoiceOption[];
      correctOptionId: string;
    }
  | {
      id: string;
      type: "triad-inversion-sequence-choice";
      triads: [string, string, string][];
      /** One option pool per position — same "shuffle the inversion pool"
       * shape as triad-inversion-choice's own, generated independently
       * per position so the pools don't have to match. */
      optionsPerPosition: MultipleChoiceOption[][];
      /** Parallel to triads/optionsPerPosition — correctOptionIds[i] is
       * triads[i]'s own answer. */
      correctOptionIds: string[];
    }
  | {
      id: string;
      type: "dominant-seventh-inversion-choice";
      notes: [string, string, string, string];
      inversion: SeventhChordInversion;
      hideNotation: boolean;
      options: MultipleChoiceOption[];
      correctOptionId: string;
    }
  | {
      id: string;
      type: "dominant-seventh-inversion-sequence-choice";
      chords: [string, string, string, string][];
      /** One option pool per position — same "shuffle the inversion pool"
       * shape as dominant-seventh-inversion-choice's own, generated
       * independently per position so the pools don't have to match. */
      optionsPerPosition: MultipleChoiceOption[][];
      /** Parallel to chords/optionsPerPosition — correctOptionIds[i] is
       * chords[i]'s own answer. */
      correctOptionIds: string[];
    }
  | {
      id: string;
      type: "triad-role-choice";
      fifths: number;
      referenceNotes: [string, string, string];
      targetNotes: [string, string, string];
      hideNotation: boolean;
      options: MultipleChoiceOption[];
      correctOptionId: string;
    }
  | { id: string; type: "circle-step-choice"; startFifths: number; direction: CircleStepDirection; correctFifths: number }
  | { id: string; type: "relative-key-choice"; promptFifths: number; promptMode: TonalityMode; correctFifths: number }
  | {
      id: string;
      type: "key-fact-choice";
      prompt: string;
      hint?: string;
      options: MultipleChoiceOption[];
      correctOptionId: string;
      explanation?: string;
      imageId?: string;
      referenceAudioSource?: number;
    }
  | { id: string; type: "key-signature-names-choice"; fifths: number; options: MultipleChoiceOption[]; correctOptionId: string }
  | {
      id: string;
      type: "circle-neighbor-key-choice";
      startFifths: number;
      direction: "up" | "down";
      correctFifths: number;
      options: MultipleChoiceOption[];
      correctOptionId: string;
    }
  | { id: string; type: "key-signature-staff-choice"; fifths: number; options: MultipleChoiceOption[]; correctOptionId: string }
  | {
      id: string;
      type: "accidental-count-key-choice";
      accidentalCount: number;
      accidentalType: "sharps" | "flats";
      correctFifths: number;
      options: MultipleChoiceOption[];
      correctOptionId: string;
    }
  | {
      id: string;
      type: "interval-build-choice";
      rootNote: string;
      rootDisplayName: string;
      intervalName: string;
      direction: "up" | "down";
      targetNote: string;
      keyboardRange: { from: string; to: string };
    }
  | {
      id: string;
      type: "interval-build-staff-choice";
      rootNote: string;
      rootDisplayName: string;
      intervalName: string;
      direction: "up" | "down";
      targetStep: number;
      targetAccidental: Accidental;
      targetDisplayName: string;
      allowDoubleAccidentals: boolean;
      clickableSteps: number[];
    }
  | {
      id: string;
      type: "triad-build-staff-choice";
      rootNote: string;
      rootDisplayName: string;
      qualityName: string;
      quality: TriadQuality;
      thirdStep: number;
      thirdAccidental: Accidental;
      thirdDisplayName: string;
      fifthStep: number;
      fifthAccidental: Accidental;
      fifthDisplayName: string;
      allowDoubleAccidentals: boolean;
      clickableSteps: number[];
    }
  | {
      id: string;
      type: "triad-inversion-build-staff-choice";
      bassNote: string;
      bassDisplayName: string;
      qualityName: string;
      quality: TriadQuality;
      inversion: TriadInversion;
      inversionName: string;
      /** Interval name from the fixed bass up to the middle note — not
       * always "tercja" like triad-build-staff-choice's own hardcoded
       * framing, since an inversion's first hop can be a third OR a
       * fourth depending which chord tone the bass is. */
      middleLabel: string;
      middleStep: number;
      middleAccidental: Accidental;
      middleDisplayName: string;
      /** Interval name from the middle note up to the top note. */
      topLabel: string;
      topStep: number;
      topAccidental: Accidental;
      topDisplayName: string;
      allowDoubleAccidentals: boolean;
      clickableSteps: number[];
    }
  | {
      id: string;
      type: "dominant-seventh-build-staff-choice";
      bassNote: string;
      bassDisplayName: string;
      inversion: SeventhChordInversion;
      inversionName: string;
      /** Three build columns above the fixed bass, bottom to top — each
       * one's own label is the interval from the PREVIOUS column (or the
       * bass, for the first), the same "adjacent hop" framing
       * triad-inversion-build-staff-choice's own middleLabel/topLabel
       * use, just one column longer since this chord has four tones. */
      col1Label: string;
      col1Step: number;
      col1Accidental: Accidental;
      col1DisplayName: string;
      col2Label: string;
      col2Step: number;
      col2Accidental: Accidental;
      col2DisplayName: string;
      col3Label: string;
      col3Step: number;
      col3Accidental: Accidental;
      col3DisplayName: string;
      allowDoubleAccidentals: boolean;
      clickableSteps: number[];
    }
  | {
      id: string;
      type: "beam-grouping-choice";
      sequence: (RhythmNoteValue | RhythmRestValue)[];
      meter: Meter;
      barBeforeIndex?: number;
      options: { groups: number[][]; ties?: [number, number][] }[];
      correctOptionIndex: number;
    }
  | { id: string; type: "rhythm-math-choice"; combinations: RhythmNoteValue[][]; correctCombinationIndex: number }
  | {
      id: string;
      type: "rhythm-value-dictation";
      bpm: number;
      meter: Meter;
      beatsPerMeasure: number;
      allowedValues: (RhythmNoteValue | RhythmRestValue)[];
      sequence: (RhythmNoteValue | RhythmRestValue)[];
      slotTimesMs: number[];
      onsetsMs: number[];
    }
  | {
      id: string;
      type: "melodic-rhythmic-dictation";
      bpm: number;
      key: number;
      meter: Meter;
      allowedValues: RhythmNoteValue[];
      notes: { pitch: string; step: number; accidental: Accidental; value: RhythmNoteValue }[];
      onsetsMs: number[];
      durationsMs: number[];
    }
  | {
      id: string;
      type: "solfege-note-singing";
      targetNote: string;
      solfegeSyllable: string;
      toleranceCents: number;
    }
  | {
      id: string;
      type: "solfege-syllable-choice";
      targetNotes: string[];
      solfegeSyllables: string[];
      /** Distinct syllables of the spec's notePool, lowest to highest —
       * the answer buttons. */
      options: string[];
    }
  | {
      id: string;
      type: "solfege-phrase-singing";
      notes: string[];
      solfegeSyllables: string[];
      rhythm?: RhythmNoteValue[];
      meter?: Meter;
      isFragment?: boolean;
      gradeRhythm?: boolean;
      withMetronome?: boolean;
      metronomeOnly?: boolean;
      sourceLabel?: string;
      referenceAudioSource?: number;
      bpm?: number;
      toleranceCents: number;
    };

/** What the player has entered so far for a given exercise — always keyed
 * by the same `type` discriminant as its GeneratedExercise counterpart, so
 * ExerciseRenderer's switch stays exhaustive-checkable. */
export type AnswerInput =
  | { type: "clef-trace"; points: TracePoint[] }
  | { type: "interval-distance-choice"; selectedMotion: IntervalMotion }
  | { type: "line-or-space-choice"; selectedAnswer: "line" | "space" }
  | { type: "melody-direction-choice"; selectedDirection: MelodyDirection }
  | { type: "multiple-choice-notation"; selectedOptionId: string }
  | { type: "note-sequencing"; selectedOrder: string[] }
  | { type: "note-word-spelling"; guess: string }
  | { type: "pitch-height-choice"; selectedSide: "high" | "low" }
  | { type: "staff-placement"; selectedStep: number }
  | { type: "pulse-tap"; tapTimestampsMs: number[] }
  | { type: "meter-choice"; selectedMeter: Meter }
  | { type: "rhythm-echo"; tapTimestampsMs: number[] }
  | { type: "rhythm-sequencing"; selectedIndexes: number[] }
  | { type: "rhythm-dictation"; tapTimestampsMs: number[] }
  | { type: "rhythm-notation-tap"; tapTimestampsMs: number[] }
  | { type: "interval-name-choice"; selectedOptionId: string }
  | { type: "interval-timed-test"; correctCount: number; totalCount: number }
  | { type: "interval-sequence-choice"; selectedOptionIds: (string | null)[] }
  | { type: "triad-notes-choice"; selectedOptionId: string }
  | { type: "triad-fact-choice"; selectedOptionId: string }
  | { type: "triad-quality-choice"; selectedOptionId: string }
  | { type: "triad-quality-sequence-choice"; selectedOptionIds: (string | null)[] }
  | { type: "triad-inversion-choice"; selectedOptionId: string }
  | { type: "triad-inversion-sequence-choice"; selectedOptionIds: (string | null)[] }
  | { type: "dominant-seventh-inversion-choice"; selectedOptionId: string }
  | { type: "dominant-seventh-inversion-sequence-choice"; selectedOptionIds: (string | null)[] }
  | { type: "triad-role-choice"; selectedOptionId: string }
  | { type: "circle-step-choice"; selectedFifths: number }
  | { type: "relative-key-choice"; selectedFifths: number }
  | { type: "key-fact-choice"; selectedOptionId: string }
  | { type: "key-signature-names-choice"; selectedOptionId: string }
  | { type: "circle-neighbor-key-choice"; selectedOptionId: string }
  | { type: "key-signature-staff-choice"; selectedOptionId: string }
  | { type: "accidental-count-key-choice"; selectedOptionId: string }
  | { type: "beam-grouping-choice"; selectedIndex: number }
  | { type: "rhythm-math-choice"; selectedIndex: number }
  | { type: "interval-build-choice"; selectedNote: string }
  | { type: "interval-build-staff-choice"; selectedStep: number | null; selectedAccidental: Accidental }
  | {
      type: "triad-build-staff-choice";
      selectedThirdStep: number | null;
      selectedThirdAccidental: Accidental;
      selectedFifthStep: number | null;
      selectedFifthAccidental: Accidental;
    }
  | {
      type: "triad-inversion-build-staff-choice";
      selectedMiddleStep: number | null;
      selectedMiddleAccidental: Accidental;
      selectedTopStep: number | null;
      selectedTopAccidental: Accidental;
    }
  | {
      type: "dominant-seventh-build-staff-choice";
      selectedCol1Step: number | null;
      selectedCol1Accidental: Accidental;
      selectedCol2Step: number | null;
      selectedCol2Accidental: Accidental;
      selectedCol3Step: number | null;
      selectedCol3Accidental: Accidental;
    }
  | { type: "rhythm-value-dictation"; sequence: (RhythmNoteValue | RhythmRestValue)[]; groups: number[][] }
  | { type: "melodic-rhythmic-dictation"; notes: { step: number; accidental: Accidental; value: RhythmNoteValue }[]; groups: number[][] }
  | {
      type: "solfege-syllable-choice";
      /** One slot per heard note, filled left to right; null = not yet chosen. */
      selectedSyllables: (string | null)[];
    }
  | {
      type: "solfege-note-singing";
      detectedFrequencyHz: number | null;
      /** True when the player sang without the microphone and just
       * confirmed it (see lib/solfege/helpPreferences.ts's micEnabled) —
       * validate.ts accepts it as correct, since nothing was recorded to
       * grade. */
      selfReported?: boolean;
    }
  | {
      type: "solfege-phrase-singing";
      detectedFrequenciesHz: (number | null)[];
      /** Same self-confirmed, no-microphone flag as solfege-note-singing's own. */
      selfReported?: boolean;
      /** Only meaningful (and only ever set) when exercise.gradeRhythm is
       * true — parallel to detectedFrequenciesHz, one "was this note held
       * for roughly its own RELATIVE rhythmic length" verdict per note.
       * See lib/audio/pitchDetection.ts's own analyzeFreeRhythmicPhrase
       * and lib/questions/validate.ts's own solfege-phrase-singing case,
       * which requires BOTH this and the pitch match for a note to count
       * as correct when gradeRhythm is true. */
      rhythmCorrect?: (boolean | null)[];
    };
