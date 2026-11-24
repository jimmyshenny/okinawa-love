/* Transport：航班 / 租車 / 自駕路線 / 住宿總覽 */
(function () {
  'use strict';
  var T = TRIP, U = UI, S = Store, ic = U.icon, esc = U.esc, v = U.v, has = U.has;
  var TABS = [['flights', '航班'], ['car', '租車'], ['route', '自駕路線'], ['stays', '住宿']];
  var PICK = ['確認車輛外觀', '拍攝車輛照片', '確認車內設備', '確認保險內容', '確認導航', '確認油種', '確認 ETC', '確認租車文件'];
  var RET = ['加滿油', '保留加油收據（若有需要）', '檢查個人物品', '檢查車況', '確認還車地點', '確認還車完成'];

  function privBtn(key, label) {
    return '<button class="more-btn" data-priv="' + esc(key) + '" data-label="' + esc(label) + '">' + ic('lock', 13) + '編輯</button>';
  }
  function privVal(key) { var x = App.priv(key); return x ? esc(x) : '<span class="tbd">未填</span>'; }

  function ticket(f, kind) {
    var out = kind === 'outbound', key = 'flight:' + kind;
    var etk = App.priv(key + ':ticket');
    return '<article class="ticket">' +
      '<div class="ticket-band' + (out ? '' : ' peach') + '"><b>' + (out ? '去程 · 台灣 → 沖繩' : '回程 · 沖繩 → 台灣') + '</b><span class="hand" style="color:var(--ink)">' + (out ? 'Outbound' : 'Return') + '</span></div>' +
      '<div class="ticket-route">' +
        '<div><div class="code">' + esc(f.from) + '</div><div class="tiny muted">' + esc(f.fromName) + (has(f.fromTerminal) ? ' · ' + esc(f.fromTerminal) : '') + '</div><b>' + (has(f.depTime) ? esc(f.depTime) : '--:--') + '</b></div>' +
        ic('plane', 30, 'muted') +
        '<div class="end"><div class="code">' + esc(f.to) + '</div><div class="tiny muted">' + esc(f.toName) + (has(f.toTerminal) ? ' · ' + esc(f.toTerminal) : '') + '</div><b>' + (has(f.arrTime) ? esc(f.arrTime) : '--:--') + '</b></div>' +
      '</div><div class="ticket-cut"></div>' +
      '<div class="ticket-grid">' +
        '<div><div class="k">日期</div><div class="v">' + (has(f.date) ? U.md(f.date) : '<span class="tbd">待確認</span>') + '</div></div>' +
        '<div><div class="k">航空公司</div><div class="v">' + v(f.airline) + '</div></div>' +
        '<div><div class="k">航班</div><div class="v">' + v(f.flightNo) + '</div></div>' +
        '<div><div class="k">出發航廈</div><div class="v">' + v(f.fromTerminal) + '</div></div>' +
        '<div><div class="k">行李</div><div class="v">' + v(f.baggage) + '</div></div>' +
        '<div><div class="k">訂位代號</div><div class="v">' + privVal(key + ':ref') + '</div></div>' +
      '</div>' +
      '<div class="card-pad" style="padding-top:0;display:flex;flex-direction:column;gap:8px">' +
        '<p class="small muted" style="margin:0">' + (has(f.checkinNote) ? esc(f.checkinNote) : '建議起飛前 2 小時抵達機場辦理報到') + '</p>' +
        '<div class="btn-row">' +
          (etk ? '<a class="btn btn-primary" href="' + esc(etk) + '" target="_blank" rel="noopener">電子機票</a>' : '') +
          '<button class="btn" data-priv="' + key + ':ref" data-label="' + (out ? '去程' : '回程') + '訂位代號">' + ic('lock', 15) + '訂位代號</button>' +
          '<button class="btn" data-priv="' + key + ':ticket" data-label="' + (out ? '去程' : '回程') + '電子機票連結">' + ic('lock', 15) + '機票連結</button>' +
        '</div></div>' +
    '</article>';
  }

  function checklist(name, list, title) {
    // 勾選狀態用「項目文字」記錄，程式碼裡新增或調整順序時，已勾的不會跑掉
    var st = S.get('car.check', {}), moved = false;
    list.forEach(function (label, i) {
      if (st[name + i] !== undefined) { if (st[name + ':' + label] === undefined) st[name + ':' + label] = st[name + i]; delete st[name + i]; moved = true; }
    });
    if (moved) S.set('car.check', st);
    var done = list.filter(function (x) { return st[name + ':' + x]; }).length;
    return '<div class="section-title" style="margin-top:4px"><h3 style="font-size:17px">' + title + '</h3><span class="small" style="color:var(--ocean)">' + done + ' / ' + list.length + '</span></div>' +
      '<div class="progress" style="margin-bottom:6px"><i style="width:' + Math.round(done / list.length * 100) + '%"></i></div>' +
      '<ul class="check-list">' + list.map(function (label, i) {
        var on = !!st[name + ':' + label];
        return '<li><button class="check-item" data-check="' + esc(name + ':' + label) + '" aria-pressed="' + on + '"><span class="check-box">' + (on ? ic('check', 14) : '') + '</span><span class="txt">' + esc(label) + '</span></button></li>';
      }).join('') + '</ul>';
  }

  function car() {
    var c = T.rentalCar, q = c.mapQuery || c.address;
    var rows = [['車型', v(c.carModel)], ['車牌', privVal('car:plate') + ' ' + privBtn('car:plate', '車牌')], ['保險', v(c.insurance)], ['油種', v(c.fuel)], ['ETC', v(c.etc)], ['地址', v(c.address)]];
    if (has(c.fuelRule)) rows.push(['加油規定', esc(c.fuelRule)]);
    if (has(c.notes)) rows.push(['注意事項', esc(c.notes)]);
    return '<div style="display:flex;flex-direction:column;gap:14px">' +
      '<article class="card card-pad" style="display:flex;flex-direction:column;gap:12px">' +
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px"><h2 style="font-size:18px">' + (has(c.company) ? esc(c.company) : '租車公司 <span class="tbd small">待補</span>') + '</h2>' +
          '<span class="pill blue">預約編號 ' + privVal('car:booking') + '</span></div>' +
        '<div class="pickret">' +
          '<div style="background:var(--mist-soft)"><div class="tiny" style="color:#4E6E80">取車</div><b>' + U.md(c.pickupDate) + ' ' + (has(c.pickupTime) ? esc(c.pickupTime) : '') + '</b><div class="tiny muted">' + v(c.pickupPlace) + '</div></div>' +
          '<div style="background:var(--peach-soft)"><div class="tiny" style="color:#8A5A3C">還車</div><b>' + U.md(c.returnDate) + ' ' + (has(c.returnTime) ? esc(c.returnTime) : '') + '</b><div class="tiny muted">' + v(c.returnPlace) + '</div></div>' +
        '</div>' +
        '<dl class="kv">' + rows.map(function (r) { return '<dt>' + r[0] + '</dt><dd>' + r[1] + '</dd>'; }).join('') + '</dl>' +
        '<div class="btn-row">' +
          (q ? '<a class="btn btn-primary" href="' + esc(U.dirUrl(q)) + '" target="_blank" rel="noopener">' + ic('nav', 16) + '導航至租車店</a>' : '<span class="btn disabled">' + ic('nav', 16) + '導航（地址待補）</span>') +
          (App.priv('car:phone') ? '<a class="btn" href="tel:' + esc(App.priv('car:phone')) + '">' + ic('phone', 16) + '撥打電話</a>' : '') +
        '</div>' +
        '<div class="btn-row">' +
          '<button class="btn btn-sm" data-priv="car:booking" data-label="租車預約編號">' + ic('lock', 14) + '預約編號</button>' +
          '<button class="btn btn-sm" data-priv="car:phone" data-label="租車公司電話">' + ic('lock', 14) + '租車電話</button>' +
        '</div>' +
      '</article>' +
      (has(c.pickupFlow) || has(c.returnFlow) ? '<article class="card card-pad small"><b>取車流程</b><p style="margin:4px 0 10px">' + v(c.pickupFlow) + '</p><b>還車流程</b><p style="margin:4px 0 0">' + v(c.returnFlow) + '</p></article>' : '') +
      '<article class="card card-pad">' + checklist('p', PICK, '取車檢查清單') + '<div style="height:14px"></div>' + checklist('r', RET, '還車檢查清單') + '</article>' +
      '<article class="card card-pad" style="background:var(--mist-soft);border:0"><h3 style="font-size:16px;margin-bottom:6px">日本自駕提醒</h3><ul style="margin:0;padding-left:18px;font-size:14px;line-height:1.8">' +
        T.drivingTips.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
        '<a class="btn btn-sm btn-outline" style="margin-top:10px" href="#/tools/emergency">' + ic('sos', 14) + '事故・緊急聯絡</a></article>' +
    '</div>';
  }

  function routeDayIndex() { var r = S.get('route.day', null); return r == null ? App.selectedDay() : r; }

  function route() {
    var idx = routeDayIndex(), day = T.days[idx];
    var stops = day.itinerary.filter(function (it) { return it.navigable; });
    var a = App.accommodation(day.accommodationId);
    var points = stops.map(App.placeQuery).filter(Boolean);
    var full = points.length ? U.routeUrl(points) : '';
    var n = Math.max(stops.length, 1);
    var dots = stops.map(function (s, i) {
      var x = 30 + (n === 1 ? 140 : i * (280 / (n - 1))), y = 150 - (n === 1 ? 60 : i * (110 / (n - 1))) + (i % 2 ? 18 : 0);
      return { x: x, y: y };
    });
    var path = dots.map(function (d, i) { return (i ? 'L' : 'M') + d.x + ' ' + d.y; }).join(' ');
    return '<div class="chips" style="margin-bottom:12px">' + T.days.map(function (d, i) {
        return '<button class="chip" data-rday="' + i + '" aria-pressed="' + (i === idx) + '">Day ' + d.day + ' <span class="count">' + U.md(d.date) + '</span></button>';
      }).join('') + '</div>' +
      '<div class="map-box" role="img" aria-label="Day ' + day.day + ' 路線示意圖">' +
        '<svg viewBox="0 0 340 200" preserveAspectRatio="none" aria-hidden="true"><path d="' + path + '" fill="none" stroke="#6F94A8" stroke-width="2" stroke-dasharray="5 6" stroke-linecap="round"/>' +
          dots.map(function (d, i) { return '<circle cx="' + d.x + '" cy="' + d.y + '" r="9" fill="' + (i === 0 ? '#6F94A8' : (i === dots.length - 1 ? '#536B62' : '#D9A889')) + '"/><text x="' + d.x + '" y="' + (d.y + 4) + '" text-anchor="middle" font-size="10" fill="#fff" font-weight="700">' + (i + 1) + '</text>'; }).join('') +
        '</svg>' +
        '<span class="map-note">路線示意圖（非實際比例）</span>' +
        (full ? '<a class="btn btn-dark btn-sm" href="' + esc(full) + '" target="_blank" rel="noopener">' + ic('map', 15) + 'Google Maps 開啟全程</a>' : '') +
      '</div>' +
      '<p class="small muted" style="margin:12px 0">' + (stops.length ? 'Day ' + day.day + ' · ' + U.md(day.date) + ' · 共 ' + stops.length + ' 個導航地點，依行程順序' : '這一天沒有需要開車的行程') + '</p>' +
      '<ol style="list-style:none;margin:0;padding:0">' + stops.map(function (s, i) {
        var u = App.navUrl(s);
        return '<li><div class="route-stop"><span class="n">' + (i + 1) + '</span>' +
          '<button style="flex:1;min-width:0;border:0;background:none;text-align:left;padding:6px 0" data-stop="' + esc(s.id) + '"><b style="font-size:15px">' + esc(s.name) + '</b><br><span class="tiny muted">' + (has(s.parking) ? '停車：' + esc(s.parking) : '停車資訊待補') + '</span></button>' +
          (u ? '<a class="icon-btn" href="' + esc(u) + '" target="_blank" rel="noopener" aria-label="導航到 ' + esc(s.name) + '" style="border:1px solid var(--mist);color:var(--ocean)">' + ic('nav', 18) + '</a>' : '<span class="tiny tbd" style="padding-right:8px">地址待補</span>') +
          '</div>' +
          (i < stops.length - 1 ? '<div class="route-gap">' + (has(s.driveTime) || has(s.driveDistance) ? '車程 ' + esc([s.driveTime, s.driveDistance].filter(has).join(' · ')) : '車程・距離待補') + '</div>' : '') +
          '</li>';
      }).join('') + '</ol>' +
      (a ? '<p class="small" style="margin-top:14px">今晚住宿：<b>' + (has(a.name) ? esc(a.name) : esc(a.area) + '住宿') + '</b></p>' : '');
  }

  function stays() {
    var seen = {};
    var list = [];
    T.days.forEach(function (d) {
      if (!d.accommodationId) return;
      if (!seen[d.accommodationId]) { seen[d.accommodationId] = { a: App.accommodation(d.accommodationId), dates: [] }; list.push(seen[d.accommodationId]); }
      seen[d.accommodationId].dates.push(d.date);
    });
    return '<div style="display:flex;flex-direction:column;gap:12px">' + list.map(function (x) {
      var a = x.a, q = a.mapQuery || a.address || a.name;
      return '<article class="card card-pad" style="display:flex;flex-direction:column;gap:8px">' +
        '<div style="display:flex;justify-content:space-between;gap:8px"><h3 style="font-size:17px">' + (has(a.name) ? esc(a.name) : esc(a.area) + '住宿 <span class="tbd small">名稱待補</span>') + '</h3>' +
        '<span class="pill blue">' + x.dates.length + ' 晚</span></div>' +
        '<span class="small muted">' + U.md(x.dates[0]) + ' 入住 · ' + x.dates.map(U.md).join('、') + '</span>' +
        '<dl class="kv small"><dt>Check-in</dt><dd>' + v(a.checkIn) + '</dd><dt>Check-out</dt><dd>' + v(a.checkOut) + '</dd><dt>地址</dt><dd>' + v(a.address) + '</dd>' +
        '<dt>訂房編號</dt><dd>' + privVal('stay:' + a.id) + ' ' + privBtn('stay:' + a.id, (a.name || a.area + '住宿') + ' 訂房編號') + '</dd></dl>' +
        (q ? '<a class="btn btn-sm btn-outline" href="' + esc(U.dirUrl(q)) + '" target="_blank" rel="noopener">' + ic('nav', 14) + '導航</a>' : '') +
        '</article>';
    }).join('') + '</div>';
  }

  App.register('transport', {
    render: function (p) {
      var tab = TABS.some(function (t) { return t[0] === p[0]; }) ? p[0] : 'flights';
      var body = tab === 'flights' ? '<div style="display:flex;flex-direction:column;gap:16px">' + ticket(T.flights.outbound, 'outbound') + ticket(T.flights['return'], 'return') + '</div>'
        : tab === 'car' ? car() : tab === 'route' ? route() : stays();
      return '<header class="page-head"><div><span class="deco">Getting Around</span><h1>交通</h1></div></header>' +
        '<div class="section"><div class="seg" role="tablist">' + TABS.map(function (t) {
          return '<button role="tab" aria-selected="' + (t[0] === tab) + '" data-tab="' + t[0] + '">' + t[1] + '</button>';
        }).join('') + '</div></div>' +
        '<div class="section">' + body + '</div>';
    },
    bind: function (root) {
      var chips = root.querySelector('.chips [aria-pressed="true"]');
      if (chips) chips.parentNode.scrollLeft = chips.offsetLeft - 40;
      root.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        if (b.dataset.tab) App.go('transport/' + b.dataset.tab);
        else if (b.dataset.check) { S.update('car.check', {}, function (c) { c[b.dataset.check] = !c[b.dataset.check]; }); App.rerender(); }
        else if (b.dataset.rday) { S.set('route.day', +b.dataset.rday); App.rerender(); }
        else if (b.dataset.priv) App.editPrivate(b.dataset.priv, b.dataset.label);
        else if (b.dataset.stop) showStop(b.dataset.stop);
      });
    }
  });

  function showStop(id) {
    var it = null; T.days.forEach(function (d) { d.itinerary.forEach(function (x) { if (x.id === id) it = x; }); });
    if (!it) return;
    var u = App.navUrl(it);
    U.openSheet(it.name, '<p class="muted small" style="margin-top:0">' + esc(it.description) + '</p>' +
      '<dl class="kv"><dt>地址</dt><dd>' + v(it.address) + '</dd><dt>停車場</dt><dd>' + v(it.parking) + '</dd><dt>停車費</dt><dd>' + v(it.parkingFee) + '</dd>' +
      '<dt>營業時間</dt><dd>' + v(it.hours) + '</dd><dt>建議停留</dt><dd>' + v(it.duration) + '</dd></dl>' +
      (u ? '<a class="btn btn-primary btn-block" style="margin-top:14px" href="' + esc(u) + '" target="_blank" rel="noopener">' + ic('nav', 16) + '開啟 Google Maps 導航</a>' : ''));
  }
})();
