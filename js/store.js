/* =========================================================
   資料保存：一般資料存在 localStorage，照片存在 IndexedDB
   之後若要兩人同步，可把這裡換成 Firebase / Supabase，
   其他檔案只透過 Store.get / Store.set 存取資料。
   ========================================================= */
window.Store = (function () {
  'use strict';
  var PREFIX = 'okinawa-love:';

  function get(key, fallback) {
    try {
      var raw = localStorage.getItem(PREFIX + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) { return fallback; }
  }
  function set(key, value) {
    try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); return true; }
    catch (e) { console.warn('儲存失敗', e); return false; }
  }
  function update(key, fallback, fn) {
    var v = get(key, fallback); var r = fn(v); set(key, r === undefined ? v : r); return r === undefined ? v : r;
  }
  function allKeys() {
    var out = [];
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k && k.indexOf(PREFIX) === 0) out.push(k.slice(PREFIX.length));
    }
    return out;
  }
  function uid(p) { return (p || 'id') + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

  /* ---------- 照片（IndexedDB） ---------- */
  var dbPromise = null;
  function db() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise(function (resolve, reject) {
      if (!window.indexedDB) { reject(new Error('此瀏覽器不支援 IndexedDB')); return; }
      var req = indexedDB.open('okinawa-love-photos', 1);
      req.onupgradeneeded = function () { req.result.createObjectStore('photos'); };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    });
    return dbPromise;
  }
  function tx(mode, fn) {
    return db().then(function (d) {
      return new Promise(function (resolve, reject) {
        var t = d.transaction('photos', mode); var s = t.objectStore('photos');
        var r = fn(s);
        t.oncomplete = function () { resolve(r && r.result); };
        t.onerror = function () { reject(t.error); };
      });
    });
  }
  var urlCache = {};
  function putPhoto(id, blob) { return tx('readwrite', function (s) { return s.put(blob, id); }); }
  function getPhotoUrl(id) {
    if (urlCache[id]) return Promise.resolve(urlCache[id]);
    return tx('readonly', function (s) { return s.get(id); }).then(function (blob) {
      if (!blob) return '';
      urlCache[id] = URL.createObjectURL(blob); return urlCache[id];
    });
  }
  function getPhotoBlob(id) { return tx('readonly', function (s) { return s.get(id); }); }
  function deletePhoto(id) {
    if (urlCache[id]) { URL.revokeObjectURL(urlCache[id]); delete urlCache[id]; }
    return tx('readwrite', function (s) { return s.delete(id); });
  }

  // 壓縮照片：長邊最多 1600px，JPEG 品質 0.82
  function compressImage(file, maxSide) {
    maxSide = maxSide || 1600;
    return new Promise(function (resolve, reject) {
      var img = new Image(); var url = URL.createObjectURL(file);
      img.onload = function () {
        var w = img.naturalWidth, h = img.naturalHeight, scale = Math.min(1, maxSide / Math.max(w, h));
        var c = document.createElement('canvas'); c.width = Math.round(w * scale); c.height = Math.round(h * scale);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        c.toBlob(function (b) { b ? resolve(b) : reject(new Error('壓縮失敗')); }, 'image/jpeg', 0.82);
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('無法讀取這張照片')); };
      img.src = url;
    });
  }

  /* ---------- 備份 / 還原 ---------- */
  function blobToDataUrl(b) {
    return new Promise(function (res) { var r = new FileReader(); r.onload = function () { res(r.result); }; r.readAsDataURL(b); });
  }
  function exportAll(includePhotos) {
    var data = {}; allKeys().forEach(function (k) { data[k] = get(k); });
    var out = { app: 'okinawa-love', version: 1, exportedAt: new Date().toISOString(), data: data, photos: {} };
    if (!includePhotos) return Promise.resolve(out);
    var photos = get('photos', []);
    return Promise.all(photos.map(function (p) {
      return getPhotoBlob(p.id).then(function (b) { if (b) return blobToDataUrl(b).then(function (d) { out.photos[p.id] = d; }); });
    })).then(function () { return out; });
  }
  function importAll(obj) {
    if (!obj || obj.app !== 'okinawa-love' || !obj.data) return Promise.reject(new Error('這不是本網站的備份檔'));
    Object.keys(obj.data).forEach(function (k) { set(k, obj.data[k]); });
    var ids = Object.keys(obj.photos || {});
    return Promise.all(ids.map(function (id) {
      return fetch(obj.photos[id]).then(function (r) { return r.blob(); }).then(function (b) { return putPhoto(id, b); });
    }));
  }

  return {
    get: get, set: set, update: update, uid: uid,
    putPhoto: putPhoto, getPhotoUrl: getPhotoUrl, deletePhoto: deletePhoto, compressImage: compressImage,
    exportAll: exportAll, importAll: importAll
  };
})();
