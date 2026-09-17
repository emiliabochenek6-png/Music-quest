import {
  clearScheduledAudio,
  createSamplePool,
  getPool,
  playSample,
  scheduleAt,
  schedulerNow,
  stopAllActiveSamples,
  stopAllPooledSamples,
  type SamplePlaybackHandle,
} from "@/lib/audio/player";
import { CLAP_SAMPLE, CLICK_ACCENT_SAMPLE, CLICK_WEAK_SAMPLE, MELODY_NOTE_SAMPLES, NOTE_SAMPLES } from "@/lib/audio/samples";
import { formatScientific, midiToNote, noteToMidi, type Note } from "@/lib/music/notes";

// createSamplePool/scheduleAt/getPool and the lookahead scheduler they run
// on live in lib/audio/player.ts now (shared with its own playMelody/
// playChordSequence, which needed the exact same pooling — see that
// module's own doc for the full "why" on both). This module keeps its own
// NAMED pools below (accent/weak click, clap) since each needs its own
// tuned size, distinct from the generic lazy per-source pool getPool()
// provides.
// Sized past "one per beat" — a compound-meter click track doesn't just
// click once per felt pulse, it also reuses weakClickPool for every
// subdivision "-ta" tick inside that same pulse (see playMetronome
// below), so this pool cycles through far more triggers per second than
// its old size of 3 assumed. Bumped for the same reason clapPool was
// (see its own doc): too few players means the Nth-ahead reuse lands
// before a still-settling seekTo(0) from a couple of triggers ago has
// actually finished, which is exactly what an uneven-sounding click
// track traces back to. accentClickPool never gets subdivision ticks
// (only ever one trigger per measure's downbeat), so it keeps a smaller,
// still-comfortable margin.
const accentClickPool = createSamplePool(CLICK_ACCENT_SAMPLE, 4);
const weakClickPool = createSamplePool(CLICK_WEAK_SAMPLE, 6);
// Sized a bit larger than the click pools — some authored rhythm patterns
// have onsets much closer together than most metronome beat intervals, so
// a clap needs to be free for reuse sooner. clap.wav itself is 130ms —
// Szczyt Dyktand's densest content (four consecutive sixteenth notes at
// its fastest authored tempo, ~108bpm in 6/8) produces onsets only ~139ms
// apart, leaving almost no margin at the previous pool size of 5 (5*139ms
// ≈ 695ms before a slot is reused — the sample's own 130ms fits, but
// seekTo()'s own async native rewind on top of that left too little
// headroom, and was the actual source of "sometimes stutters" specifically
// during fast clapping). Bumped generously rather than precisely re-tuned
// to this one tightest case — cheap (just more idle AudioPlayer
// instances) and safe against anything denser than today's content too.
const clapPool = createSamplePool(CLAP_SAMPLE, 10);

// playDanceFragment's own notes (bass/chord/pickup/lilt) use the generic
// getPool() (imported from lib/audio/player.ts) rather than a named pool
// — a compound-meter pulse packs 2-3 notes tightly together, close enough
// in time that the same per-trigger player-construction jitter that made
// the metronome/claps sound uneven (see createSamplePool's own doc) shows
// up here too, and getPool() caches one pool per distinct sample source
// automatically rather than needing one named by hand.

// Default anchor for a track scheduled on its own — but see playMetronome/
// playRhythm's own `startAtMs` param for why a CALLER driving two tracks
// together (a metronome click track underneath a clap pattern, most
// notably) needs to pass one shared anchor instead of letting each track
// default to its own schedulerNow(): even a sub-millisecond gap between the
// two calls (schedulePooled iterating one track's events before the other
// track's own loop even starts) is a real, if usually tiny, relative
// offset between "beat 0" of one track and "beat 0" of the other — using
// one anchor for both makes that offset exactly zero by construction
// instead of "negligible in practice."
function scheduleSample(source: number, velocity: number, delayMs: number, anchorMs?: number): void {
  scheduleAt(delayMs, () => getPool(source).trigger(velocity), anchorMs);
}

function schedulePooled(pool: ReturnType<typeof createSamplePool>, velocity: number, delayMs: number, anchorMs?: number): void {
  scheduleAt(delayMs, () => pool.trigger(velocity), anchorMs);
}

