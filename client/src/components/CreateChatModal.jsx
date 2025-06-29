import React, { useState } from 'react'
import { X, Users, MessageCircle } from 'lucide-react'

const CreateChatModal = ({ onClose, onCreateChat }) => {
  const [isGroup, setIsGroup] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [selectedUsers, setSelectedUsers] = useState([])
  
  // Mock users for demo
  const mockUsers = [
    { _id: '1', name: 'Alice Johnson', email: 'alice@example.com' },
    { _id: '2', name: 'Bob Smith', email: 'bob@example.com' },
    { _id: '3', name: 'Carol Davis', email: 'carol@example.com' },
    { _id: '4', name: 'David Wilson', email: 'david@example.com' },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (selectedUsers.length === 0) return
    
    onCreateChat(
      selectedUsers.map(user => user._id),
      isGroup,
      isGroup ? groupName : undefined
    )
  }

  const toggleUserSelection = (user) => {
    setSelectedUsers(prev => {
      const isSelected = prev.find(u => u._id === user._id)
      if (isSelected) {
        return prev.filter(u => u._id !== user._id)
      } else {
        return [...prev, user]
      }
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            {isGroup ? 'Create Group Chat' : 'Start New Chat'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Chat Type Toggle */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setIsGroup(false)}
              className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg border transition-colors ${
                !isGroup
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <MessageCircle className="h-5 w-5" />
              <span>Direct Chat</span>
            </button>
            
            <button
              type="button"
              onClick={() => setIsGroup(true)}
              className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg border transition-colors ${
                isGroup
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Users className="h-5 w-5" />
              <span>Group Chat</span>
            </button>
          </div>

          {/* Group Name Input */}
          {isGroup && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Name
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter group name"
                required={isGroup}
              />
            </div>
          )}

          {/* User Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select {isGroup ? 'Members' : 'Contact'}
            </label>
            <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg">
              {mockUsers.map((user) => {
                const isSelected = selectedUsers.find(u => u._id === user._id)
                return (
                  <div
                    key={user._id}
                    onClick={() => toggleUserSelection(user)}
                    className={`flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-50 ${
                      isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Selected Users Count */}
          {selectedUsers.length > 0 && (
            <p className="text-sm text-gray-600">
              {selectedUsers.length} {selectedUsers.length === 1 ? 'user' : 'users'} selected
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={selectedUsers.length === 0 || (isGroup && !groupName.trim())}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Create {isGroup ? 'Group' : 'Chat'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateChatModal