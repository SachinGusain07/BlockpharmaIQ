/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plus } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import Modal from '../ui/Modal'
import UserForm from './UserForm'
import UserTable from './UserTable'
import {
  useGetAllUsersQuery,
  useRegisterMutation,
  useCompleteProfileMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from '@/services/api'
import { toast } from 'sonner'
import { IUser } from '@/types'
import web3Service from '@/Contract/SupplyChainService'

const Users: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<Partial<IUser> | null>(null)
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const { data: userData, refetch } = useGetAllUsersQuery()
  const [registerUser, { isLoading: isRegistering }] = useRegisterMutation()
  const [completeProfile, { isLoading: isCompletingProfile, isSuccess }] =
    useCompleteProfileMutation()
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation()
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation()

  const isLoading = isRegistering || isCompletingProfile || isUpdating || isDeleting

  const handleAddUser = () => {
    setCurrentUser(null)
    setIsCreating(true)
    setFormErrors({})
    setIsModalOpen(true)
  }

  const handleEditUser = (user: IUser) => {
    setCurrentUser(user)
    setIsCreating(false)
    setFormErrors({})
    setIsModalOpen(true)
  }

  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId)
    setIsConfirmDeleteModalOpen(true)
  }

  const confirmDeleteUser = async () => {
    if (userToDelete) {
      console.log(formErrors)
      try {
        await deleteUser(userToDelete).unwrap()
        toast.success('User deleted successfully')
        refetch()
      } catch (error: any) {
        console.error('Error deleting user:', error)
        toast.error(error?.data?.message || 'Failed to delete user')
      }
      setIsConfirmDeleteModalOpen(false)
      setUserToDelete(null)
    }
  }

  const handleSubmitUser = async (userData: Partial<IUser>, profileData?: FormData) => {
    setFormErrors({})

    console.log('Submitting user data:', userData)

    try {
      if (isCreating && profileData) {
        if (!userData.password) {
          setFormErrors((prev) => ({ ...prev, password: 'Password is required' }))
          return
        }

        if (!userData.walletAddress) {
          setFormErrors((prev) => ({ ...prev, walletAddress: 'Wallet address is required' }))
          return
        }

        // First register on blockchain
        try {
          const roleMap: Record<string, number> = {
            USER: 0,
            ADMIN: 1,
            SUPPLIER: 2,
            PHARMACY: 3,
          }

          const roleValue = roleMap[userData.role || 'USER']

          const isAdmin = await web3Service.isCurrentUserAdmin()
          if (!isAdmin) {
            throw new Error('Only admin can register users')
          }

          if (!userData.walletAddress) {
            throw new Error('Wallet address is required')
          }

          console.log('Registering user on blockchain:', userData.walletAddress, roleValue)
          await web3Service.registerUser(userData.walletAddress, roleValue)

          toast.success('User registered on blockchain successfully')
        } catch (blockchainError: unknown) {
          toast.error(
            blockchainError instanceof Error
              ? blockchainError.message
              : 'Blockchain registration failed'
          )
          console.error('Blockchain registration error:', blockchainError)
          throw new Error(
            `Blockchain registration failed: ${blockchainError instanceof Error ? blockchainError.message : 'Unknown error'}`
          )
        }

        const registerData = {
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          password: userData.password || '',
          confirmPassword: userData.password || '',
          role: userData.role || 'USER',
          walletAddress: userData.walletAddress || '',
          phoneNumber: userData.phoneNumber || '',
          active: userData.isDeleted !== undefined ? userData.isDeleted : true,
        }

        const user = await registerUser(registerData).unwrap()
        profileData.append('userId', user.body?.data.id)
        await completeProfile(profileData).unwrap()

        toast.success('User created and profile completed successfully')
      } else if (currentUser?.id) {
        await updateUser({
          id: currentUser.id,
          ...userData,
        }).unwrap()

        toast.success('User updated successfully')
      }

      refetch()
      setIsModalOpen(false)
    } catch (error: any) {
      console.error('Error submitting user:', error)

      if (error?.data?.errors) {
        const apiErrors: Record<string, string> = {}

        error.data.errors.forEach((err: { field: string; message: string }) => {
          apiErrors[err.field] = err.message
        })

        setFormErrors(apiErrors)
      } else {
        toast.error(error?.data?.message || 'An error occurred while saving user data')
      }
    }
  }

  return (
    <>
      <Card>
        <div className="mb-6 flex items-center justify-between px-6">
          <h2 className="text-lg font-semibold">All Users</h2>
          <Button
            variant="default"
            onClick={handleAddUser}
            className="flex items-center"
            disabled={isLoading}
          >
            <Plus size={16} className="mr-1" />
            Add User
          </Button>
        </div>

        <UserTable
          users={userData?.body?.data || []}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />
      </Card>

      <Modal
        size="md"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentUser ? 'Edit User' : 'Add New User'}
      >
        <UserForm
          initialData={{
            ...currentUser,
            role: typeof currentUser?.role === 'string' ? currentUser.role : undefined,
          }}
          isSuccess={isSuccess}
          onSubmit={handleSubmitUser}
          onCancel={() => setIsModalOpen(false)}
          isCreating={isCreating}
        />
      </Modal>

      <Modal
        isOpen={isConfirmDeleteModalOpen}
        onClose={() => setIsConfirmDeleteModalOpen(false)}
        title="Confirm Delete"
        size="sm"
      >
        <div className="mb-6">
          <p>Are you sure you want to delete this user? This action can't be undone.</p>
        </div>
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={() => setIsConfirmDeleteModalOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button variant="destructive" onClick={confirmDeleteUser} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </Modal>
    </>
  )
}

export default Users
