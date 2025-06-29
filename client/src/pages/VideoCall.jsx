import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, Monitor } from 'lucide-react'
import webrtcService from '../utils/webrtc'

const VideoCall = () => {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  
  const { socket } = useSelector(state => state.socket)
  const { user } = useSelector(state => state.auth)
  
  const [isCallActive, setIsCallActive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [callDuration, setCallDuration] = useState(0)

  useEffect(() => {
    let interval
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isCallActive])

  useEffect(() => {
    if (socket && roomId) {
      webrtcService.setSocket(socket)
      
      webrtcService.setOnRemoteStream((stream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream
        }
      })

      startCall()
    }

    return () => {
      endCall()
    }
  }, [socket, roomId])

  const startCall = async () => {
    try {
      const stream = await webrtcService.startCall(roomId, true)
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }
      setIsCallActive(true)
    } catch (error) {
      console.error('Failed to start call:', error)
      navigate('/dashboard')
    }
  }

  const endCall = () => {
    webrtcService.endCall()
    setIsCallActive(false)
    navigate('/dashboard')
  }

  const toggleMute = () => {
    const muted = webrtcService.toggleMute()
    setIsMuted(muted)
  }

  const toggleVideo = () => {
    const videoOff = webrtcService.toggleVideo()
    setIsVideoOff(videoOff)
  }

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        })
        
        // Replace video track with screen share
        const videoTrack = screenStream.getVideoTracks()[0]
        const sender = webrtcService.localConnection
          .getSenders()
          .find(s => s.track && s.track.kind === 'video')
        
        if (sender) {
          await sender.replaceTrack(videoTrack)
        }
        
        setIsScreenSharing(true)
        
        videoTrack.onended = () => {
          setIsScreenSharing(false)
          // Switch back to camera
          navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
              const videoTrack = stream.getVideoTracks()[0]
              if (sender) {
                sender.replaceTrack(videoTrack)
              }
            })
        }
      }
    } catch (error) {
      console.error('Screen sharing failed:', error)
    }
  }

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Call Header */}
      <div className="bg-gray-800 p-4 flex justify-between items-center">
        <div className="text-white">
          <h2 className="text-lg font-semibold">Video Call</h2>
          <p className="text-sm text-gray-300">
            {isCallActive ? `Duration: ${formatDuration(callDuration)}` : 'Connecting...'}
          </p>
        </div>
        <div className="text-white text-sm">
          Room: {roomId}
        </div>
      </div>

      {/* Video Container */}
      <div className="flex-1 relative">
        {/* Remote Video */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover bg-gray-800"
        />
        
        {/* Local Video */}
        <div className="absolute top-4 right-4 w-48 h-36 bg-gray-700 rounded-lg overflow-hidden">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {isVideoOff && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Call Status */}
        {!isCallActive && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="animate-pulse mb-4">
                <Phone className="h-12 w-12 mx-auto" />
              </div>
              <p className="text-lg">Connecting to call...</p>
            </div>
          </div>
        )}
      </div>

      {/* Call Controls */}
      <div className="bg-gray-800 p-6">
        <div className="flex justify-center space-x-4">
          <button
            onClick={toggleMute}
            className={`p-4 rounded-full transition-colors ${
              isMuted 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            {isMuted ? (
              <MicOff className="h-6 w-6 text-white" />
            ) : (
              <Mic className="h-6 w-6 text-white" />
            )}
          </button>

          <button
            onClick={toggleVideo}
            className={`p-4 rounded-full transition-colors ${
              isVideoOff 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            {isVideoOff ? (
              <VideoOff className="h-6 w-6 text-white" />
            ) : (
              <Video className="h-6 w-6 text-white" />
            )}
          </button>

          <button
            onClick={toggleScreenShare}
            className={`p-4 rounded-full transition-colors ${
              isScreenSharing 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            <Monitor className="h-6 w-6 text-white" />
          </button>

          <button
            onClick={endCall}
            className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
          >
            <PhoneOff className="h-6 w-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default VideoCall