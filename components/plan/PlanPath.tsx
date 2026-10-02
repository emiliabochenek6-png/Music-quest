import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, Pressable, ScrollView, Text, View, StyleSheet } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DarkButton } from "@/components/exercises/DarkButton";
import { AppIcon } from "@/components/icons/AppIcon";
import { WORLD_ICON } from "@/components/map/WorldNode";
import { resolveBossPortrait } from "@/components/map/bossPortraits";
import { describeLesson, openLesson, openReview } from "@/components/plan/PlanTodayCard";
import { SoltekMascot } from "@/components/SoltekMascot";
import { useGamification } from "@/context/GamificationContext";
import { usePlan } from "@/context/PlanContext";
import { useProgress } from "@/context/ProgressContext";
import { getWorldContent } from "@/data/lessons";
import { getWorldById } from "@/data/worlds";
import { todayISODate } from "@/lib/gamification/activity";
import { daysBetween, formatShortPolishDate, weekdayOf } from "@/lib/plan/dates";
import { getLessonInfo } from "@/lib/plan/lessonIndex";
import { buildPathView } from "@/lib/plan/pathView";
import { getTodayStatus } from "@/lib/plan/today";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import { GlyphText } from "@/components/icons/GlyphText";

const WEEKDAYS = ["niedziela", "poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota"];
const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

// Winding trail — the same sine-wave idea as LessonPath, so the plan feels like a game path too.
const TRAIL_WIDTH = 320;
const AMPLITUDE = 74;
const NODE_SIZE = 66;
const BOSS_NODE_SIZE = 88;
const NODE_SPACING_Y = 112;
/** Height of the day banner itself, and the slot it reserves: the slot is taller so the pulsing node's START bubble (which sits above its circle) never runs into the banner. */
const DAY_BANNER_BOX = 38;
const DAY_BANNER_HEIGHT = 74;
const TOP_PADDING = 8;
const DAYS_SHOWN_STEP = 5;

interface TrailLesson {
  kind: "lesson";
  lessonId: string;
  cx: number;
  cy: number;
  done: boolean;
  highlight: boolean;
  isCurrent: boolean;
  isBoss: boolean;
  bossName?: string;
  accent: string;
  iconName?: ReturnType<typeof iconFor>;
  side: "left" | "right";
}
interface TrailBanner {
  kind: "banner";
  y: number;
  title: string;
  subtitle: string;
  isToday: boolean;
}
type TrailItem = TrailLesson | TrailBanner;

function iconFor(mapIconId: string | undefined) {
  return mapIconId ? WORLD_ICON[mapIconId]?.icon : undefined;
}

/** "Tryb nauki" / "Twój plan" — the personal path as a game-like winding
 * trail: a hero card with Soltek and a progress ring, today's reviews, then
 * the days ahead as banners with their lessons as big round nodes in each
 * world's colour (a boss lesson gets its boss's portrait). The next lesson
 * pulses; finished ones turn green with a tick. Tapping a node opens the
 * lesson. The other half of the map screen's two-way switch (ModeSwitch) —
 * "Tryb zabawy" stays the world map. */
