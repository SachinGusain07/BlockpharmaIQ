import { IOrder } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  TruckIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'

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

export const OrderList = ({ orders }: { orders: IOrder[] }) => {
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
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Blockchain
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <AnimatePresence>
              {orders.length > 0 ? (
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
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                      ${order.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.orderStatus)}
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
  )
}
