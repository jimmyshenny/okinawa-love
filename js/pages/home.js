/* Home：今日主題 → 日期列 → 旅遊資訊 → 下一站 → 今日行程 → 今日住宿 */
(function () {
  'use strict';
  var T = TRIP, U = UI, S = Store, ic = U.icon, esc = U.esc, v = U.v, has = U.has;
  var open = {};           // 展開中的行程卡片
  var CAT = {
    transport: ['交通', 'blue'], sight: ['景點', 'green'], food: ['餐廳', 'peach'],
    stay: ['住宿', 'sand'], shopping: ['購物', 'plum'], rest: ['休息', 'blue']
  };

  function pad2(n) { return n < 10 ? '0' + n : '' + n; }

  function header(day) {
    var w = App.weather(day);
    var wTxt = has(w.status) ? esc(w.status) : '天氣待更新';
    return '<header class="today-head">' +
      '<div style="min-width:0;display:flex;flex-direction:column;gap:3px">' +
        '<span class="deco">' + esc(T.subtitle) + '</span>' +
        '<h1>Day ' + pad2(day.day) + ' · ' + esc(day.theme) + '</h1>' +
        '<span class="small muted">' + U.dotDate(day.date) + ' · ' + esc(day.weekday) + (day.area ? ' · ' + esc(day.area) : '') + '</span>' +
      '</div>' +
      '<a class="weather-mini" href="#/tools/weather" aria-label="天氣：' + wTxt + '">' + ic(App.weatherIcon(w), 22) +
        '<span>' + wTxt + '</span><b>' + (has(w.temp) ? esc(w.temp) : '--°') + '</b>' +
        (has(w.rain) ? '<span>降雨 ' + esc(w.rain) + '</span>' : '') + '</a>' +
    '</header>';
  }

  function dateStrip(sel) {
    var today = U.todayISO();
    return '<nav class="date-strip" aria-label="選擇日期">' + T.days.map(function (d, i) {
      var p = d.date.split('-');
      return '<button class="date-chip' + (d.date === today ? ' today' : '') + '" data-day="' + i + '" aria-pressed="' + (i === sel) + '"' +
        (d.date === today ? ' aria-label="Day ' + d.day + '（今天）"' : '') + '>' +
        '<span class="d">Day ' + d.day + '</span><span class="m">' + p[1] + '/' + p[2] + '</span><span class="w">' + d.weekday.replace('星期', '週') + '</span></button>';
    }).join('') + '</nav>';
  }

  // 出發前待辦提醒：到了提醒日期、還沒打勾的才會出現
  function todoBanner() {
    var today = U.todayISO(), done = S.get('todo.done', {});
    var due = (T.todos || []).filter(function (t) { return t.date <= today && !done[t.id]; })
      .sort(function (a, b) { return a.date < b.date ? -1 : 1; })
      .map(function (t) { return t.title; });
    App.restaurants().forEach(function (r) {
      if (r.needReservation && r.reserveOn && r.reserveOn <= today && r.status !== 'reserved' && r.status !== 'visited') due.push('訂位：' + r.name + '（開放訂位了）');
    });
    if (!due.length) return '';
    return '<a href="#/tools/bookings" class="card card-pad" style="display:flex;gap:10px;align-items:center;margin:0 var(--page-pad) 14px;text-decoration:none;border-left:4px solid #E8A87C">' +
      ic('info', 20) + '<span style="flex:1"><b>待辦提醒</b><br><span class="small">' + due.map(esc).join('<br>') + '</span></span>' + ic('right', 16) + '</a>';
  }

  function travelInfo() {
    var isOpen = S.get('home.infoOpen', false);
    return '<section class="collapse">' +
      '<button data-act="info" aria-expanded="' + isOpen + '" aria-controls="travel-info">' +
        '<span style="display:flex;align-items:center;gap:8px;font-size:14px;font-weight:500">' + ic('info', 18) + '旅遊資訊 <span class="deco" style="color:#8A9599;font-size:14px">Travel Info</span></span>' +
        ic('chevron', 18) + '</button>' +
      (isOpen ? '<div class="collapse-body" id="travel-info">' +
        '<a class="quick-link" href="#/transport/flights">航班資訊 ' + ic('right', 16) + '</a>' +
        '<a class="quick-link" href="#/transport/car">租車資訊 ' + ic('right', 16) + '</a>' +
        '<a class="quick-link" href="#/transport/stays">住宿總覽 ' + ic('right', 16) + '</a>' +
        '<a class="quick-link" href="#/tools/bookings">重要預約 ' + ic('right', 16) + '</a>' +
        '<a class="quick-link warn" href="#/tools/emergency">緊急資訊 · 警察 110 / 救護車 119 ' + ic('right', 16) + '</a>' +
      '</div>' : '') +
    '</section>';
  }

  function nextStopCard(day) {
    var ns = App.nextStop(day);
    if (!ns) return '';
    if (!ns.item) return '<section class="next-stop done">' + ic('check', 24) +
      '<div class="grow"><span class="label">今日行程</span><span class="name">全部完成了！</span><span class="sub">今天的印章已解鎖，去回憶頁寫日記吧</span></div>' +
      '<a class="btn btn-dark" href="#/memories/day/' + day.day + '">寫日記</a></section>';
    var it = ns.item, url = it.navigable ? App.navUrl(it) : '';
    var sub = [];
    if (has(it.time)) sub.push('預計 ' + esc(it.time));
    if (ns.index > 0 && has(day.itinerary[ns.index - 1].driveTime)) sub.push('車程 ' + esc(day.itinerary[ns.index - 1].driveTime));
    if (ns.late) sub.push('已超過預計時間，到了記得按「完成」');
    if (!sub.length) sub.push(ns.label === '當日第一站' ? '這天的第一個行程' : '完成目前這站後會自動更新');
    return '<section class="next-stop" aria-live="polite">' +
      '<div class="grow"><span class="label">' + esc(ns.label) + ' <span class="deco" style="font-size:13px;color:inherit">Next Stop</span></span>' +
      '<span class="name">' + esc(it.name) + '</span><span class="sub">' + sub.join(' · ') + '</span></div>' +
      (url ? '<a class="btn btn-dark" href="' + esc(url) + '" target="_blank" rel="noopener">' + ic('nav', 16) + '導航</a>' : '') +
    '</section>';
  }

  function detailRows(it) {
    var isFood = !!it.restaurantId;
    var r = isFood ? App.restaurant(it.restaurantId) : (it.stayId ? App.accommodation(it.stayId) : null);
    var R = r || {};
    function pick(a, b) { return has(a) ? a : (has(b) ? b : ''); }
    var addr = [pick(it.address, R.address), it.addressEn].filter(has);
    var park = pick(it.parking, R.parking);
    var rows = [
      ['地址', addr.length ? addr.map(function (x, i) { return i ? '<span class="muted">' + esc(x) + '</span>' : esc(x); }).join('<br>') : ''],
      ['Check-in', it.stayId ? pick(R.checkIn && R.checkOut ? R.checkIn + '（退房 ' + R.checkOut + '）' : '', '') : ''],
      ['營業時間', pick(it.hours, R.hours)],
      ['價格', isFood ? R.price : ''],
      ['推薦', isFood ? R.recommend : ''],
      ['門票', it.ticket],
      ['停車', park ? park + (has(it.parkingFee) ? '（' + it.parkingFee + '）' : '') : ''],
      [it.needTicket ? '購票' : '預約', pick(it.reservation, R.reservationInfo)],
      ['電話', pick(it.phone, R.phone)],
      ['建議停留', it.duration],
      ['介紹', isFood ? R.description : '']
    ].filter(function (x) { return has(x[1]); }).map(function (x) {
      return [x[0], x[0] === '地址' ? x[1] : x[0] === '電話' ? '<a href="tel:' + esc(x[1]) + '">' + esc(x[1]) + '</a>' : esc(x[1])];
    });
    var BR = it.baggageTips && T.travelGuide && T.travelGuide.baggageRules;
    if (BR) {
      var li = function (arr) { return arr.map(function (x) { return '• ' + esc(x); }).join('<br>'); };
      rows.push(['只能手提', li(BR.carryOnOnly)]);
      rows.push(['要放托運', li(BR.checkedOnly) + '<br><span class="muted">' + esc(BR.carryOnLiquids) + '</span>']);
      if (it.baggageTips === 'return') rows.push(['不能帶回台灣', li(BR.bringBackBanned)]);
    }
    if (it.nearby && it.nearby.length) rows.push(['附近也想去', it.nearby.map(function (n) {
      return '<div style="margin-bottom:8px"><a href="' + esc(U.mapsUrl(n.q || n.name, n.placeId)) + '" target="_blank" rel="noopener"><b>' + esc(n.name) + '</b></a>' + (has(n.note) ? '<br><span class="muted small">' + esc(n.note) + '</span>' : '') + '</div>';
    }).join('')]);
    var notes = [it.notes, R.notes].filter(has);
    var fmt = function (t) {
      var ls = String(t).split('\n').filter(function (x) { return x.trim(); });
      if (ls.length < 2) return esc(t);
      return ls.map(function (x) { return x.charAt(0) === '#' ? '<b>' + esc(x.replace(/^#+\s*/, '')) + '</b>' : '• ' + esc(x); }).join('<br>');
    };
    if (notes.length) rows.push(['注意事項', notes.map(fmt).join('<br>')]);
    return (rows.length ? '<dl class="kv">' + rows.map(function (x) { return '<dt>' + x[0] + '</dt><dd>' + x[1] + '</dd>'; }).join('') + '</dl>'
        : '<p class="small muted" style="margin:0">這一站還沒有詳細資料。</p>') +
      (it.photos && it.photos.length ? '<div class="tl-photos">' + it.photos.map(function (p) { return '<img src="' + esc(p) + '" alt="' + esc(it.name) + '" loading="lazy">'; }).join('') + '</div>' : '') +
      (has(it.link) ? '<a class="btn btn-sm btn-primary" style="margin-top:10px;margin-right:6px" href="' + esc(it.link) + '" target="_blank" rel="noopener">' + ic('globe', 15) + esc(it.linkLabel || '開啟連結') + '</a>' : '') +
      (isFood && r ? '<a class="btn btn-sm btn-outline" style="margin-top:10px" href="#/food/r/' + encodeURIComponent(r.id) + '">' + ic('food', 15) + '餐廳資訊・菜單</a>' : '');
  }

  function timeline(day) {
    if (!day.itinerary.length) return '<div class="empty">這一天的行程還沒排好，之後在 data.js 補上就會出現在這裡。</div>';
    var ns = App.nextStop(day), nextIdx = ns && App.isToday(day) && ns.item ? ns.index : -1;
    return '<ol class="timeline">' + day.itinerary.map(function (it, i) {
      var done = App.isDone(it.id), isOpen = !!open[it.id], cat = CAT[it.category] || ['行程', 'sand'];
      var url = it.navigable ? App.navUrl(it) : '', mapU = it.navigable ? App.mapUrl(it) : '';
      var r = it.restaurantId ? App.restaurant(it.restaurantId) : null;
      var needRes = r && r.needReservation && r.status !== 'reserved';
      return '<li class="tl-item' + (done ? ' is-done' : '') + (i === nextIdx ? ' is-next' : '') + '">' +
        '<div class="tl-rail"><span class="tl-dot">' + (done ? ic('check', 14) : (i + 1)) + '</span><span class="tl-line"></span></div>' +
        '<div style="flex:1;min-width:0">' +
        '<article class="tl-card">' +
          '<button class="tl-toggle" data-open="' + esc(it.id) + '" aria-expanded="' + isOpen + '">' +
            '<span class="tl-meta"><span class="tl-time">' + (has(it.time) ? esc(it.time) : '') + '</span>' +
              '<span class="pill ' + cat[1] + '">' + cat[0] + '</span>' +
              (has(it.duration) ? '<span>停留 ' + esc(it.duration) + '</span>' : '') +
              (needRes ? '<span class="pill peach">需訂位</span>' : '') +
              (it.needTicket ? '<span class="pill blue">需買票</span>' : '') +
              (r && r.status === 'reserved' ? '<span class="pill green">已預約</span>' : '') + '</span>' +
            '<span class="tl-name">' + esc(it.name) + '</span>' +
            (has(it.description) ? '<span class="tl-desc">' + esc(it.description) + '</span>' : '') +
          '</button>' +
          (isOpen ? '<div class="tl-detail">' + detailRows(it) + '</div>' : '') +
          '<div class="tl-actions"><div class="left">' +
            '<button class="btn btn-sm done-btn" data-done="' + esc(it.id) + '" aria-pressed="' + done + '">' + (done ? ic('check', 14) + '已完成' : '完成') + '</button>' +
            '<button class="more-btn" data-open="' + esc(it.id) + '" aria-expanded="' + isOpen + '">' + (isOpen ? '收合' : '詳細') + ic(isOpen ? 'up' : 'chevron', 14) + '</button></div>' +
            (mapU || url ? '<div class="left">' +
              (mapU ? '<a class="round-btn" href="' + esc(mapU) + '" target="_blank" rel="noopener" aria-label="在 Google Maps 查看 ' + esc(it.name) + '">' + ic('map', 18) + '<span>地圖</span></a>' : '') +
              (url ? '<a class="round-btn primary" href="' + esc(url) + '" target="_blank" rel="noopener" aria-label="導航到 ' + esc(it.name) + '">' + ic('nav', 18) + '<span>導航</span></a>' : '') + '</div>' : '') +
          '</div>' +
        '</article>' +
        (i < day.itinerary.length - 1 && has(it.driveTime) ? '<div class="tl-drive" aria-label="到下一站車程 ' + esc(it.driveTime) + '">' + ic('car', 11) + '<span>' + esc(it.driveTime) + '</span></div>' : '') +
        '</div></li>';
    }).join('') + '</ol>';
  }

  // 住宿注意事項：「# 標題」換成小標，其他每行一點
  function stayNotes(txt) {
    if (!has(txt)) return '';
    var html = '', open = false;
    String(txt).split('\n').forEach(function (line) {
      line = line.trim(); if (!line) return;
      if (line.charAt(0) === '#') {
        if (open) html += '</ul>';
        html += '<h4>' + esc(line.replace(/^#+\s*/, '')) + '</h4><ul>'; open = true;
      } else {
        if (!open) { html += '<ul>'; open = true; }
        html += '<li>' + esc(line) + '</li>';
      }
    });
    if (open) html += '</ul>';
    return '<div class="stay-notes"><div class="stay-notes-title">注意事項</div>' + html + '</div>';
  }

  // 房間照片：左右滑動
  function roomGallery(a) {
    var ph = a.roomPhotos || [];
    if (!ph.length) return '';
    return '<div class="room-gallery-wrap"><div class="tiny muted" style="margin-bottom:6px">房間照片 · 左右滑動看 ' + ph.length + ' 張</div>' +
      '<div class="room-gallery">' + ph.map(function (p, i) {
        return '<figure><img src="' + esc(p.src) + '" alt="' + esc(p.caption || '房間照片') + '" loading="lazy">' +
          '<figcaption>' + (i + 1) + '/' + ph.length + (p.caption ? ' · ' + esc(p.caption) : '') + '</figcaption></figure>';
      }).join('') + '</div></div>';
  }

  function staySection(day, idx) {
    var a = App.accommodation(day.accommodationId);
    if (!a) return day.itinerary.length ? '<div class="empty">今晚不需要住宿，一路順風回家</div>' : '';
    var prev = idx > 0 ? T.days[idx - 1].accommodationId : '';
    var cont = prev === a.id, night = 1;
    for (var j = idx - 1; j >= 0 && T.days[j].accommodationId === a.id; j--) night++;
    var name = has(a.name) ? esc(a.name) : esc(a.area) + '住宿 <span class="tbd small">（名稱待補）</span>';
    var navU = App.navUrl(a), mapU = App.mapUrl(a);
    var booking = App.priv('stay:' + a.id);
    return '<article class="card">' +
      '<div class="stay-photo">' + (has(a.photo) ? '<img src="' + esc(a.photo) + '" alt="' + esc(a.name) + '" loading="lazy">' : '住宿照片') +
        '<span class="tag-paper">Tonight\'s Stay</span>' +
        (cont ? '<span class="pill dark" style="position:absolute;top:10px;right:12px">連住第 ' + night + ' 晚</span>' : '') + '</div>' +
      '<div class="card-pad" style="display:flex;flex-direction:column;gap:10px">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><span class="tiny muted">今日住宿 · ' + esc(a.area) + '</span>' +
          (day.stayAction ? '<a class="btn btn-sm btn-primary" style="min-height:36px;padding:0 12px;white-space:nowrap" href="' + esc(day.stayAction.url) + '" target="_blank" rel="noopener">' + ic('plane', 14) + esc(day.stayAction.label) + '</a>' : '') + '</div>' +
        '<h3 style="font-size:18px">' + name + '</h3>' +
        (cont ? '<p class="small muted" style="margin:0">和昨晚同一間，訂房資訊請見「交通 › 住宿」。</p>' + roomGallery(a) :
        '<div class="stay-times"><div>Check-in <b>' + v(a.checkIn) + '</b></div><div>Check-out <b>' + v(a.checkOut) + '</b></div></div>' +
        '<dl class="kv small"><dt>地址</dt><dd>' + v(a.address) + (has(a.addressEn) ? '<br><span class="muted">' + esc(a.addressEn) + '</span>' : '') + '</dd>' +
          '<dt>停車</dt><dd>' + v(a.parking) + '</dd>' +
          '<dt>訂房編號</dt><dd>' + (booking ? esc(booking) : '<span class="tbd">未填</span>') + ' <button class="more-btn" data-priv="stay:' + esc(a.id) + '" data-label="' + esc((a.name || a.area + '住宿') + ' 訂房編號') + '">' + ic('lock', 13) + '編輯</button></dd>' +
          '</dl>' + stayNotes(a.notes) + roomGallery(a)) +
        '<div class="btn-row">' +
          (navU ? '<a class="btn btn-primary" href="' + esc(navU) + '" target="_blank" rel="noopener">' + ic('nav', 16) + '導航</a>' : '<span class="btn disabled">' + ic('nav', 16) + '導航</span>') +
          (mapU ? '<a class="btn" href="' + esc(mapU) + '" target="_blank" rel="noopener">' + ic('map', 16) + '地圖</a>' : '') +
          (has(a.phone) ? '<a class="btn" href="tel:' + esc(a.phone) + '">' + ic('phone', 16) + '電話</a>' : '') +
          (has(a.website) ? '<a class="btn" href="' + esc(a.website) + '" target="_blank" rel="noopener">' + ic('globe', 16) + '網站</a>' : '') +
        '</div>' +
      '</div></article>';
  }

  App.register('home', {
    render: function () {
      var idx = App.selectedDay(), day = T.days[idx], prog = App.dayProgress(day);
      return header(day) + dateStrip(idx) + todoBanner() + travelInfo() +
        '<div class="home-cols"><div class="main-col">' +
        nextStopCard(day) +
        '<section class="section"><div class="section-title"><h2>今日行程</h2><span class="hand">Today\'s Journey · ' + prog.done + '/' + prog.total + '</span></div>' +
        timeline(day) + '</section></div>' +
        '<div class="side"><section class="section">' + staySection(day, idx) + '</section></div></div>';
    },
    bind: function (root) {
      var strip = root.querySelector('.date-strip');
      var sel = strip && strip.querySelector('[aria-pressed="true"]');
      if (sel) strip.scrollLeft = sel.offsetLeft - strip.clientWidth / 2 + sel.clientWidth / 2;
      root.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        if (b.dataset.day) { App.selectDay(+b.dataset.day); open = {}; App.rerender(); }
        else if (b.dataset.act === 'info') { S.set('home.infoOpen', !S.get('home.infoOpen', false)); App.rerender(); }
        else if (b.dataset.open) { open[b.dataset.open] = !open[b.dataset.open]; App.rerender(); }
        else if (b.dataset.done) {
          var on = App.toggleDone(b.dataset.done); App.rerender();
          if (on) { var d = T.days[App.selectedDay()]; U.toast(App.dayProgress(d).complete ? '今天的行程全部完成，印章解鎖！' : '已完成，下一站已更新'); }
        }
        else if (b.dataset.priv) editPrivate(b.dataset.priv, b.dataset.label);
      });
    }
  });

  function editPrivate(key, label) {
    U.form({
      title: label, submitLabel: '儲存在這支手機',
      fields: [{ name: 'value', label: label, value: App.priv(key), help: '只會存在這支手機的瀏覽器裡，不會上傳到 GitHub。' }],
      onSave: function (o) { S.update('private', {}, function (p) { if (o.value) p[key] = o.value; else delete p[key]; }); App.rerender(); }
    });
  }
  App.editPrivate = editPrivate;
})();
