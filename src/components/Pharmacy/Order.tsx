/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useCreateOrderMutation,
  useGetAllSuppliersQuery,
  useGetAllUsersQuery,
  useGetOrdersQuery,
  useMeQuery,
} from '@/services/api'
import { ISupplier, IUser, PaymentMethod } from '@/types'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
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

const predictMedicines = async (): Promise<IMedicine[]> => {
  // Simulate ML prediction API call
  await new Promise((resolve) => setTimeout(resolve, 1500))

  return [
    {
      id: 'med-001',
      name: 'Paracetamol 500mg',
      quantity: 200,
      currentStock: 50,
      price: 0.15,
      category: 'Pain Relief',
      isRecommended: true,
      confidence: 0.92,
    },
    {
      id: 'med-002',
      name: 'Amoxicillin 250mg',
      quantity: 150,
      currentStock: 30,
      price: 0.45,
      category: 'Antibiotics',
      isRecommended: true,
      confidence: 0.87,
    },
    {
      id: 'med-003',
      name: 'Cetirizine 10mg',
      quantity: 100,
      currentStock: 15,
      price: 0.25,
      category: 'Antihistamine',
      isRecommended: true,
      confidence: 0.83,
    },
    {
      id: 'med-004',
      name: 'Omeprazole 20mg',
      quantity: 80,
      currentStock: 25,
      price: 0.35,
      category: 'Antacid',
      isRecommended: true,
      confidence: 0.79,
    },
    {
      id: 'med-005',
      name: 'Metformin 500mg',
      quantity: 120,
      currentStock: 40,
      price: 0.3,
      category: 'Diabetes',
      isRecommended: true,
      confidence: 0.76,
    },
  ]
}

export const PharmacyOrderSystem = () => {
  const [predictedMedicines, setPredictedMedicines] = useState<IMedicine[]>([])
  const [editingMedicine, setEditingMedicine] = useState<IMedicine | null>(null)
  const [selectedSupplier, setSelectedSupplier] = useState<ISupplier | null>(null)
  const [isLoadingPredictions, setIsLoadingPredictions] = useState(false)
  const [isProcessingOrder, setIsProcessingOrder] = useState(false)
  const [viewTab, setViewTab] = useState<'orders' | 'prediction'>('orders')

  const { data: ordersData } = useGetOrdersQuery()
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
    setIsLoadingPredictions(true)
    try {
      const predictions = await predictMedicines()
      setPredictedMedicines(predictions)
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
      // Connect wallet if not already connected
      const walletAddress = await web3Service.connectWallet()
      if (!walletAddress) {
        throw new Error('Wallet connection failed')
      }

      // Check if the user has the pharmacy role
      const isPharmacy = await web3Service.isCurrentUserPharmacy()
      if (!isPharmacy) {
        throw new Error('Only users with pharmacy role can create orders')
      }

      // Calculate total amount
      const totalAmount = predictedMedicines
        .filter((m) => m.isRecommended)
        .reduce((sum, med) => sum + med.price * med.quantity, 0)

      console.log(
        walletAddress,
        userData?.body?.data?.walletAddress ?? '',
        supplierWalletAddress ?? '',
        totalAmount
      )

      // Create order on blockchain
      const receipt = await web3Service.createOrder(
        walletAddress,
        userData?.body?.data?.walletAddress ?? '', // pharmacyOutletId
        supplierWalletAddress ?? '', // vendorOrgId
        totalAmount // amount
      )

      // Save order to backend API
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
            productId: med.id,
            quantity: med.quantity,
            price: med.price,
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
      {/* Header and Tabs */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Pharmacy Supply Chain</h2>
          <p className="text-sm text-gray-500">
            Manage inventory and orders with blockchain verification
          </p>
        </div>
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
      {viewTab === 'orders' && <OrderList orders={orderData} />}

      {/* Prediction Tab */}
      {viewTab === 'prediction' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Medicine Prediction</h3>
              <p className="text-sm text-gray-500">
                AI-powered prediction of medicines needed for the next month
              </p>
            </div>
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePredictMedicines}
                disabled={isLoadingPredictions}
                className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm ${
                  isLoadingPredictions
                    ? 'cursor-not-allowed bg-blue-400'
                    : 'bg-radial from-blue-900 to-blue-600'
                }`}
              >
                {isLoadingPredictions ? (
                  <>
                    <ArrowPathIcon className="mr-2 -ml-1 h-4 w-4 animate-spin" />
                    Predicting...
                  </>
                ) : (
                  <>
                    <ArrowPathIcon className="mr-2 -ml-1 h-4 w-4" />
                    Predict Medicines
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {predictedMedicines.length > 0 && (
            <div className="overflow-hidden bg-white shadow sm:rounded-md">
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
                <ArrowPathIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No predictions yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Click the Predict Medicines button to get started.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
