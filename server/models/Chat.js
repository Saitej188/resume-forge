import mongoose from 'mongoose'

const chatSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  isGroup: {
    type: Boolean,
    default: false
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  avatar: {
    type: String,
    default: null
  }
}, {
  timestamps: true
})

// Indexes for efficient queries
chatSchema.index({ participants: 1 })
chatSchema.index({ updatedAt: -1 })
chatSchema.index({ isGroup: 1 })

// Virtual for unread count (to be populated by application logic)
chatSchema.virtual('unreadCount', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'chat',
  count: true,
  match: { read: false }
})

export default mongoose.model('Chat', chatSchema)