import React from 'react'
import { Check, CheckCheck } from 'lucide-react'

const MessageList = ({ messages, currentUserId, messagesEndRef }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getMessageStatus = (message) => {
    if (message.sender._id !== currentUserId) return null
    
    switch (message.status) {
      case 'sent':
        return <Check className="h-4 w-4 text-gray-400" />
      case 'delivered':
        return <CheckCheck className="h-4 w-4 text-gray-400" />
      case 'read':
        return <CheckCheck className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">💬</span>
          </div>
          <p className="text-gray-500">No messages yet</p>
          <p className="text-sm text-gray-400">Send a message to start the conversation</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => {
        const isOwn = message.sender._id === currentUserId
        const showAvatar = !isOwn && (
          index === 0 || 
          messages[index - 1].sender._id !== message.sender._id
        )
        
        return (
          <div
            key={message._id}
            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
              {showAvatar && !isOwn && (
                <img
                  src={message.sender.avatar || `https://ui-avatars.com/api/?name=${message.sender.name}&background=3b82f6&color=fff`}
                  alt={message.sender.name}
                  className="w-8 h-8 rounded-full mr-2"
                />
              )}
              
              <div
                className={`px-4 py-2 rounded-lg ${
                  isOwn
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}
              >
                {!isOwn && showAvatar && (
                  <p className="text-xs text-gray-500 mb-1">
                    {message.sender.name}
                  </p>
                )}
                
                <p className="text-sm whitespace-pre-wrap">
                  {message.content}
                </p>
                
                <div className={`flex items-center justify-end mt-1 space-x-1 ${
                  isOwn ? 'text-blue-200' : 'text-gray-500'
                }`}>
                  <span className="text-xs">
                    {formatTime(message.createdAt)}
                  </span>
                  {getMessageStatus(message)}
                </div>
              </div>
            </div>
          </div>
        )
      })}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default MessageList