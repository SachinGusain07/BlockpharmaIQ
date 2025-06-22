import { IOrder } from '@/types'
import {
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  TruckIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { useState } from 'react'

const rowVariants = {
  hidden: { opacity: 0, y: -10 },
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
    case 'IN_PROGRESS':
      return (
        <span className={`${baseClass} bg-blue-100 text-blue-800`}>
          <TruckIcon className="mr-1 h-3 w-3" />
          In Progress
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

export const OrderList = ({
  orders,
  isOrderDataLoading,
}: {
  orders: IOrder[]
  isOrderDataLoading: boolean
}) => {
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null)

  return (
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
            {isOrderDataLoading ? (
              <motion.tr
                key="loading"
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <td colSpan={6} className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                  </div>
                </td>
              </motion.tr>
            ) : orders.length > 0 ? (
              orders.map((order) => (
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.orderStatus)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.blockchainTxHash ? (
                      <a
                        href={`https://sepolia.etherscan.io/tx/${order.blockchainTxHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-xs text-blue-600 underline hover:text-blue-800"
                      >
                        <DocumentTextIcon className="mr-1 h-3 w-3" />
                        Verify on Etherscan
                      </a>
                    ) : (
                      <span className="text-xs text-gray-500">Not recorded</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-left text-sm font-medium whitespace-nowrap">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="rounded-lg px-2 py-1 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      View Details
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <motion.tr
                key="no-orders"
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="hover:bg-gray-50"
              >
                <td colSpan={6} className="px-6 py-4 text-center">
                  <div className="text-sm font-medium text-gray-600">No orders found</div>
                </td>
              </motion.tr>
            )}
          </tbody>
        </table>

        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <motion.div
              className="relative mx-4 max-h-[90vh] w-full max-w-3xl overflow-auto rounded-xl bg-white p-6 shadow-xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute top-4 right-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                <XCircleIcon className="h-5 w-5" />
              </button>

              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Order Details</h3>
                  <p className="text-sm text-gray-500">Order #{selectedOrder.id}</p>
                </div>
                <div className="flex gap-2">{getStatusBadge(selectedOrder.orderStatus)}</div>
              </div>

              <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="mb-2 text-sm font-medium text-gray-700">Pharmacy Information</div>
                <div className="flex items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    {selectedOrder?.pharmacyOutlet?.businessName.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <div className="font-medium text-gray-900">
                      {selectedOrder?.pharmacyOutlet?.businessName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {selectedOrder?.pharmacyOutlet?.street}, {selectedOrder?.pharmacyOutlet?.city}
                      , {selectedOrder?.pharmacyOutlet?.state} -{' '}
                      {selectedOrder?.pharmacyOutlet?.pincode}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="mb-2 text-sm font-medium text-gray-700">Order Items</h4>
                <div className="rounded-lg border border-gray-200">
                  <div className="overflow-hidden rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                          >
                            Product name
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-end text-xs font-medium tracking-wider text-gray-500 uppercase"
                          >
                            Quantity
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {selectedOrder.orderItems?.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium whitespace-nowrap text-gray-900">
                              {item.name}
                            </td>
                            <td className="px-4 py-3 text-end text-sm whitespace-nowrap text-gray-500">
                              {item.quantity.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <th
                            scope="row"
                            colSpan={1}
                            className="px-4 py-3 text-left text-sm font-medium text-gray-900"
                          >
                            Total Items:
                          </th>
                          <td className="px-4 py-3 text-end text-sm font-medium whitespace-nowrap text-gray-900">
                            {(selectedOrder?.orderItems ?? [])
                              .reduce((total, item) => total + item.quantity, 0)
                              .toLocaleString()}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>

              <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="mb-2 text-sm font-medium text-gray-700">Transaction Details</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <div className="text-sm text-gray-500">Blockchain Transaction Hash</div>
                    <a
                      href={`https://sepolia.etherscan.io/tx/${selectedOrder.blockchainTxHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {selectedOrder.blockchainTxHash}
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-none"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
