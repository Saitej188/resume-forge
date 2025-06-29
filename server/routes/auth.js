import express from 'express'
import passport from 'passport'
import { isAuthenticated } from '../middleware/auth.js'

const router = express.Router()

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication
    res.redirect(process.env.CLIENT_URL || 'http://localhost:5173/dashboard')
  }
)

// Get current user
router.get('/me', isAuthenticated, (req, res) => {
  res.json({
    success: true,
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
      isOnline: req.user.isOnline
    }
  })
})

// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' })
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Session destruction failed' })
      }
      res.clearCookie('connect.sid')
      res.json({ success: true, message: 'Logged out successfully' })
    })
  })
})

export default router