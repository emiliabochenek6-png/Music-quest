import { memo, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AccessibilityInfo, Animated, Easing, Image, Modal, Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Svg, { Circle, Defs, Path, Pattern, Polygon, Rect, Stop, LinearGradient as SvgLinearGradient } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LAPTOP_LAYOUT, PHONE_LAYOUT } from "@/components/shop/giftLayouts";
import type { GiftLayout } from "@/components/shop/giftLayouts";
import { OUTFIT_IMAGES } from "@/components/shop/shopImages";
import { useGamification } from "@/context/GamificationContext";
import { EASE_IN, EASE_IN_OUT, EASE_OUT, makeRamp, track, trackDeg } from "@/lib/animation/timeline";
import type { Key } from "@/lib/animation/timeline";
import { DEFAULT_OUTFIT_ID } from "@/lib/shop/catalog";
import { formatCountdown, nutkiWord, rollGift, secondsToNextGift } from "@/lib/shop/gift";

const SOLFEK_IMAGE = require("@/assets/celebration/solfek.png");
const SHELF_ITEMS = [
  require("@/assets/shop/gift/czapka-zimowa.png"),
  require("@/assets/shop/gift/beret-artysty.png"),
  require("@/assets/shop/gift/cylinder.png"),
  require("@/assets/shop/gift/kapelusz-kapitana.png"),
  require("@/assets/shop/gift/szalik-w-nutki.png"),
  require("@/assets/shop/gift/okulary-gwiazdki.png"),
];
const SHELF_NAMES = ["Czapka zimowa", "Beret artysty", "Cylinder", "Kapelusz kapitana", "Szalik w nutki", "Okulary gwiazdki"];

const INK = "#3b2414";
const SOFT_INK = "#7a5a43";
const CREAM = "#fff6e8";
const SAND = "#ffe9cc";
const ORANGE = "#f28a1e";
const LIGHT_ORANGE = "#ff9d3a";
const DEEP_ORANGE = "#d9571a";
const GOLD = "#ffc83d";
const BROWN = "#5c4230";
const NOTE_PATH = "M10 3v11.3A3.5 3.5 0 1 0 12 17.5V8l6 1.5V5.2z";

const CHEER = Easing.bezier(0.2, 1.5, 0.4, 1); // overshoots
const POP = Easing.bezier(0.2, 1.6, 0.4, 1);
const DROP = Easing.bezier(0.3, 0, 0.3, 1);
const TOTAL = 5000;
const ramp = makeRamp(TOTAL);

type Phase = "idle" | "open" | "collect";

interface GiftSceneProps {
  /** The nutki the player has right now (the wallet shows this until the gift flies into it). */
  balance: number;
  /** Called the moment the box is opened, with the nutki it holds: the app pays them out at once, so closing early loses nothing. */
  onClaim: (amount: number) => void;
  onClose: () => void;
}

/**
 * The daily gift of Sklep Solfka: a full-screen scene (phone and laptop designs). A gift box drops in, Solfek peeks from behind it;
 * tapping it opens the box, a number from 1 to 10 is drawn like a slot machine and "Odbierz" sends the nutki flying into the
 * wallet, with a countdown to tomorrow's gift. Built from small clocks (0 → N ms) read through `interpolate`, like RankUpCelebration.
 */
export function GiftScene({ balance, onClaim, onClose }: GiftSceneProps) {
  return (
    <Modal visible transparent={false} animationType="fade" onRequestClose={onClose}>
      <Scene balance={balance} onClaim={onClaim} onClose={onClose} />
    </Modal>
  );
}

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => {
        if (!cancelled) setReduced(value);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  return reduced;
}

/** A clock that runs 0 → `total` ms once (straight to the end with "reduce motion"). */
function useClock(total: number, reduced: boolean): Animated.Value {
  const clock = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduced) {
      clock.setValue(total);
      return;
    }
    clock.setValue(0);
    Animated.timing(clock, { toValue: total, duration: total, easing: Easing.linear, useNativeDriver: true }).start();
    return () => clock.stopAnimation();
  }, [clock, total, reduced]);
  return clock;
}

/** A clock that runs 0 → `period` ms over and over, after `delay` ms (it stays at 0 with "reduce motion"). */
function useLoop(period: number, delay: number, reduced: boolean): Animated.Value {
  const loop = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduced) return;
    let animation: Animated.CompositeAnimation | null = null;
    const timer = setTimeout(() => {
      animation = Animated.loop(Animated.timing(loop, { toValue: period, duration: period, easing: Easing.linear, useNativeDriver: true }));
      animation.start();
    }, delay);
    return () => {
      clearTimeout(timer);
      animation?.stop();
    };
  }, [loop, period, delay, reduced]);
  return loop;
}

function Scene({ balance, onClaim, onClose }: GiftSceneProps) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const L = width >= 900 && width > height ? LAPTOP_LAYOUT : PHONE_LAYOUT;
  const scale = L.wide ? Math.max(0.55, Math.min(1, (width / 1440) * 1.15, height / 900)) : Math.max(0.6, Math.min(width / 390, height / 844, 1.4));
  const reduced = useReducedMotion();
  const { state } = useGamification();
  const startBalance = useRef(balance).current;
  const [phase, setPhase] = useState<Phase>("idle");
  const [amount, setAmount] = useState(1);

  const outfit = OUTFIT_IMAGES[state.shopEquipped.ubior ?? DEFAULT_OUTFIT_ID];
  const solfek = !state.shopEquipped.ubior || state.shopEquipped.ubior === DEFAULT_OUTFIT_ID || !outfit ? SOLFEK_IMAGE : outfit;

  function open() {
    const won = rollGift();
    setAmount(won);
    onClaim(won);
    setPhase("open");
  }

  return (
    <View style={styles.root} testID="gift-scene">
      {/* the wall fills the whole screen; everything else lives on the scaled stage */}
      <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          <Pattern id="wall" x={0} y={0} width={L.stripe * 2} height={10} patternUnits="userSpaceOnUse">
            <Rect x={0} y={0} width={L.stripe} height={10} fill={CREAM} />
            <Rect x={L.stripe} y={0} width={L.stripe} height={10} fill="#ffefdb" />
          </Pattern>
        </Defs>
        <Rect x={0} y={0} width={width} height={height} fill="url(#wall)" />
      </Svg>

      <View style={[styles.stage, { left: (width - L.W) / 2, width: L.W, height: L.H, transform: [{ scale }], transformOrigin: "50% 100%" } as never]} pointerEvents="box-none">
        <Shop L={L} />
        <Wallet L={L} phase={phase} from={startBalance} amount={amount} />
        {phase === "idle" && <IdlePhase L={L} solfek={solfek} reduced={reduced} onOpen={open} />}
        {phase === "open" && <OpenPhase L={L} solfek={solfek} amount={amount} reduced={reduced} onCollect={() => setPhase("collect")} />}
        {phase === "collect" && <CollectPhase L={L} solfek={solfek} amount={amount} reduced={reduced} onClose={onClose} />}
      </View>

      <Pressable
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Zamknij"
        testID="gift-close"
        hitSlop={8}
        style={[styles.close, { top: insets.top + L.close.top, right: L.close.right, width: L.close.size, height: L.close.size, borderRadius: L.close.size / 2 }]}
      >
        <Svg width={L.close.size / 2} height={L.close.size / 2} viewBox="0 0 24 24">
          <Path d="M6 6l12 12M18 6L6 18" fill="none" stroke={INK} strokeWidth={2.8} strokeLinecap="round" />
        </Svg>
      </Pressable>
    </View>
  );
}

