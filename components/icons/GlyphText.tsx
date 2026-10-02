import { Children, isValidElement } from "react";
import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { StyleProp, TextStyle } from "react-native";
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

  const flat = StyleSheet.flatten(style) ?? {};
  const fontSize = typeof flat.fontSize === "number" ? flat.fontSize : 14;
  const size = iconSize ?? Math.round(fontSize * 1.35);
  const { color, fontSize: _fs, fontWeight, letterSpacing, ...rest } = flat;
  void _fs;
  const textAlign = flat.textAlign;
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: split.rest ? 6 : 0, justifyContent: textAlign === "center" ? "center" : "flex-start", flexShrink: 1 }}>
      <AppIcon name={split.icon} size={size} />
      {split.rest ? (
        <Text style={{ color, fontSize, fontWeight, letterSpacing, flexShrink: 1, textAlign }} numberOfLines={numberOfLines}>
          {split.rest}
        </Text>
      ) : null}
    </View>
  );
}
