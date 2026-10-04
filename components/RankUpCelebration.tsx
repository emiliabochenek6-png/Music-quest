import { useEffect, useMemo, useRef, useState } from "react";
import { AccessibilityInfo, Animated, Easing, Image, Modal, Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Svg, { Circle, Defs, Path, Polygon, RadialGradient, Stop, LinearGradient as SvgLinearGradient, Rect } from "react-native-svg";
import { useGamification } from "@/context/GamificationContext";
import { getTitleUnlockedAt } from "@/lib/gamification/rank";
import { DEFAULT_OUTFIT_ID } from "@/lib/shop/catalog";
import { OUTFIT_IMAGES } from "@/components/shop/shopImages";

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

// ---- the design: a 390×844 stage, scaled to fit any screen --------------------------------
const STAGE_W = 390;
const STAGE_H = 844;
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

// the little hop and flight of Solfek (percentages of the 3.4 s animation from the design)
const FLY = (pct: number) => (pct / 100) * 3400;
const FLY_Y: Key[] = [
  { at: 0, v: 0, ease: EASE_IN_OUT },
  { at: FLY(12), v: -8, ease: EASE_IN_OUT },
  { at: FLY(24), v: 0, ease: EASE_OUT },
  { at: FLY(30), v: 0 },
  { at: FLY(42), v: 4, ease: Easing.bezier(0.2, 0.9, 0.3, 1) },
  { at: FLY(50), v: -90, ease: EASE_OUT },
  { at: FLY(72), v: -360, ease: EASE_IN_OUT },
  { at: FLY(88), v: -418 },
  { at: FLY(100), v: -400 },
  { at: TOTAL_MS, v: -400 },
];
const FLY_SX: Key[] = [
  { at: 0, v: 1, ease: EASE_IN_OUT },
  { at: FLY(12), v: 1, ease: EASE_IN_OUT },
  { at: FLY(24), v: 1, ease: EASE_OUT },
  { at: FLY(30), v: 1.1 },
  { at: FLY(42), v: 1.16, ease: Easing.bezier(0.2, 0.9, 0.3, 1) },
  { at: FLY(50), v: 0.86, ease: EASE_OUT },
  { at: FLY(72), v: 0.95, ease: EASE_IN_OUT },
  { at: FLY(88), v: 1.04 },
  { at: FLY(100), v: 1 },
  { at: TOTAL_MS, v: 1 },
];
const FLY_SY: Key[] = [
  { at: 0, v: 1, ease: EASE_IN_OUT },
  { at: FLY(12), v: 1, ease: EASE_IN_OUT },
  { at: FLY(24), v: 1, ease: EASE_OUT },
  { at: FLY(30), v: 0.86 },
  { at: FLY(42), v: 0.8, ease: Easing.bezier(0.2, 0.9, 0.3, 1) },
  { at: FLY(50), v: 1.2, ease: EASE_OUT },
  { at: FLY(72), v: 1.07, ease: EASE_IN_OUT },
  { at: FLY(88), v: 0.97 },
  { at: FLY(100), v: 1 },
  { at: TOTAL_MS, v: 1 },
];

// falling notes and stars that trail Solfek as he takes off: [left, top, dx, rotation, delay s, size, kind, fill]
const TRAIL: [number, number, number, number, number, number, "note" | "star", string][] = [
  [70, 176, -40, -30, 1.5, 28, "note", GOLD],
  [120, 182, 36, 25, 1.62, 24, "star", GOLD],
  [96, 190, -6, 40, 1.75, 30, "note", ORANGE],
  [60, 186, -64, 60, 1.88, 18, "star", GOLD],
  [134, 174, 60, -45, 1.95, 26, "note", GOLD],
];
// white streaks that rush down while the camera climbs: [left, height, width, delay s]
const SPEED: [number, number, number, number][] = [
  [46, 96, 4, 1.65],
  [104, 70, 3, 1.8],
  [292, 110, 4, 1.7],
  [340, 80, 3, 1.9],
  [20, 60, 3, 2.0],
  [364, 64, 3, 1.6],
];
// the burst of stars once Solfek arrives: [left, top, size, delay s, kind]
const BURST: [number, number, number, number, "note" | "star"][] = [
  [50, 160, 30, 3.3, "star"],
  [306, 136, 36, 3.36, "star"],
  [34, 290, 22, 3.42, "star"],
  [330, 282, 26, 3.48, "star"],
  [112, 92, 18, 3.54, "star"],
  [256, 84, 20, 3.6, "note"],
];

const RAY_POINTS = Array.from({ length: 12 }, (_, i) => {
  const a = (i * 30 * Math.PI) / 180;
  const pts: [number, number][] = [[0, 0], [-8, -100], [8, -100]];
  return pts.map(([x, y]) => `${(x * Math.cos(a) - y * Math.sin(a)).toFixed(2)},${(x * Math.sin(a) + y * Math.cos(a)).toFixed(2)}`).join(" ");
});

/**
 * "Awans co 5 poziomów — odlot Solfka": the full-screen celebration for every 5th level. Solfek crouches, jumps and
 * flies up through the sky; a flash and rays welcome the new level and a card shows the level, the title and the reward.
 * Mounted ONCE, globally, in app/_layout.tsx (a rank-up can happen from any screen). Tap anywhere to skip to the end;
 * with "reduce motion" switched on it goes straight to the final card.
 *
 * Built from one native clock (0 → 5 s) that every part reads through `interpolate`, so the whole piece is one animation
 * instead of dozens (see `track`). The layout is the design's 390×844 stage, scaled to the screen.
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
  const scale = Math.min(width / STAGE_W, height / STAGE_H);
  const clock = useRef(new Animated.Value(0)).current;
  const loop = useRef(new Animated.Value(0)).current; // 0 → 1 forever: spin, float, twinkle
  const barWidth = useRef(new Animated.Value(0)).current;
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
    Animated.loop(Animated.timing(loop, { toValue: 1, duration: 16000, easing: Easing.linear, useNativeDriver: true })).start();
    const timer = setTimeout(() => setReady(true), 4600);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      clock.stopAnimation();
      loop.stopAnimation();
    };
  }, [clock, loop, barWidth]);

  function skip() {
    if (ready) return;
    clock.stopAnimation();
    clock.setValue(TOTAL_MS);
    barWidth.setValue(1);
    setReady(true);
  }

  const v = useMemo(() => {
    const at = (keys: Key[]) => clock.interpolate(track(keys));
    return {
      worldY: at([{ at: 0, v: 0 }, { at: 1500, v: 0, ease: Easing.bezier(0.6, 0, 0.3, 1) }, { at: 3400, v: 600 }, { at: TOTAL_MS, v: 600 }]),
      flyY: at(FLY_Y),
      flySx: at(FLY_SX),
      flySy: at(FLY_SY),
      chargeOpacity: at([{ at: 0, v: 0 }, { at: 900, v: 0, ease: EASE_OUT }, { at: 1390, v: 0.9, ease: EASE_OUT }, { at: 1670, v: 1, ease: EASE_OUT }, { at: 2300, v: 0 }, { at: TOTAL_MS, v: 0 }]),
      chargeScale: at([{ at: 0, v: 0.6 }, { at: 900, v: 0.6, ease: EASE_OUT }, { at: 1390, v: 1, ease: EASE_OUT }, { at: 1670, v: 1.12, ease: EASE_OUT }, { at: 2300, v: 1.5 }, { at: TOTAL_MS, v: 1.5 }]),
      shadowScale: at(ramp(1400, 700, 1.15, 0.2, EASE_IN)),
      shadowOpacity: at(ramp(1400, 700, 1, 0, EASE_IN)),
      flashOpacity: at([{ at: 0, v: 0 }, { at: 3100, v: 0, ease: EASE_OUT }, { at: 3250, v: 0.75, ease: EASE_OUT }, { at: 3700, v: 0 }, { at: TOTAL_MS, v: 0 }]),
      raysScale: at(ramp(3150, 700, 0.2, 1, Easing.bezier(0.2, 1.3, 0.4, 1))),
      raysOpacity: at(ramp(3150, 700, 0, 1, Easing.bezier(0.2, 1.3, 0.4, 1))),
      xpOpacity: at(ramp(1300, 450, 1, 0, EASE_IN)),
      xpY: at(ramp(1300, 450, 0, -40, EASE_IN)),
      cardOpacity: at(ramp(3400, 650, 0, 1, Easing.bezier(0.2, 1.35, 0.4, 1))),
      cardY: at(ramp(3400, 650, 50, 0, Easing.bezier(0.2, 1.35, 0.4, 1))),
      cardScale: at(ramp(3400, 650, 0.9, 1, Easing.bezier(0.2, 1.35, 0.4, 1))),
      titleScale: at(ramp(3620, 550, 0.4, 1, Easing.bezier(0.2, 1.7, 0.4, 1))),
      titleOpacity: at(ramp(3620, 550, 0, 1, Easing.bezier(0.2, 1.7, 0.4, 1))),
      ctaOpacity: at(ramp(4200, 500, 0, 1, EASE_OUT)),
      ctaY: at(ramp(4200, 500, 24, 0, EASE_OUT)),
      spin: loop.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] }),
    };
  }, [clock, loop]);

  // gentle hover once Solfek has arrived: its own short loop, started when the clock passes the flight
  const hover = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(hover, { toValue: 1, duration: 1300, easing: EASE_IN_OUT, useNativeDriver: true }),
          Animated.timing(hover, { toValue: 0, duration: 1300, easing: EASE_IN_OUT, useNativeDriver: true }),
        ])
      ).start();
    }, 3400);
    return () => {
      clearTimeout(timer);
      hover.stopAnimation();
    };
  }, [hover]);
  const twinkleLoop = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(twinkleLoop, { toValue: 1, duration: 1400, easing: EASE_IN_OUT, useNativeDriver: true }),
        Animated.timing(twinkleLoop, { toValue: 0, duration: 1400, easing: EASE_IN_OUT, useNativeDriver: true }),
      ])
    ).start();
    return () => twinkleLoop.stopAnimation();
  }, [twinkleLoop]);
  const hoverY = hover.interpolate({ inputRange: [0, 1], outputRange: [0, -10] });
  const hoverRot = hover.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "-2deg"] });
  const twinkleO = twinkleLoop.interpolate({ inputRange: [0, 1], outputRange: [1, 0.55] });
  const twinkleS = twinkleLoop.interpolate({ inputRange: [0, 1], outputRange: [1, 0.82] });

  // pivot of Solfek's squash and stretch: 96 % down his own box (the CSS transform-origin of the design)
  const PIVOT = 220 * 0.46;

  const worldStyle = { transform: [{ translateY: v.worldY }] };
  const barFill = barWidth.interpolate({ inputRange: [0, 1], outputRange: ["12%", "100%"] });

  return (
    <View style={styles.backdrop} testID="rank-up-celebration" accessibilityLabel={`Awans na level ${rank}`}>
      <View style={{ width: STAGE_W * scale, height: STAGE_H * scale, overflow: "hidden" }}>
        <View style={[styles.stage, { transform: [{ scale }], transformOrigin: "0 0" } as never]}>
          {/* the world: sky, clouds, the ground Solfek starts on; the camera slides down it while he flies up */}
          <Animated.View style={[styles.world, worldStyle]} pointerEvents="none">
            <Svg width={STAGE_W} height={720} style={StyleSheet.absoluteFill}>
              <Defs>
                <SvgLinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor="#ffc860" />
                  <Stop offset="0.45" stopColor="#ffdb94" />
                  <Stop offset="1" stopColor="#fdebd3" />
                </SvgLinearGradient>
              </Defs>
              <Rect x={0} y={0} width={STAGE_W} height={720} fill="url(#sky)" />
            </Svg>
            <Svg width={20} height={20} viewBox="0 0 24 24" style={{ position: "absolute", left: 44, top: 70 }}><Path d={STAR_PATH} fill={CREAM} /></Svg>
            <Svg width={16} height={16} viewBox="0 0 24 24" style={{ position: "absolute", left: 318, top: 40 }}><Path d={STAR_PATH} fill={CREAM} /></Svg>
            <Svg width={22} height={22} viewBox="0 0 24 24" style={{ position: "absolute", left: 340, top: 210 }}><Path d={STAR_PATH} fill={CREAM} /></Svg>
            {([[22, 150, 150, 0.9], [232, 300, 128, 0.85], [30, 450, 112, 0.85], [248, 570, 150, 0.9]] as const).map(([left, top, w, opacity]) => (
              <Svg key={`${left}-${top}`} width={w} height={w / 2} viewBox="0 0 120 60" style={{ position: "absolute", left, top, opacity }}>
                <Path d={CLOUD_PATH} fill={CREAM} />
              </Svg>
            ))}
            <Image source={GROUND} resizeMode="cover" style={{ position: "absolute", left: -330, top: 656, width: 844, height: 844 }} />
            <Animated.View style={{ position: "absolute", left: 135, top: 1404, width: 120, height: 20, borderRadius: 10, backgroundColor: "rgba(217,87,26,0.28)", opacity: v.shadowOpacity, transform: [{ scaleX: v.shadowScale }] }} />
            {([[112, 1378, 44, -46], [234, 1378, 44, 46], [170, 1392, 50, 0]] as const).map(([left, top, size, dx]) => (
              <Dust key={left} clock={clock} left={left} top={top} size={size} dx={dx} />
            ))}
          </Animated.View>

          {/* speed streaks */}
          <View style={styles.fill} pointerEvents="none">
            {SPEED.map(([left, h, w, delay]) => (
              <Streak key={left} clock={clock} left={left} height={h} width={w} delay={delay * 1000} />
            ))}
          </View>

          {/* rays behind the new level */}
          <Animated.View style={{ position: "absolute", left: -65, top: -2, width: 520, height: 520, opacity: v.raysOpacity, transform: [{ scale: v.raysScale }] }} pointerEvents="none">
            <Animated.View style={{ transform: [{ rotate: v.spin }] }}>
              <Svg width={520} height={520} viewBox="-100 -100 200 200">
                {RAY_POINTS.map((points) => (
                  <Polygon key={points} points={points} fill={GOLD} opacity={0.45} />
                ))}
                <Circle cx={0} cy={0} r={38} fill={CREAM} opacity={0.7} />
              </Svg>
            </Animated.View>
          </Animated.View>

          {/* Solfek: charges up, jumps, flies */}
          <Animated.View
            style={{ position: "absolute", left: 85, top: 548, width: 220, height: 220, transform: [{ translateY: v.flyY }, { translateY: PIVOT }, { scaleX: v.flySx }, { scaleY: v.flySy }, { translateY: -PIVOT }] }}
            pointerEvents="none"
          >
            <Animated.View style={{ position: "absolute", left: 0, top: 0, width: 220, height: 220, opacity: v.chargeOpacity, transform: [{ scale: v.chargeScale }] }}>
              <Svg width={220} height={220}>
                <Defs>
                  <RadialGradient id="charge" cx="50%" cy="50%" r="50%">
                    <Stop offset="0" stopColor="#ffc83d" stopOpacity={0.85} />
                    <Stop offset="0.45" stopColor="#ffc83d" stopOpacity={0.35} />
                    <Stop offset="0.7" stopColor="#ffc83d" stopOpacity={0} />
                  </RadialGradient>
                </Defs>
                <Circle cx={110} cy={110} r={110} fill="url(#charge)" />
              </Svg>
            </Animated.View>
            {TRAIL.map(([left, top, dx, rot, delay, size, kind, fill], index) => (
              <Trail key={index} clock={clock} left={left} top={top} dx={dx} rot={rot} delay={delay * 1000} size={size} kind={kind} fill={fill} />
            ))}
            <Animated.View style={{ width: 220, height: 220, transform: [{ translateY: hoverY }, { rotate: hoverRot }] }}>
              <Image source={solfekImage} resizeMode="contain" accessibilityLabel="Solfek" style={{ width: 220, height: 220 }} />
            </Animated.View>
          </Animated.View>

          {/* stars popping around the new level */}
          <View style={{ position: "absolute", left: 0, top: 0, width: STAGE_W, height: 520 }} pointerEvents="none">
            {BURST.map(([left, top, size, delay, kind]) => (
              <Pop key={left} clock={clock} left={left} top={top} size={size} delay={delay * 1000} kind={kind} twinkleO={twinkleO} twinkleS={twinkleS} />
            ))}
          </View>

          <Animated.View style={[styles.fill, { backgroundColor: CREAM, opacity: v.flashOpacity }]} pointerEvents="none" />

          {/* the bar that fills up before take-off */}
          <Animated.View style={[styles.xpCard, { opacity: v.xpOpacity, transform: [{ translateY: v.xpY }] }]} pointerEvents="none">
            <View style={styles.xpLabels}>
              <Text style={styles.xpLabel}>Level {fromRank}</Text>
              <Text style={styles.xpLabel}>Level {rank}</Text>
            </View>
            <View style={styles.xpTrack}>
              <Animated.View style={[styles.xpFill, { width: barFill }]} />
            </View>
          </Animated.View>

          {/* the result card */}
          <Animated.View style={[styles.card, { opacity: v.cardOpacity, transform: [{ translateY: v.cardY }, { scale: v.cardScale }] }]} pointerEvents="none">
            <View style={styles.pill}>
              <Text style={styles.pillText}>Level {rank}</Text>
            </View>
            <Animated.Text style={[styles.title, { opacity: v.titleOpacity, transform: [{ scale: v.titleScale }] }]}>Awans!</Animated.Text>
            <Text style={styles.subtitle}>{newTitle ? "Nowy tytuł Solfka" : "Twój tytuł"}</Text>
            {rankName && <Text style={styles.rank}>{rankName}</Text>}
            <View style={styles.reward}>
              <Svg width={32} height={32} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <Path d={STAR_PATH} fill={GOLD} stroke={DEEP_ORANGE} strokeWidth={1.2} strokeLinejoin="round" />
              </Svg>
              <Text style={styles.rewardText}>
                {nutki > 0 ? `+${nutki} nutek w nagrodę. Kup nowy ubiór w Sklepie Solfka!` : "Zajrzyj do Sklepu Solfka po nowy ubiór!"}
              </Text>
            </View>
          </Animated.View>

          {/* tap anywhere to skip the animation; then the button closes */}
          {!ready && <Pressable style={styles.fill} onPress={skip} accessibilityRole="button" accessibilityLabel="Pomiń animację" />}
          <Animated.View style={[styles.cta, { opacity: v.ctaOpacity, transform: [{ translateY: v.ctaY }] }]} pointerEvents={ready ? "auto" : "none"}>
            <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Lecimy dalej!" style={styles.ctaButton}>
              <Text style={styles.ctaText}>Lecimy dalej!</Text>
            </Pressable>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

