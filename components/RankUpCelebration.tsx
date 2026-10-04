import { useEffect, useMemo, useRef, useState } from "react";
import { AccessibilityInfo, Animated, Easing, Image, Modal, Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Svg, { Circle, Defs, Path, Polygon, RadialGradient, Rect, Stop, LinearGradient as SvgLinearGradient } from "react-native-svg";
import { OUTFIT_IMAGES } from "@/components/shop/shopImages";
import { useGamification } from "@/context/GamificationContext";
import { getTitleUnlockedAt } from "@/lib/gamification/rank";
import { DEFAULT_OUTFIT_ID } from "@/lib/shop/catalog";

const SOLFEK_HI_RES = require("@/assets/celebration/solfek.png");
const GROUND = require("@/assets/celebration/ground.jpg");

interface RankUpCelebrationProps {
  visible: boolean;
  /** The level just reached, and the one before it. */
  rank: number | null;
  fromRank?: number | null;
  rankName: string | null;
  /** Nutki paid out with this level (shown in the reward line). */
  nutki?: number;
  onClose: () => void;
}

const TOTAL_MS = 5000;

const INK = "#3b2414";
const SOFT_INK = "#7a5a43";
const CREAM = "#fff6e8";
const SAND = "#ffe9cc";
const ORANGE = "#f28a1e";
const DEEP_ORANGE = "#d9571a";
const GOLD = "#ffc83d";

const STAR_PATH = "M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z";
const NOTE_PATH = "M10 3v11.3A3.5 3.5 0 1 0 12 17.5V8l6 1.5V5.2z";
const CLOUD_PATH = "M28 52a18 18 0 0 1 2-36 24 24 0 0 1 44-4 18 18 0 0 1 26 18 13 13 0 0 1 2 22z";

// CSS easing curves used by the design
const EASE_IN_OUT = Easing.bezier(0.42, 0, 0.58, 1);
const EASE_OUT = Easing.bezier(0, 0, 0.58, 1);
const EASE_IN = Easing.bezier(0.42, 0, 1, 1);
type Ease = (t: number) => number;

/** One value over time, as keyframes: `at` in ms on the stage clock; `ease` shapes the stretch that STARTS at that key.
 * The stretches are sampled into a piecewise-linear range, so one native clock can drive every animation. */
interface Key {
  at: number;
  v: number;
  ease?: Ease;
}
function track(keys: Key[], steps = 8): { inputRange: number[]; outputRange: number[] } {
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

/** A value that sits at `from` until `delay`, runs to `to` over `duration`, and stays there. */
function ramp(delay: number, duration: number, from: number, to: number, ease: Ease = EASE_OUT): Key[] {
  return [
    { at: 0, v: from },
    { at: delay, v: from, ease },
    { at: delay + duration, v: to },
    { at: TOTAL_MS, v: to },
  ];
}

// ---- the two designs: "telefon" (a 390×844 stage, scaled) and "laptop" (a 1440×900 stage, the card beside Solfek) ----------
type Kind = "note" | "star";
interface Layout {
  wide: boolean;
  stageW: number;
  stageH: number;
  /** How far the camera slides the world down while Solfek flies up. */
  camera: number;
  worldH: number;
  skyH: number;
  skyStops: [number, string][];
  /** [left as a share of the screen width, top, size] */
  stars: [number, number, number][];
  /** [left share, top, width, opacity, left offset in px] */
  clouds: [number, number, number, number, number][];
  hillsH: number;
  hillsX: number;
  /** Streaks: [left share, height, width, delay s] and how far they fall. */
  speed: [number, number, number, number][];
  speedFrom: number;
  speedTo: number;
  rays: { left: number; top: number; size: number; spinMs: number };
  fly: { left: number; top: number; size: number; hoverDy: number; keys: [number, number, number, number, number] };
  /** [left, top, dx, rotation, delay s, size, kind, fill] (positions inside the flying box) */
  trail: [number, number, number, number, number, number, Kind, string][];
  trailDy: number;
  dustDy: number;
  dustScale: number;
  /** [left, top, size, delay s, kind, fill] (positions inside the stage) */
  burst: [number, number, number, number, Kind, string][];
  cardIn: { fromX: number; fromY: number; scale: number };
}

const PHONE: Layout = {
  wide: false,
  stageW: 390,
  stageH: 844,
  camera: 600,
  worldH: 1900,
  skyH: 1120,
  skyStops: [[0, "#ffc860"], [0.3, "#ffc860"], [0.62, "#ffdb94"], [1, "#fdebd3"]],
  stars: [[0.113, 470, 20], [0.815, 440, 16], [0.87, 610, 22], [0.6, 300, 18]],
  clouds: [[0.5, 260, 128, 0.85, -175], [0.056, 550, 150, 0.9, 0], [0.595, 700, 128, 0.85, 0], [0.077, 850, 112, 0.85, 0], [0.636, 970, 150, 0.9, 0]],
  hillsH: 844,
  hillsX: 0.7,
  speed: [[0.118, 96, 4, 1.65], [0.267, 70, 3, 1.8], [0.749, 110, 4, 1.7], [0.872, 80, 3, 1.9], [0.051, 60, 3, 2], [0.933, 64, 3, 1.6]],
  speedFrom: -140,
  speedTo: 900,
  rays: { left: -65, top: -2, size: 520, spinMs: 16000 },
  fly: { left: 85, top: 548, size: 220, hoverDy: -10, keys: [-8, 4, -360, -418, -400] },
  trail: [
    [70, 176, -40, -30, 1.5, 28, "note", GOLD],
    [120, 182, 36, 25, 1.62, 24, "star", GOLD],
    [96, 190, -6, 40, 1.75, 30, "note", ORANGE],
    [60, 186, -64, 60, 1.88, 18, "star", GOLD],
    [134, 174, 60, -45, 1.95, 26, "note", GOLD],
  ],
  trailDy: 150,
  dustDy: -22,
  dustScale: 1.7,
  burst: [
    [50, 160, 30, 3.3, "star", GOLD],
    [306, 136, 36, 3.36, "star", GOLD],
    [34, 290, 22, 3.42, "star", GOLD],
    [330, 282, 26, 3.48, "star", GOLD],
    [112, 92, 18, 3.54, "star", GOLD],
    [256, 84, 20, 3.6, "note", ORANGE],
  ],
  cardIn: { fromX: 0, fromY: 50, scale: 0.9 },
};

const LAPTOP: Layout = {
  wide: true,
  stageW: 1440,
  stageH: 900,
  camera: 700,
  worldH: 1700,
  skyH: 702,
  skyStops: [[0, "#ffc860"], [0.15, "#ffc860"], [0.5, "#ffdb94"], [0.8, "#ffeacc"], [1, "#fff2e0"]],
  stars: [[0.083, 120, 24], [0.896, 90, 20], [0.944, 300, 26], [0.042, 420, 18], [0.444, 60, 16]],
  clouds: [[0.049, 200, 220, 0.9, 0], [0.75, 160, 190, 0.85, 0], [0.57, 420, 160, 0.8, 0], [0.139, 600, 180, 0.85, 0], [0.82, 700, 210, 0.9, 0]],
  hillsH: 1000,
  hillsX: 0.5,
  speed: [[0.0625, 120, 4, 1.65], [0.18, 90, 3, 1.8], [0.264, 130, 4, 1.95], [0.5, 100, 3, 1.7], [0.61, 140, 4, 1.85], [0.72, 90, 3, 1.6], [0.84, 120, 4, 2], [0.944, 80, 3, 1.75]],
  speedFrom: -160,
  speedTo: 1100,
  rays: { left: 160, top: -10, size: 760, spinMs: 18000 },
  fly: { left: 380, top: 540, size: 320, hoverDy: -14, keys: [-10, 5, -300, -345, -330] },
  trail: [
    [100, 256, -56, -30, 1.5, 38, "note", GOLD],
    [176, 264, 50, 25, 1.62, 32, "star", GOLD],
    [140, 276, -8, 40, 1.75, 40, "note", ORANGE],
    [86, 270, -90, 60, 1.88, 24, "star", GOLD],
    [196, 252, 84, -45, 1.95, 34, "note", GOLD],
  ],
  trailDy: 190,
  dustDy: -26,
  dustScale: 1.8,
  burst: [
    [300, 230, 40, 3.3, "star", GOLD],
    [730, 190, 46, 3.36, "star", GOLD],
    [260, 440, 30, 3.42, "star", GOLD],
    [740, 470, 32, 3.48, "star", GOLD],
    [430, 140, 24, 3.54, "star", GOLD],
    [630, 130, 28, 3.6, "note", ORANGE],
    [340, 600, 22, 3.66, "note", GOLD],
  ],
  cardIn: { fromX: 60, fromY: 0, scale: 0.92 },
};

// Solfek's hop and flight (percentages of the 3.4 s animation from the design); the offsets differ per layout
const FLY = (pct: number) => (pct / 100) * 3400;
function flyKeys(offsets: [number, number, number, number, number], kind: "y" | "sx" | "sy"): Key[] {
  const [a12, a42, a72, a88, a100] = offsets;
  const bez = Easing.bezier(0.2, 0.9, 0.3, 1);
  if (kind === "y") {
    return [
      { at: 0, v: 0, ease: EASE_IN_OUT },
      { at: FLY(12), v: a12, ease: EASE_IN_OUT },
      { at: FLY(24), v: 0, ease: EASE_OUT },
      { at: FLY(30), v: 0 },
      { at: FLY(42), v: a42, ease: bez },
      { at: FLY(50), v: -90, ease: EASE_OUT },
      { at: FLY(72), v: a72, ease: EASE_IN_OUT },
      { at: FLY(88), v: a88 },
      { at: FLY(100), v: a100 },
      { at: TOTAL_MS, v: a100 },
    ];
  }
  const values = kind === "sx" ? [1, 1, 1, 1.1, 1.16, 0.86, 0.95, 1.04, 1] : [1, 1, 1, 0.86, 0.8, 1.2, 1.07, 0.97, 1];
  const times = [0, 12, 24, 30, 42, 50, 72, 88, 100];
  const eases: (Ease | undefined)[] = [EASE_IN_OUT, EASE_IN_OUT, EASE_OUT, undefined, bez, EASE_OUT, EASE_IN_OUT, undefined, undefined];
  return [...times.map((pct, i) => ({ at: FLY(pct), v: values[i], ease: eases[i] })), { at: TOTAL_MS, v: 1 }];
}

const RAY_POINTS = Array.from({ length: 12 }, (_, i) => {
  const a = (i * 30 * Math.PI) / 180;
  const pts: [number, number][] = [[0, 0], [-8, -100], [8, -100]];
  return pts.map(([x, y]) => `${(x * Math.cos(a) - y * Math.sin(a)).toFixed(2)},${(x * Math.sin(a) + y * Math.cos(a)).toFixed(2)}`).join(" ");
});

/**
 * "Awans co 5 poziomów — odlot Solfka": the full-screen celebration for every 5th level. Solfek crouches, jumps and flies up through
 * the sky; a flash and rays welcome the new level and a card shows the level, the title and the reward. Two designs: a phone one (the
 * card under Solfek) and a laptop one (Solfek on the left, the card and the button on the right); the sky and the hills fill the whole
 * screen in both. Mounted ONCE, globally, in app/_layout.tsx (a rank-up can happen from any screen). Tap anywhere to skip to the end;
 * with "reduce motion" switched on it goes straight to the final card.
 *
 * Built from one native clock (0 → 5 s) that every part reads through `interpolate`, so the whole piece is one animation instead of
 * dozens (see `track`).
 */
export function RankUpCelebration({ visible, rank, fromRank, rankName, nutki = 0, onClose }: RankUpCelebrationProps) {
  return (
    <Modal visible={visible} transparent={false} animationType="fade" onRequestClose={onClose}>
      {visible && rank !== null && <Stage rank={rank} fromRank={fromRank ?? rank - 1} rankName={rankName} nutki={nutki} onClose={onClose} />}
    </Modal>
  );
}

function Stage({ rank, fromRank, rankName, nutki, onClose }: { rank: number; fromRank: number; rankName: string | null; nutki: number; onClose: () => void }) {
  const { width, height } = useWindowDimensions();
  const { state } = useGamification();
  const L = width >= 900 && width > height ? LAPTOP : PHONE;
  const scale = L.wide ? Math.max(0.55, Math.min(1, (width / 1440) * 1.15, height / 900)) : Math.max(0.6, Math.min(width / 390, height / 844, 1.4));
  const clock = useRef(new Animated.Value(0)).current;
  const loop = useRef(new Animated.Value(0)).current; // 0 → 1 forever: the rays turn
  const barWidth = useRef(new Animated.Value(0)).current;
  const hover = useRef(new Animated.Value(0)).current;
  const twinkleLoop = useRef(new Animated.Value(0)).current;
  const [ready, setReady] = useState(false);

  const outfit = OUTFIT_IMAGES[state.shopEquipped.ubior ?? DEFAULT_OUTFIT_ID];
  const solfekImage = !state.shopEquipped.ubior || state.shopEquipped.ubior === DEFAULT_OUTFIT_ID || !outfit ? SOLFEK_HI_RES : outfit;
  const newTitle = getTitleUnlockedAt(rank);

  useEffect(() => {
    let cancelled = false;
    const finish = () => {
      clock.setValue(TOTAL_MS);
      barWidth.setValue(1);
      setReady(true);
    };
    AccessibilityInfo.isReduceMotionEnabled()
      .then((reduced) => {
        if (cancelled) return;
        if (reduced) {
          finish();
          return;
        }
        Animated.timing(clock, { toValue: TOTAL_MS, duration: TOTAL_MS, easing: Easing.linear, useNativeDriver: true }).start();
        Animated.timing(barWidth, { toValue: 1, duration: 900, delay: 150, easing: Easing.bezier(0.3, 0, 0.2, 1), useNativeDriver: false }).start();
      })
      .catch(() => {
        if (!cancelled) Animated.timing(clock, { toValue: TOTAL_MS, duration: TOTAL_MS, easing: Easing.linear, useNativeDriver: true }).start();
      });
    Animated.loop(Animated.timing(loop, { toValue: 1, duration: L.rays.spinMs, easing: Easing.linear, useNativeDriver: true })).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(twinkleLoop, { toValue: 1, duration: 1400, easing: EASE_IN_OUT, useNativeDriver: true }),
        Animated.timing(twinkleLoop, { toValue: 0, duration: 1400, easing: EASE_IN_OUT, useNativeDriver: true }),
      ])
    ).start();
    const hoverTimer = setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(hover, { toValue: 1, duration: 1300, easing: EASE_IN_OUT, useNativeDriver: true }),
          Animated.timing(hover, { toValue: 0, duration: 1300, easing: EASE_IN_OUT, useNativeDriver: true }),
        ])
      ).start();
    }, 3400);
    const readyTimer = setTimeout(() => setReady(true), 4600);
    return () => {
      cancelled = true;
      clearTimeout(hoverTimer);
      clearTimeout(readyTimer);
      clock.stopAnimation();
      loop.stopAnimation();
      hover.stopAnimation();
      twinkleLoop.stopAnimation();
    };
  }, [clock, loop, barWidth, hover, twinkleLoop, L.rays.spinMs]);

  function skip() {
    if (ready) return;
    clock.stopAnimation();
    clock.setValue(TOTAL_MS);
    barWidth.setValue(1);
    setReady(true);
  }

  const v = useMemo(() => {
    const at = (keys: Key[]) => clock.interpolate(track(keys));
    const cardBez = Easing.bezier(0.2, 1.35, 0.4, 1);
    return {
      worldY: at([{ at: 0, v: 0 }, { at: 1500, v: 0, ease: Easing.bezier(0.6, 0, 0.3, 1) }, { at: 3400, v: L.camera }, { at: TOTAL_MS, v: L.camera }]),
      flyY: at(flyKeys(L.fly.keys, "y")),
      flySx: at(flyKeys(L.fly.keys, "sx")),
      flySy: at(flyKeys(L.fly.keys, "sy")),
      chargeOpacity: at([{ at: 0, v: 0 }, { at: 900, v: 0, ease: EASE_OUT }, { at: 1390, v: 0.9, ease: EASE_OUT }, { at: 1670, v: 1, ease: EASE_OUT }, { at: 2300, v: 0 }, { at: TOTAL_MS, v: 0 }]),
      chargeScale: at([{ at: 0, v: 0.6 }, { at: 900, v: 0.6, ease: EASE_OUT }, { at: 1390, v: 1, ease: EASE_OUT }, { at: 1670, v: 1.12, ease: EASE_OUT }, { at: 2300, v: 1.5 }, { at: TOTAL_MS, v: 1.5 }]),
      shadowScale: at(ramp(1400, 700, 1.15, 0.2, EASE_IN)),
      shadowOpacity: at(ramp(1400, 700, 1, 0, EASE_IN)),
      flashOpacity: at([{ at: 0, v: 0 }, { at: 3100, v: 0, ease: EASE_OUT }, { at: 3250, v: 0.75, ease: EASE_OUT }, { at: 3700, v: 0 }, { at: TOTAL_MS, v: 0 }]),
      raysScale: at(ramp(3150, 700, 0.2, 1, Easing.bezier(0.2, 1.3, 0.4, 1))),
      raysOpacity: at(ramp(3150, 700, 0, 1, Easing.bezier(0.2, 1.3, 0.4, 1))),
      xpOpacity: at(ramp(1300, 450, 1, 0, EASE_IN)),
      xpY: at(ramp(1300, 450, 0, -40, EASE_IN)),
      cardOpacity: at(ramp(3400, 650, 0, 1, cardBez)),
      cardX: at(ramp(3400, 650, L.cardIn.fromX, 0, cardBez)),
      cardY: at(ramp(3400, 650, L.cardIn.fromY, 0, cardBez)),
      cardScale: at(ramp(3400, 650, L.cardIn.scale, 1, cardBez)),
      titleScale: at(ramp(3620, 550, 0.4, 1, Easing.bezier(0.2, 1.7, 0.4, 1))),
      titleOpacity: at(ramp(3620, 550, 0, 1, Easing.bezier(0.2, 1.7, 0.4, 1))),
      ctaOpacity: at(ramp(4200, 500, 0, 1, EASE_OUT)),
      ctaY: at(ramp(4200, 500, 24, 0, EASE_OUT)),
      spin: loop.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] }),
    };
  }, [clock, loop, L]);

  const hoverY = hover.interpolate({ inputRange: [0, 1], outputRange: [0, L.fly.hoverDy] });
  const hoverRot = hover.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "-2deg"] });
  const twinkleO = twinkleLoop.interpolate({ inputRange: [0, 1], outputRange: [1, 0.55] });
  const twinkleS = twinkleLoop.interpolate({ inputRange: [0, 1], outputRange: [1, 0.82] });
  const barFill = barWidth.interpolate({ inputRange: [0, 1], outputRange: ["12%", "100%"] });

  // pivot of Solfek's squash and stretch: 96 % down his own box (the CSS transform-origin of the design)
  const PIVOT = L.fly.size * 0.46;

  const hillsSize = Math.max(width, L.hillsH); // the picture is square and fills the strip like "background-size: cover"
  const cardTexts = (
    <>
      <View style={styles.pill(L.wide)}>
        <Text style={styles.pillText(L.wide)}>Level {rank}</Text>
      </View>
      <Animated.Text style={[styles.title(L.wide), { opacity: v.titleOpacity, transform: [{ scale: v.titleScale }] }]}>Awans!</Animated.Text>
      <Text style={styles.subtitle(L.wide)}>{newTitle ? "Nowy tytuł Solfka" : "Twój tytuł"}</Text>
      {rankName && <Text style={styles.rank(L.wide)}>{rankName}</Text>}
      <View style={styles.reward(L.wide)}>
        <Svg width={L.wide ? 36 : 32} height={L.wide ? 36 : 32} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
          <Path d={STAR_PATH} fill={GOLD} stroke={DEEP_ORANGE} strokeWidth={1.2} strokeLinejoin="round" />
        </Svg>
        <Text style={styles.rewardText(L.wide)}>{nutki > 0 ? `+${nutki} nutek w nagrodę. Kup nowy ubiór w Sklepie Solfka!` : "Zajrzyj do Sklepu Solfka po nowy ubiór!"}</Text>
      </View>
    </>
  );

  const ctaButton = (
    <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Lecimy dalej!" style={styles.ctaButton(L.wide)}>
      <Text style={styles.ctaText(L.wide)}>Lecimy dalej!</Text>
    </Pressable>
  );

  return (
    <View style={styles.backdrop} testID="rank-up-celebration" accessibilityLabel={`Awans na level ${rank}`}>
      {/* the world fills the whole screen: sky, clouds, hills; the camera slides it down while Solfek flies up */}
      <Animated.View style={[styles.world, { height: L.worldH, transform: [{ translateY: v.worldY }] }]} pointerEvents="none">
        <Svg width={width} height={L.skyH} style={StyleSheet.absoluteFill}>
          <Defs>
            <SvgLinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              {L.skyStops.map(([offset, color]) => (
                <Stop key={offset} offset={offset} stopColor={color} />
              ))}
            </SvgLinearGradient>
          </Defs>
          <Rect x={0} y={0} width={width} height={L.skyH} fill="url(#sky)" />
        </Svg>
        {L.stars.map(([share, top, size]) => (
          <Svg key={`${share}-${top}`} width={size} height={size} viewBox="0 0 24 24" style={{ position: "absolute", left: width * share, top }}>
            <Path d={STAR_PATH} fill={CREAM} />
          </Svg>
        ))}
        {L.clouds.map(([share, top, w, opacity, offset]) => (
          <Svg key={`${share}-${top}`} width={w} height={w / 2} viewBox="0 0 120 60" style={{ position: "absolute", left: width * share + offset, top, opacity }}>
            <Path d={CLOUD_PATH} fill={CREAM} />
          </Svg>
        ))}
        <View style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: L.hillsH, overflow: "hidden" }}>
          <Image source={GROUND} resizeMode="cover" style={{ position: "absolute", width: hillsSize, height: hillsSize, left: (width - hillsSize) * L.hillsX, top: L.hillsH - hillsSize }} />
        </View>
        {L.wide && (
          <>
            <Animated.View style={{ position: "absolute", left: width / 2 - 255, top: 1634, width: 150, height: 24, borderRadius: 12, backgroundColor: "rgba(217,87,26,0.28)", opacity: v.shadowOpacity, transform: [{ scaleX: v.shadowScale }] }} />
            <Dust clock={clock} left={width / 2 - 280} top={1604} size={56} dx={-60} dy={L.dustDy} grow={L.dustScale} />
            <Dust clock={clock} left={width / 2 - 136} top={1604} size={56} dx={60} dy={L.dustDy} grow={L.dustScale} />
            <Dust clock={clock} left={width / 2 - 212} top={1620} size={64} dx={0} dy={L.dustDy} grow={L.dustScale} />
          </>
        )}
      </Animated.View>

      {/* speed streaks */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {L.speed.map(([share, h, w, delay]) => (
          <Streak key={share} clock={clock} left={width * share} height={h} width={w} delay={delay * 1000} from={L.speedFrom} to={L.speedTo} />
        ))}
      </View>

      {/* the stage: its own size, bottom centre, scaled to fit the screen */}
      <View style={[styles.stage, { left: (width - L.stageW) / 2, width: L.stageW, height: L.stageH, transform: [{ scale }], transformOrigin: "50% 100%" } as never]} pointerEvents="box-none">
        {!L.wide && (
          // the phone design: the shadow and the dust sit on the stage and ride the camera down with the world
          <Animated.View style={{ position: "absolute", left: 0, top: 0, width: L.stageW, height: L.stageH, transform: [{ translateY: v.worldY }] }} pointerEvents="none">
            <Animated.View style={{ position: "absolute", left: 135, top: 748, width: 120, height: 20, borderRadius: 10, backgroundColor: "rgba(217,87,26,0.28)", opacity: v.shadowOpacity, transform: [{ scaleX: v.shadowScale }] }} />
            <Dust clock={clock} left={112} top={722} size={44} dx={-46} dy={L.dustDy} grow={L.dustScale} />
            <Dust clock={clock} left={234} top={722} size={44} dx={46} dy={L.dustDy} grow={L.dustScale} />
            <Dust clock={clock} left={170} top={736} size={50} dx={0} dy={L.dustDy} grow={L.dustScale} />
          </Animated.View>
        )}

        {/* rays behind the new level */}
        <Animated.View style={{ position: "absolute", left: L.rays.left, top: L.rays.top, width: L.rays.size, height: L.rays.size, opacity: v.raysOpacity, transform: [{ scale: v.raysScale }] }} pointerEvents="none">
          <Animated.View style={{ transform: [{ rotate: v.spin }] }}>
            <Svg width={L.rays.size} height={L.rays.size} viewBox="-100 -100 200 200">
              {RAY_POINTS.map((points) => (
                <Polygon key={points} points={points} fill={GOLD} opacity={0.45} />
              ))}
              <Circle cx={0} cy={0} r={38} fill={CREAM} opacity={0.7} />
            </Svg>
          </Animated.View>
        </Animated.View>

        {/* Solfek: charges up, jumps, flies */}
        <Animated.View
          style={{ position: "absolute", left: L.fly.left, top: L.fly.top, width: L.fly.size, height: L.fly.size, transform: [{ translateY: v.flyY }, { translateY: PIVOT }, { scaleX: v.flySx }, { scaleY: v.flySy }, { translateY: -PIVOT }] }}
          pointerEvents="none"
        >
          <Animated.View style={{ position: "absolute", left: 0, top: 0, width: L.fly.size, height: L.fly.size, opacity: v.chargeOpacity, transform: [{ scale: v.chargeScale }] }}>
            <Svg width={L.fly.size} height={L.fly.size}>
              <Defs>
                <RadialGradient id="charge" cx="50%" cy="50%" r="50%">
                  <Stop offset="0" stopColor="#ffc83d" stopOpacity={0.85} />
                  <Stop offset="0.45" stopColor="#ffc83d" stopOpacity={0.35} />
                  <Stop offset="0.7" stopColor="#ffc83d" stopOpacity={0} />
                </RadialGradient>
              </Defs>
              <Circle cx={L.fly.size / 2} cy={L.fly.size / 2} r={L.fly.size / 2} fill="url(#charge)" />
            </Svg>
          </Animated.View>
          {L.trail.map(([left, top, dx, rot, delay, size, kind, fill], index) => (
            <Trail key={index} clock={clock} left={left} top={top} dx={dx} dy={L.trailDy} rot={rot} delay={delay * 1000} size={size} kind={kind} fill={fill} />
          ))}
          <Animated.View style={{ width: L.fly.size, height: L.fly.size, transform: [{ translateY: hoverY }, { rotate: hoverRot }] }}>
            <Image source={solfekImage} resizeMode="contain" accessibilityLabel="Solfek" style={{ width: L.fly.size, height: L.fly.size }} />
          </Animated.View>
        </Animated.View>

        {/* stars popping around the new level */}
        <View style={{ position: "absolute", left: 0, top: 0, width: L.stageW, height: L.wide ? L.stageH : 520 }} pointerEvents="none">
          {L.burst.map(([left, top, size, delay, kind, fill]) => (
            <Pop key={`${left}-${top}`} clock={clock} left={left} top={top} size={size} delay={delay * 1000} kind={kind} fill={fill} twinkleO={twinkleO} twinkleS={twinkleS} />
          ))}
        </View>

        {/* the bar that fills up before take-off */}
        <Animated.View style={[L.wide ? styles.xpCardWide : styles.xpCard, { opacity: v.xpOpacity, transform: [{ translateY: v.xpY }] }]} pointerEvents="none">
          <View style={styles.xpLabels}>
            <Text style={styles.xpLabel(L.wide)}>Level {fromRank}</Text>
            <Text style={styles.xpLabel(L.wide)}>Level {rank}</Text>
          </View>
          <View style={[styles.xpTrack, L.wide && { height: 18 }]}>
            <Animated.View style={[styles.xpFill, L.wide && { height: 18 }, { width: barFill }]} />
          </View>
        </Animated.View>

        {/* the result card (and, on a laptop, the button under it) */}
        {L.wide ? (
          <Animated.View style={[styles.cardColumnWide, { opacity: v.cardOpacity, transform: [{ translateX: v.cardX }, { scale: v.cardScale }] }]} pointerEvents="box-none">
            <View style={styles.cardWide}>{cardTexts}</View>
            <Animated.View style={{ opacity: v.ctaOpacity, transform: [{ translateY: v.ctaY }] }} pointerEvents={ready ? "auto" : "none"}>
              {ctaButton}
            </Animated.View>
          </Animated.View>
        ) : (
          <>
            <Animated.View style={[styles.card, { opacity: v.cardOpacity, transform: [{ translateY: v.cardY }, { scale: v.cardScale }] }]} pointerEvents="none">
              {cardTexts}
            </Animated.View>
            <Animated.View style={[styles.cta, { opacity: v.ctaOpacity, transform: [{ translateY: v.ctaY }] }]} pointerEvents={ready ? "auto" : "none"}>
              {ctaButton}
            </Animated.View>
          </>
        )}
      </View>

      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: CREAM, opacity: v.flashOpacity }]} pointerEvents="none" />

      {/* tap anywhere to skip the animation; then the button closes */}
      {!ready && <Pressable style={StyleSheet.absoluteFill} onPress={skip} accessibilityRole="button" accessibilityLabel="Pomiń animację" />}
    </View>
  );
}

