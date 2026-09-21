import { getWorldContent } from "@/data/lessons";
import { getPreviousWorld } from "@/data/worlds";
import { MIN_STARS_TO_ADVANCE_WORLD } from "@/types/gamification";
import type { ProgressState, SubscriptionStatus, WorldDefinition, WorldNodeState } from "@/types/content";

/** Temporarily off: premium worlds unlock by progression alone (previous
 * world done, every lesson at MIN_STARS_TO_ADVANCE_WORLD) with no
 * subscription check. Flip to true to bring the paywall gate back. */
const ENFORCE_SUBSCRIPTION_GATE = false;

/** Whether EVERY lesson in `world` has earned at least
 * MIN_STARS_TO_ADVANCE_WORLD stars — see that constant's own doc. A
 * world with no ported content yet (`getWorldContent` returns undefined
 * — see data/lessons/index.ts's own doc on which worlds that's still
 * true for) has nothing to grade, so it doesn't block on this: there's
 * no lesson to have starred in the first place, and refusing to advance
 * past a genuinely empty placeholder world would just be a dead end. */
function meetsStarRequirement(world: WorldDefinition, lessonStars: Readonly<Record<string, 1 | 2 | 3>>): boolean {
  const content = getWorldContent(world.id);
  if (!content) return true;
  return content.lessons.every((lesson) => (lessonStars[lesson.id] ?? 0) >= MIN_STARS_TO_ADVANCE_WORLD);
}

/**
 * Which of the 4 map-node visual states a world resolves to — see
 * ARCHITECTURE.md section 3.3. Subscription is checked ONLY after
 * progression, never in place of it: a premium world past an unfinished
 * previous one shows "locked-progression" (finish the previous one first),
 * not a paywall — the paywall is only ever the reason once progression
 * alone would otherwise unlock it.
 *
 * "Finished the previous world" itself means two things now, both
 * required: every one of its lessons is in `completedWorldIds`'s own
 * `completedLessonIds` companion (tracked as the world being in
 * `completedWorldIds` — see ProgressContext's own markWorldCompleted,
 * only ever called once a world's last lesson finishes), AND every one
 * of those lessons earned at least MIN_STARS_TO_ADVANCE_WORLD stars (see
 * meetsStarRequirement above) — a world "completed" on a string of 1-star
 * scrapes-by no longer unlocks the next one on its own.
 */
export function resolveNodeState(
  world: WorldDefinition,
  progress: ProgressState,
  subscription: SubscriptionStatus,
  lessonStars: Readonly<Record<string, 1 | 2 | 3>>
): WorldNodeState {
  if (progress.completedWorldIds.has(world.id)) {
    return "completed";
  }
  // Every world stays unlocked during local development (Expo Go, dev
  // builds) — otherwise testing a world's own content means first
  // grinding through every earlier world (and, for premium worlds, a real
  // subscription that isn't wired up in this dev-only scaffold anyway —
  // see SubscriptionContext's own doc). __DEV__ is false in any real
  // production build, so this never reaches actual users; the real
  // progression/paywall gates below stay intact for when that matters.
  if (__DEV__) {
    return "available";
  }
  const previous = getPreviousWorld(world);
  const previousDone = !previous || (progress.completedWorldIds.has(previous.id) && meetsStarRequirement(previous, lessonStars));
  if (!previousDone) {
    return "locked-progression";
  }
  if (ENFORCE_SUBSCRIPTION_GATE && world.isPremium && !subscription.isActive) {
    return "locked-subscription";
  }
  return "available";
}

/**
 * Whether `world` just transitioned from progression-locked to reachable
 * — the exact question app/(main)/lesson/[lessonId].tsx's own
 * handleContinue needs answered the moment a world's last lesson
 * finishes, to decide whether to announce the NEXT world unlocking (see
 * its own doc for the full "why" and the synthetic before/after
 * ProgressState/lessonStars it builds). Comparing two resolveNodeState
 * calls rather than just checking the "after" state alone matters for
 * correctness on a REPLAY: a world whose next neighbor was already
 * unlocked from an earlier attempt must not re-announce itself every
 * time that same last lesson is replayed — "was progression-locked
 * before, isn't now" is a real, one-time transition; "is unlocked" alone
 * is true on every single replay after the first. Checks `!==
 * "locked-progression"` for the "before" half (not `=== "available"`)
 * so a world that's ALREADY unlocked-but-behind-a-paywall
 * ("locked-subscription") correctly counts as "not a new transition"
 * too — subscribing later doesn't retroactively make finishing this
 * world the reason it became reachable.
 */
export function didWorldJustUnlock(
  world: WorldDefinition,
  progressBefore: ProgressState,
  progressAfter: ProgressState,
  subscription: SubscriptionStatus,
  lessonStarsBefore: Readonly<Record<string, 1 | 2 | 3>>,
  lessonStarsAfter: Readonly<Record<string, 1 | 2 | 3>>
): boolean {
  const before = resolveNodeState(world, progressBefore, subscription, lessonStarsBefore);
  const after = resolveNodeState(world, progressAfter, subscription, lessonStarsAfter);
  return before === "locked-progression" && after === "available";
}
