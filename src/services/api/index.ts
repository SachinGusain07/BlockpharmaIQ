import { authApiEndpoints } from './authApi/endpoints'
import { dashboardApiEndpoints } from './dashboardApi'
import { pharmacyEndpoints } from './pharmacyApi'
import { supplierApiEndpoints } from './supplierApi'
import { userApiEndpoints } from './userApi/endpoints'
import { supplierInventoryApiEndpoints } from './ProductsApi/endpoints'
import { OrderApiEndpoints } from './OrderApi'

export const {
  useMeQuery,
  useUpdateUserMutation,
  useAddAddressMutation,
  useUpdateUserAddressMutation,
  useCompleteProfileMutation,
  useGetAllUsersQuery,
  useDeleteUserMutation,
} = userApiEndpoints
export const { useLoginMutation, useRegisterMutation, useLogoutMutation } = authApiEndpoints

export const {
  endpoints: {
    login: {
      matchPending: loginPending,
      matchFulfilled: loginFulfilled,
      matchRejected: loginRejected,
    },
    logout: { matchFulfilled: logoutFulfilled },
  },
} = authApiEndpoints

export const {
  endpoints: {
    me: { matchFulfilled: meFulfilled },
    updateUser: { matchFulfilled: updateUserFulfilled },
    addAddress: { matchFulfilled: addAddressFulfilled },
    updateUserAddress: { matchFulfilled: updateUserAddressFulfilled },
    completeProfile: { matchFulfilled: completeProfileFulfilled },
  },
} = userApiEndpoints

export const {
  useCreateSupplierMutation,
  useDeleteSupplierMutation,
  useGetAllSuppliersQuery,
  useUpdateSupplierMutation,
} = supplierApiEndpoints

export const { useGetDashboardDataQuery } = dashboardApiEndpoints

export const {
  useCreatePharmacyMutation,
  useGetAllPharmaciesQuery,
  useUpdatePharmacyMutation,
  useDeletePharmacyMutation,
} = pharmacyEndpoints

export const {
  useCreateBulkProductsMutation,
  useCreateProductMutation,
  useGetProductsByVendorQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = supplierInventoryApiEndpoints

export const { useGetOrdersQuery, useCreateOrderMutation, useGetSupplierOrdersQuery, useUpdateOrderMutation } =
  OrderApiEndpoints
