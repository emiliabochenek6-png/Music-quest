import { useRef, useState } from "react";
import { Pressable, ScrollView, Text, View, StyleSheet } from "react-native";
import type { NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { useGamification } from "@/context/GamificationContext";
import { useProgress } from "@/context/ProgressContext";
import { BADGES, getEarnedBadgeIds } from "@/lib/gamification/badges";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

const CHIP_WIDTH = 132;
const CHIP_GAP = 10;
const SCROLL_STEP = (CHIP_WIDTH + CHIP_GAP) * 2;

/** The odznaki/badges strip — shared by CalendarActivityView and the
 * Misje screen (app/(main)/daily-challenge.tsx) rather than each owning
 * its own copy, since it's the exact same "which badges are earned right
 * now" read against GamificationContext/ProgressContext either place.
 * Horizontally scrollable with its own ‹›  buttons (not just a swipe) —
 * BADGES is deliberately a long, ever-growing tier list (see its own
 * doc), so a plain wrapping grid would either run very tall or need its
 * own pagination; a side-scrolling strip reads as "there's always more"
 * instead. `scrollX` is tracked locally purely to compute the next
 * scrollTo offset for the arrow buttons — ScrollView itself already
 * handles a direct swipe without needing this state at all. */
export function BadgesCarousel() {
  const { state } = useGamification();
  const { progress } = useProgress();
  const scrollRef = useRef<ScrollView>(null);
  const [scrollX, setScrollX] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);

  const earnedBadgeIds = getEarnedBadgeIds(state, progress.completedLessonIds.size);
  const maxScrollX = Math.max(0, contentWidth - viewportWidth);

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    setScrollX(event.nativeEvent.contentOffset.x);
  }

  function scrollBy(delta: number) {
    const next = Math.max(0, Math.min(maxScrollX, scrollX + delta));
    scrollRef.current?.scrollTo({ x: next, animated: true });
    setScrollX(next);
  }

  return (
    <View>
      <View style={styles.headerRow}>
        <Text style={styles.title}>🏅 Odznaki</Text>
        <View style={styles.arrowsRow}>
          <Pressable
            onPress={() => scrollBy(-SCROLL_STEP)}
            disabled={scrollX <= 0}
            accessibilityRole="button"
            accessibilityLabel="Przewiń odznaki w lewo"
            hitSlop={8}
            style={[styles.arrowButton, scrollX <= 0 && styles.arrowButtonDisabled]}
          >
            <Text style={styles.arrowIcon}>‹</Text>
          </Pressable>
          <Pressable
            onPress={() => scrollBy(SCROLL_STEP)}
            disabled={scrollX >= maxScrollX}
            accessibilityRole="button"
            accessibilityLabel="Przewiń odznaki w prawo"
            hitSlop={8}
            style={[styles.arrowButton, scrollX >= maxScrollX && styles.arrowButtonDisabled]}
          >
            <Text style={styles.arrowIcon}>›</Text>
          </Pressable>
        </View>
      </View>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={32}
        onLayout={(e) => setViewportWidth(e.nativeEvent.layout.width)}
        onContentSizeChange={(w) => setContentWidth(w)}
        contentContainerStyle={styles.strip}
      >
        {BADGES.map((badge) => {
          const earned = earnedBadgeIds.has(badge.id);
          return (
            <View key={badge.id} style={[styles.chip, !earned && styles.chipLocked]}>
              <Text style={[styles.chipIcon, !earned && styles.chipIconLocked]}>{badge.icon}</Text>
              <Text style={styles.chipTitle} numberOfLines={2}>
                {badge.title}
              </Text>
              <Text style={styles.chipDescription} numberOfLines={2}>
                {badge.description}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: "800",
    color: theme.colors.ink,
  },
  arrowsRow: {
    flexDirection: "row",
    gap: 6,
  },
  arrowButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  arrowButtonDisabled: {
    opacity: 0.35,
  },
  arrowIcon: {
    fontSize: 16,
    fontWeight: "800",
    color: theme.colors.ink,
    lineHeight: 18,
  },
  strip: {
    gap: CHIP_GAP,
    paddingRight: 4,
  },
  chip: {
    width: CHIP_WIDTH,
    gap: 2,
    backgroundColor: theme.colors.accentSoft,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    padding: theme.spacing(1.25),
  },
  chipLocked: {
    backgroundColor: theme.colors.surfaceMuted,
    borderColor: theme.colors.border,
    opacity: 0.6,
  },
  chipIcon: {
    fontSize: 20,
  },
  chipIconLocked: {
    opacity: 0.5,
  },
  chipTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: theme.colors.ink,
  },
  chipDescription: {
    fontSize: 10.5,
    fontWeight: "600",
    color: theme.colors.muted,
  },
});
