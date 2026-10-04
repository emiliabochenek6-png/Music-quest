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
<path d="M23 6 V42" stroke="#4A2C1D" stroke-width="5.5" stroke-linecap="round"/>
<path d="M23 6 V42" stroke="#8338EC" stroke-width="2.6" stroke-linecap="round"/>
<path d="M23 23 C33.5 23 37.5 29.5 33.5 35.5 C30.5 39.5 24.5 39.5 23 35.5 Z" fill="#8338EC" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M41 13 V44" stroke="#4A2C1D" stroke-width="4.5" stroke-linecap="round"/>
<path d="M41 13 V44" stroke="#8338EC" stroke-width="2" stroke-linecap="round"/>
<path d="M41 27 C48.5 27 51.5 32 48.5 37 C46 40 41.5 40 41 37 Z" fill="#8338EC" stroke="#4A2C1D" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>
<ellipse cx="26.5" cy="27" rx="2" ry="3.2" transform="rotate(-25 26.5 27)" fill="#FFFFFF" fill-opacity="0.5"/>
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
<rect x="23" y="16" width="5.5" height="35" rx="2.4" fill="#4A2C1D"/>
<rect x="43" y="9" width="5.5" height="36" rx="2.4" fill="#4A2C1D"/>
<path d="M23 16 L48.5 9 V15.5 L23 22.5 Z" fill="#4A2C1D"/>
<ellipse cx="17.5" cy="52.5" rx="9.5" ry="7" transform="rotate(-15 17.5 52.5)" fill="#588157" stroke="#4A2C1D" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round"/>
<ellipse cx="37.5" cy="45.5" rx="9.5" ry="7" transform="rotate(-15 37.5 45.5)" fill="#588157" stroke="#4A2C1D" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M48.5 9 C53 4 59 5.5 60.5 10.5 C56.5 10.5 53.5 13.5 52.5 17.5 C49.5 15.5 47.5 12.5 48.5 9 Z" fill="#588157" stroke="#4A2C1D" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>
<ellipse cx="15" cy="49.5" rx="2" ry="1.3" transform="rotate(-15 15 49.5)" fill="#FFFFFF" fill-opacity="0.5"/>
</svg>`,

  kraina_szczyt_dyktand: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M4 54 L22 16 L32 34 L40 20 L60 54 Z" fill="#B9A0DD" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M40 20 L60 54 H46 L36 32 Z" fill="#9D4EDD"/>
<path d="M18 25 L22 16 L27 24 L23 27 Z" fill="#FFFFFF" stroke="#4A2C1D" stroke-width="2" stroke-linejoin="round"/>
<path d="M36 25 L40 20 L45 26 L41 29 Z" fill="#FFFFFF" stroke="#4A2C1D" stroke-width="2" stroke-linejoin="round"/>
<path d="M4 54 L22 16 L32 34 L40 20 L60 54 Z" fill="none" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
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

  kraina_krolestwo_instrumentow: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M6 57 L58 30" fill="none" stroke="#4A2C1D" stroke-width="5.5" stroke-linecap="round"/>
<path d="M6 57 L58 30" fill="none" stroke="#F3D9A8" stroke-width="2.2" stroke-linecap="round"/>
<path d="M6 57 L13 53.4" fill="none" stroke="#4A2C1D" stroke-width="5.5" stroke-linecap="round"/>
<path d="M6 57 L13 53.4" fill="none" stroke="#8B5A2B" stroke-width="2.4" stroke-linecap="round"/>
<path d="M32 21 C24 21 20.5 25 21.5 30 C22 33 24.5 34 24.5 36 C24.5 38 20.5 40 20.5 46 C20.5 54 25.5 58 32 58 C38.5 58 43.5 54 43.5 46 C43.5 40 39.5 38 39.5 36 C39.5 34 42 33 42.5 30 C43.5 25 40 21 32 21 Z" fill="#D98A45" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M32 39 C38 39 43 39.5 43.5 46 C43.5 54 38.5 58 32 58 C25.5 58 20.5 54 20.5 46 C20.5 39.5 26 39 32 39 Z" fill="#B8692E" opacity="0.55"/>
<rect x="30" y="12" width="4" height="22" rx="1.5" fill="#5B3A29" stroke="#4A2C1D" stroke-width="2.2" stroke-linejoin="round"/>
<path d="M27 42.5 C26 45 28 46.5 27 50" fill="none" stroke="#4A2C1D" stroke-width="2.2" stroke-linecap="round"/>
<path d="M37 42.5 C38 45 36 46.5 37 50" fill="none" stroke="#4A2C1D" stroke-width="2.2" stroke-linecap="round"/>
<rect x="27.5" y="47" width="9" height="2.4" rx="1" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="1.4"/>
<path d="M30 52 H34 L33.2 56.6 H30.8 Z" fill="#4A2C1D"/>
<path d="M23.5 11.5 L22 2.5 L27.5 7 L32 1.5 L36.5 7 L42 2.5 L40.5 11.5 Z" fill="#FFC94A" stroke="#4A2C1D" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>
<circle cx="22" cy="3" r="1.6" fill="#E8674F" stroke="#4A2C1D" stroke-width="1.2"/>
<circle cx="32" cy="2.2" r="1.6" fill="#E8674F" stroke="#4A2C1D" stroke-width="1.2"/>
<circle cx="42" cy="3" r="1.6" fill="#E8674F" stroke="#4A2C1D" stroke-width="1.2"/>
<path d="M26.5 23.5 C23.5 25 22.8 28 23.5 30" fill="none" stroke="#FFFFFF" stroke-opacity="0.6" stroke-width="2.4" stroke-linecap="round"/>
<path d="M54 12 Q54.9 16.1 59 17 Q54.9 17.9 54 22 Q53.1 17.9 49 17 Q53.1 16.1 54 12 Z" fill="#FFC94A" stroke="#4A2C1D" stroke-width="1.8" stroke-linejoin="round"/>
<path d="M10 20 Q10.6 22.7 13.3 23.3 Q10.6 23.9 10 26.6 Q9.4 23.9 6.7 23.3 Q9.4 22.7 10 20 Z" fill="#FFC94A"/>
</svg>`,

  instrument_skrzypce: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M7 58 L57 24" fill="none" stroke="#4A2C1D" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 58 L57 24" fill="none" stroke="#F3D9A8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 58 L14 53.5" fill="none" stroke="#4A2C1D" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 58 L14 53.5" fill="none" stroke="#8B5A2B" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M32 20 C24 20 20.5 24 21.5 29 C22 32 24.5 33 24.5 35 C24.5 37 20.5 39 20.5 45 C20.5 54 25.5 58 32 58 C38.5 58 43.5 54 43.5 45 C43.5 39 39.5 37 39.5 35 C39.5 33 42 32 42.5 29 C43.5 24 40 20 32 20 Z" fill="#D98A45" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round"/><path d="M32 39 C38 39 43.5 39.5 43.5 45 C43.5 54 38.5 58 32 58 C25.5 58 20.5 54 20.5 45 C20.5 39.5 26 39 32 39 Z" fill="#B8692E" opacity="0.5"/><rect x="30" y="9" width="4" height="22" rx="1.5" fill="#5B3A29" stroke="#4A2C1D" stroke-width="2.2"/><circle cx="32" cy="6" r="3.6" fill="#5B3A29" stroke="#4A2C1D" stroke-width="2.2"/><path d="M27 42 C26 45.0 28 47.0 27 50" fill="none" stroke="#4A2C1D" stroke-width="2.2" stroke-linecap="round"/><path d="M37 42 C38 45.0 36 47.0 37 50" fill="none" stroke="#4A2C1D" stroke-width="2.2" stroke-linecap="round"/><rect x="27.5" y="47" width="9" height="2.4" rx="1" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="1.4"/><path d="M30 52 H34 L33.2 56.6 H30.8 Z" fill="#4A2C1D"/><path d="M26.5 23.5 C23.5 25 22.8 28 23.5 30" fill="none" stroke="#FFFFFF" stroke-opacity="0.6" stroke-width="2.4" stroke-linecap="round"/>
