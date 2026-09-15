import { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View, type LayoutChangeEvent } from "react-native";
import { DARK_EXERCISE_THEME } from "@/theme/darkExerciseTheme";

// Matches app.json's own native splash background/adaptive-icon color
// (#0b0620) exactly, via the same constant every dark-cosmic screen
// already uses — this screen renders before ProfileContext resolves
// (it might BE what's still loading), but DARK_EXERCISE_THEME is a
// plain constant, not derived from any context, so it's safe to read
// directly here regardless of loading state. Keeping this in sync with
// the native splash matters more than for any other single screen: this
// is the very first JS frame the app paints, right after that splash —
// a mismatch here reads as a visible flash of the wrong theme before
// today's actual (dark) welcome/map screen ever appears.
const BACKGROUND = DARK_EXERCISE_THEME.colors.cream;
const INK = DARK_EXERCISE_THEME.colors.ink;
const PRIMARY = DARK_EXERCISE_THEME.colors.primary;
const TRACK_COLOR = DARK_EXERCISE_THEME.colors.border;

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
    backgroundColor: BACKGROUND,
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
    // White, not BACKGROUND — this glyph sits ON the purple note bubble
    // (PRIMARY), not on the page's own dark background, and needs
    // contrast against THAT (same choice DarkButton makes for its own
    // primary-variant label text).
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
