import type { MathChallenge } from "@/types/content";

/** Trivial for an adult doing mental arithmetic, non-trivial (and not
 * boring) for a 7-year-old without a calculator — see ARCHITECTURE.md
 * section 4.2 for why this exists at all (App Store/Play Store review
 * requirement for a parental gate ahead of any purchase/child-directed
 * external action). Addition only, two-digit operands — kept intentionally
 * simple rather than mixing operators, since the goal is a speed bump for
 * a child, not a puzzle for the parent. */
export function generateMathChallenge(): MathChallenge {
  const a = 10 + Math.floor(Math.random() * 40);
  const b = 5 + Math.floor(Math.random() * 20);
  return { a, b, operator: "+", answer: a + b };
}
