/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from '@/services/apiSlice'

export const userApiEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    me: builder.query<ApiResponse<IUser>, void>({
      query: () => '/user/me',
      providesTags: ['User'],
    }),
    updateUser: builder.mutation<ApiResponse<IUser>, any>({
      query: (userData) => ({
        url: `/user/update`,
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    addAddress: builder.mutation<ApiResponse<IUser>, any>({
      query: (address) => ({
        url: `/user/add-address`,
        method: 'POST',
        body: address,
      }),
      invalidatesTags: ['User'],
    }),
    updateUserAddress: builder.mutation<ApiResponse<IUser>, Partial<IAddress>>({
      query: (address) => ({
        url: `/user/update-address`,
        method: 'PUT',
        body: address,
      }),
      invalidatesTags: ['User'],
    }),
    completeProfile: builder.mutation<ApiResponse<IUser>, FormData>({
      query: (formData) => ({
        url: `/user/complete-profile`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['User'],
    }),
    getAllUsers: builder.query<ApiResponse<IUser[]>, void>({
      query: () => ({
        url: '/user/getAll',
        method: 'GET',
      }),
    }),
    deleteUser: builder.mutation<ApiResponse<IUser>, string>({
      query: (id) => ({
        url: `/user/delete`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: ['User'],
    }),
  }),
})