</svg>`,

  instrument_wiolonczela: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M32 60 V63" stroke="#4A2C1D" stroke-width="3" stroke-linecap="round"/><path d="M32 21 C22 21 17 26 18.5 32 C19.2 35 22.5 36 22.5 38.5 C22.5 41 17 43 17 49.5 C17 57 23.5 60 32 60 C40.5 60 47 57 47 49.5 C47 43 41.5 41 41.5 38.5 C41.5 36 44.8 35 45.5 32 C47 26 42 21 32 21 Z" fill="#C46F3A" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round"/><path d="M32 41 C40 41 47 41.5 47 49.5 C47 57 40.5 60 32 60 C23.5 60 17 57 17 49.5 C17 41.5 24 41 32 41 Z" fill="#8B4A22" opacity="0.45"/><rect x="30" y="7" width="4" height="16" rx="1.5" fill="#5B3A29" stroke="#4A2C1D" stroke-width="2.2"/><path d="M30 7 C26 4 26 0.5 31 1.2 C34 1.6 34 5 32 6" fill="#5B3A29" stroke="#4A2C1D" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M27 44 C26 47.0 28 49.0 27 52" fill="none" stroke="#4A2C1D" stroke-width="2.2" stroke-linecap="round"/><path d="M37 44 C38 47.0 36 49.0 37 52" fill="none" stroke="#4A2C1D" stroke-width="2.2" stroke-linecap="round"/><rect x="27" y="49.5" width="10" height="2.4" rx="1" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="1.4"/><path d="M21.5 25 C19 27 19 30 19.8 32" fill="none" stroke="#FFFFFF" stroke-opacity="0.55" stroke-width="2.4" stroke-linecap="round"/>
</svg>`,

  instrument_kontrabas: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M32 60 V63" stroke="#4A2C1D" stroke-width="3" stroke-linecap="round"/><path d="M32 24 C25 24 19 27 16.5 32 C15 35.5 19.5 37 21 39.5 C22.5 42 16 44 16 50 C16 57 23 60 32 60 C41 60 48 57 48 50 C48 44 41.5 42 43 39.5 C44.5 37 49 35.5 47.5 32 C45 27 39 24 32 24 Z" fill="#8E4A2B" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round"/><path d="M32 42 C41 42 48 42.5 48 50 C48 57 41 60 32 60 C23 60 16 57 16 50 C16 42.5 23 42 32 42 Z" fill="#5E2E18" opacity="0.5"/><rect x="30" y="10" width="4" height="16" rx="1.5" fill="#3B2A22" stroke="#4A2C1D" stroke-width="2.2"/><rect x="26.5" y="3" width="11" height="9" rx="3" fill="#5B3A29" stroke="#4A2C1D" stroke-width="2.4"/><path d="M24 5.5 H26.5 M24 9 H26.5 M37.5 5.5 H40 M37.5 9 H40" stroke="#4A2C1D" stroke-width="2.2" stroke-linecap="round"/><path d="M27 45 C26 48.0 28 50.0 27 53" fill="none" stroke="#4A2C1D" stroke-width="2.2" stroke-linecap="round"/><path d="M37 45 C38 48.0 36 50.0 37 53" fill="none" stroke="#4A2C1D" stroke-width="2.2" stroke-linecap="round"/><rect x="26.5" y="50.5" width="11" height="2.4" rx="1" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="1.4"/><path d="M22 28 C19.5 30 19 33 19.8 35" fill="none" stroke="#FFFFFF" stroke-opacity="0.5" stroke-width="2.4" stroke-linecap="round"/>
</svg>`,

  instrument_harfa: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M14 57 L30 10" fill="none" stroke="#4A2C1D" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><path d="M30 10 C39 6 49 9 51 19 V57" fill="none" stroke="#4A2C1D" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 57 H51" fill="none" stroke="#4A2C1D" stroke-width="9" stroke-linecap="round"/><path d="M14 57 L30 10 C39 6 49 9 51 19 V57 Z" fill="#FFF4E6" opacity="0.35"/><path d="M14 57 L30 10" fill="none" stroke="#E9A82F" stroke-width="4.2" stroke-linecap="round"/><path d="M30 10 C39 6 49 9 51 19 V57" fill="none" stroke="#FFC94A" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 57 H51" fill="none" stroke="#E9A82F" stroke-width="4.2" stroke-linecap="round"/><path d="M33 13 L21.5 54" stroke="#4A2C1D" stroke-width="2.2" stroke-linecap="round"/><path d="M37 13 L28.5 54" stroke="#4A2C1D" stroke-width="2.2" stroke-linecap="round"/><path d="M41 14.5 L35.5 54" stroke="#4A2C1D" stroke-width="2.2" stroke-linecap="round"/><path d="M45 16.5 L42.5 54" stroke="#4A2C1D" stroke-width="2.2" stroke-linecap="round"/><path d="M48.5 19 L49 54" stroke="#4A2C1D" stroke-width="2.2" stroke-linecap="round"/><path d="M10 12.4 Q10.45 15.55 13.6 16 Q10.45 16.45 10 19.6 Q9.55 16.45 6.4 16 Q9.55 15.55 10 12.4 Z" fill="#FFC94A"/>
</svg>`,

  instrument_flet: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M9 54 L55 12" fill="none" stroke="#4A2C1D" stroke-width="9.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 54 L55 12" fill="none" stroke="#D9DEE6" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 54 L14 49.5" stroke="#4A2C1D" stroke-width="9.5" stroke-linecap="round"/><path d="M9 54 L14 49.5" stroke="#A9B3C2" stroke-width="5" stroke-linecap="round"/><ellipse cx="19.5" cy="45" rx="2.6" ry="1.8" transform="rotate(-42 19.5 45)" fill="#4A2C1D"/><circle cx="26" cy="40" r="1.9" fill="#E9EDF3" stroke="#4A2C1D" stroke-width="1.4"/><circle cx="31.5" cy="35.5" r="1.9" fill="#E9EDF3" stroke="#4A2C1D" stroke-width="1.4"/><circle cx="37" cy="30.5" r="1.9" fill="#E9EDF3" stroke="#4A2C1D" stroke-width="1.4"/><circle cx="42.5" cy="25.5" r="1.9" fill="#E9EDF3" stroke="#4A2C1D" stroke-width="1.4"/><circle cx="48" cy="20.5" r="1.9" fill="#E9EDF3" stroke="#4A2C1D" stroke-width="1.4"/><path d="M15.5 40 L48 11" stroke="#FFFFFF" stroke-opacity="0.65" stroke-width="1.6" stroke-linecap="round"/><path d="M50 46.0 Q50.5 49.5 54.0 50 Q50.5 50.5 50 54.0 Q49.5 50.5 46.0 50 Q49.5 49.5 50 46.0 Z" fill="#FFC94A"/><path d="M12 18.8 Q12.4 21.6 15.2 22 Q12.4 22.4 12 25.2 Q11.6 22.4 8.8 22 Q11.6 21.6 12 18.8 Z" fill="#FFC94A"/>
</svg>`,

  instrument_oboj: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M32 3 L32 10" stroke="#4A2C1D" stroke-width="5" stroke-linecap="round"/><path d="M32 3 L32 10" stroke="#F3D9A8" stroke-width="2" stroke-linecap="round"/><path d="M28.6 10 H35.4 L36.4 46 L38.5 57 H25.5 L27.6 46 Z" fill="#6B4129" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round"/><path d="M26.3 54 H37.7" stroke="#4A2C1D" stroke-width="2" stroke-linecap="round"/><ellipse cx="32" cy="57" rx="6.5" ry="2.2" fill="#2B1810" stroke="#4A2C1D" stroke-width="2.2"/><circle cx="32" cy="16" r="1.9" fill="#E9EDF3" stroke="#4A2C1D" stroke-width="1.4"/><circle cx="32" cy="22" r="1.9" fill="#E9EDF3" stroke="#4A2C1D" stroke-width="1.4"/><circle cx="32" cy="28" r="1.9" fill="#E9EDF3" stroke="#4A2C1D" stroke-width="1.4"/><circle cx="32" cy="34" r="1.9" fill="#E9EDF3" stroke="#4A2C1D" stroke-width="1.4"/><circle cx="32" cy="40" r="1.9" fill="#E9EDF3" stroke="#4A2C1D" stroke-width="1.4"/><path d="M29.6 12 V44" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="1.6" stroke-linecap="round"/><path d="M50 14.4 Q50.45 17.55 53.6 18 Q50.45 18.45 50 21.6 Q49.55 18.45 46.4 18 Q49.55 17.55 50 14.4 Z" fill="#FFC94A"/><path d="M14 37.2 Q14.35 39.65 16.8 40 Q14.35 40.35 14 42.8 Q13.65 40.35 11.2 40 Q13.65 39.65 14 37.2 Z" fill="#FFC94A"/>
</svg>`,

  instrument_klarnet: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M25 6 L33 4 L36 9 L28 13 Z" fill="#2E2A3A" stroke="#4A2C1D" stroke-width="2.4" stroke-linejoin="round"/><path d="M28.5 8.5 L34 6" stroke="#F3D9A8" stroke-width="1.6" stroke-linecap="round"/><path d="M28.6 12 H35.4 L36 46 L41 57 H23 L28 46 Z" fill="#3B3340" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round"/><path d="M26 54 H38" stroke="#4A2C1D" stroke-width="2" stroke-linecap="round"/><ellipse cx="32" cy="57" rx="9" ry="2.6" fill="#1F1A24" stroke="#4A2C1D" stroke-width="2.2"/><path d="M27.5 24 H36.5 M27.5 33 H36.5 M27.5 42 H36.5" stroke="#C9CFD8" stroke-width="2.2" stroke-linecap="round"/><circle cx="32" cy="18" r="1.9" fill="#E9EDF3" stroke="#4A2C1D" stroke-width="1.4"/><circle cx="32" cy="28.5" r="1.9" fill="#E9EDF3" stroke="#4A2C1D" stroke-width="1.4"/><circle cx="32" cy="37.5" r="1.9" fill="#E9EDF3" stroke="#4A2C1D" stroke-width="1.4"/><path d="M29.8 14 V44" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="1.6" stroke-linecap="round"/><path d="M51 20.4 Q51.45 23.55 54.6 24 Q51.45 24.45 51 27.6 Q50.55 24.45 47.4 24 Q50.55 23.55 51 20.4 Z" fill="#FFC94A"/><path d="M13 31.2 Q13.35 33.65 15.8 34 Q13.35 34.35 13 36.8 Q12.65 34.35 10.2 34 Q12.65 33.65 13 31.2 Z" fill="#FFC94A"/>
