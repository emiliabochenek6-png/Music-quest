import { createAudioPlayer } from "expo-audio";
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

function playSampleFrom(samples: Record<string, number>, note: Note, velocity: number): void {
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
  playSample(source, velocity);
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
 * notes never audibly overlap. Driven by setTimeout rather than a sample-
 * accurate scheduling clock (no such clock exists on this stack, unlike
 * the web app's own Web-Audio-scheduled version this mirrors the timing
 * shape of). */
export function playMelody(notes: readonly Note[], options: MelodyOptions = {}): void {
  const gapSeconds = options.gapSeconds ?? 0.05;
  const stepSeconds = MELODY_NOTE_DURATION_SECONDS + gapSeconds;
  notes.forEach((note, index) => {
    setTimeout(() => playSampleFrom(MELODY_NOTE_SAMPLES, note, options.velocity ?? 0.7), index * stepSeconds * 1000);
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
 * playInterval/playMelody, every note here starts at once (no setTimeout
 * stagger), because a chord's whole identity is three pitches sounding
 * together. Uses NOTE_SAMPLES (the long ~1.6s ring, not MELODY_NOTE_
 * SAMPLES's short fade) so the chord actually sustains like one. Each
 * note plays a bit quieter than a single playNote() call by default,
 * since three simultaneous samples summed together read as louder than
 * any one of them alone. */
export function playChord(notes: readonly Note[], options: ToneOptions = {}): void {
  notes.forEach((note) => playSampleFrom(NOTE_SAMPLES, note, options.velocity ?? 0.35));
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
 * only the chords THEMSELVES are staggered, same setTimeout shape as
 * playMelody. */
export function playChordSequence(chords: readonly (readonly Note[])[], options: ChordSequenceOptions = {}): void {
  const gapSeconds = options.gapSeconds ?? 0.3;
  const stepSeconds = CHORD_DURATION_SECONDS + gapSeconds;
  chords.forEach((chord, index) => {
    setTimeout(() => playChord(chord, options), index * stepSeconds * 1000);
  });
}
