/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetSupplierOrdersQuery, useMeQuery } from '@/services/api'
import { OrderItem, Pharmacy, Vendor } from '@/types'
import { getStatusBadge } from '@/utils/dashboardFunctions'
import { motion } from 'framer-motion'

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

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function Dashboard() {
  const { data: userData, isLoading: isUserLoading, error: userError } = useMeQuery()
  const supplierId = userData?.body?.data?.id || ''

  const {
    data: supplierOrdersData,
    isLoading: isOrdersLoading,
    error: ordersError,
  } = useGetSupplierOrdersQuery(supplierId, {
    skip: !supplierId,
  })

  // Format orders
  const orders: Order[] = supplierOrdersData?.body?.data
    ? supplierOrdersData.body.data.map((order: any) => ({
        id: order.id,
        orderNumber: `ORD-${new Date(order.orderDate).toISOString().split('T')[0]}-${order.id.slice(0, 8)}`,
        orderDate: order.orderDate,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        amount: order.amount,
        blockchainTxHash: order.blockchainTxHash,
        blockchainOrderId: order.blockchainOrderId.toString(), // Ensure string
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
    : []

  // Calculate dashboard card metrics
  const totalOrders = orders.length
  const pendingOrders = orders.filter((order) => order.orderStatus === 'PENDING').length

  // Sort orders by date (descending) and take the 5 most recent
  const recentOrders = orders
    .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
    .slice(0, 5)

  // Handle loading and error states
  if (isUserLoading || isOrdersLoading) {
    return <div className="p-4 text-center">Loading...</div>
  }

  if (userError || ordersError) {
    return <div className="p-4 text-center text-red-500">Error loading data. Please try again.</div>
  }

  return (
    <div className="flex">
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-hidden p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
              {[
                {
                  title: 'Total Orders',
                  value: totalOrders.toLocaleString(),
                  up: true,
                },
                {
                  title: 'Pending Orders',
                  value: pendingOrders.toLocaleString(),
                  up: false,
                },
              ].map((card, index) => (
                <motion.div
                  key={card.title}
                  className="rounded-lg bg-white p-4 shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
                  <div className="mt-2 flex items-center">
                    <span className="text-2xl font-bold">{card.value}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-1">
              <motion.div
                className="rounded-lg bg-white shadow lg:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <div className="flex items-center justify-between border-b border-gray-200 p-4">
                  <h2 className="text-lg font-medium">Recent Orders</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Order ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Pharmacy
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {recentOrders.length > 0 ? (
                        recentOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-blue-600">{order.orderNumber}</td>
                            <td className="px-4 py-3 text-sm">
                              {order.pharmacyOutlet.businessName}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span
                                className={`rounded-full px-2 py-1 text-xs ${getStatusBadge(
                                  order.orderStatus
                                )}`}
                              >
                                {order.orderStatus}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {formatDate(order.orderDate)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-4 py-3 text-center text-sm text-gray-500">
                            No recent orders found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