const abs = (left: number, top: number, width?: number, height?: number) => ({ position: "absolute", left, top, ...(width !== undefined ? { width } : {}), ...(height !== undefined ? { height } : {}) }) as const;

/** The shop itself: title, two shelves with outfit pieces and "?" slots for what is still to come, and the floor. */
const Shop = memo(function Shop({ L }: { L: GiftLayout }) {
  const wide = (extra: number) => ({ position: "absolute", left: -1200, width: L.W + 2400 + extra }) as const;
  return (
    <>
      <Text style={[abs(L.title.left, L.title.top), styles.title, { fontSize: L.title.size, lineHeight: L.title.line }]} accessibilityRole="header">
        Sklep Solfka
      </Text>
      {L.shelves.map((shelf) => (
        <View key={shelf.y} style={[wide(0), { top: shelf.y, height: shelf.h, backgroundColor: SOFT_INK, shadowColor: INK, shadowOpacity: 0.12, shadowOffset: { width: 0, height: shelf.shadow }, shadowRadius: 0 }]} pointerEvents="none" />
      ))}
      {L.rows.map((row) => (
        <View key={row.top} style={[abs(row.left, row.top, row.width, row.height), styles.shelfRow]} pointerEvents="none">
          {row.items.map((index) => (
            <Image key={index} source={SHELF_ITEMS[index]} accessibilityLabel={SHELF_NAMES[index]} resizeMode="contain" style={{ width: L.item, height: L.item }} />
          ))}
          {Array.from({ length: row.slots }, (_, i) => (
            <View key={`slot-${i}`} style={[styles.slot, { width: L.slot.w, height: L.slot.h, borderRadius: L.slot.radius }]}>
              <Text style={[styles.slotText, { fontSize: L.slot.font }]}>?</Text>
            </View>
          ))}
        </View>
      ))}
      <View style={[wide(0), { top: L.floor.y, height: L.floor.h, backgroundColor: SOFT_INK }]} pointerEvents="none" />
      <View style={[wide(0), { top: L.floor.y + L.floor.h, height: 1400, backgroundColor: BROWN }]} pointerEvents="none" />
    </>
  );
});

function NoteIcon({ size, fill, stroke, strokeWidth = 1.2 }: { size: number; fill: string; stroke?: string; strokeWidth?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d={NOTE_PATH} fill={fill} stroke={stroke ?? "none"} strokeWidth={strokeWidth} strokeLinejoin="round" />
    </Svg>
  );
}

/** The nutki pill in the corner. When the gift is collected the nutki fly in, the pill pops and the number counts up. */
function Wallet({ L, phase, from, amount }: { L: GiftLayout; phase: Phase; from: number; amount: number }) {
  const [shown, setShown] = useState(from);
  const bump = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (phase !== "collect") return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let j = 1; j <= amount; j++) timers.push(setTimeout(() => setShown(from + j), 820 + j * 90));
    const steps: Animated.CompositeAnimation[] = [];
    for (let i = 0; i < 6; i++) steps.push(Animated.timing(bump, { toValue: i % 2 === 0 ? 1.14 : 1, duration: 220, easing: EASE_OUT, useNativeDriver: true }));
    const animation = Animated.sequence([Animated.delay(L.collect.bumpDelay), ...steps]);
    animation.start();
    return () => {
      timers.forEach(clearTimeout);
      animation.stop();
    };
  }, [phase, amount, from, bump, L.collect.bumpDelay]);

  const w = L.wallet;
  return (
    <Animated.View
      accessibilityLabel={`Twoje nutki: ${shown}`}
      style={[styles.wallet, { position: "absolute", top: w.top, right: w.right, height: w.h, paddingRight: w.padR, gap: w.gap, transform: [{ scale: bump }] }]}
      pointerEvents="none"
    >
      <View style={[styles.walletCoin, { width: w.coin, height: w.coin, borderRadius: w.coin / 2 }]}>
        <NoteIcon size={w.icon} fill={INK} />
      </View>
      <Text style={{ fontSize: w.font, lineHeight: w.line, fontWeight: "800", color: INK }} testID="gift-balance">
        {shown}
      </Text>
    </Animated.View>
  );
}

// ---- the gift box --------------------------------------------------------------------------------------------------------

function BoxBody() {
  return (
    <View style={[abs(0, 80, 160, 120), styles.boxBody]}>
      <View style={[abs(58, 0, 36, 120), { backgroundColor: GOLD }]} />
    </View>
  );
}

/** The lid with its ribbon and bow, in a 184×88 frame. */
function BoxLid() {
  return (
    <>
      <View style={[abs(0, 42, 184, 46), styles.boxLid]}>
        <View style={[abs(70, 0, 36, 46), { backgroundColor: GOLD }]} />
      </View>
      <Svg style={abs(42, 0)} width={100} height={56} viewBox="0 0 100 56">
        <Path d="M50 44C30 50 6 40 10 20 14 4 36 10 50 40Z" fill={GOLD} stroke={DEEP_ORANGE} strokeWidth={3} strokeLinejoin="round" />
        <Path d="M50 44C70 50 94 40 90 20 86 4 64 10 50 40Z" fill={GOLD} stroke={DEEP_ORANGE} strokeWidth={3} strokeLinejoin="round" />
        <Circle cx={50} cy={44} r={9} fill={GOLD} stroke={DEEP_ORANGE} strokeWidth={3} />
      </Svg>
    </>
  );
}

// ---- 1. the gift box has dropped in and waits to be opened ------------------------------------------------------------