/** A puff of dust under Solfek as he pushes off. */
function Dust({ clock, left, top, size, dx, dy, grow }: { clock: Animated.Value; left: number; top: number; size: number; dx: number; dy: number; grow: number }) {
  const t = (keys: Key[]) => clock.interpolate(track(keys));
  const opacity = t([{ at: 0, v: 0 }, { at: 1420, v: 0, ease: EASE_OUT }, { at: 1500, v: 0.95, ease: EASE_OUT }, { at: 2220, v: 0 }, { at: TOTAL_MS, v: 0 }]);
  const x = t(ramp(1420, 800, 0, dx));
  const y = t(ramp(1420, 800, 0, dy));
  const s = t(ramp(1420, 800, 0.4, grow));
  return <Animated.View style={{ position: "absolute", left, top, width: size, height: size, borderRadius: size / 2, backgroundColor: CREAM, opacity, transform: [{ translateX: x }, { translateY: y }, { scale: s }] }} />;
}

/** A white streak that rushes down the screen three times. */
function Streak({ clock, left, height, width, delay, from, to }: { clock: Animated.Value; left: number; height: number; width: number; delay: number; from: number; to: number }) {
  const opKeys: Key[] = [{ at: 0, v: 0 }];
  const yKeys: Key[] = [{ at: 0, v: from }];
  for (let i = 0; i < 3; i++) {
    const start = delay + i * 500;
    opKeys.push({ at: start, v: 0 }, { at: start + 125, v: 0.85 }, { at: start + 500, v: 0 });
    yKeys.push({ at: start, v: from }, { at: start + 500, v: to });
  }
  opKeys.push({ at: TOTAL_MS, v: 0 });
  yKeys.push({ at: TOTAL_MS, v: to });
  const opacity = clock.interpolate(track(opKeys, 1));
  const y = clock.interpolate(track(yKeys, 1));
  return <Animated.View style={{ position: "absolute", left, top: 0, width, height, borderRadius: 4, backgroundColor: CREAM, opacity, transform: [{ translateY: y }] }} />;
}

