# 寵物用品循環平台 - 開發任務清單 (Tasks)

## 第 1 階段：建立基本專案架構
- [x] 1. 安裝所需套件 (vue-router, express, better-sqlite3, cors, bcrypt, jsonwebtoken, multer 等)
- [x] 2. 建立 Vue Router 結構
- [x] 3. 建立 Express server 基礎架構
- [x] 4. 建立 SQLite database 檔案
- [x] 5. 建立 schema.sql 匯入資料表結構

## 第 2 階段：會員系統
- [x] 1. 實作註冊 API
- [x] 2. 實作登入 API
- [x] 3. 實作 bcrypt hash 密碼功能
- [x] 4. 實作 JWT 驗證 middleware
- [x] 5. 製作 Vue 登入與註冊頁面 (RegisterView, LoginView)
- [x] 6. 設定前端路由守衛 (Route Guards)

## 第 3 階段：商品系統
- [x] 1. 建立商品資料表 (items)
- [x] 2. 實作商品 API CRUD 功能
- [x] 3. 實作 multer 圖片上傳功能至 `server/uploads`
- [x] 4. 製作商品列表頁 (ItemListView) 及商品卡片元件 (ItemCard)
- [x] 5. 製作商品詳細頁 (ItemDetailView)
- [x] 6. 製作新增與修改商品頁 (ItemCreateView, ItemEditView)

## 第 4 階段：留言系統
- [ ] 1. 建立商品留言資料表 (item_comments)
- [ ] 2. 實作留言 API (取得、新增、刪除)
- [ ] 3. 實作商品詳細頁內的留言區塊元件 (CommentList)
- [ ] 4. 實作刪除自己留言的功能驗證

## 第 5 階段：私訊聊天室
- [ ] 1. 建立聊天室資料表 (chat_rooms)
- [ ] 2. 建立聊天訊息資料表 (chat_messages)
- [ ] 3. 實作建立/取得聊天室 API 及訊息 API
- [ ] 4. 製作私訊列表頁 (MessagesView) 及列表元件 (ChatList)
- [ ] 5. 製作聊天室頁 (ChatRoomView) 及視窗元件 (ChatWindow)
- [ ] 6. 實作傳送與顯示訊息功能

## 第 6 階段：永續指南
- [ ] 1. 建立指南資料表 (guides)
- [ ] 2. 製作指南列表頁 (GuideListView)
- [ ] 3. 實作指南新增與修改頁面
- [ ] 4. 實作指南內容顯示功能

## 第 7 階段：外觀與整理
- [ ] 1. 統一個頁面與元件的配色 (主題：溫暖、乾淨、自然、寵物友善)
- [ ] 2. 實作 RWD 響應式佈局 (Mobile/Desktop)
- [ ] 3. 優化表單錯誤提示機制 (自訂錯誤訊息)
- [ ] 4. 補上專案 README.md 說明文件
- [ ] 5. 測試所有 API 與頁面流程是否順暢
