import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'pet-circle-secret-key'

/**
 * Verifies the JWT in the Authorization header.
 * Attaches decoded user info to req.user on success.
 */
export function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization']
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '未提供驗證 token' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    return res.status(401).json({ message: 'Token 無效或已過期' })
  }
}

export { JWT_SECRET }