const IdlePhase = memo(function IdlePhase({ L, solfek, reduced, onOpen }: { L: GiftLayout; solfek: unknown; reduced: boolean; onOpen: () => void }) {
  const clock = useClock(2200, reduced);
  const wiggle = useLoop(1800, 1300, reduced);
  const bob = useLoop(2400, 0, reduced);
  const pulse = useLoop(1400, 2000, reduced);
  const v = useMemo(() => {
    const at = (keys: Key[]) => clock.interpolate(track(keys));
    return {
      dropY: at([{ at: 0, v: L.box.dropFrom }, { at: 200, v: L.box.dropFrom, ease: DROP }, { at: 740, v: 0, ease: DROP }, { at: 875, v: -34, ease: DROP }, { at: 1010, v: 0, ease: DROP }, { at: 1100, v: 0 }]),
      dropSx: at([{ at: 0, v: 1 }, { at: 740, v: 1.12, ease: DROP }, { at: 875, v: 0.96, ease: DROP }, { at: 1010, v: 1.04, ease: DROP }, { at: 1100, v: 1 }]),
      dropSy: at([{ at: 0, v: 1 }, { at: 740, v: 0.86, ease: DROP }, { at: 875, v: 1.05, ease: DROP }, { at: 1010, v: 0.97, ease: DROP }, { at: 1100, v: 1 }]),
      peekO: at([{ at: 0, v: 0 }, { at: 950, v: 0, ease: CHEER }, { at: 1650, v: 1 }]),
      peekY: at([{ at: 0, v: 40 }, { at: 950, v: 40, ease: CHEER }, { at: 1650, v: 0 }]),
      peekS: at([{ at: 0, v: 0.8 }, { at: 950, v: 0.8, ease: CHEER }, { at: 1650, v: 1 }]),
      bubbleO: at([{ at: 0, v: 0 }, { at: 1400, v: 0, ease: POP }, { at: 1850, v: 1 }]),
      bubbleS: at([{ at: 0, v: 0.3 }, { at: 1400, v: 0.3, ease: POP }, { at: 1850, v: 1 }]),
      hintO: at([{ at: 0, v: 0 }, { at: 1600, v: 0, ease: EASE_OUT }, { at: 2000, v: 1 }]),
      hintY: at([{ at: 0, v: 16 }, { at: 1600, v: 16, ease: EASE_OUT }, { at: 2000, v: 0 }]),
      wiggleRot: wiggle.interpolate(trackDeg([{ at: 0, v: 0 }, { at: 1116, v: 0, ease: EASE_IN_OUT }, { at: 1224, v: -7, ease: EASE_IN_OUT }, { at: 1332, v: 6, ease: EASE_IN_OUT }, { at: 1440, v: -4, ease: EASE_IN_OUT }, { at: 1548, v: 3, ease: EASE_IN_OUT }, { at: 1656, v: -1, ease: EASE_IN_OUT }, { at: 1800, v: 0 }])),
      wiggleS: wiggle.interpolate(track([{ at: 0, v: 1 }, { at: 1116, v: 1, ease: EASE_IN_OUT }, { at: 1224, v: 1.03, ease: EASE_IN_OUT }, { at: 1332, v: 1.03, ease: EASE_IN_OUT }, { at: 1440, v: 1, ease: EASE_IN_OUT }, { at: 1800, v: 1 }])),
      bobY: bob.interpolate(track([{ at: 0, v: 0, ease: EASE_IN_OUT }, { at: 1200, v: -L.solfek.bob, ease: EASE_IN_OUT }, { at: 2400, v: 0 }])),
      pulseS: pulse.interpolate(track([{ at: 0, v: 1, ease: EASE_IN_OUT }, { at: 700, v: 1.05, ease: EASE_IN_OUT }, { at: 1400, v: 1 }])),
    };
  }, [clock, wiggle, bob, pulse, L]);

  const b = L.idleBubble;
  const h = L.hint;
  return (
    <>
      {/* the box: drops in, then wiggles now and then */}
      <Animated.View style={[abs(L.box.left, L.box.top, 160, 200), { transform: [{ translateY: v.dropY }, { scaleX: v.dropSx }, { scaleY: v.dropSy }] }]}>
        <Pressable onPress={onOpen} accessibilityRole="button" accessibilityLabel="Otwórz prezent" testID="gift-box" style={{ width: 160, height: 200 }}>
          <Animated.View style={{ width: 160, height: 200, transform: [{ rotate: v.wiggleRot }, { scale: v.wiggleS }], transformOrigin: "50% 100%" } as never}>
            <View style={{ width: 160, height: 200, transform: [{ scale: L.box.scale }], transformOrigin: "50% 100%" } as never}>
              <BoxBody />
              <View style={abs(-12, 0, 184, 88)}>
                <BoxLid />
              </View>
            </View>
          </Animated.View>
        </Pressable>
      </Animated.View>

      <Animated.View style={[abs(L.solfek.left, L.solfek.top, L.solfek.size, L.solfek.size), { opacity: v.peekO, transform: [{ translateY: v.peekY }, { scale: v.peekS }] }]} pointerEvents="none">
        <Animated.Image source={solfek as never} accessibilityLabel="Solfek" style={{ width: L.solfek.size, height: L.solfek.size, transform: [{ translateY: v.bobY }] }} resizeMode="contain" />
      </Animated.View>

      <Animated.View
        style={[abs(b.left, b.top, b.width ?? undefined), b.width ? { alignItems: "center" } : null, { opacity: v.bubbleO, transform: [{ scale: v.bubbleS }], transformOrigin: `${b.originX} 100%` } as never]}
        pointerEvents="none"
      >
        <View style={[styles.bubble, { paddingVertical: b.padV, paddingHorizontal: b.padH }]}>
          <Text style={{ fontSize: b.font, lineHeight: b.line, fontWeight: "700", color: INK }}>Ile nutek się tu kryje?</Text>
        </View>
      </Animated.View>

      <View style={[abs(L.wide ? 0 : 24, h.top), { right: L.wide ? 0 : 24, alignItems: "center" }]} pointerEvents="none">
        <Animated.View style={[styles.hint, { height: h.h, paddingHorizontal: h.padX, opacity: v.hintO, transform: [{ translateY: v.hintY }, { scale: v.pulseS }] }]}>
          <Svg width={h.icon} height={h.icon} viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M9 11V5a2 2 0 0 1 4 0v6" />
            <Path d="M13 9a2 2 0 0 1 4 0v3" />
            <Path d="M17 11a2 2 0 0 1 4 0v4a7 7 0 0 1-7 7h-1a7 7 0 0 1-6-3.4L4 14.5a2 2 0 0 1 3.3-2.2L9 14" />
          </Svg>
          <Text style={{ fontSize: h.font, lineHeight: h.line, fontWeight: "800", color: INK }}>{h.label}</Text>
        </Animated.View>
      </View>
    </>
  );
});

// ---- 2. the box opens and the number is drawn ----------------------------------------------------------------------------

function ringPosition(L: GiftLayout, i: number, n: number): [number, number] {
  const angle = ((-90 + (i * 360) / n) * Math.PI) / 180;
  return [Math.round(L.ring.cx + Math.cos(angle) * L.ring.R), Math.round(L.ring.cy + Math.sin(angle) * L.ring.R)];
}

