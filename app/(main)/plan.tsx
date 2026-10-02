import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View, StyleSheet } from "react-native";
import { router } from "expo-router";
import { DarkButton } from "@/components/exercises/DarkButton";
import { PlanTodayCard, describeLesson } from "@/components/plan/PlanTodayCard";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { usePlan } from "@/context/PlanContext";
import { useProgress } from "@/context/ProgressContext";
import { WORLDS } from "@/data/worlds";
import { todayISODate } from "@/lib/gamification/activity";
import { t } from "@/lib/i18n/translate";
import type { TranslationKey } from "@/lib/i18n/translate";
import { addDays, formatShortPolishDate, weekdayOf } from "@/lib/plan/dates";
import { LEVEL_LABEL, MIN_PLAN_WEEKS, PACE_OPTIONS, STUDY_DAYS_PER_WEEK } from "@/lib/plan/labels";
import { getLessonInfo } from "@/lib/plan/lessonIndex";
import { buildSchedule, groupByWeek } from "@/lib/plan/schedule";
import { REVIEW_INTERVAL_DAYS } from "@/lib/plan/spacedRepetition";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

const WEEKDAYS = ["nd", "pn", "wt", "śr", "cz", "pt", "sb"];

/** The study plan screen: where the player stands on their path, today's
 * tasks, how the plan works (phases and spaced repetition), and the
 * calendar of upcoming weeks. */
