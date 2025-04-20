import { api } from '@/services/apiSlice'
import { ApiResponse, IPharmacy } from '@/types'

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
      Omit<IPharmacy | null, 'pharmacyOutletId'>
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
      Omit<IPharmacy | null, 'pharmacyOutletId'>
    >({
      query: (data) => ({
        url: 'pharmacy/outlet/update',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Pharmacy'],
    }),
    deletePharmacy: builder.mutation<ApiResponse<IPharmacy>, { pharmacyOutletId: string }>({
      query: ({ pharmacyOutletId }) => ({
        url: `pharmacy/outlet/delete/${pharmacyOutletId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Pharmacy'],
    }),
  }),
})
