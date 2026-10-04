import { defineConfig, devices } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";

// The test account's e-mail and password live in .env.test (not in git, see .gitignore).
if (existsSync(".env.test")) {
  for (const line of readFileSync(".env.test", "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (match && process.env[match[1]] === undefined) process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
}

const PORT = 4173;

export default defineConfig({
  testDir: "e2e",
  timeout: 90_000,
  expect: { timeout: 15_000 },
  retries: 0,
  workers: 1, // one test account: tests must not run at the same time, and run in file order (first-lesson before shop-purchase)
  reporter: [["list"]],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    viewport: { width: 390, height: 844 },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 } } }],
  // `npm run test:e2e` builds the site first (npm run build:web); this only serves the finished dist/.
  webServer: { command: "node e2e/serve-dist.mjs", url: `http://127.0.0.1:${PORT}`, reuseExistingServer: true, timeout: 30_000 },
});
