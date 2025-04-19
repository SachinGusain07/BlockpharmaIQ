import { loginFulfilled, loginPending, loginRejected, logoutFulfilled } from '@/services/api'
import { AuthState } from '@/types'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

const initialState: AuthState = {
  accessToken: localStorage.getItem('accessToken') || '',
  isAuthenticated: Boolean(localStorage.getItem('accessToken')),
  isLoading: true,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<{ loading: boolean }>) => {
      state.isLoading = action.payload.loading
    },
    setTokens: (
      state,
      action: PayloadAction<{ body: { status: true; data: { token: string } } }>
    ) => {
      state.accessToken = action.payload.body.data.token
      state.isAuthenticated = true
    },
    resetTokens: (state) => {
      state.accessToken = ''
      state.isAuthenticated = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(loginPending, (state) => {
        state.isLoading = true
        return state
      })
      .addMatcher(loginFulfilled, (state, action) => {
        const data = action.payload.body
        localStorage.setItem('accessToken', data.data.token)
        state.accessToken = localStorage.getItem('accessToken') || ''
        state.isLoading = false
        state.isAuthenticated = true

        return state
      })
      .addMatcher(loginRejected, (state) => {
        state.accessToken = ''
        state.isLoading = false
        state.isAuthenticated = false
        return state
      })
    builder.addMatcher(logoutFulfilled, (state) => {
      localStorage.removeItem('accessToken')

      state.accessToken = ''
      state.isLoading = false
      state.isAuthenticated = false
      return state
    })
    builder.addDefaultCase((state) => {
      state.isLoading = false
      return state
    })
  },
})

export const { resetTokens, setLoading, setTokens } = authSlice.actions
export default authSlice.reducer
