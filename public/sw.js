/* eslint-disable no-restricted-globals */
const CACHE_NAME = 'yaqeen-todo-v1';

function baseUrl() {
  // registration.scope is always a fully-qualified URL ending with '/'
  const scope = self.registration && self.registration.scope ? self.registration.scope : self.location.href;
  return new URL(scope).pathname;
}

function withBase(p) {
  const base = baseUrl();
  return new URL(p.replace(/^\//, ''), self.location.origin + base).pathname;
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        cache.addAll([withBase('/'), withBase('/index.html'), withBase('/manifest.webmanifest')]),
      )
      .then(() => self.skipWaiting())
      .catch(() => undefined),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

// Simple runtime caching:
// - Same-origin GET: cache-first for static-ish requests, network-fallback
// - Navigations: network-first with cache fallback (so app works offline)
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;
  if (!isSameOrigin) return;

  const isNavigation = request.mode === 'navigate';

  if (isNavigation) {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request);
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, fresh.clone()).catch(() => undefined);
          return fresh;
        } catch {
          const cached = await caches.match(request);
          return cached || caches.match(withBase('/index.html')) || Response.error();
        }
      })(),
    );
    return;
  }

  event.respondWith(
    (async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      try {
        const fresh = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, fresh.clone()).catch(() => undefined);
        return fresh;
      } catch {
        return Response.error();
      }
    })(),
  );
});

