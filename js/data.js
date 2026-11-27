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
      departDrive: '',     // 連住日：從飯店出發到這一站的車程（顯示在這站上方）
      driveTime: '',       // 到下一站的車程，例如 '約 25 分'（留空就不顯示）
      driveDistance: '',   // 到下一站的距離，例如 '12 km'
      navigable: true      // false = 不需要導航（例如：上飛機）
    }, opts || {});
  }

  var days = [
    {
      id: 'd1', day: 1, date: '2027-03-02', weekday: '星期二', area: '那霸',
      theme: '啟程，奔赴沖繩',
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
      theme: '瀨長島海風漫遊',
      weather: { icon: '', status: '', temp: '', rain: '' },
      accommodationId: 'stay-naha-1',
      itinerary: [
        item('d2-2', '瀨長島', 'sight', '海邊白色小鎮，看飛機起降', { mapQuery: '瀬長島ウミカジテラス', parkingPlaceId: 'ChIJ-TqfJ8Rp5TQRgox-4OQ8hwA', parkingName: '瀬長島 サンセットパーキング', departDrive: '約 25 分', parking: '瀨長島展望台附近停車（免費，車位不多）', addressEn: 'Senaga, Tomigusuku, Okinawa 901-0233', parkingFee: '免費', duration: '1.5–2 小時', notes: '白色小鎮「Umikaji Terrace」有很多餐廳甜點；島西邊展望台可近距離看飛機起降、看夕陽。停車場常滿，上坡處還有更多免費車位', driveTime: '約 15 分' }),
        item('d2-1', '午餐：系滿魚市場', 'food', '海鮮午餐', { restaurantId: 'r-itoman', driveTime: '約 25 分' }),
        item('d2-3', '玉泉洞', 'sight', '沖繩世界・鐘乳石洞', { mapQuery: '玉泉洞 おきなわワールド', placeId: 'ChIJa3ifUYVp5TQR3QZD1tyLml4', address: '沖縄県南城市玉城前川1336（おきなわワールド內）', hours: '9:00–17:30（最後入園 16:00）', ticket: '大人 ¥2,000（含玉泉洞與園區）', parking: '免費停車場約 400 台', parkingFee: '免費', duration: '2–3 小時', notes: '洞內開放約 890 m，潮濕地滑請穿好走的鞋；Super Eisa 太鼓表演約 10:30、12:30、14:30', driveTime: '約 35 分', needTicket: true, reservation: '【何時買】出發前 1–2 週網路買就好（不會賣完，主要省排隊、還有小折扣）。【怎麼買】KKday、Klook、HIS 等平台買「おきなわワールド 入園券」，網路價大人約 ¥1,900（現場 ¥2,000）；依平台指示出示 QR 碼或憑證換票。買了通常不能退。' }),
        item('d2-3b', '回旅館', 'stay', '回 HOTEL AZAT 休息一下，再出門吃晚餐', { stayId: 'stay-naha-1', driveTime: '步行約 3 分' }),
        item('d2-4', '晚餐：うりずん', 'food', '沖繩家常菜和泡盛（2/17 左右打電話訂位，訂 19:30）', { restaurantId: 'r-urizun', time: '19:30' })
      ]
    },
    {
      id: 'd3', day: 3, date: '2027-03-04', weekday: '星期四', area: '恩納村',
      theme: '美式風情漫步',
      weather: { icon: '', status: '', temp: '', rain: '' },
      accommodationId: 'stay-onna',
      itinerary: [
        item('d3-1', '旅館 Check out', 'stay', '那霸住宿退房', { navigable: false, driveTime: '約 30 分' }),
        item('d3-3', '午餐：A&W 牧港店', 'food', '復古得來速漢堡，麥根沙士漂浮', { restaurantId: 'r-aw', driveTime: '約 30 分' }),
        item('d3-2', '美國村', 'sight', '北谷海邊街區散步', { mapQuery: '美浜アメリカンビレッジ', placeId: 'ChIJzZoVCAUT5TQRzIueHYt83hs', addressEn: 'Mihama, Chatan, Nakagami District, Okinawa 904-0115', hours: '店家多 10:00–22:00', duration: '2–3 小時', parking: '大型免費町營停車場（約 1,500 台）', parkingFee: '免費', notes: 'ZHYVAGO 咖啡在這裡；傍晚到海邊看夕陽，摩天輪 11:00–22:00、一圈約 15 分鐘', driveTime: '約 35 分', nearby: [{ name: 'ZHYVAGO COFFEE ROASTERY', q: 'ZHYVAGO COFFEE ROASTERY', placeId: 'ChIJh4EKsv4T5TQRU-h2svXc5tk', note: '就在美國村海邊，冷萃咖啡和提拉米蘇；2F 陽台看海' }] }),
        item('d3-4', '旅館 Check in', 'stay', '入住 BLISSTIA SUITES & RESORT', { stayId: 'stay-onna', driveTime: '步行約 2 分' }),
        item('d3-5', '晚餐：居酒屋 つばき', 'food', '沖繩料理和海鮮，飯店走路 2 分（要先訂位，訂 18:30）', { restaurantId: 'r-tsubaki', time: '18:30' })
      ]
    },
    {
      id: 'd4', day: 4, date: '2027-03-05', weekday: '星期五', area: '恩納村',
      theme: '甜蜜耍廢時光',
      weather: { icon: '', status: '', temp: '', rain: '' },
      accommodationId: 'stay-onna',
      itinerary: [
        item('d4-1', '耍廢日', 'rest', '在飯店好好休息，享受海景', { navigable: false, nearby: [{ name: '青之洞窟', q: '青の洞窟 真栄田岬', placeId: 'ChIJFSBnObgb5TQRQA1ByAocZog', note: '離飯店開車約 10 分；要浮潛或潛水需參加付費行程，不下水的話可以在真榮田岬步道看海' }, { name: '永旺夢樂城沖繩來客夢', q: 'イオンモール沖縄ライカム', placeId: 'ChIJJ_TSFGIS5TQRa_HkdjGALss', note: '離飯店開車約 35 分；有寶可夢中心、LOFT、大水族箱，10:00–22:00' }] }),
        item('d4-l', '午餐：濱之家 Hamanoya', 'food', '整條魚料理，奶油香煎最有名', { restaurantId: 'r-hamanoya', time: '11:00', departDrive: '約 10 分', driveTime: '約 10 分' }),
        item('d4-r', '回旅館', 'stay', '回 BLISSTIA 繼續耍廢，泡泳池、Lounge、大浴場', { stayId: 'stay-onna', driveTime: '步行約 2 分' }),
        item('d4-2', '晚餐：Yanbaru Meat', 'food', '牛排和西式小菜，飯店附近', { restaurantId: 'r-yanbaru', time: '18:30' })
      ]
    },
    {
      id: 'd5', day: 5, date: '2027-03-06', weekday: '星期六', area: '北部',
      theme: '古宇利島環島',
      weather: { icon: '', status: '', temp: '', rain: '' },
      accommodationId: 'stay-north',
      itinerary: [
        item('d5-1', '旅館 Check out', 'stay', '恩納村住宿退房', { navigable: false, driveTime: '約 35 分' }),
        item('d5-2', '許田休息站', 'shopping', '道之驛，沿途小歇', { mapQuery: '道の駅 許田', placeId: 'ChIJFfz3q_H_5DQRttsFg7-7wLE', addressEn: '17-1 Kyoda, Nago, Okinawa 905-0024', hours: '8:30–19:00', duration: '30–40 分鐘', parking: '道路兩側都有停車場，北上時停左側再走天橋過去', parkingFee: '免費', notes: '可買美麗海水族館優惠票；有天婦羅、沙翁、芒果冰；冷藏櫃找沖繩限定的 KOKUTO CHOCOLAT 黑糖巧克力甜點（IG 必吃）；部分攤位只收現金', driveTime: '約 35 分' }),
        item('d6-1', '古宇利大橋', 'sight', '開車跨海兜風', { mapQuery: '古宇利大橋', placeId: 'ChIJyy0FRAhZ5DQRIfztLp8vdWc', addressEn: 'Kouri, Nakijin, Okinawa 905-0406', duration: '20–30 分鐘', parking: '過橋前右側「古宇利大橋南展望所」有停車場，可拍大橋全景', notes: '全長約 2 km，晴天中午海最藍；過橋右轉約 1 km 就是古宇利海洋塔', driveTime: '約 3 分' }),
        item('d6-4', '午餐：沖繩蝦蝦飯', 'food', '古宇利島蝦蝦飯（可用 App 先點餐，營業到 16:00）', { restaurantId: 'r-shrimp', driveTime: '步行約 2 分' }),
        item('d6-2', '古宇利島の駅 ソラハシ', 'shopping', '島上的休息站：伴手禮、冰淇淋、沙翁', { mapQuery: '古宇利島の駅 ソラハシ', placeId: 'ChIJncJ2hLVZ5DQRThAlpBtjD00', mapUrl: 'https://share.google/htBDdQVQR2aHsdqph', addressEn: '323-1 Kouri, Nakijin, Kunigami District, Okinawa 905-0406', hours: '9:00–19:00', phone: '0980-56-2128', duration: '30–40 分鐘', parking: '有停車場；車可以停這裡，走路去蝦蝦飯和始まりの洞窟', notes: '評價推薦沙翁（開口笑）和牛奶冰淇淋；有些島上才買得到的伴手禮；就在蝦蝦飯旁邊', driveTime: '步行約 8 分' }),
        item('d6-3', '始まりの洞窟（チグヌ浜）', 'sight', '海邊洞窟拍照，從ソラハシ走過去', { mapQuery: 'チグヌ浜 始まりの洞窟 古宇利島', placeId: 'ChIJtSw1wz9Z5DQRLL32XVrluEc', hours: '24 小時', duration: '20–30 分鐘', parking: '附近幾乎沒有停車位，車停ソラハシ走過去', notes: '下到海邊面向大海往右看，石頭和階梯之間有小洞窟入口；岩石很滑、沿路要走路邊，注意來車；也是看夕陽的好地方', driveTime: '走回ソラハシ取車，開車約 5 分' }),
        item('d6-1b', '古宇利海洋塔', 'sight', '海拔 82m 的觀景塔，看古宇利大橋全景', { mapQuery: '古宇利オーシャンタワー', placeId: 'ChIJEx3cOjJY5DQRJM-BcuwWU-g', address: '沖縄県国頭郡今帰仁村古宇利538', hours: '10:00–18:00（最後入館 17:30）', ticket: '大人 ¥1,000（含自動駕駛遊園車、貝殼博物館、觀景台）', parking: '停車場約 200 台', parkingFee: '免費', duration: '1 小時', notes: '過古宇利大橋右轉約 1 km 就到；搭自動駕駛遊園車上觀景台，餐廳有南瓜愛心鬆餅、拿坡里披薩', needTicket: true, reservation: '【何時買】出發前 1–2 週網路買就好。【怎麼買】古宇利海洋塔官網、VELTRA 或 KKday 事前購票，大人約 ¥900–1,000，現場出示憑證換票；也可以現場買。', driveTime: '約 5 分' }),
        item('d6-5', '心型岩 & 渡海沙灘', 'sight', '看心型岩、渡海沙灘，等夕陽（約 18:33）', { mapQuery: 'ハートロック 古宇利島', placeId: 'ChIJf3Y9SjJY5DQRIZUnKV_U1Hg', addressEn: 'Kouri, Nakijin, Kunigami District, Okinawa 905-0406（Tinu Beach）', hours: '24 小時', duration: '40 分鐘–1 小時', parking: '沒有公共停車場，附近私人停車場約 ¥300', parkingFee: '約 ¥200–500', notes: '下到沙灘的步道又陡又滑，別穿夾腳拖；退潮時心型更清楚，出發前查潮汐；觀光客多，拍照要排隊。這天在這裡看夕陽：日落約 18:33，17:45 前後到就好。步道很陡，天全黑前就要走回停車處，帶手機手電筒；看完約 18:50 出發，開車約 30 分到ゆくるば吃晚餐', driveTime: '約 30 分' }),
        item('d5-5', '晚餐：ゆくるば', 'food', '備瀬的阿古豬涮涮鍋（看完夕陽直接過來，訂 19:30）', { restaurantId: 'r-yukuruba', time: '19:30', driveTime: '約 5 分' }),
        item('d5-4', '旅館 自助入住', 'stay', '入住 Yukurina 海風（18:00 後自助入住，要先聯絡飯店）', { stayId: 'stay-north', time: '21:00', notes: '櫃台 18:00 下班，這天是晚到自助入住：出發前至少 72 小時（3/3 前）打電話或寫 email 給飯店，說 3/6 約 21:00 到、要自助入住，請對方寄入住步驟和拿鑰匙的方法；入住當天會收到說明 email' })
      ]
    },
    {
      id: 'd6', day: 6, date: '2027-03-07', weekday: '星期日', area: '北部',
      theme: '美麗海藍色世界',
      weather: { icon: '', status: '', temp: '', rain: '' },
      accommodationId: 'stay-north',
      itinerary: [
        item('d6-0', '早餐：Yukurina 飯店早餐', 'food', '外帶早餐盒，可以在房間或屋頂露台吃，再出發去水族館', { navigable: false, notes: '# 早餐形式\n外帶早餐盒（早餐 BOX），不是自助餐\n供應時間：早上 8:00–11:00\n內容以麵包、輕食便當為主，份量比較精簡，住客評價簡單好吃\n前台可以拿濾掛式咖啡\n# 在哪裡吃\n房間、陽台、木造露台、屋頂都可以\n也可以帶出門，到海邊或海洋博公園邊看海邊吃' }),
        item('d5-3', '美麗海水族館', 'sight', '9:30 進場，早上人比較少', { mapQuery: '沖縄美ら海水族館', placeId: 'ChIJPZ5hUjH65DQR_p_dD3CmCOo', address: '沖縄県国頭郡本部町石川424（海洋博公園內）', hours: '8:30–18:30（最後入館 17:30）', ticket: '大人 ¥2,180；網路買電子票可掃 QR 直接入館', parking: '海洋博公園停車場', parkingFee: '免費', duration: '2–3 小時', notes: '重點是「黑潮之海」鯨鯊與鬼蝠魟；園區內海豚表演、海牛館、海龜館免費；人多時建議一開門就進場', needTicket: true, reservation: '【何時買】出發前 1–2 週網路買就好（不會賣完，主要省排隊）。【怎麼買】KKday、Klook、VELTRA 買「電子入館票」，入口直接掃 QR 碼進場，不用排售票口；大人 ¥2,180。也可以在當天經過的許田休息站買優惠票。買了不能退票。', time: '09:30', departDrive: '約 3 分', driveTime: '園區內步行約 10 分' }),
        item('d6-a', '翡翠海灘', 'sight', '水族館旁的白沙灘，散步拍照', { mapQuery: 'エメラルドビーチ 海洋博公園', placeId: 'ChIJk4Fw-Dn65DQRkdNLoaBpJLI', duration: '30–40 分鐘', parking: '在海洋博公園內，車可以繼續停水族館的停車場走過去', parkingFee: '免費', notes: '11 月到 3 月不開放游泳，散步拍照就好；海水很清、沙子很細，沒有遮蔭記得防曬。海牛館旁邊的樓梯往下還有一個小沙灘', driveTime: '約 5 分' }),
        item('d6-l', '午餐：ふくぎ屋', 'food', '福木林道裡的沖繩麵', { restaurantId: 'r-fukugiya', driveTime: '步行即到' }),
        item('d6-b', '備瀬福木林道', 'sight', '福木樹蔭下的老村落散步', { mapQuery: '備瀬のフクギ並木', placeId: 'ChIJ6z_osjv65DQRNpoSOgG1iqM', hours: '24 小時', duration: '1–1.5 小時', parking: '村子入口有幾個小停車場，免費的不好找，收費的約 ¥500', notes: '整條走完來回約 1 小時，可以租腳踏車或電動滑板車；路上有小咖啡店和紅豆冰（ぜんざい）；走到底是海邊，很適合看夕陽；蚊子多，記得防蚊', driveTime: '約 15 分' }),
        item('d6-d', '晚餐：沖縄そばと島どうふ TOPU', 'food', '自製島豆腐和沖繩麵，在地平價', { restaurantId: 'r-topu', nearby: [{ name: 'Kana Sando', q: '金三度 本部', placeId: 'ChIJZzzV9db75DQR_Qu5FvKwjKo', note: '家庭沖繩居酒屋，18:00–23:00；父子現場表演三線和民謠，最後可以上台拍照' }, { name: '居酒屋 琉波', q: '居酒屋 琉波 本部', placeId: 'ChIJVwIHiDT75DQRuMmWfCAB9sI', note: '在地人常來，17:00–22:30；推薦炸雞、鮮蝦春捲、牛肉豆腐味噌炒' }, { name: 'やまちゃん', q: 'やまちゃん 本部 山川', placeId: 'ChIJv3AtLtP75DQR5oXZ5rdFFTk', note: '就在飯店旁，18:00–20:20；超平價，推薦炸雞（菜單 30 號）、苦瓜炒；日文菜單、只收現金' }] })
      ]
    },
    {
      id: 'd7', day: 7, date: '2027-03-08', weekday: '星期一', area: '北部 → 那霸',
      theme: '跨越沖繩',
      weather: { icon: '', status: '', temp: '', rain: '' },
      accommodationId: 'stay-naha-2',
      itinerary: [
        item('d7-1', '早餐：Yukurina 飯店早餐', 'food', '外帶早餐盒，吃完再整理行李、退房', { navigable: false, notes: '# 早餐形式\n外帶早餐盒（早餐 BOX），不是自助餐\n供應時間：早上 8:00–11:00\n內容以麵包、輕食便當為主，份量比較精簡，住客評價簡單好吃\n前台可以拿濾掛式咖啡\n# 在哪裡吃\n房間、陽台、木造露台、屋頂都可以\n也可以帶出門，到海邊或海洋博公園邊看海邊吃' }),
        item('d7-2', '旅館 Check out', 'stay', '北部住宿退房', { navigable: false, driveTime: '約 1 小時 50 分（走高速，已多抓 30 分）', notes: '⚠️ 沖繩自動車道宜野座 IC–許田 IC 在 2027/1/6–3/31 整天施工管制，可能塞車，車程已多抓 30 分鐘（平常約 1 小時 20 分）。許田 IC 上、西原 IC 下，ETC 約 ¥1,000' }),
        item('d7-3', '逛街：PARCO CITY', 'shopping', '浦添的購物中心', { mapQuery: 'サンエー浦添西海岸 PARCO CITY', placeId: 'ChIJxZQf9gpr5TQRwLWyT5Osigc', addressEn: '3-1-1 Irijima, Urasoe, Okinawa 901-2123', hours: '10:00–22:00', duration: '3 小時以上', parking: '大型停車場（假日找車位要等一下）', notes: '三層樓，有 UNIQLO、GU、無印、Daiso、ABC-Mart、LEGO 等；美食街看得到海景；退稅櫃台在 1F', driveTime: '約 20 分' }),
        item('d7-4', '旅館 Check in', 'stay', '入住 Hotel Torifito 那霸旭橋', { stayId: 'stay-naha-2', driveTime: '步行約 15 分（開車約 5 分）' }),
        item('d7-5', '晚餐：Shima Shabushabu Nakama 島', 'food', '涮涮鍋晚餐（約 1/8 開放訂位，訂 19:30）', { restaurantId: 'r-nakama', time: '19:30' })
      ]
    },
    {
      id: 'd8', day: 8, date: '2027-03-09', weekday: '星期二', area: '那霸',
      stayAction: { label: '星宇線上報到', url: 'https://www.starlux-airlines.com/zh-TW/check-in-fly/check-in-now/online-check-in' },
      theme: '購物時光',
      weather: { icon: '', status: '', temp: '', rain: '' },
      accommodationId: 'stay-naha-2',
      itinerary: [
        item('d8-1', '午餐：POCO CAFE', 'food', '沖繩家常菜午餐（塔可飯、沖繩麵）', { restaurantId: 'r-poco', departDrive: '約 13 分（步行約 25 分）', driveTime: '約 30 分' }),
        item('d8-2', '豐崎百貨', 'shopping', 'iias 沖繩豐崎', { mapQuery: 'iias沖縄豊崎', placeId: 'ChIJj-bxt39p5TQRVVi5ETcWlRM', addressEn: '3-35 Toyosaki, Tomigusuku, Okinawa 901-0225', hours: '10:00–21:00', duration: '2–3 小時', parking: '室內停車場', parkingFee: '免費', notes: '豐崎 LOFT 在 3F；有 UNIQLO、GU、超市可買伴手禮；旁邊就是 Ashibinaa Outlet', driveTime: '步行約 5 分', nearby: [{ name: '豐崎 LOFT', q: '豊崎ロフト', placeId: 'ChIJH8VZ7Ilp5TQRVKVM97AdiUA', note: '就在 iias 3F，文具、雜貨、美妝' }] }),
        item('d8-3', 'Ashibinaa Outlet', 'shopping', '沖繩 Outlet 購物', { mapQuery: '沖縄アウトレットモール あしびなー', placeId: 'ChIJ98yehgto5TQRJj4hYbNQH9U', addressEn: '1-188 Toyosaki, Tomigusuku, Okinawa 901-0225', hours: '10:00–20:00', duration: '2–3 小時', parking: '大型停車場', parkingFee: '免費', notes: '開放式 Outlet，離機場約 15 分鐘；有投幣置物櫃；逛完可走去隔壁 iias', driveTime: '約 40 分（傍晚可能塞車）' }),
        item('d8-4', '晚餐：HAMA 壽司', 'food', '迴轉壽司晚餐，平板點餐可切中文', { restaurantId: 'r-hama' })
      ]
    },
    {
      id: 'd9', day: 9, date: '2027-03-10', weekday: '星期三', area: '那霸',
      theme: '旅程終章，回家',
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
    { id: 'stay-naha-1', shops: [{ type: '超市', name: '栄町りうぼう（Ryubo 超市）', q: '栄町りうぼう', placeId: 'ChIJI3M1GGRp5TQRXrTjqFoIWZU', note: '飯店對面，步行約 2 分，24 小時；便當、生魚片、麵包都有' }, { type: '超商', name: 'FamilyMart さいおんスクエア店', q: 'ファミリーマート さいおんスクエア', placeId: 'ChIJb9qruWRp5TQRmE_eDfu1bkY', note: '步行約 3 分，24 小時' }, { type: '超商', name: '7-Eleven 國際通安里 1 丁目店', q: 'セブンイレブン 国際通り安里1丁目', placeId: 'ChIJhVVKixlp5TQRW9DyhNc9TcU', note: '步行約 5 分，24 小時' }, { type: '藥妝', name: '松本清 三原 1 丁目店', q: 'マツモトキヨシ 三原1丁目', placeId: 'ChIJ2UJn9mVp5TQRcFRj86JW9CU', note: '步行約 6 分，約 9:00–翌 1:00' }], quick: { short: 'HOTEL AZAT', checkIn: '15:00', breakfast: '✕（可加購）', parking: '¥1,500／天（隔壁 ¥800／24h）', cancelBy: '2/26 前' }, name: 'HOTEL AZAT 那霸（那霸阿扎特飯店）', area: '那霸', checkIn: '15:00', checkOut: '11:00', address: '沖縄県那覇市安里2-8-8', addressEn: '2-8-8 Asato, Naha, Okinawa 902-0067', parking: '飯店 1F 的「D-Parking 安里2丁目第2」（不是飯店直營），每天 ¥1,500，有空位才能停；買票後只要開出去就算用完，滿了要停附近收費停車場。更划算：隔壁約 50m 的「Dパーキング安里2丁目第1」，¥800 可停 24 小時——停好車要馬上到機器買停車券，把券放在車內儀表板上明顯的地方', notes: '# 房型\nComfort Queen 本館禁菸房（14㎡、一張大床），金省專案\n不含早餐，有免費 Wi-Fi\n# 入住\n櫃台在 3F，24 小時有人\n最晚可以入住到隔天凌晨 05:30，晚到也沒關係\n# 位置\n單軌電車「安里」站走路 30 秒\n國際通走路約 3 分；到那霸機場開車約 20 分\n對面有 24 小時超市\n# 設施與備品\n房間只放牙刷；浴巾、刮鬍刀、梳子、化妝棉、咖啡包、浴帽要到 3F 櫃台旁的 Amenity Bar 自己拿\n大廳有免費咖啡\n早餐可現場加購：自助餐 7:00–10:00（3F Cafe Victoria）\n連住期間打掃不換床單和睡衣，要換請跟櫃台說\n# 取消政策（沖繩時間）\n2/26 前：免費取消\n2/27–2/28：只能部分退款\n3/1 起：不可退款', phone: '098-863-0888', website: '', parkingLinks: [{ label: 'Dパーキング安里2丁目第1（隔壁，¥800／24h）', url: 'https://www.google.com/maps/place/D%E3%83%91%E3%83%BC%E3%82%AD%E3%83%B3%E3%82%B0%E5%AE%89%E9%87%8C2%E4%B8%81%E7%9B%AE%E7%AC%AC1/@26.2170202,127.6954515,18z' }], photo: 'images/stays/azat.jpg', roomPhotos: [{ src: 'images/stays/azat-room-1.jpg', caption: '房間（一張大床）' }, { src: 'images/stays/azat-room-2.jpg', caption: '浴室（有浴缸）' }, { src: 'images/stays/azat-room-3.jpg', caption: '睡衣與毛巾' }, { src: 'images/stays/azat-room-4.jpg', caption: '沐浴乳、洗髮精、潤髮乳、洗面乳' }, { src: 'images/stays/azat-room-5.jpg', caption: '設施：投幣洗衣房（洗衣機、烘衣機）' }, { src: 'images/stays/azat-room-6.jpg', caption: '設施：1F 停車場（D-Parking）' }], mapQuery: 'ホテルアザット那覇', placeId: '' },
    { id: 'stay-onna', shops: [{ type: '超商', name: 'FamilyMart 恩納 Moon Beach 店', q: 'ファミリーマート ムーンビーチ店', placeId: 'ChIJPVs-cMoa5TQRgWlFPbzfAbg', note: '步行約 2 分，6:00–24:00' }, { type: '超商', name: 'Lawson 恩納 Moon Beach 店', q: 'ローソン 恩納ムーンビーチ店', placeId: 'ChIJjx5Mdcoa5TQRMnJT5R3k0cY', note: '步行約 3 分，24 小時；比隔壁 FamilyMart 大一點' }, { type: '超商', name: '7-Eleven 恩納前兼久店', q: 'セブンイレブン 恩納前兼久店', placeId: 'ChIJ1fuDW7cb5TQRDaJWtua_9_s', note: '步行約 6 分，24 小時' }, { type: '藥妝', name: 'Drugstore Mori 石川店', q: 'ドラッグストアモリ 石川店', placeId: 'ChIJ6w6H2lwF5TQRLsNORhEy_ws', note: '走路範圍內沒有藥妝店，這間最近：開車約 7 分，9:00–24:00；隔壁有 24 小時的 MaxValu 超市' }], quick: { short: 'BLISSTIA', checkIn: '15:00', breakfast: '✕', parking: '¥1,000／天', cancelBy: '2/24 前' }, name: 'BLISSTIA SUITES & RESORT 沖繩恩納村', area: '恩納村', checkIn: '15:00', checkOut: '11:00', address: '沖縄県国頭郡恩納村前兼久497-6', addressEn: '497-6 Maeganeku, Onna, Kunigami District, Okinawa 904-0414', parking: '戶外停車場 124 台，每天 ¥1,000（最多 ¥2,000）', notes: '# 房型\nSuperior Suite with Lounge Access 海景房（50㎡）\n2 張單人床＋2 張沙發床，附廚房與陽台\n不含早餐，有免費 Wi-Fi\n# 入住\n櫃台開到 23:59，最晚 23:30 前入住\n# 設施\n無邊際泳池、室內泳池\n大浴場：6:00–10:00、16:00–23:00\n泳池旁 Lounge 12:00–22:00 飲料暢飲\n# 取消政策（沖繩時間）\n2/24 前：免費取消\n2/25 起：不可退款', phone: '098-979-5177', website: '', photo: 'images/stays/blisstia.jpg', roomPhotos: [{ src: 'images/stays/blisstia-room-1.jpg', caption: '房間：客廳、小廚房、臥室' }, { src: 'images/stays/blisstia-room-2.jpg', caption: '房間：兩張床，走到底是海景陽台' }, { src: 'images/stays/blisstia-room-3.jpg', caption: '房間：浴缸也看得到海' }, { src: 'images/stays/blisstia-room-4.jpg', caption: '房間：陽台' }, { src: 'images/stays/blisstia-room-5.jpg', caption: '設施：Lounge' }, { src: 'images/stays/blisstia-room-6.jpg', caption: '設施：大浴場' }, { src: 'images/stays/blisstia-room-7.jpg', caption: '設施：無邊際泳池' }, { src: 'images/stays/blisstia-room-8.jpg', caption: '設施：室內泳池' }, { src: 'images/stays/blisstia-room-9.jpg', caption: '設施：晚上的泳池' }, { src: 'images/stays/blisstia-room-10.jpg', caption: '設施：三溫暖' }], mapQuery: '', placeId: 'ChIJFepf2EIb5TQR6qfIYlX5wKw' },
    { id: 'stay-north', shops: [{ type: '超商', name: 'Lawson 海洋博公園店', q: 'ローソン 海洋博公園店', placeId: 'ChIJyafV-jD65DQR5de5nm5phhc', note: '最近的超商：步行約 8 分（開車約 2 分），24 小時；晚到自助入住前可以先買' }, { type: '超商', name: 'FamilyMart 本部山川店', q: 'ファミリーマート 本部山川店', placeId: 'ChIJsYFdxFT75DQRe6rODrKHsIM', note: '開車約 3 分，24 小時' }, { type: '藥妝', name: 'ふく薬局 本部店', q: 'ふく薬局 本部', placeId: 'ChIJ3_UrOuX75DQRZVmE8XgT3-0', note: '附近沒有藥妝店，這間最近：開車約 10 分，約 9:00–23:00；可退稅，店員會用翻譯機' }], quick: { short: 'Yukurina 海風', checkIn: '約 21:00 自助', breakfast: '✓ 含早餐', parking: '免費', cancelBy: '2/10 前' }, name: 'Yukurina Resort Okinawa 海風（ゆくりなリゾート沖縄 海風）', area: '北部（本部町）', checkIn: '15:00–18:00', checkOut: '11:00', address: '沖縄県国頭郡本部町石川799-2', addressEn: '799-2 Ishikawa, Motobu, Kunigami District, Okinawa 905-0206', parking: '免費，每間房可停 1 台；確切停哪裡請看訂房確認信或入住時問櫃台', notes: '# ⚠️ 自助入住（約 21:00 到）\n3/3 前要先打電話或寫 email 跟飯店說，請對方安排並寄入住步驟\n櫃台在海風 1F，只開 15:00–18:00\n櫃台下班後的緊急電話：080-3995-3903\n# 房型\n標準房，2 晚都含早餐（外帶早餐盒，8:00–11:00，不是自助餐），有免費 Wi-Fi\n房內有毛巾、浴巾、牙刷、刮鬍刀、拖鞋、吹風機和沐浴用品\n# 位置\nYukurina 在本部有好幾棟，我們住「海風」（石川 799-2）\n租車導航可輸入 MAPCODE 553 076 481\n美麗海水族館開車約 3 分\n# 退房\n11:00 前把鑰匙放進櫃台的還鑰匙箱\n退房後可以把行李寄放在櫃台\n# 取消政策（沖繩時間）\n2/10 前：免費取消\n2/11 起：不可退款（沒入住也要付全額）', phone: '0980-48-3903', website: '', photo: 'images/stays/yukurina.jpg', roomPhotos: [{ src: 'images/stays/yukurina-room-1.jpg', caption: '臥室與書桌' }, { src: 'images/stays/yukurina-room-2.jpg', caption: '廚房（瓦斯爐、微波爐、冰箱）' }, { src: 'images/stays/yukurina-room-3.jpg', caption: '浴室（有浴缸）' }, { src: 'images/stays/yukurina-room-4.jpg', caption: '洗手台、洗衣機與烘衣機' }, { src: 'images/stays/yukurina-room-6.jpg', caption: '備品：牙刷、刮鬍刀' }, { src: 'images/stays/yukurina-room-5.jpg', caption: '設施：屋頂露台（看得到海）' }], mapQuery: 'ゆくりなリゾート沖縄 海風', placeId: '' },
    { id: 'stay-naha-2', shops: [{ type: '超商', name: 'FamilyMart 西消防署通り店', q: 'ファミリーマート 西消防署通り店', placeId: 'ChIJzxsSeZlp5TQRtOIUWfif4xw', note: '飯店旁邊，步行約 1 分，24 小時' }, { type: '超商', name: 'Lawson 那霸西 1 丁目店', q: 'ローソン 那覇西一丁目店', placeId: 'ChIJ__q5NZhp5TQRDMHMvQSeIkQ', note: '步行約 4 分，24 小時；有現做三明治和沖繩限定商品' }, { type: '藥妝', name: '松本清 久米店', q: 'マツモトキヨシ 久米店', placeId: 'ChIJIV1xipxp5TQR4IRB00BQcR4', note: '步行約 7 分，約 9:00–22:00；可退稅' }, { type: '藥妝', name: '大國藥妝 久茂地 1 丁目店', q: 'ダイコクドラッグ 久茂地1丁目', placeId: 'ChIJ5dYwJpxp5TQRUwswahvwXyI', note: '步行約 8 分，約 9:00–22:50' }], quick: { short: '托麗芙特', checkIn: '14:00', breakfast: '✕', parking: '¥1,500–1,800／晚（附近約 ¥900／天）', cancelBy: '約 2/22 前' }, name: 'Hotel Torifito 那霸旭橋（托麗芙特酒店）', area: '那霸', checkIn: '14:00–24:00', checkOut: '11:00', address: '沖縄県那覇市西1-11-19', addressEn: '1-11-19 Nishi, Naha, Okinawa 900-0036', parking: '飯店停車場 28 台：立體 ¥1,500／晚、平面 ¥1,800／晚，先到先停、不能預約。附近比較便宜：①タイムズ西1丁目（走路 2–3 分，24 小時上限 ¥900、18:00–8:00 上限 ¥500）②ザ・パーク西1丁目（約 100m，12 小時上限 ¥700，只收現金，7 台）③タイムズ沖縄東町（走路約 2 分，12 小時上限 ¥880，可刷卡）④D-Parking 那覇市西1丁目第3（價格看現場看板）。價格以現場看板為準', notes: '# 房型\n舒適雙人房，禁菸，不含餐\n房內有保險箱、空氣清淨機、電熱水壺\n# 位置\n單軌電車「旭橋」站走路約 8 分\n國際通、波之上海灘走路可到\n# 設施與福利\n🍦 13:00 後餐廳沙發區迎賓：咖啡、冰茶，每人一球 BLUE SEAL 冰淇淋\n大廳有卸妝乳、洗面乳、乳液等女性備品可以自己拿\n早餐自助餐 6:30–10:00（另外付費）\n# 取消政策\n入住前 14 天（約 2/22）前：免費取消\n之後取消要付全額（以訂房確認信為準）', phone: '098-860-6430', website: '', parkingLinks: [{ label: '① タイムズ西1丁目', url: 'https://share.google/krc7sVoifaH7unLua' }, { label: '② ザ・パーク西1丁目（The Park）', url: 'https://www.google.com/maps/search/?api=1&query=%E3%82%B6%E3%83%BB%E3%83%91%E3%83%BC%E3%82%AF%E8%A5%BF1%E4%B8%81%E7%9B%AE%20%E9%82%A3%E8%A6%87' }, { label: '③ タイムズ沖縄東町', url: 'https://share.google/wuiokDBvomJOgXR8R' }, { label: '④ D-Parking 那覇市西1丁目第3', url: 'https://www.google.com/maps/search/?api=1&query=D-Parking%20%E9%82%A3%E8%A6%87%E5%B8%82%E8%A5%BF1%E4%B8%81%E7%9B%AE%E7%AC%AC3' }], photo: 'images/stays/torifito.jpg', roomPhotos: [{ src: 'images/stays/torifito-room-1.jpg', caption: '大床' }, { src: 'images/stays/torifito-room-2.jpg', caption: '書桌與衣櫃' }, { src: 'images/stays/torifito-room-3.jpg', caption: '浴室（有浴缸）' }, { src: 'images/stays/torifito-room-4.jpg', caption: '床頭插座：AC100V、USB' }, { src: 'images/stays/torifito-room-6.jpg', caption: '沐浴備品：Orange Rose 洗髮精、潤髮乳、沐浴乳、洗手乳' }, { src: 'images/stays/torifito-room-7.jpg', caption: '電熱水壺、冰桶與杯子' }, { src: 'images/stays/torifito-room-8.jpg', caption: '設施：投幣洗衣房（洗脫烘一體機）' }, { src: 'images/stays/torifito-room-9.jpg', caption: '設施：飯店停車場（平面＋機械式）' }, { src: 'images/stays/torifito-room-5.jpg', caption: '房型平面圖（Comfort Double Room）' }], mapQuery: 'ホテル・トリフィート那覇旭橋', placeId: '' },
  ];

  // status：reserved 已預約 | planned 已安排 | mustEat 必吃 | wishlist 想去 | visited 已造訪
  // group：meal 正餐 | cafe 咖啡甜點 | store 超商（只用在必吃）
  // kind：eat 必吃 | buy 必買 | sight 景點（「清單」頁上方三個分頁）
  // reserveOn：開放訂位、要去訂的日期（YYYY-MM-DD），顯示在「工具 → 重要預約」
  function rest(id, name, opts) {
    return Object.assign({
      id: id, name: name, nameJa: '', type: '', area: '', price: '', recommend: '',
      status: 'wishlist', needReservation: false, hours: '', day: null, group: 'meal',
      description: '', address: '', phone: '', menu: '', reservationInfo: '', reserveOn: '', parking: '',
      notes: '', website: '', photo: '', mapQuery: '', addedBy: '',
      mapUrl: '', placeId: '', parkingPlaceId: '', parkingName: '',
      kind: 'eat',         // eat 必吃 | buy 必買 | sight 景點
      source: ''           // 'IG'：從 IG 收藏整理來的
    }, opts || {});
  }

  var restaurants = [
    rest('r-nakama', 'Shima Shabushabu Nakama 島', { type: '涮涮鍋', area: '那霸 久茂地', status: 'planned', needReservation: true, reserveOn: '2027-01-08', day: 7, mapQuery: 'Shima Shabu-Shabu NAKAMA', placeId: 'ChIJe1CMMnZp5TQRAdq6Ro0rUwI', price: '¥2,000–7,000', recommend: '阿古豬涮涮鍋吃到飽（石垣牛評價普通，選阿古豬就好）', hours: '11:30–15:00、17:00–22:30', address: '那霸市久茂地 3-3-1 B1', phone: '098-917-1529', description: '島野菜和湯頭很加分，豬肉新鮮帶甜味', notes: '冰淇淋要另外點；店員英文不太通，可用手指菜單', reservationInfo: '【何時訂】網路訂位大約開放到 2 個月後（11/25 時已經可以訂到 1/23），3/8 大概 1/8 左右就能訂，開放後就先訂（我們訂 19:30）。想坐沙發座一定要預約。【怎麼訂】TORETA 網路訂位（點「官網」按鈕），可選「只訂位子」或套餐，例如阿古豬＋島野菜吃到飽 ¥5,280；或打電話 098-917-1529。', website: 'https://shabushabu-nakama.toreta.at/select' }),
    rest('r-itoman', '系滿魚市場', { nameJa: '糸満漁業協同組合 お魚センター', type: '海鮮', area: '系滿', status: 'planned', day: 2, mapQuery: '糸満漁業協同組合 お魚センター', placeId: 'ChIJnfH0IcJn5TQRFTMsWWcjFlg', parkingPlaceId: 'ChIJieT1IMJn5TQRwD1JYCP82ek', parkingName: '糸満魚市場 駐車場', parking: '魚市場旁免費停車場', price: '約 ¥1,500–3,000／人', recommend: '生魚片丼、海鮮丼、龍蝦或生蠔燒烤、海葡萄', hours: '9:00–18:00（週六日到 19:00）', address: '糸満市西崎町 4-19', phone: '098-992-2803', description: '十幾個海鮮攤位，買好在外面的座位區吃', notes: '部分攤位只收現金；自己找位子、擦桌子，帶濕紙巾；炸物放比較久不推' }),
    rest('r-urizun', 'うりずん', { nameJa: 'うりずん', type: '沖繩料理・泡盛', area: '那霸 安里', status: 'planned', needReservation: true, reserveOn: '2027-02-17', day: 2, mapQuery: 'うりずん 那覇 安里', placeId: 'ChIJa68SBGRp5TQR2pFzeeeDH_0', price: '約 ¥3,000–4,000／人（含飲料）', recommend: '名物ドゥル天（田芋可樂餅）、ラフテー、苦瓜炒、花生豆腐、魚天婦羅；泡盛可試店家自製古酒', hours: '17:30–24:00（全年無休，舊盂蘭盆節前後休）', address: '那霸市安里 388-5', phone: '098-885-2178', description: '1972 年創業的老字號沖繩家常菜居酒屋，ドゥル天的發源店，也吃得到琉球宮廷料理', notes: '從 HOTEL AZAT 走路約 3 分；可刷卡；另收小菜費（お通し）每人約 ¥350；菜單只有日文但有照片', reservationInfo: '【何時訂】出發前兩週（2/17 左右）打電話訂。【怎麼訂】從台灣撥 +81 98-885-2178，日本 17:30 開店後（台灣 16:30 後）剛開店比較好接。用日文說：「3月3日、水曜日、夜7時半から、2名で予約をお願いします。半個室があればお願いします。名前は〇〇です。」（3/3 星期三晚上 7 點半、2 位，有半包廂的話麻煩安排）。如果對方說太早，就問「いつから予約できますか？」。【不建議】AutoReserve 網路代訂要另付服務費 ¥2,700（不是訂金、訂成不退），打電話免費。【時段】訂 19:30，座位選半包廂（半個室）。' }),
    rest('r-buchi', 'Buchi 燒肉', { nameJa: 'ぶち 久茂地店', type: '燒肉', area: '那霸 久茂地', status: 'planned', needReservation: true, reserveOn: '2027-02-01', day: 1, mapQuery: 'Buchi Kumojiten', placeId: 'ChIJzcnA2ndp5TQRRkXi5c02uKk', notes: '週三公休（已改到 3/2 星期二）', price: '¥3,000–7,000', recommend: '和牛沙朗、無骨牛小排、沖繩和牛拼盤', hours: '17:00–22:00（週三公休）', address: '那霸市久茂地 3-12-1', phone: '098-943-6567', reservationInfo: '【何時訂】每月 1 日開放下個月的訂位，3/2 要在 2/1 訂，熱門時段很快滿，2/1 一開放就訂。【時段】固定時段：18:40（訂位只保留 10 分鐘，請準時到）。【怎麼訂】到官方 Instagram @buchi_kumoji，看個人檔案裡的預約連結；或直接私訊（DM），照店家格式提供：日期、姓名、人數、時段。', website: 'https://www.instagram.com/buchi_kumoji/' }),
    rest('r-shrimp', '沖繩蝦蝦飯', { type: '蝦飯', area: '古宇利島', status: 'planned', day: 5, mapQuery: 'KOURI SHRIMP', placeId: 'ChIJcep34MxZ5DQR5VjNV0a8HWg', price: '約 ¥2,000–2,500／份', recommend: '辣味蒜香奶油蝦、原味蒜香蝦；可加點 Onaha 牛、沖繩薯條', hours: '11:00–16:00', address: '今帰仁村古宇利 314', phone: '0980-56-1242', parking: '有停車場，有人指揮', description: '夏威夷風蒜香蝦，3F 露台看海', notes: '建議前一天先下載 KOURI SHRIMP App，用 App 點餐、選取餐時間（3/6 約 13:00）；現場點的話是平板點餐，1F 拿飲料、2F 拿餐；一份份量大，兩人可分食；可刷卡', reservationInfo: '可以先用「KOURI SHRIMP」官方 App 線上點餐：線上刷卡付款，並選擇取餐時間，到店直接取餐，不用排隊點餐。內用座位不能訂，到了再找位子。' }),
    rest('r-isshin', '一心壽喜燒', { type: '壽喜燒', area: '那霸 久茂地', status: 'wishlist', needReservation: true, day: null, mapQuery: 'Oniku no Isshin', placeId: 'ChIJLcZbI5xp5TQRtD4FrGpXwws', price: '¥5,000–10,000', recommend: '阿古豬或和牛壽喜燒套餐（最後加烏龍麵或蕎麥麵）', hours: '14:00–22:00（週三公休；3/8 週一 Google Maps 顯示 18:00 開）', address: '那霸市久茂地 1-5-1', phone: '098-866-0736', description: '老闆會在桌邊幫忙煮第一輪', notes: '週三公休；標示價格不含消費稅，另收桌位費每人 ¥300；最後點餐 21:00；菜單只有日文／中文，店員會說英文', reservationInfo: '【何時訂】應該是 2/1 開放 3 月的訂位，2/1 一開放就訂（跟 Buchi 同一天）。【時段】固定 4 個時段：14:00、16:00、18:00、20:00，每場最多 1 小時 45 分鐘；3/8 星期一 Google Maps 顯示 18:00 才開，所以訂 18:00 場。【怎麼訂】TableCheck 中文訂位頁（點「官網」按鈕），或寫信到 isshin.okinawa3855@gmail.com、打電話 098-866-0736。取消和變更規定以預約時顯示的為準。', website: 'https://www.tablecheck.com/zh-TW/isshin-okinawa/reserve/message' }),
    rest('r-poco', 'POCO CAFE', { nameJa: 'POCO CAFE OKINAWA', type: '沖繩料理・咖啡', area: '那霸 牧志', status: 'planned', day: 8, mapQuery: 'POCO CAFE OKINAWA 牧志', placeId: 'ChIJ9-mXA3pp5TQRaDZ2b2Fz7bo', price: '¥1,000–2,000', recommend: '塔可飯＋沖繩麵套餐（A Set，附飲料）、咖哩飯、紅芋甜點、果昔', hours: '10:00–24:00', address: '那霸市牧志 1-3-62 2F', phone: '098-988-9980', description: '國際通旁的 2 樓小店，可以坐吧台或榻榻米，份量剛好、價格親民', notes: '在國際通附近，停車要找收費停車場；從飯店開車約 13 分、走路約 25 分，或搭單軌電車到牧志站', reservationInfo: '不用預約' }),
    rest('r-zhyvago', 'Zhyvago Coffee Roastery', { type: '咖啡', area: '美國村', group: 'cafe', addedBy: '心萱', mapQuery: 'ZHYVAGO COFFEE ROASTERY', placeId: 'ChIJh4EKsv4T5TQRU-h2svXc5tk', price: '¥1,000 以內', recommend: '冷萃咖啡、提拉米蘇、起司蛋糕、Mad Chocolate Shake', hours: '7:00–22:00', address: '北谷町美浜 34-1', phone: '098-988-7833', description: '美國村海邊的紅磚咖啡館，2F 陽台看海' }),
    rest('r-applepie', '蘋果派', { type: '甜點', area: '機場', group: 'cafe', addedBy: '心萱' }),
    rest('r-aw', 'A&W 牧港店', { type: '漢堡', area: '浦添 牧港', status: 'planned', day: 3, addedBy: '心萱', mapQuery: 'A&W 牧港店', placeId: 'ChIJk5jkbZxs5TQR9YajcZ3aWXw', price: '¥1,000–2,000', recommend: '麥根沙士漂浮（沙士可免費續杯）、捲捲薯條、洋蔥圈', hours: '6:00–凌晨 2:00', address: '浦添市牧港 4-9-1', phone: '098-876-6081', description: '1969 年開的復古得來速，超好拍', notes: '觀光客多，點餐可能要排 30 分鐘；只想吃 A&W 可去其他分店（國際通也有）' }),
    rest('r-hama', 'HAMA 壽司 古島店', { type: '壽司', area: '那霸 古島', status: 'planned', day: 8, addedBy: '心萱', mapQuery: 'はま寿司 那覇古島店', placeId: 'ChIJ0bDIk-hr5TQRtvrRQOAyur0', price: '¥1,000–2,000', recommend: '沖繩限定握壽司、多種醬油可選', hours: '10:00–凌晨 5:00', address: '那霸市古島 1-25-3', phone: '0570-001-689', description: '平價迴轉壽司連鎖', notes: '入口機台抽號碼；平板點餐可切換中文', reservationInfo: '不用訂位，到店在入口機台抽號碼牌。晚餐尖峰（18:00–20:00）可能要等，想少排隊可以用 Hama 壽司官方 App 先線上取號／預約時段' }),
    rest('r-kokuto', 'The Sinmay（新明咖啡）', { nameJa: 'THE SINMAY／sinmay coffee（シンメイコーヒー）', type: '黑糖飲料・咖啡', area: '今歸仁 玉城', group: 'cafe', addedBy: '心萱', source: 'IG', mapQuery: 'The Sinmay 今帰仁', placeId: 'ChIJZyTTIT_55DQRoQD1hO7rxy4', address: '今帰仁村玉城 292-2', phone: '070-8963-2873', hours: '10:00–16:30（Google Maps）；不定休，出發前看 IG @sinmaycoffee', parking: '停車場在店後面', recommend: '現刨黑糖咖啡（可以加珍珠）；也有黑糖珍珠奶茶', description: '藏在今歸仁住宅區裡的飲料小店，點餐時當場刨沖繩純黑糖；咖啡豆用沖繩傳統大鍋（シンメーナービ）直火烘焙', notes: '【離 Day 5（3/6）哪裡最近】最近的是「古宇利大橋」過橋前的南展望所，直線約 4 km，開車大約 10 分鐘；其次是古宇利島の駅 ソラハシ（約 5 km）；晚餐的ゆくるば約 9–10 km。可以在過古宇利大橋之前，或離開古宇利島要去備瀬時繞過來。【小提醒】16:30 打烊，評論說 10:30 後人會變多；刨黑糖要另外加價；只有少數戶外座位，在住宅區裡，周圍沒什麼其他店；招牌是深藍色圓形「t.」標誌' }),
    rest('r-pork', 'Pork Tamago 飯糰', { type: '飯糰', area: '那霸 牧志', addedBy: '心萱', mapQuery: 'ポークたまごおにぎり 牧志市場本店', placeId: 'ChIJRX9edXpp5TQRRGYawVc2Jmk', price: '約 ¥400–800／個', recommend: '炸蝦塔塔醬飯糰、苦瓜天婦羅、油味噌', hours: '7:00–20:00', address: '那霸市松尾 2-8-35', phone: '098-867-9550', description: '現點現做的沖繩國民飯糰', notes: '早上常大排長龍；內用座位在隔壁另一間；那霸機場國內線、國際線也有分店' }),
    rest('r-rise', 'Grill&Pancake RISE', { type: '早午餐・鬆餅', area: '那霸 鏡原', status: 'planned', day: 9, group: 'cafe', mapQuery: 'Grill&Pancake RISE', placeId: 'ChIJ9_PYOABp5TQRlynY01fe_6k', price: '¥1,000–2,000', recommend: '香草風味鬆餅、厚切培根和香腸、阿古豬墨西哥餅配太陽蛋', hours: '8:00–15:00（週一、週二公休）', address: '那霸市鏡原町 3-7 101', phone: '080-2573-0322', description: '叢林風小店的美式早餐，份量大，評分 4.9', notes: '3/10 是星期三，有營業；在往機場的方向，吃完去還車很順', reservationInfo: '不用預約' }),
    rest('r-tsubaki', '居酒屋 つばき', { nameJa: '居酒屋 つばき', type: '沖繩料理・海鮮', area: '恩納村 前兼久', status: 'planned', needReservation: true, reserveOn: '2026-12-30', day: 3, mapQuery: '居酒屋 つばき 恩納村', placeId: 'ChIJC2Idccoa5TQRJ67HaZITSQI', price: '約 ¥3,000–3,500／人（含飲料）', recommend: '招牌炸豬腳（テビチ唐揚げ）、生魚片、海葡萄、ラフテー、苦瓜炒、泡盛', hours: '12:00–16:00、17:00–23:00', address: '恩納村前兼久 858-1', phone: '098-965-7705', description: '恩納村很熱門的沖繩料理居酒屋，平價又好吃，常常訂不到位', notes: '從 BLISSTIA 走路約 2 分；跟 3/5 的 Yanbaru Meat 同一棟；可刷卡、PayPay；3/3 うりずん已吃沖繩家常菜、3/5 中午濱之家會吃整條魚，這天可以多點炸豬腳和生魚片', reservationInfo: '【何時訂】目前（11/27）可以訂到 1/31，大約開放到兩個月後，3/4 預計 12/30 左右就能訂；如果還沒開放，隔幾天再看一次，一開放就訂（很熱門）。【怎麼訂】Tabelog 中文頁網路訂位（點「官網」按鈕），選 3/4、18:30、2 位；或打電話 098-965-7705：「3月4日、木曜日、夜6時半から、2名で予約をお願いします。名前は〇〇です。」【時段】訂 18:30。', website: 'https://tabelog.com/tw/okinawa/A4703/A470303/47002391/' }),
    rest('r-jam', 'STEAK HOUSE jam', { nameJa: '鉄板焼ステーキハウス jam', type: '鐵板燒牛排', area: '恩納村 富着', status: 'wishlist', needReservation: true, day: null, mapQuery: '鉄板焼ステーキハウス jam 恩納', placeId: 'ChIJRXd-q8sa5TQRoWgWK5sNhII', price: '套餐約 ¥3,300–9,500', recommend: '牛排＆大蝦套餐 ¥4,500、菲力套餐 ¥3,300、牛排＆龍蝦 ¥6,000、石垣牛沙朗套餐 ¥9,500', hours: '17:00–22:00（週六日中午也有營業）', address: '恩納村富着 1518', phone: '098-965-2626', description: '南洋海盜風的鐵板燒店，師傅在面前現煎，有 50 種以上套餐', notes: '份量很大（套餐一人約 300g），胃口小可以選小份量的套餐；開頭有咖哩湯，最後有扶桑花果凍；從 BLISSTIA 開車約 10 分', reservationInfo: '【何時訂】2 個月前開放訂位，3/4 大約 1/4 就能訂，開放後就先訂（我們訂 18:30）。【怎麼訂】食べログ（Tabelog）中文訂位頁（點「官網」按鈕），或打電話 098-965-2626。', website: 'https://s.tabelog.com/tw/okinawa/A4703/A470303/47000080/?tb_from_lang_modal=1' }),
    rest('r-mokulele', 'MOKULELE', { nameJa: 'カフェ モクレレ', type: '早午餐', area: '本部 大濱', status: 'wishlist', day: null, group: 'cafe', mapQuery: 'MOKULELE 本部', placeId: 'ChIJNycQX4H75DQRCgY25zensgY', price: '約 ¥1,000–1,500', recommend: '塔可飯套餐、法式吐司套餐、夏威夷風 poke 碗、現打果汁', hours: '7:00–14:00', address: '本部町大濱 872-9', phone: '080-6499-3331', description: '沖繩電視節目介紹過的人氣早餐店，夏威夷風，陽台位看得到海', notes: '盡量坐陽台；份量很足；備案是 Fruit Cafe（9:00–15:00，只收現金）', reservationInfo: '不用預約' }),
    rest('r-hamanoya', '濱之家 Hamanoya', { nameJa: '浜の家', type: '海鮮・整條魚', area: '恩納村 仲泊', status: 'planned', day: 4, mapQuery: '浜の家 恩納村', placeId: 'ChIJRfq8yKAa5TQRqpJVaPpJhR4', price: '午餐平均約 ¥2,000', recommend: '整條魚奶油香煎（鐵板上桌）、炸魚、海鮮定食', hours: '11:00–21:30（最後點餐 20:00，無公休）', address: '恩納村仲泊 2097', phone: '098-965-0870', description: '恩納村的老字號海鮮餐廳，評分 4.4、3,500 多則評論', notes: '從 BLISSTIA 開車約 10 分，有專用停車場 13 台；有英文菜單、座敷和掘りごたつ座位；老闆是退休漁夫，自己挑魚', reservationInfo: '不訂位，直接去。店很大（約 125 席），11:00 一開門就到最保險；想臨時訂可以打 098-965-0870 或用 SAVOR JAPAN（點「官網」按鈕）', website: 'https://savorjapan.com/0006017782/map' }),
    rest('r-yanbaru', 'Yanbaru Meat', { type: '牛排・西式小菜', area: '恩納村 前兼久', status: 'planned', needReservation: true, reserveOn: '2027-01-05', day: 4, mapQuery: 'Yanbaru Meat 恩納', placeId: 'ChIJ0wPjcMoa5TQROmbpLullsko', price: '約 ¥3,000–5,000', recommend: '夏多布里昂、沙朗牛排、蒸豬肉、蒜香炒飯、凱薩沙拉', hours: '17:00–24:00（週三、週日公休）', address: '恩納村前兼久 858-1 2F', phone: '098-923-3915', description: '氣氛熱鬧的牛排小酒館，評分 4.7，店員親切', notes: '跟 BLISSTIA 同一區，可以走路或開車幾分鐘', reservationInfo: '【何時訂】2 個月前開放訂位，3/5 大約 1/5 就能訂，開放後就先訂（我們訂 18:30）。【怎麼訂】TableCheck 訂位頁（點「官網」按鈕，跟沖繩料理しまぶた屋同一個頁面，選 Yanbaru Meat），或打電話 098-923-3915。', website: 'https://www.tablecheck.com/shops/shimabutaya/reserve' }),
    rest('r-yukuruba', 'ゆくるば', { nameJa: 'ゆくるば｜カフェ & あぐー豚しゃぶしゃぶ', type: '阿古豬涮涮鍋・咖啡', area: '本部 備瀬', status: 'planned', needReservation: true, reserveOn: '2027-01-06', day: 5, mapQuery: 'ゆくるば 備瀬', placeId: 'ChIJiSmQpjv65DQR_4gb3c97PIc', price: '約 ¥2,000–4,000', recommend: '阿古豬涮涮鍋、芒果汁', hours: '11:00–16:00、17:00–22:00', address: '本部町備瀬 403', phone: '0980-43-1271', parking: '店門口有停車位', description: '福木林道旁被綠樹包圍的小店，白天是咖啡廳、晚上吃涮涮鍋', notes: '離 Yukurina 開車約 5 分', reservationInfo: '【何時訂】2 個月前開放訂位，3/6 大約 1/6 就能訂，開放後就先訂，訂 19:30（先在心型岩看完夕陽，開車約 30 分過來）；沒有 19:30 就選最接近的時段。【怎麼訂】食べログ（Tabelog）中文訂位頁（點「官網」按鈕），或打電話 0980-43-1271。', website: 'https://s.tabelog.com/tw/okinawa/A4702/A470202/47031589/?tb_from_lang_modal=1' }),
    rest('r-fukugiya', 'ふくぎ屋', { nameJa: 'ふくぎ屋', type: '沖繩麵・定食', area: '本部 備瀬', status: 'planned', day: 6, mapQuery: 'ふくぎ屋 備瀬', placeId: 'ChIJbYkXrjv65DQRMcI12696IAY', price: '約 ¥1,000–1,500', recommend: '限定的海藻（アーサ）沖繩麵、排骨沖繩麵、苦瓜炒、塔可飯、芒果汁', hours: '11:30–14:30（週四公休）', address: '本部町備瀬 388-3', phone: '0980-43-5001', description: '就在福木林道裡，往翡翠海灘的路上，在地人也常來', notes: '14:30 就關門，逛完海灘先來吃再散步林道', reservationInfo: '不用預約' }),
    rest('r-topu', '沖縄そばと島どうふ TOPU', { nameJa: '沖縄そばと島どうふ【TOPU】', type: '沖繩麵・島豆腐', area: '本部 濱元', status: 'planned', day: 6, mapQuery: '沖縄そばと島どうふ TOPU', placeId: 'ChIJBwhDebv75DQRcEJjtmWX6I4', price: '約 ¥1,000–1,500', recommend: '島豆腐沖繩麵、三種豆腐套餐、花生豆腐、炸雞、薑燒豬肉、炸麵團甜點', hours: '11:00–15:00、17:00–21:00（週二公休，週一只有中午）', address: '本部町濱元 233', phone: '0980-43-4390', description: '自己做島豆腐的老派小店，評分 4.6，豆腐又輕又綿', notes: '只收現金；招牌在路邊不明顯，看到機車行就要減速；對向車道不能右轉進去', reservationInfo: '不用預約' }),
    // ───── 以下從 IG 收藏整理（2026/11）─────
    // 必吃
    rest('r-morningbowls', 'MORNING BOWLS 波之上店', { nameJa: 'MORNING BOWLS NAMINOUE CAFE', type: '早午餐・Poke 碗', area: '那霸 若狹', group: 'cafe', source: 'IG', mapQuery: 'MORNING BOWLS NAMINOUE CAFE', address: '那霸市若狹 1-21-1（KAINOA 1F）', recommend: '沖繩縣產生鮪魚 Poke 碗＋巴西莓果碗；也有現煎鬆餅', description: '北谷人氣夏威夷早午餐店的那霸分店，就在波之上沙灘旁，白色裝潢很有度假感', notes: '從波上宮、波之上沙灘走路約 3–5 分，可以參拜完過來吃' }),
    rest('r-jun', '琉球涮涮鍋 純 今歸仁本店', { nameJa: 'Aguu 石垣牛 琉球しゃぶしゃぶ 純 今帰仁本店', type: '涮涮鍋・壽喜燒', area: '今歸仁', source: 'IG', mapQuery: '琉球しゃぶしゃぶ純 今帰仁本店', recommend: '阿古豬、石垣牛', notes: 'IG 收藏推薦的壽喜燒／涮涮鍋' }),
    rest('r-diver', '潛水員牛排', { type: '牛排', source: 'IG', notes: 'IG 網友推薦很好吃，但要等很久；日文店名待確認' }),
    rest('r-711-choco', '7-11 生巧克力冰淇淋', { type: '超商', area: '7-ELEVEN', group: 'store', source: 'IG', price: '約台幣 72 元', recommend: '很濃但不會太甜也不會太苦，大約半糖' }),
    rest('r-711-ramen', '天下一品 京都濃厚雞白湯 杯麵', { nameJa: '名店の味 天下一品 京都濃厚鶏白湯（サッポロ一番）', type: '超商', area: '7-ELEVEN', group: 'store', source: 'IG', recommend: '一定要買「大杯」，麵體像拉麵店；加一顆溏心蛋更好吃', notes: '黑色杯身、紅色圓形「天下一品」標誌；熱水 200ml、泡 3 分鐘。含雞肉成分，在日本當宵夜吃掉就好，別帶回台灣' }),
    rest('r-711-matcha', '7-11 抹茶奶昔', { type: '超商', area: '7-ELEVEN', group: 'store', source: 'IG', recommend: '抹茶奶昔＋明治牛奶（約 1/3 杯）＋冰塊杯', notes: '很難買到，看到就先拿' }),
    rest('r-pudding', '超商焦糖布丁（感動布丁）', { type: '超商', area: '超商', group: 'store', source: 'IG', recommend: '網友說是全日本最好吃的超商布丁', notes: '在哪家超商買在影片裡，待補' }),
    rest('r-lawson-tea', 'LAWSON 無糖鮮奶茶', { type: '超商', area: 'LAWSON', group: 'store', source: 'IG', recommend: '無糖，可以自己加糖球', notes: '只有部分分店有賣，看到就買' }),
    rest('r-lawson-list', 'LAWSON 必買清單', { type: '超商', area: 'LAWSON', group: 'store', source: 'IG', recommend: '香草優格、麻糬生乳捲、火腿起司、鹽味雞湯泡麵、巧克力麻糬麵包、洋蔥餅乾、季節水果冰棒' }),

    // 必買
    rest('b-donki', '唐吉訶德', { kind: 'buy', type: '藥妝・雜貨', area: '國際通', status: 'planned', day: 1, source: 'IG', mapQuery: 'ドン・キホーテ 国際通り店', recommend: '結帳前先用 Google 搜尋「唐吉訶德 Coupon」領折價券', description: '除了免稅，滿 ¥10,000 再折 5%、滿 ¥30,000 再折 7%，可以疊在一起用', notes: '結帳時店員會提醒出示 Coupon；也要給護照辦免稅。Day 1 國際通行程有寫壺川店（營業到凌晨 3:00）' }),
    rest('b-botanist', 'BOTANIST 護髮油', { kind: 'buy', type: '藥妝', area: '藥妝店', source: 'IG', recommend: '吹頭髮前擦，乾燥受損髮吹完變順又亮', notes: 'IG 上說回台灣最後悔沒多買' }),
    rest('b-parco', 'PARCO CITY', { kind: 'buy', type: '購物中心', area: '浦添', status: 'planned', day: 7, source: 'IG', mapQuery: 'サンエー浦添西海岸 PARCO CITY', placeId: 'ChIJxZQf9gpr5TQRwLWyT5Osigc', address: '浦添市西洲 3-1-1', hours: '10:00–22:00（1F サンエー食品館 9:00–23:00）', recommend: '1F 超市買伴手禮比機場便宜；有沖繩唯一的吉伊卡哇餐廳', description: '海邊的大型購物中心，約 250 間店，日系服飾、藥妝、3COINS、家電都有', notes: '記得到免稅櫃台辦一站式退稅' }),
    rest('b-omiyage', '沖繩 6 項必買伴手禮', { kind: 'buy', type: '伴手禮', source: 'IG', recommend: '①沖繩麵泡麵（マルちゃん 沖縄そば，かつおとソーキ味）②加料海帶芽湯包（あーさ汁，沖繩限定）③雪鹽金楚糕（雪塩ちんすこう）④沖繩縣產海蘊（美ら島もずく）⑤塔可飯口味薯條餅乾（Calbee じゃがりこ タコライス味，沖繩限定，有小包裝）⑥雪鹽夾心餅乾（雪塩さんど、雪塩ぱりん）', description: '去過四次沖繩的 IG 作者整理的必買清單，超市、伴手禮店大多買得到', notes: '⚠️ 帶回台灣：沖繩麵泡麵是ソーキ（豬排骨）口味，塔可飯口味也可能含肉，含豬肉的食品不能帶回台灣（違規罰 20 萬）。買之前看包裝背面原材料，有「豚肉」「ポーク」「ポークエキス」就別買' }),
    rest('r-kokuto-choco', 'KOKUTO CHOCOLAT 黑糖巧克力甜點', { type: '甜點', area: '名護 許田休息站', group: 'cafe', status: 'planned', day: 5, source: 'IG', mapQuery: '道の駅 許田', placeId: 'ChIJFfz3q_H_5DQRttsFg7-7wLE', hours: '8:30–19:00（許田休息站）', recommend: '沖繩限定的黑糖巧克力甜點，IG 說是必吃等級、市面上很少見', notes: '在許田休息站的冷藏櫃找；買了要冷藏，當天吃掉最好' }),

    // 景點
    rest('s-churaumi', '美麗海水族館', { kind: 'sight', type: '水族館', area: '本部', status: 'planned', day: 6, source: 'IG', mapQuery: '沖縄美ら海水族館', placeId: 'ChIJPZ5hUjH65DQR_p_dD3CmCOo', address: '本部町石川 424', recommend: '早上鬼蝠魟餵食秀、下午 15:00 鯨鯊餵食秀，兩場畫面不一樣', description: '一早進場先到 Ocean Blue 咖啡廳預約指定席（¥1,000＋低消，約 40 分鐘），坐著看黑潮之海的鬼蝠魟餵食秀；再去黑潮探險（鯨鯊展區旁的專用電梯）、看海豚表演；下午提早 10–20 分鐘回黑潮之海卡位看鯨鯊', notes: '離館前記得蓋手章，下午可以再進場；表演時間以官網當天公告為準' }),
    rest('s-sesoko', '瀨底島', { kind: 'sight', type: '海島・海灘', area: '本部', source: 'IG', mapQuery: '瀬底島', address: '本部町瀬底 2631-1' }),
    rest('s-genki', '本部元氣村', { kind: 'sight', type: '海洋體驗', area: '本部', source: 'IG', mapQuery: '本部元気村', address: '本部町字浜元 410' }),
    rest('s-ryukyubeach', 'RYUKYU BEACH CLUB', { kind: 'sight', type: '海灘', area: '恩納村', source: 'IG', mapQuery: 'RYUKYU BEACH CLUB 恩納村', address: '恩納村字瀬良垣 1521-1' }),
    rest('s-minatogawa', '港川外人住宅街', { kind: 'sight', type: '街區散步', area: '浦添', source: 'IG', mapQuery: '港川外人住宅街', address: '浦添市港川 2 丁目 17 番周邊' }),
    rest('s-daruma', '達摩寺', { kind: 'sight', type: '寺廟', area: '那霸 首里', source: 'IG', mapQuery: '達磨寺 首里', address: '那霸市首里赤田町 1-5-1' }),
    rest('s-senaga', '瀨長島', { kind: 'sight', type: '海邊小鎮', area: '豐見城', status: 'planned', day: 2, source: 'IG', mapQuery: '瀬長島ウミカジテラス', address: '豐見城市瀬長 174-6' }),
    rest('s-americanvillage', '美國村', { kind: 'sight', type: '街區散步', area: '北谷', status: 'planned', day: 3, source: 'IG', mapQuery: '美浜アメリカンビレッジ', address: '北谷町字美浜 9-1' }),
    rest('s-naminoue', '波上宮', { kind: 'sight', type: '神社', area: '那霸', source: 'IG', mapQuery: '波上宮', recommend: '參拜完走到旁邊的 MORNING BOWLS 吃早午餐', notes: '旁邊就是波之上沙灘' })
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

  // 日本自駕提醒（一般常識＋IG 收藏整理，可自行增修）
  // 每一組：{ title: 標題, items: [...] }
  var drivingTips = [
    { title: '要帶的證件', items: [
      '台灣護照＋台灣駕照正本＋日文譯本，三樣缺一不可（國際駕照不能用）',
      '日文譯本到監理所申請，當場就拿得到'
    ] },
    { title: '開車基本', items: [
      '日本靠左行駛，駕駛座在右邊',
      '轉彎口訣「左小圈、右大圈」，隨時提醒自己靠左',
      '方向燈和雨刷跟台灣相反：右手打方向燈、左手是雨刷',
      '看到倒三角「止まれ」要完全停下約 3 秒，確認左右沒車再走；沒停好很容易被開單',
      '一定要禮讓行人；開車全程不能滑手機',
      '導航用 CarPlay 接手機開 Google Maps，有中文語音'
    ] },
    { title: '高速公路・ETC', items: [
      '高速公路限速 80，右側是超車道；不熟路就開左側',
      '有租 ETC 卡才走紫色「ETC 專用」車道；沒租的話走綠色「一般」車道，抽票付現'
    ] },
    { title: '停車・加油', items: [
      '超商停車位只給當下買東西的人用，不能停著去逛街',
      '加油時告訴店員「レギュラー、満タン」＝一般汽油加滿；千萬別加錯油（以租車公司規定為準）'
    ] },
    { title: '發生事故怎麼辦', items: [
      '出發前先把台灣門號的「Wi-Fi 通話」打開，用 eSIM 上網時才打得出去（找手機設定裡顯示你台灣電話號碼的那張卡）',
      '先確認人車安全，再打給租車公司或保險公司，請他們幫忙報警（警察 110）',
      '警察大約 15 分鐘到，準備台灣駕照、日文譯本、副駕駛座前方置物箱的車檢證給警察看',
      '拍照：自己的車況，還有撞到的東西（例如護欄）',
      '輕微擦撞不影響開車的話可以繼續玩；嚴重的話請租車公司處理',
      '還車當天提早 10 分鐘到，現場填事故單'
    ] }
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

  // 出發前待辦：到了 date 那天，首頁會跳出提醒；在「工具 › 重要預約」打勾完成
  var todos = [
    { id: 'todo-yukurina-selfcheckin', date: '2027-01-06', title: '寫信給 Yukurina 海風：3/6 晚到、自助入住',
      detail: '最晚 3/3 前要聯絡。跟飯店說：3/6（六）大約 21:00 到，想要自助入住（セルフチェックイン），請寄入住步驟和拿鑰匙的方法。聯絡方式：訂房確認信上的 email，或電話 0980-48-3903（11:00–18:00）。' },
    { id: 'todo-cancel-yukurina', date: '2027-02-05', title: '取消期限：Yukurina 2/10 後就不能退款',
      detail: '2/10 前（沖繩時間）可免費取消，2/11 起不可退款。行程或房型要改的話，這幾天內決定。' },
    { id: 'todo-vjw', date: '2027-02-15', title: '兩人各自登錄 Visit Japan Web',
      detail: '登錄護照、航班、第一晚住宿，填完入境審查和海關申報，把 QR Code 截圖存在手機。', link: '#/tools/guide', linkLabel: '看步驟' },
    { id: 'todo-esim', date: '2027-02-15', title: '買 eSIM 並在台灣先安裝好',
      detail: '兩人各買一張 9 天方案；有 Wi-Fi 時先安裝，到沖繩落地再打開數據漫遊。', link: '#/tools/guide', linkLabel: '看步驟' },
    { id: 'todo-cancel-torifito', date: '2027-02-17', title: '取消期限：托麗芙特約 2/22 後要付全額',
      detail: '入住前 14 天（約 2/22）前可免費取消，之後取消要付全額，實際日期以訂房確認信為準。' },
    { id: 'todo-cancel-blisstia', date: '2027-02-19', title: '取消期限：BLISSTIA 2/24 後就不能退款',
      detail: '2/24 前（沖繩時間）可免費取消，2/25 起不可退款。' },
    { id: 'todo-cancel-azat', date: '2027-02-21', title: '取消期限：HOTEL AZAT 2/26 後只能部分退款',
      detail: '2/26 前（沖繩時間）可免費取消；2/27–2/28 只能部分退款；3/1 起不可退款。' },
    { id: 'todo-checkin-flight', date: '2027-02-28', title: '星宇 JX870 線上報到',
      detail: '2/28 11:40 起開放（起飛前 48 小時），兩人都要辦，登機證存在手機。', link: 'https://www.starlux-airlines.com/zh-TW/check-in-fly/check-in-now/online-check-in', linkLabel: '星宇線上報到' }
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
    travelGuide: travelGuide,
    todos: todos,
    stayTaxNote: '沖繩 2027/2/1 起收住宿稅，入住時在飯店櫃台另外付，就算房費已經刷卡付清也一樣。稅額是「每人每晚」房價（不含餐費、消費稅）的 2%，每人每晚最多 ¥2,000；例如一晚房價 ¥20,000、兩個人住，每人算 ¥10,000，兩人共付約 ¥400。金額以飯店現場收取為準，記得留一點日圓現金或帶信用卡。',
    stamps: stamps
  };
})();
