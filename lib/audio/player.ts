import { createAudioPlayer, type AudioPlayer } from "expo-audio";
import { formatScientific, midiToNote, noteToMidi, type Note } from "@/lib/music/notes";
import { MELODY_NOTE_SAMPLES, NOTE_SAMPLES } from "@/lib/audio/samples";

interface ToneOptions {
  velocity?: number;
}

// Every currently-playing (or just-triggered, possibly still loading)
// sample's own stop() callback — so a long scheduled sequence (a
// metronome click track, most notably — see lib/audio/rhythmPlayer.ts)
// can be silenced immediately instead of ringing out on its own once the
// player has already moved on (finished the exercise, left the lesson,
// ...). Stores the CALLBACK, not the raw player: stopAllActiveSamples
// used to pause()/remove() raw players directly, which bypassed a
// still-loading player's own settled/cleanup bookkeeping (its
// playbackStatusUpdate subscription and load-timeout kept running against
// an already-removed native object) — a later stray event or the timeout
// firing would then call play() on it and throw, breaking playback for
// whatever came next. Every teardown path now goes through the exact same
// stop() a caller would get back from playSample/playRecordedUri, so
// there's only ever one place that decides "already torn down, nothing to
// do here".
const activeStops = new Set<() => void>();

/** A handle back to one playSample() call — lets a caller that wants
 * manual stop/toggle control (e.g. a "posłuchaj przykładu" button acting
 * as a real play/stop player, not just a fire-and-forget one-shot) do so
 * without reaching into this module's own activeStops bookkeeping. */
export interface SamplePlaybackHandle {
  stop(): void;
}

/** How long playRecordedUri waits for the native side to report a source
 * loaded before giving up and reporting a real error instead of staying
 * silently stuck forever — generous ceiling for a slow device, not an
 * expected wait. */
const LOAD_TIMEOUT_MS = 4000;

/** Plays one pre-rendered sample and releases the underlying native player
 * once it finishes — expo-audio players are native resources
 * (SharedObject), not garbage-collected JS objects, so leaving them
 * un-removed after playback would leak one per sound played over a
 * session. Exported (not just used internally) so other one-shot sound
 * players — e.g. lib/audio/rhythmPlayer.ts's metronome/clap sounds —
 * reuse the same cleanup instead of re-implementing it.
 *
 * Deliberately back to the ORIGINAL, simplest shape this function ever
 * had: construct, listen for didJustFinish, call play() once, immediately
 * — no isLoaded wait, no second "nudge" call. That plain version is what
 * every "🔊" button across every earlier world in this app was actually
 * verified against over the course of building them; two later attempts
 * to patch a specific reference-tone report (waiting for isLoaded, then
 * playing twice) each added real behavioral change to this single
 * function EVERY sound in the app goes through, and the regressions kept
 * getting broader, not narrower, each time — the honest read is that
 * neither of those was fixing a real bug here, and the actual "won't
 * play" reports likely trace to something else entirely (a stale Metro
 * bundle after rapid edits to a file this central has repeatedly bitten
 * this app already — see git history/session notes — or the mic-session
 * interaction covered by allowsRecording in app/_layout.tsx). The ONE
 * change kept from that whole detour is activeStops itself (see its own
 * doc) — that one fixed a real, log-confirmed native crash
 * (NotFoundException on an already-released player), unrelated to
 * whether play() fires once or twice.
 *
 * `onFinish` fires once, only when the sample runs to completion on its
 * own (not when stopped via the returned handle) — a caller driving a
 * play/stop UI needs to know "it finished naturally" separately from "I
 * stopped it myself" so it can reset its own button state without an
 * extra stop() call fighting the listener it's reacting to. */
export function playSample(source: number, velocity: number, onFinish?: () => void): SamplePlaybackHandle {
  const player = createAudioPlayer(source);
  player.volume = velocity;
  let settled = false;

  function cleanup() {
    subscription.remove();
    activeStops.delete(stop);
  }

  function stop(): void {
    if (settled) return;
    settled = true;
    cleanup();
    try {
      player.pause();
      player.remove();
    } catch {
      // Already finished/removed between the caller deciding to stop and
      // this running (e.g. it just naturally completed) — nothing left
      // to stop.
    }
  }

  activeStops.add(stop);

  const subscription = player.addListener("playbackStatusUpdate", (status) => {
    if (settled) return;
    if (status.didJustFinish) {
      settled = true;
      cleanup();
      player.remove();
      onFinish?.();
    }
  });
  player.play();
  return { stop };
}

