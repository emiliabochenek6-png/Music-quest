import { expect, test } from "@playwright/test";
import { closeIntroWindows, email, logIn, password, readXp } from "./helpers";

test.describe("pierwsza lekcja", () => {
  test.skip(!email || !password, "Brak TEST_EMAIL / TEST_PASSWORD (plik .env.test)");

  test("logowanie kontem testowym, poprawna odpowiedź i wzrost XP o 10", async ({ page }) => {
    // 1. Logowanie
    await logIn(page);

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
