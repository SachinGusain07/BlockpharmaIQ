import { api } from '@/services/apiSlice'
import { ApiResponse, IOrder } from '@/types'

export const OrderApiEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<ApiResponse<IOrder[]>, void>({
      query: () => '/orders/all',
    }),
  }),
})
