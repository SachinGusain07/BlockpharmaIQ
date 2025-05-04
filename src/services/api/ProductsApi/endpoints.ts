import { api } from '@/services/apiSlice'
import { ApiResponse, BulkProductFormValues, Product, ProductFormValues } from '@/types'

export const supplierInventoryApiEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    getProductsByVendor: builder.query<ApiResponse<Product[]>, string>({
      query: (vendorOrgId) => `/products/vendor/${vendorOrgId}`,
      providesTags: ['Products'],
    }),
    createProduct: builder.mutation<Product, ProductFormValues>({
      query: (body) => ({
        url: '/products',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Products'],
    }),
    createBulkProducts: builder.mutation<Product[], BulkProductFormValues>({
      query: (body) => ({
        url: 'products/bulk',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Products'],
    }),
    updateProduct: builder.mutation<Product, { id: string; data: ProductFormValues }>({
      query: ({ id, data }) => ({
        url: `products/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),
  }),
})
