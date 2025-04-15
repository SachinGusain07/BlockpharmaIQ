import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ShoppingCart, ExternalLink, Search, Filter, CheckCircle } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const OrderHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  const fetchOrdersFromBlockchain = async () => {
    try {
      setLoading(true)
      const mockOrders: Order[] = [
        {
          id: 'ORD-2025040601',
          pharmacyName: 'CityMed Pharmacy',
          date: '2025-04-05',
          quantity: 200,
          status: 'completed',
          transactionHash: '0x7d8fc3b4f6b3a2e1d9b5c8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6',
          amount: 5600,
          medication: 'Amoxicillin 500mg',
        },
        {
          id: 'ORD-2025040602',
          pharmacyName: 'HealthPlus',
          date: '2025-04-04',
          quantity: 150,
          status: 'completed',
          transactionHash: '0x3a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7d6e5f4c3b2a1d0',
          amount: 3750,
          medication: 'Lisinopril 10mg',
        },
        {
          id: 'ORD-2025040603',
          pharmacyName: 'MediLife',
          date: '2025-04-03',
          quantity: 300,
          status: 'transit',
          transactionHash: '0xe1d0c9b8a7d6e5f4c3b2a1d0c9b8a7d6e5f4c3b2a1d0c9b8a7d6e5f4c3b2a1d0',
          amount: 7500,
          medication: 'Metformin 850mg',
        },
        {
          id: 'ORD-2025040604',
          pharmacyName: 'WellCare Pharmacy',
          date: '2025-04-01',
          quantity: 100,
          status: 'completed',
          transactionHash: '0xc1b0a9f8e7d6c5b4a3f2e1d0c9b8a7d6e5f4c3b2a1d0c9b8a7d6e5f4c3b2a1d0',
          amount: 2800,
          medication: 'Atorvastatin 20mg',
        },
        {
          id: 'ORD-2025040605',
          pharmacyName: 'QuickCare Pharmacy',
          date: '2025-03-29',
          quantity: 75,
          status: 'failed',
          transactionHash: '0x5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7d6e5f4c3b2a1d0c9b8a7d6e5f4c',
          amount: 1950,
          medication: 'Levothyroxine 50mcg',
        },
      ]

      setTimeout(() => {
        setOrders(mockOrders)
        setLoading(false)
      }, 800) // Simulate network delay
    } catch (error) {
      console.error('Error fetching blockchain order data:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrdersFromBlockchain()
  }, [])

  const viewOnBlockchain = (hash: string) => {
    // Replace with your blockchain explorer URL
    window.open(`https://etherscan.io/tx/${hash}`, '_blank')
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.pharmacyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.transactionHash.toLowerCase().includes(searchTerm.toLowerCase())

    if (statusFilter) {
      return matchesSearch && order.status === statusFilter
    }

    return matchesSearch
  })

  const totalOrders = orders.length
  const completedOrders = orders.filter((order) => order.status === 'completed').length
  const processingOrders = orders.filter((order) => order.status === 'transit').length

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto max-w-7xl px-4 py-8"
    >
      <div className="mb-8 flex flex-col items-start justify-between md:flex-row md:items-center">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="flex items-center text-3xl font-bold">
            <ShoppingCart className="mr-2 h-8 w-8" />
            Order History
          </h1>
          <p className="mt-1 text-gray-500">View all your past orders and transaction details</p>
        </motion.div>

        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 md:mt-0"
        >
          <Button
            onClick={() => fetchOrdersFromBlockchain()}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Refresh Blockchain Data
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3"
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Completed Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Processing Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{processingOrders}</div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="overflow-hidden rounded-lg bg-white shadow-md"
      >
        <div className="flex flex-col items-start justify-between space-y-4 border-b p-4 md:flex-row md:items-center md:space-y-0">
          <div className="relative w-full md:w-64">
            <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search orders..."
              className="w-full py-2 pr-4 pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                {statusFilter ? `Status: ${statusFilter}` : 'Filter by Status'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter(null)}>All Orders</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('completed')}>
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('processing')}>
                Processing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('failed')}>Failed</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-neutral-100">
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Pharmacy</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Medication</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Transaction Hash</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <AnimatePresence>
                <TableBody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.pharmacyName}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{order.medication}</TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell>${order.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status === 'completed' && (
                              <CheckCircle className="mr-1 h-3 w-3" />
                            )}
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {`${order.transactionHash.substring(0, 6)}...${order.transactionHash.substring(order.transactionHash.length - 4)}`}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => viewOnBlockchain(order.transactionHash)}
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="py-8 text-center text-gray-500">
                        No orders found matching your criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </AnimatePresence>
            </Table>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default OrderHistoryPage
