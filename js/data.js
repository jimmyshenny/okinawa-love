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
        item('d1-1', '桃園國際機場 第一航廈', 'transport', '9:30 抵達機場，車停第一航廈 P1 停車場', { time: '09:30', mapQuery: '桃園國際機場 第一航廈 P1停車場', placeId: 'ChIJRe0zvkafQjQR1FqaR2m0fA8', parking: '第一航廈 P1 停車場（平面，約 912 位，靠台四線端）', addressEn: 'Terminal 1, Hangzhan S Rd, Dayuan District, Taoyuan City 337', hours: '24 小時', parkingFee: '第 1 小時 NT$30，之後每半小時 +NT$20，每日上限 NT$490（停 9 天約 NT$4,400）', notes: '星宇 JX870 11:40 從第一航廈起飛，9:30 到機場。P1 不能預約，看現場車位；滿了可改停第一航廈 P2。記得拍下停車區域，回國在停車場自動繳費機付款再出場' }),
        item('d1-1b', '線上報到', 'transport', '星宇官網線上報到、取得登機證', { navigable: false, link: 'https://www.starlux-airlines.com/zh-TW/check-in-fly/check-in-now/online-check-in', linkLabel: '星宇線上報到', notes: '起飛前 48–1 小時開放（2/28 11:40 起就能辦），建議出門前先辦好，省去櫃台排隊。有托運行李的話，要在起飛 1 小時前（10:40 前）完成托運。登機門和登機時間可能更改，到機場再確認一次' }),
        item('d1-2', '機場 Check in', 'transport', '辦理報到、托運行李', { navigable: false, baggageTips: 'outbound', notes: '出發前兩人都要先填好 Visit Japan Web，把入境 QR Code 截圖存在手機裡（詳見「工具 › 出發準備」）' }),
        item('d1-3', '上飛機', 'transport', '星宇 JX870 桃園 T1 → 那霸，14:15 抵達（當地時間）', { time: '11:40', navigable: false, notes: '登機時間以登機證上印的為準。一般起飛前 30–40 分鐘開始登機、約 15–20 分鐘前關閉登機門，建議 11:00 前到登機門。機上全程不能用行動電源，手機先充飽' }),
        item('d1-4', '抵達沖繩', 'transport', '那霸機場國際線入境', { time: '14:15',  mapQuery: '那覇空港', placeId: 'ChIJjSyLjsRp5TQRkP5WN6rOTFA', addressEn: '150 Kagamizu, Naha, Okinawa 901-0142', notes: '租車公司多在機場外，入境後到租車櫃台／接駁巴士站搭車去取車；入境大廳就有 Pork Tamago 飯糰' }),
        item('d1-5', '租車', 'transport', '取車並確認保險、ETC、油種', { mapQuery: '' , notes: '取車檢查清單在「交通 › 租車」', driveTime: '約 25 分' }),
        item('d1-6', '旅館 Check in', 'stay', '入住 HOTEL AZAT 那霸', { stayId: 'stay-naha-1', driveTime: '約 10 分（也可搭單軌）' }),
        item('d1-7', '國際通 逛街', 'shopping', '第一晚散步、逛唐吉訶德、買伴手禮', { mapQuery: '国際通り 那覇', placeId: 'ChIJMS9BUXdp5TQRAl6RXvY5aY0', hours: '店家多 10:00–22:00 左右，唐吉訶德營業到深夜', duration: '2–3 小時', parking: '沿路多為收費停車場；也可搭單軌電車到「牧志」或「縣廳前」站', notes: '約 1.6 km 長的購物大街，旁邊巷子通往第一牧志公設市場與 Pork Tamago 飯糰本店', driveTime: '步行約 3 分', nearby: [{ name: '唐吉訶德 那霸壺川店', q: 'ドン・キホーテ 那覇壺川店', placeId: 'ChIJ34qmQV5p5TQR8a3NXd0fmR0', note: '營業到凌晨 3:00，比國際通店大、人比較少；從國際通開車約 10 分' }] }),
        item('d1-8', '晚餐：Buchi 燒肉', 'food', '燒肉晚餐（2/1 開放訂位，18:40 場，保留 10 分鐘）', { restaurantId: 'r-buchi', time: '18:40' })
      ]
    },
    {
      id: 'd2', day: 2, date: '2027-03-03', weekday: '星期三', area: '那霸',
      theme: '瀨長島的海風、魚市場午餐，涮涮鍋晚餐',
      weather: { icon: '', status: '', temp: '', rain: '' },
      accommodationId: 'stay-naha-1',
      itinerary: [
        item('d2-2', '瀨長島', 'sight', '海邊白色小鎮，看飛機起降', { mapQuery: '瀬長島ウミカジテラス', parkingPlaceId: 'ChIJ-TqfJ8Rp5TQRgox-4OQ8hwA', parkingName: '瀬長島 サンセットパーキング', parking: '瀨長島展望台附近停車（免費，車位不多）', addressEn: 'Senaga, Tomigusuku, Okinawa 901-0233', parkingFee: '免費', duration: '1.5–2 小時', notes: '白色小鎮「Umikaji Terrace」有很多餐廳甜點；島西邊展望台可近距離看飛機起降、看夕陽。停車場常滿，上坡處還有更多免費車位', driveTime: '約 15 分' }),
        item('d2-1', '午餐：系滿魚市場', 'food', '海鮮午餐', { restaurantId: 'r-itoman', driveTime: '約 25 分' }),
        item('d2-3', '玉泉洞', 'sight', '沖繩世界・鐘乳石洞', { mapQuery: '玉泉洞 おきなわワールド', placeId: 'ChIJa3ifUYVp5TQR3QZD1tyLml4', address: '沖縄県南城市玉城前川1336（おきなわワールド內）', hours: '9:00–17:30（最後入園 16:00）', ticket: '大人 ¥2,000（含玉泉洞與園區）', parking: '免費停車場約 400 台', parkingFee: '免費', duration: '2–3 小時', notes: '洞內開放約 890 m，潮濕地滑請穿好走的鞋；Super Eisa 太鼓表演約 10:30、12:30、14:30', driveTime: '約 35 分', needTicket: true, reservation: '【何時買】出發前 1–2 週網路買就好（不會賣完，主要省排隊、還有小折扣）。【怎麼買】KKday、Klook、HIS 等平台買「おきなわワールド 入園券」，網路價大人約 ¥1,900（現場 ¥2,000）；依平台指示出示 QR 碼或憑證換票。買了通常不能退。' }),
        item('d2-3b', '回旅館', 'stay', '回 HOTEL AZAT 休息一下，再出門吃晚餐', { stayId: 'stay-naha-1', driveTime: '約 10 分' }),
        item('d2-4', '晚餐：Shima Shabushabu Nakama 島', 'food', '涮涮鍋晚餐（約 1/3 開放訂位，訂 19:30）', { restaurantId: 'r-nakama', time: '19:30' })
      ]
    },
    {
      id: 'd3', day: 3, date: '2027-03-04', weekday: '星期四', area: '恩納村',
      theme: 'A&W 午餐、美國村散步，jam 鐵板燒晚餐',
      weather: { icon: '', status: '', temp: '', rain: '' },
      accommodationId: 'stay-onna',
      itinerary: [
        item('d3-1', '旅館 Check out', 'stay', '那霸住宿退房', { navigable: false, driveTime: '約 30 分' }),
        item('d3-3', '午餐：A&W 牧港店', 'food', '復古得來速漢堡，麥根沙士漂浮', { restaurantId: 'r-aw', driveTime: '約 30 分' }),
        item('d3-2', '美國村', 'sight', '北谷海邊街區散步', { mapQuery: '美浜アメリカンビレッジ', placeId: 'ChIJzZoVCAUT5TQRzIueHYt83hs', addressEn: 'Mihama, Chatan, Nakagami District, Okinawa 904-0115', hours: '店家多 10:00–22:00', duration: '2–3 小時', parking: '大型免費町營停車場（約 1,500 台）', parkingFee: '免費', notes: 'ZHYVAGO 咖啡在這裡；傍晚到海邊看夕陽，摩天輪 11:00–22:00、一圈約 15 分鐘', driveTime: '約 35 分', nearby: [{ name: 'ZHYVAGO COFFEE ROASTERY', q: 'ZHYVAGO COFFEE ROASTERY', placeId: 'ChIJh4EKsv4T5TQRU-h2svXc5tk', note: '就在美國村海邊，冷萃咖啡和提拉米蘇；2F 陽台看海' }] }),
        item('d3-4', '旅館 Check in', 'stay', '入住 BLISSTIA SUITES & RESORT', { stayId: 'stay-onna', driveTime: '約 10 分' }),
        item('d3-5', '晚餐：STEAK HOUSE jam', 'food', '鐵板燒牛排套餐，份量很大', { restaurantId: 'r-jam', time: '18:30' })
      ]
    },
    {
      id: 'd4', day: 4, date: '2027-03-05', weekday: '星期五', area: '恩納村',
      theme: '耍廢日：濱之家午餐、Yanbaru Meat 晚餐',
      weather: { icon: '', status: '', temp: '', rain: '' },
      accommodationId: 'stay-onna',
      itinerary: [
        item('d4-1', '耍廢日', 'rest', '在飯店好好休息，享受海景', { navigable: false, nearby: [{ name: '青之洞窟', q: '青の洞窟 真栄田岬', placeId: 'ChIJFSBnObgb5TQRQA1ByAocZog', note: '離飯店開車約 10 分；要浮潛或潛水需參加付費行程，不下水的話可以在真榮田岬步道看海' }, { name: '永旺夢樂城沖繩來客夢', q: 'イオンモール沖縄ライカム', placeId: 'ChIJJ_TSFGIS5TQRa_HkdjGALss', note: '離飯店開車約 35 分；有寶可夢中心、LOFT、大水族箱，10:00–22:00' }] }),
        item('d4-l', '午餐：濱之家 Hamanoya', 'food', '整條魚料理，奶油香煎最有名', { restaurantId: 'r-hamanoya', time: '11:00' }),
        item('d4-2', '晚餐：Yanbaru Meat', 'food', '牛排和西式小菜，飯店附近', { restaurantId: 'r-yanbaru', time: '18:30' })
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
        item('d6-4', '午餐：沖繩蝦蝦飯', 'food', '古宇利島蝦蝦飯（可用 App 先點餐，營業到 16:00）', { restaurantId: 'r-shrimp', driveTime: '步行約 2 分' }),
        item('d6-2', '古宇利島の駅 ソラハシ', 'shopping', '島上的休息站：伴手禮、冰淇淋、沙翁', { mapQuery: '古宇利島の駅 ソラハシ', placeId: 'ChIJncJ2hLVZ5DQRThAlpBtjD00', mapUrl: 'https://share.google/htBDdQVQR2aHsdqph', addressEn: '323-1 Kouri, Nakijin, Kunigami District, Okinawa 905-0406', hours: '9:00–19:00', phone: '0980-56-2128', duration: '30–40 分鐘', parking: '有停車場；車可以停這裡，走路去蝦蝦飯和始まりの洞窟', notes: '評價推薦沙翁（開口笑）和牛奶冰淇淋；有些島上才買得到的伴手禮；就在蝦蝦飯旁邊', driveTime: '步行約 8 分' }),
        item('d6-3', '始まりの洞窟（チグヌ浜）', 'sight', '海邊洞窟拍照，從ソラハシ走過去', { mapQuery: 'チグヌ浜 始まりの洞窟 古宇利島', placeId: 'ChIJtSw1wz9Z5DQRLL32XVrluEc', hours: '24 小時', duration: '20–30 分鐘', parking: '附近幾乎沒有停車位，車停ソラハシ走過去', notes: '下到海邊面向大海往右看，石頭和階梯之間有小洞窟入口；岩石很滑、沿路要走路邊，注意來車；也是看夕陽的好地方', driveTime: '走回ソラハシ取車，開車約 5 分' }),
        item('d6-1b', '古宇利海洋塔', 'sight', '海拔 82m 的觀景塔，看古宇利大橋全景', { mapQuery: '古宇利オーシャンタワー', placeId: 'ChIJEx3cOjJY5DQRJM-BcuwWU-g', address: '沖縄県国頭郡今帰仁村古宇利538', hours: '10:00–18:00（最後入館 17:30）', ticket: '大人 ¥1,000（含自動駕駛遊園車、貝殼博物館、觀景台）', parking: '停車場約 200 台', parkingFee: '免費', duration: '1 小時', notes: '過古宇利大橋右轉約 1 km 就到；搭自動駕駛遊園車上觀景台，餐廳有南瓜愛心鬆餅、拿坡里披薩', needTicket: true, reservation: '【何時買】出發前 1–2 週網路買就好。【怎麼買】古宇利海洋塔官網、VELTRA 或 KKday 事前購票，大人約 ¥900–1,000，現場出示憑證換票；也可以現場買。', driveTime: '約 5 分' }),
        item('d6-5', '心型岩 & 渡海沙灘', 'sight', '看心型岩、渡海沙灘', { mapQuery: 'ハートロック 古宇利島', placeId: 'ChIJf3Y9SjJY5DQRIZUnKV_U1Hg', addressEn: 'Kouri, Nakijin, Kunigami District, Okinawa 905-0406（Tinu Beach）', hours: '24 小時', duration: '40 分鐘–1 小時', parking: '沒有公共停車場，附近私人停車場約 ¥300', parkingFee: '約 ¥200–500', notes: '下到沙灘的步道又陡又滑，別穿夾腳拖；退潮時心型更清楚，出發前查潮汐；觀光客多，拍照要排隊。到 Yukurina 開車約 30 分，旅館櫃台 18:00 關，最晚 17:20 前離開', driveTime: '約 30 分' }),
        item('d5-4', '旅館 Check in', 'stay', '入住 Yukurina Resort Lemon House（櫃台到 18:00，要在這之前到）', { stayId: 'stay-north', driveTime: '約 5 分' }),
        item('d5-5', '晚餐：ゆくるば', 'food', '備瀬的阿古豬涮涮鍋', { restaurantId: 'r-yukuruba' })
      ]
    },
    {
      id: 'd6', day: 6, date: '2027-03-07', weekday: '星期日', area: '北部',
      theme: '美麗海水族館、福木林道與島豆腐晚餐',
      weather: { icon: '', status: '', temp: '', rain: '' },
      accommodationId: 'stay-north',
      itinerary: [
        item('d5-3', '美麗海水族館', 'sight', '9:30 進場，早上人比較少', { mapQuery: '沖縄美ら海水族館', placeId: 'ChIJPZ5hUjH65DQR_p_dD3CmCOo', address: '沖縄県国頭郡本部町石川424（海洋博公園內）', hours: '8:30–18:30（最後入館 17:30）', ticket: '大人 ¥2,180；網路買電子票可掃 QR 直接入館', parking: '海洋博公園停車場', parkingFee: '免費', duration: '2–3 小時', notes: '重點是「黑潮之海」鯨鯊與鬼蝠魟；園區內海豚表演、海牛館、海龜館免費；人多時建議一開門就進場', needTicket: true, reservation: '【何時買】出發前 1–2 週網路買就好（不會賣完，主要省排隊）。【怎麼買】KKday、Klook、VELTRA 買「電子入館票」，入口直接掃 QR 碼進場，不用排售票口；大人 ¥2,180。也可以在當天經過的許田休息站買優惠票。買了不能退票。', time: '09:30', driveTime: '園區內步行約 10 分' }),
        item('d6-a', '翡翠海灘', 'sight', '水族館旁的白沙灘，散步拍照', { mapQuery: 'エメラルドビーチ 海洋博公園', placeId: 'ChIJk4Fw-Dn65DQRkdNLoaBpJLI', duration: '30–40 分鐘', parking: '在海洋博公園內，車可以繼續停水族館的停車場走過去', parkingFee: '免費', notes: '11 月到 3 月不開放游泳，散步拍照就好；海水很清、沙子很細，沒有遮蔭記得防曬。海牛館旁邊的樓梯往下還有一個小沙灘', driveTime: '約 5 分' }),
        item('d6-l', '午餐：ふくぎ屋', 'food', '福木林道裡的沖繩麵', { restaurantId: 'r-fukugiya', driveTime: '步行即到' }),
        item('d6-b', '備瀬福木林道', 'sight', '福木樹蔭下的老村落散步', { mapQuery: '備瀬のフクギ並木', placeId: 'ChIJ6z_osjv65DQRNpoSOgG1iqM', hours: '24 小時', duration: '1–1.5 小時', parking: '村子入口有幾個小停車場，免費的不好找，收費的約 ¥500', notes: '整條走完來回約 1 小時，可以租腳踏車或電動滑板車；路上有小咖啡店和紅豆冰（ぜんざい）；走到底是海邊，很適合看夕陽；蚊子多，記得防蚊', driveTime: '約 15 分' }),
        item('d6-d', '晚餐：沖縄そばと島どうふ TOPU', 'food', '自製島豆腐和沖繩麵，在地平價', { restaurantId: 'r-topu', nearby: [{ name: 'Kana Sando', q: '金三度 本部', placeId: 'ChIJZzzV9db75DQR_Qu5FvKwjKo', note: '家庭沖繩居酒屋，18:00–23:00；父子現場表演三線和民謠，最後可以上台拍照' }, { name: '居酒屋 琉波', q: '居酒屋 琉波 本部', placeId: 'ChIJVwIHiDT75DQRuMmWfCAB9sI', note: '在地人常來，17:00–22:30；推薦炸雞、鮮蝦春捲、牛肉豆腐味噌炒' }, { name: 'やまちゃん', q: 'やまちゃん 本部 山川', placeId: 'ChIJv3AtLtP75DQR5oXZ5rdFFTk', note: '就在飯店旁，18:00–20:20；超平價，推薦炸雞（菜單 30 號）、苦瓜炒；日文菜單、只收現金' }] })
      ]
    },
    {
      id: 'd7', day: 7, date: '2027-03-08', weekday: '星期一', area: '北部 → 那霸',
      theme: 'MOKULELE 早午餐，回那霸逛 PARCO、吃壽喜燒',
      weather: { icon: '', status: '', temp: '', rain: '' },
      accommodationId: 'stay-naha-2',
      itinerary: [
        item('d7-1', '早午餐：MOKULELE', 'food', '海景早午餐，吃完再回飯店退房', { restaurantId: 'r-mokulele', driveTime: '約 7 分', nearby: [{ name: 'Fruit Cafe（備案）', q: 'Fruit Cafe 本部 健堅', placeId: 'ChIJsyj2qff75DQRPu6gcxt4XA4', note: '9:00–15:00，看得到海和瀨底大橋，巴西莓碗、法式吐司；只收日幣現金；在往南回那霸的路上' }] }),
        item('d7-2', '旅館 Check out', 'stay', '北部住宿退房', { navigable: false, driveTime: '約 1 小時 20 分（走高速）' }),
        item('d7-3', '逛街：PARCO CITY', 'shopping', '浦添的購物中心', { mapQuery: 'サンエー浦添西海岸 PARCO CITY', placeId: 'ChIJxZQf9gpr5TQRwLWyT5Osigc', addressEn: '3-1-1 Irijima, Urasoe, Okinawa 901-2123', hours: '10:00–22:00', duration: '3 小時以上', parking: '大型停車場（假日找車位要等一下）', notes: '三層樓，有 UNIQLO、GU、無印、Daiso、ABC-Mart、LEGO 等；美食街看得到海景；退稅櫃台在 1F', driveTime: '約 20 分' }),
        item('d7-4', '旅館 Check in', 'stay', '入住 Hotel Torifito 那霸旭橋', { stayId: 'stay-naha-2', driveTime: '步行約 15 分（開車約 5 分）' }),
        item('d7-5', '晚餐：一心壽喜燒', 'food', '壽喜燒晚餐（2/1 開放訂位，18:00 場）', { restaurantId: 'r-isshin', time: '18:00' })
      ]
    },
    {
      id: 'd8', day: 8, date: '2027-03-09', weekday: '星期二', area: '那霸',
      stayAction: { label: '星宇線上報到', url: 'https://www.starlux-airlines.com/zh-TW/check-in-fly/check-in-now/online-check-in' },
      theme: '那霸購物日，HAMA 壽司收尾',
      weather: { icon: '', status: '', temp: '', rain: '' },
      accommodationId: 'stay-naha-2',
      itinerary: [
        item('d8-1', '午餐：POCO CAFE', 'food', '沖繩家常菜午餐（塔可飯、沖繩麵）', { restaurantId: 'r-poco', driveTime: '約 30 分' }),
        item('d8-2', '豐崎百貨', 'shopping', 'iias 沖繩豐崎', { mapQuery: 'iias沖縄豊崎', placeId: 'ChIJj-bxt39p5TQRVVi5ETcWlRM', addressEn: '3-35 Toyosaki, Tomigusuku, Okinawa 901-0225', hours: '10:00–21:00', duration: '2–3 小時', parking: '室內停車場', parkingFee: '免費', notes: '豐崎 LOFT 在 3F；有 UNIQLO、GU、超市可買伴手禮；旁邊就是 Ashibinaa Outlet', driveTime: '步行約 5 分', nearby: [{ name: '豐崎 LOFT', q: '豊崎ロフト', placeId: 'ChIJH8VZ7Ilp5TQRVKVM97AdiUA', note: '就在 iias 3F，文具、雜貨、美妝' }] }),
        item('d8-3', 'Ashibinaa Outlet', 'shopping', '沖繩 Outlet 購物', { mapQuery: '沖縄アウトレットモール あしびなー', placeId: 'ChIJ98yehgto5TQRJj4hYbNQH9U', addressEn: '1-188 Toyosaki, Tomigusuku, Okinawa 901-0225', hours: '10:00–20:00', duration: '2–3 小時', parking: '大型停車場', parkingFee: '免費', notes: '開放式 Outlet，離機場約 15 分鐘；有投幣置物櫃；逛完可走去隔壁 iias', driveTime: '約 40 分（傍晚可能塞車）' }),
        item('d8-4', '晚餐：HAMA 壽司', 'food', '迴轉壽司晚餐，平板點餐可切中文', { restaurantId: 'r-hama' })
      ]
    },
    {
      id: 'd9', day: 9, date: '2027-03-10', weekday: '星期三', area: '那霸',
      theme: '最後的早午餐，準備回家',
      weather: { icon: '', status: '', temp: '', rain: '' },
      accommodationId: '',
      itinerary: [
        item('d9-1', '早午餐：Grill&Pancake RISE', 'food', '美式鬆餅早午餐，吃完去還車', { restaurantId: 'r-rise' }),
        item('d9-2', '還車', 'transport', '加滿油、檢查個人物品', { mapQuery: '' , notes: '還車檢查清單在「交通 › 租車」', driveTime: '接駁車約 10 分' }),
        item('d9-3', '那霸空港', 'transport', '13:00 抵達機場；星宇 JX871 15:25 起飛，16:10 抵達桃園 T1', { time: '13:00',  mapQuery: '那覇空港', placeId: 'ChIJjSyLjsRp5TQRkP5WN6rOTFA', addressEn: '150 Kagamizu, Naha, Okinawa 901-0142', notes: '國際線櫃台沒有自助托運機、可能排很久，建議 13:00 前到機場。到了先辦退稅，再報到托運' }),
        item('d9-4', '退稅（海關確認）', 'transport', '托運行李前，先到海關 KIOSK 確認退稅商品', { navigable: false, reservation: '', notes: '到機場第一件事：帶著所有退稅商品和護照，到國際線出發大廳的海關 KIOSK 刷護照（或連上機場退稅專用 Wi-Fi，用 Visit Japan Web 線上辦）。顯示要檢查的話，把商品拿給海關看。確認完才能托運，托運後就不能補辦。同一張收據的商品要全部帶著，少一件整張不能退。退款依購物店家的方式（信用卡等）；出境後 2F 有「Self Tax Refund」機器可領現金（看店家是否使用這個服務），領現金可能另收手續費' }),
        item('d9-5', '線上報到', 'transport', '星宇官網線上報到、取得登機證', { navigable: false, link: 'https://www.starlux-airlines.com/zh-TW/check-in-fly/check-in-now/online-check-in', linkLabel: '星宇線上報到', notes: '起飛前 48–1 小時開放（3/8 15:25 起就能辦），可以前一天先在飯店辦好。有托運行李的話，要在起飛 1 小時前（14:25 前）完成托運。登機門和登機時間可能更改，到機場再確認一次' }),
        item('d9-6', '機場 Check in', 'transport', '櫃台托運行李、安檢、出境', { navigable: false, baggageTips: 'return', notes: '托運前確認退稅已辦完；行李額度：托運 23kg × 1、手提 7kg（手提＋個人物品合計），伴手禮買多了要注意重量' }),
        item('d9-7', '上飛機', 'transport', '星宇 JX871 那霸 → 桃園 T1，16:10 抵達', { time: '15:25', navigable: false, notes: '登機時間以登機證上印的為準。一般起飛前 30–40 分鐘開始登機、約 15–20 分鐘前關閉登機門，建議 14:45 前到登機門。辦完退稅和托運就直接入關，出境後要排安檢和證照查驗' })
      ]
    }
  ];

  var accommodations = [
    { id: 'stay-naha-1', name: 'HOTEL AZAT 那霸（那霸阿扎特飯店）', area: '那霸', checkIn: '15:00', checkOut: '11:00', address: '沖縄県那覇市安里2-8-8', addressEn: '2-8-8 Asato, Naha, Okinawa 902-0067', parking: '飯店 1F 的「D-Parking 安里2丁目第2」（不是飯店直營），每天 ¥1,500，有空位才能停；買票後只要開出去就算用完，滿了要停附近收費停車場', notes: '單軌電車「安里」站走路 30 秒，國際通走路約 3 分；櫃台在 3F，24 小時有人。訂的是「Comfort Queen」本館禁菸房（14㎡、一張大床），金省專案，不含早餐、有免費 Wi-Fi。想吃飯店早餐可以現場加購：自助餐 7:00–10:00（3F Cafe Victoria）。大廳有免費咖啡，對面有 24 小時超市。2027/2/27 00:00（沖繩時間）前可免費取消；2/27–2/28 取消只能部分退款；3/1 00:00 起不可退款', phone: '098-863-0888', website: '', photo: '', mapQuery: 'ホテルアザット那覇', placeId: '' },
    { id: 'stay-onna', name: 'BLISSTIA SUITES & RESORT 沖繩恩納村', area: '恩納村', checkIn: '15:00', checkOut: '11:00', address: '沖縄県国頭郡恩納村前兼久497-6', addressEn: '497-6 Maeganeku, Onna, Kunigami District, Okinawa 904-0414', parking: '戶外停車場 124 台，每天 ¥1,000（最多 ¥2,000）', notes: '全房 50㎡ 以上附廚房與陽台；無邊際泳池、室內泳池、大浴場（6:00–10:00、16:00–23:00）；泳池旁 Lounge 12:00–22:00 有飲料暢飲', phone: '098-979-5177', website: '', photo: '', mapQuery: '', placeId: 'ChIJFepf2EIb5TQR6qfIYlX5wKw' },
    { id: 'stay-north', name: 'Yukurina Resort Okinawa Lemon House', area: '北部（本部町）', checkIn: '15:00–18:00', checkOut: '11:00', address: '', addressEn: '75-5 Yamakawa, Motobu, Kunigami District, Okinawa 905-0205', parking: '', notes: '⚠️ 櫃台只到 18:00，最晚 18:00 前要辦好入住，會晚到一定要先聯絡飯店。訂的是「標準房」，2 晚都含早餐、免費 Wi-Fi。2027/2/11 00:00（沖繩時間）前可免費取消，之後不可退款（入住前 23 天內取消或沒入住都要付全額）。Google Maps 上有兩個同名地點，出發前請跟確認信核對地址', phone: '0980-48-3903', website: '', photo: '', mapQuery: '', placeId: 'ChIJvaDVIdL75DQRBUVjMK-K_0s' },
    { id: 'stay-naha-2', name: 'Hotel Torifito 那霸旭橋（托麗芙特酒店）', area: '那霸', checkIn: '14:00–24:00', checkOut: '11:00', address: '沖縄県那覇市西1-11-19', addressEn: '1-11-19 Nishi, Naha, Okinawa 900-0036', parking: '飯店室內立體停車場約 28 台，每晚約 ¥1,500–1,800，不能預約；滿了要停附近的收費停車場', notes: '訂的是「舒適雙人房」，不含餐、禁菸房；房內有保險箱、空氣清淨機、電熱水壺。入住前 14 天前（約 2027/2/22 前）可免費取消，之後取消要付全額（以訂房確認信為準）。單軌電車「旭橋」站走路約 8 分，國際通、波之上海灘走路可到；早餐自助餐 6:30–10:00（另外付費）', phone: '098-860-6430', website: '', photo: '', mapQuery: 'ホテル・トリフィート那覇旭橋', placeId: '' },
  ];

  // status：reserved 已預約 | planned 已安排 | mustEat 必吃 | wishlist 想去 | visited 已造訪
  // group：meal 正餐 | cafe 咖啡甜點
  // reserveOn：開放訂位、要去訂的日期（YYYY-MM-DD），顯示在「工具 → 重要預約」
  function rest(id, name, opts) {
    return Object.assign({
      id: id, name: name, nameJa: '', type: '', area: '', price: '', recommend: '',
      status: 'wishlist', needReservation: false, hours: '', day: null, group: 'meal',
      description: '', address: '', phone: '', menu: '', reservationInfo: '', reserveOn: '', parking: '',
      notes: '', website: '', photo: '', mapQuery: '', addedBy: '',
      mapUrl: '', placeId: '', parkingPlaceId: '', parkingName: ''
    }, opts || {});
  }

  var restaurants = [
    rest('r-nakama', 'Shima Shabushabu Nakama 島', { type: '涮涮鍋', area: '那霸 久茂地', status: 'planned', needReservation: true, reserveOn: '2027-01-03', day: 2, mapQuery: 'Shima Shabu-Shabu NAKAMA', placeId: 'ChIJe1CMMnZp5TQRAdq6Ro0rUwI', price: '¥2,000–7,000', recommend: '阿古豬涮涮鍋吃到飽（石垣牛評價普通，選阿古豬就好）', hours: '11:30–15:00、17:00–22:30', address: '那霸市久茂地 3-3-1 B1', phone: '098-917-1529', description: '島野菜和湯頭很加分，豬肉新鮮帶甜味', notes: '冰淇淋要另外點；店員英文不太通，可用手指菜單', reservationInfo: '【何時訂】網路訂位大約開放到 2 個月後（11/25 時已經可以訂到 1/23），3/3 大概 1/3 左右就能訂，開放後就先訂（我們訂 19:30）。想坐沙發座一定要預約。【怎麼訂】TORETA 網路訂位（點「官網」按鈕），可選「只訂位子」或套餐，例如阿古豬＋島野菜吃到飽 ¥5,280；或打電話 098-917-1529。', website: 'https://shabushabu-nakama.toreta.at/select' }),
    rest('r-itoman', '系滿魚市場', { nameJa: '糸満漁業協同組合 お魚センター', type: '海鮮', area: '系滿', status: 'planned', day: 2, mapQuery: '糸満漁業協同組合 お魚センター', placeId: 'ChIJnfH0IcJn5TQRFTMsWWcjFlg', parkingPlaceId: 'ChIJieT1IMJn5TQRwD1JYCP82ek', parkingName: '糸満魚市場 駐車場', parking: '魚市場旁免費停車場', price: '約 ¥1,500–3,000／人', recommend: '生魚片丼、海鮮丼、龍蝦或生蠔燒烤、海葡萄', hours: '9:00–18:00（週六日到 19:00）', address: '糸満市西崎町 4-19', phone: '098-992-2803', description: '十幾個海鮮攤位，買好在外面的座位區吃', notes: '部分攤位只收現金；自己找位子、擦桌子，帶濕紙巾；炸物放比較久不推' }),
    rest('r-buchi', 'Buchi 燒肉', { nameJa: 'ぶち 久茂地店', type: '燒肉', area: '那霸 久茂地', status: 'planned', needReservation: true, reserveOn: '2027-02-01', day: 1, mapQuery: 'Buchi Kumojiten', placeId: 'ChIJzcnA2ndp5TQRRkXi5c02uKk', notes: '週三公休（已改到 3/2 星期二）', price: '¥3,000–7,000', recommend: '和牛沙朗、無骨牛小排、沖繩和牛拼盤', hours: '17:00–22:00（週三公休）', address: '那霸市久茂地 3-12-1', phone: '098-943-6567', reservationInfo: '【何時訂】每月 1 日開放下個月的訂位，3/2 要在 2/1 訂，熱門時段很快滿，2/1 一開放就訂。【時段】固定時段：18:40（訂位只保留 10 分鐘，請準時到）。【怎麼訂】到官方 Instagram @buchi_kumoji，看個人檔案裡的預約連結；或直接私訊（DM），照店家格式提供：日期、姓名、人數、時段。', website: 'https://www.instagram.com/buchi_kumoji/' }),
    rest('r-shrimp', '沖繩蝦蝦飯', { type: '蝦飯', area: '古宇利島', status: 'planned', day: 5, mapQuery: 'KOURI SHRIMP', placeId: 'ChIJcep34MxZ5DQR5VjNV0a8HWg', price: '約 ¥2,000–2,500／份', recommend: '辣味蒜香奶油蝦、原味蒜香蝦；可加點 Onaha 牛、沖繩薯條', hours: '11:00–16:00', address: '今帰仁村古宇利 314', phone: '0980-56-1242', parking: '有停車場，有人指揮', description: '夏威夷風蒜香蝦，3F 露台看海', notes: '建議前一天先下載 KOURI SHRIMP App，用 App 點餐、選取餐時間（3/6 約 13:00）；現場點的話是平板點餐，1F 拿飲料、2F 拿餐；一份份量大，兩人可分食；可刷卡', reservationInfo: '可以先用「KOURI SHRIMP」官方 App 線上點餐：線上刷卡付款，並選擇取餐時間，到店直接取餐，不用排隊點餐。內用座位不能訂，到了再找位子。' }),
    rest('r-isshin', '一心壽喜燒', { type: '壽喜燒', area: '那霸 久茂地', status: 'planned', needReservation: true, reserveOn: '2027-02-01', day: 7, mapQuery: 'Oniku no Isshin', placeId: 'ChIJLcZbI5xp5TQRtD4FrGpXwws', price: '¥5,000–10,000', recommend: '阿古豬或和牛壽喜燒套餐（最後加烏龍麵或蕎麥麵）', hours: '14:00–22:00（週三公休；3/8 週一 Google Maps 顯示 18:00 開）', address: '那霸市久茂地 1-5-1', phone: '098-866-0736', description: '老闆會在桌邊幫忙煮第一輪', notes: '週三公休；標示價格不含消費稅，另收桌位費每人 ¥300；最後點餐 21:00；菜單只有日文／中文，店員會說英文', reservationInfo: '【何時訂】應該是 2/1 開放 3 月的訂位，2/1 一開放就訂（跟 Buchi 同一天）。【時段】固定 4 個時段：14:00、16:00、18:00、20:00，每場最多 1 小時 45 分鐘；3/8 星期一 Google Maps 顯示 18:00 才開，所以訂 18:00 場。【怎麼訂】TableCheck 中文訂位頁（點「官網」按鈕），或寫信到 isshin.okinawa3855@gmail.com、打電話 098-866-0736。取消和變更規定以預約時顯示的為準。', website: 'https://www.tablecheck.com/zh-TW/isshin-okinawa/reserve/message' }),
    rest('r-poco', 'POCO CAFE', { nameJa: 'POCO CAFE OKINAWA', type: '沖繩料理・咖啡', area: '那霸 牧志', status: 'planned', day: 8, mapQuery: 'POCO CAFE OKINAWA 牧志', placeId: 'ChIJ9-mXA3pp5TQRaDZ2b2Fz7bo', price: '¥1,000–2,000', recommend: '塔可飯＋沖繩麵套餐（A Set，附飲料）、咖哩飯、紅芋甜點、果昔', hours: '10:00–24:00', address: '那霸市牧志 1-3-62 2F', phone: '098-988-9980', description: '國際通旁的 2 樓小店，可以坐吧台或榻榻米，份量剛好、價格親民', notes: '在國際通附近，停車要找收費停車場；從飯店開車約 13 分、走路約 25 分，或搭單軌電車到牧志站', reservationInfo: '不用預約' }),
    rest('r-zhyvago', 'Zhyvago Coffee Roastery', { type: '咖啡', area: '美國村', group: 'cafe', addedBy: '心萱', mapQuery: 'ZHYVAGO COFFEE ROASTERY', placeId: 'ChIJh4EKsv4T5TQRU-h2svXc5tk', price: '¥1,000 以內', recommend: '冷萃咖啡、提拉米蘇、起司蛋糕、Mad Chocolate Shake', hours: '7:00–22:00', address: '北谷町美浜 34-1', phone: '098-988-7833', description: '美國村海邊的紅磚咖啡館，2F 陽台看海' }),
    rest('r-applepie', '蘋果派', { type: '甜點', area: '機場', group: 'cafe', addedBy: '心萱' }),
    rest('r-aw', 'A&W 牧港店', { type: '漢堡', area: '浦添 牧港', status: 'planned', day: 3, addedBy: '心萱', mapQuery: 'A&W 牧港店', placeId: 'ChIJk5jkbZxs5TQR9YajcZ3aWXw', price: '¥1,000–2,000', recommend: '麥根沙士漂浮（沙士可免費續杯）、捲捲薯條、洋蔥圈', hours: '6:00–凌晨 2:00', address: '浦添市牧港 4-9-1', phone: '098-876-6081', description: '1969 年開的復古得來速，超好拍', notes: '觀光客多，點餐可能要排 30 分鐘；只想吃 A&W 可去其他分店（國際通也有）' }),
    rest('r-hama', 'HAMA 壽司 古島店', { type: '壽司', area: '那霸 古島', status: 'planned', day: 8, addedBy: '心萱', mapQuery: 'はま寿司 那覇古島店', placeId: 'ChIJ0bDIk-hr5TQRtvrRQOAyur0', price: '¥1,000–2,000', recommend: '沖繩限定握壽司、多種醬油可選', hours: '10:00–凌晨 5:00', address: '那霸市古島 1-25-3', phone: '0570-001-689', description: '平價迴轉壽司連鎖', notes: '入口機台抽號碼；平板點餐可切換中文', reservationInfo: '不用訂位，到店在入口機台抽號碼牌。晚餐尖峰（18:00–20:00）可能要等，想少排隊可以用 Hama 壽司官方 App 先線上取號／預約時段' }),
    rest('r-kokuto', '黑糖飲料店', { type: '飲料', area: '沖繩北部', group: 'cafe', addedBy: '心萱' }),
    rest('r-pork', 'Pork Tamago 飯糰', { type: '飯糰', area: '那霸 牧志', addedBy: '心萱', mapQuery: 'ポークたまごおにぎり 牧志市場本店', placeId: 'ChIJRX9edXpp5TQRRGYawVc2Jmk', price: '約 ¥400–800／個', recommend: '炸蝦塔塔醬飯糰、苦瓜天婦羅、油味噌', hours: '7:00–20:00', address: '那霸市松尾 2-8-35', phone: '098-867-9550', description: '現點現做的沖繩國民飯糰', notes: '早上常大排長龍；內用座位在隔壁另一間；那霸機場國內線、國際線也有分店' }),
    rest('r-rise', 'Grill&Pancake RISE', { type: '早午餐・鬆餅', area: '那霸 鏡原', status: 'planned', day: 9, group: 'cafe', mapQuery: 'Grill&Pancake RISE', placeId: 'ChIJ9_PYOABp5TQRlynY01fe_6k', price: '¥1,000–2,000', recommend: '香草風味鬆餅、厚切培根和香腸、阿古豬墨西哥餅配太陽蛋', hours: '8:00–15:00（週一、週二公休）', address: '那霸市鏡原町 3-7 101', phone: '080-2573-0322', description: '叢林風小店的美式早餐，份量大，評分 4.9', notes: '3/10 是星期三，有營業；在往機場的方向，吃完去還車很順', reservationInfo: '不用預約' }),
    rest('r-jam', 'STEAK HOUSE jam', { nameJa: '鉄板焼ステーキハウス jam', type: '鐵板燒牛排', area: '恩納村 富着', status: 'planned', needReservation: true, reserveOn: '2027-01-04', day: 3, mapQuery: '鉄板焼ステーキハウス jam 恩納', placeId: 'ChIJRXd-q8sa5TQRoWgWK5sNhII', price: '套餐約 ¥3,300–9,500', recommend: '牛排＆大蝦套餐 ¥4,500、菲力套餐 ¥3,300、牛排＆龍蝦 ¥6,000、石垣牛沙朗套餐 ¥9,500', hours: '17:00–22:00（週六日中午也有營業）', address: '恩納村富着 1518', phone: '098-965-2626', description: '南洋海盜風的鐵板燒店，師傅在面前現煎，有 50 種以上套餐', notes: '份量很大（套餐一人約 300g），胃口小可以選小份量的套餐；開頭有咖哩湯，最後有扶桑花果凍；從 BLISSTIA 開車約 10 分', reservationInfo: '【何時訂】2 個月前開放訂位，3/4 大約 1/4 就能訂，開放後就先訂（我們訂 18:30）。【怎麼訂】食べログ（Tabelog）中文訂位頁（點「官網」按鈕），或打電話 098-965-2626。', website: 'https://s.tabelog.com/tw/okinawa/A4703/A470303/47000080/?tb_from_lang_modal=1' }),
    rest('r-mokulele', 'MOKULELE', { nameJa: 'カフェ モクレレ', type: '早午餐', area: '本部 大濱', status: 'planned', day: 7, group: 'cafe', mapQuery: 'MOKULELE 本部', placeId: 'ChIJNycQX4H75DQRCgY25zensgY', price: '約 ¥1,000–1,500', recommend: '塔可飯套餐、法式吐司套餐、夏威夷風 poke 碗、現打果汁', hours: '7:00–14:00', address: '本部町大濱 872-9', phone: '080-6499-3331', description: '沖繩電視節目介紹過的人氣早餐店，夏威夷風，陽台位看得到海', notes: '盡量坐陽台；份量很足；備案是 Fruit Cafe（9:00–15:00，只收現金）', reservationInfo: '不用預約' }),
    rest('r-hamanoya', '濱之家 Hamanoya', { nameJa: '浜の家', type: '海鮮・整條魚', area: '恩納村 仲泊', status: 'planned', day: 4, mapQuery: '浜の家 恩納村', placeId: 'ChIJRfq8yKAa5TQRqpJVaPpJhR4', price: '午餐平均約 ¥2,000', recommend: '整條魚奶油香煎（鐵板上桌）、炸魚、海鮮定食', hours: '11:00–21:30（最後點餐 20:00，無公休）', address: '恩納村仲泊 2097', phone: '098-965-0870', description: '恩納村的老字號海鮮餐廳，評分 4.4、3,500 多則評論', notes: '從 BLISSTIA 開車約 10 分，有專用停車場 13 台；有英文菜單、座敷和掘りごたつ座位；老闆是退休漁夫，自己挑魚', reservationInfo: '不訂位，直接去。店很大（約 125 席），11:00 一開門就到最保險；想臨時訂可以打 098-965-0870 或用 SAVOR JAPAN（點「官網」按鈕）', website: 'https://savorjapan.com/0006017782/map' }),
    rest('r-yanbaru', 'Yanbaru Meat', { type: '牛排・西式小菜', area: '恩納村 前兼久', status: 'planned', needReservation: true, reserveOn: '2027-01-05', day: 4, mapQuery: 'Yanbaru Meat 恩納', placeId: 'ChIJ0wPjcMoa5TQROmbpLullsko', price: '約 ¥3,000–5,000', recommend: '夏多布里昂、沙朗牛排、蒸豬肉、蒜香炒飯、凱薩沙拉', hours: '17:00–24:00（週三、週日公休）', address: '恩納村前兼久 858-1 2F', phone: '098-923-3915', description: '氣氛熱鬧的牛排小酒館，評分 4.7，店員親切', notes: '跟 BLISSTIA 同一區，可以走路或開車幾分鐘', reservationInfo: '【何時訂】2 個月前開放訂位，3/5 大約 1/5 就能訂，開放後就先訂（我們訂 18:30）。【怎麼訂】TableCheck 訂位頁（點「官網」按鈕，跟沖繩料理しまぶた屋同一個頁面，選 Yanbaru Meat），或打電話 098-923-3915。', website: 'https://www.tablecheck.com/shops/shimabutaya/reserve' }),
    rest('r-yukuruba', 'ゆくるば', { nameJa: 'ゆくるば｜カフェ & あぐー豚しゃぶしゃぶ', type: '阿古豬涮涮鍋・咖啡', area: '本部 備瀬', status: 'planned', needReservation: true, reserveOn: '2027-01-06', day: 5, mapQuery: 'ゆくるば 備瀬', placeId: 'ChIJiSmQpjv65DQR_4gb3c97PIc', price: '約 ¥2,000–4,000', recommend: '阿古豬涮涮鍋、芒果汁', hours: '11:00–16:00、17:00–22:00', address: '本部町備瀬 403', phone: '0980-43-1271', parking: '店門口有停車位', description: '福木林道旁被綠樹包圍的小店，白天是咖啡廳、晚上吃涮涮鍋', notes: '離 Yukurina 開車約 5 分', reservationInfo: '【何時訂】2 個月前開放訂位，3/6 大約 1/6 就能訂，開放後就先訂。【怎麼訂】食べログ（Tabelog）中文訂位頁（點「官網」按鈕），或打電話 0980-43-1271。', website: 'https://s.tabelog.com/tw/okinawa/A4702/A470202/47031589/?tb_from_lang_modal=1' }),
    rest('r-fukugiya', 'ふくぎ屋', { nameJa: 'ふくぎ屋', type: '沖繩麵・定食', area: '本部 備瀬', status: 'planned', day: 6, mapQuery: 'ふくぎ屋 備瀬', placeId: 'ChIJbYkXrjv65DQRMcI12696IAY', price: '約 ¥1,000–1,500', recommend: '限定的海藻（アーサ）沖繩麵、排骨沖繩麵、苦瓜炒、塔可飯、芒果汁', hours: '11:30–14:30（週四公休）', address: '本部町備瀬 388-3', phone: '0980-43-5001', description: '就在福木林道裡，往翡翠海灘的路上，在地人也常來', notes: '14:30 就關門，逛完海灘先來吃再散步林道', reservationInfo: '不用預約' }),
    rest('r-topu', '沖縄そばと島どうふ TOPU', { nameJa: '沖縄そばと島どうふ【TOPU】', type: '沖繩麵・島豆腐', area: '本部 濱元', status: 'planned', day: 6, mapQuery: '沖縄そばと島どうふ TOPU', placeId: 'ChIJBwhDebv75DQRcEJjtmWX6I4', price: '約 ¥1,000–1,500', recommend: '島豆腐沖繩麵、三種豆腐套餐、花生豆腐、炸雞、薑燒豬肉、炸麵團甜點', hours: '11:00–15:00、17:00–21:00（週二公休，週一只有中午）', address: '本部町濱元 233', phone: '0980-43-4390', description: '自己做島豆腐的老派小店，評分 4.6，豆腐又輕又綿', notes: '只收現金；招牌在路邊不明顯，看到機車行就要減速；對向車道不能右轉進去', reservationInfo: '不用預約' }),
  ];

  // 航班：bookingRef、ticketUrl 屬於私人資訊，請在網站內填寫
  var flights = {
    outbound: { airline: '星宇航空 STARLUX', flightNo: 'JX870', aircraft: 'A350-900', duration: '1 小時 35 分', date: '2027-03-02', depTime: '11:40', arrTime: '14:15', from: 'TPE', fromName: '桃園國際機場', fromTerminal: '第一航廈', to: 'OKA', toName: '那霸機場', toTerminal: '國際線航廈', cabin: '經濟艙', baggage: '托運 23kg × 1', baggageNote: '每人：托運 1 件 23kg（長＋寬＋高 158cm 內）；手提行李 1 件（56×36×23cm）＋個人物品 1 件（30×40×10cm，放前方座位下），兩件合計 7kg', checkinNote: '時間都是當地時間（沖繩比台灣快 1 小時）。建議 9:30 到桃園機場第一航廈辦理報到' },
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

  // 入境・退稅（2026/11 起日本免稅改為「先付含稅價、出境退稅」）
  var travelGuide = {
    esim: {
      name: 'KKday 日本 eSIM（Docomo／KDDI／SoftBank／樂天）',
      url: 'https://www.kkday.com/zh-tw/product/137689',
      tips: [
        '兩人各買一張，選 9 天方案（3/2–3/10）；買之前確認方案的「天數」是算日曆天還是 24 小時',
        '買之前確認手機支援 eSIM；買了不能取消退款',
        'iPhone 更新到 iOS 17.4 以上、用 KKday App 可以一鍵安裝',
        '出發前在台灣有 Wi-Fi 時先安裝好，到沖繩落地再打開「數據漫遊」並切換成這張 eSIM',
        '可以開熱點分享給另一支手機，萬一其中一張有問題可以互相支援'
      ]
    },
    // 搭機行李規定（行程「機場 Check in」「出發去機場」與工具頁共用）
    baggageRules: {
      carryOnOnly: [
        '行動電源、備用鋰電池：不能托運。每人最多 2 個、160Wh 以下（100Wh 以下最保險），要看得到 Wh 標示；機上全程禁用、不能充電，不能放頭頂行李櫃',
        '電子菸、打火機（打火機限 1 個，隨身帶）',
        '筆電、相機、平板等電子產品與貴重物品'
      ],
      checkedOnly: [
        '超過 100ml 的液體：保養品、防曬乳、泡盛、醬料、果醬等',
        '刀子、剪刀、指甲刀等尖銳物品'
      ],
      carryOnLiquids: '手提的液體每瓶 100ml 以下，全部裝進 1 個 1 公升以內的透明夾鏈袋',
      bringBackBanned: [
        '豬肉和含豬肉的食品（午餐肉、阿古豬肉乾、Pork Tamago 飯糰等），違規罰 20 萬',
        '含肉食品：含肉飯糰、三明治、雞皮零食、雞肉蛋白棒',
        '所有生鮮水果（飛機餐的水果也不行）、溫泉蛋、溏心蛋',
        '藥品、錠狀保健食品：每種最多 12 件，合計不超過 36 件'
      ]
    },
    visitJapanWeb: [
      '出發前 1–2 週到 Visit Japan Web 官網註冊（網址認明 vjw.digital.go.jp），兩人都要各自登錄',
      '登錄護照、航班（JX870 3/2 那霸）、第一晚住宿（HOTEL AZAT 那霸）',
      '填完「入境審查」和「海關申報」，會拿到一組合併的 QR Code',
      '把 QR Code 截圖存在手機，落地後入境審查和海關都出示這組 QR Code'
    ],
    taxRefund: [
      '買東西時先付含稅價格，結帳時出示護照，並在店裡登記退款方式（信用卡等）',
      '同一張收據的商品要全部帶出境，只要其中一件用掉或沒帶，整張收據都不能退',
      '3/10 到那霸機場：先到出發大廳的海關 KIOSK 刷護照（或用 Visit Japan Web 線上辦），再去托運行李',
      '被判定要檢查的話，要把商品拿給海關看，所以退稅商品先不要放進托運行李',
      '海關確認後，由購物的店家或退稅業者退款；那霸機場出境後 2F 有「Self Tax Refund」機器可以直接領現金（要看店家是否使用這個服務）',
      '手續費依店家而定：唐吉訶德等宣布不收退稅手續費，但在機場領日圓現金可能另收費用'
    ]
  };

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
    travelGuide: travelGuide,
    stamps: stamps
  };
})();
