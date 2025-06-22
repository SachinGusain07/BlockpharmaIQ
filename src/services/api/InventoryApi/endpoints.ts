import { api } from '@/services/apiSlice'
import { ApiResponse, InventoryItem, InventoryItemFormData } from '@/types'

export const InventoryApiEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    getInventory: builder.query<ApiResponse<InventoryItem[]>, { pharmacyOutletId: string }>({
      query: ({ pharmacyOutletId }) => `/inventory/${pharmacyOutletId}`,
    }),
    createInventory: builder.mutation<ApiResponse<InventoryItem>, Partial<InventoryItemFormData>>({
      query: (inventory) => ({
        url: '/inventory',
        method: 'POST',
        body: inventory,
      }),
    }),
    updateInventory: builder.mutation<ApiResponse<InventoryItem>, Partial<InventoryItem>>({
      query: (inventory) => ({
        url: `/inventory/${inventory.id}`,
        method: 'PUT',
        body: inventory,
      }),
    }),
    deleteInventory: builder.mutation<ApiResponse<{ success: boolean }>, { id: string }>({
      query: ({ id }) => ({
        url: `/inventory/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
})
