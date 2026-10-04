import { Easing } from "react-native";

// CSS easing curves used by the designs
export const EASE_IN_OUT = Easing.bezier(0.42, 0, 0.58, 1);
export const EASE_OUT = Easing.bezier(0, 0, 0.58, 1);
export const EASE_IN = Easing.bezier(0.42, 0, 1, 1);
export type Ease = (t: number) => number;

/** One value over time, as keyframes: `at` in ms on the clock; `ease` shapes the stretch that STARTS at that key.
 * The stretches are sampled into a piecewise-linear range, so one native clock can drive every animation. */
export interface Key {
  at: number;
  v: number;
  ease?: Ease;
}

export function track(keys: Key[], steps = 8): { inputRange: number[]; outputRange: number[] } {
  const inputRange: number[] = [];
  const outputRange: number[] = [];
  const push = (at: number, v: number) => {
    const last = inputRange[inputRange.length - 1];
    inputRange.push(last !== undefined && at <= last ? last + 0.01 : at);
    outputRange.push(v);
  };
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    for (let s = 0; s < steps; s++) {
      const x = s / steps;
      push(a.at + (b.at - a.at) * x, a.v + (b.v - a.v) * (a.ease ? a.ease(x) : x));
    }
  }
  const lastKey = keys[keys.length - 1];
  push(lastKey.at, lastKey.v);
  return { inputRange, outputRange };
}

/** Like `track`, for rotations: the values are degrees, the output is "12deg" strings. */
export function trackDeg(keys: Key[], steps = 8): { inputRange: number[]; outputRange: string[] } {
  const t = track(keys, steps);
  return { inputRange: t.inputRange, outputRange: t.outputRange.map((d) => `${d}deg`) };
}

/** A `ramp` for a clock that runs `total` ms: sits at `from` until `delay`, runs to `to` over `duration`, and stays there. */
export function makeRamp(total: number) {
  return function ramp(delay: number, duration: number, from: number, to: number, ease: Ease = EASE_OUT): Key[] {
    return [
      { at: 0, v: from },
      { at: delay, v: from, ease },
      { at: delay + duration, v: to },
      { at: total, v: to },
    ];
  };
}