/** A note or star dropping off Solfek as he takes off (three times). */
function Trail({ clock, left, top, dx, dy, rot, delay, size, kind, fill }: { clock: Animated.Value; left: number; top: number; dx: number; dy: number; rot: number; delay: number; size: number; kind: Kind; fill: string }) {
  const opKeys: Key[] = [{ at: 0, v: 0 }];
  const xKeys: Key[] = [{ at: 0, v: 0 }];
  const yKeys: Key[] = [{ at: 0, v: 0 }];
  const sKeys: Key[] = [{ at: 0, v: 0.5 }];
  const rKeys: Key[] = [{ at: 0, v: 0 }];
  for (let i = 0; i < 3; i++) {
    const start = delay + i * 750;
    opKeys.push({ at: start, v: 0, ease: EASE_OUT }, { at: start + 150, v: 1, ease: EASE_OUT }, { at: start + 750, v: 0 });
    xKeys.push({ at: start, v: 0, ease: EASE_OUT }, { at: start + 750, v: dx });
    yKeys.push({ at: start, v: 0, ease: EASE_OUT }, { at: start + 750, v: dy });
    sKeys.push({ at: start, v: 0.5, ease: EASE_OUT }, { at: start + 750, v: 1.1 });
    rKeys.push({ at: start, v: 0, ease: EASE_OUT }, { at: start + 750, v: rot });
  }
  for (const keys of [opKeys, xKeys, yKeys, sKeys, rKeys]) keys.push({ at: TOTAL_MS, v: keys[keys.length - 1].v });
  const opacity = clock.interpolate(track(opKeys, 4));
  const x = clock.interpolate(track(xKeys, 4));
  const y = clock.interpolate(track(yKeys, 4));
  const s = clock.interpolate(track(sKeys, 4));
  const rotTrack = track(rKeys, 4);
  const r = clock.interpolate({ inputRange: rotTrack.inputRange, outputRange: rotTrack.outputRange.map((d) => `${d}deg`) as never });
  return (
    <Animated.View style={{ position: "absolute", left, top, opacity, transform: [{ translateX: x }, { translateY: y }, { scale: s }, { rotate: r }] }}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d={kind === "note" ? NOTE_PATH : STAR_PATH} fill={fill} stroke={kind === "note" ? DEEP_ORANGE : "none"} strokeWidth={1} />
      </Svg>
    </Animated.View>
  );
}

