/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { motion } from 'framer-motion'
import { PlusCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { ISupplier } from '@/types'

export const OrderSummary = ({
  predictedMedicines,
  suppliers,
  selectedSupplier,
  onSupplierChange,
  onCreateOrder,
  isProcessingOrder,
}: {
  predictedMedicines: any[]
  suppliers: ISupplier[]
  selectedSupplier: ISupplier | null
  onSupplierChange: (value: string) => void
  onCreateOrder: () => void
  isProcessingOrder: boolean
}) => {
  const recommendedMedicines = predictedMedicines.filter((m) => m.isRecommended)

  return (
    <div className="border-t border-gray-200 bg-gray-50 px-4 py-4 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-gray-700">
            Total Items: {recommendedMedicines.reduce((sum, med) => sum + med.quantity, 0)}
          </div>
          <div className="text-sm font-medium text-gray-700">
            Total Amount: $
            {recommendedMedicines
              .reduce((sum, med) => sum + med.price * med.quantity, 0)
              .toFixed(2)}
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <Select value={selectedSupplier?.id} onValueChange={onSupplierChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select supplier" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select Supplier</SelectLabel>
                  {suppliers.map((supplier) => (
                    <SelectItem value={supplier.id} key={supplier.id}>
                      {supplier.businessName}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCreateOrder}
            disabled={isProcessingOrder || !selectedSupplier}
            className={`inline-flex w-full items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm ${
              isProcessingOrder
                ? 'cursor-not-allowed bg-blue-400'
                : 'bg-radial from-blue-900 to-blue-600'
            }`}
          >
            {isProcessingOrder ? (
              <>
                <ArrowPathIcon className="mr-2 -ml-1 h-4 w-4 animate-spin" />
                Processing Order...
              </>
            ) : (
              <>
                <PlusCircleIcon className="mr-2 -ml-1 h-4 w-4" />
                Create Order with Blockchain
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  )
}
