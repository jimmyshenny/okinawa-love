/* =========================================================
   共用 UI 工具：icon、跳脫字元、Google Maps 連結、彈出視窗、提示
   ========================================================= */
window.UI = (function () {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  // 沒資料時顯示「待補」
  function v(x, empty) { return (x === '' || x == null) ? '<span class="tbd">' + (empty || '待補') + '</span>' : esc(x); }
  function has(x) { return !(x === '' || x == null); }

  var P = 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
  var paths = {
    home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    car: '<path d="M5 16v-5l2-5h10l2 5v5M5 16h14M7.5 19.5V16M16.5 19.5V16M5 11h14"/>',
    food: '<path d="M4 12h16a8 8 0 0 1-16 0zM8 8c0-2 2-2 2-4M13 8c0-2 2-2 2-4"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    album: '<rect x="5" y="3" width="14" height="18" rx="1.5"/><rect x="7.5" y="5.5" width="9" height="9"/>',
    nav: '<path d="M3 11l18-8-8 18-2-8z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
    heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
    chevron: '<path d="M6 9l6 6 6-6"/>',
    right: '<path d="M9 6l6 6-6 6"/>',
    left: '<path d="M15 6l-6 6 6 6"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4-4"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z"/>',
    globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.5 2.5 14.5 0 17M12 3.5c-2.5 2.5-2.5 14.5 0 17"/>',
    plane: '<path d="M10 14l-6-2 1-2 7 1 4-6h2l-2 7 5 1-1 2-5-1-3 5h-2z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/>',
    cloud: '<path d="M7 19h10a4 4 0 0 0 0-8 5.5 5.5 0 0 0-10.6 1.6A3.2 3.2 0 0 0 7 19z"/>',
    rain: '<path d="M7 15h10a4 4 0 0 0 0-8 5.5 5.5 0 0 0-10.6 1.6A3.2 3.2 0 0 0 7 15zM8 18l-1 2M12 18l-1 2M16 18l-1 2"/>',
    partly: '<circle cx="9" cy="9" r="3.5"/><path d="M9 2.5v1.2M3.7 9H2.5M4.4 4.4l.9.9M13.6 4.4l-.9.9"/><path d="M8 20h10a3.5 3.5 0 0 0 0-7 5 5 0 0 0-9.6 1.4A2.8 2.8 0 0 0 8 20z"/>',
    info: '<rect x="4" y="7" width="16" height="13" rx="2"/><path d="M9 7V5h6v2M4 12h16"/>',
    camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    yen: '<path d="M6 4l6 8 6-8M12 12v8M8 13h8M8 16.5h8"/>',
    wallet: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M16 12.5h2M3 9h18"/>',
    bag: '<path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>',
    note: '<path d="M5 4h10l4 4v12H5zM14 4v5h5M8 13h8M8 16.5h5"/>',
    sos: '<path d="M12 3l9 16H3z"/><path d="M12 10v4M12 17h.01"/>',
    backup: '<path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 19h14"/>',
    map: '<path d="M4 6l5-2 6 2 5-2v14l-5 2-6-2-5 2z"/><path d="M9 4v14M15 6v14"/>',
    refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6"/>',
    star: '<path d="M12 4l2.4 5 5.4.6-4 3.7 1.1 5.3L12 16l-4.9 2.6 1.1-5.3-4-3.7 5.4-.6z"/>',
    up: '<path d="M6 15l6-6 6 6"/>'
  };
  function icon(name, size, cls) {
    return '<svg class="icon ' + (cls || '') + '" width="' + (size || 20) + '" height="' + (size || 20) + '" viewBox="0 0 24 24" ' + P + ' aria-hidden="true">' + (paths[name] || '') + '</svg>';
  }

  // placeId（Google 地點 ID）：有的話 Google Maps 會直接打開那一家，不會跳出搜尋清單
  function pid(name, id) { return id ? '&' + name + '=' + encodeURIComponent(id) : ''; }
  function mapsUrl(query, placeId) { return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query) + pid('query_place_id', placeId); }
  function dirUrl(dest, placeId) { return 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(dest) + pid('destination_place_id', placeId) + '&travelmode=driving'; }
  // points：字串，或 { q: 搜尋字, id: placeId }
  function routeUrl(points) {
    points = points.map(function (p) { return typeof p === 'string' ? { q: p, id: '' } : p; });
    if (!points.length) return '';
    if (points.length === 1) return dirUrl(points[0].q, points[0].id);
    var dest = points[points.length - 1], origin = points[0], mid = points.slice(1, -1);
    var midIds = mid.every(function (p) { return p.id; });
    return 'https://www.google.com/maps/dir/?api=1&origin=' + encodeURIComponent(origin.q) + pid('origin_place_id', origin.id) +
      '&destination=' + encodeURIComponent(dest.q) + pid('destination_place_id', dest.id) +
      (mid.length ? '&waypoints=' + mid.map(function (p) { return encodeURIComponent(p.q); }).join('%7C') +
        (midIds ? '&waypoint_place_ids=' + mid.map(function (p) { return encodeURIComponent(p.id); }).join('%7C') : '') : '') + '&travelmode=driving';
  }

  function money(n, cur) {
    if (n === '' || n == null || isNaN(n)) return '—';
    var s = Math.round(Number(n)).toLocaleString('zh-TW');
    return cur === 'TWD' ? 'NT$ ' + s : '¥ ' + s;
  }

  // 日期
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function todayISO() { var d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function md(iso) { if (!iso) return ''; var p = iso.split('-'); return p[1] + '/' + p[2]; }
  function dotDate(iso) { return iso ? iso.replace(/-/g, '.') : ''; }
  function nowMinutes() { var d = new Date(); return d.getHours() * 60 + d.getMinutes(); }
  function toMinutes(t) { if (!t || !/^\d{1,2}:\d{2}$/.test(t)) return null; var p = t.split(':'); return +p[0] * 60 + +p[1]; }

  /* ---------- Toast ---------- */
  var toastTimer;
  function toast(msg) {
    var el = document.getElementById('toast');
    el.textContent = msg; el.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { el.classList.remove('show'); }, 2200);
  }

  /* ---------- 彈出視窗 ---------- */
  var lastFocus = null, onCloseCb = null;
  function openSheet(title, bodyHtml, opts) {
    opts = opts || {};
    lastFocus = document.activeElement; onCloseCb = opts.onClose || null;
    var root = document.getElementById('sheet');
    root.innerHTML =
      '<div class="sheet-backdrop" data-close></div>' +
      '<div class="sheet-panel ' + (opts.wide ? 'wide' : '') + '" role="dialog" aria-modal="true" aria-labelledby="sheet-title">' +
        '<div class="sheet-head"><h2 id="sheet-title">' + esc(title) + '</h2>' +
        '<button class="icon-btn" data-close aria-label="關閉">' + icon('x', 20) + '</button></div>' +
        '<div class="sheet-body">' + bodyHtml + '</div></div>';
    root.hidden = false; document.body.classList.add('no-scroll');
    root.querySelectorAll('[data-close]').forEach(function (b) { b.addEventListener('click', closeSheet); });
    // 聚焦在關閉鈕，避免手機一打開就跳出鍵盤
    var target = root.querySelector('.icon-btn');
    setTimeout(function () { if (target) target.focus({ preventScroll: true }); }, 30);
    return root;
  }
  function closeSheet() {
    var root = document.getElementById('sheet');
    if (root.hidden) return;
    root.hidden = true; root.innerHTML = ''; document.body.classList.remove('no-scroll');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    var cb = onCloseCb; onCloseCb = null; if (cb) cb();
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSheet(); });

  /* 表單視窗
     fields: [{name,label,type:text|number|textarea|select|date|time|url|tel|checkbox, value, options:[[value,label]], placeholder, required}] */
  function form(cfg) {
    var html = '<form class="form" novalidate>' + cfg.fields.map(function (f) {
      var id = 'f-' + f.name, val = f.value == null ? '' : f.value, input;
      if (f.type === 'textarea') input = '<textarea id="' + id + '" name="' + f.name + '" rows="' + (f.rows || 3) + '" placeholder="' + esc(f.placeholder || '') + '">' + esc(val) + '</textarea>';
      else if (f.type === 'select') input = '<select id="' + id + '" name="' + f.name + '">' + f.options.map(function (o) {
        return '<option value="' + esc(o[0]) + '"' + (String(o[0]) === String(val) ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join('') + '</select>';
      else if (f.type === 'checkbox') return '<label class="check-row"><input type="checkbox" name="' + f.name + '"' + (val ? ' checked' : '') + '> <span>' + esc(f.label) + '</span></label>';
      else input = '<input id="' + id + '" name="' + f.name + '" type="' + (f.type || 'text') + '" value="' + esc(val) + '" placeholder="' + esc(f.placeholder || '') + '"' +
        (f.type === 'number' ? ' inputmode="decimal" step="any"' : '') + (f.required ? ' required' : '') + '>';
      return '<label class="field" for="' + id + '"><span>' + esc(f.label) + (f.required ? ' *' : '') + '</span>' + input + (f.help ? '<small>' + esc(f.help) + '</small>' : '') + '</label>';
    }).join('') +
      '<div class="form-actions">' +
      (cfg.onDelete ? '<button type="button" class="btn btn-danger" data-del>' + icon('trash', 16) + '刪除</button>' : '') +
      '<button type="submit" class="btn btn-primary">' + esc(cfg.submitLabel || '儲存') + '</button></div></form>';
    var root = openSheet(cfg.title, html);
    var formEl = root.querySelector('form');
    formEl.addEventListener('submit', function (e) {
      e.preventDefault();
      var out = {}, missing = null;
      cfg.fields.forEach(function (f) {
        var el = formEl.elements[f.name];
        out[f.name] = f.type === 'checkbox' ? el.checked : (f.type === 'number' ? (el.value === '' ? '' : Number(el.value)) : el.value.trim());
        if (f.required && (out[f.name] === '' || out[f.name] == null) && !missing) missing = f;
      });
      if (missing) { toast('請填寫「' + missing.label + '」'); formEl.elements[missing.name].focus(); return; }
      if (cfg.onSave(out) !== false) closeSheet();
    });
    var del = root.querySelector('[data-del]');
    if (del) del.addEventListener('click', function () {
      if (confirm(cfg.deleteConfirm || '確定要刪除嗎？')) { cfg.onDelete(); closeSheet(); }
    });
    return root;
  }

  return {
    esc: esc, v: v, has: has, icon: icon, mapsUrl: mapsUrl, dirUrl: dirUrl, routeUrl: routeUrl, money: money,
    todayISO: todayISO, md: md, dotDate: dotDate, nowMinutes: nowMinutes, toMinutes: toMinutes,
    toast: toast, openSheet: openSheet, closeSheet: closeSheet, form: form
  };
})();
