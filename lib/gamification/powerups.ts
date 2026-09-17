/** Nutki — the app's own spendable soft currency (types/gamification.ts's
 * own `nutki` field), separate from XP so XP can stay a pure skill/rank
 * measure. Earned only through play, at these four fixed points — never
 * purchasable with real money, deliberately: a second, separate
 * micro-transaction layer sitting next to the real subscription is both
 * an ethical and a regulatory risk for an app aimed at children (loot-
 * box/microtransaction mechanics targeting minors are increasingly
 * restricted by law in several jurisdictions). Every call site that
 * awards nutki references this object rather than a bare number, so the
 * economy's actual values live in exactly one place. */
export const NUTKI_REWARDS = {
  /** A correct daily-challenge answer — app/(main)/daily-challenge.tsx's
   * own handleCheck. */
  dailyChallengeCorrect: 3,
  /** A lesson finished with zero mistakes — app/(main)/lesson/
   * [lessonId].tsx's own handleContinue, alongside XP_PERFECT_LESSON_BONUS. */
  perfectLesson: 5,
  /** Every time streakDays crosses a multiple of 7 — detected in
   * GamificationContext's own recordActivity by comparing the streak
   * before/after applyActivity, not a separate tracked flag. */
  streakWeekMilestone: 10,
  /** A world's last lesson finished — same call site as perfectLesson's
   * own world-completion branch. */
  worldCompleted: 20,
  /** On top of worldCompleted — awarded when EVERY lesson in that world
   * sits at 3 stars at the moment its last lesson finishes ("Perfekcyjna
   * Kraina"), not just the one just-finished lesson. Same call site,
   * checked via a projected lessonStars snapshot since the just-earned
   * star hasn't been persisted yet at that point. */
  perfectWorldBonus: 15,
} as const;

/** What each power-up costs — see app/(main)/power-ups.tsx,
 * the one screen that spends these. */
export const POWER_UP_COSTS = {
  streakFreeze: 15,
  heartRefill: 10,
} as const;
