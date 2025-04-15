import { ShoppingCart, Store, Truck, Users } from 'lucide-react'
import React from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card } from '../ui/card'
import Badge from './Badge'
import StatCard from './StatCard'
import Table from './Table'
interface OrderType {
  orderId: string
  orderDate: string
  orderStatus: string
  paymentStatus: string
  amount: number
}

const SuperAdminDashboard: React.FC = () => {
  const salesData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3490 },
  ]

  const recentOrders: OrderType[] = [
    {
      orderId: 'ORD-001',
      orderDate: '2025-04-10',
      orderStatus: 'Completed',
      paymentStatus: 'Paid',
      amount: 1245.5,
    },
    {
      orderId: 'ORD-002',
      orderDate: '2025-04-09',
      orderStatus: 'Shipped',
      paymentStatus: 'Paid',
      amount: 890.75,
    },
    {
      orderId: 'ORD-003',
      orderDate: '2025-04-08',
      orderStatus: 'Processing',
      paymentStatus: 'Pending',
      amount: 1650.0,
    },
    {
      orderId: 'ORD-004',
      orderDate: '2025-04-07',
      orderStatus: 'Delivered',
      paymentStatus: 'Paid',
      amount: 430.25,
    },
  ]

  const orderColumns = [
    { header: 'Order ID', accessor: 'orderId' as keyof OrderType },
    { header: 'Date', accessor: 'orderDate' as keyof OrderType },
    {
      header: 'Status',
      accessor: (order: OrderType) => {
        const statusVariant =
          order.orderStatus === 'Completed' || order.orderStatus === 'Delivered'
            ? 'success'
            : order.orderStatus === 'Shipped'
              ? 'info'
              : order.orderStatus === 'Processing'
                ? 'warning'
                : 'danger'

        return <Badge variant={statusVariant}>{order.orderStatus}</Badge>
      },
    },
    {
      header: 'Payment',

      accessor: (order: OrderType) => (
        <Badge variant={order.paymentStatus === 'Paid' ? 'success' : 'warning'}>
          {order.paymentStatus}
        </Badge>
      ),
    },
    {
      header: 'Amount',
      accessor: (order: OrderType) => `$${order.amount.toFixed(2)}`,
    },
  ]

  return (
    <>
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value="1,254"
          icon={<Users size={24} className="text-blue-600" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Pharmacies"
          value="45"
          icon={<Store size={24} className="text-purple-600" />}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Suppliers"
          value="32"
          icon={<Truck size={24} className="text-green-600" />}
          trend={{ value: 2, isPositive: false }}
        />
        <StatCard
          title="Orders"
          value="867"
          icon={<ShoppingCart size={24} className="text-orange-600" />}
          trend={{ value: 8, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="h-96">
          <h2 className="mb-4 ml-5 text-lg font-semibold">Sales Overview</h2>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h2 className="mb-4 ml-5 text-lg font-semibold">Recent Orders</h2>
          <Table
            columns={orderColumns}
            data={recentOrders}
            keyExtractor={(order) => order.orderId}
          />
        </Card>
      </div>
    </>
  )
}

export default SuperAdminDashboard
