import { useId } from "react";
import { SvgXml } from "react-native-svg";

/** Hand-illustrated portrait for Królestwo Instrumentów's own "boss" lesson
 * ("Pokonaj Słonia Trąbalskiego") — same inlined-SvgXml pattern as every
 * other boss here (ArytmikPortrait's own doc has the full reasoning). The
 * source SVG uses seven gradient/filter `id`s (skin — referenced ~50 times —
 * wood, shine, drum, brass, wine, soft), so it needs the same useId()-
 * namespaced-ids treatment FalszomirPortrait's own doc explains (avoids two
 * on-screen instances — map node + intro slide — colliding over the same raw
 * `id`). Its "trabalski-pokonany" (defeated) variant isn't wired up — no
 * boss here has a defeated state yet. */
function buildTrabalskiSvg(ids: { brass: string; drum: string; shine: string; skin: string; soft: string; wine: string; wood: string }): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
<defs>
<linearGradient id="${ids.skin}" gradientUnits="userSpaceOnUse" x1="330" y1="230" x2="720" y2="820"><stop offset="0" stop-color="#e2d2da"/><stop offset=".5" stop-color="#b49aa8"/><stop offset="1" stop-color="#86697a"/></linearGradient>
<radialGradient id="${ids.shine}" cx="35%" cy="25%" r="70%"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<linearGradient id="${ids.brass}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff0b0"/><stop offset=".5" stop-color="#e9b83e"/><stop offset="1" stop-color="#b07d17"/></linearGradient>
<linearGradient id="${ids.wine}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b8355a"/><stop offset="1" stop-color="#5e0f25"/></linearGradient>
<linearGradient id="${ids.drum}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5e0f25"/><stop offset=".3" stop-color="#b8355a"/><stop offset=".7" stop-color="#8e1b3a"/><stop offset="1" stop-color="#4a0b1d"/></linearGradient>
<linearGradient id="${ids.wood}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d9894a"/><stop offset="1" stop-color="#7a3e17"/></linearGradient>
<filter id="${ids.soft}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6"/></filter>
</defs>
<ellipse cx="512" cy="962" rx="320" ry="26" fill="#3a2230" opacity=".16" filter="url(#${ids.soft})"/>
<path d="M338 800 L338 930 C 338 970 686 970 686 930 L686 800 Z" fill="url(#${ids.drum})" stroke="#3a2230" stroke-width="9"/>
<path d="M350 830 L378 930 L406 830 L434 930 L462 830 L490 930 L518 830 L546 930 L574 830 L602 930 L630 830 L658 930 L686 830" stroke="#e9b83e" stroke-width="6" fill="none" stroke-linejoin="round"/>
<path d="M338 830 C 338 868 686 868 686 830" stroke="#3a2230" stroke-width="22" fill="none"/><path d="M338 830 C 338 868 686 868 686 830" stroke="#e9b83e" stroke-width="12" fill="none"/>
<path d="M338 930 C 338 968 686 968 686 930" stroke="#3a2230" stroke-width="22" fill="none"/><path d="M338 930 C 338 968 686 968 686 930" stroke="#e9b83e" stroke-width="12" fill="none"/>
<ellipse cx="512" cy="800" rx="174" ry="36" fill="#fbf3e2" stroke="#3a2230" stroke-width="8"/>
<path d="M400 470 C 330 560 300 700 300 790 L 724 790 C 724 700 694 560 624 470 Z" fill="url(#${ids.wine})" stroke="#3a2230" stroke-width="9" stroke-linejoin="round"/><path d="M300 790 L724 790" stroke="#e9b83e" stroke-width="12"/><path d="M300 790 L724 790" stroke="#3a2230" stroke-width="3" transform="translate(0 8)"/>
<text x="340" y="700.0" text-anchor="middle" font-family="'Baloo 2', Nunito, Arial, sans-serif" font-weight="800" font-size="34" fill="#e9b83e">♪</text>
<text x="370" y="620.0" text-anchor="middle" font-family="'Baloo 2', Nunito, Arial, sans-serif" font-weight="800" font-size="34" fill="#e9b83e">♪</text>
<text x="684" y="700.0" text-anchor="middle" font-family="'Baloo 2', Nunito, Arial, sans-serif" font-weight="800" font-size="34" fill="#e9b83e">♪</text>
<text x="654" y="620.0" text-anchor="middle" font-family="'Baloo 2', Nunito, Arial, sans-serif" font-weight="800" font-size="34" fill="#e9b83e">♪</text>
<path d="M402 280 C 272 230 222 350 252 440 C 282 510 362 470 402 420 Z" fill="url(#${ids.skin})" stroke="#3a2230" stroke-width="10" stroke-linejoin="round"/>
<path d="M402 280 C 272 230 222 350 252 440 C 282 510 362 470 402 420 Z" fill="#f2b8c6" opacity=".7" transform="translate(392 360) scale(.7) translate(-404 -354)"/>
<path d="M622 280 C 752 230 802 350 772 440 C 742 510 662 470 622 420 Z" fill="url(#${ids.skin})" stroke="#3a2230" stroke-width="10" stroke-linejoin="round"/>
<path d="M622 280 C 752 230 802 350 772 440 C 742 510 662 470 622 420 Z" fill="#f2b8c6" opacity=".7" transform="translate(632 360) scale(.7) translate(-620 -354)"/>
<path d="M512 450 C 640 450 680 560 680 650 C 680 750 610 800 512 800 C 414 800 344 750 344 650 C 344 560 384 450 512 450 Z" fill="#3a2230" stroke="#3a2230" stroke-width="20"/>
<path d="M452.0 770.0 L452.0 800.0" stroke="#3a2230" stroke-width="106" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M572.0 770.0 L572.0 800.0" stroke="#3a2230" stroke-width="106" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M384.0 520.0 L350.0 590.0 L346.0 672.0" stroke="#3a2230" stroke-width="72" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M640.0 520.0 L712.0 460.0 L756.0 384.0" stroke="#3a2230" stroke-width="72" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M512 450 C 640 450 680 560 680 650 C 680 750 610 800 512 800 C 414 800 344 750 344 650 C 344 560 384 450 512 450 Z" fill="url(#${ids.skin})"/>
<path d="M452.0 770.0 L452.0 800.0" stroke="url(#${ids.skin})" stroke-width="86" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M572.0 770.0 L572.0 800.0" stroke="url(#${ids.skin})" stroke-width="86" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M384.0 520.0 L350.0 590.0 L346.0 672.0" stroke="url(#${ids.skin})" stroke-width="52" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M640.0 520.0 L712.0 460.0 L756.0 384.0" stroke="url(#${ids.skin})" stroke-width="52" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<ellipse cx="512" cy="630" rx="170" ry="180" fill="url(#${ids.shine})"/>
<path d="M512 530 C 580 530 600 620 596 680 C 590 750 556 780 512 780 C 468 780 434 750 428 680 C 424 620 444 530 512 530 Z" fill="#e2d2da" opacity=".45"/>
<path d="M470 640 q42 14 84 0" stroke="#86697a" stroke-width="5" fill="none" opacity=".45" stroke-linecap="round"/>
<path d="M470 680 q42 14 84 0" stroke="#86697a" stroke-width="5" fill="none" opacity=".45" stroke-linecap="round"/>
<path d="M470 720 q42 14 84 0" stroke="#86697a" stroke-width="5" fill="none" opacity=".45" stroke-linecap="round"/>
<ellipse cx="430" cy="830" rx="10" ry="8" fill="#fbf3e2" stroke="#3a2230" stroke-width="4"/>
<ellipse cx="452" cy="830" rx="10" ry="8" fill="#fbf3e2" stroke="#3a2230" stroke-width="4"/>
<ellipse cx="474" cy="830" rx="10" ry="8" fill="#fbf3e2" stroke="#3a2230" stroke-width="4"/>
<ellipse cx="550" cy="830" rx="10" ry="8" fill="#fbf3e2" stroke="#3a2230" stroke-width="4"/>
<ellipse cx="572" cy="830" rx="10" ry="8" fill="#fbf3e2" stroke="#3a2230" stroke-width="4"/>
<ellipse cx="594" cy="830" rx="10" ry="8" fill="#fbf3e2" stroke="#3a2230" stroke-width="4"/>
<circle cx="512" cy="510" r="30" fill="url(#${ids.brass})" stroke="#3a2230" stroke-width="6"/><text x="512" y="524" text-anchor="middle" font-family="'Baloo 2', Nunito, Arial, sans-serif" font-weight="800" font-size="40" fill="#8e1b3a">♫</text>
<path d="M430 462 Q 512 500 594 462" stroke="#e9b83e" stroke-width="8" fill="none"/>
<circle cx="346" cy="672" r="30" fill="url(#${ids.skin})" stroke="#3a2230" stroke-width="8"/>
<path d="M332 686 v10" stroke="#3a2230" stroke-width="4" stroke-linecap="round"/>
<path d="M346 686 v10" stroke="#3a2230" stroke-width="4" stroke-linecap="round"/>
<path d="M360 686 v10" stroke="#3a2230" stroke-width="4" stroke-linecap="round"/>
<circle cx="756" cy="384" r="30" fill="url(#${ids.skin})" stroke="#3a2230" stroke-width="8"/>
<path d="M742 398 v10" stroke="#3a2230" stroke-width="4" stroke-linecap="round"/>
<path d="M756 398 v10" stroke="#3a2230" stroke-width="4" stroke-linecap="round"/>
<path d="M770 398 v10" stroke="#3a2230" stroke-width="4" stroke-linecap="round"/>
<path d="M760 374 L860 240" stroke="#3a2230" stroke-width="12" stroke-linecap="round"/><path d="M760 374 L860 240" stroke="#fbf3e2" stroke-width="6" stroke-linecap="round"/>
<g transform="translate(334.0 770.0) rotate(12.0) scale(0.95)"><path d="M0 -40 C 26 -40 30 -20 20 -8 C 34 4 36 40 0 44 C -36 40 -34 4 -20 -8 C -30 -20 -26 -40 0 -40 Z" fill="url(#${ids.wood})" stroke="#3a2230" stroke-width="5"/><path d="M-8 6 q-6 6 0 12 M8 6 q6 6 0 12" stroke="#3a2230" stroke-width="3" fill="none"/><rect x="-6" y="-96" width="12" height="60" rx="4" fill="#3a2414" stroke="#3a2230" stroke-width="4"/><circle cx="0" cy="-102" r="9" fill="url(#${ids.wood})" stroke="#3a2230" stroke-width="4"/><path d="M-3 -90 V30 M3 -90 V30" stroke="#f3ecd2" stroke-width="2"/></g>
<g transform="rotate(0 512 360)">
<ellipse cx="512" cy="360" rx="128" ry="118" fill="url(#${ids.skin})" stroke="#3a2230" stroke-width="11"/>
<ellipse cx="490" cy="330" rx="90" ry="70" fill="url(#${ids.shine})"/>
<circle cx="500.0" cy="420.0" r="49.0" fill="#3a2230"/><circle cx="497.5" cy="429.4" r="48.6" fill="#3a2230"/><circle cx="494.6" cy="438.2" r="48.1" fill="#3a2230"/><circle cx="491.3" cy="446.4" r="47.7" fill="#3a2230"/><circle cx="487.6" cy="453.9" r="47.3" fill="#3a2230"/><circle cx="483.6" cy="460.8" r="46.9" fill="#3a2230"/><circle cx="479.1" cy="467.0" r="46.5" fill="#3a2230"/><circle cx="474.4" cy="472.6" r="46.0" fill="#3a2230"/><circle cx="469.4" cy="477.6" r="45.6" fill="#3a2230"/><circle cx="464.0" cy="481.9" r="45.2" fill="#3a2230"/><circle cx="458.4" cy="485.6" r="44.8" fill="#3a2230"/><circle cx="452.6" cy="488.7" r="44.3" fill="#3a2230"/><circle cx="446.5" cy="491.1" r="43.9" fill="#3a2230"/><circle cx="440.3" cy="492.9" r="43.5" fill="#3a2230"/><circle cx="433.8" cy="494.0" r="43.0" fill="#3a2230"/><circle cx="427.2" cy="494.5" r="42.6" fill="#3a2230"/><circle cx="420.5" cy="494.4" r="42.2" fill="#3a2230"/><circle cx="413.6" cy="493.6" r="41.8" fill="#3a2230"/><circle cx="406.6" cy="492.2" r="41.4" fill="#3a2230"/><circle cx="399.6" cy="490.2" r="40.9" fill="#3a2230"/><circle cx="392.5" cy="487.5" r="40.5" fill="#3a2230"/><circle cx="385.4" cy="484.2" r="40.1" fill="#3a2230"/><circle cx="378.2" cy="480.2" r="39.6" fill="#3a2230"/><circle cx="371.0" cy="475.6" r="39.2" fill="#3a2230"/><circle cx="363.9" cy="470.4" r="38.8" fill="#3a2230"/><circle cx="356.8" cy="464.5" r="38.4" fill="#3a2230"/><circle cx="349.8" cy="458.0" r="38.0" fill="#3a2230"/><circle cx="342.9" cy="450.9" r="37.5" fill="#3a2230"/><circle cx="336.1" cy="443.1" r="37.1" fill="#3a2230"/><circle cx="329.4" cy="434.7" r="36.7" fill="#3a2230"/><circle cx="322.8" cy="425.6" r="36.2" fill="#3a2230"/><circle cx="316.4" cy="415.9" r="35.8" fill="#3a2230"/><circle cx="310.2" cy="405.6" r="35.4" fill="#3a2230"/><circle cx="304.3" cy="394.6" r="35.0" fill="#3a2230"/><circle cx="298.5" cy="383.0" r="34.5" fill="#3a2230"/><circle cx="293.0" cy="370.8" r="34.1" fill="#3a2230"/><circle cx="287.8" cy="357.9" r="33.7" fill="#3a2230"/><circle cx="282.8" cy="344.4" r="33.3" fill="#3a2230"/><circle cx="278.2" cy="330.2" r="32.9" fill="#3a2230"/><circle cx="273.9" cy="315.4" r="32.4" fill="#3a2230"/><circle cx="270.0" cy="300.0" r="32.0" fill="#3a2230"/><circle cx="500.0" cy="420.0" r="39.0" fill="url(#${ids.skin})"/><circle cx="497.5" cy="429.4" r="38.6" fill="url(#${ids.skin})"/><circle cx="494.6" cy="438.2" r="38.1" fill="url(#${ids.skin})"/><circle cx="491.3" cy="446.4" r="37.7" fill="url(#${ids.skin})"/><circle cx="487.6" cy="453.9" r="37.3" fill="url(#${ids.skin})"/><circle cx="483.6" cy="460.8" r="36.9" fill="url(#${ids.skin})"/><circle cx="479.1" cy="467.0" r="36.5" fill="url(#${ids.skin})"/><circle cx="474.4" cy="472.6" r="36.0" fill="url(#${ids.skin})"/><circle cx="469.4" cy="477.6" r="35.6" fill="url(#${ids.skin})"/><circle cx="464.0" cy="481.9" r="35.2" fill="url(#${ids.skin})"/><circle cx="458.4" cy="485.6" r="34.8" fill="url(#${ids.skin})"/><circle cx="452.6" cy="488.7" r="34.3" fill="url(#${ids.skin})"/><circle cx="446.5" cy="491.1" r="33.9" fill="url(#${ids.skin})"/><circle cx="440.3" cy="492.9" r="33.5" fill="url(#${ids.skin})"/><circle cx="433.8" cy="494.0" r="33.0" fill="url(#${ids.skin})"/><circle cx="427.2" cy="494.5" r="32.6" fill="url(#${ids.skin})"/><circle cx="420.5" cy="494.4" r="32.2" fill="url(#${ids.skin})"/><circle cx="413.6" cy="493.6" r="31.8" fill="url(#${ids.skin})"/><circle cx="406.6" cy="492.2" r="31.4" fill="url(#${ids.skin})"/><circle cx="399.6" cy="490.2" r="30.9" fill="url(#${ids.skin})"/><circle cx="392.5" cy="487.5" r="30.5" fill="url(#${ids.skin})"/><circle cx="385.4" cy="484.2" r="30.1" fill="url(#${ids.skin})"/><circle cx="378.2" cy="480.2" r="29.6" fill="url(#${ids.skin})"/><circle cx="371.0" cy="475.6" r="29.2" fill="url(#${ids.skin})"/><circle cx="363.9" cy="470.4" r="28.8" fill="url(#${ids.skin})"/><circle cx="356.8" cy="464.5" r="28.4" fill="url(#${ids.skin})"/><circle cx="349.8" cy="458.0" r="27.9" fill="url(#${ids.skin})"/><circle cx="342.9" cy="450.9" r="27.5" fill="url(#${ids.skin})"/><circle cx="336.1" cy="443.1" r="27.1" fill="url(#${ids.skin})"/><circle cx="329.4" cy="434.7" r="26.7" fill="url(#${ids.skin})"/><circle cx="322.8" cy="425.6" r="26.2" fill="url(#${ids.skin})"/><circle cx="316.4" cy="415.9" r="25.8" fill="url(#${ids.skin})"/><circle cx="310.2" cy="405.6" r="25.4" fill="url(#${ids.skin})"/><circle cx="304.3" cy="394.6" r="25.0" fill="url(#${ids.skin})"/><circle cx="298.5" cy="383.0" r="24.6" fill="url(#${ids.skin})"/><circle cx="293.0" cy="370.8" r="24.1" fill="url(#${ids.skin})"/><circle cx="287.8" cy="357.9" r="23.7" fill="url(#${ids.skin})"/><circle cx="282.8" cy="344.4" r="23.3" fill="url(#${ids.skin})"/><circle cx="278.2" cy="330.2" r="22.9" fill="url(#${ids.skin})"/><circle cx="273.9" cy="315.4" r="22.4" fill="url(#${ids.skin})"/><circle cx="270.0" cy="300.0" r="22.0" fill="url(#${ids.skin})"/>
<path d="M498.6 483.5 L459.7 450.6" stroke="#86697a" stroke-width="4" stroke-linecap="round"/>
<path d="M461.5 511.0 L443.7 466.4" stroke="#86697a" stroke-width="4" stroke-linecap="round"/>
<path d="M418.0 516.8 L423.0 472.0" stroke="#86697a" stroke-width="4" stroke-linecap="round"/>
<path d="M375.2 502.6 L395.5 465.8" stroke="#86697a" stroke-width="4" stroke-linecap="round"/>
<path d="M335.8 471.7 L363.9 444.4" stroke="#86697a" stroke-width="4" stroke-linecap="round"/>
<path d="M300.9 425.2 L331.9 406.6" stroke="#86697a" stroke-width="4" stroke-linecap="round"/>
<path d="M272.2 363.6 L303.4 352.2" stroke="#86697a" stroke-width="4" stroke-linecap="round"/>
<g transform="translate(270.0 300.0) rotate(-105.2) scale(0.9)"><path d="M-6 -22 L40 -26 C 60 -30 80 -60 92 -72 L92 72 C 80 60 60 30 40 26 L-6 22 Z" fill="url(#${ids.brass})" stroke="#3a2230" stroke-width="7" stroke-linejoin="round"/><ellipse cx="92" cy="0" rx="20" ry="74" fill="#5a3a0a" stroke="#3a2230" stroke-width="7"/><ellipse cx="96" cy="0" rx="10" ry="52" fill="#2a1a04"/><path d="M-6 -22 V22" stroke="#b07d17" stroke-width="8"/><path d="M10 -16 L60 -22" stroke="#fff" stroke-width="5" opacity=".6" stroke-linecap="round"/></g>
<path d="M468 430 C 456 470 432 480 416 468 C 438 460 446 446 450 424 Z" fill="#fbf3e2" stroke="#3a2230" stroke-width="6" stroke-linejoin="round"/>
<path d="M556 430 C 568 470 592 480 608 468 C 586 460 578 446 574 424 Z" fill="#fbf3e2" stroke="#3a2230" stroke-width="6" stroke-linejoin="round"/>
<ellipse cx="462" cy="352" rx="22" ry="28" fill="#fff" stroke="#3a2230" stroke-width="5"/><circle cx="458" cy="358" r="13" fill="#1a0f15"/><circle cx="454" cy="352" r="5" fill="#fff"/>
<ellipse cx="562" cy="352" rx="22" ry="28" fill="#fff" stroke="#3a2230" stroke-width="5"/><circle cx="556" cy="358" r="13" fill="#1a0f15"/><circle cx="554" cy="352" r="5" fill="#fff"/>
<path d="M430 306 L488 324" stroke="#3a2230" stroke-width="10" stroke-linecap="round"/><path d="M594 306 L536 324" stroke="#3a2230" stroke-width="10" stroke-linecap="round"/>
<ellipse cx="436" cy="396" rx="20" ry="10" fill="#f2b8c6" opacity=".7"/>
<ellipse cx="588" cy="396" rx="20" ry="10" fill="#f2b8c6" opacity=".7"/>
<path d="M420 272 Q 512 232 604 272" stroke="#3a2230" stroke-width="18" fill="none" stroke-linecap="round"/><path d="M420 272 Q 512 232 604 272" stroke="#e9b83e" stroke-width="10" fill="none" stroke-linecap="round"/>
<circle cx="512" cy="252" r="12" fill="#b8355a" stroke="#3a2230" stroke-width="4"/>
</g>
<path d="M262.0 180.0 A60 60 0 0 0 140.0 298.0" stroke="#e9b83e" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.9"/>
<path d="M270.0 140.0 A100 100 0 0 0 100.0 290.0" stroke="#e9b83e" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.7"/>
<path d="M278.0 100.0 A140 140 0 0 0 60.0 282.0" stroke="#e9b83e" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.5"/>
<g transform="translate(140.0 150.0) rotate(-25.0) scale(0.9)"><rect x="-80" y="-9" width="160" height="18" rx="9" fill="#dfe3ea" stroke="#3a2230" stroke-width="5"/><circle cx="-40" cy="0" r="4" fill="#3a2230"/><circle cx="-18" cy="0" r="4" fill="#3a2230"/><circle cx="4" cy="0" r="4" fill="#3a2230"/><circle cx="26" cy="0" r="4" fill="#3a2230"/><circle cx="48" cy="0" r="4" fill="#3a2230"/><rect x="-80" y="-9" width="22" height="18" rx="6" fill="#b7bcc8" stroke="#3a2230" stroke-width="4"/></g><g transform="translate(110.0 330.0) rotate(10.0) scale(0.9)"><rect x="-40" y="-14" width="80" height="44" fill="url(#${ids.drum})" stroke="#3a2230" stroke-width="5"/><ellipse cx="0" cy="-14" rx="40" ry="12" fill="#fbf3e2" stroke="#3a2230" stroke-width="5"/><path d="M-30 -10 L-50 -60 M24 -14 L54 -56" stroke="#7a3e17" stroke-width="6" stroke-linecap="round"/><circle cx="-50" cy="-60" r="7" fill="#fbf3e2" stroke="#3a2230" stroke-width="3"/><circle cx="54" cy="-56" r="7" fill="#fbf3e2" stroke="#3a2230" stroke-width="3"/></g><g transform="translate(300.0 70.0) rotate(15.0) scale(0.9)"><path d="M-4 -32 L0 -40 L36 26 L-30 26 L-8 -18" stroke="#3a2230" stroke-width="12" fill="none" stroke-linejoin="round"/><path d="M-4 -32 L0 -40 L36 26 L-30 26 L-8 -18" stroke="#dfe3ea" stroke-width="6" fill="none" stroke-linejoin="round"/></g><g transform="translate(390.0 120.0) rotate(-35.0) scale(0.7)"><path d="M0 -40 C 26 -40 30 -20 20 -8 C 34 4 36 40 0 44 C -36 40 -34 4 -20 -8 C -30 -20 -26 -40 0 -40 Z" fill="url(#${ids.wood})" stroke="#3a2230" stroke-width="5"/><path d="M-8 6 q-6 6 0 12 M8 6 q6 6 0 12" stroke="#3a2230" stroke-width="3" fill="none"/><rect x="-6" y="-96" width="12" height="60" rx="4" fill="#3a2414" stroke="#3a2230" stroke-width="4"/><circle cx="0" cy="-102" r="9" fill="url(#${ids.wood})" stroke="#3a2230" stroke-width="4"/><path d="M-3 -90 V30 M3 -90 V30" stroke="#f3ecd2" stroke-width="2"/></g>
<text x="50" y="470" text-anchor="middle" font-family="'Baloo 2', Nunito, Arial, sans-serif" font-weight="800" font-size="53" fill="#8e1b3a" stroke="#fff" stroke-width="6" paint-order="stroke">?</text><text x="60" y="230" text-anchor="middle" font-family="'Baloo 2', Nunito, Arial, sans-serif" font-weight="800" font-size="43" fill="#b07d17" stroke="#fff" stroke-width="6" paint-order="stroke">?</text><text x="200" y="60" text-anchor="middle" font-family="'Baloo 2', Nunito, Arial, sans-serif" font-weight="800" font-size="38" fill="#8e1b3a" stroke="#fff" stroke-width="6" paint-order="stroke">?</text>
<text x="880" y="420" text-anchor="middle" font-family="'Baloo 2', Nunito, Arial, sans-serif" font-weight="800" font-size="56" fill="#8e1b3a" stroke="#fff" stroke-width="6" paint-order="stroke">♪</text>
<text x="930" y="300" text-anchor="middle" font-family="'Baloo 2', Nunito, Arial, sans-serif" font-weight="800" font-size="56" fill="#b07d17" stroke="#fff" stroke-width="6" paint-order="stroke">♪</text>
</svg>`;
}

interface TrabalskiPortraitProps {
  size?: number;
}

export function TrabalskiPortrait({ size = 48 }: TrabalskiPortraitProps) {
  const uid = useId().replace(/:/g, "-");
  return (
    <SvgXml
      xml={buildTrabalskiSvg({
        brass: `trabalski-brass-${uid}`,
        drum: `trabalski-drum-${uid}`,
        shine: `trabalski-shine-${uid}`,
        skin: `trabalski-skin-${uid}`,
        soft: `trabalski-soft-${uid}`,
        wine: `trabalski-wine-${uid}`,
        wood: `trabalski-wood-${uid}`,
      })}
      width={size}
      height={size}
    />
  );
}
