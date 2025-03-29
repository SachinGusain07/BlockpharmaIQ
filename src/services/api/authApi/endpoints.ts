import { api } from '../../api'
import { ApiResponse, IUser } from '@/types/types'

export const authApiEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<
      ApiResponse<IUser & { accessToken: string; refreshToken: string }>,
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    register: builder.mutation<
      ApiResponse<IUser>,
      Omit<IUser, 'id' | 'active' | 'role' | 'refreshToken'>
    >({
      query: (userData) => ({
        url: '/auth/register',
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
