import type { MelodyDirection, Meter } from "@/types/exercises";

/**
 * Pre-rendered sine-tone WAV samples, one per note actually used by
 * Wioska Nut's audio-driven exercise types (pitch-height-choice,
 * melody-direction-choice) — see assets/audio/*.wav (each a short sine
 * wave with the same attack/release envelope shape the web app's Web
 * Audio `scheduleTone` used).
 *
 * The web app synthesizes tones live via the Web Audio API
 * (OscillatorNode + GainNode) — Expo Go only bundles the standard Expo
 * SDK's native modules, so a raw-oscillator-synthesis library (which
 * would need its own native code) can't run there. expo-audio (bundled,
 * Expo Go-compatible) only plays back audio FILES, so this trades live
 * synthesis for a small fixed set of pre-rendered samples — every note
 * this lesson's content actually plays, not a general-purpose synthesizer.
 * Adding a new note to future content means rendering one more WAV file
 * here (see the generation script noted in the repo's own notes) and
 * adding one more entry below — `metro`'s bundler requires every
 * `require()` target to be a static, literal path, so this map can't be
 * built from a loop over a note-name list.
 *
 * C4-C6 is a full 25-note CHROMATIC run (not just the 7 diatonic notes
 * Wioska Nut needed) — Pasmo Interwałów's interval exercises pick random
 * note pairs anywhere across that whole range, including sharp-spelled
 * notes. The 18 notes beyond the original 7 diatonic + C6 were rendered
 * by pitch-shifting the nearest already-recorded note (ffmpeg
 * asetrate+atempo, same trick this session already used for the melody
 * set's D4/E4/G4/B4 gaps) rather than fresh piano-harmonic synthesis —
 * see scratchpad/gen_missing_chromatic.py from that session for the exact
 * source-note-per-target mapping. B3 is the one note OUTSIDE that C4-C6
 * range: Pasmo Interwałów's own intro-slide examples illustrate "sekunda
 * mała" as B3→C4 (a fixed, hand-authored pair, not one of
 * pickRandomIntervalNotePair's random-range picks — those always stay
 * within C4-C6), rendered the same pitch-shift way, one semitone down
 * from C4. A#2 through A#3 (all of octave 3, plus one note into octave 2)
 * were added for Zatoka Trójdźwięków's triad-role-choice: its reference-
 * triad octave-normalization (lib/music/triads.ts's own
 * normalizeToComfortableOctave + generate.ts's lowerTriadBelow) can land a
 * triad's root as low as A#2 — see scratchpad/gen_low_octave3.py for the
 * exact source-note-per-target mapping (same pitch-shift technique,
 * sourced only from real, non-shifted recordings to avoid compounding
 * artifacts).
 */
export const NOTE_SAMPLES: Record<string, number> = {
  C3: require("@/assets/audio/c3.wav"),
  "A#2": require("@/assets/audio/as2.wav"),
  "C#3": require("@/assets/audio/cs3.wav"),
  D3: require("@/assets/audio/d3.wav"),
  "D#3": require("@/assets/audio/ds3.wav"),
  E3: require("@/assets/audio/e3.wav"),
  F3: require("@/assets/audio/f3.wav"),
  "F#3": require("@/assets/audio/fs3.wav"),
  G3: require("@/assets/audio/g3.wav"),
  "G#3": require("@/assets/audio/gs3.wav"),
  A3: require("@/assets/audio/a3.wav"),
  "A#3": require("@/assets/audio/as3.wav"),
  B3: require("@/assets/audio/b3.wav"),
  C4: require("@/assets/audio/c4.wav"),
  "C#4": require("@/assets/audio/cs4.wav"),
  D4: require("@/assets/audio/d4.wav"),
  "D#4": require("@/assets/audio/ds4.wav"),
  E4: require("@/assets/audio/e4.wav"),
  F4: require("@/assets/audio/f4.wav"),
  "F#4": require("@/assets/audio/fs4.wav"),
  G4: require("@/assets/audio/g4.wav"),
  "G#4": require("@/assets/audio/gs4.wav"),
  A4: require("@/assets/audio/a4.wav"),
  "A#4": require("@/assets/audio/as4.wav"),
  B4: require("@/assets/audio/b4.wav"),
  C5: require("@/assets/audio/c5.wav"),
  "C#5": require("@/assets/audio/cs5.wav"),
  D5: require("@/assets/audio/d5.wav"),
  "D#5": require("@/assets/audio/ds5.wav"),
  E5: require("@/assets/audio/e5.wav"),
  F5: require("@/assets/audio/f5.wav"),
  "F#5": require("@/assets/audio/fs5.wav"),
  G5: require("@/assets/audio/g5.wav"),
  "G#5": require("@/assets/audio/gs5.wav"),
  A5: require("@/assets/audio/a5.wav"),
  "A#5": require("@/assets/audio/as5.wav"),
  B5: require("@/assets/audio/b5.wav"),
  C6: require("@/assets/audio/c6.wav"),
};

