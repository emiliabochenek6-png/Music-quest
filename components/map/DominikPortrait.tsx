import { SvgXml } from "react-native-svg";

/** Hand-illustrated portrait for Cytadela Dominant's own "boss" lesson
 * ("Pokonaj Rycerza Dominika V") — same inlined-SvgXml pattern as
 * ArytmikPortrait/OsmiotaktPortrait/OktawiuszPortrait/TrojglosPortrait/
 * AkordeonPortrait (see ArytmikPortrait's own doc for the full
 * reasoning). No `id`/`clipPath` elements in the source SVG, so no
 * useId()-namespacing needed either. */
const DOMINIK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
<ellipse cx="512" cy="950" rx="300" ry="34" fill="#1f2a26" opacity=".15"/>
<path d="M380 470 C 300 600 220 760 150 900 C 260 870 330 910 420 880 L560 880 C 680 900 760 860 820 820 C 740 700 700 580 640 470 Z" fill="#2f6b3f" stroke="#1f2a26" stroke-width="10" stroke-linejoin="round"/>
<path d="M300 700 C 260 770 220 830 190 880" stroke="#1d4527" stroke-width="10" fill="none" stroke-linecap="round"/>
<rect x="402" y="740" width="76" height="130" rx="26" fill="#b8c2cc" stroke="#1f2a26" stroke-width="9"/><circle cx="440" cy="790" r="20" fill="#e3e9ee" stroke="#1f2a26" stroke-width="6"/>
<path d="M406 868 L480 868 L470 920 L436 930 Z" fill="#7d8994" stroke="#1f2a26" stroke-width="8" stroke-linejoin="round"/>
<rect x="546" y="740" width="76" height="130" rx="26" fill="#b8c2cc" stroke="#1f2a26" stroke-width="9"/><circle cx="584" cy="790" r="20" fill="#e3e9ee" stroke="#1f2a26" stroke-width="6"/>
<path d="M550 868 L624 868 L614 920 L580 930 Z" fill="#7d8994" stroke="#1f2a26" stroke-width="8" stroke-linejoin="round"/>
<path d="M360 450 C 420 410 604 410 664 450 C 700 560 690 710 640 760 L384 760 C 334 710 324 560 360 450 Z" fill="#b8c2cc" stroke="#1f2a26" stroke-width="11" stroke-linejoin="round"/>
<path d="M400 460 C 380 520 380 620 400 700" stroke="#e3e9ee" stroke-width="18" fill="none" stroke-linecap="round"/>
<path d="M512 430 L512 756" stroke="#7d8994" stroke-width="6"/>
<path d="M384 710 H640" stroke="#e8b53a" stroke-width="16"/><path d="M384 710 H640" stroke="#8a6414" stroke-width="3" stroke-dasharray="4 14"/>
<circle cx="512" cy="580" r="38" fill="#2f6b3f" stroke="#e8b53a" stroke-width="7"/><path d="M512 604 V554 M494 570 L512 550 L530 570" stroke="#e8b53a" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<ellipse cx="360" cy="460" rx="70" ry="48" fill="#b8c2cc" stroke="#1f2a26" stroke-width="10"/><path d="M310 464 q50 -30 100 0" stroke="#e3e9ee" stroke-width="8" fill="none" stroke-linecap="round"/>
<ellipse cx="664" cy="460" rx="70" ry="48" fill="#b8c2cc" stroke="#1f2a26" stroke-width="10"/><path d="M614 464 q50 -30 100 0" stroke="#e3e9ee" stroke-width="8" fill="none" stroke-linecap="round"/>
<g>
<path d="M500 140 C 440 30 540 -40 620 -10 C 580 20 570 60 600 90 C 560 80 540 110 540 140 Z" fill="#e8b53a" stroke="#8a6414" stroke-width="7" stroke-linejoin="round"/>
<path d="M400 400 L400 230 C 400 120 624 120 624 230 L624 400 C 580 420 444 420 400 400 Z" fill="#b8c2cc" stroke="#1f2a26" stroke-width="11" stroke-linejoin="round"/>
<path d="M430 210 C 440 170 470 150 500 144" stroke="#e3e9ee" stroke-width="14" fill="none" stroke-linecap="round"/>
<path d="M512 130 V250" stroke="#e8b53a" stroke-width="12"/>
<rect x="420" y="260" width="184" height="54" rx="14" fill="#141b18"/>
<path d="M446 276 L494 288 L494 300 L450 296 Z" fill="#ffe27a"/><path d="M578 276 L530 288 L530 300 L574 296 Z" fill="#ffe27a"/>
<circle cx="450" cy="360" r="6" fill="#7d8994"/>
<circle cx="481" cy="360" r="6" fill="#7d8994"/>
<circle cx="512" cy="360" r="6" fill="#7d8994"/>
<circle cx="543" cy="360" r="6" fill="#7d8994"/>
<circle cx="574" cy="360" r="6" fill="#7d8994"/>
</g>
<path d="M340 480 C 280 520 250 580 250 620" stroke="#1f2a26" stroke-width="64" fill="none" stroke-linecap="round"/><path d="M340 480 C 280 520 250 580 250 620" stroke="#b8c2cc" stroke-width="44" fill="none" stroke-linecap="round"/>
<g transform="translate(230 640) rotate(-8) scale(1)"><path d="M-80 -100 L80 -100 L80 0 C 80 70 30 110 0 130 C -30 110 -80 70 -80 0 Z" fill="#2f6b3f" stroke="#1f2a26" stroke-width="10" stroke-linejoin="round"/><path d="M-64 -84 L64 -84 L64 0 C 64 58 24 92 0 110 C -24 92 -64 58 -64 0 Z" fill="none" stroke="#e8b53a" stroke-width="7"/><text x="0" y="36" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="110" fill="#e8b53a" stroke="#8a6414" stroke-width="3">V</text></g>
<g transform="translate(770 580) rotate(14)"><path d="M-14 60 L-8 -520 L8 -520 L14 60 Z" fill="#9a6a3c" stroke="#4f3218" stroke-width="7" stroke-linejoin="round"/><path d="M-12 -40 L12 -80" stroke="#e8b53a" stroke-width="7"/><path d="M-12 -150 L12 -190" stroke="#e8b53a" stroke-width="7"/><path d="M-12 -260 L12 -300" stroke="#e8b53a" stroke-width="7"/><path d="M-12 -370 L12 -410" stroke="#e8b53a" stroke-width="7"/><path d="M-18 -520 L0 -610 L18 -520 Z" fill="#e3e9ee" stroke="#1f2a26" stroke-width="7" stroke-linejoin="round"/><path d="M8 -480 L150 -450 L110 -420 L150 -390 L8 -380 Z" fill="#2f6b3f" stroke="#1f2a26" stroke-width="6" stroke-linejoin="round"/><text x="62" y="-402" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="40" fill="#e8b53a">V</text><text x="84" y="-424" font-family="Georgia, serif" font-weight="700" font-size="24" fill="#e8b53a">7</text><path d="M-40 20 C -40 -10 40 -10 40 20 L20 40 L-20 40 Z" fill="#b8c2cc" stroke="#1f2a26" stroke-width="7"/></g>
<path d="M684 480 C 740 500 770 540 770 570" stroke="#1f2a26" stroke-width="64" fill="none" stroke-linecap="round"/><path d="M684 480 C 740 500 770 540 770 570" stroke="#b8c2cc" stroke-width="44" fill="none" stroke-linecap="round"/>
<circle cx="770" cy="580" r="34" fill="#b8c2cc" stroke="#1f2a26" stroke-width="9"/>
<g transform="translate(130 180) rotate(-20)"><path d="M0 40 V-30 M-20 -10 L0 -34 L20 -10" stroke="#e8b53a" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>
<g transform="translate(880 700) rotate(15)"><path d="M0 40 V-30 M-20 -10 L0 -34 L20 -10" stroke="#e8b53a" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>
</svg>`;

interface DominikPortraitProps {
  size?: number;
}

export function DominikPortrait({ size = 48 }: DominikPortraitProps) {
  return <SvgXml xml={DOMINIK_SVG} width={size} height={size} />;
}