/** Cancels every metronome click / clap / dance-fragment note scheduled by
 * this module (or by lib/audio/player.ts's own playMelody/playChordSequence,
 * which share the same scheduler/pools) that hasn't fired yet, AND
 * silences whatever's currently sounding — call this whenever leaving an
 * exercise or finishing a lesson so nothing keeps playing past that
 * point. */
export function stopAllScheduledAudio(): void {
  clearScheduledAudio();
  stopAllActiveSamples();
  stopAllPooledSamples();
  accentClickPool.stop();
  weakClickPool.stop();
  clapPool.stop();
}

/** How many measures a "standalone metronome" (the tappable
 * MetronomeIndicator dot — see RhythmDictationExercise/
 * RhythmNotationTapExercise's own toggle) schedules per tap-on. There's
 * no true "loop forever" with setTimeout scheduling, so this is just a
 * generously long bound (10+ minutes even at a slow tempo) rather than a
 * literal infinite metronome — a player tapping it back off well before
 * then is the expected use, not letting it run out on its own. */
export const STANDALONE_METRONOME_MEASURES = 200;

export function metronomeBeatTimesMs(bpm: number, beatsPerMeasure: number, measureCount: number): number[] {
  const beatIntervalMs = (60 / bpm) * 1000;
  const totalBeats = beatsPerMeasure * measureCount;
  return Array.from({ length: totalBeats }, (_, index) => index * beatIntervalMs);
}

export interface MetronomeOptions {
  bpm: number;
  beatsPerMeasure: number;
  measureCount: number;
  accentVelocity?: number;
  weakVelocity?: number;
  /** How many equal parts each click-to-click interval audibly splits
   * into — 1 (default, no split) for a plain click. RhythmDictationExercise/
   * RhythmNotationTapExercise pass meterPulseSubdivision(exercise.meter)
   * here (same concept, same helper, as playDanceFragment's own
   * pulseSubdivision — see its doc) so a compound-meter (6/8/9/8/12/8) or
   * 2/2 click track ticks as often as the clap pattern usually does,
   * instead of leaving long gaps between sparse felt-pulse clicks that a
   * denser clap line can otherwise sound "unsynced" against — even though
   * every note is, in fact, scheduled at its exact correct time either
   * way; this is purely about giving the ear enough reference points to
   * HEAR that alignment. */
  pulseSubdivision?: number;
  /** Shared time origin for this track's beat 0 — pass the SAME value to
   * a simultaneous playRhythm() call (see RhythmDictationExercise/
   * RhythmNotationTapExercise's own play()) so the click track and the
   * clap pattern it's playing under are scheduled against one identical
   * "now" instead of each independently calling Date.now() a few
   * JS-execution-steps apart. Defaults to schedulerNow() for a track played
   * on its own (e.g. the standalone-metronome dot toggle). */
  startAtMs?: number;
}

/** Schedules a metronome click track via the lookahead scheduler above.
 * The web app plays two distinct oscillator pitches (1100Hz accent /
 * 660Hz weak beat) live via Web Audio; this pre-renders those as two
 * short WAV one-shots (see samples.ts's own doc), rather than porting live
 * oscillator code — unavailable in Expo Go (see NOTE_SAMPLES's own doc for
 * why this app trades live synthesis for pre-rendered samples throughout). */
export function playMetronome(options: MetronomeOptions): void {
  const { bpm, beatsPerMeasure, measureCount, accentVelocity = 0.55, weakVelocity = 0.3, pulseSubdivision = 1, startAtMs = schedulerNow() } = options;
  // Forces both pools' native players to exist right now, before the
  // FIRST beat is even scheduled — see createSamplePool's own warmUp()
  // doc for why that first beat used to be the one most likely to sound
  // late/uneven.
  accentClickPool.warmUp();
  weakClickPool.warmUp();
  const beatIntervalMs = (60 / bpm) * 1000;
  const subdivisionIntervalMs = beatIntervalMs / pulseSubdivision;
  metronomeBeatTimesMs(bpm, beatsPerMeasure, measureCount).forEach((timeMs, index) => {
    const isAccent = index % beatsPerMeasure === 0;
    schedulePooled(isAccent ? accentClickPool : weakClickPool, isAccent ? accentVelocity : weakVelocity, timeMs, startAtMs);
    // Quiet in-between ticks on the SAME weak-click sample, at a lower
    // volume than even the weak beat — a subtle "-ta(-ta)" filling out
    // each pulse rather than a second competing accent.
    for (let sub = 1; sub < pulseSubdivision; sub++) {
      schedulePooled(weakClickPool, 0.14, timeMs + sub * subdivisionIntervalMs, startAtMs);
    }
  });
}