export function PlanPath() {
  const insets = useSafeAreaInsets();
  const { plan, isLoading } = usePlan();
  const { progress } = useProgress();
  const { state: gamification } = useGamification();
  const [daysShown, setDaysShown] = useState(DAYS_SHOWN_STEP);
  const todayISO = todayISODate();

  const view = useMemo(
    () =>
      buildPathView({
        pathLessonIds: plan.pathLessonIds,
        completedLessonIds: progress.completedLessonIds,
        todayLessonIds: plan.today?.dateISO === todayISO ? plan.today.lessonIds : [],
        minutesPerDay: plan.minutesPerDay,
        todayISO,
        minutesOf: (lessonId) => getLessonInfo(lessonId)?.minutes ?? 8,
      }),
    [plan.pathLessonIds, plan.today, plan.minutesPerDay, progress.completedLessonIds, todayISO]
  );
  const status = getTodayStatus(plan.today, todayISO, progress.completedLessonIds, plan.reviewLog);
  const lessonsDoneToday = status.lessons.length > 0 && status.lessons.every((item) => item.done);

  const visibleDays = view.days.slice(0, daysShown);
  const trail = useMemo(() => {
    const items: TrailItem[] = [];
    let y = TOP_PADDING;
    let index = 0;
    let currentAssigned = false;
    for (const day of visibleDays) {
      items.push({
        kind: "banner",
        y,
        title: day.isToday ? "Dziś" : capitalize(WEEKDAYS[weekdayOf(day.dateISO)]),
        subtitle: `${formatShortPolishDate(day.dateISO)} · ok. ${day.minutes} min`,
        isToday: day.isToday,
      });
      y += DAY_BANNER_HEIGHT;
      for (const lessonId of day.lessonIds) {
        const info = getLessonInfo(lessonId);
        const world = info ? getWorldById(info.worldId) : undefined;
        const lesson = info ? getWorldContent(info.worldId)?.lessons[info.lessonIndex] : undefined;
        const isBoss = info?.isBoss === true;
        const size = isBoss ? BOSS_NODE_SIZE : NODE_SIZE;
        const done = progress.completedLessonIds.has(lessonId);
        const isCurrent = !done && !currentAssigned;
        if (isCurrent) currentAssigned = true;
        items.push({
          kind: "lesson",
          lessonId,
          cx: TRAIL_WIDTH / 2 + AMPLITUDE * Math.sin(index * 1.15),
          cy: y + size / 2 + 8,
          done,
          highlight: day.isToday,
          isCurrent,
          isBoss,
          bossName: lesson?.bossName,
          accent: world?.accentColor ?? theme.colors.primary,
          iconName: iconFor(world?.mapIconId),
          side: Math.sin(index * 1.15) >= 0 ? "left" : "right",
        });
        y += NODE_SPACING_Y;
        index++;
      }
    }
    return { items, height: y + 90 };
  }, [visibleDays, progress.completedLessonIds]);

  if (isLoading) return null;

  const contentStyle = { paddingTop: insets.top + 176, paddingBottom: insets.bottom + 40, alignItems: "center" as const, gap: theme.spacing(2) };

  if (plan.mode === "unset") {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={contentStyle} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { width: TRAIL_WIDTH + 24 }]}>
          <SoltekMascot size="md" expression="zachecajacy" message="W trybie nauki znajdziesz „Twój plan”: własną ścieżkę lekcji, dzień po dniu, z powtórkami. Zrobimy najpierw krótki test, żeby ją dopasować?" />
          <DarkButton label="Zrób test poziomujący" onPress={() => router.push("/(main)/placement")} />
        </View>
      </ScrollView>
    );
  }

  const percent = view.totalCount > 0 ? Math.round((view.doneCount / view.totalCount) * 100) : 0;
  const left = view.totalCount - view.doneCount;
  const lastDay = view.days.length > 0 ? view.days[view.days.length - 1].dateISO : null;
  const lessonNodes = trail.items.filter((item): item is TrailLesson => item.kind === "lesson");
  const banners = trail.items.filter((item): item is TrailBanner => item.kind === "banner");
  // Two or more days since the last activity: a warm welcome back, no guilt.
  const cameBackAfterBreak = view.doneCount > 0 && gamification.lastActiveDateISO !== null && daysBetween(gamification.lastActiveDateISO, todayISO) >= 2;
  const soltekLine = lessonsDoneToday
    ? { message: "Gratulacje! Dzisiejsze lekcje zrobione. Do jutra — albo zajrzyj do powtórek!", expression: "radosny" as const }
    : cameBackAfterBreak
      ? { message: "Miło Cię znowu widzieć! Nic się nie stało — plan czeka dokładnie tam, gdzie skończyłeś. Zaczynamy od najbliższej lekcji.", expression: "zachecajacy" as const }
      : view.doneCount === 0
      ? { message: "Zaczynamy Twój plan! Dotknij pulsującej lekcji, żeby wystartować.", expression: "zachecajacy" as const }
      : { message: `Idzie Ci świetnie! Zostało ${left} ${left === 1 ? "lekcja" : "lekcji"} do mety.`, expression: "radosny" as const };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={contentStyle} showsVerticalScrollIndicator={false}>
      {/* Hero: Soltek + progress ring + stats */}
      <View style={[styles.hero, { width: TRAIL_WIDTH + 24 }]}>
        <View style={styles.heroTop}>
          <ProgressRing percent={percent} />
          <View style={{ flex: 1, gap: 6 }}>
            <Text style={styles.heroTitle}>{plan.mode === "personal" ? "Twój plan · dopasowany testem" : "Twój plan · pełna ścieżka"}</Text>
            <View style={styles.chipsRow}>
              <StatChip icon="📘" text={`${view.doneCount}/${view.totalCount} lekcji`} />
              <StatChip icon="⏱" text={`${plan.minutesPerDay} min/dzień`} />
              <StatChip icon="🔥" text={`${gamification.streakDays} dni`} />
            </View>
            {lastDay && <GlyphText style={styles.muted}>🏁 Meta nowej nauki: ok. {formatShortPolishDate(lastDay)}</GlyphText>}
          </View>
        </View>
        <SoltekMascot size="sm" expression={soltekLine.expression} message={soltekLine.message} />
        <Pressable onPress={() => router.push("/(main)/plan")} accessibilityRole="button" hitSlop={8}>
          <Text style={styles.link}>Jak działa plan i harmonogram ›</Text>
        </Pressable>
      </View>

      {lessonsDoneToday && (
        <View style={[styles.congrats, { width: TRAIL_WIDTH + 24 }]}>
          <GlyphText style={styles.congratsText}>🎉 Gratulacje! Wykonałeś wszystkie zaplanowane lekcje na dziś.</GlyphText>
        </View>
      )}

      {status.reviews.length > 0 && (
        <View style={[styles.reviewCard, { width: TRAIL_WIDTH + 24 }]}>
          <View style={styles.reviewHead}>
            <GlyphText style={{ fontSize: 22 }}>🔁</GlyphText>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Powtórki na dziś</Text>
              <Text style={styles.muted}>Krótkie przypomnienie, żeby wiedza została na długo</Text>
            </View>
          </View>
          {status.reviews.map((item) => (
            <Pressable key={item.lessonId} disabled={item.done} onPress={() => openReview(item.lessonId)} accessibilityRole="button" style={styles.reviewRow}>
              <GlyphText style={{ fontSize: 16 }}>{item.done ? "✅" : "▶"}</GlyphText>
              <Text style={[styles.reviewLabel, item.done && styles.done]}>{describeLesson(item.lessonId)}</Text>
              {!item.done && <Text style={styles.reviewGo}>Powtórz</Text>}
            </Pressable>
          ))}
        </View>
      )}

      {view.days.length === 0 ? (
        <View style={[styles.card, { width: TRAIL_WIDTH + 24, alignItems: "center" }]}>
          <GlyphText style={{ fontSize: 44 }}>🏆</GlyphText>
          <Text style={styles.cardTitle}>Cała ścieżka przerobiona!</Text>
          <Text style={[styles.muted, { textAlign: "center" }]}>Zostają powtórki w rosnących odstępach i wyzwanie dnia — wiedza ma zostać na długo.</Text>
        </View>
      ) : (
        <View style={{ width: TRAIL_WIDTH, height: trail.height }}>
          <Svg width={TRAIL_WIDTH} height={trail.height} style={StyleSheet.absoluteFill}>
            {lessonNodes.map((node, index) => {
              if (index === 0) return null;
              const prev = lessonNodes[index - 1];
              const midY = (prev.cy + node.cy) / 2;
              const d = `M ${prev.cx} ${prev.cy} C ${prev.cx} ${midY}, ${node.cx} ${midY}, ${node.cx} ${node.cy}`;
              const reached = prev.done && node.done;
              return (
                <Path key={node.lessonId} d={d} stroke={reached ? theme.colors.success : node.accent} strokeWidth={reached ? 7 : 5} strokeOpacity={reached ? 0.55 : 0.28} strokeDasharray={reached ? undefined : "2 12"} fill="none" strokeLinecap="round" />
              );
            })}
            {lessonNodes.length > 0 && <Circle cx={lessonNodes[lessonNodes.length - 1].cx} cy={lessonNodes[lessonNodes.length - 1].cy + NODE_SPACING_Y * 0.6} r={4} fill={theme.colors.border} />}
          </Svg>

          {banners.map((banner) => (
            <View key={banner.y} style={[styles.banner, { top: banner.y }, banner.isToday && styles.bannerToday]}>
              <Text style={[styles.bannerTitle, banner.isToday && { color: "#FFFFFF" }]}>{banner.title}</Text>
              <Text style={[styles.bannerSub, banner.isToday && { color: "#FFFFFF" }]}>{banner.subtitle}</Text>
            </View>
          ))}

          {lessonNodes.map((node) => (
            <TrailNode key={node.lessonId} node={node} />
          ))}

          <View style={[styles.finish, { top: trail.height - 70 }]}>
            <GlyphText style={{ fontSize: 30 }}>🏁</GlyphText>
          </View>
        </View>
      )}

      {view.days.length > daysShown && <DarkButton label={`Pokaż kolejne dni (${view.days.length - daysShown} więcej)`} onPress={() => setDaysShown((n) => n + DAYS_SHOWN_STEP)} variant="secondary" />}
    </ScrollView>
  );
}

