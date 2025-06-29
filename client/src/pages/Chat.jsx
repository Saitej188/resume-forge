import React, { useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowLeft, Phone, Video, MoreVertical } from 'lucide-react'
import { setCurrentChat, fetchMessages } from '../store/slices/chatSlice'
import ChatHeader from '../components/ChatHeader'
import MessageList from '../components/MessageList'
import MessageInput from '../components/MessageInput'
import LoadingSpinner from '../components/LoadingSpinner'

const Chat = () => {
  const { chatId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const messagesEndRef = useRef(null)
  
  const { currentChat, messages, loading } = useSelector(state => state.chat)
  const { user } = useSelector(state => state.auth)
  const { socket } = useSelector(state => state.socket)

  useEffect(() => {
    if (chatId) {
      dispatch(fetchMessages(chatId))
      
      // Find chat from store or fetch it
      // For now, we'll create a mock chat object
      const mockChat = {
        _id: chatId,
        name: 'Chat Room',
        participants: [],
        isGroup: false
      }
      dispatch(setCurrentChat(mockChat))
    }
  }, [chatId, dispatch])

  useEffect(() => {
    if (socket && chatId) {
      socket.emit('joinChat', chatId)
      
      return () => {
        socket.emit('leaveChat', chatId)
      }
    }
  }, [socket, chatId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleStartCall = (isVideo = false) => {
    const roomId = `call_${chatId}_${Date.now()}`
    navigate(`/call/${roomId}`)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!currentChat) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Select a chat to start messaging</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Chat Header */}
      <ChatHeader
        chat={currentChat}
        onBack={() => navigate('/dashboard')}
        onStartCall={handleStartCall}
      />

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <MessageList
          messages={messages}
          currentUserId={user?._id}
          messagesEndRef={messagesEndRef}
        />
      </div>

      {/* Message Input */}
      <MessageInput
        chatId={chatId}
        socket={socket}
      />
    </div>
  )
}

export default Chat