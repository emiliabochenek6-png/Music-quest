import { decodeAudioFileToPcm } from "@/lib/audio/player";

/** How often the underlying MediaRecorder hands over a new chunk of
 * already-captured audio — see startWebLiveRecording's own doc. Kept
 * comfortably under SolfegePhraseSingingExercise's own LIVE_CHECK_POLL_MS
 * so a fresh chunk is essentially always ready by the time that component
 * next polls, rather than the poll occasionally finding nothing new. */
const CHUNK_TIMESLICE_MS = 250;

/** Falls back to expo-audio's own `audio/webm` choice (see
 * solfegeRecording.ts's SOLFEGE_RECORDING_OPTIONS.web) when the browser
 * doesn't support it — matches what this app already asks MediaRecorder
 * for elsewhere, so decodeAudioFileToPcm's own decodeAudioData call sees
 * exactly the same container/codec it's already proven to handle. */
const PREFERRED_MIME_TYPE = "audio/webm";

export interface WebLiveRecording {
  /** Best-effort PCM decode of everything captured so far THIS take — a
   * FULL re-decode each call (see this module's own doc for why), not an
   * incremental one. Returns null if nothing has been captured yet or the
   * decode itself fails (mirrors decodeAudioFileToPcm's own "never
   * throws" contract). */
  getSamplesSoFar(): Promise<{ samples: Float32Array; sampleRate: number } | null>;
  /** Stops the underlying MediaRecorder and releases the mic stream,
   * returning a blob: object URL for the finished take — usable the same
   * way callers already use expo-audio's own `recorder.uri` after
   * `recorder.stop()`. Null if nothing was ever captured (e.g. stopped
   * within the first CHUNK_TIMESLICE_MS). Safe to call more than once;
   * only the first call actually stops anything. */
  stop(): Promise<string | null>;
}

/** True when this platform can actually run startWebLiveRecording — both a
 * real MediaRecorder constructor and getUserMedia need to exist, which
 * rules out native (where this module is never used — see
 * SolfegePhraseSingingExercise.tsx's own doc for why native keeps using
 * expo-audio's recorder unchanged) and a handful of very old/locked-down
 * browsers. */
export function isWebLiveRecordingAvailable(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof MediaRecorder !== "undefined" &&
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia
  );
}

/** A raw-`MediaRecorder`-based recording, used ONLY on web in place of
 * expo-audio's own `useAudioRecorder` — see SolfegePhraseSingingExercise
 * .tsx's own doc for the full "why" (expo-audio's web recorder,
 * AudioRecorderWeb, only ever assigns its own `.uri` inside `stop()`,
 * meaning there is no way to read ANY audio from it while a take is still
 * in progress, which is exactly what live note-by-note highlighting
 * needs). This talks to the SAME underlying `MediaRecorder` Web API
 * AudioRecorderWeb itself wraps, just started with a `timeslice` argument
 * (CHUNK_TIMESLICE_MS) so `dataavailable` fires repeatedly through the
 * take instead of only once at the very end — each event's chunk gets
 * appended to `chunks`, and getSamplesSoFar() re-assembles everything
 * captured so far into one Blob and decodes THAT via the same
 * decodeAudioFileToPcm this app already uses (and has already verified
 * works) for the FINISHED take.
 *
 * This re-decodes the WHOLE take-so-far on every getSamplesSoFar() call,
 * unlike the incremental (only-decode-what's-new) WAV path native/
 * finishTake use — decodeAudioData has no streaming/incremental mode to
 * build that on top of. That's a real, different performance profile
 * (more CPU per poll as a take grows), but decodeAudioData is a native
 * browser implementation (unlike this app's own hand-rolled pitch
 * detection loop), and a live phrase here only ever runs a few seconds —
 * acceptable until an on-device report says otherwise.
 */
export async function startWebLiveRecording(): Promise<WebLiveRecording> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mimeType = MediaRecorder.isTypeSupported(PREFERRED_MIME_TYPE) ? PREFERRED_MIME_TYPE : undefined;
  const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
  const chunks: Blob[] = [];
  let stopped = false;

  mediaRecorder.addEventListener("dataavailable", (event) => {
    if (event.data.size > 0) chunks.push(event.data);
  });
  const stoppedPromise = new Promise<void>((resolve) => {
    mediaRecorder.addEventListener("stop", () => resolve(), { once: true });
  });

  mediaRecorder.start(CHUNK_TIMESLICE_MS);

  function releaseStream(): void {
    stream.getTracks().forEach((track) => track.stop());
  }

  function currentBlob(): Blob | null {
    if (chunks.length === 0) return null;
    return new Blob(chunks, { type: mediaRecorder.mimeType || PREFERRED_MIME_TYPE });
  }

  return {
    async getSamplesSoFar() {
      const blob = currentBlob();
      if (!blob) return null;
      const url = URL.createObjectURL(blob);
      try {
        return await decodeAudioFileToPcm(url);
      } finally {
        URL.revokeObjectURL(url);
      }
    },
    async stop() {
      if (!stopped) {
        stopped = true;
        if (mediaRecorder.state !== "inactive") {
          mediaRecorder.stop();
          await stoppedPromise;
        }
        releaseStream();
      }
      const blob = currentBlob();
      if (!blob) return null;
      return URL.createObjectURL(blob);
    },
  };
}
