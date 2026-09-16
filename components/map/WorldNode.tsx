import { Pressable, Text, View, StyleSheet } from "react-native";
import { t } from "@/lib/i18n/translate";
import type { TranslationKey } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { WorldDefinition, WorldNodeState } from "@/types/content";

interface WorldNodeProps {
  world: WorldDefinition;
  state: WorldNodeState;
  /** Which side the name label sits on relative to the circle — WorldMap
   * alternates this per node (same sine-sign trick LessonPath already
   * uses for its own landmark emoji) so the label always falls toward
   * the side of the path with more room, never off the edge of the
   * canvas. */
  labelSide: "left" | "right";
  onPress: (world: WorldDefinition) => void;
}

const WORLD_ICON: Record<string, string> = {
  note: "🎵",
  metronome: "🥁",
  "bar-line": "📏",
  interval: "🎚️",
  chord: "🎹",
  inversion: "🦇",
  citadel: "🏰",
  "key-signature": "🗝️",
  build: "🏗️",
  beam: "🎼",
  dictation: "🎧",
  microphone: "🎤",
};

const LOCKED_COLOR = "#241C3D";
const PREMIUM_COLOR = "#FF9600";

/**
 * One world node on the map — a flat sticker-style circle (thick border,
 * no shadow/glow/bevel) matching theme/tokens.ts's own Duolingo-inspired
 * look, sitting directly ON the winding path with its name label beside
 * it rather than underneath (see WorldMap's own doc — this mirrors the
 * "young explorer" map reference the app's design is now based on).
 * Always shows the world's own name, so a tap is never a guess at what's
 * behind it. A locked node is still pressable: tapping
 * `locked-subscription` opens the paywall, `locked-progression` just
 * can't (see accessibilityState).
 */
export function WorldNode({ world, state, labelSide, onPress }: WorldNodeProps) {
  const isLockedProgression = state === "locked-progression";
  const isLockedSubscription = state === "locked-subscription";
  const isLocked = isLockedProgression || isLockedSubscription;
  const isCurrent = state === "available";
  const faceColor = isLocked ? LOCKED_COLOR : world.accentColor;
  const borderColor = isLockedSubscription ? PREMIUM_COLOR : isLocked ? theme.colors.border : world.accentColor;

  const circle = (
    <View style={styles.circleWrap}>
      {isCurrent && <View style={[styles.ring, { borderColor: world.accentColor }]} />}
      <Pressable
        onPress={() => onPress(world)}
        disabled={isLockedProgression}
        accessibilityRole="button"
        accessibilityLabel={t(world.nameKey as TranslationKey)}
        accessibilityState={{ disabled: isLockedProgression }}
        style={({ pressed }) => [
          styles.node,
          {
            backgroundColor: faceColor,
            borderColor,
            opacity: pressed && !isLockedProgression ? 0.85 : 1,
          },
        ]}
      >
        <Text style={styles.icon}>{isLocked ? "🔒" : (WORLD_ICON[world.mapIconId] ?? "🎵")}</Text>
      </Pressable>
    </View>
  );

  const label = (
    <View style={[styles.labelCol, labelSide === "left" && styles.labelColRight]}>
      {isCurrent && <Text style={[styles.startLabel, { color: world.accentColor }]}>Start</Text>}
      <Text style={[styles.nameLabel, labelSide === "left" && { textAlign: "right" }]} numberOfLines={2}>
        {t(world.nameKey as TranslationKey)}
      </Text>
      {isLockedSubscription && (
        <View style={[styles.premiumBadge, { borderColor: PREMIUM_COLOR, alignSelf: labelSide === "left" ? "flex-end" : "flex-start" }]}>
          <Text style={[styles.premiumBadgeText, { color: PREMIUM_COLOR }]}>{t("map.locked.subscription")}</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.row}>
      {labelSide === "right" ? (
        <>
          {circle}
          {label}
        </>
      ) : (
        <>
          {label}
          {circle}
        </>
      )}
    </View>
  );
}

/** Circle diameter and total row width (circle + gap + label column) —
 * exported so WorldMap can position each node's wrapping View precisely
 * (the circle itself always lands exactly on nodeX/nodeY, the label
 * column extends to whichever side WorldMap picked). */
export const WORLD_NODE_SIZE = 76;
export const WORLD_NODE_ROW_WIDTH = 216;

const styles = StyleSheet.create({
  row: {
    width: WORLD_NODE_ROW_WIDTH,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  circleWrap: {
    width: WORLD_NODE_SIZE,
    height: WORLD_NODE_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    width: WORLD_NODE_SIZE + 12,
    height: WORLD_NODE_SIZE + 12,
    borderRadius: (WORLD_NODE_SIZE + 12) / 2,
    borderWidth: 2,
    borderStyle: "dashed",
    opacity: 0.6,
  },
  node: {
    width: WORLD_NODE_SIZE,
    height: WORLD_NODE_SIZE,
    borderRadius: WORLD_NODE_SIZE / 2,
    borderWidth: theme.borderWidth,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 30,
  },
  labelCol: {
    flex: 1,
  },
  labelColRight: {
    alignItems: "flex-end",
  },
  startLabel: {
    fontSize: 10.5,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  nameLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: theme.colors.ink,
  },
  premiumBadge: {
    marginTop: 4,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  premiumBadgeText: {
    fontSize: 9,
    fontWeight: "700",
  },
});
