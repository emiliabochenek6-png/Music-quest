import { useSyncExternalStore } from "react";
import { readJson, STORAGE_KEYS, writeJson } from "@/lib/storage";

/** Whether the info card above a world's path (description, "Zapoznaj się" switch, hint) is folded away so more of the path shows.
 * One choice for every world, remembered on this device. */
interface WorldCardPreference {
  collapsed: boolean;
}

let state: WorldCardPreference = { collapsed: false };
let loadStarted = false;
const listeners = new Set<() => void>();

function load() {
  if (loadStarted) return;
  loadStarted = true;
  readJson<Partial<WorldCardPreference>>(STORAGE_KEYS.worldCard)
    .then((stored) => {
      if (stored && typeof stored.collapsed === "boolean") {
        state = { collapsed: stored.collapsed };
        listeners.forEach((listener) => listener());
      }
    })
    .catch(() => {
      // Storage unavailable: the card simply starts open.
    });
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useWorldCardCollapsed(): { collapsed: boolean; setCollapsed: (collapsed: boolean) => void } {
  const current = useSyncExternalStore(subscribe, () => state, () => state);
  return {
    collapsed: current.collapsed,
    setCollapsed: (collapsed) => {
      state = { collapsed };
      listeners.forEach((listener) => listener());
      void writeJson(STORAGE_KEYS.worldCard, state).catch(() => {});
    },
  };
}
