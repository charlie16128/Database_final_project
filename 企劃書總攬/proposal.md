# 寵物用品循環平台 - 專案計畫書 (Proposal)

## 專案架構總覽

本專案是一個以 **Vue 3 + Vite** 製作前端畫面，搭配 **Node.js + Express** 作為後端 API，並使用 **SQLite** 作為資料庫的寵物用品循環平台。
系統主要提供會員註冊登入、二手寵物用品刊登、商品留言、私訊聊天室、永續指南管理與商品搜尋功能。

專案目錄結構概覽：
- `src/`: Vue 前端 (包含 components, views, router, services 等)
- `server/`: Express 後端 (包含 API routes, middleware, sqlite database, file uploads 等)

## 技術選型

| 類別 | 技術 | 用途 |
|---|---|---|
| 前端框架 | Vue 3 + Vite | 製作 SPA 網頁 |
| 前端路由 | Vue Router | 控制頁面切換 |
| 後端 | Node.js + Express | 提供 API 給 Vue 呼叫 |
| 資料庫 | SQLite | 儲存會員、商品、留言、聊天室資料 |
| 密碼加密 | bcrypt | 將密碼 hash 後存入資料庫 |
| 登入驗證 | JWT | 維持登入狀態 |
| 圖片上傳 | multer | 將圖片存到 server/uploads |
| API 呼叫 | fetch | Vue 呼叫 Express API |

## 系統目標

本平台的主要目標是建立一個寵物用品循環再利用平台，讓飼主可以刊登閒置用品、與其他會員交流、透過私訊聯絡商品擁有者，並閱讀永續飼養相關知識。

主要功能包含：
1. 會員註冊、登入、登出
2. 密碼使用 bcrypt hash 後存入 SQLite
3. 二手寵物用品新增、修改、刪除、查詢
4. 商品狀態管理：刊登中、已預訂、已完成
5. 商品圖片上傳至 `server/uploads`
6. 商品頁留言功能
7. 私訊聊天室功能
8. 永續指南新增、修改與顯示
9. RWD 響應式外觀設計

## 預期成果

完成後，本專案可以在 localhost 執行，使用者能夠註冊登入、刊登二手寵物用品、上傳圖片、留言、聯絡商品擁有者並建立永久聊天室。
資料會儲存在 SQLite 中，圖片會存放在 `server/uploads`，整體功能符合資料庫期末專案對 CRUD、關聯資料表與前後端整合的需求。
