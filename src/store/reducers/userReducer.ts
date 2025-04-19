import { logoutFulfilled, meFulfilled } from '@/services/api'
import { ApiResponse, IUser } from '@/types'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

const initialState: Omit<IUser, 'password' | 'confirmPassword'> = {
  id: '',
  firstName: '',
  phoneNumber: '',
  address: {
    id: '',
    userId: '',
    street: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    createdAt: '',
    updatedAt: '',
  },
  lastName: '',
  email: '',
  profilePic: '',
  role: null,
  isProfileCompleted: false,
  createdAt: '',
  isDeleted: true,
  vendorOwner: {
    id: '',
    userId: '',
    createdAt: '',
    updatedAt: '',
    vendorOrganizations: [],
  },
  vendorOrganizations: [],
  pharmacyOutlets: [],
  orders: [],
  updatedAt: '',
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ data: Omit<IUser, 'password' | 'confirmPassword'> }>
    ) => {
      const data = action.payload.data
      state.id = data.id
      state.firstName = data.firstName
      state.lastName = data.lastName
      state.isProfileCompleted = data.isProfileCompleted
      state.email = data.email
      state.phoneNumber = data.phoneNumber
      state.profilePic = data.profilePic
      state.role = data.role
      state.createdAt = data.createdAt
      state.address = data.address
      state.pharmacyOutlets = data.pharmacyOutlets
      state.vendorOwner = data.vendorOwner
      state.vendorOrganizations = data.vendorOrganizations
      state.orders = data.orders
      state.isDeleted = data.isDeleted
      state.updatedAt = data.updatedAt
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(meFulfilled, (state, action: PayloadAction<ApiResponse<IUser>>) => {
      const data = action.payload.body.data
      console.log('reducer', data)
      if (data) {
        state.id = data.id
        state.firstName = data.firstName
        state.lastName = data.lastName
        state.email = data.email
        state.phoneNumber = data.phoneNumber
        state.profilePic = data.profilePic
        state.role = data.role
        state.isProfileCompleted = data.isProfileCompleted
        state.createdAt = data.createdAt
        state.isDeleted = data.isDeleted
        state.updatedAt = data.updatedAt
        state.address = data.address
        state.vendorOwner = data.vendorOwner
        state.vendorOrganizations = data.vendorOrganizations
        state.pharmacyOutlets = data.pharmacyOutlets
        state.orders = data.orders
        state.updatedAt = data.updatedAt
      }
    })
    builder.addMatcher(logoutFulfilled, (state) => {
      state.id = ''
      state.firstName = ''
      state.lastName = ''
      state.email = ''
      state.phoneNumber = ''
      state.profilePic = ''
      state.role = null
      state.isProfileCompleted = false
      state.createdAt = ''
      state.isDeleted = true
      state.updatedAt = ''
      state.address = {
        id: '',
        userId: '',
        street: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
        createdAt: '',
        updatedAt: '',
      }
      state.vendorOwner = {
        id: '',
        userId: '',
        createdAt: '',
        updatedAt: '',
        vendorOrganizations: [],
      }
      state.vendorOrganizations = []
      state.pharmacyOutlets = []
      state.orders = []
      state.updatedAt = ''
    })
  },
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