/** A puff of dust under Solfek as he pushes off. */
function Dust({ clock, left, top, size, dx }: { clock: Animated.Value; left: number; top: number; size: number; dx: number }) {
  const t = (keys: Key[]) => clock.interpolate(track(keys));
  const opacity = t([{ at: 0, v: 0 }, { at: 1420, v: 0, ease: EASE_OUT }, { at: 1500, v: 0.95, ease: EASE_OUT }, { at: 2220, v: 0 }, { at: TOTAL_MS, v: 0 }]);
  const x = t(ramp(1420, 800, 0, dx));
  const y = t(ramp(1420, 800, 0, -22));
  const s = t(ramp(1420, 800, 0.4, 1.7));
  return <Animated.View style={{ position: "absolute", left, top, width: size, height: size, borderRadius: size / 2, backgroundColor: CREAM, opacity, transform: [{ translateX: x }, { translateY: y }, { scale: s }] }} />;
}

/** A white streak that rushes down the screen three times. */
function Streak({ clock, left, height, width, delay }: { clock: Animated.Value; left: number; height: number; width: number; delay: number }) {
  const opKeys: Key[] = [{ at: 0, v: 0 }];
  const yKeys: Key[] = [{ at: 0, v: -140 }];
  for (let i = 0; i < 3; i++) {
    const start = delay + i * 500;
    opKeys.push({ at: start, v: 0 }, { at: start + 125, v: 0.85 }, { at: start + 500, v: 0 });
    yKeys.push({ at: start, v: -140 }, { at: start + 500, v: 900 });
  }
  opKeys.push({ at: TOTAL_MS, v: 0 });
  yKeys.push({ at: TOTAL_MS, v: 900 });
  const opacity = clock.interpolate(track(opKeys, 1));
  const y = clock.interpolate(track(yKeys, 1));
  return <Animated.View style={{ position: "absolute", left, top: 0, width, height, borderRadius: 4, backgroundColor: CREAM, opacity, transform: [{ translateY: y }] }} />;
}