/** Plays back an on-device audio file by URI (a `file://...` path) rather
 * than a bundled require()'d sample — "Zaczarowany Solfeż"'s own
 * "odsłuchaj swoją nagrywkę" button, the one place in this app that plays
 * audio it didn't ship with (the student's own recorded take — a real
 * file expo-audio's own useAudioRecorder wrote, see lib/audio/
 * solfegeRecording.ts's own doc). Same simple play()-immediately shape as
 * playSample (see its own doc for why calling play() once and waiting
 * turned out to be the wrong fix) — this version additionally reports
 * real failures through `onError` (a native load error, a recording with
 * zero duration, or simply never confirming
 * loaded within LOAD_TIMEOUT_MS) rather than playSample's silent "it'll
 * probably work" stance, since a silently-broken recording is more useful
 * surfaced to the player than papered over. */
export function playRecordedUri(uri: string, onFinish?: () => void, onError?: (message: string) => void): SamplePlaybackHandle {
  const player = createAudioPlayer(uri);
  player.volume = 1;
  let settled = false;

  function cleanup() {
    subscription.remove();
    clearTimeout(loadTimeout);
    activeStops.delete(stop);
  }

  function stop(): void {
    if (settled) return;
    settled = true;
    cleanup();
    try {
      player.pause();
      player.remove();
    } catch {
      // Already finished/removed — nothing left to stop.
    }
  }

  activeStops.add(stop);

  function fail(message: string) {
    if (settled) return;
    settled = true;
    cleanup();
    try {
      player.remove();
    } catch {
      // Already gone.
    }
    onError?.(message);
  }

  // Same simple play()-immediately shape as playSample (see its own doc
  // on why the isLoaded-wait/nudge detour was reverted) — this function
  // still listens for isLoaded, but ONLY to validate the recording
  // (error / zero duration) and clear loadTimeout, never to gate or repeat
  // play() itself.
  const loadTimeout = setTimeout(() => fail(`nie załadowało się w ${LOAD_TIMEOUT_MS}ms`), LOAD_TIMEOUT_MS);

  const subscription = player.addListener("playbackStatusUpdate", (status) => {
    if (settled) return;
    if (status.error) {
      fail(status.error);
      return;
    }
    if (status.isLoaded) {
      clearTimeout(loadTimeout);
      if (status.duration <= 0) {
        fail("nagranie ma zerową długość");
        return;
      }
    }
    if (status.didJustFinish) {
      settled = true;
      cleanup();
      player.remove();
      onFinish?.();
    }
  });
  player.play();
  return { stop };
}

/** Immediately silences every sample currently sounding (or still loading)
 * — used alongside lib/audio/rhythmPlayer.ts's stopAllScheduledAudio
 * (which cancels anything not yet triggered) so leaving an exercise/
 * lesson mid-playback doesn't leave a metronome or clap ringing into
 * whatever comes next. Goes through each sample's own stop() (see
 * activeStops' own doc on why that matters) rather than touching any
 * native player directly. */
export function stopAllActiveSamples(): void {
  const stops = Array.from(activeStops);
  activeStops.clear();
  stops.forEach((stop) => stop());
}

// --- Lookahead scheduler + sample pooling ---------------------------------
//
// playMelody/playChordSequence below (and lib/audio/rhythmPlayer.ts's own
// metronome/clap/dance-fragment tracks, which import these) both need to
// play several sounds spaced out over time. The naive way — one
// setTimeout(delayMs) per sound, each constructing a brand-new native
// player — turned out to be a real, log-confirmed source of "sometimes
// choppy/uneven" playback, from two independent causes:
//
// 1. Constructing a native AudioPlayer from a bundled sample has its own
//    non-trivial, non-constant latency. Paying that cost at the exact
//    moment a note is due to sound (rather than ahead of time) puts
//    variable extra delay directly on the "when does it actually start
//    sounding" path — the more notes/chords in a row, the more chances for
//    one of them to lag audibly behind where it should land.
// 2. React Native's timer bridge doesn't guarantee equal wake-up latency
//    across many independently-pending one-shot timers — under any
//    JS-thread load (a re-render, GC, ...) some fire a few ms late while
//    their neighbors don't, an unpredictable per-note lag with no
//    correction.
//
// The fix for both: a small pool of already-constructed players per
// sample (reused via seekTo(0) rather than torn down and rebuilt every
// trigger) plus a single shared "lookahead" scheduler — one fast-polling
// timer checking real wall-clock deadlines, rather than a timer per event
// — so a late tick loses only that tick's own short polling interval of
// accuracy, never however late one particular one-shot timer happened to
// wake up.

