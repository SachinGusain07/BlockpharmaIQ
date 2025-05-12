import { OrderStatus } from '@/types'
import { CheckIcon, ClockIcon, FilterIcon, XIcon } from 'lucide-react'

const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case 'PENDING':
      return 'bg-amber-100 text-amber-800'
    case 'IN_PROGRESS':
      return 'bg-yellow-100 text-yellow-800'
    case 'DELIVERED':
      return 'bg-green-100 text-green-800'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Get status icon
const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case 'PENDING':
      return ClockIcon
    case 'IN_PROGRESS':
      return FilterIcon
    case 'DELIVERED':
      return CheckIcon
    case 'CANCELLED':
      return XIcon
    default:
      return ClockIcon
  }
}

const statusToNumber = (status: OrderStatus): number => {
  switch (status) {
    case 'PENDING':
      return 0
    case 'IN_PROGRESS':
      return 1
    case 'DELIVERED':
      return 2
    case 'CANCELLED':
      return 3
    default:
      throw new Error(`Invalid order status: ${status}`)
  }
}

export { getStatusBadge, getStatusIcon, statusToNumber }
