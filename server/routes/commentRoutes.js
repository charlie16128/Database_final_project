import { Router } from 'express'

const router = Router()

// GET  /api/items/:id/comments
router.get('/items/:id/comments', (_req, res) => res.status(501).json({ message: '尚未實作（第 4 階段）' }))
// POST /api/items/:id/comments
router.post('/items/:id/comments', (_req, res) => res.status(501).json({ message: '尚未實作（第 4 階段）' }))
// DELETE /api/comments/:id
router.delete('/comments/:id', (_req, res) => res.status(501).json({ message: '尚未實作（第 4 階段）' }))

export default router
