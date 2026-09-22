/** Raw SVG markup for the app's own hand-illustrated icon set (supplied
 * as loose .svg files under ~/Desktop/ikony_music_quest/svg — copied in
 * verbatim here rather than imported as assets, since this project has
 * no svg-to-component Metro transform configured and these are few and
 * small enough that inlining is simpler than adding one). Each is a
 * self-contained, already-colored illustration (not a monochrome glyph
 * meant to be tinted via `currentColor`), rendered through AppIcon.tsx's
 * `<SvgXml>`. Keys match the source filenames (minus extension) so a
 * future re-export from the same design source stays a straight
 * find-and-replace. */
export const ICONS = {
  hud_menu: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<rect x="12" y="15" width="40" height="7" rx="3.5" fill="#4A2C1D"/>
<rect x="12" y="28.5" width="40" height="7" rx="3.5" fill="#4A2C1D"/>
<rect x="12" y="42" width="26" height="7" rx="3.5" fill="#4A2C1D"/>
<circle cx="47" cy="45.5" r="4.5" fill="#F29A4A"/>
</svg>`,

  hud_nutki_waluta: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<circle cx="32" cy="32" r="24" fill="#FFC94A" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M53 38 A24 24 0 0 1 11 38 A22 22 0 0 0 53 38 Z" fill="#F0A92E"/>
<circle cx="32" cy="32" r="17.5" fill="none" stroke="#E8962A" stroke-width="2.5"/>
<path d="M35.5 18 V39" fill="none" stroke="#4A2C1D" stroke-width="3.5" stroke-linecap="round"/>
<path d="M35.5 18 C39.5 20.5 44 22.5 42.5 29.5" fill="none" stroke="#4A2C1D" stroke-width="3.5" stroke-linecap="round"/>
<ellipse cx="29.5" cy="40.5" rx="6.8" ry="5" transform="rotate(-22 29.5 40.5)" fill="#4A2C1D"/>
<path d="M17 24 A17 17 0 0 1 27 15.5" fill="none" stroke="#FFFFFF" stroke-opacity="0.7" stroke-width="3" stroke-linecap="round"/>
</svg>`,

  hud_ranga_gwiazda: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M32.00,8.00 L39.35,23.89 L56.73,25.97 L43.89,37.86 L47.28,55.03 L32.00,46.50 L16.72,55.03 L20.11,37.86 L7.27,25.97 L24.65,23.89 Z" fill="#FFC94A" stroke="#4A2C1D" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M32 34 L47.28 55.03 L32.00 46.50 Z" fill="#F0A92E"/>
<path d="M32 34 L43.89 37.86 L47.28 55.03 Z" fill="#F0A92E"/>
<path d="M32.00,8.00 L39.35,23.89 L56.73,25.97 L43.89,37.86 L47.28,55.03 L32.00,46.50 L16.72,55.03 L20.11,37.86 L7.27,25.97 L24.65,23.89 Z" fill="none" stroke="#4A2C1D" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/>
<ellipse cx="27.5" cy="22" rx="2.4" ry="5" transform="rotate(20 27.5 22)" fill="#FFFFFF" fill-opacity="0.55"/>
<circle cx="28" cy="37" r="2" fill="#4A2C1D"/><circle cx="36" cy="37" r="2" fill="#4A2C1D"/>
<path d="M29.5 42 Q32 44.5 34.5 42" fill="none" stroke="#4A2C1D" stroke-width="2" stroke-linecap="round"/>
</svg>`,

  hud_serce: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M32 55 C13 42 6 30 9.5 20 C13 10.5 25.5 9 32 18.5 C38.5 9 51 10.5 54.5 20 C58 30 51 42 32 55 Z" fill="#F0625A" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M32 55 C45 46 53 36 54.5 26 C50 36 42 44 32 49 Z" fill="#D9473F"/>
<ellipse cx="19.5" cy="23" rx="4" ry="6.5" transform="rotate(-35 19.5 23)" fill="#FFFFFF" fill-opacity="0.55"/>
<circle cx="25.5" cy="16.5" r="1.8" fill="#FFFFFF" fill-opacity="0.55"/>
</svg>`,

  hud_seria_ogien: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M32 58 C17.5 58 11.5 48 12.5 38.5 C13.5 30 20 25.5 22 17 C26 20.5 27.5 24.5 27.5 28.5 C30.5 21 33 13 38.5 6 C40.5 16 48.5 22 51.5 32 C54.5 44 48 58 32 58 Z" fill="#F5873A" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M32 54.5 C25 54.5 21 49.5 22 43.5 C23 38 27.5 35.5 29 30 C33 33.5 35 37 35 40.5 C37 38.5 38.5 36 39.5 33.5 C43.5 38.5 44.5 44 43.5 48 C42.5 52 38.5 54.5 32 54.5 Z" fill="#FFC94A"/>
<path d="M32 53 C28.5 53 26.5 50.5 27 47.5 C27.5 44.5 30 43 31 40.5 C33.5 42.5 35 45 35.5 47 C36 50.5 34.5 53 32 53 Z" fill="#FFF1C9"/>
<ellipse cx="19" cy="40" rx="2.6" ry="5" transform="rotate(20 19 40)" fill="#FFFFFF" fill-opacity="0.55"/>
</svg>`,

  kraina_klodka: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M21 30 V21 A11 11 0 0 1 43 21 V30" fill="none" stroke="#4A2C1D" stroke-width="10" stroke-linecap="round"/>
<path d="M21 30 V21 A11 11 0 0 1 43 21 V30" fill="none" stroke="#D8CCBE" stroke-width="4.5" stroke-linecap="round"/>
<rect x="12" y="28" width="40" height="30" rx="8" fill="#C9B49A" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M12 48 H52 V50 A8 8 0 0 1 44 58 H20 A8 8 0 0 1 12 50 Z" fill="#B39C80"/>
<rect x="12" y="28" width="40" height="30" rx="8" fill="none" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<circle cx="32" cy="40" r="4.2" fill="#4A2C1D"/>
<path d="M30 42 L29 50 H35 L34 42 Z" fill="#4A2C1D"/>
<rect x="16.5" y="32" width="3.5" height="12" rx="1.75" fill="#FFFFFF" fill-opacity="0.55"/>
</svg>`,

  kraina_miasto_rytmu: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M13 7 L33 25" fill="none" stroke="#4A2C1D" stroke-width="9.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 7 L33 25" fill="none" stroke="#E9C08E" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M51 7 L31 25" fill="none" stroke="#4A2C1D" stroke-width="9.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M51 7 L31 25" fill="none" stroke="#E9C08E" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="12" cy="6" r="4" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<circle cx="52" cy="6" r="4" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M11 28 V48 C11 53 20.5 57 32 57 C43.5 57 53 53 53 48 V28" fill="#FFC94A" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M11 44 C11 49 20.5 53 32 53 C43.5 53 53 49 53 44 V48 C53 53 43.5 57 32 57 C20.5 57 11 53 11 48 Z" fill="#E8674F"/>
<path d="M11 31 C11 36 20.5 40 32 40 C43.5 40 53 36 53 31 V34 C53 39 43.5 43 32 43 C20.5 43 11 39 11 34 Z" fill="#E8674F"/>
<path d="M17 38.5 L23 50 L29 40.5 L35 51.5 L41 40.5 L47 50" fill="none" stroke="#FFF4E6" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M11 28 V48 C11 53 20.5 57 32 57 C43.5 57 53 53 53 48 V28" fill="none" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<ellipse cx="32" cy="28" rx="21" ry="8" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<ellipse cx="25" cy="26.5" rx="6" ry="2.2" fill="#FFFFFF"/>
</svg>`,

  kraina_pasmo_interwalow: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M4 54 L22 22 L30 34 L41 13 L60 54 Z" fill="#7FA7C9" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M41 13 L60 54 H47 L38 30 Z" fill="#6690B5"/>
<path d="M22 22 L30 34 L4 54 Z" fill="#6690B5" fill-opacity="0"/>
<path d="M16.5 32 L22 22 L27.5 30.5 L24 33 L21.5 30 L19 33.5 Z" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="2" stroke-linejoin="round"/>
<path d="M35 24.5 L41 13 L47.5 26.5 L44 29 L41 25.5 L38 28.5 Z" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="2" stroke-linejoin="round"/>
<path d="M4 54 L22 22 L30 34 L41 13 L60 54 Z" fill="none" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M13 47 Q24 38 32 44 T52 40" fill="none" stroke="#FFC94A" stroke-width="2.6" stroke-dasharray="0.1 5" stroke-linecap="round"/>
<path d="M44 4 V12" stroke="#4A2C1D" stroke-width="2.4" stroke-linecap="round"/>
<path d="M44 4 C46.5 5.5 49 6.5 48.5 10" fill="none" stroke="#4A2C1D" stroke-width="2.4" stroke-linecap="round"/>
<ellipse cx="41" cy="12.5" rx="3.6" ry="2.7" transform="rotate(-22 41 12.5)" fill="#4A2C1D"/>
</svg>`,

  kraina_przystan_taktow: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M16 51 L25 11 Q32 5 39 11 L48 51 Z" fill="#D98A4E" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M32 9 Q37 7.5 39 11 L48 51 H40 Z" fill="#C2733A"/>
<path d="M16 51 L25 11 Q32 5 39 11 L48 51 Z" fill="none" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M23 45 L28.5 16 H35.5 L41 45 Z" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="2.2" stroke-linejoin="round"/>
<path d="M32 19 V22 M32 26 V29 M32 33 V36" stroke="#D9B48E" stroke-width="2" stroke-linecap="round"/>
<path d="M32 42 L36.5 18.5" stroke="#4A2C1D" stroke-width="2.8" stroke-linecap="round"/>
<rect x="31.2" y="24.5" width="8.4" height="6.4" rx="2" transform="rotate(12 35.4 27.7)" fill="#FFC94A" stroke="#4A2C1D" stroke-width="2.2"/>
<circle cx="32" cy="42" r="2.6" fill="#4A2C1D"/>
<rect x="11" y="48.5" width="42" height="10" rx="4.5" fill="#8A5A3B" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M44 9 Q48.5 6 52 8.5 M46.5 15 Q50.5 13 54.5 15" fill="none" stroke="#FFF4E6" stroke-width="2.6" stroke-linecap="round"/>
</svg>`,

  kraina_zatoka_trojdzwiekow: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<rect x="11" y="15" width="42" height="25" rx="4" fill="#2E4A5E" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<rect x="15" y="19" width="7" height="16" rx="1.6" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="2"/>
<rect x="23.5" y="19" width="7" height="16" rx="1.6" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="2"/>
<rect x="32" y="19" width="7" height="16" rx="1.6" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="2"/>
<rect x="40.5" y="19" width="7" height="16" rx="1.6" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="2"/>
<rect x="20" y="19" width="5" height="9.5" rx="1.2" fill="#4A2C1D"/>
<rect x="36.5" y="19" width="5" height="9.5" rx="1.2" fill="#4A2C1D"/>
<path d="M4 47 Q14 41 24 47 T44 47 T60 43" fill="none" stroke="#457B9D" stroke-width="4.5" stroke-linecap="round"/>
<path d="M4 55 Q14 49 24 55 T44 55 T60 51" fill="none" stroke="#7FA7C9" stroke-width="4.5" stroke-linecap="round"/>
<ellipse cx="17.5" cy="22" rx="1.6" ry="4" fill="#FFFFFF" fill-opacity="0.6"/>
</svg>`,

  kraina_jaskinia_akordow: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M32 18 C27 9 15 10 8 18 C14 19 19 23 22 28 C16 30 8 30 4 40 C14 42 22 38 27 31 C28 35 28 39 28 43 L36 43 C36 39 36 35 37 31 C42 38 50 42 60 40 C56 30 48 30 42 28 C45 23 50 19 56 18 C49 10 37 9 32 18 Z" fill="#6F4E37" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<ellipse cx="27.5" cy="24.5" rx="2.3" ry="3.2" fill="#FFF4E6"/>
<ellipse cx="36.5" cy="24.5" rx="2.3" ry="3.2" fill="#FFF4E6"/>
<ellipse cx="27.5" cy="25.5" rx="1.2" ry="1.8" fill="#4A2C1D"/>
<ellipse cx="36.5" cy="25.5" rx="1.2" ry="1.8" fill="#4A2C1D"/>
<path d="M30.5 28 L32 31 L33.5 28 Z" fill="#4A2C1D"/>
<path d="M12 20 Q17 21.5 20.5 26" fill="none" stroke="#8A6A4D" stroke-width="2" stroke-linecap="round"/>
</svg>`,

  kraina_cytadela_dominant: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<rect x="16" y="26" width="32" height="30" rx="2" fill="#C9184A" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M16 26 V19 H21 V23 H27 V19 H37 V23 H43 V19 H48 V26 Z" fill="#C9184A" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<rect x="20" y="33" width="6.5" height="6.5" rx="1.3" fill="#FFE3B8" stroke="#4A2C1D" stroke-width="2"/>
<rect x="37.5" y="33" width="6.5" height="6.5" rx="1.3" fill="#FFE3B8" stroke="#4A2C1D" stroke-width="2"/>
<rect x="27" y="42" width="10" height="14" rx="3" fill="#8C0F35" stroke="#4A2C1D" stroke-width="2.4" stroke-linejoin="round"/>
<path d="M32 19 V9" stroke="#4A2C1D" stroke-width="2.6" stroke-linecap="round"/>
<path d="M32 9 L41 12.5 L32 16 Z" fill="#FFC94A" stroke="#4A2C1D" stroke-width="2" stroke-linejoin="round"/>
<rect x="16" y="26" width="32" height="30" rx="2" fill="none" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<rect x="19" y="29" width="3" height="10" rx="1.5" fill="#FFFFFF" fill-opacity="0.35"/>
</svg>`,

  kraina_labirynt_tonacji: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<circle cx="20" cy="20" r="13" fill="#8338EC" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<circle cx="20" cy="20" r="5.5" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="2.4"/>
<path d="M29 29 L52 52" stroke="#4A2C1D" stroke-width="7.5" stroke-linecap="round"/>
<path d="M29 29 L52 52" stroke="#8338EC" stroke-width="3.4" stroke-linecap="round"/>
<path d="M43.5 43.5 L50 37 M47.5 47.5 L54 41" stroke="#4A2C1D" stroke-width="5" stroke-linecap="round"/>
<path d="M43.5 43.5 L50 37 M47.5 47.5 L54 41" stroke="#8338EC" stroke-width="2.2" stroke-linecap="round"/>
<ellipse cx="15" cy="15" rx="2.6" ry="4.4" transform="rotate(-30 15 15)" fill="#FFFFFF" fill-opacity="0.5"/>
</svg>`,

  kraina_fabryka_budowania: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<rect x="7" y="49" width="50" height="9" rx="3" fill="#8A5A3B" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M18 49 V13" stroke="#4A2C1D" stroke-width="5" stroke-linecap="round"/>
<path d="M18 49 V13" stroke="#FB8500" stroke-width="2.6" stroke-linecap="round"/>
<path d="M18 15 L52 29" stroke="#4A2C1D" stroke-width="5" stroke-linecap="round"/>
<path d="M18 15 L52 29" stroke="#FB8500" stroke-width="2.6" stroke-linecap="round"/>
<path d="M18 23 L37 32" stroke="#4A2C1D" stroke-width="3" stroke-linecap="round"/>
<path d="M46 26 V39" stroke="#4A2C1D" stroke-width="3" stroke-linecap="round"/>
<rect x="40" y="39" width="12" height="9" rx="2" fill="#FFC94A" stroke="#4A2C1D" stroke-width="2.4" stroke-linejoin="round"/>
<circle cx="18" cy="13" r="3.6" fill="#FFE3B8" stroke="#4A2C1D" stroke-width="2"/>
</svg>`,

  kraina_gaj_grupowania: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<rect x="16" y="36" width="5.5" height="19" rx="2.2" fill="#4A2C1D"/>
<rect x="34" y="30" width="5.5" height="19" rx="2.2" fill="#4A2C1D"/>
<rect x="46" y="24" width="5.5" height="19" rx="2.2" fill="#4A2C1D"/>
<path d="M16 36 L51.5 24 V29.5 L16 41.5 Z" fill="#4A2C1D"/>
<path d="M16 44 L51.5 32 V36.5 L16 48.5 Z" fill="#4A2C1D"/>
<ellipse cx="16.8" cy="55.5" rx="6.8" ry="5" transform="rotate(-18 16.8 55.5)" fill="#588157" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round"/>
<ellipse cx="34.8" cy="49.5" rx="6.8" ry="5" transform="rotate(-18 34.8 49.5)" fill="#588157" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round"/>
<ellipse cx="46.8" cy="43.5" rx="6.8" ry="5" transform="rotate(-18 46.8 43.5)" fill="#588157" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round"/>
<path d="M8 14 C14 8 22 8 26 14 C20 15 16 19 15 25 C9 23 6 19 8 14 Z" fill="#588157" stroke="#4A2C1D" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M26 14 C22 15 17 18 15 24" fill="none" stroke="#3E6B3E" stroke-width="1.6" stroke-linecap="round"/>
</svg>`,

  kraina_szczyt_dyktand: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M4 52 L22 18 L32 34 L40 22 L60 52 Z" fill="#B9A0DD" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M40 22 L60 52 H46 L36 32 Z" fill="#9D4EDD"/>
<path d="M18 26 L22 18 L26.5 25 L23 27.5 Z" fill="#FFFFFF" stroke="#4A2C1D" stroke-width="2" stroke-linejoin="round"/>
<path d="M36 26 L40 22 L44.5 27 L41 29.5 Z" fill="#FFFFFF" stroke="#4A2C1D" stroke-width="2" stroke-linejoin="round"/>
<path d="M4 52 L22 18 L32 34 L40 22 L60 52 Z" fill="none" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M14 46 A18 18 0 0 1 50 46" fill="none" stroke="#4A2C1D" stroke-width="4.5" stroke-linecap="round"/>
<rect x="9" y="44" width="9" height="13" rx="4" fill="#FFC94A" stroke="#4A2C1D" stroke-width="2.6" stroke-linejoin="round"/>
<rect x="46" y="44" width="9" height="13" rx="4" fill="#FFC94A" stroke="#4A2C1D" stroke-width="2.6" stroke-linejoin="round"/>
</svg>`,

  kraina_zaczarowany_solfez: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<rect x="24" y="8" width="16" height="28" rx="8" fill="#E0AF68" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<rect x="27" y="13" width="4" height="18" rx="2" fill="#FFF4E6" fill-opacity="0.55"/>
<path d="M16 28 A16 16 0 0 0 48 28" fill="none" stroke="#4A2C1D" stroke-width="4.5" stroke-linecap="round"/>
<path d="M32 44 V54" stroke="#4A2C1D" stroke-width="4.5" stroke-linecap="round"/>
<path d="M22 56 H42" stroke="#4A2C1D" stroke-width="4.5" stroke-linecap="round"/>
<path d="M48 10 Q48.9 14.1 53 15 Q48.9 15.9 48 20 Q47.1 15.9 43 15 Q47.1 14.1 48 10 Z" fill="#FFC94A" stroke="#4A2C1D" stroke-width="1.8" stroke-linejoin="round"/>
<path d="M14 6 Q14.6 8.7 17.3 9.3 Q14.6 9.9 14 12.6 Q13.4 9.9 10.7 9.3 Q13.4 8.7 14 6 Z" fill="#FFC94A"/>
</svg>`,

  kraina_wioska_nut: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M25 44 V17 L50 10 V38" fill="none" stroke="#4A2C1D" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M23.5 15.5 L51.5 8 L51.5 16.5 L23.5 24 Z" fill="#5B3A29" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<ellipse cx="18.5" cy="46" rx="8.5" ry="6.3" transform="rotate(-22 18.5 46)" fill="#5B3A29" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<ellipse cx="43.5" cy="40" rx="8.5" ry="6.3" transform="rotate(-22 43.5 40)" fill="#5B3A29" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<ellipse cx="15.5" cy="44" rx="3" ry="1.8" transform="rotate(-22 15.5 44)" fill="#FFFFFF" fill-opacity="0.5"/>
<ellipse cx="40.5" cy="38" rx="3" ry="1.8" transform="rotate(-22 40.5 38)" fill="#FFFFFF" fill-opacity="0.5"/>
<path d="M12 16 Q12.72 19.28 16 20 Q12.72 20.72 12 24 Q11.28 20.72 8 20 Q11.28 19.28 12 16 Z" fill="#FFF4E6"/>
<path d="M56 49 Q56.54 51.46 59 52 Q56.54 52.54 56 55 Q55.46 52.54 53 52 Q55.46 51.46 56 49 Z" fill="#FFF4E6"/>
</svg>`,

  nav_kalendarz: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<rect x="8" y="13" width="48" height="44" rx="9" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M8 22 A9 9 0 0 1 17 13 H47 A9 9 0 0 1 56 22 V27 H8 Z" fill="#E8674F"/>
<rect x="8" y="13" width="48" height="44" rx="9" fill="none" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M8 27 H56" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M21 8 V17" fill="none" stroke="#4A2C1D" stroke-width="7.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 8 V17" fill="none" stroke="#D8CCBE" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M43 8 V17" fill="none" stroke="#4A2C1D" stroke-width="7.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M43 8 V17" fill="none" stroke="#D8CCBE" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
<rect x="15" y="33" width="8" height="7" rx="2.2" fill="#E9D9C4"/>
<rect x="28" y="33" width="8" height="7" rx="2.2" fill="#E9D9C4"/>
<rect x="41" y="33" width="8" height="7" rx="2.2" fill="#E9D9C4"/>
<rect x="15" y="45" width="8" height="7" rx="2.2" fill="#E9D9C4"/>
<rect x="41" y="45" width="8" height="7" rx="2.2" fill="#E9D9C4"/>
<rect x="26.5" y="43.5" width="11" height="10" rx="3" fill="#2FA08E" stroke="#4A2C1D" stroke-width="2.2"/>
<path d="M29 48.5 L31.3 51 L35.5 46" fill="none" stroke="#FFF4E6" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,

  nav_mapa_krain: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M7 16 L23 10 L41 16 L57 10 V48 L41 54 L23 48 L7 54 Z" fill="#FFE3B8" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M23 10 L41 16 V54 L23 48 Z" fill="#FFCF8C"/>
<path d="M7 16 L23 10 L41 16 L57 10 V48 L41 54 L23 48 L7 54 Z M23 10 V48 M41 16 V54" fill="none" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M13 45 Q19 34 28 38 T42 30" fill="none" stroke="#2FA08E" stroke-width="2.6" stroke-dasharray="0.1 5" stroke-linecap="round"/>
<path d="M46 35 C41 29 39 25.5 39 22.5 A7 7 0 0 1 53 22.5 C53 25.5 51 29 46 35 Z" fill="#E8674F" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<circle cx="46" cy="22.5" r="2.6" fill="#FFF4E6"/>
<path d="M11 21 L15 25 M15 21 L11 25" stroke="#E8674F" stroke-width="2.4" stroke-linecap="round"/>
</svg>`,

  nav_misje: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<circle cx="29" cy="35" r="23" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<circle cx="29" cy="35" r="16" fill="#E8674F"/>
<circle cx="29" cy="35" r="9.5" fill="#FFF4E6"/>
<circle cx="29" cy="35" r="4" fill="#E8674F"/>
<circle cx="29" cy="35" r="23" fill="none" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M30 34 L50 14" fill="none" stroke="#4A2C1D" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><path d="M30 34 L50 14" fill="none" stroke="#8A5A3B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M47 9 L52 4 L53.5 10.5 L60 12 L55 17 L50 16 L48 14 Z" fill="#2FA08E" stroke="#4A2C1D" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>
<ellipse cx="17" cy="24" rx="2.5" ry="5" transform="rotate(40 17 24)" fill="#FFFFFF" fill-opacity="0.55"/>
</svg>`,

  nav_subskrypcja: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M18 13 H46 L57 26 L32 57 L7 26 Z" fill="#6EC3EE" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M18 13 H46 L57 26 H7 Z" fill="#A9E0F8"/>
<path d="M24 26 L32 57 L40 26 Z" fill="#8FD3F4"/>
<path d="M40 26 L57 26 L32 57 Z" fill="#4FA9DD"/>
<path d="M18 13 H46 L57 26 L32 57 L7 26 Z M7 26 H57 M18 13 L24 26 L32 13 L40 26 L46 13 M24 26 L32 57 L40 26" fill="none" stroke="#4A2C1D" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M14 22 L18.5 17" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round"/>
<path d="M54 3.5 Q54.81 7.19 58.5 8 Q54.81 8.81 54 12.5 Q53.19 8.81 49.5 8 Q53.19 7.19 54 3.5 Z" fill="#FFC94A"/>
<path d="M9 46.5 Q9.63 49.37 12.5 50 Q9.63 50.63 9 53.5 Q8.37 50.63 5.5 50 Q8.37 49.37 9 46.5 Z" fill="#FFC94A"/>
</svg>`,

  nav_ustawienia: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M50.71,26.52 L57.83,29.02 L57.83,34.98 L50.71,37.48 L49.11,41.36 L52.37,48.16 L48.16,52.37 L41.36,49.11 L37.48,50.71 L34.98,57.83 L29.02,57.83 L26.52,50.71 L22.64,49.11 L15.84,52.37 L11.63,48.16 L14.89,41.36 L13.29,37.48 L6.17,34.98 L6.17,29.02 L13.29,26.52 L14.89,22.64 L11.63,15.84 L15.84,11.63 L22.64,14.89 L26.52,13.29 L29.02,6.17 L34.98,6.17 L37.48,13.29 L41.36,14.89 L48.16,11.63 L52.37,15.84 L49.11,22.64 Z" fill="#B9AEA2" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<circle cx="32" cy="32" r="12" fill="#9E9185"/>
<circle cx="32" cy="32" r="7.5" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M14 24 A19 19 0 0 1 24 14" fill="none" stroke="#FFFFFF" stroke-opacity="0.6" stroke-width="3" stroke-linecap="round"/>
</svg>`,
} as const;

export type IconName = keyof typeof ICONS;
