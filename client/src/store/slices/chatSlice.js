import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'

export const fetchChats = createAsyncThunk(
  'chat/fetchChats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/chats')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch chats')
    }
  }
)

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (chatId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/chats/${chatId}/messages`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages')
    }
  }
)

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ chatId, content, type = 'text' }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/chats/${chatId}/messages`, { content, type })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message')
    }
  }
)

export const createChat = createAsyncThunk(
  'chat/createChat',
  async ({ participants, isGroup = false, name }, { rejectWithValue }) => {
    try {
      const response = await api.post('/chats', { participants, isGroup, name })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create chat')
    }
  }
)

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chats: [],
    currentChat: null,
    messages: [],
    loading: false,
    error: null,
    onlineUsers: [],
    typingUsers: {},
  },
  reducers: {
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload
      state.messages = []
    },
    addMessage: (state, action) => {
      const message = action.payload
      if (state.currentChat && message.chat === state.currentChat._id) {
        state.messages.push(message)
      }
      
      // Update last message in chat list
      const chatIndex = state.chats.findIndex(chat => chat._id === message.chat)
      if (chatIndex !== -1) {
        state.chats[chatIndex].lastMessage = message
        state.chats[chatIndex].updatedAt = message.createdAt
      }
    },
    updateMessageStatus: (state, action) => {
      const { messageId, status } = action.payload
      const messageIndex = state.messages.findIndex(msg => msg._id === messageId)
      if (messageIndex !== -1) {
        state.messages[messageIndex].status = status
      }
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload
    },
    setTypingUsers: (state, action) => {
      const { chatId, users } = action.payload
      state.typingUsers[chatId] = users
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading = false
        state.chats = action.payload.chats
        state.error = null
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload.messages
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        // Message will be added via socket event
      })
      .addCase(createChat.fulfilled, (state, action) => {
        state.chats.unshift(action.payload.chat)
      })
  },
})

export const {
  setCurrentChat,
  addMessage,
  updateMessageStatus,
  setOnlineUsers,
  setTypingUsers,
  clearError
} = chatSlice.actions

export default chatSlice.reducer