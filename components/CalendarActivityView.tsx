import { useState } from "react";
import { Pressable, ScrollView, Text, View, StyleSheet } from "react-native";
import { useGamification } from "@/context/GamificationContext";
import { todayISODate } from "@/lib/gamification/activity";

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

/** The side menu's own calendar/summary panel — a plain month grid (no
 * date-picker library exists in this app to reuse, see the gamification
 * plan's own research note) marking every day GamificationContext's own
 * `activityLog` has an entry for, plus a running total for whichever
 * month is currently shown. Purely presentational/read-only — tapping a
 * day doesn't drill into anything further yet, the point is the
 * at-a-glance pattern of activity, matching what the user actually
 * asked for ("ile czasu spędziło się i co się zrobiło"). */
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
      <View style={styles.monthNav}>
        <Pressable onPress={() => setMonthOffset((m) => m - 1)} accessibilityRole="button" accessibilityLabel="Poprzedni miesiąc" hitSlop={10}>
          <Text style={styles.navArrow}>‹</Text>
        </Pressable>
        <Text style={styles.monthLabel}>{monthLabel}</Text>
        <Pressable
          onPress={() => setMonthOffset((m) => Math.min(0, m + 1))}
          disabled={monthOffset >= 0}
          accessibilityRole="button"
          accessibilityLabel="Następny miesiąc"
          hitSlop={10}
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
                <Text style={[styles.dayNumber, active && styles.dayNumberActive]}>{Number(iso.slice(-2))}</Text>
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.summary}>
        <SummaryRow icon="🔥" label="Passa" value={`${state.streakDays} ${state.streakDays === 1 ? "dzień" : "dni"}`} />
        <SummaryRow icon="⏱" label="Czas w tym miesiącu" value={`${minutesThisMonth} min`} />
        <SummaryRow icon="✅" label="Ukończone lekcje" value={String(lessonsThisMonth)} />
        <SummaryRow icon="📅" label="Aktywne dni" value={String(activeDaysThisMonth)} />
      </View>
    </ScrollView>
  );
}

function SummaryRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryIcon}>{icon}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const CELL_WIDTH = "14.28%" as const;

const styles = StyleSheet.create({
  monthNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navArrow: {
    fontSize: 22,
    color: "#e9e4ff",
    paddingHorizontal: 8,
  },
  navArrowDisabled: {
    opacity: 0.25,
  },
  monthLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: "#e9e4ff",
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
    color: "rgba(233,228,255,0.5)",
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
    backgroundColor: "#7c3aed",
  },
  dayDotToday: {
    borderWidth: 1.5,
    borderColor: "#e9e4ff",
  },
  dayNumber: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(233,228,255,0.6)",
  },
  dayNumberActive: {
    color: "#fff",
    fontWeight: "800",
  },
  summary: {
    gap: 8,
    marginTop: 4,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  summaryIcon: {
    fontSize: 15,
  },
  summaryLabel: {
    flex: 1,
    fontSize: 13,
    color: "rgba(233,228,255,0.7)",
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: "800",
    color: "#e9e4ff",
  },
});
