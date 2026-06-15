# 寵物用品循環平台 - 系統設計 (Design)

## 前後端運作流程

Vue 不直接操作 SQLite，而是透過 API 與後端溝通。

```text
使用者操作 Vue 頁面
        ↓
Vue 使用 fetch 呼叫 API
        ↓
Express 接收請求
        ↓
驗證 JWT / 檢查資料
        ↓
操作 SQLite
        ↓
回傳 JSON 給 Vue
        ↓
Vue 更新畫面
```

登入後呼叫需要權限的 API：
```js
await fetch('/api/items', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  },
  body: formData
})
```

## 資料庫設計

### 1. users 會員資料表
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 2. items 商品資料表
```sql
CREATE TABLE items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  condition TEXT,
  status TEXT DEFAULT '刊登中',
  image_path TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```
- 狀態：刊登中、已預訂、已完成

### 3. item_comments 商品留言資料表
```sql
CREATE TABLE item_comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES items(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### 4. guides 永續指南資料表
```sql
CREATE TABLE guides (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 5. chat_rooms 聊天室資料表
設計邏輯：同一個商品 + 同一個買家 + 同一個擁有者 只建立一個聊天室。
```sql
CREATE TABLE chat_rooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_id INTEGER NOT NULL,
  buyer_id INTEGER NOT NULL,
  owner_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES items(id),
  FOREIGN KEY (buyer_id) REFERENCES users(id),
  FOREIGN KEY (owner_id) REFERENCES users(id)
);
```

### 6. chat_messages 聊天訊息資料表
```sql
CREATE TABLE chat_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id INTEGER NOT NULL,
  sender_id INTEGER NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES chat_rooms(id),
  FOREIGN KEY (sender_id) REFERENCES users(id)
);
```

## 外觀設計規劃

### 1. 整體風格
主題定位為「溫暖、乾淨、自然、寵物友善」。
建議配色：主色(綠色系)、輔助色(米白色)、強調色(橘色)、文字色(深灰色)、背景色(淺灰或米白)。

### 2. 頁面設計重點
- 使用卡片式設計呈現商品
- 按鈕使用圓角
- 表單輸入框不使用瀏覽器預設警告，改用自訂錯誤訊息
- 商品狀態用 badge 標籤顯示
- 手機版商品卡片改為單欄，桌面版三欄或四欄

### 3. RWD 設計
```css
@media (max-width: 768px) {
  .item-grid { grid-template-columns: 1fr; }
  .navbar { flex-direction: column; }
}
```

## 核心邏輯實作說明

### 1. 登入驗證邏輯
- 後端：查詢 `users.email` → 使用 `bcrypt.compare` 驗證密碼 → 成功後產生 JWT → 回傳 token
- 前端：收到 token → 存到 `localStorage` → 往後 API request 都帶 `Authorization` header

### 2. 商品權限邏輯
只有商品擁有者可以修改或刪除商品。
- PUT `/api/items/:id` → 檢查 JWT → 取得目前 `user_id` → 查詢商品 `user_id` → 若不是本人，拒絕操作。

### 3. 圖片上傳邏輯
前端使用 `FormData` → 後端 multer 接收圖片 → 圖片存到 `server/uploads` → SQLite 儲存圖片路徑。

### 4. 聊天室建立邏輯
`POST /api/chats/start`
- 根據 `item_id` 查詢商品擁有者 `owner_id`
- `buyer_id` 來自 JWT，若等於 `owner_id`，不允許聯絡自己
- 查詢是否已有相同 `item_id + buyer_id + owner_id` 的聊天室
- 有則回傳原 `room_id`，沒有則建立新聊天室並回傳

### 5. 商品留言邏輯
會員登入後才能留言。留言會綁定 `item_id` 與 `user_id`。商品詳細頁載入時同步載入留言。
