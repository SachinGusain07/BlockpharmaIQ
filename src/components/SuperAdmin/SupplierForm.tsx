import { useGetAllUsersQuery } from '@/services/api'
import { ISupplier, IUser } from '@/types'
import { SupplierFormData, supplierSchema } from '@/types/validations'
import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'

interface SupplierFormProps {
  initialData?: Partial<ISupplier>
  onSubmit?: (data: SupplierFormData) => void
  onCancel: () => void
}

const SupplierForm: React.FC<SupplierFormProps> = ({
  initialData = {},
  onSubmit = () => {},
  onCancel,
}) => {
  const { data: users, isLoading } = useGetAllUsersQuery()
  const vendorOwners = users?.body.data.filter((user: IUser) => user.role === 'SUPPLIER') || []

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SupplierFormData>({
    resolver: yupResolver(supplierSchema),
    defaultValues: {
      businessName: '',
      gstin: '',
      email: '',
      phoneNumber: '',
      street: '',
      city: '',
      state: '',
      pincode: '',
      website: initialData.website ?? '',
      ownerId: initialData.ownerId || '',
      isActive: true,
      ...initialData,
    },
  })
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Business Name</label>
        <input
          {...register('businessName')}
          type="text"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
        />
        {errors.businessName && (
          <p className="mt-1 text-sm text-red-600">{errors.businessName.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">GSTIN</label>
        <input
          {...register('gstin')}
          type="text"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
        />
        {errors.gstin && <p className="mt-1 text-sm text-red-600">{errors.gstin.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            {...register('email')}
            type="email"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            {...register('phoneNumber')}
            type="text"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Website</label>
        <input
          {...register('website')}
          type="url"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
        />
        {errors.website && <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Street Address</label>
        <input
          {...register('street')}
          type="text"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
        />
        {errors.street && <p className="mt-1 text-sm text-red-600">{errors.street.message}</p>}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">City</label>
          <input
            {...register('city')}
            type="text"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
          />
          {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">State</label>
          <input
            {...register('state')}
            type="text"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
          />
          {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Pincode</label>
          <input
            {...register('pincode')}
            type="text"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
          />
          {errors.pincode && <p className="mt-1 text-sm text-red-600">{errors.pincode.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Vendor Owner</label>
        <select
          {...register('ownerId')}
          defaultValue={initialData.ownerId}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm hover:bg-gray-50 focus:border-gray-300 focus:ring-gray-300 focus:outline-none sm:text-sm"
        >
          <option className="hover:bg-gray-100" value="">
            Select a vendor owner
          </option>
          {isLoading ? (
            <option value="" disabled>
              Loading owners...
            </option>
          ) : vendorOwners.length > 0 ? (
            vendorOwners.map((owner: IUser) => (
              <option
                className="selection:bg-gray-50 focus:bg-gray-100 active:bg-gray-100"
                key={owner.id}
                value={owner.id}
              >
                {owner.firstName} {owner.lastName}
              </option>
            ))
          ) : (
            <option value="" disabled>
              No vendor owners available
            </option>
          )}
        </select>
        {errors.ownerId && <p className="mt-1 text-sm text-red-600">{errors.ownerId.message}</p>}
      </div>

      <div className="flex items-center">
        <input
          {...register('isActive')}
          type="checkbox"
          id="isActive"
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
          Active
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="default">
          {initialData.ownerId ? 'Update Supplier' : 'Create Supplier'}
        </Button>
      </div>
    </form>
  )
}

export default SupplierForm
