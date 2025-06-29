import express from 'express'
import Chat from '../models/Chat.js'
import Message from '../models/Message.js'
import { isAuthenticated } from '../middleware/auth.js'
import { io } from '../index.js'

const router = express.Router()

// Get all chats for user
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id
    })
    .populate('participants', 'name email avatar')
    .populate('lastMessage')
    .populate({
      path: 'lastMessage',
      populate: {
        path: 'sender',
        select: 'name'
      }
    })
    .sort({ updatedAt: -1 })

    res.json({
      success: true,
      chats
    })
  } catch (error) {
    console.error('Error fetching chats:', error)
    res.status(500).json({ message: 'Failed to fetch chats' })
  }
})

// Create new chat
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { participants, isGroup, name } = req.body

    // Add current user to participants if not already included
    const allParticipants = [...new Set([req.user._id.toString(), ...participants])]

    // For direct chats, check if chat already exists
    if (!isGroup && allParticipants.length === 2) {
      const existingChat = await Chat.findOne({
        isGroup: false,
        participants: { $all: allParticipants, $size: 2 }
      }).populate('participants', 'name email avatar')

      if (existingChat) {
        return res.json({
          success: true,
          chat: existingChat
        })
      }
    }

    const chat = new Chat({
      participants: allParticipants,
      isGroup,
      name: isGroup ? name : undefined,
      admin: isGroup ? req.user._id : undefined
    })

    await chat.save()
    await chat.populate('participants', 'name email avatar')

    res.status(201).json({
      success: true,
      chat
    })
  } catch (error) {
    console.error('Error creating chat:', error)
    res.status(500).json({ message: 'Failed to create chat' })
  }
})

// Get messages for a chat
router.get('/:chatId/messages', isAuthenticated, async (req, res) => {
  try {
    const { chatId } = req.params
    const { page = 1, limit = 50 } = req.query

    // Verify user is participant in chat
    const chat = await Chat.findOne({
      _id: chatId,
      participants: req.user._id
    })

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' })
    }

    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    // Reverse to get chronological order
    messages.reverse()

    res.json({
      success: true,
      messages
    })
  } catch (error) {
    console.error('Error fetching messages:', error)
    res.status(500).json({ message: 'Failed to fetch messages' })
  }
})

// Send message
router.post('/:chatId/messages', isAuthenticated, async (req, res) => {
  try {
    const { chatId } = req.params
    const { content, type = 'text' } = req.body

    // Verify user is participant in chat
    const chat = await Chat.findOne({
      _id: chatId,
      participants: req.user._id
    })

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' })
    }

    const message = new Message({
      content,
      type,
      sender: req.user._id,
      chat: chatId
    })

    await message.save()
    await message.populate('sender', 'name email avatar')

    // Update chat's last message
    chat.lastMessage = message._id
    chat.updatedAt = new Date()
    await chat.save()

    // Emit to all participants
    chat.participants.forEach(participantId => {
      if (participantId.toString() !== req.user._id.toString()) {
        io.to(`user_${participantId}`).emit('newMessage', message)
      }
    })

    res.status(201).json({
      success: true,
      message
    })
  } catch (error) {
    console.error('Error sending message:', error)
    res.status(500).json({ message: 'Failed to send message' })
  }
})

export default router