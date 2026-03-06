/**
 * service-worker.js — SecCheck PWA
 * Strategy:
 *   App shell (HTML/CSS/JS) → Cache first, update in background
 *   API calls (workers.dev) → Network only, no cache
 */

const CACHE   = "seccheck-v1";
const SHELL   = [
  "/checklist/",
  "/assets/css/checklist.css",
  "/assets/js/checklist.js",
];

// ── Install: pre-cache app shell ──────────────────────
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: remove stale caches ────────────────────
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ── Fetch ─────────────────────────────────────────────
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);

  // API calls: always network, never cache
  if (url.hostname.includes("workers.dev") || url.pathname.startsWith("/api/")) {
    return; // browser default (fail gracefully when offline)
  }

  // Non-GET requests: pass through
  if (e.request.method !== "GET") return;

  // App shell: cache first, then update cache in background (stale-while-revalidate)
  e.respondWith(
    caches.open(CACHE).then(async cache => {
      const cached = await cache.match(e.request);

      const networkFetch = fetch(e.request)
        .then(res => {
          if (res.ok && res.status < 400) {
            cache.put(e.request, res.clone());
          }
          return res;
        })
        .catch(() => null);

      // Return cached immediately if available; update in background
      if (cached) {
        networkFetch; // fire-and-forget background update
        return cached;
      }

      // No cache — wait for network
      const networkRes = await networkFetch;
      if (networkRes) return networkRes;

      // Both failed — return offline fallback
      return new Response(
        `<!DOCTYPE html><html><head><meta charset="UTF-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>Offline — SecCheck</title>
        <style>
          body{background:#0d0d14;color:#c9a96e;font-family:monospace;
               display:flex;align-items:center;justify-content:center;
               min-height:100vh;margin:0;text-align:center}
          h2{margin:0 0 8px}p{color:#5a5260;font-size:14px}
        </style></head><body>
        <div><h2>● Offline</h2><p>Connect to the internet to load your checklist.</p></div>
        </body></html>`,
        { headers: { "Content-Type": "text/html" } }
      );
    })
  );
});

// ── Message: force refresh ────────────────────────────
self.addEventListener("message", e => {
  if (e.data && e.data.type === "SKIP_WAITING") self.skipWaiting();
});