</svg>`,

  instrument_fagot: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M24 22 C24 11 15 8 9 12" fill="none" stroke="#4A2C1D" stroke-width="6" stroke-linecap="round"/><path d="M24 22 C24 11 15 8 9 12" fill="none" stroke="#C9CFD8" stroke-width="2.6" stroke-linecap="round"/><path d="M24 24 V50 C24 58 40 58 40 50 V13" fill="none" stroke="#4A2C1D" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 24 V50 C24 58 40 58 40 50 V13" fill="none" stroke="#B7692E" stroke-width="6.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M36.2 7 H43.8 L45 13 H35 Z" fill="#8B5A2B" stroke="#4A2C1D" stroke-width="2.4" stroke-linejoin="round"/><circle cx="24" cy="30" r="1.7" fill="#E9EDF3" stroke="#4A2C1D" stroke-width="1.4"/><circle cx="24" cy="38" r="1.7" fill="#E9EDF3" stroke="#4A2C1D" stroke-width="1.4"/><circle cx="24" cy="45" r="1.7" fill="#E9EDF3" stroke="#4A2C1D" stroke-width="1.4"/><circle cx="40" cy="22" r="1.7" fill="#E9EDF3" stroke="#4A2C1D" stroke-width="1.4"/><circle cx="40" cy="31" r="1.7" fill="#E9EDF3" stroke="#4A2C1D" stroke-width="1.4"/><circle cx="40" cy="40" r="1.7" fill="#E9EDF3" stroke="#4A2C1D" stroke-width="1.4"/><path d="M21.8 26 V48" stroke="#FFFFFF" stroke-opacity="0.35" stroke-width="1.5" stroke-linecap="round"/><path d="M52 28.4 Q52.45 31.55 55.6 32 Q52.45 32.45 52 35.6 Q51.55 32.45 48.4 32 Q51.55 31.55 52 28.4 Z" fill="#FFC94A"/><path d="M11 37.2 Q11.35 39.65 13.8 40 Q11.35 40.35 11 42.8 Q10.65 40.35 8.2 40 Q10.65 39.65 11 37.2 Z" fill="#FFC94A"/>
</svg>`,

  instrument_saksofon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M15 8 L21 12" stroke="#4A2C1D" stroke-width="6" stroke-linecap="round"/><path d="M15 8 L21 12" stroke="#2E2A3A" stroke-width="2.6" stroke-linecap="round"/><path d="M20 12 C28 8 32 13 32 20 V42 C32 53 46 53 46 41" fill="none" stroke="#4A2C1D" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 12 C28 8 32 13 32 20 V42 C32 53 46 53 46 41" fill="none" stroke="#F2B63A" stroke-width="5.4" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="46" cy="38" rx="8" ry="3.6" fill="#FFC94A" stroke="#4A2C1D" stroke-width="2.6"/><ellipse cx="46" cy="38" rx="5.4" ry="1.9" fill="#8B5A2B"/><circle cx="32" cy="22" r="1.8" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="1.4"/><circle cx="32" cy="29" r="1.8" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="1.4"/><circle cx="32" cy="36" r="1.8" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="1.4"/><path d="M30 16 V44" stroke="#FFFFFF" stroke-opacity="0.55" stroke-width="1.6" stroke-linecap="round"/><path d="M52 12.4 Q52.45 15.55 55.6 16 Q52.45 16.45 52 19.6 Q51.55 16.45 48.4 16 Q51.55 15.55 52 12.4 Z" fill="#FFC94A"/><path d="M12 33.2 Q12.35 35.65 14.8 36 Q12.35 36.35 12 38.8 Q11.65 36.35 9.2 36 Q11.65 35.65 12 33.2 Z" fill="#FFC94A"/>
</svg>`,

  instrument_dyrygent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M13 53 L51 13" fill="none" stroke="#4A2C1D" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 53 L51 13" fill="none" stroke="#FFF4E6" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 53 L19 46.5" stroke="#4A2C1D" stroke-width="8" stroke-linecap="round"/><path d="M13 53 L19 46.5" stroke="#C9884A" stroke-width="4.4" stroke-linecap="round"/><path d="M8 22 C12 12 20 8 29 9" fill="none" stroke="#FFC94A" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="1 5"/><path d="M44 51 C52 49 56 42 56 34" fill="none" stroke="#FFC94A" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="1 5"/><path d="M52 4.8 Q52.65 9.35 57.2 10 Q52.65 10.65 52 15.2 Q51.35 10.65 46.8 10 Q51.35 9.35 52 4.8 Z" fill="#FFC94A"/><path d="M10 36.0 Q10.5 39.5 14.0 40 Q10.5 40.5 10 44.0 Q9.5 40.5 6.0 40 Q9.5 39.5 10 36.0 Z" fill="#FFC94A"/><path d="M38 40.8 Q38.4 43.6 41.2 44 Q38.4 44.4 38 47.2 Q37.6 44.4 34.8 44 Q37.6 43.6 38 40.8 Z" fill="#FFC94A"/>
</svg>`,

  instrument_trabka: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M14 24 H44" stroke="#4A2C1D" stroke-width="8" stroke-linecap="round"/><path d="M14 24 H44" stroke="#F2B63A" stroke-width="4" stroke-linecap="round"/><path d="M20 24 V36 C20 41 24 41 24 36 V32 H44 C48 32 48 24 44 24" fill="none" stroke="#4A2C1D" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 24 V36 C20 41 24 41 24 36 V32 H44 C48 32 48 24 44 24" fill="none" stroke="#F2B63A" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M44 20 L58 12 V44 L44 36 Z" fill="#FFC94A" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round"/><path d="M50 18 V38" stroke="#FFFFFF" stroke-opacity="0.55" stroke-width="2" stroke-linecap="round"/><path d="M6 24 H14" stroke="#4A2C1D" stroke-width="6" stroke-linecap="round"/><path d="M6 24 H14" stroke="#C9CFD8" stroke-width="2.6" stroke-linecap="round"/><path d="M26 24 V15" stroke="#4A2C1D" stroke-width="2.6" stroke-linecap="round"/><circle cx="26" cy="14" r="2.6" fill="#E9EDF3" stroke="#4A2C1D" stroke-width="1.8"/><path d="M32 24 V15" stroke="#4A2C1D" stroke-width="2.6" stroke-linecap="round"/><circle cx="32" cy="14" r="2.6" fill="#E9EDF3" stroke="#4A2C1D" stroke-width="1.8"/><path d="M38 24 V15" stroke="#4A2C1D" stroke-width="2.6" stroke-linecap="round"/><circle cx="38" cy="14" r="2.6" fill="#E9EDF3" stroke="#4A2C1D" stroke-width="1.8"/><path d="M14 46.4 Q14.45 49.55 17.6 50 Q14.45 50.45 14 53.6 Q13.55 50.45 10.4 50 Q13.55 49.55 14 46.4 Z" fill="#FFC94A"/><path d="M54 50.8 Q54.4 53.6 57.2 54 Q54.4 54.4 54 57.2 Q53.6 54.4 50.8 54 Q53.6 53.6 54 50.8 Z" fill="#FFC94A"/>
