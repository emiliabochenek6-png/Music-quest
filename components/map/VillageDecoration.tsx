import { SvgXml } from "react-native-svg";

/** Small hand-drawn "sticker" illustrations scattered along Wioska Nut's
 * own path (see LessonPath.tsx's own decorations prop) — a cottage, a
 * tree and a fence segment, replacing the generic mountain/gem/wave/cave
 * emoji every world used to share regardless of its own theme. Flat
 * shapes with a thick outline stroke, matching LessonNode.tsx's own
 * "sticker-style, no shadow/glow/bevel" look, in warm wood/leaf tones
 * that read as "village" without competing with a world's own accent
 * color. Same small-viewBox inline-SVG approach as components/icons/
 * icons.ts — no svg-to-component Metro transform configured here either. */
export type VillageDecorationKind = "cottage" | "tree" | "fence";

const VILLAGE_DECORATION_SVG: Record<VillageDecorationKind, string> = {
  cottage: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M10 30 L32 12 L54 30 L54 56 L10 56 Z" fill="#E9C199" stroke="#8B5A2B" stroke-width="3" stroke-linejoin="round"></path>
<path d="M5 32 L32 9 L59 32" fill="none" stroke="#8B5A2B" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path>
<rect x="27" y="40" width="10" height="16" rx="1" fill="#8B5A2B"></rect>
<rect x="15" y="34" width="10" height="10" rx="2" fill="#8FCBE0" stroke="#8B5A2B" stroke-width="2"></rect>
</svg>`,
  tree: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<rect x="28" y="38" width="8" height="20" rx="2" fill="#8B5A2B"></rect>
<circle cx="32" cy="26" r="20" fill="#79B36A" stroke="#3F6B3D" stroke-width="3"></circle>
</svg>`,
  fence: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<rect x="6" y="26" width="52" height="6" rx="2" fill="#C79A62" stroke="#8B5A2B" stroke-width="2"></rect>
<rect x="6" y="40" width="52" height="6" rx="2" fill="#C79A62" stroke="#8B5A2B" stroke-width="2"></rect>
<rect x="10" y="18" width="8" height="38" rx="2" fill="#D3AD78" stroke="#8B5A2B" stroke-width="2"></rect>
<rect x="46" y="18" width="8" height="38" rx="2" fill="#D3AD78" stroke="#8B5A2B" stroke-width="2"></rect>
</svg>`,
};

interface VillageDecorationProps {
  kind: VillageDecorationKind;
  size?: number;
}

export function VillageDecoration({ kind, size = 40 }: VillageDecorationProps) {
  return <SvgXml xml={VILLAGE_DECORATION_SVG[kind]} width={size} height={size} />;
}
