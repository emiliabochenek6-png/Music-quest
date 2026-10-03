import { Image, StyleSheet, View } from "react-native";
import Svg, { Circle, G, Line, Path, Polygon, Rect, Text as SvgText } from "react-native-svg";
import type { EquippedItems } from "@/lib/shop/catalog";
import { DEFAULT_BACKGROUND_ID } from "@/lib/shop/catalog";
import { SHOP_BACKGROUNDS } from "./shopBackgrounds";

const SOLFEK = require("@/assets/soltek/glowny.png");

const INK = "#3B2414";
const GOLD = "#F5B82E";

interface SolfekAvatarProps {
  equipped: EquippedItems;
  size: number;
  /** Draws the equipped background behind him. Off for the small item thumbnails that show only the item. */
  withBackground?: boolean;
  /** Shows only the background (no Solfek), used for the "Tła" thumbnails. */
  backgroundOnly?: boolean;
}

/** Solfek in his "główny" pose with what he wears from Sklep Solfka drawn on top.
 * Everything is drawn in one 320×320 box (the picture's own size), so the
 * accessories stay on his face and neck at any size. */
export function SolfekAvatar({ equipped, size, withBackground = false, backgroundOnly = false }: SolfekAvatarProps) {
  const backgroundId = equipped.tlo ?? DEFAULT_BACKGROUND_ID;
  const showBackground = withBackground || backgroundOnly;
  // With a background he stands a bit smaller and lower, on the hills; without one (item thumbnails) he fills the box so the accessory is easy to see.
  const solfekSize = showBackground && !backgroundOnly ? size * 0.82 : size;
  const solfekStyle = showBackground && !backgroundOnly ? { left: (size - solfekSize) / 2, top: size - solfekSize - size * 0.02 } : { left: 0, top: 0 };
  return (
    <View style={[styles.box, { width: size, height: size }]}>
      {showBackground && (
        // The backgrounds are tall phone pictures: fit the width and keep the TOP (sky, sun, hills) instead of cropping the middle.
        <Image
          source={SHOP_BACKGROUNDS[backgroundId] ?? SHOP_BACKGROUNDS[DEFAULT_BACKGROUND_ID]}
          resizeMode="cover"
          style={{ position: "absolute", left: 0, top: -size * 0.04, width: size, height: size * 2.17 }}
        />
      )}
      {!backgroundOnly && (
        <View style={[styles.solfek, { width: solfekSize, height: solfekSize }, solfekStyle]}>
          <Image source={SOLFEK} resizeMode="contain" style={{ width: solfekSize, height: solfekSize }} />
          <Svg width={solfekSize} height={solfekSize} viewBox="0 0 320 320" style={StyleSheet.absoluteFill} pointerEvents="none">
            {equipped.efekt ? <Effect id={equipped.efekt} /> : null}
            {equipped.szyja ? <Neck id={equipped.szyja} /> : null}
            {equipped.okulary ? <Glasses id={equipped.okulary} /> : null}
          </Svg>
        </View>
      )}
    </View>
  );
}

function Glasses({ id }: { id: string }) {
  const left = { x: 118, y: 158 };
  const right = { x: 177, y: 161 };
  if (id === "okulary-okragle") {
    return (
      <G fill="rgba(255,255,255,0.25)" stroke={INK} strokeWidth={4}>
        <Circle cx={left.x} cy={left.y} r={23} />
        <Circle cx={right.x} cy={right.y} r={23} />
        <Line x1={left.x + 23} y1={left.y} x2={right.x - 23} y2={right.y} />
        <Line x1={left.x - 23} y1={left.y} x2={left.x - 38} y2={left.y - 6} />
        <Line x1={right.x + 23} y1={right.y} x2={right.x + 38} y2={right.y - 6} />
      </G>
    );
  }
  if (id === "okulary-sloneczne") {
    return (
      <G>
        <Path d={`M ${left.x - 26} ${left.y - 14} H ${left.x + 24} V ${left.y + 6} Q ${left.x + 24} ${left.y + 24} ${left.x + 4} ${left.y + 24} Q ${left.x - 26} ${left.y + 24} ${left.x - 26} ${left.y + 6} Z`} fill={INK} />
        <Path d={`M ${right.x - 24} ${right.y - 14} H ${right.x + 26} V ${right.y + 6} Q ${right.x + 26} ${right.y + 24} ${right.x + 6} ${right.y + 24} Q ${right.x - 24} ${right.y + 24} ${right.x - 24} ${right.y + 6} Z`} fill={INK} />
        <Line x1={left.x + 24} y1={left.y - 8} x2={right.x - 24} y2={right.y - 8} stroke={INK} strokeWidth={5} />
        <Path d={`M ${left.x - 18} ${left.y - 6} L ${left.x - 6} ${left.y - 6}`} stroke="rgba(255,255,255,0.55)" strokeWidth={4} strokeLinecap="round" />
        <Path d={`M ${right.x - 16} ${right.y - 6} L ${right.x - 4} ${right.y - 6}`} stroke="rgba(255,255,255,0.55)" strokeWidth={4} strokeLinecap="round" />
      </G>
    );
  }
  // okulary-gwiazdki
  return (
    <G stroke={INK} strokeWidth={3} strokeLinejoin="round" fill="#FFD84D">
      <Polygon points={starPoints(left.x, left.y, 27, 12)} />
      <Polygon points={starPoints(right.x, right.y, 27, 12)} />
      <Line x1={left.x + 20} y1={left.y} x2={right.x - 20} y2={right.y} />
    </G>
  );
}