/** A star (or note) that pops in at its moment and then twinkles. */
function Pop({ clock, left, top, size, delay, kind, fill, twinkleO, twinkleS }: { clock: Animated.Value; left: number; top: number; size: number; delay: number; kind: Kind; fill: string; twinkleO: Animated.AnimatedInterpolation<number>; twinkleS: Animated.AnimatedInterpolation<number> }) {
  const bez = Easing.bezier(0.2, 1.6, 0.4, 1);
  const opacity = clock.interpolate(track(ramp(delay, 500, 0, 1, bez)));
  const s = clock.interpolate(track(ramp(delay, 500, 0, 1, bez)));
  const rotTrack = track(ramp(delay, 500, -40, 0, bez));
  const rot = clock.interpolate({ inputRange: rotTrack.inputRange, outputRange: rotTrack.outputRange.map((d) => `${d}deg`) as never });
  return (
    <Animated.View style={{ position: "absolute", left, top, opacity, transform: [{ scale: s }, { rotate: rot }] }}>
      <Animated.View style={{ opacity: twinkleO, transform: [{ scale: twinkleS }] }}>
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d={kind === "note" ? NOTE_PATH : STAR_PATH} fill={fill} stroke={DEEP_ORANGE} strokeWidth={kind === "note" ? 1 : 1.2} strokeLinejoin="round" />
        </Svg>
      </Animated.View>
    </Animated.View>
  );
}

