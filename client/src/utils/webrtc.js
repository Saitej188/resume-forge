class WebRTCService {
  constructor() {
    this.localConnection = null
    this.remoteConnection = null
    this.localStream = null
    this.remoteStream = null
    this.socket = null
    this.roomId = null
    this.isInitiator = false
    
    this.configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ]
    }
  }

  setSocket(socket) {
    this.socket = socket
    this.setupSocketListeners()
  }

  setupSocketListeners() {
    if (!this.socket) return

    this.socket.on('offer', async (data) => {
      await this.handleOffer(data)
    })

    this.socket.on('answer', async (data) => {
      await this.handleAnswer(data)
    })

    this.socket.on('ice-candidate', async (data) => {
      await this.handleIceCandidate(data)
    })

    this.socket.on('user-joined', () => {
      if (this.isInitiator) {
        this.createOffer()
      }
    })

    this.socket.on('user-left', () => {
      this.endCall()
    })
  }

  async startCall(roomId, isInitiator = false) {
    this.roomId = roomId
    this.isInitiator = isInitiator

    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })

      this.createPeerConnection()
      
      this.localStream.getTracks().forEach(track => {
        this.localConnection.addTrack(track, this.localStream)
      })

      this.socket.emit('join-room', roomId)

      return this.localStream
    } catch (error) {
      console.error('Error starting call:', error)
      throw error
    }
  }

  createPeerConnection() {
    this.localConnection = new RTCPeerConnection(this.configuration)

    this.localConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('ice-candidate', {
          roomId: this.roomId,
          candidate: event.candidate
        })
      }
    }

    this.localConnection.ontrack = (event) => {
      this.remoteStream = event.streams[0]
      if (this.onRemoteStream) {
        this.onRemoteStream(this.remoteStream)
      }
    }

    this.localConnection.onconnectionstatechange = () => {
      console.log('Connection state:', this.localConnection.connectionState)
    }
  }

  async createOffer() {
    try {
      const offer = await this.localConnection.createOffer()
      await this.localConnection.setLocalDescription(offer)
      
      this.socket.emit('offer', {
        roomId: this.roomId,
        offer: offer
      })
    } catch (error) {
      console.error('Error creating offer:', error)
    }
  }

  async handleOffer(data) {
    try {
      if (!this.localConnection) {
        this.createPeerConnection()
      }

      await this.localConnection.setRemoteDescription(data.offer)
      const answer = await this.localConnection.createAnswer()
      await this.localConnection.setLocalDescription(answer)

      this.socket.emit('answer', {
        roomId: this.roomId,
        answer: answer
      })
    } catch (error) {
      console.error('Error handling offer:', error)
    }
  }

  async handleAnswer(data) {
    try {
      await this.localConnection.setRemoteDescription(data.answer)
    } catch (error) {
      console.error('Error handling answer:', error)
    }
  }

  async handleIceCandidate(data) {
    try {
      await this.localConnection.addIceCandidate(data.candidate)
    } catch (error) {
      console.error('Error handling ICE candidate:', error)
    }
  }

  toggleMute() {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        return !audioTrack.enabled
      }
    }
    return false
  }

  toggleVideo() {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        return !videoTrack.enabled
      }
    }
    return false
  }

  endCall() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop())
      this.localStream = null
    }

    if (this.localConnection) {
      this.localConnection.close()
      this.localConnection = null
    }

    if (this.socket && this.roomId) {
      this.socket.emit('leave-room', this.roomId)
    }

    this.remoteStream = null
    this.roomId = null
    this.isInitiator = false
  }

  setOnRemoteStream(callback) {
    this.onRemoteStream = callback
  }
}

export default new WebRTCService()