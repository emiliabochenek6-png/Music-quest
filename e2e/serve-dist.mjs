// A tiny static server for the exported web app (dist/), used only by the Playwright tests.
// It mimics the two things Vercel does in production (see vercel.json): "clean" URLs
// (/map -> map.html) and the rewrites for /world/:id and /lesson/:id.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..", "dist");
const port = Number(process.env.E2E_PORT ?? 4173);
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".json": "application/json", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".ttf": "font/ttf", ".wav": "audio/wav", ".mp3": "audio/mpeg", ".webp": "image/webp" };

async function exists(path) {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

async function resolvePath(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, "");
  if (/^\/world\/[^/]+$/.test(clean)) return join(root, "world", "[worldId].html");
  if (/^\/lesson\/[^/]+$/.test(clean)) return join(root, "lesson", "[lessonId].html");
  for (const candidate of [join(root, clean), join(root, `${clean}.html`), join(root, clean, "index.html")]) {
    if (await exists(candidate)) return candidate;
  }
  return join(root, "+not-found.html");
}

createServer(async (request, response) => {
  const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
  // /__reset wipes everything the app saved in this browser (a brand-new player) and opens the start page: for looking at the game from level 0.
  if (pathname === "/__reset") {
    response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    response.end("<!doctype html><meta charset=utf-8><title>Nowa gra</title><script>try{localStorage.clear();sessionStorage.clear();}catch(e){}location.replace('/');</script>");
    return;
  }
  const path = await resolvePath(pathname);
  try {
    const body = await readFile(path);
    response.writeHead(path.endsWith("+not-found.html") ? 404 : 200, { "content-type": types[extname(path)] ?? "application/octet-stream" });
    response.end(body);
  } catch {
    response.writeHead(404).end("Not found");
  }
}).listen(port, "127.0.0.1", () => console.log(`dist served at http://127.0.0.1:${port}`));
