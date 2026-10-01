import { useId } from "react";
import { SvgXml } from "react-native-svg";

/** Hand-illustrated portrait for Gaj Grupowania's own "boss" lesson
 * ("Pokonaj Wiewióra Pęczka") — same inlined-SvgXml pattern as every
 * other boss here (ArytmikPortrait's own doc has the full reasoning).
 * This source SVG uses seven gradient/filter `id`s (soft shading, per
 * its own README), so it needs the same useId()-namespaced-ids
 * treatment FalszomirPortrait's own doc explains (avoids two on-screen
 * instances — map node + intro slide — colliding over the same raw
 * `id`), just with seven ids instead of two. */
function buildPeczekSvg(ids: { fur: string; tail: string; belly: string; nut: string; leaf: string; eye: string; soft: string }): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
<defs>
<radialGradient id="${ids.fur}" cx="40%" cy="30%" r="75%"><stop offset="0" stop-color="#bcc3d8"/><stop offset=".55" stop-color="#8b93ad"/><stop offset="1" stop-color="#5c6584"/></radialGradient>
<radialGradient id="${ids.tail}" cx="35%" cy="35%" r="75%"><stop offset="0" stop-color="#d3d9ea"/><stop offset=".5" stop-color="#8b93ad"/><stop offset="1" stop-color="#5c6584"/></radialGradient>
<radialGradient id="${ids.belly}" cx="50%" cy="35%" r="70%"><stop offset="0" stop-color="#fffdf7"/><stop offset="1" stop-color="#dccfb8"/></radialGradient>
<radialGradient id="${ids.nut}" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#e2a865"/><stop offset="1" stop-color="#7a4f22"/></radialGradient>
<linearGradient id="${ids.leaf}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9fd37c"/><stop offset="1" stop-color="#3f7a2e"/></linearGradient>
<radialGradient id="${ids.eye}" cx="35%" cy="30%" r="70%"><stop offset="0" stop-color="#5a6280"/><stop offset="1" stop-color="#16181f"/></radialGradient>
<filter id="${ids.soft}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6"/></filter>
</defs>
<ellipse cx="520" cy="955" rx="330" ry="32" fill="#16181f" opacity=".16" filter="url(#${ids.soft})"/>
<path d="M300 960 L310 870 C 360 850 680 850 730 870 L740 960 Z" fill="#9a6a3c" stroke="#232838" stroke-width="9" stroke-linejoin="round"/><path d="M360 900 v40 M450 905 v45 M590 905 v45 M680 900 v40" stroke="#7e5430" stroke-width="5" stroke-linecap="round"/><ellipse cx="520" cy="870" rx="210" ry="34" fill="#d9b47e" stroke="#232838" stroke-width="8"/><ellipse cx="520" cy="870" rx="130" ry="20" fill="none" stroke="#b58c58" stroke-width="5"/><ellipse cx="520" cy="870" rx="60" ry="9" fill="none" stroke="#b58c58" stroke-width="4"/>
<path transform="translate(330 880) rotate(-150) scale(0.9)" d="M0 0 C 14 -22 44 -20 54 0 C 34 10 14 10 0 0 Z" fill="url(#${ids.leaf})" stroke="#232838" stroke-width="4"/><path transform="translate(330 880) rotate(-150) scale(0.9)" d="M4 0 H48" stroke="#3f7a2e" stroke-width="2"/><path transform="translate(700 875) rotate(-20) scale(0.9)" d="M0 0 C 14 -22 44 -20 54 0 C 34 10 14 10 0 0 Z" fill="url(#${ids.leaf})" stroke="#232838" stroke-width="4"/><path transform="translate(700 875) rotate(-20) scale(0.9)" d="M4 0 H48" stroke="#3f7a2e" stroke-width="2"/>
<path d="M600 770 C 780 770 890 640 868 470 C 852 340 750 250 640 290 C 570 318 590 410 660 405 C 730 400 752 480 730 550 C 708 620 646 650 596 670 Z" fill="url(#${ids.tail})" stroke="#232838" stroke-width="11" stroke-linejoin="round"/>
<path d="M820 360 q22 22 30 60" stroke="#dfe4f2" stroke-width="7" fill="none" stroke-linecap="round" opacity=".8"/>
<path d="M842 470 q14 30 8 70" stroke="#dfe4f2" stroke-width="7" fill="none" stroke-linecap="round" opacity=".8"/>
<path d="M820 600 q-6 30 -30 60" stroke="#dfe4f2" stroke-width="7" fill="none" stroke-linecap="round" opacity=".8"/>
<path d="M720 300 q40 -8 70 14" stroke="#dfe4f2" stroke-width="7" fill="none" stroke-linecap="round" opacity=".8"/>
<path d="M690 700 q30 0 60 -14" stroke="#dfe4f2" stroke-width="7" fill="none" stroke-linecap="round" opacity=".8"/>
<path d="M760 520 q-10 40 -50 80" stroke="#5c6584" stroke-width="6" fill="none" stroke-linecap="round" opacity=".7"/>
<path d="M770 420 q4 -40 -30 -70" stroke="#5c6584" stroke-width="6" fill="none" stroke-linecap="round" opacity=".7"/>
<path d="M268 222 V332" stroke="#232838" stroke-width="11.0" stroke-linecap="round"/><path d="M268 222 V332" stroke="#7a5532" stroke-width="6.0" stroke-linecap="round"/><path d="M216 222 V340" stroke="#232838" stroke-width="11.0" stroke-linecap="round"/><path d="M216 222 V340" stroke="#7a5532" stroke-width="6.0" stroke-linecap="round"/><path d="M164 222 V332" stroke="#232838" stroke-width="11.0" stroke-linecap="round"/><path d="M164 222 V332" stroke="#7a5532" stroke-width="6.0" stroke-linecap="round"/><path d="M298 222 L154 222" stroke="#232838" stroke-width="22" stroke-linecap="round"/><path d="M298 222 L154 222" stroke="#7a5532" stroke-width="13" stroke-linecap="round"/><path d="M298 219 L154 219" stroke="#a87a4e" stroke-width="4" stroke-linecap="round"/><path transform="translate(216.0 216) rotate(-25) scale(0.7)" d="M0 0 C 14 -22 44 -20 54 0 C 34 10 14 10 0 0 Z" fill="url(#${ids.leaf})" stroke="#232838" stroke-width="4"/><path transform="translate(216.0 216) rotate(-25) scale(0.7)" d="M4 0 H48" stroke="#3f7a2e" stroke-width="2"/><g transform="translate(254 346) rotate(-10) scale(0.90)"><ellipse cx="0" cy="8" rx="20" ry="24" fill="url(#${ids.nut})" stroke="#232838" stroke-width="5"/><path d="M-24 -4 C -24 -26 24 -26 24 -4 Z" fill="#6b4a2a" stroke="#232838" stroke-width="5"/><path d="M-16 -12 h32 M-18 -6 h36" stroke="#8e6a44" stroke-width="3"/><path d="M0 -20 V-30" stroke="#232838" stroke-width="5" stroke-linecap="round"/><ellipse cx="-8" cy="6" rx="5" ry="9" fill="#fff" opacity=".35"/></g><g transform="translate(202 354) rotate(-10) scale(0.90)"><ellipse cx="0" cy="8" rx="20" ry="24" fill="url(#${ids.nut})" stroke="#232838" stroke-width="5"/><path d="M-24 -4 C -24 -26 24 -26 24 -4 Z" fill="#6b4a2a" stroke="#232838" stroke-width="5"/><path d="M-16 -12 h32 M-18 -6 h36" stroke="#8e6a44" stroke-width="3"/><path d="M0 -20 V-30" stroke="#232838" stroke-width="5" stroke-linecap="round"/><ellipse cx="-8" cy="6" rx="5" ry="9" fill="#fff" opacity=".35"/></g><g transform="translate(150 346) rotate(-10) scale(0.90)"><ellipse cx="0" cy="8" rx="20" ry="24" fill="url(#${ids.nut})" stroke="#232838" stroke-width="5"/><path d="M-24 -4 C -24 -26 24 -26 24 -4 Z" fill="#6b4a2a" stroke="#232838" stroke-width="5"/><path d="M-16 -12 h32 M-18 -6 h36" stroke="#8e6a44" stroke-width="3"/><path d="M0 -20 V-30" stroke="#232838" stroke-width="5" stroke-linecap="round"/><ellipse cx="-8" cy="6" rx="5" ry="9" fill="#fff" opacity=".35"/></g>
<path d="M772 222 V326" stroke="#232838" stroke-width="10.4" stroke-linecap="round"/><path d="M772 222 V326" stroke="#7a5532" stroke-width="5.7" stroke-linecap="round"/><path d="M810 222 V334" stroke="#232838" stroke-width="10.4" stroke-linecap="round"/><path d="M810 222 V334" stroke="#7a5532" stroke-width="5.7" stroke-linecap="round"/><path d="M848 222 V326" stroke="#232838" stroke-width="10.4" stroke-linecap="round"/><path d="M848 222 V326" stroke="#7a5532" stroke-width="5.7" stroke-linecap="round"/><path d="M886 222 V334" stroke="#232838" stroke-width="10.4" stroke-linecap="round"/><path d="M886 222 V334" stroke="#7a5532" stroke-width="5.7" stroke-linecap="round"/><path d="M924 222 V326" stroke="#232838" stroke-width="10.4" stroke-linecap="round"/><path d="M924 222 V326" stroke="#7a5532" stroke-width="5.7" stroke-linecap="round"/><path d="M744 222 L934 222" stroke="#232838" stroke-width="21" stroke-linecap="round"/><path d="M744 222 L934 222" stroke="#7a5532" stroke-width="12" stroke-linecap="round"/><path d="M744 219 L934 219" stroke="#a87a4e" stroke-width="4" stroke-linecap="round"/><path transform="translate(829.0 216) rotate(-25) scale(0.6649999999999999)" d="M0 0 C 14 -22 44 -20 54 0 C 34 10 14 10 0 0 Z" fill="url(#${ids.leaf})" stroke="#232838" stroke-width="4"/><path transform="translate(829.0 216) rotate(-25) scale(0.6649999999999999)" d="M4 0 H48" stroke="#3f7a2e" stroke-width="2"/><g transform="translate(759 340) rotate(-10) scale(0.85)"><ellipse cx="0" cy="8" rx="20" ry="24" fill="url(#${ids.nut})" stroke="#232838" stroke-width="5"/><path d="M-24 -4 C -24 -26 24 -26 24 -4 Z" fill="#6b4a2a" stroke="#232838" stroke-width="5"/><path d="M-16 -12 h32 M-18 -6 h36" stroke="#8e6a44" stroke-width="3"/><path d="M0 -20 V-30" stroke="#232838" stroke-width="5" stroke-linecap="round"/><ellipse cx="-8" cy="6" rx="5" ry="9" fill="#fff" opacity=".35"/></g><g transform="translate(797 347) rotate(-10) scale(0.85)"><ellipse cx="0" cy="8" rx="20" ry="24" fill="url(#${ids.nut})" stroke="#232838" stroke-width="5"/><path d="M-24 -4 C -24 -26 24 -26 24 -4 Z" fill="#6b4a2a" stroke="#232838" stroke-width="5"/><path d="M-16 -12 h32 M-18 -6 h36" stroke="#8e6a44" stroke-width="3"/><path d="M0 -20 V-30" stroke="#232838" stroke-width="5" stroke-linecap="round"/><ellipse cx="-8" cy="6" rx="5" ry="9" fill="#fff" opacity=".35"/></g><g transform="translate(835 340) rotate(-10) scale(0.85)"><ellipse cx="0" cy="8" rx="20" ry="24" fill="url(#${ids.nut})" stroke="#232838" stroke-width="5"/><path d="M-24 -4 C -24 -26 24 -26 24 -4 Z" fill="#6b4a2a" stroke="#232838" stroke-width="5"/><path d="M-16 -12 h32 M-18 -6 h36" stroke="#8e6a44" stroke-width="3"/><path d="M0 -20 V-30" stroke="#232838" stroke-width="5" stroke-linecap="round"/><ellipse cx="-8" cy="6" rx="5" ry="9" fill="#fff" opacity=".35"/></g><g transform="translate(873 347) rotate(-10) scale(0.85)"><ellipse cx="0" cy="8" rx="20" ry="24" fill="url(#${ids.nut})" stroke="#232838" stroke-width="5"/><path d="M-24 -4 C -24 -26 24 -26 24 -4 Z" fill="#6b4a2a" stroke="#232838" stroke-width="5"/><path d="M-16 -12 h32 M-18 -6 h36" stroke="#8e6a44" stroke-width="3"/><path d="M0 -20 V-30" stroke="#232838" stroke-width="5" stroke-linecap="round"/><ellipse cx="-8" cy="6" rx="5" ry="9" fill="#fff" opacity=".35"/></g><g transform="translate(911 340) rotate(-10) scale(0.85)"><ellipse cx="0" cy="8" rx="20" ry="24" fill="url(#${ids.nut})" stroke="#232838" stroke-width="5"/><path d="M-24 -4 C -24 -26 24 -26 24 -4 Z" fill="#6b4a2a" stroke="#232838" stroke-width="5"/><path d="M-16 -12 h32 M-18 -6 h36" stroke="#8e6a44" stroke-width="3"/><path d="M0 -20 V-30" stroke="#232838" stroke-width="5" stroke-linecap="round"/><ellipse cx="-8" cy="6" rx="5" ry="9" fill="#fff" opacity=".35"/></g>
<path d="M520 440 C 630 440 670 560 668 680 C 666 810 610 860 520 860 C 430 860 374 810 372 680 C 370 560 410 440 520 440 Z" fill="#232838" stroke="#232838" stroke-width="22"/>
<ellipse cx="428" cy="790" rx="78" ry="88" transform="rotate(12 428 790)" fill="#232838" stroke="#232838" stroke-width="22"/>
<ellipse cx="414" cy="866" rx="62" ry="24" fill="#232838" stroke="#232838" stroke-width="22"/>
<ellipse cx="612" cy="790" rx="78" ry="88" transform="rotate(-12 612 790)" fill="#232838" stroke="#232838" stroke-width="22"/>
<ellipse cx="626" cy="866" rx="62" ry="24" fill="#232838" stroke="#232838" stroke-width="22"/>
<path d="M410 490 C 350 450 310 350 300 248" stroke="#232838" stroke-width="66" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M630 490 C 690 450 730 350 742 248" stroke="#232838" stroke-width="66" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<ellipse cx="298" cy="230" rx="32" ry="28" transform="rotate(-15 298 230)" fill="#232838" stroke="#232838" stroke-width="22"/>
<ellipse cx="744" cy="230" rx="32" ry="28" transform="rotate(15 744 230)" fill="#232838" stroke="#232838" stroke-width="22"/>
<path d="M520 440 C 630 440 670 560 668 680 C 666 810 610 860 520 860 C 430 860 374 810 372 680 C 370 560 410 440 520 440 Z" fill="url(#${ids.fur})"/>
<ellipse cx="428" cy="790" rx="78" ry="88" transform="rotate(12 428 790)" fill="url(#${ids.fur})"/>
<ellipse cx="414" cy="866" rx="62" ry="24" fill="url(#${ids.fur})"/>
<ellipse cx="612" cy="790" rx="78" ry="88" transform="rotate(-12 612 790)" fill="url(#${ids.fur})"/>
<ellipse cx="626" cy="866" rx="62" ry="24" fill="url(#${ids.fur})"/>
<path d="M410 490 C 350 450 310 350 300 248" stroke="#8b93ad" stroke-width="44" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M410 490 C 350 450 310 350 300 248" stroke="#bcc3d8" stroke-width="12" fill="none" stroke-linecap="round" opacity=".45" transform="translate(-7 -5)"/>
<path d="M630 490 C 690 450 730 350 742 248" stroke="#8b93ad" stroke-width="44" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M630 490 C 690 450 730 350 742 248" stroke="#bcc3d8" stroke-width="12" fill="none" stroke-linecap="round" opacity=".45" transform="translate(-7 -5)"/>
<path d="M520 520 C 596 520 616 620 612 700 C 606 790 570 830 520 830 C 470 830 434 790 428 700 C 424 620 444 520 520 520 Z" fill="url(#${ids.belly})"/>
<path d="M464 580 q12 12 24 0" stroke="#dccfb8" stroke-width="5" fill="none" stroke-linecap="round"/>
<path d="M508 580 q12 12 24 0" stroke="#dccfb8" stroke-width="5" fill="none" stroke-linecap="round"/>
<path d="M552 580 q12 12 24 0" stroke="#dccfb8" stroke-width="5" fill="none" stroke-linecap="round"/>
<path d="M464 630 q12 12 24 0" stroke="#dccfb8" stroke-width="5" fill="none" stroke-linecap="round"/>
<path d="M508 630 q12 12 24 0" stroke="#dccfb8" stroke-width="5" fill="none" stroke-linecap="round"/>
<path d="M552 630 q12 12 24 0" stroke="#dccfb8" stroke-width="5" fill="none" stroke-linecap="round"/>
<path d="M464 680 q12 12 24 0" stroke="#dccfb8" stroke-width="5" fill="none" stroke-linecap="round"/>
<path d="M508 680 q12 12 24 0" stroke="#dccfb8" stroke-width="5" fill="none" stroke-linecap="round"/>
<path d="M552 680 q12 12 24 0" stroke="#dccfb8" stroke-width="5" fill="none" stroke-linecap="round"/>
<path d="M464 730 q12 12 24 0" stroke="#dccfb8" stroke-width="5" fill="none" stroke-linecap="round"/>
<path d="M508 730 q12 12 24 0" stroke="#dccfb8" stroke-width="5" fill="none" stroke-linecap="round"/>
<path d="M552 730 q12 12 24 0" stroke="#dccfb8" stroke-width="5" fill="none" stroke-linecap="round"/>
<path d="M452 760 C 430 780 424 820 438 852" stroke="#232838" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M588 760 C 610 780 616 820 602 852" stroke="#232838" stroke-width="6" fill="none" stroke-linecap="round"/>
<path d="M394 872 v14 M414 874 v14 M434 872 v14" stroke="#232838" stroke-width="5" stroke-linecap="round"/>
<path d="M606 872 v14 M626 874 v14 M646 872 v14" stroke="#232838" stroke-width="5" stroke-linecap="round"/>
<g transform="rotate(-15 298 230)"><ellipse cx="298" cy="230" rx="32" ry="28" fill="url(#${ids.fur})"/><path d="M284 204 v12 M298 202 v13 M312 204 v12" stroke="#232838" stroke-width="5" stroke-linecap="round"/><ellipse cx="290" cy="224" rx="10" ry="6" fill="#fff" opacity=".25"/></g>
<g transform="rotate(15 744 230)"><ellipse cx="744" cy="230" rx="32" ry="28" fill="url(#${ids.fur})"/><path d="M730 204 v12 M744 202 v13 M758 204 v12" stroke="#232838" stroke-width="5" stroke-linecap="round"/><ellipse cx="736" cy="224" rx="10" ry="6" fill="#fff" opacity=".25"/></g>
<path d="M452 470 L640 730" stroke="#232838" stroke-width="28" stroke-linecap="round"/><path d="M452 470 L640 730" stroke="#8a5a2f" stroke-width="18" stroke-linecap="round"/>
<path d="M598 700 C 598 670 692 670 692 700 L702 790 C 702 822 588 822 588 790 Z" fill="#a9763f" stroke="#232838" stroke-width="8" stroke-linejoin="round"/><path d="M600 710 h90" stroke="#7e5430" stroke-width="5"/>
<g transform="translate(622 680) rotate(-20) scale(0.70)"><ellipse cx="0" cy="8" rx="20" ry="24" fill="url(#${ids.nut})" stroke="#232838" stroke-width="5"/><path d="M-24 -4 C -24 -26 24 -26 24 -4 Z" fill="#6b4a2a" stroke="#232838" stroke-width="5"/><path d="M-16 -12 h32 M-18 -6 h36" stroke="#8e6a44" stroke-width="3"/><path d="M0 -20 V-30" stroke="#232838" stroke-width="5" stroke-linecap="round"/><ellipse cx="-8" cy="6" rx="5" ry="9" fill="#fff" opacity=".35"/></g><g transform="translate(664 676) rotate(15) scale(0.70)"><ellipse cx="0" cy="8" rx="20" ry="24" fill="url(#${ids.nut})" stroke="#232838" stroke-width="5"/><path d="M-24 -4 C -24 -26 24 -26 24 -4 Z" fill="#6b4a2a" stroke="#232838" stroke-width="5"/><path d="M-16 -12 h32 M-18 -6 h36" stroke="#8e6a44" stroke-width="3"/><path d="M0 -20 V-30" stroke="#232838" stroke-width="5" stroke-linecap="round"/><ellipse cx="-8" cy="6" rx="5" ry="9" fill="#fff" opacity=".35"/></g>
<g transform="rotate(0 520 378)">
<path d="M468 308 Q 428 188 408 178 Q 388 238 378 318 Z" fill="url(#${ids.fur})" stroke="#232838" stroke-width="9" stroke-linejoin="round"/>
<path d="M408 178 q-10 -24 6 -40 M408 178 q-24 -14 -22 -36" stroke="#5c6584" stroke-width="8" fill="none" stroke-linecap="round"/>
<path d="M442 298 Q 424 228 412 218 Q 402 258 398 302 Z" fill="#f2a2b4" opacity=".7"/>
<path d="M572 308 Q 612 188 632 178 Q 652 238 662 318 Z" fill="url(#${ids.fur})" stroke="#232838" stroke-width="9" stroke-linejoin="round"/>
<path d="M632 178 q10 -24 -6 -40 M632 178 q24 -14 22 -36" stroke="#5c6584" stroke-width="8" fill="none" stroke-linecap="round"/>
<path d="M598 298 Q 616 228 628 218 Q 638 258 642 302 Z" fill="#f2a2b4" opacity=".7"/>
<path d="M520 250 C 610 250 668 308 670 378 L 690 398 L 664 408 L 680 430 L 650 436 C 620 488 570 506 520 506 C 470 506 420 488 390 436 L 360 430 L 376 408 L 350 398 L 370 378 C 372 308 430 250 520 250 Z" fill="url(#${ids.fur})" stroke="#232838" stroke-width="11" stroke-linejoin="round"/>
<path d="M430 418 C 440 498 600 498 610 418 C 580 448 460 448 430 418 Z" fill="url(#${ids.belly})" stroke="#232838" stroke-width="6"/>
<ellipse cx="520" cy="426" rx="20" ry="14" fill="#2b2230"/><ellipse cx="514" cy="422" rx="6" ry="4" fill="#fff" opacity=".6"/>
<path d="M496 442 Q 520 458 544 442" stroke="#16181f" stroke-width="6" fill="none" stroke-linecap="round"/>
<rect x="508" y="448" width="12" height="18" rx="3" fill="#fff" stroke="#232838" stroke-width="3"/><rect x="520" y="448" width="12" height="18" rx="3" fill="#fff" stroke="#232838" stroke-width="3"/>
<ellipse cx="466" cy="372" rx="30" ry="36" fill="url(#${ids.eye})" stroke="#232838" stroke-width="5"/><circle cx="456" cy="358" r="10" fill="#fff"/><circle cx="476" cy="384" r="5" fill="#fff"/>
<ellipse cx="574" cy="372" rx="30" ry="36" fill="url(#${ids.eye})" stroke="#232838" stroke-width="5"/><circle cx="564" cy="358" r="10" fill="#fff"/><circle cx="584" cy="384" r="5" fill="#fff"/>
<path d="M430 326 L500 342" stroke="#5c6584" stroke-width="12" stroke-linecap="round"/><path d="M610 326 L540 342" stroke="#5c6584" stroke-width="12" stroke-linecap="round"/>
<ellipse cx="436" cy="420" rx="22" ry="11" fill="#f2a2b4" opacity=".6"/>
<ellipse cx="604" cy="420" rx="22" ry="11" fill="#f2a2b4" opacity=".6"/>
<g transform="translate(520 258) rotate(-8)"><path d="M-46 10 C -46 -30 46 -30 46 10 Z" fill="#6b4a2a" stroke="#232838" stroke-width="7"/><path d="M-36 -2 h72 M-40 6 h80" stroke="#8e6a44" stroke-width="4"/><path d="M0 -20 v-18" stroke="#232838" stroke-width="7" stroke-linecap="round"/></g>
<path transform="translate(540 228) rotate(-30) scale(0.8)" d="M0 0 C 14 -22 44 -20 54 0 C 34 10 14 10 0 0 Z" fill="url(#${ids.leaf})" stroke="#232838" stroke-width="4"/><path transform="translate(540 228) rotate(-30) scale(0.8)" d="M4 0 H48" stroke="#3f7a2e" stroke-width="2"/>
</g>
<text x="200" y="190" text-anchor="middle" font-family="Baloo 2, Nunito, sans-serif" font-weight="800" font-size="46" fill="#7a4f22" stroke="#fff" stroke-width="6" paint-order="stroke">3</text>
<text x="870" y="190" text-anchor="middle" font-family="Baloo 2, Nunito, sans-serif" font-weight="800" font-size="46" fill="#7a4f22" stroke="#fff" stroke-width="6" paint-order="stroke">5</text>
<path transform="translate(90 600) rotate(20) scale(1)" d="M0 0 C 14 -22 44 -20 54 0 C 34 10 14 10 0 0 Z" fill="url(#${ids.leaf})" stroke="#232838" stroke-width="4"/><path transform="translate(90 600) rotate(20) scale(1)" d="M4 0 H48" stroke="#3f7a2e" stroke-width="2"/>
<path transform="translate(900 860) rotate(-30) scale(1)" d="M0 0 C 14 -22 44 -20 54 0 C 34 10 14 10 0 0 Z" fill="url(#${ids.leaf})" stroke="#232838" stroke-width="4"/><path transform="translate(900 860) rotate(-30) scale(1)" d="M4 0 H48" stroke="#3f7a2e" stroke-width="2"/>
<path transform="translate(140 780) rotate(10) scale(1)" d="M0 0 C 14 -22 44 -20 54 0 C 34 10 14 10 0 0 Z" fill="url(#${ids.leaf})" stroke="#232838" stroke-width="4"/><path transform="translate(140 780) rotate(10) scale(1)" d="M4 0 H48" stroke="#3f7a2e" stroke-width="2"/>
</svg>`;
}

interface PeczekPortraitProps {
  size?: number;
}

export function PeczekPortrait({ size = 48 }: PeczekPortraitProps) {
  const uid = useId().replace(/:/g, "-");
  return (
    <SvgXml
      xml={buildPeczekSvg({
        fur: `peczek-fur-${uid}`,
        tail: `peczek-tail-${uid}`,
        belly: `peczek-belly-${uid}`,
        nut: `peczek-nut-${uid}`,
        leaf: `peczek-leaf-${uid}`,
        eye: `peczek-eye-${uid}`,
        soft: `peczek-soft-${uid}`,
      })}
      width={size}
      height={size}
    />
  );
}
