/** Recordings of single notes of real orchestra instruments, for the
 * "Który instrument słyszysz?" questions in Królestwo Instrumentów (a
 * key-fact-choice's `referenceAudioSource`, played through the 🔊 button).
 *
 * Source: University of Iowa Electronic Music Studios, "Musical Instrument
 * Samples" (theremin.music.uiowa.edu/MIS.html) — per that page, "these
 * recordings have been freely available on this website and may be
 * downloaded and used for any projects, without restrictions." One mezzo-
 * forte note per instrument, cut out of the original chromatic-scale
 * AIFFs, downmixed to mono 22.05 kHz 16-bit WAV, normalized and given a
 * short fade-out (about 40-110 KB each). Original files: Violin.arco.mf.
 * sulA.A4B4 (A4), Cello.arco.mf.sulA.A3B3 (A3), Bass.arco.mf.sulA.A1B1
 * (A1), Flute.vib.mf.C5B5, Oboe.mf.C5B5, BbClar.mf.C4B4, Bassoon.mf.C3B3,
 * AltoSax.NoVib.mf.C5Ab5, Trumpet.novib.mf.E3B3, Horn.mf.C4B4, TenorTrombone.
 * mf.C3B3, Tuba.mf.C2B2, xylophone.rosewood.mf.C5B5, 8triangle.mf — the
 * first note of each file. The one exception is the snare drum ("werbel"):
 * the Iowa set has none, so it comes from Wikimedia Commons' "Drum - Cadence
 * B.ogg" (commons.wikimedia.org/wiki/File:Drum_-_Cadence_B.ogg), a snare-drum
 * cadence by the U.S. Navy Band — public domain as a work of a U.S. Navy
 * employee made in the course of official duties. A 2-second rhythmic
 * figure (0.40-2.40 s) was cut out, downmixed to mono 22.05 kHz, normalized
 * and given a short fade-out. Keys match the `instrument_*` icon names
 * (components/icons/icons.ts) minus that prefix. */
export const INSTRUMENT_SAMPLES = {
  skrzypce: require("@/assets/audio/instruments/skrzypce.wav"),
  wiolonczela: require("@/assets/audio/instruments/wiolonczela.wav"),
  kontrabas: require("@/assets/audio/instruments/kontrabas.wav"),
  flet: require("@/assets/audio/instruments/flet.wav"),
  oboj: require("@/assets/audio/instruments/oboj.wav"),
  klarnet: require("@/assets/audio/instruments/klarnet.wav"),
  fagot: require("@/assets/audio/instruments/fagot.wav"),
  saksofon: require("@/assets/audio/instruments/saksofon.wav"),
  trabka: require("@/assets/audio/instruments/trabka.wav"),
  rog: require("@/assets/audio/instruments/rog.wav"),
  puzon: require("@/assets/audio/instruments/puzon.wav"),
  tuba: require("@/assets/audio/instruments/tuba.wav"),
  ksylofon: require("@/assets/audio/instruments/ksylofon.wav"),
  trojkat: require("@/assets/audio/instruments/trojkat.wav"),
  werbel: require("@/assets/audio/instruments/werbel.wav"),
} as const;

export type InstrumentSampleName = keyof typeof INSTRUMENT_SAMPLES;
