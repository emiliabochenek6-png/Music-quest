/**
 * Pure-JS fundamental-frequency (pitch) estimation from raw PCM audio —
 * "Zaczarowany Solfeż"'s own microphone-graded singing exercises. Nothing
 * else in this app analyzes audio INPUT (every other lib/audio module only
 * ever plays sound); this is the one place that reads it. Standard
 * normalized-autocorrelation pitch detection (the same family of
 * technique behind browser-based tuners like Chrome Music Lab's) — no
 * native pitch-detection module exists for Expo Go, so this runs entirely
 * in JS against the raw float32 buffers expo-audio's useAudioStream hands
 * back from the microphone.
 */

/** Below a typical child/adult singing voice's lowest fundamental — a
 * detected "pitch" below this is almost always room noise or a plosive,
 * not a sung note. */
const MIN_FREQUENCY_HZ = 100;
/** Above a typical child's singing voice's highest comfortable fundamental
 * — this world's target notes (C4-C5) sit well under this, so the margin
 * is for pitch wobble/overshoot, not headroom for a genuinely different
 * range. */
const MAX_FREQUENCY_HZ = 900;
/** RMS below this (on a -1..1 float32 buffer) is treated as silence —
 * skipped rather than fed to autocorrelation, which would otherwise
 * happily "detect a pitch" in pure noise. */
const MIN_RMS = 0.01;
/** Normalized autocorrelation peak (peak lag's correlation ÷ the buffer's
 * own zero-lag energy) below this isn't a clear enough single pitch to
 * trust — breath noise, consonants, or a still-forming vowel onset. */
const MIN_CLARITY = 0.85;

/** Estimates the fundamental frequency of one short buffer via normalized
 * autocorrelation, or null if the buffer is too quiet or too unpitched to
 * trust. `sampleRate` must match the rate `buffer` was actually captured
 * at (see AudioStreamOptions.sampleRate on the caller's useAudioStream). */
export function detectPitchInWindow(buffer: Float32Array, sampleRate: number): number | null {
  const n = buffer.length;
  let energy = 0;
  for (let i = 0; i < n; i++) {
    energy += buffer[i] * buffer[i];
  }
  const rms = Math.sqrt(energy / n);
  if (rms < MIN_RMS) return null;

  const minLag = Math.floor(sampleRate / MAX_FREQUENCY_HZ);
  const maxLag = Math.min(Math.floor(sampleRate / MIN_FREQUENCY_HZ), n - 1);
  if (maxLag <= minLag) return null;

  let bestLag = -1;
  let bestCorrelation = 0;
  let correlationAtBestMinus1 = 0;
  let correlationAtBestPlus1 = 0;
  const correlationAt = (lag: number): number => {
    let sum = 0;
    for (let i = 0; i + lag < n; i++) {
      sum += buffer[i] * buffer[i + lag];
    }
    return sum;
  };

  for (let lag = minLag; lag <= maxLag; lag++) {
    const correlation = correlationAt(lag);
    if (correlation > bestCorrelation) {
      bestCorrelation = correlation;
      bestLag = lag;
    }
  }
  if (bestLag === -1) return null;

  const clarity = bestCorrelation / energy;
  if (clarity < MIN_CLARITY) return null;

  // Parabolic interpolation around the best lag's correlation and its two
  // neighbors, for sub-sample lag precision — without this, frequency
  // estimates would be quantized to sampleRate/integerLag steps, coarse
  // enough near MAX_FREQUENCY_HZ to misjudge a well-sung note as flat/sharp.
  correlationAtBestMinus1 = bestLag > minLag ? correlationAt(bestLag - 1) : bestCorrelation;
  correlationAtBestPlus1 = bestLag < maxLag ? correlationAt(bestLag + 1) : bestCorrelation;
  const denom = correlationAtBestMinus1 - 2 * bestCorrelation + correlationAtBestPlus1;
  const shift = denom !== 0 ? (0.5 * (correlationAtBestMinus1 - correlationAtBestPlus1)) / denom : 0;
  const refinedLag = bestLag + shift;

  return sampleRate / refinedLag;
}

