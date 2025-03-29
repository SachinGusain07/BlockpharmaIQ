import { RootState } from '@/store/store'
import { ApiResponse, IUser } from '@/types/types'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseUrl = 'http://localhost:5000/api'

export const api = createApi({
  reducerPath: 'api',
  tagTypes: ['User'],
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken

      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),

  endpoints: (builder) => ({
    me: builder.query<ApiResponse<IUser>, void>({
      query: () => ({
        url: `/auth/me`,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    login: builder.mutation<
      ApiResponse<IUser & { accessToken: string; refreshToken: string }>,
      { email: string; password: string }
    >({
      query: (body) => {
        return {
          url: `/auth/login`,
          method: 'POST',
          body,
        }
      },
      invalidatesTags: ['User'],
    }),
    register: builder.mutation<
      ApiResponse<IUser>,
      Omit<IUser, 'id' | 'active' | 'role' | 'refreshToken'>
    >({
      query: (body) => {
        return { url: `/auth/register`, method: 'POST', body }
      },
    }),
    updateUser: builder.mutation<ApiResponse<IUser>, IUser>({
      query: (body) => {
        return { url: `/auth/${body.id}`, method: 'PUT', body }
      },
      invalidatesTags: ['User'],
    }),
    refresh: builder.mutation({
      query: (refreshToken) => ({
        url: '/auth/refresh',
        method: 'POST',
        body: { refreshToken },
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => {
        return { url: `/auth/logout`, method: 'POST' }
      },
    }),
  }),
})

export const {
  useMeQuery,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useUpdateUserMutation,
} = api