interface ScheduledAudioEvent {
  dueAtMs: number;
  fire: () => void;
}

const SCHEDULER_TICK_MS = 3;
let scheduledEvents: ScheduledAudioEvent[] = [];
let schedulerHandle: ReturnType<typeof setInterval> | null = null;

function runSchedulerTick(): void {
  const now = Date.now();
  let dueCount = 0;
  while (dueCount < scheduledEvents.length && scheduledEvents[dueCount].dueAtMs <= now) {
    dueCount++;
  }
  if (dueCount > 0) {
    const due = scheduledEvents.slice(0, dueCount);
    scheduledEvents = scheduledEvents.slice(dueCount);
    due.forEach((event) => event.fire());
  }
  if (scheduledEvents.length === 0 && schedulerHandle !== null) {
    clearInterval(schedulerHandle);
    schedulerHandle = null;
  }
}

/** Schedules `fire` to run at `anchorMs + delayMs` via the shared
 * lookahead scheduler — see the block doc above. Exported for
 * lib/audio/rhythmPlayer.ts's own metronome/clap/dance-fragment
 * scheduling, which needs the exact same "many events, one shared
 * anchor" shape. */
export function scheduleAt(delayMs: number, fire: () => void, anchorMs: number = Date.now()): void {
  const dueAtMs = anchorMs + delayMs;
  let insertAt = scheduledEvents.length;
  while (insertAt > 0 && scheduledEvents[insertAt - 1].dueAtMs > dueAtMs) {
    insertAt--;
  }
  scheduledEvents.splice(insertAt, 0, { dueAtMs, fire });
  if (schedulerHandle === null) {
    schedulerHandle = setInterval(runSchedulerTick, SCHEDULER_TICK_MS);
  }
}

/** Cancels every event scheduled via scheduleAt that hasn't fired yet
 * (without touching whatever's already sounding — see
 * stopAllPooledSamples/stopAllActiveSamples for that). */
export function clearScheduledAudio(): void {
  scheduledEvents = [];
  if (schedulerHandle !== null) {
    clearInterval(schedulerHandle);
    schedulerHandle = null;
  }
}

export interface SamplePool {
  trigger(velocity: number): void;
  stop(): void;
  /** Forces the pool's native players to exist right now, if they don't
   * already — see the pool's own doc for why a caller about to schedule a
   * sequence should call this once, up front, rather than leaving it to
   * happen implicitly on the first trigger(). Idempotent — a pool already
   * warmed up (or already used) does nothing. */
  warmUp(): void;
}

/** A small pool of players for the same short sample, reused instead of
 * constructing (and tearing down) a brand-new native player on every
 * trigger — see the block doc above for why that construction cost is a
 * real source of uneven-sounding playback once several sounds are
 * scheduled close together. Construction stays LAZY — deferred until
 * warmUp()/trigger() actually runs, not done here at createSamplePool()
 * itself — because every pool in this module is built as a top-level
 * `const` at module load (see rhythmPlayer.ts), and that same module gets
 * imported during this app's static web export, which pre-renders every
 * route in a plain Node.js process with no `Audio`/browser APIs at all;
 * constructing real players that early crashed that build outright.
 * What USED to make this lazy scheme a smoothness problem wasn't laziness
 * itself, but WHERE the deferred construction landed: inside the
 * scheduler's fire callback for the very first scheduled beat — the one
 * moment most critical to get right, since a session's opening beat is
 * also the one a player's ear has nothing else to judge timing against
 * yet. warmUp() exists so a caller (playMetronome/playRhythm/
 * playDanceFragment, all real interactive code paths, never touched
 * during static rendering) can force that same construction to happen
 * synchronously, up front, before scheduling a single event — still
 * lazy relative to module load, just no longer lazy relative to when a
 * beat is actually due. The rewind-to-start each reuse needs happens in
 * a "just finished" listener (attached once, at construction) rather
 * than at trigger time — seekTo() is itself an async native call, and
 * calling it immediately before play() would put that latency right on
 * the critical "fire exactly on time" path. */
