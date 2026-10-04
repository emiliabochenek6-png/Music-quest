import { expect, test } from "@playwright/test";
import { closeIntroWindows, email, logIn, password, watchPageErrors } from "./helpers";

test.describe("Tryb własny", () => {
  test.skip(!email || !password, "Brak TEST_EMAIL / TEST_PASSWORD (plik .env.test)");

  test("wybór tematu, start treningu, zakończenie z wynikiem i ekran „Twój słuch”", async ({ page }) => {
    const pageErrors = watchPageErrors(page);
    await logIn(page);
    await closeIntroWindows(page);

    // The third mode on the map
    await page.getByText("Tryb własny", { exact: true }).first().click();
    await expect(page.getByText("Ćwiczysz to, co chcesz", { exact: false })).toBeVisible();
    // "Rozpoznawanie interwałów" is ticked from the start; tick which intervals to recognise
    await expect(page.getByTestId("training-options-rozp-interwaly")).toBeVisible();
    await page.getByTestId("training-option-rozp-interwaly-3").click(); // untick the major... then tick it back: at least two stay ticked
    await page.getByTestId("training-option-rozp-interwaly-3").click();
    await page.getByTestId("training-mode-seria").click();
    await page.getByTestId("training-start").click();

    // The session: a first exercise, the "Sprawdź" button waits for an answer
    await expect(page.getByTestId("training-status")).toContainText("Seria: 0");
    await expect(page.getByTestId("training-check")).toBeDisabled();

    // Leaving ends the training with a result screen
    await page.getByRole("button", { name: "Zakończ trening" }).click();
    await expect(page.getByTestId("training-summary")).toBeVisible();
    await expect(page.getByText("Wynik treningu")).toBeVisible();
    await page.getByText("Twój słuch (statystyki)").click();
    await expect(page.getByTestId("training-stats")).toBeVisible();
    await expect(page.getByTestId("training-stats").getByText("Rozpoznawanie interwałów", { exact: true })).toBeVisible();

    pageErrors.report();
  });
});