</svg>`,

  instrument_werbel: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M10 6 L36 24" fill="none" stroke="#4A2C1D" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 6 L36 24" fill="none" stroke="#F3D9A8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M54 6 L28 24" fill="none" stroke="#4A2C1D" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M54 6 L28 24" fill="none" stroke="#F3D9A8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 28 V48 C12 53 20 57 32 57 C44 57 52 53 52 48 V28" fill="#E8674F" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round"/><path d="M12 44 C12 49 20 53 32 53 C44 53 52 49 52 44 V48 C52 53 44 57 32 57 C20 57 12 53 12 48 Z" fill="#B8452F"/><ellipse cx="32" cy="28" rx="20" ry="6.5" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="3"/><path d="M12 28 V31 C12 35 20 38 32 38 C44 38 52 35 52 31 V28" fill="none" stroke="#C9CFD8" stroke-width="2.4"/><path d="M20 33 V50" stroke="#C9CFD8" stroke-width="2.4" stroke-linecap="round"/><path d="M32 33 V50" stroke="#C9CFD8" stroke-width="2.4" stroke-linecap="round"/><path d="M44 33 V50" stroke="#C9CFD8" stroke-width="2.4" stroke-linecap="round"/><path d="M14 40 V47" stroke="#FFFFFF" stroke-opacity="0.45" stroke-width="2.2" stroke-linecap="round"/><path d="M8 46.8 Q8.4 49.6 11.2 50 Q8.4 50.4 8 53.2 Q7.6 50.4 4.8 50 Q7.6 49.6 8 46.8 Z" fill="#FFC94A"/><path d="M57 40.8 Q57.4 43.6 60.2 44 Q57.4 44.4 57 47.2 Q56.6 44.4 53.8 44 Q56.6 43.6 57 40.8 Z" fill="#FFC94A"/>
</svg>`,

  instrument_rog: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<circle cx="27" cy="35" r="18" fill="none" stroke="#4A2C1D" stroke-width="9.5"/><circle cx="27" cy="35" r="18" fill="none" stroke="#F2B63A" stroke-width="5"/><circle cx="27" cy="35" r="9" fill="none" stroke="#4A2C1D" stroke-width="8"/><circle cx="27" cy="35" r="9" fill="none" stroke="#FFC94A" stroke-width="3.8"/><path d="M41 24 C47 20 53 22 59 12 L61 46 C54 40 47 44 42 42 Z" fill="#FFC94A" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round"/><path d="M55 17 L56 40" stroke="#FFFFFF" stroke-opacity="0.55" stroke-width="2" stroke-linecap="round"/><path d="M12 22 L6 14" stroke="#4A2C1D" stroke-width="6" stroke-linecap="round"/><path d="M12 22 L6 14" stroke="#C9CFD8" stroke-width="2.6" stroke-linecap="round"/><path d="M20 8 H32" stroke="#4A2C1D" stroke-width="2.6" stroke-linecap="round"/><path d="M21 18 V10" stroke="#4A2C1D" stroke-width="2.6" stroke-linecap="round"/><circle cx="21" cy="9" r="2.4" fill="#E9EDF3" stroke="#4A2C1D" stroke-width="1.6"/><path d="M27 18 V10" stroke="#4A2C1D" stroke-width="2.6" stroke-linecap="round"/><circle cx="27" cy="9" r="2.4" fill="#E9EDF3" stroke="#4A2C1D" stroke-width="1.6"/><path d="M33 18 V10" stroke="#4A2C1D" stroke-width="2.6" stroke-linecap="round"/><circle cx="33" cy="9" r="2.4" fill="#E9EDF3" stroke="#4A2C1D" stroke-width="1.6"/><path d="M52 52.8 Q52.4 55.6 55.2 56 Q52.4 56.4 52 59.2 Q51.6 56.4 48.8 56 Q51.6 55.6 52 52.8 Z" fill="#FFC94A"/><path d="M8 50.8 Q8.4 53.6 11.2 54 Q8.4 54.4 8 57.2 Q7.6 54.4 4.8 54 Q7.6 53.6 8 50.8 Z" fill="#FFC94A"/>
</svg>`,

  instrument_puzon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M16 22 H54 C60 22 60 36 54 36 H16" fill="none" stroke="#4A2C1D" stroke-width="8.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 22 H54 C60 22 60 36 54 36 H16" fill="none" stroke="#F2B63A" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M42 22 V36" stroke="#4A2C1D" stroke-width="5.5" stroke-linecap="round"/><path d="M42 22 V36" stroke="#E9A82F" stroke-width="2.2" stroke-linecap="round"/><path d="M14 18 L4 8 V50 L14 40 Z" fill="#FFC94A" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round"/><path d="M8 14 V44" stroke="#FFFFFF" stroke-opacity="0.55" stroke-width="2" stroke-linecap="round"/><path d="M56 22 L62 18" stroke="#4A2C1D" stroke-width="5.5" stroke-linecap="round"/><path d="M56 22 L62 18" stroke="#C9CFD8" stroke-width="2.2" stroke-linecap="round"/><path d="M30 48.0 Q30.5 51.5 34.0 52 Q30.5 52.5 30 56.0 Q29.5 52.5 26.0 52 Q29.5 51.5 30 48.0 Z" fill="#FFC94A"/><path d="M52 47.2 Q52.35 49.65 54.8 50 Q52.35 50.35 52 52.8 Q51.65 50.35 49.2 50 Q51.65 49.65 52 47.2 Z" fill="#FFC94A"/>
</svg>`,

  instrument_tuba: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<circle cx="28" cy="40" r="15" fill="none" stroke="#4A2C1D" stroke-width="10"/><circle cx="28" cy="40" r="15" fill="none" stroke="#F2B63A" stroke-width="5.4"/><path d="M43 40 V20" stroke="#4A2C1D" stroke-width="10" stroke-linecap="round"/><path d="M43 40 V20" stroke="#F2B63A" stroke-width="5.4" stroke-linecap="round"/><path d="M34 20 L28 4 H62 L54 20 Z" fill="#FFC94A" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round"/><ellipse cx="45" cy="5" rx="17" ry="2.6" fill="#8B5A2B" stroke="#4A2C1D" stroke-width="2.2"/><path d="M40 8 L38 18" stroke="#FFFFFF" stroke-opacity="0.55" stroke-width="2" stroke-linecap="round"/><path d="M12 36 L6 22" stroke="#4A2C1D" stroke-width="5" stroke-linecap="round"/><path d="M12 36 L6 22" stroke="#C9CFD8" stroke-width="2" stroke-linecap="round"/><path d="M22 26 V16" stroke="#4A2C1D" stroke-width="2.6" stroke-linecap="round"/><circle cx="22" cy="15" r="2.4" fill="#E9EDF3" stroke="#4A2C1D" stroke-width="1.6"/><path d="M28 26 V16" stroke="#4A2C1D" stroke-width="2.6" stroke-linecap="round"/><circle cx="28" cy="15" r="2.4" fill="#E9EDF3" stroke="#4A2C1D" stroke-width="1.6"/><path d="M34 26 V16" stroke="#4A2C1D" stroke-width="2.6" stroke-linecap="round"/><circle cx="34" cy="15" r="2.4" fill="#E9EDF3" stroke="#4A2C1D" stroke-width="1.6"/><path d="M55 46.4 Q55.45 49.55 58.6 50 Q55.45 50.45 55 53.6 Q54.55 50.45 51.4 50 Q54.55 49.55 55 46.4 Z" fill="#FFC94A"/><path d="M8 53.2 Q8.35 55.65 10.8 56 Q8.35 56.35 8 58.8 Q7.65 56.35 5.2 56 Q7.65 55.65 8 53.2 Z" fill="#FFC94A"/>
</svg>`,

  instrument_kotly: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M8 6 L28 24" fill="none" stroke="#4A2C1D" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 6 L28 24" fill="none" stroke="#F3D9A8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M56 6 L36 24" fill="none" stroke="#4A2C1D" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M56 6 L36 24" fill="none" stroke="#F3D9A8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="8" cy="5" r="3.6" fill="#8B5A2B" stroke="#4A2C1D" stroke-width="2.2"/><circle cx="56" cy="5" r="3.6" fill="#8B5A2B" stroke="#4A2C1D" stroke-width="2.2"/><path d="M10 30 C10 52 22 60 32 60 C42 60 54 52 54 30 Z" fill="#D2753A" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round"/><path d="M14 40 C16 50 24 57 32 57 C40 57 48 50 50 40 C46 44 40 46 32 46 C24 46 18 44 14 40 Z" fill="#A85722" opacity="0.6"/><ellipse cx="32" cy="30" rx="22" ry="7" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="3"/><ellipse cx="32" cy="30" rx="22" ry="7" fill="none" stroke="#C9CFD8" stroke-width="1.6" transform="translate(0 1.6)"/><circle cx="14" cy="35.5" r="1.7" fill="#E9EDF3" stroke="#4A2C1D" stroke-width="1.3"/><circle cx="24" cy="38" r="1.7" fill="#E9EDF3" stroke="#4A2C1D" stroke-width="1.3"/><circle cx="40" cy="38" r="1.7" fill="#E9EDF3" stroke="#4A2C1D" stroke-width="1.3"/><circle cx="50" cy="35.5" r="1.7" fill="#E9EDF3" stroke="#4A2C1D" stroke-width="1.3"/><path d="M18 44 C19 49 23 53 27 55" fill="none" stroke="#FFFFFF" stroke-opacity="0.5" stroke-width="2.2" stroke-linecap="round"/><path d="M56 46.8 Q56.4 49.6 59.2 50 Q56.4 50.4 56 53.2 Q55.6 50.4 52.8 50 Q55.6 49.6 56 46.8 Z" fill="#FFC94A"/><path d="M7 45.2 Q7.35 47.65 9.8 48 Q7.35 48.35 7 50.8 Q6.65 48.35 4.2 48 Q6.65 47.65 7 45.2 Z" fill="#FFC94A"/>
</svg>`,

  instrument_talerze: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<ellipse cx="22" cy="36" rx="17" ry="7" transform="rotate(-34 22 36)" fill="#FFC94A" stroke="#4A2C1D" stroke-width="3"/><ellipse cx="22" cy="36" rx="5" ry="2" transform="rotate(-34 22 36)" fill="#E9A82F" stroke="#4A2C1D" stroke-width="1.8"/><path d="M12 31 C16 25 22 22 28 22" fill="none" stroke="#FFFFFF" stroke-opacity="0.6" stroke-width="2.2" stroke-linecap="round"/><ellipse cx="42" cy="34" rx="17" ry="7" transform="rotate(34 42 34)" fill="#F2B63A" stroke="#4A2C1D" stroke-width="3"/><ellipse cx="42" cy="34" rx="5" ry="2" transform="rotate(34 42 34)" fill="#E9A82F" stroke="#4A2C1D" stroke-width="1.8"/><path d="M52 39 C48 45 42 47 36 46" fill="none" stroke="#FFFFFF" stroke-opacity="0.45" stroke-width="2.2" stroke-linecap="round"/><path d="M20 36 L14 53 M44 34 L50 52" stroke="#4A2C1D" stroke-width="3.4" stroke-linecap="round"/><path d="M20 36 L14 53 M44 34 L50 52" stroke="#E8674F" stroke-width="1.4" stroke-linecap="round"/><path d="M32 4.4 Q32.7 9.3 37.6 10 Q32.7 10.7 32 15.6 Q31.3 10.7 26.4 10 Q31.3 9.3 32 4.4 Z" fill="#FFC94A"/><path d="M8 10.8 Q8.4 13.6 11.2 14 Q8.4 14.4 8 17.2 Q7.6 14.4 4.8 14 Q7.6 13.6 8 10.8 Z" fill="#FFC94A"/><path d="M56 10.8 Q56.4 13.6 59.2 14 Q56.4 14.4 56 17.2 Q55.6 14.4 52.8 14 Q55.6 13.6 56 10.8 Z" fill="#FFC94A"/>
