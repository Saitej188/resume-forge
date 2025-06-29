import React, { useState, useRef } from 'react'
import { Send, Paperclip, Smile } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { sendMessage } from '../store/slices/chatSlice'

const MessageInput = ({ chatId, socket }) => {
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const dispatch = useDispatch()
  const inputRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim()) return

    const messageContent = message.trim()
    setMessage('')
    
    // Send via Redux action
    dispatch(sendMessage({ chatId, content: messageContent }))
    
    // Stop typing indicator
    if (socket) {
      socket.emit('stopTyping', { chatId })
    }
    setIsTyping(false)
  }

  const handleInputChange = (e) => {
    setMessage(e.target.value)
    
    if (socket && !isTyping) {
      socket.emit('startTyping', { chatId })
      setIsTyping(true)
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    
    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      if (socket) {
        socket.emit('stopTyping', { chatId })
      }
      setIsTyping(false)
    }, 1000)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        <div className="flex-1">
          <div className="relative">
            <textarea
              ref={inputRef}
              value={message}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
            
            <div className="absolute right-3 bottom-3 flex space-x-1">
              <button
                type="button"
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Paperclip className="h-4 w-4" />
              </button>
              
              <button
                type="button"
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Smile className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={!message.trim()}
          className={`p-3 rounded-lg transition-colors ${
            message.trim()
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  )
}

export default MessageInput