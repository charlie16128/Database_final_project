-- 初始種子資料 (Seed Data)
-- 執行 schema.sql 後才可執行此檔案

-- 範例會員 (密碼皆為 "password123" 的 bcrypt hash，實際部署請替換)
-- INSERT INTO users (username, email, password_hash) VALUES
--   ('Alice', 'alice@example.com', '$2b$10$...'),
--   ('Bob',   'bob@example.com',   '$2b$10$...');

-- 範例商品
-- INSERT INTO items (user_id, title, category, description, condition, status) VALUES
--   (1, '貓咪抓板', '貓咪用品', '九成新，貓咪不愛用', '良好', '刊登中'),
--   (1, '狗狗牽繩', '狗狗用品', '使用三個月', '良好', '刊登中');

-- 範例永續指南
INSERT INTO guides (title, category, content) VALUES
  ('如何清潔二手寵物籠', '清潔保養', '使用稀釋的漂白水擦拭籠子各角落，晾乾後即可使用。'),
  ('寵物用品捐贈資源整理', '循環再利用', '許多動物收容所接受二手寵物用品捐贈，可聯絡當地收容所了解需求。'),
  ('環保材質寵物用品推薦', '永續飼養', '竹製寵物碗、有機棉玩具等環保材質用品，對環境友善且耐用。');
