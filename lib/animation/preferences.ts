import { useSyncExternalStore } from "react";
import { readJson, STORAGE_KEYS, writeJson } from "@/lib/storage";

/** The "Animacje" switch of the settings: whether the big reward scenes (the gift box, the level-up flight) play their animation.
 * On by default and independent of the phone's own "remove animations" setting, which some phones turn on by themselves
 * (e.g. in battery saving) and which used to silently skip these scenes. A tiny module-level store, remembered on this device. */
interface AnimationPreference {
  animationsEnabled: boolean;
}

const DEFAULT: AnimationPreference = { animationsEnabled: true };

let state: AnimationPreference = DEFAULT;
let loadStarted = false;
const listeners = new Set<() => void>();

function load() {
  if (loadStarted) return;
  loadStarted = true;
  readJson<Partial<AnimationPreference>>(STORAGE_KEYS.animations)
    .then((stored) => {
      if (stored && typeof stored.animationsEnabled === "boolean") {
        state = { animationsEnabled: stored.animationsEnabled };
        listeners.forEach((listener) => listener());
      }
    })
    .catch(() => {
      // Storage unavailable: the default (animations on) is fine.
    });
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useAnimationPreference(): AnimationPreference & { setAnimationsEnabled: (enabled: boolean) => void } {
  const current = useSyncExternalStore(subscribe, () => state, () => state);
  return {
    ...current,
    setAnimationsEnabled: (animationsEnabled) => {
      state = { animationsEnabled };
      listeners.forEach((listener) => listener());
      void writeJson(STORAGE_KEYS.animations, state).catch(() => {});
    },
  };
}

/** True when the reward scenes should skip straight to their final picture (the player switched the animations off). */
export function useReducedMotion(): boolean {
  return !useAnimationPreference().animationsEnabled;
}
