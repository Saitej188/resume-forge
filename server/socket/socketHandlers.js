import User from '../models/User.js'
import Message from '../models/Message.js'

const connectedUsers = new Map()

export const handleConnection = (io, socket) => {
  console.log('User connected:', socket.id)

  // Handle user authentication
  socket.on('authenticate', async (userId) => {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { 
          isOnline: true, 
          socketId: socket.id,
          lastSeen: new Date()
        },
        { new: true }
      )

      if (user) {
        connectedUsers.set(socket.id, userId)
        socket.join(`user_${userId}`)
        
        // Broadcast online status
        socket.broadcast.emit('userOnline', userId)
        
        // Send list of online users
        const onlineUsers = Array.from(connectedUsers.values())
        io.emit('onlineUsers', onlineUsers)
      }
    } catch (error) {
      console.error('Authentication error:', error)
    }
  })

  // Handle joining chat rooms
  socket.on('joinChat', (chatId) => {
    socket.join(`chat_${chatId}`)
    console.log(`User joined chat: ${chatId}`)
  })

  // Handle leaving chat rooms
  socket.on('leaveChat', (chatId) => {
    socket.leave(`chat_${chatId}`)
    console.log(`User left chat: ${chatId}`)
  })

  // Handle typing indicators
  socket.on('startTyping', ({ chatId }) => {
    socket.to(`chat_${chatId}`).emit('userTyping', {
      chatId,
      userId: connectedUsers.get(socket.id),
      isTyping: true
    })
  })

  socket.on('stopTyping', ({ chatId }) => {
    socket.to(`chat_${chatId}`).emit('userTyping', {
      chatId,
      userId: connectedUsers.get(socket.id),
      isTyping: false
    })
  })

  // Handle message status updates
  socket.on('messageDelivered', async ({ messageId }) => {
    try {
      await Message.findByIdAndUpdate(messageId, { status: 'delivered' })
      socket.broadcast.emit('messageStatusUpdate', {
        messageId,
        status: 'delivered'
      })
    } catch (error) {
      console.error('Error updating message status:', error)
    }
  })

  socket.on('messageRead', async ({ messageId }) => {
    try {
      await Message.findByIdAndUpdate(messageId, { status: 'read' })
      socket.broadcast.emit('messageStatusUpdate', {
        messageId,
        status: 'read'
      })
    } catch (error) {
      console.error('Error updating message status:', error)
    }
  })

  // Handle disconnection
  socket.on('disconnect', async () => {
    const userId = connectedUsers.get(socket.id)
    
    if (userId) {
      try {
        await User.findByIdAndUpdate(userId, {
          isOnline: false,
          socketId: null,
          lastSeen: new Date()
        })

        connectedUsers.delete(socket.id)
        
        // Broadcast offline status
        socket.broadcast.emit('userOffline', userId)
        
        // Send updated online users list
        const onlineUsers = Array.from(connectedUsers.values())
        io.emit('onlineUsers', onlineUsers)
        
        console.log('User disconnected:', socket.id)
      } catch (error) {
        console.error('Disconnect error:', error)
      }
    }
  })
}