export function createSamplePool(source: number, size: number): SamplePool {
  let players: AudioPlayer[] | null = null;

  function ensurePlayers(): AudioPlayer[] {
    if (!players) {
      players = Array.from({ length: size }, () => {
        const player = createAudioPlayer(source);
        player.addListener("playbackStatusUpdate", (status) => {
          if (status.didJustFinish) {
            player.seekTo(0);
          }
        });
        return player;
      });
    }
    return players;
  }

  let nextIndex = 0;

  return {
    warmUp(): void {
      ensurePlayers();
    },
    trigger(velocity: number): void {
      const pool = ensurePlayers();
      const player = pool[nextIndex];
      nextIndex = (nextIndex + 1) % size;
      player.volume = velocity;
      player.play();
    },
    stop(): void {
      players?.forEach((player) => {
        player.pause();
        player.seekTo(0);
      });
    },
  };
}

const DEFAULT_POOL_SIZE = 3;
const pooledSamples = new Map<number, SamplePool>();

/** A lazily-created pool per distinct sample source — any caller that
 * plays notes close together in time (playMelody/playChordSequence below,
 * lib/audio/rhythmPlayer.ts's playDanceFragment) gets pooled playback
 * automatically, without naming a pool by hand per sample. */
export function getPool(source: number): SamplePool {
  let pool = pooledSamples.get(source);
  if (!pool) {
    pool = createSamplePool(source, DEFAULT_POOL_SIZE);
    pooledSamples.set(source, pool);
  }
  return pool;
}

/** Stops every lazily-created pool from getPool() — pairs with
 * stopAllActiveSamples (the unpooled one-shot path) and
 * clearScheduledAudio (cancels not-yet-fired events) so leaving an
 * exercise mid-playback never leaves a pooled melody/chord ringing into
 * whatever comes next. */
export function stopAllPooledSamples(): void {
  pooledSamples.forEach((pool) => pool.stop());
}

function resolveSample(samples: Record<string, number>, note: Note): number {
  // Sample maps are only ever keyed by each pitch's canonical spelling
  // (midiToNote's fixed sharp/natural table — see samples.ts's own doc),
  // but a note arriving here can be spelled either way (e.g.
  // lib/music/intervals.ts's pickRandomIntervalNotePair sometimes returns
  // a flat-spelled pair — see its own doc on the double-accidental
  // fallback). Re-deriving the key from the note's MIDI pitch rather than
  // its own spelling means playback only ever cares about the actual
  // pitch, never which of two equally valid spellings a caller happened
  // to produce.
  const key = formatScientific(midiToNote(noteToMidi(note)));
  const source = samples[key];
  if (source === undefined) {
    // A content-authoring bug, same philosophy as the rest of this app's
    // "fail loudly on unsupported content" convention — not a case to
    // silently swallow, since a missing sample means the lesson content
    // references a note nobody pre-rendered audio for yet.
    throw new Error(`No audio sample for note "${key}" — add one to lib/audio/samples.ts`);
  }
  return source;
}

function playSampleFrom(samples: Record<string, number>, note: Note, velocity: number): void {
  playSample(resolveSample(samples, note), velocity);
}

export function playNote(note: Note, options: ToneOptions = {}): void {
  playSampleFrom(NOTE_SAMPLES, note, options.velocity ?? 0.6);
}

interface MelodyOptions extends ToneOptions {
  /** Matches the web app's own default gap (lib/audio/player.ts,
   * playMelody) — silence between one note fading out and the next
   * starting, so the phrase reads as distinct notes rather than a blur. */
  gapSeconds?: number;
}

