import { expect, test } from "@playwright/test";
import { closeIntroWindows, email, logIn, password, resetTestAccountShop, watchPageErrors } from "./helpers";

const STARTING_NUTKI = 500;
const ITEM = { id: "ubior-czerwony", name: "Czerwony czarodziej", price: 150 };

test.describe("Sklep Solfka", () => {
  test.skip(!email || !password, "Brak TEST_EMAIL / TEST_PASSWORD (plik .env.test)");

  test("kupno ubioru za nutki: nutki spadają, ubiór ląduje w „Zakupione”", async ({ page }) => {
    const pageErrors = watchPageErrors(page);

    // Known starting point: nothing bought, 500 nutki (set on the test account's own saved row, before the browser logs in).
    await resetTestAccountShop(STARTING_NUTKI);

    await logIn(page);
    await closeIntroWindows(page);

    // Open the shop from the "SKLEP" button next to the nutki on the map (Solfek's avatar in the corner opens it too, hence .first()).
    await page.getByRole("button", { name: "Sklep Solfka" }).first().click();
    await expect(page.getByTestId("shop-balance")).toHaveText(String(STARTING_NUTKI));

    // The daily gift from Solfek: open the box (a scene with a random draw, 1 to 10 nutki), collect, say goodbye. Once a day.
    await page.getByTestId("shop-gift").click();
    await page.getByTestId("gift-box").click();
    await page.getByTestId("gift-collect").click({ timeout: 20_000 }); // appears when the draw has settled (about 4 s)
    await page.getByTestId("gift-done").click();
    await expect(page.getByTestId("gift-scene")).toHaveCount(0);
    await expect(page.getByTestId("shop-balance")).not.toHaveText(String(STARTING_NUTKI));
    const afterGift = Number(await page.getByTestId("shop-balance").textContent());
    expect(afterGift - STARTING_NUTKI).toBeGreaterThanOrEqual(1);
    expect(afterGift - STARTING_NUTKI).toBeLessThanOrEqual(10);
    await expect(page.getByTestId("shop-gift")).toBeDisabled();

    // Buy the red wizard.
    const card = page.getByTestId(`shop-item-${ITEM.id}`);
    await card.getByText(`Kup za ${ITEM.price}`).click();
    await expect(page.getByText(`${ITEM.name}: kupione`)).toBeVisible();
    await expect(page.getByTestId("shop-balance")).toHaveText(String(afterGift - ITEM.price));

    // It is now worn, and listed under "Zakupione".
    await expect(card.getByText("Założone")).toBeVisible();
    await page.getByRole("tab", { name: "Zakupione" }).click();
    const bought = page.getByTestId(`shop-item-${ITEM.id}`);
    await expect(bought).toBeVisible();
    await expect(bought.getByText("Zdejmij")).toBeVisible();

    // Take it off: back to the standard Solfek, the item stays owned.
    await bought.getByText("Zdejmij").click();
    await expect(bought.getByText("Załóż")).toBeVisible();
    await expect(page.getByTestId("shop-balance")).toHaveText(String(afterGift - ITEM.price));

    pageErrors.report();
  });
});
