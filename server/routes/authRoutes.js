import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import db from '../db/database.js'
import { authMiddleware, JWT_SECRET } from '../middleware/authMiddleware.js'

const router = Router()
const SALT_ROUNDS = 10

// ─── POST /api/auth/register ────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body

  // 基本驗證
  if (!username || !email || !password) {
    return res.status(400).json({ message: '請填寫所有欄位' })
  }
  if (password.length < 6) {
    return res.status(400).json({ message: '密碼長度至少 6 碼' })
  }

  // 檢查 email / username 是否重複
  const existing = db.prepare(
    'SELECT id FROM users WHERE email = ? OR username = ?'
  ).get(email, username)

  if (existing) {
    return res.status(409).json({ message: 'Email 或使用者名稱已被使用' })
  }

  try {
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS)
    const result = db.prepare(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)'
    ).run(username, email, password_hash)

    return res.status(201).json({
      message: '註冊成功',
      userId: result.lastInsertRowid
    })
  } catch (err) {
    console.error('[register]', err)
    return res.status(500).json({ message: '伺服器錯誤，請稍後再試' })
  }
})

// ─── POST /api/auth/login ────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: '請填寫 Email 與密碼' })
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
  if (!user) {
    return res.status(401).json({ message: 'Email 或密碼錯誤' })
  }

  try {
    const match = await bcrypt.compare(password, user.password_hash)
    if (!match) {
      return res.status(401).json({ message: 'Email 或密碼錯誤' })
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at
      }
    })
  } catch (err) {
    console.error('[login]', err)
    return res.status(500).json({ message: '伺服器錯誤，請稍後再試' })
  }
})

// ─── GET /api/auth/me ────────────────────────────────────────────────────────
router.get('/me', authMiddleware, (req, res) => {
  const user = db.prepare(
    'SELECT id, username, email, created_at FROM users WHERE id = ?'
  ).get(req.user.id)

  if (!user) {
    return res.status(404).json({ message: '找不到使用者' })
  }
  return res.json({ user })
})

export default router
