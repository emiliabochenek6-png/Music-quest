import { Pressable, Text, View, StyleSheet } from "react-native";
import { t } from "@/lib/i18n/translate";
import type { TranslationKey } from "@/lib/i18n/translate";
import type { WorldDefinition, WorldNodeState } from "@/types/content";

interface WorldNodeProps {
  world: WorldDefinition;
  state: WorldNodeState;
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

const LOCKED_COLOR = "#3a3550";
const PREMIUM_COLOR = "#f5c26b";

/** Cheap hex-darken for the bevel's "depth" face — same helper as
 * components/map/LessonNode.tsx's own (duplicated rather than shared
 * across two small map/leaf components — see this app's own "duplicate
 * small tuned visual helpers per-renderer" convention elsewhere). */
function shade(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, Math.min(255, ((num >> 16) & 0xff) + 255 * amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + 255 * amount));
  const b = Math.max(0, Math.min(255, (num & 0xff) + 255 * amount));
  return `rgb(${r | 0}, ${g | 0}, ${b | 0})`;
}

/**
 * One world node on the dark, glowing adventure map — same bevel-button
 * + colored-glow language as components/map/LessonNode.tsx, one
 * granularity level up. Always shows the world's own name as a label (so
 * a tap is never a guess at what's behind it), which the earlier plain-
 * icon "hobbyist" variant didn't — the dark theme replaces that dual-mode
 * split entirely, see app/(main)/map.tsx's own note. A locked node is
 * still pressable: tapping `locked-subscription` opens the paywall,
 * `locked-progression` just can't (see accessibilityState).
 */
export function WorldNode({ world, state, onPress }: WorldNodeProps) {
  const isLockedProgression = state === "locked-progression";
  const isLockedSubscription = state === "locked-subscription";
  const isLocked = isLockedProgression || isLockedSubscription;
  const isCurrent = state === "available";
  const faceColor = isLocked ? LOCKED_COLOR : world.accentColor;
  const glowColor = isLockedSubscription ? PREMIUM_COLOR : world.accentColor;

  return (
    <View style={styles.wrap}>
      {isCurrent && (
        <View style={[styles.pill, { borderColor: world.accentColor }]}>
          <Text style={[styles.pillText, { color: world.accentColor }]}>Start</Text>
        </View>
      )}
      <View style={[styles.bevelBase, { backgroundColor: isLocked ? "#221f30" : shade(faceColor, -0.35) }]} />
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
            transform: [{ translateY: pressed && !isLockedProgression ? 4 : 0 }],
            shadowColor: isLocked && !isLockedSubscription ? "transparent" : glowColor,
          },
        ]}
      >
        <Text style={styles.icon}>{isLocked ? "🔒" : (WORLD_ICON[world.mapIconId] ?? "🎵")}</Text>
      </Pressable>
      <Text style={styles.nameLabel} numberOfLines={2}>
        {t(world.nameKey as TranslationKey)}
      </Text>
      {isLockedSubscription && (
        <View style={[styles.premiumBadge, { borderColor: PREMIUM_COLOR }]}>
          <Text style={[styles.premiumBadgeText, { color: PREMIUM_COLOR }]}>{t("map.locked.subscription")}</Text>
        </View>
      )}
    </View>
  );
}

const NODE_SIZE = 76;

const styles = StyleSheet.create({
  wrap: {
    width: 130,
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
    top: 7,
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
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  icon: {
    fontSize: 30,
  },
  nameLabel: {
    marginTop: 8,
    fontSize: 12.5,
    fontWeight: "700",
    color: "#e9e4ff",
    textAlign: "center",
  },
  premiumBadge: {
    marginTop: 4,
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
