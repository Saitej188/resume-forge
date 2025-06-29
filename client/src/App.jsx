import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { checkAuth } from './store/slices/authSlice'
import { initializeSocket } from './store/slices/socketSlice'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Chat from './pages/Chat'
import ProtectedRoute from './components/ProtectedRoute'
import LoadingSpinner from './components/LoadingSpinner'

function App() {
  const dispatch = useDispatch()
  const { isAuthenticated, loading } = useSelector(state => state.auth)

  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(initializeSocket())
    }
  }, [isAuthenticated, dispatch])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Routes>
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/chat/:chatId?" 
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/" 
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} 
        />
      </Routes>
    </div>
  )
}

export default App