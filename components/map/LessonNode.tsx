import { Pressable, Text, View, StyleSheet } from "react-native";
import type { LessonNodeState } from "@/lib/progression/resolveLessonNodeState";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { LessonDefinition } from "@/types/exercises";

interface LessonNodeProps {
  lesson: LessonDefinition;
  state: LessonNodeState;
  /** The world's own accent hex — the node's face color keys off this,
   * matching the reference "one accent color per world" look rather than
   * a fixed palette. */
  accentHex: string;
  /** Best-ever star rating for THIS lesson (see GamificationState's own
   * lessonStars) — undefined until the lesson has been completed at
   * least once, same as the underlying map never having an entry for
   * it. Only ever rendered while `state === "completed"`; a lesson still
   * in progress has no rating to show yet. */
  stars?: 1 | 2 | 3;
  onPress: (lesson: LessonDefinition) => void;
}

const LOCKED_COLOR = "#E9DFCE";

/**
 * One level ("poziom") node on the map path — a flat sticker-style
 * circle (thick border, no shadow/glow/bevel), matching theme/tokens.ts's
 * own Duolingo-inspired look. Locked nodes render flat/dim and aren't
 * pressable — there's no paywall a tap could open here (that's already
 * been resolved one screen up), just "finish the previous level first".
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
            borderColor: isLocked ? theme.colors.border : accentHex,
            opacity: pressed && !isLocked ? 0.85 : 1,
          },
        ]}
      >
        <Text style={styles.icon}>{isLocked ? "🔒" : state === "completed" ? "⭐" : "▶"}</Text>
      </Pressable>
      <Text style={[styles.orderLabel, { color: isLocked ? theme.colors.muted : theme.colors.ink }]}>{lesson.order}</Text>
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

const NODE_SIZE = 64;

const styles = StyleSheet.create({
  wrap: {
    width: NODE_SIZE + 8,
    alignItems: "center",
  },
  pill: {
    position: "absolute",
    top: -30,
    borderWidth: theme.borderWidth,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: theme.colors.surface,
    zIndex: 5,
  },
  pillText: {
    fontSize: 11,
    fontWeight: "700",
  },
  node: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
    borderWidth: theme.borderWidth,
    alignItems: "center",
    justifyContent: "center",
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
    color: theme.colors.border,
  },
});
