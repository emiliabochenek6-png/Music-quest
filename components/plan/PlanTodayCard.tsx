import { Pressable, Text, View, StyleSheet } from "react-native";
import { router } from "expo-router";
import { DarkButton } from "@/components/exercises/DarkButton";
import { useProgress } from "@/context/ProgressContext";
import { usePlan } from "@/context/PlanContext";
import { getWorldById } from "@/data/worlds";
import { todayISODate } from "@/lib/gamification/activity";
import { t } from "@/lib/i18n/translate";
import type { TranslationKey } from "@/lib/i18n/translate";
import { getLessonInfo } from "@/lib/plan/lessonIndex";
import { getTodayStatus } from "@/lib/plan/today";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

/** "Lekcja 3 · Wioska Nut" — a plan row's own label. */
export function describeLesson(lessonId: string): string {
  const info = getLessonInfo(lessonId);
  const world = info ? getWorldById(info.worldId) : undefined;
  if (!info || !world) return lessonId;
  return `${t(world.nameKey as TranslationKey)} · lekcja ${info.lessonIndex + 1}`;
}

export function openLesson(lessonId: string) {
  const info = getLessonInfo(lessonId);
  if (!info) return;
  router.push({ pathname: "/(main)/lesson/[lessonId]", params: { lessonId, worldId: info.worldId } });
}

export function openReview(lessonId: string) {
  const info = getLessonInfo(lessonId);
  if (!info) return;
  router.push({ pathname: "/(main)/review", params: { lessonId, worldId: info.worldId } });
}

/** "Plan na dziś" — today's new lessons from the study path plus the
 * spaced-repetition reviews that are due, each with a start button. Shown
 * on the Misje tab and at the top of the plan screen. Before the player
 * has picked a path it shows the two starting choices instead. */
export function PlanTodayCard({ showFullPlanLink = true }: { showFullPlanLink?: boolean }) {
  const { plan, isLoading } = usePlan();
  const { progress } = useProgress();
  if (isLoading) return null;
  const todayISO = todayISODate();

  if (plan.mode === "unset") {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>📚 Tryb nauki · Twój plan</Text>
        <Text style={styles.muted}>Zrób test poziomujący albo zacznij od początku — wtedy codziennie dostaniesz zaplanowane lekcje i powtórki.</Text>
        <DarkButton label="Wybierz, jak zacząć" onPress={() => router.push("/(main)/placement")} />
      </View>
    );
  }

  const status = getTodayStatus(plan.today, todayISO, progress.completedLessonIds, plan.reviewLog);
  const lessonsDone = status.lessons.length > 0 && status.lessons.every((l) => l.done);
  const reviewsPending = status.reviews.some((r) => !r.done);
  const nothingPlanned = status.lessons.length === 0 && status.reviews.length === 0;

  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>🗓 Plan na dziś</Text>
        {showFullPlanLink && (
          <Pressable onPress={() => router.push("/(main)/plan")} accessibilityRole="button" hitSlop={8}>
            <Text style={styles.link}>Cały plan ›</Text>
          </Pressable>
        )}
      </View>
      {nothingPlanned && <Text style={styles.muted}>Na dziś nic nie zaplanowano — dzisiaj tylko wyzwanie dnia. 🎉</Text>}
      {status.lessons.map((item) => (
        <View key={`l-${item.lessonId}`} style={styles.row}>
          <Text style={{ fontSize: 18 }}>{item.done ? "✅" : "📘"}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowLabel, item.done && styles.done]}>{describeLesson(item.lessonId)}</Text>
            <Text style={styles.muted}>nowa lekcja · ok. {getLessonInfo(item.lessonId)?.minutes ?? 8} min</Text>
          </View>
          {!item.done && <MiniButton label="Start" onPress={() => openLesson(item.lessonId)} />}
        </View>
      ))}
      {status.reviews.map((item) => (
        <View key={`r-${item.lessonId}`} style={styles.row}>
          <Text style={{ fontSize: 18 }}>{item.done ? "✅" : "🔁"}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowLabel, item.done && styles.done]}>{describeLesson(item.lessonId)}</Text>
            <Text style={styles.muted}>powtórka · 5 pytań, ok. 3 min</Text>
          </View>
          {!item.done && <MiniButton label="Powtórz" onPress={() => openReview(item.lessonId)} />}
        </View>
      ))}
      {lessonsDone && <Text style={styles.success}>🎉 Gratulacje! Wykonałeś wszystkie zaplanowane lekcje na dziś.{reviewsPending ? " Zostały jeszcze powtórki." : ""}</Text>}
    </View>
  );
}

function MiniButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.miniButton, { opacity: pressed ? 0.8 : 1 }]}
    >
      <Text style={styles.miniButtonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing(2),
    gap: theme.spacing(1.25),
  },
  titleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { fontSize: 13, fontWeight: "800", color: theme.colors.ink },
  link: { fontSize: 12, fontWeight: "700", color: theme.colors.primary },
  muted: { fontSize: 12, color: theme.colors.muted },
  success: { fontSize: 12.5, fontWeight: "700", color: theme.colors.success },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  rowLabel: { fontSize: 13, fontWeight: "700", color: theme.colors.ink },
  done: { textDecorationLine: "line-through", color: theme.colors.muted },
  miniButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingHorizontal: 14,
    minHeight: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  miniButtonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 13 },
});