</svg>`,

  instrument_trojkat: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M32 4 V10" stroke="#4A2C1D" stroke-width="2.6" stroke-linecap="round"/><path d="M32 4 L26 2 M32 4 L38 2" stroke="#4A2C1D" stroke-width="2" stroke-linecap="round"/><path d="M20 49 L32 12 L44 49 H27" fill="none" stroke="#4A2C1D" stroke-width="8.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 49 L32 12 L44 49 H27" fill="none" stroke="#D9DEE6" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M31 18 L23 43" stroke="#FFFFFF" stroke-opacity="0.8" stroke-width="1.6" stroke-linecap="round"/><path d="M50 60 L26 52" stroke="#4A2C1D" stroke-width="5.5" stroke-linecap="round"/><path d="M50 60 L26 52" stroke="#C9CFD8" stroke-width="2.2" stroke-linecap="round"/><path d="M50 60 L55 61.6" stroke="#4A2C1D" stroke-width="5.5" stroke-linecap="round"/><path d="M50 60 L55 61.6" stroke="#8B5A2B" stroke-width="2.4" stroke-linecap="round"/><path d="M52 17.2 Q52.6 21.4 56.8 22 Q52.6 22.6 52 26.8 Q51.4 22.6 47.2 22 Q51.4 21.4 52 17.2 Z" fill="#FFC94A"/><path d="M10 26.4 Q10.45 29.55 13.6 30 Q10.45 30.45 10 33.6 Q9.55 30.45 6.4 30 Q9.55 29.55 10 26.4 Z" fill="#FFC94A"/><path d="M52 35.2 Q52.35 37.65 54.8 38 Q52.35 38.35 52 40.8 Q51.65 38.35 49.2 38 Q51.65 37.65 52 35.2 Z" fill="#FFC94A"/>
</svg>`,

  instrument_ksylofon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M6 46 H58 M6 52 H58" stroke="#4A2C1D" stroke-width="3" stroke-linecap="round" opacity="0"/><path d="M8 6 L30 22" fill="none" stroke="#4A2C1D" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 6 L30 22" fill="none" stroke="#F3D9A8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M44 4 L26 22" fill="none" stroke="#4A2C1D" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M44 4 L26 22" fill="none" stroke="#F3D9A8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="8" cy="5.5" r="3.6" fill="#E8674F" stroke="#4A2C1D" stroke-width="2.2"/><circle cx="44" cy="3.5" r="3.6" fill="#E8674F" stroke="#4A2C1D" stroke-width="2.2"/><rect x="6.0" y="6" width="9" height="46" rx="2.4" fill="#E8674F" stroke="#4A2C1D" stroke-width="2.6" stroke-linejoin="round"/><rect x="7.8" y="8" width="2" height="40" rx="1" fill="#FFFFFF" fill-opacity="0.5"/><rect x="16.4" y="10" width="9" height="42" rx="2.4" fill="#F2B63A" stroke="#4A2C1D" stroke-width="2.6" stroke-linejoin="round"/><rect x="18.2" y="12" width="2" height="36" rx="1" fill="#FFFFFF" fill-opacity="0.5"/><rect x="26.8" y="14" width="9" height="38" rx="2.4" fill="#7CC576" stroke="#4A2C1D" stroke-width="2.6" stroke-linejoin="round"/><rect x="28.6" y="16" width="2" height="32" rx="1" fill="#FFFFFF" fill-opacity="0.5"/><rect x="37.2" y="18" width="9" height="34" rx="2.4" fill="#4FA3D1" stroke="#4A2C1D" stroke-width="2.6" stroke-linejoin="round"/><rect x="39.0" y="20" width="2" height="28" rx="1" fill="#FFFFFF" fill-opacity="0.5"/><rect x="47.6" y="22" width="9" height="30" rx="2.4" fill="#9D6FD6" stroke="#4A2C1D" stroke-width="2.6" stroke-linejoin="round"/><rect x="49.4" y="24" width="2" height="24" rx="1" fill="#FFFFFF" fill-opacity="0.5"/><rect x="3" y="49" width="58" height="5" rx="2" fill="#8B5A2B" stroke="#4A2C1D" stroke-width="2.6"/><path d="M55 4.4 Q55.45 7.55 58.6 8 Q55.45 8.45 55 11.6 Q54.55 8.45 51.4 8 Q54.55 7.55 55 4.4 Z" fill="#FFC94A"/><path d="M58 21.2 Q58.35 23.65 60.8 24 Q58.35 24.35 58 26.8 Q57.65 24.35 55.2 24 Q57.65 23.65 58 21.2 Z" fill="#FFC94A"/>
