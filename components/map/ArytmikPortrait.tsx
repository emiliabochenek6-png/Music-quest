import { SvgXml } from "react-native-svg";

/** Hand-illustrated portrait for Miasto Rytmu's own bonus/"boss" lesson
 * ("Pokonaj Arytmika") — supplied as a raw .svg, inlined the same way
 * FalszomirPortrait.tsx inlines Wioska Nut's own boss art (see that
 * file's own doc for the full "why SvgXml, not an Image" reasoning).
 * Unlike Fałszomir's source SVG, this one has no `id`/`clipPath`
 * elements at all — nothing for two simultaneous instances (the map's
 * own boss node AND the lesson's "Zapoznaj się" intro slide) to collide
 * over, so this doesn't need FalszomirPortrait's own useId()-namespacing
 * dance. */
const ARYTMIK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
<polyline points="423 790 457 801 423 812 457 823 423 834 457 845 423 856 457 867 423 878 457 889 423 900" fill="none" stroke="#141c45" stroke-width="16" stroke-linejoin="round" stroke-linecap="round"></polyline><polyline points="423 790 457 801 423 812 457 823 423 834 457 845 423 856 457 867 423 878 457 889 423 900" fill="none" stroke="#8fa0c8" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"></polyline>
<polyline points="567 790 601 801 567 812 601 823 567 834 601 845 567 856 601 867 567 878 601 889 567 900" fill="none" stroke="#141c45" stroke-width="16" stroke-linejoin="round" stroke-linecap="round"></polyline><polyline points="567 790 601 801 567 812 601 823 567 834 601 845 567 856 601 867 567 878 601 889 567 900" fill="none" stroke="#8fa0c8" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"></polyline>
<g transform="translate(420 925) scale(-1 1)"><path d="M-44 0 C -44 -34 -10 -40 10 -32 C 34 -24 58 -18 58 0 Z" fill="#3fd0f0" stroke="#141c45" stroke-width="9" stroke-linejoin="round"></path><rect x="-50" y="-4" width="114" height="18" rx="9" fill="#b8e03a" stroke="#141c45" stroke-width="8"></rect><path d="M-14 -30 l10 12 M2 -30 l10 12" stroke="#141c45" stroke-width="5" stroke-linecap="round"></path></g>
<g transform="translate(604 925) scale(1 1)"><path d="M-44 0 C -44 -34 -10 -40 10 -32 C 34 -24 58 -18 58 0 Z" fill="#3fd0f0" stroke="#141c45" stroke-width="9" stroke-linejoin="round"></path><rect x="-50" y="-4" width="114" height="18" rx="9" fill="#b8e03a" stroke="#141c45" stroke-width="8"></rect><path d="M-14 -30 l10 12 M2 -30 l10 12" stroke="#141c45" stroke-width="5" stroke-linecap="round"></path></g>
<path d="M512 700 L640 150" stroke="#141c45" stroke-width="20" stroke-linecap="round"></path><path d="M512 700 L640 150" stroke="#8fa0c8" stroke-width="9" stroke-linecap="round"></path>
<g transform="rotate(13 612 250)"><rect x="584" y="226" width="58" height="46" rx="10" fill="#ffc83d" stroke="#b8741a" stroke-width="8"></rect><path d="M596 240 h34" stroke="#fff3c4" stroke-width="5" stroke-linecap="round"></path></g>
<circle cx="640" cy="150" r="16" fill="#ff5a4e" stroke="#141c45" stroke-width="7"></circle>
<path d="M690 170 q30 30 20 70 M720 150 q40 40 28 96" stroke="#3fd0f0" stroke-width="8" fill="none" stroke-linecap="round"></path>
<path d="M330 540 L230 590 L190 480" fill="none" stroke="#141c45" stroke-width="44" stroke-linecap="round" stroke-linejoin="round"></path><path d="M330 540 L230 590 L190 480" fill="none" stroke="#8fa0c8" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"></path><rect x="-17" y="-3" width="34" height="6" rx="3" fill="#141c45" transform="translate(300 555) rotate(243)"></rect><rect x="-17" y="-3" width="34" height="6" rx="3" fill="#141c45" transform="translate(280 565) rotate(243)"></rect><rect x="-17" y="-3" width="34" height="6" rx="3" fill="#141c45" transform="translate(260 575) rotate(243)"></rect><rect x="-17" y="-3" width="34" height="6" rx="3" fill="#141c45" transform="translate(218 557) rotate(-20)"></rect><rect x="-17" y="-3" width="34" height="6" rx="3" fill="#141c45" transform="translate(210 535) rotate(-20)"></rect><rect x="-17" y="-3" width="34" height="6" rx="3" fill="#141c45" transform="translate(202 513) rotate(-20)"></rect>
<path d="M694 560 L800 600 L850 700" fill="none" stroke="#141c45" stroke-width="44" stroke-linecap="round" stroke-linejoin="round"></path><path d="M694 560 L800 600 L850 700" fill="none" stroke="#8fa0c8" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"></path><rect x="-17" y="-3" width="34" height="6" rx="3" fill="#141c45" transform="translate(726 572) rotate(111)"></rect><rect x="-17" y="-3" width="34" height="6" rx="3" fill="#141c45" transform="translate(747 580) rotate(111)"></rect><rect x="-17" y="-3" width="34" height="6" rx="3" fill="#141c45" transform="translate(768 588) rotate(111)"></rect><rect x="-17" y="-3" width="34" height="6" rx="3" fill="#141c45" transform="translate(815 630) rotate(153)"></rect><rect x="-17" y="-3" width="34" height="6" rx="3" fill="#141c45" transform="translate(825 650) rotate(153)"></rect><rect x="-17" y="-3" width="34" height="6" rx="3" fill="#141c45" transform="translate(835 670) rotate(153)"></rect>
<path d="M455 280 L569 280 C 590 280 600 292 604 310 L732 770 C 738 796 722 812 696 812 L328 812 C 302 812 286 796 292 770 L420 310 C 424 292 434 280 455 280 Z" fill="#2b3f8f" stroke="#141c45" stroke-width="12" stroke-linejoin="round"></path>
<path d="M462 470 L562 470 L660 760 C 662 772 656 778 646 778 L378 778 C 368 778 362 772 364 760 Z" fill="#4262c4" opacity=".85"></path>
<path d="M440 320 L400 470" stroke="#6f8fe8" stroke-width="14" stroke-linecap="round" opacity=".7"></path>
<circle cx="350" cy="780" r="7" fill="#8fa0c8" stroke="#141c45" stroke-width="4"></circle>
<circle cx="674" cy="780" r="7" fill="#8fa0c8" stroke="#141c45" stroke-width="4"></circle>
<circle cx="452" cy="300" r="7" fill="#8fa0c8" stroke="#141c45" stroke-width="4"></circle>
<circle cx="572" cy="300" r="7" fill="#8fa0c8" stroke="#141c45" stroke-width="4"></circle>
<circle cx="512" cy="650" r="98" fill="#0e1433" stroke="#141c45" stroke-width="10"></circle>
<circle cx="512" cy="650" r="74" fill="#26306a" stroke="#8fa0c8" stroke-width="6"></circle>
<circle cx="512" cy="650" r="36" fill="#8fa0c8" stroke="#141c45" stroke-width="6"></circle><circle cx="500" cy="638" r="10" fill="#fff" opacity=".5"></circle>
<path d="M418 560 A130 130 0 0 0 418 740" stroke="#3fd0f0" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.9"></path>
<path d="M606 560 A130 130 0 0 1 606 740" stroke="#3fd0f0" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.9"></path>
<path d="M397 540 A160 160 0 0 0 397 760" stroke="#3fd0f0" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.6000000000000001"></path>
<path d="M627 540 A160 160 0 0 1 627 760" stroke="#3fd0f0" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.6000000000000001"></path>
<g>
<path d="M388 400 C 380 250 644 250 636 400" stroke="#141c45" stroke-width="30" fill="none" stroke-linecap="round"></path><path d="M388 400 C 380 250 644 250 636 400" stroke="#b8e03a" stroke-width="16" fill="none" stroke-linecap="round"></path>
<rect x="352" y="360" width="68" height="94" rx="30" fill="#b8e03a" stroke="#141c45" stroke-width="10"></rect><rect x="368" y="378" width="36" height="58" rx="16" fill="#6f8f12"></rect>
<rect x="604" y="360" width="68" height="94" rx="30" fill="#b8e03a" stroke="#141c45" stroke-width="10"></rect><rect x="620" y="378" width="36" height="58" rx="16" fill="#6f8f12"></rect>
</g>
<rect x="432" y="342" width="160" height="112" rx="22" fill="#0e1433" stroke="#141c45" stroke-width="10"></rect>
<rect x="444" y="352" width="136" height="18" rx="9" fill="#fff" opacity=".08"></rect>
<path d="M456 372 L500 388 L500 408 L460 408 Z" fill="#b8e03a"></path><path d="M568 372 L524 388 L524 408 L564 408 Z" fill="#b8e03a"></path>
<rect x="476" y="394" width="12" height="12" fill="#0e1433"></rect><rect x="536" y="394" width="12" height="12" fill="#0e1433"></rect>
<path d="M462 426 L478 438 L494 424 L510 440 L526 424 L542 438 L562 424" stroke="#b8e03a" stroke-width="8" fill="none" stroke-linejoin="round" stroke-linecap="round"></path>
<circle cx="190" cy="470" r="30" fill="#3fd0f0" stroke="#141c45" stroke-width="9"></circle><path d="M176 462 q14 -10 28 0" stroke="#141c45" stroke-width="5" fill="none" stroke-linecap="round"></path>
<path d="M190 470 L300 300" stroke="#141c45" stroke-width="22" stroke-linecap="round"></path><path d="M190 470 L300 300" stroke="#f6e3c0" stroke-width="12" stroke-linecap="round"></path><circle cx="300" cy="300" r="14" fill="#ff5a4e" stroke="#141c45" stroke-width="7"></circle>
<circle cx="852" cy="708" r="30" fill="#3fd0f0" stroke="#141c45" stroke-width="9"></circle><path d="M838 700 q14 -10 28 0" stroke="#141c45" stroke-width="5" fill="none" stroke-linecap="round"></path>
<path d="M852 708 L960 780" stroke="#141c45" stroke-width="22" stroke-linecap="round"></path><path d="M852 708 L960 780" stroke="#f6e3c0" stroke-width="12" stroke-linecap="round"></path><circle cx="960" cy="780" r="14" fill="#ff5a4e" stroke="#141c45" stroke-width="7"></circle>
<path d="M257 275 L231 260" stroke="#ffc83d" stroke-width="9" stroke-linecap="round"></path>
<path d="M283 253 L273 225" stroke="#ffc83d" stroke-width="9" stroke-linecap="round"></path>
<path d="M317 253 L327 225" stroke="#ffc83d" stroke-width="9" stroke-linecap="round"></path>
<path transform="translate(150 230) rotate(-15) scale(1)" d="M-6 -40 L12 -20 L-8 0 L10 20 C -14 12 -14 34 2 40" fill="none" stroke="#141c45" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"></path><path transform="translate(150 230) rotate(-15) scale(1)" d="M-6 -40 L12 -20 L-8 0 L10 20 C -14 12 -14 34 2 40" fill="none" stroke="#b8e03a" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"></path>
<path transform="translate(880 380) rotate(20) scale(0.8)" d="M-6 -40 L12 -20 L-8 0 L10 20 C -14 12 -14 34 2 40" fill="none" stroke="#141c45" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"></path><path transform="translate(880 380) rotate(20) scale(0.8)" d="M-6 -40 L12 -20 L-8 0 L10 20 C -14 12 -14 34 2 40" fill="none" stroke="#3fd0f0" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"></path>
<rect x="80" y="820" width="16" height="40" rx="5" fill="#3fd0f0" stroke="#141c45" stroke-width="5"></rect><rect x="102" y="770" width="16" height="90" rx="5" fill="#3fd0f0" stroke="#141c45" stroke-width="5"></rect><rect x="124" y="836" width="16" height="24" rx="5" fill="#3fd0f0" stroke="#141c45" stroke-width="5"></rect><rect x="146" y="790" width="16" height="70" rx="5" fill="#3fd0f0" stroke="#141c45" stroke-width="5"></rect>
<rect x="860" y="570" width="16" height="30" rx="5" fill="#b8e03a" stroke="#141c45" stroke-width="5"></rect><rect x="882" y="530" width="16" height="70" rx="5" fill="#b8e03a" stroke="#141c45" stroke-width="5"></rect><rect x="904" y="550" width="16" height="50" rx="5" fill="#b8e03a" stroke="#141c45" stroke-width="5"></rect>
</svg>`;

interface ArytmikPortraitProps {
  size?: number;
}

export function ArytmikPortrait({ size = 48 }: ArytmikPortraitProps) {
  return <SvgXml xml={ARYTMIK_SVG} width={size} height={size} />;
}
