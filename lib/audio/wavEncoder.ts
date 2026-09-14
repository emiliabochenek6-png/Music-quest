/**
 * Minimal mono 16-bit PCM WAV encoder — "Zaczarowany Solfeż"'s own
 * "odsłuchaj swoją nagrywkę" playback needs a real file expo-audio's
 * player can open, but the raw microphone take only ever exists as
 * in-memory float32 PCM (see lib/audio/pitchDetection.ts's
 * concatFloat32). WAV is the simplest container that needs no codec —
 * just this fixed 44-byte header in front of the raw samples — so nothing
 * beyond DataView is needed to produce a file every platform can play
 * straight back.
 */
function writeAsciiString(view: DataView, offset: number, text: string): void {
  for (let i = 0; i < text.length; i++) {
    view.setUint8(offset + i, text.charCodeAt(i));
  }
}

/** Encodes float32 PCM samples (each expected in [-1, 1], the same range
 * expo-audio's AudioStream buffers already use) as a standalone mono
 * 16-bit WAV file. */
export function encodeWavMono16(samples: Float32Array, sampleRate: number): Uint8Array {
  const bytesPerSample = 2;
  const dataSize = samples.length * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  writeAsciiString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeAsciiString(view, 8, "WAVE");
  writeAsciiString(view, 12, "fmt ");
  view.setUint32(16, 16, true); // fmt chunk size
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * bytesPerSample, true); // byte rate
  view.setUint16(32, bytesPerSample, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  writeAsciiString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, Math.round(clamped * (clamped < 0 ? 0x8000 : 0x7fff)), true);
    offset += 2;
  }

  return new Uint8Array(buffer);
}