const shadow = (offset: number, opacity: number) => ({ shadowColor: DEEP_ORANGE, shadowOpacity: opacity, shadowOffset: { width: 0, height: offset }, shadowRadius: 0 });

const styles = {
  backdrop: { flex: 1, backgroundColor: "#ffc860", overflow: "hidden" } as const,
  world: { position: "absolute", left: 0, right: 0, bottom: 0 } as const,
  stage: { position: "absolute", bottom: 0 } as const,
  xpCard: { position: "absolute", left: 24, right: 24, top: 76, paddingVertical: 16, paddingHorizontal: 20, borderRadius: 14, backgroundColor: CREAM, gap: 10, ...shadow(3, 0.25) } as const,
  xpCardWide: { position: "absolute", left: 470, width: 500, top: 64, paddingVertical: 18, paddingHorizontal: 24, borderRadius: 14, backgroundColor: CREAM, gap: 12, ...shadow(3, 0.25) } as const,
  xpLabels: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" } as const,
  xpLabel: (wide: boolean) => ({ fontSize: wide ? 15 : 13, lineHeight: wide ? 20 : 18, fontWeight: "700", color: SOFT_INK }) as const,
  xpTrack: { height: 16, borderRadius: 999, backgroundColor: SAND, overflow: "hidden" } as const,
  xpFill: { height: 16, borderRadius: 999, backgroundColor: ORANGE } as const,
  card: { position: "absolute", left: 24, right: 24, top: 396, padding: 24, borderRadius: 28, backgroundColor: CREAM, alignItems: "center", gap: 8, ...shadow(5, 0.3) } as const,
  cardColumnWide: { position: "absolute", left: 790, width: 500, top: 236, gap: 20 } as const,
  cardWide: { padding: 32, borderRadius: 28, backgroundColor: CREAM, alignItems: "flex-start", gap: 10, ...shadow(6, 0.3) } as const,
  pill: (wide: boolean) => ({ height: wide ? 34 : 32, paddingHorizontal: wide ? 18 : 16, borderRadius: 999, backgroundColor: ORANGE, alignItems: "center", justifyContent: "center" }) as const,
  pillText: (wide: boolean) => ({ fontSize: wide ? 16 : 15, lineHeight: 20, fontWeight: "800", color: INK }) as const,
  title: (wide: boolean) => ({ marginTop: 4, fontSize: wide ? 56 : 44, lineHeight: wide ? 60 : 48, fontWeight: "800", color: INK, textAlign: wide ? "left" : "center", transformOrigin: wide ? "0% 50%" : "50% 50%" }) as never,
  subtitle: (wide: boolean) => ({ fontSize: 17, lineHeight: 24, fontWeight: "600", color: SOFT_INK, textAlign: wide ? "left" : "center" }) as const,
  rank: (wide: boolean) => ({ fontSize: wide ? 28 : 22, lineHeight: wide ? 34 : 28, fontWeight: "700", color: INK, textAlign: wide ? "left" : "center" }) as const,
  reward: (wide: boolean) => ({ marginTop: wide ? 10 : 8, width: "100%", flexDirection: "row", alignItems: "center", gap: wide ? 14 : 12, paddingVertical: wide ? 14 : 12, paddingHorizontal: wide ? 18 : 16, borderRadius: 14, backgroundColor: SAND }) as const,
  rewardText: (wide: boolean) => ({ flex: 1, fontSize: wide ? 16 : 15, lineHeight: wide ? 22 : 20, fontWeight: "700", color: INK }) as const,
  cta: { position: "absolute", left: 24, right: 24, bottom: 28 } as const,
  ctaButton: (wide: boolean) => ({ height: wide ? 60 : 56, borderRadius: 999, backgroundColor: ORANGE, alignItems: "center", justifyContent: "center", ...shadow(4, 1) }) as const,
  ctaText: (wide: boolean) => ({ fontSize: wide ? 19 : 18, lineHeight: 22, fontWeight: "800", color: INK }) as const,
};
