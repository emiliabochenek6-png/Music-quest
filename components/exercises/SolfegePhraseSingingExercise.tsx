import { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import { File } from "expo-file-system";
import { getRecordingPermissionsAsync, requestRecordingPermissionsAsync, useAudioRecorder } from "expo-audio";
import { DarkButton } from "@/components/exercises/DarkButton";
import { LessonIntroStaff } from "@/components/exercises/LessonIntro";
import { MelodicDictationStaff } from "@/components/exercises/MelodicDictationStaff";
import { MetronomeIndicator } from "@/components/exercises/MetronomeIndicator";
import { decodeAudioFileToPcm, playMelody } from "@/lib/audio/player";
import {
  analyzeFreeRhythmicPhrase,
  analyzeFreeSungPhrase,
  concatFloat32,
  createLiveVoicedAnalysisState,
  extendLiveVoicedAnalysis,
  recentVoicedPitch,
  segmentsFromLiveVoicedAnalysis,
  type LiveVoicedAnalysisState,
} from "@/lib/audio/pitchDetection";
import { STANDALONE_METRONOME_MEASURES, metronomeBeatTimesMs, playMetronome, stopAllScheduledAudio } from "@/lib/audio/rhythmPlayer";
import { SOLFEGE_RECORDING_OPTIONS } from "@/lib/audio/solfegeRecording";
import { decodeWavPcm, decodeWavPcmFrames, parseWavHeader, type WavHeader } from "@/lib/audio/wavDecoder";
import { describeStaffPosition } from "@/lib/music/staff";
import { classifyPitchMatch, noteToFrequency, octaveFoldedCentsDifference, parseScientific } from "@/lib/music/notes";
import { nearestSolfegeReading, type SolfegeTunerReading } from "@/lib/music/solfege";
import { NOTE_VALUE_BEATS } from "@/lib/rhythm/valueBeats";
import { t } from "@/lib/i18n/translate";
import type { TranslationKey } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { AnswerInput, GeneratedExercise, RhythmNoteValue } from "@/types/exercises";

interface SolfegePhraseSingingExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "solfege-phrase-singing" }>;
  answer: Extract<AnswerInput, { type: "solfege-phrase-singing" }> | null;
  onAnswerChange: (answer: AnswerInput) => void;
  checked: boolean;
  locale: Locale;
}

/** A single take gets this long before auto-stopping even if the player
 * never taps "Zatrzymaj" — generous enough for a relaxed, unpaced 8-note
 * scale with real breaths between notes AND a few retries of notes that
 * didn't land the first time (see this component's own doc), short
 * enough a forgotten recording doesn't run indefinitely. */
const MAX_RECORD_MS = 20000;

/** How often (ms) the live-check effect re-reads the still-recording file
 * and extends its incremental analysis (see this component's own doc) while
 * `phase === "recording"`. A shorter interval means a snappier highlight/
 * hint/tuner reading but more, smaller poll ticks; this value is a first
 * guess, not something validated on-device yet. */
const LIVE_CHECK_POLL_MS = 600;
/** Below this many cents off its nearest natural syllable, the live tuner
 * reads as "in tune" rather than showing a flat/sharp arrow — purely a
 * cosmetic threshold for that readout, unrelated to exercise.toleranceCents
 * (which is what actually grades the FINISHED take). */
const TUNER_IN_TUNE_CENTS = 20;

/** Metronome clicks before note 0 begins, for exercise.gradeRhythm
 * exercises (level 4) — same lead-in convention this app's other
 * metronome-paced exercises already use, so the player has a moment to
 * catch the pulse before they need to start singing. Purely a lead-in for
 * the ear; nothing about grading (see analyzeFreeRhythmicPhrase's own
 * doc) cares when the count-in ends or how long it lasts. */
const METRONOME_COUNT_IN_BEATS = 2;
const DEFAULT_METRONOME_BPM = 66;

type LiveHint = { index: number; quality: "match" | "flat" | "sharp" | "far" };

type Phase = "idle" | "requesting-permission" | "permission-denied" | "recording" | "analyzing" | "recorded";