const OpenPhase = memo(function OpenPhase({ L, solfek, amount, reduced, onCollect }: { L: GiftLayout; solfek: unknown; amount: number; reduced: boolean; onCollect: () => void }) {
  const clock = useClock(TOTAL, reduced);
  const spin = useLoop(L.rays.spinMs, 0, reduced);
  const float = useLoop(2600, 1600, reduced);
  const bob = useLoop(2400, 0, reduced);
  const v = useMemo(() => {
    const at = (keys: Key[]) => clock.interpolate(track(keys));
    return {
      scrim: at(ramp(400, 500, 0, 1)),
      beamO: at([{ at: 0, v: 0 }, { at: 500, v: 0, ease: EASE_OUT }, { at: 900, v: 1, ease: EASE_OUT }, { at: 1620, v: 0.9, ease: EASE_OUT }, { at: 2100, v: 0 }, { at: TOTAL, v: 0 }]),
      beamS: at([{ at: 0, v: 0 }, { at: 500, v: 0, ease: EASE_OUT }, { at: 900, v: 1, ease: EASE_OUT }, { at: 2100, v: 1.05 }, { at: TOTAL, v: 1.05 }]),
      raysS: at(ramp(1100, 700, 0.2, 1, Easing.bezier(0.2, 1.3, 0.4, 1))),
      raysO: at(ramp(1100, 700, 0, 1, Easing.bezier(0.2, 1.3, 0.4, 1))),
      spinDeg: spin.interpolate({ inputRange: [0, L.rays.spinMs], outputRange: ["0deg", "360deg"] }),
      baseO: at(ramp(1600, 500, 1, 0, EASE_IN)),
      baseY: at(ramp(1600, 500, 0, L.baseOutDy, EASE_IN)),
      baseS: at(ramp(1600, 500, 1, 0.9, EASE_IN)),
      shakeSx: at([{ at: 0, v: 1, ease: EASE_OUT }, { at: 96, v: 1.04, ease: EASE_OUT }, { at: 192, v: 1.06, ease: EASE_OUT }, { at: 288, v: 1.08, ease: EASE_OUT }, { at: 384, v: 1.1, ease: EASE_OUT }, { at: 480, v: 1.14, ease: EASE_OUT }, { at: 600, v: 0.94, ease: EASE_OUT }, { at: 744, v: 1, ease: EASE_OUT }, { at: TOTAL, v: 1 }]),
      shakeSy: at([{ at: 0, v: 1, ease: EASE_OUT }, { at: 96, v: 1.04, ease: EASE_OUT }, { at: 192, v: 1.06, ease: EASE_OUT }, { at: 288, v: 1.08, ease: EASE_OUT }, { at: 384, v: 1.1, ease: EASE_OUT }, { at: 480, v: 0.86, ease: EASE_OUT }, { at: 600, v: 1.08, ease: EASE_OUT }, { at: 744, v: 1, ease: EASE_OUT }, { at: TOTAL, v: 1 }]),
      lidX: at([{ at: 0, v: 0 }, { at: 624, v: 0, ease: EASE_OUT }, { at: 1200, v: L.lid.dx }, { at: TOTAL, v: L.lid.dx }]),
      lidY: at([{ at: 0, v: 0 }, { at: 480, v: 8, ease: EASE_OUT }, { at: 624, v: -90, ease: EASE_OUT }, { at: 1200, v: L.lid.dy }, { at: TOTAL, v: L.lid.dy }]),
      lidO: at([{ at: 0, v: 1 }, { at: 624, v: 1, ease: EASE_OUT }, { at: 1200, v: 0 }, { at: TOTAL, v: 0 }]),
      riseO: at([{ at: 0, v: 0 }, { at: 620, v: 0, ease: EASE_OUT }, { at: 760, v: 1 }, { at: TOTAL, v: 1 }]),
      riseX: at([{ at: 0, v: L.coin.fromX }, { at: 620, v: L.coin.fromX, ease: EASE_OUT }, { at: 1285, v: 0 }, { at: TOTAL, v: 0 }]),
      riseY: at([{ at: 0, v: L.coin.fromY }, { at: 620, v: L.coin.fromY, ease: Easing.bezier(0.2, 0.9, 0.3, 1) }, { at: 1285, v: -14, ease: EASE_OUT }, { at: 1570, v: 0 }, { at: TOTAL, v: 0 }]),
      riseS: at([{ at: 0, v: 0.25 }, { at: 620, v: 0.25, ease: Easing.bezier(0.2, 0.9, 0.3, 1) }, { at: 1285, v: 1.12, ease: EASE_OUT }, { at: 1570, v: 1 }, { at: TOTAL, v: 1 }]),
      floatY: float.interpolate(track([{ at: 0, v: 0, ease: EASE_IN_OUT }, { at: 1300, v: -L.coin.floatDy, ease: EASE_IN_OUT }, { at: 2600, v: 0 }])),
      floatRot: float.interpolate(trackDeg([{ at: 0, v: -3, ease: EASE_IN_OUT }, { at: 1300, v: 3, ease: EASE_IN_OUT }, { at: 2600, v: -3 }])),
      hopY: at([{ at: 0, v: 0 }, { at: 550, v: 0, ease: DROP }, { at: 710, v: 0, ease: DROP }, { at: 950, v: L.hopDy, ease: DROP }, { at: 1190, v: 0, ease: DROP }, { at: 1350, v: 0 }, { at: TOTAL, v: 0 }]),
      hopSx: at([{ at: 0, v: 1 }, { at: 550, v: 1, ease: DROP }, { at: 710, v: 1.1, ease: DROP }, { at: 950, v: 0.94, ease: DROP }, { at: 1190, v: 1.08, ease: DROP }, { at: 1350, v: 1 }, { at: TOTAL, v: 1 }]),
      hopSy: at([{ at: 0, v: 1 }, { at: 550, v: 1, ease: DROP }, { at: 710, v: 0.88, ease: DROP }, { at: 950, v: 1.08, ease: DROP }, { at: 1190, v: 0.92, ease: DROP }, { at: 1350, v: 1 }, { at: TOTAL, v: 1 }]),
      bobY: bob.interpolate(track([{ at: 0, v: 0, ease: EASE_IN_OUT }, { at: 1200, v: -L.solfek.bob, ease: EASE_IN_OUT }, { at: 2400, v: 0 }])),
    };
  }, [clock, spin, float, bob, L]);

  const hopRotDeg = useMemo(() => clock.interpolate(trackDeg([{ at: 0, v: 0 }, { at: 710, v: 0, ease: DROP }, { at: 950, v: -6, ease: DROP }, { at: 1190, v: 0 }, { at: TOTAL, v: 0 }])), [clock]);
  const shakeRotDeg = useMemo(() => clock.interpolate(trackDeg([{ at: 0, v: 0, ease: EASE_OUT }, { at: 96, v: -5, ease: EASE_OUT }, { at: 192, v: 5, ease: EASE_OUT }, { at: 288, v: -6, ease: EASE_OUT }, { at: 384, v: 6, ease: EASE_OUT }, { at: 480, v: 0 }, { at: TOTAL, v: 0 }])), [clock]);
  const lidRotDeg = useMemo(
    () => clock.interpolate(trackDeg([{ at: 0, v: 0, ease: EASE_OUT }, { at: 96, v: -5, ease: EASE_OUT }, { at: 192, v: 5, ease: EASE_OUT }, { at: 288, v: -6, ease: EASE_OUT }, { at: 384, v: 6, ease: EASE_OUT }, { at: 480, v: 0, ease: EASE_OUT }, { at: 624, v: -14, ease: EASE_OUT }, { at: 1200, v: -80 }, { at: TOTAL, v: -80 }])),
    [clock]
  );

  const coin = L.coin;
  return (
    <>
      <Animated.View style={[abs(-1200, -1200, L.W + 2400, L.H + 2500), { backgroundColor: "rgba(59,36,20,0.74)", opacity: v.scrim }]} pointerEvents="none" />

      {/* a beam of light, then the turning rays behind the coin */}
      <Animated.View style={[abs(L.beam.left, L.beam.top, L.beam.w, L.beam.h), { opacity: v.beamO, transform: [{ scaleY: v.beamS }], transformOrigin: "50% 100%" } as never]} pointerEvents="none">
        <Svg width={L.beam.w} height={L.beam.h}>
          <Defs>
            <SvgLinearGradient id="beam" x1="0" y1="1" x2="0" y2="0">
              <Stop offset="0" stopColor={GOLD} stopOpacity={0.95} />
              <Stop offset="1" stopColor={GOLD} stopOpacity={0} />
            </SvgLinearGradient>
          </Defs>
          <Polygon points={`0,0 ${L.beam.w},0 ${L.beam.w * 0.68},${L.beam.h} ${L.beam.w * 0.32},${L.beam.h}`} fill="url(#beam)" />
        </Svg>
      </Animated.View>
      <Animated.View style={[abs(L.rays.left, L.rays.top, L.rays.size, L.rays.size), { opacity: v.raysO, transform: [{ scale: v.raysS }] }]} pointerEvents="none">
        <Animated.View style={{ transform: [{ rotate: v.spinDeg }] }}>
          <Svg width={L.rays.size} height={L.rays.size} viewBox="-100 -100 200 200">
            {Array.from({ length: 12 }, (_, i) => (
              <Polygon key={i} points="0,0 -8,-100 8,-100" fill={GOLD} opacity={0.4} transform={`rotate(${i * 30})`} />
            ))}
            <Circle cx={0} cy={0} r={40} fill={CREAM} opacity={0.35} />
          </Svg>
        </Animated.View>
      </Animated.View>

      {/* the box: the body shakes and sinks, the lid flies off */}
      <Animated.View style={[abs(L.box.left, L.box.top, 160, 200), { opacity: v.baseO, transform: [{ translateY: v.baseY }, { scale: v.baseS }] }]} pointerEvents="none">
        <View style={{ width: 160, height: 200, transform: [{ scale: L.box.scale }], transformOrigin: "50% 100%" } as never}>
          <Animated.View style={[abs(0, 80, 160, 120), { transform: [{ rotate: shakeRotDeg }, { scaleX: v.shakeSx }, { scaleY: v.shakeSy }], transformOrigin: "50% 100%" } as never]}>
            <View style={[abs(0, 0, 160, 120), styles.boxBody]}>
              <View style={[abs(58, 0, 36, 120), { backgroundColor: GOLD }]} />
            </View>
          </Animated.View>
        </View>
      </Animated.View>
      <View style={abs(L.box.left, L.box.top, 160, 200)} pointerEvents="none">
        <View style={{ width: 160, height: 200, transform: [{ scale: L.box.scale }], transformOrigin: "50% 100%" } as never}>
          <Animated.View style={[abs(-12, 0, 184, 88), { opacity: v.lidO, transform: [{ translateX: v.lidX }, { translateY: v.lidY }, { rotate: lidRotDeg }], transformOrigin: "50% 100%" } as never]}>
            <BoxLid />
          </Animated.View>
        </View>
      </View>

      {L.confetti.pieces.map((piece, i) => (
        <Confetti key={i} clock={clock} x={L.confetti.x} y={L.confetti.y} fall={L.confetti.fall} piece={piece} />
      ))}

      {/* the coin rises out of the box and floats */}
      <Animated.View style={[abs(coin.left, coin.top, coin.size, coin.size), { opacity: v.riseO, transform: [{ translateX: v.riseX }, { translateY: v.riseY }, { scale: v.riseS }] }]} pointerEvents="none">
        <Animated.View style={{ transform: [{ translateY: v.floatY }, { rotate: v.floatRot }] }}>
          <BigCoin size={coin.size} border={coin.border} shade={coin.shade} ring={coin.ring} icon={coin.icon} />
        </Animated.View>
      </Animated.View>

      <Animated.View
        style={[abs(L.solfek.left, L.solfek.top, L.solfek.size, L.solfek.size), { transform: [{ translateY: v.hopY }, { scaleX: v.hopSx }, { scaleY: v.hopSy }, { rotate: hopRotDeg }], transformOrigin: "50% 100%" } as never]}
        pointerEvents="none"
      >
        <Animated.Image source={solfek as never} accessibilityLabel="Solfek" style={{ width: L.solfek.size, height: L.solfek.size, transform: [{ translateY: v.bobY }] }} resizeMode="contain" />
      </Animated.View>

      <RollBlock L={L} clock={clock} amount={amount} reduced={reduced} onCollect={onCollect} />
    </>
  );
});

