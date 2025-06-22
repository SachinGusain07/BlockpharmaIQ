import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useForm } from 'react-hook-form'

type Medicine = {
  id: string
  name: string
  quantity: number
  currentStock: number
  price: number
  category: string
  expiry?: string
}

type PredictedMedicine = Medicine & {
  isRecommended: boolean
  confidence: number
}

type MedicineFormValues = {
  name: string
  quantity: number
}

export const MedicinePredictionForm = ({
  medicine,
  onSave,
  onCancel,
}: {
  medicine: PredictedMedicine
  onSave: (updatedMedicine: PredictedMedicine) => void
  onCancel: () => void
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MedicineFormValues>({
    defaultValues: {
      name: medicine.name,
      quantity: medicine.quantity,
    },
  })

  const onSubmit = (data: MedicineFormValues) => {
    onSave({
      ...medicine,
      name: data.name,
      quantity: data.quantity,
    })
  }

  return (
    <div className="bg-blue-50 p-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700">Medicine Name</label>
              <input
                {...register('name', { required: 'Name is required' })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm"
              />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                {...register('quantity', {
                  required: 'Quantity is required',
                  min: { value: 1, message: 'Quantity must be at least 1' },
                })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm"
              />
              {errors.quantity && (
                <p className="mt-1 text-xs text-red-600">{errors.quantity.message}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md border border-transparent bg-blue-600 px-3 py-1 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export const MedicineItem = ({
  medicine,
  onEdit,
  onDelete,
  onToggleRecommendation,
}: {
  medicine: PredictedMedicine
  onEdit: (medicine: PredictedMedicine) => void
  onDelete: (id: string) => void
  onToggleRecommendation: (id: string) => void
}) => {
  return (
    <div className="flex items-center px-4 py-4 sm:px-6">
      <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <div className="flex text-sm">
            <p className="truncate font-medium text-blue-600">{medicine.name}</p>
            <p className="ml-1 flex-shrink-0 font-normal text-gray-500">in {medicine.category}</p>
          </div>
          <div className="mt-2 flex">
            <div className="flex items-center text-sm text-gray-500">
              <p>
                Recommended Order:{' '}
                <span className="font-medium text-gray-900">{medicine.quantity}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-shrink-0 items-center space-x-4 sm:mt-0">
          <div className="flex items-center">
            <input
              id={`recommended-${medicine.id}`}
              name={`recommended-${medicine.id}`}
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={medicine.isRecommended}
              onChange={() => onToggleRecommendation(medicine.id)}
            />
            <label htmlFor={`recommended-${medicine.id}`} className="ml-2 text-sm text-gray-700">
              Include in order
            </label>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(medicine)}
              className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <PencilIcon className="mr-1 h-4 w-4" />
              Edit
            </button>
            <button
              onClick={() => onDelete(medicine.id)}
              className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-red-700 shadow-sm hover:bg-red-50"
            >
              <TrashIcon className="mr-1 h-4 w-4" />
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