/**
 * "Zaczarowany Solfeż"'s own whole-phrase counterpart to
 * SolfegeNoteSingingExercise's single note — sings a fixed, authored
 * sequence (level 1's own whole scale: do re mi fa sol la si do; levels
 * 2-4's own short "fragmenty utworów" melodic fragments) as ONE continuous
 * take, at the player's OWN pace: the player sings the phrase naturally,
 * the way singing it actually feels, and taps "Zatrzymaj" when done (or the
 * take auto-stops at MAX_RECORD_MS). This ENTIRE recording/live-coaching
 * flow is the SAME for every level, gradeRhythm (level 4) included — by
 * explicit request, after an earlier gradeRhythm attempt built a genuinely
 * separate metronome-DRIVEN flow (real click track, no live coaching,
 * fixed absolute-time slots the recording was graded against) that turned
 * out repeatedly fragile on a real device (see analyzeFreeRhythmicPhrase's
 * own doc for the specifics). For gradeRhythm exercises only, a metronome
 * (see METRONOME_COUNT_IN_BEATS/exercise.bpm) now plays alongside this same
 * free-tempo take — but purely as an audible PACING AID for the singer's
 * ear (one click = one quarter note's length, so a half note is two
 * clicks), never as a clock anything is graded against: the player can
 * still drift from it and finishTake still grades purely from the take's
 * own sung durations, exactly as before.
 *
 * exercise.rhythm (optional — levels 2-4's fragments carry it, level 1's
 * plain scale doesn't) switches the staff between two renderers: present,
 * it draws real rhythmic notation (stems/beams/note values, at
 * exercise.meter, no accidentals since this world's content stays
 * diatonic) via MelodicDictationStaff, so a "fragment of a piece" actually
 * LOOKS like one; absent, it falls back to LessonIntroStaff's plain,
 * equal-spaced noteheads (level 1's own do-re-mi-fa-sol-la-si-do run isn't
 * really "a piece" with its own rhythm, just a scale). For levels 2-3 this
 * is purely a DISPLAY choice; for level 4 (exercise.gradeRhythm) these
 * SAME note values are also what finishTake compares each note's actual
 * sung duration against — see analyzeFreeRhythmicPhrase's own doc.
 *
 * While recording, this ALSO checks the player's progress live: every
 * LIVE_CHECK_POLL_MS it re-reads the STILL-RECORDING file, decodes it
 * (lib/audio/wavDecoder.ts), and re-runs lib/audio/pitchDetection.ts's
 * own analyzeFreeSungPhrase over everything sung so far (with
 * `excludeTrailingSegment: true` — see that option's own doc — so a note
 * the player hasn't actually finished singing yet, which just happens to
 * be where the recording-so-far ends, is never mistaken for a completed
 * one). Each newly-completed segment beyond what's already been checked
 * is compared, via the SAME classifyPitchMatch feedback and translation
 * keys SolfegeNoteSingingExercise already shows after the fact, against
 * the note the highlight currently says to sing:
 *   - "match" → shows the "Dokładnie!" hint and moves the highlight on to
 *     the NEXT note.
 *   - "flat"/"sharp"/"far" → shows the corresponding "wyżej/niżej/spróbuj
 *     ponownie" hint and leaves the highlight on the SAME note — the
 *     player just sings it again; the retry becomes a new segment in the
 *     same continuous take and gets checked the same way next tick.
 * This live check is PITCH-only even for gradeRhythm exercises — rhythm
 * itself is only ever assessed once, at the very end (see finishTake),
 * from the durations of the segments the finished recording actually
 * contains, never coached note-by-note while recording.
 *
 * On-device testing surfaced real stutter during longer, gradeRhythm
 * takes: an earlier version of this effect re-decoded and re-ran pitch
 * detection over the WHOLE take-so-far on EVERY poll, so the cost grew
 * with how much had already been sung — cheap early in a take, expensive
 * by MAX_RECORD_MS, worst on level 4's longer fragments with a metronome
 * also running. wavHeaderRef/samplesRef/voicedStateRef below fix this:
 * each poll now only decodes and analyzes audio that's NEWLY available
 * since the previous one (see decodeWavPcmFrames's and
 * extendLiveVoicedAnalysis's own docs), so the expensive per-hop
 * autocorrelation work happens exactly once per hop no matter how many
 * times the take gets polled.
 *
 * Since retries can add extra segments beyond exercise.notes.length, the
 * final grading (see finishTake) only takes the FIRST exercise.notes.length
 * completed segments from the finished file, in order — which, for
 * anyone who used retries to fix a wrong note along the way, are exactly
 * the confirmed-correct attempts this live loop already advanced past
 * (every segment before the current highlight was, by construction of
 * this same loop, already a "match" for its note) plus whatever's left
 * highlighted at the moment they tap "Zatrzymaj" (graded as sung, right
 * or wrong, same as any other note).
 *
 * Level 4 (gradeRhythm) only gets two extra bits of UI, both purely
 * informational — neither one feeds finishTake's own grading:
 *   - A tappable metronome dot (MetronomeIndicator, same component/pattern
 *     RhythmDictationExercise's own standalone toggle already uses) so the
 *     player can hear (and watch) the beat on demand before recording,
 *     independent of the automatic click startRecording plays during an
 *     actual take — see toggleStandaloneMetronome's own doc.
 *   - A live "tuner" readout (tunerReading, from lib/music/solfege.ts's
 *     own nearestSolfegeReading) showing whatever pitch the mic is hearing
 *     RIGHT NOW as the closest natural solfège syllable — do/re/mi/fa/
 *     sol/la/si — with a flat/sharp arrow when it's off by more than
 *     TUNER_IN_TUNE_CENTS. Unlike liveHint (which only fires once a whole
 *     segment finishes, judged against the CURRENT target note), this
 *     updates continuously while a note is held, judged against whichever
 *     syllable is actually closest — closer to how a real chromatic tuner
 *     behaves, just restricted to this world's own natural-note-only
 *     naming (see nearestSolfegeReading's own doc for why never a
 *     chromatic reading).
 */
