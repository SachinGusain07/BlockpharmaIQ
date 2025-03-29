import type { PayloadAction } from '@reduxjs/toolkit'
import { api } from '@/services/api'
import { createSlice } from '@reduxjs/toolkit'
import { AuthState } from '@/types/types'

const initialState: AuthState = {
  accessToken: localStorage.getItem('accessToken') || '',
  isAuthenticate: Boolean(localStorage.getItem('accessToken')),
  isLoading: true,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<{ loading: boolean }>) => {
      state.isLoading = action.payload.loading
    },
    setTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.accessToken = action.payload.accessToken
      state.isAuthenticate = true
    },
    resetTokens: (state) => {
      state.accessToken = ''
      state.isAuthenticate = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(api.endpoints.login.matchPending, (state) => {
        state.isLoading = true
        return state
      })
      .addMatcher(api.endpoints.login.matchFulfilled, (state, action) => {
        const data = action.payload.data
        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('refreshToken', data.refreshToken)
        state.accessToken = localStorage.getItem('accessToken') || ''
        state.isLoading = false
        state.isAuthenticate = true

        return state
      })
      .addMatcher(api.endpoints.login.matchRejected, (state) => {
        state.accessToken = ''
        state.isLoading = false
        state.isAuthenticate = false
        return state
      })
    builder.addMatcher(api.endpoints.logout.matchFulfilled, (state) => {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')

      state.accessToken = ''
      state.isLoading = false
      state.isAuthenticate = false
      return state
    })
  },
})

export const { resetTokens, setLoading, setTokens } = authSlice.actions
export default authSlice.reducer
