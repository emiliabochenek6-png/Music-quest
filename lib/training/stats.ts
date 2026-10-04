import type { TopicTally, TrainingState } from "@/types/gamification";
import { MIN_ANSWERS_FOR_STATS } from "./rewards";
import { TRAINING_TOPICS } from "./topics";

export const EMPTY_TRAINING: TrainingState = { totals: {}, days: {}, bestStreak: 0, bestTimed: 0, rewardDateISO: null, rewardedToday: 0 };

/** Days older than this are dropped from `days` (their answers stay in `totals`). */
const KEEP_DAYS = 14;

function addTally(a: TopicTally | undefined, correct: boolean): TopicTally {
  return { correct: (a?.correct ?? 0) + (correct ? 1 : 0), total: (a?.total ?? 0) + 1 };
}

/** One more answer in `topicId` on `dateISO`. */
export function recordAnswer(state: TrainingState, topicId: string, correct: boolean, dateISO: string): TrainingState {
  const day = { ...(state.days[dateISO] ?? {}) };
  day[topicId] = addTally(day[topicId], correct);
  const days = { ...state.days, [dateISO]: day };
  const cutoff = Date.parse(dateISO) - KEEP_DAYS * 86_400_000;
  for (const key of Object.keys(days)) if (Date.parse(key) < cutoff) delete days[key];
  return { ...state, totals: { ...state.totals, [topicId]: addTally(state.totals[topicId], correct) }, days };
}

export function percent(tally: TopicTally | undefined): number | null {
  if (!tally || tally.total === 0) return null;
  return Math.round((tally.correct / tally.total) * 100);
}

/** Totals for the last 7 days (including `dateISO`) in one topic. */
export function lastWeek(state: TrainingState, topicId: string, dateISO: string): TopicTally {
  const sum: TopicTally = { correct: 0, total: 0 };
  const from = Date.parse(dateISO) - 6 * 86_400_000;
  for (const [day, topics] of Object.entries(state.days)) {
    if (Date.parse(day) < from || Date.parse(day) > Date.parse(dateISO)) continue;
    const tally = topics[topicId];
    if (tally) {
      sum.correct += tally.correct;
      sum.total += tally.total;
    }
  }
  return sum;
}

/** The topics with the lowest success rate (only those with enough answers to mean something), weakest first. */
export function weakestTopics(state: TrainingState, count: number): string[] {
  return TRAINING_TOPICS.filter((topic) => (state.totals[topic.id]?.total ?? 0) >= MIN_ANSWERS_FOR_STATS)
    .map((topic) => ({ id: topic.id, ratio: state.totals[topic.id].correct / state.totals[topic.id].total }))
    .sort((a, b) => a.ratio - b.ratio)
    .slice(0, count)
    .map((entry) => entry.id);
}

/** How many answers can still earn the reward today. */
export function rewardsLeftToday(state: TrainingState, dateISO: string, perDay: number): number {
  return state.rewardDateISO === dateISO ? Math.max(0, perDay - state.rewardedToday) : perDay;
}
