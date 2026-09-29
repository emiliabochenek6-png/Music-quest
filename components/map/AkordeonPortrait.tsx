import { SvgXml } from "react-native-svg";

/** Hand-illustrated portrait for Jaskinia Akordów's own "boss" lesson
 * ("Pokonaj Hrabiego Akordeona") — same inlined-SvgXml pattern as
 * ArytmikPortrait/OsmiotaktPortrait/OktawiuszPortrait/TrojglosPortrait
 * (see ArytmikPortrait's own doc for the full reasoning). No `id`/
 * `clipPath` elements in the source SVG, so no useId()-namespacing
 * needed either. */
const AKORDEON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
<path d="M180 960 C 200 880 300 860 512 860 C 724 860 824 880 844 960 Z" fill="#6b6478" stroke="#1c1e2b" stroke-width="10"/>
<path d="M260 900 q40 -14 80 -4 M620 892 q50 -10 100 4" stroke="#3e3848" stroke-width="7" fill="none" stroke-linecap="round"/>
<g transform="translate(230 930) rotate(-12) scale(0.9)"><path d="M0 0 L-18 -20 L-8 -70 L8 -80 L18 -24 Z" fill="#7fe0ff" stroke="#1c1e2b" stroke-width="6" stroke-linejoin="round"/><path d="M-4 -64 L-10 -24" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/></g>
<g transform="translate(800 930) rotate(10) scale(1.0)"><path d="M0 0 L-18 -20 L-8 -70 L8 -80 L18 -24 Z" fill="#ffb13d" stroke="#1c1e2b" stroke-width="6" stroke-linejoin="round"/><path d="M-4 -64 L-10 -24" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/></g>
<g transform="translate(760 930) rotate(20) scale(0.6)"><path d="M0 0 L-18 -20 L-8 -70 L8 -80 L18 -24 Z" fill="#7fe0ff" stroke="#1c1e2b" stroke-width="6" stroke-linejoin="round"/><path d="M-4 -64 L-10 -24" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/></g>
<path d="M392 520 L434 281 Q397 301 362 198 Z" fill="#27a567" stroke="#1c1e2b" stroke-width="7" stroke-linejoin="round"/><path d="M400 472 L434 281" stroke="#fff1d6" stroke-width="7" stroke-linecap="round"/><path d="M392 520 L362 198 Q330 254 263 160 Z" fill="#17744a" stroke="#1c1e2b" stroke-width="7" stroke-linejoin="round"/><path d="M386 456 L362 198" stroke="#fff1d6" stroke-width="7" stroke-linecap="round"/><path d="M392 520 L263 160 Q253 247 164 180 Z" fill="#27a567" stroke="#1c1e2b" stroke-width="7" stroke-linejoin="round"/><path d="M366 448 L263 160" stroke="#fff1d6" stroke-width="7" stroke-linecap="round"/><path d="M392 520 L164 180 Q186 284 93 255 Z" fill="#17744a" stroke="#1c1e2b" stroke-width="7" stroke-linejoin="round"/><path d="M346 452 L164 180" stroke="#fff1d6" stroke-width="7" stroke-linecap="round"/><path d="M392 520 L93 255 Q150 355 71 363 Z" fill="#27a567" stroke="#1c1e2b" stroke-width="7" stroke-linejoin="round"/><path d="M332 467 L93 255" stroke="#fff1d6" stroke-width="7" stroke-linecap="round"/><path d="M392 520 L71 363 Q153 440 100 473 Z" fill="#17744a" stroke="#1c1e2b" stroke-width="7" stroke-linejoin="round"/><path d="M328 489 L71 363" stroke="#fff1d6" stroke-width="7" stroke-linecap="round"/><path d="M392 520 L100 473 Q190 517 167 560 Z" fill="#27a567" stroke="#1c1e2b" stroke-width="7" stroke-linejoin="round"/><path d="M334 511 L100 473" stroke="#fff1d6" stroke-width="7" stroke-linecap="round"/><circle cx="434" cy="281" r="9" fill="#fff1d6" stroke="#1c1e2b" stroke-width="5"/><circle cx="263" cy="160" r="9" fill="#fff1d6" stroke="#1c1e2b" stroke-width="5"/><circle cx="93" cy="255" r="9" fill="#fff1d6" stroke="#1c1e2b" stroke-width="5"/><circle cx="100" cy="473" r="9" fill="#fff1d6" stroke="#1c1e2b" stroke-width="5"/><path d="M392 480 L392 580" stroke="#ffb13d" stroke-width="18" stroke-linecap="round"/><path d="M392 480 L392 580" stroke="#b86e12" stroke-width="4" stroke-dasharray="6 10"/>
<path d="M632 520 L590 281 Q627 301 662 198 Z" fill="#27a567" stroke="#1c1e2b" stroke-width="7" stroke-linejoin="round"/><path d="M624 472 L590 281" stroke="#fff1d6" stroke-width="7" stroke-linecap="round"/><path d="M632 520 L662 198 Q694 254 761 160 Z" fill="#17744a" stroke="#1c1e2b" stroke-width="7" stroke-linejoin="round"/><path d="M638 456 L662 198" stroke="#fff1d6" stroke-width="7" stroke-linecap="round"/><path d="M632 520 L761 160 Q771 247 860 180 Z" fill="#27a567" stroke="#1c1e2b" stroke-width="7" stroke-linejoin="round"/><path d="M658 448 L761 160" stroke="#fff1d6" stroke-width="7" stroke-linecap="round"/><path d="M632 520 L860 180 Q838 284 931 255 Z" fill="#17744a" stroke="#1c1e2b" stroke-width="7" stroke-linejoin="round"/><path d="M678 452 L860 180" stroke="#fff1d6" stroke-width="7" stroke-linecap="round"/><path d="M632 520 L931 255 Q874 355 953 363 Z" fill="#27a567" stroke="#1c1e2b" stroke-width="7" stroke-linejoin="round"/><path d="M692 467 L931 255" stroke="#fff1d6" stroke-width="7" stroke-linecap="round"/><path d="M632 520 L953 363 Q871 440 924 473 Z" fill="#17744a" stroke="#1c1e2b" stroke-width="7" stroke-linejoin="round"/><path d="M696 489 L953 363" stroke="#fff1d6" stroke-width="7" stroke-linecap="round"/><path d="M632 520 L924 473 Q834 517 857 560 Z" fill="#27a567" stroke="#1c1e2b" stroke-width="7" stroke-linejoin="round"/><path d="M690 511 L924 473" stroke="#fff1d6" stroke-width="7" stroke-linecap="round"/><circle cx="590" cy="281" r="9" fill="#fff1d6" stroke="#1c1e2b" stroke-width="5"/><circle cx="761" cy="160" r="9" fill="#fff1d6" stroke="#1c1e2b" stroke-width="5"/><circle cx="931" cy="255" r="9" fill="#fff1d6" stroke="#1c1e2b" stroke-width="5"/><circle cx="924" cy="473" r="9" fill="#fff1d6" stroke="#1c1e2b" stroke-width="5"/><path d="M632 480 L632 580" stroke="#ffb13d" stroke-width="18" stroke-linecap="round"/><path d="M632 480 L632 580" stroke="#b86e12" stroke-width="4" stroke-dasharray="6 10"/>
<path d="M420 870 q10 -40 30 -40 q20 0 30 40 Z" fill="#4a4f66" stroke="#1c1e2b" stroke-width="8"/>
<path d="M432 868 l-4 14" stroke="#fff1d6" stroke-width="6" stroke-linecap="round"/>
<path d="M450 868 l-4 14" stroke="#fff1d6" stroke-width="6" stroke-linecap="round"/>
<path d="M468 868 l-4 14" stroke="#fff1d6" stroke-width="6" stroke-linecap="round"/>
<path d="M544 870 q10 -40 30 -40 q20 0 30 40 Z" fill="#4a4f66" stroke="#1c1e2b" stroke-width="8"/>
<path d="M556 868 l-4 14" stroke="#fff1d6" stroke-width="6" stroke-linecap="round"/>
<path d="M574 868 l-4 14" stroke="#fff1d6" stroke-width="6" stroke-linecap="round"/>
<path d="M592 868 l-4 14" stroke="#fff1d6" stroke-width="6" stroke-linecap="round"/>
<path d="M512 440 C 640 440 670 580 660 700 C 650 810 580 850 512 850 C 444 850 374 810 364 700 C 354 580 384 440 512 440 Z" fill="#4a4f66" stroke="#1c1e2b" stroke-width="11"/>
<rect x="436" y="590" width="152" height="190" rx="22" fill="#9aa0b8" stroke="#1c1e2b" stroke-width="7"/>
<rect x="520" y="604" width="54" height="162" rx="8" fill="#fff1d6" stroke="#1c1e2b" stroke-width="5"/>
<path d="M520 631 h54" stroke="#1c1e2b" stroke-width="3"/>
<path d="M520 658 h54" stroke="#1c1e2b" stroke-width="3"/>
<path d="M520 685 h54" stroke="#1c1e2b" stroke-width="3"/>
<path d="M520 712 h54" stroke="#1c1e2b" stroke-width="3"/>
<path d="M520 739 h54" stroke="#1c1e2b" stroke-width="3"/>
<rect x="520" y="623" width="32" height="16" rx="3" fill="#1c1e2b"/>
<rect x="520" y="650" width="32" height="16" rx="3" fill="#1c1e2b"/>
<rect x="520" y="704" width="32" height="16" rx="3" fill="#1c1e2b"/>
<circle cx="462" cy="626" r="9" fill="#ffb13d" stroke="#1c1e2b" stroke-width="4"/>
<circle cx="490" cy="626" r="9" fill="#fff1d6" stroke="#1c1e2b" stroke-width="4"/>
<circle cx="462" cy="666" r="9" fill="#fff1d6" stroke="#1c1e2b" stroke-width="4"/>
<circle cx="490" cy="666" r="9" fill="#ffb13d" stroke="#1c1e2b" stroke-width="4"/>
<circle cx="462" cy="706" r="9" fill="#ffb13d" stroke="#1c1e2b" stroke-width="4"/>
<circle cx="490" cy="706" r="9" fill="#fff1d6" stroke="#1c1e2b" stroke-width="4"/>
<circle cx="462" cy="746" r="9" fill="#fff1d6" stroke="#1c1e2b" stroke-width="4"/>
<circle cx="490" cy="746" r="9" fill="#ffb13d" stroke="#1c1e2b" stroke-width="4"/>
<path d="M380 790 l10 16 l10 -16 l10 16 l10 -16" stroke="#1c1e2b" stroke-width="5" fill="none" stroke-linejoin="round"/>
<path d="M600 800 l10 16 l10 -16 l10 16 l10 -16" stroke="#1c1e2b" stroke-width="5" fill="none" stroke-linejoin="round"/>
<path d="M492 840 l10 16 l10 -16 l10 16 l10 -16" stroke="#1c1e2b" stroke-width="5" fill="none" stroke-linejoin="round"/>
<g transform="rotate(0 417 330)"><path d="M467 330 L377 140 L347 350 Z" fill="#4a4f66" stroke="#1c1e2b" stroke-width="10" stroke-linejoin="round"/><path d="M439 320 L381 190 L367 330 Z" fill="#ffb13d" opacity=".85"/></g>
<g transform="rotate(0 607 330)"><path d="M557 330 L647 140 L677 350 Z" fill="#4a4f66" stroke="#1c1e2b" stroke-width="10" stroke-linejoin="round"/><path d="M585 320 L643 190 L657 330 Z" fill="#ffb13d" opacity=".85"/></g>
<ellipse cx="512" cy="370" rx="160" ry="130" fill="#4a4f66" stroke="#1c1e2b" stroke-width="11"/>
<path d="M420 290 C 440 260 480 250 512 252" stroke="#6f7590" stroke-width="16" fill="none" stroke-linecap="round"/>
<ellipse cx="512" cy="400" rx="116" ry="84" fill="#6f7590"/>
<circle cx="458" cy="376" r="36" fill="#ffb13d" opacity=".3"/><ellipse cx="458" cy="376" rx="28" ry="32" fill="#ffb13d" stroke="#1c1e2b" stroke-width="6"/><ellipse cx="464" cy="380" rx="8" ry="18" fill="#12131c"/><circle cx="450" cy="364" r="6" fill="#fff"/>
<circle cx="566" cy="376" r="36" fill="#ffb13d" opacity=".3"/><ellipse cx="566" cy="376" rx="28" ry="32" fill="#ffb13d" stroke="#1c1e2b" stroke-width="6"/><ellipse cx="560" cy="380" rx="8" ry="18" fill="#12131c"/><circle cx="558" cy="364" r="6" fill="#fff"/>
<path d="M420 332 L494 352" stroke="#12131c" stroke-width="12" stroke-linecap="round"/><path d="M604 332 L530 352" stroke="#12131c" stroke-width="12" stroke-linecap="round"/>
<path d="M500 416 L524 416 L512 430 Z" fill="#12131c"/>
<path d="M462 444 Q 512 498 562 444 Q 512 460 462 444 Z" fill="#12131c" stroke="#1c1e2b" stroke-width="6" stroke-linejoin="round"/>
<path d="M478 450 l8 18 l8 -16 Z M530 452 l8 16 l8 -18 Z" fill="#fff"/>
<ellipse cx="430" cy="430" rx="20" ry="10" fill="#e98aa6" opacity=".5"/>
<ellipse cx="594" cy="430" rx="20" ry="10" fill="#e98aa6" opacity=".5"/>
<g transform="translate(110 230) rotate(-10) scale(1.0)"><circle cx="4" cy="-30" r="58" fill="#ffb13d" opacity=".22"/><path d="M16 2 L16 -112" stroke="#1c1e2b" stroke-width="7" stroke-linecap="round"/><ellipse cx="0" cy="0" rx="17" ry="11" transform="rotate(-20 0 0)" fill="#ffb13d" stroke="#1c1e2b" stroke-width="5"/><ellipse cx="0" cy="-22" rx="17" ry="11" transform="rotate(-20 0 -22)" fill="#ffb13d" stroke="#1c1e2b" stroke-width="5"/><ellipse cx="0" cy="-44" rx="17" ry="11" transform="rotate(-20 0 -44)" fill="#ffb13d" stroke="#1c1e2b" stroke-width="5"/></g>
<g transform="translate(912 230) rotate(12) scale(1.0)"><circle cx="4" cy="-30" r="58" fill="#7fe0ff" opacity=".22"/><path d="M16 2 L16 -112" stroke="#1c1e2b" stroke-width="7" stroke-linecap="round"/><ellipse cx="0" cy="0" rx="17" ry="11" transform="rotate(-20 0 0)" fill="#7fe0ff" stroke="#1c1e2b" stroke-width="5"/><ellipse cx="0" cy="-22" rx="17" ry="11" transform="rotate(-20 0 -22)" fill="#7fe0ff" stroke="#1c1e2b" stroke-width="5"/><ellipse cx="0" cy="-44" rx="17" ry="11" transform="rotate(-20 0 -44)" fill="#7fe0ff" stroke="#1c1e2b" stroke-width="5"/></g>
<g transform="translate(512 120) rotate(0) scale(0.8)"><circle cx="4" cy="-30" r="58" fill="#27a567" opacity=".22"/><path d="M16 2 L16 -112" stroke="#1c1e2b" stroke-width="7" stroke-linecap="round"/><ellipse cx="0" cy="0" rx="17" ry="11" transform="rotate(-20 0 0)" fill="#27a567" stroke="#1c1e2b" stroke-width="5"/><ellipse cx="0" cy="-22" rx="17" ry="11" transform="rotate(-20 0 -22)" fill="#27a567" stroke="#1c1e2b" stroke-width="5"/><ellipse cx="0" cy="-44" rx="17" ry="11" transform="rotate(-20 0 -44)" fill="#27a567" stroke="#1c1e2b" stroke-width="5"/></g>
<path d="M210 120 q20 -30 40 0 t40 0" stroke="#7fe0ff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".8"/>
<path d="M740 110 q20 -30 40 0 t40 0" stroke="#7fe0ff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".8"/>
</svg>`;

interface AkordeonPortraitProps {
  size?: number;
}

export function AkordeonPortrait({ size = 48 }: AkordeonPortraitProps) {
  return <SvgXml xml={AKORDEON_SVG} width={size} height={size} />;
}
