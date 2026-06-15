import { Router } from 'express'

const router = Router()

// POST /api/auth/register
router.post('/register', (_req, res) => {
  res.status(501).json({ message: '尚未實作（第 2 階段）' })
})

// POST /api/auth/login
router.post('/login', (_req, res) => {
  res.status(501).json({ message: '尚未實作（第 2 階段）' })
})

// GET /api/auth/me
router.get('/me', (_req, res) => {
  res.status(501).json({ message: '尚未實作（第 2 階段）' })
})

export default router