</svg>`,

  instrument_fortepian: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M6 18 L18 6 H58 V34 H6 Z" fill="#3B3340" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round"/><path d="M12 20 L22 10 H54" fill="none" stroke="#FFFFFF" stroke-opacity="0.35" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><rect x="4" y="34" width="56" height="22" rx="2.5" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round"/><path d="M13 34 V56" stroke="#4A2C1D" stroke-width="1.8"/><path d="M22 34 V56" stroke="#4A2C1D" stroke-width="1.8"/><path d="M31 34 V56" stroke="#4A2C1D" stroke-width="1.8"/><path d="M40 34 V56" stroke="#4A2C1D" stroke-width="1.8"/><path d="M49 34 V56" stroke="#4A2C1D" stroke-width="1.8"/><rect x="9.5" y="34" width="5.6" height="13" rx="1.2" fill="#2E2A3A" stroke="#4A2C1D" stroke-width="1.4"/><rect x="18.5" y="34" width="5.6" height="13" rx="1.2" fill="#2E2A3A" stroke="#4A2C1D" stroke-width="1.4"/><rect x="36.5" y="34" width="5.6" height="13" rx="1.2" fill="#2E2A3A" stroke="#4A2C1D" stroke-width="1.4"/><rect x="45.5" y="34" width="5.6" height="13" rx="1.2" fill="#2E2A3A" stroke="#4A2C1D" stroke-width="1.4"/><path d="M14 58 V63 M50 58 V63" stroke="#4A2C1D" stroke-width="3.4" stroke-linecap="round"/><path d="M52 48.0 Q52.0 48.0 52.0 48 Q52.0 48.0 52 48.0 Q52.0 48.0 52.0 48 Q52.0 48.0 52 48.0 Z" fill="#FFC94A"/><path d="M58 2.4 Q58.45 5.55 61.6 6 Q58.45 6.45 58 9.6 Q57.55 6.45 54.4 6 Q57.55 5.55 58 2.4 Z" fill="#FFC94A"/>
</svg>`,

  instrument_organy: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<rect x="4.6" y="30" width="6.8" height="20" rx="1.8" fill="#D9DEE6" stroke="#4A2C1D" stroke-width="2.4"/><ellipse cx="8" cy="34" rx="2.4" ry="1.6" fill="#4A2C1D"/><rect x="5.8" y="38" width="1.6" height="8" rx="0.8" fill="#FFFFFF" fill-opacity="0.6"/><rect x="12.6" y="22" width="6.8" height="28" rx="1.8" fill="#FFC94A" stroke="#4A2C1D" stroke-width="2.4"/><ellipse cx="16" cy="26" rx="2.4" ry="1.6" fill="#4A2C1D"/><rect x="13.8" y="30" width="1.6" height="16" rx="0.8" fill="#FFFFFF" fill-opacity="0.6"/><rect x="20.6" y="14" width="6.8" height="36" rx="1.8" fill="#D9DEE6" stroke="#4A2C1D" stroke-width="2.4"/><ellipse cx="24" cy="18" rx="2.4" ry="1.6" fill="#4A2C1D"/><rect x="21.8" y="22" width="1.6" height="24" rx="0.8" fill="#FFFFFF" fill-opacity="0.6"/><rect x="28.6" y="8" width="6.8" height="42" rx="1.8" fill="#FFC94A" stroke="#4A2C1D" stroke-width="2.4"/><ellipse cx="32" cy="12" rx="2.4" ry="1.6" fill="#4A2C1D"/><rect x="29.8" y="16" width="1.6" height="30" rx="0.8" fill="#FFFFFF" fill-opacity="0.6"/><rect x="36.6" y="14" width="6.8" height="36" rx="1.8" fill="#D9DEE6" stroke="#4A2C1D" stroke-width="2.4"/><ellipse cx="40" cy="18" rx="2.4" ry="1.6" fill="#4A2C1D"/><rect x="37.8" y="22" width="1.6" height="24" rx="0.8" fill="#FFFFFF" fill-opacity="0.6"/><rect x="44.6" y="22" width="6.8" height="28" rx="1.8" fill="#FFC94A" stroke="#4A2C1D" stroke-width="2.4"/><ellipse cx="48" cy="26" rx="2.4" ry="1.6" fill="#4A2C1D"/><rect x="45.8" y="30" width="1.6" height="16" rx="0.8" fill="#FFFFFF" fill-opacity="0.6"/><rect x="52.6" y="30" width="6.8" height="20" rx="1.8" fill="#D9DEE6" stroke="#4A2C1D" stroke-width="2.4"/><ellipse cx="56" cy="34" rx="2.4" ry="1.6" fill="#4A2C1D"/><rect x="53.8" y="38" width="1.6" height="8" rx="0.8" fill="#FFFFFF" fill-opacity="0.6"/><rect x="3" y="46" width="58" height="13" rx="3" fill="#8B5A2B" stroke="#4A2C1D" stroke-width="3"/><rect x="8" y="50" width="4.2" height="6" rx="1" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="1.2"/><rect x="14" y="50" width="4.2" height="6" rx="1" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="1.2"/><rect x="20" y="50" width="4.2" height="6" rx="1" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="1.2"/><rect x="26" y="50" width="4.2" height="6" rx="1" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="1.2"/><rect x="32" y="50" width="4.2" height="6" rx="1" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="1.2"/><rect x="38" y="50" width="4.2" height="6" rx="1" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="1.2"/><rect x="44" y="50" width="4.2" height="6" rx="1" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="1.2"/><rect x="50" y="50" width="4.2" height="6" rx="1" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="1.2"/><path d="M32 -0.6000000000000001 Q32.45 2.55 35.6 3 Q32.45 3.45 32 6.6 Q31.55 3.45 28.4 3 Q31.55 2.55 32 -0.6000000000000001 Z" fill="#FFC94A"/><path d="M4 5.2 Q4.35 7.65 6.8 8 Q4.35 8.35 4 10.8 Q3.65 8.35 1.2000000000000002 8 Q3.65 7.65 4 5.2 Z" fill="#FFC94A"/><path d="M60 7.2 Q60.35 9.65 62.8 10 Q60.35 10.35 60 12.8 Q59.65 10.35 57.2 10 Q59.65 9.65 60 7.2 Z" fill="#FFC94A"/>
</svg>`,

  instrument_akordeon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<rect x="3" y="12" width="14" height="40" rx="3.5" fill="#B8354F" stroke="#4A2C1D" stroke-width="3"/><rect x="47" y="12" width="14" height="40" rx="3.5" fill="#B8354F" stroke="#4A2C1D" stroke-width="3"/><circle cx="10" cy="20" r="2.2" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="1.4"/><circle cx="10" cy="28" r="2.2" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="1.4"/><circle cx="10" cy="36" r="2.2" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="1.4"/><circle cx="10" cy="44" r="2.2" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="1.4"/><rect x="51" y="18" width="6" height="5" rx="1" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="1.3"/><rect x="51" y="25" width="6" height="5" rx="1" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="1.3"/><rect x="51" y="32" width="6" height="5" rx="1" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="1.3"/><rect x="51" y="39" width="6" height="5" rx="1" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="1.3"/><rect x="51" y="46" width="6" height="5" rx="1" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="1.3"/><path d="M17 14 L47 14 L47 50 L17 50 Z" fill="#E8D3A8" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round"/><path d="M22 14 V50" stroke="#4A2C1D" stroke-width="2.6"/><path d="M23.6 16 V48" stroke="#FFFFFF" stroke-opacity="0.5" stroke-width="1.4"/><path d="M27 14 V50" stroke="#4A2C1D" stroke-width="2.6"/><path d="M28.6 16 V48" stroke="#FFFFFF" stroke-opacity="0.5" stroke-width="1.4"/><path d="M32 14 V50" stroke="#4A2C1D" stroke-width="2.6"/><path d="M33.6 16 V48" stroke="#FFFFFF" stroke-opacity="0.5" stroke-width="1.4"/><path d="M37 14 V50" stroke="#4A2C1D" stroke-width="2.6"/><path d="M38.6 16 V48" stroke="#FFFFFF" stroke-opacity="0.5" stroke-width="1.4"/><path d="M42 14 V50" stroke="#4A2C1D" stroke-width="2.6"/><path d="M43.6 16 V48" stroke="#FFFFFF" stroke-opacity="0.5" stroke-width="1.4"/><path d="M32 2.4 Q32.45 5.55 35.6 6 Q32.45 6.45 32 9.6 Q31.55 6.45 28.4 6 Q31.55 5.55 32 2.4 Z" fill="#FFC94A"/><path d="M32 55.2 Q32.35 57.65 34.8 58 Q32.35 58.35 32 60.8 Q31.65 58.35 29.2 58 Q31.65 57.65 32 55.2 Z" fill="#FFC94A"/>
</svg>`,

  instrument_gitara: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M32 28 C24 28 20.5 31 21 36 C21.3 39 24 40 24 42 C24 44 20 46 20 51 C20 57 25 60 32 60 C39 60 44 57 44 51 C44 46 40 44 40 42 C40 40 42.7 39 43 36 C43.5 31 40 28 32 28 Z" fill="#E0A04F" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round"/><path d="M32 44 C38 44 44 45 44 51 C44 57 39 60 32 60 C25 60 20 57 20 51 C20 45 26 44 32 44 Z" fill="#B8692E" opacity="0.4"/><circle cx="32" cy="42" r="4.4" fill="#3B2A22" stroke="#4A2C1D" stroke-width="2"/><rect x="30" y="8" width="4" height="22" rx="1.2" fill="#5B3A29" stroke="#4A2C1D" stroke-width="2.2"/><path d="M28 2 H36 L37 10 H27 Z" fill="#3B2A22" stroke="#4A2C1D" stroke-width="2.4" stroke-linejoin="round"/><path d="M25.5 4 H28 M25.5 8 H28 M36 4 H38.5 M36 8 H38.5" stroke="#4A2C1D" stroke-width="2" stroke-linecap="round"/><path d="M30.8 10 V52 M33.2 10 V52" stroke="#FFF4E6" stroke-width="0.9" opacity="0.9"/><rect x="27" y="52" width="10" height="2.4" rx="1" fill="#3B2A22"/><path d="M25 31 C23 33 22.6 35 23 37" fill="none" stroke="#FFFFFF" stroke-opacity="0.55" stroke-width="2.2" stroke-linecap="round"/><path d="M52 18.0 Q52.5 21.5 56.0 22 Q52.5 22.5 52 26.0 Q51.5 22.5 48.0 22 Q51.5 21.5 52 18.0 Z" fill="#FFC94A"/><path d="M10 26.8 Q10.4 29.6 13.2 30 Q10.4 30.4 10 33.2 Q9.6 30.4 6.8 30 Q9.6 29.6 10 26.8 Z" fill="#FFC94A"/>
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
  tryb_zabawy: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M15 21 H49 C57 21 61 30 59 41 C57.5 50 52 51.5 48 47 L43.5 42 H20.5 L16 47 C12 51.5 6.5 50 5 41 C3 30 7 21 15 21 Z" fill="#8B7CF6" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M20.5 42 H43.5 L48 47 C52 51.5 57.5 50 59 41 C59.5 38 59.5 35 59 32 C57 40 52 42 43.5 42 Z" fill="#6A5BD6" opacity="0.6"/>
<path d="M17 26 H21 V30 H25 V34 H21 V38 H17 V34 H13 V30 H17 Z" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="2.2" stroke-linejoin="round"/>
<circle cx="44" cy="29" r="3.8" fill="#FFC94A" stroke="#4A2C1D" stroke-width="2.2"/>
<circle cx="50.5" cy="35" r="3.8" fill="#F0625A" stroke="#4A2C1D" stroke-width="2.2"/>
<rect x="28" y="30" width="3.6" height="2.8" rx="1.2" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="1.4"/>
<rect x="33.4" y="30" width="3.6" height="2.8" rx="1.2" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="1.4"/>
<ellipse cx="13" cy="25.5" rx="2.4" ry="4.4" transform="rotate(35 13 25.5)" fill="#FFFFFF" fill-opacity="0.5"/>
<path d="M32 4 L34.2 9.4 L40 9.9 L35.6 13.7 L37 19.4 L32 16.3 L27 19.4 L28.4 13.7 L24 9.9 L29.8 9.4 Z" fill="#FFC94A" stroke="#4A2C1D" stroke-width="2" stroke-linejoin="round"/>
</svg>`,

  tryb_wlasny: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<rect x="6" y="9" width="52" height="46" rx="13" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="3"/>
<path d="M15 22 H49 M15 32 H49 M15 42 H49" stroke="#4A2C1D" stroke-width="3" stroke-linecap="round"/>
<circle cx="25" cy="22" r="5" fill="#FFC94A" stroke="#4A2C1D" stroke-width="2.6"/>
<circle cx="40" cy="32" r="5" fill="#F0625A" stroke="#4A2C1D" stroke-width="2.6"/>
<circle cx="29" cy="42" r="5" fill="#8B7CF6" stroke="#4A2C1D" stroke-width="2.6"/>
</svg>`,
  tryb_nauki: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M4 24 V52 C15 48.5 25 49 32 54 C39 49 49 48.5 60 52 V24 Z" fill="#3E7CC9" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M32 22 C25 17.5 15 17.5 7 21 V47.5 C15.5 44.5 25 45 32 50 Z" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M32 22 C39 17.5 49 17.5 57 21 V47.5 C48.5 44.5 39 45 32 50 Z" fill="#FFFFFF" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M32 22 V50" fill="none" stroke="#4A2C1D" stroke-width="2.6" stroke-linecap="round"/>
<path d="M12 27.5 C17 26 22 26.3 27 28.5 M12 33.5 C17 32 22 32.3 27 34.5 M12 39.5 C17 38 22 38.3 27 40.5" fill="none" stroke="#C9B8A0" stroke-width="2.2" stroke-linecap="round"/>
<path d="M37 28.5 C42 26.3 47 26 52 27.5 M37 34.5 C42 32.3 47 32 52 33.5" fill="none" stroke="#C9B8A0" stroke-width="2.2" stroke-linecap="round"/>
<ellipse cx="44.5" cy="40" rx="3.2" ry="2.5" transform="rotate(-18 44.5 40)" fill="#4A2C1D"/>
<path d="M47.5 39 V30" fill="none" stroke="#4A2C1D" stroke-width="2.2" stroke-linecap="round"/>
<path d="M47.5 30 Q51 30.5 51 34" fill="none" stroke="#4A2C1D" stroke-width="2.2" stroke-linecap="round"/>
<path d="M32 3 L34.4 8.8 L40.5 9.4 L35.9 13.4 L37.3 19.4 L32 16.2 L26.7 19.4 L28.1 13.4 L23.5 9.4 L29.6 8.8 Z" fill="#FFC94A" stroke="#4A2C1D" stroke-width="2" stroke-linejoin="round"/>
</svg>`,
  ui_glosnik: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M8 25 H20 L35 12 V52 L20 39 H8 Z" fill="#8B7CF6" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M20 25 L35 12 V30 L20 30 Z" fill="#A99CFA"/>
<path d="M8 25 H20 L35 12 V52 L20 39 H8 Z" fill="none" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M42 23 Q48 32 42 41" fill="none" stroke="#4A2C1D" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M48 15 Q60 32 48 49" fill="none" stroke="#4A2C1D" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/>
<ellipse cx="14" cy="29" rx="2" ry="1.4" fill="#FFFFFF" fill-opacity="0.6"/>
</svg>`,

  ui_stop: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<rect x="12" y="12" width="40" height="40" rx="9" fill="#F0625A" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M12 40 Q12 52 24 52 H40 Q52 52 52 40 Z" fill="#D9473F"/>
<rect x="12" y="12" width="40" height="40" rx="9" fill="none" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M18 22 Q19 17 24 17" fill="none" stroke="#FFFFFF" stroke-opacity="0.6" stroke-width="3" stroke-linecap="round"/>
</svg>`,

  ui_ptaszek: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<circle cx="32" cy="32" r="25" fill="#4CC27A" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M12 40 A22 22 0 0 0 52 40 Q32 48 12 40 Z" fill="#35A862"/>
<circle cx="32" cy="32" r="25" fill="none" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M19.5 33 L28 41.5 L45 23" fill="none" stroke="#4A2C1D" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M19.5 33 L28 41.5 L45 23" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M17 20 Q20 14 26 12" fill="none" stroke="#FFFFFF" stroke-opacity="0.55" stroke-width="3" stroke-linecap="round"/>
</svg>`,

  ui_konfetti: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M7 57 L20 21 L43 44 Z" fill="#FFC94A" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M13.5 39 L26 37 L22 49 Z" fill="#F0625A"/>
<path d="M28 41 L33 34 L40 41 Z" fill="#8B7CF6"/>
<path d="M7 57 L20 21 L43 44 Z" fill="none" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M30 15 Q33 22 40 20" fill="none" stroke="#4A90D9" stroke-width="3" stroke-linecap="round"/>
<path d="M44 28 Q50 24 52 17" fill="none" stroke="#F0625A" stroke-width="3" stroke-linecap="round"/>
<circle cx="48" cy="9" r="3.2" fill="#4CC27A" stroke="#4A2C1D" stroke-width="2"/>
<circle cx="57" cy="30" r="3" fill="#8B7CF6" stroke="#4A2C1D" stroke-width="2"/>
<rect x="33" y="5" width="6" height="6" rx="1.2" transform="rotate(25 36 8)" fill="#F0625A" stroke="#4A2C1D" stroke-width="2"/>
<path d="M54 44 Q54.6 46.6 57.2 47.2 Q54.6 47.8 54 50.4 Q53.4 47.8 50.8 47.2 Q53.4 46.6 54 44 Z" fill="#FFC94A"/>
</svg>`,

  ui_puchar: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M20 12 H10 C10 24 15 29 22 30" fill="none" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M44 12 H54 C54 24 49 29 42 30" fill="none" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M18 7 H46 V26 C46 37 40 43 32 43 C24 43 18 37 18 26 Z" fill="#FFC94A" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M46 7 V26 C46 37 40 43 32 43 C38 40 41 34 41 26 V7 Z" fill="#F0A92E"/>
<path d="M18 7 H46 V26 C46 37 40 43 32 43 C24 43 18 37 18 26 Z" fill="none" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<rect x="28.5" y="43" width="7" height="8" fill="#F0A92E" stroke="#4A2C1D" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M17 57 V52 Q17 50.5 18.5 50.5 H45.5 Q47 50.5 47 52 V57 Z" fill="#8B5A2B" stroke="#4A2C1D" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round"/>
<ellipse cx="24.5" cy="20" rx="2.4" ry="6" transform="rotate(8 24.5 20)" fill="#FFFFFF" fill-opacity="0.6"/>
</svg>`,

  ui_cel: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<circle cx="30" cy="34" r="25" fill="#F0625A" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<circle cx="30" cy="34" r="17" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="2.4"/>
<circle cx="30" cy="34" r="9.5" fill="#F0625A" stroke="#4A2C1D" stroke-width="2.4"/>
<circle cx="30" cy="34" r="3.6" fill="#FFC94A" stroke="#4A2C1D" stroke-width="2"/>
<path d="M31 33 L54 10" fill="none" stroke="#4A2C1D" stroke-width="5.4" stroke-linecap="round"/>
<path d="M31 33 L54 10" fill="none" stroke="#C9A06A" stroke-width="2.4" stroke-linecap="round"/>
<path d="M50 5 L50 14 L59 14 L58 6 Z" fill="#4A90D9" stroke="#4A2C1D" stroke-width="2.4" stroke-linejoin="round"/>
</svg>`,

  ui_powtorka: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M12 33 A20 20 0 0 1 46 19" fill="none" stroke="#4A2C1D" stroke-width="9" stroke-linecap="round"/>
<path d="M52 31 A20 20 0 0 1 18 45" fill="none" stroke="#4A2C1D" stroke-width="9" stroke-linecap="round"/>
<path d="M12 33 A20 20 0 0 1 46 19" fill="none" stroke="#4A90D9" stroke-width="4.6" stroke-linecap="round"/>
<path d="M52 31 A20 20 0 0 1 18 45" fill="none" stroke="#4CC27A" stroke-width="4.6" stroke-linecap="round"/>
<path d="M40 8 L54 14 L44 26 Z" fill="#4A90D9" stroke="#4A2C1D" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M24 56 L10 50 L20 38 Z" fill="#4CC27A" stroke="#4A2C1D" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>
</svg>`,

  ui_lekcja: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M12 6 H48 Q52 6 52 10 V52 Q52 56 48 56 H12 Z" fill="#4A90D9" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M12 6 V56 H8 Q4 56 4 52 V10 Q4 6 8 6 Z" fill="#2F6FB5" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<rect x="19" y="14" width="26" height="14" rx="3" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="2.4"/>
