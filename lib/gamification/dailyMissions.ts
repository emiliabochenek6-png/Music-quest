import type { DayActivity, DayStats } from "@/types/gamification";

/** Daily missions: every day shows exactly THREE, one from each of three
 * pools of 20 (60 in all) — one tied to the study plan ("Tryb nauki"),
 * one to the game ("Tryb zabawy") and one about time spent practicing.
 * Which three appear is derived from the date alone (plus what the plan
 * has on offer today), so it needs no storage, changes every day and is
 * the same for the whole day.
 *
 * Nothing here awards XP on its own: a mission is a checklist over
 * activity the app already records per day (see DayActivity/DayStats);
 * `xpReward` only LABELS a reward the underlying action already grants. */
export type MissionCategory = "plan" | "game" | "time";

export interface DailyMissionProgress {
  id: string;
  category: MissionCategory;
  icon: string;
  label: string;
  current: number;
  target: number;
  completed: boolean;
  xpReward?: number;
}

/** What the study plan offers today — decides which plan missions can be done at all. */
export interface PlanOffer {
  /** False until the player has chosen a plan (taken the test or started from the beginning). */
  hasPlan: boolean;
  /** Lessons planned for today and spaced-repetition reviews due today. */
  lessons: number;
  reviews: number;
}

type Metric =
  | "planLessons"
  | "reviews"
  | "planItems"
  | "planCorrect"
  | "planStars3"
  | "planPerfect"
  | "funLessons"
  | "funCorrect"
  | "funStars3"
  | "funPerfect"
  | "bosses"
  | "challenge"
  | "funItems"
  | "minutes";

/** 1 = a few minutes, 2 = a lesson's worth, 3 = a real effort. A day never gets more than 6 in total. */
type Difficulty = 1 | 2 | 3;

interface MissionDef {
  id: string;
  category: MissionCategory;
  icon: string;
  label: string;
  metric: Metric;
  /** A number, or "all" = everything the plan lists for today (lessons or reviews, per the metric). */
  target: number | "all";
  difficulty: Difficulty;
}

const plan = (id: string, icon: string, label: string, metric: Metric, target: number | "all", difficulty: Difficulty): MissionDef => ({ id, category: "plan", icon, label, metric, target, difficulty });
const game = (id: string, icon: string, label: string, metric: Metric, target: number, difficulty: Difficulty): MissionDef => ({ id, category: "game", icon, label, metric, target, difficulty });

export const PLAN_MISSIONS: readonly MissionDef[] = [
  plan("pl-lekcja-1", "📘", "Plan: ukończ lekcję z planu", "planLessons", 1, 1),
  plan("pl-lekcje-2", "📘", "Plan: ukończ 2 lekcje z planu", "planLessons", 2, 2),
  plan("pl-lekcje-3", "📘", "Plan: ukończ 3 lekcje z planu", "planLessons", 3, 3),
  plan("pl-lekcje-4", "📘", "Plan: ukończ 4 lekcje z planu", "planLessons", 4, 3),
  plan("pl-wszystkie", "🗓", "Plan: zrób wszystkie dzisiejsze lekcje", "planLessons", "all", 2),
  plan("pl-powtorka-1", "🔁", "Powtórka: zrób 1 powtórkę", "reviews", 1, 1),
  plan("pl-powtorki-2", "🔁", "Powtórka: zrób 2 powtórki", "reviews", 2, 2),
  plan("pl-powtorki-wszystkie", "🔁", "Powtórka: zrób wszystkie dzisiejsze powtórki", "reviews", "all", 2),
  plan("pl-razem-2", "🗓", "Plan: zrób 2 zadania z planu (lekcje lub powtórki)", "planItems", 2, 1),
  plan("pl-razem-3", "🗓", "Plan: zrób 3 zadania z planu (lekcje lub powtórki)", "planItems", 3, 2),
  plan("pl-razem-4", "🗓", "Plan: zrób 4 zadania z planu (lekcje lub powtórki)", "planItems", 4, 3),
  plan("pl-poprawne-8", "🎯", "Plan: odpowiedz dobrze na 8 pytań w trybie nauki", "planCorrect", 8, 1),
  plan("pl-poprawne-12", "🎯", "Plan: odpowiedz dobrze na 12 pytań w trybie nauki", "planCorrect", 12, 1),
  plan("pl-poprawne-16", "🎯", "Plan: odpowiedz dobrze na 16 pytań w trybie nauki", "planCorrect", 16, 2),
  plan("pl-poprawne-20", "🎯", "Plan: odpowiedz dobrze na 20 pytań w trybie nauki", "planCorrect", 20, 2),
  plan("pl-poprawne-25", "🎯", "Plan: odpowiedz dobrze na 25 pytań w trybie nauki", "planCorrect", 25, 3),
  plan("pl-poprawne-30", "🎯", "Plan: odpowiedz dobrze na 30 pytań w trybie nauki", "planCorrect", 30, 3),
  plan("pl-gwiazdki", "🏆", "Plan: zdobądź 3 gwiazdki w lekcji z planu", "planStars3", 1, 3),
  plan("pl-bez-bledu", "✨", "Plan: przejdź lekcję z planu bez ani jednego błędu", "planPerfect", 1, 3),
  plan("pl-gwiazdki-2", "🏆", "Plan: zdobądź 3 gwiazdki w 2 lekcjach z planu", "planStars3", 2, 3),
];

