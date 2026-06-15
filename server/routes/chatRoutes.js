import express from 'express';
import db from '../db/database.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. 取得當前使用者的所有聊天室列表
router.get('/', authenticateToken, (req, res) => {
    const userId = req.user.id;
    try {
    // 找出該使用者參與的所有聊天室，並關聯商品與另一方使用者的資訊
        const stmt = db.prepare(`
            SELECT 
            cr.id AS room_id, 
            cr.item_id, 
            i.title AS item_title,
            i.image_path AS item_image,
            cr.buyer_id, 
            cr.owner_id,
            CASE 
                WHEN cr.buyer_id = ? THEN o.username 
                ELSE b.username 
            END AS other_user_name
            FROM chat_rooms cr
            JOIN items i ON cr.item_id = i.id
            JOIN users b ON cr.buyer_id = b.id
            JOIN users o ON cr.owner_id = o.id
            WHERE cr.buyer_id = ? OR cr.owner_id = ?
            ORDER BY cr.created_at DESC
        `);
    
    // 傳入三次 userId 是因為 SQL 語句中有三個 ? 參數
    const rooms = stmt.all(userId, userId, userId);
    res.json(rooms);
    } catch (error) {
        console.error('獲取聊天室列表失敗:', error);
        res.status(500).json({ error: '獲取聊天室列表失敗' });
    }
});

// 2. 建立或取得特定商品的聊天室 (從商品頁面點擊「聯絡賣家」時觸發)
router.post('/', authenticateToken, (req, res) => {
    const { item_id, owner_id } = req.body;
    const buyer_id = req.user.id;

    if (buyer_id === owner_id) {
        return res.status(400).json({ error: '不能跟自己建立聊天室' });
    }

    try {
        // 先檢查這個組合的聊天室是否已經存在
        const checkStmt = db.prepare('SELECT * FROM chat_rooms WHERE item_id = ? AND buyer_id = ? AND owner_id = ?');
        let room = checkStmt.get(item_id, buyer_id, owner_id);

        // 如果不存在，就新增一筆
        if (!room) {
            const insertStmt = db.prepare('INSERT INTO chat_rooms (item_id, buyer_id, owner_id) VALUES (?, ?, ?)');
            const info = insertStmt.run(item_id, buyer_id, owner_id);
            room = { id: info.lastInsertRowid, item_id, buyer_id, owner_id };
        }

        res.json(room);
    } catch (error) {
        console.error('建立或獲取聊天室失敗:', error);
        res.status(500).json({ error: '建立或獲取聊天室失敗' });
    }
});

// 3. 取得特定聊天室的歷史訊息
router.get('/:roomId/messages', authenticateToken, (req, res) => {
    const { roomId } = req.params;

    try {
        const stmt = db.prepare(`
            SELECT m.*, u.username as sender_name
            FROM chat_messages m
            JOIN users u ON m.sender_id = u.id
            WHERE m.room_id = ?
            ORDER BY m.created_at ASC
        `);
        const messages = stmt.all(roomId);
        res.json(messages);
    } catch (error) {
        console.error('獲取訊息失敗:', error);
        res.status(500).json({ error: '獲取訊息失敗' });
    }
});

// 4. 在聊天室內發送新訊息
router.post('/:roomId/messages', authenticateToken, (req, res) => {
    const { roomId } = req.params;
    const { message } = req.body;
    const senderId = req.user.id;

    if (!message || message.trim() === '') {
        return res.status(400).json({ error: '訊息不能為空' });
    }

    try {
        // 新增訊息
        const stmt = db.prepare('INSERT INTO chat_messages (room_id, sender_id, message) VALUES (?, ?, ?)');
        const info = stmt.run(roomId, senderId, message);

        // 把剛新增成功的訊息撈出來回傳給前端顯示
        const newMsgStmt = db.prepare(`
            SELECT m.*, u.username as sender_name
            FROM chat_messages m
            JOIN users u ON m.sender_id = u.id
            WHERE m.id = ?
        `);
        const newMessage = newMsgStmt.get(info.lastInsertRowid);

        res.status(201).json(newMessage);
    } catch (error) {
        console.error('發送訊息失敗:', error);
        res.status(500).json({ error: '發送訊息失敗' });
    }
});

export default router;