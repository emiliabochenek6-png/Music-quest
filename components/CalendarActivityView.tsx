import { useState } from "react";
import { Pressable, ScrollView, Text, View, StyleSheet } from "react-native";
import { BadgesCarousel } from "@/components/BadgesCarousel";
import { AppIcon } from "@/components/icons/AppIcon";
import { SoltekMascot } from "@/components/SoltekMascot";
import { useGamification } from "@/context/GamificationContext";
import { todayISODate } from "@/lib/gamification/activity";
import { calendarSoltekComment } from "@/lib/gamification/soltekComments";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

const WEEKDAY_LABELS = ["pon", "wt", "śr", "czw", "pt", "sob", "nd"];

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** One month's worth of "YYYY-MM-DD" cells for a Monday-first 7-column
 * grid — `null` for the leading blanks before day 1 actually falls on
 * its own weekday. */
function buildMonthCells(year: number, month0: number): (string | null)[] {
  const daysInMonth = new Date(year, month0 + 1, 0).getDate();
  // JS getDay(): 0=Sunday..6=Saturday — shifted so Monday=0..Sunday=6,
  // matching WEEKDAY_LABELS' own Polish week-starts-Monday order.
  const firstWeekday = (new Date(year, month0, 1).getDay() + 6) % 7;
  const cells: (string | null)[] = new Array(firstWeekday).fill(null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(`${year}-${pad2(month0 + 1)}-${pad2(day)}`);
  }
  return cells;
}

/** The activity calendar's own content — a streak hero, a small stat-tile
 * row, and a month grid, each its own card (matching DailyMissionsCard/
 * the paywall's plan cards — flat surface, theme.borderWidth border, no
 * shadow) rather than the plain unbordered rows this used to be laid out
 * with. Purely presentational/read-only — tapping a day doesn't drill
 * into anything further, the point is the at-a-glance pattern of
 * activity, matching what the user actually asked for ("ile czasu
 * spędziło się i co się zrobiło"). */
export function CalendarActivityView() {
  const { state } = useGamification();
  const [monthOffset, setMonthOffset] = useState(0);

  const today = new Date();
  const viewedYear = today.getFullYear();
  const viewedMonth0 = today.getMonth() + monthOffset;
  const viewedDate = new Date(viewedYear, viewedMonth0, 1);
  const cells = buildMonthCells(viewedDate.getFullYear(), viewedDate.getMonth());
  const monthLabel = viewedDate.toLocaleDateString("pl-PL", { month: "long", year: "numeric" });
  const todayISO = todayISODate();

  let minutesThisMonth = 0;
  let lessonsThisMonth = 0;
  let activeDaysThisMonth = 0;
  for (const iso of cells) {
    if (!iso) continue;
    const day = state.activityLog[iso];
    if (!day) continue;
    minutesThisMonth += day.minutesSpent;
    lessonsThisMonth += day.lessonIdsCompleted.length;
    activeDaysThisMonth += 1;
  }

  return (
    <ScrollView contentContainerStyle={{ gap: 16, paddingBottom: 24 }}>
      <View style={styles.streakCard}>
        <AppIcon name="hud_seria_ogien" size={34} />
        <View style={{ flex: 1 }}>
          <Text style={styles.streakValue}>
            {state.streakDays} {state.streakDays === 1 ? "dzień" : "dni"}
          </Text>
          <Text style={styles.streakLabel}>passy z rzędu</Text>
        </View>
      </View>

      <SoltekMascot size="sm" expression={state.streakDays >= 1 ? "radosny" : "zachecajacy"} message={calendarSoltekComment(state.streakDays, activeDaysThisMonth)} />

      <View style={styles.statsRow}>
        <StatTile icon="⏱" value={`${minutesThisMonth}`} unit="min" label="w tym miesiącu" />
        <StatTile icon="✅" value={String(lessonsThisMonth)} label="lekcji" />
        <StatTile icon="📅" value={String(activeDaysThisMonth)} label="aktywnych dni" />
      </View>

      <View style={styles.calendarCard}>
        <BadgesCarousel />
      </View>

      <View style={styles.calendarCard}>
        <View style={styles.monthNav}>
          <Pressable onPress={() => setMonthOffset((m) => m - 1)} accessibilityRole="button" accessibilityLabel="Poprzedni miesiąc" hitSlop={10} style={styles.navButton}>
            <Text style={styles.navArrow}>‹</Text>
          </Pressable>
          <Text style={styles.monthLabel}>{monthLabel}</Text>
          <Pressable
            onPress={() => setMonthOffset((m) => Math.min(0, m + 1))}
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
            const active = Boolean(state.activityLog[iso]);
            const isToday = iso === todayISO;
            return (
              <View key={iso} style={styles.cell}>
                <View style={[styles.dayDot, active && styles.dayDotActive, isToday && styles.dayDotToday]}>
                  <Text style={[styles.dayNumber, active && styles.dayNumberActive, isToday && !active && styles.dayNumberToday]}>
                    {Number(iso.slice(-2))}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

function StatTile({ icon, value, unit, label }: { icon: string; value: string; unit?: string; label: string }) {
  return (
    <View style={styles.statTile}>
      <Text style={styles.statIcon}>{icon}</Text>
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
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: theme.colors.accentSoft,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    padding: theme.spacing(2),
  },
  streakValue: {
    fontSize: theme.fontSize.heading,
    fontWeight: "800",
    color: theme.colors.ink,
  },
  streakLabel: {
    fontSize: 12.5,
    fontWeight: "600",
    color: theme.colors.muted,
    marginTop: 1,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statTile: {
    flex: 1,
    alignItems: "center",
    gap: 2,
    backgroundColor: theme.colors.surface,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing(1.5),
    paddingHorizontal: 6,
  },
  statIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 17,
    fontWeight: "800",
    color: theme.colors.ink,
  },
  statUnit: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.muted,
  },
  statLabel: {
    fontSize: 10.5,
    fontWeight: "600",
    color: theme.colors.muted,
    textAlign: "center",
  },
  calendarCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing(2),
    gap: 6,
  },
  monthNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  navArrow: {
    fontSize: 20,
    color: theme.colors.ink,
    lineHeight: 22,
  },
  navArrowDisabled: {
    opacity: 0.25,
  },
  monthLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: theme.colors.ink,
    textTransform: "capitalize",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  weekdayLabel: {
    width: CELL_WIDTH,
    textAlign: "center",
    fontSize: 11,
    fontWeight: "700",
    color: theme.colors.muted,
    marginBottom: 6,
  },
  cell: {
    width: CELL_WIDTH,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dayDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  dayDotActive: {
    backgroundColor: theme.colors.primary,
  },
  dayDotToday: {
    borderWidth: 2,
    borderColor: theme.colors.accent,
  },
  dayNumber: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.muted,
  },
  dayNumberActive: {
    color: "#fff",
    fontWeight: "800",
  },
  dayNumberToday: {
    color: theme.colors.accent,
    fontWeight: "800",
  },
});
