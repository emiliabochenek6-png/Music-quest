import { deriveHearts } from "@/lib/gamification/hearts";
import { sanitizeGamificationState } from "@/types/gamification";
import type { ProgressState } from "@/types/content";
import type { DailyChallengeState, DayActivity, GamificationState } from "@/types/gamification";

/** Compares two "YYYY-MM-DD" dates (or null, treated as infinitely far in
 * the past — "never active" always loses to any real date). Returns >0
 * when `a` is later, <0 when `b` is later, 0 for a tie/both-null. */
function compareDates(a: string | null, b: string | null): number {
  const aMs = a === null ? -Infinity : Date.parse(a);
  const bMs = b === null ? -Infinity : Date.parse(b);
  return aMs === bMs ? 0 : aMs > bMs ? 1 : -1;
}

/** Folds two whole activityLog maps together, day by day — the exact
 * same per-field merge lib/gamification/activity.ts's own applyActivity
 * already does for ONE day's new delta against what's stored, just
 * applied entry-by-entry across two complete logs instead. Summing
 * `minutesSpent` for a day BOTH sides have an entry for is deliberate,
 * not a double-count: merging only ever runs once, right at login (see
 * useCloudSync.ts's own doc) — two entries for the same date at that
 * moment mean two genuinely different devices each independently logged
 * real practice time that day before either had synced, and the honest
 * total is their sum, not either side alone. */
function mergeActivityLogs(a: Record<string, DayActivity>, b: Record<string, DayActivity>): Record<string, DayActivity> {
  const merged: Record<string, DayActivity> = { ...a };
  for (const [date, dayB] of Object.entries(b)) {
    const dayA = merged[date];
    if (!dayA) {
      merged[date] = dayB;
      continue;
    }
    merged[date] = {
      minutesSpent: dayA.minutesSpent + dayB.minutesSpent,
      lessonIdsCompleted: Array.from(new Set([...dayA.lessonIdsCompleted, ...dayB.lessonIdsCompleted])),
      dailyChallengeCompleted: dayA.dailyChallengeCompleted || dayB.dailyChallengeCompleted,
    };
  }
  return merged;
}

function pickNewerDailyChallenge(local: DailyChallengeState | null, remote: DailyChallengeState | null): DailyChallengeState | null {
  if (!local) return remote;
  if (!remote) return local;
  const cmp = compareDates(local.dateISO, remote.dateISO);
  if (cmp > 0) return local;
  if (cmp < 0) return remote;
  // Same day on both sides — never discard an already-completed attempt
  // in favor of a still-in-progress one from the other device.
  if (local.completed) return local;
  if (remote.completed) return remote;
  return local;
}

/** Combines a device's local progress with whatever's stored in the
 * cloud — union only, on both sets: being in EITHER side's
 * completedWorldIds/completedLessonIds already means "done," and
 * completion never un-happens, so there's no ambiguity to resolve, just
 * a straight union. Runs once at login (see lib/sync/useCloudSync.ts's
 * own doc) to reconcile a device that had its own local progress before
 * ever signing in with whatever the account already had from elsewhere. */
export function mergeProgressState(local: ProgressState, remote: ProgressState): ProgressState {
  return {
    completedWorldIds: new Set([...local.completedWorldIds, ...remote.completedWorldIds]),
    completedLessonIds: new Set([...local.completedLessonIds, ...remote.completedLessonIds]),
  };
}

/** The gamification counterpart to mergeProgressState — same "never lose
 * progress" principle, but each field needs its OWN rule since not
 * everything here is a monotonic set:
 *   - lessonStars: best-of per lesson id (a worse rating on one side
 *     never overwrites a better one already earned on the other).
 *   - xp/nutki/streakFreezes: the MAX of the two totals, not the sum —
 *     all three are awarded/bought per-action on whichever device earned
 *     them, and two devices under the same account have likely both been
 *     accruing independently; summing would double-count every
 *     login/merge this ever runs for, compounding without bound. Max is
 *     conservative (undercounts real total effort/spend across devices)
 *     but never inflates — the safer direction both for a number that
 *     gates rank-up celebrations (xp) and for a spendable currency/
 *     inventory that shouldn't duplicate itself just from logging in on
 *     a second device (nutki, streakFreezes).
 *   - activityLog: see mergeActivityLogs' own doc.
 *   - streakDays/lastActiveDateISO: the NEWER lastActiveDateISO wins,
 *     taking its own streakDays along with it — a streak is inherently
 *     about "how many days in a row as of NOW," so the more recent
 *     record is definitionally the more accurate one, not something to
 *     combine.
 *   - hearts/lastHeartChangeAtISO: derive CURRENT hearts (via
 *     deriveHearts, unlimited=false — merging never needs to know about
 *     premium) for both sides as of `nowMs` and keep whichever raw
 *     {hearts, lastHeartChangeAtISO} PAIR derives to more hearts right
 *     now — the two fields must travel together (mixing one side's
 *     count with the other's clock would misrepresent both). */
export function mergeGamificationState(localIn: GamificationState, remoteIn: GamificationState, nowMs: number = Date.now()): GamificationState {
  // Either side could be an account's own OLDER snapshot, saved before a
  // field like `nutki` existed — sanitizeGamificationState fills those
  // in (and clamps any NaN that already leaked through) before any
  // arithmetic below (Math.max in particular: Math.max(NaN, 5) is itself
  // NaN, so an unsanitized side would poison the merged result even when
  // the OTHER side is perfectly fine).
  const local = sanitizeGamificationState(localIn);
  const remote = sanitizeGamificationState(remoteIn);
  const lessonStars: Record<string, 1 | 2 | 3> = { ...local.lessonStars };
  for (const [lessonId, stars] of Object.entries(remote.lessonStars)) {
    const existing = lessonStars[lessonId];
    if (existing === undefined || stars > existing) {
      lessonStars[lessonId] = stars as 1 | 2 | 3;
    }
  }

  const streakFromRemote = compareDates(remote.lastActiveDateISO, local.lastActiveDateISO) > 0;
  const localHeartsInfo = deriveHearts(local, nowMs, false);
  const remoteHeartsInfo = deriveHearts(remote, nowMs, false);
  const heartsFromRemote = remoteHeartsInfo.hearts > localHeartsInfo.hearts;

  return {
    xp: Math.max(local.xp, remote.xp),
    hearts: heartsFromRemote ? remote.hearts : local.hearts,
    lastHeartChangeAtISO: heartsFromRemote ? remote.lastHeartChangeAtISO : local.lastHeartChangeAtISO,
    lastActiveDateISO: streakFromRemote ? remote.lastActiveDateISO : local.lastActiveDateISO,
    streakDays: streakFromRemote ? remote.streakDays : local.streakDays,
    lessonStars,
    activityLog: mergeActivityLogs(local.activityLog, remote.activityLog),
    dailyChallenge: pickNewerDailyChallenge(local.dailyChallenge, remote.dailyChallenge),
    nutki: Math.max(local.nutki, remote.nutki),
    streakFreezes: Math.max(local.streakFreezes, remote.streakFreezes),
  };
}