/** How long MELODY_NOTE_SAMPLES's own files actually run (see
 * samples.ts's own doc) — each one fades to silence within this duration
 * by construction (rendered that way, not truncated at playback time), so
 * scheduling the NEXT note's onset at exactly this many seconds later
 * never overlaps or clicks. */
const MELODY_NOTE_DURATION_SECONDS = 0.3;

/** Sequential playback for "which way does the melody go" — each note
 * starts only after the previous one has genuinely finished sounding
 * (MELODY_NOTE_SAMPLES's own short piano-envelope render) plus a gap, so
 * notes never audibly overlap. Scheduled via the shared lookahead
 * scheduler (see scheduleAt's own doc) with each note's own sample
 * pre-pooled, rather than the plain setTimeout + construct-fresh-player-
 * per-note shape this used to have — that combination was the actual
 * source of "sometimes choppy" reports: real, audible per-note timing
 * jitter, not just an inherent limit of not having a sample-accurate
 * audio clock on this stack. */
export function playMelody(notes: readonly Note[], options: MelodyOptions = {}): void {
  const gapSeconds = options.gapSeconds ?? 0.05;
  const stepSeconds = MELODY_NOTE_DURATION_SECONDS + gapSeconds;
  const velocity = options.velocity ?? 0.7;
  const startAtMs = Date.now();
  notes.forEach((note, index) => {
    const source = resolveSample(MELODY_NOTE_SAMPLES, note);
    scheduleAt(index * stepSeconds * 1000, () => getPool(source).trigger(velocity), startAtMs);
  });
}

/** "Pasmo Interwałów"'s two notes-together-in-sequence playback — the web
 * app's playInterval supports a "harmonic" (simultaneous) mode too, but
 * every call site there actually uses the default melodic (one-after-
 * another) mode (see the investigation this port is based on), so this is
 * a thin naming-parity alias over the sequential playMelody rather than a
 * fresh implementation. */
export function playInterval(notes: readonly [Note, Note], options: MelodyOptions = {}): void {
  playMelody(notes, options);
}

/** "Zatoka Trójdźwięków"'s TRUE simultaneous playback for a triad — unlike
 * playInterval/playMelody, every note here starts at once (no stagger),
 * because a chord's whole identity is three pitches sounding together.
 * Uses NOTE_SAMPLES (the long ~1.6s ring, not MELODY_NOTE_SAMPLES's short
 * fade) so the chord actually sustains like one. Each note plays a bit
 * quieter than a single playNote() call by default, since three
 * simultaneous samples summed together read as louder than any one of
 * them alone. Pooled (getPool) rather than a fresh player per note — a
 * chord's three notes constructing three brand-new native players in the
 * same instant is exactly the kind of tight temporal proximity that made
 * pooling necessary elsewhere (see createSamplePool's own doc), and
 * playChordSequence below calls this repeatedly in quick succession. */
export function playChord(notes: readonly Note[], options: ToneOptions = {}): void {
  const velocity = options.velocity ?? 0.35;
  notes.forEach((note) => getPool(resolveSample(NOTE_SAMPLES, note)).trigger(velocity));
}

/** How long one playChord() call audibly rings, by construction of
 * NOTE_SAMPLES's own render (see samples.ts's own doc) — playChordSequence
 * uses this to space consecutive chords far enough apart that one never
 * cuts the previous one's ring short. */
const CHORD_DURATION_SECONDS = 1.6;

interface ChordSequenceOptions extends ToneOptions {
  gapSeconds?: number;
}

/** Plays several chords one after another — e.g. triad-role-choice's tonic
 * reference followed by the target triad, so the player judges the
 * target's function relative to a just-heard tonic rather than in
 * isolation. Each chord's own notes still play simultaneously (playChord);
 * only the chords THEMSELVES are staggered, via the shared lookahead
 * scheduler (see scheduleAt's own doc) rather than plain setTimeout. */
export function playChordSequence(chords: readonly (readonly Note[])[], options: ChordSequenceOptions = {}): void {
  const gapSeconds = options.gapSeconds ?? 0.3;
  const stepSeconds = CHORD_DURATION_SECONDS + gapSeconds;
  const startAtMs = Date.now();
  chords.forEach((chord, index) => {
    scheduleAt(index * stepSeconds * 1000, () => playChord(chord, options), startAtMs);
  });
}
