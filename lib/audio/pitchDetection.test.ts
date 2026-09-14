import { describe, expect, it } from "@jest/globals";
import {
  analyzeFreeRhythmicPhrase,
  analyzeFreeSungPhrase,
  analyzeSungPitch,
  concatFloat32,
  createLiveVoicedAnalysisState,
  detectPitchInWindow,
  extendLiveVoicedAnalysis,
  recentVoicedPitch,
  segmentsFromLiveVoicedAnalysis,
} from "@/lib/audio/pitchDetection";

const SAMPLE_RATE = 16000;

function sineWave(frequencyHz: number, durationSeconds: number, sampleRate = SAMPLE_RATE, amplitude = 0.4): Float32Array {
  const length = Math.floor(durationSeconds * sampleRate);
  const samples = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    samples[i] = amplitude * Math.sin((2 * Math.PI * frequencyHz * i) / sampleRate);
  }
  return samples;
}

describe("detectPitchInWindow", () => {
  it("recovers a pure sine tone's frequency within 1%", () => {
    for (const frequencyHz of [130.81, 220, 261.63, 329.63, 440, 523.25]) {
      const window = sineWave(frequencyHz, 1024 / SAMPLE_RATE + 0.05);
      const detected = detectPitchInWindow(window.subarray(0, 1024), SAMPLE_RATE);
      expect(detected).not.toBeNull();
      expect(Math.abs(detected! - frequencyHz) / frequencyHz).toBeLessThan(0.01);
    }
  });

  it("returns null for silence", () => {
    const silence = new Float32Array(1024);
    expect(detectPitchInWindow(silence, SAMPLE_RATE)).toBeNull();
  });

  it("returns null for white noise (no clear pitch)", () => {
    const noise = new Float32Array(1024);
    for (let i = 0; i < noise.length; i++) noise[i] = (Math.random() - 0.5) * 0.5;
    expect(detectPitchInWindow(noise, SAMPLE_RATE)).toBeNull();
  });
});

describe("analyzeSungPitch", () => {
  it("recovers a held tone's frequency from a multi-window take within 1%", () => {
    const take = sineWave(523.25, 2); // C5, 2 seconds
    const detected = analyzeSungPitch(take, SAMPLE_RATE);
    expect(detected).not.toBeNull();
    expect(Math.abs(detected! - 523.25) / 523.25).toBeLessThan(0.01);
  });

  it("is robust to a noisy onset before the sung tone settles", () => {
    const noiseOnset = new Float32Array(Math.floor(0.2 * SAMPLE_RATE));
    for (let i = 0; i < noiseOnset.length; i++) noiseOnset[i] = (Math.random() - 0.5) * 0.5;
    const tone = sineWave(392, 1.5); // G4
    const take = concatFloat32([noiseOnset, tone]);
    const detected = analyzeSungPitch(take, SAMPLE_RATE);
    expect(detected).not.toBeNull();
    expect(Math.abs(detected! - 392) / 392).toBeLessThan(0.01);
  });

  it("returns null for a take that's silence throughout", () => {
    const take = new Float32Array(SAMPLE_RATE); // 1s of silence
    expect(analyzeSungPitch(take, SAMPLE_RATE)).toBeNull();
  });
});

