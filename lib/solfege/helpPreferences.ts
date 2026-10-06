import { useSyncExternalStore } from "react";
import { readJson, STORAGE_KEYS, writeJson } from "@/lib/storage";

/** "Zaczarowany Solfeż"'s own per-device help switches (the toolbar shown
 * in every listening/singing exercise — see components/exercises/
 * SolfegeHelpBar.tsx): slow tempo and whether the microphone is used at
 * all. Not part of ProfileState on purpose — these are practice aids, not
 * a profile, and a tiny module-level store keeps every exercise of a
 * lesson (each one a fresh mount) agreeing on the same values without
 * another provider in the root stack. */
export interface SolfegeHelp {
  /** Play reference phrases and the pacing metronome at ~60% tempo. */
  slow: boolean;
  /** False = no microphone: singing exercises ask the player to sing
   * along on their own and tap "Zaśpiewane" instead of being graded. */
  micEnabled: boolean;
  /** Songs and fragments with a rhythm: pace the take (or the sing-along without the microphone) with a metronome. */
  metronome: boolean;
}

/** Slow tempo plays at this fraction of normal speed. */
export const SOLFEGE_SLOW_TEMPO_FACTOR = 0.6;

const DEFAULT_HELP: SolfegeHelp = { slow: false, micEnabled: true, metronome: false };

let state: SolfegeHelp = DEFAULT_HELP;
let loadStarted = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function load() {
  if (loadStarted) return;
  loadStarted = true;
  readJson<Partial<SolfegeHelp>>(STORAGE_KEYS.solfegeHelp)
    .then((stored) => {
      if (stored) {
        state = { ...DEFAULT_HELP, ...stored };
        emit();
      }
    })
    .catch(() => {
      // Storage unavailable — defaults are fine, nothing to restore.
    });
}

function subscribe(listener: () => void): () => void {
  load();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): SolfegeHelp {
  return state;
}

function update(patch: Partial<SolfegeHelp>) {
  state = { ...state, ...patch };
  emit();
  void writeJson(STORAGE_KEYS.solfegeHelp, state).catch(() => {
    // Not persisted this time — the switch still works for this session.
  });
}

export function useSolfegeHelp(): SolfegeHelp & { setSlow: (slow: boolean) => void; setMicEnabled: (micEnabled: boolean) => void; setMetronome: (metronome: boolean) => void } {
  const help = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return { ...help, setSlow: (slow) => update({ slow }), setMicEnabled: (micEnabled) => update({ micEnabled }), setMetronome: (metronome) => update({ metronome }) };
}
