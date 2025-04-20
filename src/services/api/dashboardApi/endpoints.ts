import { api } from '@/services/apiSlice'
import { ICountsResponse } from '@/types'

export const dashboardApiEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardData: builder.query<ICountsResponse, void>({
      query: () => '/counts',
    }),
  }),
})
