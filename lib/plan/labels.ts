import type { PlacementLevel } from "@/lib/plan/placement";

export const LEVEL_LABEL: Record<PlacementLevel, string> = {
  0: "Do nauki",
  1: "Częściowo",
  2: "Opanowane",
};

export const LEVEL_HINT: Record<PlacementLevel, string> = {
  0: "wszystkie lekcje",
  1: "pomijasz początek",
  2: "tylko krótki przegląd",
};

export const PACE_OPTIONS = [10, 15, 20, 30] as const;

/** Study days per week the plan counts on (Sundays are rest days). */
export const STUDY_DAYS_PER_WEEK = 6;

/** The plan's horizon: after the new-lesson phase it keeps going with
 * reviews and daily challenges until at least this many weeks in. */
export const MIN_PLAN_WEEKS = 13;