export default function PlanScreen() {
  const { plan, setMinutesPerDay, chooseOriginal } = usePlan();
  const { progress } = useProgress();
  const todayISO = todayISODate();
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set([1]));
  const [showAllWeeks, setShowAllWeeks] = useState(false);

  const model = useMemo(() => {
    const total = plan.pathLessonIds.length;
    const done = plan.pathLessonIds.filter((id) => progress.completedLessonIds.has(id)).length;
    const remaining = plan.pathLessonIds
      .filter((id) => !progress.completedLessonIds.has(id))
      .map((lessonId) => ({ lessonId, minutes: getLessonInfo(lessonId)?.minutes ?? 8 }));
    const days = buildSchedule(remaining, plan.minutesPerDay, todayISO);
    const weeks = groupByWeek(days, todayISO);
    const lastLearningDay = days.length > 0 ? days[days.length - 1].dateISO : todayISO;
    const horizonISO = addDays(plan.startISO ?? todayISO, MIN_PLAN_WEEKS * 7);
    return { total, done, weeks, lastLearningDay, horizonISO, remainingCount: remaining.length };
  }, [plan.pathLessonIds, plan.minutesPerDay, plan.startISO, progress.completedLessonIds, todayISO]);

  function toggleWeek(number: number) {
    setExpandedWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(number)) next.delete(number);
      else next.add(number);
      return next;
    });
  }

  const visibleWeeks = showAllWeeks ? model.weeks : model.weeks.slice(0, 4);
  const percent = model.total > 0 ? Math.round((model.done / model.total) * 100) : 0;
  const consolidationFrom = addDays(model.lastLearningDay, 1);
  const hasConsolidation = model.lastLearningDay < model.horizonISO;

  return (
    <View style={styles.root}>
      <ScreenHeader title="Tryb nauki · Twój plan" onBack={() => (router.canGoBack() ? router.back() : router.replace("/(main)/map"))} />
      <ScrollView contentContainerStyle={styles.content}>
        {plan.mode === "unset" ? (
          <PlanTodayCard showFullPlanLink={false} />
        ) : (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{plan.mode === "personal" ? "🧭 Ścieżka dopasowana testem" : "▶ Pełna ścieżka od początku"}</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${percent}%` }]} />
              </View>
              <Text style={styles.body}>
                Zrobione: <Text style={styles.strong}>{model.done} z {model.total} lekcji</Text> ({percent}%).{" "}
                {model.remainingCount > 0
                  ? `Przy ${plan.minutesPerDay} min dziennie nową naukę skończysz ok. ${formatShortPolishDate(model.lastLearningDay)}.`
                  : "Cała ścieżka przerobiona — zostają powtórki i wyzwania. 🎉"}
              </Text>
              <Text style={styles.muted}>Tempo (minut dziennie):</Text>
              <View style={styles.paceRow}>
                {PACE_OPTIONS.map((minutes) => (
                  <DarkButton key={minutes} label={`${minutes}`} onPress={() => setMinutesPerDay(minutes)} variant={minutes === plan.minutesPerDay ? "primary" : "secondary"} />
                ))}
              </View>
            </View>

            <PlanTodayCard showFullPlanLink={false} />

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Jak działa Twój plan</Text>
              <Step n="🎮" title="Tryb zabawy" text="Gra: mapa krain, lekcje w dowolnej kolejności i walki z bossami. Postępy z obu trybów liczą się razem." />
              <Step n="📚" title="Tryb nauki (Twój plan)" text="Ścieżka lekcji ułożona dla Ciebie, dzień po dniu, z powtórkami. Przełączasz tryby na mapie, u góry." />
              <Step n="1" title="Codziennie nowa nauka" text={`Z ścieżki bierzemy następne lekcje, tyle, ile mieści się w ${plan.minutesPerDay} minutach. Pracujesz 6 dni w tygodniu, niedziela to dzień odpoczynku (tylko powtórki).`} />
              <Step n="2" title="Powtórki w odstępach" text={`Po każdej ukończonej lekcji wracamy do niej po ${REVIEW_INTERVAL_DAYS.join(", ")} dniach — kolejny odstęp dopiero po dobrej powtórce. Dziennie najwyżej 3 krótkie powtórki (5 pytań).`} />
              <Step n="3" title="Misje dnia" text="W zakładce Misje codziennie dostajesz: lekcje z planu, powtórki, wyzwanie dnia i ćwiczenie przez 10 minut." />
              <Step n="4" title="Utrwalanie" text={`Gdy ścieżka się skończy, plan trwa dalej do ok. ${MIN_PLAN_WEEKS}. tygodnia: same powtórki i wyzwania, żeby wszystko zostało w pamięci.`} />
            </View>

            {plan.mode === "personal" && plan.levels && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Twój wynik z testu</Text>
                <View style={styles.chipsWrap}>
                  {WORLDS.map((world) => (
                    <View key={world.id} style={styles.levelChip}>
                      <Text style={styles.levelChipText}>
                        {t(world.nameKey as TranslationKey)}: {LEVEL_LABEL[plan.levels![world.id] ?? 0]}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Harmonogram</Text>
              {model.weeks.length === 0 && <Text style={styles.muted}>Nic do zaplanowania — cała ścieżka ukończona.</Text>}
              {visibleWeeks.map((week) => {
                const open = expandedWeeks.has(week.number);
                const rangeEnd = addDays(week.startISO, 6);
                return (
                  <View key={week.number} style={styles.weekBlock}>
                    <Pressable onPress={() => toggleWeek(week.number)} accessibilityRole="button" style={styles.weekHeader}>
                      <Text style={styles.weekTitle}>
                        Tydzień {week.number} · {formatShortPolishDate(week.startISO)} – {formatShortPolishDate(rangeEnd)}
                      </Text>
                      <Text style={styles.muted}>
                        {week.lessonCount} lekcji · ok. {week.minutes} min {open ? "▲" : "▼"}
                      </Text>
                    </Pressable>
                    {open &&
                      week.days.map((day) => (
                        <View key={day.dateISO} style={styles.dayRow}>
                          <Text style={styles.dayLabel}>
                            {WEEKDAYS[weekdayOf(day.dateISO)]} {formatShortPolishDate(day.dateISO)}
                          </Text>
                          <View style={{ flex: 1 }}>
                            {day.lessonIds.map((lessonId) => (
                              <Text key={lessonId} style={styles.dayLesson}>
                                {describeLesson(lessonId)}
                              </Text>
                            ))}
                          </View>
                        </View>
                      ))}
                  </View>
                );
              })}
              {model.weeks.length > 4 && (
                <Pressable onPress={() => setShowAllWeeks((v) => !v)} accessibilityRole="button">
                  <Text style={styles.link}>{showAllWeeks ? "Pokaż mniej" : `Pokaż wszystkie tygodnie (${model.weeks.length})`}</Text>
                </Pressable>
              )}
              {hasConsolidation && (
                <View style={styles.consolidation}>
                  <Text style={styles.weekTitle}>Utrwalanie · od {formatShortPolishDate(consolidationFrom)} do {formatShortPolishDate(model.horizonISO)}</Text>
                  <Text style={styles.muted}>Powtórki w rosnących odstępach i wyzwanie dnia — bez nowych lekcji.</Text>
                </View>
              )}
            </View>
          </>
        )}

        <View style={{ gap: theme.spacing(1.25) }}>
          <DarkButton label={plan.mode === "unset" ? "🧭 Zrób test poziomujący" : "🧭 Zrób test poziomujący ponownie"} onPress={() => router.push("/(main)/placement")} variant={plan.mode === "unset" ? "primary" : "secondary"} />
          {plan.mode === "personal" && <DarkButton label="▶ Wróć do pełnej ścieżki od początku" onPress={() => chooseOriginal()} variant="secondary" />}
          <DarkButton label="Wróć na mapę" onPress={() => router.replace("/(main)/map")} variant="secondary" />
        </View>
        <Text style={styles.footnote}>Dni nauki w tygodniu: {STUDY_DAYS_PER_WEEK}. Plan zapisuje się na tym urządzeniu.</Text>
      </ScrollView>
    </View>
  );
}

function Step({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <View style={{ flexDirection: "row", gap: 10 }}>
      <View style={styles.stepBadge}>
        <Text style={styles.stepBadgeText}>{n}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.weekTitle}>{title}</Text>
        <Text style={styles.muted}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.cream },
  content: { padding: 16, gap: theme.spacing(2), paddingBottom: 40 },
  card: {
    backgroundColor: theme.colors.surface,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing(2),
    gap: theme.spacing(1.25),
  },
  cardTitle: { fontSize: 14, fontWeight: "800", color: theme.colors.ink },
  body: { fontSize: theme.fontSize.body * 0.92, color: theme.colors.muted, lineHeight: 21 },
  strong: { color: theme.colors.ink, fontWeight: "800" },
  muted: { fontSize: 12.5, color: theme.colors.muted, lineHeight: 18 },
  link: { fontSize: 13, fontWeight: "800", color: theme.colors.primary, textAlign: "center" },
  footnote: { fontSize: 11.5, color: theme.colors.muted, textAlign: "center" },
  barTrack: { height: 10, borderRadius: 5, backgroundColor: theme.colors.surfaceMuted, overflow: "hidden" },
  barFill: { height: "100%", backgroundColor: theme.colors.primary, borderRadius: 5 },
  paceRow: { flexDirection: "row", gap: theme.spacing(1) },
  stepBadge: { width: 24, height: 24, borderRadius: 12, backgroundColor: theme.colors.primary, alignItems: "center", justifyContent: "center", marginTop: 2 },
  stepBadgeText: { color: "#FFFFFF", fontWeight: "800", fontSize: 12 },
  chipsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  levelChip: { backgroundColor: theme.colors.surfaceMuted, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 },
  levelChipText: { fontSize: 11.5, color: theme.colors.ink, fontWeight: "600" },
  weekBlock: { borderTopWidth: 1, borderTopColor: theme.colors.border, paddingTop: theme.spacing(1), gap: 4 },
  weekHeader: { gap: 2 },
  weekTitle: { fontSize: 13, fontWeight: "800", color: theme.colors.ink },
  dayRow: { flexDirection: "row", gap: 10, paddingVertical: 2 },
  dayLabel: { width: 74, fontSize: 12, fontWeight: "700", color: theme.colors.primary },
  dayLesson: { fontSize: 12.5, color: theme.colors.ink },
  consolidation: { borderTopWidth: 1, borderTopColor: theme.colors.border, paddingTop: theme.spacing(1), gap: 2 },
});
