// Shared pixel geometry for rendering a 5-line treble-clef staff. Lives in
// lib/music (not components/game) because both rendering components
// (StaffNotation, StaffPlacementBoard, ClefTraceBoard) AND lib/questions'
// clef-trace validator (checking a drawn path against this same coordinate
// space) need it — lib/ can't depend on components/.

export const LINE_SPACING = 16;
export const STEP_HEIGHT = LINE_SPACING / 2;
export const STAFF_BOTTOM_Y = 100; // y of step 0 (E4, bottom line)
export const STAFF_LINE_STEPS = [0, 2, 4, 6, 8] as const;
export const VIEW_WIDTH = 100;
export const VIEW_HEIGHT = 150;

export function stepToY(step: number): number {
  return STAFF_BOTTOM_Y - step * STEP_HEIGHT;
}