describe("analyzeFreeSungPhrase", () => {
  const SCALE_HZ = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25]; // C4-C5 major scale
  const NOTE_SECONDS = 0.35;
  const GAP_SECONDS = 0.25; // a genuine breath between notes — well over the default maxGapMs

  function buildFreeTake(frequenciesHz: readonly number[]): Float32Array {
    const gap = new Float32Array(Math.round(GAP_SECONDS * SAMPLE_RATE));
    const chunks: Float32Array[] = [];
    frequenciesHz.forEach((freq, index) => {
      if (index > 0) chunks.push(gap);
      chunks.push(sineWave(freq, NOTE_SECONDS));
    });
    return concatFloat32(chunks);
  }

  it("recovers all 8 notes of a freely sung scale, in order, with no fixed pacing", () => {
    const take = buildFreeTake(SCALE_HZ);
    const detected = analyzeFreeSungPhrase(take, SAMPLE_RATE, { noteCount: 8 });
    expect(detected).toHaveLength(8);
    detected.forEach((freq, index) => {
      expect(freq).not.toBeNull();
      expect(Math.abs(freq! - SCALE_HZ[index]) / SCALE_HZ[index]).toBeLessThan(0.01);
    });
  });

  it("bridges a brief mid-note dip instead of splitting one held note into two", () => {
    const dip = new Float32Array(Math.round(0.05 * SAMPLE_RATE)); // 50ms silence, well under the default maxGapMs
    const take = concatFloat32([
      sineWave(440, NOTE_SECONDS),
      dip,
      sineWave(440, NOTE_SECONDS), // still the same note 440 — just a hiccup mid-take
      new Float32Array(Math.round(GAP_SECONDS * SAMPLE_RATE)), // a real breath before the next note
      sineWave(523.25, NOTE_SECONDS),
    ]);
    const detected = analyzeFreeSungPhrase(take, SAMPLE_RATE, { noteCount: 3 });
    // If the dip had wrongly split note 1 into two segments, detected[1]
    // would come back ~440 (the dip's second half) instead of the real
    // second note, and detected[2] would be non-null instead of null.
    expect(Math.abs(detected[0]! - 440) / 440).toBeLessThan(0.01);
    expect(Math.abs(detected[1]! - 523.25) / 523.25).toBeLessThan(0.01);
    expect(detected[2]).toBeNull();
  });

  it("recovers a note despite a noisy (low-clarity) but still loud stretch mid-note — the real 'first note sung softly' failure mode", () => {
    const sampleCount = Math.round(0.18 * SAMPLE_RATE);
    const noisyMidNote = new Float32Array(sampleCount);
    for (let i = 0; i < sampleCount; i++) {
      // A held tone with enough noise mixed in to push autocorrelation
      // clarity below MIN_CLARITY (masking the periodicity), while RMS
      // stays just as loud as a clean tone — this is what an earlier,
      // clarity-gated version of segmentation would have read as
      // "silence" and used to fragment the note, even though the singer
      // never actually stopped or went quiet.
      noisyMidNote[i] = 0.3 * Math.sin((2 * Math.PI * 261.63 * i) / SAMPLE_RATE) + (Math.random() - 0.5) * 0.6;
    }
    const take = concatFloat32([
      sineWave(261.63, NOTE_SECONDS), // do — starts clean
      noisyMidNote, // still do, just noisy/breathy for a stretch
      sineWave(261.63, NOTE_SECONDS), // still do
      new Float32Array(Math.round(GAP_SECONDS * SAMPLE_RATE)),
      sineWave(293.66, NOTE_SECONDS), // re
    ]);
    const detected = analyzeFreeSungPhrase(take, SAMPLE_RATE, { noteCount: 2 });
    expect(Math.abs(detected[0]! - 261.63) / 261.63).toBeLessThan(0.01);
    expect(Math.abs(detected[1]! - 293.66) / 293.66).toBeLessThan(0.01);
  });

  it("does not miscount a loud but non-periodic transient (e.g. a mic pop) as its own note", () => {
    const popSamples = Math.round(0.18 * SAMPLE_RATE); // loud, long enough to clear minSegmentMs — but pure noise, no periodicity at all
    const pop = new Float32Array(popSamples);
    for (let i = 0; i < popSamples; i++) pop[i] = (Math.random() - 0.5) * 0.9;
    const take = concatFloat32([
      pop,
      new Float32Array(Math.round(GAP_SECONDS * SAMPLE_RATE)),
      sineWave(261.63, NOTE_SECONDS), // do
      new Float32Array(Math.round(GAP_SECONDS * SAMPLE_RATE)),
      sineWave(293.66, NOTE_SECONDS), // re
    ]);
    const detected = analyzeFreeSungPhrase(take, SAMPLE_RATE, { noteCount: 2 });
    // If the pop had wrongly counted as note 0, "do" would land in
    // detected[1] (misread as "re") and detected[0] would be null/noise.
    expect(Math.abs(detected[0]! - 261.63) / 261.63).toBeLessThan(0.01);
    expect(Math.abs(detected[1]! - 293.66) / 293.66).toBeLessThan(0.01);
  });

  it("ignores a blip shorter than the minimum segment length", () => {
    const blip = sineWave(300, 0.04); // 40ms — under the default minSegmentMs
    const take = concatFloat32([
      blip,
      new Float32Array(Math.round(GAP_SECONDS * SAMPLE_RATE)),
      sineWave(440, NOTE_SECONDS),
    ]);
    const detected = analyzeFreeSungPhrase(take, SAMPLE_RATE, { noteCount: 2 });
    expect(Math.abs(detected[0]! - 440) / 440).toBeLessThan(0.01);
    expect(detected[1]).toBeNull();
  });

  it("excludeTrailingSegment: does not count a still-in-progress note (no trailing silence yet) as finished", () => {
    // A take still being recorded, polled mid-note: "do" is complete (has
    // a real trailing gap), "re" cuts off abruptly because that's simply
    // where the recording currently ends — not because the singer paused.
    const take = concatFloat32([sineWave(261.63, NOTE_SECONDS), new Float32Array(Math.round(GAP_SECONDS * SAMPLE_RATE)), sineWave(293.66, NOTE_SECONDS)]);
    const live = analyzeFreeSungPhrase(take, SAMPLE_RATE, { noteCount: 3, excludeTrailingSegment: true });
    expect(Math.abs(live[0]! - 261.63) / 261.63).toBeLessThan(0.01);
    expect(live[1]).toBeNull(); // "re" not counted yet — still in progress
    expect(live[2]).toBeNull();

    // The exact same audio, analyzed the normal (post-stop) way, DOES
    // count the in-progress "re" — there's no more audio coming, so an
    // abrupt end is just how that take actually finished.
    const final = analyzeFreeSungPhrase(take, SAMPLE_RATE, { noteCount: 3 });
    expect(Math.abs(final[0]! - 261.63) / 261.63).toBeLessThan(0.01);
    expect(Math.abs(final[1]! - 293.66) / 293.66).toBeLessThan(0.01);
  });

  it("reports null for notes beyond what was actually sung", () => {
    const shortTake = buildFreeTake(SCALE_HZ.slice(0, 4)); // only 4 of 8 notes actually sung
    const detected = analyzeFreeSungPhrase(shortTake, SAMPLE_RATE, { noteCount: 8 });
    expect(detected.slice(0, 4).every((f) => f !== null)).toBe(true);
    expect(detected.slice(4).every((f) => f === null)).toBe(true);
  });

  it("returns all null for a take that's silence throughout", () => {
    const take = new Float32Array(SAMPLE_RATE);
    expect(analyzeFreeSungPhrase(take, SAMPLE_RATE, { noteCount: 3 })).toEqual([null, null, null]);
  });

  describe("excludeAroundSeconds (muting a known noise source, e.g. a metronome click)", () => {
    // A short, LOUD, CLEARLY PITCHED blip between two real notes — unlike
    // the mic-pop test above (pure noise, fails the clarity gate on its
    // own), this is deliberately built to survive segmentation exactly
    // the way a resonant metronome click sample can, so excludeAroundSeconds
    // is the only thing standing between it and being miscounted as a note.
    // Gaps here use the SAME GAP_SECONDS (0.25s, a genuine breath — see
    // this describe block's own sibling tests above) already established
    // as reliably over the default maxGapMs (150ms) bridging threshold —
    // do/click/re each land as their OWN segment. A narrower gap gets
    // close enough to that threshold (window/hop overlap at the edges of
    // a silent gap eats into the nominally-silent hop count) to risk
    // bridging two of them into one blended-pitch segment instead, which
    // is a different (already covered by the "bridges a brief mid-note
    // dip" test above) behavior than what this is testing.
    const CLICK_START_SECONDS = 0.6;
    const clickBlip = sineWave(600, 0.1); // [0.6, 0.7)

    function buildTakeWithClick(): Float32Array {
      return concatFloat32([
        sineWave(261.63, 0.35), // do, [0, 0.35)
        new Float32Array(Math.round(0.25 * SAMPLE_RATE)), // real silence, [0.35, 0.6)
        clickBlip, // the click, [0.6, 0.7)
        new Float32Array(Math.round(0.25 * SAMPLE_RATE)), // real silence, [0.7, 0.95)
        sineWave(293.66, 0.35), // re, [0.95, 1.3)
      ]);
    }

    it("without exclusion, the click gets miscounted as its own note (confirms the test's click is realistic)", () => {
      const detected = analyzeFreeSungPhrase(buildTakeWithClick(), SAMPLE_RATE, { noteCount: 3 });
      expect(Math.abs(detected[0]! - 261.63) / 261.63).toBeLessThan(0.01);
      expect(Math.abs(detected[1]! - 600) / 600).toBeLessThan(0.01); // the click, wrongly read as "note 2"
      expect(Math.abs(detected[2]! - 293.66) / 293.66).toBeLessThan(0.01);
    });

    it("with exclusion around the click's own time, it's skipped entirely — do and re land in the right slots", () => {
      const detected = analyzeFreeSungPhrase(buildTakeWithClick(), SAMPLE_RATE, {
        noteCount: 3,
        excludeAroundSeconds: [CLICK_START_SECONDS],
      });
      expect(Math.abs(detected[0]! - 261.63) / 261.63).toBeLessThan(0.01);
      expect(Math.abs(detected[1]! - 293.66) / 293.66).toBeLessThan(0.01);
      expect(detected[2]).toBeNull(); // nothing sung beyond the 2 real notes
    });

    it("extendLiveVoicedAnalysis's own excludeAroundSeconds mutes the same way for the live path", () => {
      const take = buildTakeWithClick();
      const state = createLiveVoicedAnalysisState();
      extendLiveVoicedAnalysis(state, take, SAMPLE_RATE, [CLICK_START_SECONDS]);
      const live = segmentsFromLiveVoicedAnalysis(state, SAMPLE_RATE, { noteCount: 3 });
      expect(Math.abs(live[0]! - 261.63) / 261.63).toBeLessThan(0.01);
      expect(Math.abs(live[1]! - 293.66) / 293.66).toBeLessThan(0.01);
      expect(live[2]).toBeNull();
    });
  });
});