export const GAME_MISSIONS: readonly MissionDef[] = [
  game("gr-lekcja-1", "🎮", "Zabawa: ukończ lekcję w trybie zabawy", "funLessons", 1, 1),
  game("gr-lekcje-2", "🎮", "Zabawa: ukończ 2 lekcje w trybie zabawy", "funLessons", 2, 2),
  game("gr-lekcje-3", "🎮", "Zabawa: ukończ 3 lekcje w trybie zabawy", "funLessons", 3, 3),
  game("gr-poprawne-8", "🎯", "Zabawa: odpowiedz dobrze na 8 pytań", "funCorrect", 8, 1),
  game("gr-poprawne-10", "🎯", "Zabawa: odpowiedz dobrze na 10 pytań", "funCorrect", 10, 1),
  game("gr-poprawne-14", "🎯", "Zabawa: odpowiedz dobrze na 14 pytań", "funCorrect", 14, 2),
  game("gr-poprawne-18", "🎯", "Zabawa: odpowiedz dobrze na 18 pytań", "funCorrect", 18, 2),
  game("gr-poprawne-24", "🎯", "Zabawa: odpowiedz dobrze na 24 pytania", "funCorrect", 24, 2),
  game("gr-poprawne-30", "🎯", "Zabawa: odpowiedz dobrze na 30 pytań", "funCorrect", 30, 3),
  game("gr-poprawne-40", "🎯", "Zabawa: odpowiedz dobrze na 40 pytań", "funCorrect", 40, 3),
  game("gr-wyzwanie", "🎯", "Wykonaj wyzwanie dnia", "challenge", 1, 1),
  game("gr-lekcja-wyzwanie", "🎮", "Zabawa: lekcja i wyzwanie dnia", "funItems", 2, 2),
  game("gr-lekcje-wyzwanie", "🎮", "Zabawa: 2 lekcje i wyzwanie dnia", "funItems", 3, 3),
  game("gr-gwiazdki", "🏆", "Zabawa: zdobądź 3 gwiazdki w lekcji", "funStars3", 1, 3),
  game("gr-gwiazdki-2", "🏆", "Zabawa: zdobądź 3 gwiazdki w 2 lekcjach", "funStars3", 2, 3),
  game("gr-bez-bledu", "✨", "Zabawa: przejdź lekcję bez ani jednego błędu", "funPerfect", 1, 3),
  game("gr-boss", "👑", "Zabawa: pokonaj bossa krainy", "bosses", 1, 3),
  game("gr-lekcja-gwiazdki", "🏆", "Zabawa: ukończ lekcję na 3 gwiazdki", "funStars3", 1, 2),
  game("gr-poprawne-12", "🎯", "Zabawa: odpowiedz dobrze na 12 pytań", "funCorrect", 12, 2),
  game("gr-poprawne-20", "🎯", "Zabawa: odpowiedz dobrze na 20 pytań", "funCorrect", 20, 2),
];

