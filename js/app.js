/* =========================================================
   核心：頁面切換（hash 路由）、旅程共用邏輯
   網址格式：#/home、#/transport/car、#/tools/budget、#/memories/day/3
   ========================================================= */
window.App = (function () {
  'use strict';
  var T = window.TRIP, S = window.Store, U = window.UI;
  var pages = {};
  var current = { name: '', params: [] };

  function register(name, page) { pages[name] = page; }

  function parseHash() {
    var h = (location.hash || '').replace(/^#\/?/, '');
    var parts = h.split('/').filter(Boolean).map(decodeURIComponent);
    var name = parts[0] && pages[parts[0]] ? parts[0] : 'home';
    return { name: name, params: parts.slice(1) };
  }

  function render(keepScroll) {
    var r = parseHash(), page = pages[r.name], root = document.getElementById('main');
    var changed = r.name !== current.name || r.params.join('/') !== current.params.join('/');
    var y = window.scrollY;
    current = r;
    try {
      root.innerHTML = '<div class="page page-' + r.name + '">' + page.render(r.params) + '</div>';
      if (page.bind) page.bind(root.firstElementChild, r.params);  // 每次都是新的元素，事件不會重複綁定
    } catch (e) {
      console.error(e);
      root.innerHTML = '<div class="section" style="padding-top:40px"><div class="empty">這一頁暫時無法顯示，請重新整理。<br><small>' + U.esc(e.message) + '</small></div></div>';
    }
    document.querySelectorAll('[data-nav]').forEach(function (a) {
      if (a.getAttribute('data-nav') === r.name) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (keepScroll || !changed) window.scrollTo(0, y); else window.scrollTo(0, 0);
  }
  function rerender() { render(true); }
  function go(path) { if (location.hash === '#/' + path) rerender(); else location.hash = '#/' + path; }

  /* ---------- 日期 ---------- */
  function dayIndexByDate(iso) {
    for (var i = 0; i < T.days.length; i++) if (T.days[i].date === iso) return i;
    return -1;
  }
  function defaultDayIndex() {
    var today = U.todayISO();
    if (today < T.startDate) return 0;
    if (today > T.endDate) return T.days.length - 1;
    var i = dayIndexByDate(today); return i < 0 ? 0 : i;
  }
  // 手動選的日期：同一天內重新整理會保留；隔天自動回到「今天」
  function selectedDay() {
    var s = S.get('home.selected', null);
    if (s && s.savedOn === U.todayISO() && T.days[s.index]) return s.index;
    return defaultDayIndex();
  }
  function selectDay(i) { S.set('home.selected', { index: i, savedOn: U.todayISO() }); }
  function isToday(day) { return day.date === U.todayISO(); }
  function tripStatus() {
    var t = U.todayISO();
    return t < T.startDate ? 'before' : (t > T.endDate ? 'after' : 'during');
  }

  /* ---------- 行程完成狀態 ---------- */
  function isDone(itemId) { return !!S.get('done', {})[itemId]; }
  function toggleDone(itemId) { return S.update('done', {}, function (d) { d[itemId] = !d[itemId]; if (!d[itemId]) delete d[itemId]; })[itemId]; }
  function dayProgress(day) {
    var n = day.itinerary.length, done = day.itinerary.filter(function (it) { return isDone(it.id); }).length;
    return { done: done, total: n, complete: n > 0 && done === n };
  }
  // 下一站：今天 → 第一個還沒按「完成」的行程；其他天 → 當日第一站
  function nextStop(day) {
    var items = day.itinerary;
    if (!items.length) return null;
    var today = isToday(day);
    if (!today) return { item: items[0], index: 0, label: '當日第一站', late: false };
    for (var i = 0; i < items.length; i++) {
      if (!isDone(items[i].id)) {
        var t = U.toMinutes(items[i].time);
        var late = t !== null && U.nowMinutes() > t + 90;
        var anyDone = items.some(function (x) { return isDone(x.id); });
        return { item: items[i], index: i, label: anyDone ? '下一站' : '今日第一站', late: late };
      }
    }
    return { item: null, index: -1, label: '今日行程完成', late: false };
  }

  // 一個地點的資訊：行程項目會沿用對應的餐廳（restaurantId）或住宿（stayId）
  function placeOf(x) {
    if (!x) return { q: '', id: '', mapUrl: '', parkingId: '', parkingName: '' };
    var isItem = 'category' in x, src = x;
    if (!x.placeId && !x.mapQuery) {
      if (x.restaurantId) src = restaurant(x.restaurantId) || x;
      else if (x.stayId) src = accommodation(x.stayId) || x;
    }
    var q = src.mapQuery || src.address || src.nameJa || (isItem && src === x ? '' : src.name) || '';
    return { q: q, id: src.placeId || '', mapUrl: src.mapUrl || '',
      parkingId: x.parkingPlaceId || src.parkingPlaceId || '', parkingName: x.parkingName || src.parkingName || '' };
  }
  function placeQuery(it) { return placeOf(it).q; }
  // 地圖：直接打開 Google Maps 的地點頁（店家資訊、照片、評論）
  function mapUrl(x) {
    var p = placeOf(x);
    if (p.mapUrl) return p.mapUrl;
    return p.q ? U.mapsUrl(p.q, p.id) : '';
  }
  // 導航：有指定停車場就導到停車場
  function routePoint(x) {
    var p = placeOf(x);
    if (p.parkingId) return { q: p.parkingName || p.q, id: p.parkingId };
    if (x.latitude && x.longitude) return { q: x.latitude + ',' + x.longitude, id: '' };
    return p.q ? { q: p.q, id: p.id } : null;
  }
  function navUrl(x) {
    if (x.navigationUrl) return x.navigationUrl;
    var r = routePoint(x); return r ? U.dirUrl(r.q, r.id) : '';
  }

  /* ---------- 住宿 ---------- */
  function accommodation(id) {
    if (!id) return null;
    var base = T.accommodations.filter(function (a) { return a.id === id; })[0];
    if (!base) return null;
    return Object.assign({}, base, S.get('stay.edits', {})[id] || {});
  }

  /* ---------- 餐廳（資料檔 + 自己新增 / 修改 / 刪除） ---------- */
  // 只記錄「跟程式碼不一樣」的欄位，之後程式碼更新其他欄位（例如營業時間）手機也會看到
  function diffFromBase(base, r) {
    var d = {};
    Object.keys(r).forEach(function (k) { if (JSON.stringify(r[k]) !== JSON.stringify(base[k])) d[k] = r[k]; });
    return d;
  }
  function baseRestaurant(id) { return T.restaurants.filter(function (b) { return b.id === id; })[0]; }
  (function migrateFoodEdits() {
    if (S.get('food.edits.v2', false)) return;
    S.update('food.edits', {}, function (e) {
      Object.keys(e).forEach(function (id) { var b = baseRestaurant(id); if (b) e[id] = diffFromBase(b, e[id]); });
    });
    S.set('food.edits.v2', true);
  })();
  function restaurants() {
    var edits = S.get('food.edits', {}), deleted = S.get('food.deleted', []), custom = S.get('food.custom', []);
    return T.restaurants.concat(custom)
      .filter(function (r) { return deleted.indexOf(r.id) < 0; })
      .map(function (r) { return Object.assign({}, r, edits[r.id] || {}); });
  }
  function restaurant(id) { return restaurants().filter(function (r) { return r.id === id; })[0] || null; }
  function saveRestaurant(r) {
    var isBase = T.restaurants.some(function (b) { return b.id === r.id; });
    if (isBase) S.update('food.edits', {}, function (e) { e[r.id] = diffFromBase(baseRestaurant(r.id), r); });
    else S.update('food.custom', [], function (list) {
      var i = list.findIndex(function (x) { return x.id === r.id; });
      if (i >= 0) list[i] = r; else list.push(r);
    });
  }
  function deleteRestaurant(id) {
    var isBase = T.restaurants.some(function (b) { return b.id === id; });
    if (isBase) S.update('food.deleted', [], function (d) { if (d.indexOf(id) < 0) d.push(id); });
    else S.update('food.custom', [], function (list) { return list.filter(function (x) { return x.id !== id; }); });
  }
  function isFav(id) { return !!S.get('food.fav', {})[id]; }
  function toggleFav(id) { return S.update('food.fav', {}, function (f) { f[id] = !f[id]; if (!f[id]) delete f[id]; })[id]; }

  /* ---------- 私人資訊（只存在這支手機） ---------- */
  function priv(key) { return S.get('private', {})[key] || ''; }

  /* ---------- 天氣 ---------- */
  var WMO = {
    0: ['晴', 'sun'], 1: ['晴時多雲', 'partly'], 2: ['多雲', 'partly'], 3: ['陰', 'cloud'], 45: ['霧', 'cloud'], 48: ['霧', 'cloud'],
    51: ['毛毛雨', 'rain'], 53: ['毛毛雨', 'rain'], 55: ['毛毛雨', 'rain'], 61: ['小雨', 'rain'], 63: ['雨', 'rain'], 65: ['大雨', 'rain'],
    80: ['陣雨', 'rain'], 81: ['陣雨', 'rain'], 82: ['大陣雨', 'rain'], 95: ['雷雨', 'rain'], 96: ['雷雨', 'rain'], 99: ['雷雨', 'rain']
  };
  function weather(day) {
    var w = S.get('weather', {})[day.date];
    return w || Object.assign({ source: '' }, day.weather);
  }
  function saveWeather(date, w) { S.update('weather', {}, function (all) { all[date] = w; }); }
  // 免費的 Open-Meteo 預報（不需金鑰）；只會更新「16 天內」的日期
  function fetchWeather() {
    var L = T.weatherLocation;
    var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + L.latitude + '&longitude=' + L.longitude +
      '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FTokyo&forecast_days=16';
    return fetch(url).then(function (r) { if (!r.ok) throw new Error('天氣服務暫時無法使用'); return r.json(); }).then(function (j) {
      var d = j.daily, n = 0, now = new Date().toISOString();
      d.time.forEach(function (date, i) {
        if (dayIndexByDate(date) < 0) return;
        var m = WMO[d.weather_code[i]] || ['—', 'cloud'];
        saveWeather(date, { status: m[0], icon: m[1], temp: Math.round(d.temperature_2m_min[i]) + '–' + Math.round(d.temperature_2m_max[i]) + '°',
          rain: d.precipitation_probability_max[i] == null ? '' : d.precipitation_probability_max[i] + '%', source: 'auto', updatedAt: now });
        n++;
      });
      return n;
    });
  }
  function weatherIcon(w) { return w && w.icon ? w.icon : 'partly'; }

  /* ---------- 匯率 ---------- */
  function fx() { return S.get('fx', { rate: '', updatedAt: '', source: '' }); }
  function fetchRate() {
    return fetch('https://open.er-api.com/v6/latest/JPY').then(function (r) { if (!r.ok) throw new Error('匯率服務暫時無法使用'); return r.json(); })
      .then(function (j) {
        var rate = j && j.rates && j.rates.TWD; if (!rate) throw new Error('取不到台幣匯率');
        var v = { rate: Number(rate.toFixed(4)), updatedAt: new Date().toISOString(), source: 'auto' };
        S.set('fx', v); return v;
      });
  }

  /* ---------- 印章：當天行程全部完成，或手動蓋章 ---------- */
  function stampOn(i) {
    var manual = S.get('stamps', {});
    if (manual[i] === false) return false;
    return !!manual[i] || dayProgress(T.days[i]).complete;
  }

  function fmtTime(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    return (d.getMonth() + 1) + '/' + d.getDate() + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  }

  function start() {
    window.addEventListener('hashchange', function () { U.closeSheet(); render(false); });
    if (!location.hash) history.replaceState(null, '', '#/home');
    render(false);
    if ('serviceWorker' in navigator && location.protocol === 'https:') {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    }
  }

  return {
    register: register, start: start, rerender: rerender, go: go,
    selectedDay: selectedDay, selectDay: selectDay, isToday: isToday, tripStatus: tripStatus, dayIndexByDate: dayIndexByDate,
    isDone: isDone, toggleDone: toggleDone, dayProgress: dayProgress, nextStop: nextStop, navUrl: navUrl, placeQuery: placeQuery, placeOf: placeOf, mapUrl: mapUrl, routePoint: routePoint,
    accommodation: accommodation,
    restaurants: restaurants, restaurant: restaurant, saveRestaurant: saveRestaurant, deleteRestaurant: deleteRestaurant, isFav: isFav, toggleFav: toggleFav,
    priv: priv, weather: weather, saveWeather: saveWeather, fetchWeather: fetchWeather, weatherIcon: weatherIcon,
    fx: fx, fetchRate: fetchRate, stampOn: stampOn, fmtTime: fmtTime
  };
})();
