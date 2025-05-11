import {
  useCreatePharmacyMutation,
  useDeletePharmacyMutation,
  useGetAllPharmaciesQuery,
  useUpdatePharmacyMutation,
} from '@/services/api'
import { IPharmacy } from '@/types'
import { PharmacyFormData } from '@/types/validations'
import { Edit, Plus, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import Modal from '../ui/Modal'
import Badge from './Badge'
import PharmacyForm from './PharmacyForm'
import Table from './Table'
import web3Service from '@/Contract/SupplyChainService'

const Pharmacies: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPharmacy, setCurrentPharmacy] = useState<Partial<IPharmacy> | null>(null)
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false)
  const [pharmacyToDelete, setPharmacyToDelete] = useState<string | null>(null)
  const [pharmacies, setPharmacies] = useState<IPharmacy[]>([])
  const [isBlockchainProcessing, setIsBlockchainProcessing] = useState(false)
  const [createPharmacy] = useCreatePharmacyMutation()
  const { data, isLoading } = useGetAllPharmaciesQuery()
  const [updatePharmacy] = useUpdatePharmacyMutation()
  const [deletePharmacy] = useDeletePharmacyMutation()

  const handleAddPharmacy = () => {
    setCurrentPharmacy(null)
    setIsModalOpen(true)
  }

  const handleEditPharmacy = (pharmacy: IPharmacy) => {
    setCurrentPharmacy(pharmacy)
    setIsModalOpen(true)
  }

  const handleDeletePharmacy = (pharmacyOutletId: string) => {
    setPharmacyToDelete(pharmacyOutletId)
    setIsConfirmDeleteModalOpen(true)
  }

  const confirmDeletePharmacy = async () => {
    if (pharmacyToDelete) {
      try {
        await deletePharmacy({ pharmacyOutletId: pharmacyToDelete }).unwrap()
        toast.success('Pharmacy deactivated successfully!')
      } catch (error) {
        console.error('Error deleting pharmacy:', error)
        toast.error('Failed to deactivate pharmacy. Please try again.')
      } finally {
        setIsConfirmDeleteModalOpen(false)
        setPharmacyToDelete(null)
      }
    }
  }

  useEffect(() => {
    if (data?.body.data) {
      setPharmacies(data?.body.data)
    }
  }, [data, isLoading])

  // Connect wallet on component mount
  useEffect(() => {
    const connectWallet = async () => {
      await web3Service.connectWallet()
    }
    connectWallet()
  }, [])

  const onSubmit = async (data: PharmacyFormData): Promise<void> => {
    try {
      if (currentPharmacy) {
        await updatePharmacy(data).unwrap()
        toast.success('Pharmacy updated successfully!')
        setIsModalOpen(false)
        return
      }

      // First create in backend
      setIsBlockchainProcessing(true)
      await createPharmacy(data).unwrap()

      toast.success('Pharmacy created successfully!')
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error creating pharmacy:', error)
      toast.error('Failed to create pharmacy. Please try again.')
    } finally {
      setIsBlockchainProcessing(false)
    }
  }

  const columns = [
    { header: 'Business Name', accessor: 'businessName' as keyof IPharmacy },
    { header: 'Email', accessor: 'email' as keyof IPharmacy },
    { header: 'Phone', accessor: 'phoneNumber' as keyof IPharmacy },
    {
      header: 'Location',
      accessor: (pharmacy: IPharmacy) => `${pharmacy.city}, ${pharmacy.state}`,
    },
    {
      header: 'Status',
      accessor: (pharmacy: IPharmacy) => (
        <Badge variant={pharmacy.isActive ? 'success' : 'danger'}>
          {pharmacy.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      accessor: (pharmacy: IPharmacy) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditPharmacy(pharmacy)}
            className="flex items-center"
          >
            <Edit size={16} />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDeletePharmacy(pharmacy.id)}
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
          <h2 className="text-lg font-semibold">All Pharmacies</h2>
          <Button variant="default" onClick={handleAddPharmacy} className="flex items-center">
            <Plus size={16} className="mr-1" />
            Add Pharmacy
          </Button>
        </div>

        <Table columns={columns} data={pharmacies} keyExtractor={(pharmacy) => pharmacy.id} />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentPharmacy ? 'Edit Pharmacy' : 'Add New Pharmacy'}
      >
        <PharmacyForm
          initialData={currentPharmacy || {}}
          onSubmit={onSubmit}
          onCancel={() => setIsModalOpen(false)}
          isSubmitting={isBlockchainProcessing}
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
            Delete
          </Button>
        </div>
      </Modal>
    </>
  )
}

export default Pharmacies
