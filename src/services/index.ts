import { authApiEndpoints } from './api/authApi/endpoints'
import { userApiEndpoints } from './api/userApi/endpoints'

export const { useMeQuery, useUpdateUserMutation } = userApiEndpoints
export const { useLoginMutation, useRegisterMutation, useLogoutMutation } = authApiEndpoints
