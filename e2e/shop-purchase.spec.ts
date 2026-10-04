import { expect, test } from "@playwright/test";
import { closeIntroWindows, email, logIn, password, resetTestAccountShop } from "./helpers";

const STARTING_NUTKI = 500;
const ITEM = { id: "ubior-czerwony", name: "Czerwony czarodziej", price: 100 };

test.describe("Sklep Solfka", () => {
  test.skip(!email || !password, "Brak TEST_EMAIL / TEST_PASSWORD (plik .env.test)");

  test("kupno ubioru za nutki: nutki spadają, ubiór ląduje w „Zakupione”", async ({ page }) => {
    // Known starting point: nothing bought, 500 nutki (set on the test account's own saved row, before the browser logs in).
    await resetTestAccountShop(STARTING_NUTKI);

    await logIn(page);
    await closeIntroWindows(page);

    // Open the shop from the "SKLEP" button next to the nutki on the map.
    await page.getByRole("button", { name: "Sklep Solfka" }).click();
    await expect(page.getByTestId("shop-balance")).toHaveText(String(STARTING_NUTKI));

    // Buy the red wizard.
    const card = page.getByTestId(`shop-item-${ITEM.id}`);
    await card.getByText(`Kup za ${ITEM.price}`).click();
    await expect(page.getByText(`${ITEM.name}: kupione`)).toBeVisible();
    await expect(page.getByTestId("shop-balance")).toHaveText(String(STARTING_NUTKI - ITEM.price));

    // It is now worn, and listed under "Zakupione".
    await expect(card.getByText("Założone")).toBeVisible();
    await page.getByRole("tab", { name: "Zakupione" }).click();
    const bought = page.getByTestId(`shop-item-${ITEM.id}`);
    await expect(bought).toBeVisible();
    await expect(bought.getByText("Zdejmij")).toBeVisible();

    // Take it off: back to the standard Solfek, the item stays owned.
    await bought.getByText("Zdejmij").click();
    await expect(bought.getByText("Załóż")).toBeVisible();
    await expect(page.getByTestId("shop-balance")).toHaveText(String(STARTING_NUTKI - ITEM.price));
  });
});
