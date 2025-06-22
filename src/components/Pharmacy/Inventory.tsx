import { Button } from '@/components/ui/button'
import { useCreateInventoryMutation, useGetInventoryQuery, useMeQuery } from '@/services/api'
import { MagnifyingGlassIcon, PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import React, { useState } from 'react'
import { toast } from 'sonner'
import AddMedicineForm from './InventoryItemsForm'
import { useCreateProductMutation } from '@/services/api'

interface InventoryItem {
  id: string
  medicineName: string
  medicineBrand: string
  category: string
  stock: number
  unit: string
  threshold: number
  expiry: Date | string
  image: string
  orderId?: string
  productId?: string
  pharmacyOutletId?: string
}

interface MedicineFormData {
  name: string
  brand: string
  category: string
  quantity: number
  unit: string
  price: number
  threshold: number
  expiry: Date | string
  manufacturerId: string
}

const Inventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filter, setFilter] = useState<string>('all')
  const [isAddFormOpen, setIsAddFormOpen] = useState<boolean>(false)
  const { data } = useMeQuery()
  const pharmacyOutletId = data?.body.data?.pharmacyOutlets?.[0]?.id || ''
  const [createInventory] = useCreateInventoryMutation()
  const { data: InventoryData } = useGetInventoryQuery(
    { pharmacyOutletId },
    {
      refetchOnMountOrArgChange: true,
    }
  )
  const [createProduct] = useCreateProductMutation()

  const inventoryItems: InventoryItem[] = InventoryData?.body.data || []

  const formatDateForDisplay = (dateString: string): string => {
    try {
      const date = new Date(dateString)

      if (isNaN(date.getTime())) {
        console.warn('Invalid date provided:', dateString)
        return 'Invalid Date'
      }

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch (error) {
      console.error('Error formatting date for display:', error)
      return 'Invalid Date'
    }
  }

  const isExpiringSoon = (expiryDate: string): boolean => {
    try {
      const expiry = new Date(expiryDate)
      const thirtyDaysFromNow = new Date()
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 20)

      return expiry <= thirtyDaysFromNow && expiry >= new Date()
    } catch (error) {
      console.error('Error checking expiry date:', error)
      return false
    }
  }

  const isExpired = (expiryDate: string): boolean => {
    try {
      const expiry = new Date(expiryDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      return expiry < today
    } catch (error) {
      console.error('Error checking if expired:', error)
      return false
    }
  }

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch =
      item.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())

    let matchesFilter = false

    switch (filter) {
      case 'all':
        matchesFilter = true
        break
      case 'low':
        matchesFilter = item.stock < item.threshold
        break
      case 'expiring':
        matchesFilter = isExpiringSoon(
          typeof item.expiry === 'string' ? item.expiry : item.expiry.toISOString()
        )
        break
      case 'expired':
        matchesFilter = isExpired(
          typeof item.expiry === 'string' ? item.expiry : item.expiry.toISOString()
        )
        break
      default:
        matchesFilter = true
    }

    return matchesSearch && matchesFilter
  })

  const handleAddMedicine = async (data: MedicineFormData): Promise<void> => {
    try {
      const product = await createProduct({
        name: data.name,
        brand: data.brand,
        category: data.category,
        unit: data.unit || 'tablets',
        image: 'https://cdn-icons-png.flaticon.com/512/2937/2937192.png',
        vendorOrgId: '23c15328-fc20-4004-a3f7-4f836a7ecf7d',
      }).unwrap()

      const newItem: InventoryItem = {
        id: `med-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        pharmacyOutletId: pharmacyOutletId,
        medicineName: data.name,
        medicineBrand: data.brand,
        category: data.category,
        stock: data.quantity,
        unit: data.unit || 'tablets',
        threshold: data.threshold,
        expiry: data.expiry,
        productId: product.body.data.id,
        image: 'https://cdn-icons-png.flaticon.com/512/2937/2937192.png',
      }

      await createInventory(newItem).unwrap()
      toast.success(`${data.name} has been added to inventory.`)

      console.log('Medicine added:', newItem)
    } catch (error) {
      console.error('Error adding medicine:', error)
      toast.error('Failed to add medicine. Please try again.')
      throw error
    }
  }

  const handleEditItem = (item: InventoryItem): void => {
    console.log('Edit item:', item)
  }

  const handleDeleteItem = (item: InventoryItem): void => {
    console.log('Delete item:', item)
    toast.success(`${item.medicineName} has been removed from inventory.`)
  }

  const rowVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    exit: {
      opacity: 0,
      x: 50,
      transition: { duration: 0.2, ease: 'easeIn' },
    },
  }

  const statsVariants = {
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

  const stats = [
    {
      title: 'Total Items',
      value: inventoryItems.length,
      color: 'text-gray-800',
    },
    {
      title: 'Low Stock',
      value: inventoryItems.filter((item) => item.stock < item.threshold).length,
      color: 'text-red-500',
    },
    {
      title: 'Expiring Soon',
      value: inventoryItems.filter((item) =>
        isExpiringSoon(typeof item.expiry === 'string' ? item.expiry : item.expiry.toISOString())
      ).length,
      color: 'text-yellow-500',
    },
    {
      title: 'Expired',
      value: inventoryItems.filter((item) =>
        isExpired(typeof item.expiry === 'string' ? item.expiry : item.expiry.toISOString())
      ).length,
      color: 'text-red-600',
    },
  ]

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={statsVariants}
            className="rounded-xl bg-white p-4 shadow-sm"
          >
            <div className="text-sm font-medium text-gray-500">{stat.title}</div>
            <div className={`text-xl font-semibold ${stat.color}`}>{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Search, Filter, and Add Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl bg-white p-4 shadow-sm"
      >
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pr-3 pl-10 text-sm shadow-sm transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                placeholder="Search medicines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="group relative w-full max-w-xs">
              <select
                className="block w-full appearance-none rounded-lg border border-gray-200 bg-white py-2 pr-8 pl-3 text-sm shadow-sm transition-all duration-200 hover:border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Items</option>
                <option value="low">Low Stock</option>
                <option value="expiring">Expiring Soon</option>
                <option value="expired">Expired</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ChevronDownIcon className="h-4 w-4 text-gray-400 transition-transform duration-200 group-hover:rotate-180" />
              </div>
            </div>
          </div>

          {/* Add Medicine Button */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              onClick={() => setIsAddFormOpen(true)}
              className="bg-indigo-600 text-white shadow-sm hover:bg-indigo-700"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Medicine
            </Button>
          </motion.div>
        </div>

        {/* Table */}
        <motion.div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Medicine</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Category</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Stock</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Expiry</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <AnimatePresence>
                {filteredItems.map((item) => {
                  const expiryStr =
                    typeof item.expiry === 'string' ? item.expiry : item.expiry.toISOString()
                  const expired = isExpired(expiryStr)
                  const expiringSoon = isExpiringSoon(expiryStr)
                  const lowStock = item.stock < item.threshold

                  return (
                    <motion.tr
                      key={item.id}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className={`${
                        expired
                          ? 'bg-red-100'
                          : lowStock
                            ? 'bg-red-50'
                            : expiringSoon
                              ? 'bg-yellow-50'
                              : ''
                      }`}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-full bg-gray-100">
                            <img
                              className="h-full w-full object-cover"
                              src={item.image}
                              alt={item.medicineName}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = '/api/placeholder/40/40'
                              }}
                            />
                          </div>
                          <div className="ml-3">
                            <div className="font-medium text-gray-900">{item.medicineName}</div>
                            <div className="text-xs text-gray-500">{item.medicineBrand}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {item.stock} {item.unit}
                        </div>
                        {lowStock && (
                          <div className="text-xs font-medium text-red-500">Reorder needed</div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div
                          className={`text-xs font-medium ${
                            expired
                              ? 'text-red-600'
                              : expiringSoon
                                ? 'text-yellow-600'
                                : 'text-gray-500'
                          }`}
                        >
                          {formatDateForDisplay(
                            typeof item.expiry === 'string'
                              ? item.expiry
                              : item.expiry.toISOString()
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          {expired && (
                            <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                              Expired
                            </span>
                          )}
                          {!expired && expiringSoon && (
                            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                              Expiring Soon
                            </span>
                          )}
                          {lowStock && (
                            <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                              Low Stock
                            </span>
                          )}
                          {!expired && !expiringSoon && !lowStock && (
                            <span className="inline-flex w-fit items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                              Good
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEditItem(item)}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Edit medicine"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteItem(item)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete medicine"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </AnimatePresence>
            </tbody>
          </table>

          {filteredItems.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              <div className="text-lg font-medium">No medicines found</div>
              <div className="text-sm">Try adjusting your search or filter criteria</div>
            </div>
          )}

          <AddMedicineForm
            isOpen={isAddFormOpen}
            onClose={() => setIsAddFormOpen(false)}
            onSubmit={handleAddMedicine}
          />
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Inventory
