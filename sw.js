/* 離線支援：打開過一次網站後，沒網路也能看行程。
   修改網站檔案後，把 VERSION 數字加 1，手機才會拿到新版。 */
var VERSION = 'okinawa-love-v7';
var SHELL = [
  './', 'index.html', 'css/style.css', 'manifest.webmanifest',
  'js/data.js', 'js/store.js', 'js/ui.js', 'js/app.js',
  'js/pages/home.js', 'js/pages/transport.js', 'js/pages/food.js', 'js/pages/tools.js', 'js/pages/memories.js',
  'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var req = e.request, url = new URL(req.url);
  if (req.method !== 'GET') return;
  // 天氣、匯率：一律走網路（離線時由頁面顯示提示）
  if (/open-meteo\.com|er-api\.com/.test(url.hostname)) return;
  // 網站檔案與字型：先用快取，背景更新
  if (url.origin === location.origin || /fonts\.(googleapis|gstatic)\.com/.test(url.hostname)) {
    e.respondWith(caches.open(VERSION).then(function (cache) {
      return cache.match(req).then(function (hit) {
        var net = fetch(req).then(function (res) {
          if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
          return res;
        }).catch(function () { return hit; });
        return hit || net;
      });
    }));
  }
});
