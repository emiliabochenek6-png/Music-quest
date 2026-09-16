import { SvgXml } from "react-native-svg";
import { ICONS } from "@/components/icons/icons";
import type { IconName } from "@/components/icons/icons";

interface AppIconProps {
  name: IconName;
  /** Square render size in px — every source SVG shares one 64×64
   * viewBox (see icons.ts), so a single `size` scales both dimensions
   * together rather than needing width/height separately. */
  size?: number;
}

/**
 * Renders one of the hand-illustrated icons from icons.ts — each is a
 * complete, already-colored illustration (its own fills/strokes baked
 * in), not a monochrome glyph tinted through a `color` prop, so this
 * component deliberately takes no color override. `SvgXml` (react-native-
 * svg) parses the raw markup at render time rather than needing each
 * icon hand-translated into `<Path>`/`<Circle>` JSX — fine for a fixed
 * set of 15 small, static icons like this.
 */
export function AppIcon({ name, size = 24 }: AppIconProps) {
  return <SvgXml xml={ICONS[name]} width={size} height={size} />;
}
