/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetAllSuppliersQuery, useGetOrdersQuery } from '@/services/api'
import { IOrder, ISupplier } from '@/types'
import {
  ArrowPathIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  ClockIcon,
  DocumentTextIcon,
  PencilIcon,
  PlusCircleIcon,
  TrashIcon,
  TruckIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

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

const api = {
  createOrder: async (orderData: any) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      success: true,
      data: {
        ...orderData,
        id: `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, '0')}`,
      },
    }
  },
}

// Mock ML prediction function
const predictMedicines = async (): Promise<PredictedMedicine[]> => {
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

const PharmacyOrderSystem = () => {
  const [predictedMedicines, setPredictedMedicines] = useState<PredictedMedicine[]>([])
  const [editingMedicine, setEditingMedicine] = useState<PredictedMedicine | null>(null)
  const [selectedSupplier, setSelectedSupplier] = useState<ISupplier | null>(null)
  const [isLoadingPredictions, setIsLoadingPredictions] = useState(false)
  const [isProcessingOrder, setIsProcessingOrder] = useState(false)
  const [viewTab, setViewTab] = useState<'orders' | 'prediction'>('orders')
  const [transactionStatus, setTransactionStatus] = useState<{
    status: 'idle' | 'processing' | 'success' | 'error'
    message: string
    hash?: string
  }>({
    status: 'idle',
    message: '',
  })

  const { data: ordersData } = useGetOrdersQuery()
  const orderData = ordersData?.body.data

  const { data: suppliersData } = useGetAllSuppliersQuery()
  const supplierData = suppliersData?.body.data

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

  const handleEditMedicine = (medicine: PredictedMedicine) => {
    setEditingMedicine(medicine)
  }

  const handleSaveEdit = (updatedMedicine: PredictedMedicine) => {
    setPredictedMedicines((medicines) =>
      medicines.map((med) => (med.id === updatedMedicine.id ? updatedMedicine : med))
    )
    setEditingMedicine(null)
  }

  const handleCancelEdit = () => {
    setEditingMedicine(null)
  }

  const handleDeleteMedicine = (id: string) => {
    setPredictedMedicines((medicines) => medicines.filter((med) => med.id !== id))
  }

  const handleCreateOrderWithBlockchain = async () => {
    // Only create order from medicines that are recommended
    const medicinesForOrder = predictedMedicines.filter((med) => med.isRecommended)

    if (medicinesForOrder.length === 0) {
      alert('Please select at least one medicine for the order')
      return
    }

    setIsProcessingOrder(true)
    setTransactionStatus({
      status: 'processing',
      message: 'Initiating blockchain transaction...',
    })

    try {
      // Connect to Ethereum provider
      // In production, you would use a proper provider
      // const provider = new ethers.providers.Web3Provider(window.ethereum)
      // await provider.send('eth_requestAccounts', [])
      // const signer = provider.getSigner()

      // Contract interaction would happen here
      // For mock purposes, we'll simulate the transaction
      setTransactionStatus({
        status: 'processing',
        message: 'Processing transaction on blockchain...',
      })

      // Simulate blockchain delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockTxHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`

      setTransactionStatus({
        status: 'success',
        message: 'Transaction confirmed on blockchain',
        hash: mockTxHash,
      })

      const totalItems = medicinesForOrder.reduce((sum, med) => sum + med.quantity, 0)
      const totalAmount = medicinesForOrder.reduce((sum, med) => sum + med.price * med.quantity, 0)

      const orderData = {
        date: new Date().toISOString().split('T')[0],
        supplier: selectedSupplier?.businessName,
        items: totalItems,
        amount: totalAmount,
        status: 'processing' as const,
        deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        transactionHash: mockTxHash,
        medicines: medicinesForOrder,
      }

      const result = await api.createOrder(orderData)

      if (result.success) {
        setPredictedMedicines([])

        setViewTab('orders')
      }
    } catch (error) {
      console.error('Error creating order:', error)
      setTransactionStatus({
        status: 'error',
        message: 'Transaction failed. Please try again.',
      })
    } finally {
      setIsProcessingOrder(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const baseClass = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium'

    switch (status) {
      case 'DELIVERED':
        return (
          <span className={`${baseClass} bg-green-100 text-green-800`}>
            <CheckCircleIcon className="mr-1 h-3 w-3" />
            Delivered
          </span>
        )
      case 'SHIPPED':
        return (
          <span className={`${baseClass} bg-blue-100 text-blue-800`}>
            <TruckIcon className="mr-1 h-3 w-3" />
            Shipped
          </span>
        )
      case 'PENDING':
        return (
          <span className={`${baseClass} bg-yellow-100 text-yellow-800`}>
            <ClockIcon className="mr-1 h-3 w-3" />
            Pending
          </span>
        )
      case 'CANCELLED':
        return (
          <span className={`${baseClass} bg-red-100 text-red-800`}>
            <XCircleIcon className="mr-1 h-3 w-3" />
            Cancelled
          </span>
        )
      default:
        return null
    }
  }

  const rowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    exit: {
      opacity: 0,
      x: 10,
      transition: { duration: 0.2, ease: 'easeIn' },
    },
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-gray-100 bg-white shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Supplier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Blockchain
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <AnimatePresence>
                  {(orderData ?? []).length > 0 ? (
                    orderData?.map((order: IOrder) => (
                      <motion.tr
                        key={order.id}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-ellipsis text-gray-900">
                            {order.id}
                          </div>
                          <div className="text-xs font-medium text-gray-400">
                            {order.orderDate.split('T')[0]}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                          {order.vendorOrg?.businessName}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                          {order.orderItems?.length}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                          ${order.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(order.orderStatus)}
                          {/* {order.orderStatus !== 'CANCELLED' && (
                          <div className="mt-1 text-xs text-gray-500">
                            Est. delivery: {order.paymentMethod}
                          </div>
                        )} */}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {order.blockchainTxHash ? (
                            <a
                              href={`https://polygonscan.com/tx/${order.blockchainTxHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-xs text-blue-600 underline hover:text-blue-800"
                            >
                              <DocumentTextIcon className="mr-1 h-3 w-3" />
                              Verify on Polygon
                            </a>
                          ) : (
                            <span className="text-xs text-gray-500">Not recorded</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center rounded-md bg-gray-100 px-3 py-1 text-gray-600 hover:bg-gray-200"
                          >
                            Details <ChevronRightIcon className="ml-1 h-4 w-4" />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <motion.div
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="w-full text-center hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-ellipsis text-gray-600">
                          No orders found
                        </div>
                      </td>
                    </motion.div>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

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
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      {editingMedicine?.id === medicine.id ? (
                        <div className="bg-blue-50 p-4">
                          <div className="flex flex-col space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-medium text-gray-700">
                                  Medicine Name
                                </label>
                                <input
                                  type="text"
                                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm"
                                  value={editingMedicine.name}
                                  onChange={(e) =>
                                    setEditingMedicine({ ...editingMedicine, name: e.target.value })
                                  }
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700">
                                  Quantity
                                </label>
                                <input
                                  type="number"
                                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm"
                                  value={editingMedicine.quantity}
                                  onChange={(e) =>
                                    setEditingMedicine({
                                      ...editingMedicine,
                                      quantity: parseInt(e.target.value),
                                    })
                                  }
                                />
                              </div>
                            </div>
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={handleCancelEdit}
                                className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSaveEdit(editingMedicine)}
                                className="rounded-md border border-transparent bg-blue-600 px-3 py-1 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                              >
                                Save Changes
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center px-4 py-4 sm:px-6">
                          <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                              <div className="flex text-sm">
                                <p className="truncate font-medium text-blue-600">
                                  {medicine.name}
                                </p>
                                <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
                                  in {medicine.category}
                                </p>
                              </div>
                              <div className="mt-2 flex">
                                <div className="flex items-center text-sm text-gray-500">
                                  <p>
                                    Current Stock:{' '}
                                    <span className="font-medium text-gray-900">
                                      {medicine.currentStock}
                                    </span>
                                  </p>
                                  <span className="mx-2 text-gray-500">•</span>
                                  <p>
                                    Recommended Order:{' '}
                                    <span className="font-medium text-gray-900">
                                      {medicine.quantity}
                                    </span>
                                  </p>
                                  <span className="mx-2 text-gray-500">•</span>
                                  <p>
                                    Unit Price:{' '}
                                    <span className="font-medium text-gray-900">
                                      ${medicine.price.toFixed(2)}
                                    </span>
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
                                  onChange={() => {
                                    setPredictedMedicines((medicines) =>
                                      medicines.map((med) =>
                                        med.id === medicine.id
                                          ? { ...med, isRecommended: !med.isRecommended }
                                          : med
                                      )
                                    )
                                  }}
                                />
                                <label
                                  htmlFor={`recommended-${medicine.id}`}
                                  className="ml-2 text-sm text-gray-700"
                                >
                                  Include in order
                                </label>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditMedicine(medicine)}
                                  className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                                >
                                  <PencilIcon className="mr-1 h-4 w-4" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteMedicine(medicine.id)}
                                  className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-red-700 shadow-sm hover:bg-red-50"
                                >
                                  <TrashIcon className="mr-1 h-4 w-4" />
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>

              {predictedMedicines.filter((m) => m.isRecommended).length > 0 && (
                <div className="border-t border-gray-200 bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-700">
                        Total Items:{' '}
                        {predictedMedicines
                          .filter((m) => m.isRecommended)
                          .reduce((sum, med) => sum + med.quantity, 0)}
                      </div>
                      <div className="text-sm font-medium text-gray-700">
                        Total Amount: $
                        {predictedMedicines
                          .filter((m) => m.isRecommended)
                          .reduce((sum, med) => sum + med.price * med.quantity, 0)
                          .toFixed(2)}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <Select
                          value={supplierData?.find((s) => s.id === selectedSupplier?.id)?.id}
                          onValueChange={(value) => {
                            const selected = supplierData?.find((s) => s.id === value)
                            if (selected) setSelectedSupplier(selected)
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select supplier" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Select Supplier</SelectLabel>
                              {supplierData?.map((supplier) => (
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
                        onClick={handleCreateOrderWithBlockchain}
                        disabled={isProcessingOrder}
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
              )}
            </div>
          )}

          {/* Transaction Status */}
          {transactionStatus.status !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-md p-4 ${
                transactionStatus.status === 'processing'
                  ? 'bg-yellow-50'
                  : transactionStatus.status === 'success'
                    ? 'bg-green-50'
                    : 'bg-red-50'
              }`}
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  {transactionStatus.status === 'processing' && (
                    <ClockIcon className="h-5 w-5 text-yellow-400" />
                  )}
                  {transactionStatus.status === 'success' && (
                    <CheckCircleIcon className="h-5 w-5 text-green-400" />
                  )}
                  {transactionStatus.status === 'error' && (
                    <XCircleIcon className="h-5 w-5 text-red-400" />
                  )}
                </div>
                <div className="ml-3">
                  <h3
                    className={`text-sm font-medium ${
                      transactionStatus.status === 'processing'
                        ? 'text-yellow-800'
                        : transactionStatus.status === 'success'
                          ? 'text-green-800'
                          : 'text-red-800'
                    }`}
                  >
                    Blockchain Transaction{' '}
                    {transactionStatus.status.charAt(0).toUpperCase() +
                      transactionStatus.status.slice(1)}
                  </h3>
                  <div
                    className={`mt-2 text-sm ${
                      transactionStatus.status === 'processing'
                        ? 'text-yellow-700'
                        : transactionStatus.status === 'success'
                          ? 'text-green-700'
                          : 'text-red-700'
                    }`}
                  >
                    <p>{transactionStatus.message}</p>
                    {transactionStatus.hash && (
                      <a
                        href={`https://polygonscan.com/tx/${transactionStatus.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                      >
                        <DocumentTextIcon className="mr-1 -ml-0.5 h-4 w-4" />
                        View on Polygon Explorer
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
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

export default PharmacyOrderSystem