const TIME_STEPS: readonly { minutes: number; name: string }[] = [
  { minutes: 3, name: "Mikro-trening" },
  { minutes: 4, name: "Szybki zryw" },
  { minutes: 5, name: "Pięć minut dla muzyki" },
  { minutes: 6, name: "Krótka rozgrzewka" },
  { minutes: 7, name: "Siódemka szczęścia" },
  { minutes: 8, name: "Ósemka do przodu" },
  { minutes: 9, name: "Prawie dziesiątka" },
  { minutes: 10, name: "Równa dziesiątka" },
  { minutes: 11, name: "Jedenastka" },
  { minutes: 12, name: "Tuzin minut" },
  { minutes: 13, name: "Trzynastka" },
  { minutes: 14, name: "Prawie kwadrans" },
  { minutes: 15, name: "Kwadrans muzyki" },
  { minutes: 16, name: "Kwadrans z bonusem" },
  { minutes: 17, name: "Dłuższy trening" },
  { minutes: 18, name: "Osiemnastka" },
  { minutes: 20, name: "Dwadzieścia minut" },
  { minutes: 22, name: "Solidna sesja" },
  { minutes: 24, name: "Prawie pół godziny" },
  { minutes: 25, name: "Ćwierć setki" },
];

export const TIME_MISSIONS: readonly MissionDef[] = TIME_STEPS.map(({ minutes, name }) => ({
  id: `cz-${minutes}`,
  category: "time" as const,
  icon: "⏱",
  label: `${name}: ćwicz ${minutes} min`,
  metric: "minutes" as const,
  target: minutes,
  difficulty: (minutes <= 8 ? 1 : minutes <= 14 ? 2 : 3) as Difficulty,
}));

export const ALL_MISSIONS: readonly MissionDef[] = [...PLAN_MISSIONS, ...GAME_MISSIONS, ...TIME_MISSIONS];

/** Most the three missions of a day may add up to (see Difficulty). */
const DAILY_DIFFICULTY_BUDGET = 6;
/** How many correct answers a planned lesson / a review typically yields, used to keep "answer N questions" plan missions within reach. */
const ANSWERS_PER_LESSON = 8;
const ANSWERS_PER_REVIEW = 4;

const EMPTY_DAY: DayActivity = { minutesSpent: 0, lessonIdsCompleted: [], dailyChallengeCompleted: false };

function hashString(text: string): number {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function nextDay(dateISO: string): string {
  const [year, month, day] = dateISO.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + 1));
  return date.toISOString().slice(0, 10);
}

/** Whether a plan mission can be finished at all given what the plan has on offer today. */
function isPlanMissionDoable(def: MissionDef, offer: PlanOffer): boolean {
  if (!offer.hasPlan) return false;
  const target = def.target === "all" ? 1 : def.target;
  switch (def.metric) {
    case "planLessons":
      return offer.lessons >= target;
    case "reviews":
      return offer.reviews >= target;
    case "planItems":
      return offer.lessons + offer.reviews >= target;
    case "planCorrect":
      return offer.lessons * ANSWERS_PER_LESSON + offer.reviews * ANSWERS_PER_REVIEW >= target;
    case "planStars3":
    case "planPerfect":
      return offer.lessons >= target;
    default:
      return false;
  }
}

function resolveTarget(def: MissionDef, offer: PlanOffer): number {
  if (def.target !== "all") return def.target;
  return def.metric === "reviews" ? offer.reviews : offer.lessons;
}

function pickFrom(candidates: readonly MissionDef[], dateISO: string, salt: string, avoidId?: string): MissionDef | null {
  if (candidates.length === 0) return null;
  const pool = candidates.length > 1 && avoidId ? candidates.filter((def) => def.id !== avoidId) : candidates;
  return pool[hashString(`${dateISO}|${salt}`) % pool.length];
}

interface DayPicks {
  plan: MissionDef | null;
  game: MissionDef;
  time: MissionDef;
}

/** One day's three picks, avoiding the previous day's (`previous`). */
function pickForDay(dateISO: string, offer: PlanOffer, previous: DayPicks | null): DayPicks {
  const planCandidates = PLAN_MISSIONS.filter((def) => isPlanMissionDoable(def, offer));
  const planPick = pickFrom(planCandidates, dateISO, "plan", previous?.plan?.id);

  const planDifficulty = planPick?.difficulty ?? 1;
  // With no plan mission the challenge stands in for it elsewhere (see computeDailyMissions), so the game slot must not repeat it.
  const challengeTakenByPlanSlot = planPick === null && offer.hasPlan;
  const gameCandidates = GAME_MISSIONS.filter(
    (def) => def.difficulty <= (planDifficulty === 3 ? 2 : 3) && !(challengeTakenByPlanSlot && (def.metric === "challenge" || def.metric === "funItems"))
  );
  const gamePick = pickFrom(gameCandidates, dateISO, "game", previous?.game.id) ?? GAME_MISSIONS[0];

  const room = Math.max(1, DAILY_DIFFICULTY_BUDGET - planDifficulty - gamePick.difficulty);
  const timeCandidates = TIME_MISSIONS.filter((def) => def.difficulty <= room);
  const timePick = pickFrom(timeCandidates, dateISO, "time", previous?.time.id) ?? TIME_MISSIONS[0];

  return { plan: planPick, game: gamePick, time: timePick };
}

