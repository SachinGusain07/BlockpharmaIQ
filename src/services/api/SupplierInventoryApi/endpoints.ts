import { api } from '@/services/apiSlice'
import {
  Product,
  NewProduct,
  InventoryItem,
  NewInventoryItem,
  ProductFilter,
  PaginationParams,
  BulkProductFormData,
} from '@/types'

export const supplierInventoryApiEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      Product[],
      { vendorOrgId: string; filter?: ProductFilter; pagination?: PaginationParams }
    >({
      query: ({ vendorOrgId, filter, pagination }) => {
        let url = `/products?vendorOrgId=${vendorOrgId}`

        if (filter) {
          if (filter.search) url += `&search=${filter.search}`
          if (filter.category) url += `&category=${filter.category}`
          if (filter.brand) url += `&brand=${filter.brand}`
          if (filter.minPrice) url += `&minPrice=${filter.minPrice}`
          if (filter.maxPrice) url += `&maxPrice=${filter.maxPrice}`
        }

        if (pagination) {
          url += `&page=${pagination.page}&limit=${pagination.limit}`
        }

        return url
      },
      providesTags: ['Products'],
    }),

    getProductById: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Products', id }],
    }),

    addProduct: builder.mutation<Product, NewProduct>({
      query: (product) => ({
        url: '/products',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Products'],
    }),

    updateProduct: builder.mutation<Product, Partial<Product> & { id: string }>({
      query: ({ id, ...product }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: product,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Products', id }],
    }),

    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),

    // Inventory
    getInventoryItems: builder.query<
      InventoryItem[],
      { pharmacyOutletId: string; pagination?: PaginationParams }
    >({
      query: ({ pharmacyOutletId, pagination }) => {
        let url = `/inventory?pharmacyOutletId=${pharmacyOutletId}`

        if (pagination) {
          url += `&page=${pagination.page}&limit=${pagination.limit}`
        }

        return url
      },
      providesTags: ['Inventory'],
    }),

    addInventoryItem: builder.mutation<InventoryItem, NewInventoryItem>({
      query: (item) => ({
        url: '/inventory',
        method: 'POST',
        body: item,
      }),
      invalidatesTags: ['Inventory'],
    }),

    updateInventoryItem: builder.mutation<InventoryItem, Partial<InventoryItem> & { id: string }>({
      query: ({ id, ...item }) => ({
        url: `/inventory/${id}`,
        method: 'PUT',
        body: item,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Inventory', id }],
    }),

    deleteInventoryItem: builder.mutation<void, string>({
      query: (id) => ({
        url: `/inventory/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Inventory'],
    }),

    addBulkProducts: builder.mutation<{ success: boolean; count: number }, BulkProductFormData>({
      query: (data) => ({
        url: '/products/bulk',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Products', 'Inventory'],
    }),
  }),
})
