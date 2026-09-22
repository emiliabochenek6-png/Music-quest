import { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import { File } from "expo-file-system";
import { getRecordingPermissionsAsync, requestRecordingPermissionsAsync, useAudioRecorder } from "expo-audio";
import { DarkButton } from "@/components/exercises/DarkButton";
import { StaffNotation } from "@/components/exercises/StaffNotation";
import { decodeAudioFileToPcm, playNote } from "@/lib/audio/player";
import { analyzeSungPitch } from "@/lib/audio/pitchDetection";
import { SOLFEGE_RECORDING_OPTIONS, SOLFEGE_RECORD_SAMPLE_RATE } from "@/lib/audio/solfegeRecording";
import { decodeWavPcm } from "@/lib/audio/wavDecoder";
import { classifyPitchMatch, noteToFrequency, parseScientific } from "@/lib/music/notes";
import { t } from "@/lib/i18n/translate";
import type { TranslationKey } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { AnswerInput, GeneratedExercise } from "@/types/exercises";

interface SolfegeNoteSingingExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "solfege-note-singing" }>;
  answer: Extract<AnswerInput, { type: "solfege-note-singing" }> | null;
  onAnswerChange: (answer: AnswerInput) => void;
  checked: boolean;
  locale: Locale;
}

/** Auto-stops a take even if the player never taps "Zatrzymaj" — long
 * enough to comfortably breathe in and hold one note, short enough that a
 * forgotten recording doesn't run indefinitely. */
const MAX_RECORD_MS = 4000;
/** Below ~300ms of audio there isn't enough signal for analyzeSungPitch to
 * find a reliable window — treated as its own "too short, try again"
 * outcome rather than attempting to analyze it. */
const MIN_RECORD_SAMPLES = Math.floor(SOLFEGE_RECORD_SAMPLE_RATE * 0.3);

type Phase = "idle" | "requesting-permission" | "permission-denied" | "recording" | "analyzing" | "recorded";

/**
 * "Zaczarowany Solfeż" — the ONE exercise type in this app that reads
 * microphone input rather than just playing sound. The target note is
 * shown on the staff with its solfège syllable (do/re/mi/...); "🔊" plays
 * a reference piano tone at that pitch (this app has no sung-voice audio
 * to demonstrate with — see this world's own doc for why a reference
 * tone stands in for a "sing me an example" demo); "🎤 Nagraj" records a
 * short take via expo-audio's useAudioRecorder (record-to-file — see
 * lib/audio/solfegeRecording.ts's own doc for why this world switched to
 * it from an earlier useAudioStream-based design). Stopping (manually or
 * via MAX_RECORD_MS) reads the recorded file back, decodes its raw PCM
 * (lib/audio/wavDecoder.ts, or lib/audio/player.ts's own
 * decodeAudioFileToPcm on web — see that function's own doc) and runs
 * lib/audio/pitchDetection.ts's autocorrelation-based analyzeSungPitch on
 * it. No "listen back to your own take" playback — the player only ever
 * hears the reference tone and their own live singing, never a replay.
 * Grading itself (comparing the detected frequency to the target, octave-folded
 * — see lib/music/notes.ts's octaveFoldedCentsDifference) happens in
 * lib/questions/validate.ts, same separation every other exercise type
 * already keeps between "what the player did" (this component, via
 * onAnswerChange) and "was it right" (validate.ts).
 *
 * Exactly one status line is shown at a time (see `status` below) — every
 * phase of the record → analyze → play-back flow has its own single
 * message, in plain language, rather than several conditional texts
 * stacking on top of each other.
 */
