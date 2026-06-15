import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

// Routes
import authRoutes from './routes/authRoutes.js'
import itemRoutes from './routes/itemRoutes.js'
import commentRoutes from './routes/commentRoutes.js'
import guideRoutes from './routes/guideRoutes.js'
import chatRoutes from './routes/chatRoutes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Static: serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api', itemRoutes)
app.use('/api', commentRoutes)
app.use('/api/guides', guideRoutes)
app.use('/api/chats', chatRoutes)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})

export default app
