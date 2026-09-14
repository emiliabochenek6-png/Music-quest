// Minimal service worker — just enough for real PWA installability
// (Chrome requires an active SW with a fetch handler, on top of the
// manifest) plus a small offline/repeat-visit benefit, without needing
// to know the Metro static export's own content-hashed bundle filenames
// ahead of time: everything is cached OPPORTUNISTICALLY as it's actually
// fetched, not pre-listed here.
const CACHE_NAME = "music-quest-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  // Page navigations: try the network first (so a new deploy is always
  // picked up when online), fall back to whatever was last cached when
  // offline.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match("/")))
    );
    return;
  }

  // Everything else (JS/CSS/image assets): cache-first, filling the
  // cache in the background on a miss.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