/** A note or star dropping off Solfek as he takes off (three times). */
function Trail({ clock, left, top, dx, rot, delay, size, kind, fill }: { clock: Animated.Value; left: number; top: number; dx: number; rot: number; delay: number; size: number; kind: "note" | "star"; fill: string }) {
  const opKeys: Key[] = [{ at: 0, v: 0 }];
  const xKeys: Key[] = [{ at: 0, v: 0 }];
  const yKeys: Key[] = [{ at: 0, v: 0 }];
  const sKeys: Key[] = [{ at: 0, v: 0.5 }];
  const rKeys: Key[] = [{ at: 0, v: 0 }];
  for (let i = 0; i < 3; i++) {
    const start = delay + i * 750;
    opKeys.push({ at: start, v: 0, ease: EASE_OUT }, { at: start + 150, v: 1, ease: EASE_OUT }, { at: start + 750, v: 0 });
    xKeys.push({ at: start, v: 0, ease: EASE_OUT }, { at: start + 750, v: dx });
    yKeys.push({ at: start, v: 0, ease: EASE_OUT }, { at: start + 750, v: 150 });
    sKeys.push({ at: start, v: 0.5, ease: EASE_OUT }, { at: start + 750, v: 1.1 });
    rKeys.push({ at: start, v: 0, ease: EASE_OUT }, { at: start + 750, v: rot });
  }
  for (const keys of [opKeys, xKeys, yKeys, sKeys, rKeys]) keys.push({ at: TOTAL_MS, v: keys[keys.length - 1].v });
  const opacity = clock.interpolate(track(opKeys, 4));
  const x = clock.interpolate(track(xKeys, 4));
  const y = clock.interpolate(track(yKeys, 4));
  const s = clock.interpolate(track(sKeys, 4));
  const r = clock.interpolate({ ...track(rKeys, 4), outputRange: track(rKeys, 4).outputRange.map((d) => `${d}deg`) as never });
  return (
    <Animated.View style={{ position: "absolute", left, top, opacity, transform: [{ translateX: x }, { translateY: y }, { scale: s }, { rotate: r }] }}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d={kind === "note" ? NOTE_PATH : STAR_PATH} fill={fill} stroke={kind === "note" ? DEEP_ORANGE : "none"} strokeWidth={1} />
      </Svg>
    </Animated.View>
  );
}