describe("extendLiveVoicedAnalysis + segmentsFromLiveVoicedAnalysis (incremental live-check path)", () => {
  const SCALE_HZ = [261.63, 293.66, 329.63, 349.23]; // do re mi fa
  const NOTE_SECONDS = 0.35;
  const GAP_SECONDS = 0.25;

  function buildFreeTake(frequenciesHz: readonly number[]): Float32Array {
    const gap = new Float32Array(Math.round(GAP_SECONDS * SAMPLE_RATE));
    const chunks: Float32Array[] = [];
    frequenciesHz.forEach((freq, index) => {
      if (index > 0) chunks.push(gap);
      chunks.push(sineWave(freq, NOTE_SECONDS));
    });
    return concatFloat32(chunks);
  }

  it("fed the WHOLE take in one call, matches analyzeFreeSungPhrase's own result exactly", () => {
    const take = buildFreeTake(SCALE_HZ);
    const oneShot = analyzeFreeSungPhrase(take, SAMPLE_RATE, { noteCount: 4 });

    const state = createLiveVoicedAnalysisState();
    extendLiveVoicedAnalysis(state, take, SAMPLE_RATE);
    const live = segmentsFromLiveVoicedAnalysis(state, SAMPLE_RATE, { noteCount: 4 });
    expect(live).toEqual(oneShot);
  });

  it("fed in small polling-sized chunks (extending the SAME state each time), still matches the one-shot result", () => {
    const take = buildFreeTake(SCALE_HZ);
    const oneShot = analyzeFreeSungPhrase(take, SAMPLE_RATE, { noteCount: 4, excludeTrailingSegment: true });

    const state = createLiveVoicedAnalysisState();
    const chunkSize = Math.round(0.12 * SAMPLE_RATE); // arbitrary "poll interval" slice, not aligned to hop/note boundaries
    let live: (number | null)[] = [];
    for (let end = chunkSize; end < take.length; end += chunkSize) {
      extendLiveVoicedAnalysis(state, take.subarray(0, end), SAMPLE_RATE);
      live = segmentsFromLiveVoicedAnalysis(state, SAMPLE_RATE, { noteCount: 4, excludeTrailingSegment: true });
    }
    // One final "poll" against the complete take, same as the last one
    // finishTake itself would see once the recording actually stops.
    extendLiveVoicedAnalysis(state, take, SAMPLE_RATE);
    live = segmentsFromLiveVoicedAnalysis(state, SAMPLE_RATE, { noteCount: 4, excludeTrailingSegment: true });
    expect(live).toEqual(oneShot);
  });

  it("never re-computes a hop already covered by an earlier extend call", () => {
    const take = buildFreeTake(SCALE_HZ);
    const state = createLiveVoicedAnalysisState();
    const half = Math.floor(take.length / 2);
    extendLiveVoicedAnalysis(state, take.subarray(0, half), SAMPLE_RATE);
    const hopsAfterFirst = state.hopPitches.length;
    expect(hopsAfterFirst).toBeGreaterThan(0);
    // Overwrite the already-analyzed prefix with silence — if extending
    // again re-analyzed those hops, this would change their recorded
    // pitch/voiced values; it must not.
    const tampered = new Float32Array(take);
    tampered.fill(0, 0, half);
    const hopPitchesBefore = [...state.hopPitches];
    const hopVoicedBefore = [...state.hopVoiced];
    extendLiveVoicedAnalysis(state, tampered, SAMPLE_RATE);
    expect(state.hopPitches.slice(0, hopsAfterFirst)).toEqual(hopPitchesBefore);
    expect(state.hopVoiced.slice(0, hopsAfterFirst)).toEqual(hopVoicedBefore);
    expect(state.hopPitches.length).toBeGreaterThan(hopsAfterFirst); // still made progress on the new hops
  });
});

