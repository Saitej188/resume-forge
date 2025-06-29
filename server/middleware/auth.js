import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const isAuthenticated = async (req, res, next) => {
  try {
    // Check session first
    if (req.session.userId) {
      req.userId = req.session.userId
      return next()
    }

    // Check Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    req.userId = decoded.userId
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
}