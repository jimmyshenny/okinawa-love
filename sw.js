/* 離線支援：打開過一次網站後，沒網路也能看行程。
   修改網站檔案後，把 VERSION 數字加 1，手機才會拿到新版。 */
var VERSION = 'okinawa-love-v75';
var SHELL = [
  './', 'index.html', 'css/style.css', 'manifest.webmanifest',
  'js/data.js', 'js/store.js', 'js/ui.js', 'js/app.js',
  'js/pages/home.js', 'js/pages/transport.js', 'js/pages/food.js', 'js/pages/tools.js', 'js/pages/memories.js',
  'icons/icon.svg', 'images/stays/azat.jpg', 'images/stays/azat-room-1.jpg', 'images/stays/azat-room-2.jpg', 'images/stays/azat-room-3.jpg', 'images/stays/azat-room-4.jpg', 'images/stays/azat-room-5.jpg', 'images/stays/azat-room-6.jpg', 'images/stays/blisstia.jpg', 'images/stays/blisstia-room-1.jpg', 'images/stays/blisstia-room-2.jpg', 'images/stays/blisstia-room-3.jpg', 'images/stays/blisstia-room-4.jpg', 'images/stays/blisstia-room-5.jpg', 'images/stays/blisstia-room-6.jpg', 'images/stays/blisstia-room-7.jpg', 'images/stays/blisstia-room-8.jpg', 'images/stays/blisstia-room-9.jpg', 'images/stays/blisstia-room-10.jpg', 'images/stays/yukurina.jpg', 'images/stays/yukurina-room-1.jpg', 'images/stays/yukurina-room-2.jpg', 'images/stays/yukurina-room-3.jpg', 'images/stays/yukurina-room-4.jpg', 'images/stays/yukurina-room-5.jpg', 'images/stays/yukurina-room-6.jpg', 'images/stays/torifito.jpg', 'images/stays/torifito-room-1.jpg', 'images/stays/torifito-room-2.jpg', 'images/stays/torifito-room-3.jpg', 'images/stays/torifito-room-4.jpg', 'images/stays/torifito-room-5.jpg', 'images/stays/torifito-room-6.jpg', 'images/stays/torifito-room-7.jpg', 'images/stays/torifito-room-8.jpg', 'images/stays/torifito-room-9.jpg', 'icons/icon-192.png', 'icons/icon-512.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(SHELL.map(function (u) { return new Request(u, { cache: 'reload' }); })); }).then(function () { return self.skipWaiting(); }));
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
  // 網站檔案：有網路就拿最新版（更新馬上看得到），沒網路才用快取
  if (url.origin === location.origin) {
    e.respondWith(caches.open(VERSION).then(function (cache) {
      var fromCache = function () { return cache.match(req).then(function (hit) { return hit || cache.match('index.html'); }); };
      // no-cache：每次都跟 GitHub 確認有沒有新版，不用等瀏覽器自己的 10 分鐘快取
      var net = fetch(req.url, { cache: 'no-cache', credentials: 'same-origin' }).then(function (res) {
        if (res && res.ok) cache.put(req, res.clone());
        return res;
      });
      // 訊號很差時，等 3 秒還沒回應就先用快取（新版會在背景存好，下次打開就是新的）
      var timeout = new Promise(function (resolve) { setTimeout(resolve, 3000); }).then(fromCache);
      return Promise.race([net.catch(fromCache), timeout.then(function (hit) { return hit || net; })]);
    }));
    return;
  }
  // 字型：先用快取
  if (/fonts\.(googleapis|gstatic)\.com/.test(url.hostname)) {
    e.respondWith(caches.open(VERSION).then(function (cache) {
      return cache.match(req).then(function (hit) {
        return hit || fetch(req).then(function (res) { if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone()); return res; });
      });
    }));
  }
});