/** A bit of confetti shot out of the box. */
function Confetti({ clock, x, y, fall, piece }: { clock: Animated.Value; x: number; y: number; fall: number; piece: { w: number; h: number; round: boolean; color: string; dx: number; dy: number; rot: number; delay: number } }) {
  const anim = useMemo(() => {
    const start = piece.delay;
    const end = start + 1600;
    const peak = start + 720;
    const ease = Easing.bezier(0.15, 0.6, 0.4, 1);
    return {
      o: clock.interpolate(track([{ at: 0, v: 0 }, { at: start, v: 0 }, { at: start + 96, v: 1 }, { at: end, v: 0 }, { at: TOTAL, v: 0 }], 1)),
      x: clock.interpolate(track([{ at: 0, v: 0 }, { at: start, v: 0, ease }, { at: peak, v: piece.dx, ease }, { at: end, v: piece.dx * 1.25 }, { at: TOTAL, v: piece.dx * 1.25 }], 4)),
      y: clock.interpolate(track([{ at: 0, v: 0 }, { at: start, v: 0, ease }, { at: peak, v: piece.dy, ease }, { at: end, v: piece.dy + fall }, { at: TOTAL, v: piece.dy + fall }], 4)),
      r: clock.interpolate(trackDeg([{ at: 0, v: 0 }, { at: start, v: 0, ease }, { at: peak, v: piece.rot * 0.5, ease }, { at: end, v: piece.rot }, { at: TOTAL, v: piece.rot }], 4)),
    };
  }, [clock, piece, fall]);
  return (
    <Animated.View
      pointerEvents="none"
      style={{ position: "absolute", left: x - piece.w / 2, top: y, width: piece.w, height: piece.h, borderRadius: piece.round ? piece.h : 3, backgroundColor: piece.color, opacity: anim.o, transform: [{ translateX: anim.x }, { translateY: anim.y }, { rotate: anim.r }] }}
    />
  );
}