export function SolfegeNoteSingingExercise({ exercise, answer, onAnswerChange, checked, locale }: SolfegeNoteSingingExerciseProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  // Set only when something in the record/save pipeline genuinely
  // failed — a plain-language reason shown in place of the usual result,
  // not a permanent debug log.
  const [issue, setIssue] = useState<string | null>(null);
  const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // startRecording awaits permission calls before touching the mic — long
  // enough that the player can navigate to the next exercise (which
  // remounts this component, see [lessonId].tsx's key={definition.id})
  // while still in flight. Guards every await-resumption against acting
  // (starting the recorder, setState) on a component that's already gone.
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const recorder = useAudioRecorder(SOLFEGE_RECORDING_OPTIONS);

  useEffect(() => {
    return () => {
      if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
      // useAudioRecorder's own useReleasingSharedObject already releases
      // the native recorder on unmount via its OWN effect — exercise-to-
      // exercise navigation remounts this whole component (see
      // [lessonId].tsx's key={definition.id}), and that release can land
      // before or after this cleanup runs depending on effect ordering.
      // Even just READING recorder.isRecording (a synchronous native
      // getter) can throw on an already-released object, so the whole
      // thing is wrapped, not just the stop() call — same "already torn
      // down, nothing to do here" shape lib/audio/player.ts's own stop
      // handlers already use.
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
    // The mic is live during "recording" — playing the reference tone
    // then would get picked up as if the player sang it, defeating the
    // whole point of the exercise. The button is also visually disabled
    // below; this guards a tap that lands in the gap right as recording
    // starts.
    if (phase === "recording") return;
    playNote(parseScientific(exercise.targetNote));
  }

  async function finishTake() {
    if (stopTimerRef.current) {
      clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }
    setPhase("analyzing");

    try {
      await recorder.stop();
    } catch {
      // Already stopped — the take may still be usable via recorder.uri.
    }
    if (!isMountedRef.current) return;

    const uri = recorder.uri;
    if (!uri) {
      setIssue(t("lesson.solfegeSaveFailed", locale));
      setPhase("recorded");
      onAnswerChange({ type: "solfege-note-singing", detectedFrequencyHz: null });
      return;
    }

    try {
      // expo-file-system's own File class is a non-functional stub on
      // web ("expo-file-system is not supported on web" — its
      // constructor silently drops the uri it's given, and .arrayBuffer()
      // then throws) — so THIS read, not just decodeWavPcm's own WAV-only
      // parsing, is what was actually breaking recording detection on web
      // before it ever reached the decode step. Caught separately so a
      // web platform (where this always throws) falls straight through to
      // decodeAudioFileToPcm's own fetch(uri)-based read below, instead of
      // the whole try/catch's outer catch reporting a false "couldn't
      // save" — the file itself saved just fine, only this specific way
      // of reading it back doesn't work on web.
      let decoded: { samples: Float32Array; sampleRate: number } | null = null;
      try {
        const bytes = new Uint8Array(await new File(uri).arrayBuffer());
        decoded = decodeWavPcm(bytes);
      } catch {
        // expo-file-system unavailable (web) — decodeAudioFileToPcm below
        // reads the same uri its own way instead.
      }
      // Still null here either because the above never produced WAV bytes
      // to try (web), or decodeWavPcm ran but the bytes genuinely weren't
      // a WAV (Android's compressed fallback — see
      // SOLFEGE_RECORDING_OPTIONS's own doc). decodeAudioFileToPcm's own
      // Web Audio API path (which DOES understand the web recorder's
      // webm output — see its own doc for the full "why") is a no-op on
      // native, so this stays null on Android exactly as before — a
      // real, deliberate gap there, not an error.
      decoded = decoded ?? (await decodeAudioFileToPcm(uri));
      if (decoded === null) {
        // Nothing to analyze — the file itself is still perfectly
        // playable either way.
        setIssue(null);
        setPhase("recorded");
        onAnswerChange({ type: "solfege-note-singing", detectedFrequencyHz: null });
        return;
      }
      if (decoded.samples.length < MIN_RECORD_SAMPLES) {
        setIssue(t("lesson.solfegeTooShort", locale));
        setPhase("recorded");
        onAnswerChange({ type: "solfege-note-singing", detectedFrequencyHz: null });
        return;
      }
      const detectedFrequencyHz = analyzeSungPitch(decoded.samples, decoded.sampleRate);
      setIssue(null);
      setPhase("recorded");
      onAnswerChange({ type: "solfege-note-singing", detectedFrequencyHz });
    } catch {
      setIssue(t("lesson.solfegeSaveFailed", locale));
      setPhase("recorded");
      onAnswerChange({ type: "solfege-note-singing", detectedFrequencyHz: null });
    }
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
    setIssue(null);
    try {
      await recorder.prepareToRecordAsync();
      if (!isMountedRef.current) return;
      recorder.record();
    } catch {
      setIssue(t("lesson.solfegeSaveFailed", locale));
      return;
    }
    setPhase("recording");
    stopTimerRef.current = setTimeout(finishTake, MAX_RECORD_MS);
  }

  const isRecording = phase === "recording";
  const hasResult = phase === "recorded";
  const detectedFrequencyHz = answer?.detectedFrequencyHz ?? null;

  let status: { message: string; tone: "info" | "warning" } | null = null;
  if (phase === "permission-denied") {
    status = { message: t("lesson.solfegePermissionDenied", locale), tone: "warning" };
  } else if (phase === "requesting-permission") {
    status = { message: t("lesson.solfegeRequestingPermission", locale), tone: "info" };
  } else if (isRecording) {
    status = { message: t("lesson.solfegeRecording", locale), tone: "warning" };
  } else if (phase === "analyzing") {
    status = { message: t("lesson.solfegeAnalyzing", locale), tone: "info" };
  } else if (hasResult && issue) {
    status = { message: issue, tone: "warning" };
  } else if (hasResult && detectedFrequencyHz === null) {
    status = { message: t("lesson.solfegeNoPitchDetected", locale), tone: "warning" };
  } else if (hasResult && checked && detectedFrequencyHz !== null) {
    const targetHz = noteToFrequency(parseScientific(exercise.targetNote));
    const quality = classifyPitchMatch(detectedFrequencyHz, targetHz, exercise.toleranceCents);
    const key: Record<typeof quality, TranslationKey> = {
      match: "lesson.solfegePitchMatch",
      flat: "lesson.solfegePitchFlat",
      sharp: "lesson.solfegePitchSharp",
      far: "lesson.solfegePitchFar",
    };
    status = {
      message: t(key[quality], locale),
      tone: quality === "match" ? "info" : "warning",
    };
  }

  return (
    <View style={{ alignItems: "center", gap: theme.spacing(2.5) }}>
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
        {t("lesson.solfegeSingPrompt", locale, { syllable: exercise.solfegeSyllable })}
      </Text>

      <StaffNotation note={exercise.targetNote} />

      <Text style={{ color: theme.colors.primary, fontSize: theme.fontSize.heading, fontWeight: "800" }}>{exercise.solfegeSyllable}</Text>

      <DarkButton label="🔊" onPress={playExample} variant="secondary" size={72} fontSize={34} disabled={isRecording} />

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
