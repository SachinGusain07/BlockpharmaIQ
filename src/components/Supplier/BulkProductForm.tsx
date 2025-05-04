import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { BulkProductFormValues } from '@/types'
import { bulkProductSchema } from '@/types/validations'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface BulkProductFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: SubmitHandler<BulkProductFormValues>
  vendorOrgId: string
}

const BulkProductFormModal: React.FC<BulkProductFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  vendorOrgId,
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BulkProductFormValues>({
    resolver: yupResolver(bulkProductSchema),
    defaultValues: {
      products: [{ name: '', brand: '', category: '', unit: '', price: 0, vendorOrgId }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products',
  })

  const handleFormSubmit: SubmitHandler<BulkProductFormValues> = async (data) => {
    setIsLoading(true)
    try {
      await onSubmit(data)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      reset({
        products: [{ name: '', brand: '', category: '', unit: '', price: 0, vendorOrgId }],
      })
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <DialogContent className="max-h-[90vh] sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Bulk Add Products</DialogTitle>
              <DialogDescription>Add multiple products at once to your inventory</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-2">
                {fields.map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3 rounded-lg border p-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Product #{index + 1}</h3>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                          disabled={isLoading}
                          className="text-destructive hover:text-destructive"
                        >
                          <FiTrash2 className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                      )}
                    </div>

                    <input
                      type="hidden"
                      {...register(`products.${index}.vendorOrgId`)}
                      value={vendorOrgId}
                    />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor={`name-${index}`}>Name*</Label>
                        <Input
                          id={`name-${index}`}
                          {...register(`products.${index}.name`)}
                          placeholder="Product name"
                          disabled={isLoading}
                          className={cn(errors.products?.[index]?.name && 'border-destructive')}
                        />
                        {errors.products?.[index]?.name && (
                          <p className="text-destructive mt-1 text-sm">
                            {errors.products[index]?.name?.message}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor={`brand-${index}`}>Brand*</Label>
                        <Input
                          id={`brand-${index}`}
                          {...register(`products.${index}.brand`)}
                          placeholder="Brand name"
                          disabled={isLoading}
                          className={cn(errors.products?.[index]?.brand && 'border-destructive')}
                        />
                        {errors.products?.[index]?.brand && (
                          <p className="text-destructive mt-1 text-sm">
                            {errors.products[index]?.brand?.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor={`description-${index}`}>Description</Label>
                      <Textarea
                        id={`description-${index}`}
                        {...register(`products.${index}.description`)}
                        placeholder="Product description"
                        disabled={isLoading}
                        className={cn(
                          errors.products?.[index]?.description && 'border-destructive'
                        )}
                      />
                      {errors.products?.[index]?.description && (
                        <p className="text-destructive mt-1 text-sm">
                          {errors.products[index]?.description?.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor={`category-${index}`}>Category*</Label>
                        <Input
                          id={`category-${index}`}
                          {...register(`products.${index}.category`)}
                          placeholder="Product category"
                          disabled={isLoading}
                          className={cn(errors.products?.[index]?.category && 'border-destructive')}
                        />
                        {errors.products?.[index]?.category && (
                          <p className="text-destructive mt-1 text-sm">
                            {errors.products[index]?.category?.message}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor={`unit-${index}`}>Unit*</Label>
                        <Input
                          id={`unit-${index}`}
                          {...register(`products.${index}.unit`)}
                          placeholder="e.g., kg, piece, bottle"
                          disabled={isLoading}
                          className={cn(errors.products?.[index]?.unit && 'border-destructive')}
                        />
                        {errors.products?.[index]?.unit && (
                          <p className="text-destructive mt-1 text-sm">
                            {errors.products[index]?.unit?.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor={`price-${index}`}>Price*</Label>
                        <Input
                          id={`price-${index}`}
                          type="number"
                          step="0.01"
                          {...register(`products.${index}.price`)}
                          placeholder="0.00"
                          disabled={isLoading}
                          className={cn(errors.products?.[index]?.price && 'border-destructive')}
                        />
                        {errors.products?.[index]?.price && (
                          <p className="text-destructive mt-1 text-sm">
                            {errors.products[index]?.price?.message}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor={`image-${index}`}>Image URL</Label>
                        <Input
                          id={`image-${index}`}
                          {...register(`products.${index}.image`)}
                          placeholder="https://example.com/image.jpg"
                          disabled={isLoading}
                          className={cn(errors.products?.[index]?.image && 'border-destructive')}
                        />
                        {errors.products?.[index]?.image && (
                          <p className="text-destructive mt-1 text-sm">
                            {errors.products[index]?.image?.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    append({
                      name: '',
                      brand: '',
                      category: '',
                      unit: '',
                      price: 0,
                      vendorOrgId,
                    })
                  }
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  <FiPlus className="mr-2 h-4 w-4" />
                  Add Another Product
                </Button>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving Products...' : 'Save All Products'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}

export default BulkProductFormModal