/** The big gold coin with a note on it. */
function BigCoin({ size, border, shade, ring, icon }: { size: number; border: number; shade: number; ring: number; icon: number }) {
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <View style={{ position: "absolute", left: -ring, top: -ring, width: size + ring * 2, height: size + ring * 2, borderRadius: (size + ring * 2) / 2, backgroundColor: "rgba(255,246,232,0.25)" }} />
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: GOLD, borderWidth: border, borderColor: DEEP_ORANGE, alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <View style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: shade, backgroundColor: "rgba(217,87,26,0.25)" }} />
        <NoteIcon size={icon} fill={CREAM} stroke={DEEP_ORANGE} />
      </View>
    </View>
  );
}

const ROLL_STEPS = [0, 70, 70, 70, 75, 80, 90, 100, 115, 130, 150, 180, 220];

/** The badge, the number that rolls like a slot machine and then settles ("+N nutek"), the ring of coins and the "Odbierz" button. */
function RollBlock({ L, clock, amount, reduced, onCollect }: { L: GiftLayout; clock: Animated.Value; amount: number; reduced: boolean; onCollect: () => void }) {
  const [rolled, setRolled] = useState(reduced);
  const [value, setValue] = useState<number | null>(null);
  const [tick, setTick] = useState(0);
  const t = L.text;

  useEffect(() => {
    if (reduced) {
      setRolled(true);
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    let at = 1350;
    let last = 0;
    for (const delta of ROLL_STEPS) {
      at += delta;
      timers.push(
        setTimeout(() => {
          let next: number;
          do {
            next = 1 + Math.floor(Math.random() * 10);
          } while (next === last);
          last = next;
          setValue(next);
          setTick((n) => n + 1);
        }, at)
      );
    }
    timers.push(setTimeout(() => setRolled(true), at + 260));
    return () => timers.forEach(clearTimeout);
  }, [reduced]);

  const enter = useMemo(
    () => ({
      o: clock.interpolate(track(ramp(1250, 500, 0, 1, POP))),
      y: clock.interpolate(track(ramp(1250, 500, 24, 0, Easing.bezier(0.2, 1.3, 0.4, 1)))),
      s: clock.interpolate(track(ramp(1250, 500, 0.9, 1, Easing.bezier(0.2, 1.3, 0.4, 1)))),
    }),
    [clock]
  );

  const align = t.center ? "center" : "flex-start";
  const slot: ReactNode = rolled ? (
    <FinalNumber amount={amount} L={L} reduced={reduced} />
  ) : (
    <RollDigit key={tick} value={value ?? "?"} dy={t.rollDy} size={t.rollSize} line={t.rollLine} gap={t.rollGap} center={t.center} />
  );

  return (
    <>
      <Animated.View style={[abs(t.left, t.top, t.width), { alignItems: align, gap: t.gap, opacity: enter.o, transform: [{ translateY: enter.y }, { scale: enter.s }] }]} pointerEvents="none">
        <View style={[styles.badge, { height: t.badgeH, paddingHorizontal: t.badgePadX }]}>
          <Text style={{ fontSize: t.badgeFont, lineHeight: t.badgeLine, fontWeight: "800", color: INK }}>{rolled ? "Wylosowano!" : "Losowanie…"}</Text>
        </View>
        {slot}
        <Text style={{ fontSize: t.capFont, lineHeight: t.capLine, fontWeight: "600", color: SAND, textAlign: t.center ? "center" : "left" }}>
          {rolled ? "Trafiają do Twojej sakiewki" : "Ile nutek wylosujesz? Od 1 do 10"}
        </Text>
      </Animated.View>

      {rolled && Array.from({ length: amount }, (_, i) => {
        const [x, y] = ringPosition(L, i, amount);
        return <RingCoin key={i} left={x - L.ring.size / 2} top={y - L.ring.size / 2} size={L.ring.size} delay={i * 60} reduced={reduced} />;
      })}

      {rolled && <CollectButton L={L} amount={amount} reduced={reduced} onPress={onCollect} />}
    </>
  );
}

/** A digit of the roll: drops in from above (the little "gf-roll" of the design). */
function RollDigit({ value, dy, size, line, gap, center }: { value: number | string; dy: number; size: number; line: number; gap: number; center: boolean }) {
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(progress, { toValue: 1, duration: 120, easing: EASE_OUT, useNativeDriver: true }).start();
  }, [progress]);
  return (
    <Animated.Text
      accessibilityLabel="Losowanie"
      style={{ marginTop: gap, fontSize: size, lineHeight: line, fontWeight: "800", color: CREAM, textAlign: center ? "center" : "left", opacity: progress.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }), transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [dy, 0] }) }] }}
    >
      {value}
    </Animated.Text>
  );
}

/** "+7 nutek", popping in. */
function FinalNumber({ amount, L, reduced }: { amount: number; L: GiftLayout; reduced: boolean }) {
  const progress = useRef(new Animated.Value(reduced ? 600 : 0)).current;
  useEffect(() => {
    if (reduced) return;
    Animated.timing(progress, { toValue: 600, duration: 600, easing: Easing.linear, useNativeDriver: true }).start();
  }, [progress, reduced]);
  const bez = Easing.bezier(0.2, 1.8, 0.4, 1);
  const scale = progress.interpolate(track([{ at: 0, v: 0.4, ease: bez }, { at: 360, v: L.text.finalPeak, ease: bez }, { at: 600, v: 1 }]));
  const t = L.text;
  return (
    <Animated.Text
      testID="gift-result"
      accessibilityLabel={`Wylosowano ${amount} ${nutkiWord(amount)}`}
      style={{ marginTop: t.rollGap, fontSize: t.rollSize, lineHeight: t.rollLine, fontWeight: "800", color: GOLD, textAlign: t.center ? "center" : "left", transform: [{ scale }], transformOrigin: t.center ? "50% 50%" : "0% 50%" } as never}
    >
      +{amount} {nutkiWord(amount)}
    </Animated.Text>
  );
}

