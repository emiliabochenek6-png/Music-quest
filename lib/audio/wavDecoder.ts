/**
 * Minimal RIFF/WAV chunk parser — the counterpart to lib/audio/
 * wavEncoder.ts's own fixed-layout writer, but written to walk chunks by
 * ID rather than assume a fixed 44-byte header: this decodes files
 * WRITTEN BY THE OS (expo-audio's AudioRecorder, configured for
 * uncompressed LINEARPCM on iOS — see the Solfeż exercise components'
 * own doc for why), which this app doesn't control the exact byte layout
 * of the way it does its own encoder's output. Real-world WAV files
 * occasionally carry extra chunks (metadata, padding) before the 'data'
 * chunk, and chunks are word-aligned (padded to an even byte count) —
 * both handled here, neither assumed away.
 */

interface DecodedWav {
  samples: Float32Array;
  sampleRate: number;
}

/** Everything decodeWavPcmFrames needs to decode PCM frames WITHOUT
 * re-walking the file's chunk headers — see parseWavHeader's own doc for
 * why a live, repeatedly-polled caller wants to do that walk exactly
 * once per take rather than on every read. `declaredDataSize` is the
 * "data" chunk's own declared byte count as found in the header — kept
 * separate from the buffer's actual length so each decode call can
 * independently reconcile the two the same way the original single-shot
 * decoder did (see decodeWavPcmFrames's own doc). */
export interface WavHeader {
  sampleRate: number;
  numChannels: number;
  bitsPerSample: number;
  dataOffset: number;
  declaredDataSize: number;
}

function readAscii(view: DataView, offset: number, length: number): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += String.fromCharCode(view.getUint8(offset + i));
  }
  return result;
}

/** Walks a WAV file's chunks far enough to find its format and where its
 * PCM data begins, without decoding any samples — split out of
 * decodeWavPcm so a caller doing INCREMENTAL decoding (see
 * decodeWavPcmFrames's own doc, and SolfegePhraseSingingExercise.tsx's
 * live-check effect, its one real caller) only re-walks this cheap header
 * logic once per take instead of on every poll; a take's header never
 * changes once recording has started. Returns null for anything that
 * isn't a well-formed PCM WAV header (not RIFF/WAVE, no fmt/data chunk,
 * or an unsupported bit depth) — same "couldn't read this" meaning
 * decodeWavPcm's own null already carries. */
export function parseWavHeader(bytes: Uint8Array): WavHeader | null {
  if (bytes.length < 12) return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (readAscii(view, 0, 4) !== "RIFF" || readAscii(view, 8, 4) !== "WAVE") return null;

  let sampleRate = 0;
  let numChannels = 1;
  let bitsPerSample = 16;
  let dataOffset = -1;
  let declaredDataSize = 0;

  let offset = 12;
  while (offset + 8 <= bytes.length) {
    const chunkId = readAscii(view, offset, 4);
    const chunkSize = view.getUint32(offset + 4, true);
    const chunkDataStart = offset + 8;
    if (chunkId === "fmt ") {
      numChannels = view.getUint16(chunkDataStart + 2, true);
      sampleRate = view.getUint32(chunkDataStart + 4, true);
      bitsPerSample = view.getUint16(chunkDataStart + 14, true);
      // Chunks are word-aligned: an odd-sized chunk has one byte of
      // padding after it that isn't part of chunkSize.
      offset = chunkDataStart + chunkSize + (chunkSize % 2);
    } else if (chunkId === "data") {
      dataOffset = chunkDataStart;
      declaredDataSize = chunkSize;
      // Stop walking chunks here rather than using a possibly-stale/zero
      // chunkSize to find "the next chunk" — that would walk straight
      // into the real PCM bytes and try to read them as bogus chunk
      // headers. Harmless in practice (vanishingly unlikely to spell out
      // another "data"/"fmt " by chance) but pointless: this app's own
      // recordings never have anything meaningful after "data" anyway.
      break;
    } else {
      offset = chunkDataStart + chunkSize + (chunkSize % 2);
    }
  }

  if (dataOffset === -1 || sampleRate <= 0 || numChannels < 1) return null;
  if (![8, 16, 32].includes(bitsPerSample)) return null;

  return { sampleRate, numChannels, bitsPerSample, dataOffset, declaredDataSize };
}

