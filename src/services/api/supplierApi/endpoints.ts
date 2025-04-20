import { api } from '@/services/apiSlice'
import { ApiResponse, ISupplier } from '@/types'
import { SupplierFormData } from '@/types/validations'

export const supplierApiEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllSuppliers: builder.query<ApiResponse<ISupplier[]>, void>({
      query: () => '/supplier/getall',
      providesTags: ['Supplier'],
    }),
    createSupplier: builder.mutation<ApiResponse<ISupplier>, SupplierFormData>({
      query: (data) => ({
        url: '/supplier/add',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Supplier'],
    }),
    updateSupplier: builder.mutation<
      ApiResponse<ISupplier>,
      { id: string; data: SupplierFormData }
    >({
      query: ({ id, data }) => ({
        url: `/supplier/update/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Supplier'],
    }),
    deleteSupplier: builder.mutation<ApiResponse<ISupplier>, { supplierId: string }>({
      query: ({ supplierId }) => ({
        url: `/supplier/delete/${supplierId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Supplier'],
    }),
  }),
})
