/* Офлайн-режим: файлы приложения кэшируются при первом запуске,
   порядок черт (KanjiVG) докэшируется по мере просмотра знаков. */
const VER = 'kanji-dojo-v1';
const APP = [
  './', 'index.html', 'manifest.webmanifest',
  'css/style.css',
  'js/theme.js', 'js/strokes.js', 'js/app.js', 'js/grammar.js', 'js/lessons.js', 'js/pwa.js',
  'assets/theme-light.jpg', 'assets/theme-dark.jpg',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png'
];
const STROKES = /(cdn\.jsdelivr\.net|raw\.githubusercontent\.com)\/.*kanjivg/i;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VER).then(c => c.addAll(APP)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k !== VER).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  const same = u.origin === location.origin;
  if (!same && !STROKES.test(r.url)) return;
  // сначала из кэша, в фоне обновляем (стили и скрипты подтянутся при следующем запуске)
  e.respondWith(caches.open(VER).then(async c => {
    const hit = await c.match(r, {ignoreSearch: same});
    const net = fetch(r).then(res => {
      if (res && res.ok && (same || res.type === 'cors')) c.put(r, res.clone());
      return res;
    }).catch(() => null);
    return hit || (await net) || new Response('', {status: 504, statusText: 'offline'});
  }));
});
