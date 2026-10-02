import type { IconName } from "@/components/icons/icons";

/** Emoji that stand in for an icon in the interface → the app's own
 * hand-drawn icon. Emoji inside running text (a lesson's description, a
 * sentence) are NOT touched: only a label/title that STARTS with one of
 * these (or is just one) is swapped, by GlyphText and the buttons. */
export const EMOJI_ICON: Readonly<Record<string, IconName>> = {
  "🔊": "ui_glosnik",
  "⏹": "ui_stop",
  "✅": "ui_ptaszek",
  "✓": "ui_ptaszek",
  "🎉": "ui_konfetti",
  "🏆": "ui_puchar",
  "📅": "nav_kalendarz",
  "🗓": "nav_kalendarz",
  "🎯": "ui_cel",
  "🔁": "ui_powtorka",
  "📘": "ui_lekcja",
  "🏁": "ui_meta",
  "👑": "ui_korona",
  "🔒": "kraina_klodka",
  "🔓": "ui_klodka_otwarta",
  "🧭": "ui_kompas",
  "❄️": "ui_platek",
  "💔": "ui_zlamane_serce",
  "🏅": "ui_odznaka",
  "📬": "ui_koperta",
  "✨": "ui_iskry",
  "✕": "ui_zamknij",
  "▶": "ui_start",
  "⏱": "ui_zegar",
  "⭐": "hud_ranga_gwiazda",
  "🌟": "hud_ranga_gwiazda",
  "🔥": "hud_seria_ogien",
  "🎵": "hud_nutki_waluta",
  "💪": "hud_serce",
  "📖": "tryb_nauki",
  "📚": "tryb_nauki",
  "🎮": "tryb_zabawy",
};

/** Splits a leading mapped emoji off a string: `"🔊 Posłuchaj"` → icon + "Posłuchaj"; null when it doesn't start with one. */
export function splitLeadingGlyph(text: string): { icon: IconName; rest: string } | null {
  for (const emoji of Object.keys(EMOJI_ICON)) {
    if (text.startsWith(emoji)) return { icon: EMOJI_ICON[emoji], rest: text.slice(emoji.length).trim() };
  }
  return null;
}