/** Schedules one clap one-shot per onset — the rhythm-playback counterpart
 * to playMetronome, used by rhythm-echo/rhythm-sequencing/rhythm-dictation/
 * rhythm-notation-tap to let the player HEAR the target pattern before
 * tapping it back. Pooled the same way playMetronome's clicks are (see
 * createSamplePool's own doc) so the claps themselves land evenly instead
 * of drifting from one-shot player construction overhead. `startAtMs` is
 * playMetronome's own shared-anchor param, same reasoning — pass the
 * identical value both calls were given when a metronome plays underneath
 * this pattern, so the two tracks share one exact time origin. */
export function playRhythm(onsetsMs: readonly number[], velocity = 0.8, startAtMs: number = schedulerNow()): void {
  // Same reasoning as playMetronome's own warmUp() call — get the pool's
  // players built before the first onset is even scheduled, not on it.
  clapPool.warmUp();
  onsetsMs.forEach((timeMs) => {
    schedulePooled(clapPool, velocity, timeMs, startAtMs);
  });
}

export interface MelodicRhythmNote {
  note: Note;
  onsetMs: number;
  /** How long this note is actually held before the next one starts —
   * see playMelodicRhythm's own doc for why this is no longer just used
   * to space onsets apart. */
  durationMs: number;
}

/** A small silent gap cut into the END of every note's own hold time,
 * before the next note's onset — real articulation (each note reads as
 * its own distinct sound), not a hard click from a sample stopping
 * exactly when the next one starts, and not 100% legato either (which
 * would blur exactly the duration distinction this exists to make
 * audible). Small relative to even this world's shortest authored value
 * (a sixteenth note is still well over 100ms at every tempo Szczyt
 * Dyktand authors). */
const NOTE_RELEASE_GAP_MS = 40;
/** Floor so a very short value (a sixteenth at a fast tempo) never gets
 * clipped down to inaudibility by NOTE_RELEASE_GAP_MS. */
const MIN_HOLD_MS = 60;

/** Schedules a melodic phrase's notes at independent onset offsets AND
 * durations — the "Szczyt Dyktand" melodic-rhythmic dictation counterpart
 * to playRhythm's plain clap onsets, using real pitched samples instead.
 * Uses NOTE_SAMPLES (the long ~1.6s ring already used for playChord, not
 * MELODY_NOTE_SAMPLES's short ~0.3s fade) and explicitly stops each note
 * at the end of its own written duration — a half note is now actually
 * HELD twice as long as a quarter note, not just followed by a longer
 * silence before the next onset. This is a real duration cue a learner
 * can hear, not just infer from timing between attacks; the earlier
 * "onset-spacing-only" version was a starting-point compromise (this
 * app's pre-rendered samples can't be stretched/shortened the way the
 * web app's live oscillators are, per-note, via envelope duration — but
 * "play a long-ring sample, then stop it early" gets the same audible
 * result without needing live synthesis). */
export function playMelodicRhythm(notes: readonly MelodicRhythmNote[], velocity = 0.55, startAtMs: number = schedulerNow()): void {
  notes.forEach(({ note, onsetMs, durationMs }) => {
    const key = formatScientific(midiToNote(noteToMidi(note)));
    const source = NOTE_SAMPLES[key];
    if (source === undefined) {
      throw new Error(`No note sample for note "${key}" — add one to lib/audio/samples.ts`);
    }
    let handle: SamplePlaybackHandle | null = null;
    scheduleAt(onsetMs, () => {
      handle = playSample(source, velocity);
    }, startAtMs);
    const holdMs = Math.max(MIN_HOLD_MS, durationMs - NOTE_RELEASE_GAP_MS);
    scheduleAt(onsetMs + holdMs, () => {
      handle?.stop();
    }, startAtMs);
  });
}