function TrailNode({ node }: { node: TrailLesson }) {
  const info = getLessonInfo(node.lessonId);
  const size = node.isBoss ? BOSS_NODE_SIZE : NODE_SIZE;
  const BossPortrait = node.isBoss ? resolveBossPortrait(node.bossName) : null;
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!node.isCurrent) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [node.isCurrent, pulse]);

  const fill = node.done ? theme.colors.success : node.accent;
  const labelSide = node.side;
  const label = describeLesson(node.lessonId);
  return (
    <View style={{ position: "absolute", left: node.cx - size / 2, top: node.cy - size / 2, width: size, height: size }}>
      {node.isCurrent && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.pulseRing,
            { borderColor: node.accent, width: size + 22, height: size + 22, borderRadius: (size + 22) / 2, left: -11, top: -11, opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.9, 0.15] }), transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1.12] }) }] },
          ]}
        />
      )}
      <Pressable
        onPress={() => openLesson(node.lessonId)}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={({ pressed }) => [
          styles.node,
          { width: size, height: size, borderRadius: size / 2, backgroundColor: fill, opacity: node.done || node.highlight || node.isCurrent ? 1 : 0.72, transform: [{ scale: pressed ? 0.96 : 1 }], borderColor: node.isCurrent ? theme.colors.ink : "#FFFFFF" },
        ]}
      >
        {node.done ? (
          <GlyphText style={styles.nodeCheck}>✓</GlyphText>
        ) : BossPortrait ? (
          <BossPortrait size={size - 14} />
        ) : node.iconName ? (
          <AppIcon name={node.iconName} size={34} />
        ) : null}
        {node.isBoss && <GlyphText style={styles.crown}>👑</GlyphText>}
      </Pressable>
      {node.isCurrent && (
        <View style={styles.startBubble}>
          <Text style={styles.startBubbleText}>START</Text>
        </View>
      )}
      <View style={[styles.nodeLabel, labelSide === "left" ? { right: size + 10, alignItems: "flex-end" } : { left: size + 10, alignItems: "flex-start" }]}>
        <Text style={[styles.nodeLabelTitle, node.done && styles.done]} numberOfLines={2}>
          {label}
        </Text>
        <Text style={styles.nodeLabelSub}>
          {node.done ? "ukończona ✓" : node.isBoss ? "boss · " + `ok. ${info?.minutes ?? 8} min` : `ok. ${info?.minutes ?? 8} min`}
        </Text>
      </View>
    </View>
  );
}