/** Decodes PCM frames `fromFrame` onward (a "frame" = one sample per
 * channel — only channel 0 is ever kept in the output, same as
 * decodeWavPcm) from a buffer whose header has already been parsed —
 * the incremental counterpart to decodeWavPcm's own single-shot decode,
 * letting a live, repeatedly-polled caller (see
 * lib/audio/pitchDetection.ts's own extendLiveVoicedAnalysis and
 * SolfegePhraseSingingExercise.tsx's live-check effect) decode only the
 * NEWLY available frames on each poll instead of re-decoding the whole
 * take from frame 0 every time — the fix for that effect's own previously
 * documented O(whole-take-so-far) per-poll cost.
 *
 * Trusts the buffer's own actual length over the header's own
 * `declaredDataSize` when the latter is 0 or would overshoot what's
 * really there — same reconciliation decodeWavPcm always did, needed
 * because a file read WHILE STILL BEING RECORDED (before the writer has
 * gone back and patched the "data" chunk's real size into the header —
 * AVAudioRecorder on iOS only finalizes it on stop()) commonly reports 0
 * or some other stale, smaller value even though the real audio bytes are
 * already on disk. `bytes` may be smaller (data not caught up yet) or
 * larger (more has been written since `header` was parsed) than at parse
 * time — only whatever's actually within `bytes` is ever read. A partial
 * trailing frame (bytes end mid-sample, between two frame boundaries) is
 * simply not included yet; the next call, once more bytes have landed,
 * decodes it as part of its own range instead. */
export function decodeWavPcmFrames(bytes: Uint8Array, header: WavHeader, fromFrame: number): Float32Array {
  const { dataOffset, numChannels, bitsPerSample, declaredDataSize } = header;
  const bytesPerSample = bitsPerSample / 8;
  const bytesPerFrame = bytesPerSample * numChannels;
  const remaining = Math.max(0, bytes.length - dataOffset);
  const dataSize = declaredDataSize > 0 && declaredDataSize <= remaining ? declaredDataSize : remaining;
  const totalFrames = Math.floor(dataSize / bytesPerFrame);
  const frameCount = Math.max(0, totalFrames - fromFrame);

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const samples = new Float32Array(frameCount);
  for (let i = 0; i < frameCount; i++) {
    const sampleOffset = dataOffset + (fromFrame + i) * bytesPerFrame; // channel 0 only
    if (bitsPerSample === 16) {
      samples[i] = view.getInt16(sampleOffset, true) / 32768;
    } else if (bitsPerSample === 8) {
      samples[i] = (view.getUint8(sampleOffset) - 128) / 128;
    } else {
      samples[i] = view.getInt32(sampleOffset, true) / 2147483648;
    }
  }
  return samples;
}

/** Decodes a WAV file's PCM audio data to Float32 samples in [-1, 1] —
 * mono (channel 0 only, if the file has more) at its own native sample
 * rate. Returns null for anything that isn't a well-formed PCM WAV (not
 * RIFF/WAVE, no fmt/data chunk, or an unsupported bit depth) — a caller
 * treats that the same as "couldn't determine a pitch" (see e.g.
 * SolfegeNoteSingingExercise's own handling), since on Android this
 * app's recorder falls back to a compressed format entirely, by design
 * (see RECORDING_OPTIONS's own doc) — that isn't an error, just nothing
 * this function can read. A thin wrapper over parseWavHeader +
 * decodeWavPcmFrames (from frame 0) for a one-shot caller that doesn't
 * need either step on its own — see those functions' own docs for the
 * incremental use case this split also enables. */
export function decodeWavPcm(bytes: Uint8Array): DecodedWav | null {
  const header = parseWavHeader(bytes);
  if (!header) return null;
  const samples = decodeWavPcmFrames(bytes, header, 0);
  return { samples, sampleRate: header.sampleRate };
}