describe("recentVoicedPitch", () => {
  it("recovers a held tone's frequency, robust to one bad hop mixed into the recent window", () => {
    const state = createLiveVoicedAnalysisState();
    const take = sineWave(392, 0.5); // G4, well over LIVE_TUNER_SMOOTHING_HOPS worth of hops
    extendLiveVoicedAnalysis(state, take, SAMPLE_RATE);
    // Simulate one occasional bad hop estimate (the exact failure mode
    // this function exists to smooth over) by corrupting the single most
    // recent hop's own recorded pitch.
    state.hopPitches[state.hopPitches.length - 1] = 261.63; // as if misread as "do"
    const recent = recentVoicedPitch(state);
    expect(recent).not.toBeNull();
    expect(Math.abs(recent! - 392) / 392).toBeLessThan(0.01);
  });

  it("returns null once the current run has gone silent", () => {
    const state = createLiveVoicedAnalysisState();
    const take = concatFloat32([sineWave(440, 0.3), new Float32Array(Math.round(0.3 * SAMPLE_RATE))]);
    extendLiveVoicedAnalysis(state, take, SAMPLE_RATE);
    expect(recentVoicedPitch(state)).toBeNull();
  });

  it("returns null before any hop has been analyzed", () => {
    expect(recentVoicedPitch(createLiveVoicedAnalysisState())).toBeNull();
  });

  it("never reaches back into a previous, already-finished note", () => {
    const state = createLiveVoicedAnalysisState();
    const take = concatFloat32([
      sineWave(261.63, 0.3), // do
      new Float32Array(Math.round(0.3 * SAMPLE_RATE)), // real breath
      sineWave(329.63, 0.15), // mi — shorter than LIVE_TUNER_SMOOTHING_HOPS worth of hops
    ]);
    extendLiveVoicedAnalysis(state, take, SAMPLE_RATE);
    const recent = recentVoicedPitch(state);
    expect(recent).not.toBeNull();
    // If this wrongly blended in hops from the "do" note across the
    // silent gap, the median would be pulled well away from 329.63.
    expect(Math.abs(recent! - 329.63) / 329.63).toBeLessThan(0.02);
  });
});

