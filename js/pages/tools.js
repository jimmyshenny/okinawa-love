/* Tools：工具方格在最上面，下面是匯率換算 */
(function () {
  'use strict';
  var T = TRIP, U = UI, S = Store, ic = U.icon, esc = U.esc, v = U.v, has = U.has;

  var TOOLS = [
    ['budget', '旅遊預算', '記帳與每日花費', 'wallet', '#F6E9E0'],
    ['weather', '天氣', '每日天氣與雨備', 'partly', '#E7EEF1'],
    ['packing', '行李清單', 'Jimmy・Shenny・共用', 'bag', '#E4ECE7'],
    ['shopping', '購物清單', '想買的東西', 'list', '#EEE8F0'],
    ['notes', '旅行備忘錄', '臨時資訊與提醒', 'note', '#EFEBE0'],
    ['guide', '出發準備', 'eSIM・入境・退稅・行李', 'plane', '#E4ECE7'],
    ['emergency', '緊急資訊', '110・119・保險', 'sos', '#F6E9E0'],
    ['bookings', '重要預約', '訂位・訂房一覽', 'lock', '#E7EEF1'],
    ['backup', '資料備份', '匯出・匯入', 'backup', '#EFEBE0']
  ];
  var BUDGET_CATS = ['餐飲', '購物', '交通', '門票', '住宿', '其他'];
  var PACK_CATS = ['證件', '衣物', '電子用品', '盥洗用品', '藥品', '旅行用品', '其他', '搭機規定'];
  var OWNERS = [['jimmy', 'Jimmy'], ['shenny', 'Shenny'], ['shared', '共用']];

  function rate() { var r = Number(App.fx().rate); return r > 0 ? r : 0; }
  function toTwd(amount, cur) { if (cur === 'TWD') return Number(amount) || 0; var r = rate(); return r ? (Number(amount) || 0) * r : null; }

  /* ---------- 匯率換算 ---------- */
  function fxHtml() {
    var st = S.get('fx.ui', { dir: 'j2t', amount: '1000' }), f = App.fx(), j2t = st.dir === 'j2t';
    var quick = j2t ? [1000, 3000, 5000, 10000] : [100, 500, 1000, 3000];
    return '<section class="card card-pad" style="display:flex;flex-direction:column;gap:12px" aria-labelledby="fx-title">' +
      '<div class="section-title" style="margin:0"><h2 id="fx-title">匯率換算</h2><span class="hand">Currency</span></div>' +
      '<div class="seg" role="group" aria-label="換算方向"><button data-dir="j2t" aria-pressed="' + j2t + '">日幣 → 台幣</button><button data-dir="t2j" aria-pressed="' + !j2t + '">台幣 → 日幣</button></div>' +
      '<label class="field"><span>金額（' + (j2t ? '日幣 ¥' : '台幣 NT$') + '）</span><input class="big-input" id="fx-amt" inputmode="decimal" value="' + esc(st.amount) + '" autocomplete="off"></label>' +
      '<div class="quick-amts">' + quick.map(function (q) { return '<button data-q="' + q + '">' + (j2t ? '¥' : '$') + q.toLocaleString() + '</button>'; }).join('') + '</div>' +
      '<div class="fx-result"><span class="small">約</span><b id="fx-out">—</b></div>' +
      '<div class="rate-row"><label for="fx-rate">匯率 1 JPY =</label><input id="fx-rate" inputmode="decimal" placeholder="0.0000" value="' + esc(f.rate) + '"> TWD' +
        '<button class="btn btn-sm btn-outline" data-fetchrate>' + ic('refresh', 14) + '取得即時匯率</button></div>' +
      '<span class="tiny muted" id="fx-note">' + (f.rate ? (f.source === 'auto' ? '即時匯率 · 更新於 ' + App.fmtTime(f.updatedAt) + '（僅供參考，實際以刷卡／換匯為準）' : '使用自己輸入的匯率') : '請按「取得即時匯率」，或自己輸入匯率（離線也能用）') + '</span>' +
    '</section>';
  }
  function fxCalc(root) {
    var st = S.get('fx.ui', { dir: 'j2t', amount: '1000' }), r = rate();
    var amt = parseFloat(String(st.amount).replace(/,/g, ''));
    var out = root.querySelector('#fx-out');
    if (!out) return;
    out.textContent = (r && amt >= 0) ? (st.dir === 'j2t' ? U.money(amt * r, 'TWD') : U.money(amt / r, 'JPY')) : '—';
  }
  function bindFx(root) {
    var amt = root.querySelector('#fx-amt'), rt = root.querySelector('#fx-rate');
    if (!amt) return;
    fxCalc(root);
    amt.addEventListener('input', function () { S.update('fx.ui', { dir: 'j2t' }, function (s) { s.amount = amt.value; }); fxCalc(root); });
    rt.addEventListener('input', function () {
      var val = parseFloat(rt.value);
      S.set('fx', { rate: val > 0 ? val : '', updatedAt: new Date().toISOString(), source: 'manual' });
      root.querySelector('#fx-note').textContent = val > 0 ? '使用自己輸入的匯率' : '請輸入匯率';
      fxCalc(root);
    });
  }

  /* ---------- 旅遊預算 ---------- */
  function budget() {
    var b = S.get('budget', { total: '', records: [] }), r = rate();
    var spent = 0, unknown = 0, byCat = {}, byDay = {};
    b.records.forEach(function (x) {
      var t = toTwd(x.amount, x.currency);
      if (t === null) { unknown++; return; }
      spent += t; byCat[x.category] = (byCat[x.category] || 0) + t; byDay[x.day] = (byDay[x.day] || 0) + t;
    });
    var jpyTotal = b.records.filter(function (x) { return x.currency !== 'TWD'; }).reduce(function (s, x) { return s + (Number(x.amount) || 0); }, 0);
    var remain = has(b.total) ? b.total - spent : null;
    var maxCat = Math.max.apply(null, [1].concat(Object.keys(byCat).map(function (k) { return byCat[k]; })));
    var maxDay = Math.max.apply(null, [1].concat(Object.keys(byDay).map(function (k) { return byDay[k]; })));
    var sorted = b.records.slice().sort(function (a, c) { return (a.day - c.day) || ((a.createdAt || '') < (c.createdAt || '') ? 1 : -1); });
    var groups = {}; sorted.forEach(function (x) { (groups[x.day] = groups[x.day] || []).push(x); });
    return '<div class="stat-row">' +
        '<button class="stat" data-settotal><b>' + (has(b.total) ? U.money(b.total, 'TWD') : '設定') + '</b><span>總預算 ' + ic('edit', 12) + '</span></button>' +
        '<div class="stat"><b>' + U.money(spent, 'TWD') + '</b><span>已花費</span></div>' +
        '<div class="stat"><b style="color:' + (remain !== null && remain < 0 ? '#9A4F35' : 'inherit') + '">' + (remain === null ? '—' : U.money(remain, 'TWD')) + '</b><span>剩餘</span></div>' +
      '</div>' +
      '<p class="tiny muted" style="margin:8px 0 0">日幣合計 ' + U.money(jpyTotal, 'JPY') + (r ? ' · 以匯率 ' + r + ' 換算' : ' · <b>尚未設定匯率，日幣花費暫不計入台幣</b>') + (unknown ? '（' + unknown + ' 筆未換算）' : '') + '</p>' +
      '<button class="btn btn-primary btn-block" style="margin:14px 0" data-addrec>' + ic('plus', 16) + '記一筆</button>' +
      (b.records.length ? '<article class="card card-pad" style="margin-bottom:14px"><h3 style="font-size:16px;margin-bottom:10px">分類統計</h3><div class="bars">' +
        BUDGET_CATS.filter(function (c) { return byCat[c]; }).map(function (c) {
          return '<div class="bar-row"><span>' + c + '</span><span class="track"><i style="width:' + (byCat[c] / maxCat * 100) + '%"></i></span><span class="amt">' + U.money(byCat[c], 'TWD') + '</span></div>'; }).join('') +
        '</div><h3 style="font-size:16px;margin:16px 0 10px">每日支出</h3><div class="bars">' +
        T.days.filter(function (d) { return byDay[d.day]; }).map(function (d) {
          return '<div class="bar-row"><span>Day ' + d.day + '</span><span class="track"><i style="width:' + (byDay[d.day] / maxDay * 100) + '%;background:var(--peach)"></i></span><span class="amt">' + U.money(byDay[d.day], 'TWD') + '</span></div>'; }).join('') +
        '</div></article>' : '') +
      (b.records.length ? Object.keys(groups).sort(function (a, c) { return a - c; }).map(function (day) {
        return '<h3 style="font-size:15px;margin:14px 0 4px">Day ' + day + ' <span class="tiny muted">' + U.md(T.days[day - 1].date) + '</span></h3>' + groups[day].map(function (x) {
          var t = toTwd(x.amount, x.currency);
          return '<button class="rec" data-rec="' + esc(x.id) + '"><span class="pill sand">' + esc(x.category) + '</span><span class="grow">' + (has(x.note) ? esc(x.note) : '<span class="tbd">（無備註）</span>') + '</span>' +
            '<span class="amt">' + U.money(x.amount, x.currency || 'JPY') + (x.currency !== 'TWD' ? '<br><span class="tiny muted">' + (t === null ? '—' : U.money(t, 'TWD')) + '</span>' : '') + '</span></button>';
        }).join('');
      }).join('') : '<div class="empty">還沒有記帳紀錄</div>');
  }
  function editRecord(rec) {
    var isNew = !rec, today = T.days[App.selectedDay()].day;
    rec = rec || { id: S.uid('b'), day: today, category: '餐飲', currency: 'JPY', amount: '', note: '' };
    U.form({
      title: isNew ? '記一筆' : '編輯花費',
      fields: [
        { name: 'amount', label: '金額', type: 'number', value: rec.amount, required: true },
        { name: 'currency', label: '幣別', type: 'select', value: rec.currency || 'JPY', options: [['JPY', '日幣 ¥'], ['TWD', '台幣 NT$']] },
        { name: 'category', label: '分類', type: 'select', value: rec.category, options: BUDGET_CATS.map(function (c) { return [c, c]; }) },
        { name: 'day', label: '日期', type: 'select', value: rec.day, options: T.days.map(function (d) { return [d.day, 'Day ' + d.day + '（' + U.md(d.date) + '）']; }) },
        { name: 'note', label: '備註', value: rec.note, placeholder: '例如：國際通伴手禮' }
      ],
      onSave: function (o) {
        o.day = Number(o.day);
        S.update('budget', { total: '', records: [] }, function (b) {
          var i = b.records.findIndex(function (x) { return x.id === rec.id; });
          var nr = Object.assign({}, rec, o, { createdAt: rec.createdAt || new Date().toISOString() });
          if (i >= 0) b.records[i] = nr; else b.records.push(nr);
        });
        U.toast(isNew ? '已記帳' : '已更新'); App.rerender();
      },
      onDelete: isNew ? null : function () {
        S.update('budget', { total: '', records: [] }, function (b) { b.records = b.records.filter(function (x) { return x.id !== rec.id; }); }); App.rerender();
      }
    });
  }

  /* ---------- 天氣 ---------- */
  function weatherHtml() {
    var any = false;
    var rows = T.days.map(function (d) {
      var w = App.weather(d); if (has(w.status)) any = true;
      return '<button class="weather-row" data-wday="' + d.day + '" style="width:100%;background:none;border-left:0;border-right:0;border-top:0;text-align:left">' +
        '<span><b>Day ' + d.day + '</b><br><span class="tiny muted">' + U.md(d.date) + ' ' + d.weekday.replace('星期', '') + '</span></span>' +
        '<span style="color:var(--ocean)">' + ic(App.weatherIcon(w), 24) + '</span>' +
        '<span>' + (has(w.status) ? esc(w.status) : '<span class="tbd">待更新</span>') + (has(w.rain) ? '<br><span class="tiny muted">降雨 ' + esc(w.rain) + '</span>' : '') +
          (has(w.outfit) ? '<br><span class="tiny">' + esc(w.outfit) + '</span>' : '') + (has(w.planB) ? '<br><span class="tiny" style="color:#8A5A3C">雨備：' + esc(w.planB) + '</span>' : '') + '</span>' +
        '<span style="text-align:right"><b>' + (has(w.temp) ? esc(w.temp) : '--°') + '</b><br><span class="tiny muted">' + (w.source === 'auto' ? '預報' : (w.source === 'manual' ? '手動' : '')) + '</span></span></button>';
    }).join('');
    return '<button class="btn btn-primary btn-block" data-fetchweather>' + ic('refresh', 16) + '更新天氣預報（那霸）</button>' +
      '<p class="tiny muted" style="margin:8px 0 12px">預報來源 Open-Meteo，只涵蓋未來 16 天，出發前約兩週才會有資料。沒有預報時，點任一天可以自己填。' + (any ? '' : '<br>目前還沒有任何天氣資料。') + '</p>' +
      '<div class="card" style="padding:0 14px">' + rows + '</div>';
  }
  function editWeather(dayNum) {
    var d = T.days[dayNum - 1], w = App.weather(d);
    U.form({
      title: 'Day ' + d.day + ' 天氣（' + U.md(d.date) + '）',
      fields: [
        { name: 'status', label: '天氣狀態', value: w.status, placeholder: '例如：晴時多雲' },
        { name: 'icon', label: '圖示', type: 'select', value: w.icon || 'partly', options: [['sun', '晴'], ['partly', '晴時多雲'], ['cloud', '陰天'], ['rain', '下雨']] },
        { name: 'temp', label: '氣溫', value: w.temp, placeholder: '例如：18–23°' },
        { name: 'rain', label: '降雨機率', value: w.rain, placeholder: '例如：30%' },
        { name: 'outfit', label: '穿衣建議', value: w.outfit },
        { name: 'planB', label: '雨天 Plan B', type: 'textarea', value: w.planB }
      ],
      onSave: function (o) { App.saveWeather(d.date, Object.assign({}, w, o, { source: 'manual', updatedAt: new Date().toISOString() })); App.rerender(); }
    });
  }

  /* ---------- 行李清單 ---------- */
  /* 預設行李清單。之後要新增，直接加在最後面即可：
     手機打開時只會補上「還沒加過」的新項目，不會動到在 App 上新增、勾選或刪除的東西。
     格式：[誰的 ('shared' / 'jimmy' / 'shenny'), 分類, 名稱] */
  var PACK_SEED = [
    ['shared', '證件', '護照（兩本）'], ['shared', '證件', '台灣駕照正本 + 日文譯本'], ['shared', '證件', '信用卡・少量日幣現金'], ['shared', '證件', 'Visit Japan Web 填好、QR Code 截圖（兩人）'],
    ['shared', '電子用品', '行動電源'], ['shared', '電子用品', '網卡／eSIM'], ['shared', '旅行用品', '防曬乳'],
    ['jimmy', '衣物', '換洗衣物'], ['shenny', '衣物', '換洗衣物'],
    ['shared', '搭機規定', '行動電源放手提（每人最多 2 個、160Wh 以下，機上禁用）'],
    ['shared', '搭機規定', '手提液體每瓶 100ml 以下，裝進 1L 透明夾鏈袋'],
    ['shared', '搭機規定', '超過 100ml 的液體（保養品、防曬、泡盛）放托運'],
    ['shared', '搭機規定', '打火機只帶 1 個、隨身；刀剪放托運'],
    ['shared', '搭機規定', '回程：退稅商品先別放托運，辦完海關確認再托運'],
    ['shared', '搭機規定', '回程：豬肉製品、含肉食品、生鮮水果不能帶回台灣']
  ];
  var PACK_SEED_V1 = 8; // 舊版就有的前 8 項（舊手機已經複製過，不再重複補）
  function seedKey(x) { return x[0] + '|' + x[2]; }
  function packList() {
    var list = S.get('packing', null), seeded = S.get('packing.seeded', null);
    if (!list) { list = []; seeded = []; }
    else if (!seeded) {
      // 從舊版升級：舊的預設項目與手機裡已經有的同名項目都視為已加過
      var have = {};
      list.forEach(function (i) { have[i.owner + '|' + i.name] = true; });
      seeded = PACK_SEED.filter(function (x, n) { return n < PACK_SEED_V1 || have[seedKey(x)]; }).map(seedKey);
    }
    var mark = {}, exists = {}, changed = false;
    seeded.forEach(function (k) { mark[k] = true; });
    list.forEach(function (i) { exists[i.owner + '|' + i.name] = true; });
    PACK_SEED.forEach(function (x) {
      var k = seedKey(x);
      if (mark[k]) return;
      seeded.push(k); mark[k] = true; changed = true;
      if (exists[k]) return; // 自己已經加過同名項目，就不重複
      list.push({ id: S.uid('p'), owner: x[0], cat: x[1], name: x[2], done: false });
    });
    if (changed || !S.get('packing', null)) S.set('packing', list);
    if (changed || !S.get('packing.seeded', null)) S.set('packing.seeded', seeded);
    return list;
  }
  function packing() {
    var owner = S.get('packing.owner', 'shared'), list = packList();
    var tabs = OWNERS.map(function (o) {
      var mine = list.filter(function (x) { return x.owner === o[0]; }), done = mine.filter(function (x) { return x.done; }).length;
      return '<button data-owner="' + o[0] + '" aria-pressed="' + (o[0] === owner) + '">' + o[1] + ' <span class="tiny">' + done + '/' + mine.length + '</span></button>';
    }).join('');
    var mine = list.filter(function (x) { return x.owner === owner; }), done = mine.filter(function (x) { return x.done; }).length;
    var pct = mine.length ? Math.round(done / mine.length * 100) : 0;
    return '<div class="seg" role="group" aria-label="誰的行李">' + tabs + '</div>' +
      '<div style="display:flex;align-items:center;gap:10px;margin:14px 0 4px"><div class="progress" style="flex:1"><i style="width:' + pct + '%"></i></div><b class="small">' + pct + '%</b></div>' +
      PACK_CATS.map(function (c) {
        var items = mine.filter(function (x) { return x.cat === c; });
        if (!items.length) return '';
        return '<h3 style="font-size:15px;margin:14px 0 2px">' + c + '</h3><ul class="check-list">' + items.map(function (x) {
          return '<li style="display:flex;align-items:center"><button class="check-item" data-pack="' + x.id + '" aria-pressed="' + x.done + '"><span class="check-box">' + (x.done ? ic('check', 14) : '') + '</span><span class="txt">' + esc(x.name) + '</span></button>' +
            '<button class="icon-btn" data-packedit="' + x.id + '" aria-label="編輯 ' + esc(x.name) + '">' + ic('edit', 16) + '</button></li>';
        }).join('') + '</ul>';
      }).join('') +
      (mine.length ? '' : '<div class="empty" style="margin-top:12px">清單是空的，從下面新增第一項</div>') +
      '<form class="card card-pad" id="pack-add" style="margin-top:16px;display:flex;flex-direction:column;gap:8px">' +
        '<label class="field"><span>新增項目</span><input name="name" placeholder="例如：泳衣" autocomplete="off"></label>' +
        '<div class="inline-edit"><select name="cat" style="flex:1;min-height:44px;border-radius:12px;border:1px solid var(--sand);background:var(--paper);padding:0 10px">' + PACK_CATS.map(function (c) { return '<option>' + c + '</option>'; }).join('') + '</select>' +
        '<button class="btn btn-primary" type="submit">' + ic('plus', 16) + '加入</button></div></form>';
  }
  function editPack(id) {
    var list = packList(), x = list.filter(function (i) { return i.id === id; })[0]; if (!x) return;
    U.form({
      title: '編輯行李項目',
      fields: [{ name: 'name', label: '項目', value: x.name, required: true },
        { name: 'cat', label: '分類', type: 'select', value: x.cat, options: PACK_CATS.map(function (c) { return [c, c]; }) },
        { name: 'owner', label: '誰的', type: 'select', value: x.owner, options: OWNERS }],
      onSave: function (o) { S.update('packing', [], function (l) { l.forEach(function (i) { if (i.id === id) Object.assign(i, o); }); }); App.rerender(); },
      onDelete: function () { S.update('packing', [], function (l) { return l.filter(function (i) { return i.id !== id; }); }); App.rerender(); }
    });
  }

  /* ---------- 購物清單 ---------- */
  function shopping() {
    var list = S.get('shopping', []), done = list.filter(function (x) { return x.done; }).length;
    var est = list.reduce(function (s, x) { return s + (Number(x.price) || 0); }, 0);
    return '<div class="stat-row" style="grid-template-columns:repeat(2,minmax(0,1fr))"><div class="stat"><b>' + done + ' / ' + list.length + '</b><span>已購買</span></div><div class="stat"><b>' + U.money(est, 'JPY') + '</b><span>預估總價</span></div></div>' +
      '<button class="btn btn-primary btn-block" style="margin:14px 0" data-addshop>' + ic('plus', 16) + '新增想買的東西</button>' +
      (list.length ? '<ul class="check-list">' + list.map(function (x) {
        return '<li style="display:flex;align-items:center"><button class="check-item" data-shop="' + x.id + '" aria-pressed="' + !!x.done + '"><span class="check-box">' + (x.done ? ic('check', 14) : '') + '</span>' +
          '<span class="txt" style="flex:1">' + esc(x.name) + '<br><span class="tiny muted">' + esc([has(x.price) ? U.money(x.price, 'JPY') : '', x.place, x.note].filter(has).join(' · ')) + '</span></span></button>' +
          '<button class="icon-btn" data-shopedit="' + x.id + '" aria-label="編輯 ' + esc(x.name) + '">' + ic('edit', 16) + '</button></li>';
      }).join('') + '</ul>' : '<div class="empty">還沒有想買的東西</div>');
  }
  function editShop(id) {
    var list = S.get('shopping', []), x = list.filter(function (i) { return i.id === id; })[0], isNew = !x;
    x = x || { id: S.uid('s'), name: '', price: '', place: '', note: '', done: false };
    U.form({
      title: isNew ? '新增購物項目' : '編輯購物項目',
      fields: [{ name: 'name', label: '商品名稱', value: x.name, required: true }, { name: 'price', label: '預估價格（日幣）', type: 'number', value: x.price },
        { name: 'place', label: '購買地點', value: x.place }, { name: 'note', label: '備註', value: x.note }, { name: 'done', label: '已購買', type: 'checkbox', value: x.done }],
      onSave: function (o) { S.update('shopping', [], function (l) { var i = l.findIndex(function (a) { return a.id === x.id; }); var n = Object.assign({}, x, o); if (i >= 0) l[i] = n; else l.push(n); }); App.rerender(); },
      onDelete: isNew ? null : function () { S.update('shopping', [], function (l) { return l.filter(function (a) { return a.id !== x.id; }); }); App.rerender(); }
    });
  }

  /* ---------- 備忘錄 ---------- */
  function notes() {
    var list = S.get('notes', []).slice().sort(function (a, b) { return (b.pinned - a.pinned) || (a.updatedAt < b.updatedAt ? 1 : -1); });
    return '<button class="btn btn-primary btn-block" style="margin-bottom:14px" data-addnote>' + ic('plus', 16) + '新增備忘錄</button>' +
      (list.length ? '<div style="display:flex;flex-direction:column;gap:10px">' + list.map(function (n) {
        return '<button class="card card-pad" data-note="' + n.id + '" style="text-align:left;width:100%;' + (n.pinned ? 'border-color:var(--peach);background:#FFF8F2' : '') + '">' +
          '<div style="display:flex;justify-content:space-between;gap:8px"><b>' + (n.pinned ? '★ ' : '') + esc(n.title || '（無標題）') + '</b><span class="tiny muted">' + App.fmtTime(n.updatedAt) + '</span></div>' +
          '<p class="small muted" style="margin:6px 0 0;white-space:pre-line;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden">' + esc(n.body) + '</p></button>';
      }).join('') + '</div>' : '<div class="empty">還沒有備忘錄</div>');
  }
  function editNote(id) {
    var list = S.get('notes', []), x = list.filter(function (i) { return i.id === id; })[0], isNew = !x;
    x = x || { id: S.uid('n'), title: '', body: '', pinned: false };
    U.form({
      title: isNew ? '新增備忘錄' : '編輯備忘錄',
      fields: [{ name: 'title', label: '標題', value: x.title, required: true }, { name: 'body', label: '內容', type: 'textarea', rows: 6, value: x.body },
        { name: 'pinned', label: '標為重要提醒（置頂）', type: 'checkbox', value: x.pinned }],
      onSave: function (o) { S.update('notes', [], function (l) { var i = l.findIndex(function (a) { return a.id === x.id; }); var n = Object.assign({}, x, o, { updatedAt: new Date().toISOString() }); if (i >= 0) l[i] = n; else l.push(n); }); App.rerender(); },
      onDelete: isNew ? null : function () { S.update('notes', [], function (l) { return l.filter(function (a) { return a.id !== x.id; }); }); App.rerender(); }
    });
  }

  /* ---------- 緊急資訊 ---------- */
  function emergency() {
    var e = T.emergency, contacts = S.get('contacts', []), carPhone = App.priv('car:phone');
    return '<div style="display:flex;flex-direction:column;gap:8px">' + e.numbers.map(function (n) {
        return '<a class="sos-call" href="tel:' + esc(n.number) + '"><span>' + ic('phone', 18) + ' ' + esc(n.label) + '</span><b>' + esc(n.number) + '</b></a>'; }).join('') + '</div>' +
      '<article class="card card-pad" style="margin-top:14px"><h3 style="font-size:16px;margin-bottom:8px">台灣駐外單位</h3><dl class="kv"><dt>單位</dt><dd>' + esc(e.taiwanOffice.name) + '</dd>' +
        '<dt>電話</dt><dd>' + (has(e.taiwanOffice.phone) ? '<a href="tel:' + esc(e.taiwanOffice.phone) + '">' + esc(e.taiwanOffice.phone) + '</a>' : v('')) + '</dd>' +
        '<dt>急難救助</dt><dd>' + (has(e.taiwanOffice.emergencyPhone) ? '<a href="tel:' + esc(e.taiwanOffice.emergencyPhone) + '">' + esc(e.taiwanOffice.emergencyPhone) + '</a>' : v('')) + '</dd>' +
        '<dt>地址</dt><dd>' + v(e.taiwanOffice.address) + '</dd></dl></article>' +
      '<article class="card card-pad" style="margin-top:12px"><h3 style="font-size:16px;margin-bottom:8px">旅遊保險・租車</h3><dl class="kv"><dt>保險公司</dt><dd>' + v(e.insurance.company) + '</dd>' +
        '<dt>保險電話</dt><dd>' + (has(e.insurance.phone) ? '<a href="tel:' + esc(e.insurance.phone) + '">' + esc(e.insurance.phone) + '</a>' : v('')) + '</dd>' +
        '<dt>保單</dt><dd>' + (App.priv('insurance:policy') ? esc(App.priv('insurance:policy')) : '<span class="tbd">未填</span>') + ' <button class="more-btn" data-priv="insurance:policy" data-label="保單號碼">' + ic('lock', 13) + '編輯</button></dd>' +
        '<dt>租車公司</dt><dd>' + (carPhone ? '<a href="tel:' + esc(carPhone) + '">' + esc(carPhone) + '</a>' : '<span class="tbd">未填（在交通 › 租車填寫）</span>') + '</dd></dl></article>' +
      '<article class="card card-pad" style="margin-top:12px"><div class="section-title" style="margin-bottom:8px"><h3 style="font-size:16px">緊急聯絡人</h3><button class="btn btn-sm" data-addcontact>' + ic('plus', 14) + '新增</button></div>' +
        (contacts.length ? contacts.map(function (c) {
          return '<div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px dashed #E3DDCE"><span style="flex:1"><b>' + esc(c.name) + '</b> <span class="tiny muted">' + esc(c.relation) + '</span></span>' +
            (has(c.phone) ? '<a class="btn btn-sm" href="tel:' + esc(c.phone) + '">' + ic('phone', 14) + esc(c.phone) + '</a>' : '') +
            '<button class="icon-btn" data-contact="' + c.id + '" aria-label="編輯 ' + esc(c.name) + '">' + ic('edit', 16) + '</button></div>';
        }).join('') : '<p class="small muted" style="margin:0">還沒有緊急聯絡人</p>') + '</article>' +
      '<p class="tiny muted" style="margin-top:12px">為了安全，請不要在網站裡存護照號碼等證件資料；需要時看實體證件或手機相簿即可。</p>';
  }
  function editContact(id) {
    var list = S.get('contacts', []), x = list.filter(function (i) { return i.id === id; })[0], isNew = !x;
    x = x || { id: S.uid('c'), name: '', relation: '', phone: '' };
    U.form({
      title: isNew ? '新增緊急聯絡人' : '編輯緊急聯絡人',
      fields: [{ name: 'name', label: '姓名', value: x.name, required: true }, { name: 'relation', label: '關係', value: x.relation }, { name: 'phone', label: '電話（含國碼，例如 +886…）', type: 'tel', value: x.phone }],
      onSave: function (o) { S.update('contacts', [], function (l) { var i = l.findIndex(function (a) { return a.id === x.id; }); var n = Object.assign({}, x, o); if (i >= 0) l[i] = n; else l.push(n); }); App.rerender(); },
      onDelete: isNew ? null : function () { S.update('contacts', [], function (l) { return l.filter(function (a) { return a.id !== x.id; }); }); App.rerender(); }
    });
  }

  /* ---------- 重要預約 ---------- */
  function bookings() {
    function row(label, key) {
      var x = App.priv(key);
      return '<div style="display:flex;align-items:center;gap:8px;padding:10px 0;border-bottom:1px dashed #E3DDCE"><span style="flex:1">' + esc(label) + '<br>' + (x ? '<b>' + esc(x) + '</b>' : '<span class="tbd small">未填</span>') + '</span>' +
        '<button class="btn btn-sm" data-priv="' + esc(key) + '" data-label="' + esc(label) + '">' + ic('lock', 14) + '編輯</button></div>';
    }
    var stayRows = T.accommodations.map(function (a0) { var a = App.accommodation(a0.id); return row((a.name || a.area + '住宿') + ' 訂房編號', 'stay:' + a.id); }).join('');
    var today = (function () { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); })();
    function resDate(iso) { var p = iso.split('-'); var d = new Date(+p[0], p[1] - 1, +p[2]); return (+p[1]) + '/' + (+p[2]) + '（' + '日一二三四五六'[d.getDay()] + '）'; }
    var needRes = App.restaurants().filter(function (r) { return r.needReservation || r.status === 'reserved'; });
    return '<p class="small muted" style="margin-top:0">' + ic('lock', 14) + ' 這裡的編號只存在這支手機，不會出現在 GitHub 上。兩支手機要各自填寫，或用「資料備份」互傳。</p>' +
      '<article class="card card-pad"><h3 style="font-size:16px">航班・租車</h3>' + row('去程訂位代號', 'flight:outbound:ref') + row('回程訂位代號', 'flight:return:ref') + row('租車預約編號', 'car:booking') + '</article>' +
      '<article class="card card-pad" style="margin-top:12px"><h3 style="font-size:16px">住宿</h3>' + stayRows + '</article>' +
      '<article class="card card-pad" style="margin-top:12px"><h3 style="font-size:16px;margin-bottom:6px">餐廳訂位</h3>' + (needRes.length ? needRes.map(function (r) {
        return '<a href="#/food/r/' + encodeURIComponent(r.id) + '" style="display:flex;justify-content:space-between;align-items:center;gap:8px;min-height:48px;padding:6px 0;border-bottom:1px dashed #E3DDCE;text-decoration:none"><span>' + esc(r.name) + (r.day ? ' <span class="tiny muted">Day ' + esc(r.day) + '</span>' : '') +
          (r.reserveOn && r.status !== 'reserved' ? ' <span class="pill ' + (r.reserveOn <= today ? 'dark' : 'sand') + '">' + resDate(r.reserveOn) + (r.reserveOn <= today ? ' 可以訂了' : ' 訂') + '</span>' : '') + '</span>' +
          (r.status === 'reserved' ? '<span class="pill green">已預約</span>' : '<span class="pill peach">尚未預約</span>') + '</a>';
      }).join('') : '<p class="small muted">沒有需要訂位的餐廳</p>') + '</article>';
  }

  /* ---------- 入境・退稅 ---------- */
  function guide() {
    var g = T.travelGuide || {};
    function list(arr) { return '<ol style="margin:0;padding-left:20px;display:flex;flex-direction:column;gap:8px">' + (arr || []).map(function (x) { return '<li class="small">' + esc(x) + '</li>'; }).join('') + '</ol>'; }
    return (g.esim ? '<article class="card card-pad" style="display:flex;flex-direction:column;gap:10px;margin-bottom:12px"><h3 style="font-size:16px">出發前：網路 eSIM</h3><p class="small" style="margin:0"><b>' + esc(g.esim.name) + '</b></p>' + list(g.esim.tips) +
        '<a class="btn btn-primary btn-block" href="' + esc(g.esim.url) + '" target="_blank" rel="noopener">' + ic('globe', 16) + '到 KKday 購買 eSIM</a></article>' : '') +
      '<article class="card card-pad" style="display:flex;flex-direction:column;gap:10px"><h3 style="font-size:16px">出發前：Visit Japan Web</h3>' + list(g.visitJapanWeb) +
        '<a class="btn btn-primary btn-block" href="https://www.vjw.digital.go.jp/" target="_blank" rel="noopener">' + ic('globe', 16) + '開啟 Visit Japan Web 官網</a></article>' +
      '<article class="card card-pad" style="margin-top:12px;display:flex;flex-direction:column;gap:10px"><h3 style="font-size:16px">退稅（2026/11 起新制）</h3>' + list(g.taxRefund) +
        '<p class="tiny muted" style="margin:0">規定以出發前觀光廳與各店家的最新公告為準。</p></article>' +
      (g.baggageRules ? '<article class="card card-pad" style="margin-top:12px;display:flex;flex-direction:column;gap:10px"><h3 style="font-size:16px">搭機行李規定</h3>' +
        '<b class="small">只能手提</b>' + list(g.baggageRules.carryOnOnly) +
        '<b class="small">要放托運</b>' + list(g.baggageRules.checkedOnly) + '<p class="small muted" style="margin:0">' + esc(g.baggageRules.carryOnLiquids) + '</p>' +
        '<b class="small">不能帶回台灣</b>' + list(g.baggageRules.bringBackBanned) + '</article>' : '');
  }

  /* ---------- 備份 ---------- */
  function backup() {
    return '<article class="card card-pad" style="display:flex;flex-direction:column;gap:10px">' +
      '<p class="small" style="margin:0">網站資料（記帳、清單、日記、照片…）都存在這支手機的瀏覽器裡。換手機、清除瀏覽器資料前，或想把資料傳給 Jimmy，請先匯出備份檔。</p>' +
      '<button class="btn btn-primary btn-block" data-export="0">' + ic('backup', 16) + '匯出備份（不含照片）</button>' +
      '<button class="btn btn-block" data-export="1">' + ic('camera', 16) + '匯出備份（含照片，檔案較大）</button>' +
      '<label class="btn btn-block" style="cursor:pointer">' + ic('up', 16) + '匯入備份檔<input type="file" id="import-file" accept="application/json,.json" class="sr-only"></label>' +
      '<p class="tiny muted" style="margin:0">匯入會覆蓋同名的資料。備份檔含私人資訊，請不要上傳到 GitHub。</p></article>';
  }

  /* ---------- 頁面 ---------- */
  var VIEWS = { guide: guide, budget: budget, weather: weatherHtml, packing: packing, shopping: shopping, notes: notes, emergency: emergency, bookings: bookings, backup: backup };

  App.register('tools', {
    render: function (p) {
      var t = TOOLS.filter(function (x) { return x[0] === p[0]; })[0];
      if (t) {
        return '<header class="page-head" style="flex-direction:column;align-items:flex-start;gap:0"><a class="tool-back" href="#/tools">' + ic('left', 16) + '工具箱</a>' +
          '<div><span class="deco">' + esc(t[2]) + '</span><h1>' + esc(t[1]) + '</h1></div></header><div class="section">' + VIEWS[t[0]]() + '</div>';
      }
      return '<header class="page-head"><div><span class="deco">Travel Kit</span><h1>旅行工具箱</h1></div></header>' +
        '<div class="section"><h2 style="font-size:17px;margin-bottom:10px">更多工具</h2><div class="tool-grid">' + TOOLS.map(function (x) {
          return '<a class="tool-card" href="#/tools/' + x[0] + '" style="text-decoration:none"><span class="ic" style="background:' + x[4] + '">' + ic(x[3], 20) + '</span><b>' + esc(x[1]) + '</b><span>' + esc(x[2]) + '</span></a>';
        }).join('') + '</div></div>' +
        '<div class="section">' + fxHtml() + '</div>';
    },
    bind: function (root) {
      bindFx(root);
      var pf = root.querySelector('#pack-add');
      if (pf) pf.addEventListener('submit', function (e) {
        e.preventDefault(); var name = pf.elements.name.value.trim(); if (!name) { U.toast('請輸入項目名稱'); return; }
        var owner = S.get('packing.owner', 'shared');
        packList(); S.update('packing', [], function (l) { l.push({ id: S.uid('p'), owner: owner, cat: pf.elements.cat.value, name: name, done: false }); });
        App.rerender(); var again = document.querySelector('#pack-add input'); if (again) again.focus();
      });
      var imp = root.querySelector('#import-file');
      if (imp) imp.addEventListener('change', function () {
        var f = imp.files[0]; if (!f) return;
        f.text().then(function (txt) { return S.importAll(JSON.parse(txt)); })
          .then(function () { U.toast('匯入完成'); App.rerender(); })
          .catch(function (err) { U.toast('匯入失敗：' + err.message); });
      });
      root.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        var d = b.dataset;
        if (d.dir) { S.update('fx.ui', {}, function (s) { s.dir = d.dir; s.amount = d.dir === 'j2t' ? '1000' : '100'; }); App.rerender(); }
        else if (d.q) { S.update('fx.ui', { dir: 'j2t' }, function (s) { s.amount = d.q; }); root.querySelector('#fx-amt').value = d.q; fxCalc(root); }
        else if (b.hasAttribute('data-fetchrate')) {
          b.disabled = true; U.toast('取得匯率中…');
          App.fetchRate().then(function (r) { U.toast('已更新：1 JPY = ' + r.rate + ' TWD'); App.rerender(); })
            .catch(function (err) { b.disabled = false; U.toast(navigator.onLine ? err.message : '目前離線，請自己輸入匯率'); });
        }
        else if (b.hasAttribute('data-settotal')) {
          var bd = S.get('budget', { total: '', records: [] });
          U.form({ title: '設定總預算', fields: [{ name: 'total', label: '總預算（台幣 NT$）', type: 'number', value: bd.total }],
            onSave: function (o) { S.update('budget', { total: '', records: [] }, function (x) { x.total = o.total; }); App.rerender(); } });
        }
        else if (b.hasAttribute('data-addrec')) editRecord(null);
        else if (d.rec) editRecord(S.get('budget', { records: [] }).records.filter(function (x) { return x.id === d.rec; })[0]);
        else if (b.hasAttribute('data-fetchweather')) {
          b.disabled = true; U.toast('更新天氣中…');
          App.fetchWeather().then(function (n) { U.toast(n ? '已更新 ' + n + ' 天的預報' : '旅行日期還不在 16 天預報範圍內'); App.rerender(); })
            .catch(function (err) { b.disabled = false; U.toast(navigator.onLine ? err.message : '目前離線，無法更新'); });
        }
        else if (d.wday) editWeather(+d.wday);
        else if (d.owner) { S.set('packing.owner', d.owner); App.rerender(); }
        else if (d.pack) { S.update('packing', [], function (l) { l.forEach(function (x) { if (x.id === d.pack) x.done = !x.done; }); }); App.rerender(); }
        else if (d.packedit) editPack(d.packedit);
        else if (b.hasAttribute('data-addshop')) editShop(null);
        else if (d.shop) { S.update('shopping', [], function (l) { l.forEach(function (x) { if (x.id === d.shop) x.done = !x.done; }); }); App.rerender(); }
        else if (d.shopedit) editShop(d.shopedit);
        else if (b.hasAttribute('data-addnote')) editNote(null);
        else if (d.note) editNote(d.note);
        else if (b.hasAttribute('data-addcontact')) editContact(null);
        else if (d.contact) editContact(d.contact);
        else if (d.priv) { App.editPrivate(d.priv, d.label); }
        else if (d['export'] !== undefined) {
          U.toast('準備備份檔…');
          S.exportAll(d['export'] === '1').then(function (obj) {
            var blob = new Blob([JSON.stringify(obj)], { type: 'application/json' });
            var a = document.createElement('a'); a.href = URL.createObjectURL(blob);
            a.download = 'okinawa-love-backup-' + U.todayISO() + '.json'; document.body.appendChild(a); a.click(); a.remove();
            setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
          }).catch(function (err) { U.toast('匯出失敗：' + err.message); });
        }
      });
    }
  });
})();
