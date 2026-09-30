import { useId } from "react";
import { SvgXml } from "react-native-svg";

/** Hand-illustrated portrait for Fabryka Budowania's own "boss" lesson
 * ("Pokonaj Inżyniera Piętrusa") — same inlined-SvgXml pattern as every
 * other boss here (ArytmikPortrait's own doc has the full reasoning),
 * but this source SVG uses nine gradient/filter `id`s (soft shading, per
 * its own README) — same "two instances on screen at once" collision
 * FalszomirPortrait's own doc explains, so this one needs the same
 * useId()-namespaced-ids treatment that component uses, just with nine
 * ids instead of two. */
function buildPietrusSvg(ids: {
  body: string;
  belly: string;
  face: string;
  lens: string;
  brass: string;
  copper: string;
  steel: string;
  wing: string;
  soft: string;
}): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
<defs>
<radialGradient id="${ids.body}" cx="40%" cy="30%" r="75%"><stop offset="0" stop-color="#a9c4b0"/><stop offset=".55" stop-color="#7d9a86"/><stop offset="1" stop-color="#4f6b5a"/></radialGradient>
<radialGradient id="${ids.belly}" cx="50%" cy="35%" r="70%"><stop offset="0" stop-color="#fffaf0"/><stop offset="1" stop-color="#e0cfaa"/></radialGradient>
<radialGradient id="${ids.face}" cx="50%" cy="40%" r="65%"><stop offset="0" stop-color="#fffdf6"/><stop offset="1" stop-color="#f6ecd6"/></radialGradient>
<radialGradient id="${ids.lens}" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#fff6d6"/><stop offset=".5" stop-color="#ffd98a"/><stop offset="1" stop-color="#e0a23a"/></radialGradient>
<linearGradient id="${ids.brass}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe08a"/><stop offset="1" stop-color="#9c7418"/></linearGradient>
<linearGradient id="${ids.copper}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8955a"/><stop offset="1" stop-color="#8a4a1f"/></linearGradient>
<linearGradient id="${ids.steel}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c3ccd5"/><stop offset="1" stop-color="#5a6571"/></linearGradient>
<linearGradient id="${ids.wing}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7d9a86"/><stop offset="1" stop-color="#4f6b5a"/></linearGradient>
<filter id="${ids.soft}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6"/></filter>
</defs>
<ellipse cx="560" cy="965" rx="400" ry="34" fill="#1a211d" opacity=".16" filter="url(#${ids.soft})"/>
<rect x="300" y="900" width="560" height="44" rx="8" fill="url(#${ids.steel})" stroke="#243029" stroke-width="8"/>
<circle cx="330" cy="922" r="7" fill="#dfe6ec" stroke="#243029" stroke-width="3"/>
<circle cx="400" cy="922" r="7" fill="#dfe6ec" stroke="#243029" stroke-width="3"/>
<circle cx="470" cy="922" r="7" fill="#dfe6ec" stroke="#243029" stroke-width="3"/>
<circle cx="540" cy="922" r="7" fill="#dfe6ec" stroke="#243029" stroke-width="3"/>
<circle cx="610" cy="922" r="7" fill="#dfe6ec" stroke="#243029" stroke-width="3"/>
<circle cx="680" cy="922" r="7" fill="#dfe6ec" stroke="#243029" stroke-width="3"/>
<circle cx="750" cy="922" r="7" fill="#dfe6ec" stroke="#243029" stroke-width="3"/>
<circle cx="820" cy="922" r="7" fill="#dfe6ec" stroke="#243029" stroke-width="3"/>
<g transform="translate(170 900) rotate(-2)"><rect x="-74.0" y="-37.0" width="160" height="90" rx="14" fill="#1a211d" opacity=".18"/><rect x="-80.0" y="-45.0" width="160" height="90" rx="14" fill="#e8584a" stroke="#243029" stroke-width="7"/><rect x="-72.0" y="-39.0" width="144" height="25.200000000000003" rx="8" fill="#fff" opacity=".28"/><circle cx="-66.0" cy="-31.0" r="5" fill="#fff" opacity=".55"/><circle cx="-66.0" cy="31.0" r="5" fill="#fff" opacity=".55"/><circle cx="66.0" cy="-31.0" r="5" fill="#fff" opacity=".55"/><circle cx="66.0" cy="31.0" r="5" fill="#fff" opacity=".55"/><text x="0" y="18" transform="rotate(0 0 18)" text-anchor="middle" font-family="Baloo 2, Nunito, sans-serif" font-weight="800" font-size="56" fill="#fff">C</text></g>
<g transform="translate(176 804) rotate(1)"><rect x="-74.0" y="-37.0" width="160" height="90" rx="14" fill="#1a211d" opacity=".18"/><rect x="-80.0" y="-45.0" width="160" height="90" rx="14" fill="#f4a53a" stroke="#243029" stroke-width="7"/><rect x="-72.0" y="-39.0" width="144" height="25.200000000000003" rx="8" fill="#fff" opacity=".28"/><circle cx="-66.0" cy="-31.0" r="5" fill="#fff" opacity=".55"/><circle cx="-66.0" cy="31.0" r="5" fill="#fff" opacity=".55"/><circle cx="66.0" cy="-31.0" r="5" fill="#fff" opacity=".55"/><circle cx="66.0" cy="31.0" r="5" fill="#fff" opacity=".55"/><text x="0" y="18" transform="rotate(0 0 18)" text-anchor="middle" font-family="Baloo 2, Nunito, sans-serif" font-weight="800" font-size="56" fill="#fff">E</text></g>
<g transform="translate(182 708) rotate(4)"><rect x="-74.0" y="-37.0" width="160" height="90" rx="14" fill="#1a211d" opacity=".18"/><rect x="-80.0" y="-45.0" width="160" height="90" rx="14" fill="#4cae6a" stroke="#243029" stroke-width="7"/><rect x="-72.0" y="-39.0" width="144" height="25.200000000000003" rx="8" fill="#fff" opacity=".28"/><circle cx="-66.0" cy="-31.0" r="5" fill="#fff" opacity=".55"/><circle cx="-66.0" cy="31.0" r="5" fill="#fff" opacity=".55"/><circle cx="66.0" cy="-31.0" r="5" fill="#fff" opacity=".55"/><circle cx="66.0" cy="31.0" r="5" fill="#fff" opacity=".55"/><text x="0" y="18" transform="rotate(0 0 18)" text-anchor="middle" font-family="Baloo 2, Nunito, sans-serif" font-weight="800" font-size="56" fill="#fff">G</text></g>
<g transform="translate(300 300) rotate(-14)"><rect x="-69.0" y="-35.0" width="150" height="86" rx="14" fill="#1a211d" opacity=".18"/><rect x="-75.0" y="-43.0" width="150" height="86" rx="14" fill="#9c7fd6" stroke="#243029" stroke-width="7"/><rect x="-67.0" y="-37.0" width="134" height="24.080000000000002" rx="8" fill="#fff" opacity=".28"/><circle cx="-61.0" cy="-29.0" r="5" fill="#fff" opacity=".55"/><circle cx="-61.0" cy="29.0" r="5" fill="#fff" opacity=".55"/><circle cx="61.0" cy="-29.0" r="5" fill="#fff" opacity=".55"/><circle cx="61.0" cy="29.0" r="5" fill="#fff" opacity=".55"/><text x="0" y="17" transform="rotate(0 0 17)" text-anchor="middle" font-family="Baloo 2, Nunito, sans-serif" font-weight="800" font-size="53" fill="#fff">F</text><path d="M30.0 -43.0 l-10 16 l12 10 l-8 16" stroke="#243029" stroke-width="5" fill="none"/></g>
<g font-family="Nunito, sans-serif" font-weight="800" font-size="22" fill="#4f6b5a">
<text x="60" y="852" transform="rotate(0 60 852)" text-anchor="middle" font-family="Baloo 2, Nunito, sans-serif" font-weight="800" font-size="30" fill="#4f6b5a">3</text><text x="66" y="756" transform="rotate(0 66 756)" text-anchor="middle" font-family="Baloo 2, Nunito, sans-serif" font-weight="800" font-size="30" fill="#4f6b5a">3</text>
<path d="M80 890 " />
</g>
<text x="400" y="240" transform="rotate(10 400 240)" text-anchor="middle" font-family="Baloo 2, Nunito, sans-serif" font-weight="800" font-size="52" fill="#9c7fd6">?!</text>
<path d="M520 860 L480 940 L540 920 L560 960 L600 922 L660 940 L620 860 Z" fill="#4f6b5a" stroke="#243029" stroke-width="8" stroke-linejoin="round"/>
<path d="M466 900 q10 -26 34 -30 q24 4 34 30 Z" fill="#f29a3a" stroke="#243029" stroke-width="7" stroke-linejoin="round"/>
<path d="M474 898 l-5 16" stroke="#243029" stroke-width="7" stroke-linecap="round"/>
<path d="M500 898 l0 16" stroke="#243029" stroke-width="7" stroke-linecap="round"/>
<path d="M526 898 l5 16" stroke="#243029" stroke-width="7" stroke-linecap="round"/>
<path d="M586 900 q10 -26 34 -30 q24 4 34 30 Z" fill="#f29a3a" stroke="#243029" stroke-width="7" stroke-linejoin="round"/>
<path d="M594 898 l-5 16" stroke="#243029" stroke-width="7" stroke-linecap="round"/>
<path d="M620 898 l0 16" stroke="#243029" stroke-width="7" stroke-linecap="round"/>
<path d="M646 898 l5 16" stroke="#243029" stroke-width="7" stroke-linecap="round"/>
<path d="M560 390 C 720 390 780 550 770 700 C 760 850 680 920 560 920 C 440 920 360 850 350 700 C 340 550 400 390 560 390 Z" fill="url(#${ids.body})" stroke="#243029" stroke-width="12"/>
<path d="M560 600 C 660 600 700 700 694 780 C 686 870 630 902 560 902 C 490 902 434 870 426 780 C 420 700 460 600 560 600 Z" fill="url(#${ids.belly})" stroke="#243029" stroke-width="7"/>
<path d="M451 670 q14 16 28 0" stroke="#e0cfaa" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M498 670 q14 16 28 0" stroke="#e0cfaa" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M546 670 q14 16 28 0" stroke="#e0cfaa" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M594 670 q14 16 28 0" stroke="#e0cfaa" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M641 670 q14 16 28 0" stroke="#e0cfaa" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M458 704 q14 16 28 0" stroke="#e0cfaa" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M502 704 q14 16 28 0" stroke="#e0cfaa" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M546 704 q14 16 28 0" stroke="#e0cfaa" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M590 704 q14 16 28 0" stroke="#e0cfaa" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M634 704 q14 16 28 0" stroke="#e0cfaa" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M466 738 q14 16 28 0" stroke="#e0cfaa" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M506 738 q14 16 28 0" stroke="#e0cfaa" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M546 738 q14 16 28 0" stroke="#e0cfaa" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M586 738 q14 16 28 0" stroke="#e0cfaa" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M626 738 q14 16 28 0" stroke="#e0cfaa" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M474 772 q14 16 28 0" stroke="#e0cfaa" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M510 772 q14 16 28 0" stroke="#e0cfaa" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M546 772 q14 16 28 0" stroke="#e0cfaa" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M582 772 q14 16 28 0" stroke="#e0cfaa" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M618 772 q14 16 28 0" stroke="#e0cfaa" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M481 806 q14 16 28 0" stroke="#e0cfaa" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M514 806 q14 16 28 0" stroke="#e0cfaa" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M546 806 q14 16 28 0" stroke="#e0cfaa" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M578 806 q14 16 28 0" stroke="#e0cfaa" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M611 806 q14 16 28 0" stroke="#e0cfaa" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M489 840 q14 16 28 0" stroke="#e0cfaa" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M517 840 q14 16 28 0" stroke="#e0cfaa" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M546 840 q14 16 28 0" stroke="#e0cfaa" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M575 840 q14 16 28 0" stroke="#e0cfaa" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M603 840 q14 16 28 0" stroke="#e0cfaa" stroke-width="5" fill="none" stroke-linecap="round"/>
<path d="M372 790 C 470 830 650 830 748 790 L744 830 C 650 870 470 870 376 830 Z" fill="url(#${ids.copper})" stroke="#243029" stroke-width="7" stroke-linejoin="round"/>
<rect x="536" y="812" width="48" height="36" rx="6" fill="url(#${ids.brass})" stroke="#243029" stroke-width="6"/><rect x="550" y="822" width="20" height="16" rx="3" fill="none" stroke="#243029" stroke-width="4"/>
<g transform="translate(650 790) rotate(18)"><rect x="-8" y="-70" width="16" height="80" fill="#ffd23f" stroke="#243029" stroke-width="5"/><path d="M-8 -70 L0 -92 L8 -70 Z" fill="#f3d9a8" stroke="#243029" stroke-width="5"/></g>
<g transform="translate(450 790) rotate(-14)"><rect x="-10" y="-80" width="20" height="90" fill="#f7e7b5" stroke="#243029" stroke-width="5"/><path d="M-10 -70 h8" stroke="#243029" stroke-width="3"/><path d="M-10 -56 h8" stroke="#243029" stroke-width="3"/><path d="M-10 -42 h8" stroke="#243029" stroke-width="3"/><path d="M-10 -28 h8" stroke="#243029" stroke-width="3"/><path d="M-10 -14 h8" stroke="#243029" stroke-width="3"/><path d="M-10 0 h8" stroke="#243029" stroke-width="3"/></g>
<g transform="rotate(0 560 490)">
<path d="M480 394 Q 410 360 390 320 Q 390 420 390 450 Z" fill="#4f6b5a" stroke="#243029" stroke-width="9" stroke-linejoin="round"/>
<path d="M640 394 Q 710 360 730 320 Q 730 420 730 450 Z" fill="#4f6b5a" stroke="#243029" stroke-width="9" stroke-linejoin="round"/>
<path d="M560 460 C 600 380 720 390 720 490 C 720 570 640 600 560 610 C 480 600 400 570 400 490 C 400 390 520 380 560 460 Z" fill="url(#${ids.face})" stroke="#243029" stroke-width="8"/>
<path d="M388 484 C 420 450 700 450 732 484" stroke="#8a4a1f" stroke-width="22" fill="none" stroke-linecap="round"/>
<circle cx="492" cy="494" r="62" fill="url(#${ids.brass})" stroke="#243029" stroke-width="9"/>
<circle cx="546" cy="494" r="4" fill="#9c7418"/>
<circle cx="530" cy="532" r="4" fill="#9c7418"/>
<circle cx="492" cy="548" r="4" fill="#9c7418"/>
<circle cx="454" cy="532" r="4" fill="#9c7418"/>
<circle cx="438" cy="494" r="4" fill="#9c7418"/>
<circle cx="454" cy="456" r="4" fill="#9c7418"/>
<circle cx="492" cy="440" r="4" fill="#9c7418"/>
<circle cx="530" cy="456" r="4" fill="#9c7418"/>
<circle cx="492" cy="494" r="44" fill="url(#${ids.lens})" stroke="#243029" stroke-width="6"/>
<circle cx="502" cy="500" r="20" fill="#1a211d"/><circle cx="495" cy="492" r="7" fill="#fff"/><path d="M462 472 q10 -12 26 -12" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".8"/>
<circle cx="628" cy="494" r="62" fill="url(#${ids.brass})" stroke="#243029" stroke-width="9"/>
<circle cx="682" cy="494" r="4" fill="#9c7418"/>
<circle cx="666" cy="532" r="4" fill="#9c7418"/>
<circle cx="628" cy="548" r="4" fill="#9c7418"/>
<circle cx="590" cy="532" r="4" fill="#9c7418"/>
<circle cx="574" cy="494" r="4" fill="#9c7418"/>
<circle cx="590" cy="456" r="4" fill="#9c7418"/>
<circle cx="628" cy="440" r="4" fill="#9c7418"/>
<circle cx="666" cy="456" r="4" fill="#9c7418"/>
<circle cx="628" cy="494" r="44" fill="url(#${ids.lens})" stroke="#243029" stroke-width="6"/>
<circle cx="618" cy="500" r="20" fill="#1a211d"/><circle cx="611" cy="492" r="7" fill="#fff"/><path d="M598 472 q10 -12 26 -12" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".8"/>
<path d="M430 418 L540 444" stroke="#4f6b5a" stroke-width="22" stroke-linecap="round"/><path d="M690 418 L580 444" stroke="#4f6b5a" stroke-width="22" stroke-linecap="round"/>
<rect x="545" y="484" width="30" height="18" rx="6" fill="url(#${ids.copper})" stroke="#243029" stroke-width="5"/>
<path d="M532 550 Q 560 538 588 550 L560 594 Z" fill="#f29a3a" stroke="#243029" stroke-width="7" stroke-linejoin="round"/><path d="M540 560 L560 570 L580 560" stroke="#b8621a" stroke-width="4" fill="none"/>
<ellipse cx="438" cy="560" rx="22" ry="11" fill="#f2a0a0" opacity=".5"/>
<ellipse cx="682" cy="560" rx="22" ry="11" fill="#f2a0a0" opacity=".5"/>
</g>
<path d="M380 580 C 320 520 290 400 300 310 L340 320 C 350 400 380 480 420 530 Z" fill="url(#${ids.wing})" stroke="#243029" stroke-width="9" stroke-linejoin="round"/>
<path d="M296 310 l-24 -14" stroke="#243029" stroke-width="7" stroke-linecap="round"/>
<path d="M306 330 l-24 -14" stroke="#243029" stroke-width="7" stroke-linecap="round"/>
<path d="M316 350 l-24 -14" stroke="#243029" stroke-width="7" stroke-linecap="round"/>
<path d="M326 370 l-24 -14" stroke="#243029" stroke-width="7" stroke-linecap="round"/>
<path d="M740 580 C 820 600 860 660 860 730 L820 740 C 816 680 790 640 730 630 Z" fill="url(#${ids.wing})" stroke="#243029" stroke-width="9" stroke-linejoin="round"/>
<g transform="translate(880 730) rotate(-30)"><rect x="-16" y="-230" width="32" height="240" rx="12" fill="url(#${ids.steel})" stroke="#243029" stroke-width="8"/><path d="M-50 -230 C -60 -300 60 -300 50 -230 L26 -230 L26 -270 L-26 -270 L-26 -230 Z" fill="url(#${ids.steel})" stroke="#243029" stroke-width="8" stroke-linejoin="round"/><path d="M-6 -200 V-20" stroke="#fff" stroke-width="6" opacity=".6" stroke-linecap="round"/></g>
<g transform="translate(860 230) rotate(8)"><rect x="-110" y="-70" width="220" height="140" rx="10" fill="#2f6fb8" stroke="#243029" stroke-width="7"/><path d="M-90 -30 h180" stroke="#cfe3ff" stroke-width="2.5"/><path d="M-90 -16 h180" stroke="#cfe3ff" stroke-width="2.5"/><path d="M-90 -2 h180" stroke="#cfe3ff" stroke-width="2.5"/><path d="M-90 12 h180" stroke="#cfe3ff" stroke-width="2.5"/><path d="M-90 26 h180" stroke="#cfe3ff" stroke-width="2.5"/><ellipse cx="-20" cy="26" rx="11" ry="7.5" fill="#fff" transform="rotate(-20 -20 26)"/><ellipse cx="-20" cy="12" rx="11" ry="7.5" fill="#fff" transform="rotate(-20 -20 12)"/><ellipse cx="-20" cy="-2" rx="11" ry="7.5" fill="#fff" transform="rotate(-20 -20 -2)"/><ellipse cx="-20" cy="-16" rx="11" ry="7.5" fill="#fff" transform="rotate(-20 -20 -16)"/><path d="M-9 26 V-60" stroke="#fff" stroke-width="3"/><text x="55" y="20" transform="rotate(0 55 20)" text-anchor="middle" font-family="Baloo 2, Nunito, sans-serif" font-weight="800" font-size="34" fill="#ffe08a">V⁷</text><circle cx="-110" cy="0" r="16" fill="#9fc3ee" stroke="#243029" stroke-width="5"/><circle cx="110" cy="0" r="16" fill="#9fc3ee" stroke="#243029" stroke-width="5"/></g>
<path d="M130 148 L129 158 L121 158 L118 166 L124 172 L117 179 L110 175 L103 179 L104 187 L95 190 L92 182 L84 181 L80 189 L70 185 L73 177 L67 172 L59 175 L54 167 L60 162 L58 154 L50 152 L51 142 L59 142 L62 134 L56 128 L63 121 L70 125 L77 121 L76 113 L85 110 L88 118 L96 119 L100 111 L110 115 L107 123 L113 128 L121 125 L126 133 L120 138 L122 146Z" fill="url(#${ids.brass})" stroke="#243029" stroke-width="6" stroke-linejoin="round"/><circle cx="90" cy="150" r="14" fill="#5a6571" stroke="#243029" stroke-width="5"/><path d="M176 215 L173 223 L167 221 L163 226 L165 232 L157 235 L154 230 L148 231 L145 236 L137 233 L139 227 L134 223 L128 225 L125 217 L130 214 L129 208 L124 205 L127 197 L133 199 L137 194 L135 188 L143 185 L146 190 L152 189 L155 184 L163 187 L161 193 L166 197 L172 195 L175 203 L170 206 L171 212Z" fill="url(#${ids.copper})" stroke="#243029" stroke-width="6" stroke-linejoin="round"/><circle cx="150" cy="210" r="9" fill="#5a6571" stroke="#243029" stroke-width="5"/>
</svg>`;
}

interface PietrusPortraitProps {
  size?: number;
}

export function PietrusPortrait({ size = 48 }: PietrusPortraitProps) {
  const uid = useId().replace(/:/g, "-");
  return (
    <SvgXml
      xml={buildPietrusSvg({
        body: `pietrus-body-${uid}`,
        belly: `pietrus-belly-${uid}`,
        face: `pietrus-face-${uid}`,
        lens: `pietrus-lens-${uid}`,
        brass: `pietrus-brass-${uid}`,
        copper: `pietrus-copper-${uid}`,
        steel: `pietrus-steel-${uid}`,
        wing: `pietrus-wing-${uid}`,
        soft: `pietrus-soft-${uid}`,
      })}
      width={size}
      height={size}
    />
  );
}
