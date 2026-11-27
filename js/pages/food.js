/* 清單（原「美食」）：必吃／必買／景點三個分頁，分類、搜尋、收藏、新增／編輯／刪除 */
(function () {
  'use strict';
  var T = TRIP, U = UI, S = Store, ic = U.icon, esc = U.esc, v = U.v, has = U.has;
  var STATUS = {
    reserved: ['已預約', 'green'], planned: ['已安排', 'blue'], mustEat: ['必吃', 'peach'],
    wishlist: ['想去清單', 'sand'], visited: ['已造訪', 'plum']
  };
  var TINTS = ['#E7EEF1', '#F1E6DC', '#E4ECE7', '#EFEBE0', '#EEE8F0'];
  var query = '';
  // 三個分頁：必吃／必買／景點（舊資料沒有 kind 的都算必吃）
  var KINDS = {
    eat: { label: '必吃', noun: '餐廳', must: '必吃', wish: '想去清單', done: '已造訪', rec: '推薦餐點' },
    buy: { label: '必買', noun: '店家／商品', must: '必買', wish: '想買清單', done: '已買到', rec: '推薦／怎麼買' },
    sight: { label: '景點', noun: '景點', must: '必去', wish: '想去清單', done: '去過了', rec: '重點' }
  };
  function kindOf(r) { return KINDS[r.kind] ? r.kind : 'eat'; }
  function curKind() { var k = S.get('food.kind', 'eat'); return KINDS[k] ? k : 'eat'; }
  function stLabel(r) {
    var st = STATUS[r.status] || STATUS.wishlist, K = KINDS[kindOf(r)];
    var name = r.status === 'mustEat' ? K.must : r.status === 'visited' ? K.done : (r.status === 'wishlist' || !STATUS[r.status]) ? K.wish : st[0];
    return [name, st[1]];
  }
  function statusOptions(k) {
    var K = KINDS[k];
    return Object.keys(STATUS).filter(function (s) { return k === 'eat' || s !== 'reserved'; }).map(function (s) {
      return [s, s === 'mustEat' ? K.must : s === 'visited' ? K.done : s === 'wishlist' ? K.wish : STATUS[s][0]];
    });
  }

  function todayNum() { return T.days[App.selectedDay()].day; }
  // 地區：看「區域」和「地址」有沒有這些字
  function inArea(words) { return function (r) { var t = (r.area || '') + ' ' + (r.address || ''); return words.some(function (w) { return t.indexOf(w) >= 0; }); }; }
  var AREAS = [['naha', '那霸', inArea(['那霸', '那覇'])], ['onna', '恩納村', inArea(['恩納'])], ['motobu', '本部', inArea(['本部'])]];
  function filters() {
    var d = todayNum(), k = curKind();
    var planned = ['planned', '已安排', function (r) { return r.status === 'planned' || !!r.day; }];
    if (k !== 'eat') return [
      ['all', '全部', function () { return true; }],
      ['today', '今日 Day ' + d, function (r) { return Number(r.day) === d; }]
    ].concat(AREAS, [planned]);
    return [
      ['all', '全部', function () { return true; }],
      ['today', '今日 Day ' + d, function (r) { return Number(r.day) === d; }],
      ['store', '超商', function (r) { return r.group === 'store'; }],
      ['cafe', '咖啡甜點', function (r) { return r.group === 'cafe'; }]
    ].concat(AREAS, [planned,
      ['needres', '需訂位', function (r) { return r.needReservation && r.status !== 'reserved'; }],
      ['reserved', '已預約', function (r) { return r.status === 'reserved'; }]
    ]);
  }
  function matches(r, q) {
    if (!q) return true;
    q = q.toLowerCase();
    return [r.name, r.nameJa, r.type, r.area, r.recommend, r.description, r.notes].join(' ').toLowerCase().indexOf(q) >= 0;
  }

  function card(r, i) {
    var st = stLabel(r), fav = App.isFav(r.id);
    return '<article class="food-card">' +
      '<div class="food-photo" style="background:' + TINTS[i % TINTS.length] + '">' + (has(r.photo) ? '<img src="' + esc(r.photo) + '" alt="" loading="lazy">' : esc(r.type || 'Okinawa')) + '</div>' +
      '<div class="food-body">' +
        '<span class="food-name">' + esc(r.name) + '</span>' +
        (has(r.nameJa) ? '<span class="tiny muted">' + esc(r.nameJa) + '</span>' : '') +
        '<span class="tiny muted">' + esc([r.type, r.area, r.price].filter(has).join(' · ') || '—') + '</span>' +
        (has(r.recommend) ? '<span class="tiny">' + (kindOf(r) === 'sight' ? '重點' : '推薦') + '：' + esc(r.recommend) + '</span>' : '') +
        '<div class="food-tags">' +
          (r.day ? '<span class="pill blue">Day ' + esc(r.day) + '</span>' : '') +
          (r.needReservation && r.status !== 'reserved' ? '<span class="pill peach">需訂位</span>' : '') + '</div>' +
      '</div>' +
      '<button class="food-open" data-detail="' + esc(r.id) + '" aria-label="查看 ' + esc(r.name) + ' 詳細資訊"></button>' +
      '<button class="fav-btn" data-fav="' + esc(r.id) + '" aria-pressed="' + fav + '" aria-label="' + (fav ? '取消收藏' : '收藏') + ' ' + esc(r.name) + '">' + ic('heart', 18) + '</button>' +
    '</article>';
  }

  function inKind() { var k = curKind(); return App.restaurants().filter(function (r) { return kindOf(r) === k; }); }
  function listHtml() {
    var fk = S.get('food.filter', 'all'), F = filters(), f = F.filter(function (x) { return x[0] === fk; })[0] || F[0];
    var list = inKind().filter(f[2]).filter(function (r) { return matches(r, query); });
    return list.length ? '<div class="food-grid">' + list.map(card).join('') + '</div>'
      : '<div class="empty">' + (query ? '找不到「' + esc(query) + '」' : '這個分類還沒有東西') + '</div>';
  }

  App.register('food', {
    render: function () {
      var fk = S.get('food.filter', 'all'), all = inKind(), k = curKind();
      var ph = { eat: '搜尋餐廳、區域、餐點', buy: '搜尋店家、商品', sight: '搜尋景點、區域' }[k];
      return '<header class="page-head"><div><span class="deco">Eat · Shop · See</span><h1>口袋清單</h1></div>' +
        '<button class="btn btn-outline" data-add>' + ic('plus', 16) + '新增</button></header>' +
        '<div class="section" style="margin-bottom:12px"><div class="seg" role="tablist" aria-label="清單分類">' + Object.keys(KINDS).map(function (key) {
          var n = App.restaurants().filter(function (r) { return kindOf(r) === key; }).length;
          return '<button role="tab" data-kind="' + key + '" aria-selected="' + (key === k) + '">' + KINDS[key].label + ' <span class="tiny muted">' + n + '</span></button>';
        }).join('') + '</div></div>' +
        '<div class="section" style="margin-bottom:12px"><label class="search">' + ic('search', 18) + '<span class="sr-only">搜尋</span>' +
          '<input type="search" id="food-q" placeholder="' + ph + '" value="' + esc(query) + '" autocomplete="off"></label></div>' +
        '<div class="section" style="margin-bottom:14px"><div class="chips">' + filters().map(function (f) {
          return '<button class="chip" data-filter="' + f[0] + '" aria-pressed="' + (f[0] === fk) + '">' + esc(f[1]) + ' <span class="count">' + all.filter(f[2]).length + '</span></button>';
        }).join('') + '</div></div>' +
        '<div class="section" id="food-list">' + listHtml() + '</div>';
    },
    bind: function (root, p) {
      var q = root.querySelector('#food-q');
      q.addEventListener('input', function () { query = q.value.trim(); root.querySelector('#food-list').innerHTML = listHtml(); });
      root.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        if (b.dataset.kind) { S.set('food.kind', b.dataset.kind); S.set('food.filter', 'all'); query = ''; App.rerender(); }
        else if (b.dataset.filter) { S.set('food.filter', b.dataset.filter); App.rerender(); }
        else if (b.hasAttribute('data-add')) edit(null);
        else if (b.dataset.fav) { var on = App.toggleFav(b.dataset.fav); U.toast(on ? '已收藏' : '已取消收藏'); App.rerender(); }
        else if (b.dataset.detail) detail(b.dataset.detail);
      });
      if (p[0] === 'r' && p[1]) setTimeout(function () { detail(p[1], true); }, 0);
    }
  });

  function detail(id, fromLink) {
    var r = App.restaurant(id); if (!r) { U.toast('找不到這個項目'); return; }
    var st = stLabel(r), k = kindOf(r), K = KINDS[k];
    var navU = App.navUrl(r), mapU = App.mapUrl(r);
    var rows = [['日文名稱', v(r.nameJa)], ['分類', v(r.type)], ['區域', v(r.area)], ['價格', v(r.price)], [K.rec, has(r.recommend) ? U.lines(r.recommend) : v('')],
      ['營業時間', v(r.hours)], ['地址', v(r.address)], ['電話', has(r.phone) ? '<a href="tel:' + esc(r.phone) + '">' + esc(r.phone) + '</a>' : v('')],
      ['菜單', v(r.menu)], ['預約資訊', has(r.reservationInfo) ? U.lines(r.reservationInfo) : v('')], ['停車', has(r.parking) ? U.lines(r.parking) : v('')], ['注意事項', has(r.notes) ? U.lines(r.notes) : v('', '—')]]
      .filter(function (x) { return k === 'eat' || ['日文名稱', '菜單', '預約資訊', '價格'].indexOf(x[0]) < 0 || has(r[{ '日文名稱': 'nameJa', '菜單': 'menu', '預約資訊': 'reservationInfo', '價格': 'price' }[x[0]]]); });
    var html = '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px"><span class="pill ' + st[1] + '">' + st[0] + '</span>' +
        (r.day ? '<span class="pill blue">安排在 Day ' + esc(r.day) + '</span>' : '<span class="pill sand">尚未安排日期</span>') +
        (r.needReservation ? '<span class="pill peach">需訂位</span>' : '') + (r.addedBy ? '<span class="pill sand">' + esc(r.addedBy) + '想去</span>' : '') + (r.source === 'IG' ? '<span class="pill sand">IG 收藏</span>' : '') + '</div>' +
      (has(r.description) ? '<p style="margin:0 0 12px">' + esc(r.description) + '</p>' : '') +
      '<dl class="kv">' + rows.map(function (x) { return '<dt>' + x[0] + '</dt><dd>' + x[1] + '</dd>'; }).join('') + '</dl>' +
      '<label class="field" style="margin-top:14px"><span>快速修改狀態</span><select id="quick-status">' + statusOptions(k).map(function (o) {
        return '<option value="' + o[0] + '"' + (o[0] === r.status ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select></label>' +
      '<div class="btn-row" style="margin-top:14px">' +
        '<a class="btn btn-primary" href="' + esc(navU) + '" target="_blank" rel="noopener">' + ic('nav', 16) + '導航</a>' +
        '<a class="btn" href="' + esc(mapU) + '" target="_blank" rel="noopener">' + ic('map', 16) + '地圖</a>' +
        (has(r.website) ? '<a class="btn" href="' + esc(r.website) + '" target="_blank" rel="noopener">' + ic('globe', 16) + '官網</a>' : '') +
      '</div>' +
      '<div class="btn-row" style="margin-top:8px"><button class="btn" id="edit-r">' + ic('edit', 16) + '編輯</button>' +
        (r.day ? '<a class="btn" href="#/home" id="goto-day">' + ic('home', 16) + '看 Day ' + esc(r.day) + ' 行程</a>' : '') + '</div>';
    var root = U.openSheet(r.name, html, { onClose: function () { if (fromLink) history.replaceState(null, '', '#/food'); } });
    root.querySelector('#quick-status').addEventListener('change', function (e) {
      r.status = e.target.value; App.saveRestaurant(r); U.toast('狀態已更新為「' + stLabel(r)[0] + '」'); App.rerender();
    });
    root.querySelector('#edit-r').addEventListener('click', function () { edit(r); });
    var gd = root.querySelector('#goto-day');
    if (gd) gd.addEventListener('click', function () { App.selectDay(Number(r.day) - 1); });
  }

  function edit(r) {
    var isNew = !r;
    r = r || { id: S.uid('r'), kind: curKind(), status: 'wishlist', group: 'meal', needReservation: false, day: null };
    var K = KINDS[kindOf(r)];
    U.form({
      title: (isNew ? '新增' : '編輯') + K.noun,
      fields: [
        { name: 'kind', label: '放在哪一類', type: 'select', value: kindOf(r), options: Object.keys(KINDS).map(function (x) { return [x, KINDS[x].label]; }) },
        { name: 'name', label: '名稱', value: r.name, required: true },
        { name: 'nameJa', label: '日文名稱', value: r.nameJa },
        { name: 'type', label: '分類', value: r.type, placeholder: '例如：燒肉、藥妝、海灘' },
        { name: 'group', label: '必吃類型（只用在必吃）', type: 'select', value: r.group || 'meal', options: [['meal', '正餐'], ['cafe', '咖啡・甜點'], ['store', '超商']] },
        { name: 'area', label: '區域', value: r.area },
        { name: 'status', label: '狀態', type: 'select', value: r.status, options: statusOptions(kindOf(r)) },
        { name: 'needReservation', label: '需要訂位', type: 'checkbox', value: r.needReservation },
        { name: 'day', label: '安排在哪一天', type: 'select', value: r.day || '', options: [['', '尚未安排']].concat(T.days.map(function (d) { return [d.day, 'Day ' + d.day + '（' + U.md(d.date) + '）']; })) },
        { name: 'price', label: '價格區間', value: r.price, placeholder: '例如：¥2,000–3,000' },
        { name: 'recommend', label: K.rec, value: r.recommend },
        { name: 'hours', label: '營業時間', value: r.hours },
        { name: 'address', label: '地址', value: r.address },
        { name: 'mapUrl', label: 'Google Maps 分享連結', type: 'url', value: r.mapUrl, help: '在 Google Maps 店家頁按「分享 → 複製連結」貼上，按「地圖」就會直接打開這家店' },
        { name: 'mapQuery', label: 'Google Maps 搜尋字', value: r.mapQuery, help: '沒有分享連結時使用，填日文店名最準；留白會用名稱搜尋' },
        { name: 'phone', label: '電話', type: 'tel', value: r.phone },
        { name: 'website', label: '官方網站', type: 'url', value: r.website },
        { name: 'menu', label: '菜單', type: 'textarea', value: r.menu },
        { name: 'reservationInfo', label: '預約資訊', type: 'textarea', value: r.reservationInfo },
        { name: 'reserveOn', label: '預約日期（哪天要去訂位）', type: 'date', value: r.reserveOn, help: '會顯示在「工具 → 重要預約」的餐廳後面' },
        { name: 'parking', label: '停車資訊', value: r.parking },
        { name: 'description', label: '介紹', type: 'textarea', value: r.description },
        { name: 'notes', label: '注意事項', type: 'textarea', value: r.notes }
      ],
      onSave: function (o) {
        o.day = o.day === '' ? null : Number(o.day);
        // 換了搜尋字或地址，就不再用原本綁定的 Google 地點
        if ((o.mapQuery || '') !== (r.mapQuery || '') || (o.address || '') !== (r.address || '')) { o.placeId = ''; o.parkingPlaceId = ''; }
        App.saveRestaurant(Object.assign({}, r, o)); if (isNew && o.kind) S.set('food.kind', o.kind); U.toast(isNew ? '已新增' : '已儲存'); App.rerender();
      },
      onDelete: isNew ? null : function () { App.deleteRestaurant(r.id); U.toast('已刪除'); App.rerender(); },
      deleteConfirm: '確定要刪除「' + (r.name || '') + '」嗎？'
    });
  }
})();
