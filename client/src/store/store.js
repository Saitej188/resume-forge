import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import chatReducer from './slices/chatSlice'
import socketReducer from './slices/socketSlice'
import callReducer from './slices/callSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    socket: socketReducer,
    call: callReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['socket/setSocket'],
        ignoredPaths: ['socket.socket'],
      },
    }),
})