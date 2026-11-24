/* Food：分類、搜尋、收藏、新增／編輯／刪除餐廳 */
(function () {
  'use strict';
  var T = TRIP, U = UI, S = Store, ic = U.icon, esc = U.esc, v = U.v, has = U.has;
  var STATUS = {
    reserved: ['已預約', 'green'], planned: ['已安排', 'blue'], mustEat: ['必吃', 'peach'],
    wishlist: ['想去清單', 'sand'], visited: ['已造訪', 'plum']
  };
  var TINTS = ['#E7EEF1', '#F1E6DC', '#E4ECE7', '#EFEBE0', '#EEE8F0'];
  var query = '';

  function todayNum() { return T.days[App.selectedDay()].day; }
  function filters() {
    var d = todayNum();
    return [
      ['all', '全部', function () { return true; }],
      ['today', '今日 Day ' + d, function (r) { return Number(r.day) === d; }],
      ['reserved', '已預約', function (r) { return r.status === 'reserved'; }],
      ['needres', '需訂位', function (r) { return r.needReservation && r.status !== 'reserved'; }],
      ['must', '必吃', function (r) { return r.status === 'mustEat'; }],
      ['wish', '想去清單', function (r) { return r.status === 'wishlist'; }],
      ['cafe', '咖啡甜點', function (r) { return r.group === 'cafe'; }],
      ['fav', '已收藏', function (r) { return App.isFav(r.id); }],
      ['visited', '已造訪', function (r) { return r.status === 'visited'; }]
    ];
  }
  function matches(r, q) {
    if (!q) return true;
    q = q.toLowerCase();
    return [r.name, r.nameJa, r.type, r.area, r.recommend, r.description].join(' ').toLowerCase().indexOf(q) >= 0;
  }

  function card(r, i) {
    var st = STATUS[r.status] || STATUS.wishlist, fav = App.isFav(r.id);
    return '<article class="food-card">' +
      '<div class="food-photo" style="background:' + TINTS[i % TINTS.length] + '">' + (has(r.photo) ? '<img src="' + esc(r.photo) + '" alt="" loading="lazy">' : esc(r.type || 'Okinawa')) + '</div>' +
      '<div class="food-body">' +
        '<span class="food-name">' + esc(r.name) + '</span>' +
        (has(r.nameJa) ? '<span class="tiny muted">' + esc(r.nameJa) + '</span>' : '') +
        '<span class="tiny muted">' + esc([r.type, r.area, r.price].filter(has).join(' · ') || '—') + '</span>' +
        (has(r.recommend) ? '<span class="tiny">推薦：' + esc(r.recommend) + '</span>' : '') +
        '<div class="food-tags"><span class="pill ' + st[1] + '">' + st[0] + '</span>' +
          (r.day ? '<span class="pill blue">Day ' + esc(r.day) + '</span>' : '') +
          (r.needReservation && r.status !== 'reserved' ? '<span class="pill peach">需訂位</span>' : '') + '</div>' +
      '</div>' +
      '<button class="food-open" data-detail="' + esc(r.id) + '" aria-label="查看 ' + esc(r.name) + ' 詳細資訊"></button>' +
      '<button class="fav-btn" data-fav="' + esc(r.id) + '" aria-pressed="' + fav + '" aria-label="' + (fav ? '取消收藏' : '收藏') + ' ' + esc(r.name) + '">' + ic('heart', 18) + '</button>' +
    '</article>';
  }

  function listHtml() {
    var fk = S.get('food.filter', 'all'), F = filters(), f = F.filter(function (x) { return x[0] === fk; })[0] || F[0];
    var all = App.restaurants();
    var list = all.filter(f[2]).filter(function (r) { return matches(r, query); });
    return list.length ? '<div class="food-grid">' + list.map(card).join('') + '</div>'
      : '<div class="empty">' + (query ? '找不到「' + esc(query) + '」' : '這個分類還沒有餐廳') + '</div>';
  }

  App.register('food', {
    render: function () {
      var fk = S.get('food.filter', 'all'), all = App.restaurants();
      return '<header class="page-head"><div><span class="deco">Island Flavours</span><h1>美食</h1></div>' +
        '<button class="btn btn-outline" data-add>' + ic('plus', 16) + '新增餐廳</button></header>' +
        '<div class="section" style="margin-bottom:12px"><label class="search">' + ic('search', 18) + '<span class="sr-only">搜尋餐廳</span>' +
          '<input type="search" id="food-q" placeholder="搜尋餐廳、區域、餐點" value="' + esc(query) + '" autocomplete="off"></label></div>' +
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
        if (b.dataset.filter) { S.set('food.filter', b.dataset.filter); App.rerender(); }
        else if (b.hasAttribute('data-add')) edit(null);
        else if (b.dataset.fav) { var on = App.toggleFav(b.dataset.fav); U.toast(on ? '已收藏' : '已取消收藏'); App.rerender(); }
        else if (b.dataset.detail) detail(b.dataset.detail);
      });
      if (p[0] === 'r' && p[1]) setTimeout(function () { detail(p[1], true); }, 0);
    }
  });

  function detail(id, fromLink) {
    var r = App.restaurant(id); if (!r) { U.toast('找不到這間餐廳'); return; }
    var st = STATUS[r.status] || STATUS.wishlist;
    var q = r.mapQuery || r.address || r.nameJa || r.name;
    var rows = [['日文名稱', v(r.nameJa)], ['分類', v(r.type)], ['區域', v(r.area)], ['價格', v(r.price)], ['推薦餐點', v(r.recommend)],
      ['營業時間', v(r.hours)], ['地址', v(r.address)], ['電話', has(r.phone) ? '<a href="tel:' + esc(r.phone) + '">' + esc(r.phone) + '</a>' : v('')],
      ['菜單', v(r.menu)], ['預約資訊', v(r.reservationInfo)], ['停車', v(r.parking)], ['注意事項', v(r.notes, '—')]];
    var html = '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px"><span class="pill ' + st[1] + '">' + st[0] + '</span>' +
        (r.day ? '<span class="pill blue">安排在 Day ' + esc(r.day) + '</span>' : '<span class="pill sand">尚未安排日期</span>') +
        (r.needReservation ? '<span class="pill peach">需訂位</span>' : '') + (r.addedBy ? '<span class="pill sand">' + esc(r.addedBy) + '想去</span>' : '') + '</div>' +
      (has(r.description) ? '<p style="margin:0 0 12px">' + esc(r.description) + '</p>' : '') +
      '<dl class="kv">' + rows.map(function (x) { return '<dt>' + x[0] + '</dt><dd>' + x[1] + '</dd>'; }).join('') + '</dl>' +
      '<label class="field" style="margin-top:14px"><span>快速修改狀態</span><select id="quick-status">' + Object.keys(STATUS).map(function (k) {
        return '<option value="' + k + '"' + (k === r.status ? ' selected' : '') + '>' + STATUS[k][0] + '</option>'; }).join('') + '</select></label>' +
      '<div class="btn-row" style="margin-top:14px">' +
        '<a class="btn btn-primary" href="' + esc(U.dirUrl(q)) + '" target="_blank" rel="noopener">' + ic('nav', 16) + '導航</a>' +
        '<a class="btn" href="' + esc(U.mapsUrl(q)) + '" target="_blank" rel="noopener">' + ic('map', 16) + '地圖</a>' +
        (has(r.website) ? '<a class="btn" href="' + esc(r.website) + '" target="_blank" rel="noopener">' + ic('globe', 16) + '官網</a>' : '') +
      '</div>' +
      '<div class="btn-row" style="margin-top:8px"><button class="btn" id="edit-r">' + ic('edit', 16) + '編輯餐廳</button>' +
        (r.day ? '<a class="btn" href="#/home" id="goto-day">' + ic('home', 16) + '看 Day ' + esc(r.day) + ' 行程</a>' : '') + '</div>';
    var root = U.openSheet(r.name, html, { onClose: function () { if (fromLink) history.replaceState(null, '', '#/food'); } });
    root.querySelector('#quick-status').addEventListener('change', function (e) {
      r.status = e.target.value; App.saveRestaurant(r); U.toast('狀態已更新為「' + STATUS[r.status][0] + '」'); App.rerender();
    });
    root.querySelector('#edit-r').addEventListener('click', function () { edit(r); });
    var gd = root.querySelector('#goto-day');
    if (gd) gd.addEventListener('click', function () { App.selectDay(Number(r.day) - 1); });
  }

  function edit(r) {
    var isNew = !r;
    r = r || { id: S.uid('r'), status: 'wishlist', group: 'meal', needReservation: false, day: null };
    U.form({
      title: isNew ? '新增餐廳' : '編輯餐廳',
      fields: [
        { name: 'name', label: '餐廳名稱', value: r.name, required: true },
        { name: 'nameJa', label: '日文名稱', value: r.nameJa },
        { name: 'type', label: '餐廳分類', value: r.type, placeholder: '例如：燒肉、咖啡廳' },
        { name: 'group', label: '類型', type: 'select', value: r.group || 'meal', options: [['meal', '正餐'], ['cafe', '咖啡・甜點']] },
        { name: 'area', label: '區域', value: r.area },
        { name: 'status', label: '狀態', type: 'select', value: r.status, options: Object.keys(STATUS).map(function (k) { return [k, STATUS[k][0]]; }) },
        { name: 'needReservation', label: '需要訂位', type: 'checkbox', value: r.needReservation },
        { name: 'day', label: '安排在哪一天', type: 'select', value: r.day || '', options: [['', '尚未安排']].concat(T.days.map(function (d) { return [d.day, 'Day ' + d.day + '（' + U.md(d.date) + '）']; })) },
        { name: 'price', label: '價格區間', value: r.price, placeholder: '例如：¥2,000–3,000' },
        { name: 'recommend', label: '推薦餐點', value: r.recommend },
        { name: 'hours', label: '營業時間', value: r.hours },
        { name: 'address', label: '地址', value: r.address },
        { name: 'mapQuery', label: 'Google Maps 搜尋字', value: r.mapQuery, help: '填日文店名最準，留白會用名稱搜尋' },
        { name: 'phone', label: '電話', type: 'tel', value: r.phone },
        { name: 'website', label: '官方網站', type: 'url', value: r.website },
        { name: 'menu', label: '菜單', type: 'textarea', value: r.menu },
        { name: 'reservationInfo', label: '預約資訊', type: 'textarea', value: r.reservationInfo },
        { name: 'parking', label: '停車資訊', value: r.parking },
        { name: 'description', label: '介紹', type: 'textarea', value: r.description },
        { name: 'notes', label: '注意事項', type: 'textarea', value: r.notes }
      ],
      onSave: function (o) {
        o.day = o.day === '' ? null : Number(o.day);
        App.saveRestaurant(Object.assign({}, r, o)); U.toast(isNew ? '已新增餐廳' : '已儲存'); App.rerender();
      },
      onDelete: isNew ? null : function () { App.deleteRestaurant(r.id); U.toast('已刪除'); App.rerender(); },
      deleteConfirm: '確定要刪除「' + (r.name || '') + '」嗎？'
    });
  }
})();
