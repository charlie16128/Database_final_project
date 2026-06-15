import { Router } from 'express'

const router = Router()

// GET  /api/items
router.get('/items', (_req, res) => res.status(501).json({ message: '尚未實作（第 3 階段）' }))
// GET  /api/items/:id
router.get('/items/:id', (_req, res) => res.status(501).json({ message: '尚未實作（第 3 階段）' }))
// POST /api/items
router.post('/items', (_req, res) => res.status(501).json({ message: '尚未實作（第 3 階段）' }))
// PUT  /api/items/:id
router.put('/items/:id', (_req, res) => res.status(501).json({ message: '尚未實作（第 3 階段）' }))
// DELETE /api/items/:id
router.delete('/items/:id', (_req, res) => res.status(501).json({ message: '尚未實作（第 3 階段）' }))
// GET  /api/my/items
router.get('/my/items', (_req, res) => res.status(501).json({ message: '尚未實作（第 3 階段）' }))

export default router
