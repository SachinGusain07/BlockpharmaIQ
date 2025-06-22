/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useCreateOrderMutation,
  useGetAllSuppliersQuery,
  useGetAllUsersQuery,
  useGetOrdersQuery,
  useMeQuery,
} from '@/services/api'
import { ISupplier, IUser, PaymentMethod } from '@/types'
import { ArrowPathIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { MedicineItem, MedicinePredictionForm } from './MedicinePredictionForm'
import { OrderList } from './OrderList'
import { OrderSummary } from './OrderSummary'
import web3Service from '@/Contract/SupplyChainService'
import { toast } from 'sonner'

interface IMedicine {
  id: string
  name: string
  quantity: number
  currentStock: number
  price: number
  category: string
  isRecommended: boolean
  confidence: number
  expiry?: string
}

// Available medicine categories
const MEDICINE_CATEGORIES = [
  'Bones & Joints',
  'Brain & Cognitive Health',
  'Feet & Legs',
  'Female Reproductive Health',
  'Gastrointestinal Health',
  'Glandular Support',
  'Gum & Teeth',
  'Hair Skin & Nail',
  'Heart & Cardiovascular Health',
  'Liver Health',
  'Male Reproductive Health',
  'Musculoskeletal Health',
  'Nervous System',
  'Respiratory Health',
  'Visual health',
  'kidney & Bladder Health',
] as const

type MedicineCategory = (typeof MEDICINE_CATEGORIES)[number]

export const PharmacyOrderSystem = () => {
  const [predictedMedicines, setPredictedMedicines] = useState<IMedicine[]>([])
  const [editingMedicine, setEditingMedicine] = useState<IMedicine | null>(null)
  const [selectedSupplier, setSelectedSupplier] = useState<ISupplier | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<MedicineCategory>(
    'Female Reproductive Health'
  )
  const [isLoadingPredictions, setIsLoadingPredictions] = useState(false)
  const [isProcessingOrder, setIsProcessingOrder] = useState(false)
  const [viewTab, setViewTab] = useState<'orders' | 'prediction'>('orders')

  const { data: ordersData, isLoading: isOrderDataLoading } = useGetOrdersQuery()
  const { data: userData } = useMeQuery()
  const orderData = ordersData?.body.data || []
  const { data: suppliersData } = useGetAllSuppliersQuery()
  const { data: users } = useGetAllUsersQuery()
  const [createOrder] = useCreateOrderMutation()

  const supplierWalletAddress = users?.body.data.find(
    (user: IUser) => user.id === selectedSupplier?.ownerId
  )?.walletAddress

  const supplierData = suppliersData?.body.data || []

  const handlePredictMedicines = async () => {
    if (!selectedCategory) {
      toast.error('Please select a medicine category')
      return
    }

    setIsLoadingPredictions(true)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_AI_API_URL}predict?category=${encodeURIComponent(selectedCategory)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch predictions')
      }

      const predictionsData = await response.json()
      const mappedPredictions: IMedicine[] = predictionsData.top_10_predictions.map(
        (item: { medicine: string; predicted_quantity: number }, index: number) => ({
          id: `med-${index + 1}`,
          name: item.medicine,
          quantity: item.predicted_quantity,
          currentStock: 0,
          price: 0,
          category: predictionsData.category || selectedCategory,
          isRecommended: true,
          confidence: 0.8,
        })
      )

      setPredictedMedicines(mappedPredictions)
      toast.success(`Predicted medicines for ${selectedCategory} category`)
    } catch (error) {
      console.error('Error predicting medicines:', error)
      toast.error('Failed to predict medicines. Please try again.')
    } finally {
      setIsLoadingPredictions(false)
    }
  }

  const handleSaveEdit = (updatedMedicine: IMedicine) => {
    setPredictedMedicines((medicines) =>
      medicines.map((med) => (med.id === updatedMedicine.id ? updatedMedicine : med))
    )
    setEditingMedicine(null)
  }

  const handleDeleteMedicine = (id: string) => {
    setPredictedMedicines((medicines) => medicines.filter((med) => med.id !== id))
  }

  const handleToggleRecommendation = (id: string) => {
    setPredictedMedicines((medicines) =>
      medicines.map((med) => (med.id === id ? { ...med, isRecommended: !med.isRecommended } : med))
    )
  }

  const handleCategoryChange = (category: MedicineCategory) => {
    setSelectedCategory(category)
    setPredictedMedicines([])
  }

  const handleCreateOrderWithBlockchain = async () => {
    if (!selectedSupplier) {
      toast.error('Please select a supplier')
      return
    }

    if (predictedMedicines.filter((m) => m.isRecommended).length === 0) {
      toast.error('Please select at least one medicine to order')
      return
    }

    setIsProcessingOrder(true)
    try {
      const walletAddress = await web3Service.connectWallet()
      if (!walletAddress) {
        throw new Error('Wallet connection failed')
      }

      const isPharmacy = await web3Service.isCurrentUserPharmacy()
      if (!isPharmacy) {
        throw new Error('Only users with pharmacy role can create orders')
      }

      const totalAmount = predictedMedicines
        .filter((m) => m.isRecommended)
        .reduce((sum, med) => sum + med.price * med.quantity, 0)

      const receipt = await web3Service.createOrder(
        walletAddress,
        userData?.body?.data?.walletAddress ?? '',
        supplierWalletAddress ?? '',
        totalAmount
      )

      const totalItems = predictedMedicines
        .filter((m) => m.isRecommended)
        .reduce((sum, med) => sum + med.quantity, 0)

      const orderData = {
        vendorOrgId: selectedSupplier.id,
        items: totalItems,
        amount: totalAmount,
        pharmacyOutletId: userData?.body?.data?.pharmacyOutlets?.[0]?.id ?? '',
        orderItems: predictedMedicines
          .filter((m) => m.isRecommended)
          .map((med) => ({
            name: med.name,
            quantity: Number(med.quantity),
            category: med.category || selectedCategory,
          })),
        medicines: predictedMedicines.map((med) => ({
          name: med.name,
          quantity: med.quantity,
        })),
        blockchainTxHash:
          receipt.hash ?? '0x8f15cac06362f23711c5e17755c00afaddf4ad26dce3c16ae0296f13fa154c233',
        paymentMethod: 'UPI' as PaymentMethod,
        blockchainOrderId: receipt.logs[0].args[0].toString(),
      }
      await createOrder(orderData).unwrap()

      toast.success('Order created successfully on blockchain and saved to database')
      setPredictedMedicines([])
      setSelectedSupplier(null)
      setViewTab('orders')
    } catch (error: any) {
      console.error('Error creating order:', error)
      toast.error(error.message || 'Failed to create order. Please try again.')
    } finally {
      setIsProcessingOrder(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Pharmacy Supply Chain</h2>
          <p className="text-sm text-gray-500">
            Manage inventory and orders with blockchain verification
          </p>
        </div>
        {viewTab === 'prediction' && (
          <div className="relative flex items-center space-x-3">
            <div className="flex items-center">
              <FunnelIcon className="mr-2 h-5 w-5 text-gray-400" />
              <select
                id="category-select"
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value as MedicineCategory)}
                className="appearance-none rounded-lg border border-gray-300 bg-white py-2 pr-8 pl-3 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-100"
                disabled={isLoadingPredictions}
              >
                {MEDICINE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-10 flex items-center">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePredictMedicines}
              disabled={isLoadingPredictions || !selectedCategory}
              className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 ${
                isLoadingPredictions || !selectedCategory
                  ? 'cursor-not-allowed bg-gray-400'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoadingPredictions ? (
                <>
                  <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />
                  Predicting...
                </>
              ) : (
                <>
                  <ArrowPathIcon className="mr-2 h-4 w-4" />
                  Predict
                </>
              )}
            </motion.button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setViewTab('orders')}
          className={`px-4 py-2 text-sm font-medium ${
            viewTab === 'orders'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'
          }`}
        >
          Orders
        </button>
        <button
          onClick={() => setViewTab('prediction')}
          className={`px-4 py-2 text-sm font-medium ${
            viewTab === 'prediction'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'
          }`}
        >
          Inventory Prediction
        </button>
      </div>

      {/* Orders Tab */}
      {viewTab === 'orders' && (
        <OrderList orders={orderData} isOrderDataLoading={isOrderDataLoading} />
      )}

      {/* Prediction Tab */}
      {viewTab === 'prediction' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Medicine Prediction</h3>
              <p className="text-sm text-gray-500">AI-powered prediction of medicines</p>
            </div>
          </div>

          {selectedCategory && (
            <div className="text-sm text-gray-600">
              Selected category:{' '}
              <span className="font-medium text-blue-600">{selectedCategory}</span>
            </div>
          )}

          {predictedMedicines.length > 0 && (
            <div className="overflow-hidden bg-white shadow sm:rounded-md">
              <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
                <h4 className="text-sm font-medium text-gray-900">
                  Predicted Medicines for {selectedCategory}
                </h4>
                <p className="mt-1 text-xs text-gray-500">
                  {predictedMedicines.length} medicines predicted,{' '}
                  {predictedMedicines.filter((m) => m.isRecommended).length} recommended
                </p>
              </div>

              <ul className="divide-y divide-gray-200">
                <AnimatePresence>
                  {predictedMedicines.map((medicine) => (
                    <motion.li
                      key={medicine.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      {editingMedicine?.id === medicine.id ? (
                        <MedicinePredictionForm
                          medicine={medicine}
                          onSave={handleSaveEdit}
                          onCancel={() => setEditingMedicine(null)}
                        />
                      ) : (
                        <MedicineItem
                          medicine={medicine}
                          onEdit={setEditingMedicine}
                          onDelete={handleDeleteMedicine}
                          onToggleRecommendation={handleToggleRecommendation}
                        />
                      )}
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>

              {predictedMedicines.filter((m) => m.isRecommended).length > 0 && (
                <OrderSummary
                  predictedMedicines={predictedMedicines}
                  suppliers={supplierData}
                  selectedSupplier={selectedSupplier}
                  onSupplierChange={(value) => {
                    const supplier = supplierData.find((s) => s.id === value)
                    setSelectedSupplier(supplier || null)
                  }}
                  onCreateOrder={handleCreateOrderWithBlockchain}
                  isProcessingOrder={isProcessingOrder}
                />
              )}
            </div>
          )}

          {predictedMedicines.length === 0 && !isLoadingPredictions && (
            <div className="py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 p-3">
                <FunnelIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Ready to predict medicines</h3>
              <p className="mt-1 text-sm text-gray-500">
                Select a category and click "Predict Medicines" to get AI-powered recommendations.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
