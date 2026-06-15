import { Router } from 'express'
import db from '../db/database.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = Router()

// ─── GET /api/items/:id/comments ─ 取得商品留言 ────────────────────────────
router.get('/items/:id/comments', (req, res) => {
  // 先確認商品存在
  const item = db.prepare('SELECT id FROM items WHERE id = ?').get(req.params.id)
  if (!item) return res.status(404).json({ message: '找不到該商品' })

  const comments = db.prepare(`
    SELECT c.id, c.content, c.created_at,
           u.id AS user_id, u.username
    FROM item_comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.item_id = ?
    ORDER BY c.created_at ASC
  `).all(req.params.id)

  return res.json({ comments })
})

// ─── POST /api/items/:id/comments ─ 新增留言 ───────────────────────────────
router.post('/items/:id/comments', authMiddleware, (req, res) => {
  const { content } = req.body

  if (!content || !content.trim()) {
    return res.status(400).json({ message: '留言內容不能為空' })
  }

  const item = db.prepare('SELECT id FROM items WHERE id = ?').get(req.params.id)
  if (!item) return res.status(404).json({ message: '找不到該商品' })

  const result = db.prepare(`
    INSERT INTO item_comments (item_id, user_id, content) VALUES (?, ?, ?)
  `).run(req.params.id, req.user.id, content.trim())

  const comment = db.prepare(`
    SELECT c.id, c.content, c.created_at,
           u.id AS user_id, u.username
    FROM item_comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.id = ?
  `).get(result.lastInsertRowid)

  return res.status(201).json({ message: '留言成功', comment })
})

// ─── DELETE /api/comments/:id ─ 刪除自己的留言 ─────────────────────────────
router.delete('/comments/:id', authMiddleware, (req, res) => {
  const comment = db.prepare('SELECT * FROM item_comments WHERE id = ?').get(req.params.id)
  if (!comment) return res.status(404).json({ message: '找不到該留言' })

  // 只有留言本人才能刪除
  if (comment.user_id !== req.user.id) {
    return res.status(403).json({ message: '無權限刪除此留言' })
  }

  db.prepare('DELETE FROM item_comments WHERE id = ?').run(req.params.id)
  return res.json({ message: '留言已刪除' })
})

export default router
