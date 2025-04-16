import { Edit, Plus, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import SupplierForm from './SupplierForm'

import { Button } from '../ui/button'
import { Card } from '../ui/card'
import Modal from '../ui/Modal'
import Badge from './Badge'
import Table from './Table'

interface Supplier {
  orgId: number
  businessName: string
  email: string
  phoneNumber: string
  city: string
  state: string
  isActive: boolean
}

const Suppliers: React.FC = () => {
  // Sample supplier data
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      orgId: 1,
      businessName: 'MediSupply Co.',
      email: 'info@medisupply.com',
      phoneNumber: '+1234567890',
      city: 'Boston',
      state: 'MA',
      isActive: true,
    },
    {
      orgId: 2,
      businessName: 'PharmaDist Inc.',
      email: 'sales@pharmadist.com',
      phoneNumber: '+1987654321',
      city: 'Dallas',
      state: 'TX',
      isActive: true,
    },
    {
      orgId: 3,
      businessName: 'Global Pharmaceuticals',
      email: 'contact@globalpharma.com',
      phoneNumber: '+1122334455',
      city: 'San Francisco',
      state: 'CA',
      isActive: false,
    },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentSupplier, setCurrentSupplier] = useState<Partial<Supplier> | null>(null)
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false)
  const [supplierToDelete, setSupplierToDelete] = useState<number | null>(null)

  const handleAddSupplier = () => {
    setCurrentSupplier(null)
    setIsModalOpen(true)
  }

  const handleEditSupplier = (supplier: Supplier) => {
    setCurrentSupplier(supplier)
    setIsModalOpen(true)
  }

  const handleDeleteSupplier = (orgId: number) => {
    setSupplierToDelete(orgId)
    setIsConfirmDeleteModalOpen(true)
  }

  const confirmDeleteSupplier = () => {
    if (supplierToDelete) {
      setSuppliers(
        suppliers.map((supplier) =>
          supplier.orgId === supplierToDelete ? { ...supplier, isActive: false } : supplier
        )
      )
      setIsConfirmDeleteModalOpen(false)
      setSupplierToDelete(null)
    }
  }

  const handleSubmitSupplier = (supplierData: Partial<Supplier>) => {
    if (supplierData.orgId) {
      // Update existing supplier
      setSuppliers(
        suppliers.map((supplier) =>
          supplier.orgId === supplierData.orgId ? { ...supplier, ...supplierData } : supplier
        )
      )
    } else {
      // Create new supplier
      const newSupplier: Supplier = {
        orgId: Math.max(0, ...suppliers.map((s) => s.orgId)) + 1,
        businessName: supplierData.businessName || '',
        email: supplierData.email || '',
        phoneNumber: supplierData.phoneNumber || '',
        city: supplierData.city || '',
        state: supplierData.state || '',
        isActive: supplierData.isActive || true,
      }
      setSuppliers([...suppliers, newSupplier])
    }
    setIsModalOpen(false)
  }

  const columns = [
    { header: 'Business Name', accessor: 'businessName' as keyof Supplier },
    { header: 'Email', accessor: 'email' as keyof Supplier },
    { header: 'Phone', accessor: 'phoneNumber' as keyof Supplier },
    { header: 'Location', accessor: (supplier: Supplier) => `${supplier.city}, ${supplier.state}` },
    {
      header: 'Status',
      accessor: (supplier: Supplier) => (
        <Badge variant={supplier.isActive ? 'success' : 'danger'}>
          {supplier.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      accessor: (supplier: Supplier) => (
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
            onClick={() => handleDeleteSupplier(supplier.orgId)}
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

        <Table
          columns={columns}
          data={suppliers}
          keyExtractor={(supplier) => supplier.orgId.toString()}
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentSupplier ? 'Edit Supplier' : 'Add New Supplier'}
      >
        <SupplierForm
          initialData={currentSupplier || {}}
          onSubmit={handleSubmitSupplier}
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
          <p>Are you sure you want to deactivate this supplier? You can reactivate it later.</p>
        </div>
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={() => setIsConfirmDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={confirmDeleteSupplier}>
            Deactivate
          </Button>
        </div>
      </Modal>
    </>
  )
}

export default Suppliers