/** A SHORTER-rendered twin of NOTE_SAMPLES (0.42s vs 0.9s, same piano-
 * harmonic synthesis — see the generation script's own doc), used only by
 * playMelody. A sequence of notes needs each one to fade out on its own
 * before the next starts (see MELODY_STEP_SECONDS below); reusing the
 * long single-note samples there without truncating them mid-waveform
 * would either overlap audibly or click on a hard cut. This set is
 * rendered to fade to silence WITHIN its own file, so playMelody can
 * always play a sample to completion. Same full C4-C6 chromatic coverage
 * as NOTE_SAMPLES, for the same Pasmo Interwałów reason — see its doc. */
export const MELODY_NOTE_SAMPLES: Record<string, number> = {
  C3: require("@/assets/audio/melody/c3.wav"),
  "A#2": require("@/assets/audio/melody/as2.wav"),
  "C#3": require("@/assets/audio/melody/cs3.wav"),
  D3: require("@/assets/audio/melody/d3.wav"),
  "D#3": require("@/assets/audio/melody/ds3.wav"),
  E3: require("@/assets/audio/melody/e3.wav"),
  F3: require("@/assets/audio/melody/f3.wav"),
  "F#3": require("@/assets/audio/melody/fs3.wav"),
  G3: require("@/assets/audio/melody/g3.wav"),
  "G#3": require("@/assets/audio/melody/gs3.wav"),
  A3: require("@/assets/audio/melody/a3.wav"),
  "A#3": require("@/assets/audio/melody/as3.wav"),
  B3: require("@/assets/audio/melody/b3.wav"),
  C4: require("@/assets/audio/melody/c4.wav"),
  "C#4": require("@/assets/audio/melody/cs4.wav"),
  D4: require("@/assets/audio/melody/d4.wav"),
  "D#4": require("@/assets/audio/melody/ds4.wav"),
  E4: require("@/assets/audio/melody/e4.wav"),
  F4: require("@/assets/audio/melody/f4.wav"),
  "F#4": require("@/assets/audio/melody/fs4.wav"),
  G4: require("@/assets/audio/melody/g4.wav"),
  "G#4": require("@/assets/audio/melody/gs4.wav"),
  A4: require("@/assets/audio/melody/a4.wav"),
  "A#4": require("@/assets/audio/melody/as4.wav"),
  B4: require("@/assets/audio/melody/b4.wav"),
  C5: require("@/assets/audio/melody/c5.wav"),
  "C#5": require("@/assets/audio/melody/cs5.wav"),
  D5: require("@/assets/audio/melody/d5.wav"),
  "D#5": require("@/assets/audio/melody/ds5.wav"),
  E5: require("@/assets/audio/melody/e5.wav"),
  F5: require("@/assets/audio/melody/f5.wav"),
  "F#5": require("@/assets/audio/melody/fs5.wav"),
  G5: require("@/assets/audio/melody/g5.wav"),
  "G#5": require("@/assets/audio/melody/gs5.wav"),
  A5: require("@/assets/audio/melody/a5.wav"),
  "A#5": require("@/assets/audio/melody/as5.wav"),
  B5: require("@/assets/audio/melody/b5.wav"),
  C6: require("@/assets/audio/melody/c6.wav"),
};

