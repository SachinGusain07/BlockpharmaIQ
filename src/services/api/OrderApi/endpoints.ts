import { api } from '@/services/apiSlice'
import { ApiResponse, IOrder, IOrderFormData } from '@/types'

export const OrderApiEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<ApiResponse<IOrder[]>, void>({
      query: () => '/orders/all',
    }),
    createOrder: builder.mutation<ApiResponse<IOrder>, Partial<IOrderFormData>>({
      query: (order) => ({
        url: '/orders',
        method: 'POST',
        body: order,
      }),
    }),
    getSupplierOrders: builder.query<ApiResponse<IOrder[]>, string>({
      query: (supplierId) => `/orders/vendor/${supplierId}`,
    }),
    updateOrder: builder.mutation<ApiResponse<IOrder>, Partial<IOrder>>({
      query: (order) => ({
        url: `/orders/${order.id}/status`,
        method: 'PUT',
        body: order,
      }),
    }),
  }),
})