/** Missions run on from this day, one day at a time, each day avoiding the
 * one before — so no mission ever shows up two days running. The walk is
 * a few hundred cheap hash lookups, so it's simply redone on demand. */
const ROTATION_START = "2026-01-01";

/** The three mission definitions for a day (the plan slot is null when nothing in the plan fits). Pure: date + plan offer in, same three out. */
function pickMissionDefs(dateISO: string, offer: PlanOffer): DayPicks {
  if (dateISO <= ROTATION_START) return pickForDay(dateISO, offer, null);
  let previous: DayPicks | null = null;
  let cursor = ROTATION_START;
  while (cursor < dateISO) {
    previous = pickForDay(cursor, offer, previous);
    cursor = nextDay(cursor);
  }
  return pickForDay(dateISO, offer, previous);
}

function readMetric(metric: Metric, day: DayActivity, challengeCompleted: boolean): number {
  const stats: DayStats = day.stats ?? {};
  const challenge = challengeCompleted ? 1 : 0;
  switch (metric) {
    case "planLessons": return stats.planLessons ?? 0;
    case "reviews": return stats.reviews ?? 0;
    case "planItems": return (stats.planLessons ?? 0) + (stats.reviews ?? 0);
    case "planCorrect": return stats.planCorrect ?? 0;
    case "planStars3": return stats.planStars3 ?? 0;
    case "planPerfect": return stats.planPerfect ?? 0;
    case "funLessons": return stats.funLessons ?? 0;
    case "funCorrect": return stats.funCorrect ?? 0;
    case "funStars3": return stats.funStars3 ?? 0;
    case "funPerfect": return stats.funPerfect ?? 0;
    case "bosses": return stats.bosses ?? 0;
    case "challenge": return challenge;
    case "funItems": return (stats.funLessons ?? 0) + challenge;
    case "minutes": return day.minutesSpent;
  }
}

function toProgress(def: MissionDef, target: number, day: DayActivity, challengeCompleted: boolean, challengeXpReward: number): DailyMissionProgress {
  const current = Math.min(readMetric(def.metric, day, challengeCompleted), target);
  return {
    id: def.id,
    category: def.category,
    icon: def.icon,
    label: def.target === "all" ? `${def.label} (${target})` : def.label,
    current,
    target,
    completed: current >= target,
    ...(def.metric === "challenge" ? { xpReward: challengeXpReward } : {}),
  };
}

/** Today's three missions with their progress — one plan, one game, one time.
 *
 * Without a plan the plan slot asks the player to set one up with Solfek;
 * on a day when the plan has nothing to do (a rest day, the path finished)
 * it falls back to the daily challenge, which is always available.
 * `challengeXpReward` is the caller's own XP_DAILY_CHALLENGE_BONUS (see
 * app/(main)/daily-challenge.tsx), passed in so the label can't drift. */
export function computeDailyMissions(
  dateISO: string,
  day: DayActivity | undefined,
  challengeCompleted: boolean,
  challengeXpReward: number,
  offer: PlanOffer
): DailyMissionProgress[] {
  const activity = day ?? EMPTY_DAY;
  const picks = pickMissionDefs(dateISO, offer);

  let planMission: DailyMissionProgress;
  if (!offer.hasPlan) {
    planMission = { id: "pl-ustaw-plan", category: "plan", icon: "🧭", label: "Plan: ułóż swój plan z Solfkiem (test poziomujący)", current: 0, target: 1, completed: false };
  } else if (picks.plan) {
    planMission = toProgress(picks.plan, resolveTarget(picks.plan, offer), activity, challengeCompleted, challengeXpReward);
  } else {
    planMission = {
      id: "pl-wyzwanie-dnia",
      category: "plan",
      icon: "🎯",
      label: "Plan: dziś odpoczynek — wykonaj wyzwanie dnia",
      current: challengeCompleted ? 1 : 0,
      target: 1,
      completed: challengeCompleted,
      xpReward: challengeXpReward,
    };
  }

  return [
    planMission,
    toProgress(picks.game, picks.game.target as number, activity, challengeCompleted, challengeXpReward),
    toProgress(picks.time, picks.time.target as number, activity, challengeCompleted, challengeXpReward),
  ];
}
