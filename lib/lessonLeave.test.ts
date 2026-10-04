import { describe, expect, it } from "@jest/globals";
import { exercisesWord, leaveComment } from "@/lib/lessonLeave";

describe("leaving a lesson: Solfek's sad comments", () => {
  it("uses the right Polish word for the number of exercises left", () => {
    expect([1, 2, 3, 4, 5, 11, 12, 14, 21, 22, 25].map(exercisesWord)).toEqual(["zadanie", "zadania", "zadania", "zadania", "zadań", "zadań", "zadań", "zadań", "zadań", "zadania", "zadań"]);
  });

  it("says how little is left when it is only a few exercises", () => {
    const comments = [0, 0.4, 0.8].map((random) => leaveComment(2, random));
    expect(comments.some((comment) => comment.includes("2 zadania"))).toBe(true);
    expect(leaveComment(1, 0)).toContain("1 zadanie");
  });

  it("has several different comments, none of them for a particular gender", () => {
    const many = new Set([0, 0.3, 0.5, 0.8].map((random) => leaveComment(9, random)));
    expect(many.size).toBeGreaterThanOrEqual(4);
    for (const comment of many) expect(comment).not.toMatch(/(łaś|łeś|\(a\)|\(e\)ś)/);
  });
});
