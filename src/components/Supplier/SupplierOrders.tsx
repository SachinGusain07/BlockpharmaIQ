/* eslint-disable @typescript-eslint/no-explicit-any */
import web3Service from '@/Contract/SupplyChainService'
import { useGetSupplierOrdersQuery, useMeQuery, useUpdateOrderMutation } from '@/services/api'
import { motion } from 'framer-motion'
import { CheckIcon, ClockIcon, FilterIcon, SearchIcon, XIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

type OrderStatus = 'PENDING' | 'IN_PROGRESS' | 'DELIVERED' | 'CANCELLED'

interface OrderItem {
  id: string
  productId: string
  quantity: number
  price: number
  createdAt: string
  updatedAt: string
}

interface Pharmacy {
  id: string
  businessName: string
  street: string
  city: string
  state: string
  pincode: string
}

interface Vendor {
  id: string
  businessName: string
  street: string
  city: string
  state: string
  pincode: string
}

interface Order {
  id: string
  orderNumber: string
  orderDate: string
  orderStatus: OrderStatus
  paymentStatus: string
  paymentMethod: string
  amount: number
  blockchainTxHash: string
  pharmacyOutlet: Pharmacy
  vendorOrg: Vendor
  orderItems: OrderItem[]
}

// Get status badge styling
const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case 'PENDING':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'IN_PROGRESS':
      return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'DELIVERED':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'CANCELLED':
      return 'bg-red-50 text-red-700 border-red-200'
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200'
  }
}

// Get status icon
const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case 'PENDING':
      return ClockIcon
    case 'IN_PROGRESS':
      return FilterIcon
    case 'DELIVERED':
      return CheckIcon
    case 'CANCELLED':
      return XIcon
    default:
      return ClockIcon
  }
}

const SupplierOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  const { data: userData } = useMeQuery()
  const { data: supplierOrdersData } = useGetSupplierOrdersQuery(userData?.body?.data?.id || '')
  const [updateOrder] = useUpdateOrderMutation()

  useEffect(() => {
    if (supplierOrdersData?.body?.data) {
      const formattedOrders = supplierOrdersData.body.data.map((order: any) => ({
        id: order.id,
        orderNumber: `ORD-${new Date(order.orderDate).toISOString().split('T')[0]}-${order.id.slice(0, 8)}`,
        orderDate: order.orderDate,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        amount: order.amount,
        blockchainTxHash: order.blockchainTxHash,
        pharmacyOutlet: {
          id: order.pharmacyOutlet.id,
          businessName: order.pharmacyOutlet.businessName,
          street: order.pharmacyOutlet.street,
          city: order.pharmacyOutlet.city,
          state: order.pharmacyOutlet.state,
          pincode: order.pharmacyOutlet.pincode,
        },
        vendorOrg: {
          id: order.vendorOrg.id,
          businessName: order.vendorOrg.businessName,
          street: order.vendorOrg.street,
          city: order.vendorOrg.city,
          state: order.vendorOrg.state,
          pincode: order.vendorOrg.pincode,
        },
        orderItems: order.orderItems,
      }))
      setOrders(formattedOrders)
      setFilteredOrders(formattedOrders)
    }
  }, [supplierOrdersData])

  // Filter orders based on search term and status
  useEffect(() => {
    let result = orders

    if (searchTerm) {
      result = result.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.pharmacyOutlet.businessName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      result = result.filter((order) => order.orderStatus === statusFilter)
    }

    setFilteredOrders(result)
  }, [searchTerm, statusFilter, orders])

  // Update order status
  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setIsProcessing(true)
    try {
      // TODO: Implement the logic to update the order status in the blockchain
      // web3Service.updateOrderStatus(orderId, newStatus)

      const response = await updateOrder({ id: orderId, orderStatus: newStatus }).unwrap()
      if (response) {
        toast.success('Order status updated successfully')
      }

      setOrders(
        orders.map((order) => (order.id === orderId ? { ...order, orderStatus: newStatus } : order))
      )
      setSelectedOrder((prev) =>
        prev && prev.id === orderId ? { ...prev, orderStatus: newStatus } : prev
      )
    } catch (error) {
      console.error('Failed to update order status:', error)
      toast.error('Failed to update order status')
    } finally {
      setIsProcessing(false)
    }
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
          <p className="text-sm text-gray-500">Manage pharmacy orders and update their status</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
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

          <select
            className="block rounded-lg border border-gray-200 bg-white/50 py-2 pr-10 pl-3 text-sm text-gray-900 backdrop-blur-sm focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
          >
            <option value="all">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

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
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  Transaction Hash
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
                          <div className="text-xs text-gray-500">
                            {order.orderItems.length} items
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                          {order.pharmacyOutlet.businessName.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <div className="font-medium text-gray-900">
                            {order.pharmacyOutlet.businessName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.pharmacyOutlet.city}, {order.pharmacyOutlet.state}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                      {formatDate(order.orderDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(order.orderStatus)}`}
                      >
                        {React.createElement(getStatusIcon(order.orderStatus), {
                          className: 'mr-1 h-3 w-3',
                        })}
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                      ₹{order.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                      <a
                        href={`https://sepolia.etherscan.io/tx/${order.blockchainTxHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                        title={order.blockchainTxHash}
                      >
                        {order.blockchainTxHash.slice(0, 6)}...{order.blockchainTxHash.slice(-4)}
                      </a>
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
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No orders found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(selectedOrder.orderStatus)}`}
                >
                  {React.createElement(getStatusIcon(selectedOrder.orderStatus), {
                    className: 'mr-1 h-3 w-3',
                  })}
                  {selectedOrder.orderStatus}
                </span>
              </div>
            </div>

            <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="mb-2 text-sm font-medium text-gray-700">Pharmacy Information</div>
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  {selectedOrder.pharmacyOutlet.businessName.charAt(0)}
                </div>
                <div className="ml-3">
                  <div className="font-medium text-gray-900">
                    {selectedOrder.pharmacyOutlet.businessName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedOrder.pharmacyOutlet.street}, {selectedOrder.pharmacyOutlet.city},{' '}
                    {selectedOrder.pharmacyOutlet.state} - {selectedOrder.pharmacyOutlet.pincode}
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
                          Product ID
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase"
                        >
                          Quantity
                        </th>
                        <th
                          scope="col"
                          className="py3 px-4 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
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
                      {selectedOrder.orderItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium whitespace-nowrap text-gray-900">
                            {item.productId}
                          </td>
                          <td className="px-4 py-3 text-center text-sm whitespace-nowrap text-gray-500">
                            {item.quantity.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right text-sm whitespace-nowrap text-gray-500">
                            ₹{item.price.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right text-sm font-medium whitespace-nowrap text-gray-900">
                            ₹{(item.quantity * item.price).toFixed(2)}
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
                          ₹{selectedOrder.amount.toFixed(2)}
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
                <div>
                  <div className="text-sm text-gray-500">Payment Method</div>
                  <div className="font-medium text-gray-900">{selectedOrder.paymentMethod}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Payment Status</div>
                  <div className="font-medium text-gray-900">{selectedOrder.paymentStatus}</div>
                </div>
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

            <div className="mb-6">
              <div className="mb-2 text-sm font-medium text-gray-700">Update Order Status</div>
              <select
                className="block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none"
                value={selectedOrder.orderStatus}
                onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value as OrderStatus)}
                disabled={isProcessing}
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
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
  )
}

export default SupplierOrdersPage
