import { Asset } from "expo-asset";
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

// expo-audio's web player is a plain HTMLAudioElement under the hood
// (`new Audio(uri)`, `media.loop = true`) — and HTMLAudioElement's own
// native loop is well-documented as NOT gapless in every browser: the
// seek-back-to-0 the browser does when playback reaches the end isn't
// instantaneous, so an audible gap (confirmed in practice — a "lekka
// cisza", a beat's worth of extra silence, right at the loop seam) lands
// on top of whatever silence the loop's own content already has, exactly
// once per repeat. The Web Audio API's AudioBufferSourceNode doesn't have
// this problem: it loops an already-decoded in-memory buffer with sample
// accuracy, no re-seek/re-decode step at all. getWebAudioLoopContext
// exists so playLoopingSample can reach for that path on web specifically
// (native iOS/Android's own AVAudioPlayer/ExoPlayer-backed loop doesn't
// have the HTMLAudioElement problem this exists to route around, so they
// keep using expo-audio's own `loop = true` unchanged).
let webAudioLoopContext: AudioContext | null | undefined;

function getWebAudioLoopContext(): AudioContext | null {
  if (webAudioLoopContext !== undefined) return webAudioLoopContext;
  if (typeof window === "undefined") {
    webAudioLoopContext = null;
    return webAudioLoopContext;
  }
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  webAudioLoopContext = Ctor ? new Ctor() : null;
  return webAudioLoopContext;
}

// One decode per distinct source, reused across every playLoopingSample
// call for it — fetch+decodeAudioData is real work (a network round trip
// plus PCM decoding) that would otherwise repeat on every single dot
// toggle-on.
const decodedLoopBuffers = new Map<number, Promise<AudioBuffer>>();

function decodeLoopBuffer(context: AudioContext, source: number): Promise<AudioBuffer> {
  let cached = decodedLoopBuffers.get(source);
  if (!cached) {
    cached = Asset.fromModule(source)
      .downloadAsync()
      .then((asset) => fetch(asset.localUri ?? asset.uri))
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => context.decodeAudioData(arrayBuffer));
    cached.catch(() => decodedLoopBuffers.delete(source));
    decodedLoopBuffers.set(source, cached);
  }
  return cached;
}

/** Plays one pre-rendered sample on a seamless loop — for a "steady click
 * track running indefinitely" need (the standalone-metronome dot's own
 * MetronomeIndicator toggle — see RhythmDictationExercise/
 * RhythmNotationTapExercise's own toggleStandaloneMetronome), this is
 * categorically more even than scheduling hundreds of individual one-shot
 * triggers through lib/audio/rhythmPlayer.ts's own lookahead scheduler +
 * sample-pool reuse: there's no JS timer, no pool, no repeated seekTo(0)
 * race to ever land unluckily on (see createSamplePool's own doc for that
 * whole class of problem). On web, uses the Web Audio API directly (see
 * getWebAudioLoopContext's own doc for why — expo-audio's own web
 * `loop = true` isn't actually gapless there); everywhere else, expo-
 * audio's native `loop = true` is already gapless, so this just sets that
 * flag and presses play. `source` must already BE exactly one loop's
 * worth of audio with no leading/trailing silence beyond what the
 * rhythm itself calls for (see lib/audio/samples.ts's own
 * METRONOME_LOOP_*_120BPM doc) — this function doesn't trim or crossfade
 * anything. Same activeStops/stop() shape as playSample, minus onFinish
 * (a loop never finishes on its own). */
export function playLoopingSample(source: number, velocity: number): SamplePlaybackHandle {
  const webContext = getWebAudioLoopContext();
  if (webContext) {
    let settled = false;
    let node: AudioBufferSourceNode | null = null;
    const gainNode = webContext.createGain();
    gainNode.gain.value = velocity;
    gainNode.connect(webContext.destination);

    function stop(): void {
      if (settled) return;
      settled = true;
      activeStops.delete(stop);
      try {
        node?.stop();
      } catch {
        // Never actually started (stopped while still decoding) — nothing to stop.
      }
      node?.disconnect();
      gainNode.disconnect();
    }

    activeStops.add(stop);
    // A fresh AudioContext can start "suspended" under a browser's
    // autoplay policy — resume() is a no-op if it's already running, and
    // this call always originates from a real tap (the dot's own
    // onPress), so the browser's own gesture requirement is already
    // satisfied by the time this runs.
    void webContext.resume();
    void decodeLoopBuffer(webContext, source).then((buffer) => {
      if (settled) return;
      node = webContext.createBufferSource();
      node.buffer = buffer;
      node.loop = true;
      node.connect(gainNode);
      node.start();
    });
    return { stop };
  }

  const player = createAudioPlayer(source);
  player.volume = velocity;
  player.loop = true;
  let settled = false;

  function stop(): void {
    if (settled) return;
    settled = true;
    activeStops.delete(stop);
    try {
      player.pause();
      player.remove();
    } catch {
      // Already removed via some other teardown path — nothing left to stop.
    }
  }

  activeStops.add(stop);
  player.play();
  return { stop };
}

