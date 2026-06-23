import { Router } from 'express'
import db from '../db/database.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = Router()

// GET /api/guides - 取得所有指南
router.get('/', (req, res) => {
  try {
    const guides = db.prepare('SELECT * FROM guides ORDER BY created_at ASC').all()
    res.json(guides)
  } catch (error) {
    res.status(500).json({ message: '取得指南失敗', error: error.message })
  }
})

// GET /api/guides/:id - 取得單一指南內容
router.get('/:id', (req, res) => {
  const { id } = req.params
  try {
    const guide = db.prepare('SELECT * FROM guides WHERE id = ?').get(id)
    if (!guide) {
      return res.status(404).json({ message: '找不到該指南' })
    }
    res.json(guide)
  } catch (error) {
    res.status(500).json({ message: '取得指南失敗', error: error.message })
  }
})

// POST /api/guides - 新增指南 (需經 JWT 驗證，此處暫不限定 Admin，方便練習)
router.post('/', authMiddleware, (req, res) => {
  const { title, category, content } = req.body
  if (!title || !category || !content) {
    return res.status(400).json({ message: '請填寫完整資訊' })
  }

  try {
    const result = db.prepare('INSERT INTO guides (title, category, content) VALUES (?, ?, ?)')
      .run(title, category, content)
    res.status(201).json({ id: result.lastInsertRowid, message: '指南已建立' })
  } catch (error) {
    res.status(500).json({ message: '建立指南失敗', error: error.message })
  }
})

// PUT /api/guides/:id - 修改指南
router.put('/:id', authMiddleware, (req, res) => {
  const { id } = req.params
  const { title, category, content } = req.body

  if (!title || !category || !content) {
    return res.status(400).json({ message: '請填寫完整資訊' })
  }

  try {
    const result = db.prepare('UPDATE guides SET title = ?, category = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(title, category, content, id)
    if (result.changes === 0) {
      return res.status(404).json({ message: '找不到該指南' })
    }
    res.json({ message: '指南已更新' })
  } catch (error) {
    res.status(500).json({ message: '更新指南失敗', error: error.message })
  }
})

// DELETE /api/guides/:id - 刪除指南
router.delete('/:id', authMiddleware, (req, res) => {
  const { id } = req.params
  try {
    const result = db.prepare('DELETE FROM guides WHERE id = ?').run(id)
    if (result.changes === 0) {
      return res.status(404).json({ message: '找不到該指南' })
    }
    res.json({ message: '指南已刪除' })
  } catch (error) {
    res.status(500).json({ message: '刪除指南失敗', error: error.message })
  }
})

export default router