/** Short percussive one-shots for Miasto Rytmu's rhythm exercises — a
 * synthesized metronome tick (two pitches: an accented downbeat and a
 * softer weak beat, matching the web app's own two-frequency metronome)
 * and a bandpass-filtered noise "clap" for rhythm-onset playback (see
 * lib/audio/rhythmPlayer.ts). Pre-rendered for the same Expo-Go-has-no-
 * live-synthesis reason as NOTE_SAMPLES above — see that doc. */
export const CLICK_ACCENT_SAMPLE: number = require("@/assets/audio/click-accent.wav");
export const CLICK_WEAK_SAMPLE: number = require("@/assets/audio/click-weak.wav");
export const CLAP_SAMPLE: number = require("@/assets/audio/clap.wav");

/** click-accent.wav/click-weak.wav pre-mixed together with clap.wav (peak-
 * normalized, no clipping — see the small Python mix script this was
 * generated with in this commit's own history) — used ONLY when a
 * metronome click and a clap onset are scheduled for the same instant
 * (see rhythmPlayer.ts's own playMetronomeWithClaps). Playing two
 * separate native samples at once for every coincident beat (which
 * straight-eighth-note compound-meter content produces a lot of, e.g.
 * przystan-taktow.ts's own "pt-l5-e5") was a real source of uneven/
 * glitchy playback even after staggering them by a few ms — one
 * pre-mixed sample per coincidence sidesteps that entirely by only ever
 * asking the device to play ONE thing at that instant. */
export const CLICK_ACCENT_CLAP_SAMPLE: number = require("@/assets/audio/click-accent-clap.wav");
export const CLICK_WEAK_CLAP_SAMPLE: number = require("@/assets/audio/click-weak-clap.wav");

/** Real recorded reference tracks (not synthesized one-shots like the
 * samples above) — a "posłuchaj przykładu" button on a lesson's own intro
 * slide plays one via the ordinary playSample (lib/audio/player.ts), same
 * as any other sample here; it just happens to be several seconds long
 * instead of a fraction of one. One per meter Przystań Taktów teaches
 * (2/4, 2/2, 3/4, 4/4, 6/8, 9/8, 12/8) — used both on lesson 1's intro
 * slide (LessonTheorySlide's own referenceAudio field, a 2/4 vs 3/4 vs
 * 4/4 comparison row) and, via ExerciseSpec's meter-choice
 * referenceAudioSource, as the audio for every meter-choice exercise
 * across the world whose correctMeter has a matching recording. */
export const DRUMMER_2_4_SAMPLE: number = require("@/assets/audio/reference/drummer-modern-rnb-2-4.wav");
export const DRUMMER_2_2_SAMPLE: number = require("@/assets/audio/reference/drummer-modern-rnb-2-2.wav");
export const DRUMMER_3_4_SAMPLE: number = require("@/assets/audio/reference/drummer-modern-rnb-3-4.wav");
export const DRUMMER_4_4_SAMPLE: number = require("@/assets/audio/reference/drummer-modern-rnb-4-4.wav");
export const DRUMMER_6_8_SAMPLE: number = require("@/assets/audio/reference/drummer-modern-rnb-6-8.wav");
export const DRUMMER_9_8_SAMPLE: number = require("@/assets/audio/reference/drummer-modern-rnb-9-8.wav");
export const DRUMMER_12_8_SAMPLE: number = require("@/assets/audio/reference/drummer-modern-rnb-12-8.wav");

/** Real piano recordings (exported from MuseScore, converted to this
 * app's usual mono 16-bit PCM and peak-normalized to match — see this
 * commit's own history for the exact conversion) — one per
 * MelodyDirection, played by MelodyDirectionExercise's own "Dokąd leci
 * melodia?" 🔊 button in place of the single-note-by-single-note
 * playMelody() synthesis it used before. Fixed per DIRECTION rather than
 * per exercise: every "up" exercise anywhere in the app shares this same
 * recording (there's no per-exercise pitch info left to vary it by, and
 * that's the point — a real musical phrase moving up/down/staying level,
 * not a generated one). More directions' worth of content across other
 * worlds/lessons still reuses these same three — MelodyDirection only
 * ever has 3 values. */
