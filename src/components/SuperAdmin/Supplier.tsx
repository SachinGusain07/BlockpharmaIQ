import {
  useCreateSupplierMutation,
  useDeleteSupplierMutation,
  useGetAllSuppliersQuery,
  useUpdateSupplierMutation,
} from '@/services/api'
import { ISupplier } from '@/types'
import { SupplierFormData } from '@/types/validations'
import { Edit, Plus, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import Modal from '../ui/Modal'
import Badge from './Badge'
import SupplierForm from './SupplierForm'
import Table from './Table'

const Suppliers: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentSupplier, setCurrentSupplier] = useState<Partial<ISupplier> | null>(null)
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false)
  const [supplierToDelete, setSupplierToDelete] = useState<string | null>(null)
  const [suppliers, setSuppliers] = useState<ISupplier[]>([])
  const [createSupplier] = useCreateSupplierMutation()
  const { data, isLoading } = useGetAllSuppliersQuery()
  const [updateSupplier] = useUpdateSupplierMutation()
  const [deleteSupplier] = useDeleteSupplierMutation()

  const handleAddSupplier = () => {
    setCurrentSupplier(null)
    setIsModalOpen(true)
  }

  const handleEditSupplier = (supplier: ISupplier) => {
    setCurrentSupplier(supplier)
    setIsModalOpen(true)
  }

  const handleDeleteSupplier = (supplierId: string) => {
    setSupplierToDelete(supplierId)
    setIsConfirmDeleteModalOpen(true)
  }

  const confirmDeleteSupplier = async () => {
    if (supplierToDelete) {
      try {
        await deleteSupplier({ supplierId: supplierToDelete }).unwrap()
        toast.success('Supplier deleted successfully!')
      } catch (error) {
        console.error('Error deleting supplier:', error)
        toast.error('Failed to deleting supplier. Please try again.')
      } finally {
        setIsConfirmDeleteModalOpen(false)
        setSupplierToDelete(null)
      }
    }
  }

  useEffect(() => {
    if (data?.body.data) {
      setSuppliers(data?.body.data)
    }
  }, [data, isLoading])

  const onSubmit = async (data: SupplierFormData): Promise<void> => {
    try {
      if (currentSupplier) {
        await updateSupplier({ data, id: currentSupplier.id as string }).unwrap()
        toast.success('Supplier updated successfully!')
        setIsModalOpen(false)
        return
      }
      await createSupplier(data).unwrap()
      toast.success('Supplier created successfully!')
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error creating supplier:', error)
      toast.error('Failed to create supplier. Please try again.')
    }
  }

  const columns = [
    { header: 'Business Name', accessor: 'businessName' as keyof ISupplier },
    { header: 'Email', accessor: 'email' as keyof ISupplier },
    { header: 'Phone', accessor: 'phoneNumber' as keyof ISupplier },
    {
      header: 'Location',
      accessor: (supplier: ISupplier) => `${supplier.city}, ${supplier.state}`,
    },
    {
      header: 'Status',
      accessor: (supplier: ISupplier) => (
        <Badge variant={supplier.isActive ? 'success' : 'danger'}>
          {supplier.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      accessor: (supplier: ISupplier) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditSupplier(supplier)}
            className="flex items-center"
          >
            <Edit size={16} />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDeleteSupplier(supplier.id)}
            className="flex items-center"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <Card>
        <div className="mb-6 flex items-center justify-between px-6">
          <h2 className="text-lg font-semibold">All Suppliers</h2>
          <Button variant="default" onClick={handleAddSupplier} className="flex items-center">
            <Plus size={16} className="mr-1" />
            Add Supplier
          </Button>
        </div>

        <Table columns={columns} data={suppliers} keyExtractor={(supplier) => supplier.id} />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentSupplier ? 'Edit Supplier' : 'Add New Supplier'}
      >
        <SupplierForm
          initialData={currentSupplier || {}}
          onSubmit={onSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isConfirmDeleteModalOpen}
        onClose={() => setIsConfirmDeleteModalOpen(false)}
        title="Confirm Delete"
        size="sm"
      >
        <div className="mb-6">
          <p>Are you sure you want to delete this supplier?</p>
        </div>
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={() => setIsConfirmDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={confirmDeleteSupplier}>
            Delete
          </Button>
        </div>
      </Modal>
    </>
  )
}

export default Suppliers
