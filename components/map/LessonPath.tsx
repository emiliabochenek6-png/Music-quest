import { ScrollView, View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";
import { LessonNode } from "@/components/map/LessonNode";
import { resolveLessonNodeState } from "@/lib/progression/resolveLessonNodeState";
import type { LessonDefinition } from "@/types/exercises";

interface LessonPathProps {
  lessons: readonly LessonDefinition[];
  completedLessonIds: ReadonlySet<string>;
  /** Best-ever star rating per lesson id (see GamificationState's own
   * lessonStars) — passed straight through to each LessonNode. */
  lessonStars: Readonly<Record<string, 1 | 2 | 3>>;
  accentHex: string;
  onSelectLesson: (lesson: LessonDefinition) => void;
}

const NODE_SPACING_Y = 148;
const PATH_WIDTH = 320;
const AMPLITUDE = 88;
const TOP_PADDING = 60;

/** A handful of purely decorative "landmark" emoji scattered near the
 * path — evokes the reference art's illustrated waypoints (mountain,
 * cave, river, chest) without needing actual painted illustrations,
 * which this pass has no way to produce. Positioned relative to node
 * index, offset to the side the path ISN'T swinging toward so they never
 * sit on top of a node. */
const LANDMARKS = ["🏔️", "💎", "🌊", "🕳️"];

function nodeX(index: number): number {
  return PATH_WIDTH / 2 + AMPLITUDE * Math.sin(index * 1.15);
}
function nodeY(index: number): number {
  return TOP_PADDING + index * NODE_SPACING_Y;
}

/** The world's own "poziomy" path — a dark, glowing winding trail
 * connecting lesson nodes, matching the reference art's adventure-map
 * feel (see the app's own research on the real web app's SkillPath.tsx
 * for the sine-wave node-position formula this mirrors). The line itself
 * is drawn once as a smooth path through every node's center; nodes
 * render on top as real Pressables (components/map/LessonNode), not SVG
 * hit-regions. */
export function LessonPath({ lessons, completedLessonIds, lessonStars, accentHex, onSelectLesson }: LessonPathProps) {
  const insets = useSafeAreaInsets();
  const totalHeight = TOP_PADDING + (lessons.length - 1) * NODE_SPACING_Y + 80;

  const pathD = lessons
    .map((_, index) => {
      const x = nodeX(index);
      const y = nodeY(index);
      if (index === 0) return `M ${x} ${y}`;
      const prevX = nodeX(index - 1);
      const prevY = nodeY(index - 1);
      const midY = (prevY + y) / 2;
      return `C ${prevX} ${midY}, ${x} ${midY}, ${x} ${y}`;
    })
    .join(" ");

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ width: "100%", height: totalHeight, alignItems: "center" }}>
        <Svg width={PATH_WIDTH} height={totalHeight} style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="pathGlow" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={accentHex} stopOpacity={0.9} />
              <Stop offset="1" stopColor={accentHex} stopOpacity={0.35} />
            </LinearGradient>
          </Defs>
          {/* Soft glow underlay, then a crisp dashed line on top — same
           * two-pass trick the reference's own glowing trail uses. */}
          <Path d={pathD} stroke={accentHex} strokeWidth={10} strokeOpacity={0.18} fill="none" strokeLinecap="round" />
          <Path d={pathD} stroke="url(#pathGlow)" strokeWidth={3} strokeDasharray="1 14" fill="none" strokeLinecap="round" />
        </Svg>

        {lessons.map((lesson, index) => {
          if (index === 0 || index === lessons.length - 1) return null;
          const landmark = LANDMARKS[(index - 1) % LANDMARKS.length];
          const side = Math.sin(index * 1.15) >= 0 ? -1 : 1;
          return (
            <Text
              key={`landmark-${lesson.id}`}
              style={{
                position: "absolute",
                left: nodeX(index) + side * 74,
                top: nodeY(index) - 16,
                fontSize: 26,
                opacity: 0.8,
              }}
            >
              {landmark}
            </Text>
          );
        })}

        {lessons.map((lesson, index) => {
          const state = resolveLessonNodeState(lesson, lessons, completedLessonIds);
          return (
            <View key={lesson.id} style={{ position: "absolute", left: nodeX(index) - 36, top: nodeY(index) - 32 }}>
              <LessonNode lesson={lesson} state={state} accentHex={accentHex} stars={lessonStars[lesson.id]} onPress={onSelectLesson} />
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
