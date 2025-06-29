import React from 'react'
import { MessageCircle, Users } from 'lucide-react'

const ChatList = ({ chats, loading, onChatClick, currentUserId }) => {
  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (chats.length === 0) {
    return (
      <div className="p-6 text-center">
        <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No chats yet</p>
        <p className="text-sm text-gray-400">Start a conversation to see it here</p>
      </div>
    )
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date

    if (diff < 60000) return 'now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`
    return date.toLocaleDateString()
  }

  const getChatName = (chat) => {
    if (chat.isGroup) return chat.name
    const otherParticipant = chat.participants.find(p => p._id !== currentUserId)
    return otherParticipant?.name || 'Unknown User'
  }

  const getChatAvatar = (chat) => {
    if (chat.isGroup) {
      return `https://ui-avatars.com/api/?name=${chat.name}&background=6366f1&color=fff`
    }
    const otherParticipant = chat.participants.find(p => p._id !== currentUserId)
    return otherParticipant?.avatar || 
           `https://ui-avatars.com/api/?name=${otherParticipant?.name}&background=3b82f6&color=fff`
  }

  return (
    <div className="divide-y divide-gray-100">
      {chats.map((chat) => (
        <div
          key={chat._id}
          onClick={() => onChatClick(chat._id)}
          className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={getChatAvatar(chat)}
                alt={getChatName(chat)}
                className="w-12 h-12 rounded-full"
              />
              {chat.isGroup && (
                <div className="absolute -bottom-1 -right-1 bg-purple-500 rounded-full p-1">
                  <Users className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {getChatName(chat)}
                </h3>
                {chat.lastMessage && (
                  <span className="text-xs text-gray-500">
                    {formatTime(chat.lastMessage.createdAt)}
                  </span>
                )}
              </div>
              
              {chat.lastMessage && (
                <p className="text-sm text-gray-500 truncate mt-1">
                  {chat.lastMessage.sender.name}: {chat.lastMessage.content}
                </p>
              )}
              
              {!chat.lastMessage && (
                <p className="text-sm text-gray-400 italic">No messages yet</p>
              )}
            </div>
            
            {chat.unreadCount > 0 && (
              <div className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {chat.unreadCount}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ChatList