function starPoints(cx: number, cy: number, outer: number, inner: number): string {
  const points: string[] = [];
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? outer : inner;
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    points.push(`${(cx + radius * Math.cos(angle)).toFixed(1)},${(cy + radius * Math.sin(angle)).toFixed(1)}`);
  }
  return points.join(" ");
}

function Neck({ id }: { id: string }) {
  if (id === "szyja-muszka") {
    return (
      <G stroke={INK} strokeWidth={2.5} strokeLinejoin="round" fill="#E5402F">
        <Path d="M 138 222 L 112 207 L 112 240 Z" />
        <Path d="M 138 222 L 164 207 L 164 240 Z" />
        <Rect x={131} y={214} width={14} height={16} rx={4} />
      </G>
    );
  }
  if (id === "szyja-medal") {
    return (
      <G>
        <Path d="M 118 218 L 140 262 L 162 218" fill="none" stroke="#C0392B" strokeWidth={5} />
        <Circle cx={140} cy={268} r={17} fill={GOLD} stroke={INK} strokeWidth={3} />
        <SvgText x={140} y={276} fontSize={22} fontWeight="bold" fill={INK} textAnchor="middle">♪</SvgText>
      </G>
    );
  }
  // szyja-dzwonek
  return (
    <G stroke={INK} strokeWidth={2.5}>
      <Path d="M 113 220 Q 138 236 163 220" fill="none" stroke="#C0392B" strokeWidth={5} />
      <Path d="M 128 234 Q 128 218 140 218 Q 152 218 152 234 Z" fill={GOLD} />
      <Circle cx={140} cy={238} r={4} fill={INK} />
    </G>
  );
}

function Effect({ id }: { id: string }) {
  if (id === "efekt-nutki") {
    return (
      <G fill={INK} opacity={0.85}>
        <SvgText x={34} y={120} fontSize={36} fill="#E8892B">♪</SvgText>
        <SvgText x={270} y={190} fontSize={40} fill="#E8892B">♫</SvgText>
        <SvgText x={44} y={250} fontSize={32} fill={GOLD}>♩</SvgText>
        <SvgText x={262} y={96} fontSize={30} fill={GOLD}>♪</SvgText>
      </G>
    );
  }
  if (id === "efekt-iskierki") {
    const spots: [number, number, number][] = [[40, 90, 14], [276, 130, 18], [62, 230, 12], [250, 250, 14], [160, 24, 12], [290, 40, 10]];
    return (
      <G fill="#FFE27A" stroke="#F5B82E" strokeWidth={1.5}>
        {spots.map(([x, y, r]) => (
          <Polygon key={`${x}-${y}`} points={`${x},${y - r} ${x + r * 0.28},${y - r * 0.28} ${x + r},${y} ${x + r * 0.28},${y + r * 0.28} ${x},${y + r} ${x - r * 0.28},${y + r * 0.28} ${x - r},${y} ${x - r * 0.28},${y - r * 0.28}`} />
        ))}
      </G>
    );
  }
  // efekt-platki
  const petals: [number, number, number][] = [[40, 70, 20], [280, 110, -30], [58, 200, 40], [262, 240, 10], [150, 290, 60], [296, 40, -10]];
  return (
    <G>
      {petals.map(([x, y, rotate]) => (
        <Path key={`${x}-${y}`} d="M 0 -9 Q 8 0 0 9 Q -8 0 0 -9 Z" fill="#F7A8C4" stroke="#E27AA0" strokeWidth={1.2} transform={`translate(${x} ${y}) rotate(${rotate}) scale(1.6)`} />
      ))}
    </G>
  );
}

const styles = StyleSheet.create({
  box: { overflow: "hidden" },
  solfek: { position: "absolute" },
});
