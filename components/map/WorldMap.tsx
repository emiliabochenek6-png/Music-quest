import { Fragment } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";
import { WORLD_NODE_ROW_WIDTH, WORLD_NODE_SIZE, WorldNode } from "@/components/map/WorldNode";
import { WORLDS } from "@/data/worlds";
import { resolveNodeState } from "@/lib/progression/resolveNodeState";
import type { ProgressState, SubscriptionStatus, WorldDefinition } from "@/types/content";

interface WorldMapProps {
  progress: ProgressState;
  subscription: SubscriptionStatus;
  /** Passed straight through to resolveNodeState — see its own doc on
   * why "previous world done" now also requires every one of its
   * lessons to meet MIN_STARS_TO_ADVANCE_WORLD. */
  lessonStars: Readonly<Record<string, 1 | 2 | 3>>;
  onSelectWorld: (world: WorldDefinition) => void;
}

const NODE_SPACING_Y = 176;
const PATH_WIDTH = 320;
const AMPLITUDE = 90;
const TOP_PADDING = 40;
const NEUTRAL_GLOW = "#1CB0F6";

function nodeX(index: number): number {
  return PATH_WIDTH / 2 + AMPLITUDE * Math.sin(index * 1.15);
}
function nodeY(index: number): number {
  return TOP_PADDING + index * NODE_SPACING_Y;
}

/** The top-level map of all 12 worlds — same winding-path language as
 * components/map/LessonPath.tsx (see that file's own doc for the
 * sine-wave node-position formula and the reference-art research behind
 * this direction), one granularity level up. The connecting line's own
 * color shifts to each SEGMENT's destination world's accent, so the path
 * itself hints at what's ahead — WorldNode still owns each node's own
 * glow/lock/name rendering. Deliberately a plain canvas with no scattered
 * decoration — the light "educational" pass dropped the note-glyph
 * background the earlier dark theme had. */
export function WorldMap({ progress, subscription, lessonStars, onSelectWorld }: WorldMapProps) {
  const insets = useSafeAreaInsets();
  const totalHeight = TOP_PADDING + (WORLDS.length - 1) * NODE_SPACING_Y + 100;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={{ paddingTop: insets.top + 64, paddingBottom: insets.bottom + 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ width: "100%", height: totalHeight, alignItems: "center" }}>
        <Svg width={PATH_WIDTH} height={totalHeight} style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="worldPathGlow" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={NEUTRAL_GLOW} stopOpacity={0.9} />
              <Stop offset="1" stopColor={NEUTRAL_GLOW} stopOpacity={0.35} />
            </LinearGradient>
          </Defs>
          {WORLDS.map((world, index) => {
            if (index === 0) return null;
            const x1 = nodeX(index - 1);
            const y1 = nodeY(index - 1);
            const x2 = nodeX(index);
            const y2 = nodeY(index);
            const midY = (y1 + y2) / 2;
            const d = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
            return (
              <Fragment key={world.id}>
                <Path d={d} stroke={world.accentColor} strokeWidth={10} strokeOpacity={0.15} fill="none" strokeLinecap="round" />
                <Path d={d} stroke="url(#worldPathGlow)" strokeWidth={3} strokeDasharray="1 14" fill="none" strokeLinecap="round" />
              </Fragment>
            );
          })}
        </Svg>

        {WORLDS.map((world, index) => {
          const state = resolveNodeState(world, progress, subscription, lessonStars);
          // Label always falls toward whichever side has more room — the
          // side the path ISN'T currently swung toward (same sine-sign
          // trick LessonPath's own landmark emoji use) — so it never runs
          // off the edge of the canvas.
          const labelSide: "left" | "right" = Math.sin(index * 1.15) >= 0 ? "left" : "right";
          const left = labelSide === "right" ? nodeX(index) - WORLD_NODE_SIZE / 2 : nodeX(index) - (WORLD_NODE_ROW_WIDTH - WORLD_NODE_SIZE / 2);
          return (
            <View key={world.id} style={{ position: "absolute", left, top: nodeY(index) - WORLD_NODE_SIZE / 2 }}>
              <WorldNode world={world} state={state} labelSide={labelSide} onPress={onSelectWorld} />
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
});
