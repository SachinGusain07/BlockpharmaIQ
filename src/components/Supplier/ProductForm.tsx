import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { ProductFormValues } from '@/types'
import { productSchema } from '@/types/validations'
import { yupResolver } from '@hookform/resolvers/yup'
import { AnimatePresence } from 'framer-motion'
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

interface ProductFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: SubmitHandler<ProductFormValues>
  defaultValues?: Partial<ProductFormValues>
  vendorOrgId?: string
  isEditing?: boolean
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultValues,
  vendorOrgId,
  isEditing = false,
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormValues>({
    resolver: yupResolver(productSchema),
    defaultValues,
  })

  const handleFormSubmit: SubmitHandler<ProductFormValues> = async (data) => {
    setIsLoading(true)
    try {
      await onSubmit(data)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      reset()
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
              <DialogDescription>
                {isEditing ? 'Update your product details' : 'Add a new product to your inventory'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
              {vendorOrgId && (
                <input type="hidden" {...register('vendorOrgId')} value={vendorOrgId} />
              )}

              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name*</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Product name"
                  defaultValue={defaultValues?.name}
                  disabled={isLoading}
                  className={cn(errors.name && 'border-destructive')}
                />
                {errors.name && (
                  <p className="text-destructive mt-1 text-sm">{errors.name.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Product description"
                  defaultValue={defaultValues?.description}
                  disabled={isLoading}
                  className={cn(errors.description && 'border-destructive')}
                />
                {errors.description && (
                  <p className="text-destructive mt-1 text-sm">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="brand">Brand*</Label>
                  <Input
                    id="brand"
                    {...register('brand')}
                    placeholder="Brand name"
                    defaultValue={defaultValues?.brand}
                    disabled={isLoading}
                    className={cn(errors.brand && 'border-destructive')}
                  />
                  {errors.brand && (
                    <p className="text-destructive mt-1 text-sm">{errors.brand.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="category">Category*</Label>
                  <Input
                    id="category"
                    {...register('category')}
                    placeholder="Product category"
                    defaultValue={defaultValues?.category}
                    disabled={isLoading}
                    className={cn(errors.category && 'border-destructive')}
                  />
                  {errors.category && (
                    <p className="text-destructive mt-1 text-sm">{errors.category.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="unit">Unit*</Label>
                  <Input
                    id="unit"
                    {...register('unit')}
                    placeholder="e.g., kg, piece, bottle"
                    defaultValue={defaultValues?.unit}
                    disabled={isLoading}
                    className={cn(errors.unit && 'border-destructive')}
                  />
                  {errors.unit && (
                    <p className="text-destructive mt-1 text-sm">{errors.unit.message}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  {...register('image')}
                  placeholder="https://example.com/image.jpg"
                  defaultValue={defaultValues?.image}
                  disabled={isLoading}
                  className={cn(errors.image && 'border-destructive')}
                />
                {errors.image && (
                  <p className="text-destructive mt-1 text-sm">{errors.image.message}</p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : isEditing ? 'Update Product' : 'Save Product'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}

export default ProductFormModal
