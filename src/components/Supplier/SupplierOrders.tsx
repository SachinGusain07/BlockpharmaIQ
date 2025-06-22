/* eslint-disable @typescript-eslint/no-explicit-any */
import web3Service from '@/Contract/SupplyChainService'
import {
  useCreateInventoryMutation,
  useCreateBulkProductsMutation,
  useGetSupplierOrdersQuery,
  useMeQuery,
  useUpdateOrderMutation,
} from '@/services/api'
import { OrderItem, Pharmacy, Vendor } from '@/types'
import { getStatusBadge, getStatusIcon, statusToNumber } from '@/utils/dashboardFunctions'
import { motion } from 'framer-motion'
import { SearchIcon, XIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

type OrderStatus = 'PENDING' | 'IN_PROGRESS' | 'DELIVERED' | 'CANCELLED'

interface Order {
  id: string
  orderNumber: string
  orderDate: string
  orderStatus: OrderStatus
  paymentStatus: string
  paymentMethod: string
  amount: number
  blockchainOrderId: string
  blockchainTxHash: string
  pharmacyOutlet: Pharmacy
  vendorOrg: Vendor
  orderItems: OrderItem[]
}

interface InventoryItem {
  id: string
  pharmacyOutletId: string
  medicineName: string
  medicineBrand: string
  category: string
  stock: number
  unit: string
  threshold: number
  expiry: string
  productId: string
  image: string
}

interface BulkProductItem {
  name: string
  brand: string
  category: string
  unit: string
  image: string
  vendorOrgId: string
}

const SupplierOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  const { data: userData } = useMeQuery()
  const { data: supplierOrdersData, refetch } = useGetSupplierOrdersQuery(
    userData?.body?.data?.id || ''
  )
  const [updateOrder] = useUpdateOrderMutation()
  const [createInventory] = useCreateInventoryMutation()
  const [createBulkProducts] = useCreateBulkProductsMutation()

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
        blockchainOrderId: order.blockchainOrderId,
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

  // Helper function to create products in bulk before adding to inventory
  const createProductsFromOrderItems = async (order: Order) => {
    try {
      // Prepare bulk products data from order items
      const bulkProductsData: BulkProductItem[] = order.orderItems.map((item) => ({
        name: item.name,
        brand: item.brand || 'Generic',
        category: item.category || 'Medicine',
        unit: item.unit || 'tablets',
        image: item.image || 'https://cdn-icons-png.flaticon.com/512/2937/2937192.png',
        vendorOrgId: order.vendorOrg.id,
      }))

      // Create products in bulk
      const productsResponse = await createBulkProducts(bulkProductsData).unwrap()

      if (productsResponse?.body?.data) {
        toast.success(`${bulkProductsData.length} products created successfully`)
        return productsResponse.body.data
      } else {
        throw new Error('Failed to create products')
      }
    } catch (error) {
      console.error('Failed to create products:', error)
      toast.error('Failed to create products')
      throw error
    }
  }

  // Helper function to add items to pharmacy inventory
  const addItemsToInventory = async (order: Order, createdProducts?: any[]) => {
    try {
      const inventoryPromises = order.orderItems.map(async (item, index) => {
        const productId = createdProducts?.[index]?.id || item.productId || item.id

        const newInventoryItem: InventoryItem = {
          id: `inv-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
          pharmacyOutletId: order.pharmacyOutlet.id,
          medicineName: item.name,
          medicineBrand: item.brand || 'Generic',
          category: item.category || 'Medicine',
          stock: item.quantity,
          unit: item.unit || 'tablets',
          threshold: Math.floor(item.quantity * 0.1) || 10,
          expiry: item.expiry || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          productId: productId,
          image: item.image || 'https://cdn-icons-png.flaticon.com/512/2937/2937192.png',
        }

        return await createInventory(newInventoryItem).unwrap()
      })

      await Promise.all(inventoryPromises)
      toast.success(`${order.orderItems.length} items added to pharmacy inventory`)
    } catch (error) {
      console.error('Failed to add items to inventory:', error)
      toast.error('Some items could not be added to inventory')
      throw error
    }
  }

  // Update order status
  const updateOrderStatus = async (
    orderId: string,
    blockchainOrderId: string,
    newStatus: OrderStatus
  ) => {
    setIsProcessing(true)
    try {
      const statusNumber = statusToNumber(newStatus)
      const currentOrder = orders.find((order) => order.id === orderId)

      if (!currentOrder) {
        throw new Error('Order not found')
      }

      // Update blockchain first
      const receipt = await web3Service.updateOrderStatus(Number(blockchainOrderId), statusNumber)

      // Update order in database
      const response = await updateOrder({
        id: orderId,
        orderStatus: newStatus,
        blockchainTxHash:
          receipt.hash || '0x8f15cac06362f23711c5e17755c00afaddf4ad26dce3216ae0296f13a154c2555',
      }).unwrap()

      let createdProducts = null

      // If status is DELIVERED, create products first then add items to pharmacy inventory
      if (newStatus === 'DELIVERED') {
        try {
          // First create products in bulk
          createdProducts = await createProductsFromOrderItems(currentOrder)

          // Then add items to inventory
          await addItemsToInventory(currentOrder, createdProducts)
        } catch (error) {
          // If product creation fails, still try to add to inventory with existing product IDs
          console.warn('Product creation failed, proceeding with existing product IDs:', error)
          await addItemsToInventory(currentOrder)
        }
      }

      if (response) {
        toast.success(`Order status updated to ${newStatus}`)
        refetch()
        setSelectedOrder(null)
      }

      // Update local state
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
                      {selectedOrder.orderItems.map((item) => (
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
                          {selectedOrder.orderItems
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

            <div className="mb-6">
              <div className="mb-2 text-sm font-medium text-gray-700">Update Order Status</div>
              <div className="mb-2">
                <select
                  className="block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none"
                  value={selectedOrder.orderStatus}
                  onChange={(e) =>
                    updateOrderStatus(
                      selectedOrder.id,
                      selectedOrder.blockchainOrderId,
                      e.target.value as OrderStatus
                    )
                  }
                  disabled={isProcessing}
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              {selectedOrder.orderStatus !== 'DELIVERED' && (
                <div className="text-xs text-gray-500">
                  💡 Setting status to "Delivered" will automatically add all order items to the
                  pharmacy's inventory
                </div>
              )}
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