const ANALYSIS_WINDOW_SIZE = 1024;
const ANALYSIS_HOP_SIZE = 512;

function median(values: readonly number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

/** Slides a short analysis window across a whole recorded take, collecting
 * one pitch estimate per window that clears detectPitchInWindow's silence/
 * clarity gates, and returns their median — robust against a handful of
 * bad windows (breath noise at the start, a stray octave-doubling error)
 * as long as most of a held note's windows agree, without needing a more
 * elaborate voiced/unvoiced segmentation than this app's use case (one
 * held note per take) actually calls for. Returns null if nothing in the
 * whole take cleared the gates — silence, or nothing resembling a sung
 * pitch. */
export function analyzeSungPitch(samples: Float32Array, sampleRate: number): number | null {
  const estimates: number[] = [];
  for (let start = 0; start + ANALYSIS_WINDOW_SIZE <= samples.length; start += ANALYSIS_HOP_SIZE) {
    const window = samples.subarray(start, start + ANALYSIS_WINDOW_SIZE);
    const estimate = detectPitchInWindow(window, sampleRate);
    if (estimate !== null) {
      estimates.push(estimate);
    }
  }
  if (estimates.length === 0) return null;
  return median(estimates);
}

export interface FreePhraseSegmentationOptions {
  /** How many notes the phrase has — up to this many results, in order,
   * one per sung note actually detected. */
  noteCount: number;
  /** A run of voiced (pitched) analysis windows shorter than this many
   * milliseconds is discarded as a stray blip (a plosive, a breath
   * catch) rather than counted as its own sung note attempt. */
  minSegmentMs?: number;
  /** A silent/unclear gap between two voiced runs shorter than this many
   * milliseconds is bridged — treated as still the SAME note — rather
   * than splitting one sustained note into two attempts. Natural
   * pitch-detection noise mid-note (a brief dip below MIN_CLARITY as a
   * vowel shifts) is common even mid-note; only a gap long enough to be a
   * genuine breath/pause between notes should start a new segment. */
  maxGapMs?: number;
  /** When true, a voiced run still going at the very END of `samples` is
   * NOT counted as a finished segment — see this function's own doc for
   * why the live, still-recording caller needs this and the normal
   * after-the-fact caller doesn't. Defaults to false (include it), which
   * is what grading a COMPLETE take wants: there IS no more audio coming,
   * so a take that ends mid-note is still that note's own real, final
   * attempt, not an artifact of when the caller happened to look. */
  excludeTrailingSegment?: boolean;
  /** Times (seconds since the start of `samples`) to treat as silence
   * regardless of what the audio there actually contains — see
   * CLICK_EXCLUSION_MARGIN_SECONDS's own doc for why and how wide a
   * margin gets muted around each one. exercise.gradeRhythm's own
   * metronome (see SolfegePhraseSingingExercise.tsx's own doc) is the
   * one caller of this today: its clicks play through the SAME device
   * the mic is recording from, so they can bleed into the take and get
   * mistaken for a sung note without this. */
  excludeAroundSeconds?: readonly number[];
}

const DEFAULT_MIN_SEGMENT_MS = 120;
const DEFAULT_MAX_GAP_MS = 150;

/** How much time (seconds, each side) around every excludeAroundSeconds
 * entry gets muted — wide enough to comfortably cover a short click
 * sample itself PLUS the unmeasurable-from-JS latency between "when the
 * metronome was told to start" and "when the recorder was told to
 * start" (each has its own independent, device-dependent audio-
 * subsystem startup delay — see analyzeFreeRhythmicPhrase's own doc for
 * why this app never trusts that gap to be zero for GRADING). This is
 * only ever used to blank out a known noise source, never to judge
 * timing, so erring wide is cheap — the worst case is losing a bit of
 * real singing right at a beat boundary, not a wrong verdict. */
const CLICK_EXCLUSION_MARGIN_SECONDS = 0.15;

function isExcludedHop(hopStartSeconds: number, excludeAroundSeconds: readonly number[] | undefined): boolean {
  if (!excludeAroundSeconds || excludeAroundSeconds.length === 0) return false;
  return excludeAroundSeconds.some((t) => Math.abs(hopStartSeconds - t) <= CLICK_EXCLUSION_MARGIN_SECONDS);
}

function windowRms(buffer: Float32Array): number {
  let energy = 0;
  for (let i = 0; i < buffer.length; i++) {
    energy += buffer[i] * buffer[i];
  }
  return Math.sqrt(energy / buffer.length);
}

interface VoicedSegment {
  startHop: number;
  endHop: number;
}

interface VoicedSegmentation {
  hopPitches: (number | null)[];
  hopDurationSeconds: number;
  segments: VoicedSegment[];
}

/** The actual voice-activity segmentation both analyzeFreeSungPhrase and
 * analyzeFreeRhythmicPhrase build on — pure bookkeeping over already-
 * computed hops (a cheap linear scan), unlike computing `hopPitches`/
 * `hopVoiced` themselves, which is where all the real (autocorrelation)
 * cost lives. Factored out so both a one-shot caller (findVoicedSegments,
 * computing every hop from scratch) and an incremental one
 * (segmentsFromLiveVoicedAnalysis, only ever adding NEW hops — see that
 * function's own doc) can re-derive segments as often as they like
 * without redoing the expensive part.
 *
 * Segment BOUNDARIES are found by loudness alone (the same MIN_RMS gate
 * detectPitchInWindow itself uses for silence, just without also
 * requiring MIN_CLARITY's much stricter "one clean pitch" bar) —
 * deliberately a lower bar than what a single WINDOW needs to contribute
 * a pitch estimate. A real sung note routinely has windows where the
 * autocorrelation clarity dips below MIN_CLARITY for a beat (a breathy
 * onset, a consonant, a vowel still settling) without ever actually going
 * quiet — an early, more tentative "do" is exactly where this shows up
 * most. Gating segmentation itself on clarity (an earlier version of this
 * did) meant those dips could fragment one held note into pieces too
 * short to count as a note at all, silently dropping it. Loudness alone
 * would also happily treat a loud non-periodic sound (a mic pop at
 * recording start, a stray thump) as its own "note" and shift every note
 * after it by one slot — so a segment only survives if at least one of
 * its own windows ALSO cleared MIN_CLARITY somewhere inside it, i.e. it
 * actually contained some real pitched content, not just volume. */
function deriveSegments(
  hopVoiced: readonly boolean[],
  hopPitches: readonly (number | null)[],
  hopDurationSeconds: number,
  options: { minSegmentMs?: number; maxGapMs?: number; excludeTrailingSegment?: boolean }
): VoicedSegment[] {
  const { minSegmentMs = DEFAULT_MIN_SEGMENT_MS, maxGapMs = DEFAULT_MAX_GAP_MS, excludeTrailingSegment = false } = options;
  const hopDurationMs = hopDurationSeconds * 1000;
  const maxGapHops = Math.round(maxGapMs / hopDurationMs);
  const minSegmentHops = Math.max(1, Math.round(minSegmentMs / hopDurationMs));

  const rawSegments: VoicedSegment[] = [];
  let runStart: number | null = null;
  let lastVoicedHop = -1;
  for (let hop = 0; hop < hopVoiced.length; hop++) {
    if (!hopVoiced[hop]) continue;
    if (runStart === null) {
      runStart = hop;
    } else if (hop - lastVoicedHop - 1 > maxGapHops) {
      rawSegments.push({ startHop: runStart, endHop: lastVoicedHop + 1 });
      runStart = hop;
    }
    lastVoicedHop = hop;
  }
  if (runStart !== null && !(excludeTrailingSegment && lastVoicedHop === hopVoiced.length - 1)) {
    rawSegments.push({ startHop: runStart, endHop: lastVoicedHop + 1 });
  }

  return rawSegments
    .filter((segment) => segment.endHop - segment.startHop >= minSegmentHops)
    .filter((segment) => {
      for (let hop = segment.startHop; hop < segment.endHop; hop++) {
        if (hopPitches[hop] !== null) return true;
      }
      return false;
    });
}

function findVoicedSegments(
  samples: Float32Array,
  sampleRate: number,
  options: { minSegmentMs?: number; maxGapMs?: number; excludeTrailingSegment?: boolean; excludeAroundSeconds?: readonly number[] }
): VoicedSegmentation {
  const hopPitches: (number | null)[] = [];
  const hopVoiced: boolean[] = [];
  const hopDurationSeconds = ANALYSIS_HOP_SIZE / sampleRate;
  let hop = 0;
  for (let start = 0; start + ANALYSIS_WINDOW_SIZE <= samples.length; start += ANALYSIS_HOP_SIZE, hop++) {
    if (isExcludedHop(hop * hopDurationSeconds, options.excludeAroundSeconds)) {
      hopPitches.push(null);
      hopVoiced.push(false);
      continue;
    }
    const window = samples.subarray(start, start + ANALYSIS_WINDOW_SIZE);
    hopPitches.push(detectPitchInWindow(window, sampleRate));
    hopVoiced.push(windowRms(window) >= MIN_RMS);
  }

  const segments = deriveSegments(hopVoiced, hopPitches, hopDurationSeconds, options);
  return { hopPitches, hopDurationSeconds, segments };
}

function segmentPitch(segment: VoicedSegment, hopPitches: readonly (number | null)[]): number | null {
  const pitches: number[] = [];
  for (let hop = segment.startHop; hop < segment.endHop; hop++) {
    const pitch = hopPitches[hop];
    if (pitch !== null) pitches.push(pitch);
  }
  return pitches.length > 0 ? median(pitches) : null;
}

/** One pitch estimate per index in `segments`, up to `noteCount` results
 * (padded with null beyond however many segments actually exist) — the
 * shared "segment → per-note pitch list" step both analyzeFreeSungPhrase
 * and the live incremental path (segmentsFromLiveVoicedAnalysis's own
 * caller) need. */
function pitchesForSegments(segments: readonly VoicedSegment[], hopPitches: readonly (number | null)[], noteCount: number): (number | null)[] {
  const results: (number | null)[] = [];
  for (let index = 0; index < noteCount; index++) {
    const segment = segments[index];
    results.push(segment ? segmentPitch(segment, hopPitches) : null);
  }
  return results;
}

/** Carries one take's hop-level voiced/pitch analysis across repeated
 * calls to extendLiveVoicedAnalysis — see that function's own doc. Opaque
 * to callers beyond passing it straight through; construct one with
 * createLiveVoicedAnalysisState() per take. */
export interface LiveVoicedAnalysisState {
  hopPitches: (number | null)[];
  hopVoiced: boolean[];
}

export function createLiveVoicedAnalysisState(): LiveVoicedAnalysisState {
  return { hopPitches: [], hopVoiced: [] };
}

/** The fix for the live per-note check's own documented cost problem (see
 * SolfegePhraseSingingExercise.tsx's own doc): a naive live caller that
 * re-runs findVoicedSegments over the WHOLE take-so-far on every poll
 * redoes detectPitchInWindow's autocorrelation — by far the most expensive
 * part of this module — for every hop already analyzed on an earlier poll,
 * making total work across a take grow quadratically with its length
 * (visibly enough to stutter on-device for level 4's longer, metronome-
 * accompanied takes). This does that expensive per-hop work EXACTLY ONCE
 * per hop no matter how many times it's called as `samples` keeps growing
 * poll to poll: it only computes hops from where `state` already left off
 * (`state.hopPitches.length`) onward, appending to `state` in place.
 * Always pass the FULL samples-so-far array (not just the newest tail) —
 * already-covered hops are skipped in O(1), and hop windows need the
 * genuine absolute sample offsets to line up with a later one-shot
 * analysis of the finished take. Call segmentsFromLiveVoicedAnalysis
 * afterward to turn the extended `state` into segments — that part stays
 * cheap (a linear scan, no autocorrelation) and is fine to re-run every
 * poll even though this function itself does no repeat work.
 *
 * `excludeAroundSeconds` — see FreePhraseSegmentationOptions's own doc —
 * mutes hops around known noise-source times (a gradeRhythm exercise's
 * own metronome click bleeding into the mic) the exact same way
 * findVoicedSegments's one-shot analysis does; pass the SAME list on
 * every call for a given take (it's cheap to re-check, and only ever
 * matters for hops not yet computed anyway). */
export function extendLiveVoicedAnalysis(
  state: LiveVoicedAnalysisState,
  samples: Float32Array,
  sampleRate: number,
  excludeAroundSeconds?: readonly number[]
): void {
  const hopDurationSeconds = ANALYSIS_HOP_SIZE / sampleRate;
  let hop = state.hopPitches.length;
  let start = hop * ANALYSIS_HOP_SIZE;
  while (start + ANALYSIS_WINDOW_SIZE <= samples.length) {
    if (isExcludedHop(hop * hopDurationSeconds, excludeAroundSeconds)) {
      state.hopPitches.push(null);
      state.hopVoiced.push(false);
    } else {
      const window = samples.subarray(start, start + ANALYSIS_WINDOW_SIZE);
      state.hopPitches.push(detectPitchInWindow(window, sampleRate));
      state.hopVoiced.push(windowRms(window) >= MIN_RMS);
    }
    hop += 1;
    start = hop * ANALYSIS_HOP_SIZE;
  }
}

/** Derives segments (and per-note pitches) from a state
 * extendLiveVoicedAnalysis has been extending — the live counterpart to
 * analyzeFreeSungPhrase, but working off already-computed hops instead of
 * re-running the expensive analysis on the whole take-so-far. See
 * extendLiveVoicedAnalysis's own doc for the full incremental design. */
export function segmentsFromLiveVoicedAnalysis(
  state: LiveVoicedAnalysisState,
  sampleRate: number,
  options: { noteCount: number; minSegmentMs?: number; maxGapMs?: number; excludeTrailingSegment?: boolean }
): (number | null)[] {
  const { noteCount, ...segmentationOptions } = options;
  const hopDurationSeconds = ANALYSIS_HOP_SIZE / sampleRate;
  const segments = deriveSegments(state.hopVoiced, state.hopPitches, hopDurationSeconds, segmentationOptions);
  return pitchesForSegments(segments, state.hopPitches, noteCount);
}

/** How many of the most recent (consecutive, still-voiced) hops
 * recentVoicedPitch medians together — see that function's own doc for
 * why a single hop isn't enough. A handful of hops (tens of ms) still
 * reads as "right now" to a live tuner, unlike waiting for a whole
 * segment (which can be hundreds of ms) to finish. */
const LIVE_TUNER_SMOOTHING_HOPS = 5;

/** A live tuner readout needs SOME pitch estimate for "what's being sung
 * RIGHT NOW", but a single hop's raw detectPitchInWindow estimate — only
 * ANALYSIS_WINDOW_SIZE samples, a few tens of ms — is noisier and more
 * prone to an occasional octave/formant misread (autocorrelation locking
 * onto a harmonic-driven peak at the WRONG lag for an instant) than the
 * median-over-a-whole-segment approach segmentPitch already uses for
 * actual grading — real enough on-device to visibly misreport a steadily
 * held note's syllable for a tick or two. This medians the last
 * LIVE_TUNER_SMOOTHING_HOPS hops of the CURRENT voiced run instead —
 * stopping at the run's own start (a silent hop, or the very start of the
 * take), so it never reaches back into a previous note or a breath — the
 * same "median survives a handful of bad estimates" robustness
 * segmentPitch already relies on, just over a short trailing window
 * instead of a whole finished segment. Returns null while the mic hears
 * silence (nothing voiced to median over). */
export function recentVoicedPitch(state: LiveVoicedAnalysisState, maxHops: number = LIVE_TUNER_SMOOTHING_HOPS): number | null {
  const { hopVoiced, hopPitches } = state;
  const pitches: number[] = [];
  for (let hop = hopVoiced.length - 1; hop >= 0 && pitches.length < maxHops; hop--) {
    if (!hopVoiced[hop]) break;
    const pitch = hopPitches[hop];
    if (pitch !== null) pitches.push(pitch);
  }
  return pitches.length > 0 ? median(pitches) : null;
}

/** Recovers one pitch estimate per sung note from a single free-form take
 * — no metronome, no fixed pacing — by finding contiguous runs of voiced
 * windows (findVoicedSegments) and treating each run as one note attempt,
 * in the order they were sung. This is "Zaczarowany Solfeż" level 1's own
 * whole-phrase exercise's grading step: the player sings a fixed sequence
 * (e.g. the whole scale) as one continuous take at their own pace,
 * however they naturally separate the notes (a small breath, a tiny gap
 * in the vowel) — unlike the old metronome-paced design this replaces,
 * there's no fixed clock to slice the recording by, so segmentation has
 * to be voice-activity-driven instead of time-driven.
 *
 * Only the first `noteCount` surviving segments are used (extra trailing
 * sound — e.g. the player humming after finishing — is ignored); if
 * fewer than `noteCount` segments were actually sung (a short/incomplete
 * take), the remaining slots report null, the same "couldn't determine a
 * pitch" meaning null already carries elsewhere in this module. */
export function analyzeFreeSungPhrase(samples: Float32Array, sampleRate: number, options: FreePhraseSegmentationOptions): (number | null)[] {
  const { noteCount, ...segmentationOptions } = options;
  const { hopPitches, segments } = findVoicedSegments(samples, sampleRate, segmentationOptions);
  return pitchesForSegments(segments, hopPitches, noteCount);
}

export interface RhythmicNoteResult {
  frequencyHz: number | null;
  rhythmCorrect: boolean;
}

export interface FreeRhythmicPhraseOptions extends FreePhraseSegmentationOptions {
  /** Each note's expected length in BEATS (not seconds — e.g. NOTE_VALUE_BEATS
   * from lib/rhythm/valueBeats.ts: quarter=1, half=2, whole=4), same
   * length/order as `noteCount`. Only ever compared to each OTHER, never
   * to any absolute clock — see this function's own doc for why. */
  noteBeats: number[];
  /** How far a note's own actual-duration-to-expected-duration ratio may
   * sit from 1.0 (after normalizing by the take's own implied tempo)
   * before its rhythm counts as wrong — [lowRatio, highRatio]. Deliberately
   * asymmetric-friendly (a half note sung as a quarter is a bigger, more
   * obviously-wrong miss than singing a quarter slightly long), and wide
   * enough that an untrained singer's natural imprecision passes, while
   * still catching "sang a whole note like a quarter" or vice versa. */
  rhythmRatioRange?: [number, number];
}

const DEFAULT_RHYTHM_RATIO_RANGE: [number, number] = [0.5, 1.8];

/** "Zaczarowany Solfeż" level 4's own grading step — the SAME free-tempo,
 * no-metronome segmentation analyzeFreeSungPhrase uses (findVoicedSegments:
 * boundaries discovered from the recording's own pauses, not from any
 * fixed clock), but ALSO reports whether each note was held for roughly
 * its own RELATIVE length compared to the others — a half note actually
 * about twice as long as a neighboring quarter, a whole note about four
 * times as long — without ever assuming the singer's absolute tempo or
 * needing any metronome to establish one.
 *
 * An earlier version of level 4 instead played a real metronome and
 * compared each note against a fixed, metronome-derived clock
 * (`analyzeRhythmicPhrase`, since removed) — that turned out fragile on a
 * real device in more than one way (recorder-start-vs-metronome-start
 * latency, and ongoing tempo drift as a beginner's own pace wandered away
 * from the click track over a take) badly enough that takes which were
 * genuinely well sung still failed. This version sidesteps ALL of that by
 * never assuming an absolute clock in the first place: it first finds
 * each segment's own actual duration (in seconds) the exact same
 * voice-activity way analyzeFreeSungPhrase does, then derives the
 * take's OWN implied tempo from the ratio of total sung time to total
 * expected beats across every note that was actually found (so the
 * player's own natural pace becomes the yardstick, not a click track),
 * and finally checks each note's own duration against what THAT implied
 * tempo predicts for its note value. Two segments in a 2:1 duration ratio
 * read as correct whether the singer's own pace was fast or slow — only
 * the RELATIVE proportions between notes are ever graded, matching how a
 * human listener would actually judge "was that held twice as long".
 *
 * A note with no detected segment (not sung, or not recognized) reports
 * both a null pitch and rhythmCorrect: false — consistent with
 * analyzeFreeSungPhrase's own "couldn't determine a pitch" meaning, and
 * moot for grading anyway since validate.ts's own solfege-phrase-singing
 * case already requires a non-null pitch before it even looks at
 * rhythmCorrect. If FEWER than two notes were sung at all, there's
 * nothing to derive an implied tempo from a ratio of — every note reports
 * rhythmCorrect: false in that case (not enough data to judge relative
 * timing from a single data point). */
export function analyzeFreeRhythmicPhrase(samples: Float32Array, sampleRate: number, options: FreeRhythmicPhraseOptions): RhythmicNoteResult[] {
  const { noteCount, noteBeats, rhythmRatioRange = DEFAULT_RHYTHM_RATIO_RANGE, ...segmentationOptions } = options;
  const [lowRatio, highRatio] = rhythmRatioRange;
  const { hopPitches, hopDurationSeconds, segments } = findVoicedSegments(samples, sampleRate, segmentationOptions);

  const matched: { index: number; durationSeconds: number; beats: number }[] = [];
  for (let index = 0; index < noteCount; index++) {
    const segment = segments[index];
    if (!segment) continue;
    matched.push({ index, durationSeconds: (segment.endHop - segment.startHop) * hopDurationSeconds, beats: noteBeats[index] });
  }

  const totalDurationSeconds = matched.reduce((sum, entry) => sum + entry.durationSeconds, 0);
  const totalBeats = matched.reduce((sum, entry) => sum + entry.beats, 0);
  // Fewer than two sung notes (or zero expected beats, which shouldn't
  // happen for real content but guards the division regardless) means
  // there's no meaningful RATIO to derive an implied tempo from.
  const impliedSecondsPerBeat = matched.length >= 2 && totalBeats > 0 ? totalDurationSeconds / totalBeats : null;

  const results: RhythmicNoteResult[] = [];
  for (let index = 0; index < noteCount; index++) {
    const segment = segments[index];
    if (!segment) {
      results.push({ frequencyHz: null, rhythmCorrect: false });
      continue;
    }
    const frequencyHz = segmentPitch(segment, hopPitches);
    let rhythmCorrect = false;
    if (impliedSecondsPerBeat !== null) {
      const actualSeconds = (segment.endHop - segment.startHop) * hopDurationSeconds;
      const expectedSeconds = noteBeats[index] * impliedSecondsPerBeat;
      const ratio = expectedSeconds > 0 ? actualSeconds / expectedSeconds : 0;
      rhythmCorrect = ratio >= lowRatio && ratio <= highRatio;
    }
    results.push({ frequencyHz, rhythmCorrect });
  }
  return results;
}

/** Joins the Float32Array chunks a live AudioStream hands over one buffer
 * at a time into a single contiguous take, for analyzeSungPitch and WAV
 * encoding to both work against. */
export function concatFloat32(chunks: readonly Float32Array[]): Float32Array {
  const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const result = new Float32Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}
