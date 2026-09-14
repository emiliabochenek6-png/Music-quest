import { Pressable, Text, View, StyleSheet } from "react-native";
import type { LessonNodeState } from "@/lib/progression/resolveLessonNodeState";
import type { LessonDefinition } from "@/types/exercises";

interface LessonNodeProps {
  lesson: LessonDefinition;
  state: LessonNodeState;
  /** The world's own accent hex — glow color and node face both key off
   * this, matching the reference "one glowing color per world" look
   * rather than a fixed palette. */
  accentHex: string;
  /** Best-ever star rating for THIS lesson (see GamificationState's own
   * lessonStars) — undefined until the lesson has been completed at
   * least once, same as the underlying map never having an entry for
   * it. Only ever rendered while `state === "completed"`; a lesson still
   * in progress has no rating to show yet. */
  stars?: 1 | 2 | 3;
  onPress: (lesson: LessonDefinition) => void;
}

const LOCKED_COLOR = "#3a3550";

/**
 * One level ("poziom") node on the dark, glowing adventure-map path — a
 * two-layer "bevel" button (a darker offset base + a brighter top face
 * that presses down on tap) with a colored glow shadow, matching the
 * reference art's lesson markers. Locked nodes render flat/dim with no
 * glow and aren't pressable — there's no paywall a tap could open here
 * (that's already been resolved one screen up), just "finish the
 * previous level first".
 */
export function LessonNode({ lesson, state, accentHex, stars, onPress }: LessonNodeProps) {
  const isLocked = state === "locked";
  const isCurrent = state === "available";
  const faceColor = isLocked ? LOCKED_COLOR : accentHex;

  return (
    <View style={styles.wrap}>
      {isCurrent && (
        <View style={[styles.pill, { borderColor: accentHex }]}>
          <Text style={[styles.pillText, { color: accentHex }]}>Start</Text>
        </View>
      )}
      <View style={[styles.bevelBase, { backgroundColor: isLocked ? "#221f30" : shade(faceColor, -0.35) }]} />
      <Pressable
        onPress={() => onPress(lesson)}
        disabled={isLocked}
        accessibilityRole="button"
        accessibilityLabel={`Poziom ${lesson.order}`}
        accessibilityState={{ disabled: isLocked }}
        style={({ pressed }) => [
          styles.node,
          {
            backgroundColor: faceColor,
            transform: [{ translateY: pressed && !isLocked ? 4 : 0 }],
            shadowColor: isLocked ? "transparent" : accentHex,
          },
        ]}
      >
        <Text style={styles.icon}>{isLocked ? "🔒" : state === "completed" ? "⭐" : "▶"}</Text>
      </Pressable>
      <Text style={[styles.orderLabel, { color: isLocked ? "#6b6785" : "#e9e4ff" }]}>{lesson.order}</Text>
      {state === "completed" && <StarRating stars={stars} />}
    </View>
  );
}

/** The best-ever 1-3 rating for a completed lesson, three small glyphs in
 * a row — filled (★) up to `stars`, outline (☆) after. `stars` can still
 * be undefined for a lesson `markLessonCompleted` marked done before this
 * feature existed (an old save) — reads as all-outline rather than
 * hiding the row entirely, so a returning player sees exactly what needs
 * re-doing to earn real stars, not a gap. */
function StarRating({ stars }: { stars?: 1 | 2 | 3 }) {
  return (
    <View style={styles.starRow}>
      {[1, 2, 3].map((position) => (
        <Text key={position} style={[styles.star, position <= (stars ?? 0) ? styles.starFilled : styles.starEmpty]}>
          {position <= (stars ?? 0) ? "★" : "☆"}
        </Text>
      ))}
    </View>
  );
}

/** Cheap hex-darken for the bevel's "depth" face — no color library needed
 * for a single linear blend toward black. */
function shade(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, Math.min(255, ((num >> 16) & 0xff) + 255 * amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + 255 * amount));
  const b = Math.max(0, Math.min(255, (num & 0xff) + 255 * amount));
  return `rgb(${r | 0}, ${g | 0}, ${b | 0})`;
}

const NODE_SIZE = 64;

const styles = StyleSheet.create({
  wrap: {
    width: NODE_SIZE + 8,
    alignItems: "center",
  },
  pill: {
    position: "absolute",
    top: -30,
    borderWidth: 1.5,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "#14101f",
    zIndex: 5,
  },
  pillText: {
    fontSize: 11,
    fontWeight: "700",
  },
  bevelBase: {
    position: "absolute",
    top: 6,
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
  },
  node: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.9,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  icon: {
    fontSize: 24,
  },
  orderLabel: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "700",
  },
  starRow: {
    flexDirection: "row",
    marginTop: 2,
  },
  star: {
    fontSize: 12,
    marginHorizontal: 1,
  },
  starFilled: {
    color: "#facc15",
  },
  starEmpty: {
    color: "rgba(255,255,255,0.25)",
  },
});
