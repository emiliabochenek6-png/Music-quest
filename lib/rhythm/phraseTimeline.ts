import { NOTE_VALUE_BEATS } from "@/lib/rhythm/valueBeats";
import type { RhythmNoteValue } from "@/types/exercises";

export interface TimelineItem<T> {
  note: T;
  onsetMs: number;
  durationMs: number;
}

/** Lays a phrase out in time: each note starts when the previous one ends and lasts as long as its written value (a half note twice
 * a quarter, a dotted quarter one and a half). `beatMs` is the length of one quarter note. */
export function phraseTimeline<T>(notes: readonly T[], rhythm: readonly RhythmNoteValue[], beatMs: number): TimelineItem<T>[] {
  let cursorMs = 0;
  return notes.map((note, index) => {
    const durationMs = NOTE_VALUE_BEATS[rhythm[index] ?? "quarter"] * beatMs;
    const item = { note, onsetMs: cursorMs, durationMs };
    cursorMs += durationMs;
    return item;
  });
}