function RingCoin({ left, top, size, delay, reduced }: { left: number; top: number; size: number; delay: number; reduced: boolean }) {
  const pop = useRef(new Animated.Value(reduced ? 1 : 0)).current;
  const twinkle = useLoop(2800, 0, reduced);
  useEffect(() => {
    if (reduced) return;
    const animation = Animated.sequence([Animated.delay(delay), Animated.timing(pop, { toValue: 1, duration: 500, easing: POP, useNativeDriver: true })]);
    animation.start();
    return () => animation.stop();
  }, [pop, delay, reduced]);
  const o = twinkle.interpolate(track([{ at: 0, v: 1, ease: EASE_IN_OUT }, { at: 1400, v: 0.6, ease: EASE_IN_OUT }, { at: 2800, v: 1 }]));
  const s = twinkle.interpolate(track([{ at: 0, v: 1, ease: EASE_IN_OUT }, { at: 1400, v: 0.85, ease: EASE_IN_OUT }, { at: 2800, v: 1 }]));
  return (
    <Animated.View
      pointerEvents="none"
      style={{ position: "absolute", left, top, opacity: pop, transform: [{ scale: pop }, { rotate: pop.interpolate({ inputRange: [0, 1], outputRange: ["-40deg", "0deg"] }) }] }}
    >
      <Animated.View style={{ opacity: o, transform: [{ scale: s }] }}>
        <NoteIcon size={size} fill={GOLD} stroke={DEEP_ORANGE} />
      </Animated.View>
    </Animated.View>
  );
}

