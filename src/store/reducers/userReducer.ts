import { api } from '@/services/api'
import { IUser, userRoles } from '@/types/types'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

const initialState: Omit<IUser, 'password' | 'confirmPassword'> = {
  id: '',
  name: '',
  email: '',
  username: '',
  role: userRoles.USER,
  active: false,
  refreshToken: '',
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ data: IUser }>) => {
      const data = action.payload.data
      state.id = data.id
      state.name = data.name
      state.email = data.email
      state.username = data.username
      state.active = data.active
      state.refreshToken = data.refreshToken
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      api.endpoints.me.matchFulfilled,
      (state, action: PayloadAction<{ data: IUser }>) => {
        const data = action.payload.data
        state.id = data.id
        state.name = data.name
        state.email = data.email
        state.username = data.username
        state.active = data.active
        state.refreshToken = data.refreshToken
      }
    )
  },
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
