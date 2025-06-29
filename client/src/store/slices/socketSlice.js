import { createSlice } from '@reduxjs/toolkit'
import { io } from 'socket.io-client'
import { addMessage, updateMessageStatus, setOnlineUsers, setTypingUsers } from './chatSlice'
import { setIncomingCall, setCallEnded } from './callSlice'

const socketSlice = createSlice({
  name: 'socket',
  initialState: {
    socket: null,
    connected: false,
  },
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload
    },
    setConnected: (state, action) => {
      state.connected = action.payload
    },
  },
})

export const { setSocket, setConnected } = socketSlice.actions

export const initializeSocket = () => (dispatch, getState) => {
  const { auth } = getState()
  
  if (!auth.isAuthenticated || !auth.user) return

  const socket = io('http://localhost:5000', {
    auth: {
      userId: auth.user._id
    }
  })

  socket.on('connect', () => {
    dispatch(setConnected(true))
    console.log('Connected to server')
  })

  socket.on('disconnect', () => {
    dispatch(setConnected(false))
    console.log('Disconnected from server')
  })

  // Chat events
  socket.on('newMessage', (message) => {
    dispatch(addMessage(message))
  })

  socket.on('messageStatusUpdate', (data) => {
    dispatch(updateMessageStatus(data))
  })

  socket.on('onlineUsers', (users) => {
    dispatch(setOnlineUsers(users))
  })

  socket.on('userTyping', (data) => {
    dispatch(setTypingUsers(data))
  })

  // Call events
  socket.on('incomingCall', (callData) => {
    dispatch(setIncomingCall(callData))
  })

  socket.on('callEnded', () => {
    dispatch(setCallEnded())
  })

  dispatch(setSocket(socket))
}

export const disconnectSocket = () => (dispatch, getState) => {
  const { socket } = getState().socket
  if (socket) {
    socket.disconnect()
    dispatch(setSocket(null))
    dispatch(setConnected(false))
  }
}

export default socketSlice.reducer