export function SolfegePhraseSingingExercise({ exercise, answer, onAnswerChange, checked, locale }: SolfegePhraseSingingExerciseProps) {
  const isRhythmGraded = exercise.gradeRhythm === true;
  const [phase, setPhase] = useState<Phase>("idle");
  // Which note of the scale the player should be singing RIGHT NOW —
  // only meaningful while phase === "recording" (see the JSX below, which
  // only passes this through to LessonIntroStaff then). Advanced by the
  // live-check effect below, only once a sung attempt for it matches.
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  // The live-check interval below needs to read/advance "the current
  // highlight" every tick without re-subscribing itself to highlightedIndex
  // state (the effect only depends on [phase, recorder]). This ref is the
  // source of truth for that loop; the state above stays the render source.
  const highlightedIndexRef = useRef(0);
  // How many completed segments (see analyzeFreeSungPhrase's own doc) the
  // live-check loop has already evaluated — everything at or before this
  // count in the take-so-far has already produced a hint/advance decision
  // and should not be re-evaluated on the next tick.
  const consumedSegmentsRef = useRef(0);
  // Set once the LAST note has matched — stops the live-check loop from
  // doing any more (increasingly expensive, see this component's own
  // doc) re-analysis for the remainder of the take while the player just
  // taps "Zatrzymaj".
  const finishedRef = useRef(false);
  // Parsed once per take, on the live-check effect's first successful
  // read — a WAV take's own header (sample rate, bit depth, where its PCM
  // data begins) never changes once recording has started, so re-parsing
  // it on every poll (as an earlier version of this effect did, via a
  // plain decodeWavPcm call each tick) is pure waste. Reset to null in
  // startRecording for each new take.
  const wavHeaderRef = useRef<WavHeader | null>(null);
  // All PCM samples decoded so far THIS take, growing poll by poll — see
  // decodeWavPcmFrames's own doc: each poll only decodes newly-available
  // frames (from samplesRef.current.length onward) and appends them here,
  // rather than re-decoding the whole file from frame 0 every time.
  const samplesRef = useRef<Float32Array>(new Float32Array(0));
  // Hop-level pitch/voiced analysis, extended incrementally — see
  // extendLiveVoicedAnalysis's own doc for why this is the actual fix for
  // this effect's previously documented O(whole-take-so-far) per-poll
  // cost: computing a hop's autocorrelation is the expensive part, and
  // this state ensures it only ever happens once per hop, no matter how
  // many times the take has been polled since.
  const voicedStateRef = useRef<LiveVoicedAnalysisState>(createLiveVoicedAnalysisState());
  // isRhythmGraded only: expected metronome click times (seconds since
  // this take's own start), computed once in startRecording — passed to
  // both extendLiveVoicedAnalysis (below) and finishTake's own final
  // analysis so neither ever mistakes the metronome's own click, bleeding
  // into the mic through the device's speaker, for a sung note. See
  // pitchDetection.ts's own CLICK_EXCLUSION_MARGIN_SECONDS doc for why
  // approximate timing is good enough here even though this app
  // deliberately never trusts absolute timing for GRADING. Empty for
  // every other level, where no metronome ever plays.
  const clickExclusionSecondsRef = useRef<number[]>([]);
  // Best-effort live "wyżej/niżej/dokładnie" verdict for the most
  // recently checked sung attempt — see this component's own doc.
  const [liveHint, setLiveHint] = useState<LiveHint | null>(null);
  // Level 4 (isRhythmGraded) only: a live "tuner" readout of whatever
  // pitch the mic is hearing RIGHT NOW, updated every LIVE_CHECK_POLL_MS
  // from the same incremental hop analysis the highlight/hint above
  // already extends — unlike liveHint (which only fires once a whole
  // segment finishes, judged against the CURRENT target note), this shows
  // continuously while a note is being held, judged against whichever
  // natural syllable is actually closest (see nearestSolfegeReading's own
  // doc) — closer to how a real tuner behaves. null while the mic hears
  // silence (between notes, or before the player has started singing).
  const [tunerReading, setTunerReading] = useState<SolfegeTunerReading | null>(null);
  // Level 4 only: the metronome dot's own standalone toggle (tap to hear
  // the pulse before recording, tap again to stop) — independent of the
  // metronome startRecording plays automatically once a take begins (see
  // this component's own doc), same "two ways to hear the same click"
  // split RhythmDictationExercise's own MetronomeIndicator already uses.
  const [standaloneMetronomeOn, setStandaloneMetronomeOn] = useState(false);
  // Drives MetronomeIndicator's pulse animation — bumped both by the
  // standalone toggle below AND by startRecording's own automatic
  // metronome, so the SAME dot visibly pulses in time either way.
  const [metronomePlay, setMetronomePlay] = useState({ token: 0, totalBeats: 0 });
  const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // See SolfegeNoteSingingExercise's own identical guard for why.
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const recorder = useAudioRecorder(SOLFEGE_RECORDING_OPTIONS);

  // Drives highlightedIndex and liveHint from the STILL-RECORDING file
  // itself — see this component's own doc for the full design. Ticks on a
  // real, unconditional setInterval (not a React effect keyed on some
  // derived value that might stop changing) so it can't silently stall the
  // way an earlier metering-based version of this did. Runs the SAME for
  // every level, gradeRhythm included — see this component's own doc for
  // why. Each tick decodes and analyzes only what's NEW since the last one
  // (wavHeaderRef/samplesRef/voicedStateRef carry the running state across
  // ticks) — see decodeWavPcmFrames's and extendLiveVoicedAnalysis's own
  // docs: an earlier version of this effect re-decoded and re-analyzed the
  // WHOLE take-so-far on every single poll, cheap early on but expensive
  // enough by the end of a long level-4 take (metronome running
  // alongside) to visibly stutter on-device.
  useEffect(() => {
    if (phase !== "recording") return;
    let cancelled = false;
    let busy = false;
    const intervalId = setInterval(async () => {
      if (cancelled || busy || finishedRef.current) return;
      const uri = recorder.uri;
      if (!uri) return;
      busy = true;
      try {
        const bytes = new Uint8Array(await new File(uri).arrayBuffer());
        if (cancelled || !isMountedRef.current) return;
        if (!wavHeaderRef.current) {
          wavHeaderRef.current = parseWavHeader(bytes);
        }
        const header = wavHeaderRef.current;
        if (!header) return;
        const newFrames = decodeWavPcmFrames(bytes, header, samplesRef.current.length);
        if (newFrames.length === 0) return; // nothing new landed since the last poll
        samplesRef.current = concatFloat32([samplesRef.current, newFrames]);
        extendLiveVoicedAnalysis(voicedStateRef.current, samplesRef.current, header.sampleRate, clickExclusionSecondsRef.current);
        if (isRhythmGraded) {
          // recentVoicedPitch medians the last few hops of the CURRENT
          // voiced run (see its own doc) rather than trusting a single
          // hop's raw estimate — a single hop misread the syllable often
          // enough on-device (an occasional octave/formant error) to be
          // worth smoothing over a short trailing window. null (silence,
          // or the very start of a note) clears the readout.
          const recentPitch = recentVoicedPitch(voicedStateRef.current);
          setTunerReading(recentPitch !== null ? nearestSolfegeReading(recentPitch, locale) : null);
        }
        const liveResults = segmentsFromLiveVoicedAnalysis(voicedStateRef.current, header.sampleRate, {
          noteCount: exercise.notes.length + 8, // headroom for a few wrong-note retries
          excludeTrailingSegment: true, // don't grade a note the player is still mid-singing
        });
        const segmentPitches = liveResults.filter((pitch): pitch is number => pitch !== null);
        while (!cancelled && isMountedRef.current && !finishedRef.current && consumedSegmentsRef.current < segmentPitches.length) {
          const pitch = segmentPitches[consumedSegmentsRef.current];
          consumedSegmentsRef.current += 1;
          const noteIndex = highlightedIndexRef.current;
          const targetHz = noteToFrequency(parseScientific(exercise.notes[noteIndex]));
          const quality = classifyPitchMatch(pitch, targetHz, exercise.toleranceCents);
          setLiveHint({ index: noteIndex, quality });
          if (quality === "match") {
            if (noteIndex >= exercise.notes.length - 1) {
              finishedRef.current = true;
            } else {
              const nextIndex = noteIndex + 1;
              highlightedIndexRef.current = nextIndex;
              setHighlightedIndex(nextIndex);
            }
          }
          // A wrong attempt just stays on the same note — the player's
          // next try becomes a new segment, checked the same way once a
          // later tick sees it.
        }
      } catch {
        // Best-effort — a mid-recording read/decode failure just means we
        // wait for the next poll tick; nothing else is affected.
      } finally {
        busy = false;
      }
    }, LIVE_CHECK_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, recorder]);

  useEffect(() => {
    return () => {
      if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
      // Cancels any of the metronome's own still-pending clicks if the
      // player navigates away mid-recording — harmless, cheap no-op when
      // nothing's actually scheduled.
      stopAllScheduledAudio();
      // See SolfegeNoteSingingExercise's own identical guard for why the
      // whole thing (including just reading recorder.isRecording) is
      // wrapped, not just the stop() call.
      try {
        if (recorder.isRecording) {
          recorder.stop().catch(() => {
            // Already stopped/released — nothing left to do.
          });
        }
      } catch {
        // Native recorder already released — nothing left to stop.
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recorder]);

  function playExample() {
    // The mic is live during "recording" — playing the reference phrase
    // then would get picked up as if the player sang it, defeating the
    // whole point of the exercise. The button is also visually disabled
    // below; this guards a tap that lands in the gap right as recording
    // starts.
    if (phase === "recording") return;
    playMelody(
      exercise.notes.map((note) => parseScientific(note)),
      { gapSeconds: 0.15 }
    );
  }

  async function finishTake() {
    if (stopTimerRef.current) {
      clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }
    // Cancels any of the metronome's own still-pending clicks if the
    // player stops (manually or via MAX_RECORD_MS) before it's finished
    // playing them all — harmless no-op outside gradeRhythm, where
    // nothing was ever scheduled.
    stopAllScheduledAudio();
    setPhase("analyzing");

    try {
      await recorder.stop();
    } catch {
      // Already stopped — the take may still be usable via recorder.uri.
    }
    if (!isMountedRef.current) return;

    const uri = recorder.uri;
    let detectedFrequenciesHz: (number | null)[] = exercise.notes.map(() => null);
    let rhythmCorrect: (boolean | null)[] | undefined = isRhythmGraded ? exercise.notes.map(() => null) : undefined;
    if (uri) {
      try {
        const bytes = new Uint8Array(await new File(uri).arrayBuffer());
        // See SolfegeNoteSingingExercise's own identical fallback doc —
        // decodeWavPcm alone only ever reads a take on platforms that
        // actually record WAV (iOS); web's MediaRecorder-based take
        // (audio/webm) needs decodeAudioFileToPcm's Web Audio API path
        // instead. The LIVE mid-recording highlight above this function
        // stays WAV-only (decodeAudioData can't incrementally decode a
        // still-growing file the way decodeWavPcmFrames does) — this
        // fixes the FINAL analysis, which is what actually grades the
        // take and is what was silently never detecting anything on web.
        const decoded = decodeWavPcm(bytes) ?? (await decodeAudioFileToPcm(uri));
        if (decoded) {
          // No excludeTrailingSegment here — the take is finished, so a
          // note that ends right at the recording's own end is still
          // that note's real, final attempt. Any extra segments from
          // retries beyond exercise.notes.length are simply not
          // reached, the same as any other take with more sound than
          // notes.
          if (isRhythmGraded) {
            const rhythmValues: RhythmNoteValue[] = exercise.rhythm ?? exercise.notes.map(() => "quarter");
            const noteBeats = rhythmValues.map((value) => NOTE_VALUE_BEATS[value]);
            const results = analyzeFreeRhythmicPhrase(decoded.samples, decoded.sampleRate, {
              noteCount: exercise.notes.length,
              noteBeats,
              excludeAroundSeconds: clickExclusionSecondsRef.current,
            });
            detectedFrequenciesHz = results.map((result) => result.frequencyHz);
            rhythmCorrect = results.map((result) => result.rhythmCorrect);
          } else {
            detectedFrequenciesHz = analyzeFreeSungPhrase(decoded.samples, decoded.sampleRate, {
              noteCount: exercise.notes.length,
            });
          }
        }
      } catch {
        // Leave detectedFrequenciesHz (and rhythmCorrect) as all-null —
        // reads as "no pitch detected", same as a genuinely silent take.
      }
    }

    setPhase("recorded");
    onAnswerChange(
      isRhythmGraded
        ? { type: "solfege-phrase-singing", detectedFrequenciesHz, rhythmCorrect }
        : { type: "solfege-phrase-singing", detectedFrequenciesHz }
    );
  }

  async function startRecording() {
    if (checked) return;
    const current = await getRecordingPermissionsAsync();
    if (!isMountedRef.current) return;
    if (current.status !== "granted") {
      setPhase("requesting-permission");
      const requested = await requestRecordingPermissionsAsync();
      if (!isMountedRef.current) return;
      if (!requested.granted) {
        setPhase("permission-denied");
        return;
      }
    }
    try {
      await recorder.prepareToRecordAsync();
      if (!isMountedRef.current) return;
      recorder.record();
    } catch {
      return;
    }
    highlightedIndexRef.current = 0;
    consumedSegmentsRef.current = 0;
    finishedRef.current = false;
    wavHeaderRef.current = null;
    samplesRef.current = new Float32Array(0);
    voicedStateRef.current = createLiveVoicedAnalysisState();
    clickExclusionSecondsRef.current = [];
    setLiveHint(null);
    setTunerReading(null);
    setStandaloneMetronomeOn(false);
    setHighlightedIndex(0);
    setPhase("recording");
    stopTimerRef.current = setTimeout(finishTake, MAX_RECORD_MS);

    // A pacing AID only — see this component's own doc and
    // analyzeFreeRhythmicPhrase's own doc for why grading itself never
    // assumes the player actually stayed locked to this click track (one
    // beat's worth of click = one quarter note's length, two = a half's,
    // etc., same NOTE_VALUE_BEATS convention this world's rhythm notation
    // already uses). Recording keeps going on its own MAX_RECORD_MS/
    // manual-stop schedule regardless of how long the metronome itself
    // runs for.
    if (isRhythmGraded) {
      const bpm = exercise.bpm ?? DEFAULT_METRONOME_BPM;
      const rhythmValues: RhythmNoteValue[] = exercise.rhythm ?? exercise.notes.map(() => "quarter");
      const totalNoteBeats = rhythmValues.reduce((sum, value) => sum + NOTE_VALUE_BEATS[value], 0);
      const totalBeats = METRONOME_COUNT_IN_BEATS + totalNoteBeats;
      // recorder.record() (above) and this call happen within the same
      // synchronous stretch of JS, so "click k's own scheduled time" is a
      // good enough proxy for "click k's time since this take's own
      // audio began" to blank it out — see clickExclusionSecondsRef's own
      // doc and CLICK_EXCLUSION_MARGIN_SECONDS's for why the margin
      // covers the (unmeasurable, device-dependent) gap this can't
      // account for exactly.
      clickExclusionSecondsRef.current = metronomeBeatTimesMs(bpm, 1, totalBeats).map((ms) => ms / 1000);
      playMetronome({ bpm, beatsPerMeasure: 1, measureCount: totalBeats });
      // The SAME dot the standalone toggle below drives — pulses through
      // this automatic count-in + take too, so there's always something
      // to WATCH in sync with the click, not just hear (same idea
      // MetronomeIndicator's own doc describes for RhythmDictationExercise).
      setMetronomePlay((prev) => ({ token: prev.token + 1, totalBeats }));
    }
  }

  // Level 4's own standalone metronome toggle — tap the dot to hear (and
  // watch) the pulse on demand before recording, tap again to stop; a
  // no-op while actually recording, where startRecording's own automatic
  // metronome already owns the click track (see that function's own doc).
  function toggleStandaloneMetronome() {
    if (phase === "recording") return;
    stopAllScheduledAudio();
    if (standaloneMetronomeOn) {
      setStandaloneMetronomeOn(false);
      return;
    }
    setStandaloneMetronomeOn(true);
    const bpm = exercise.bpm ?? DEFAULT_METRONOME_BPM;
    playMetronome({ bpm, beatsPerMeasure: 1, measureCount: STANDALONE_METRONOME_MEASURES });
    setMetronomePlay((prev) => ({ token: prev.token + 1, totalBeats: STANDALONE_METRONOME_MEASURES }));
  }

  const isRecording = phase === "recording";
  const hasResult = phase === "recorded";
  const detectedFrequenciesHz = answer?.detectedFrequenciesHz ?? null;
  const rhythmCorrectAnswer = answer?.rhythmCorrect ?? null;
  const correctCount =
    detectedFrequenciesHz?.filter((frequencyHz, index) => {
      if (frequencyHz === null) return false;
      const targetHz = noteToFrequency(parseScientific(exercise.notes[index]));
      const pitchOk = Math.abs(octaveFoldedCentsDifference(frequencyHz, targetHz)) <= exercise.toleranceCents;
      if (!pitchOk) return false;
      return isRhythmGraded ? rhythmCorrectAnswer?.[index] === true : true;
    }).length ?? 0;
  const allMissed = hasResult && detectedFrequenciesHz !== null && detectedFrequenciesHz.every((f) => f === null);
  // Only present for content authored with real rhythm values (levels
  // 2-4's own "fragmenty utworów") — see exercise.rhythm's own doc. When
  // present, the fragment renders as real rhythmic notation via
  // MelodicDictationStaff instead of LessonIntroStaff's plain, equal-
  // spaced noteheads (level 1's own plain scale-drill exercise, which has
  // no rhythm field, keeps using that).
  const rhythmNotes = exercise.rhythm
    ? exercise.notes.map((note, index) => {
        const parsed = parseScientific(note);
        return { step: describeStaffPosition(parsed, "treble").step, accidental: parsed.accidental, value: exercise.rhythm![index] };
      })
    : null;

  let status: { message: string; tone: "info" | "warning" } | null = null;
  if (phase === "permission-denied") {
    status = { message: t("lesson.solfegePermissionDenied", locale), tone: "warning" };
  } else if (phase === "requesting-permission") {
    status = { message: t("lesson.solfegeRequestingPermission", locale), tone: "info" };
  } else if (isRecording && liveHint) {
    // The most recent live verdict takes priority over the generic
    // "Nagrywam…" message — see the live-check effect's own doc for how
    // (and how often) this gets recomputed.
    const key: Record<LiveHint["quality"], TranslationKey> = {
      match: "lesson.solfegePitchMatch",
      flat: "lesson.solfegePitchFlat",
      sharp: "lesson.solfegePitchSharp",
      far: "lesson.solfegePitchFar",
    };
    status = { message: t(key[liveHint.quality], locale), tone: liveHint.quality === "match" ? "info" : "warning" };
  } else if (isRecording) {
    status = { message: t(isRhythmGraded ? "lesson.solfegePhraseRhythmRecording" : "lesson.solfegePhraseRecording", locale), tone: "warning" };
  } else if (phase === "analyzing") {
    status = { message: t("lesson.solfegeAnalyzing", locale), tone: "info" };
  } else if (allMissed) {
    status = { message: t("lesson.solfegeNoPitchDetected", locale), tone: "warning" };
  } else if (hasResult && checked) {
    status = { message: t("lesson.solfegePhraseResult", locale, { correct: String(correctCount), total: String(exercise.notes.length) }), tone: "info" };
  }

  // Level 1's own whole-scale exercise gets the wording that actually
  // describes it ("Zaśpiewaj kolejno całą gamę: do - re - mi - ..."); a
  // short fragment (level 2/3/4's own content, exercise.isFragment) gets
  // the generic instruction instead — listing out ITS OWN syllables in
  // that same phrasing would just repeat what the highlighted staff
  // notation already shows.
  const promptText = exercise.isFragment
    ? t("lesson.solfegePhraseSingFragmentPrompt", locale)
    : t("lesson.solfegePhraseSingPrompt", locale, { syllables: exercise.solfegeSyllables.join(" - ") });
  // "po kolei" ("in order") is the one word this prompt most needs to
  // land — the instinct is to just sing the right notes, not necessarily
  // in the sequence the live highlight actually checks them in. Only the
  // fragment wording carries this phrase; ariaLabel below keeps using the
  // plain promptText string (can't embed nested Text there).
  const UNDERLINE_TARGET = "po kolei";
  const promptParts = exercise.isFragment && promptText.includes(UNDERLINE_TARGET) ? promptText.split(UNDERLINE_TARGET) : null;

  return (
    <View style={{ alignItems: "center", gap: theme.spacing(2.5), width: "100%" }}>
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
        {promptParts ? (
          <>
            {promptParts[0]}
            <Text style={{ textDecorationLine: "underline" }}>{UNDERLINE_TARGET}</Text>
            {promptParts[1]}
          </>
        ) : (
          promptText
        )}
      </Text>

      {rhythmNotes ? (
        <MelodicDictationStaff
          notes={rhythmNotes}
          ariaLabel={promptText}
          keySignature={0}
          meter={exercise.meter ?? "4/4"}
          highlightedIndex={isRecording ? highlightedIndex : undefined}
          locale={locale}
        />
      ) : (
        <LessonIntroStaff
          notes={exercise.notes}
          locale={locale}
          labels={exercise.solfegeSyllables}
          highlightedIndex={isRecording ? highlightedIndex : undefined}
        />
      )}

      <DarkButton label="🔊" onPress={playExample} variant="secondary" size={72} fontSize={34} disabled={isRecording} />

      {isRhythmGraded && (
        <View style={{ alignItems: "center", gap: theme.spacing(0.5) }}>
          <MetronomeIndicator
            playToken={metronomePlay.token}
            bpm={exercise.bpm ?? DEFAULT_METRONOME_BPM}
            beatsPerMeasure={1}
            totalBeats={metronomePlay.totalBeats}
            size={44}
            onPress={toggleStandaloneMetronome}
            active={standaloneMetronomeOn}
          />
          <Text style={{ fontSize: theme.fontSize.body * 0.7, color: theme.colors.muted, textAlign: "center" }}>
            {t("lesson.solfegeMetronomeDotHint", locale)}
          </Text>
        </View>
      )}

      {isRhythmGraded && isRecording && (
        <View style={{ alignItems: "center", gap: theme.spacing(0.25) }}>
          <Text
            style={{
              fontSize: theme.fontSize.heading,
              fontWeight: "800",
              color: !tunerReading
                ? theme.colors.muted
                : Math.abs(tunerReading.centsOff) <= TUNER_IN_TUNE_CENTS
                  ? theme.colors.success
                  : theme.colors.warning,
            }}
          >
            {tunerReading ? tunerReading.syllable : "—"}
          </Text>
          {tunerReading && Math.abs(tunerReading.centsOff) > TUNER_IN_TUNE_CENTS && (
            <Text style={{ fontSize: theme.fontSize.body * 0.75, color: theme.colors.warning }}>
              {tunerReading.centsOff < 0 ? `⬇ ${t("lesson.solfegeTunerFlat", locale)}` : `⬆ ${t("lesson.solfegeTunerSharp", locale)}`}
            </Text>
          )}
        </View>
      )}

      {status && (
        <Text
          style={{
            color: status.tone === "warning" ? theme.colors.warning : theme.colors.muted,
            fontWeight: status.tone === "warning" ? "700" : "400",
            fontSize: theme.fontSize.body * 0.85,
            textAlign: "center",
          }}
        >
          {status.message}
        </Text>
      )}

      <View style={{ width: "100%", gap: theme.spacing(1.25) }}>
        {!isRecording && (
          <DarkButton
            label={hasResult ? t("lesson.solfegeRetry", locale) : t("lesson.solfegeRecordButton", locale)}
            onPress={startRecording}
            disabled={checked || phase === "requesting-permission" || phase === "analyzing"}
          />
        )}
        {isRecording && <DarkButton label={t("lesson.solfegeStopButton", locale)} onPress={finishTake} variant="secondary" />}
      </View>
    </View>
  );
}
