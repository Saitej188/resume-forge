import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password, name, isSignUp }, { rejectWithValue }) => {
    try {
      const endpoint = isSignUp ? '/auth/register' : '/auth/login'
      const response = await api.post(endpoint, { email, password, name })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Authentication failed')
    }
  }
)

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/me')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Authentication failed')
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/auth/logout')
      return true
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(checkAuth.pending, (state) => {
        state.loading = true
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false
        state.user = null
        state.isAuthenticated = false
        state.error = action.payload
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
        state.error = null
      })
  },
})

export const { clearError, setUser } = authSlice.actions
export default authSlice.reducer