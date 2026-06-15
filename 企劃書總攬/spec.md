# 寵物用品循環平台 - 系統規格書 (Specification)

## 1. API 設計

### Auth API
| 方法 | 路徑 | 功能 |
|---|---|---|
| POST | `/api/auth/register` | 註冊會員 |
| POST | `/api/auth/login` | 登入 |
| GET | `/api/auth/me` | 取得目前登入者 |

### Item API
| 方法 | 路徑 | 功能 |
|---|---|---|
| GET | `/api/items` | 取得商品列表 |
| GET | `/api/items/:id` | 取得商品詳細資料 |
| POST | `/api/items` | 新增商品 |
| PUT | `/api/items/:id` | 修改商品 |
| DELETE | `/api/items/:id` | 刪除商品 |
| GET | `/api/my/items` | 查看我的商品 |

### Comment API
| 方法 | 路徑 | 功能 |
|---|---|---|
| GET | `/api/items/:id/comments` | 取得商品留言 |
| POST | `/api/items/:id/comments` | 新增商品留言 |
| DELETE | `/api/comments/:id` | 刪除自己的留言 |

### Guide API
| 方法 | 路徑 | 功能 |
|---|---|---|
| GET | `/api/guides` | 取得永續指南列表 |
| GET | `/api/guides/:id` | 取得指南詳細資料 |
| POST | `/api/guides` | 新增指南 |
| PUT | `/api/guides/:id` | 修改指南 |
| DELETE | `/api/guides/:id` | 刪除指南 |

### Chat API
| 方法 | 路徑 | 功能 |
|---|---|---|
| POST | `/api/chats/start` | 建立或取得聊天室 |
| GET | `/api/chats` | 取得我的聊天室列表 |
| GET | `/api/chats/:roomId/messages` | 取得聊天室訊息 |
| POST | `/api/chats/:roomId/messages` | 傳送訊息 |

---

## 2. Vue 頁面規劃

### HomeView.vue
- 首頁，呈現平台標語、二手用品循環概念、商品分類入口與最新商品區塊。

### RegisterView.vue
- 欄位：使用者名稱、Email、密碼、確認密碼。
- 驗證：不可空白、Email 格式、密碼長度 >= 6、兩次密碼相同。

### LoginView.vue
- 欄位：Email、密碼。登入成功後存 token 到 `localStorage`。

### ItemListView.vue
- 顯示商品卡片、分類搜尋、商品狀態篩選、關鍵字搜尋。

### ItemDetailView.vue
- 顯示圖片、名稱、分類、狀態、描述、擁有者資訊。
- 顯示及新增留言。聯絡擁有者按鈕進入聊天室。本人可編輯與刪除。

### ItemCreateView.vue
- 表單欄位：名稱、分類、狀況、描述、圖片。使用 `FormData`。

### ItemEditView.vue
- 載入原本資料並修改。可重新上傳圖片。

### MyItemsView.vue
- 查看自己刊登的商品，快速修改狀態、進入編輯頁或刪除。

### GuideListView.vue
- 顯示指南列表、點擊進入內容、新增與修改指南。

### MessagesView.vue
- 私訊列表：顯示聊天室對方名稱、商品名稱、最後訊息。

### ChatRoomView.vue
- 顯示聊天紀錄、傳送訊息、顯示商品資訊。

---

## 3. Vue 共用元件設計

### Navbar.vue
- 導覽列。登入前：首頁 / 商品 / 指南 / 登入 / 註冊
- 登入後：首頁 / 商品 / 新增商品 / 我的商品 / 私訊 / 登出

### ItemCard.vue
- 商品卡片。顯示：圖片、名稱、分類、狀態、查看詳情按鈕。

### ItemForm.vue
- 新增與修改共用表單。Props: `item`, `isEdit`。Emit: `submit`。

### CommentList.vue
- 顯示留言列表及新增留言區塊。

### ChatList.vue
- 聊天室列表。顯示對方名稱、商品名稱、最後訊息及時間。

### ChatWindow.vue
- 聊天視窗。顯示訊息列表及輸入送出區塊。

---

## 4. 前端路由設計

```js
const routes = [
  { path: '/', component: HomeView },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/items', component: ItemListView },
  { path: '/items/new', component: ItemCreateView, meta: { requiresAuth: true } },
  { path: '/items/:id', component: ItemDetailView },
  { path: '/items/:id/edit', component: ItemEditView, meta: { requiresAuth: true } },
  { path: '/my-items', component: MyItemsView, meta: { requiresAuth: true } },
  { path: '/guides', component: GuideListView },
  { path: '/guides/:id/edit', component: GuideEditView, meta: { requiresAuth: true } },
  { path: '/messages', component: MessagesView, meta: { requiresAuth: true } },
  { path: '/messages/:roomId', component: ChatRoomView, meta: { requiresAuth: true } }
]
```
- 路由守衛：若頁面 `requiresAuth: true`，且無 token 則導向 `/login`。
