import {
  useCreateBulkProductsMutation,
  useCreateProductMutation,
  useGetProductsByVendorQuery,
  useMeQuery,
  useUpdateProductMutation,
} from '@/services/api'
import { Product, ProductFormValues } from '@/types'
import { PlusCircle } from 'lucide-react'
import React, { useState } from 'react'
import { SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'
import BulkProductFormModal from './BulkProductForm'
import ProductFormModal from './ProductForm'
import ProductTable from './ProductsTable'

const VendorProductsPage: React.FC = () => {
  const { data: userData } = useMeQuery()
  const vendorOrgId = userData?.body?.data?.vendorOrganizations?.[0]?.id ?? undefined

  const {
    data: productsData,
    isLoading,
    isError,
    refetch,
  } = useGetProductsByVendorQuery(vendorOrgId || '')
  const [createProduct] = useCreateProductMutation()
  const [createBulkProducts] = useCreateBulkProductsMutation()
  const [updateProduct] = useUpdateProductMutation()

  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const handleCreateProduct: SubmitHandler<ProductFormValues> = async (data) => {
    try {
      if (editingProduct) {
        await updateProduct({ id: editingProduct.id, data }).unwrap()
      } else {
        await createProduct(data).unwrap()
        toast('Product created successfully!')
      }
      setIsProductModalOpen(false)
      setEditingProduct(null)
      refetch()
    } catch (error) {
      toast.error('Failed to save product. Please try again.')
      console.error('Failed to save product:', error)
    }
  }

  const handleCreateBulkProducts = async (data: { products: ProductFormValues[] }) => {
    try {
      await createBulkProducts(data).unwrap()
      setIsBulkModalOpen(false)
      refetch()
    } catch (error) {
      console.error('Failed to save products:', error)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsProductModalOpen(true)
  }

  const products = productsData?.body.data || []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <div className="space-x-3">
          <button
            onClick={() => {
              setIsProductModalOpen(true)
              setEditingProduct(null)
            }}
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="my-12 flex justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : isError ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          Error loading products. Please try again later.
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-lg bg-gray-50 py-12 text-center">
          <p className="mb-4 text-gray-500">No products found. Add your first product.</p>
          <button
            onClick={() => setIsProductModalOpen(true)}
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </button>
        </div>
      ) : (
        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
          <ProductTable products={products} vendorOrgId={vendorOrgId || ''} onEdit={handleEdit} />
        </div>
      )}

      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSubmit={handleCreateProduct}
        defaultValues={
          editingProduct
            ? { ...editingProduct, price: Number(editingProduct.price) }
            : { vendorOrgId }
        }
        vendorOrgId={vendorOrgId}
        isEditing={!!editingProduct}
      />

      <BulkProductFormModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onSubmit={handleCreateBulkProducts}
        vendorOrgId={vendorOrgId || ''}
      />
    </div>
  )
}

export default VendorProductsPage
