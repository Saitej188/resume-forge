import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { MessageCircle, Users, Zap } from 'lucide-react'
import { login } from '../store/slices/authSlice'
import toast from 'react-hot-toast'

const Login = () => {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await dispatch(login({ ...formData, isSignUp }))
      if (result.type === 'auth/login/fulfilled') {
        toast.success(isSignUp ? 'Account created successfully!' : 'Welcome back!')
      } else {
        toast.error(result.payload || 'Authentication failed')
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">ConnectHub</h1>
          </div>
          <p className="text-gray-600">Connect with friends through real-time messaging</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center space-y-2">
              <MessageCircle className="h-8 w-8 text-blue-600" />
              <span className="text-sm text-gray-600">Real-time Chat</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Users className="h-8 w-8 text-green-600" />
              <span className="text-sm text-gray-600">Group Chats</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Zap className="h-8 w-8 text-purple-600" />
              <span className="text-sm text-gray-600">Instant Updates</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required={isSignUp}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login