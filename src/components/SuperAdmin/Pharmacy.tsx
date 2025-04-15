import { Edit, Plus, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import Modal from '../ui/Modal'
import Badge from './Badge'
import PharmacyForm from './PharmacyForm'
import Table from './Table'

interface Pharmacy {
  pharmacyOutletId: number
  businessName: string
  email: string
  phoneNumber: string
  city: string
  state: string
  isActive: boolean
}

const Pharmacies: React.FC = () => {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([
    {
      pharmacyOutletId: 1,
      businessName: 'MediCare Pharmacy',
      email: 'info@medicare.com',
      phoneNumber: '+1234567890',
      city: 'New York',
      state: 'NY',
      isActive: true,
    },
    {
      pharmacyOutletId: 2,
      businessName: 'HealthPlus Pharmacy',
      email: 'contact@healthplus.com',
      phoneNumber: '+1987654321',
      city: 'Los Angeles',
      state: 'CA',
      isActive: true,
    },
    {
      pharmacyOutletId: 3,
      businessName: 'Wellness Drugs',
      email: 'info@wellnessdrugs.com',
      phoneNumber: '+1122334455',
      city: 'Chicago',
      state: 'IL',
      isActive: false,
    },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPharmacy, setCurrentPharmacy] = useState<Partial<Pharmacy> | null>(null)
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false)
  const [pharmacyToDelete, setPharmacyToDelete] = useState<number | null>(null)

  const handleAddPharmacy = () => {
    setCurrentPharmacy(null)
    setIsModalOpen(true)
  }

  const handleEditPharmacy = (pharmacy: Pharmacy) => {
    setCurrentPharmacy(pharmacy)
    setIsModalOpen(true)
  }

  const handleDeletePharmacy = (pharmacyOutletId: number) => {
    setPharmacyToDelete(pharmacyOutletId)
    setIsConfirmDeleteModalOpen(true)
  }

  const confirmDeletePharmacy = () => {
    if (pharmacyToDelete) {
      setPharmacies(
        pharmacies.map((pharmacy) =>
          pharmacy.pharmacyOutletId === pharmacyToDelete
            ? { ...pharmacy, isActive: false }
            : pharmacy
        )
      )
      setIsConfirmDeleteModalOpen(false)
      setPharmacyToDelete(null)
    }
  }

  const handleSubmitPharmacy = (pharmacyData: Partial<Pharmacy>) => {
    if (pharmacyData.pharmacyOutletId) {
      // Update existing pharmacy
      setPharmacies(
        pharmacies.map((pharmacy) =>
          pharmacy.pharmacyOutletId === pharmacyData.pharmacyOutletId
            ? { ...pharmacy, ...pharmacyData }
            : pharmacy
        )
      )
    } else {
      // Create new pharmacy
      const newPharmacy: Pharmacy = {
        pharmacyOutletId: Math.max(0, ...pharmacies.map((p) => p.pharmacyOutletId)) + 1,
        businessName: pharmacyData.businessName || '',
        email: pharmacyData.email || '',
        phoneNumber: pharmacyData.phoneNumber || '',
        city: pharmacyData.city || '',
        state: pharmacyData.state || '',
        isActive: pharmacyData.isActive || true,
      }
      setPharmacies([...pharmacies, newPharmacy])
    }
    setIsModalOpen(false)
  }

  const columns = [
    { header: 'Business Name', accessor: 'businessName' as keyof Pharmacy },
    { header: 'Email', accessor: 'email' as keyof Pharmacy },
    { header: 'Phone', accessor: 'phoneNumber' as keyof Pharmacy },
    { header: 'Location', accessor: (pharmacy: Pharmacy) => `${pharmacy.city}, ${pharmacy.state}` },
    {
      header: 'Status',
      accessor: (pharmacy: Pharmacy) => (
        <Badge variant={pharmacy.isActive ? 'success' : 'danger'}>
          {pharmacy.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      accessor: (pharmacy: Pharmacy) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditPharmacy(pharmacy)}
            className="flex items-center"
          >
            <Edit size={16} className="mr-1" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDeletePharmacy(pharmacy.pharmacyOutletId)}
            className="flex items-center"
          >
            <Trash2 size={16} className="mr-1" />
            Delete
          </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <Card>
        <div className="mb-6 flex items-center justify-between px-6">
          <h2 className="text-lg font-semibold">All Pharmacies</h2>
          <Button variant="secondary" onClick={handleAddPharmacy} className="flex items-center">
            <Plus size={16} className="mr-1" />
            Add Pharmacy
          </Button>
        </div>

        <Table
          columns={columns}
          data={pharmacies}
          keyExtractor={(pharmacy) => pharmacy.pharmacyOutletId.toString()}
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentPharmacy ? 'Edit Pharmacy' : 'Add New Pharmacy'}
      >
        <PharmacyForm
          initialData={currentPharmacy || {}}
          onSubmit={handleSubmitPharmacy}
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
          <p>Are you sure you want to deactivate this pharmacy? You can reactivate it later.</p>
        </div>
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={() => setIsConfirmDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={confirmDeletePharmacy}>
            Deactivate
          </Button>
        </div>
      </Modal>
    </>
  )
}

export default Pharmacies
