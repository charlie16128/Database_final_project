import { Router } from 'express'

const router = Router()

// POST /api/chats/start
router.post('/start', (_req, res) => res.status(501).json({ message: '尚未實作（第 5 階段）' }))
// GET  /api/chats
router.get('/', (_req, res) => res.status(501).json({ message: '尚未實作（第 5 階段）' }))
// GET  /api/chats/:roomId/messages
router.get('/:roomId/messages', (_req, res) => res.status(501).json({ message: '尚未實作（第 5 階段）' }))
// POST /api/chats/:roomId/messages
router.post('/:roomId/messages', (_req, res) => res.status(501).json({ message: '尚未實作（第 5 階段）' }))

export default router
