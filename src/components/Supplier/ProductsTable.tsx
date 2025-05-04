import { useDeleteProductMutation } from '@/services/api'
import { Product } from '@/types'
import React, { useState } from 'react'
import ConfirmModal from './ConfirmModal'
import { PencilLineIcon, Trash2Icon } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface ProductTableProps {
  products: Product[]
  vendorOrgId: string | null
  onEdit: (product: Product) => void
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit }) => {
  const [deleteProduct] = useDeleteProductMutation()
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

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
            {products.map((product) => (
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
                <TableCell className="max-w-[200px] text-gray-500">{product.description}</TableCell>
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
                      <Trash2Icon className="mr-2 h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
