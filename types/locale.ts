/** Only "pl" has a real dictionary today (lib/i18n/translate.ts's own
 * DICTIONARIES) — a single-member union rather than a bare string so a
 * future second locale is "widen this type + add a dictionary", not a
 * signature change hunted down across every caller (see ARCHITECTURE.md
 * section 6, open question #4). */
export type Locale = "pl";