export const MELODY_DIRECTION_SAMPLES: Record<MelodyDirection, number> = {
  up: require("@/assets/audio/reference/melody-direction-up.wav"),
  down: require("@/assets/audio/reference/melody-direction-down.wav"),
  same: require("@/assets/audio/reference/melody-direction-same.wav"),
};

/** Real recorded rhythms (same MuseScore-export/mono-16-bit/peak-0.9
 * conversion as MELODY_DIRECTION_SAMPLES above), converted for Miasto
 * Rytmu lekcja 2's own rhythm-echo exercises (mr-l2-e2..e5) — see
 * RhythmEchoExercise.tsx's own referenceAudioSource handling for how a
 * recording here WOULD override the synthesized playMetronomeWithClaps
 * demo. **Not currently wired into data/lessons/miasto-rytmu.ts** —
 * isValidRhythmEcho (lib/questions/rhythmEcho.ts) requires the player's
 * tap COUNT to exactly match onsetsMs.length and each gap to land within
 * ±200ms, so the recording's actual clap timing has to be known exactly
 * or grading breaks (a real regression this session shipped and then
 * reverted — automatic onset detection on these 4 files gave
 * inconsistent, not-obviously-trustworthy counts, so onsetsMs stays the
 * original synthesized-pattern data instead). Kept here, unused, for
 * whenever the actual note-value content of each recording is confirmed
 * (from the person who made them) and onsetsMs can be set to match it
 * exactly — see RHYTHM_SEQUENCING_RECORDING_SAMPLES just below for why
 * rhythm-sequencing's own recordings didn't hit this problem. */
export const RHYTHM_ECHO_RECORDING_SAMPLES: readonly number[] = [
  require("@/assets/audio/reference/rhythm-echo-1.wav"),
  require("@/assets/audio/reference/rhythm-echo-2.wav"),
  require("@/assets/audio/reference/rhythm-echo-3.wav"),
  require("@/assets/audio/reference/rhythm-echo-4.wav"),
];

/** Same recorded-rhythm treatment as RHYTHM_ECHO_RECORDING_SAMPLES above,
 * for lekcja 2's rhythm-sequencing exercises (mr-l2-e6..e9) — IS wired
 * into data/lessons/miasto-rytmu.ts's own referenceAudioSource, unlike
 * its rhythm-echo counterpart, because rhythm-sequencing's own grading
 * (lib/questions/validate.ts's "rhythm-sequencing" case) compares
 * clicked-tile ORDER against correctOrder — pure note-value sequence,
 * never onsetsMs or any timing at all — so nothing about the recording's
 * actual tempo/exact clap timing can ever make that grading wrong. */
export const RHYTHM_SEQUENCING_RECORDING_SAMPLES: readonly number[] = [
  require("@/assets/audio/reference/rhythm-sequencing-1.wav"),
  require("@/assets/audio/reference/rhythm-sequencing-2.wav"),
  require("@/assets/audio/reference/rhythm-sequencing-3.wav"),
  require("@/assets/audio/reference/rhythm-sequencing-4.wav"),
];

/** Same treatment, for lekcja 3's own rhythm-sequencing exercises
 * (mr-l3-e6..e9) — a separate set from RHYTHM_SEQUENCING_RECORDING_SAMPLES
 * above since lekcja 3's motifs are their own (shorter note values —
 * eighths/sixteenths — not lekcja 2's quarter/half/whole), not the same
 * recordings reused. */
export const RHYTHM_SEQUENCING_L3_RECORDING_SAMPLES: readonly number[] = [
  require("@/assets/audio/reference/rhythm-sequencing-l3-1.wav"),
  require("@/assets/audio/reference/rhythm-sequencing-l3-2.wav"),
  require("@/assets/audio/reference/rhythm-sequencing-l3-3.wav"),
  require("@/assets/audio/reference/rhythm-sequencing-l3-4.wav"),
];

/** Same treatment, for lekcja 4's own rhythm-dictation exercises
 * (mr-l4-e1..e5) — unlike every RHYTHM_*_RECORDING_SAMPLES above,
 * these play PURELY as illustration (RhythmDictationExercise's own
 * referenceAudioSource doc explains why a timing mismatch can't break
 * grading here the way it did for rhythm-echo): the notation is shown on
 * screen and onsetsMs is derived from the authored sequence/bpm, never
 * from the recording. */
