import type { ComponentType } from "react";
import { ArytmikPortrait } from "@/components/map/ArytmikPortrait";
import { FalszomirPortrait } from "@/components/map/FalszomirPortrait";
import { OktawiuszPortrait } from "@/components/map/OktawiuszPortrait";
import { OsmiotaktPortrait } from "@/components/map/OsmiotaktPortrait";

/** One entry per world's own boss (LessonDefinition's own `bossName`) —
 * both LessonNode.tsx (the map node's portrait) and IntroSlideCards.tsx
 * (a "Zapoznaj się" slide's own `bossPortrait: true` portrait) render
 * whichever one a lesson's `bossName` points at, instead of each having
 * its own hard-coded Fałszomir import. Adding a new world's boss means
 * adding one line here — LessonNode/IntroSlideCards need no changes. */
export const BOSS_PORTRAITS: Record<string, ComponentType<{ size?: number }>> = {
  Fałszomir: FalszomirPortrait,
  Arytmik: ArytmikPortrait,
  Ośmiotakt: OsmiotaktPortrait,
  Oktawiusz: OktawiuszPortrait,
};

/** Wioska Nut's own boss predates the `bossName` field — every lesson
 * authored before it just gets this default so existing content doesn't
 * need touching. */
export const DEFAULT_BOSS_NAME = "Fałszomir";

export function resolveBossPortrait(bossName: string | undefined): ComponentType<{ size?: number }> {
  return BOSS_PORTRAITS[bossName ?? DEFAULT_BOSS_NAME] ?? FalszomirPortrait;
}
