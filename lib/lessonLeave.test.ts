import { describe, expect, it } from "@jest/globals";
import { feedbackLine } from "@/lib/answerFeedback";
import { exercisesWord, leaveComment, leaveTestComment, questionsWord } from "@/lib/lessonLeave";

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

describe("leaving the placement test", () => {
  it("uses the right Polish word for the number of questions", () => {
    expect([1, 2, 5, 12, 22].map(questionsWord)).toEqual(["pytanie", "pytania", "pytań", "pytań", "pytania"]);
  });

  it("has several different comments, about the test and not about a lesson", () => {
    const many = new Set([0, 0.3, 0.5, 0.8].map((random) => leaveTestComment(20, random)));
    expect(many.size).toBeGreaterThanOrEqual(4);
    for (const comment of many) expect(comment).not.toMatch(/lekcj|zadani|(łaś|łeś)/);
  });
});

describe("Solfek's lines under the green and red panel", () => {
  it("has different lines for a right and a wrong answer", () => {
    const right = new Set([0, 0.2, 0.4, 0.6, 0.8].map((random) => feedbackLine(true, random).title));
    const wrong = new Set([0, 0.2, 0.4, 0.6, 0.8].map((random) => feedbackLine(false, random).title));
    expect(right.size).toBeGreaterThanOrEqual(4);
    expect(wrong.size).toBeGreaterThanOrEqual(4);
    for (const title of right) expect(wrong.has(title)).toBe(false);
  });
});
