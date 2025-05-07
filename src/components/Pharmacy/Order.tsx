/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetAllSuppliersQuery, useGetOrdersQuery } from '@/services/api'
import { ISupplier } from '@/types'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { MedicineItem, MedicinePredictionForm } from './MedicinePredictionForm'
import { OrderList } from './OrderList'
import { OrderSummary } from './OrderSummary'

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
  const [predictedMedicines, setPredictedMedicines] = useState<any[]>([])
  const [editingMedicine, setEditingMedicine] = useState<any | null>(null)
  const [selectedSupplier, setSelectedSupplier] = useState<ISupplier | null>(null)
  const [isLoadingPredictions, setIsLoadingPredictions] = useState(false)
  const [viewTab, setViewTab] = useState<'orders' | 'prediction'>('orders')

  const { data: ordersData } = useGetOrdersQuery()
  const orderData = ordersData?.body.data || []

  const { data: suppliersData } = useGetAllSuppliersQuery()
  const supplierData = suppliersData?.body.data || []

  // Blockchain interaction
  // const { config } = usePrepareContractWrite({
  //   address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  //   abi: PharmacySupplyChainABI,
  //   functionName: 'createOrder',
  //   args: [
  //     selectedSupplier?.walletAddress,
  //     predictedMedicines.filter((m) => m.isRecommended).map((m) => m.id),
  //     predictedMedicines.filter((m) => m.isRecommended).map((m) => m.quantity),
  //     predictedMedicines
  //       .filter((m) => m.isRecommended)
  //       .reduce((sum, med) => sum + med.price * med.quantity, 0),
  //   ],
  //   enabled:
  //     selectedSupplier !== null && predictedMedicines.filter((m) => m.isRecommended).length > 0,
  // })

  // const { data: txData, writeAsync: createOrder } = useContractWrite(config)

  // const { isLoading: isProcessingOrder } = useWaitForTransaction({
  //   hash: txData?.hash,
  //   onSuccess: async () => {
  //     // Create order in database after blockchain confirmation
  //     const totalItems = predictedMedicines
  //       .filter((m) => m.isRecommended)
  //       .reduce((sum, med) => sum + med.quantity, 0)
  //     const totalAmount = predictedMedicines
  //       .filter((m) => m.isRecommended)
  //       .reduce((sum, med) => sum + med.price * med.quantity, 0)

  //     const orderData = {
  //       supplierId: selectedSupplier?.id,
  //       items: totalItems,
  //       amount: totalAmount,
  //       medicines: predictedMedicines.filter((m) => m.isRecommended),
  //       blockchainTxHash: txData?.hash,
  //     }

  //     try {
  //       const response = await fetch('/api/orders', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify(orderData),
  //       })

  //       if (response.ok) {
  //         setPredictedMedicines([])
  //         setSelectedSupplier(null)
  //         setViewTab('orders')
  //       }
  //     } catch (error) {
  //       console.error('Error creating order:', error)
  //     }
  //   },
  // })

  const handlePredictMedicines = async () => {
    setIsLoadingPredictions(true)
    try {
      const predictions = await predictMedicines()
      setPredictedMedicines(predictions)
    } catch (error) {
      console.error('Error predicting medicines:', error)
    } finally {
      setIsLoadingPredictions(false)
    }
  }

  const handleSaveEdit = (updatedMedicine: any) => {
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
      alert('Please select a supplier')
      return
    }

    try {
      console.log(predictedMedicines)
      // await createOrder?.()
    } catch (error) {
      console.error('Error creating order:', error)
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
                      // variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
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
                  isProcessingOrder={false}
                />
              )}
            </div>
          )}

          {/* Transaction Status */}
          {/* {txData?.hash && (
            <TransactionStatus
              status={isProcessingOrder ? 'processing' : 'success'}
              message={
                isProcessingOrder
                  ? 'Processing transaction on blockchain...'
                  : 'Transaction confirmed on blockchain'
              }
              hash={txData?.hash}
            />
          )} */}

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
