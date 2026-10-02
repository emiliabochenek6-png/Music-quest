import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Text, View, StyleSheet } from "react-native";
import { getRankForXp } from "@/lib/gamification/rank";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

const GOLD = "#facc15";

/** A slim "Level N" bar for the lesson screen: it fills smoothly as XP
 * arrives, floats a "+10 XP" up from itself on every gain and, when a
 * level is crossed, the bar flashes and the label pops — so every correct
 * answer visibly moves the player toward the next level. Reads only the
 * `xp` number it's given, so it needs no wiring beyond the lesson
 * screen's own gamification state. */
export function LevelBar({ xp }: { xp: number }) {
  const info = getRankForXp(xp);
  const span = info.xpForNextRank === null ? null : info.xpIntoRank + info.xpForNextRank;
  const fraction = span && span > 0 ? Math.min(1, info.xpIntoRank / span) : 1;

  const width = useRef(new Animated.Value(fraction)).current;
  const pop = useRef(new Animated.Value(0)).current;
  const previous = useRef({ xp, level: info.rank });
  const [floaters, setFloaters] = useState<{ id: number; amount: number }[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    const before = previous.current;
    previous.current = { xp, level: info.rank };
    if (xp > before.xp) {
      const id = nextId.current++;
      setFloaters((list) => [...list, { id, amount: xp - before.xp }]);
    }
    if (info.rank > before.level) {
      // Fill to the top first, then snap to the new level's own start and fill from there.
      Animated.sequence([
        Animated.timing(width, { toValue: 1, duration: 260, easing: Easing.out(Easing.quad), useNativeDriver: false }),
        Animated.timing(width, { toValue: 0, duration: 0, useNativeDriver: false }),
        Animated.timing(width, { toValue: fraction, duration: 380, easing: Easing.out(Easing.quad), useNativeDriver: false }),
      ]).start();
      pop.setValue(0);
      Animated.sequence([
        Animated.timing(pop, { toValue: 1, duration: 180, useNativeDriver: false }),
        Animated.timing(pop, { toValue: 0, duration: 320, useNativeDriver: false }),
      ]).start();
    } else {
      Animated.timing(width, { toValue: fraction, duration: 420, easing: Easing.out(Easing.quad), useNativeDriver: false }).start();
    }
  }, [xp, info.rank, fraction, width, pop]);

  const fillWidth = width.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] });
  const labelScale = pop.interpolate({ inputRange: [0, 1], outputRange: [1, 1.35] });

  return (
    <View style={styles.row} accessibilityLabel={`Level ${info.rank}`}>
      <Animated.Text style={[styles.label, { transform: [{ scale: labelScale }] }]}>Lv {info.rank}</Animated.Text>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { width: fillWidth }]} />
      </View>
      <Text style={styles.xp}>{span === null ? "MAX" : `${info.xpIntoRank}/${span}`}</Text>
      <View pointerEvents="none" style={styles.floatLayer}>
        {floaters.map((floater) => (
          <Floater key={floater.id} amount={floater.amount} onDone={() => setFloaters((list) => list.filter((item) => item.id !== floater.id))} />
        ))}
      </View>
    </View>
  );
}

function Floater({ amount, onDone }: { amount: number; onDone: () => void }) {
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(progress, { toValue: 1, duration: 900, easing: Easing.out(Easing.quad), useNativeDriver: true }).start(({ finished }) => {
      if (finished) onDone();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);
  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [0, -26] });
  const opacity = progress.interpolate({ inputRange: [0, 0.15, 0.7, 1], outputRange: [0, 1, 1, 0] });
  return <Animated.Text style={[styles.floater, { opacity, transform: [{ translateY }] }]}>+{amount} XP</Animated.Text>;
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6 },
  label: { fontSize: 12, fontWeight: "800", color: theme.colors.ink, minWidth: 38 },
  track: { flex: 1, height: 8, borderRadius: 4, backgroundColor: theme.colors.surfaceMuted, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 4, backgroundColor: GOLD },
  xp: { fontSize: 11, fontWeight: "700", color: theme.colors.muted, minWidth: 54, textAlign: "right" },
  floatLayer: { position: "absolute", right: 56, top: -4, width: 80, height: 20, alignItems: "flex-end" },
  floater: { position: "absolute", fontSize: 13, fontWeight: "800", color: "#d99a00" },
});
