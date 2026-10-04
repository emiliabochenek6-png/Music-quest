import { expect, test } from "@playwright/test";
import { closeIntroWindows, email, logIn, password, watchPageErrors } from "./helpers";

/** The first lesson of every world: [worldId, lessonId]. (Written out here because the app's own lesson data pulls in
 * audio files that Node cannot load; the full list lives in data/lessons/ and a unit test there keeps every lesson valid.) */
const FIRST_LESSONS: [string, string][] = [
  ["wioska-nut", "lekcja-1-do-re-mi"],
  ["miasto-rytmu", "mr-lekcja-1-podstawy"],
  ["przystan-taktow", "pt-lekcja-1-metrum-2-4"],
  ["krolestwo-instrumentow", "ki-poziom-1-witaj-w-orkiestrze"],
  ["pasmo-interwalow", "pi-poziom-1-sekundy"],
  ["zatoka-trojdzwiekow", "zt-poziom-1-rodzaje-trojdzwiekow"],
  ["jaskinia-akordow", "ja-poziom-1-sekstakord"],
  ["cytadela-dominant", "cd-poziom-1-kwintsekstakord"],
  ["labirynt-tonacji", "lt-poziom-1-zegar-krzyzykow"],
  ["fabryka-budowania", "fb-poziom-1-interwaly-sekundy-tercje"],
  ["gaj-grupowania", "gg-poziom-1-metrum-cwierc"],
  ["szczyt-dyktand", "sd-poziom-1-oboz-bazowy"],
  ["zaczarowany-solfez", "zs-sluch-1-dom-do"],
];

const SCREENS = ["/map", "/plan", "/levels", "/calendar", "/daily-challenge", "/power-ups", "/settings", "/paywall", "/placement", "/review", "/world/wioska-nut"];

test.describe("szybki przegląd gry", () => {
  test.skip(!email || !password, "Brak TEST_EMAIL / TEST_PASSWORD (plik .env.test)");

  test("główne ekrany i pierwsza lekcja każdej krainy otwierają się bez błędów i bez poziomego przewijania", async ({ page }) => {
    test.setTimeout(240_000);
    const pageErrors = watchPageErrors(page);
    await logIn(page);
    await closeIntroWindows(page);

    for (const path of SCREENS) {
      await page.goto(path);
      await page.waitForTimeout(1200);
      const text = await page.evaluate(() => document.body.innerText);
      expect(text.length, `${path}: pusty ekran`).toBeGreaterThan(20);
      expect(text, `${path}: nie znaleziono ekranu`).not.toMatch(/Unmatched Route|This screen doesn't exist/i);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `${path}: poziome przewijanie`).toBeLessThanOrEqual(2);
    }

    for (const [worldId, lessonId] of FIRST_LESSONS) {
      await page.goto(`/lesson/${lessonId}?worldId=${worldId}`);
      // the lesson shows its intro ("OK") or goes straight to the first exercise ("Sprawdź")
      await expect(page.getByText("OK", { exact: true }).or(page.getByText("Sprawdź", { exact: true })).first(), `${worldId}: lekcja się nie otworzyła`).toBeVisible({ timeout: 15_000 });
    }

    pageErrors.report();
  });
});
