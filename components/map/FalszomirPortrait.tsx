import { useId } from "react";
import { SvgXml } from "react-native-svg";

/** Hand-illustrated portrait for Wioska Nut's bonus/"boss" lesson
 * ("Pokonaj króla Fałszomira") — supplied as a raw .svg, inlined here the
 * same way components/icons/icons.ts inlines the app's other hand-drawn
 * art (no svg-to-component Metro transform configured in this project).
 * A single 1024×1024 viewBox illustration, not a small monochrome glyph,
 * so it gets its own file rather than joining ICONS' shared lookup.
 *
 * A function of the two eye clip-path ids, not a plain string constant —
 * this portrait renders in more than one place at once (the map's own
 * boss node AND the lesson's "Zapoznaj się" intro slide), and SvgXml
 * inlines its markup directly into the page's real DOM rather than an
 * isolated shadow tree. Two instances sharing the same hard-coded
 * `id="eL"`/`id="eR"` would violate SVG's "ids are unique per document"
 * rule — the browser resolves every `url(#eL)` reference to whichever
 * element got that id FIRST, so the second instance's own eye group ends
 * up clipped against the WRONG (or, if that first element is later
 * unmounted, a dangling/missing) clip path instead of its own, which is
 * exactly what made one eye silently disappear on the intro slide. Each
 * render now gets its own ids (see FalszomirPortrait's own useId call)
 * so no two instances can ever collide, regardless of how many render at
 * once either now or in some future screen. */
