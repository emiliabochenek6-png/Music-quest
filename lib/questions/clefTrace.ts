import { VIEW_HEIGHT } from "@/lib/music/staffGeometry";
import type { TracePoint } from "@/types/exercises";

const MIN_POINTS = 3;
const MIN_BOUNDING_BOX_DIAGONAL_RATIO = 0.25;

/**
 * Whether a drawn path plausibly traces the clef rather than just tapping
 * the board. Deliberately not pixel-matched against the glyph's exact
 * outline — font rendering of the reference glyph varies by platform, so
 * precise waypoint-hitting would be fragile, and a real finger/mouse trace
 * of a beginner rarely reaches the exact top-most and bottom-most pixels of
 * the shape anyway.
 *
 * Checks the diagonal of the drawn path's bounding box (not just vertical
 * span) against the board height — a first version only measured vertical
 * movement, which unfairly rejected people who traced the clef's curl by
 * moving mostly sideways along the staff lines. Generous on purpose: the
 * goal here is encouragement, not handwriting grading.
 */
export function isValidClefTrace(points: TracePoint[], viewHeight: number = VIEW_HEIGHT): boolean {
  if (points.length < MIN_POINTS) {
    return false;
  }

  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const width = Math.max(...xs) - Math.min(...xs);
  const height = Math.max(...ys) - Math.min(...ys);
  const diagonal = Math.sqrt(width * width + height * height);

  return diagonal >= viewHeight * MIN_BOUNDING_BOX_DIAGONAL_RATIO;
}
