import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCartIcon,
  CheckCircleIcon,
  TruckIcon,
  ClockIcon,
  XCircleIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'

const Orders = () => {
  const orders = [
    {
      id: 'ORD-2023-001',
      date: '2023-10-15',
      supplier: 'MedSupply Co.',
      items: 8,
      amount: 245.75,
      status: 'delivered',
      deliveryDate: '2023-10-18',
    },
    {
      id: 'ORD-2023-002',
      date: '2023-10-20',
      supplier: 'PharmaDist Inc.',
      items: 5,
      amount: 187.5,
      status: 'shipped',
      deliveryDate: '2023-10-25',
    },
    {
      id: 'ORD-2023-003',
      date: '2023-10-22',
      supplier: 'Global Meds',
      items: 12,
      amount: 320.0,
      status: 'processing',
      deliveryDate: '2023-10-30',
    },
    {
      id: 'ORD-2023-004',
      date: '2023-10-05',
      supplier: 'HealthCare Suppliers',
      items: 6,
      amount: 210.25,
      status: 'cancelled',
      deliveryDate: 'N/A',
    },
  ]

  const getStatusBadge = (status: string) => {
    const baseClass = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium'

    switch (status) {
      case 'delivered':
        return (
          <span className={`${baseClass} bg-green-100 text-green-800`}>
            <CheckCircleIcon className="mr-1 h-3 w-3" />
            Delivered
          </span>
        )
      case 'shipped':
        return (
          <span className={`${baseClass} bg-blue-100 text-blue-800`}>
            <TruckIcon className="mr-1 h-3 w-3" />
            Shipped
          </span>
        )
      case 'processing':
        return (
          <span className={`${baseClass} bg-yellow-100 text-yellow-800`}>
            <ClockIcon className="mr-1 h-3 w-3" />
            Processing
          </span>
        )
      case 'cancelled':
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

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: 'backOut',
      },
    }),
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
      {/* Header */}
      <motion.div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Orders & Replenishment</h2>
          <p className="text-sm text-gray-500">Manage your pharmacy orders</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-white shadow-md hover:bg-indigo-700"
        >
          <ShoppingCartIcon className="mr-2 h-5 w-5" />
          New Order
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          {
            title: 'Total Orders',
            value: '24',
            border: 'border-green-500',
            bg: 'bg-green-50',
            text: 'text-green-800',
          },
          {
            title: 'This Month',
            value: '3',
            border: 'border-blue-500',
            bg: 'bg-blue-50',
            text: 'text-blue-800',
          },
          {
            title: 'Pending',
            value: '1',
            border: 'border-yellow-500',
            bg: 'bg-yellow-50',
            text: 'text-yellow-800',
          },
          {
            title: 'Total Spend',
            value: '$2,450',
            border: 'border-indigo-500',
            bg: 'bg-indigo-50',
            text: 'text-indigo-800',
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.title}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className={`rounded-xl border-l-4 ${stat.border} ${stat.bg} p-4 shadow-sm`}
          >
            <div className="text-sm font-medium text-gray-500">{stat.title}</div>
            <div className={`mt-1 text-2xl font-bold ${stat.text}`}>{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <AnimatePresence>
                {orders.map((order) => (
                  <motion.tr
                    key={order.id}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.id}</div>
                      <div className="text-xs font-medium text-gray-400">{order.date}</div>
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                      {order.supplier}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                      {order.items}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                      ${order.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                      {order.status !== 'cancelled' && (
                        <div className="mt-1 text-xs text-gray-500">
                          Est. delivery: {order.deliveryDate}
                        </div>
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
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Auto-Replenishment Settings */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
      >
        <h3 className="mb-6 text-lg font-medium text-gray-900">Auto-Replenishment Settings</h3>

        {/* Toggle Switch */}
        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
          <div>
            <h4 className="font-medium">Enable Automatic Reordering</h4>
            <p className="text-sm text-gray-500">
              System will automatically place orders when stock reaches threshold
            </p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input type="checkbox" className="peer sr-only" />
            <div className="peer h-6 w-11 rounded-full bg-gray-200 transition-colors peer-checked:bg-indigo-600 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
          </label>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Preferred Suppliers */}
          <div className="rounded-lg border border-gray-200 p-4">
            <h4 className="mb-3 font-medium">Preferred Suppliers</h4>
            <ul className="space-y-3">
              {['MedSupply Co.', 'PharmaDist Inc.', 'Global Meds'].map((supplier) => (
                <li key={supplier} className="flex items-center">
                  <input
                    id={`supplier-${supplier}`}
                    name="suppliers"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    defaultChecked={supplier !== 'Global Meds'}
                  />
                  <label htmlFor={`supplier-${supplier}`} className="ml-3 text-sm">
                    {supplier}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Order Thresholds */}
          <div className="rounded-lg border border-gray-200 p-4">
            <h4 className="mb-3 font-medium">Order Thresholds</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Default lead time (days)
                </label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  defaultValue="5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Minimum order value ($)
                </label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  defaultValue="100"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-white shadow-md hover:bg-indigo-700"
          >
            Save Settings
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

export default Orders
