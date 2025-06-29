import { createSlice } from '@reduxjs/toolkit'

const callSlice = createSlice({
  name: 'call',
  initialState: {
    incomingCall: null,
    currentCall: null,
    localStream: null,
    remoteStream: null,
    isCallActive: false,
    isMuted: false,
    isVideoOff: false,
  },
  reducers: {
    setIncomingCall: (state, action) => {
      state.incomingCall = action.payload
    },
    setCurrentCall: (state, action) => {
      state.currentCall = action.payload
      state.isCallActive = !!action.payload
    },
    setLocalStream: (state, action) => {
      state.localStream = action.payload
    },
    setRemoteStream: (state, action) => {
      state.remoteStream = action.payload
    },
    setCallEnded: (state) => {
      state.incomingCall = null
      state.currentCall = null
      state.localStream = null
      state.remoteStream = null
      state.isCallActive = false
      state.isMuted = false
      state.isVideoOff = false
    },
    toggleMute: (state) => {
      state.isMuted = !state.isMuted
    },
    toggleVideo: (state) => {
      state.isVideoOff = !state.isVideoOff
    },
  },
})

export const {
  setIncomingCall,
  setCurrentCall,
  setLocalStream,
  setRemoteStream,
  setCallEnded,
  toggleMute,
  toggleVideo,
} = callSlice.actions

export default callSlice.reducer