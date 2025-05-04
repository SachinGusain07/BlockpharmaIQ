import React, { useState } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { bulkProductsSchema } from '@/types/validations'
import { TrashIcon, PlusCircleIcon } from '@heroicons/react/24/outline'
import { BulkProductFormData, PharmacyOutlet } from '@/types'
import { useAddBulkProductsMutation, useGetPharmacyOutletsQuery } from '@/services/api'

interface BulkProductFormProps {
  onSuccess: () => void
  vendorOrgId: string
}

const BulkProductForm: React.FC<BulkProductFormProps> = ({ onSuccess, vendorOrgId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: pharmacyOutlets, isLoading: isLoadingOutlets } = useGetPharmacyOutletsQuery()
  const [addBulkProducts] = useAddBulkProductsMutation()

  const defaultValues: BulkProductFormData = {
    pharmacyOutletId: '',
    products: [
      {
        name: '',
        description: '',
        brand: '',
        category: '',
        unit: '',
        price: 0,
        stock: 0,
        threshold: 5,
        expiry: new Date(),
        batchNumber: '',
      },
    ],
  }

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BulkProductFormData>({
    resolver: yupResolver(bulkProductsSchema),
    defaultValues,
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products',
  })

  const onSubmit = async (data: BulkProductFormData) => {
    try {
      setIsSubmitting(true)

      // Add vendorOrgId to the request
      await addBulkProducts({
        ...data,
        products: data.products.map((product) => ({
          ...product,
          vendorOrgId,
        })),
      }).unwrap()

      reset(defaultValues)
      onSuccess()
    } catch (error) {
      console.error('Failed to add products:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addNewProduct = () => {
    append({
      name: '',
      description: '',
      brand: '',
      category: '',
      unit: '',
      price: 0,
      stock: 0,
      threshold: 5,
      expiry: new Date(),
      batchNumber: '',
    })
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Add Multiple Products</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Select Pharmacy Outlet
          </label>
          <Controller
            control={control}
            name="pharmacyOutletId"
            render={({ field }) => (
              <select
                {...field}
                className="w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500"
                disabled={isLoadingOutlets}
              >
                <option value="">Select pharmacy outlet</option>
                {pharmacyOutlets?.map((outlet: PharmacyOutlet) => (
                  <option key={outlet.id} value={outlet.id}>
                    {outlet.businessName} ({outlet.city}, {outlet.state})
                  </option>
                ))}
              </select>
            )}
          />
          {errors.pharmacyOutletId && (
            <p className="mt-1 text-sm text-red-600">{errors.pharmacyOutletId.message}</p>
          )}
        </div>

        <div className="space-y-8">
          {fields.map((field, index) => (
            <div key={field.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="mb-4 flex justify-between">
                <h3 className="text-lg font-medium text-gray-700">Product #{index + 1}</h3>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 transition-colors hover:text-red-700"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Product Name
                  </label>
                  <input
                    type="text"
                    {...register(`products.${index}.name`)}
                    className="w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Product name"
                  />
                  {errors.products?.[index]?.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.products[index]?.name?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Brand</label>
                  <input
                    type="text"
                    {...register(`products.${index}.brand`)}
                    className="w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Brand name"
                  />
                  {errors.products?.[index]?.brand && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.products[index]?.brand?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
                  <input
                    type="text"
                    {...register(`products.${index}.category`)}
                    className="w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Category"
                  />
                  {errors.products?.[index]?.category && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.products[index]?.category?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Unit</label>
                  <input
                    type="text"
                    {...register(`products.${index}.unit`)}
                    className="w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="e.g., box, bottle, strip"
                  />
                  {errors.products?.[index]?.unit && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.products[index]?.unit?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register(`products.${index}.price`)}
                    className="w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="0.00"
                  />
                  {errors.products?.[index]?.price && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.products[index]?.price?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    {...register(`products.${index}.stock`)}
                    className="w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="0"
                  />
                  {errors.products?.[index]?.stock && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.products[index]?.stock?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Threshold</label>
                  <input
                    type="number"
                    {...register(`products.${index}.threshold`)}
                    className="w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="5"
                  />
                  {errors.products?.[index]?.threshold && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.products[index]?.threshold?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    {...register(`products.${index}.expiry`)}
                    className="w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  {errors.products?.[index]?.expiry && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.products[index]?.expiry?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Batch Number
                  </label>
                  <input
                    type="text"
                    {...register(`products.${index}.batchNumber`)}
                    className="w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Optional batch number"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    {...register(`products.${index}.description`)}
                    className="w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Product description"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={addNewProduct}
            className="flex items-center rounded-md bg-indigo-50 px-4 py-2 text-indigo-600 transition-colors hover:bg-indigo-100"
          >
            <PlusCircleIcon className="mr-2 h-5 w-5" />
            Add Another Product
          </button>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={() => reset(defaultValues)}
            className="mr-4 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:bg-indigo-300"
          >
            {isSubmitting ? 'Submitting...' : 'Add Products'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default BulkProductForm