function ProgressRing({ percent }: { percent: number }) {
  const size = 78;
  const stroke = 9;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={theme.colors.surfaceMuted} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={theme.colors.primary}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${(percent / 100) * circumference} ${circumference}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <Text style={{ fontSize: 17, fontWeight: "800", color: theme.colors.ink }}>{percent}%</Text>
    </View>
  );
}

function StatChip({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.chip}>
      <GlyphText style={styles.chipText}>{`${icon} ${text}`}</GlyphText>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  card: {
    backgroundColor: theme.colors.surface,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing(2),
    gap: theme.spacing(1.25),
  },
  hero: {
    backgroundColor: theme.colors.surface,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: theme.spacing(2),
    gap: theme.spacing(1.5),
  },
  heroTop: { flexDirection: "row", alignItems: "center", gap: 14 },
  heroTitle: { fontSize: 14, fontWeight: "800", color: theme.colors.ink },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: { backgroundColor: theme.colors.accentSoft, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  chipText: { fontSize: 11.5, fontWeight: "800", color: theme.colors.ink },
  cardTitle: { fontSize: 13.5, fontWeight: "800", color: theme.colors.ink },
  link: { fontSize: 12.5, fontWeight: "800", color: theme.colors.primary, textAlign: "center" },
  muted: { fontSize: 12, color: theme.colors.muted },
  congrats: {
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.success,
    borderRadius: theme.radius.md,
    padding: theme.spacing(1.5),
  },
  congratsText: { color: theme.colors.success, fontWeight: "800", fontSize: 14, textAlign: "center" },
  reviewCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing(1.75),
    gap: theme.spacing(1),
  },
  reviewHead: { flexDirection: "row", alignItems: "center", gap: 10 },
  reviewRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 4 },
  reviewLabel: { flex: 1, fontSize: 13, fontWeight: "700", color: theme.colors.ink },
  reviewGo: { fontSize: 12.5, fontWeight: "800", color: theme.colors.primary },
  done: { textDecorationLine: "line-through", color: theme.colors.muted },
  banner: {
    position: "absolute",
    left: TRAIL_WIDTH / 2 - 92,
    width: 184,
    height: DAY_BANNER_BOX,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
  },
  bannerToday: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  bannerTitle: { fontSize: 13, fontWeight: "800", color: theme.colors.ink },
  bannerSub: { fontSize: 10.5, color: theme.colors.muted },
  node: { borderWidth: 4, alignItems: "center", justifyContent: "center" },
  nodeCheck: { color: "#FFFFFF", fontSize: 34, fontWeight: "800" },
  crown: { position: "absolute", top: -14, fontSize: 20 },
  pulseRing: { position: "absolute", borderWidth: 4 },
  startBubble: {
    position: "absolute",
    top: -22,
    alignSelf: "center",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  startBubbleText: {
    backgroundColor: theme.colors.ink,
    color: "#FFFFFF",
    fontSize: 10.5,
    fontWeight: "800",
    letterSpacing: 0.6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: "hidden",
  },
  nodeLabel: { position: "absolute", top: 8, width: 118 },
  nodeLabelTitle: { fontSize: 12.5, fontWeight: "800", color: theme.colors.ink },
  nodeLabelSub: { fontSize: 11, color: theme.colors.muted },
  finish: { position: "absolute", left: TRAIL_WIDTH / 2 - 20, width: 40, alignItems: "center" },
});
