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

const Users: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<Partial<IUser> | null>(null)
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const { data: userData, refetch } = useGetAllUsersQuery()
  const [registerUser, { isLoading: isRegistering }] = useRegisterMutation()
  const [completeProfile, { isLoading: isCompletingProfile }] = useCompleteProfileMutation()
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

    try {
      if (isCreating && profileData) {
        if (!userData.password) {
          setFormErrors((prev) => ({ ...prev, password: 'Password is required' }))
          return
        }

        const registerData = {
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          password: userData.password || '',
          confirmPassword: userData.password || '',
          role: userData.role || '',
          phoneNumber: userData.phoneNumber || '',
          active: userData.active !== undefined ? userData.active : true,
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
