import { Children, isValidElement } from "react";
import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { AppIcon } from "@/components/icons/AppIcon";
import { splitLeadingGlyph } from "@/components/icons/emojiIcons";

interface GlyphTextProps {
  style?: StyleProp<TextStyle>;
  children: ReactNode;
  /** Overrides the icon size (default: 1.35 × the text's own font size). */
  iconSize?: number;
  numberOfLines?: number;
}

/** Drop-in for `<Text>` that swaps a LEADING emoji (see emojiIcons.ts) for
 * the app's own hand-drawn icon: `<GlyphText>🏆</GlyphText>` is just the
 * icon, `<GlyphText>🔥 Passa: 3</GlyphText>` is icon + text on one row.
 * Anything else renders exactly like a plain Text, so it's safe to use
 * for strings that only sometimes start with an emoji. */
export function GlyphText({ style, children, iconSize, numberOfLines }: GlyphTextProps) {
  const text = Children.toArray(children)
    .map((child) => (typeof child === "string" || typeof child === "number" ? String(child) : isValidElement(child) ? null : ""))
    .join("");
  const hasOnlyText = Children.toArray(children).every((child) => typeof child === "string" || typeof child === "number");
  const split = hasOnlyText ? splitLeadingGlyph(text) : null;
  if (!split) return <Text style={style} numberOfLines={numberOfLines}>{children}</Text>;

  const flat = (StyleSheet.flatten(style) ?? {}) as Record<string, unknown>;
  const fontSize = typeof flat.fontSize === "number" ? flat.fontSize : 14;
  const size = iconSize ?? Math.round(fontSize * 1.35);
  // Text look (colour, size, weight…) goes to the text next to the icon; everything else
  // (padding, margin, alignment…) lays out the whole icon + text row.
  const TEXT_KEYS = ["color", "fontSize", "fontWeight", "fontStyle", "fontFamily", "letterSpacing", "lineHeight", "textAlign", "textTransform"];
  const textStyle: Record<string, unknown> = {};
  const layoutStyle: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(flat)) (TEXT_KEYS.includes(key) ? textStyle : layoutStyle)[key] = value;
  const textAlign = flat.textAlign;
  return (
    <View
      style={[
        { flexDirection: "row", alignItems: "center", gap: split.rest ? 6 : 0, justifyContent: textAlign === "center" ? "center" : "flex-start", flexShrink: 1 },
        layoutStyle as StyleProp<ViewStyle>,
      ]}
    >
      <AppIcon name={split.icon} size={size} />
      {split.rest ? (
        <Text style={[textStyle as StyleProp<TextStyle>, { flexShrink: 1 }]} numberOfLines={numberOfLines}>
          {split.rest}
        </Text>
      ) : null}
    </View>
  );
}
