import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { ChartBarIcon, HomeIcon, ShieldCheckIcon, ShoppingCartIcon, UserIcon } from 'lucide-react'

const mainNavItems = [
  { name: 'Inventory', icon: HomeIcon, path: '/inventory' },
  { name: 'Analytics', icon: ChartBarIcon, path: '/analytics' },
  { name: 'Orders', icon: ShoppingCartIcon, path: '/orders' },
  { name: 'Blockchain', icon: ShieldCheckIcon, path: '/blockchain' },
]

const profileNavItems = [
  { name: 'Profile', icon: UserIcon, path: '/setting' },
  { name: 'Settings', icon: Cog6ToothIcon, path: '/settings' },
]

export { mainNavItems, profileNavItems }
