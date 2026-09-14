import { describe, expect, it } from "@jest/globals";
import { decodeWavPcm, decodeWavPcmFrames, parseWavHeader } from "@/lib/audio/wavDecoder";
import { encodeWavMono16 } from "@/lib/audio/wavEncoder";

function sineFloat32(frequencyHz: number, durationSeconds: number, sampleRate: number, amplitude = 0.5): Float32Array {
  const length = Math.floor(durationSeconds * sampleRate);
  const samples = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    samples[i] = amplitude * Math.sin((2 * Math.PI * frequencyHz * i) / sampleRate);
  }
  return samples;
}

describe("decodeWavPcm", () => {
  it("round-trips a mono 16-bit WAV encoded by this app's own encoder", () => {
    const sampleRate = 16000;
    const original = sineFloat32(440, 0.5, sampleRate);
    const encoded = encodeWavMono16(original, sampleRate);
    const decoded = decodeWavPcm(encoded);
    expect(decoded).not.toBeNull();
    expect(decoded!.sampleRate).toBe(sampleRate);
    expect(decoded!.samples.length).toBe(original.length);
    for (let i = 0; i < original.length; i += 37) {
      expect(Math.abs(decoded!.samples[i] - original[i])).toBeLessThan(0.001);
    }
  });

  it("skips extra chunks (e.g. LIST/metadata) placed before the data chunk", () => {
    const sampleRate = 16000;
    const original = sineFloat32(330, 0.2, sampleRate);
    const encoded = encodeWavMono16(original, sampleRate);
    // Splice a fake odd-sized "junk" chunk right after the fmt chunk (byte
    // 36, where the real file's "data" chunk id starts) to exercise both
    // "skip an unknown chunk" and "chunks are word-aligned" (odd payload
    // size needs one padding byte) at once.
    const junkPayload = new Uint8Array([1, 2, 3]); // odd length: 3 bytes
    const junkHeader = new Uint8Array(8);
    const junkView = new DataView(junkHeader.buffer);
    junkView.setUint32(0, 0x4a4e554a, false); // "JUNK" (arbitrary 4-char id), byte order doesn't matter for an opaque id
    junkView.setUint32(4, junkPayload.length, true);
    const padding = junkPayload.length % 2 === 1 ? new Uint8Array([0]) : new Uint8Array(0);

    const before = encoded.subarray(0, 36); // RIFF header through end of fmt chunk
    const after = encoded.subarray(36); // "data" chunk onward
    const withJunk = new Uint8Array(before.length + junkHeader.length + junkPayload.length + padding.length + after.length);
    withJunk.set(before, 0);
    withJunk.set(junkHeader, before.length);
    withJunk.set(junkPayload, before.length + junkHeader.length);
    withJunk.set(padding, before.length + junkHeader.length + junkPayload.length);
    withJunk.set(after, before.length + junkHeader.length + junkPayload.length + padding.length);
    // Fix up the RIFF chunk size (bytes 4-7) to account for the inserted bytes.
    const fixedView = new DataView(withJunk.buffer);
    fixedView.setUint32(4, withJunk.length - 8, true);

    const decoded = decodeWavPcm(withJunk);
    expect(decoded).not.toBeNull();
    expect(decoded!.sampleRate).toBe(sampleRate);
    expect(decoded!.samples.length).toBe(original.length);
    expect(Math.abs(decoded!.samples[10] - original[10])).toBeLessThan(0.001);
  });

  it("recovers audio from a file whose data-chunk size is still 0 — a WAV read WHILE STILL BEING RECORDED, before the writer backpatches the real size on stop()", () => {
    const sampleRate = 16000;
    const original = sineFloat32(523.25, 0.3, sampleRate);
    const encoded = encodeWavMono16(original, sampleRate);
    // encodeWavMono16's own fixed 44-byte header writes the data chunk's
    // size at byte offset 40 — zero it out to simulate AVAudioRecorder's
    // own not-yet-finalized header, even though the real PCM bytes are
    // already appended after it (exactly what reading recorder.uri mid-
    // take, before stop(), looks like on iOS).
    const unfinalized = new Uint8Array(encoded);
    new DataView(unfinalized.buffer).setUint32(40, 0, true);

    const decoded = decodeWavPcm(unfinalized);
    expect(decoded).not.toBeNull();
    expect(decoded!.sampleRate).toBe(sampleRate);
    expect(decoded!.samples.length).toBe(original.length);
    expect(Math.abs(decoded!.samples[10] - original[10])).toBeLessThan(0.001);
  });

  it("returns null for a non-WAV buffer (e.g. a compressed AAC/M4A file)", () => {
    const notWav = new Uint8Array(100).fill(0x41);
    expect(decodeWavPcm(notWav)).toBeNull();
  });

  it("returns null for a buffer too short to contain a header", () => {
    expect(decodeWavPcm(new Uint8Array(4))).toBeNull();
  });
});

describe("parseWavHeader + decodeWavPcmFrames (incremental decoding)", () => {
  it("splitting a decode into fromFrame 0..N and N..end matches decoding it all at once", () => {
    const sampleRate = 16000;
    const original = sineFloat32(440, 0.5, sampleRate);
    const encoded = encodeWavMono16(original, sampleRate);

    const header = parseWavHeader(encoded);
    expect(header).not.toBeNull();
    const wholeTake = decodeWavPcmFrames(encoded, header!, 0);
    expect(wholeTake.length).toBe(original.length);
    // Asking again from the very end should report nothing new — the
    // signal the live-check effect uses to skip a tick's own analysis
    // work entirely when nothing has been written since the last poll.
    expect(decodeWavPcmFrames(encoded, header!, wholeTake.length).length).toBe(0);

    const splitFrame = Math.floor(original.length / 3);
    const rest = decodeWavPcmFrames(encoded, header!, splitFrame);
    expect(rest.length).toBe(original.length - splitFrame);
    for (let i = 0; i < rest.length; i += 41) {
      expect(rest[i]).toBeCloseTo(original[splitFrame + i], 4);
    }
  });

  it("decodes only the newly-available frames when called against a growing, still-recording buffer", () => {
    const sampleRate = 16000;
    const original = sineFloat32(392, 0.6, sampleRate);
    const encoded = encodeWavMono16(original, sampleRate);
    // Simulate a mid-recording read: the header's own declared data size
    // isn't finalized yet (see decodeWavPcm's own "data-chunk size still
    // 0" test), and only PART of the file has been written to disk so far.
    const unfinalized = new Uint8Array(encoded);
    new DataView(unfinalized.buffer).setUint32(40, 0, true);
    const firstReadByteLength = 44 + Math.floor(original.length / 2) * 2; // header + half the 16-bit samples
    const firstRead = unfinalized.subarray(0, firstReadByteLength);

    const header = parseWavHeader(firstRead);
    expect(header).not.toBeNull();
    const firstFrames = decodeWavPcmFrames(firstRead, header!, 0);
    expect(firstFrames.length).toBeGreaterThan(0);
    expect(firstFrames.length).toBeLessThan(original.length);

    // Second "poll": the file has grown to its full, final length. Asking
    // for frames from where the first read left off should return ONLY
    // the newly-available tail, not the whole take again.
    const secondFrames = decodeWavPcmFrames(unfinalized, header!, firstFrames.length);
    expect(firstFrames.length + secondFrames.length).toBe(original.length);
    for (let i = 0; i < secondFrames.length; i += 37) {
      expect(secondFrames[i]).toBeCloseTo(original[firstFrames.length + i], 4);
    }
  });
});
