import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  CheckIcon,
  XIcon,
  ClockIcon,
  TruckIcon,
  SearchIcon,
  FilterIcon,
  PackageIcon,
} from 'lucide-react'

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  total: number
}

// Pharmacy interface
interface Pharmacy {
  id: string
  name: string
  location: string
  logo?: string
}

// Order interface
interface Order {
  id: string
  orderNumber: string
  date: string
  status: OrderStatus
  pharmacy: Pharmacy
  items: OrderItem[]
  total: number
  priority: 'low' | 'medium' | 'high'
}

// Mock data
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2025-0001',
    date: '2025-04-05T10:30:00',
    status: 'pending',
    pharmacy: {
      id: 'ph1',
      name: 'MediCare Pharmacy',
      location: 'New York, NY',
      logo: '/medicare-logo.png',
    },
    items: [
      { id: 'i1', name: 'Amoxicillin 500mg', quantity: 200, price: 0.85, total: 170 },
      { id: 'i2', name: 'Lisinopril 10mg', quantity: 150, price: 0.65, total: 97.5 },
    ],
    total: 267.5,
    priority: 'high',
  },
  {
    id: '2',
    orderNumber: 'ORD-2025-0002',
    date: '2025-04-05T11:45:00',
    status: 'pending',
    pharmacy: {
      id: 'ph2',
      name: 'Wellness Pharma',
      location: 'Boston, MA',
      logo: '/wellness-logo.png',
    },
    items: [
      { id: 'i3', name: 'Metformin 850mg', quantity: 300, price: 0.45, total: 135 },
      { id: 'i4', name: 'Atorvastatin 20mg', quantity: 200, price: 0.75, total: 150 },
    ],
    total: 285,
    priority: 'medium',
  },
  {
    id: '3',
    orderNumber: 'ORD-2025-0003',
    date: '2025-04-05T14:20:00',
    status: 'processing',
    pharmacy: {
      id: 'ph3',
      name: 'HealthPlus Pharmacy',
      location: 'Chicago, IL',
      logo: '/healthplus-logo.png',
    },
    items: [
      { id: 'i5', name: 'Losartan 50mg', quantity: 250, price: 0.55, total: 137.5 },
      { id: 'i6', name: 'Escitalopram 10mg', quantity: 100, price: 0.95, total: 95 },
    ],
    total: 232.5,
    priority: 'low',
  },
  {
    id: '4',
    orderNumber: 'ORD-2025-0004',
    date: '2025-04-05T15:10:00',
    status: 'pending',
    pharmacy: {
      id: 'ph4',
      name: 'CityMed Pharmacy',
      location: 'Miami, FL',
      logo: '/citymed-logo.png',
    },
    items: [
      { id: 'i7', name: 'Metoprolol 25mg', quantity: 180, price: 0.6, total: 108 },
      { id: 'i8', name: 'Levothyroxine 50mcg', quantity: 120, price: 0.7, total: 84 },
    ],
    total: 192,
    priority: 'high',
  },
  {
    id: '5',
    orderNumber: 'ORD-2025-0005',
    date: '2025-04-04T09:15:00',
    status: 'shipped',
    pharmacy: {
      id: 'ph5',
      name: 'FamilyCare Pharmacy',
      location: 'Seattle, WA',
      logo: '/familycare-logo.png',
    },
    items: [
      { id: 'i9', name: 'Albuterol Inhaler', quantity: 50, price: 15.0, total: 750 },
      { id: 'i10', name: 'Prednisone 20mg', quantity: 100, price: 0.8, total: 80 },
    ],
    total: 830,
    priority: 'medium',
  },
]

// Get status badge styling
const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case 'pending':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'processing':
      return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'shipped':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200'
    case 'delivered':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'cancelled':
      return 'bg-red-50 text-red-700 border-red-200'
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200'
  }
}

// Get status icon
const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case 'pending':
      return ClockIcon
    case 'processing':
      return FilterIcon
    case 'shipped':
      return TruckIcon
    case 'delivered':
      return CheckIcon
    case 'cancelled':
      return XIcon
    default:
      return ClockIcon
  }
}

// Get priority badge styling
const getPriorityBadge = (priority: 'low' | 'medium' | 'high') => {
  switch (priority) {
    case 'low':
      return 'bg-gray-50 text-gray-600 border-gray-200'
    case 'medium':
      return 'bg-blue-50 text-blue-600 border-blue-200'
    case 'high':
      return 'bg-rose-50 text-rose-600 border-rose-200'
    default:
      return 'bg-gray-50 text-gray-600 border-gray-200'
  }
}

const SupplierOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  // Load orders on component mount
  useEffect(() => {
    // In a real app, this would fetch from an API
    setOrders(mockOrders)
    setFilteredOrders(mockOrders)
  }, [])

  // Filter orders based on search term and status
  useEffect(() => {
    let result = orders

    if (searchTerm) {
      result = result.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      result = result.filter((order) => order.status === statusFilter)
    }

    setFilteredOrders(result)
  }, [searchTerm, statusFilter, orders])

  // Process the order
  const processOrder = (orderId: string) => {
    setIsProcessing(true)

    // Simulate API call with timeout
    setTimeout(() => {
      setOrders(
        orders.map((order) => (order.id === orderId ? { ...order, status: 'processing' } : order))
      )
      setSelectedOrder(null)
      setIsProcessing(false)
    }, 1000)
  }

  // Format date string
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  return (
    <div className="h-full space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-sm text-gray-500">
            Manage pending and in-progress orders from pharmacies
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Search bar */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search orders..."
              className="block w-full rounded-lg border border-gray-200 bg-white/50 py-2 pr-4 pl-10 text-sm text-gray-900 backdrop-blur-sm focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status filter */}
          <select
            className="block rounded-lg border border-gray-200 bg-white/50 py-2 pr-10 pl-3 text-sm text-gray-900 backdrop-blur-sm focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders list */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  Order Info
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  Pharmacy
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  Total
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="font-medium text-gray-900">{order.orderNumber}</div>
                          <div className="text-xs text-gray-500">{order.items.length} items</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                          {order.pharmacy.name.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <div className="font-medium text-gray-900">{order.pharmacy.name}</div>
                          <div className="text-xs text-gray-500">{order.pharmacy.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                      {formatDate(order.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(order.status)}`}
                        >
                          {React.createElement(getStatusIcon(order.status), {
                            className: 'mr-1 h-3 w-3',
                          })}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        {order.priority === 'high' && (
                          <span className="ml-2 inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700">
                            Urgent
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
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
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No orders found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order detail modal */}
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
              <XIcon className="h-5 w-5" />
            </button>

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Order Details</h3>
                <p className="text-sm text-gray-500">Order #{selectedOrder.orderNumber}</p>
              </div>
              <div className="flex gap-2">
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(selectedOrder.status)}`}
                >
                  {React.createElement(getStatusIcon(selectedOrder.status), {
                    className: 'mr-1 h-3 w-3',
                  })}
                  {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                </span>

                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getPriorityBadge(selectedOrder.priority)}`}
                >
                  {selectedOrder.priority.charAt(0).toUpperCase() + selectedOrder.priority.slice(1)}{' '}
                  Priority
                </span>
              </div>
            </div>

            <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="mb-2 text-sm font-medium text-gray-700">Pharmacy Information</div>
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  {selectedOrder.pharmacy.name.charAt(0)}
                </div>
                <div className="ml-3">
                  <div className="font-medium text-gray-900">{selectedOrder.pharmacy.name}</div>
                  <div className="text-sm text-gray-500">{selectedOrder.pharmacy.location}</div>
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
                          Item
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase"
                        >
                          Quantity
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
                        >
                          Price
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
                        >
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium whitespace-nowrap text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-4 py-3 text-center text-sm whitespace-nowrap text-gray-500">
                            {item.quantity.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right text-sm whitespace-nowrap text-gray-500">
                            ${item.price.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right text-sm font-medium whitespace-nowrap text-gray-900">
                            ${item.total.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <th
                          scope="row"
                          colSpan={3}
                          className="px-4 py-3 text-right text-sm font-medium text-gray-900"
                        >
                          Total
                        </th>
                        <td className="px-4 py-3 text-right text-sm font-medium whitespace-nowrap text-gray-900">
                          ${selectedOrder.total.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
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

              {selectedOrder.status === 'pending' && (
                <button
                  onClick={() => processOrder(selectedOrder.id)}
                  disabled={isProcessing}
                  className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-none"
                >
                  {isProcessing ? (
                    <>
                      <svg
                        className="mr-2 h-4 w-4 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <PackageIcon className="mr-2 h-4 w-4" />
                      Process Order
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default SupplierOrdersPage
