import { api } from '@/services/apiSlice'
import { ApiResponse, IUser } from '@/types/types'

export const userApiEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    me: builder.query<ApiResponse<IUser>, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),
    updateUser: builder.mutation<ApiResponse<IUser>, IUser>({
      query: (userData) => ({
        url: `/auth/${userData.id}`,
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
  }),
})
