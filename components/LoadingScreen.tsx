import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Image, StyleSheet, Text, View, useWindowDimensions, type LayoutChangeEvent } from "react-native";

const BACKGROUND_PHONE = require("@/assets/backgrounds/ladowanie-tlo-telefon.jpg");
const BACKGROUND_LAPTOP = require("@/assets/backgrounds/ladowanie-tlo-laptop.jpg");
const SOLTEK = require("@/assets/soltek/soltek-ladowanie.png");
const SOLTEK_ASPECT = 379 / 512;

// Soltek's own warm palette, matching the login screen and the app icon.
const INK = "#3B2414";
const ORANGE = "#F28A1E";
const TRACK = "#F4C98F";
const CREAM = "#FFE8C8";

const TRACK_HEIGHT = 8;
const NOTE_SIZE = 30;
const TRACK_WIDTH = 220;
const BOUNCE_DURATION_MS = 1100;
const HOP_DURATION_MS = 700;

/** The app's own "please wait" screen, shown when it opens: Soltek hops
 * happily on Soltek's orange hills (the same picture as the login screen,
 * with Soltek drawn separately so he can move), with the name and a small
 * bouncing note on a track below him. The note's bounce is INDETERMINATE
 * on purpose — nothing here tracks real progress toward a known total, and
 * a filling bar would claim one. */
export function LoadingScreen() {
  const { width, height } = useWindowDimensions();
  const portrait = width < height;
  const [trackWidth, setTrackWidth] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;
  const hop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(hop, { toValue: 1, duration: HOP_DURATION_MS, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(hop, { toValue: 0, duration: HOP_DURATION_MS, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [hop]);

  useEffect(() => {
    if (trackWidth === 0) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, { toValue: 1, duration: BOUNCE_DURATION_MS, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(progress, { toValue: 0, duration: BOUNCE_DURATION_MS, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [trackWidth, progress]);

  const noteX = progress.interpolate({ inputRange: [0, 1], outputRange: [0, Math.max(trackWidth - NOTE_SIZE, 0)] });
  const hopY = hop.interpolate({ inputRange: [0, 1], outputRange: [0, -22] });
  const tilt = hop.interpolate({ inputRange: [0, 0.5, 1], outputRange: ["-2deg", "0deg", "2deg"] });
  const shadowScale = hop.interpolate({ inputRange: [0, 1], outputRange: [1, 0.78] });

  // Soltek: big at the top on a phone; on the left on a laptop (the calm right side holds the loader).
  const soltekHeight = Math.min(portrait ? height * 0.36 : height * 0.62, 460);
  const soltekWidth = soltekHeight * SOLTEK_ASPECT;
  const soltekLeft = portrait ? (width - soltekWidth) / 2 : width * 0.3 - soltekWidth / 2;
  const soltekTop = portrait ? height * 0.07 : height * 0.17;
  const loaderStyle = portrait
    ? { left: 0, right: 0, top: height * 0.5, alignItems: "center" as const }
    : { left: width * 0.5, right: 0, top: height * 0.34, alignItems: "center" as const };

  function handleTrackLayout(event: LayoutChangeEvent) {
    setTrackWidth(event.nativeEvent.layout.width);
  }

  return (
    <View style={styles.root}>
      <Image source={portrait ? BACKGROUND_PHONE : BACKGROUND_LAPTOP} resizeMode="cover" style={[StyleSheet.absoluteFill, { width: "100%", height: "100%" }]} />

      <Animated.View style={[styles.shadow, { left: soltekLeft + soltekWidth * 0.15, top: soltekTop + soltekHeight * 0.93, width: soltekWidth * 0.7, transform: [{ scaleX: shadowScale }] }]} />
      <Animated.Image
        source={SOLTEK}
        resizeMode="contain"
        accessibilityLabel="Soltek"
        style={{ position: "absolute", left: soltekLeft, top: soltekTop, width: soltekWidth, height: soltekHeight, transform: [{ translateY: hopY }, { rotate: tilt }] }}
      />

      <View style={[styles.loader, loaderStyle]}>
        <Text style={styles.title}>Music Quest</Text>
        <Text style={styles.subtitle}>Ładuję… Soltek już się rozgrzewa!</Text>
        <View style={styles.trackWrap}>
          <View onLayout={handleTrackLayout} style={styles.track} />
          <Animated.View style={[styles.note, { transform: [{ translateX: noteX }] }]}>
            <Text style={styles.noteGlyph}>♪</Text>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: CREAM, overflow: "hidden" },
  shadow: { position: "absolute", height: 14, borderRadius: 7, backgroundColor: "rgba(120,60,10,0.22)" },
  loader: { position: "absolute", paddingHorizontal: 24, gap: 10 },
  title: { fontSize: 30, fontWeight: "800", color: INK, letterSpacing: 0.4, textAlign: "center" },
  subtitle: { fontSize: 14, fontWeight: "700", color: "#7A5638", textAlign: "center", marginBottom: 14 },
  trackWrap: { width: "100%", maxWidth: TRACK_WIDTH },
  track: { height: TRACK_HEIGHT, borderRadius: TRACK_HEIGHT / 2, backgroundColor: TRACK },
  note: {
    position: "absolute",
    top: -(NOTE_SIZE - TRACK_HEIGHT) / 2,
    width: NOTE_SIZE,
    height: NOTE_SIZE,
    borderRadius: NOTE_SIZE / 2,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  noteGlyph: { color: "#FFFFFF", fontSize: 18, fontWeight: "800", lineHeight: 22 },
});
