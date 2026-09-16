import { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, Modal, Pressable, Text, View, StyleSheet } from "react-native";
import { DarkButton } from "@/components/exercises/DarkButton";
import { SoltekMascot } from "@/components/SoltekMascot";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

interface RankUpCelebrationProps {
  visible: boolean;
  rank: number | null;
  rankName: string | null;
  onClose: () => void;
}

const STAR_SIZE = 88;
const GLOW_SIZE = 160;
const SPARKLE_COUNT = 10;

/** Mounted ONCE, globally, in app/_layout.tsx — GamificationContext's own
 * `awardXp` can be called from any screen (a lesson step, the daily
 * challenge), and a rank-up should celebrate regardless of which one
 * triggered it, so this lives above the Stack rather than being wired
 * into each screen separately. Reads `pendingRankUp`/`clearPendingRankUp`
 * straight from useGamification() at the call site in _layout.tsx.
 *
 * Full-screen opaque takeover (`transparent={false}`, its own dark
 * background), the same "big, unmissable moment" choice
 * WorldCompleteModal already makes for its own celebration — this can
 * appear over ANY screen's own theme, so it doesn't try to blend with
 * whatever's underneath. */
export function RankUpCelebration({ visible, rank, rankName, onClose }: RankUpCelebrationProps) {
  return (
    <Modal visible={visible} transparent={false} animationType="fade" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityRole="button" accessibilityLabel="Zamknij" />
        <View style={styles.content} pointerEvents="box-none">
          <View style={styles.starStage}>
            {visible && <SparkleBurst count={SPARKLE_COUNT} />}
            <ShimmeringStar />
          </View>
          <Text style={styles.title}>Kolejna ranga odblokowana!</Text>
          {rank !== null && rankName && (
            <Text style={styles.rankLine}>
              Ranga {rank}: <Text style={styles.rankName}>{rankName}</Text>
            </Text>
          )}
          {rankName && (
            <View style={{ marginTop: 20, width: "100%", maxWidth: 320 }}>
              <SoltekMascot expression="radosny" message={`Brawo! Awansowałeś do rangi „${rankName}”. Tak trzymaj!`} />
            </View>
          )}
          <View style={{ marginTop: 20, width: "100%", maxWidth: 260 }}>
            <DarkButton label="Super!" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

/** The star itself: bounces in with a spring, then settles into two
 * looping animations — a slow continuous spin and a pulsing golden glow
 * halo behind it — the "mieniąca się" (shimmering) read this was asked
 * for, built entirely from RN's own native-driver Animated primitives
 * (scale/rotate/opacity transforms), no image asset or extra library. */
function ShimmeringStar() {
  const entrance = useRef(new Animated.Value(0)).current;
  const shimmer = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(entrance, { toValue: 1, friction: 4.5, tension: 80, useNativeDriver: true }).start();
    const shimmerLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 850, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 850, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    const spinLoop = Animated.loop(Animated.timing(spin, { toValue: 1, duration: 7000, easing: Easing.linear, useNativeDriver: true }));
    shimmerLoop.start();
    spinLoop.start();
    return () => {
      shimmerLoop.stop();
      spinLoop.stop();
    };
  }, [entrance, shimmer, spin]);

  const glowOpacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.85] });
  const glowScale = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.88, 1.12] });
  const starRotate = spin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

  return (
    <View style={styles.starWrap}>
      <Animated.View style={[styles.glow, { opacity: glowOpacity, transform: [{ scale: glowScale }] }]} />
      <Animated.Text style={[styles.starGlyph, { transform: [{ scale: entrance }, { rotate: starRotate }] }]}>⭐</Animated.Text>
    </View>
  );
}

interface Sparkle {
  angle: number;
  distance: number;
  size: number;
  delay: number;
  duration: number;
}

/** A ring of small sparkles bursting outward from the star and fading —
 * same looping-radial-piece technique components/exercises/Confetti.tsx
 * already uses for its own falling pieces, aimed outward from a center
 * point instead of downward from the top of the screen. */
function SparkleBurst({ count }: { count: number }) {
  const sparkles = useMemo<Sparkle[]>(
    () =>
      Array.from({ length: count }, (_, index) => ({
        angle: (index / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5,
        distance: 78 + Math.random() * 46,
        size: 13 + Math.random() * 11,
        delay: Math.random() * 500,
        duration: 1000 + Math.random() * 500,
      })),
    [count]
  );

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {sparkles.map((sparkle, index) => (
        <SparklePiece key={index} sparkle={sparkle} />
      ))}
    </View>
  );
}

function SparklePiece({ sparkle }: { sparkle: Sparkle }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(progress, { toValue: 1, duration: sparkle.duration, delay: sparkle.delay, easing: Easing.out(Easing.quad), useNativeDriver: true })
    );
    loop.start();
    return () => loop.stop();
  }, [progress, sparkle]);

  const translateX = progress.interpolate({ inputRange: [0, 1], outputRange: [0, Math.cos(sparkle.angle) * sparkle.distance] });
  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [0, Math.sin(sparkle.angle) * sparkle.distance] });
  const opacity = progress.interpolate({ inputRange: [0, 0.15, 0.75, 1], outputRange: [0, 1, 1, 0] });
  const scale = progress.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0.3, 1, 0.5] });

  return (
    <Animated.Text
      style={[
        styles.sparkle,
        { fontSize: sparkle.size, opacity, transform: [{ translateX }, { translateY }, { scale }] },
      ]}
    >
      ✨
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.cream,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  starStage: {
    width: GLOW_SIZE,
    height: GLOW_SIZE,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  starWrap: {
    width: GLOW_SIZE,
    height: GLOW_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    width: GLOW_SIZE,
    height: GLOW_SIZE,
    borderRadius: GLOW_SIZE / 2,
    backgroundColor: "#facc15",
  },
  starGlyph: {
    fontSize: STAR_SIZE,
  },
  sparkle: {
    position: "absolute",
    left: GLOW_SIZE / 2 - 10,
    top: GLOW_SIZE / 2 - 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: theme.colors.ink,
    textAlign: "center",
    letterSpacing: 0.3,
  },
  rankLine: {
    marginTop: 8,
    fontSize: 15,
    color: theme.colors.muted,
    textAlign: "center",
  },
  rankName: {
    color: "#facc15",
    fontWeight: "800",
  },
});
