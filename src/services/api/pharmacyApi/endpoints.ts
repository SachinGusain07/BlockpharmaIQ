import { api } from '@/services/apiSlice'
import { ApiResponse, IPharmacy } from '@/types/types'

export const pharmacyEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllPharmacies: builder.query<ApiResponse<IPharmacy[]>, void>({
      query: () => ({
        url: 'pharmacy/outlet/getall',
        method: 'GET',
      }),
      providesTags: ['Pharmacy'],
    }),
    createPharmacy: builder.mutation<
      ApiResponse<IPharmacy>,
      Omit<IPharmacy, 'pharmacyOutletId' | 'pharmacyOwner'>
    >({
      query: (data) => ({
        url: 'pharmacy/outlet/add',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Pharmacy'],
    }),
    updatePharmacy: builder.mutation<
      ApiResponse<IPharmacy>,
      Omit<IPharmacy, 'pharmacyOutletId' | 'pharmacyOwner'>
    >({
      query: (data) => ({
        url: 'pharmacy/outlet/update',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Pharmacy'],
    }),
  }),
})