describe("analyzeFreeRhythmicPhrase", () => {
  const GAP_SECONDS = 0.25; // a genuine breath — well over the default maxGapMs

  it("confirms rhythm for a correctly-proportioned mix of quarter/quarter/half notes at the SINGER'S OWN (arbitrary) tempo", () => {
    // Deliberately an arbitrary tempo unrelated to any metronome/bpm —
    // this mode never assumes one. quarter=0.3s, quarter=0.3s, half=0.6s
    // (exactly double a quarter's own length, matching the note values).
    const take = concatFloat32([
      sineWave(261.63, 0.3), // C4 quarter
      new Float32Array(Math.round(GAP_SECONDS * SAMPLE_RATE)),
      sineWave(293.66, 0.3), // D4 quarter
      new Float32Array(Math.round(GAP_SECONDS * SAMPLE_RATE)),
      sineWave(329.63, 0.6), // E4 half, correctly held twice as long
    ]);
    const results = analyzeFreeRhythmicPhrase(take, SAMPLE_RATE, { noteCount: 3, noteBeats: [1, 1, 2] });
    expect(results).toHaveLength(3);
    expect(Math.abs(results[0].frequencyHz! - 261.63) / 261.63).toBeLessThan(0.01);
    expect(results[0].rhythmCorrect).toBe(true);
    expect(Math.abs(results[1].frequencyHz! - 293.66) / 293.66).toBeLessThan(0.01);
    expect(results[1].rhythmCorrect).toBe(true);
    expect(Math.abs(results[2].frequencyHz! - 329.63) / 329.63).toBeLessThan(0.01);
    expect(results[2].rhythmCorrect).toBe(true);
  });

  it("flags a half note sung far too short (not held anywhere near twice as long) as a rhythm miss, even though its pitch was correct", () => {
    const take = concatFloat32([
      sineWave(261.63, 0.3), // quarter
      new Float32Array(Math.round(GAP_SECONDS * SAMPLE_RATE)),
      sineWave(293.66, 0.3), // quarter
      new Float32Array(Math.round(GAP_SECONDS * SAMPLE_RATE)),
      sineWave(329.63, 0.15), // half, but sung SHORTER than the quarters instead of ~2x longer
    ]);
    const results = analyzeFreeRhythmicPhrase(take, SAMPLE_RATE, { noteCount: 3, noteBeats: [1, 1, 2] });
    expect(results[0].rhythmCorrect).toBe(true);
    expect(results[1].rhythmCorrect).toBe(true);
    expect(Math.abs(results[2].frequencyHz! - 329.63) / 329.63).toBeLessThan(0.01);
    expect(results[2].rhythmCorrect).toBe(false);
  });

  it("does not judge rhythm from a single sung note — not enough data to derive a relative tempo from", () => {
    const take = sineWave(261.63, 0.4);
    const results = analyzeFreeRhythmicPhrase(take, SAMPLE_RATE, { noteCount: 2, noteBeats: [1, 2] });
    expect(Math.abs(results[0].frequencyHz! - 261.63) / 261.63).toBeLessThan(0.01);
    expect(results[0].rhythmCorrect).toBe(false);
    expect(results[1].frequencyHz).toBeNull();
    expect(results[1].rhythmCorrect).toBe(false);
  });

  it("reports null pitch and rhythmCorrect false throughout for a take that's silence throughout", () => {
    const take = new Float32Array(SAMPLE_RATE);
    const results = analyzeFreeRhythmicPhrase(take, SAMPLE_RATE, { noteCount: 2, noteBeats: [1, 2] });
    expect(results).toEqual([
      { frequencyHz: null, rhythmCorrect: false },
      { frequencyHz: null, rhythmCorrect: false },
    ]);
  });
});

describe("concatFloat32", () => {
  it("joins chunks in order, preserving every sample", () => {
    const a = new Float32Array([1, 2, 3]);
    const b = new Float32Array([4, 5]);
    const result = concatFloat32([a, b]);
    expect(Array.from(result)).toEqual([1, 2, 3, 4, 5]);
  });

  it("handles an empty chunk list", () => {
    expect(concatFloat32([]).length).toBe(0);
  });
});
