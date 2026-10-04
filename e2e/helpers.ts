import { expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import { readFileSync } from "node:fs";

export const email = process.env.TEST_EMAIL;
export const password = process.env.TEST_PASSWORD;

/** Collects the errors the page throws while a test runs (e.g. React's "#418": the page built on the server differs from the one the browser builds).
 * Call `report()` at the end of the test: it prints them, and any error fails the test (set STRICT_PAGE_ERRORS=0 to only print). */
export function watchPageErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(String(error).slice(0, 300)));
  return {
    report() {
      if (errors.length) console.log(`⚠ błędy strony (${errors.length}): ${[...new Set(errors)].join(" | ")}`);
      if (process.env.STRICT_PAGE_ERRORS !== "0") expect(errors).toEqual([]);
    },
  };
}

/** Logs in on the login screen with the test account. */
export async function logIn(page: Page) {
  await page.goto("/");
  await page.getByPlaceholder("E-mail").fill(email!);
  await page.getByPlaceholder("Hasło").fill(password!);
  await page.getByRole("button", { name: "Zaloguj się" }).click();
}

/** The windows a new player can see on the map (Solfek's hello, the guide, then the mode question):
 * close whichever ones show up, one after another, until none is left (they can appear a moment after the previous one closes). */
export async function closeIntroWindows(page: Page) {
  const wioska = page.getByRole("button", { name: "Wioska Nut" });
  await expect(wioska).toBeVisible();
  let quietRounds = 0;
  for (let attempt = 0; attempt < 15 && quietRounds < 3; attempt++) {
    let clicked = false;
    for (const name of ["Pokaż mi grę", "Pomiń", "Zacznij od gry (tryb zabawy)"]) {
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
export async function readXp(page: Page): Promise<number> {
  const label = await page.getByTestId("level-bar").getAttribute("aria-label");
  const match = label?.match(/(\d+) XP/);
  if (!match) throw new Error(`Nie znalazłem XP w etykiecie: ${label}`);
  return Number(match[1]);
}

/** Reads EXPO_PUBLIC_SUPABASE_URL / _ANON_KEY (the same public values the app is built with) from .env. */
function supabaseConfig() {
  const env: Record<string, string> = {};
  for (const line of readFileSync(".env", "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (match) env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
  return { url: env.EXPO_PUBLIC_SUPABASE_URL, key: env.EXPO_PUBLIC_SUPABASE_ANON_KEY };
}

/** Signs in as the TEST account over the web API and changes fields of its own saved game row (the same row the app syncs).
 * Run it BEFORE the browser logs in: after a login the app keeps a copy on the device and merges (keeps the higher XP / the union of purchases). */
async function updateTestAccountGame(changes: Record<string, unknown>) {
  const { url, key } = supabaseConfig();
  const headers = { apikey: key!, "content-type": "application/json" };
  const login = await fetch(`${url}/auth/v1/token?grant_type=password`, { method: "POST", headers, body: JSON.stringify({ email, password }) });
  if (!login.ok) throw new Error(`Logowanie konta testowego nie powiodło się (${login.status}). Sprawdź .env.test.`);
  const session = (await login.json()) as { access_token: string; user: { id: string } };
  const auth = { ...headers, authorization: `Bearer ${session.access_token}` };
  const rowUrl = `${url}/rest/v1/app_state?user_id=eq.${session.user.id}`;
  const current = await fetch(`${rowUrl}&select=gamification`, { headers: auth });
  const rows = (await current.json()) as { gamification: Record<string, unknown> }[];
  if (!rows.length) throw new Error("Konto testowe nie ma jeszcze zapisanego postępu. Uruchom najpierw test pierwszej lekcji (npm run test:e2e).");
  const gamification = { ...rows[0].gamification, ...changes };
  const update = await fetch(rowUrl, { method: "PATCH", headers: { ...auth, prefer: "return=minimal" }, body: JSON.stringify({ gamification, updated_at: new Date().toISOString() }) });
  if (!update.ok) throw new Error(`Nie udało się przygotować konta testowego (${update.status}).`);
}

/** Shop back to a known state: nothing bought, `nutki` nutki in the purse. */
export async function resetTestAccountShop(nutki: number) {
  await updateTestAccountGame({ nutki, shopOwned: [], shopEquipped: {}, shopGiftDateISO: null });
}

/** Sets the test account's total XP (e.g. just below a level threshold, to test the level-up windows). */
export async function setTestAccountXp(xp: number) {
  await updateTestAccountGame({ xp });
}

/** Closes the full-screen "Awans!" celebration if it is showing (the small level-up banner closes itself).
 * The celebration plays for about 5 seconds before its button works, so the click waits for that. */
export async function closeLevelUpWindows(page: Page) {
  const celebration = page.getByTestId("rank-up-celebration");
  for (let attempt = 0; attempt < 3; attempt++) {
    await page.waitForTimeout(400);
    if (await celebration.isVisible()) {
      await page.getByRole("button", { name: "Lecimy dalej!" }).click({ timeout: 20_000 });
      await expect(celebration).toBeHidden();
    }
  }
}
