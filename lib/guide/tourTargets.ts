import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import type { View } from "react-native";

/** Spots on screen the guide can point at. A screen marks an element with
 * `useTourTarget("id")` (or the TourTarget wrapper); the guide looks the
 * element up by id and measures where it is right now. */
const targets = new Map<string, RefObject<View | null>>();

export interface TourRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Returns a ref to put on the element that should be highlightable under `id` (nothing is registered when `id` is undefined). */
export function useTourTarget(id?: string): RefObject<View | null> {
  const ref = useRef<View>(null);
  useEffect(() => {
    if (!id) return;
    targets.set(id, ref);
    return () => {
      if (targets.get(id) === ref) targets.delete(id);
    };
  }, [id]);
  return ref;
}

/** Where `id` is in the window right now, or null when it isn't on screen (not mounted, zero-sized). */
export function measureTourTarget(id: string): Promise<TourRect | null> {
  const ref = targets.get(id);
  const node = ref?.current;
  if (!node) return Promise.resolve(null);
  return new Promise((resolve) => {
    node.measureInWindow((x, y, width, height) => {
      resolve(width > 0 && height > 0 && Number.isFinite(x) && Number.isFinite(y) ? { x, y, width, height } : null);
    });
  });
}
