import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const email = process.env.TEST_EMAIL;
const password = process.env.TEST_PASSWORD;

/** The windows a new player sees before the map (Solfek's welcome, "Jak chcesz zacząć?", the guide):
 * close whichever ones show up, one after another, until none is left (they can appear a moment after the previous one closes). */
async function closeIntroWindows(page: Page) {
  const wioska = page.getByRole("button", { name: "Wioska Nut" });
  await expect(wioska).toBeVisible();
  let quietRounds = 0;
  for (let attempt = 0; attempt < 15 && quietRounds < 3; attempt++) {
    let clicked = false;
    for (const name of ["Zaczynajmy!", "Zacznij od gry (tryb zabawy)", "Pomiń"]) {
      const button = page.getByText(name, { exact: true }).first();
      if (await button.isVisible()) {
        await button.click();
        clicked = true;
        break;
      }
    }
    quietRounds = clicked ? 0 : quietRounds + 1;
    await page.waitForTimeout(500);
  }
}

/** Total XP, read from the lesson screen's level bar (its label is "Level N, X XP"). */
async function readXp(page: Page): Promise<number> {
  const label = await page.getByTestId("level-bar").getAttribute("aria-label");
  const match = label?.match(/(\d+) XP/);
  if (!match) throw new Error(`Nie znalazłem XP w etykiecie: ${label}`);
  return Number(match[1]);
}

test.describe("pierwsza lekcja", () => {
  test.skip(!email || !password, "Brak TEST_EMAIL / TEST_PASSWORD (plik .env.test)");

  test("logowanie kontem testowym, poprawna odpowiedź i wzrost XP o 10", async ({ page }) => {
    // 1. Logowanie
    await page.goto("/");
    await page.getByPlaceholder("E-mail").fill(email!);
    await page.getByPlaceholder("Hasło").fill(password!);
    await page.getByRole("button", { name: "Zaloguj się" }).click();

    // 2. Mapa: zamykamy okna powitalne, wchodzimy w Wioskę Nut i w poziom 1
    await closeIntroWindows(page);
    await page.getByRole("button", { name: "Wioska Nut" }).click();
    await page.getByRole("button", { name: "Poziom 1", exact: true }).click();

    // 3. Wstęp do lekcji ("OK"), potem pierwsze ćwiczenie: wysoki czy niski dźwięk (C6 = wysoki)
    await page.getByText("OK", { exact: true }).click();
    const xpBefore = await readXp(page);

    await page.getByRole("button", { name: "Wysoki" }).click();
    await page.getByText("Sprawdź", { exact: true }).click();

    // 4. Dobra odpowiedź: komunikat o +10 XP i XP wyższe o 10
    await expect(page.getByText("+10 XP", { exact: false }).first()).toBeVisible();
    await expect.poll(() => readXp(page)).toBe(xpBefore + 10);
  });
});