export interface WebAudioTrackEvent {
  source: number;
  /** When this one-shot starts, in ms from the shared `anchorMs` this
   * event's own track is scheduled against — NOT from "now" (see
   * playWebAudioTrack's own doc). */
  delayMs: number;
  velocity: number;
  /** When set, the node is cut off this many ms after its own start —
   * lib/audio/rhythmPlayer.ts's playMelodicRhythm uses this for a note's
   * written hold time (a half note actually sustains twice as long as a
   * quarter note), same idea as playSample+handle.stop() on the native
   * path, but sample-accurate since Web Audio schedules the stop
   * directly on the audio clock instead of a JS timer racing it. */
  durationMs?: number;
}

/** A few ms of head-room between "buffers are decoded" and "first note
 * starts", so every node in a track is created and scheduled against the
 * audio clock BEFORE the first one is due. */
const WEB_AUDIO_TRACK_LEAD_SECONDS = 0.02;

/** THE single web-audio playback primitive every multi-note/multi-click
 * sound in this app schedules through — one metronome click track, one
 * clap pattern, one melody, one interval, one chord (sequence or
 * simultaneous), one dance-fragment oom-pah accompaniment, all go through
 * this exact same function, never a mix of this and the pooled/scheduleAt
 * path on the same platform. Every event's own start time is computed
 * from ONE shared `anchorMs` (a schedulerNow()-space timestamp, usually
 * "now" but sometimes a slightly earlier anchor two simultaneous tracks —
 * e.g. playMetronomeWithClaps' click grid and clap pattern — both share,
 * so they land on the exact same audio-clock origin instead of two
 * independent calls drifting apart by however many JS steps separate
 * them), converted to Web Audio's own `AudioContext.currentTime` clock
 * once, here, rather than by every caller.
 *
 * This exists because expo-audio's web backend is a plain HTMLAudioElement
 * per sound (`new Audio(uri)`), and constructing/`play()`ing one has its
 * own variable latency — paying that cost at the moment each note is due,
 * once per note, is exactly what made a click track, a clap pattern, a
 * melody or an interval sound uneven/"zacinające się" on web (the same
 * class of problem playLoopingSample's own doc describes for the
 * metronome dot's loop). The Web Audio API doesn't have this problem:
 * every node here is built from an already-decoded, cached AudioBuffer
 * (see decodeLoopBuffer) and started via `node.start(when)` on the audio
 * hardware's own sample-accurate clock — no JS timer, no per-note
 * construction latency, however many notes are in the track.
 *
 * Returns false when there's no Web Audio context (native iOS/Android,
 * or this module evaluating during static web export) — the caller runs
 * its normal pooled/scheduleAt path instead, which native platforms
 * don't share this problem on (AVAudioPlayer/ExoPlayer, not
 * HTMLAudioElement). `fallback` runs instead if decoding a sample fails,
 * so a broken fetch never leaves the exercise silently mute. */
