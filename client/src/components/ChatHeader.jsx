import React from 'react'
import { ArrowLeft, Phone, Video, MoreVertical, Users } from 'lucide-react'

const ChatHeader = ({ chat, onBack, onStartCall }) => {
  const getChatName = () => {
    if (chat.isGroup) return chat.name
    return 'Chat Room' // Simplified for demo
  }

  const getParticipantCount = () => {
    if (chat.isGroup) return `${chat.participants?.length || 0} members`
    return 'Online'
  }

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors lg:hidden"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {getChatName().charAt(0)}
                </span>
              </div>
              {chat.isGroup && (
                <div className="absolute -bottom-1 -right-1 bg-purple-500 rounded-full p-1">
                  <Users className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {getChatName()}
              </h2>
              <p className="text-sm text-gray-500">
                {getParticipantCount()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onStartCall(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Phone className="h-5 w-5 text-gray-600" />
          </button>
          
          <button
            onClick={() => onStartCall(true)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Video className="h-5 w-5 text-gray-600" />
          </button>
          
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreVertical className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatHeader