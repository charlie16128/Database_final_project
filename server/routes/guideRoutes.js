import { Router } from 'express'

const router = Router()

// GET  /api/guides
router.get('/', (_req, res) => res.status(501).json({ message: '尚未實作（第 6 階段）' }))
// GET  /api/guides/:id
router.get('/:id', (_req, res) => res.status(501).json({ message: '尚未實作（第 6 階段）' }))
// POST /api/guides
router.post('/', (_req, res) => res.status(501).json({ message: '尚未實作（第 6 階段）' }))
// PUT  /api/guides/:id
router.put('/:id', (_req, res) => res.status(501).json({ message: '尚未實作（第 6 階段）' }))
// DELETE /api/guides/:id
router.delete('/:id', (_req, res) => res.status(501).json({ message: '尚未實作（第 6 階段）' }))

export default router
