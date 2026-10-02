import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Pressable, ScrollView, Text, View, StyleSheet } from "react-native";
import { BadgesCarousel } from "@/components/BadgesCarousel";
import { AppIcon } from "@/components/icons/AppIcon";
import { SoltekMascot } from "@/components/SoltekMascot";
import { useGamification } from "@/context/GamificationContext";
import { todayISODate } from "@/lib/gamification/activity";
import { activityLevel, describeDay, weekDaysOf, weekMilestoneProgress } from "@/lib/gamification/calendarView";
import type { ActivityLevel } from "@/lib/gamification/calendarView";
import { NUTKI_REWARDS } from "@/lib/gamification/powerups";
import { calendarSoltekComment } from "@/lib/gamification/soltekComments";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { DayActivity } from "@/types/gamification";

const WEEKDAY_LABELS = ["pon", "wt", "śr", "czw", "pt", "sob", "nd"];

// Soltek's orange, from a light wash to a deep tone: the more you practised, the deeper the day.
const LEVEL_COLORS: Record<ActivityLevel, string> = { 0: "transparent", 1: "#FCDFAE", 2: "#F7B25A", 3: "#E8741A" };
const LEVEL_TEXT: Record<ActivityLevel, string> = { 0: theme.colors.muted, 1: "#7A4A12", 2: "#4A2C1D", 3: "#FFFFFF" };
const STREAK_BAR = "#FDEBCB";
const GOLD = "#FFC94A";

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** One month's worth of "YYYY-MM-DD" cells for a Monday-first 7-column
 * grid — `null` for the leading blanks before day 1 actually falls on
 * its own weekday. */
function buildMonthCells(year: number, month0: number): (string | null)[] {
  const daysInMonth = new Date(year, month0 + 1, 0).getDate();
  const firstWeekday = (new Date(year, month0, 1).getDay() + 6) % 7;
  const cells: (string | null)[] = new Array(firstWeekday).fill(null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(`${year}-${pad2(month0 + 1)}-${pad2(day)}`);
  }
  return cells;
}

/** The activity calendar: a glowing streak card with this week at a glance
 * and the road to the next weekly reward, three colourful stat tiles, the
 * badges, and a month where every practised day is coloured by how much was
 * done (a deeper orange = more), days in a row are joined by a ribbon, and a
 * tap on a day tells what happened that day. Read-only: nothing here changes
 * any progress. */
