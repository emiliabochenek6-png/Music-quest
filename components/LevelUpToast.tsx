import { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, Text, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppIcon } from "@/components/icons/AppIcon";
import type { LevelUpToastInfo } from "@/context/GamificationContext";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

const VISIBLE_MS = 3200;

/** Small, non-blocking "Level N!" banner that slides in from the top for
 * every level that doesn't get the full-screen celebration (every 5th
 * level does — see RankUpCelebration). Lives next to it in AppShell so it
 * shows over any screen, including a lesson in the middle of an
 * exercise, without ever interrupting it: it never takes touches except
 * its own tap-to-dismiss. */
export function LevelUpToast({ toast, onClose }: { toast: LevelUpToastInfo | null; onClose: () => void }) {
  if (!toast) return null;
  // Keyed on the level so two quick level-ups restart the animation and timer.
  return <ToastBody key={toast.level} toast={toast} onClose={onClose} />;
}

function ToastBody({ toast, onClose }: { toast: LevelUpToastInfo; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const slide = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(slide, { toValue: 1, friction: 7, tension: 90, useNativeDriver: true }).start();
    const timer = setTimeout(() => {
      Animated.timing(slide, { toValue: 0, duration: 260, easing: Easing.in(Easing.quad), useNativeDriver: true }).start(({ finished }) => {
        if (finished) onClose();
      });
    }, VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [slide, onClose]);

  const translateY = slide.interpolate({ inputRange: [0, 1], outputRange: [-140, 0] });

  return (
    <Animated.View pointerEvents="box-none" style={[styles.wrap, { top: insets.top + 8, opacity: slide, transform: [{ translateY }] }]}>
      <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel={`Level ${toast.level}`} style={styles.card}>
        <AppIcon name="hud_ranga_gwiazda" size={34} />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Level {toast.level}!</Text>
          <Text style={styles.sub} numberOfLines={2}>
            {toast.newTitle ? `Nowy tytuł: ${toast.newTitle}` : "Tak trzymaj!"}
          </Text>
        </View>
        {toast.nutki > 0 && (
          <View style={styles.reward}>
            <AppIcon name="hud_nutki_waluta" size={16} />
            <Text style={styles.rewardText}>+{toast.nutki}</Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 16,
    right: 16,
    alignItems: "center",
    zIndex: 1000,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: "#facc15",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  title: { fontSize: 16, fontWeight: "800", color: theme.colors.ink },
  sub: { fontSize: 12, color: theme.colors.muted, marginTop: 1 },
  reward: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: theme.colors.surfaceMuted,
  },
  rewardText: { fontSize: 13, fontWeight: "800", color: theme.colors.ink },
});
