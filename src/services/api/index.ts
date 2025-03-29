import { authApiEndpoints } from './authApi/endpoints'
import { userApiEndpoints } from './userApi/endpoints'

export const { useMeQuery, useUpdateUserMutation } = userApiEndpoints
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
  },
} = userApiEndpoints
