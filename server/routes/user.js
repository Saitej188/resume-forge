import express from 'express'
import User from '../models/User.js'
import { isAuthenticated } from '../middleware/auth.js'

const router = express.Router()

// Search users
router.get('/search', isAuthenticated, async (req, res) => {
  try {
    const { q } = req.query
    
    if (!q || q.length < 2) {
      return res.json({
        success: true,
        users: []
      })
    }

    const users = await User.find({
      _id: { $ne: req.user._id }, // Exclude current user
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ]
    })
    .select('name email avatar isOnline')
    .limit(20)

    res.json({
      success: true,
      users
    })
  } catch (error) {
    console.error('Error searching users:', error)
    res.status(500).json({ message: 'Failed to search users' })
  }
})

// Get user profile
router.get('/:userId', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('name email avatar isOnline lastSeen')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({
      success: true,
      user
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    res.status(500).json({ message: 'Failed to fetch user' })
  }
})

// Update user profile
router.put('/profile', isAuthenticated, async (req, res) => {
  try {
    const { name, avatar } = req.body

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    ).select('name email avatar')

    res.json({
      success: true,
      user
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    res.status(500).json({ message: 'Failed to update profile' })
  }
})

export default router