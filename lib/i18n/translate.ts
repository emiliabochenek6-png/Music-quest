import pl from "@/data/i18n/pl.json";
import type { Locale } from "@/types/locale";

export type TranslationKey = keyof typeof pl;

/** Single language on launch (see ARCHITECTURE.md section 6, open question
 * #4) — kept as a real lookup table (not inlined strings in components)
 * from day one specifically so adding a second locale later is "add a
 * dictionary + a locale param here", not "hunt down every hardcoded
 * string across the app". */
const DICTIONARIES: Record<Locale, typeof pl> = { pl };

export function t(key: TranslationKey, locale: Locale = "pl", vars?: Record<string, string | number>): string {
  const template = DICTIONARIES[locale][key];
  if (!vars) {
    return template;
  }
  return Object.entries(vars).reduce<string>(
    (result, [name, value]) => result.replaceAll(`{${name}}`, String(value)),
    template
  );
}