<path d="M24 21 H40" stroke="#4A2C1D" stroke-width="2.4" stroke-linecap="round"/>
<path d="M20 38 H44 M20 45 H36" fill="none" stroke="#FFFFFF" stroke-opacity="0.75" stroke-width="2.6" stroke-linecap="round"/>
<path d="M12 6 H48 Q52 6 52 10 V52 Q52 56 48 56 H12 Z" fill="none" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
</svg>`,

  ui_meta: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M14 6 V58" fill="none" stroke="#4A2C1D" stroke-width="5.4" stroke-linecap="round"/>
<path d="M14 6 V58" fill="none" stroke="#C9A06A" stroke-width="2.4" stroke-linecap="round"/>
<path d="M16 9 H54 L46 21 L54 33 H16 Z" fill="#FFFFFF" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M16 9 H28 V21 H16 Z M40 9 H52 L46 21 H40 Z M28 21 H40 V33 H28 Z M16 21 V33 H28 Z" fill="#4A2C1D" opacity="0"/>
<rect x="16" y="9" width="8" height="8" fill="#4A2C1D"/><rect x="32" y="9" width="8" height="8" fill="#4A2C1D"/>
<rect x="24" y="17" width="8" height="8" fill="#4A2C1D"/><rect x="40" y="17" width="8" height="8" fill="#4A2C1D"/>
<rect x="16" y="25" width="8" height="8" fill="#4A2C1D"/><rect x="32" y="25" width="8" height="8" fill="#4A2C1D"/>
<path d="M16 9 H54 L46 21 L54 33 H16 Z" fill="none" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
</svg>`,

  ui_korona: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M6 48 L9 18 L22 31 L32 10 L42 31 L55 18 L58 48 Z" fill="#FFC94A" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M6 48 L58 48 L58 54 Q58 56 56 56 H8 Q6 56 6 54 Z" fill="#F0A92E" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<circle cx="9" cy="17" r="3.6" fill="#F0625A" stroke="#4A2C1D" stroke-width="2"/>
<circle cx="32" cy="9" r="3.6" fill="#4A90D9" stroke="#4A2C1D" stroke-width="2"/>
<circle cx="55" cy="17" r="3.6" fill="#F0625A" stroke="#4A2C1D" stroke-width="2"/>
<circle cx="32" cy="40" r="3.4" fill="#F0625A" stroke="#4A2C1D" stroke-width="2"/>
<path d="M13 40 L12 30" stroke="#FFFFFF" stroke-opacity="0.6" stroke-width="3" stroke-linecap="round"/>
</svg>`,

  ui_kompas: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<circle cx="32" cy="32" r="26" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<circle cx="32" cy="32" r="20" fill="#4A90D9" stroke="#4A2C1D" stroke-width="2.4"/>
<path d="M32 12 V16 M32 48 V52 M12 32 H16 M48 32 H52" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round"/>
<path d="M44 20 L36 36 L28 28 Z" fill="#F0625A" stroke="#4A2C1D" stroke-width="2.4" stroke-linejoin="round"/>
<path d="M20 44 L28 28 L36 36 Z" fill="#FFFFFF" stroke="#4A2C1D" stroke-width="2.4" stroke-linejoin="round"/>
<circle cx="32" cy="32" r="2.6" fill="#4A2C1D"/>
</svg>`,

  ui_platek: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<circle cx="32" cy="32" r="26" fill="#BFE6FA" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<g stroke="#4A2C1D" stroke-width="5" stroke-linecap="round"><path d="M32 12 V52"/><path d="M14.7 22 L49.3 42"/><path d="M14.7 42 L49.3 22"/></g>
<g stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round"><path d="M32 12 V52"/><path d="M14.7 22 L49.3 42"/><path d="M14.7 42 L49.3 22"/></g>
<circle cx="32" cy="32" r="5" fill="#FFFFFF" stroke="#4A2C1D" stroke-width="2.4"/>
</svg>`,

  ui_zlamane_serce: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M32 56 C13 43 6 31 9.5 21 C13 11.5 25.5 10 32 19.5 C38.5 10 51 11.5 54.5 21 C58 31 51 43 32 56 Z" fill="#F0625A" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M29 14 L36 26 L27 33 L35 43 L30 55" fill="none" stroke="#4A2C1D" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round"/>
<ellipse cx="18.5" cy="24" rx="3.6" ry="6" transform="rotate(-35 18.5 24)" fill="#FFFFFF" fill-opacity="0.5"/>
</svg>`,

  ui_odznaka: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M18 36 L10 58 L22 52 L28 58 L33 40 Z" fill="#4A90D9" stroke="#4A2C1D" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M46 36 L54 58 L42 52 L36 58 L31 40 Z" fill="#F0625A" stroke="#4A2C1D" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round"/>
<circle cx="32" cy="26" r="20" fill="#FFC94A" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<circle cx="32" cy="26" r="13" fill="#FFE18A" stroke="#4A2C1D" stroke-width="2.4"/>
<path d="M32 17 L34.8 23 L41 23.6 L36.4 27.8 L37.8 34 L32 30.8 L26.2 34 L27.6 27.8 L23 23.6 L29.2 23 Z" fill="#F0A92E" stroke="#4A2C1D" stroke-width="1.8" stroke-linejoin="round"/>
<path d="M17 18 Q20 11 27 8.5" fill="none" stroke="#FFFFFF" stroke-opacity="0.65" stroke-width="3" stroke-linecap="round"/>
</svg>`,

  ui_koperta: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<rect x="6" y="14" width="52" height="38" rx="6" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M7 18 L32 38 L57 18" fill="none" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M7 50 L24 33 M57 50 L40 33" fill="none" stroke="#4A2C1D" stroke-width="2.6" stroke-linecap="round"/>
<circle cx="52" cy="14" r="8" fill="#F0625A" stroke="#4A2C1D" stroke-width="2.6"/>
<path d="M52 10 V15" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round"/><circle cx="52" cy="18" r="1.3" fill="#FFFFFF"/>
</svg>`,

  ui_iskry: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M26 8 Q28.5 24 44 26 Q28.5 28 26 44 Q23.5 28 8 26 Q23.5 24 26 8 Z" fill="#FFC94A" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M47 32 Q48.4 40 56 41 Q48.4 42 47 50 Q45.6 42 38 41 Q45.6 40 47 32 Z" fill="#FFE18A" stroke="#4A2C1D" stroke-width="2.4" stroke-linejoin="round"/>
<path d="M49 7 Q49.7 11 53.5 11.5 Q49.7 12 49 16 Q48.3 12 44.5 11.5 Q48.3 11 49 7 Z" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="1.8" stroke-linejoin="round"/>
</svg>`,

  ui_zamknij: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<circle cx="32" cy="32" r="25" fill="#F0625A" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M22 22 L42 42 M42 22 L22 42" fill="none" stroke="#4A2C1D" stroke-width="9" stroke-linecap="round"/>
<path d="M22 22 L42 42 M42 22 L22 42" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>
</svg>`,

  ui_start: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<circle cx="32" cy="32" r="25" fill="#4CC27A" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M26 20 L46 32 L26 44 Z" fill="#FFFFFF" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M17 22 Q20 16 26 13" fill="none" stroke="#FFFFFF" stroke-opacity="0.55" stroke-width="3" stroke-linecap="round"/>
</svg>`,

  ui_zegar: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<rect x="27" y="4" width="10" height="6" rx="2" fill="#8B7CF6" stroke="#4A2C1D" stroke-width="2.4"/>
<circle cx="32" cy="35" r="23" fill="#FFF4E6" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<circle cx="32" cy="35" r="17" fill="#FFFFFF" stroke="#4A2C1D" stroke-width="2"/>
<path d="M32 35 V24 M32 35 L40 40" fill="none" stroke="#4A2C1D" stroke-width="3.4" stroke-linecap="round"/>
<circle cx="32" cy="35" r="2.4" fill="#F0625A"/>
</svg>`,

  ui_klodka_otwarta: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<path d="M20 28 V19 A12 12 0 0 1 44 15" fill="none" stroke="#4A2C1D" stroke-width="8" stroke-linecap="round"/>
<path d="M20 28 V19 A12 12 0 0 1 44 15" fill="none" stroke="#C0C7D0" stroke-width="3.6" stroke-linecap="round"/>
<rect x="10" y="28" width="44" height="30" rx="7" fill="#FFC94A" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M10 46 Q10 58 17 58 H47 Q54 58 54 46 Z" fill="#F0A92E"/>
<rect x="10" y="28" width="44" height="30" rx="7" fill="none" stroke="#4A2C1D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<circle cx="32" cy="41" r="4.4" fill="#4A2C1D"/><path d="M32 43 V50" stroke="#4A2C1D" stroke-width="3.4" stroke-linecap="round"/>
</svg>`,
} as const;

export type IconName = keyof typeof ICONS;
