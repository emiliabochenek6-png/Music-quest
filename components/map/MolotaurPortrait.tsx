import { SvgXml } from "react-native-svg";

/** Hand-illustrated portrait for Labirynt Tonacji's own "boss" lesson
 * ("Pokonaj Molotaura") — same inlined-SvgXml pattern as every other
 * boss here (ArytmikPortrait's own doc has the full reasoning). No
 * `id`/`clipPath` elements in the source SVG, so no useId()-namespacing
 * needed either. */
const MOLOTAUR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
<ellipse cx="512" cy="955" rx="300" ry="32" fill="#24140c" opacity=".15"/>
<rect x="368" y="730" width="104" height="170" rx="44" fill="#7a4a32" stroke="#24140c" stroke-width="10"/>
<path d="M364 890 h112 l-6 44 h-100 Z" fill="#1a0f09" stroke="#24140c" stroke-width="8" stroke-linejoin="round"/><path d="M420 892 v42" stroke="#4f2e1d" stroke-width="7"/>
<rect x="552" y="730" width="104" height="170" rx="44" fill="#7a4a32" stroke="#24140c" stroke-width="10"/>
<path d="M548 890 h112 l-6 44 h-100 Z" fill="#1a0f09" stroke="#24140c" stroke-width="8" stroke-linejoin="round"/><path d="M604 892 v42" stroke="#4f2e1d" stroke-width="7"/>
<path d="M320 410 C 400 350 624 350 704 410 C 760 520 740 700 690 770 C 620 820 404 820 334 770 C 284 700 264 520 320 410 Z" fill="#7a4a32" stroke="#24140c" stroke-width="12" stroke-linejoin="round"/>
<ellipse cx="512" cy="620" rx="140" ry="150" fill="#a36a4a" opacity=".6"/>
<path d="M330 440 L700 690 L680 756 L310 506 Z" fill="#f4c542" stroke="#24140c" stroke-width="8" stroke-linejoin="round"/>
<path d="M515 565 L700 690 L680 756 L495 631 Z" fill="#4b4fa8" stroke="#24140c" stroke-width="8" stroke-linejoin="round"/>
<text x="420" y="548" transform="rotate(34 420 548)" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="34" fill="#a07a12">dur</text><text x="600" y="684" transform="rotate(34 600 684)" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="34" fill="#e6e7ff">moll</text>
<circle cx="350" cy="410" r="58" fill="#4f2e1d" stroke="#24140c" stroke-width="9"/>
<circle cx="420" cy="370" r="58" fill="#4f2e1d" stroke="#24140c" stroke-width="9"/>
<circle cx="512" cy="355" r="58" fill="#4f2e1d" stroke="#24140c" stroke-width="9"/>
<circle cx="604" cy="370" r="58" fill="#4f2e1d" stroke="#24140c" stroke-width="9"/>
<circle cx="674" cy="410" r="58" fill="#4f2e1d" stroke="#24140c" stroke-width="9"/>
<path d="M330 470 C 250 440 210 360 210 280" stroke="#24140c" stroke-width="96" fill="none" stroke-linecap="round"/><path d="M330 470 C 250 440 210 360 210 280" stroke="#7a4a32" stroke-width="76" fill="none" stroke-linecap="round"/>
<g transform="translate(200 140) rotate(8) scale(0.85)"><circle cx="0" cy="0" r="58" fill="#6c7480" stroke="#24140c" stroke-width="9"/><circle cx="0" cy="0" r="30" fill="none" stroke="#aab2bd" stroke-width="8"/><text x="0" y="16" transform="rotate(0 0 16)" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="46" fill="#aab2bd">♯</text><rect x="-16" y="50" width="32" height="360" rx="10" fill="#6c7480" stroke="#24140c" stroke-width="8"/><path d="M16 320 h56 v30 h-26 v24 h26 v30 h-56 Z" fill="#6c7480" stroke="#24140c" stroke-width="8" stroke-linejoin="round"/><path d="M-6 70 V390" stroke="#aab2bd" stroke-width="6" stroke-linecap="round"/></g>
<circle cx="210" cy="270" r="48" fill="#4f2e1d" stroke="#24140c" stroke-width="9"/>
<path d="M694 470 C 790 500 820 570 800 640" stroke="#24140c" stroke-width="96" fill="none" stroke-linecap="round"/><path d="M694 470 C 790 500 820 570 800 640" stroke="#7a4a32" stroke-width="76" fill="none" stroke-linecap="round"/>
<circle cx="800" cy="652" r="50" fill="#4f2e1d" stroke="#24140c" stroke-width="9"/>
<g transform="rotate(0 512 260)">
<path d="M420 220 C 310 210 230 140 230 30 C 270 110 330 160 420 174 Z" fill="#f5ecd6" stroke="#24140c" stroke-width="9" stroke-linejoin="round"/><path d="M378 149 L358 181" stroke="#8f7a55" stroke-width="5" stroke-linecap="round"/><path d="M340 122 L320 154" stroke="#8f7a55" stroke-width="5" stroke-linecap="round"/><path d="M604 220 C 714 210 794 140 794 30 C 754 110 694 160 604 174 Z" fill="#f5ecd6" stroke="#24140c" stroke-width="9" stroke-linejoin="round"/><path d="M646 149 L666 181" stroke="#8f7a55" stroke-width="5" stroke-linecap="round"/><path d="M684 122 L704 154" stroke="#8f7a55" stroke-width="5" stroke-linecap="round"/>
<text x="300" y="130" transform="rotate(-20 300 130)" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="60" fill="#8f7a55">♯</text><text x="724" y="130" transform="rotate(20 724 130)" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="64" fill="#8f7a55">♭</text>
<path d="M392 250 C 322 220 292 260 312 280 C 342 290 372 280 392 280 Z" fill="#7a4a32" stroke="#24140c" stroke-width="8" stroke-linejoin="round"/>
<path d="M632 250 C 702 220 732 260 712 280 C 682 290 652 280 632 280 Z" fill="#7a4a32" stroke="#24140c" stroke-width="8" stroke-linejoin="round"/>
<path d="M400 180 C 420 120 604 120 624 180 C 660 260 640 350 600 380 L424 380 C 384 350 364 260 400 180 Z" fill="#7a4a32" stroke="#24140c" stroke-width="11" stroke-linejoin="round"/>
<path d="M470 150 q20 -40 42 -10 q20 -34 42 4 q-20 30 -42 20 q-24 16 -42 -14 Z" fill="#4f2e1d" stroke="#24140c" stroke-width="7" stroke-linejoin="round"/>
<ellipse cx="512" cy="370" rx="120" ry="78" fill="#f1d4b0" stroke="#24140c" stroke-width="10"/>
<ellipse cx="476" cy="360" rx="14" ry="18" fill="#1a0f09"/>
<ellipse cx="548" cy="360" rx="14" ry="18" fill="#1a0f09"/>
<ellipse cx="462" cy="250" rx="24" ry="26" fill="#fff" stroke="#1a0f09" stroke-width="6"/><circle cx="468" cy="256" r="12" fill="#a07a12"/><circle cx="468" cy="256" r="5" fill="#1a0f09"/>
<ellipse cx="562" cy="250" rx="24" ry="26" fill="#fff" stroke="#1a0f09" stroke-width="6"/><circle cx="556" cy="256" r="12" fill="#4b4fa8"/><circle cx="556" cy="256" r="5" fill="#1a0f09"/>
<path d="M430 206 L492 226" stroke="#1a0f09" stroke-width="12" stroke-linecap="round"/><path d="M594 206 L532 226" stroke="#1a0f09" stroke-width="12" stroke-linecap="round"/>
<path d="M462 396 Q 512 412 562 396" stroke="#1a0f09" stroke-width="7" fill="none" stroke-linecap="round"/>
<circle cx="400" cy="370" r="16" fill="#fff" stroke="#24140c" stroke-width="4" opacity=".9"/><circle cx="370" cy="360" r="11" fill="#fff" stroke="#24140c" stroke-width="4" opacity=".9"/>
<circle cx="624" cy="370" r="16" fill="#fff" stroke="#24140c" stroke-width="4" opacity=".9"/><circle cx="654" cy="360" r="11" fill="#fff" stroke="#24140c" stroke-width="4" opacity=".9"/>
</g>
<text x="880" y="160" transform="rotate(12 880 160)" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="90" fill="#a07a12">♯</text>
<text x="820" y="300" transform="rotate(-10 820 300)" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="90" fill="#4b4fa8">♭</text>
<text x="940" y="420" transform="rotate(8 940 420)" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="90" fill="#6c7480">♮</text>
</svg>`;

interface MolotaurPortraitProps {
  size?: number;
}

export function MolotaurPortrait({ size = 48 }: MolotaurPortraitProps) {
  return <SvgXml xml={MOLOTAUR_SVG} width={size} height={size} />;
}
