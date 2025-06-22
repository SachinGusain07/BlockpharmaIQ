import {
  BuildingStorefrontIcon,
  ClipboardDocumentListIcon,
  CogIcon,
  CubeIcon,
  HomeIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  TruckIcon,
  UserCircleIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'

export const adminNavItems = [
  {
    name: 'Dashboard',
    path: '/admin-dashboard',
    icon: HomeIcon,
  },
  {
    name: 'Users',
    path: '/users',
    icon: UsersIcon,
  },
  {
    name: 'Pharmacies',
    path: '/pharmacies',
    icon: BuildingStorefrontIcon,
  },
  {
    name: 'Suppliers',
    path: '/suppliers',
    icon: TruckIcon,
  },
]

export const supplierNavItems = [
  {
    name: 'Dashboard',
    path: '/supplier-dashboard',
    icon: HomeIcon,
  },
  {
    name: 'Orders',
    path: '/pending-orders',
    icon: ClipboardDocumentListIcon,
  },
  {
    name: 'Setting',
    path: '/supplier-settings',
    icon: ShoppingBagIcon,
  },
]

export const pharmacyNavItems = [
  {
    name: 'Inventory',
    path: '/pharmacy-dashboard',
    icon: CubeIcon,
  },
  {
    name: 'Orders',
    path: '/orders',
    icon: ShoppingBagIcon,
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: CogIcon,
  },
]

export const profileNavItems = [
  {
    name: 'Profile',
    path: '/setting',
    icon: UserCircleIcon,
  },
  {
    name: 'Account',
    path: '/setting/account',
    icon: UserCircleIcon,
  },
  {
    name: 'Password',
    path: '/setting/password',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Update Profile',
    path: '/setting/update',
    icon: UserCircleIcon,
  },
]
