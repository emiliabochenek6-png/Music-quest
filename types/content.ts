/** The two presentation modes the whole app renders through — see
 * ARCHITECTURE.md section 2. Never a fork in the component tree: every
 * shared component reads this from ProfileContext and switches its own
 * variant, so navigation/unlock/progress logic stays identical between
 * modes and only the presentation layer differs. */
export type ProfileMode = "young-explorer" | "hobbyist";

export interface ProfileState {
  mode: ProfileMode;
  displayName: string | null;
  narratorEnabled: boolean;
  soundEffectsEnabled: boolean;
}

/** One of the 12 curriculum worlds — see ARCHITECTURE.md section 3.2. This
 * is the map/navigation-level definition only; a world's actual lesson
 * content (exercises) lives elsewhere, keyed by `id`. */
export interface WorldDefinition {
  id: string;
  order: number;
  nameKey: string;
  descriptionKey: string;
  isPremium: boolean;
  accentColor: string;
  mapIllustrationId: string;
  mapIconId: string;
}

/** Resolved presentation state for a single map node — see
 * ARCHITECTURE.md section 3.3 for how this is derived. */
export type WorldNodeState = "completed" | "available" | "locked-progression" | "locked-subscription";

export interface ProgressState {
  completedWorldIds: ReadonlySet<string>;
  /** Completion tracked per LESSON (within a world's own levels/"poziomy"
   * screen — see lib/progression/resolveLessonNodeState.ts), independent
   * of `completedWorldIds`: a world is only marked complete once every one
   * of its ported lessons is, but the two sets are stored separately so a
   * lesson's own lock/unlock state never has to be reverse-derived from
   * the world-level flag. */
  completedLessonIds: ReadonlySet<string>;
}

export type SubscriptionPlan = "monthly" | "yearly";

export interface SubscriptionStatus {
  isActive: boolean;
  plan: SubscriptionPlan | null;
  expiresAt: string | null;
  isInGracePeriod: boolean;
  isTrialActive: boolean;
}

export interface MathChallenge {
  a: number;
  b: number;
  operator: "+";
  answer: number;
}
