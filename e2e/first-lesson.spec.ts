import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";
import { xpToReachLevel } from "../lib/gamification/rank";
import { closeIntroWindows, closeLevelUpWindows, email, logIn, password, readXp, setTestAccountXp, watchPageErrors } from "./helpers";

/** Login → Wioska Nut → level 1 → "Wysoki" → "Sprawdź"; returns the XP before the answer. */
async function answerFirstQuestion(page: Page): Promise<number> {
  await logIn(page);
  await closeIntroWindows(page);
  await page.getByRole("button", { name: "Wioska Nut" }).click();
  await page.getByRole("button", { name: "Poziom 1", exact: true }).click();

  // Intro of the lesson ("OK"), then the first exercise: high or low sound (C6 = high).
  await page.getByText("OK", { exact: true }).click();
  const xpBefore = await readXp(page);
  await page.getByRole("button", { name: "Wysoki" }).click();
  await page.getByText("Sprawdź", { exact: true }).click();
  return xpBefore;
}

test.describe("pierwsza lekcja", () => {
  test.skip(!email || !password, "Brak TEST_EMAIL / TEST_PASSWORD (plik .env.test)");

  test("logowanie kontem testowym, poprawna odpowiedź i wzrost XP o 10", async ({ page }) => {
    const pageErrors = watchPageErrors(page);
    const xpBefore = await answerFirstQuestion(page);

    // A good answer: the "+10 XP" message and XP higher by 10 (even if it happens to cross a level).
    await expect(page.getByText("+10 XP", { exact: false }).first()).toBeVisible();
    await closeLevelUpWindows(page);
    await expect.poll(() => readXp(page)).toBe(xpBefore + 10);

    pageErrors.report();
  });

  test("awans na level 2 (mały baner): XP rośnie o 10, level się zmienia", async ({ page }) => {
    const pageErrors = watchPageErrors(page);
    await setTestAccountXp(xpToReachLevel(2) - 5);

    const xpBefore = await answerFirstQuestion(page);
    await expect(page.getByText("+10 XP", { exact: false }).first()).toBeVisible();
    await closeLevelUpWindows(page);
    await expect.poll(() => readXp(page)).toBe(xpBefore + 10);
    await expect(page.getByTestId("level-bar")).toHaveAttribute("aria-label", /^Level 2,/);

    pageErrors.report();
  });

  test("awans na level 5 (pełny ekran „Awans!”): da się go zamknąć i grać dalej", async ({ page }) => {
    const pageErrors = watchPageErrors(page);
    await setTestAccountXp(xpToReachLevel(5) - 5);

    const xpBefore = await answerFirstQuestion(page);
    await expect(page.getByTestId("rank-up-celebration")).toBeVisible();
    await expect(page.getByText("Awans!")).toBeVisible({ timeout: 10_000 });
    await page.getByRole("button", { name: "Lecimy dalej!" }).click({ timeout: 20_000 });
    await expect(page.getByTestId("rank-up-celebration")).toBeHidden();
    await expect.poll(() => readXp(page)).toBe(xpBefore + 10);
    await expect(page.getByTestId("level-bar")).toHaveAttribute("aria-label", /^Level 5,/);

    // The lesson goes on after the celebration: the "Dalej" button is there.
    await expect(page.getByText("Dalej", { exact: true }).first()).toBeVisible();

    pageErrors.report();
  });
});
