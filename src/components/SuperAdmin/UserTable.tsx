import { Edit, Trash2 } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import Badge from './Badge'
import Table from './Table'
import { IUser } from '@/types'

type Role = 'USER' | 'ADMIN' | 'SUPPLIER' | 'PHARMACY'
interface UserTableProps {
  users: IUser[]
  onEdit: (user: IUser) => void
  onDelete: (userId: string) => void
}

const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete }) => {
  const getRoleBadgeVariant = (role: Role) => {
    switch (role) {
      case 'ADMIN':
        return 'info'
      case 'SUPPLIER':
        return 'success'
      case 'PHARMACY':
        return 'warning'
      default:
        return 'info'
    }
  }

  const columns = [
    { header: 'Name', accessor: (user: IUser) => `${user.firstName} ${user.lastName}` },
    { header: 'Email', accessor: 'email' as keyof IUser },
    {
      header: 'Role',
      accessor: (user: IUser) => (
        <Badge variant={getRoleBadgeVariant(user?.role as Role)}>{user.role}</Badge>
      ),
    },
    {
      header: 'Status',
      accessor: (user: IUser) => (
        <Badge variant={user.isDeleted ? 'danger' : 'success'}>
          {user.isDeleted ? 'Deleted' : 'Active'}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      accessor: (user: IUser) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(user)}
            className="flex items-center"
          >
            <Edit size={16} />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(user.id)}
            className="flex items-center"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ]

  return <Table columns={columns} data={users} keyExtractor={(user) => user.id} />
}

export default UserTable