export function CalendarActivityView() {
  const { state } = useGamification();
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedISO, setSelectedISO] = useState<string | null>(null);

  const today = new Date();
  const viewedDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const cells = buildMonthCells(viewedDate.getFullYear(), viewedDate.getMonth());
  const monthLabel = viewedDate.toLocaleDateString("pl-PL", { month: "long", year: "numeric" });
  const todayISO = todayISODate();
  const log = state.activityLog;

  let minutesThisMonth = 0;
  let lessonsThisMonth = 0;
  let activeDaysThisMonth = 0;
  for (const iso of cells) {
    if (!iso) continue;
    const day = log[iso];
    if (!day) continue;
    minutesThisMonth += day.minutesSpent;
    lessonsThisMonth += day.lessonIdsCompleted.length;
    if (activityLevel(day) > 0) activeDaysThisMonth += 1;
  }

  const selectedDay = selectedISO ? describeDay(selectedISO, log[selectedISO]) : null;

  return (
    <ScrollView contentContainerStyle={{ gap: 16, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
      <StreakCard streakDays={state.streakDays} todayISO={todayISO} log={log} />

      <SoltekMascot size="sm" expression={state.streakDays >= 1 ? "radosny" : "zachecajacy"} message={calendarSoltekComment(state.streakDays, todayISO)} />

      <View style={styles.statsRow}>
        <StatTile icon="ui_zegar" tint="#E3EEFB" value={`${minutesThisMonth}`} unit="min" label="w tym miesiącu" />
        <StatTile icon="ui_ptaszek" tint="#E2F5E8" value={String(lessonsThisMonth)} label="lekcji" />
        <StatTile icon="nav_kalendarz" tint="#FDEBCB" value={String(activeDaysThisMonth)} label="aktywnych dni" />
      </View>

      <View style={styles.card}>
        <BadgesCarousel />
      </View>

      <View style={styles.card}>
        <View style={styles.monthNav}>
          <Pressable onPress={() => { setMonthOffset((m) => m - 1); setSelectedISO(null); }} accessibilityRole="button" accessibilityLabel="Poprzedni miesiąc" hitSlop={10} style={styles.navButton}>
            <Text style={styles.navArrow}>‹</Text>
          </Pressable>
          <Text style={styles.monthLabel}>{monthLabel}</Text>
          <Pressable
            onPress={() => { setMonthOffset((m) => Math.min(0, m + 1)); setSelectedISO(null); }}
            disabled={monthOffset >= 0}
            accessibilityRole="button"
            accessibilityLabel="Następny miesiąc"
            hitSlop={10}
            style={styles.navButton}
          >
            <Text style={[styles.navArrow, monthOffset >= 0 && styles.navArrowDisabled]}>›</Text>
          </Pressable>
        </View>

        <View style={styles.grid}>
          {WEEKDAY_LABELS.map((label) => (
            <Text key={label} style={styles.weekdayLabel}>
              {label}
            </Text>
          ))}
          {cells.map((iso, index) => {
            if (!iso) return <View key={`blank-${index}`} style={styles.cell} />;
            const day = log[iso];
            const level = activityLevel(day);
            const column = index % 7;
            const previousIso = column > 0 ? cells[index - 1] : null;
            const nextIso = column < 6 ? cells[index + 1] : null;
            const joinsLeft = level > 0 && previousIso != null && activityLevel(log[previousIso]) > 0;
            const joinsRight = level > 0 && nextIso != null && activityLevel(log[nextIso]) > 0;
            const isToday = iso === todayISO;
            const isFuture = iso > todayISO;
            const isSelected = iso === selectedISO;
            return (
              <Pressable
                key={iso}
                onPress={() => setSelectedISO(isSelected ? null : iso)}
                accessibilityRole="button"
                accessibilityLabel={describeDay(iso, day).title}
                style={styles.cell}
              >
                {joinsLeft && <View style={[styles.ribbon, { left: 0, right: "50%" }]} />}
                {joinsRight && <View style={[styles.ribbon, { left: "50%", right: 0 }]} />}
                <View
                  style={[
                    styles.dayDot,
                    { backgroundColor: LEVEL_COLORS[level] },
                    isToday && styles.dayDotToday,
                    isSelected && styles.dayDotSelected,
                    isFuture && { opacity: 0.45 },
                  ]}
                >
                  <Text style={[styles.dayNumber, { color: isToday && level === 0 ? theme.colors.accent : LEVEL_TEXT[level] }, level > 0 && { fontWeight: "800" }]}>
                    {Number(iso.slice(-2))}
                  </Text>
                </View>
                {day?.dailyChallengeCompleted && <View style={styles.challengeDot} />}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.legend}>
          <Text style={styles.legendText}>mniej</Text>
          {([1, 2, 3] as const).map((level) => (
            <View key={level} style={[styles.legendSwatch, { backgroundColor: LEVEL_COLORS[level] }]} />
          ))}
          <Text style={styles.legendText}>więcej</Text>
          <View style={styles.legendSpacer} />
          <View style={styles.challengeDotLegend} />
          <Text style={styles.legendText}>wyzwanie dnia</Text>
        </View>

        <View style={styles.selectedCard}>
          {selectedDay ? (
            <>
              <Text style={styles.selectedTitle}>{selectedDay.title}</Text>
              <Text style={styles.selectedLines}>{selectedDay.lines.join("  ·  ")}</Text>
            </>
          ) : (
            <Text style={styles.selectedHint}>Dotknij dnia, żeby zobaczyć, co w nim zrobiono.</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

/** The streak card: a flickering flame, the number of days, this week as seven
 * little rings, and a bar towards the next weekly reward. */
function StreakCard({ streakDays, todayISO, log }: { streakDays: number; todayISO: string; log: Record<string, DayActivity> }) {
  const flicker = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (streakDays <= 0) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(flicker, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(flicker, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [flicker, streakDays]);
  const flameScale = flicker.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] });
  const glowOpacity = flicker.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.65] });

  const week = weekDaysOf(todayISO);
  const progress = weekMilestoneProgress(streakDays);

  return (
    <View style={styles.streakCard}>
      <View style={styles.streakTop}>
        <View style={styles.flameWrap}>
          <Animated.View style={[styles.flameGlow, { opacity: glowOpacity }]} />
          <Animated.View style={{ transform: [{ scale: flameScale }] }}>
            <AppIcon name="hud_seria_ogien" size={60} />
          </Animated.View>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.streakValue}>
            {streakDays} {streakDays === 1 ? "dzień" : "dni"}
          </Text>
          <Text style={styles.streakLabel}>passy z rzędu</Text>
        </View>
      </View>

      <View style={styles.weekRow}>
        {week.map((iso, index) => {
          const done = activityLevel(log[iso]) > 0;
          const isToday = iso === todayISO;
          return (
            <View key={iso} style={styles.weekDay}>
              <Text style={styles.weekDayLabel}>{WEEKDAY_LABELS[index]}</Text>
              <View style={[styles.weekRing, done && styles.weekRingDone, isToday && !done && styles.weekRingToday]}>
                {done ? <AppIcon name="ui_ptaszek" size={20} /> : <Text style={[styles.weekNumber, isToday && { color: theme.colors.accent, fontWeight: "800" }]}>{Number(iso.slice(-2))}</Text>}
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.rewardRow}>
        <View style={styles.rewardTrack}>
          <View style={[styles.rewardFill, { width: `${(progress.daysDone / 7) * 100}%` }]} />
        </View>
        <View style={styles.rewardChip}>
          <AppIcon name="hud_nutki_waluta" size={16} />
          <Text style={styles.rewardChipText}>+{NUTKI_REWARDS.streakWeekMilestone}</Text>
        </View>
      </View>
      <Text style={styles.rewardText}>
        {progress.justReached
          ? "Pełny tydzień passy! Nagroda odebrana."
          : streakDays <= 0
            ? "Zrób dziś lekcję i zacznij nową passę!"
            : `Jeszcze ${progress.daysLeft} ${progress.daysLeft === 1 ? "dzień" : "dni"} do nagrody za tydzień passy`}
      </Text>
    </View>
  );
}

function StatTile({ icon, tint, value, unit, label }: { icon: "ui_zegar" | "ui_ptaszek" | "nav_kalendarz"; tint: string; value: string; unit?: string; label: string }) {
  return (
    <View style={[styles.statTile, { backgroundColor: tint }]}>
      <AppIcon name={icon} size={30} />
      <Text style={styles.statValue} numberOfLines={1}>
        {value}
        {unit && <Text style={styles.statUnit}> {unit}</Text>}
      </Text>
      <Text style={styles.statLabel} numberOfLines={2}>
        {label}
      </Text>
    </View>
  );
}

const CELL_WIDTH = "14.28%" as const;

const styles = StyleSheet.create({
  streakCard: {
    gap: 14,
    backgroundColor: "#FFE8C8",
    borderWidth: 2,
    borderColor: "#F4C98F",
    borderRadius: 24,
    padding: theme.spacing(2),
    shadowColor: "#C9531A",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  streakTop: { flexDirection: "row", alignItems: "center", gap: 14 },
  flameWrap: { width: 72, height: 72, alignItems: "center", justifyContent: "center" },
  flameGlow: { position: "absolute", width: 72, height: 72, borderRadius: 36, backgroundColor: GOLD },
  streakValue: { fontSize: 32, fontWeight: "800", color: theme.colors.ink },
  streakLabel: { fontSize: 13, fontWeight: "700", color: "#7A5638", marginTop: -2 },
  weekRow: { flexDirection: "row", justifyContent: "space-between" },
  weekDay: { alignItems: "center", gap: 4, flex: 1 },
  weekDayLabel: { fontSize: 11, fontWeight: "700", color: "#7A5638" },
  weekRing: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF6E8",
    borderWidth: 2,
    borderColor: "#F4C98F",
  },
  weekRingDone: { backgroundColor: "#4CC27A", borderColor: "#35A862" },
  weekRingToday: { borderColor: theme.colors.accent },
  weekNumber: { fontSize: 12, fontWeight: "700", color: "#7A5638" },
  rewardRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  rewardTrack: { flex: 1, height: 12, borderRadius: 6, backgroundColor: "#FFF6E8", overflow: "hidden", borderWidth: 1.5, borderColor: "#F4C98F" },
  rewardFill: { height: "100%", borderRadius: 6, backgroundColor: "#F28A1E" },
  rewardChip: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: "#FFF6E8" },
  rewardChipText: { fontSize: 13, fontWeight: "800", color: theme.colors.ink },
  rewardText: { fontSize: 12.5, fontWeight: "700", color: "#7A5638", marginTop: -6 },
  statsRow: { flexDirection: "row", gap: 10 },
  statTile: {
    flex: 1,
    alignItems: "center",
    gap: 3,
    borderRadius: 18,
    paddingVertical: theme.spacing(1.5),
    paddingHorizontal: 6,
  },
  statValue: { fontSize: 20, fontWeight: "800", color: theme.colors.ink },
  statUnit: { fontSize: 12, fontWeight: "700", color: theme.colors.muted },
  statLabel: { fontSize: 10.5, fontWeight: "700", color: "#6B5A4A", textAlign: "center" },
  card: {
    backgroundColor: theme.colors.surface,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    borderRadius: 22,
    padding: theme.spacing(2),
    gap: 6,
  },
  monthNav: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  navButton: { width: 34, height: 34, borderRadius: 17, backgroundColor: theme.colors.surfaceMuted, alignItems: "center", justifyContent: "center" },
  navArrow: { fontSize: 20, color: theme.colors.ink, lineHeight: 22 },
  navArrowDisabled: { opacity: 0.25 },
  monthLabel: { fontSize: 16, fontWeight: "800", color: theme.colors.ink, textTransform: "capitalize" },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  weekdayLabel: { width: CELL_WIDTH, textAlign: "center", fontSize: 11, fontWeight: "700", color: theme.colors.muted, marginBottom: 6 },
  cell: { width: CELL_WIDTH, aspectRatio: 1, alignItems: "center", justifyContent: "center" },
  ribbon: { position: "absolute", top: "20%", bottom: "20%", backgroundColor: STREAK_BAR },
  dayDot: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  dayDotToday: { borderWidth: 2.5, borderColor: theme.colors.accent },
  dayDotSelected: { borderWidth: 2.5, borderColor: theme.colors.ink },
  dayNumber: { fontSize: 12.5, fontWeight: "600" },
  challengeDot: { position: "absolute", top: "10%", right: "14%", width: 9, height: 9, borderRadius: 5, backgroundColor: GOLD, borderWidth: 1.5, borderColor: "#B8860B" },
  legend: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 },
  legendText: { fontSize: 11, fontWeight: "600", color: theme.colors.muted },
  legendSwatch: { width: 14, height: 14, borderRadius: 7 },
  legendSpacer: { flex: 1 },
  challengeDotLegend: { width: 9, height: 9, borderRadius: 5, backgroundColor: GOLD, borderWidth: 1.5, borderColor: "#B8860B" },
  selectedCard: { marginTop: 6, padding: 12, borderRadius: 14, backgroundColor: theme.colors.surfaceMuted, gap: 2, minHeight: 56, justifyContent: "center" },
  selectedTitle: { fontSize: 14, fontWeight: "800", color: theme.colors.ink },
  selectedLines: { fontSize: 13, fontWeight: "600", color: theme.colors.muted },
  selectedHint: { fontSize: 12.5, fontWeight: "600", color: theme.colors.muted },
});
