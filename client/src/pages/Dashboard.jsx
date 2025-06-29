import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, Video, Users, Plus, Search, LogOut } from 'lucide-react'
import { fetchChats, createChat } from '../store/slices/chatSlice'
import { logout } from '../store/slices/authSlice'
import ChatList from '../components/ChatList'
import CreateChatModal from '../components/CreateChatModal'
import UserSearch from '../components/UserSearch'

const Dashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)
  const { chats, loading } = useSelector(state => state.chat)
  const { onlineUsers } = useSelector(state => state.chat)
  
  const [showCreateChat, setShowCreateChat] = useState(false)
  const [showUserSearch, setShowUserSearch] = useState(false)

  useEffect(() => {
    dispatch(fetchChats())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logout())
  }

  const handleChatClick = (chatId) => {
    navigate(`/chat/${chatId}`)
  }

  const handleCreateChat = async (participants, isGroup, name) => {
    try {
      const result = await dispatch(createChat({ participants, isGroup, name }))
      if (result.type === 'chat/createChat/fulfilled') {
        setShowCreateChat(false)
        navigate(`/chat/${result.payload.chat._id}`)
      }
    } catch (error) {
      console.error('Failed to create chat:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-full">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">ConnectHub</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {onlineUsers.length}
                  </span>
                </div>
                <span className="text-sm text-gray-600">online</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <img
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=3b82f6&color=fff`}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Chats</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowUserSearch(true)}
                      className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <Search className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setShowCreateChat(true)}
                      className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      <span>New Chat</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <ChatList
                chats={chats}
                loading={loading}
                onChatClick={handleChatClick}
                currentUserId={user?._id}
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowCreateChat(true)}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Start New Chat</span>
                </button>
                
                <button
                  onClick={() => setShowCreateChat(true)}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Users className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Create Group</span>
                </button>
                
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Video className="h-5 w-5 text-purple-600" />
                  <span className="text-gray-700">Start Video Call</span>
                </button>
              </div>
            </div>

            {/* Online Users */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Online Now</h3>
              <div className="space-y-3">
                {onlineUsers.slice(0, 5).map((userId) => (
                  <div key={userId} className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <span className="text-sm text-gray-700">User {userId.slice(-4)}</span>
                  </div>
                ))}
                {onlineUsers.length === 0 && (
                  <p className="text-sm text-gray-500">No users online</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCreateChat && (
        <CreateChatModal
          onClose={() => setShowCreateChat(false)}
          onCreateChat={handleCreateChat}
        />
      )}

      {showUserSearch && (
        <UserSearch
          onClose={() => setShowUserSearch(false)}
          onSelectUser={(user) => {
            handleCreateChat([user._id], false)
            setShowUserSearch(false)
          }}
        />
      )}
    </div>
  )
}

export default Dashboard