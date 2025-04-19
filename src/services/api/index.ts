import { authApiEndpoints } from './authApi/endpoints'
import { pharmacyEndpoints } from './pharmacyApi'
import { userApiEndpoints } from './userApi/endpoints'

export const {
  useMeQuery,
  useUpdateUserMutation,
  useAddAddressMutation,
  useUpdateUserAddressMutation,
  useCompleteProfileMutation,
  useGetAllUsersQuery,
  useDeleteUserMutation,
} = userApiEndpoints
export const { useLoginMutation, useRegisterMutation, useLogoutMutation } = authApiEndpoints

export const {
  endpoints: {
    login: {
      matchPending: loginPending,
      matchFulfilled: loginFulfilled,
      matchRejected: loginRejected,
    },
    logout: { matchFulfilled: logoutFulfilled },
  },
} = authApiEndpoints

export const {
  endpoints: {
    me: { matchFulfilled: meFulfilled },
    updateUser: { matchFulfilled: updateUserFulfilled },
    addAddress: { matchFulfilled: addAddressFulfilled },
    updateUserAddress: { matchFulfilled: updateUserAddressFulfilled },
    completeProfile: { matchFulfilled: completeProfileFulfilled },
  },
} = userApiEndpoints

export const {
  useCreatePharmacyMutation,
  useGetAllPharmaciesQuery,
  useUpdatePharmacyMutation,
  useDeletePharmacyMutation,
} = pharmacyEndpoints
