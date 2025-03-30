import { meFulfilled } from '@/services/api'
import { ApiResponse, IUser, userRoles } from '@/types/types'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

const initialState: Omit<IUser, 'password' | 'confirmPassword'> = {
  id: '',
  firstName: '',
  phoneNumber: '',
  Address: {
    id: 0,
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
  role: userRoles.USER,
  active: false,
  createdAt: '',
  VendorOwner: undefined,
  VendorOrganization: undefined,
  Pharmacist: undefined,
  PharmacyOutlet: undefined,
  Orders: undefined,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ data: IUser }>) => {
      const data = action.payload.data
      state.id = data.id
      state.firstName = data.firstName
      state.lastName = data.lastName
      state.email = data.email
      state.phoneNumber = data.phoneNumber
      state.profilePic = data.profilePic
      state.role = data.role
      state.active = data.active
      state.createdAt = data.createdAt
      state.Address = data.Address
      state.VendorOwner = data.VendorOwner
      state.VendorOrganization = data.VendorOrganization
      state.Pharmacist = data.Pharmacist
      state.PharmacyOutlet = data.PharmacyOutlet
      state.Orders = data.Orders
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(meFulfilled, (state, action: PayloadAction<ApiResponse<IUser>>) => {
      const data = action.payload.body.data
      if (data) {
        state.id = data.id
        state.firstName = data.firstName
        state.lastName = data.lastName
        state.email = data.email
        state.phoneNumber = data.phoneNumber
        state.profilePic = data.profilePic
        state.role = data.role
        state.active = data.active
        state.createdAt = data.createdAt
        state.Address = data.Address
        state.VendorOwner = data.VendorOwner
        state.VendorOrganization = data.VendorOrganization
        state.Pharmacist = data.Pharmacist
        state.PharmacyOutlet = data.PharmacyOutlet
        state.Orders = data.Orders
      }
    })
  },
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