function CollectButton({ L, amount, reduced, onPress }: { L: GiftLayout; amount: number; reduced: boolean; onPress: () => void }) {
  const progress = useRef(new Animated.Value(reduced ? 1 : 0)).current;
  useEffect(() => {
    if (reduced) return;
    const animation = Animated.sequence([Animated.delay(500), Animated.timing(progress, { toValue: 1, duration: 500, easing: Easing.bezier(0.2, 1.3, 0.4, 1), useNativeDriver: true })]);
    animation.start();
    return () => animation.stop();
  }, [progress, reduced]);
  const b = L.btn;
  return (
    <Animated.View
      style={[abs(b.left, b.top, b.width), { opacity: progress, transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }, { scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }] }]}
    >
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Odbierz ${amount} ${nutkiWord(amount)}`}
        testID="gift-collect"
        style={({ pressed }) => [styles.primary, { height: b.h, transform: [{ translateY: pressed ? 3 : 0 }], shadowOffset: { width: 0, height: pressed ? 1 : 4 } }]}
      >
        <Text style={{ fontSize: b.font, lineHeight: 22, fontWeight: "800", color: INK }}>
          Odbierz {amount} {nutkiWord(amount)}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

// ---- 3. the nutki fly into the wallet, see you tomorrow ----------------------------------------------------------------

const CollectPhase = memo(function CollectPhase({ L, solfek, amount, reduced, onClose }: { L: GiftLayout; solfek: unknown; amount: number; reduced: boolean; onClose: () => void }) {
  const clock = useClock(TOTAL, reduced);
  const bob = useLoop(2400, 0, reduced);
  const [seconds, setSeconds] = useState(() => secondsToNextGift());
  useEffect(() => {
    const interval = setInterval(() => setSeconds(secondsToNextGift()), 1000);
    return () => clearInterval(interval);
  }, []);

  const v = useMemo(() => {
    const at = (keys: Key[]) => clock.interpolate(track(keys));
    return {
      unscrim: at(ramp(200, 600, 1, 0, EASE_IN)),
      hopY: at([{ at: 0, v: 0 }, { at: 1200, v: 0, ease: DROP }, { at: 1360, v: 0, ease: DROP }, { at: 1600, v: L.hopDy, ease: DROP }, { at: 1840, v: 0, ease: DROP }, { at: 2000, v: 0 }, { at: TOTAL, v: 0 }]),
      hopSx: at([{ at: 0, v: 1 }, { at: 1200, v: 1, ease: DROP }, { at: 1360, v: 1.1, ease: DROP }, { at: 1600, v: 0.94, ease: DROP }, { at: 1840, v: 1.08, ease: DROP }, { at: 2000, v: 1 }, { at: TOTAL, v: 1 }]),
      hopSy: at([{ at: 0, v: 1 }, { at: 1200, v: 1, ease: DROP }, { at: 1360, v: 0.88, ease: DROP }, { at: 1600, v: 1.08, ease: DROP }, { at: 1840, v: 0.92, ease: DROP }, { at: 2000, v: 1 }, { at: TOTAL, v: 1 }]),
      bubbleO: at(ramp(1500, 450, 0, 1, POP)),
      bubbleS: at(ramp(1500, 450, 0.3, 1, POP)),
      bottomO: at(ramp(2000, 500, 0, 1, Easing.bezier(0.2, 1.3, 0.4, 1))),
      bottomY: at(ramp(2000, 500, 24, 0, Easing.bezier(0.2, 1.3, 0.4, 1))),
      bottomS: at(ramp(2000, 500, 0.9, 1, Easing.bezier(0.2, 1.3, 0.4, 1))),
      bobY: bob.interpolate(track([{ at: 0, v: 0, ease: EASE_IN_OUT }, { at: 1200, v: -L.solfek.bob, ease: EASE_IN_OUT }, { at: 2400, v: 0 }])),
    };
  }, [clock, bob, L]);
  const hopRot = useMemo(() => clock.interpolate(trackDeg([{ at: 0, v: 0 }, { at: 1360, v: 0, ease: DROP }, { at: 1600, v: -6, ease: DROP }, { at: 1840, v: 0 }, { at: TOTAL, v: 0 }])), [clock]);

  const c = L.collect;
  return (
    <>
      <Animated.View style={[abs(-1200, -1200, L.W + 2400, L.H + 2500), { backgroundColor: "rgba(59,36,20,0.74)", opacity: v.unscrim }]} pointerEvents="none" />

      {Array.from({ length: amount }, (_, i) => {
        const [px, py] = ringPosition(L, i, amount);
        return <FlyingCoin key={i} clock={clock} x={px - L.ring.size / 2} y={py - L.ring.size / 2} size={L.ring.size} dx={L.wallet.x - (px - L.ring.size / 2) - L.ring.size / 2} dy={L.wallet.y - (py - L.ring.size / 2) - L.ring.size / 2} delay={150 + i * 90} duration={c.flyMs} reduced={reduced} />;
      })}

      <Animated.View
        style={[abs(c.solfekLeft, L.solfek.top, L.solfek.size, L.solfek.size), { transform: [{ translateY: v.hopY }, { scaleX: v.hopSx }, { scaleY: v.hopSy }, { rotate: hopRot }], transformOrigin: "50% 100%" } as never]}
        pointerEvents="none"
      >
        <Animated.Image source={solfek as never} accessibilityLabel="Solfek" style={{ width: L.solfek.size, height: L.solfek.size, transform: [{ translateY: v.bobY }] }} resizeMode="contain" />
      </Animated.View>

      <Animated.View style={[abs(c.bubble.left, c.bubble.top, c.bubble.width), { alignItems: "center", opacity: v.bubbleO, transform: [{ scale: v.bubbleS }], transformOrigin: "50% 100%" } as never]} pointerEvents="none">
        <View style={[styles.bubble, { paddingVertical: c.bubble.padV, paddingHorizontal: c.bubble.padH }]}>
          <Text style={{ fontSize: c.bubble.font, lineHeight: c.bubble.line, fontWeight: "800", color: INK, textAlign: "center" }}>
            Hura! +{amount} {nutkiWord(amount)} w sakiewce!{"\n"}Wróć jutro po kolejny prezent.
          </Text>
        </View>
      </Animated.View>

      <Animated.View
        style={[abs(c.bottom.left, c.bottom.top, c.bottom.width), { flexDirection: c.bottom.row ? "row" : "column", alignItems: c.bottom.row ? "center" : "stretch", gap: c.bottom.gap, opacity: v.bottomO, transform: [{ translateY: v.bottomY }, { scale: v.bottomS }] }]}
      >
        <View style={[styles.card, { flex: c.bottom.row ? 1 : undefined, paddingVertical: c.card.padV, paddingHorizontal: c.card.padH, borderRadius: c.card.radius, gap: c.card.padH - 2 }]} pointerEvents="none">
          <View style={{ width: c.card.icon, height: c.card.icon, borderRadius: c.card.icon / 2, backgroundColor: SAND, alignItems: "center", justifyContent: "center" }}>
            <Svg width={c.card.iconGlyph} height={c.card.iconGlyph} viewBox="0 0 24 24" fill="none" stroke={DEEP_ORANGE} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
              <Path d="M20 13a8 8 0 1 1-16 0 8 8 0 0 1 16 0z" />
              <Path d="M12 9v4l2.5 2" />
              <Path d="M9 2h6" />
            </Svg>
          </View>
          <View>
            <Text style={{ fontSize: c.card.small, lineHeight: c.card.smallLine, fontWeight: "700", color: SOFT_INK }}>Dzisiejszy prezent odebrany</Text>
            <Text style={{ fontSize: c.card.big, lineHeight: c.card.bigLine, fontWeight: "800", color: INK }}>
              Następny za <Text style={{ fontVariant: ["tabular-nums"] }} testID="gift-countdown">{formatCountdown(seconds)}</Text>
            </Text>
          </View>
        </View>
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Do zobaczenia jutro!"
          testID="gift-done"
          style={({ pressed }) => [styles.primary, { height: c.btn.h, width: c.btn.w ?? undefined, transform: [{ translateY: pressed ? 3 : 0 }], shadowOffset: { width: 0, height: pressed ? 1 : 4 } }]}
        >
          <Text style={{ fontSize: c.btn.font, lineHeight: 22, fontWeight: "800", color: INK }}>Do zobaczenia jutro!</Text>
        </Pressable>
      </Animated.View>
    </>
  );
});

/** A coin that flies from the ring into the wallet. */
function FlyingCoin({ clock, x, y, size, dx, dy, delay, duration, reduced }: { clock: Animated.Value; x: number; y: number; size: number; dx: number; dy: number; delay: number; duration: number; reduced: boolean }) {
  const anim = useMemo(() => {
    const ease = Easing.bezier(0.5, 0, 0.7, 0.4);
    const end = delay + duration;
    const early = delay + duration * 0.12;
    return {
      o: clock.interpolate(track([{ at: 0, v: 0 }, { at: delay, v: 0 }, { at: early, v: 1, ease }, { at: end, v: 0.9 }, { at: end + 150, v: 0 }, { at: TOTAL, v: 0 }], 6)),
      x: clock.interpolate(track([{ at: 0, v: 0 }, { at: delay, v: 0, ease }, { at: early, v: dx * -0.15, ease }, { at: end, v: dx }, { at: TOTAL, v: dx }], 6)),
      y: clock.interpolate(track([{ at: 0, v: 0 }, { at: delay, v: 0, ease }, { at: early, v: 30, ease }, { at: end, v: dy }, { at: TOTAL, v: dy }], 6)),
      s: clock.interpolate(track([{ at: 0, v: 0.6 }, { at: delay, v: 0.6, ease }, { at: early, v: 1.15, ease }, { at: end, v: 0.45 }, { at: TOTAL, v: 0.45 }], 6)),
    };
  }, [clock, delay, duration, dx, dy]);
  if (reduced) return null;
  return (
    <Animated.View pointerEvents="none" style={{ position: "absolute", left: x, top: y, opacity: anim.o, transform: [{ translateX: anim.x }, { translateY: anim.y }, { scale: anim.s }] }}>
      <NoteIcon size={size} fill={GOLD} stroke={DEEP_ORANGE} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: CREAM, overflow: "hidden" },
  stage: { position: "absolute", bottom: 0 },
  title: { fontWeight: "800", color: INK },
  shelfRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  slot: { borderWidth: 3, borderStyle: "dashed", borderColor: SOFT_INK, alignItems: "center", justifyContent: "center" },
  slotText: { fontWeight: "800", color: SOFT_INK },
  wallet: { flexDirection: "row", alignItems: "center", paddingLeft: 6, borderRadius: 999, backgroundColor: CREAM, shadowColor: DEEP_ORANGE, shadowOpacity: 0.25, shadowOffset: { width: 0, height: 3 }, shadowRadius: 0 },
  walletCoin: { backgroundColor: GOLD, borderWidth: 3, borderColor: DEEP_ORANGE, alignItems: "center", justifyContent: "center" },
  boxBody: { borderRadius: 10, backgroundColor: ORANGE, borderWidth: 4, borderColor: DEEP_ORANGE, overflow: "hidden" },
  boxLid: { borderRadius: 12, backgroundColor: LIGHT_ORANGE, borderWidth: 4, borderColor: DEEP_ORANGE, overflow: "hidden" },
  bubble: { borderRadius: 14, backgroundColor: CREAM, shadowColor: DEEP_ORANGE, shadowOpacity: 0.25, shadowOffset: { width: 0, height: 3 }, shadowRadius: 0 },
  hint: { flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 999, backgroundColor: CREAM },
  badge: { borderRadius: 999, backgroundColor: GOLD, alignItems: "center", justifyContent: "center" },
  card: { flexDirection: "row", alignItems: "center", backgroundColor: CREAM },
  primary: { borderRadius: 999, backgroundColor: ORANGE, alignItems: "center", justifyContent: "center", paddingHorizontal: 24, shadowColor: DEEP_ORANGE, shadowOpacity: 1, shadowRadius: 0, elevation: 3 },
  close: { position: "absolute", backgroundColor: SAND, alignItems: "center", justifyContent: "center", shadowColor: DEEP_ORANGE, shadowOpacity: 0.25, shadowOffset: { width: 0, height: 3 }, shadowRadius: 0 },
});
