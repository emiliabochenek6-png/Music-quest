import { letterDiatonicIndex, type Note } from "./notes";

export type Clef = "treble" | "bass";

/** Diatonic index of the note sitting on each clef's bottom line (step 0). */
const CLEF_BOTTOM_LINE_DIATONIC_INDEX: Record<Clef, number> = {
  treble: 7 * 4 + letterDiatonicIndex("E"), // E4
  bass: 7 * 2 + letterDiatonicIndex("G"), // G2
};

/**
 * Diatonic staff step, counted in lines+spaces from the bottom line of the
 * given clef (step 0). Accidentals don't move a notehead, so they're
 * intentionally ignored here — only letter+octave determine staff position.
 */
export function noteToStaffStep(note: Note, clef: Clef = "treble"): number {
  const noteDiatonicIndex = 7 * note.octave + letterDiatonicIndex(note.letter);
  return noteDiatonicIndex - CLEF_BOTTOM_LINE_DIATONIC_INDEX[clef];
}

/** @deprecated Use noteToStaffStep(note, "treble") — kept for existing callers. */
export function noteToTrebleStaffStep(note: Note): number {
  return noteToStaffStep(note, "treble");
}

export type StaffPositionKind = "line" | "space" | "ledger-line" | "ledger-space";

export interface StaffPosition {
  /** Same value as noteToStaffStep — 0 = bottom line, increases upward. */
  step: number;
  kind: StaffPositionKind;
}

/** The 5 staff lines span steps 0 (bottom line) to 8 (top line); above/below that needs ledger lines. */
export function describeStaffPosition(note: Note, clef: Clef = "treble"): StaffPosition {
  const step = noteToStaffStep(note, clef);
  const onStaff = step >= 0 && step <= 8;
  const isLine = step % 2 === 0;

  if (onStaff) {
    return { step, kind: isLine ? "line" : "space" };
  }
  return { step, kind: isLine ? "ledger-line" : "ledger-space" };
}

/** @deprecated Use describeStaffPosition(note, "treble") — kept for existing callers. */
export function describeTrebleStaffPosition(note: Note): StaffPosition {
  return describeStaffPosition(note, "treble");
}

/** Steps (even, outside the 0-8 staff range) where a short ledger line needs
 * to be drawn to reach `step` — empty for the space immediately next to the
 * staff, which needs none. Used by components/game/StaffNotation.tsx. */
export function ledgerLineSteps(step: number): number[] {
  if (step < 0) {
    const nearestEven = step % 2 === 0 ? step : step + 1;
    if (nearestEven > -2) {
      return [];
    }
    const steps: number[] = [];
    for (let s = -2; s >= nearestEven; s -= 2) {
      steps.push(s);
    }
    return steps;
  }

  if (step > 8) {
    const nearestEven = step % 2 === 0 ? step : step - 1;
    if (nearestEven < 10) {
      return [];
    }
    const steps: number[] = [];
    for (let s = 10; s <= nearestEven; s += 2) {
      steps.push(s);
    }
    return steps;
  }

  return [];
}

/**
 * Which clef a note naturally belongs to on a grand staff (the two 5-line
 * staves connected at middle C) — whichever staff it lands on-staff (steps
 * 0-8) for. Returns null for notes that land on-staff for neither (or, in
 * principle, both — which can't actually happen since the two staves don't
 * overlap) — e.g. middle C itself, which belongs to neither staff on its
 * own. Used by the "Wielka Pięciolinia" exercise (grand-staff-clef-choice)
 * to derive the correct answer instead of authoring it by hand.
 */
export function classifyGrandStaffClef(note: Note): Clef | null {
  const trebleStep = noteToStaffStep(note, "treble");
  if (trebleStep >= 0 && trebleStep <= 8) {
    return "treble";
  }
  const bassStep = noteToStaffStep(note, "bass");
  if (bassStep >= 0 && bassStep <= 8) {
    return "bass";
  }
  return null;
}

export interface LineOrSpaceOrdinal {
  kind: "line" | "space";
  /** 1-indexed, counted from the bottom of the staff — "3rd line", "2nd space". */
  ordinal: number;
}

/** Names an on-staff position the way a beginner counts it: "line 1" (bottom)
 * through "line 5" (top), "space 1" through "space 4". Returns null off-staff
 * (ledger positions aren't counted this way). Used by the staff-placement
 * exercise (components/game/exercises/StaffPlacementExercise.tsx). */
export function describeLineOrSpaceOrdinal(step: number): LineOrSpaceOrdinal | null {
  if (step < 0 || step > 8) {
    return null;
  }
  if (step % 2 === 0) {
    return { kind: "line", ordinal: step / 2 + 1 };
  }
  return { kind: "space", ordinal: (step - 1) / 2 + 1 };
}
