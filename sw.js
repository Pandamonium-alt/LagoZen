const CACHE_NAME = 'lago-zen-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/sketch.js',
  '/manifest.json',
  '/assets/gota.mp3',
  '/assets/musica1.mp3',
  // agrega todas tus músicas, iconos, lago.mp4, etc.
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});