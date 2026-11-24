/* Memories：印章、每日日記、拍立得照片牆、旅程回顧 */
(function () {
  'use strict';
  var T = TRIP, U = UI, S = Store, ic = U.icon, esc = U.esc, has = U.has;
  var CN = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
  var MOODS = ['開心', '浪漫', '放鬆', '感動', '累但滿足', '好吃到哭'];

  function photos() { return S.get('photos', []); }
  function journal(n) { return S.get('journal', {})[n] || {}; }
  function saveJournal(n, patch) { S.update('journal', {}, function (j) { j[n] = Object.assign({}, j[n] || {}, patch, { updatedAt: new Date().toISOString() }); }); }
  function hasJournal(n) { var j = journal(n); return ['text', 'favPlace', 'memorable', 'food', 'jimmy', 'shenny'].some(function (k) { return has(j[k]); }); }

  function polaroid(p) {
    var d = T.days[p.day - 1];
    var cap = has(p.caption) ? p.caption : ('Day ' + p.day + (has(p.place) ? ' · ' + p.place : ''));
    return '<button class="polaroid" data-photo-open="' + p.id + '" aria-label="放大照片：' + esc(cap) + '">' +
      '<div class="ph"><img data-photo="' + p.id + '" alt="' + esc(cap) + '" loading="lazy"></div>' +
      '<figcaption>' + esc(cap) + '<br><span style="font-size:13px;color:var(--ink-3)">' + (d ? U.md(d.date) : '') + '</span></figcaption></button>';
  }
  function loadImages(root) {
    root.querySelectorAll('img[data-photo]').forEach(function (img) {
      S.getPhotoUrl(img.getAttribute('data-photo')).then(function (u) { if (u) img.src = u; }).catch(function () {});
    });
  }

  function stampsHtml() {
    return '<div class="stamps">' + T.stamps.map(function (name, i) {
      var on = App.stampOn(i);
      return '<button class="stamp' + (on ? ' on' : '') + '" data-stamp="' + i + '" aria-pressed="' + on + '" aria-label="Day ' + (i + 1) + ' 印章：' + esc(name) + (on ? '（已解鎖）' : '（未解鎖）') + '">' +
        '<span class="t">DAY ' + (i + 1) + '</span><span class="n">' + esc(name) + '</span></button>';
    }).join('') + '</div>';
  }

  function hub() {
    var ph = photos(), stampsN = T.stamps.filter(function (x, i) { return App.stampOn(i); }).length;
    var journals = T.days.filter(function (d) { return hasJournal(d.day); }).length;
    var status = App.tripStatus();
    return '<header class="mem-hero"><span class="hand" style="font-size:21px">Honeymoon Memories</span><h1>蜜月回憶</h1>' +
        '<span class="small muted">沖繩' + CN[T.days.length] + '日 · ' + T.days.length + ' Days in Okinawa · ' + U.dotDate(T.startDate) + ' – ' + U.md(T.endDate).replace('/', '.') + '</span>' +
        '<svg width="120" height="10" viewBox="0 0 120 10" fill="none" stroke="#AFC8D8" stroke-width="1.5" aria-hidden="true" style="margin-top:6px"><path d="M0 5 Q 10 0 20 5 T 40 5 T 60 5 T 80 5 T 100 5 T 120 5"/></svg></header>' +
      '<div class="section"><div class="stat-row"><div class="stat"><b>' + ph.length + '</b><span>張照片</span></div>' +
        '<div class="stat"><b>' + journals + ' / ' + T.days.length + '</b><span>篇日記</span></div><div class="stat"><b>' + stampsN + ' / ' + T.stamps.length + '</b><span>旅程完成度</span></div></div></div>' +
      '<section class="section"><article class="card card-pad"><div class="section-title"><h2 style="font-size:17px">旅行印章</h2><span class="tiny muted">當天行程全部完成就會蓋章</span></div>' + stampsHtml() + '</article></section>' +
      '<section class="section"><div class="section-title"><h2 style="font-size:17px">每日回憶</h2><span class="hand">Daily Journal</span></div><div class="day-list">' +
        T.days.map(function (d) {
          var n = photos().filter(function (p) { return p.day === d.day; }).length, j = journal(d.day);
          return '<a class="day-card" href="#/memories/day/' + d.day + '" style="text-decoration:none"><span class="hand">Day ' + d.day + ' · ' + U.md(d.date) + '</span>' +
            '<b style="font-size:14px;line-height:1.4">' + esc(d.theme) + '</b>' +
            '<span class="tiny muted">' + n + ' 張照片' + (hasJournal(d.day) ? ' · 已寫日記' : '') + (has(j.mood) ? ' · ' + esc(j.mood) : '') + '</span></a>';
        }).join('') + '</div></section>' +
      '<section class="section"><div class="section-title"><h2 style="font-size:17px">拍立得照片牆</h2>' +
        '<label class="btn btn-sm btn-outline" style="cursor:pointer">' + ic('plus', 14) + '新增照片<input type="file" accept="image/*" multiple class="sr-only" data-upload="' + T.days[App.selectedDay()].day + '"></label></div>' +
        (ph.length ? '<div class="polaroids">' + ph.map(polaroid).join('') + '</div>' : '<div class="empty">還沒有照片。新增的照片會放在目前首頁選取的那一天（Day ' + T.days[App.selectedDay()].day + '），之後可以修改。</div>') + '</section>' +
      '<section class="section"><a class="recap" href="#/memories/recap" style="text-decoration:none"><span><span class="hand" style="color:#E8C9B4">' + T.days.length + ' Days Recap</span><br><b style="font-family:var(--serif);font-size:17px">' + CN[T.days.length] + '日旅程回顧</b><br>' +
        '<span class="tiny" style="opacity:.85">' + (status === 'after' ? '旅程結束了，回顧已完成' : '旅程結束後會自動整理，現在也可以先預覽') + '</span></span>' + ic('right', 26) + '</a></section>';
  }

  function dayPage(n) {
    var d = T.days[n - 1]; if (!d) return hub();
    var j = journal(n), ph = photos().filter(function (p) { return p.day === n; }), on = App.stampOn(n - 1), prog = App.dayProgress(d);
    function field(key, label, ph2, rows) {
      return '<label class="field"><span>' + label + '</span>' + (rows ? '<textarea data-j="' + key + '" rows="' + rows + '" placeholder="' + esc(ph2) + '">' + esc(j[key] || '') + '</textarea>'
        : '<input data-j="' + key + '" value="' + esc(j[key] || '') + '" placeholder="' + esc(ph2) + '">') + '</label>';
    }
    return '<header class="page-head" style="flex-direction:column;align-items:flex-start;gap:0"><a class="tool-back" href="#/memories">' + ic('left', 16) + '蜜月回憶</a>' +
        '<div><span class="hand">Day ' + d.day + ' · ' + U.dotDate(d.date) + ' · ' + esc(d.weekday) + '</span><h1 style="font-size:22px">' + esc(d.theme) + '</h1></div></header>' +
      '<div class="section" style="display:flex;align-items:center;gap:12px">' +
        '<button class="stamp' + (on ? ' on' : '') + '" data-stamp="' + (n - 1) + '" aria-pressed="' + on + '" style="width:72px;flex:none"><span class="t">DAY ' + n + '</span><span class="n">' + esc(T.stamps[n - 1]) + '</span></button>' +
        '<span class="small muted">' + (on ? '今日印章已解鎖' : '行程完成 ' + prog.done + '/' + prog.total + '，全部完成就會自動蓋章；也可以點印章手動蓋') + '</span></div>' +
      '<section class="section"><div class="section-title"><h2 style="font-size:17px">今日照片</h2>' +
        '<label class="btn btn-sm btn-outline" style="cursor:pointer">' + ic('camera', 14) + '新增照片<input type="file" accept="image/*" multiple class="sr-only" data-upload="' + n + '"></label></div>' +
        (ph.length ? '<div class="polaroids">' + ph.map(polaroid).join('') + '</div>' : '<div class="empty">還沒有這一天的照片</div>') + '</section>' +
      '<section class="section"><article class="card card-pad form">' +
        '<div class="field"><span>今日心情</span><div class="chips" style="margin:0;padding:2px 0 4px">' + MOODS.map(function (m) {
          return '<button class="chip" data-mood="' + esc(m) + '" aria-pressed="' + (j.mood === m) + '">' + esc(m) + '</button>'; }).join('') + '</div></div>' +
        field('text', '今日旅行日記', '寫下今天的故事…', 6) +
        field('favPlace', '今天最喜歡的地方', '例如：瀨長島的夕陽') +
        field('memorable', '今天最難忘的事', '', 2) +
        field('food', '今天吃到的美食', '') +
        field('location', '地點', d.area || '') +
        field('video', '影片連結', '例如 Google 相簿或 YouTube 不公開影片的連結') +
        (has(j.video) ? '<a class="btn btn-sm btn-outline" href="' + esc(j.video) + '" target="_blank" rel="noopener">開啟影片</a>' : '') +
        '<div class="msg-box"><label class="field"><span class="hand" style="color:var(--ocean);font-size:18px">Jimmy 的留言</span><textarea data-j="jimmy" rows="2" placeholder="Jimmy 想說…">' + esc(j.jimmy || '') + '</textarea></label></div>' +
        '<div class="msg-box peach"><label class="field"><span class="hand" style="color:#B5815F;font-size:18px">Shenny 的留言</span><textarea data-j="shenny" rows="2" placeholder="Shenny 想說…">' + esc(j.shenny || '') + '</textarea></label></div>' +
        '<span class="tiny muted" id="j-saved">' + (j.updatedAt ? '已自動儲存 · ' + App.fmtTime(j.updatedAt) : '輸入後會自動儲存') + '</span>' +
      '</article></section>' +
      '<div class="section btn-row">' +
        (n > 1 ? '<a class="btn" href="#/memories/day/' + (n - 1) + '">' + ic('left', 16) + 'Day ' + (n - 1) + '</a>' : '') +
        (n < T.days.length ? '<a class="btn" href="#/memories/day/' + (n + 1) + '">Day ' + (n + 1) + ic('right', 16) + '</a>' : '') + '</div>';
  }

  function recap() {
    var ph = photos(), b = S.get('budget', { records: [] }), r = Number(App.fx().rate) || 0, spent = 0, uncounted = 0;
    b.records.forEach(function (x) { if (x.currency === 'TWD') spent += Number(x.amount) || 0; else if (r) spent += (Number(x.amount) || 0) * r; else uncounted++; });
    var favs = T.days.map(function (d) { return journal(d.day); });
    function pick(k) { return favs.map(function (j, i) { return has(j[k]) ? '<li><b>Day ' + (i + 1) + '</b> ' + esc(j[k]) + '</li>' : ''; }).join(''); }
    var status = App.tripStatus();
    return '<header class="page-head" style="flex-direction:column;align-items:flex-start;gap:0"><a class="tool-back" href="#/memories">' + ic('left', 16) + '蜜月回憶</a>' +
        '<div><span class="hand">' + T.days.length + ' Days Recap</span><h1>' + CN[T.days.length] + '日旅程回顧</h1></div></header>' +
      (status !== 'after' ? '<div class="section"><div class="empty" style="text-align:left">旅程還沒結束，這是目前為止的預覽。回來之後打開，就是完整的回顧。</div></div>' : '') +
      '<div class="section"><div class="stat-row"><div class="stat"><b>' + ph.length + '</b><span>張照片</span></div>' +
        '<div class="stat"><b>' + T.stamps.filter(function (x, i) { return App.stampOn(i); }).length + '</b><span>枚印章</span></div>' +
        '<div class="stat"><b>' + (b.records.length ? U.money(spent, 'TWD') : '—') + '</b><span>總花費' + (uncounted ? '*' : '') + '</span></div></div>' +
        (uncounted ? '<p class="tiny muted">* 有 ' + uncounted + ' 筆日幣花費因為沒設定匯率而未計入</p>' : '') + '</div>' +
      '<section class="section"><article class="card card-pad">' + T.days.map(function (d) {
        var dp = ph.filter(function (p) { return p.day === d.day; }).slice(0, 3);
        var places = d.itinerary.filter(function (it) { return it.category === 'sight' || it.category === 'shopping'; }).map(function (it) { return it.name; });
        var foods = App.restaurants().filter(function (rr) { return Number(rr.day) === d.day; }).map(function (rr) { return rr.name; });
        var on = App.stampOn(d.day - 1), j = journal(d.day);
        return '<div class="recap-day"><div class="stamp' + (on ? ' on' : '') + '" aria-hidden="true" style="width:52px"><span class="t">DAY ' + d.day + '</span><span class="n" style="font-size:10px">' + esc(T.stamps[d.day - 1]) + '</span></div>' +
          '<div><b>' + esc(d.theme) + '</b> <span class="tiny muted">' + U.md(d.date) + '</span>' +
          (places.length ? '<div class="small">景點：' + esc(places.join('、')) + '</div>' : '') +
          (foods.length ? '<div class="small">美食：' + esc(foods.join('、')) + '</div>' : '') +
          (has(j.memorable) ? '<div class="small" style="color:#8A5A3C">' + esc(j.memorable) + '</div>' : '') +
          (dp.length ? '<div style="display:flex;gap:6px;margin-top:6px">' + dp.map(function (p) { return '<img data-photo="' + p.id + '" alt="" style="width:64px;height:64px;object-fit:cover;border-radius:6px;background:var(--mist-soft)">'; }).join('') + '</div>' : '') +
          '</div></div>';
      }).join('') + '</article></section>' +
      '<section class="section"><article class="card card-pad"><h3 style="font-size:16px">最喜歡的地方</h3><ul class="small" style="padding-left:18px">' + (pick('favPlace') || '<li class="tbd">還沒寫</li>') + '</ul>' +
        '<h3 style="font-size:16px">最喜歡的美食</h3><ul class="small" style="padding-left:18px">' + (pick('food') || '<li class="tbd">還沒寫</li>') + '</ul>' +
        '<h3 style="font-size:16px">最難忘的回憶</h3><ul class="small" style="padding-left:18px;margin-bottom:0">' + (pick('memorable') || '<li class="tbd">還沒寫</li>') + '</ul></article></section>';
  }

  function upload(files, day) {
    files = Array.prototype.slice.call(files || []);
    if (!files.length) return;
    U.toast('照片處理中…');
    var done = 0;
    files.reduce(function (p, f) {
      return p.then(function () {
        return S.compressImage(f).then(function (blob) {
          var id = S.uid('ph');
          return S.putPhoto(id, blob).then(function () {
            S.update('photos', [], function (l) { l.push({ id: id, day: day, caption: '', place: '', createdAt: new Date().toISOString() }); });
            done++;
          });
        });
      });
    }, Promise.resolve()).then(function () { U.toast('已新增 ' + done + ' 張照片'); App.rerender(); })
      .catch(function (e) { U.toast('照片儲存失敗：' + e.message); App.rerender(); });
  }

  function openPhoto(id) {
    var list = photos(), i = list.findIndex(function (p) { return p.id === id; }), p = list[i]; if (!p) return;
    var root = U.openSheet('Day ' + p.day + ' 的照片',
      '<div class="lightbox"><img id="lb-img" alt=""></div>' +
      '<form class="form" style="margin-top:12px" id="ph-form">' +
        '<label class="field"><span>短句</span><input name="caption" value="' + esc(p.caption) + '" placeholder="寫一句話…"></label>' +
        '<label class="field"><span>地點</span><input name="place" value="' + esc(p.place) + '"></label>' +
        '<label class="field"><span>日期</span><select name="day">' + T.days.map(function (d) { return '<option value="' + d.day + '"' + (d.day === p.day ? ' selected' : '') + '>Day ' + d.day + '（' + U.md(d.date) + '）</option>'; }).join('') + '</select></label>' +
        '<div class="btn-row"><button type="button" class="btn" data-move="-1"' + (i === 0 ? ' disabled' : '') + '>' + ic('left', 16) + '往前</button>' +
          '<button type="button" class="btn" data-move="1"' + (i === list.length - 1 ? ' disabled' : '') + '>往後' + ic('right', 16) + '</button></div>' +
        '<div class="form-actions"><button type="button" class="btn btn-danger" data-delphoto>' + ic('trash', 16) + '刪除</button><button class="btn btn-primary" type="submit">儲存</button></div>' +
      '</form>', { wide: true });
    S.getPhotoUrl(id).then(function (u) { var im = root.querySelector('#lb-img'); if (im && u) { im.src = u; im.alt = p.caption || ''; } });
    var form = root.querySelector('#ph-form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      S.update('photos', [], function (l) { l.forEach(function (x) { if (x.id === id) { x.caption = form.elements.caption.value.trim(); x.place = form.elements.place.value.trim(); x.day = Number(form.elements.day.value); } }); });
      U.closeSheet(); App.rerender();
    });
    root.querySelectorAll('[data-move]').forEach(function (b) {
      b.addEventListener('click', function () {
        var dir = Number(b.dataset.move);
        S.update('photos', [], function (l) { var k = l.findIndex(function (x) { return x.id === id; }), t = k + dir; if (t < 0 || t >= l.length) return; var tmp = l[k]; l[k] = l[t]; l[t] = tmp; });
        U.closeSheet(); App.rerender(); U.toast('已調整順序');
      });
    });
    root.querySelector('[data-delphoto]').addEventListener('click', function () {
      if (!confirm('確定要刪除這張照片嗎？刪除後無法復原。')) return;
      S.deletePhoto(id).then(function () { S.update('photos', [], function (l) { return l.filter(function (x) { return x.id !== id; }); }); U.closeSheet(); App.rerender(); U.toast('已刪除'); });
    });
  }

  var saveTimer;
  App.register('memories', {
    render: function (p) {
      if (p[0] === 'day') return dayPage(Number(p[1]) || 1);
      if (p[0] === 'recap') return recap();
      return hub();
    },
    bind: function (root, p) {
      loadImages(root);
      root.querySelectorAll('input[data-upload]').forEach(function (inp) {
        inp.addEventListener('change', function () { upload(inp.files, Number(inp.dataset.upload)); inp.value = ''; });
      });
      var dayN = p[0] === 'day' ? Number(p[1]) || 1 : 0;
      root.querySelectorAll('[data-j]').forEach(function (el) {
        el.addEventListener('input', function () {
          clearTimeout(saveTimer);
          saveTimer = setTimeout(function () {
            var patch = {}; patch[el.dataset.j] = el.value; saveJournal(dayN, patch);
            var s = root.querySelector('#j-saved'); if (s) s.textContent = '已自動儲存 · ' + App.fmtTime(new Date().toISOString());
          }, 500);
        });
      });
      function flush() {
        clearTimeout(saveTimer);
        if (!dayN) return;
        var patch = {}; root.querySelectorAll('[data-j]').forEach(function (el) { patch[el.dataset.j] = el.value; });
        if (Object.keys(patch).length) saveJournal(dayN, patch);
      }
      root.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        if (b.dataset.stamp !== undefined || b.dataset.mood) flush();
        if (b.dataset.stamp !== undefined) {
          var i = Number(b.dataset.stamp), on = App.stampOn(i);
          S.update('stamps', {}, function (s) { s[i] = !on; });
          U.toast(on ? '已收回印章' : 'Day ' + (i + 1) + ' 印章蓋好了！'); App.rerender();
        }
        else if (b.dataset.mood) { var j = journal(dayN); saveJournal(dayN, { mood: j.mood === b.dataset.mood ? '' : b.dataset.mood }); App.rerender(); }
        else if (b.dataset.photoOpen) openPhoto(b.dataset.photoOpen);
      });
    }
  });
})();
