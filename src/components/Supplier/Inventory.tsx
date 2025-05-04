/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from 'react'
import {
  useGetInventoryItemsQuery,
  useUpdateInventoryItemMutation,
  useDeleteInventoryItemMutation,
  useMeQuery,
} from '@/services/api'
import {
  ArrowUpIcon,
  ArrowDownIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'
import { InventoryItem, PaginationParams } from '@/types'

const InventoryTable: React.FC = () => {
  const [pagination, setPagination] = useState<PaginationParams>({ page: 1, limit: 10 })
  const [filter, setFilter] = useState<{ search: string }>({ search: '' })
  const [sortField, setSortField] = useState<string>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [editItem, setEditItem] = useState<string | null>(null)
  // const [pharmacyOutletId, setPharmacyOutletId] = useState<string>('')
  const pharmacyOutletId = useMeQuery().data?.body.data?.pharmacyOutlets[0]?.pharmacyOutletId || ''
  const [editValues, setEditValues] = useState<{ stock: number; threshold: number }>({
    stock: 0,
    threshold: 0,
  })

  const { data, isLoading, refetch } = useGetInventoryItemsQuery({
    pharmacyOutletId,
    pagination,
  })

  const [updateInventoryItem] = useUpdateInventoryItemMutation()
  const [deleteInventoryItem] = useDeleteInventoryItemMutation()

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ ...filter, search: e.target.value })
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handlePageChange = (newPage: number) => {
    setPagination({ ...pagination, page: newPage })
  }

  const handleEdit = (item: InventoryItem) => {
    setEditItem(item.id.toString())
    setEditValues({ stock: item.stock, threshold: item.threshold })
  }

  const handleSaveEdit = async (id: string) => {
    try {
      await updateInventoryItem({
        id,
        stock: editValues.stock,
        threshold: editValues.threshold,
      }).unwrap()
      setEditItem(null)
    } catch (error) {
      console.error('Failed to update item:', error)
    }
  }

  const handleCancelEdit = () => {
    setEditItem(null)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteInventoryItem(id).unwrap()
      } catch (error) {
        console.error('Failed to delete item:', error)
      }
    }
  }

  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValues({ ...editValues, stock: parseInt(e.target.value) || 0 })
  }

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValues({ ...editValues, threshold: parseInt(e.target.value) || 0 })
  }

  const filteredInventory = useMemo(() => {
    if (!data) return []

    let filtered = [...data]

    if (filter.search) {
      const searchLower = filter.search.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.product.name.toLowerCase().includes(searchLower) ||
          item.product.brand.toLowerCase().includes(searchLower) ||
          item.product.category.toLowerCase().includes(searchLower) ||
          item.batchNumber?.toLowerCase().includes(searchLower)
      )
    }

    return filtered.sort((a, b) => {
      let fieldA: any, fieldB: any

      switch (sortField) {
        case 'name':
          fieldA = a.product.name.toLowerCase()
          fieldB = b.product.name.toLowerCase()
          break
        case 'brand':
          fieldA = a.product.brand.toLowerCase()
          fieldB = b.product.brand.toLowerCase()
          break
        case 'category':
          fieldA = a.product.category.toLowerCase()
          fieldB = b.product.category.toLowerCase()
          break
        case 'stock':
          fieldA = a.stock
          fieldB = b.stock
          break
        case 'expiry':
          fieldA = new Date(a.expiry)
          fieldB = new Date(b.expiry)
          break
        default:
          fieldA = a.product.name.toLowerCase()
          fieldB = b.product.name.toLowerCase()
      }

      if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1
      if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [data, filter.search, sortField, sortDirection])

  const isLowStock = (item: InventoryItem) => item.stock <= item.threshold
  const isExpiringSoon = (item: InventoryItem) => {
    const expiryDate = new Date(item.expiry)
    const threeMonthsFromNow = new Date()
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)
    return expiryDate <= threeMonthsFromNow
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  const totalPages = Math.ceil((filteredInventory?.length || 0) / pagination.limit)
  const startIndex = (pagination.page - 1) * pagination.limit
  const paginatedInventory = filteredInventory.slice(startIndex, startIndex + pagination.limit)

  return (
    <div className="rounded-lg bg-white shadow">
      <div className="flex flex-col gap-4 border-b p-4 md:flex-row md:items-center md:justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Inventory Items</h3>

        <div className="flex items-center">
          <div className="relative flex-grow">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Search products..."
              value={filter.search}
              onChange={handleSearchChange}
            />
          </div>

          <button
            onClick={() => refetch()}
            className="ml-2 rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-indigo-600"
            title="Refresh data"
          >
            <ArrowPathIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Product Name
                  {sortField === 'name' &&
                    (sortDirection === 'asc' ? (
                      <ArrowUpIcon className="ml-1 h-4 w-4" />
                    ) : (
                      <ArrowDownIcon className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </th>
              <th
                scope="col"
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                onClick={() => handleSort('brand')}
              >
                <div className="flex items-center">
                  Brand
                  {sortField === 'brand' &&
                    (sortDirection === 'asc' ? (
                      <ArrowUpIcon className="ml-1 h-4 w-4" />
                    ) : (
                      <ArrowDownIcon className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </th>
              <th
                scope="col"
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center">
                  Category
                  {sortField === 'category' &&
                    (sortDirection === 'asc' ? (
                      <ArrowUpIcon className="ml-1 h-4 w-4" />
                    ) : (
                      <ArrowDownIcon className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </th>
              <th
                scope="col"
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                onClick={() => handleSort('stock')}
              >
                <div className="flex items-center">
                  Stock
                  {sortField === 'stock' &&
                    (sortDirection === 'asc' ? (
                      <ArrowUpIcon className="ml-1 h-4 w-4" />
                    ) : (
                      <ArrowDownIcon className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
              >
                Threshold
              </th>
              <th
                scope="col"
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                onClick={() => handleSort('expiry')}
              >
                <div className="flex items-center">
                  Expiry Date
                  {sortField === 'expiry' &&
                    (sortDirection === 'asc' ? (
                      <ArrowUpIcon className="ml-1 h-4 w-4" />
                    ) : (
                      <ArrowDownIcon className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
              >
                Batch Number
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
            {paginatedInventory.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                  No inventory items found.
                </td>
              </tr>
            ) : (
              paginatedInventory.map((item) => (
                <tr
                  key={item.id}
                  className={`${isLowStock(item) || isExpiringSoon(item) ? 'bg-red-50' : ''} hover:bg-gray-50`}
                >
                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                    <div className="flex items-center">
                      {item.product.name}
                      {isLowStock(item) && (
                        <ExclamationCircleIcon
                          className="ml-2 h-5 w-5 text-red-500"
                          title="Low stock"
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                    {item.product.brand}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                    {item.product.category}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                    {editItem === item.id.toString() ? (
                      <input
                        type="number"
                        value={editValues.stock}
                        onChange={handleStockChange}
                        className="w-20 rounded border border-gray-300 p-1"
                        min="0"
                      />
                    ) : (
                      <span className={isLowStock(item) ? 'font-medium text-red-600' : ''}>
                        {item.stock} {item.product.unit}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                    {editItem === item.id.toString() ? (
                      <input
                        type="number"
                        value={editValues.threshold}
                        onChange={handleThresholdChange}
                        className="w-20 rounded border border-gray-300 p-1"
                        min="1"
                      />
                    ) : (
                      item.threshold
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                    <span className={isExpiringSoon(item) ? 'font-medium text-red-600' : ''}>
                      {new Date(item.expiry).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                    {item.batchNumber || '—'}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                    {editItem === item.id.toString() ? (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleSaveEdit(item.id.toString())}
                          className="text-green-600 hover:text-green-900"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id.toString())}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
              disabled={pagination.page === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(Math.min(totalPages, pagination.page + 1))}
              disabled={pagination.page === totalPages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(startIndex + pagination.limit, filteredInventory.length)}
                </span>{' '}
                of <span className="font-medium">{filteredInventory.length}</span> results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <button
                  onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                  disabled={pagination.page === 1}
                  className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`relative inline-flex items-center border px-4 py-2 text-sm font-medium ${
                      pagination.page === index + 1
                        ? 'z-10 border-indigo-500 bg-indigo-50 text-indigo-600'
                        : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                    } `}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(Math.min(totalPages, pagination.page + 1))}
                  disabled={pagination.page === totalPages}
                  className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <span className="sr-only">Next</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InventoryTable
