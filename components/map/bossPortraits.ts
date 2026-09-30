import type { ComponentType } from "react";
import { AkordeonPortrait } from "@/components/map/AkordeonPortrait";
import { ArytmikPortrait } from "@/components/map/ArytmikPortrait";
import { DominikPortrait } from "@/components/map/DominikPortrait";
import { FalszomirPortrait } from "@/components/map/FalszomirPortrait";
import { OktawiuszPortrait } from "@/components/map/OktawiuszPortrait";
import { OsmiotaktPortrait } from "@/components/map/OsmiotaktPortrait";
import { TrojglosPortrait } from "@/components/map/TrojglosPortrait";

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
  Trójgłos: TrojglosPortrait,
  Akordeon: AkordeonPortrait,
  Dominik: DominikPortrait,
};

/** Wioska Nut's own boss predates the `bossName` field — every lesson
 * authored before it just gets this default so existing content doesn't
 * need touching. */
export const DEFAULT_BOSS_NAME = "Fałszomir";

export function resolveBossPortrait(bossName: string | undefined): ComponentType<{ size?: number }> {
  return BOSS_PORTRAITS[bossName ?? DEFAULT_BOSS_NAME] ?? FalszomirPortrait;
}
