/** The two designs of the gift scene ("prezent-sklep-solfka-telefon" and "-laptop"): every position is in the coordinates of a fixed
 * stage (390×844 for the phone, 1440×900 for the laptop) that GiftScene scales to the screen. */
export type ConfettiPiece = { w: number; h: number; round: boolean; color: string; dx: number; dy: number; rot: number; delay: number };

export interface GiftLayout {
  wide: boolean;
  W: number;
  H: number;
  /** Width of one stripe of the wall. */
  stripe: number;
  title: { left: number; top: number; size: number; line: number };
  shelves: { y: number; h: number; shadow: number }[];
  /** Shelf rows: which of the six items stand on it, then dashed "?" slots for the things still to come. */
  rows: { left: number; top: number; width: number; height: number; items: number[]; slots: number }[];
  item: number;
  slot: { w: number; h: number; radius: number; font: number };
  floor: { y: number; h: number };
  wallet: { right: number; top: number; h: number; font: number; line: number; coin: number; icon: number; padR: number; gap: number; x: number; y: number };
  close: { size: number; top: number; right: number };
  box: { left: number; top: number; scale: number; dropFrom: number };
  solfek: { left: number; top: number; size: number; bob: number };
  idleBubble: { left: number; top: number; width: number | null; originX: string; font: number; line: number; padV: number; padH: number };
  hint: { top: number; h: number; padX: number; font: number; line: number; icon: number; label: string };
  beam: { left: number; top: number; w: number; h: number };
  rays: { left: number; top: number; size: number; spinMs: number };
  confetti: { x: number; y: number; fall: number; pieces: ConfettiPiece[] };
  lid: { dx: number; dy: number };
  baseOutDy: number;
  coin: { left: number; top: number; size: number; border: number; shade: number; ring: number; icon: number; fromX: number; fromY: number; floatDy: number };
  ring: { cx: number; cy: number; R: number; size: number };
  text: { left: number; top: number; width: number; center: boolean; badgeH: number; badgeFont: number; badgeLine: number; badgePadX: number; rollSize: number; rollLine: number; rollGap: number; capFont: number; capLine: number; gap: number; rollDy: number; finalPeak: number };
  btn: { left: number; top: number; width: number; h: number; font: number };
  hopDy: number;
  collect: {
    solfekLeft: number;
    bubble: { left: number; top: number; width: number; font: number; line: number; padV: number; padH: number };
    bottom: { left: number; top: number; width: number; row: boolean; gap: number };
    card: { padV: number; padH: number; radius: number; icon: number; iconGlyph: number; small: number; smallLine: number; big: number; bigLine: number };
    btn: { w: number | null; h: number; font: number };
    flyMs: number;
    bumpDelay: number;
  };
}

const COLORS = ["#ffc83d", "#f28a1e", "#d9571a", "#fff6e8"];
function pieces(list: [number, number, number][], round: [number, number], bar: [number, number], bigDelay = 0): ConfettiPiece[] {
  return list.map(([dx, dy, rot], i) => {
    const kind = i % 4;
    return {
      w: kind % 2 === 0 ? round[0] : bar[0],
      h: kind % 2 === 0 ? round[1] : bar[1],
      round: kind === 0,
      color: COLORS[kind === 0 ? 0 : kind === 1 ? 1 : kind === 2 ? 2 : 3],
      dx,
      dy,
      rot,
      delay: 500 + (i % 4) * 30 + bigDelay,
    };
  });
}

