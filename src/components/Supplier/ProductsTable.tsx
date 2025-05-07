import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useDeleteProductMutation } from '@/services/api'
import { Product } from '@/types'
import { PencilLineIcon, Trash2Icon } from 'lucide-react'
import React, { useState } from 'react'
import ConfirmModal from './ConfirmModal'

interface ProductTableProps {
  products: Product[]
  vendorOrgId: string | null
  onEdit: (product: Product) => void
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit }) => {
  const [deleteProduct] = useDeleteProductMutation()
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(products.length / itemsPerPage)

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return

    setIsDeleting(true)
    try {
      await deleteProduct(productToDelete).unwrap()
    } catch (error) {
      console.error('Failed to delete product:', error)
    } finally {
      setIsDeleting(false)
      setProductToDelete(null)
    }
  }

  const indexOfLastProduct = currentPage * itemsPerPage
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const pageNumbers: number[] = []
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  const renderPaginationItems = () => {
    if (totalPages <= 7) {
      return pageNumbers.map((number) => (
        <PaginationItem key={number}>
          <PaginationLink onClick={() => paginate(number)} isActive={currentPage === number}>
            {number}
          </PaginationLink>
        </PaginationItem>
      ))
    }

    const items = []

    items.push(
      <PaginationItem key={1}>
        <PaginationLink onClick={() => paginate(1)} isActive={currentPage === 1}>
          1
        </PaginationLink>
      </PaginationItem>
    )
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      )
    }

    const startPage = Math.max(2, currentPage - 1)
    const endPage = Math.min(totalPages - 1, currentPage + 1)

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink onClick={() => paginate(i)} isActive={currentPage === i}>
            {i}
          </PaginationLink>
        </PaginationItem>
      )
    }

    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      )
    }

    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => paginate(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      )
    }

    return items
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <TableRow key={product.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={product.image} alt={product.name} />
                        <AvatarFallback>
                          <img
                            src="https://cdn-icons-png.flaticon.com/512/2937/2937192.png"
                            alt={product.name}
                            className="h-full w-full"
                          />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{product.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] text-gray-500">
                    {product.description}
                  </TableCell>
                  <TableCell>
                    <div className="text-muted-foreground text-sm">{product.category}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(product)}
                        className="text-primary hover:text-primary"
                      >
                        <PencilLineIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setProductToDelete(product.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No products found on this page.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {products.length > itemsPerPage && (
        <div className="my-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                  className={
                    currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                  }
                />
              </PaginationItem>

              {renderPaginationItems()}

              <PaginationItem>
                <PaginationNext
                  onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                  className={
                    currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <ConfirmModal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmButtonText={isDeleting ? 'Deleting...' : 'Delete Product'}
        isLoading={isDeleting}
      />
    </>
  )
}

export default ProductTable
