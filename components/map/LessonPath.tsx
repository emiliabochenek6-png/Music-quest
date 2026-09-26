import { useEffect, useRef } from "react";
import { Image, ScrollView, View, StyleSheet } from "react-native";
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
  /** A world's own background illustration (a `require()`'d image module
   * id), tiled vertically at its OWN aspect ratio (see
   * BACKGROUND_TILE_ASPECT_RATIO) to cover the whole scrollable content
   * area behind the path/nodes — see app/(main)/world/[worldId].tsx's
   * own WORLD_BACKGROUNDS. Repeated copies, not one stretched image: the
   * source art is a fixed-proportion illustration and a world's total
   * path height depends on how many lessons it has, so stretching ONE
   * copy to match would distort it (squeezed hard on a 20+-lesson path).
   * Omitted for every world without one yet — falls back to the plain
   * surface color underneath. */
  backgroundImageSource?: number;
  onSelectLesson: (lesson: LessonDefinition) => void;
}

const NODE_SPACING_Y = 148;
const PATH_WIDTH = 320;
const AMPLITUDE = 88;
const TOP_PADDING = 60;
/** How far below the top of the (unmeasured — see the mount effect's own
 * doc) scrollable area the "jump to next lesson" scroll aims to land the
 * target node — not exact centering, just comfortably past the header
 * content most world screens open with, on both phone and desktop
 * viewports this app actually ships to. */
const SCROLL_TARGET_OFFSET = 220;
/** The source art's own native proportions (720×1510 — see the README in
 * its assets/backgrounds subfolder), used to size each tile at
 * PATH_WIDTH without distorting it — see backgroundImageSource's own
 * doc. */
const BACKGROUND_TILE_ASPECT_RATIO = 1510 / 720;

function nodeX(index: number): number {
  return PATH_WIDTH / 2 + AMPLITUDE * Math.sin(index * 1.15);
}
function nodeY(index: number): number {
  return TOP_PADDING + index * NODE_SPACING_Y;
}

/** The world's own "poziomy" path — a glowing winding trail connecting
 * lesson nodes, matching the reference art's adventure-map feel (see the
 * app's own research on the real web app's SkillPath.tsx for the
 * sine-wave node-position formula this mirrors). The line itself is
 * drawn once as a smooth path through every node's center; nodes render
 * on top as real Pressables (components/map/LessonNode), not SVG
 * hit-regions. No scattered background decoration — dropped along with
 * WorldMap's own for the light "educational" pass. */
export function LessonPath({
  lessons,
  completedLessonIds,
  lessonStars,
  accentHex,
  backgroundImageSource,
  onSelectLesson,
}: LessonPathProps) {
  const insets = useSafeAreaInsets();
  const totalHeight = TOP_PADDING + (lessons.length - 1) * NODE_SPACING_Y + 80;

  // Jumps straight to the next thing to do — the first lesson that
  // ISN'T completed yet (falls back to the very last node, the boss,
  // once everything else is) — the instant this screen mounts. Without
  // this, returning here after finishing a lesson dumped the player back
  // at the TOP of a path that can run to 20+ nodes, forcing a manual
  // scroll past everything already done just to find where to continue.
  // Not animated — this is where the screen should already be, not a
  // moment to draw attention to. Offsets by a fixed estimate of "how far
  // down the screen feels comfortable", not this ScrollView's own
  // measured height (react-native-web's ScrollView never actually fires
  // `onLayout` — confirmed empirically, not just undocumented — so a
  // measured approach silently never runs at all; a fixed guess that
  // ALWAYS fires beats an exact one that doesn't fire).
  const scrollRef = useRef<ScrollView>(null);
  const nextLessonIndex = lessons.findIndex(
    (lesson) => resolveLessonNodeState(lesson, lessons, completedLessonIds) !== "completed"
  );
  const targetIndex = nextLessonIndex === -1 ? lessons.length - 1 : nextLessonIndex;
  useEffect(() => {
    const targetY = nodeY(targetIndex) - SCROLL_TARGET_OFFSET;
    scrollRef.current?.scrollTo({ y: Math.max(0, targetY), animated: false });
    // Only ever needs to run once, on mount — re-centering on every
    // unrelated re-render (e.g. a star rating updating) would fight the
    // player's own later scrolling.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const backgroundTileHeight = PATH_WIDTH * BACKGROUND_TILE_ASPECT_RATIO;
  const backgroundTileCount = Math.ceil(totalHeight / backgroundTileHeight);

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.scroll}
      contentContainerStyle={{ paddingBottom: insets.bottom + 40, alignItems: "center" }}
      showsVerticalScrollIndicator={false}
    >
      {/* Fixed PATH_WIDTH (not "100%") — see WorldMap.tsx's own identical
          fix for why: everything below is positioned in raw pixel
          coordinates against THIS View's own left edge, so a "100%"-wide
          box here (matching the full, much-wider-than-320 viewport on a
          tablet/laptop) pinned the whole path into the top-left corner
          instead of centering it. */}
      <View style={{ width: PATH_WIDTH, height: totalHeight }}>
        {backgroundImageSource &&
          Array.from({ length: backgroundTileCount }, (_, tileIndex) => (
            <Image
              key={`bg-tile-${tileIndex}`}
              source={backgroundImageSource}
              resizeMode="stretch"
              style={{
                position: "absolute",
                top: tileIndex * backgroundTileHeight,
                left: 0,
                width: PATH_WIDTH,
                height: backgroundTileHeight,
              }}
            />
          ))}
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
          const state = resolveLessonNodeState(lesson, lessons, completedLessonIds);
          // The boss node renders noticeably bigger than every ordinary
          // node (see LessonNode's own doc) — centering it on the path
          // needs a wider offset than the fixed one every regular node
          // shares (half its own circle for top, half its slightly-wider
          // wrap for left — same "wrap is 8px wider than the circle"
          // shape LessonNode.tsx's own styles use), or it'd sit visibly
          // off-center from where the trail actually passes through.
          const nodeRadius = (lesson.isBoss ? 92 : 64) / 2;
          const wrapHalfWidth = nodeRadius + 4;
          return (
            <View
              key={lesson.id}
              style={{ position: "absolute", left: nodeX(index) - wrapHalfWidth, top: nodeY(index) - nodeRadius }}
            >
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
