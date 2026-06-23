import express from 'express'
import db from '../db/database.js'

const router = express.Router()

// GET /api/analytics/circulation
router.get('/circulation', (req, res) => {
  try {
    // 1. 各分類數量統計
    const categoryStats = db.prepare(`
      SELECT category, COUNT(*) as count 
      FROM items 
      GROUP BY category
    `).all()

    // 2. 物品狀態統計
    const statusStats = db.prepare(`
      SELECT status, COUNT(*) as count 
      FROM items 
      GROUP BY status
    `).all()

    res.json({
      success: true,
      data: {
        categories: categoryStats,
        statuses: statusStats
      }
    })
  } catch (error) {
    console.error('Analytics API error:', error)
    res.status(500).json({ success: false, message: '伺服器錯誤' })
  }
})

export default router