export const RHYTHM_DICTATION_L4_RECORDING_SAMPLES: readonly number[] = [
  require("@/assets/audio/reference/rhythm-dictation-l4-1.wav"),
  require("@/assets/audio/reference/rhythm-dictation-l4-2.wav"),
  require("@/assets/audio/reference/rhythm-dictation-l4-3.wav"),
  require("@/assets/audio/reference/rhythm-dictation-l4-4.wav"),
  require("@/assets/audio/reference/rhythm-dictation-l4-5.wav"),
];

/** Same treatment, for lekcja 5's own rhythm-notation-tap exercises
 * (mr-l5-e1..e4) — same purely-illustrative pattern as
 * RHYTHM_DICTATION_L4_RECORDING_SAMPLES above (RhythmNotationTapExercise's
 * own referenceAudioSource doc), just against requiredTapTimesMs instead
 * of onsetsMs. */
export const RHYTHM_NOTATION_TAP_L5_RECORDING_SAMPLES: readonly number[] = [
  require("@/assets/audio/reference/rhythm-notation-tap-l5-1.wav"),
  require("@/assets/audio/reference/rhythm-notation-tap-l5-2.wav"),
  require("@/assets/audio/reference/rhythm-notation-tap-l5-3.wav"),
  require("@/assets/audio/reference/rhythm-notation-tap-l5-4.wav"),
];

/** One seamless, sample-accurate loop per meter — built (not recorded)
 * from this app's own click-accent.wav/click-weak.wav at a fixed 120bpm
 * reference tempo (a generic script, not MuseScore: hand-trimming a real
 * recording to loop with zero gap/click at the seam is hard to get
 * exactly right, and this app's own existing click samples already sound
 * consistent with everything else in it). Exactly N beats long (N =
 * the meter's own numerator) with the accent on sample 0 and weak clicks
 * on each subsequent beat, so the native loop point IS the next accent —
 * gapless by construction. Played via lib/audio/player.ts's own
 * playLoopingSample (see its own doc for why this whole approach exists:
 * a real native loop has no JS scheduling/sample-pool-reuse timing to
 * ever land unevenly on, unlike playMetronome's per-click scheduling).
 * Only 4/4 and 3/4 exist — RhythmDictationExercise/RhythmNotationTapExercise's
 * own standalone-metronome toggle falls back to the synthesized
 * playMetronome path for every other meter Przystań Taktów's own content
 * uses (6/8, 9/8, 12/8, 2/2, 2/4 — see METRONOME_LOOP_SAMPLES_BY_METER's
 * own doc). Deliberately NOT tempo-matched to any one exercise's own bpm
 * — this dot is a general pulse-training aid (see
 * STANDALONE_METRONOME_MEASURES's own doc), not required to match the
 * specific exercise being attempted. */
export const METRONOME_LOOP_4_4_120BPM_SAMPLE: number = require("@/assets/audio/reference/metronome-loop-4-4-120bpm.wav");
export const METRONOME_LOOP_3_4_120BPM_SAMPLE: number = require("@/assets/audio/reference/metronome-loop-3-4-120bpm.wav");

/** Looked up by exercise.meter in RhythmDictationExercise/
 * RhythmNotationTapExercise's own toggleStandaloneMetronome — an entry
 * present means "use the real native loop for this meter", absent means
 * "fall back to the synthesized click track" (every meter besides 4/4
 * and 3/4, for now). */
export const METRONOME_LOOP_SAMPLES_BY_METER: Partial<Record<Meter, number>> = {
  "4/4": METRONOME_LOOP_4_4_120BPM_SAMPLE,
  "3/4": METRONOME_LOOP_3_4_120BPM_SAMPLE,
};

/** The fixed reference tempo every METRONOME_LOOP_*_SAMPLE was built at —
 * see that constant's own doc for why the dot intentionally doesn't
 * match each exercise's own authored bpm. */
export const METRONOME_LOOP_BPM = 120;
