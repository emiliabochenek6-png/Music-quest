import { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, StyleSheet, View, useWindowDimensions } from "react-native";

interface ConfettiProps {
  count?: number;
}

const COLORS = ["#8b7cf6", "#4ade80", "#fbbf24", "#f472b6", "#38bdf8", "#fb7185"];

interface Piece {
  left: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  rotateDirection: 1 | -1;
}

/** A lightweight, dependency-free confetti shower — small rotating
 * rectangles falling from above the screen, each looping (fall, then a
 * pause off-screen, then fall again) independently for a natural, non-
 * synced shower rather than a single burst. Built on RN's own Animated
 * API (native-driver transforms only) instead of a Lottie asset — a
 * handful of falling rectangles reads as confetti fine without needing
 * real vector artwork. Only mount this while its owning modal is visible
 * (see WorldCompleteModal) so the loops start and stop with it. */
export function Confetti({ count = 28 }: ConfettiProps) {
  const { width, height } = useWindowDimensions();

  const pieces = useMemo<Piece[]>(
    () =>
      Array.from({ length: count }, () => ({
        left: Math.random() * width,
        size: 6 + Math.random() * 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        duration: 2200 + Math.random() * 2200,
        delay: Math.random() * 2000,
        rotateDirection: Math.random() < 0.5 ? 1 : -1,
      })),
    [count, width]
  );

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pieces.map((piece, index) => (
        <ConfettiPiece key={index} piece={piece} height={height} />
      ))}
    </View>
  );
}

function ConfettiPiece({ piece, height }: { piece: Piece; height: number }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: piece.duration,
        delay: piece.delay,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [piece, progress]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [-40, height + 40] });
  const rotate = progress.interpolate({ inputRange: [0, 1], outputRange: ["0deg", `${piece.rotateDirection * 360}deg`] });

  return (
    <Animated.View
      style={{
        position: "absolute",
        left: piece.left,
        width: piece.size,
        height: piece.size * 1.6,
        backgroundColor: piece.color,
        borderRadius: 2,
        transform: [{ translateY }, { rotate }],
      }}
    />
  );
}