export const PHONE_LAYOUT: GiftLayout = {
  wide: false,
  W: 390,
  H: 844,
  stripe: 44,
  title: { left: 24, top: 46, size: 22, line: 28 },
  shelves: [
    { y: 196, h: 14, shadow: 6 },
    { y: 336, h: 14, shadow: 6 },
  ],
  rows: [
    { left: 24, top: 104, width: 342, height: 92, items: [0, 1, 2, 3], slots: 0 },
    { left: 24, top: 244, width: 342, height: 92, items: [4, 5], slots: 2 },
  ],
  item: 72,
  slot: { w: 72, h: 64, radius: 14, font: 28 },
  floor: { y: 640, h: 18 },
  wallet: { right: 72, top: 42, h: 40, font: 17, line: 22, coin: 30, icon: 16, padR: 14, gap: 6, x: 247, y: 62 },
  close: { size: 44, top: 40, right: 16 },
  box: { left: 70, top: 440, scale: 1, dropFrom: -640 },
  solfek: { left: 232, top: 494, size: 150, bob: 8 },
  idleBubble: { left: 150, top: 420, width: null, originX: "80%", font: 15, line: 20, padV: 10, padH: 14 },
  hint: { top: 724, h: 44, padX: 20, font: 16, line: 20, icon: 20, label: "Dotknij prezentu, aby go otworzyć" },
  beam: { left: 20, top: 40, w: 260, h: 480 },
  rays: { left: -15, top: 30, size: 420, spinMs: 16000 },
  confetti: {
    x: 150,
    y: 520,
    fall: 300,
    pieces: pieces(
      [[-141, -51, -200], [-174, -98, 220], [-195, -156, -240], [-100, -111, 260], [-108, -168, -280], [-99, -230, 300], [-36, -146, -320], [-16, -199, 340], [20, -249, -360], [36, -146, 380], [79, -184, -400], [135, -210, 420], [100, -111, -440], [156, -125, 460], [218, -122, -480], [141, -51, 500]],
      [14, 10],
      [10, 18]
    ),
  },
  lid: { dx: -210, dy: -560 },
  baseOutDy: 50,
  coin: { left: 125, top: 170, size: 140, border: 6, shade: 10, ring: 10, icon: 76, fromX: -45, fromY: 300, floatDy: 10 },
  ring: { cx: 195, cy: 240, R: 112, size: 34 },
  text: { left: 24, top: 362, width: 342, center: true, badgeH: 30, badgeFont: 14, badgeLine: 18, badgePadX: 14, rollSize: 56, rollLine: 60, rollGap: 2, capFont: 16, capLine: 22, gap: 4, rollDy: -18, finalPeak: 1.25 },
  btn: { left: 24, top: 740, width: 342, h: 56, font: 18 },
  hopDy: -60,
  collect: {
    solfekLeft: 120,
    bubble: { left: 24, top: 420, width: 342, font: 16, line: 22, padV: 10, padH: 16 },
    bottom: { left: 24, top: 676, width: 342, row: false, gap: 12 },
    card: { padV: 12, padH: 16, radius: 14, icon: 40, iconGlyph: 22, small: 13, smallLine: 18, big: 17, bigLine: 22 },
    btn: { w: null, h: 56, font: 18 },
    flyMs: 750,
    bumpDelay: 950,
  },
};

export const LAPTOP_LAYOUT: GiftLayout = {
  wide: true,
  W: 1440,
  H: 900,
  stripe: 60,
  title: { left: 48, top: 46, size: 30, line: 40 },
  shelves: [
    { y: 236, h: 16, shadow: 7 },
    { y: 416, h: 16, shadow: 7 },
  ],
  rows: [
    { left: 160, top: 116, width: 1120, height: 120, items: [0, 1, 2, 3], slots: 0 },
    { left: 160, top: 296, width: 1120, height: 120, items: [4, 5], slots: 2 },
  ],
  item: 100,
  slot: { w: 100, h: 88, radius: 16, font: 36 },
  floor: { y: 700, h: 20 },
  wallet: { right: 112, top: 46, h: 44, font: 19, line: 24, coin: 32, icon: 18, padR: 16, gap: 8, x: 1250, y: 68 },
  close: { size: 48, top: 44, right: 32 },
  box: { left: 520, top: 500, scale: 1.35, dropFrom: -760 },
  solfek: { left: 270, top: 494, size: 210, bob: 10 },
  idleBubble: { left: 180, top: 440, width: 300, originX: "50%", font: 17, line: 22, padV: 12, padH: 18 },
  hint: { top: 784, h: 52, padX: 26, font: 18, line: 22, icon: 22, label: "Kliknij prezent, aby go otworzyć" },
  beam: { left: 400, top: 20, w: 400, h: 440 },
  rays: { left: 300, top: -10, size: 600, spinMs: 18000 },
  confetti: {
    x: 600,
    y: 538,
    fall: 340,
    pieces: pieces(
      [[-193, -52, -200], [-249, -105, 220], [-292, -174, -240], [-156, -125, 260], [-186, -196, -280], [-198, -277, 300], [-93, -177, -320], [-91, -254, 340], [-70, -333, -360], [-14, -200, 380], [19, -269, -400], [70, -333, 420], [68, -188, -440], [125, -239, 460], [198, -277, -480], [137, -145, 500], [211, -169, -520], [292, -174, 540], [184, -78, -560], [261, -70, 580]],
      [16, 12],
      [12, 22]
    ),
  },
  lid: { dx: -320, dy: -620 },
  baseOutDy: 60,
  coin: { left: 510, top: 200, size: 180, border: 7, shade: 12, ring: 12, icon: 96, fromX: 0, fromY: 230, floatDy: 12 },
  ring: { cx: 600, cy: 290, R: 150, size: 40 },
  text: { left: 840, top: 200, width: 480, center: false, badgeH: 34, badgeFont: 16, badgeLine: 20, badgePadX: 16, rollSize: 80, rollLine: 84, rollGap: 4, capFont: 18, capLine: 26, gap: 6, rollDy: -22, finalPeak: 1.2 },
  btn: { left: 840, top: 420, width: 400, h: 60, font: 19 },
  hopDy: -70,
  collect: {
    solfekLeft: 615,
    bubble: { left: 420, top: 400, width: 600, font: 18, line: 24, padV: 12, padH: 20 },
    bottom: { left: 340, top: 760, width: 760, row: true, gap: 20 },
    card: { padV: 12, padH: 18, radius: 16, icon: 44, iconGlyph: 24, small: 14, smallLine: 18, big: 19, bigLine: 24 },
    btn: { w: 300, h: 60, font: 19 },
    flyMs: 850,
    bumpDelay: 1000,
  },
};
