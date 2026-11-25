/* =========================================================
   沖繩蜜月旅行 · 旅程資料
   ---------------------------------------------------------
   ✏️ 要修改行程、餐廳、住宿、航班，只要改這個檔案。
   - 空字串 '' 代表「還沒有資料」，畫面會自動顯示「待補」。
   - mapQuery：Google Maps 搜尋用的關鍵字（日文名稱最準）。
   - placeId：Google 地點 ID，有填的話「地圖」會直接打開那一家，「導航」也會導到那一家，
     不會跳出搜尋清單。parkingPlaceId 有填的話，「導航」會改導到那個停車場。
   - time 格式為 'HH:MM'（24 小時制），填了之後「下一站」會依時間推算。
   ⚠️ 這個檔案會公開在 GitHub 上：
     訂位代號、預約編號、電話等私人資訊，請在網站裡的
     「編輯私人資訊」填寫（只存在你的手機裡），不要寫在這裡。
   ========================================================= */

window.TRIP = (function () {
  'use strict';

  // 行程項目的完整欄位（沒填的就是空白）
  function item(id, name, category, description, opts) {
    return Object.assign({
      id: id,
      time: '',            // 例如 '14:00'
      name: name,
      category: category,  // transport | sight | food | stay | shopping | rest
      description: description,
      duration: '',        // 建議停留時間，例如 '1.5 小時'
      address: '',         // 日文地址
      addressEn: '',       // 英文地址
      latitude: null,
      longitude: null,
      parking: '',
      parkingFee: '',
      hours: '',           // 營業時間
      ticket: '',          // 門票
      reservation: '',     // 預約方式
      notes: '',
      mapQuery: '',        // Google Maps 搜尋字
      navigationUrl: '',   // 若有固定連結可直接貼上（優先使用）
      placeId: '',         // Google 地點 ID（直接打開那一家）
      parkingPlaceId: '',  // 導航改導到這個停車場
      parkingName: '',     // 停車場名稱
      stayId: '',          // 旅館 Check in：對應下方 accommodations 的 id
      photos: [],          // 圖片路徑，例如 'images/sesoko.jpg'
      restaurantId: '',    // 對應下方 restaurants 的 id
      driveTime: '',       // 到下一站的車程，例如 '約 25 分'（留空就不顯示）
      driveDistance: '',   // 到下一站的距離，例如 '12 km'
      navigable: true      // false = 不需要導航（例如：上飛機）
    }, opts || {});
  }

  var days = [
    {
      id: 'd1', day: 1, date: '2027-03-02', weekday: '星期二', area: '那霸',
      theme: '啟程，飛向那霸，Buchi 燒肉',
      weather: { icon: '', status: '', temp: '', rain: '' },
      accommodationId: 'stay-naha-1',
      itinerary: [
        item('d1-1', '出發去機場', 'transport', '從家裡出發，車停第一航廈 P1 停車場', { mapQuery: '桃園國際機場 第一航廈 P1停車場', placeId: 'ChIJRe0zvkafQjQR1FqaR2m0fA8', parking: '第一航廈 P1 停車場（平面，約 912 位，靠台四線端）', addressEn: 'Terminal 1, Hangzhan S Rd, Dayuan District, Taoyuan City 337', hours: '24 小時', parkingFee: '第 1 小時 NT$30，之後每半小時 +NT$20，每日上限 NT$490（停 9 天約 NT$4,400）', notes: '星宇 JX870 11:40 從第一航廈起飛，建議 9:40 前到機場。P1 不能預約，看現場車位；滿了可改停第一航廈 P2。記得拍下停車區域，回國在停車場自動繳費機付款再出場' }),
        item('d1-2', '機場 Check in', 'transport', '辦理報到、托運行李', { navigable: false }),
        item('d1-3', '上飛機', 'transport', '星宇 JX870 桃園 T1 → 那霸，14:15 抵達（當地時間）', { time: '11:40', navigable: false }),
        item('d1-4', '抵達沖繩', 'transport', '那霸機場國際線入境', { time: '14:15',  mapQuery: '那覇空港', placeId: 'ChIJjSyLjsRp5TQRkP5WN6rOTFA', addressEn: '150 Kagamizu, Naha, Okinawa 901-0142', notes: '租車公司多在機場外，入境後到租車櫃台／接駁巴士站搭車去取車；入境大廳就有 Pork Tamago 飯糰' }),
        item('d1-5', '租車', 'transport', '取車並確認保險、ETC、油種', { mapQuery: '' , notes: '取車檢查清單在「交通 › 租車」', driveTime: '約 25 分' }),
        item('d1-6', '旅館 Check in', 'stay', '入住那霸歌町大和 Roynet 飯店 PREMIER', { stayId: 'stay-naha-1', driveTime: '約 10 分（也可搭單軌）' }),
        item('d1-7', '國際通 逛街', 'shopping', '第一晚散步、逛唐吉訶德、買伴手禮', { mapQuery: '国際通り 那覇', placeId: 'ChIJMS9BUXdp5TQRAl6RXvY5aY0', hours: '店家多 10:00–22:00 左右，唐吉訶德營業到深夜', duration: '2–3 小時', parking: '沿路多為收費停車場；也可搭單軌電車到「牧志」或「縣廳前」站', notes: '約 1.6 km 長的購物大街，旁邊巷子通往第一牧志公設市場與 Pork Tamago 飯糰本店', driveTime: '步行約 5 分' }),
        item('d1-8', '晚餐：Buchi 燒肉', 'food', '燒肉晚餐（2/1 開放訂位，18:40 場，保留 10 分鐘）', { restaurantId: 'r-buchi', time: '18:40' })
      ]
    },
    {
      id: 'd2', day: 2, date: '2027-03-03', weekday: '星期三', area: '那霸',
      theme: '魚市場與瀨長島的海風，涮涮鍋晚餐',
      weather: { icon: '', status: '', temp: '', rain: '' },
      accommodationId: 'stay-naha-1',
      itinerary: [
        item('d2-1', '午餐：系滿魚市場', 'food', '海鮮午餐', { restaurantId: 'r-itoman', driveTime: '約 15 分' }),
        item('d2-2', '瀨長島', 'sight', '海邊白色小鎮，看飛機起降', { mapQuery: '瀬長島ウミカジテラス', parkingPlaceId: 'ChIJ-TqfJ8Rp5TQRgox-4OQ8hwA', parkingName: '瀬長島 サンセットパーキング', parking: '瀨長島展望台附近停車（免費，車位不多）', addressEn: 'Senaga, Tomigusuku, Okinawa 901-0233', parkingFee: '免費', duration: '1.5–2 小時', notes: '白色小鎮「Umikaji Terrace」有很多餐廳甜點；島西邊展望台可近距離看飛機起降、看夕陽。停車場常滿，上坡處還有更多免費車位', driveTime: '約 30 分' }),
        item('d2-3', '玉泉洞', 'sight', '沖繩世界・鐘乳石洞', { mapQuery: '玉泉洞 おきなわワールド', placeId: 'ChIJa3ifUYVp5TQR3QZD1tyLml4', address: '沖縄県南城市玉城前川1336（おきなわワールド內）', hours: '9:00–17:30（最後入園 16:00）', ticket: '大人 ¥2,000（含玉泉洞與園區）', parking: '免費停車場約 400 台', parkingFee: '免費', duration: '2–3 小時', notes: '洞內開放約 890 m，潮濕地滑請穿好走的鞋；Super Eisa 太鼓表演約 10:30、12:30、14:30', driveTime: '約 40 分', needTicket: true, reservation: '【何時買】出發前 1–2 週網路買就好（不會賣完，主要省排隊、還有小折扣）。【怎麼買】KKday、Klook、HIS 等平台買「おきなわワールド 入園券」，網路價大人約 ¥1,900（現場 ¥2,000）；依平台指示出示 QR 碼或憑證換票。買了通常不能退。' }),
        item('d2-4', '晚餐：Shima Shabushabu Nakama 島', 'food', '涮涮鍋晚餐（建議訂位）', { restaurantId: 'r-nakama' })
      ]
    },
    {
      id: 'd3', day: 3, date: '2027-03-04', weekday: '星期四', area: '恩納村',
      theme: '北上恩納村，美國村散步',
      weather: { icon: '', status: '', temp: '', rain: '' },
      accommodationId: 'stay-onna',
      itinerary: [
        item('d3-1', '旅館 Check out', 'stay', '那霸住宿退房', { navigable: false, driveTime: '約 30 分' }),
        item('d3-2', '美國村', 'sight', '北谷海邊街區散步', { mapQuery: '美浜アメリカンビレッジ', placeId: 'ChIJzZoVCAUT5TQRzIueHYt83hs', addressEn: 'Mihama, Chatan, Nakagami District, Okinawa 904-0115', hours: '店家多 10:00–22:00', duration: '2–3 小時', parking: '大型免費町營停車場（約 1,500 台）', parkingFee: '免費', notes: 'ZHYVAGO 咖啡在這裡；傍晚到海邊看夕陽，摩天輪 11:00–22:00、一圈約 15 分鐘' }),
        item('d3-3', '午餐', 'food', '餐廳待決定', { navigable: false }),
        item('d3-4', '旅館 Check in', 'stay', '入住 BLISSTIA SUITES & RESORT', { stayId: 'stay-onna' })
      ]
    },
    {
      id: 'd4', day: 4, date: '2027-03-05', weekday: '星期五', area: '恩納村',
      theme: '什麼都不做的耍廢日',
      weather: { icon: '', status: '', temp: '', rain: '' },
      accommodationId: 'stay-onna',
      itinerary: [
        item('d4-1', '耍廢日', 'rest', '在飯店好好休息，享受海景', { navigable: false })
      ]
    },
    {
      id: 'd5', day: 5, date: '2027-03-06', weekday: '星期六', area: '北部',
      theme: '北上古宇利環島：海洋塔、蝦蝦飯與心型岩',
      weather: { icon: '', status: '', temp: '', rain: '' },
      accommodationId: 'stay-north',
      itinerary: [
        item('d5-1', '旅館 Check out', 'stay', '恩納村住宿退房', { navigable: false, driveTime: '約 35 分' }),
        item('d5-2', '許田休息站', 'shopping', '道之驛，沿途小歇', { mapQuery: '道の駅 許田', placeId: 'ChIJFfz3q_H_5DQRttsFg7-7wLE', addressEn: '17-1 Kyoda, Nago, Okinawa 905-0024', hours: '8:30–19:00', duration: '30–40 分鐘', parking: '道路兩側都有停車場，北上時停左側再走天橋過去', parkingFee: '免費', notes: '可買美麗海水族館優惠票；有天婦羅、沙翁、芒果冰；部分攤位只收現金', driveTime: '約 35 分' }),
        item('d6-1', '古宇利大橋', 'sight', '開車跨海兜風', { mapQuery: '古宇利大橋', placeId: 'ChIJyy0FRAhZ5DQRIfztLp8vdWc', addressEn: 'Kouri, Nakijin, Okinawa 905-0406', duration: '20–30 分鐘', parking: '過橋前右側「古宇利大橋南展望所」有停車場，可拍大橋全景', notes: '全長約 2 km，晴天中午海最藍；過橋右轉約 1 km 就是古宇利海洋塔', driveTime: '約 3 分' }),
        item('d6-4', '午餐：沖繩蝦蝦飯', 'food', '古宇利島蝦蝦飯（營業到 16:00，上島先吃）', { restaurantId: 'r-shrimp', driveTime: '步行約 2 分' }),
        item('d6-2', '古宇利島の駅 ソラハシ', 'shopping', '島上的休息站：伴手禮、冰淇淋、沙翁', { mapQuery: '古宇利島の駅 ソラハシ', placeId: 'ChIJncJ2hLVZ5DQRThAlpBtjD00', mapUrl: 'https://share.google/htBDdQVQR2aHsdqph', addressEn: '323-1 Kouri, Nakijin, Kunigami District, Okinawa 905-0406', hours: '9:00–19:00', phone: '0980-56-2128', duration: '30–40 分鐘', parking: '有停車場；車可以停這裡，走路去蝦蝦飯和始まりの洞窟', notes: '評價推薦沙翁（開口笑）和牛奶冰淇淋；有些島上才買得到的伴手禮；就在蝦蝦飯旁邊', driveTime: '步行約 8 分' }),
        item('d6-3', '始まりの洞窟（チグヌ浜）', 'sight', '海邊洞窟拍照，從ソラハシ走過去', { mapQuery: 'チグヌ浜 始まりの洞窟 古宇利島', placeId: 'ChIJtSw1wz9Z5DQRLL32XVrluEc', hours: '24 小時', duration: '20–30 分鐘', parking: '附近幾乎沒有停車位，車停ソラハシ走過去', notes: '下到海邊面向大海往右看，石頭和階梯之間有小洞窟入口；岩石很滑、沿路要走路邊，注意來車；也是看夕陽的好地方', driveTime: '走回ソラハシ取車，開車約 5 分' }),
        item('d6-1b', '古宇利海洋塔', 'sight', '海拔 82m 的觀景塔，看古宇利大橋全景', { mapQuery: '古宇利オーシャンタワー', placeId: 'ChIJEx3cOjJY5DQRJM-BcuwWU-g', address: '沖縄県国頭郡今帰仁村古宇利538', hours: '10:00–18:00（最後入館 17:30）', ticket: '大人 ¥1,000（含自動駕駛遊園車、貝殼博物館、觀景台）', parking: '停車場約 200 台', parkingFee: '免費', duration: '1 小時', notes: '過古宇利大橋右轉約 1 km 就到；搭自動駕駛遊園車上觀景台，餐廳有南瓜愛心鬆餅、拿坡里披薩', needTicket: true, reservation: '【何時買】出發前 1–2 週網路買就好。【怎麼買】古宇利海洋塔官網、VELTRA 或 KKday 事前購票，大人約 ¥900–1,000，現場出示憑證換票；也可以現場買。', driveTime: '約 5 分' }),
        item('d6-5', '心型岩 & 渡海沙灘', 'sight', '看心型岩、渡海沙灘', { mapQuery: 'ハートロック 古宇利島', placeId: 'ChIJf3Y9SjJY5DQRIZUnKV_U1Hg', addressEn: 'Kouri, Nakijin, Kunigami District, Okinawa 905-0406（Tinu Beach）', hours: '24 小時', duration: '40 分鐘–1 小時', parking: '沒有公共停車場，附近私人停車場約 ¥300', parkingFee: '約 ¥200–500', notes: '下到沙灘的步道又陡又滑，別穿夾腳拖；退潮時心型更清楚，出發前查潮汐；觀光客多，拍照要排隊', driveTime: '約 30 分' }),
        item('d5-4', '旅館 Check in', 'stay', '入住 Yukurina Resort Lemon House', { stayId: 'stay-north' })
      ]
    },
    {
      id: 'd6', day: 6, date: '2027-03-07', weekday: '星期日', area: '北部',
      theme: '美麗海水族館，悠閒的北部午後',
      weather: { icon: '', status: '', temp: '', rain: '' },
      accommodationId: 'stay-north',
      itinerary: [
        item('d5-3', '美麗海水族館', 'sight', '9:30 進場，早上人比較少', { mapQuery: '沖縄美ら海水族館', placeId: 'ChIJPZ5hUjH65DQR_p_dD3CmCOo', address: '沖縄県国頭郡本部町石川424（海洋博公園內）', hours: '8:30–18:30（最後入館 17:30）', ticket: '大人 ¥2,180；網路買電子票可掃 QR 直接入館', parking: '海洋博公園停車場', parkingFee: '免費', duration: '2–3 小時', notes: '重點是「黑潮之海」鯨鯊與鬼蝠魟；園區內海豚表演、海牛館、海龜館免費；人多時建議一開門就進場', needTicket: true, reservation: '【何時買】出發前 1–2 週網路買就好（不會賣完，主要省排隊）。【怎麼買】KKday、Klook、VELTRA 買「電子入館票」，入口直接掃 QR 碼進場，不用排售票口；大人 ¥2,180。也可以在當天經過的許田休息站買優惠票。買了不能退票。', time: '09:30' })
      ]
    },
    {
      id: 'd7', day: 7, date: '2027-03-08', weekday: '星期一', area: '北部 → 那霸',
      theme: '回到那霸，PARCO 與壽喜燒',
      weather: { icon: '', status: '', temp: '', rain: '' },
      accommodationId: 'stay-naha-2',
      itinerary: [
        item('d7-2', '旅館 Check out', 'stay', '北部住宿退房', { navigable: false, driveTime: '約 1 小時 20 分（走高速）' }),
        item('d7-3', '逛街：PARCO CITY', 'shopping', '浦添的購物中心', { mapQuery: 'サンエー浦添西海岸 PARCO CITY', placeId: 'ChIJxZQf9gpr5TQRwLWyT5Osigc', addressEn: '3-1-1 Irijima, Urasoe, Okinawa 901-2123', hours: '10:00–22:00', duration: '3 小時以上', parking: '大型停車場（假日找車位要等一下）', notes: '三層樓，有 UNIQLO、GU、無印、Daiso、ABC-Mart、LEGO 等；美食街看得到海景；退稅櫃台在 1F', driveTime: '約 20 分' }),
        item('d7-4', '旅館 Check in', 'stay', '入住 THE NEST 那霸', { stayId: 'stay-naha-2', driveTime: '步行約 10 分' }),
        item('d7-5', '晚餐：一心壽喜燒', 'food', '壽喜燒晚餐（需訂位）', { restaurantId: 'r-isshin' })
      ]
    },
    {
      id: 'd8', day: 8, date: '2027-03-09', weekday: '星期二', area: '那霸',
      theme: '那霸購物日',
      weather: { icon: '', status: '', temp: '', rain: '' },
      accommodationId: 'stay-naha-2',
      itinerary: [
        item('d8-1', '午餐：Paca Café', 'food', '午餐', { restaurantId: 'r-paca' }),
        item('d8-2', '豐崎百貨', 'shopping', 'iias 沖繩豐崎', { mapQuery: 'iias沖縄豊崎', placeId: 'ChIJj-bxt39p5TQRVVi5ETcWlRM', addressEn: '3-35 Toyosaki, Tomigusuku, Okinawa 901-0225', hours: '10:00–21:00', duration: '2–3 小時', parking: '室內停車場', parkingFee: '免費', notes: '豐崎 LOFT 在 3F；有 UNIQLO、GU、超市可買伴手禮；旁邊就是 Ashibinaa Outlet', driveTime: '步行約 5 分' }),
        item('d8-3', 'Ashibinaa Outlet', 'shopping', '沖繩 Outlet 購物', { mapQuery: '沖縄アウトレットモール あしびなー', placeId: 'ChIJ98yehgto5TQRJj4hYbNQH9U', addressEn: '1-188 Toyosaki, Tomigusuku, Okinawa 901-0225', hours: '10:00–20:00', duration: '2–3 小時', parking: '大型停車場', parkingFee: '免費', notes: '開放式 Outlet，離機場約 15 分鐘；有投幣置物櫃；逛完可走去隔壁 iias' })
      ]
    },
    {
      id: 'd9', day: 9, date: '2027-03-10', weekday: '星期三', area: '那霸',
      theme: '最後的早午餐，準備回家',
      weather: { icon: '', status: '', temp: '', rain: '' },
      accommodationId: '',
      itinerary: [
        item('d9-1', '早午餐', 'food', '餐廳待決定', { navigable: false }),
        item('d9-2', '還車', 'transport', '加滿油、檢查個人物品', { mapQuery: '' , notes: '還車檢查清單在「交通 › 租車」', driveTime: '接駁車約 10 分' }),
        item('d9-3', '出發去機場', 'transport', '星宇 JX871 15:25 起飛，16:10 抵達桃園 T1', { time: '13:00',  mapQuery: '那覇空港', placeId: 'ChIJjSyLjsRp5TQRkP5WN6rOTFA', addressEn: '150 Kagamizu, Naha, Okinawa 901-0142', notes: '國際線托運行李沒有自助機，櫃台排隊可能很久，建議起飛前 2.5–3 小時到；國際線美食街有 Pork Tamago 飯糰' })
      ]
    }
  ];

  var accommodations = [
    { id: 'stay-naha-1', name: '那霸歌町大和 Roynet 飯店 PREMIER', area: '那霸', checkIn: '14:00', checkOut: '11:00', address: '沖縄県那覇市おもろまち4-2-14', addressEn: '4-2-14 Omoromachi, Naha, Okinawa 900-0006', parking: '飯店內 D-Parking 機械式 40 台，每晚 ¥1,100，先到先停，在停車場直接付款；23:00–7:00 不能進出', notes: '單軌電車「おもろまち」站走路約 6 分；1F 有 7-11，對面是 DFS 免稅店和大型購物中心', phone: '098-862-5055', website: '', photo: '', mapQuery: '', placeId: 'ChIJ__Ak3T5r5TQR5GJXTBtBiNE' },
    { id: 'stay-onna', name: 'BLISSTIA SUITES & RESORT 沖繩恩納村', area: '恩納村', checkIn: '15:00', checkOut: '11:00', address: '沖縄県国頭郡恩納村前兼久497-6', addressEn: '497-6 Maeganeku, Onna, Kunigami District, Okinawa 904-0414', parking: '戶外停車場 124 台，每天 ¥1,000（最多 ¥2,000）', notes: '全房 50㎡ 以上附廚房與陽台；無邊際泳池、室內泳池、大浴場（6:00–10:00、16:00–23:00）；泳池旁 Lounge 12:00–22:00 有飲料暢飲', phone: '098-979-5177', website: '', photo: '', mapQuery: '', placeId: 'ChIJFepf2EIb5TQR6qfIYlX5wKw' },
    { id: 'stay-north', name: 'Yukurina Resort Okinawa Lemon House', area: '北部（本部町）', checkIn: '', checkOut: '', address: '', addressEn: '75-5 Yamakawa, Motobu, Kunigami District, Okinawa 905-0205', parking: '', notes: 'Google Maps 上有兩個同名地點，入住前請跟訂房資料確認地址；Yukurina 部分房型沒有櫃台、要到別處辦入住，請先看訂房確認信', phone: '0980-48-3903', website: '', photo: '', mapQuery: '', placeId: 'ChIJvaDVIdL75DQRBUVjMK-K_0s' },
    { id: 'stay-naha-2', name: 'THE NEST 那霸', area: '那霸', checkIn: '15:00', checkOut: '11:00', address: '沖縄県那覇市西1-6-1', addressEn: '1-6-1 Nishi, Naha, Okinawa 900-0036', parking: '飯店停車場每天約 ¥1,800（升降式，進出可能要等）', notes: '14F 有戶外泳池；單軌電車「旭橋」站走路約 4 分，國際通走路約 6 分', phone: '098-869-8015', website: '', photo: '', mapQuery: '', placeId: 'ChIJQ_4MyIpp5TQRhiteieLyayA' }
  ];

  // status：reserved 已預約 | planned 已安排 | mustEat 必吃 | wishlist 想去 | visited 已造訪
  // group：meal 正餐 | cafe 咖啡甜點
  function rest(id, name, opts) {
    return Object.assign({
      id: id, name: name, nameJa: '', type: '', area: '', price: '', recommend: '',
      status: 'wishlist', needReservation: false, hours: '', day: null, group: 'meal',
      description: '', address: '', phone: '', menu: '', reservationInfo: '', parking: '',
      notes: '', website: '', photo: '', mapQuery: '', addedBy: '',
      mapUrl: '', placeId: '', parkingPlaceId: '', parkingName: ''
    }, opts || {});
  }

  var restaurants = [
    rest('r-nakama', 'Shima Shabushabu Nakama 島', { type: '涮涮鍋', area: '那霸 久茂地', status: 'planned', needReservation: true, day: 2, mapQuery: 'Shima Shabu-Shabu NAKAMA', placeId: 'ChIJe1CMMnZp5TQRAdq6Ro0rUwI', price: '¥2,000–7,000', recommend: '阿古豬涮涮鍋吃到飽（石垣牛評價普通，選阿古豬就好）', hours: '11:30–15:00、17:00–22:30', address: '那霸市久茂地 3-3-1 B1', phone: '098-917-1529', description: '島野菜和湯頭很加分，豬肉新鮮帶甜味', notes: '冰淇淋要另外點；店員英文不太通，可用手指菜單', reservationInfo: '【何時訂】晚餐熱門，建議 2–3 週前訂；想坐沙發座一定要預約。【怎麼訂】Hot Pepper（ホットペッパーグルメ）網路訂位，可選「お席のみ」只訂位子或選套餐，例如阿古豬＋島野菜吃到飽 ¥5,280；或打電話 098-917-1529。' }),
    rest('r-itoman', '系滿魚市場', { nameJa: '糸満漁業協同組合 お魚センター', type: '海鮮', area: '系滿', status: 'planned', day: 2, mapQuery: '糸満漁業協同組合 お魚センター', placeId: 'ChIJnfH0IcJn5TQRFTMsWWcjFlg', parkingPlaceId: 'ChIJieT1IMJn5TQRwD1JYCP82ek', parkingName: '糸満魚市場 駐車場', parking: '魚市場旁免費停車場', price: '約 ¥1,500–3,000／人', recommend: '生魚片丼、海鮮丼、龍蝦或生蠔燒烤、海葡萄', hours: '9:00–18:00（週六日到 19:00）', address: '糸満市西崎町 4-19', phone: '098-992-2803', description: '十幾個海鮮攤位，買好在外面的座位區吃', notes: '部分攤位只收現金；自己找位子、擦桌子，帶濕紙巾；炸物放比較久不推' }),
    rest('r-buchi', 'Buchi 燒肉', { nameJa: 'ぶち 久茂地店', type: '燒肉', area: '那霸 久茂地', status: 'planned', needReservation: true, day: 1, mapQuery: 'Buchi Kumojiten', placeId: 'ChIJzcnA2ndp5TQRRkXi5c02uKk', notes: '週三公休（已改到 3/2 星期二）', price: '¥3,000–7,000', recommend: '和牛沙朗、無骨牛小排、沖繩和牛拼盤', hours: '17:00–22:00（週三公休）', address: '那霸市久茂地 3-12-1', phone: '098-943-6567', reservationInfo: '【何時訂】每月 1 日開放下個月的訂位，3/2 要在 2/1 訂，熱門時段很快滿，2/1 一開放就訂。【時段】固定時段：18:40（訂位只保留 10 分鐘，請準時到）。【怎麼訂】到官方 Instagram @buchi_kumoji，看個人檔案裡的預約連結；或直接私訊（DM），照店家格式提供：日期、姓名、人數、時段。', website: 'https://www.instagram.com/buchi_kumoji/' }),
    rest('r-shrimp', '沖繩蝦蝦飯', { type: '蝦飯', area: '古宇利島', status: 'planned', day: 5, mapQuery: 'KOURI SHRIMP', placeId: 'ChIJcep34MxZ5DQR5VjNV0a8HWg', price: '約 ¥2,000–2,500／份', recommend: '辣味蒜香奶油蝦、原味蒜香蝦；可加點 Onaha 牛、沖繩薯條', hours: '11:00–16:00', address: '今帰仁村古宇利 314', phone: '0980-56-1242', parking: '有停車場，有人指揮', description: '夏威夷風蒜香蝦，3F 露台看海', notes: '平板點餐，1F 拿飲料、2F 拿餐；一份份量大，兩人可分食；可刷卡', reservationInfo: '不接受訂位，現場排隊（翻桌快）' }),
    rest('r-isshin', '一心壽喜燒', { type: '壽喜燒', area: '那霸 久茂地', status: 'planned', needReservation: true, day: 7, mapQuery: 'Oniku no Isshin', placeId: 'ChIJLcZbI5xp5TQRtD4FrGpXwws', price: '¥5,000–10,000', recommend: '阿古豬或和牛壽喜燒套餐（最後加烏龍麵或蕎麥麵）', hours: '週一 18:00–22:00、其他 14:00–22:00（週三公休）', address: '那霸市久茂地 1-5-1', phone: '098-866-0736', description: '老闆會在桌邊幫忙煮第一輪', notes: '3/8 是星期一，18:00 才開；菜單只有日文／中文，店員會說英文', reservationInfo: '【何時訂】建議 2–3 週前訂（3/8 星期一 18:00 才開）。【怎麼訂】TableCheck 網路訂位，有中文介面，直接選日期、時間、人數就好；或打電話 098-866-0736。', website: 'https://www.tablecheck.com/isshin-okinawa' }),
    rest('r-paca', 'Paca Café', { type: '咖啡廳', area: '', status: 'planned', day: 8, group: 'cafe' }),
    rest('r-zhyvago', 'Zhyvago Coffee Roastery', { type: '咖啡', area: '美國村', group: 'cafe', addedBy: '心萱', mapQuery: 'ZHYVAGO COFFEE ROASTERY', placeId: 'ChIJh4EKsv4T5TQRU-h2svXc5tk', price: '¥1,000 以內', recommend: '冷萃咖啡、提拉米蘇、起司蛋糕、Mad Chocolate Shake', hours: '7:00–22:00', address: '北谷町美浜 34-1', phone: '098-988-7833', description: '美國村海邊的紅磚咖啡館，2F 陽台看海' }),
    rest('r-applepie', '蘋果派', { type: '甜點', area: '機場', group: 'cafe', addedBy: '心萱' }),
    rest('r-aw', 'A&W 漢堡', { type: '漢堡', area: '浦添 牧港', addedBy: '心萱', mapQuery: 'A&W 牧港店', placeId: 'ChIJk5jkbZxs5TQR9YajcZ3aWXw', price: '¥1,000–2,000', recommend: '麥根沙士漂浮（沙士可免費續杯）、捲捲薯條、洋蔥圈', hours: '6:00–凌晨 2:00', address: '浦添市牧港 4-9-1', phone: '098-876-6081', description: '1969 年開的復古得來速，超好拍', notes: '觀光客多，點餐可能要排 30 分鐘；只想吃 A&W 可去其他分店（國際通也有）' }),
    rest('r-hama', 'Hama 壽司', { type: '壽司', area: '那霸 古島', addedBy: '心萱', mapQuery: 'はま寿司 那覇古島店', placeId: 'ChIJ0bDIk-hr5TQRtvrRQOAyur0', price: '¥1,000–2,000', recommend: '沖繩限定握壽司、多種醬油可選', hours: '10:00–凌晨 5:00', address: '那霸市古島 1-25-3', phone: '0570-001-689', description: '平價迴轉壽司連鎖', notes: '入口機台抽號碼；平板點餐可切換中文' }),
    rest('r-kokuto', '黑糖飲料店', { type: '飲料', area: '沖繩北部', group: 'cafe', addedBy: '心萱' }),
    rest('r-pork', 'Pork Tamago 飯糰', { type: '飯糰', area: '那霸 牧志', addedBy: '心萱', mapQuery: 'ポークたまごおにぎり 牧志市場本店', placeId: 'ChIJRX9edXpp5TQRRGYawVc2Jmk', price: '約 ¥400–800／個', recommend: '炸蝦塔塔醬飯糰、苦瓜天婦羅、油味噌', hours: '7:00–20:00', address: '那霸市松尾 2-8-35', phone: '098-867-9550', description: '現點現做的沖繩國民飯糰', notes: '早上常大排長龍；內用座位在隔壁另一間；那霸機場國內線、國際線也有分店' })
  ];

  // 航班：bookingRef、ticketUrl 屬於私人資訊，請在網站內填寫
  var flights = {
    outbound: { airline: '星宇航空 STARLUX', flightNo: 'JX870', aircraft: 'A350-900', duration: '1 小時 35 分', date: '2027-03-02', depTime: '11:40', arrTime: '14:15', from: 'TPE', fromName: '桃園國際機場', fromTerminal: '第一航廈', to: 'OKA', toName: '那霸機場', toTerminal: '國際線航廈', cabin: '經濟艙', baggage: '托運 23kg × 1', baggageNote: '每人：托運 1 件 23kg（長＋寬＋高 158cm 內）；手提行李 1 件（56×36×23cm）＋個人物品 1 件（30×40×10cm，放前方座位下），兩件合計 7kg', checkinNote: '時間都是當地時間（沖繩比台灣快 1 小時）。建議 9:40 前到桃園機場第一航廈辦理報到' },
    'return': { airline: '星宇航空 STARLUX', flightNo: 'JX871', aircraft: 'A330-900neo', duration: '1 小時 45 分', date: '2027-03-10', depTime: '15:25', arrTime: '16:10', from: 'OKA', fromName: '那霸機場', fromTerminal: '國際線航廈', to: 'TPE', toName: '桃園國際機場', toTerminal: '第一航廈', cabin: '經濟艙', baggage: '托運 23kg × 1', baggageNote: '每人：托運 1 件 23kg（長＋寬＋高 158cm 內）；手提行李 1 件（56×36×23cm）＋個人物品 1 件（30×40×10cm，放前方座位下），兩件合計 7kg', checkinNote: '那霸國際線托運沒有自助機、排隊可能很久，建議 12:30 前還車、13:00 前到機場' }
  };

  var rentalCar = {
    company: '', pickupDate: '2027-03-02', pickupTime: '', pickupPlace: '那霸', returnDate: '2027-03-10', returnTime: '', returnPlace: '那霸',
    carModel: '', insurance: '', fuel: '', etc: '', address: '', mapQuery: '', notes: '',
    pickupFlow: '', returnFlow: '', fuelRule: ''
  };

  var emergency = {
    numbers: [
      { label: '警察', number: '110' },
      { label: '救護車・消防', number: '119' },
      { label: '外交部旅外急難救助（台灣 24 小時）', number: '+886-800-085-095' }
    ],
    taiwanOffice: { name: '台北駐日經濟文化代表處 那霸分處', phone: '098-862-7008', address: '沖縄県那覇市久茂地3-15-9 アルテビル那覇 6F（平日 9:00–12:00、13:00–18:00）', emergencyPhone: '080-8056-0122' },
    insurance: { company: '', policyNote: '', phone: '' }
  };

  // 日本自駕提醒（一般常識，可自行增修）
  var drivingTips = [
    '日本靠左行駛，駕駛座在右邊',
    '看到「止まれ」標誌必須完全停車',
    '加油時告訴店員「レギュラー、満タン」＝一般汽油加滿（以租車公司規定為準）',
    '發生事故：先確認安全 → 報警 110 → 聯絡租車公司'
  ];

  var stamps = ['飛機', '海洋', '海灘', '夕陽', '鯨魚', '古宇利大橋', '海龜', '沖繩花朵', '蜜月'];

  return {
    title: '沖繩蜜月旅行',
    subtitle: 'Okinawa, with Love',
    couple: { a: 'Jimmy', b: 'Shenny' },
    startDate: '2027-03-02',
    endDate: '2027-03-10',
    weatherLocation: { name: '那霸', latitude: 26.2124, longitude: 127.6809 },
    days: days,
    accommodations: accommodations,
    restaurants: restaurants,
    flights: flights,
    rentalCar: rentalCar,
    emergency: emergency,
    drivingTips: drivingTips,
    stamps: stamps
  };
})();
