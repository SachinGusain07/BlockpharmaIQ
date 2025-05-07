import inventoryData from '@/utils/inventoryData'
import { EyeIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import AddMedicineModal from './AddMedicineModal'

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')

  const filteredItems = inventoryData.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      filter === 'all' ||
      (filter === 'low' && item.stock < item.threshold) ||
      (filter === 'expiring' &&
        new Date(item.expiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
    return matchesSearch && matchesFilter
  })

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
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
    console.log("Form submitted");
    handleClose();
  };

  return (
    <div className="space-y-4">

<div className='w-full flex justify-end mb-4'>
<button
        onClick={handleOpen}
        className="bg-gradient-to-r from-gray-800 to-gray-600 hover:scale-105 text-white px-4 py-2 hover:cursor-pointer rounded-full shadow-lg hover:shadow-xl transition duration-300 font-semibold text-lg"
      >
        ➕ Add Medicine
      </button>
      <AddMedicineModal
        isOpen={isOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
</div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          {
            title: 'Total Items',
            value: inventoryData.length,
            color: 'text-gray-800',
          },
          {
            title: 'Low Stock',
            value: inventoryData.filter((item) => item.stock < item.threshold).length,
            color: 'text-red-500',
          },
          {
            title: 'Expiring',
            value: inventoryData.filter(
              (item) => new Date(item.expiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            ).length,
            color: 'text-yellow-500',
          },
          {
            title: 'Total Value',
            value: `$${inventoryData.reduce((sum, item) => sum + item.price * item.stock, 0).toFixed(2)}`,
            color: 'text-gray-800',
          },
        ].map((stat, i) => (
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

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl bg-white p-4 shadow-sm"
      >
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
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

            </select>

            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronDownIcon className="h-4 w-4 text-gray-400 transition-transform duration-200 group-hover:rotate-180" />
            </div>
            
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Medicine</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Category</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Stock</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Price</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Expiry</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <AnimatePresence>
                {filteredItems.map((item) => (
                  <motion.tr
                    key={item.id}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className={item.stock < item.threshold ? 'bg-red-50' : ''}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-full bg-gray-100">
                          <img
                            className="h-full w-full object-cover"
                            src={item.image}
                            alt={item.name}
                          />
                        </div>
                        <div className="ml-3">
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.brand}</div>
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
                      {item.stock < item.threshold && (
                        <div className="text-xs font-medium text-red-500">Reorder needed</div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium whitespace-nowrap text-gray-900">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div
                        className={`text-xs font-medium ${
                          new Date(item.expiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                            ? 'text-red-500'
                            : 'text-gray-500'
                        }`}
                      >
                        {new Date(item.expiry).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

export default Inventory
