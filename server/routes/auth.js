import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { isAuthenticated } from '../middleware/auth.js'

const router = express.Router()

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword
    })

    await user.save()

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    // Set session
    req.session.userId = user._id
    req.session.token = token

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      },
      token
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ message: 'Registration failed' })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    // Set session
    req.session.userId = user._id
    req.session.token = token

    // Update user online status
    await User.findByIdAndUpdate(user._id, { isOnline: true, lastSeen: new Date() })

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      },
      token
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Login failed' })
  }
})

// Get current user
router.get('/me', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password')
    res.json({
      success: true,
      user
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ message: 'Failed to get user' })
  }
})

// Logout
router.post('/logout', async (req, res) => {
  try {
    if (req.session.userId) {
      await User.findByIdAndUpdate(req.session.userId, { 
        isOnline: false, 
        lastSeen: new Date() 
      })
    }

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' })
      }
      res.clearCookie('connect.sid')
      res.json({ success: true, message: 'Logged out successfully' })
    })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({ message: 'Logout failed' })
  }
})

export default router