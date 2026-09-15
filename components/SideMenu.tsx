import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Animated, Easing, Modal, Pressable, StyleSheet, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}

const PANEL_WIDTH_FRACTION = 0.82;
const PANEL_MAX_WIDTH = 320;
const ANIMATION_MS = 260;

/** A hand-rolled slide-in-from-the-left panel — this app has no existing
 * drawer/overlay pattern to reuse (see the gamification plan's own
 * research note on this) and expo-router's own bundled Drawer would mean
 * converting app/(main)/_layout.tsx's whole Stack into a Drawer, making
 * EVERY screen swipeable rather than just the map — more than this
 * needs. Same `Animated.Value` + `interpolate` + `transform:
 * [{translateX}]` shape components/LoadingScreen.tsx already
 * demonstrates elsewhere in this app, just driving a slide instead of a
 * loop.
 *
 * Stays MOUNTED (via the internal `mounted` state) for the whole close
 * animation rather than disappearing the instant `visible` flips false —
 * `Modal`'s own `visible` prop is only ever true while either genuinely
 * open or still animating shut. `useNativeDriver: true` keeps both the
 * slide and the backdrop fade off the JS thread. */
export function SideMenu({ visible, onClose, children }: SideMenuProps) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const panelWidth = Math.min(PANEL_MAX_WIDTH, screenWidth * PANEL_WIDTH_FRACTION);
  const [mounted, setMounted] = useState(visible);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.timing(progress, { toValue: 1, duration: ANIMATION_MS, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    } else {
      Animated.timing(progress, { toValue: 0, duration: ANIMATION_MS, easing: Easing.in(Easing.cubic), useNativeDriver: true }).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!mounted) return null;

  const translateX = progress.interpolate({ inputRange: [0, 1], outputRange: [-panelWidth, 0] });
  const backdropOpacity = progress.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityRole="button" accessibilityLabel="Zamknij menu">
          <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, { opacity: backdropOpacity }]} />
        </Pressable>
        <Animated.View style={[styles.panel, { width: panelWidth, paddingTop: insets.top + 16, transform: [{ translateX }] }]}>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  backdrop: {
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  panel: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 20,
    borderRightWidth: theme.borderWidth,
    borderColor: theme.colors.border,
  },
});
