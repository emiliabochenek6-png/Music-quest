import { AudioQuality, IOSOutputFormat, type RecordingOptions } from "expo-audio";

/** Sample rate requested for "Zaczarowany Solfeż"'s own recordings — voice
 * fundamentals (roughly 100-900 Hz, see lib/audio/pitchDetection.ts) sit
 * comfortably under this rate's Nyquist frequency, and a lower rate keeps
 * autocorrelation's own per-window cost small. */
export const SOLFEGE_RECORD_SAMPLE_RATE = 16000;

/** Recording configuration shared by both of "Zaczarowany Solfeż"'s own
 * exercise components — deliberately uses expo-audio's useAudioRecorder
 * (record-to-file) rather than useAudioStream (raw live PCM), unlike an
 * earlier version of this world's own code. useAudioRecorder is the far
 * more standard, widely-used recording API in the Expo ecosystem; after
 * several rounds of a specific, reproducible "reference tone doesn't
 * play" report traced (without ever landing on a confirmed root cause) to
 * the useAudioStream-based pipeline, switching to the better-trodden API
 * is the more defensible bet than continuing to patch the same one.
 *
 * On iOS this asks for UNCOMPRESSED LINEARPCM in a .wav container — not
 * for audio-quality reasons, but so the recorded file can be read back
 * and decoded (lib/audio/wavDecoder.ts) into raw samples for pitch
 * analysis after the take, the same way useAudioStream used to hand over
 * live buffers, just from a finished file instead. This is also what
 * "odsłuchaj siebie" plays back directly — one real file for both
 * purposes, rather than this app's own hand-rolled WAV writer imitating
 * one (lib/audio/wavEncoder.ts remains, but now only as a small
 * roundtrip-tested reference for wavDecoder.ts's own tests).
 *
 * Android isn't configured for LINEARPCM here (the classic MediaRecorder
 * API doesn't support raw PCM output the way AVAudioRecorder does, and
 * this world hasn't been tested on Android at all yet) — it records a
 * normal compressed AAC/M4A file instead. Playback still works fine
 * there (the codec doesn't matter for that), but decodeWavPcm correctly
 * returns null for a non-WAV file, so pitch detection simply reports "no
 * pitch found" on Android rather than crashing — a known, deliberate gap,
 * not a silent bug.
 */
export const SOLFEGE_RECORDING_OPTIONS: RecordingOptions = {
  extension: ".wav",
  sampleRate: SOLFEGE_RECORD_SAMPLE_RATE,
  numberOfChannels: 1,
  bitRate: 256000,
  // Live dB level updates while recording — not used by grading at all
  // (that still runs on the finished file's real PCM, decoded after
  // stop()), only by SolfegePhraseSingingExercise's own live "which note
  // should I be singing right now" highlight, which needs some signal of
  // voice-activity WHILE still recording, before a file exists to decode.
  isMeteringEnabled: true,
  android: {
    extension: ".m4a",
    outputFormat: "mpeg4",
    audioEncoder: "aac",
  },
  ios: {
    extension: ".wav",
    outputFormat: IOSOutputFormat.LINEARPCM,
    audioQuality: AudioQuality.MAX,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: {
    mimeType: "audio/webm",
    bitsPerSecond: 128000,
  },
};
