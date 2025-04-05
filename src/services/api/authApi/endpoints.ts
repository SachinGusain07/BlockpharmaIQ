/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from '@/services/apiSlice'
import { ApiResponse, IResponseUser, IUser } from '@/types/types'

export const authApiEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<IResponseUser>, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/user/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    register: builder.mutation<
      ApiResponse<IUser>,
      Omit<
        IUser,
        | 'id'
        | 'active'
        | 'role'
        | 'refreshToken'
        | 'createdAt'
        | 'updatedAt'
        | 'isProfileCompleted'
        | 'phoneNumber'
      >
    >({
      query: (userData) => ({
        url: '/user/register',
        method: 'POST',
        body: userData,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
  }),
})
