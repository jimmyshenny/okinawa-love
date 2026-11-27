# 沖繩蜜月旅行 · Okinawa, with Love

Jimmy & Shenny 的沖繩蜜月旅行網站，日期是 2027/03/02–03/10（9 天 8 夜）。整個網站以手機為主，打開過一次之後，沒網路也能看行程。

---

## 一、資料夾裡有什麼

```
okinawa-love/
├─ index.html              網站入口
├─ css/style.css           顏色、字體、版面
├─ js/data.js              ✏️ 行程、餐廳、住宿、航班、租車資料（最常改這個）
├─ js/store.js             資料儲存（手機瀏覽器 + 照片資料庫）
├─ js/ui.js                共用小工具（圖示、彈出視窗、導航連結）
├─ js/app.js               頁面切換、下一站判斷、天氣、匯率
├─ js/pages/home.js        行程 Home
├─ js/pages/transport.js   交通 Transport
├─ js/pages/food.js        清單 Picks（必吃・必買・景點）
├─ js/pages/tools.js       工具 Tools
├─ js/pages/memories.js    回憶 Memories
├─ sw.js                   離線支援
├─ manifest.webmanifest    「加到主畫面」的設定
├─ icons/                  網站圖示
└─ images/                 住宿（stays）、清單（list）照片
```

這個網站不需要安裝任何東西，也不需要 build。把檔案上傳到 GitHub 就能用。

---

## 二、放上 GitHub Pages（用網頁操作，不用指令）

### 1. 建立 repository
1. 登入 GitHub，點右上角 **＋ → New repository**。
2. **Repository name** 取一個不容易被猜到的名字，例如 `okinawa-love`。
3. 選 **Public**。免費帳號的 GitHub Pages 只能用在公開的 repository，所以資料檔裡**不要放訂位代號、電話、證件號碼**（見第四點）。
4. 按 **Create repository**。

### 2. 上傳檔案
1. 在新 repository 頁面點 **uploading an existing file**（或 **Add file → Upload files**）。
2. 把解壓縮後 `okinawa-honeymoon` **資料夾裡面的所有東西**拖進去，包括 `css`、`js`、`icons` 三個資料夾和其他檔案。
   - ⚠️ 不要拖整個外層資料夾。`index.html` 必須在 repository 的最上層。
3. 最下面 **Commit changes** 按下去。

### 3. 開啟 GitHub Pages
1. 進 repository 的 **Settings → Pages**。
2. **Source** 選 **Deploy from a branch**。
3. **Branch** 選 `main`，資料夾選 `/ (root)`，按 **Save**。
4. 等 1–2 分鐘，重新整理這一頁，上方會出現網址：
   `https://jimmyshenny.github.io/okinawa-love/`

### 4. 加到手機主畫面（像 App 一樣打開）
- **iPhone（Safari）：** 打開網址 → 下方「分享」按鈕 → **加入主畫面**。
- **Android（Chrome）：** 打開網址 → 右上角 ⋮ → **加到主畫面／安裝應用程式**。

出發前在兩支手機都打開一次網站，之後在沖繩沒網路也能看行程。

---

## 三、之後要修改內容

### 改行程、餐廳、住宿、航班
1. 在 GitHub 打開 `js/data.js`，點右上角的 ✏️ 鉛筆。
2. 照檔案裡的說明修改，例如：
   ```js
   item('d2-2', '瀨長島', 'sight', '海邊白色小鎮，看飛機起降', {
     time: '14:00',                 // 預計時間，下一站會參考
     duration: '1.5 小時',
     parking: '島上免費停車場',
     driveTime: '25 分鐘',          // 到下一站的車程
     mapQuery: '瀬長島ウミカジテラス'
   }),
   ```
   - 沒有的資料就留空字串 `''`，畫面會自動顯示「待補」。
   - 住宿：找到 `accommodations`，填 `name`、`checkIn`、`address`。
   - 回程航班：`flights.return.date` 確定後填上，例如 `'2027-03-10'`。
3. 按 **Commit changes**。

