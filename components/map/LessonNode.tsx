import { Pressable, Text, View, StyleSheet } from "react-native";
import { AppIcon } from "@/components/icons/AppIcon";
import { FalszomirPortrait } from "@/components/map/FalszomirPortrait";
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
  const isBoss = lesson.isBoss ?? false;
  const faceColor = isLocked ? LOCKED_COLOR : accentHex;
  const nodeSize = isBoss ? BOSS_NODE_SIZE : NODE_SIZE;

  return (
    <View style={[styles.wrap, isBoss && styles.wrapBoss]}>
      {isCurrent && (
        <View style={styles.pillWrap}>
          <View style={[styles.pill, { borderColor: accentHex }]}>
            <Text style={[styles.pillText, { color: accentHex }]}>{isBoss ? "Pokonaj bossa!" : "Start"}</Text>
          </View>
        </View>
      )}
      <Pressable
        onPress={() => onPress(lesson)}
        disabled={isLocked}
        accessibilityRole="button"
        accessibilityLabel={isBoss ? "Poziom bonusowy — pokonaj bossa" : `Poziom ${lesson.order}`}
        accessibilityState={{ disabled: isLocked }}
        style={({ pressed }) => [
          styles.node,
          { width: nodeSize, height: nodeSize, borderRadius: nodeSize / 2 },
          isBoss && styles.nodeBoss,
          {
            backgroundColor: faceColor,
            borderColor: isLocked ? theme.colors.border : accentHex,
            opacity: pressed && !isLocked ? 0.85 : 1,
          },
        ]}
      >
        {isBoss ? (
          // The boss stays visible even locked — seeing WHO is waiting at
          // the end of the path is the point (builds anticipation), only
          // the level itself (Pressable's disabled/faceColor/borderColor
          // above) stays locked. Dimmed rather than full opacity while
          // locked is the only "not yet" cue on the portrait itself.
          <View style={{ opacity: isLocked ? 0.45 : 1 }}>
            <FalszomirPortrait size={nodeSize - 14} />
          </View>
        ) : isLocked ? (
          <AppIcon name="kraina_klodka" size={24} />
        ) : state === "completed" ? (
          <AppIcon name="hud_ranga_gwiazda" size={24} />
        ) : (
          <Text style={styles.icon}>▶</Text>
        )}
      </Pressable>
      <Text style={[styles.orderLabel, { color: isLocked ? theme.colors.muted : theme.colors.ink }]}>
        {isBoss ? "Fałszomir" : lesson.order}
      </Text>
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
/** Bigger than every ordinary node (see LessonNode's own doc) — the
 * bonus/boss level is meant to visually announce itself on the path,
 * not blend in as "one more circle". */
const BOSS_NODE_SIZE = 92;

const styles = StyleSheet.create({
  wrap: {
    width: NODE_SIZE + 8,
    alignItems: "center",
  },
  wrapBoss: {
    width: BOSS_NODE_SIZE + 8,
  },
  // Wraps `pill` in a band that spans the WHOLE node width (left/right:0,
  // not just top) so a longer label (the boss pill's "Pokonaj bossa!" vs.
  // the usual "Start") still centers on the node itself — an absolutely
  // positioned child with no explicit width can't be reliably centered by
  // the parent's own alignItems alone on every platform this app targets
  // (RN Web included), so this band centers ITS content via ordinary
  // flexbox instead of relying on that.
  pillWrap: {
    position: "absolute",
    top: -30,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 5,
  },
  pill: {
    borderWidth: theme.borderWidth,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: theme.colors.surface,
  },
  pillText: {
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
  },
  node: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
    borderWidth: theme.borderWidth,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  nodeBoss: {
    borderWidth: theme.borderWidth * 1.75,
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