export interface DanceFragmentOptions {
  bpm: number;
  beatsPerMeasure: number;
  measureCount?: number;
  /** How many equal parts each pulse audibly splits into — 1 (no split)
   * for a plain quarter-note pulse, 2 for 2/2's half-note pulse, 3 for a
   * compound eighth meter's dotted-quarter pulse (see
   * lib/rhythm/meter.ts's meterPulseSubdivision). `bpm`/`beatsPerMeasure`
   * here are always meant as the FELT PULSE rate/count, already scaled by
   * the caller (see MeterChoiceExercise's own doc) — this function only
   * adds the audible "-ta(-ta)" ticks a correctly-timed-but-unsubdivided
   * pulse is still missing; without them, a 6/8 pulse and a 3/4 pulse (or
   * a 2/2 pulse and a 2/4 pulse) sound identical, defeating the whole
   * point of a meter-by-ear exercise. */
  pulseSubdivision?: number;
}

// The "pah" chord — C4+E4+G4 played TOGETHER over the C3 bass, a full
// three-note triad (root, third, fifth) rather than just two notes. The
// downbeat itself stays a single note (see playDanceFragment below) — one
// clean, punchy accent — with the fuller triad reserved for the weak
// beats around it, the same "oom" (single) / "PAH" (full chord) contrast
// a real oom-pah accompaniment has.
const OFFBEAT_CHORD_TONES = [MELODY_NOTE_SAMPLES.C4, MELODY_NOTE_SAMPLES.E4, MELODY_NOTE_SAMPLES.G4];

/** A short "oom-pah" accompaniment for meter-choice — a single bass note
 * on each measure's downbeat (the accent) and a full three-note triad on
 * every other pulse, plus — when
 * the meter's pulse itself splits into more than one part (2/2, or any
 * compound eighth meter) — a quiet subdivision "lilt" tick filling out
 * each pulse. Together these let the player feel both how many pulses
 * separate one strong beat from the next (distinguishing e.g. 4/4 from
 * 3/4) AND whether each pulse itself is plain or split (distinguishing
 * e.g. 6/8 from 3/4, or 2/2 from 2/4, which otherwise share the same
 * pulse count). The web app builds this from a root+fifth+octave chord
 * (plus its own lilt ticks) via live oscillators; this reuses this app's
 * own existing piano samples instead (see MELODY_NOTE_SAMPLES) rather
 * than rendering new chord-tone samples or porting live synthesis — the
 * exact chord quality isn't what the exercise tests, only the felt pulse
 * pattern is. Pooled the same way as the clicks/claps above (via
 * scheduleSample's own lazy per-source pool cache) — needed once
 * subdivision lilts started packing multiple notes tightly into a single
 * compound-meter pulse, close enough together that per-trigger player
 * construction jitter became audible here too. */
export function playDanceFragment(options: DanceFragmentOptions): void {
  const { bpm, beatsPerMeasure, measureCount = 4, pulseSubdivision = 1 } = options;
  // Same reasoning as playMetronome/playRhythm's own warmUp() calls —
  // every distinct sample source this fragment ever plays, warmed up
  // before the downbeat is even scheduled.
  [MELODY_NOTE_SAMPLES.C3, MELODY_NOTE_SAMPLES.G4, ...OFFBEAT_CHORD_TONES].forEach((source) => getPool(source).warmUp());
  const beatIntervalMs = (60 / bpm) * 1000;
  const subdivisionIntervalMs = beatIntervalMs / pulseSubdivision;
  const totalBeats = beatsPerMeasure * measureCount;
  for (let beat = 0; beat < totalBeats; beat++) {
    const isDownbeat = beat % beatsPerMeasure === 0;
    const startMs = beat * beatIntervalMs;
    if (isDownbeat) {
      scheduleSample(MELODY_NOTE_SAMPLES.C3, 0.75, startMs);
    } else {
      // Slightly lower per-note velocity than the single-note downbeat —
      // three notes summed together already reads as louder/fuller, so
      // this keeps the "PAH" from overpowering the "oom".
      OFFBEAT_CHORD_TONES.forEach((source) => scheduleSample(source, 0.26, startMs));
    }
    for (let sub = 1; sub < pulseSubdivision; sub++) {
      scheduleSample(MELODY_NOTE_SAMPLES.G4, 0.14, startMs + sub * subdivisionIntervalMs);
    }
  }
}