export function playWebAudioTrack(events: readonly WebAudioTrackEvent[], anchorMs: number, fallback: () => void): boolean {
  const context = getWebAudioLoopContext();
  if (!context) return false;
  void context.resume();
  let settled = false;
  const voices: { node: AudioBufferSourceNode; gain: GainNode }[] = [];
  const nowMs = schedulerNow();

  function stop(): void {
    if (settled) return;
    settled = true;
    activeStops.delete(stop);
    voices.forEach(({ node, gain }) => {
      try {
        node.stop();
      } catch {
        // Already ended — nothing to stop.
      }
      node.disconnect();
      gain.disconnect();
    });
  }

  activeStops.add(stop);
  void Promise.all(events.map((event) => decodeLoopBuffer(context, event.source)))
    .then((buffers) => {
      if (settled) return;
      const baseContextTime = context.currentTime + WEB_AUDIO_TRACK_LEAD_SECONDS;
      let remaining = events.length;
      events.forEach((event, index) => {
        const node = context.createBufferSource();
        node.buffer = buffers[index];
        const gain = context.createGain();
        gain.gain.value = event.velocity;
        node.connect(gain);
        gain.connect(context.destination);
        node.onended = () => {
          node.disconnect();
          gain.disconnect();
          remaining--;
          if (remaining === 0) {
            settled = true;
            activeStops.delete(stop);
          }
        };
        // anchorMs + delayMs is this event's due time in schedulerNow()-
        // space; nowMs (captured once, above, before the async decode)
        // is this call's own origin in that same space — the difference
        // between them is how far in the future (or, if a slow decode
        // ate into it, already-past — clamped to 0, i.e. "as soon as
        // possible") this event's start is from right now.
        const startAtSec = baseContextTime + Math.max(0, anchorMs + event.delayMs - nowMs) / 1000;
        node.start(startAtSec);
        if (event.durationMs !== undefined) {
          node.stop(startAtSec + event.durationMs / 1000);
        }
        voices.push({ node, gain });
      });
    })
    .catch(() => {
      if (settled) return;
      settled = true;
      activeStops.delete(stop);
      fallback();
    });
  return true;
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

/** A monotonic clock for scheduling — `performance.now()` when available
 * (React Native/Hermes and every web target this app ships to both
 * provide it), falling back to `Date.now()` only if it genuinely isn't
 * there. `Date.now()` is wall-clock time: it can jump (an NTP
 * correction, the device's clock being adjusted, DST) without warning,
 * and every `dueAtMs` already scheduled would jump with it — a metronome
 * that's been ticking steadily suddenly skips or stalls. `performance.
 * now()` only ever moves forward at a steady rate, immune to that class
 * of glitch, which is exactly what a scheduler computing every event's
 * due time up front (see the block doc below) needs from its clock.
 * Every scheduling anchor in this module and lib/audio/rhythmPlayer.ts's
 * own call sites goes through this SAME function — mixing it with
 * Date.now() anywhere in that chain would silently reintroduce the
 * problem by comparing two clocks with different epochs. */
export function schedulerNow(): number {
  return typeof performance !== "undefined" && typeof performance.now === "function" ? performance.now() : Date.now();
}

interface ScheduledAudioEvent {
  dueAtMs: number;
  fire: () => void;
}

const SCHEDULER_TICK_MS = 3;
let scheduledEvents: ScheduledAudioEvent[] = [];
let schedulerHandle: ReturnType<typeof setInterval> | null = null;

function runSchedulerTick(): void {
  const now = schedulerNow();
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
export function scheduleAt(delayMs: number, fire: () => void, anchorMs: number = schedulerNow()): void {
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

export function playNote(note: Note, options: ToneOptions = {}): void {
  const velocity = options.velocity ?? 0.6;
  const source = resolveSample(NOTE_SAMPLES, note);
  if (playWebAudioTrack([{ source, delayMs: 0, velocity }], schedulerNow(), () => playSample(source, velocity))) return;
  playSample(source, velocity);
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
  const sources = notes.map((note) => resolveSample(MELODY_NOTE_SAMPLES, note));
  const anchorMs = schedulerNow();
  const playScheduled = () => {
    sources.forEach((source, index) => {
      scheduleAt(index * stepSeconds * 1000, () => getPool(source).trigger(velocity), anchorMs);
    });
  };
  const events = sources.map((source, index) => ({ source, delayMs: index * stepSeconds * 1000, velocity }));
  if (!playWebAudioTrack(events, anchorMs, playScheduled)) playScheduled();
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
  const sources = notes.map((note) => resolveSample(NOTE_SAMPLES, note));
  const playPooled = () => sources.forEach((source) => getPool(source).trigger(velocity));
  if (!playWebAudioTrack(sources.map((source) => ({ source, delayMs: 0, velocity })), schedulerNow(), playPooled)) playPooled();
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
  const velocity = options.velocity ?? 0.35;
  const anchorMs = schedulerNow();
  const events = chords.flatMap((chord, index) =>
    chord.map((note) => ({ source: resolveSample(NOTE_SAMPLES, note), delayMs: index * stepSeconds * 1000, velocity }))
  );
  const playScheduled = () => {
    chords.forEach((chord, index) => {
      scheduleAt(index * stepSeconds * 1000, () => playChord(chord, options), anchorMs);
    });
  };
  if (!playWebAudioTrack(events, anchorMs, playScheduled)) playScheduled();
}