/** A star (or note) that pops in at its moment and then twinkles. */
function Pop({ clock, left, top, size, delay, kind, twinkleO, twinkleS }: { clock: Animated.Value; left: number; top: number; size: number; delay: number; kind: "note" | "star"; twinkleO: Animated.AnimatedInterpolation<number>; twinkleS: Animated.AnimatedInterpolation<number> }) {
  const bez = Easing.bezier(0.2, 1.6, 0.4, 1);
  const opacity = clock.interpolate(track(ramp(delay, 500, 0, 1, bez)));
  const s = clock.interpolate(track(ramp(delay, 500, 0, 1, bez)));
  const rotKeys = ramp(delay, 500, -40, 0, bez);
  const rotTrack = track(rotKeys);
  const rot = clock.interpolate({ inputRange: rotTrack.inputRange, outputRange: rotTrack.outputRange.map((d) => `${d}deg`) as never });
  return (
    <Animated.View style={{ position: "absolute", left, top, opacity, transform: [{ scale: s }, { rotate: rot }] }}>
      <Animated.View style={{ opacity: twinkleO, transform: [{ scale: twinkleS }] }}>
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d={kind === "note" ? NOTE_PATH : STAR_PATH} fill={kind === "note" ? ORANGE : GOLD} stroke={DEEP_ORANGE} strokeWidth={kind === "note" ? 1 : 1.2} strokeLinejoin="round" />
        </Svg>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "#fdebd3", alignItems: "center", justifyContent: "center" },
  stage: { width: STAGE_W, height: STAGE_H, overflow: "hidden", backgroundColor: "#fdebd3" },
  world: { position: "absolute", left: 0, top: -656, width: STAGE_W, height: 1500 },
  fill: { position: "absolute", left: 0, top: 0, width: STAGE_W, height: STAGE_H },
  xpCard: {
    position: "absolute",
    left: 24,
    right: 24,
    top: 76,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: CREAM,
    gap: 10,
    shadowColor: DEEP_ORANGE,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 0,
  },
  xpLabels: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  xpLabel: { fontSize: 13, lineHeight: 18, fontWeight: "700", color: SOFT_INK },
  xpTrack: { height: 16, borderRadius: 999, backgroundColor: SAND, overflow: "hidden" },
  xpFill: { height: 16, borderRadius: 999, backgroundColor: ORANGE },
  card: {
    position: "absolute",
    left: 24,
    right: 24,
    top: 396,
    padding: 24,
    borderRadius: 28,
    backgroundColor: CREAM,
    alignItems: "center",
    gap: 8,
    shadowColor: DEEP_ORANGE,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 0,
  },
  pill: { height: 32, paddingHorizontal: 16, borderRadius: 999, backgroundColor: ORANGE, alignItems: "center", justifyContent: "center" },
  pillText: { fontSize: 15, lineHeight: 20, fontWeight: "800", color: INK },
  title: { marginTop: 4, fontSize: 44, lineHeight: 48, fontWeight: "800", color: INK, textAlign: "center" },
  subtitle: { fontSize: 17, lineHeight: 24, fontWeight: "600", color: SOFT_INK, textAlign: "center" },
  rank: { fontSize: 22, lineHeight: 28, fontWeight: "700", color: INK, textAlign: "center" },
  reward: { marginTop: 8, width: "100%", flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 14, backgroundColor: SAND },
  rewardText: { flex: 1, fontSize: 15, lineHeight: 20, fontWeight: "700", color: INK },
  cta: { position: "absolute", left: 24, right: 24, bottom: 28 },
  ctaButton: {
    height: 56,
    borderRadius: 999,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: DEEP_ORANGE,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 0,
  },
  ctaText: { fontSize: 18, lineHeight: 22, fontWeight: "800", color: INK },
});
