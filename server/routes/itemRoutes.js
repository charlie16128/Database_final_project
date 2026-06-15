import { Router } from 'express'
import db from '../db/database.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { upload } from '../middleware/uploadMiddleware.js'

const router = Router()

// ─── 允許的狀態值 ────────────────────────────────────────────────────────────
const VALID_STATUS = ['刊登中', '已預訂', '已完成']

// ─── GET /api/items  ─ 商品列表（可篩選）────────────────────────────────────
router.get('/items', (req, res) => {
  const { category, status, keyword } = req.query

  let sql = `
    SELECT i.*, u.username AS owner_name
    FROM items i
    JOIN users u ON i.user_id = u.id
    WHERE 1=1
  `
  const params = []

  if (category) { sql += ' AND i.category = ?';  params.push(category) }
  if (status)   { sql += ' AND i.status = ?';    params.push(status) }
  if (keyword)  {
    sql += ' AND (i.title LIKE ? OR i.description LIKE ?)'
    params.push(`%${keyword}%`, `%${keyword}%`)
  }

  sql += ' ORDER BY i.created_at DESC'

  const items = db.prepare(sql).all(...params)
  return res.json({ items })
})

// ─── GET /api/my/items  ─ 我的商品 ─────────────────────────────────────────
router.get('/my/items', authMiddleware, (req, res) => {
  const items = db.prepare(`
    SELECT * FROM items WHERE user_id = ? ORDER BY created_at DESC
  `).all(req.user.id)
  return res.json({ items })
})

// ─── GET /api/items/:id  ─ 商品詳細 ────────────────────────────────────────
router.get('/items/:id', (req, res) => {
  const item = db.prepare(`
    SELECT i.*, u.username AS owner_name, u.email AS owner_email
    FROM items i
    JOIN users u ON i.user_id = u.id
    WHERE i.id = ?
  `).get(req.params.id)

  if (!item) return res.status(404).json({ message: '找不到該商品' })
  return res.json({ item })
})

// ─── POST /api/items  ─ 新增商品 ────────────────────────────────────────────
router.post('/items', authMiddleware, upload.single('image'), (req, res) => {
  const { title, category, description, condition } = req.body

  if (!title || !category) {
    return res.status(400).json({ message: '商品名稱與分類為必填' })
  }

  const image_path = req.file ? `/uploads/${req.file.filename}` : null

  const result = db.prepare(`
    INSERT INTO items (user_id, title, category, description, condition, image_path)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(req.user.id, title.trim(), category, description || '', condition || '', image_path)

  const newItem = db.prepare('SELECT * FROM items WHERE id = ?').get(result.lastInsertRowid)
  return res.status(201).json({ message: '商品刊登成功', item: newItem })
})

// ─── PUT /api/items/:id  ─ 修改商品 ─────────────────────────────────────────
router.put('/items/:id', authMiddleware, upload.single('image'), (req, res) => {
  const item = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id)
  if (!item) return res.status(404).json({ message: '找不到該商品' })
  if (item.user_id !== req.user.id) return res.status(403).json({ message: '無權限修改此商品' })

  const { title, category, description, condition, status } = req.body

  if (status && !VALID_STATUS.includes(status)) {
    return res.status(400).json({ message: '無效的商品狀態' })
  }

  const image_path = req.file ? `/uploads/${req.file.filename}` : item.image_path

  db.prepare(`
    UPDATE items
    SET title = ?, category = ?, description = ?, condition = ?,
        status = ?, image_path = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    title || item.title,
    category || item.category,
    description ?? item.description,
    condition ?? item.condition,
    status || item.status,
    image_path,
    req.params.id
  )

  const updated = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id)
  return res.json({ message: '商品已更新', item: updated })
})

// ─── DELETE /api/items/:id  ─ 刪除商品 ──────────────────────────────────────
router.delete('/items/:id', authMiddleware, (req, res) => {
  const item = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id)
  if (!item) return res.status(404).json({ message: '找不到該商品' })
  if (item.user_id !== req.user.id) return res.status(403).json({ message: '無權限刪除此商品' })

  db.prepare('DELETE FROM items WHERE id = ?').run(req.params.id)
  return res.json({ message: '商品已刪除' })
})

export default router