function buildFalszomirSvg(eyeLeftId: string, eyeRightId: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
<defs>
<clipPath id="${eyeLeftId}"><path d="M398 540 L482 566 C 488 604 470 628 442 628 C 410 628 392 598 398 540 Z"></path></clipPath>
<clipPath id="${eyeRightId}"><path d="M626 540 L542 566 C 536 604 554 628 582 628 C 614 628 632 598 626 540 Z"></path></clipPath>
</defs>
<path d="M318 470 C 210 600 150 780 176 902 C 240 872 300 906 360 884 C 420 904 470 890 512 900 C 554 890 604 904 664 884 C 724 906 784 872 848 902 C 874 780 814 600 706 470 Z" fill="#4A2378" stroke="#3A1A68" stroke-width="10" stroke-linejoin="round"></path>
<path d="M340 520 C 260 640 220 780 236 870 C 280 858 320 874 360 862 L 664 862 C 704 874 744 858 788 870 C 804 780 764 640 684 520 Z" fill="#C2334F" opacity=".9"></path>
<ellipse cx="430" cy="872" rx="58" ry="32" fill="#5E34A0" stroke="#3A1A68" stroke-width="9"></ellipse>
<ellipse cx="594" cy="872" rx="58" ry="32" fill="#5E34A0" stroke="#3A1A68" stroke-width="9"></ellipse>
<path d="M286 600 C 220 610 186 660 206 712 C 222 748 268 740 272 708 C 276 680 296 664 318 660 Z" fill="#7B4BC0" stroke="#3A1A68" stroke-width="10" stroke-linejoin="round"></path>
<path d="M512 322 C 694 322 786 466 786 620 C 786 792 664 872 512 872 C 360 872 238 792 238 620 C 238 466 330 322 512 322 Z" fill="#7B4BC0" stroke="#3A1A68" stroke-width="11"></path>
<path d="M420 360 C 360 380 318 430 300 490" stroke="#A67DE0" stroke-width="18" fill="none" stroke-linecap="round" opacity=".7"></path>
<ellipse cx="512" cy="738" rx="160" ry="118" fill="#DCCBF4"></ellipse>
<path d="M512 760 C 492 760 488 734 506 728 C 528 722 538 750 520 772 C 504 790 480 790 470 776" stroke="#A88BD6" stroke-width="7" fill="none" stroke-linecap="round"></path>
<path d="M250 712 C 380 790 630 790 778 700" transform="translate(10 20)" stroke="#FFF4DD" stroke-width="52" fill="none" stroke-linecap="round" opacity=".95"></path><path d="M250 712 C 380 790 630 790 778 700" transform="translate(0.0 0)" stroke="#3A1A68" stroke-width="4" fill="none" stroke-linecap="round"></path><path d="M250 712 C 380 790 630 790 778 700" transform="translate(4.5 9)" stroke="#3A1A68" stroke-width="4" fill="none" stroke-linecap="round"></path><path d="M250 712 C 380 790 630 790 778 700" transform="translate(9.0 18)" stroke="#3A1A68" stroke-width="4" fill="none" stroke-linecap="round"></path><path d="M250 712 C 380 790 630 790 778 700" transform="translate(13.5 27)" stroke="#3A1A68" stroke-width="4" fill="none" stroke-linecap="round"></path><path d="M250 712 C 380 790 630 790 778 700" transform="translate(18.0 36)" stroke="#3A1A68" stroke-width="4" fill="none" stroke-linecap="round"></path>
<ellipse cx="392" cy="773" rx="15" ry="11" transform="rotate(-18 392 773)" fill="#27B3A6" stroke="#3A1A68" stroke-width="5"></ellipse>
<ellipse cx="650" cy="763" rx="15" ry="11" transform="rotate(24 650 763)" fill="#EE5F93" stroke="#3A1A68" stroke-width="5"></ellipse>
<path d="M742 560 C 800 540 840 490 848 446 C 856 414 898 418 898 452 C 896 520 836 600 764 636 Z" fill="#7B4BC0" stroke="#3A1A68" stroke-width="10" stroke-linejoin="round"></path>
<path d="M872 440 L952 262" stroke="#3A1A68" stroke-width="20" stroke-linecap="round"></path>
<path d="M872 440 L952 262" stroke="#F3E3C3" stroke-width="10" stroke-linecap="round"></path>
<path d="M905 368 L918 360 L912 346 L925 338" stroke="#3A1A68" stroke-width="4" fill="none" stroke-linecap="round"></path>
<circle cx="872" cy="444" r="30" fill="#7B4BC0" stroke="#3A1A68" stroke-width="10"></circle>
<path d="M970 262 L988 262" stroke="#27B3A6" stroke-width="7" stroke-linecap="round"></path>
<path d="M961 278 L970 293" stroke="#27B3A6" stroke-width="7" stroke-linecap="round"></path>
<path d="M943 278 L934 293" stroke="#27B3A6" stroke-width="7" stroke-linecap="round"></path>
<path d="M934 262 L916 262" stroke="#27B3A6" stroke-width="7" stroke-linecap="round"></path>
<path d="M943 246 L934 231" stroke="#27B3A6" stroke-width="7" stroke-linecap="round"></path>
<path d="M961 246 L970 231" stroke="#27B3A6" stroke-width="7" stroke-linecap="round"></path>
<path d="M940 230 C 900 120 780 90 700 140 C 640 180 660 240 610 250" transform="translate(10 20)" stroke="#FFF4DD" stroke-width="52" fill="none" stroke-linecap="round" opacity=".95"></path><path d="M940 230 C 900 120 780 90 700 140 C 640 180 660 240 610 250" transform="translate(0.0 0)" stroke="#3A1A68" stroke-width="4" fill="none" stroke-linecap="round"></path><path d="M940 230 C 900 120 780 90 700 140 C 640 180 660 240 610 250" transform="translate(4.5 9)" stroke="#3A1A68" stroke-width="4" fill="none" stroke-linecap="round"></path><path d="M940 230 C 900 120 780 90 700 140 C 640 180 660 240 610 250" transform="translate(9.0 18)" stroke="#3A1A68" stroke-width="4" fill="none" stroke-linecap="round"></path><path d="M940 230 C 900 120 780 90 700 140 C 640 180 660 240 610 250" transform="translate(13.5 27)" stroke="#3A1A68" stroke-width="4" fill="none" stroke-linecap="round"></path>
<g transform="translate(800 150) rotate(28) scale(0.8)">
<path d="M14 -70 L14 0" stroke="#3A1A68" stroke-width="7" stroke-linecap="round"></path>
<path d="M14 -70 C 34 -58 44 -44 36 -26" stroke="#3A1A68" stroke-width="7" fill="none" stroke-linecap="round"></path>
<ellipse cx="0" cy="4" rx="19" ry="14" transform="rotate(-22)" fill="#EE5F93" stroke="#3A1A68" stroke-width="6"></ellipse>
<path d="M-6 -2 L2 6 L-2 12" stroke="#3A1A68" stroke-width="3" fill="none"></path></g>
<g transform="translate(690 215) rotate(-30) scale(0.75)">
<path d="M14 -70 L14 0" stroke="#3A1A68" stroke-width="7" stroke-linecap="round"></path>
<path d="M14 -70 C 34 -58 44 -44 36 -26" stroke="#3A1A68" stroke-width="7" fill="none" stroke-linecap="round"></path>
<ellipse cx="0" cy="4" rx="19" ry="14" transform="rotate(-22)" fill="#27B3A6" stroke="#3A1A68" stroke-width="6"></ellipse>
<path d="M-6 -2 L2 6 L-2 12" stroke="#3A1A68" stroke-width="3" fill="none"></path></g>
<g transform="translate(975 150) rotate(15) scale(0.7)">
<path d="M14 -70 L14 0" stroke="#3A1A68" stroke-width="7" stroke-linecap="round"></path>
<path d="M14 -70 C 34 -58 44 -44 36 -26" stroke="#3A1A68" stroke-width="7" fill="none" stroke-linecap="round"></path>
<ellipse cx="0" cy="4" rx="19" ry="14" transform="rotate(-22)" fill="#F7B733" stroke="#3A1A68" stroke-width="6"></ellipse>
<path d="M-6 -2 L2 6 L-2 12" stroke="#3A1A68" stroke-width="3" fill="none"></path></g>
<g clip-path="url(#${eyeLeftId})"><rect x="380" y="520" width="270" height="120" fill="#FFFBEA"></rect><circle cx="452" cy="598" r="22" fill="#2A0F4A"></circle><circle cx="446" cy="590" r="7" fill="#fff"></circle><circle cx="460" cy="606" r="3" fill="#fff"></circle></g>
<g clip-path="url(#${eyeRightId})"><rect x="380" y="520" width="270" height="120" fill="#FFFBEA"></rect><circle cx="572" cy="598" r="22" fill="#2A0F4A"></circle><circle cx="566" cy="590" r="7" fill="#fff"></circle><circle cx="580" cy="606" r="3" fill="#fff"></circle></g>
<path d="M398 540 L482 566 C 488 604 470 628 442 628 C 410 628 392 598 398 540 Z" fill="none" stroke="#2A0F4A" stroke-width="7" stroke-linejoin="round"></path>
<path d="M626 540 L542 566 C 536 604 554 628 582 628 C 614 628 632 598 626 540 Z" fill="none" stroke="#2A0F4A" stroke-width="7" stroke-linejoin="round"></path>
<path d="M384 518 L490 552" stroke="#2A0F4A" stroke-width="14" stroke-linecap="round"></path><path d="M640 518 L534 552" stroke="#2A0F4A" stroke-width="14" stroke-linecap="round"></path>
<path d="M458 656 Q 520 720 590 648 Q 524 684 458 656 Z" fill="#2A0F4A" stroke="#2A0F4A" stroke-width="6" stroke-linejoin="round"></path>
<path d="M500 690 Q 524 702 548 690 Q 524 684 500 690 Z" fill="#E7708F"></path>
<path d="M548 670 L566 664 L558 688 Z" fill="#fff"></path>
<ellipse cx="388" cy="640" rx="30" ry="16" fill="#F08DB0" opacity=".55"></ellipse>
<ellipse cx="636" cy="640" rx="30" ry="16" fill="#F08DB0" opacity=".55"></ellipse>
<g transform="rotate(-10 512 330)">
<path d="M398 362 L382 238 L452 298 L512 206 L572 298 L642 238 L626 362 Z" fill="#F7B733" stroke="#B8741A" stroke-width="9" stroke-linejoin="round"></path>
<path d="M398 362 L626 362 L630 332 L394 332 Z" fill="#E4981E" stroke="#B8741A" stroke-width="7" stroke-linejoin="round"></path>
<circle cx="382" cy="232" r="15" fill="#27B3A6" stroke="#3A1A68" stroke-width="5"></circle>
<circle cx="512" cy="198" r="15" fill="#EE5F93" stroke="#3A1A68" stroke-width="5"></circle>
<circle cx="642" cy="232" r="15" fill="#27B3A6" stroke="#3A1A68" stroke-width="5"></circle>
<path d="M500 282 L500 336 C 530 330 536 306 506 304" stroke="#3A1A68" stroke-width="7" fill="none" stroke-linecap="round"></path>
<path d="M430 300 l8 -6" stroke="#FFE7A6" stroke-width="7" stroke-linecap="round"></path>
</g>
<g transform="translate(170 470) rotate(-24) scale(0.9)">
<path d="M14 -70 L14 0" stroke="#3A1A68" stroke-width="7" stroke-linecap="round"></path>
<path d="M14 -70 C 34 -58 44 -44 36 -26" stroke="#3A1A68" stroke-width="7" fill="none" stroke-linecap="round"></path>
<ellipse cx="0" cy="4" rx="19" ry="14" transform="rotate(-22)" fill="#27B3A6" stroke="#3A1A68" stroke-width="6"></ellipse>
<path d="M-6 -2 L2 6 L-2 12" stroke="#3A1A68" stroke-width="3" fill="none"></path></g>
<g transform="translate(130 600) rotate(18) scale(0.7)">
<path d="M14 -70 L14 0" stroke="#3A1A68" stroke-width="7" stroke-linecap="round"></path>
<path d="M14 -70 C 34 -58 44 -44 36 -26" stroke="#3A1A68" stroke-width="7" fill="none" stroke-linecap="round"></path>
<ellipse cx="0" cy="4" rx="19" ry="14" transform="rotate(-22)" fill="#EE5F93" stroke="#3A1A68" stroke-width="6"></ellipse>
<path d="M-6 -2 L2 6 L-2 12" stroke="#3A1A68" stroke-width="3" fill="none"></path></g>
</svg>`;
}

interface FalszomirPortraitProps {
  size?: number;
}

export function FalszomirPortrait({ size = 48 }: FalszomirPortraitProps) {
  const uid = useId().replace(/:/g, "-");
  return <SvgXml xml={buildFalszomirSvg(`falszomir-eye-l-${uid}`, `falszomir-eye-r-${uid}`)} width={size} height={size} />;
}
