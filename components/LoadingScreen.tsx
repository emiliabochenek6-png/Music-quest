import { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View, type LayoutChangeEvent } from "react-native";

// Matches theme/tokens.ts's own BRAND palette — this screen renders before
// ProfileContext resolves which of the two profile-mode themes to use (it
// might BE what's still loading), so it reaches for the shared brand
// colors both modes are built from directly, rather than either mode's
// own token set. `cream` in particular matches app.json's native splash
// background exactly, so there's no color flash handing off from the
// native splash screen to this first JS-rendered frame.
const CREAM = "#FFF8EE";
const INK = "#1D2B2E";
const PRIMARY = "#2A9D8F";
const TRACK_COLOR = "#E5E0D5";

const TRACK_HEIGHT = 8;
const NOTE_SIZE = 30;
const TRACK_MAX_WIDTH = 220;
const BOUNCE_DURATION_MS = 1100;

/** The app's own branded "please wait" screen — shown at launch while
 * ProfileContext/onboarding state resolves (see app/index.tsx), replacing
 * a bare ActivityIndicator. A musical note "rides" back and forth along a
 * track, Duolingo-style — an INDETERMINATE bounce rather than a fill bar,
 * since nothing here tracks real progress toward a known total; implying
 * one with a growing fill would be a claim this screen can't back up. */
export function LoadingScreen() {
  const [trackWidth, setTrackWidth] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;

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

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.max(trackWidth - NOTE_SIZE, 0)],
  });

  function handleTrackLayout(event: LayoutChangeEvent) {
    setTrackWidth(event.nativeEvent.layout.width);
  }

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Music Quest</Text>
      <View style={styles.trackWrap}>
        <View onLayout={handleTrackLayout} style={styles.track} />
        <Animated.View style={[styles.note, { transform: [{ translateX }] }]}>
          <Text style={styles.noteGlyph}>♪</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: CREAM,
    paddingHorizontal: 48,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: INK,
    letterSpacing: 0.4,
    marginBottom: 32,
  },
  trackWrap: {
    width: "100%",
    maxWidth: TRACK_MAX_WIDTH,
  },
  track: {
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    backgroundColor: TRACK_COLOR,
  },
  note: {
    position: "absolute",
    top: -(NOTE_SIZE - TRACK_HEIGHT) / 2,
    width: NOTE_SIZE,
    height: NOTE_SIZE,
    borderRadius: NOTE_SIZE / 2,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  noteGlyph: {
    color: CREAM,
    fontSize: 16,
    fontWeight: "700",
  },
});
