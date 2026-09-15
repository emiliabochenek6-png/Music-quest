import { Pressable, Text, View, StyleSheet } from "react-native";
import { t } from "@/lib/i18n/translate";
import type { TranslationKey } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
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

const LOCKED_COLOR = "#E5E5E5";
const PREMIUM_COLOR = "#FF9600";

/**
 * One world node on the map — flat sticker-style circle (thick border,
 * no shadow/glow/bevel) matching theme/tokens.ts's own Duolingo-inspired
 * look. Always shows the world's own name as a label, so a tap is never
 * a guess at what's behind it. A locked node is still pressable: tapping
 * `locked-subscription` opens the paywall, `locked-progression` just
 * can't (see accessibilityState).
 */
export function WorldNode({ world, state, onPress }: WorldNodeProps) {
  const isLockedProgression = state === "locked-progression";
  const isLockedSubscription = state === "locked-subscription";
  const isLocked = isLockedProgression || isLockedSubscription;
  const isCurrent = state === "available";
  const faceColor = isLocked ? LOCKED_COLOR : world.accentColor;
  const borderColor = isLockedSubscription ? PREMIUM_COLOR : isLocked ? theme.colors.border : world.accentColor;

  return (
    <View style={styles.wrap}>
      {isCurrent && (
        <View style={[styles.pill, { borderColor: world.accentColor }]}>
          <Text style={[styles.pillText, { color: world.accentColor }]}>Start</Text>
        </View>
      )}
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
    fontSize: 30,
  },
  nameLabel: {
    marginTop: 8,
    fontSize: 12.5,
    fontWeight: "700",
    color: theme.colors.ink,
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