### ⚠️ 修改後手機沒更新？
網站有離線快取。每次改完檔案，順便打開 `sw.js`，把第 3 行的版本號加 1：
```js
var VERSION = 'okinawa-love-v83';   // 數字加 1
```
手機重新打開網站兩次，就會拿到新版。

### 放照片（景點／住宿照片）
1. 在 repository 裡建一個 `images` 資料夾，上傳照片（建議先壓縮到 500KB 以下）。
2. 在 `data.js` 填路徑，例如 `photos: ['images/sesoko.jpg']` 或 `photo: 'images/hotel.jpg'`。

> 「回憶」頁的旅行照片不用放 GitHub。在網站裡直接新增就好，照片只會存在那支手機。

---

## 四、私人資訊放哪裡？

| 資訊 | 放哪裡 |
|---|---|
| 行程、景點、餐廳名稱、地址 | `data.js`（公開） |
| 訂位代號、訂房編號、租車預約編號、車牌、保單號碼、電子機票連結 | 網站裡有 🔒 的「編輯」按鈕（只存在手機） |
| 護照號碼等證件資料 | **不要存在網站裡** |

「工具 › 重要預約」可以一次看到、填寫所有編號。

---

## 五、資料是怎麼保存的？

- 記帳、行李清單、購物清單、備忘錄、日記、收藏、行程完成狀態、印章，都存在**這支手機的瀏覽器**裡（localStorage）。
- 照片存在瀏覽器的照片資料庫（IndexedDB），上傳時會自動壓縮。
- **兩支手機的資料不會自動同步。** 想合併的話，用「工具 › 資料備份」匯出檔案，傳給對方匯入。
- 清除瀏覽器資料、換手機之前，記得先匯出備份。
- 網站會請瀏覽器把資料標成「要保留」（`navigator.storage.persist()`）。iPhone 建議「加入主畫面」使用，比在 Safari 分頁裡更不容易被清掉。

### 之後想讓兩人即時同步？
所有讀寫資料都集中在 `js/store.js` 的 `Store.get / Store.set`。之後要接 Firebase 或 Supabase，只要改這個檔案，其他頁面都不用動。

---

## 六、各功能怎麼運作

- **今天是哪一天：** 出發前預設 Day 1，旅行期間自動跳到當天，結束後預設最後一天（Day 9）。手動切換的日期，當天重新整理也會保留。
- **下一站：**
  - 今天的行程：顯示第一個還沒按「完成」的地方。
  - 有填 `time` 的話，超過預計時間 90 分鐘會提醒你按「完成」，但不會自動跳過。
  - 看其他天時，顯示「當日第一站」。
- **印章：** 一天的行程全部按完成，就自動蓋章；也可以手動點印章。
- **天氣：** 使用 Open-Meteo 免費預報（不需金鑰），只涵蓋未來 16 天。出發前約兩週起，打開網站就會自動更新（約每 3 小時一次），也可以在「工具 › 天氣」手動更新。還沒有預報時，先顯示那霸 3 月往年平均（17–22°）；也可以點任一天自己填。
- **匯率：** 使用 open.er-api.com（不需金鑰），有網路時自動更新（約每 6 小時一次）。從來沒抓到過的話，先用預設參考匯率 0.20（`js/app.js` 的 `DEFAULT_RATE`）。自己輸入匯率後就不會自動覆蓋；清空輸入框即恢復自動。
- **導航：** 全部用 Google Maps 連結開啟。路線圖是示意圖；要看真實路線，請按「Google Maps 開啟全程」。

---

## 七、在電腦上預覽

直接雙擊 `index.html` 就能看。離線功能只有放上 GitHub Pages（https）後才會啟用。

---

## 八、還需要補的資料

- [ ] 每天的預計時間、車程
- [x] 四間住宿的名稱、地址、入住／退房時間
- [x] 航班：航空公司、航班號碼、時間、航廈
- [ ] 租車公司、取還車地點與時間
- [ ] 哲鳴想去的地方
- [ ] 台北駐日經濟文化代表處那霸分處的電話、旅遊保險資訊
